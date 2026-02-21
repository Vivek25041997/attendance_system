import { useState, useEffect } from 'react';
import { getAttendances, getTodayAttendance, getEmployees, checkIn, checkOut, getMyTodayAttendance } from '../api/api';
import { Clock, LogIn, LogOut, Timer, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [myAttendance, setMyAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (myAttendance?.checked_in && !myAttendance?.checked_out) {
      interval = setInterval(() => {
        const checkInTime = new Date(myAttendance.check_in);
        const now = new Date();
        const diff = Math.floor((now - checkInTime) / 1000);
        setElapsedTime(diff);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [myAttendance]);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const employeesRes = await getEmployees();
      console.log('Employees response:', employeesRes.data);
      
      const attendanceRes = await getAttendances();
      console.log('Attendance response:', attendanceRes.data);
      
      setAttendances(attendanceRes.data);
      setEmployees(employeesRes.data);
      
      if (employeesRes.data && employeesRes.data.length > 0) {
        const firstEmployeeId = employeesRes.data[0].id;
        console.log('Setting selected employee:', firstEmployeeId);
        setSelectedEmployee(firstEmployeeId);
        await fetchMyAttendance(firstEmployeeId);
      } else {
        console.log('No employees found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchMyAttendance = async (employeeId) => {
    try {
      const res = await getMyTodayAttendance(employeeId);
      setMyAttendance(res.data);
    } catch (error) {
      console.error('Error fetching my attendance:', error);
    }
  };

  const handleEmployeeChange = async (e) => {
    const employeeId = parseInt(e.target.value);
    setSelectedEmployee(employeeId);
    await fetchMyAttendance(employeeId);
  };

  const handleCheckIn = async () => {
    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'Please select an employee' });
      return;
    }
    setActionLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await checkIn(selectedEmployee);
      setMessage({ type: 'success', text: res.data.message });
      await fetchMyAttendance(selectedEmployee);
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to check in' });
    }
    setActionLoading(false);
  };

  const handleCheckOut = async () => {
    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'Please select an employee' });
      return;
    }
    setActionLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await checkOut(selectedEmployee);
      setMessage({ type: 'success', text: res.data.message });
      await fetchMyAttendance(selectedEmployee);
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to check out' });
    }
    setActionLoading(false);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeOnly = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatHours = (hours) => {
    if (hours === null || hours === undefined) return 'N/A';
    return `${hours} hrs`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOvertimeBadge = (overtime) => {
    if (overtime && overtime > 0) {
      return (
        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
          Overtime
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
          <p className="text-gray-500 mt-1">Track and manage employee attendance</p>
        </div>
      </div>

      {/* Check In/Out Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/50">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Daily Check In/Out</h2>
        
        {/* Employee Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
          <select
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} - {emp.department}
              </option>
            ))}
          </select>
        </div>

        {/* Live Timer */}
        {myAttendance?.checked_in && !myAttendance?.checked_out && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center justify-center">
              <Timer className="w-8 h-8 mr-3" />
              <div className="text-center">
                <p className="text-purple-100 text-sm font-medium mb-1">Working Duration</p>
                <p className="text-4xl font-bold">{formatTime(elapsedTime)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">Check In</p>
            <p className="text-lg font-semibold text-gray-800">{formatTimeOnly(myAttendance?.check_in)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">Check Out</p>
            <p className="text-lg font-semibold text-gray-800">{formatTimeOnly(myAttendance?.check_out)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">Total Hours</p>
            <p className="text-lg font-semibold text-gray-800">{formatHours(myAttendance?.total_hours)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">Overtime</p>
            <p className="text-lg font-semibold text-gray-800">{formatHours(myAttendance?.overtime_hours)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleCheckIn}
            disabled={actionLoading || myAttendance?.checked_in}
            className={`flex-1 flex items-center justify-center py-4 rounded-xl font-medium transition-all duration-200 ${
              myAttendance?.checked_in
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
            }`}
          >
            <LogIn className="w-5 h-5 mr-2" />
            {actionLoading ? 'Processing...' : 'Check In'}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={actionLoading || !myAttendance?.checked_in || myAttendance?.checked_out}
            className={`flex-1 flex items-center justify-center py-4 rounded-xl font-medium transition-all duration-200 ${
              !myAttendance?.checked_in || myAttendance?.checked_out
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl'
            }`}
          >
            <LogOut className="w-5 h-5 mr-2" />
            {actionLoading ? 'Processing...' : 'Check Out'}
          </button>
        </div>

        {/* Status Badge */}
        {myAttendance?.status && (
          <div className="flex items-center justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(myAttendance.status)}`}>
              {myAttendance.status}
            </span>
            {getOvertimeBadge(myAttendance.overtime_hours)}
          </div>
        )}

        {/* Message */}
        {message.text && (
          <div className={`mt-4 p-4 rounded-xl flex items-center ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            {message.text}
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/50">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overtime
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendances.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendances.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {attendance.employee?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(attendance.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeOnly(attendance.check_in)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeOnly(attendance.check_out)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatHours(attendance.total_hours)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attendance.overtime_hours > 0 ? (
                      <span className="text-sm font-medium text-purple-600">{formatHours(attendance.overtime_hours)}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(attendance.status)}`}>
                      {attendance.status}
                    </span>
                    {attendance.overtime_hours > 0 && (
                      <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        OT
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
