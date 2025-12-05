# scraper.py
import asyncio
import requests
import re
from playwright.async_api import async_playwright
from datetime import datetime, date
import json

# --- DB Connection ---
from db import get_db_connection

# --- Extractors ---
from extractors import (
    extract_greenhouse_jobs,
    extract_lever_jobs,
    extract_oracle_jobs,
    extract_successfactors_jobs,
    extract_icims_jobs,
    extract_smartrecruiters_jobs,
    extract_workable_jobs,
    extract_generic_jobs
)

from universal_extractor import universal_extract


# =====================================================================
# DATABASE SAVE FUNCTION (WORKDAY + GREENHOUSE + ALL ATS)
# =====================================================================
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
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (job_id) DO UPDATE SET
            updated_at = EXCLUDED.updated_at,
            raw_data = EXCLUDED.raw_data;
    """

    for job in job_list:
        job_id = job.get("job_id") or job.get("id")
        company = job.get("company_name", "Unknown")
        title = job.get("title")
        location = job.get("location", "N/A")
        job_url = job.get("url")
        updated_at = job.get("posted_on") or job.get("updated_at")
        raw_json = json.dumps(job)

        try:
            cur.execute(query, (
                job_id, company, title, location, job_url, updated_at, raw_json
            ))
        except Exception as e:
            print("DB Insert Error:", e)
            continue

    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ Saved {len(job_list)} jobs to AWS PostgreSQL.")


# =====================================================================
#   WORKDAY SCRAPER — ONLY "POSTED TODAY"
# =====================================================================
async def scrape_workday_api(url):
    print("Using Workday DETAIL-PAGE scraper (FINAL)...")

    parts = url.split("/")
    host = parts[2]

    job_urls = []
    today_jobs = []

    # ------------------------------------------------------
    # STEP 1 — Get all job detail URLs (scrolling page)
    # ------------------------------------------------------
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("➡ Opening Workday job listing page...")
        await page.goto(url, timeout=60000)
        await page.wait_for_load_state("networkidle")

        # Scroll to load more
        print("➡ Scrolling...")
        for _ in range(40):
            await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
            await page.wait_for_timeout(300)

        print("➡ Extracting job URLs from DOM...")

        hrefs = await page.eval_on_selector_all(
            "a[href*='/job/']",
            "els => els.map(e => e.getAttribute('href'))"
        )

        await browser.close()

    # Convert relative → absolute
    for h in hrefs:
        if h.startswith("/"):
            full = f"https://{host}{h}"
        else:
            full = h

        if full not in job_urls:
            job_urls.append(full)

    print(f"📌 Total Workday job URLs found: {len(job_urls)}")

    # ------------------------------------------------------
    # STEP 2 — Visit each job page and detect posted date
    # ------------------------------------------------------
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()

        for job_url in job_urls:
            page = await context.new_page()
            await page.goto(job_url, timeout=60000)
            await page.wait_for_load_state("networkidle")

            text = await page.inner_text("body")

            match = re.search(r"Posted[: ]+([A-Za-z0-9 ,]+)", text)
            if not match:
                await page.close()
                continue

            posted_value = match.group(1).lower().strip()

            # Keyword check
            quick_terms = ["today", "just posted", "hour", "minutes"]
            if any(k in posted_value for k in quick_terms):
                today_jobs.append({
                    "job_id": hash(job_url),
                    "company_name": host.split(".")[0],
                    "title": await page.title(),
                    "url": job_url,
                    "posted_on": posted_value
                })
                await page.close()
                continue

            # Exact date check
            try:
                dt = datetime.strptime(posted_value, "%B %d, %Y").date()
                if dt == date.today():
                    today_jobs.append({
                        "job_id": hash(job_url),
                        "company_name": host.split(".")[0],
                        "title": await page.title(),
                        "url": job_url,
                        "posted_on": posted_value
                    })
            except:
                pass

            await page.close()

        await browser.close()

    print(f"🎉 TODAY'S WORKDAY JOBS: {len(today_jobs)}")
    return today_jobs


# =====================================================================
# DETECT ATS PLATFORM
# =====================================================================
def detect_platform(url):
    url = url.lower()

    if "myworkdayjobs" in url: return "workday"
    if "greenhouse.io" in url: return "greenhouse"
    if "jobs.lever.co" in url: return "lever"
    if "oraclecloud" in url: return "oracle"
    if "successfactors" in url: return "successfactors"
    if "icims" in url: return "icims"
    if "smartrecruiters" in url: return "smartrecruiters"
    if "workable" in url: return "workable"

    return "universal"


# =====================================================================
# SCRAPER ROUTER FOR NON-WORKDAY SITES
# =====================================================================
def extract_by_platform(platform, html, url):
    if platform == "greenhouse": return extract_greenhouse_jobs(html, url)
    if platform == "lever": return extract_lever_jobs(html, url)
    if platform == "oracle": return extract_oracle_jobs(html, url)
    if platform == "successfactors": return extract_successfactors_jobs(html, url)
    if platform == "icims": return extract_icims_jobs(html, url)
    if platform == "smartrecruiters": return extract_smartrecruiters_jobs(html, url)
    if platform == "workable": return extract_workable_jobs(html, url)

    return universal_extract(html, url)


# =====================================================================
# UNIVERSAL SCRAPER ENTRY POINT
# =====================================================================
async def scrape_url(url):
    platform = detect_platform(url)

    # WORKDAY
    if platform == "workday":
        jobs = await scrape_workday_api(url)
        save_jobs_to_db(jobs)
        return jobs

    # STATIC HTML SCRAPE
    try:
        html = requests.get(url, timeout=15).text
        jobs = extract_by_platform(platform, html, url)
        if jobs:
            save_jobs_to_db(jobs)
            return jobs
    except:
        pass

    # PLAYWRIGHT SCRAPE
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            await page.goto(url, timeout=60000)
            await page.wait_for_load_state("networkidle")

            html = await page.content()
            await browser.close()

            jobs = extract_by_platform(platform, html, url)
            save_jobs_to_db(jobs)
            return jobs

    except:
        return []

    return []
if __name__ == "__main__":
    companies_to_scrape = [
        "coinbase", "stripe", "notion", "airbnb", "uber", "lyft", 
        "figma", "plaid", "brex", "canva"
    ]
    
    all_jobs = []
    
    print("--- Starting Job Fetch ---")
    for company in companies_to_scrape:
        print(f"Fetching jobs for: {company}...")
        jobs = fetch_greenhouse_jobs(company)
        if jobs:
            all_jobs.extend(jobs)
    print("--- Job Fetch Complete ---\n")
    
    all_jobs.sort(key=lambda x: x.get('updated_at', ''), reverse=True)

    display_jobs(all_jobs, limit=10)

    save_jobs_to_db(all_jobs)   # <-- ADD THIS HERE
    display_jobs(all_jobs, limit=10)