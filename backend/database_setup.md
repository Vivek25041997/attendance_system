# Database Setup Guide - MySQL/MariaDB with phpMyAdmin

## Step 1: Create Database in phpMyAdmin

1. **Open phpMyAdmin**
   - Usually accessible at: `http://localhost/phpmyadmin`
   - Or `http://localhost:8080/phpmyadmin` (depending on your setup)

2. **Login**
   - Username: `root` (default)
   - Password: (your MySQL root password, or leave blank if not set)

3. **Create New Database**
   - Click on "New" in the left sidebar
   - Database name: `attendance_system`
   - Collation: `utf8mb4_unicode_ci` (recommended)
   - Click "Create"

## Step 2: Configure Backend

1. **Update .env file** in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=attendance_system
   ```

2. **Install MySQL dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

## Step 3: Run the Application

The database tables will be created automatically when you start the FastAPI server:

```bash
cd backend
uvicorn main:app --reload
```

The application will:
- Connect to MySQL database
- Create all tables automatically (Employee, Attendance)
- Seed sample data on first run

## Step 4: Verify in phpMyAdmin

1. Refresh phpMyAdmin
2. Select `attendance_system` database
3. You should see tables:
   - `employees`
   - `attendance`

## Troubleshooting

### Connection Error
- Check MySQL/MariaDB service is running
- Verify credentials in `.env` file
- Check firewall settings

### Access Denied
- Verify MySQL user has proper permissions
- Try creating a dedicated user:
  ```sql
  CREATE USER 'attendance_user'@'localhost' IDENTIFIED BY 'your_password';
  GRANT ALL PRIVILEGES ON attendance_system.* TO 'attendance_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Port Issues
- Default MySQL port: 3306
- Check if MySQL is running on different port
- Update `DB_PORT` in `.env` file
