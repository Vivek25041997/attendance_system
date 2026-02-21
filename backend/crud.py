from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, func
from datetime import date, datetime, time, timedelta
from typing import Optional, Tuple
from models import Employee, Attendance
from schemas import EmployeeCreate, AttendanceCreate, CheckInResponse, CheckOutResponse


# Standard working hours configuration
STANDARD_WORKING_HOURS = 9.0
LATE_THRESHOLD_HOUR = 9  # 9:30 AM
LATE_THRESHOLD_MINUTE = 30


def calculate_status(check_in: Optional[datetime]) -> str:
    """
    Calculate attendance status based on check-in time.
    
    Rules:
    - Before 9:30 AM → "Present"
    - After 9:30 AM → "Late"
    - No check-in → "Absent"
    """
    if check_in is None:
        return "Absent"
    
    check_in_time = check_in.time()
    late_threshold = time(LATE_THRESHOLD_HOUR, LATE_THRESHOLD_MINUTE)  # 9:30 AM
    
    if check_in_time <= late_threshold:
        return "Present"
    else:
        return "Late"


def calculate_hours(check_in: datetime, check_out: datetime) -> Tuple[float, float]:
    """
    Calculate total hours and overtime hours.
    
    Returns:
        Tuple of (total_hours, overtime_hours)
    """
    duration = check_out - check_in
    total_hours = duration.total_seconds() / 3600  # Convert to hours
    
    if total_hours <= STANDARD_WORKING_HOURS:
        overtime_hours = 0.0
    else:
        overtime_hours = total_hours - STANDARD_WORKING_HOURS
    
    return round(total_hours, 2), round(overtime_hours, 2)


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
    attendance_dict = attendance.dict()
    check_in = attendance_dict.get('check_in')
    calculated_status = calculate_status(check_in)
    attendance_dict['status'] = calculated_status
    
    db_attendance = Attendance(**attendance_dict)
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

def get_attendance_by_employee_and_date(db: Session, employee_id: int, attendance_date: date):
    return db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.date == attendance_date
    ).first()

# Check-in function
def check_in_employee(db: Session, employee_id: int) -> CheckInResponse:
    """
    Check in an employee for today.
    
    Validation:
    - Prevent multiple check-ins on same day
    - Check if employee exists
    """
    # Verify employee exists
    employee = get_employee(db, employee_id)
    if not employee:
        raise ValueError("Employee not found")
    
    today = date.today()
    now = datetime.now()
    
    # Check if already checked in today
    existing = get_attendance_by_employee_and_date(db, employee_id, today)
    if existing:
        if existing.check_in:
            raise ValueError("Already checked in today")
    
    # Calculate status based on check-in time
    status = calculate_status(now)
    
    if existing:
        # Update existing record
        existing.check_in = now
        existing.status = status
        db.commit()
        db.refresh(existing)
        
        return CheckInResponse(
            employee_id=employee_id,
            date=today,
            check_in=now,
            status=status,
            message=f"Checked in successfully at {now.strftime('%H:%M:%S')}"
        )
    else:
        # Create new attendance record
        new_attendance = Attendance(
            employee_id=employee_id,
            date=today,
            check_in=now,
            status=status
        )
        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)
        
        return CheckInResponse(
            employee_id=employee_id,
            date=today,
            check_in=now,
            status=status,
            message=f"Checked in successfully at {now.strftime('%H:%M:%S')}"
        )

# Check-out function
def check_out_employee(db: Session, employee_id: int) -> CheckOutResponse:
    """
    Check out an employee for today.
    
    Validation:
    - Prevent checkout without check-in
    - Prevent double checkout
    """
    # Verify employee exists
    employee = get_employee(db, employee_id)
    if not employee:
        raise ValueError("Employee not found")
    
    today = date.today()
    now = datetime.now()
    
    # Check if attendance exists for today
    existing = get_attendance_by_employee_and_date(db, employee_id, today)
    if not existing:
        raise ValueError("No check-in record found for today. Please check in first.")
    
    if not existing.check_in:
        raise ValueError("No check-in record found. Please check in first.")
    
    if existing.check_out:
        raise ValueError("Already checked out today")
    
    # Calculate hours
    total_hours, overtime_hours = calculate_hours(existing.check_in, now)
    
    # Update attendance record
    existing.check_out = now
    existing.total_hours = total_hours
    existing.overtime_hours = overtime_hours
    
    db.commit()
    db.refresh(existing)
    
    return CheckOutResponse(
        employee_id=employee_id,
        date=today,
        check_in=existing.check_in,
        check_out=now,
        total_hours=total_hours,
        overtime_hours=overtime_hours,
        status=existing.status,
        message=f"Checked out successfully. Total hours: {total_hours}, Overtime: {overtime_hours}"
    )

# Get total overtime for today
def get_today_overtime(db: Session) -> float:
    """Get total overtime hours for today."""
    today = date.today()
    result = db.query(func.sum(Attendance.overtime_hours)).filter(
        Attendance.date == today,
        Attendance.overtime_hours.isnot(None)
    ).scalar()
    return round(result or 0.0, 2)
