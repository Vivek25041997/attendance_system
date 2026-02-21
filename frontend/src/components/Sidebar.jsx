import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, FileText } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/attendance', label: 'Attendance', icon: Clock },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-600 via-indigo-600 to-purple-700 shadow-2xl z-40 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AttendancePro</h1>
            <p className="text-xs text-white/70">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                active
                  ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg scale-105'
                  : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-105'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-white/70'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-white/80 text-sm font-medium">Version 1.0</p>
          <p className="text-white/60 text-xs mt-1">© 2026 AttendancePro</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
