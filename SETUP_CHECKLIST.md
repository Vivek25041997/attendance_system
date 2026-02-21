# Setup Checklist - MySQL Database Configuration

## ✅ Step-by-Step Setup Guide

### Step 1: Start MySQL Service

**Before creating the database, ensure MySQL/MariaDB is running:**

#### For XAMPP:
1. Open **XAMPP Control Panel**
2. Click **"Start"** next to MySQL
3. Wait for MySQL status to show "Running" (green)

#### For WAMP:
1. Open **WAMP Server**
2. Click on WAMP icon in system tray
3. Go to **MySQL** → **Service** → **Start/Resume Service**

#### For Laragon:
- MySQL should start automatically
- Check Laragon dashboard for MySQL status

#### For Windows Service:
```powershell
net start MySQL
```

**Verify MySQL is running:**
- Try accessing phpMyAdmin: `http://localhost/phpmyadmin`
- If you can access it, MySQL is running ✅

---

### Step 2: Create Database in phpMyAdmin

1. **Open phpMyAdmin**
   - URL: `http://localhost/phpmyadmin`
   - Login with:
     - Username: `root`
     - Password: (leave blank if not set)

2. **Create Database**
   - Click **"New"** in left sidebar
   - Database name: `attendance_system`
   - Collation: `utf8mb4_unicode_ci`
   - Click **"Create"**

3. **Verify Database Created**
   - You should see `attendance_system` in the left sidebar ✅

---

### Step 3: Configure Backend

1. **Edit `backend/.env` file:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=attendance_system
   ```

2. **If MySQL has a password:**
   - Update `DB_PASSWORD=your_password` in `.env` file

---

### Step 4: Test Database Connection

Run the test script:
```bash
cd backend
python test_connection.py
```

**Expected Output:**
```
[OK] Database connection successful!
[OK] Database 'attendance_system' exists
[OK] All checks passed! You can start the server now.
```

**If you see errors:**
- Check Step 1: MySQL service must be running
- Check Step 2: Database must exist
- Check Step 3: `.env` file credentials must be correct

---

### Step 5: Start Backend Server

```bash
cd backend
uvicorn main:app --reload
```

**What happens:**
- ✅ Connects to MySQL database
- ✅ Creates tables automatically (`employees`, `attendance`)
- ✅ Seeds sample data on first run

**Verify in phpMyAdmin:**
1. Refresh phpMyAdmin
2. Click on `attendance_system` database
3. You should see:
   - `employees` table
   - `attendance` table
4. Click "Browse" on `employees` table to see sample data

---

## 🔧 Troubleshooting

### Error: "Can't connect to MySQL server"

**Solution:**
- MySQL service is not running
- Start MySQL service (see Step 1)
- Verify MySQL is running: Check phpMyAdmin access

### Error: "Unknown database 'attendance_system'"

**Solution:**
- Database doesn't exist
- Create database in phpMyAdmin (see Step 2)

### Error: "Access denied for user 'root'@'localhost'"

**Solution:**
- Wrong password in `.env` file
- Update `DB_PASSWORD` in `backend/.env`
- Or leave blank if MySQL has no password

### phpMyAdmin Not Accessible

**Solution:**
- Check if Apache/Web server is running
- Verify URL: `http://localhost/phpmyadmin`
- Check port: Some setups use `http://localhost:8080/phpmyadmin`

---

## ✅ Verification Checklist

- [ ] MySQL service is running
- [ ] phpMyAdmin is accessible
- [ ] Database `attendance_system` created
- [ ] `backend/.env` file configured
- [ ] Test connection script passes
- [ ] Backend server starts without errors
- [ ] Tables appear in phpMyAdmin
- [ ] Sample data visible in `employees` table

---

## 🚀 Quick Start Commands

```bash
# 1. Test database connection
cd backend
python test_connection.py

# 2. Start backend server
uvicorn main:app --reload

# 3. In another terminal, start frontend
cd frontend
npm run dev
```

---

## 📝 Notes

- **Database tables are created automatically** when you first start the backend server
- **Sample data is seeded** on first run (5 employees with attendance records)
- **No manual SQL needed** - SQLAlchemy handles table creation
- **phpMyAdmin is optional** - You can manage database via API or directly in MySQL

---

## 🎯 Next Steps After Setup

1. ✅ Database configured
2. ✅ Backend running
3. ✅ Frontend running
4. 🌐 Access application: http://localhost:5173
5. 📚 API docs: http://localhost:8000/docs
