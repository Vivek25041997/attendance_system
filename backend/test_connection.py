"""
Test MySQL Database Connection
Run this script to verify your database configuration before starting the server.
"""

from database import engine, DB_HOST, DB_PORT, DB_USER, DB_NAME
from sqlalchemy import text
import sys

def test_connection():
    print("=" * 50)
    print("Testing MySQL Database Connection")
    print("=" * 50)
    print(f"Host: {DB_HOST}")
    print(f"Port: {DB_PORT}")
    print(f"User: {DB_USER}")
    print(f"Database: {DB_NAME}")
    print("-" * 50)
    
    try:
        # Test basic connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            if row and row[0] == 1:
                print("[OK] Database connection successful!")
                print("-" * 50)
                
                # Check if database exists
                result = conn.execute(text(f"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{DB_NAME}'"))
                db_exists = result.fetchone()
                
                if db_exists:
                    print(f"[OK] Database '{DB_NAME}' exists")
                    
                    # Check if tables exist
                    conn.execute(text(f"USE {DB_NAME}"))
                    result = conn.execute(text("SHOW TABLES"))
                    tables = result.fetchall()
                    
                    if tables:
                        print(f"[OK] Found {len(tables)} table(s):")
                        for table in tables:
                            print(f"   - {table[0]}")
                    else:
                        print("[INFO] No tables found (tables will be created on first server start)")
                else:
                    print(f"[ERROR] Database '{DB_NAME}' does not exist!")
                    print(f"   Please create it in phpMyAdmin first.")
                    return False
                
                print("=" * 50)
                print("[OK] All checks passed! You can start the server now.")
                print("=" * 50)
                return True
                
    except Exception as e:
        print("[ERROR] Database connection failed!")
        print(f"Error: {str(e)}")
        print("-" * 50)
        print("Troubleshooting:")
        print("1. Start MySQL/MariaDB service:")
        print("   - XAMPP: Start MySQL from XAMPP Control Panel")
        print("   - WAMP: Start MySQL service")
        print("   - Laragon: MySQL should auto-start")
        print("   - Windows Service: net start MySQL")
        print("2. Verify database credentials in .env file")
        print("3. Ensure database 'attendance_system' exists in phpMyAdmin")
        print("4. Check firewall settings")
        print("=" * 50)
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
