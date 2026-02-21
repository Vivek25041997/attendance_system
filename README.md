# Office Attendance System

A full-stack Office Attendance System built with FastAPI (Backend) and React + Vite (Frontend).

## Project Structure

```
office-attendance-system/
│
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # MySQL database setup
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # CRUD operations
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Database configuration
│   └── create_database.sql  # SQL script for database creation
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # React components
│   │   ├── api/             # API service
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json         # Node dependencies
│   └── vite.config.js      # Vite configuration
│
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 16+ and npm
- MySQL/MariaDB Server
- phpMyAdmin (optional, for database management)

## Installation & Setup

### 1. Database Setup (MySQL)

#### Option A: Using phpMyAdmin (Recommended)

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "New" → Create database: `attendance_system`
3. Collation: `utf8mb4_unicode_ci`
4. Click "Create"

See [PHPMYADMIN_SETUP.md](./PHPMYADMIN_SETUP.md) for detailed instructions.

#### Option B: Using MySQL Command Line

```bash
mysql -u root -p
CREATE DATABASE attendance_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure database in `.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=attendance_system
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn main:app --reload
```

The backend API will be available at:
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

**Note**: Tables will be created automatically on first run.

### 3. Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at:
- http://localhost:5173

## Features

### Backend (FastAPI)
- RESTful API endpoints for employees and attendance
- MySQL database with SQLAlchemy ORM
- Automatic database table creation
- CORS enabled for frontend integration
- Pydantic validation for request/response models

### Frontend (React + Vite)
- Modern admin dashboard UI with Tailwind CSS
- Dashboard with statistics and charts
- Employee management (add, view)
- Attendance tracking (mark attendance, view records)
- Responsive design with glassmorphism effects

## API Endpoints

### Employees
- `POST /employees/` - Create a new employee
- `GET /employees/` - Get all employees
- `GET /employees/{id}` - Get employee by ID

### Attendance
- `POST /attendance/` - Mark attendance
- `GET /attendance/` - Get all attendance records
- `GET /attendance/{employee_id}` - Get attendance by employee ID
- `GET /attendance/today/stats` - Get today's attendance statistics

## Usage

1. **Start MySQL/MariaDB Service**
   - Ensure MySQL service is running
   - Access phpMyAdmin to manage database

2. **Start Backend**: Run `uvicorn main:app --reload` in the backend directory

3. **Start Frontend**: Run `npm run dev` in the frontend directory

4. **Access Application**: Open http://localhost:5173 in your browser

### Dashboard
- View total employees count
- View today's attendance statistics (Present, Absent, Late)
- View attendance charts and department distribution

### Employees Page
- Add new employees with name, email, and department
- View list of all employees

### Attendance Page
- Mark attendance for employees
- View all attendance records with check-in/check-out times
- Filter by status (Present, Absent, Late)

## Database Configuration

The application uses MySQL/MariaDB. Configuration is stored in `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=attendance_system
```

## Technologies Used

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy - SQL toolkit and ORM
- MySQL/MariaDB - Relational database
- Pydantic - Data validation
- Uvicorn - ASGI server
- PyMySQL - MySQL driver

### Frontend
- React 18 - UI library
- Vite - Build tool and dev server
- React Router - Routing
- Axios - HTTP client
- Tailwind CSS - Utility-first CSS framework
- Chart.js - Chart library
- Lucide React - Icon library

## Development

### Backend Development
- Database tables are created automatically on first run
- API documentation is available at `/docs` endpoint
- Hot reload is enabled with `--reload` flag
- Use phpMyAdmin to view and manage database

### Frontend Development
- Hot module replacement (HMR) is enabled
- Changes are reflected immediately in the browser
- Build for production: `npm run build`

## Troubleshooting

1. **Database Connection Error**: 
   - Verify MySQL service is running
   - Check credentials in `.env` file
   - Ensure database `attendance_system` exists

2. **Port already in use**: 
   - Change the port in `vite.config.js` (frontend) or use a different port for uvicorn

3. **CORS errors**: 
   - Ensure backend is running and CORS middleware is properly configured

4. **Module not found**: 
   - Ensure all dependencies are installed (`pip install -r requirements.txt` and `npm install`)

5. **Tables not created**: 
   - Check database connection in `.env`
   - Verify user has CREATE TABLE permissions
   - Check backend logs for errors

## Database Management

### Using phpMyAdmin
- Access: http://localhost/phpmyadmin
- Select `attendance_system` database
- View tables: `employees`, `attendance`
- Export/Import: Use phpMyAdmin export/import features

### Backup Database
```bash
mysqldump -u root -p attendance_system > backup.sql
```

### Restore Database
```bash
mysql -u root -p attendance_system < backup.sql
```

## License

This project is open source and available for educational purposes.
