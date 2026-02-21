from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from datetime import date, datetime
from models import Employee, Attendance
from schemas import EmployeeCreate, AttendanceCreate

# Employee CRUD
def create_employee(db: Session, employee: EmployeeCreate):
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Employee).offset(skip).limit(limit).all()

def get_employee(db: Session, employee_id: int):
    return db.query(Employee).filter(Employee.id == employee_id).first()

# Attendance CRUD
def create_attendance(db: Session, attendance: AttendanceCreate):
    db_attendance = Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_attendances(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Attendance).options(joinedload(Attendance.employee)).offset(skip).limit(limit).all()

def get_attendance_by_employee(db: Session, employee_id: int):
    return db.query(Attendance).filter(Attendance.employee_id == employee_id).all()

def get_attendance_by_date(db: Session, attendance_date: date):
    return db.query(Attendance).filter(Attendance.date == attendance_date).all()

def get_today_attendance(db: Session):
    today = date.today()
    return db.query(Attendance).options(joinedload(Attendance.employee)).filter(Attendance.date == today).all()
