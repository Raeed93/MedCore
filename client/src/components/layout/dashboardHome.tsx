import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Phone, ClipboardList, MessageSquareText,
  Stethoscope, Clock, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── Design tokens ───────────────────────────────────────────────────────────
// Single source of truth for colour. Every value below is used somewhere in
// this file; nothing is defined "just in case".
const T = {
  ink: '#2a0a0a',   // headings
  body: '#5a3a3a',  // paragraph text
  muted: '#7a4a4a', // labels, secondary
  faint: '#9a6060', // captions, meta
  brand: '#7F1D1D', // the one red
  brandDeep: '#6b1818',
  cream: '#f5ebe8', // page background / text on brand
  line: 'rgba(127,29,29,0.10)',
};

const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

interface HistoryRecord {
  id: number;
  symptoms: string;
  created_at: string;
}

// The three steps are a real sequence — you describe, then you read, then you
// talk to a clinician. Ordering carries information, so it's numbered.
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
    body: 'Learn what your symptoms commonly relate to, sourced from medical literature.',
  },
  {
    n: '03',
    icon: Stethoscope,
    title: 'Bring it to your doctor',
    body: 'Walk in able to describe your symptoms clearly and ask better questions.',
  },
];

const RED_FLAGS = [
  'Chest pain or pressure',
  'Difficulty breathing',
  'Sudden weakness or slurred speech',
  'Heavy bleeding that will not stop',
  'Sudden confusion or fainting',
  'Thoughts of harming yourself',
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recent, setRecent] = useState<HistoryRecord[]>([]);

  // Recent checks are a nice-to-have. If the request fails we show the empty
  // state rather than an error banner — a broken sidebar widget shouldn't
  // dominate the page.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diagnosis-history`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        setRecent((data.history || []).slice(0, 3));
      } catch {
        // Silent — empty state covers it.
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
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: T.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .dh-serif { font-family:'Playfair Display', serif; }
        .dh-cta { transition: background 0.18s, transform 0.18s; }
        .dh-cta:hover { background:${T.brandDeep}; transform: translateY(-1px); }
        .dh-cta:focus-visible { outline:2px solid ${T.cream}; outline-offset:3px; }
        .dh-row { transition: background 0.15s; }
        .dh-row:hover { background: rgba(127,29,29,0.04); }
        .dh-link:hover { color:${T.brandDeep}; }
        @media (prefers-reduced-motion: reduce) {
          .dh-cta, .dh-row { transition: none; }
          .dh-cta:hover { transform: none; }
        }
      `}</style>

      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <div className="mb-6 md:mb-8">
        <h2 className="dh-serif font-bold mb-1"
          style={{ fontSize: 'clamp(20px,3vw,26px)', color: T.ink }}>
          {greeting}, {firstName}
        </h2>
        <p className="text-sm font-light" style={{ color: T.muted }}>
          Understand your symptoms before your appointment.
        </p>
      </div>

      {/* ── Hero: the one action this page exists for ─────────────────── */}
      <div className="rounded-2xl p-6 md:p-9 mb-4 md:mb-5 relative overflow-hidden"
        style={{ background: T.brand }}>

        {/* Signature element: the logo's ECG waveform, stretched as a spine
            across the card. Ties the hero to the brand mark. */}
        <svg viewBox="0 0 600 40" fill="none" aria-hidden="true"
          style={{
            position: 'absolute', right: -40, bottom: 12,
            width: 420, opacity: 0.13, pointerEvents: 'none',
          }}>
          <path d="M0 20 L150 20 L172 4 L190 36 L208 8 L226 20 L600 20"
            stroke={T.cream} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div style={{ position: 'relative', maxWidth: 460 }}>
          <div className="inline-flex items-center gap-2 rounded-full mb-5"
            style={{
              background: 'rgba(245,235,232,0.12)',
              border: '1px solid rgba(245,235,232,0.22)',
              padding: '5px 13px',
            }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.cream }} />
            <span className="text-xs font-medium tracking-wide" style={{ color: T.cream }}>
              SYMPTOM EDUCATION
            </span>
          </div>

          <h3 className="dh-serif font-bold mb-3"
            style={{ fontSize: 'clamp(22px,3.4vw,30px)', lineHeight: 1.22, color: T.cream }}>
            Walk into your appointment<br />knowing what to ask.
          </h3>

          <p className="text-sm font-light mb-7"
            style={{ color: 'rgba(245,235,232,0.72)', lineHeight: 1.72 }}>
            Describe your symptoms and get a plain-language explanation of what they
            commonly relate to, drawn from medical literature. This is preparation
            for a doctor&rsquo;s visit — not a diagnosis, and not a substitute for one.
          </p>

          <button
            onClick={() => navigate('/dashboard/diagnose')}
            className="dh-cta rounded-xl inline-flex items-center gap-2"
            style={{
              background: T.cream, color: T.brand, border: 'none',
              padding: '13px 24px', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
            Start a symptom check <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Emergency notice ─────────────────────────────────────────── */}
      {/* Placed directly under the CTA on purpose: the moment someone decides
          to use the tool is the moment they need to know when not to. */}
      <div className="rounded-2xl p-5 md:p-6 mb-4 md:mb-5" style={frosted}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(127,29,29,0.08)' }}>
            <Phone size={15} color={T.brand} />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1" style={{ color: T.ink }}>
              Do not use this tool in an emergency
            </h4>
            <p className="text-xs font-light" style={{ color: T.muted, lineHeight: 1.6 }}>
              Call your local emergency number or go to the nearest emergency
              department if you have any of the following.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 sm:pl-11">
          {RED_FLAGS.map(flag => (
            <div key={flag} className="flex items-center gap-2.5">
              <div className="flex-shrink-0 rounded-full"
                style={{ width: 4, height: 4, background: T.brand }} />
              <span className="text-xs" style={{ color: T.body }}>{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works + Recent ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start">

        {/* Steps */}
        <div className="lg:col-span-2 rounded-2xl p-5 md:p-7" style={frosted}>
          <h3 className="text-sm font-semibold mb-6" style={{ color: T.ink }}>
            How it works
          </h3>

          <div className="flex flex-col gap-5">
            {STEPS.map(({ n, icon: Icon, title, body }, i) => (
              <div key={n} className="flex gap-4">
                {/* Number rail — doubles as the connective line between steps */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(127,29,29,0.07)', border: `1px solid ${T.line}` }}>
                    <Icon size={15} color={T.brand} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 18, background: T.line, marginTop: 6 }} />
                  )}
                </div>

                <div className="pb-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-medium tracking-widest"
                      style={{ color: T.faint }}>{n}</span>
                    <h4 className="text-sm font-medium" style={{ color: T.ink }}>{title}</h4>
                  </div>
                  <p className="text-xs font-light" style={{ color: T.muted, lineHeight: 1.65 }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent checks */}
        <div className="rounded-2xl p-5 md:p-7" style={frosted}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold" style={{ color: T.ink }}>Recent checks</h3>
            {recent.length > 0 && (
              <button onClick={() => navigate('/dashboard/history')}
                className="dh-link text-xs inline-flex items-center gap-0.5"
                style={{ color: T.brand, background: 'none', border: 'none', cursor: 'pointer' }}>
                All <ChevronRight size={12} />
              </button>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: 'rgba(127,29,29,0.06)' }}>
                <Clock size={17} color={T.faint} />
              </div>
              <p className="text-xs font-light mb-4" style={{ color: T.muted, lineHeight: 1.6 }}>
                Your past checks will appear here.
              </p>
              <button onClick={() => navigate('/dashboard/diagnose')}
                className="text-xs font-medium rounded-lg"
                style={{
                  color: T.brand, background: 'transparent',
                  border: `1.5px solid ${T.brand}`, padding: '8px 16px',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}>
                Run your first check
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {recent.map(r => (
                <button key={r.id}
                  onClick={() => navigate('/dashboard/history')}
                  className="dh-row text-left rounded-lg px-2.5 py-3"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${T.line}` }}>
                  <p className="text-xs mb-1 line-clamp-2"
                    style={{ color: T.ink, lineHeight: 1.55 }}>
                    {r.symptoms}
                  </p>
                  <span className="text-xs font-light" style={{ color: T.faint }}>
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

      {/* ── Standing disclaimer ──────────────────────────────────────── */}
      <p className="text-xs font-light mt-5 md:mt-6 text-center"
        style={{ color: T.faint, lineHeight: 1.7 }}>
        Pulse AI provides general health education only. It does not diagnose,
        treat, or prescribe. Always consult a licensed clinician about your health.
      </p>
    </div>
  );
}