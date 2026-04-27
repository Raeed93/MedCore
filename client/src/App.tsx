import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Component } from 'react';
import type { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/layout/landingPage';
import LoginForm from './components/auth/loginForm';
import VerifyEmail from './components/auth/verfyEmail';
import ProtectedRoute from './components/auth/protectedRoute';
import DashboardLayout from './components/layout/dashboardLayout';
import DashboardHome from './components/layout/dashboardHome';
import PatientManager from './components/patientManager';
import HistoryPage from './components/layout/historyPage';
import ProfilePage from './components/layout/profilePage';

// ── Error Boundary ──────────────────────────────────────────────────────────
// Catches any unhandled render errors so the whole app doesn't go blank.
// Class component required — React error boundaries can't be function components.

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you'd send this to a logging service like Sentry
    console.error('App error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#f5ebe8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 440,
              width: '100%',
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.65)',
              borderRadius: 16,
              padding: '40px 36px',
              textAlign: 'center',
            }}
          >
            {/* Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"
              width={40} height={40} style={{ marginBottom: 20 }}>
              <defs>
                <mask id="eb-ring">
                  <rect width="48" height="48" fill="white" />
                  <rect x="3" y="22" width="8" height="4" fill="black" />
                  <rect x="37" y="22" width="8" height="4" fill="black" />
                </mask>
              </defs>
              <circle cx="24" cy="24" r="18" stroke="#7F1D1D" strokeWidth="2.5"
                fill="none" mask="url(#eb-ring)" />
              <path d="M2 24 L17 24 L20 17 L24 31 L28 19 L31 24 L46 24"
                stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" fill="none" />
            </svg>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                fontWeight: 700,
                color: '#2a0a0a',
                marginBottom: 8,
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: 13,
                color: '#7a4a4a',
                fontWeight: 300,
                lineHeight: 1.65,
                marginBottom: 24,
              }}
            >
              An unexpected error occurred. Please refresh the page or return home.
              If the problem persists, contact support.
            </p>

            {/* Error detail — only shown in development */}
            {import.meta.env.DEV && this.state.message && (
              <div
                style={{
                  background: 'rgba(127,29,29,0.05)',
                  border: '1px solid rgba(127,29,29,0.15)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 20,
                  textAlign: 'left',
                }}
              >
                <p style={{ fontSize: 11, color: '#7F1D1D', fontFamily: 'monospace', margin: 0 }}>
                  {this.state.message}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#7F1D1D',
                  color: '#f5ebe8',
                  border: 'none',
                  padding: '11px 22px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Refresh page
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                style={{
                  background: 'transparent',
                  color: '#7F1D1D',
                  border: '1.5px solid rgba(127,29,29,0.3)',
                  padding: '10px 22px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ── App ─────────────────────────────────────────────────────────────────────

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/verify" element={<VerifyEmail />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="diagnose" element={<PatientManager />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;