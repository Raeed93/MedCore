import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from '../Logo';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // No background declared here. index.css sets it on <body>, so the page
    // ground is defined in exactly one place.
    <div className="flex h-screen overflow-hidden">

      {/* Mobile scrim */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'color-mix(in srgb, var(--color-ink) 32%, transparent)' }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — drawer on mobile, static column on desktop */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-auto
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-y-auto">

        {/* Mobile top bar — solid paper with a hairline, not frosted glass.
            Blur-over-translucency belongs to a different design language than
            the ruled editorial layout the rest of the app now uses. */}
        <div
          className="flex md:hidden items-center gap-3 px-5 py-3.5 sticky top-0 z-30"
          style={{
            background: 'var(--color-bone)',
            borderBottom: '1px solid var(--color-rule)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="icon-btn"
            aria-label="Open navigation"
          >
            <Menu size={17} />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="wordmark" style={{ fontSize: 17 }}>Pulse</span>
          </div>
        </div>

        {/* Page content. The generous desktop inset is doing real work here —
            in an editorial layout the margin is the design. */}
        <div className="px-5 py-7 md:px-12 md:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}