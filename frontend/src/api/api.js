import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee APIs
export const getEmployees = () => api.get('/employees/');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees/', data);

// Attendance APIs
export const getAttendances = () => api.get('/attendance/');
export const getAttendanceByEmployee = (employeeId) => api.get(`/attendance/${employeeId}`);
export const createAttendance = (data) => api.post('/attendance/', data);
export const getTodayStats = () => api.get('/attendance/today/stats');
export const getTodayAttendance = () => api.get('/attendance/today');

// Check-in/Check-out APIs
export const checkIn = (employeeId) => api.post(`/attendance/checkin/${employeeId}`);
export const checkOut = (employeeId) => api.post(`/attendance/checkout/${employeeId}`);
export const getMyTodayAttendance = (employeeId) => api.get(`/attendance/today/my/${employeeId}`);

export default api;
