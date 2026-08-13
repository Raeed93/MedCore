import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, AlertTriangle, ClipboardList,
  MessageSquareText, Stethoscope, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HistoryRecord {
  id: number;
  symptoms: string;
  created_at: string;
}

// A real sequence — describe, then read, then talk to a clinician. Order
// carries information the reader needs, which is what earns the numbering.
const STEPS = [
  {
    n: '01',
    icon: ClipboardList,
    title: 'Describe what you feel',
    body: 'Plain language is fine. No medical vocabulary needed.',
  },
  {
    n: '02',
    icon: MessageSquareText,
    title: 'Read the explanation',
    body: 'What these symptoms commonly relate to, drawn from public health literature, with the sources listed.',
  },
  {
    n: '03',
    icon: Stethoscope,
    title: 'Bring it to your doctor',
    body: 'Walk in able to describe what is happening and ask better questions.',
  },
];

const EMERGENCY = [
  'Chest pain or pressure',
  'Difficulty breathing',
  'Sudden weakness or slurred speech',
  'Bleeding that will not stop',
  'Sudden confusion or fainting',
  'Thoughts of harming yourself',
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recent, setRecent] = useState<HistoryRecord[]>([]);

  // Recent checks are supporting detail. If the request fails the empty
  // state covers it — a broken side panel should not take over the page.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diagnosis-history`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        setRecent((data.history || []).slice(0, 4));
      } catch {
        // Empty state covers it.
      }
    })();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div>
      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <div className="eyebrow" style={{ marginBottom: 12 }}>{greeting}</div>
      <h2 className="display-lg" style={{ marginBottom: 32 }}>{firstName}</h2>

      {/* ── Primary action ───────────────────────────────────────────────
          A white card, not a filled oxblood panel. The emergency notice
          below is the one red block on this page — if the hero were also
          red, the warning would read as decoration. */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: 'clamp(28px, 5vw, 44px)' }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Symptom check</div>
          <h3 className="display-md" style={{ marginBottom: 14, maxWidth: '18ch' }}>
            Walk into your appointment knowing what to ask.
          </h3>
          <p className="lede" style={{ fontSize: 14, marginBottom: 28, maxWidth: '52ch' }}>
            Describe your symptoms and get a plain-language explanation of what
            they commonly relate to. This is preparation for a doctor&rsquo;s
            visit — not a diagnosis, and not a substitute for one.
          </p>
          <button className="btn" onClick={() => navigate('/dashboard/diagnose')}>
            Start a symptom check <ArrowRight size={14} />
          </button>
        </div>

        {/* The signature motif: the logo's waveform as a full-bleed rule
            closing the card. */}
        <svg className="ecg-rule" viewBox="0 0 900 24" preserveAspectRatio="none"
          style={{ height: 28 }} aria-hidden="true">
          <path d="M0 12 L560 12 L572 2 L584 22 L596 6 L608 12 L900 12" />
        </svg>
      </div>

      {/* ── Emergency ────────────────────────────────────────────────────
          Directly under the action, on purpose: the moment someone decides
          to use the tool is the moment they need to know when not to. */}
      <div className="notice-emergency" style={{ marginBottom: 20 }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={17} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Do not use this tool in an emergency
            </p>
            <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.6, opacity: 0.85, marginBottom: 14 }}>
              Call your local emergency number or go to the nearest emergency
              department if you have any of these:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1.5"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {EMERGENCY.map(item => (
                <li key={item} style={{ fontSize: 13, fontWeight: 300, opacity: 0.92 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Steps + recent ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

        <div className="card lg:col-span-3">
          <h3 className="card-heading">How it works</h3>
          <div className="flex flex-col">
            {STEPS.map(({ n, icon: Icon, title, body }, i) => (
              <div key={n} className="flex gap-4"
                style={{
                  paddingTop: i === 0 ? 4 : 18,
                  paddingBottom: 18,
                  borderBottom: i < STEPS.length - 1 ? '1px solid var(--color-rule)' : 'none',
                }}>
                <Icon size={15} style={{ color: 'var(--color-faint)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="flex items-baseline gap-2.5" style={{ marginBottom: 5 }}>
                    <span className="eyebrow">{n}</span>
                    <h4 style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink)' }}>{title}</h4>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.65, color: 'var(--color-muted)' }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <h3 className="card-heading" style={{ marginBottom: 0 }}>Recent checks</h3>
            {recent.length > 0 && (
              <button className="btn-text inline-flex items-center gap-1"
                onClick={() => navigate('/dashboard/history')}>
                All <ChevronRight size={12} />
              </button>
            )}
          </div>

          {recent.length === 0 ? (
            // An empty screen is an invitation to act, not an apology.
            <div>
              <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.65, color: 'var(--color-muted)', marginBottom: 16 }}>
                Nothing here yet. Your past checks will be saved so you can look
                back at them before an appointment.
              </p>
              <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13 }}
                onClick={() => navigate('/dashboard/diagnose')}>
                Run your first check
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {recent.map((r, i) => (
                <button key={r.id}
                  onClick={() => navigate('/dashboard/history')}
                  style={{
                    textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '12px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--color-rule)',
                  }}>
                  <p style={{
                    fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5, marginBottom: 4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {r.symptoms}
                  </p>
                  <span className="meta">
                    {new Date(r.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="rule" style={{ margin: '40px 0 18px' }} />
      <p className="meta" style={{ lineHeight: 1.7, maxWidth: '64ch' }}>
        Pulse AI provides general health education only. It does not diagnose,
        treat, or prescribe. Always consult a licensed clinician about your health.
      </p>
    </div>
  );
}