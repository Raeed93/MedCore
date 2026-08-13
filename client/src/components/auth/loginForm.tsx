import { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import Logo from '../Logo';

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
      if (!response.ok) throw new Error(data.message || 'Could not send the link');
      // Says what happened and what to do next, without apologising or
      // going vague about which inbox to check.
      setMessage({ type: 'success', text: `Link sent to ${email}. It expires in 15 minutes.` });
      setEmail('');
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Could not reach the server. Try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Aside ────────────────────────────────────────────────────────
          Previously a filled oxblood panel carrying "Clinical Intelligence
          at Your Fingertips" and three trust badges — HIPAA Compliant, FDA
          Registered, ISO 27001 — none of which the project holds. They are
          gone. What replaces them is the one claim about this page that is
          true and worth making: there is no password. */}
      <aside className="auth-aside hidden md:flex flex-col justify-between md:w-5/12 lg:w-4/12 p-12">
        <div className="flex items-center gap-2.5">
          <Logo size={24} />
          <span className="wordmark" style={{ fontSize: 19 }}>Pulse AI</span>
        </div>

        <div>
          <h2 className="display-lg" style={{ marginBottom: 18 }}>
            No password<br />to forget.
          </h2>
          <p className="lede" style={{ fontSize: 15, maxWidth: '34ch' }}>
            Sign in with a single-use link sent to your email. Nothing to
            remember, and no password stored on our side to leak or reuse.
          </p>

          <svg className="ecg-rule" viewBox="0 0 320 24" style={{ marginTop: 44 }} aria-hidden="true">
            <path d="M0 12 L96 12 L104 2 L112 22 L120 6 L128 12 L320 12" />
          </svg>
        </div>

        <p className="meta">
          Educational project — not medical advice.
        </p>
      </aside>

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-14 md:px-12">
        <div className="w-full" style={{ maxWidth: 380 }}>

          {/* Mobile mark — the aside is hidden below md, so the brand has to
              appear somewhere. */}
          <div className="flex md:hidden items-center gap-2.5 mb-10">
            <Logo size={24} />
            <span className="wordmark" style={{ fontSize: 19 }}>Pulse AI</span>
          </div>

          <div className="eyebrow" style={{ marginBottom: 14 }}>Sign in</div>
          <h1 className="display-md" style={{ marginBottom: 10 }}>Welcome back</h1>
          <p className="lede" style={{ fontSize: 14, marginBottom: 36 }}>
            Enter your email and we&rsquo;ll send you a link to sign in.
          </p>

          {message && (
            <div
              className={`notice ${message.type === 'success' ? 'notice-ok' : 'notice-alert'}`}
              style={{ marginBottom: 28 }}
              role={message.type === 'error' ? 'alert' : 'status'}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleMagicLinkLogin}>
            <label htmlFor="login-email" className="label">Email address</label>
            <div className="field-row" style={{ marginBottom: 32 }}>
              <Mail size={14} />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                // The old placeholder was doctor@hospital.com, which told
                // every visitor this app was meant for someone else.
                placeholder="you@example.com"
                required
                disabled={isLoading}
                autoComplete="email"
                className="field"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn" style={{ width: '100%', justifyContent: 'center' }}>
              {isLoading
                ? <><Loader2 size={14} className="spin" /> Sending link…</>
                : <>Send sign-in link <ArrowRight size={14} /></>}
            </button>
          </form>

          <hr className="rule" style={{ margin: '36px 0 20px' }} />

          <div className="flex items-center justify-between gap-4">
            <a href="/" className="btn-text" style={{ textDecoration: 'none' }}>
              Back to home
            </a>
            <span className="meta">No account needed — the link creates one.</span>
          </div>
        </div>
      </div>
    </div>
  );
}