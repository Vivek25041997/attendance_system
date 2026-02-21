import { useState, useEffect } from 'react';
import { getTodayStats, getAttendances, getEmployees } from '../api/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Users, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
    late_today: 0,
    today_attendance: [],
  });
  const [allAttendances, setAllAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
    late_today: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    animateCounters();
  }, [stats]);

  const fetchData = async () => {
    try {
      const [statsRes, attendancesRes, employeesRes] = await Promise.all([
        getTodayStats(),
        getAttendances(),
        getEmployees(),
      ]);
      setStats(statsRes.data);
      setAllAttendances(attendancesRes.data.slice(0, 10));
      setEmployees(employeesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const animateCounters = () => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    Object.keys(stats).forEach((key) => {
      if (key !== 'today_attendance') {
        const target = stats[key];
        const start = animatedStats[key];
        const increment = (target - start) / steps;
        let current = start;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current += increment;
          if (step >= steps) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(current) }));
        }, stepDuration);
      }
    });
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

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const barChartData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        label: "Today's Attendance",
        data: [stats.present_today, stats.absent_today, stats.late_today],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 12 },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const departmentData = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(departmentData),
    datasets: [
      {
        data: Object.values(departmentData),
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
  };

  const kpiCards = [
    {
      title: 'Total Employees',
      value: animatedStats.total_employees,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Present Today',
      value: animatedStats.present_today,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Absent Today',
      value: animatedStats.absent_today,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-50 to-rose-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Late Today',
      value: animatedStats.late_today,
      icon: Clock,
      gradient: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-50 to-amber-50',
      textColor: 'text-yellow-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-50 pt-16 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-2xl`}></div>
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.bgGradient} mb-4`}>
                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-2">{card.title}</p>
                  <p className={`text-4xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance Overview</h2>
            <div className="h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Department Distribution</h2>
            <div className="h-64">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check In</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check Out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.today_attendance.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No attendance records for today
                    </td>
                  </tr>
                ) : (
                  stats.today_attendance.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{record.employee_name}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{formatDate(record.date)}</td>
                      <td className="py-4 px-4 text-gray-600">{formatDateTime(record.check_in)}</td>
                      <td className="py-4 px-4 text-gray-600">{formatDateTime(record.check_out)}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
