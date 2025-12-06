# run_all.py
import json
import asyncio
import os
from scraper import scrape_url

async def run_all():
    print("Loading job_links.json...")

    file_path = os.path.join(os.path.dirname(__file__), "job_links.json")
    urls = json.load(open(file_path))

    print(f"URLs loaded: {len(urls)}\n")

    for url in urls:
        print(f"\nScraping: {url}")
        jobs = await scrape_url(url)
        jobs = jobs or []   # <--- FIXED

        print(f"Found {len(jobs)} jobs")

    print("\n=== FINISHED SCRAPING ===")

if __name__ == "__main__":
    asyncio.run(run_all())
