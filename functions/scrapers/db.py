import psycopg2

def get_db_connection():
    return psycopg2.connect(
        host="user.c0fo0cumqafz.us-east-1.rds.amazonaws.com",
        database="postgres",
        user="postgres",
        password="postgres",
        port=5432
    )
