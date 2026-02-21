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
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int

    class Config:
        from_attributes = True

class AttendanceWithEmployee(Attendance):
    employee: Employee
