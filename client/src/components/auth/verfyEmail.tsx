import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const Logo = ({ size = 40, color = '#7F1D1D' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width={size} height={size}>
    <defs>
      <mask id="ve-ring">
        <rect width="48" height="48" fill="white" />
        <rect x="3" y="22" width="8" height="4" fill="black" />
        <rect x="37" y="22" width="8" height="4" fill="black" />
      </mask>
    </defs>
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.5" fill="none" mask="url(#ve-ring)" />
    <path
      d="M2 24 L17 24 L20 17 L24 31 L28 19 L31 24 L46 24"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
  </svg>
);

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token. Please request a new sign-in link.');
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify?token=${token}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (response.ok) {
        login(data.user);
        setStatus('success');
        setMessage('You\'re signed in. Taking you to your dashboard…');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed. This link may have expired.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please check your connection and try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: '#f5ebe8', fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .ve-serif { font-family: 'Playfair Display', serif; }
        @keyframes ve-spin { to { transform: rotate(360deg); } }
        .ve-spin { animation: ve-spin 0.9s linear infinite; }
        @keyframes ve-pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .ve-pulse { animation: ve-pulse 1.8s ease-in-out infinite; }
        @keyframes ve-fade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .ve-fade { animation: ve-fade 0.5s ease forwards; }
        .ve-btn:hover { background: #6b1818 !important; }
        .ve-btn-outline:hover { background: rgba(127,29,29,0.06) !important; }
      `}</style>

      {/* Brand header */}
      <div className="flex items-center gap-2.5 mb-10">
        <Logo size={30} />
        <span className="ve-serif font-bold text-lg" style={{ color: '#7F1D1D' }}>Pulse AI</span>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8 md:p-10 text-center"
        style={{
          background: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.65)',
        }}
      >

        {/* ── VERIFYING ── */}
        {status === 'verifying' && (
          <div className="ve-fade flex flex-col items-center">
            {/* Animated ECG + spinner combo */}
            <div className="relative mb-6">
              <div className="ve-pulse opacity-20 mb-2">
                <svg viewBox="0 0 120 32" fill="none" style={{ width: 120 }}>
                  <path
                    d="M0 16 L24 16 L32 3 L38 29 L44 8 L50 16 L120 16"
                    stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Loader2
                size={36}
                className="ve-spin mx-auto"
                style={{ color: '#7F1D1D' }}
              />
            </div>
            <h2 className="ve-serif font-bold mb-2" style={{ fontSize: 22, color: '#2a0a0a' }}>
              Verifying your link
            </h2>
            <p className="text-sm font-light leading-relaxed" style={{ color: '#7a4a4a' }}>
              Please wait while we securely sign you in…
            </p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {status === 'success' && (
          <div className="ve-fade flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(22,101,52,0.08)', border: '1px solid rgba(22,101,52,0.2)' }}
            >
              <CheckCircle size={32} color="#166534" />
            </div>
            <h2 className="ve-serif font-bold mb-2" style={{ fontSize: 22, color: '#2a0a0a' }}>
              You're signed in!
            </h2>
            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: '#7a4a4a' }}>
              {message}
            </p>
            {/* Progress bar */}
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 3, background: 'rgba(22,101,52,0.12)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  background: '#166534',
                  width: '100%',
                  animation: 'progress 2s linear forwards',
                }}
              />
            </div>
            <style>{`
              @keyframes progress { from { width:0%; } to { width:100%; } }
            `}</style>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <div className="ve-fade flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(127,29,29,0.07)', border: '1px solid rgba(127,29,29,0.18)' }}
            >
              <XCircle size={32} color="#7F1D1D" />
            </div>
            <h2 className="ve-serif font-bold mb-2" style={{ fontSize: 22, color: '#2a0a0a' }}>
              Link expired
            </h2>
            <p className="text-sm font-light leading-relaxed mb-7" style={{ color: '#7a4a4a' }}>
              {message}
            </p>
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => navigate('/login')}
                className="ve-btn w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{ background: '#7F1D1D', color: '#f5ebe8', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
              >
                Request a new link <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/')}
                className="ve-btn-outline w-full py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'transparent', color: '#7F1D1D', border: '1.5px solid rgba(127,29,29,0.3)', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-center font-light" style={{ color: '#9a6060', maxWidth: 300 }}>
        Sign-in links expire after 15 minutes for security. If yours expired, simply request a new one.
      </p>
    </div>
  );
}