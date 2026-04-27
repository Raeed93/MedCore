import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const Logo = ({ size = 28, color = '#7F1D1D' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width={size} height={size}>
    <defs>
      <mask id="login-ring">
        <rect width="48" height="48" fill="white" />
        <rect x="3" y="22" width="8" height="4" fill="black" />
        <rect x="37" y="22" width="8" height="4" fill="black" />
      </mask>
    </defs>
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.5" fill="none" mask="url(#login-ring)" />
    <path d="M2 24 L17 24 L20 17 L24 31 L28 19 L31 24 L46 24"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send magic link');
      setMessage({ type: 'success', text: 'Magic link sent! Check your email to continue.' });
      setEmail('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to send magic link. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: '#f5ebe8', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .lg-serif { font-family: 'Playfair Display', serif; }
        .lg-input { width:100%; padding:12px 14px 12px 42px; background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.7); border-radius:9px; font-size:14px; color:#2a0a0a; box-sizing:border-box; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.15s,box-shadow 0.15s; }
        .lg-input:focus { border-color:rgba(127,29,29,0.5)!important; box-shadow:0 0 0 3px rgba(127,29,29,0.08); }
        .lg-input::placeholder { color:#9a6060; }
        .lg-submit { width:100%; background:#7F1D1D; color:#f5ebe8; border:none; padding:13px 0; border-radius:9px; font-size:14px; font-weight:500; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.18s; font-family:'DM Sans',sans-serif; }
        .lg-submit:hover:not(:disabled) { background:#6b1818; }
        .lg-submit:disabled { opacity:0.65; cursor:not-allowed; }
        .lg-back:hover { color:#7F1D1D!important; }
        @keyframes lg-spin { to { transform:rotate(360deg); } }
        .lg-spin { animation:lg-spin 0.8s linear infinite; }
      `}</style>

      {/* LEFT — burgundy branding, hidden on mobile */}
      <div
        className="hidden md:flex flex-col justify-between md:w-5/12 lg:w-2/5 p-10 lg:p-12"
        style={{ background: '#7F1D1D' }}
      >
        <div className="flex items-center gap-2">
          <Logo size={24} color="#fae0d8" />
          <span className="lg-serif text-lg font-bold" style={{ color: '#fae0d8' }}>Pulse AI</span>
        </div>

        <div>
          <h2 className="lg-serif font-bold leading-snug mb-3" style={{ fontSize: 'clamp(26px,3vw,34px)', color: '#fae0d8' }}>
            Clinical Intelligence<br />at Your Fingertips
          </h2>
          <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: 'rgba(250,224,216,0.6)' }}>
            Evidence-based diagnostic recommendations powered by advanced AI and the latest medical literature.
          </p>

          {/* ECG decorative */}
          <div className="mt-10 opacity-20">
            <svg viewBox="0 0 320 34" fill="none" className="w-full">
              <path d="M0 17 L55 17 L70 3 L82 31 L94 7 L106 17 L320 17"
                stroke="#fae0d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Trust badges */}
          <div className="mt-7 flex flex-wrap gap-2">
            {['HIPAA Compliant', 'FDA Registered', 'ISO 27001'].map(b => (
              <div key={b} className="text-xs font-medium px-3 py-1 rounded-md"
                style={{ background: 'rgba(250,224,216,0.1)', border: '1px solid rgba(250,224,216,0.2)', color: 'rgba(250,224,216,0.75)' }}>
                {b}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: 'rgba(250,224,216,0.3)' }}>© 2024 Pulse AI. For clinical decision support only.</p>
      </div>

      {/* RIGHT — form panel, full width on mobile */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:px-10 lg:px-16">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <Logo size={28} />
            <div>
              <div className="lg-serif text-base font-bold" style={{ color: '#7F1D1D' }}>Pulse AI</div>
              <div className="text-xs" style={{ color: '#9a6060' }}>Clinical Intelligence Platform</div>
            </div>
          </div>

          {/* Desktop logo row (small) */}
          <div className="hidden md:flex items-center gap-2 mb-8">
            <Logo size={26} />
            <div>
              <div className="lg-serif text-sm font-bold" style={{ color: '#7F1D1D' }}>Pulse AI</div>
              <div className="text-xs" style={{ color: '#9a6060' }}>Clinical Intelligence Platform</div>
            </div>
          </div>

          <h1 className="lg-serif font-bold mb-1.5" style={{ fontSize: 'clamp(22px,4vw,28px)', color: '#2a0a0a' }}>Welcome back</h1>
          <p className="text-sm font-light mb-8" style={{ color: '#7a4a4a' }}>Enter your email to receive a secure sign-in link.</p>

          {/* Message */}
          {message && (
            <div className="mb-6 p-3 rounded-xl text-sm"
              style={{
                background: message.type === 'success' ? 'rgba(22,101,52,0.07)' : 'rgba(127,29,29,0.07)',
                border: `1px solid ${message.type === 'success' ? 'rgba(22,101,52,0.2)' : 'rgba(127,29,29,0.18)'}`,
                color: message.type === 'success' ? '#166534' : '#7F1D1D',
              }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleMagicLinkLogin}>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-2" style={{ color: '#3a1a1a' }}>Email address</label>
              <div className="relative">
                <Mail size={14} color="#9a6060" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="doctor@hospital.com" required disabled={isLoading}
                  className="lg-input"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="lg-submit">
              {isLoading
                ? <><div className="w-4 h-4 rounded-full border-2 border-t-transparent lg-spin" style={{ borderColor: 'rgba(250,224,216,0.3)', borderTopColor: '#fae0d8' }} /> Sending magic link...</>
                : <><Mail size={14} /> Send Magic Link <ArrowRight size={13} /></>
              }
            </button>
          </form>

          <p className="mt-5 text-xs text-center leading-relaxed" style={{ color: '#9a6060' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>

          <div className="mt-7 text-center">
            <a href="/" className="lg-back text-xs transition-colors" style={{ color: '#9a6060', textDecoration: 'none' }}>← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}