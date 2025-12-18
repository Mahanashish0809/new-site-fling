# run_all.py

import json
import asyncio
from scraper import scrape_url
import os


async def run_all():
    print("Loading job_links.json...")

    file_path = os.path.join(os.path.dirname(__file__), "job_links.json")
<<<<<<< HEAD
    with open(file_path, "r") as f:
        urls = json.load(f)

    print("URLs loaded:", urls)

    if not urls:
        print("No URLs found in job_links.json!")
        return []

    all_jobs = []

    # Scrape each URL
    for url in urls:
        print(f"Scraping: {url}")
        jobs = await scrape_url(url)
        print(f"Found {len(jobs)} jobs")

        all_jobs.extend(jobs)

    print("\n===============================")
    print(f"TOTAL JOBS SCRAPED: {len(all_jobs)}")
    print("===============================\n")

    # No Node backend — saving handled inside scraper.py
    print("💾 Jobs already saved directly to AWS PostgreSQL inside scraper.py")

    return all_jobs

=======

    # Load the JSON as a dict: { "Company": "URL", ... }
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading job_links.json at {file_path}: {e}")
        return

    if not isinstance(data, dict):
        print("job_links.json must be a key-value map: { 'Company': 'URL', ... }")
        return

    print(f"Companies loaded: {len(data)}")

    # Convert dict → list of (company, url)
    items = list(data.items())

    print("\nStarting scraping...\n")

    for company, url in items:
        print(f"\n===== Scraping {company} =====")
        print(f"URL: {url}")

        try:
            jobs = await scrape_url(url)
        except Exception as e:
            print(f"Error scraping {company} ({url}): {e}")
            continue

        jobs = jobs or []
        print(f"{company}: {len(jobs)} jobs scraped")

    print("\n=== FINISHED SCRAPING ALL COMPANIES ===")

>>>>>>> changes made to web scraper

if __name__ == "__main__":
    asyncio.run(run_all())
