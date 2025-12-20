# extractors.py

from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from typing import Optional
import re

# -----------------------------------------------------------
# Shared helpers
# -----------------------------------------------------------

GENERIC_SUBDOMAINS = {"www", "jobs", "careers", "apply"}


def _infer_company_from_url(url, platform=None):
    """
    Best-effort company inference from a job URL.
    - For Greenhouse: first path segment -> company slug (e.g. /reddit/jobs/... -> reddit)
    - Otherwise: first non-generic subdomain part.
    """
    parsed = urlparse(url)
    host_parts = parsed.netloc.split(".")
    candidate = host_parts[0] if host_parts else ""

    if candidate in GENERIC_SUBDOMAINS and len(host_parts) > 1:
        candidate = host_parts[1]

    if platform == "greenhouse":
        parts = parsed.path.strip("/").split("/")
        if parts and parts[0]:
            candidate = parts[0]

    if not candidate:
        return "Unknown"
    return candidate.capitalize()


def _abs_url(base_url, href):
    if href.startswith("http://") or href.startswith("https://"):
        return href
    return urljoin(base_url.rstrip("/") + "/", href.lstrip("/"))


def remove_duplicates(jobs):
    seen = {}
    for job in jobs:
        url = job.get("url")
        if not url:
            continue
        seen[url] = job
    return list(seen.values())


# -----------------------------------------------------------
# WORKDAY (HTML fallback ONLY)
# -----------------------------------------------------------

def extract_workday_jobs(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    for a in soup.select("a[href*='/job/']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue
        href = _abs_url(base_url, href)
        jobs.append({"title": title, "url": href})

    return remove_duplicates(jobs)


# -----------------------------------------------------------
# GREENHOUSE
# -----------------------------------------------------------

def extract_greenhouse_jobs(html, base_url):
    """
    Handles standard Greenhouse job boards like:
    https://job-boards.greenhouse.io/reddit/
    """
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    for a in soup.select("a.opening, div.opening a, a[href*='/jobs/']"):
        href = a.get("href")
        if not href:
            continue
        href = _abs_url(base_url, href)

        title_el = a.select_one(".title")
        title = title_el.get_text(strip=True) if title_el else a.get_text(strip=True)
        if not title:
            continue

        loc_el = a.select_one(".location")
        location = loc_el.get_text(strip=True) if loc_el else None

        company_name = _infer_company_from_url(href, platform="greenhouse")

        jobs.append({
            "title": title,
            "url": href,
            "company_name": company_name,
            "location": location,
        })

    return remove_duplicates(jobs)


def extract_greenhouse_job_details(html, base_url):
    soup = BeautifulSoup(html, "html.parser")

    # Title from job page
    title_el = soup.select_one("h1.application-title, h1.app-title, h1.job-title, h1")
    title = title_el.get_text(strip=True) if title_el else None

    # Description
    desc_el = soup.select_one(
        ".content, .job__description, .section-wrapper, .job-details, .job-description"
    )
    if desc_el:
        for tag in desc_el(["script", "style"]):
            tag.decompose()
        description = desc_el.get_text("\n", strip=True)
    else:
        description = None

    # Location
    loc_el = soup.select_one(".location, [class*=location]")
    location = loc_el.get_text(strip=True) if loc_el else None

    return {
        "title": title,
        "location": location,
        "description": description,
    }


# -----------------------------------------------------------
# LEVER
# -----------------------------------------------------------

def extract_lever_jobs(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    for a in soup.select("a[href*='jobs.lever.co']"):
        href = a.get("href")
        if not href:
            continue
        href = _abs_url(base_url, href)

        title = a.get_text(strip=True)
        if not title:
            continue

        company_name = _infer_company_from_url(href)

        jobs.append({
            "title": title,
            "url": href,
            "company_name": company_name,
            "location": None,
        })

    return remove_duplicates(jobs)


def extract_lever_job_details(html, base_url):
    soup = BeautifulSoup(html, "html.parser")

    title_el = soup.select_one("h2.title, h1, h2")
    title = title_el.get_text(strip=True) if title_el else None

    desc_el = soup.select_one(
        "div.description, div.content, section[data-qa='job-description']"
    )
    if desc_el:
        for tag in desc_el(["script", "style"]):
            tag.decompose()
        description = desc_el.get_text("\n", strip=True)
    else:
        description = None

    loc_el = soup.select_one("div.location, span.location")
    location = loc_el.get_text(strip=True) if loc_el else None

    return {
        "title": title,
        "location": location,
        "description": description,
    }


# -----------------------------------------------------------
# ORACLE CLOUD HCM
# -----------------------------------------------------------

def extract_oracle_jobs(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    for tag in soup.select("[data-ph-at-id='job-title-text']"):
        title = tag.get_text(strip=True)
        parent = tag.parent
        href = parent.get("href") if parent else None
        if not title or not href:
            continue
        href = _abs_url(base_url, href)
        company_name = _infer_company_from_url(href)

        jobs.append({
            "title": title,
            "url": href,
            "company_name": company_name,
            "location": None,
        })

    return remove_duplicates(jobs)


def extract_oracle_job_details(html, base_url):
    soup = BeautifulSoup(html, "html.parser")

    title_el = soup.select_one("h1, h2")
    title = title_el.get_text(strip=True) if title_el else None

    desc_el = soup.select_one(
        "div.job-description, div.description, div[data-ph-at-id='jobdescription']"
    )
    if desc_el:
        for tag in desc_el(["script", "style"]):
            tag.decompose()
        description = desc_el.get_text("\n", strip=True)
    else:
        description = None

    loc_el = soup.select_one("span[data-ph-id*='Location'], div.location")
    location = loc_el.get_text(strip=True) if loc_el else None

    return {
        "title": title,
        "location": location,
        "description": description,
    }


# -----------------------------------------------------------
# SUCCESSFACTORS
# -----------------------------------------------------------

def extract_successfactors_jobs(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    for a in soup.select(
        "a[href*='career'], a[href*='careersection'], a[href*='jobId=']"
    ):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue
        href = _abs_url(base_url, href)
        company_name = _infer_company_from_url(href)
        jobs.append({
            "title": title,
            "url": href,
            "company_name": company_name,
            "location": None,
        })

    return remove_duplicates(jobs)


def extract_successfactors_job_details(html, base_url):
    soup = BeautifulSoup(html, "html.parser")

    title_el = soup.select_one("h1, h2")
    title = title_el.get_text(strip=True) if title_el else None

    desc_el = soup.select_one(
        "div.job_description, div.jobdescription, div.content"
    )
    if desc_el:
        for tag in desc_el(["script", "style"]):
            tag.decompose()
        description = desc_el.get_text("\n", strip=True)
    else:
        description = None

    loc_el = soup.select_one("span.jobLocation, span[id*='LOCATION'], div.location")
    location = loc_el.get_text(strip=True) if loc_el else None

    return {
        "title": title,
        "location": location,
        "description": description,
    }


# -----------------------------------------------------------
# ICIMS
# -----------------------------------------------------------

def extract_icims_jobs(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    for a in soup.select("a[href*='icims'][href*='jobs']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue
        href = _abs_url(base_url, href)
        company_name = _infer_company_from_url(href)
        jobs.append({
            "title": title,
            "url": href,
            "company_name": company_name,
            "location": None,
        })

    return remove_duplicates(jobs)


def extract_icims_job_details(html, base_url):
    soup = BeautifulSoup(html, "html.parser")

    title_el = soup.select_one("h1, h2")
    title = title_el.get_text(strip=True) if title_el else None

    desc_el = soup.select_one(
        "div.iCIMS_JobContent, div.description, div.content"
    )
    if desc_el:
        for tag in desc_el(["script", "style"]):
            tag.decompose()
        description = desc_el.get_text("\n", strip=True)
    else:
        description = None

    loc_el = soup.select_one(
        "span[itemprop='addressLocality'], div.location"
    )
    location = loc_el.get_text(strip=True) if loc_el else None

    return {
        "title": title,
        "location": location,
        "description": description,
    }


# -----------------------------------------------------------
# SMARTRECRUITERS
# -----------------------------------------------------------

def extract_smartrecruiters_jobs(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    for a in soup.select("a[href*='smartrecruiters'][href*='job']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue
        href = _abs_url(base_url, href)
        company_name = _infer_company_from_url(href)
        jobs.append({
            "title": title,
            "url": href,
            "company_name": company_name,
            "location": None,
        })

    return remove_duplicates(jobs)


def extract_smartrecruiters_job_details(html, base_url):
    soup = BeautifulSoup(html, "html.parser")

    title_el = soup.select_one("h1, h2")
    title = title_el.get_text(strip=True) if title_el else None

    desc_el = soup.select_one(
        "div.description, div#job-description, div.content"
    )
    if desc_el:
        for tag in desc_el(["script", "style"]):
            tag.decompose()
        description = desc_el.get_text("\n", strip=True)
    else:
        description = None

    loc_el = soup.select_one("span.job-location, span.location, div.location")
    location = loc_el.get_text(strip=True) if loc_el else None

    return {
        "title": title,
        "location": location,
        "description": description,
    }


# -----------------------------------------------------------
# WORKABLE
# -----------------------------------------------------------

def extract_workable_jobs(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    for a in soup.select(
        "a[href*='workable'][href*='apply'], a[href*='workable'][href*='job']"
    ):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue
        href = _abs_url(base_url, href)
        company_name = _infer_company_from_url(href)
        jobs.append({
            "title": title,
            "url": href,
            "company_name": company_name,
            "location": None,
        })

    return remove_duplicates(jobs)


def extract_workable_job_details(html, base_url):
    soup = BeautifulSoup(html, "html.parser")

    title_el = soup.select_one("h1, h2")
    title = title_el.get_text(strip=True) if title_el else None

    desc_el = soup.select_one(
        "div.description, div.job-description, div.content"
    )
    if desc_el:
        for tag in desc_el(["script", "style"]):
            tag.decompose()
        description = desc_el.get_text("\n", strip=True)
    else:
        description = None

    loc_el = soup.select_one("span.job-location, span.location, div.location")
    location = loc_el.get_text(strip=True) if loc_el else None

    return {
        "title": title,
        "location": location,
        "description": description,
    }


# -----------------------------------------------------------
# GENERIC FALLBACK
# -----------------------------------------------------------

def extract_generic_jobs(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []

    # Broad job-like link detection
    keywords = ["job", "role", "position", "career", "apply", "opening", "opportunity", "vacancy"]

    selector = ",".join([f"a[href*='{kw}']" for kw in keywords])
    links = soup.select(selector)

    for a in links:
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue
        href = _abs_url(base_url, href)
        jobs.append({"title": title, "url": href})

    return remove_duplicates(jobs)
