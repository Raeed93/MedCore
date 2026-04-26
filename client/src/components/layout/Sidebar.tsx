import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Home, FileText, User, LogOut } from 'lucide-react';

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width={26} height={26}>
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

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard',          icon: Home,     label: 'Home' },
    { path: '/dashboard/diagnose', icon: Activity,  label: 'Diagnose' },
    { path: '/dashboard/history',  icon: FileText,  label: 'History' },
    { path: '/dashboard/profile',  icon: User,      label: 'Profile' },
  ];

  return (
    <div style={{
      width: 232, height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'rgba(255,255,255,0.45)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255,255,255,0.65)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .sb-link { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:9px; font-size:13.5px; font-weight:400; color:#6a3a3a; text-decoration:none; transition:background 0.15s, color 0.15s; }
        .sb-link:hover { background:rgba(127,29,29,0.06); color:#7F1D1D; }
        .sb-link.active { background:rgba(127,29,29,0.1); color:#7F1D1D; font-weight:500; border:1px solid rgba(127,29,29,0.12); }
        .sb-link:not(.active) { border:1px solid transparent; }
        .sb-signout:hover { background:rgba(127,29,29,0.06) !important; color:#7F1D1D !important; }
      `}</style>

      {/* Logo */}
      <div style={{ padding:'22px 20px', borderBottom:'1px solid rgba(127,29,29,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Logo />
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:'#7F1D1D', lineHeight:1.2 }}>MedCore AI</div>
            <div style={{ fontSize:10, color:'#9a6060', fontWeight:300 }}>Clinical Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:3 }}>
        <div style={{ fontSize:10, fontWeight:600, color:'#c4a0a0', letterSpacing:'0.08em', padding:'4px 14px 10px', textTransform:'uppercase' }}>Navigation</div>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} end={path === '/dashboard'}
            className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding:'12px 10px', borderTop:'1px solid rgba(127,29,29,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 12px', background:'rgba(127,29,29,0.05)', borderRadius:9, marginBottom:6, border:'1px solid rgba(127,29,29,0.08)' }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(127,29,29,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <User size={13} color="#7F1D1D" />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:12, fontWeight:500, color:'#2a0a0a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', margin:0 }}>
              {user?.email || 'User'}
            </p>
            <p style={{ fontSize:10, color:'#9a6060', margin:0, fontWeight:300 }}>Medical Professional</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="sb-signout" style={{
          width:'100%', display:'flex', alignItems:'center', gap:9, padding:'10px 14px',
          borderRadius:9, border:'none', background:'transparent', fontSize:13.5,
          color:'#7a4a4a', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'background 0.15s, color 0.15s',
        }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}