# scraper.py
import asyncio
from playwright.async_api import async_playwright
import requests
import json
import re

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
#                 WORKDAY — FULL API SCRAPER (SESSION + COOKIES)
# =====================================================================
async def scrape_workday_api(url):
    print("Using Workday API (Network Response Mode)...")

    parts = url.split("/")
    host = parts[2]
    site = parts[-1]

    tenant = None
    jobs = []

    # -------------------------------------------------
    # STEP 1 — Run Playwright + intercept jobPostings
    # -------------------------------------------------
async def scrape_workday_api(url):
    print("Using Workday API (Network Response Mode)...")

    parts = url.split("/")
    host = parts[2]
    site = parts[-1]

    tenant = None
    jobs = []

    # -------------------------------------------------
    # STEP 1 — Intercept API responses (with async handling)
    # -------------------------------------------------
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        async def handle_response(response):
            nonlocal tenant, jobs
            
            req_url = response.url

            # Detect tenant from URL
            if "/wday/cxs/" in req_url:
                match = re.search(r"/wday/cxs/([^/]+)/", req_url)
                if match:
                    tenant = match.group(1)

            # Capture actual jobPostings JSON
            if req_url.endswith("/jobs"):
                print(f"📡 Job API response intercepted: {req_url}")

                try:
                    data = await response.json()
                    postings = data.get("jobPostings", [])
                    if postings:
                        print(f"🔥 Captured {len(postings)} jobs from Workday")
                        jobs.extend(postings)
                except Exception as e:
                    print("JSON parse error:", e)

        page.on("response", lambda res: asyncio.create_task(handle_response(res)))

        await page.goto(url, timeout=60000)
        await page.wait_for_load_state("networkidle")

        await browser.close()

    # -------------------------------------------------
    # STEP 2 — Convert raw postings to proper format
    # -------------------------------------------------
    final_jobs = []

    for job in jobs:
        final_jobs.append({
            "title": job.get("title"),
            "url": f"https://{host}{job.get('externalPath')}",
            "posted_on": job.get("postedOn")
        })

    print(f"TOTAL JOBS FOUND: {len(final_jobs)}")
    return final_jobs


# =====================================================================
#                   PLATFORM DETECTOR (ATS IDENTIFIER)
# =====================================================================
def detect_platform(url):
    url = url.lower()

    if "myworkdayjobs" in url:
        return "workday"
    if "greenhouse.io" in url:
        return "greenhouse"
    if "jobs.lever.co" in url:
        return "lever"
    if "oraclecloud" in url:
        return "oracle"
    if "successfactors" in url:
        return "successfactors"
    if "icims" in url:
        return "icims"
    if "smartrecruiters" in url:
        return "smartrecruiters"
    if "workable" in url:
        return "workable"

    return "universal"



# =====================================================================
#                 ROUTER — NON-WORKDAY HTML SCRAPERS
# =====================================================================
def extract_by_platform(platform, html, url):
    if platform == "greenhouse":
        return extract_greenhouse_jobs(html, url)
    if platform == "lever":
        return extract_lever_jobs(html, url)
    if platform == "oracle":
        return extract_oracle_jobs(html, url)
    if platform == "successfactors":
        return extract_successfactors_jobs(html, url)
    if platform == "icims":
        return extract_icims_jobs(html, url)
    if platform == "smartrecruiters":
        return extract_smartrecruiters_jobs(html, url)
    if platform == "workable":
        return extract_workable_jobs(html, url)

    return universal_extract(html, url)



# =====================================================================
#                 MASTER UNIVERSAL SCRAPER (USED BY run_all.py)
# =====================================================================
async def scrape_url(url):
    platform = detect_platform(url)

    # Workday → use the API scraper
    if platform == "workday":
        return await scrape_workday_api(url)

    # Static HTML scraping
    try:
        html = requests.get(url, timeout=15).text
        jobs = extract_by_platform(platform, html, url)
        if jobs:
            return jobs
    except Exception as e:
        print("Static scrape failed:", e)

    # JS-enabled scraping using Playwright
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, timeout=60000)
            await page.wait_for_load_state("networkidle")
            content = await page.content()
            await browser.close()

            return extract_by_platform(platform, content, url)

    except Exception as e:
        print("Playwright error:", e)
        return []

    return []
