import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
        <Sidebar />
        <Navbar />
        <main className="ml-64 pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p className="text-gray-500">Coming soon...</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
