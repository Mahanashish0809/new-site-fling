# universal_extractor.py
from bs4 import BeautifulSoup
import re

def universal_extract(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    jobs = []

    # Keywords likely to appear in job links
    keywords = [
        "job", "role", "position", "careers",
        "opportunity", "opening", "vacancy", "apply"
    ]

    # Build CSS selector for all keyword links
    selector = ",".join([f"a[href*='{kw}']" for kw in keywords])
    links = soup.select(selector)

    for a in links:
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        # Convert relative → absolute
        if href.startswith("/"):
            href = base_url.rstrip("/") + href

        # Only add real titles
        if looks_like_job_title(title):
            jobs.append({"title": title, "url": href})

    # Title pattern matching to catch hidden titles
    patterns = [
        r"software engineer", r"developer", r"intern", r"manager",
        r"scientist", r"analyst", r"designer", r"architect",
        r"marketing", r"customer service representative",
        r"senior data engineer"
    ]

    for pat in patterns:
        for tag in soup.find_all(string=re.compile(pat, re.IGNORECASE)):
            parent = tag.parent
            if parent and parent.name == "a":
                title = parent.get_text(strip=True)
                href = parent.get("href")

                if href:
                    if href.startswith("/"):
                        href = base_url.rstrip("/") + href

                    jobs.append({"title": title, "url": href})

    return remove_duplicates(jobs)

# ---------- HELPERS ----------
def looks_like_job_title(text: str):
    if len(text) < 3:
        return False
    if len(text) > 120:
        return False
    if len(text.split()) > 12:
        return False
    if not re.search(r"[A-Za-z]", text):
        return False
    return True

def remove_duplicates(jobs):
    """Remove duplicated job URLs safely."""
    seen = {}
    for job in jobs:
        url = job.get("url")
        if not url:
            continue
        seen[url] = job
    return list(seen.values())
