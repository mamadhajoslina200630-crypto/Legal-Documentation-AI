"""Database Initialization Script.

Creates all database tables defined in the SQLAlchemy models.
Usage:
    python init_db.py
"""

import sys
from app.config import settings
from app.data.postgres.session import init_db


def main():
    print(f"Connecting to database: {settings.DATABASE_URL} ...")
    try:
        init_db()
        print("All tables created successfully!")
    except Exception as e:
        print(f"Failed to initialize database: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
