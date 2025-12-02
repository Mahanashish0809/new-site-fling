import psycopg2
import json
from db import get_db_connection

conn = get_db_connection()
cur = conn.cursor()

cur.execute("SELECT job_id, company_name, title, location, job_url, updated_at FROM greenhouse_jobs ORDER BY updated_at DESC LIMIT 20;")
rows = cur.fetchall()

print("\n=== JOBS IN DATABASE ===\n")

for row in rows:
    print(f"ID: {row[0]}")
    print(f"Company: {row[1]}")
    print(f"Title: {row[2]}")
    print(f"Location: {row[3]}")
    print(f"URL: {row[4]}")
    print(f"Updated: {row[5]}")
    print("-" * 50)

cur.close()
conn.close()
