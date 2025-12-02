# run_all.py
import json
import asyncio
from scraper import scrape_url
import os

async def run_all():
    print("Loading job_links.json...")

    file_path = os.path.join(os.path.dirname(__file__), "job_links.json")
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


if __name__ == "__main__":
    asyncio.run(run_all())
