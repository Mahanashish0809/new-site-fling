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

    results = []

    # Scrape each URL
    for url in urls:
        print(f"Scraping: {url}")
        jobs = await scrape_url(url)
        print(f"Found {len(jobs)} jobs")
        results.extend(jobs)

    print("TOTAL JOBS:", len(results))
    return results


if __name__ == "__main__":
    asyncio.run(run_all())
