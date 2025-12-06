# scraper.py
import asyncio
import requests
import re
import json
from datetime import datetime, date, timedelta
from hashlib import md5
from playwright.async_api import async_playwright

from db import get_db_connection
from extractors import (
    extract_greenhouse_jobs,
    extract_lever_jobs,
    extract_oracle_jobs,
    extract_successfactors_jobs,
    extract_icims_jobs,
    extract_smartrecruiters_jobs,
    extract_workable_jobs,
)
from universal_extractor import universal_extract


# -----------------------------------------------------------
# Helper: deterministic job ID
# -----------------------------------------------------------
def make_job_id(source: str, key: str) -> int:
    raw = f"{source}:{key}"
    return int(md5(raw.encode()).hexdigest()[:12], 16)


# -----------------------------------------------------------
# Save jobs to PostgreSQL
# -----------------------------------------------------------
def save_jobs_to_db(job_list):
    if not job_list:
        print("⚠ No jobs to save")
        return

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
        INSERT INTO greenhouse_jobs (
            job_id, company_name, title, location, job_url, updated_at, raw_data
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (job_id) DO UPDATE SET
            updated_at = EXCLUDED.updated_at,
            raw_data   = EXCLUDED.raw_data;
    """

    saved = 0

    for job in job_list:
        # -------------------------------
        # FIX: Ensure every job has job_id
        # -------------------------------
        job_id = job.get("job_id")

        if not job_id:
            # fallback: stable hash using (url or title)
            key = job.get("url") or job.get("title") or str(job)
            job_id = make_job_id("fallback", key)

        company = job.get("company_name", "Unknown")
        title = job.get("title")
        location = job.get("location", "N/A")
        job_url = job.get("url")
        updated_at = job.get("posted_on") or job.get("updated_at")
        raw_json = json.dumps(job)

        try:
            cur.execute(
                query,
                (job_id, company, title, location, job_url, updated_at, raw_json),
            )
            saved += 1

        except Exception as e:
            print("DB Error:", e)
            print("Failed Job:", job)
            continue

    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ Saved {saved} jobs to AWS PostgreSQL.")

# -----------------------------------------------------------
# WORKDAY NETWORK INTERCEPT (last 24h)
# -----------------------------------------------------------
async def scrape_workday_api(url: str):
    print("Using Workday NETWORK INTERCEPT scraper (last 24h)...")

    parts = url.split("/")
    host = parts[2]

    job_posts = []
    now = datetime.utcnow()
    last24 = now - timedelta(hours=24)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context()
        page = await ctx.new_page()

        async def capture(resp):
            if "/jobPostings" in resp.url or resp.url.endswith("/jobs"):
                try:
                    data = await resp.json()
                    posts = data.get("jobPostings", [])
                    if posts:
                        print(f"📡 Intercepted {len(posts)} jobs from API")
                        job_posts.extend(posts)
                except:
                    pass

        page.on("response", lambda r: asyncio.create_task(capture(r)))

        await page.goto(url, timeout=60000)
        await page.wait_for_load_state("networkidle")

        for _ in range(30):
            await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
            await page.wait_for_timeout(200)

        await browser.close()

    print(f"📌 TOTAL RAW API JOBS COLLECTED: {len(job_posts)}")

    final_jobs = []

    for job in job_posts:
        posted = job.get("postedOn")
        if not posted:
            continue

        try:
            dt = datetime.fromisoformat(posted.replace("Z", "+00:00"))
        except:
            continue

        if dt < last24:
            continue

        path = job.get("externalPath", "")
        url_full = f"https://{host}{path}"
        job_id = make_job_id("workday", path)

        final_jobs.append({
            "job_id": job_id,
            "company_name": host.split(".")[0],
            "title": job.get("title"),
            "location": job.get("locationsText", "N/A"),
            "posted_on": posted,
            "url": url_full,
            "raw": job
        })

    print(f"🎉 WORKDAY JOBS LAST 24H: {len(final_jobs)}")
    return final_jobs


# -----------------------------------------------------------
# Detect platform
# -----------------------------------------------------------
def detect_platform(url):
    u = url.lower()
    if "myworkdayjobs" in u: return "workday"
    if "greenhouse" in u: return "greenhouse"
    if "lever.co" in u: return "lever"
    if "oraclecloud" in u: return "oracle"
    if "successfactors" in u: return "successfactors"
    if "icims" in u: return "icims"
    if "smartrecruiters" in u: return "smartrecruiters"
    if "workable" in u: return "workable"
    return "universal"


# -----------------------------------------------------------
# Extract by ATS type
# -----------------------------------------------------------
def extract_by_platform(platform, html, url):
    try:
        if platform == "greenhouse": return extract_greenhouse_jobs(html, url)
        if platform == "lever": return extract_lever_jobs(html, url)
        if platform == "oracle": return extract_oracle_jobs(html, url)
        if platform == "successfactors": return extract_successfactors_jobs(html, url)
        if platform == "icims": return extract_icims_jobs(html, url)
        if platform == "smartrecruiters": return extract_smartrecruiters_jobs(html, url)
        if platform == "workable": return extract_workable_jobs(html, url)
        return universal_extract(html, url)
    except Exception as e:
        print("Extractor error:", e)
        return []


# -----------------------------------------------------------
# UNIVERSAL SCRAPER ENTRY (NEVER RETURNS None)
# -----------------------------------------------------------
async def scrape_url(url: str):
    platform = detect_platform(url)
    print(f"[SCRAPER] Platform = {platform}")

    # ----------- WORKDAY -----------
    if platform == "workday":
        jobs = await scrape_workday_api(url)
        save_jobs_to_db(jobs)
        return jobs

    # ----------- STATIC HTML ----------
    jobs = []
    try:
        html = requests.get(url, timeout=15).text
        jobs = extract_by_platform(platform, html, url)
        if jobs is None:
            jobs = []
    except Exception as e:
        print("Static error:", e)

    # ----------- PLAYWRIGHT FALLBACK ----------
    if not jobs:
        try:
            async with async_playwright() as p:
                br = await p.chromium.launch(headless=True)
                pg = await br.new_page()
                await pg.goto(url, timeout=60000)
                await pg.wait_for_load_state("networkidle")
                html = await pg.content()
                await br.close()
                jobs = extract_by_platform(platform, html, url)
                if jobs is None:
                    jobs = []
        except Exception as e:
            print("Playwright error:", e)
            jobs = []

    # -------- SAVE --------
    save_jobs_to_db(jobs)

    return jobs  # ALWAYS A LIST
