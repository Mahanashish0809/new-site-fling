# scraper.py
import asyncio
import requests
import re
import json
from playwright.async_api import async_playwright
from datetime import datetime, date, timedelta
from urllib.parse import urlparse, urljoin
from hashlib import md5
from db import get_db_connection
from collections.abc import Mapping
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
# KEYWORD FILTERS
# -----------------------------------------------------------

SWE_KEYWORDS = [
    "software engineer", "software developer", "backend", "front end", "frontend",
    "full stack", "full-stack", "platform engineer", "systems engineer",
    "infrastructure engineer", "cloud engineer", "site reliability", "sre",
    "devops", "api engineer", "mobile engineer", "ios engineer", "android engineer",
    "distributed systems", "embedded software", "gameplay engineer",
]

DATA_ANALYST_KEYWORDS = [
    "data analyst", "business analyst", "bi analyst",
    "reporting analyst", "analytics specialist",
    "operations analyst", "quantitative analyst",
]

ML_AI_KEYWORDS = [
    "machine learning engineer", "ml engineer", "applied scientist",
    "data scientist", "research scientist", "ai engineer",
    "deep learning", "nlp", "computer vision",
    "generative ai", "llm", "large language model",
    "ml ops", "mlops",
]

ALL_KEYWORDS = SWE_KEYWORDS + DATA_ANALYST_KEYWORDS + ML_AI_KEYWORDS


def title_matches(title: str) -> bool:
    """
    Returns True if job title contains ANY ML/AI/SWE/Data keywords.
    Case-insensitive.
    """
    if not title:
        return False
    t = title.lower()
    return any(keyword in t for keyword in ALL_KEYWORDS)


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
        print("No jobs to save")
        return

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
        INSERT INTO greenhouse_jobs (
            job_id, company_name, title, location, job_url, updated_at, raw_data, description
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (job_id) DO UPDATE SET
            company_name = EXCLUDED.company_name,
            title        = EXCLUDED.title,
            location     = EXCLUDED.location,
            job_url      = EXCLUDED.job_url,
            updated_at   = EXCLUDED.updated_at,
            raw_data     = EXCLUDED.raw_data,
            description  = EXCLUDED.description;
    """

    saved = 0
    for job in job_list:
        # 1. job_id
        job_id = job.get("job_id")
        if not job_id:
            key = job.get("url") or job.get("title") or json.dumps(job, sort_keys=True)
            job_id = make_job_id("fallback", key)
            job["job_id"] = job_id

        # 2. timestamps
        ts_raw = job.get("posted_on") or job.get("updated_at")
        if ts_raw:
            try:
                updated_at = datetime.fromisoformat(str(ts_raw).replace("Z", "+00:00"))
            except Exception:
                updated_at = datetime.utcnow()
        else:
            updated_at = datetime.utcnow()

        company = job.get("company_name", "Unknown")
        title = job.get("title")
        location = job.get("location", "N/A")
        job_url = job.get("url")
        description = job.get("description") or "No description provided."
        raw_json = json.dumps(job, default=str)

        try:
            cur.execute(
                query,
                (
                    job_id,
                    company,
                    title,
                    location,
                    job_url,
                    updated_at,
                    raw_json,
                    description,
                ),
            )
            saved += 1
        except Exception as e:
            print("DB error:", e)
            print("Failed job:", job)
            conn.rollback()
            continue

    conn.commit()
    cur.close()
    conn.close()
    print(f"Saved {saved} jobs to AWS Postgresql")


# -----------------------------------------------------------
# Detect ATS
# -----------------------------------------------------------

def detect_platform(url):
    u = url.lower()
    if "myworkdayjobs" in u:
        return "workday"
    if "greenhouse" in u:
        return "greenhouse"
    if "lever.co" in u:
        return "lever"
    if "oraclecloud" in u:
        return "oracle"
    if "successfactors" in u:
        return "successfactors"
    if "icims" in u:
        return "icims"
    if "smartrecruiters" in u:
        return "smartrecruiters"
    if "workable" in u:
        return "workable"
    return "universal"


def get_base_url(url: str) -> str:
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"


# -----------------------------------------------------------
# Extract based on ATS
# -----------------------------------------------------------

def extract_by_platform(platform, html, url):
    base_url = get_base_url(url)
    try:
        if platform == "greenhouse":
            return extract_greenhouse_jobs(html, base_url)
        if platform == "lever":
            return extract_lever_jobs(html, base_url)
        if platform == "oracle":
            return extract_oracle_jobs(html, base_url)
        if platform == "successfactors":
            return extract_successfactors_jobs(html, base_url)
        if platform == "icims":
            return extract_icims_jobs(html, base_url)
        if platform == "smartrecruiters":
            return extract_smartrecruiters_jobs(html, base_url)
        if platform == "workable":
            return extract_workable_jobs(html, base_url)
        return universal_extract(html, base_url)
    except Exception as e:
        print("Extractor error:", e)
        return []


# -----------------------------------------------------------
# WORKDAY NETWORK INTERCEPT SCRAPER
# -----------------------------------------------------------

async def scrape_workday_api(url: str):
    print("Using Workday NETWORK INTERCEPT scraper (last 24h)...")

    parts = url.split("/")
    host = parts[2]

    job_posts = []
    last24 = datetime.utcnow() - timedelta(hours=24)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        async def capture(resp):
            if "/jobPostings" in resp.url or resp.url.endswith("/jobs"):
                try:
                    data = await resp.json()
                    posts = data.get("jobPostings", [])
                    if posts:
                        print(f"Intercepted {len(posts)} Workday jobs")
                        job_posts.extend(posts)
                except Exception:
                    pass

        page.on("response", lambda r: asyncio.create_task(capture(r)))

        await page.goto(url, timeout=120000)
        await page.wait_for_load_state("networkidle")

        # Scroll to load more
        print("➡ Scrolling...")
        for _ in range(40):
            await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
            await page.wait_for_timeout(300)

        await browser.close()

    print(f"TOTAL RAW WORKDAY JOBS: {len(job_posts)}")

    final = []
    for job in job_posts:
        posted = job.get("postedOn")
        if not posted:
            continue

        try:
            dt = datetime.fromisoformat(posted.replace("Z", "+00:00"))
        except Exception:
            continue

        if dt < last24:
            continue

        title = job.get("title") or ""
        if not title_matches(title):
            continue  # filter by keywords

        path = job.get("externalPath", "")
        job_url = f"https://{host}{path}"

        job_id = make_job_id("workday", path)

        final.append(
            {
                "job_id": job_id,
                "company_name": host.split(".")[0],
                "title": title,
                "location": job.get("locationsText", "N/A"),
                "posted_on": posted,
                "url": job_url,
                "raw": job,
            }
        )

    print(f"WORKDAY JOBS LAST 24H (filtered): {len(final)}")
    return final


# -----------------------------------------------------------
# Merge list job and details job
# -----------------------------------------------------------

def merge_job(job: dict, details: dict) -> dict:
    merged = job.copy()
    for k, v in details.items():
        if v is None:
            continue
        if isinstance(v, str) and not v.strip():
            continue
        if str(v).strip() in {
            "Jobs",
            "Careers",
            "N/A",
            "Unknown",
            "No description provided.",
        }:
            continue
        merged[k] = v
    return merged


# -----------------------------------------------------------
# MAIN SCRAPER ENTRY
# -----------------------------------------------------------

async def scrape_url(url: str):
    platform = detect_platform(url)
    print(f"[SCRAPER] Platform = {platform}")
    print(f"URL: {url}")

    # WORKDAY
    if platform == "workday":
        jobs = await scrape_workday_api(url)
        save_jobs_to_db(jobs)
        return jobs

    # STATIC HTML SCRAPE
    jobs = []
    try:
        html = requests.get(url, timeout=15).text
        jobs = extract_by_platform(platform, html, url) or []
        # Filter by title keywords here too
        jobs = [j for j in jobs if title_matches(j.get("title", ""))]
    except Exception as e:
        print("Static scrape error:", e)
        jobs = []

    # If no jobs from static, try PLAYWRIGHT SCRAPE
    if not jobs:
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                await page.goto(url, timeout=60000)
                await page.wait_for_load_state("networkidle")
                html = await page.content()
                await browser.close()

                jobs = extract_by_platform(platform, html, url) or []
                jobs = [j for j in jobs if title_matches(j.get("title", ""))]
        except Exception as e:
            print("Playwright scrape error:", e)
            jobs = []

    # Fetch details for each job
    detailed_jobs = []
    for job in jobs:
        job_url = job.get("url")
        if not job_url:
            detailed_jobs.append(job)
            continue

        job_html = ""
        try:
            job_html = requests.get(job_url, timeout=20).text
        except Exception as e:
            print(f"Error fetching job details for {job_url}: {e}")

        details = {}
        if job_html:
            # Try to extract more details from individual job page
            try:
                details = universal_extract(job_html, get_base_url(job_url))
                if isinstance(details, list) and details:
                    details = details[0]
                elif not isinstance(details, dict):
                    details = {}
            except Exception:
                details = {}

        merged = merge_job(job, details)

        source_url = job.get("url") or url
        parsed = urlparse(source_url)
        host_parts = parsed.netloc.split(".")

        candidate = host_parts[0] if host_parts else "Unknown"
        if candidate in ("www", "jobs", "careers", "apply") and len(host_parts) > 1:
            candidate = host_parts[1]
        merged["company_name"] = merged.get("company_name") or candidate or "Unknown"

        detailed_jobs.append(merged)

    # Save everything
    save_jobs_to_db(detailed_jobs)

    return detailed_jobs
