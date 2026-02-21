# phpMyAdmin Database Setup Guide

## Quick Setup Steps

### Step 1: Access phpMyAdmin

1. Open your web browser
2. Navigate to phpMyAdmin:
   - **XAMPP**: `http://localhost/phpmyadmin`
   - **WAMP**: `http://localhost/phpmyadmin`
   - **Laragon**: `http://localhost/phpmyadmin`
   - **MAMP**: `http://localhost:8888/phpMyAdmin/`
   - **Custom**: Check your server configuration

3. Login with:
   - **Username**: `root`
   - **Password**: (leave blank if not set, or enter your MySQL password)

### Step 2: Create Database

#### Method 1: Using phpMyAdmin Interface

1. Click on **"New"** in the left sidebar
2. In the **"Database name"** field, enter: `attendance_system`
3. Select **Collation**: `utf8mb4_unicode_ci`
4. Click **"Create"** button

#### Method 2: Using SQL Tab

1. Click on **"SQL"** tab at the top
2. Copy and paste this SQL:

```sql
CREATE DATABASE IF NOT EXISTS `attendance_system` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

3. Click **"Go"** button

### Step 3: Configure Backend Connection

1. Open `backend/.env` file
2. Update with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=attendance_system
```

**Important**: 
- If MySQL password is empty, leave `DB_PASSWORD=` blank
- Replace `your_mysql_password_here` with your actual MySQL root password

### Step 4: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install:
- `pymysql` - MySQL driver for Python
- `python-dotenv` - For reading .env file

### Step 5: Start Backend Server

```bash
cd backend
uvicorn main:app --reload
```

The application will:
- ✅ Connect to MySQL database
- ✅ Automatically create tables (`employees`, `attendance`)
- ✅ Seed sample data on first run

### Step 6: Verify in phpMyAdmin

1. Refresh phpMyAdmin page
2. Click on `attendance_system` database in left sidebar
3. You should see:
   - **employees** table
   - **attendance** table

4. Click on **"employees"** table → **"Browse"** to see sample data

---

## Troubleshooting

### ❌ Connection Error: "Access denied"

**Solution:**
1. Check MySQL username and password in `.env` file
2. Verify MySQL service is running
3. Try creating a new MySQL user:

```sql
-- In phpMyAdmin SQL tab
CREATE USER 'attendance_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON attendance_system.* TO 'attendance_user'@'localhost';
FLUSH PRIVILEGES;
```

Then update `.env`:
```env
DB_USER=attendance_user
DB_PASSWORD=secure_password
```

### ❌ Error: "Can't connect to MySQL server"

**Solution:**
1. Check if MySQL/MariaDB service is running
2. Verify port number (default: 3306)
3. Check firewall settings
4. Try `localhost` instead of `127.0.0.1`

### ❌ Error: "Unknown database 'attendance_system'"

**Solution:**
1. Make sure you created the database in phpMyAdmin
2. Check database name spelling in `.env` file
3. Verify database exists: Click "New" → Check if `attendance_system` appears in list

### ❌ Port Already in Use

**Solution:**
- Check if MySQL is running on different port
- Update `DB_PORT` in `.env` file
- Common ports: 3306 (default), 3307, 3308

---

## Database Structure

After running the application, you'll have:

### `employees` Table
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `department` (VARCHAR)

### `attendance` Table
- `id` (INT, Primary Key, Auto Increment)
- `employee_id` (INT, Foreign Key → employees.id)
- `date` (DATE)
- `check_in` (DATETIME, Nullable)
- `check_out` (DATETIME, Nullable)
- `status` (VARCHAR) - Present/Absent/Late

---

## Testing Connection

Test your database connection:

```python
# Create test_connection.py in backend folder
from database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Database connection successful!")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
```

Run: `python test_connection.py`

---

## Backup Database

### Export via phpMyAdmin:
1. Select `attendance_system` database
2. Click **"Export"** tab
3. Select **"Quick"** method
4. Click **"Go"** to download SQL file

### Import via phpMyAdmin:
1. Select `attendance_system` database
2. Click **"Import"** tab
3. Choose SQL file
4. Click **"Go"**

---

## Next Steps

✅ Database created  
✅ Backend configured  
✅ Tables created automatically  
✅ Sample data seeded  

**Your Attendance System is ready!**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- phpMyAdmin: http://localhost/phpmyadmin
