import { useState } from 'react';
import { Mail, Loader2, ArrowRight } from 'lucide-react';

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
      const response = await fetch('http://localhost:3000/auth/send-magic-link', {
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
    <div style={{ minHeight:'100vh', display:'flex', background:'#f5ebe8', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .lg-input { width:100%; padding:12px 14px 12px 42px; background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.7); border-radius:9px; font-size:14px; color:#2a0a0a; box-sizing:border-box; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
        .lg-input:focus { border-color:rgba(127,29,29,0.5) !important; box-shadow:0 0 0 3px rgba(127,29,29,0.08); }
        .lg-input::placeholder { color:#9a6060; }
        .lg-submit { width:100%; background:#7F1D1D; color:#f5ebe8; border:none; padding:13px 0; border-radius:9px; font-size:14px; font-weight:500; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.18s; font-family:'DM Sans',sans-serif; }
        .lg-submit:hover:not(:disabled) { background:#6b1818; }
        .lg-submit:disabled { opacity:0.65; cursor:not-allowed; }
        .lg-back:hover { color:#7F1D1D !important; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation:spin 0.8s linear infinite; }
      `}</style>

      {/* LEFT — burgundy branding panel */}
      <div style={{ width:'44%', background:'#7F1D1D', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'44px 48px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Logo size={26} color="#fae0d8" />
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#fae0d8' }}>MedCore AI</span>
        </div>

        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700, color:'#fae0d8', lineHeight:1.2, marginBottom:14 }}>
            Clinical Intelligence<br />at Your Fingertips
          </h2>
          <p style={{ fontSize:14, color:'rgba(250,224,216,0.6)', lineHeight:1.75, fontWeight:300, maxWidth:300 }}>
            Evidence-based diagnostic recommendations powered by advanced AI and the latest medical literature.
          </p>

          {/* ECG decorative */}
          <div style={{ marginTop:44, opacity:0.22 }}>
            <svg viewBox="0 0 320 34" fill="none" style={{ width:'100%' }}>
              <path d="M0 17 L55 17 L70 3 L82 31 L94 7 L106 17 L320 17"
                stroke="#fae0d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop:28, display:'flex', gap:10, flexWrap:'wrap' }}>
            {['HIPAA Compliant','FDA Registered','ISO 27001'].map(b => (
              <div key={b} style={{ background:'rgba(250,224,216,0.1)', border:'1px solid rgba(250,224,216,0.2)', borderRadius:6, padding:'5px 12px', fontSize:11, color:'rgba(250,224,216,0.75)', fontWeight:500 }}>{b}</div>
            ))}
          </div>
        </div>

        <p style={{ fontSize:12, color:'rgba(250,224,216,0.3)' }}>© 2024 MedCore AI. For clinical decision support only.</p>
      </div>

      {/* RIGHT — frosted form panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 52px' }}>
        <div style={{ width:'100%', maxWidth:380 }}>
          {/* Mobile logo row */}
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:40 }}>
            <Logo size={30} />
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:'#7F1D1D' }}>MedCore AI</div>
              <div style={{ fontSize:11, color:'#9a6060' }}>Clinical Intelligence Platform</div>
            </div>
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#2a0a0a', marginBottom:6 }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'#7a4a4a', marginBottom:32, fontWeight:300 }}>Enter your email to receive a secure sign-in link.</p>

          {/* Message */}
          {message && (
            <div style={{
              marginBottom:24, padding:'12px 16px', borderRadius:9, fontSize:13,
              background: message.type === 'success' ? 'rgba(22,101,52,0.07)' : 'rgba(127,29,29,0.07)',
              border: `1px solid ${message.type === 'success' ? 'rgba(22,101,52,0.2)' : 'rgba(127,29,29,0.18)'}`,
              color: message.type === 'success' ? '#166534' : '#7F1D1D',
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleMagicLinkLogin}>
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#3a1a1a', marginBottom:8 }}>Email address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} color="#9a6060" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="doctor@hospital.com" required disabled={isLoading}
                  className="lg-input"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="lg-submit">
              {isLoading
                ? <><div style={{ width:16, height:16, border:'2px solid rgba(250,224,216,0.3)', borderTopColor:'#fae0d8', borderRadius:'50%' }} className="spin" /> Sending magic link...</>
                : <><Mail size={15} /> Send Magic Link <ArrowRight size={14} /></>
              }
            </button>
          </form>

          <p style={{ marginTop:20, fontSize:12, color:'#9a6060', textAlign:'center', lineHeight:1.6 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>

          <div style={{ marginTop:28, textAlign:'center' }}>
            <a href="/" className="lg-back" style={{ fontSize:13, color:'#9a6060', textDecoration:'none', transition:'color 0.15s' }}>← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}