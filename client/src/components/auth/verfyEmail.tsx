import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Logo from '../Logo';

const REDIRECT_MS = 2000;

// The three failures are different problems with different fixes, and the
// old screen titled all of them "Link expired" — telling someone with a
// network fault to request a new link, which would not have helped.
type Failure = 'missing' | 'invalid' | 'network';

const FAILURE_COPY: Record<Failure, { title: string; canRetry: boolean }> = {
  missing: { title: 'This link is incomplete', canRetry: true },
  invalid: { title: 'This link has expired',   canRetry: true },
  network: { title: 'Could not reach us',      canRetry: false },
};

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [failure, setFailure] = useState<Failure>('invalid');
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
      setFailure('missing');
      setMessage('The address is missing its sign-in token. Request a new link and open it directly from your email.');
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify?token=${encodeURIComponent(token)}`,
        { credentials: 'include' }
      );
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        login(data.user);
        setStatus('success');
        setMessage('Taking you to your dashboard…');
        setTimeout(() => navigate('/dashboard'), REDIRECT_MS);
      } else {
        setStatus('error');
        setFailure('invalid');
        setMessage(data.message || 'Sign-in links last 15 minutes and work once. Request a new one to continue.');
      }
    } catch {
      setStatus('error');
      setFailure('network');
      setMessage('Check your connection and reload this page. Your link is still valid.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">

      <div className="flex items-center gap-2.5" style={{ marginBottom: 36 }}>
        <Logo size={26} />
        <span className="wordmark" style={{ fontSize: 19 }}>Pulse AI</span>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 40, textAlign: 'center' }}>

        {status === 'verifying' && (
          <div className="fade-in flex flex-col items-center">
            <Loader2 size={26} className="spin" style={{ color: 'var(--color-brand)', marginBottom: 22 }} />
            <h1 className="display-md" style={{ marginBottom: 8 }}>Signing you in</h1>
            <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', lineHeight: 1.65 }}>
              Checking your link. This takes a second.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="fade-in flex flex-col items-center">
            <CheckCircle size={26} style={{ color: 'var(--color-ok)', marginBottom: 22 }} />
            <h1 className="display-md" style={{ marginBottom: 8 }}>You&rsquo;re in</h1>
            <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', lineHeight: 1.65, marginBottom: 26 }}>
              {message}
            </p>
            <div className="progress-track">
              <div className="progress-bar" style={{ ['--progress-duration' as string]: `${REDIRECT_MS}ms` }} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="fade-in flex flex-col items-center">
            <XCircle size={26} style={{ color: 'var(--color-alert)', marginBottom: 22 }} />
            <h1 className="display-md" style={{ marginBottom: 8 }}>
              {FAILURE_COPY[failure].title}
            </h1>
            <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', lineHeight: 1.65, marginBottom: 28, maxWidth: '38ch' }}>
              {message}
            </p>

            <div className="flex flex-col gap-2.5 w-full">
              {FAILURE_COPY[failure].canRetry ? (
                <button className="btn" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate('/login')}>
                  Request a new link <ArrowRight size={14} />
                </button>
              ) : (
                <button className="btn" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => window.location.reload()}>
                  Try again
                </button>
              )}
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/')}>
                Back to home
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="meta" style={{ marginTop: 28, textAlign: 'center', maxWidth: 320, lineHeight: 1.7 }}>
        Sign-in links expire after 15 minutes and can only be used once.
      </p>
    </div>
  );
}