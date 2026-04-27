import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Home, FileText, User, LogOut, X } from 'lucide-react';

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width={24} height={24}>
    <defs>
      <mask id="sb-ring">
        <rect width="48" height="48" fill="white" />
        <rect x="3" y="22" width="8" height="4" fill="black" />
        <rect x="37" y="22" width="8" height="4" fill="black" />
      </mask>
    </defs>
    <circle cx="24" cy="24" r="18" stroke="#7F1D1D" strokeWidth="2.5" fill="none" mask="url(#sb-ring)" />
    <path d="M2 24 L17 24 L20 17 L24 31 L28 19 L31 24 L46 24"
      stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard',          icon: Home,     label: 'Home'     },
    { path: '/dashboard/diagnose', icon: Activity,  label: 'Diagnose' },
    { path: '/dashboard/history',  icon: FileText,  label: 'History'  },
    { path: '/dashboard/profile',  icon: User,      label: 'Profile'  },
  ];

  return (
    <div
      className="w-56 h-screen flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(255,255,255,0.65)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .sb-link { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:9px; font-size:13px; font-weight:400; color:#6a3a3a; text-decoration:none; transition:background 0.15s,color 0.15s; border:1px solid transparent; }
        .sb-link:hover { background:rgba(127,29,29,0.06); color:#7F1D1D; }
        .sb-link.active { background:rgba(127,29,29,0.1); color:#7F1D1D; font-weight:500; border-color:rgba(127,29,29,0.12); }
        .sb-signout:hover { background:rgba(127,29,29,0.06)!important; color:#7F1D1D!important; }
      `}</style>

      {/* Logo row */}
      <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(127,29,29,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <Logo />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: '#7F1D1D', lineHeight: 1.2 }}>Pulse AI</div>
            <div className="text-xs font-light" style={{ color: '#9a6060' }}>Clinical Intelligence</div>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg"
            style={{ color: '#7a4a4a', background: 'rgba(127,29,29,0.05)' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <div className="text-xs font-semibold tracking-widest px-3.5 pb-2" style={{ color: '#c4a0a0' }}>NAVIGATION</div>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path} to={path} end={path === '/dashboard'}
            className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(127,29,29,0.08)' }}>
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1"
          style={{ background: 'rgba(127,29,29,0.05)', border: '1px solid rgba(127,29,29,0.08)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(127,29,29,0.1)' }}
          >
            <User size={13} color="#7F1D1D" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: '#2a0a0a' }}>{user?.email || 'User'}</p>
            <p className="text-xs font-light" style={{ color: '#9a6060' }}>Medical Professional</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="sb-signout w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#7a4a4a' }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  );
}