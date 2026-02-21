from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import List

from database import engine, get_db, Base
# Import SQLAlchemy models
from models import Employee, Attendance
# Import Pydantic schemas - use alias to avoid naming conflict
from schemas import EmployeeCreate, AttendanceCreate, AttendanceWithEmployee
from schemas import Employee as EmployeeResponse, Attendance as AttendanceResponse
from crud import (
    create_employee, get_employees, get_employee,
    create_attendance, get_attendances, get_attendance_by_employee,
    get_today_attendance
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Office Attendance System API")

# Enable CORS - allow both frontend ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed data function
def seed_data():
    db = next(get_db())
    try:
        # Check if data already exists
        if db.query(Employee).count() > 0:
            return
        
        # Create sample employees
        employees_data = [
            {"name": "John Doe", "email": "john.doe@company.com", "department": "Engineering"},
            {"name": "Jane Smith", "email": "jane.smith@company.com", "department": "Marketing"},
            {"name": "Bob Johnson", "email": "bob.johnson@company.com", "department": "Sales"},
            {"name": "Alice Williams", "email": "alice.williams@company.com", "department": "HR"},
            {"name": "Charlie Brown", "email": "charlie.brown@company.com", "department": "Engineering"},
        ]
        
        employees = []
        for emp_data in employees_data:
            employee = Employee(**emp_data)
            db.add(employee)
            employees.append(employee)
        
        db.commit()
        
        # Refresh to get IDs
        for emp in employees:
            db.refresh(emp)
        
        # Create sample attendance for today
        today = date.today()
        from datetime import timedelta
        check_in_time = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)
        check_out_time = datetime.now().replace(hour=18, minute=0, second=0, microsecond=0)
        
        # Mark first 3 employees as present
        for i, emp in enumerate(employees[:3]):
            attendance = Attendance(
                employee_id=emp.id,
                date=today,
                check_in=check_in_time + timedelta(minutes=i*5),
                check_out=check_out_time,
                status="Present"
            )
            db.add(attendance)
        
        # Mark 4th employee as late
        attendance = Attendance(
            employee_id=employees[3].id,
            date=today,
            check_in=check_in_time + timedelta(hours=1),
            check_out=check_out_time,
            status="Late"
        )
        db.add(attendance)
        
        # Mark 5th employee as absent
        attendance = Attendance(
            employee_id=employees[4].id,
            date=today,
            check_in=None,
            check_out=None,
            status="Absent"
        )
        db.add(attendance)
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

# Seed data on startup
@app.on_event("startup")
async def startup_event():
    seed_data()

# Employee Routes
@app.post("/employees/", response_model=EmployeeResponse)
def create_employee_endpoint(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(Employee).filter(Employee.email == employee.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_employee(db=db, employee=employee)

@app.get("/employees/", response_model=List[EmployeeResponse])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = get_employees(db, skip=skip, limit=limit)
    return employees

@app.get("/employees/{employee_id}", response_model=EmployeeResponse)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = get_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

# Attendance Routes
@app.post("/attendance/", response_model=AttendanceResponse)
def create_attendance_endpoint(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    # Verify employee exists
    employee = get_employee(db, employee_id=attendance.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if attendance already exists for this employee and date
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")
    
    return create_attendance(db=db, attendance=attendance)

@app.get("/attendance/", response_model=List[AttendanceWithEmployee])
def read_attendances(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    attendances = get_attendances(db, skip=skip, limit=limit)
    return attendances

@app.get("/attendance/{employee_id}", response_model=List[AttendanceResponse])
def read_attendance_by_employee(employee_id: int, db: Session = Depends(get_db)):
    attendances = get_attendance_by_employee(db, employee_id=employee_id)
    return attendances

@app.get("/attendance/today/stats")
def get_today_stats(db: Session = Depends(get_db)):
    today_attendance = get_today_attendance(db)
    total_employees = db.query(Employee).count()
    
    present_count = sum(1 for a in today_attendance if a.status == "Present")
    absent_count = sum(1 for a in today_attendance if a.status == "Absent")
    late_count = sum(1 for a in today_attendance if a.status == "Late")
    
    return {
        "total_employees": total_employees,
        "present_today": present_count,
        "absent_today": absent_count,
        "late_today": late_count,
        "today_attendance": [
            {
                "id": a.id,
                "employee_id": a.employee_id,
                "employee_name": a.employee.name,
                "date": a.date.isoformat(),
                "check_in": a.check_in.isoformat() if a.check_in else None,
                "check_out": a.check_out.isoformat() if a.check_out else None,
                "status": a.status
            }
            for a in today_attendance
        ]
    }

@app.get("/")
def root():
    return {"message": "Office Attendance System API", "docs": "/docs"}
