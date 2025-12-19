# run_all.py

import json
import asyncio
from scraper import scrape_url
import os


async def run_all():
    print("Loading job_links.json...")

    file_path = os.path.join(os.path.dirname(__file__), "job_links.json")

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


if __name__ == "__main__":
    asyncio.run(run_all())
