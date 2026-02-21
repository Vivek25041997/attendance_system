# Office Attendance System - Documentation

## Project Overview

This is a full-stack Office Attendance System with a FastAPI backend and React frontend. It allows tracking employee attendance with features to mark attendance, view stats, and manage employees.

---

## Backend Documentation

### Tech Stack
- **Framework**: FastAPI
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: Not implemented (simple API)

### Database Schema

#### Employees Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| name | VARCHAR(255) | Employee name |
| email | VARCHAR(255) | Unique email address |
| department | VARCHAR(255) | Department name |

#### Attendance Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| employee_id | INT (FK) | Reference to employees.id |
| date | DATE | Attendance date |
| check_in | DATETIME | Check-in time |
| check_out | DATETIME | Check-out time |
| status | VARCHAR(255) | Present/Absent/Late |

### API Endpoints

#### Base URL
```
http://localhost:8000
```

#### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees/` | Get all employees |
| GET | `/employees/{id}` | Get employee by ID |
| POST | `/employees/` | Create new employee |

**POST `/employees/` Request Body:**
```
json
{
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

#### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance/` | Get all attendance records |
| GET | `/attendance/{employee_id}` | Get attendance by employee |
| GET | `/attendance/today/stats` | Get today's attendance stats |
| POST | `/attendance/` | Mark attendance |

**POST `/attendance/` Request Body:**
```
json
{
  "employee_id": 1,
  "date": "2024-01-15",
  "check_in": "2024-01-15T09:00:00",
  "check_out": "2024-01-15T18:00:00",
  "status": "Present"
}
```

#### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint |
| GET | `/docs` | API documentation (Swagger UI) |

### Running the Backend

```
bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

---

## Frontend Documentation

### Tech Stack
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router

### Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── api.js          # API calls
│   ├── components/
│   │   ├── Navbar.jsx      # Top navigation
│   │   └── Sidebar.jsx    # Side navigation
│   ├── pages/
│   │   ├── Attendance.jsx  # Attendance management
│   │   ├── Dashboard.jsx  # Dashboard with stats
│   │   └── Employees.jsx  # Employee management
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
└── package.json
```

### Pages

#### 1. Dashboard (/)
- Shows today's attendance statistics
- Displays total employees, present, absent, and late counts
- Lists today's attendance with employee names

#### 2. Employees (/employees)
- View all employees in a table
- Add new employees with name, email, and department
- Edit existing employee information

#### 3. Attendance (/attendance)
- View all attendance records
- Mark new attendance with:
  - Employee dropdown (select from list)
  - Date picker
  - Check-in time
  - Check-out time
  - Status (Present/Absent/Late)

### Running the Frontend

```
bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:
- http://localhost:5173 (or next available port)

### API Configuration

The frontend API is configured in `frontend/src/api/api.js`:

```
javascript
const API_BASE_URL = 'http://localhost:8000';
```

---

## Setup Instructions

### Prerequisites
- Node.js (for frontend)
- Python 3.8+ (for backend)
- MySQL/MariaDB

### Quick Start

1. **Start MySQL** and create the database:
   
```
bash
   # Run in phpMyAdmin or MySQL:
   CREATE DATABASE attendance_system CHARACTER SET utf8mb4;
   
```

2. **Configure backend** - Edit `backend/.env`:
   
```
env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=attendance_system
   
```

3. **Start backend**:
   
```
bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   
```

4. **Start frontend**:
   
```
bash
   cd frontend
   npm install
   npm run dev
   
```

5. **Open browser** at the URL shown (usually http://localhost:5173)

---

## Features

- ✅ View dashboard with today's attendance stats
- ✅ Add/View employees
- ✅ Mark attendance with date, time, and status
- ✅ View attendance history
- ✅ Automatic data seeding on first run
- ✅ Responsive design with Tailwind CSS
