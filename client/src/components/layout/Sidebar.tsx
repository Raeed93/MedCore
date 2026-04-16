import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // ← ADD THIS
import { Activity, Home, FileText, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/diagnose', icon: Activity, label: 'Diagnose' },
    { path: '/dashboard/history', icon: FileText, label: 'History' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? 'bg-white/20 text-white font-semibold'
        : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-gradient-to-b from-red-900 to-red-950 h-screen flex flex-col border-r border-white/10">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-xl font-bold text-white">MedCore AI</h1>
            <p className="text-xs text-white/50">Diagnosis System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass} end>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.email || 'User'}
            </p>
            <p className="text-xs text-white/50">Medical Professional</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-800 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}