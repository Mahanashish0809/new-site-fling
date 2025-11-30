# extractors.py
from bs4 import BeautifulSoup
import re

###########################################################
# WORKDAY (HTML fallback ONLY — API handles real scraping)
###########################################################
def extract_workday_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    for a in soup.select("a[href*='/job/']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        if href.startswith("/"):
            href = base_url.rstrip("/") + href

        jobs.append({"title": title, "url": href})

    return jobs


###########################################################
# GREENHOUSE
###########################################################
def extract_greenhouse_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    for a in soup.select("a[href*='greenhouse.io'][href*='/jobs/']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        jobs.append({"title": title, "url": href})

    return jobs


###########################################################
# LEVER
###########################################################
def extract_lever_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    for a in soup.select("a[href*='jobs.lever.co']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        jobs.append({"title": title, "url": href})

    return jobs


###########################################################
# ORACLE CLOUD HCM
###########################################################
def extract_oracle_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    for tag in soup.select("[data-ph-at-id='job-title-text']"):
        title = tag.get_text(strip=True)
        parent = tag.parent
        href = parent.get("href") if parent else None

        if not title or not href:
            continue

        if href.startswith("/"):
            href = base_url.rstrip("/") + href

        jobs.append({"title": title, "url": href})

    return jobs


###########################################################
# SUCCESSFACTORS
###########################################################
def extract_successfactors_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    for a in soup.select("a[href*='career'], a[href*='careersection'], a[href*='jobId=']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        jobs.append({"title": title, "url": href})

    return jobs


###########################################################
# ICIMS
###########################################################
def extract_icims_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    for a in soup.select("a[href*='icims'][href*='jobs']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        jobs.append({"title": title, "url": href})

    return jobs


###########################################################
# SMARTRECRUITERS
###########################################################
def extract_smartrecruiters_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    for a in soup.select("a[href*='smartrecruiters'][href*='job']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        jobs.append({"title": title, "url": href})

    return jobs


###########################################################
# WORKABLE
###########################################################
def extract_workable_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    for a in soup.select("a[href*='workable'][href*='apply'], a[href*='workable'][href*='job']"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        jobs.append({"title": title, "url": href})

    return jobs


###########################################################
# GENERIC FALLBACK EXTRACTOR
###########################################################
def extract_generic_jobs(html, base_url):
    soup = BeautifulSoup(html, "lxml")
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

        if href.startswith("/"):
            href = base_url.rstrip("/") + href

        jobs.append({"title": title, "url": href})

    return remove_duplicates(jobs)


###########################################################
# HELPERS
###########################################################
def remove_duplicates(jobs):
    seen = {}
    for job in jobs:
        seen[j["url"]] = job
    return list(seen.values())
