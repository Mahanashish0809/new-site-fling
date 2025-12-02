# server/app.py
from flask import Flask, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv
import os

app = Flask(__name__)
CORS(app)
# 🔹 This finds the .env file anywhere above your current directory
env_path = find_dotenv()
if not env_path:
    print("No .env file found!")
else:
    print(f"Loading .env from: {env_path}")
    load_dotenv(env_path)

print("PG_DB:", os.getenv("PG_DB"))
print("PG_HOST:", os.getenv("PG_HOST"))

load_dotenv(dotenv_path=env_path)
print("PG_DB:", os.getenv("PG_DB"))
print("PG_HOST:", os.getenv("PG_HOST"))

# 🔹 Database connection function
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("PG_HOST"),
            database=os.getenv("PG_DB"),
            user=os.getenv("PG_USER"),
            password=os.getenv("PG_PASS"),
            port=os.getenv("PG_PORT", 5432),
            sslmode="require",
            cursor_factory=RealDictCursor  # add this here
        )
        return conn
    except Exception as e:
        print("Database connection failed:", e)
        return None


# 🔹 API endpoint to get jobs
@app.route("/api/jobs")
def get_jobs():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        # Make sure you use RealDictCursor here too
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT job_id, company_name, title, location, job_url, updated_at
            FROM greenhouse_jobs
            ORDER BY updated_at DESC
            LIMIT 20;
        """)
        rows = cur.fetchall()
        print("Rows fetched:", len(rows))
        print("First row sample:", rows[0] if rows else None)

        cur.close()
        conn.close()

        # Access values by key instead of index
        jobs = [
            {
                "job_id": r["job_id"],
                "company_name": r["company_name"],
                "title": r["title"],
                "location": r["location"],
                "job_url": r["job_url"],
                "updated_at": str(r["updated_at"])
            }
            for r in rows
        ]

        return jsonify(jobs)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

# 🔹 Root route for testing
@app.route("/")
def home():
    return "<h3>Flask Job API is running — visit /api/jobs</h3>"

# 🔹 Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
