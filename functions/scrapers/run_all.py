import json
import asyncio
from scraper import scrape_url
import os

def _load_links() -> dict:
    file_path = os.path.join(os.path.dirname(__file__), "job_links.json")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError("job_links.json must be a key-value map: { 'Company': 'URL', ... }")
    return data

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

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--company", type=str, default=None)
    args = parser.parse_args()

    try:
        out = asyncio.run(run_all(company=args.company))
        print(json.dumps(out))
        raise SystemExit(0)
    except Exception as e:
        print(json.dumps({"ok": False, "error": str(e)}))
        raise SystemExit(1)

if __name__ == "__main__":
    asyncio.run(run_all())
