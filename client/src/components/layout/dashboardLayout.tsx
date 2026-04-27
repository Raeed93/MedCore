import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width={22} height={22}>
    <defs>
      <mask id="mh-ring">
        <rect width="48" height="48" fill="white" />
        <rect x="3" y="22" width="8" height="4" fill="black" />
        <rect x="37" y="22" width="8" height="4" fill="black" />
      </mask>
    </defs>
    <circle cx="24" cy="24" r="18" stroke="#7F1D1D" strokeWidth="2.5" fill="none" mask="url(#mh-ring)" />
    <path d="M2 24 L17 24 L20 17 L24 31 L28 19 L31 24 L46 24"
      stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f5ebe8' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(42,10,10,0.35)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        transform transition-transform duration-250 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" style={{ background: '#f5ebe8' }}>

        {/* Mobile top bar */}
        <div
          className="flex md:hidden items-center gap-3 px-5 py-4 sticky top-0 z-30"
          style={{
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.6)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg"
            style={{ background: 'rgba(127,29,29,0.07)', border: '1px solid rgba(127,29,29,0.12)' }}
          >
            <Menu size={18} color="#7F1D1D" />
          </button>
          <div className="flex items-center gap-2">
            <Logo />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: '#7F1D1D' }}>
              Pulse AI
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="px-5 py-6 md:px-10 md:py-9">
          <Outlet />
        </div>
      </main>
    </div>
  );
}