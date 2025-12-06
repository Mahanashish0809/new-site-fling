import psycopg2

def get_db_connection():
    return psycopg2.connect(
        host="user.c0fo0cumqafz.us-east-1.rds.amazonaws.com",  # YOUR endpoint
        database="postgres",                                     # YOUR DB NAME
        user="postgres",                                         # YOUR username
        password="postgres",                             # YOUR password
        port=5432
    )
