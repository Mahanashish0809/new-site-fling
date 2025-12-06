# scraper.py
import asyncio
import requests
import re
import json
from datetime import datetime, timedelta
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

        # 1. Ensure job_id exists
        job_id = job.get("job_id")
        if not job_id:
            key = job.get("url") or job.get("title") or json.dumps(job)
            job_id = make_job_id("fallback", key)
            job["job_id"] = job_id

        # 2. Convert timestamps into TIMESTAMPTZ
        ts_raw = job.get("posted_on") or job.get("updated_at")
        if ts_raw:
            try:
                updated_at = datetime.fromisoformat(ts_raw.replace("Z", "+00:00"))
            except:
                updated_at = datetime.utcnow()
        else:
            updated_at = datetime.utcnow()

        company = job.get("company_name", "Unknown")
        title = job.get("title")
        location = job.get("location", "N/A")
        job_url = job.get("url")
        raw_json = json.dumps(job)

        try:
            cur.execute(query, (
                job_id, company, title, location, job_url, updated_at, raw_json
            ))
            saved += 1

        except Exception as e:
            print("DB Error:", e)
            print("Failed Job:", job)
            conn.rollback()
            continue

    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ Saved {saved} jobs to AWS PostgreSQL.")



# -----------------------------------------------------------
# WORKDAY NETWORK INTERCEPT SCRAPER
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
                        print(f"📡 Intercepted {len(posts)} Workday jobs")
                        job_posts.extend(posts)
                except:
                    pass

        page.on("response", lambda r: asyncio.create_task(capture(r)))

        await page.goto(url, timeout=120000)
        await page.wait_for_load_state("networkidle")

        # scroll to trigger all API loads
        for _ in range(40):
            await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
            await page.wait_for_timeout(200)

        await browser.close()

    print(f"📌 TOTAL RAW WORKDAY JOBS: {len(job_posts)}")

    final = []

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
        job_url = f"https://{host}{path}"

        job_id = make_job_id("workday", path)

        final.append({
            "job_id": job_id,
            "company_name": host.split('.')[0],
            "title": job.get("title"),
            "location": job.get("locationsText", "N/A"),
            "posted_on": posted,
            "url": job_url,
            "raw": job,
        })

    print(f"🎉 WORKDAY JOBS LAST 24H: {len(final)}")
    return final



# -----------------------------------------------------------
# Detect ATS
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
# Extract based on ATS
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
# UNIVERSAL ADVANCED PLAYWRIGHT SCRAPER
# -----------------------------------------------------------
async def playwright_scrape_universal(url):
    print("🌐 Using UNIVERSAL PLAYWRIGHT SCRAPER...")

    extracted = []
    network_jobs = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context()
        page = await ctx.new_page()

        # Capture JSON responses
        async def capture(resp):
            try:
                if "job" in resp.url.lower() or "career" in resp.url.lower():
                    data = await resp.json()
                    if isinstance(data, dict):
                        for k, v in data.items():
                            if isinstance(v, list) and len(v) > 0:
                                if isinstance(v[0], dict):
                                    print(f"📡 Network jobs from {resp.url}")
                                    network_jobs.extend(v)
            except:
                pass

        page.on("response", lambda r: asyncio.create_task(capture(r)))

        await page.goto(url, timeout=120000)
        await page.wait_for_load_state("networkidle")

        # Scroll deeply
        for _ in range(60):
            await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
            await page.wait_for_timeout(200)

        # Extract HTML DOM jobs
        try:
            html = await page.content()
            extracted = extract_by_platform("universal", html, url)
        except Exception as e:
            print("DOM Extraction Error:", e)

        await browser.close()

    final = []

    # Add DOM extracted jobs
    for job in extracted:
        job["job_id"] = make_job_id("dom", job["url"])
        final.append(job)

    # Add network JSON jobs
    for job in network_jobs:
        job_id = job.get("id") or make_job_id("net", json.dumps(job))
        final.append({
            "job_id": job_id,
            "title": job.get("title") or "Unknown",
            "url": job.get("url") or url,
            "company_name": job.get("company") or "Unknown",
            "location": job.get("location", "N/A"),
            "posted_on": job.get("updated_at") or datetime.utcnow().isoformat(),
            "raw": job
        })

    print(f"🎉 UNIVERSAL SCRAPER TOTAL JOBS: {len(final)}")
    return final



# -----------------------------------------------------------
# MAIN SCRAPER ENTRY
# -----------------------------------------------------------
async def scrape_url(url: str):
    platform = detect_platform(url)
    print(f"[SCRAPER] Platform = {platform}")

    jobs = []

    # -------- WORKDAY --------
    if platform == "workday":
        jobs = await scrape_workday_api(url)
        save_jobs_to_db(jobs)
        return jobs

    # -------- STATIC HTML --------
    try:
        html = requests.get(url, timeout=15).text
        jobs = extract_by_platform(platform, html, url) or []
    except Exception as e:
        print("Static scrape error:", e)
        jobs = []

    # -------- UNIVERSAL PLAYWRIGHT FALLBACK --------
    if not jobs:
        try:
            jobs = await playwright_scrape_universal(url)
        except Exception as e:
            print("Universal Playwright error:", e)
            jobs = []

    # Save everything
    save_jobs_to_db(jobs)

    return jobs
