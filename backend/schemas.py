from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

# Employee Schemas
class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None

class AttendanceCreate(AttendanceBase):
    """Schema for creating attendance - status is calculated automatically by backend"""
    pass

class Attendance(AttendanceBase):
    id: int
    total_hours: Optional[float] = None
    overtime_hours: Optional[float] = None
    status: str

    class Config:
        from_attributes = True

class AttendanceWithEmployee(Attendance):
    employee: Employee

# Check-in/Check-out Response Schemas
class CheckInResponse(BaseModel):
    employee_id: int
    date: date
    check_in: datetime
    status: str
    message: str

class CheckOutResponse(BaseModel):
    employee_id: int
    date: date
    check_in: datetime
    check_out: datetime
    total_hours: float
    overtime_hours: float
    status: str
    message: str
