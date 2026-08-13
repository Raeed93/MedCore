import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Home, FileText, User, LogOut, X } from 'lucide-react';
import Logo from '../Logo';

interface SidebarProps {
  onClose?: () => void;
}

const NAV = [
  { path: '/dashboard',          icon: Home,     label: 'Home'     },
  { path: '/dashboard/diagnose', icon: Activity, label: 'Check symptoms' },
  { path: '/dashboard/history',  icon: FileText, label: 'History'  },
  { path: '/dashboard/profile',  icon: User,     label: 'Profile'  },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div
      className="w-60 h-screen flex flex-col"
      style={{
        background: 'var(--color-bone)',
        borderRight: '1px solid var(--color-rule)',
      }}
    >
      {/* ── Mark ─────────────────────────────────────────────────────────
          The old subtitle read "Clinical Intelligence", which addressed
          clinicians. This app is for the person with the symptom, and the
          sidebar is the first thing they see after signing in. */}
      <div
        className="flex items-center justify-between px-6 py-6"
        style={{ borderBottom: '1px solid var(--color-rule)' }}
      >
        <div className="flex items-center gap-2.5">
          <Logo size={22} />
          <div>
            <div className="wordmark" style={{ fontSize: 18 }}>Pulse</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>Symptom education</div>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="icon-btn md:hidden" aria-label="Close navigation">
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────
          "Diagnose" is renamed to "Check symptoms". The route stays
          /dashboard/diagnose — this is a label change, not a refactor — but
          the word the user reads should not promise a diagnosis the product
          explicitly does not provide. */}
      <nav className="flex-1 px-6 py-6 flex flex-col gap-0.5">
        {NAV.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Account ──────────────────────────────────────────────────────
          "Medical Professional" was hardcoded under every user's email —
          a claim the app has no basis for and which contradicts the
          consumer framing. Replaced with the account state that is
          actually true: signed in. */}
      <div className="px-6 py-5" style={{ borderTop: '1px solid var(--color-rule)' }}>
        <div className="mb-4">
          <div className="eyebrow" style={{ marginBottom: 6 }}>Signed in</div>
          <p
            className="truncate"
            style={{ fontSize: 13, color: 'var(--color-body)' }}
            title={user?.email || undefined}
          >
            {user?.email || '—'}
          </p>
        </div>

        <button onClick={handleSignOut} className="btn-text inline-flex items-center gap-2">
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </div>
  );
}