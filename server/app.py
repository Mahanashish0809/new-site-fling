# server/app.py
from flask import Flask, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os

from dotenv import load_dotenv, find_dotenv
import os

# 🔹 This finds the .env file anywhere above your current directory
env_path = find_dotenv()
if not env_path:
    print("❌  No .env file found!")
else:
    print(f"✅  Loading .env from: {env_path}")
    load_dotenv(env_path)

print("PG_DB:", os.getenv("PG_DB"))
print("PG_HOST:", os.getenv("PG_HOST"))

load_dotenv(dotenv_path=env_path)
print("PG_DB:", os.getenv("PG_DB"))
print("PG_HOST:", os.getenv("PG_HOST"))



# 🔹 Initialize Flask app
app = Flask(__name__)

# 🔹 Database connection function
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("PG_HOST"),
            database=os.getenv("PG_DB"),
            user=os.getenv("PG_USER"),
            password=os.getenv("PG_PASS"),
            port=os.getenv("PG_PORT", 5432),
            cursor_factory=RealDictCursor  # returns dict instead of tuples
        )
        return conn
    except Exception as e:
        print("❌ Database connection failed:", e)
        return None

# 🔹 API endpoint to get jobs
@app.route("/api/jobs")
def get_jobs():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    cur = conn.cursor()
    # ✅ Fetch data from your new table
    cur.execute("""
        SELECT job_id, title, location, department, date_posted, job_url
        FROM greenhouse_jobs
        ORDER BY date_posted DESC
        LIMIT 20;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Convert rows into JSON
    jobs = [
        {
            "job_id": r[0],
            "title": r[1],
            "location": r[2],
            "department": r[3],
            "date_posted": str(r[4]),
            "url": r[5]
        }
        for r in rows
    ]
    return jsonify(jobs)

# 🔹 Root route for testing
@app.route("/")
def home():
    return "<h3>✅ Flask Job API is running — visit /api/jobs</h3>"

# 🔹 Run server
if __name__ == "__main__":
    app.run(debug=True)
