import requests
import json
from datetime import datetime

def fetch_greenhouse_jobs(company_name):
    """
    Fetches job listings from a company's Greenhouse Job Board API.

    Args:
        company_name (str): The name of the company as it appears in the 
                          Greenhouse URL (e.g., 'coinbase', 'stripe').

    Returns:
        list: A list of dictionaries, where each dictionary represents a job posting.
              Each job dictionary is augmented with the company_name.
    """
    api_url = f"https://boards-api.greenhouse.io/v1/boards/{company_name}/jobs?content=true"
    
    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()
        data = response.json()
        jobs = data.get('jobs', [])
        # Add company name to each job for later reference
        for job in jobs:
            job['company_name'] = company_name.capitalize()
        return jobs
        
    except requests.exceptions.HTTPError:
        pass
    except requests.exceptions.RequestException as req_err:
        print(f"An error occurred for {company_name}: {req_err}")
    except json.JSONDecodeError:
        print(f"Failed to parse JSON for {company_name}.")
        
    return []

def display_jobs(job_list, limit=None):
    """
    Filters jobs for the current month and displays them in a formatted table.

    Args:
        job_list (list): A list of job dictionaries from the Greenhouse API.
        limit (int, optional): The maximum number of jobs to display. Defaults to None.
    """
    if not job_list:
        print("No job listings found.")
        return
        
    # --- New: Filter for jobs posted this month ---
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    recent_jobs = []
    for job in job_list:
        # The 'updated_at' timestamp is in ISO 8601 format (e.g., '2025-10-21T18:30:00-04:00')
        updated_at_str = job.get('updated_at')
        if updated_at_str:
            # Parse the string into a datetime object
            job_date = datetime.fromisoformat(updated_at_str.replace('Z', '+00:00'))
            if job_date.year == current_year and job_date.month == current_month:
                recent_jobs.append(job)

    total_found = len(recent_jobs)
    if not total_found:
        print("No jobs found that were posted this month.")
        return

    # Apply the limit if one is provided
    if limit is not None and total_found > limit:
        job_list_to_display = recent_jobs[:limit]
        print(f"Displaying top {limit} of {total_found} jobs posted this month:\n")
    else:
        job_list_to_display = recent_jobs
        print(f"Found {total_found} jobs posted this month:\n")

    # --- Updated Table Formatting ---
    header = {"title": "Title", "company": "Company", "location": "Location", "url": "URL"}
    max_widths = {key: len(value) for key, value in header.items()}
    
    table_data = []
    for job in job_list_to_display:
        row = {
            "title": job.get('title', 'N/A'),
            "company": job.get('company_name', 'N/A'),
            "location": job.get('location', {}).get('name', 'N/A'),
            "url": job.get('absolute_url', 'N/A')
        }
        table_data.append(row)
        
        for key, value in row.items():
            if len(value) > max_widths.get(key, 0):
                max_widths[key] = len(value)

    header_line = (
        f"{header['title']:<{max_widths['title']}} | "
        f"{header['company']:<{max_widths['company']}} | "
        f"{header['location']:<{max_widths['location']}} | "
        f"{header['url']}"
    )
    print(header_line)
    
    separator_line = (
        f"{'-' * max_widths['title']}---"
        f"{'-' * max_widths['company']}---"
        f"{'-' * max_widths['location']}---"
        f"{'-' * max_widths['url']}"
    )
    print(separator_line)

    for row in table_data:
        row_line = (
            f"{row['title']:<{max_widths['title']}} | "
            f"{row['company']:<{max_widths['company']}} | "
            f"{row['location']:<{max_widths['location']}} | "
            f"{row['url']}"
        )
        print(row_line)


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
    
    # Sort all jobs by date, newest first, before displaying
    all_jobs.sort(key=lambda x: x.get('updated_at', ''), reverse=True)
    
    # Display the collected and filtered jobs with a limit of 10
    display_jobs(all_jobs, limit=10)

