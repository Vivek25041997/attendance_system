from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False)

    attendances = relationship("Attendance", back_populates="employee")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    check_in = Column(DateTime, nullable=True)
    check_out = Column(DateTime, nullable=True)
    status = Column(String, nullable=False)  # Present / Absent / Late

    employee = relationship("Employee", back_populates="attendances")
