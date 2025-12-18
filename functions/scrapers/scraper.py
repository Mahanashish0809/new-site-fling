# scraper.py
import asyncio
import requests
import re
from playwright.async_api import async_playwright
<<<<<<< HEAD
from datetime import datetime, date
import json

# --- DB Connection ---
from db import get_db_connection

# --- Extractors ---
=======
from urllib.parse import urlparse, urljoin
from db import get_db_connection
from collections.abc import Mapping
>>>>>>> changes made to web scraper
from extractors import (
    extract_greenhouse_jobs,
    extract_lever_jobs,
    extract_oracle_jobs,
    extract_successfactors_jobs,
    extract_icims_jobs,
    extract_smartrecruiters_jobs,
    extract_workable_jobs,
<<<<<<< HEAD
    extract_generic_jobs
=======
    extract_greenhouse_job_details,
    extract_lever_job_details,
    extract_oracle_job_details,
    extract_successfactors_job_details,
    extract_icims_job_details,
    extract_smartrecruiters_job_details,
    extract_workable_job_details,
>>>>>>> changes made to web scraper
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


<<<<<<< HEAD
# =====================================================================
# DATABASE SAVE FUNCTION (WORKDAY + GREENHOUSE + ALL ATS)
# =====================================================================
=======
# -----------------------------------------------------------
# Helper: deterministic job ID
# -----------------------------------------------------------

def make_job_id(source: str, key: str) -> int:
    raw = f"{source}:{key}"
    return int(md5(raw.encode()).hexdigest()[:12], 16)


# -----------------------------------------------------------
# Save jobs to PostgreSQL
# -----------------------------------------------------------

>>>>>>> changes made to web scraper
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
<<<<<<< HEAD
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (job_id) DO UPDATE SET
            updated_at = EXCLUDED.updated_at,
            raw_data = EXCLUDED.raw_data;
=======
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (job_id) DO UPDATE SET
            company_name = EXCLUDED.company_name,
            title        = EXCLUDED.title,
            location     = EXCLUDED.location,
            job_url      = EXCLUDED.job_url,
            updated_at   = EXCLUDED.updated_at,
            raw_data     = EXCLUDED.raw_data,
            description  = EXCLUDED.description;
>>>>>>> changes made to web scraper
    """

    for job in job_list:
<<<<<<< HEAD
        job_id = job.get("job_id") or job.get("id")
=======
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

>>>>>>> changes made to web scraper
        company = job.get("company_name", "Unknown")
        title = job.get("title")
        location = job.get("location", "N/A")
        job_url = job.get("url")
<<<<<<< HEAD
        updated_at = job.get("posted_on") or job.get("updated_at")
        raw_json = json.dumps(job)

        try:
            cur.execute(query, (
                job_id, company, title, location, job_url, updated_at, raw_json
            ))
        except Exception as e:
            print("DB Insert Error:", e)
=======
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
>>>>>>> changes made to web scraper
            continue

    conn.commit()
    cur.close()
    conn.close()
<<<<<<< HEAD

    print(f"✅ Saved {len(job_list)} jobs to AWS PostgreSQL.")


# =====================================================================
#   WORKDAY SCRAPER — ONLY "POSTED TODAY"
# =====================================================================
async def scrape_workday_api(url):
    print("Using Workday DETAIL-PAGE scraper (FINAL)...")
=======
    print(f"Saved {saved} jobs to AWS Postgresql")


# -----------------------------------------------------------
# WORKDAY NETWORK INTERCEPT SCRAPER
# -----------------------------------------------------------

async def scrape_workday_api(url: str):
    print("Using Workday NETWORK INTERCEPT scraper (last 24h)...")
>>>>>>> changes made to web scraper

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

<<<<<<< HEAD
        print("➡ Opening Workday job listing page...")
        await page.goto(url, timeout=60000)
=======
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
>>>>>>> changes made to web scraper
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

<<<<<<< HEAD
    # Convert relative → absolute
    for h in hrefs:
        if h.startswith("/"):
            full = f"https://{host}{h}"
        else:
            full = h
=======
    print(f"TOTAL RAW WORKDAY JOBS: {len(job_posts)}")
>>>>>>> changes made to web scraper

        if full not in job_urls:
            job_urls.append(full)

<<<<<<< HEAD
    print(f"📌 Total Workday job URLs found: {len(job_urls)}")
=======
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
# Extract job's details
# -----------------------------------------------------------

def extract_job_details(platform: str, html: str, url: str) -> dict:
    base_url = get_base_url(url)
    try:
        if platform == "greenhouse":
            return extract_greenhouse_job_details(html, base_url)
        if platform == "lever":
            return extract_lever_job_details(html, base_url)
        if platform == "oracle":
            return extract_oracle_job_details(html, base_url)
        if platform == "successfactors":
            return extract_successfactors_job_details(html, base_url)
        if platform == "icims":
            return extract_icims_job_details(html, base_url)
        if platform == "smartrecruiters":
            return extract_smartrecruiters_job_details(html, base_url)
        if platform == "workable":
            return extract_workable_job_details(html, base_url)

        res = universal_extract(html, base_url)

        if isinstance(res, Mapping):
            return res
        if isinstance(res, list):
            return res[0] if res else {}
        return {}
    except Exception as e:
        print("Job details extractor error:", e)
        return {}


# -----------------------------------------------------------
# UNIVERSAL ADVANCED PLAYWRIGHT SCRAPER
# -----------------------------------------------------------

async def playwright_scrape_universal(url):
    print("Using UNIVERSAL PLAYWRIGHT SCRAPER...")

    extracted = []
    network_jobs = []
>>>>>>> changes made to web scraper

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
<<<<<<< HEAD
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
=======
                if "job" in resp.url.lower() or "career" in resp.url.lower():
                    data = await resp.json()
                    if isinstance(data, dict):
                        for k, v in data.items():
                            if isinstance(v, list) and len(v) > 0:
                                if isinstance(v[0], dict):
                                    print(f"Network jobs from {resp.url}")
                                    network_jobs.extend(v)
            except Exception:
>>>>>>> changes made to web scraper
                pass

            await page.close()

        await browser.close()

<<<<<<< HEAD
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
=======
    final = []

    # Add DOM extracted jobs (filtered by title)
    for job in extracted:
        title = job.get("title") or ""
        if not title_matches(title):
            continue
        if "url" not in job:
            continue
        job["job_id"] = make_job_id("dom", job["url"])
        final.append(job)

    # Add network JSON jobs (filtered by title)
    for job in network_jobs:
        title = job.get("title") or ""
        if not title_matches(title):
            continue
        job_id = job.get("id") or make_job_id("net", json.dumps(job))
        final.append(
            {
                "job_id": job_id,
                "title": title or "Unknown",
                "url": job.get("url") or url,
                "company_name": job.get("company") or "Unknown",
                "location": job.get("location", "N/A"),
                "posted_on": job.get("updated_at") or datetime.utcnow().isoformat(),
                "raw": job,
            }
        )

    print(f"UNIVERSAL SCRAPER TOTAL JOBS (filtered): {len(final)}")
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
>>>>>>> changes made to web scraper

    # WORKDAY
    if platform == "workday":
        jobs = await scrape_workday_api(url)
        save_jobs_to_db(jobs)
        return jobs

    # STATIC HTML SCRAPE
    try:
        html = requests.get(url, timeout=15).text
<<<<<<< HEAD
        jobs = extract_by_platform(platform, html, url)
        if jobs:
            save_jobs_to_db(jobs)
            return jobs
    except:
        pass
=======
        jobs = extract_by_platform(platform, html, url) or []
        # Filter by title keywords here too
        jobs = [j for j in jobs if title_matches(j.get("title", ""))]
    except Exception as e:
        print("Static scrape error:", e)
        jobs = []
>>>>>>> changes made to web scraper

    # PLAYWRIGHT SCRAPE
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

<<<<<<< HEAD
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
=======
    # Fetch Jobs for Each URL
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
            details = extract_job_details(platform, job_html, job_url) or {}

        merged = merge_job(job, details)

        source_url = job.get("url") or url
        parsed = urlparse(source_url)
        host_parts = parsed.netloc.split(".")

        candidate = host_parts[0] if host_parts else "Unknown"
        if candidate in ("www", "jobs", "careers", "apply") and len(host_parts) > 1:
            candidate = host_parts[1]
        merged["company_name"] = candidate or "Unknown"

        detailed_jobs.append(merged)

    # Save everything
    save_jobs_to_db(detailed_jobs)

    return detailed_jobs
>>>>>>> changes made to web scraper
