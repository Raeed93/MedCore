import { useNavigate } from 'react-router';
import {
  Brain, FileText, Shield, ArrowRight,
  CheckCircle, AlertTriangle, Clock, Layers
} from 'lucide-react';

const Logo = ({ size = 32 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width={size} height={size}>
    <defs>
      <mask id="ring-mask">
        <rect width="48" height="48" fill="white" />
        <rect x="3" y="22" width="8" height="4" fill="black" />
        <rect x="37" y="22" width="8" height="4" fill="black" />
      </mask>
    </defs>
    <circle cx="24" cy="24" r="18" stroke="#7F1D1D" strokeWidth="2.5" fill="none" mask="url(#ring-mask)" />
    <path
      d="M 2 24 L 17 24 L 20 17 L 24 31 L 28 19 L 31 24 L 46 24"
      stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
  </svg>
);

const marqueeItems = [
  "Retrieval-Augmented Generation", "Symptom Education", "TLS Encrypted",
  "Cited Sources", "Not a Diagnostic Tool", "Self-Hosted",
  "Open Source Stack", "Portfolio Project"
];

// Technical facts about the build — verifiable by reading the repo,
// unlike usage metrics a portfolio project cannot honestly claim.
const stack = [
  { label: "Inference model", value: "Llama 3 70B" },
  { label: "Vector store", value: "ChromaDB" },
  { label: "Services", value: "5 containers" },
  { label: "Embeddings", value: "Local" },
];

const features = [
  {
    icon: Brain,
    title: "Retrieval-Augmented Generation",
    description: "Responses are grounded in a curated library of public health documents rather than model recall alone, which reduces invented detail."
  },
  {
    icon: FileText,
    title: "Cited Sources",
    description: "Each response points back to the document it drew from, so you can read the original material yourself."
  },
  {
    icon: AlertTriangle,
    title: "Urgent Symptom Screening",
    description: "A deterministic rule set checks for symptoms needing immediate care and shows guidance before any AI response is generated."
  },
  {
    icon: Shield,
    title: "Encrypted in Transit",
    description: "All traffic runs over HTTPS with certificates issued by Let's Encrypt and renewed automatically."
  },
  {
    icon: Clock,
    title: "Visit Preparation",
    description: "Turns a loose description of how you feel into an organized summary and a list of questions to bring to your appointment."
  },
  {
    icon: Layers,
    title: "Self-Hosted",
    description: "Runs entirely on infrastructure you control. No third-party analytics or advertising trackers."
  },
];

// Engineering work this project demonstrates. Everything here is checkable
// against the repository.
const demonstrates = [
  "Retrieval-augmented generation pipeline",
  "Containerized multi-service deployment",
  "JWT authentication with email verification",
  "Automated TLS certificate renewal",
  "CI/CD via GitHub Actions",
  "Local embedding generation",
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#faf0f1', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#1a0505' }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes marquee-slide { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        .marquee-track { animation: marquee-slide 22s linear infinite; }
        .feature-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(127,29,29,0.08); }
        .feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .btn-primary:hover { background: #6b1818 !important; }
        .btn-outline:hover { background: rgba(127,29,29,0.06) !important; }
        .nav-link:hover { color: #7F1D1D; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
          .feature-card { transition: none; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px', borderBottom: '1px solid rgba(127,29,29,0.1)',
        background: '#faf0f1', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={34} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#7F1D1D' }}>
            Pulse AI
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['Features', 'How it works', 'Security'].map(l => (
            <span key={l} className="nav-link" style={{ fontSize: 14, color: '#5a2a2a', cursor: 'pointer', transition: 'color 0.15s' }}>{l}</span>
          ))}
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ background: '#7F1D1D', color: '#faf0f1', border: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}
          >
            Sign In <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '80px 48px 56px', maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(127,29,29,0.07)', border: '1px solid rgba(127,29,29,0.15)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 32,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7F1D1D' }} />
          <span style={{ fontSize: 11, color: '#7F1D1D', fontWeight: 500, letterSpacing: '0.06em' }}>
            PORTFOLIO PROJECT · NOT MEDICAL ADVICE
          </span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 54, fontWeight: 700, lineHeight: 1.13, color: '#1a0505', marginBottom: 14 }}>
          Understand Your Symptoms<br />
          <span style={{ color: '#7F1D1D' }}>Before You See a Doctor</span>
        </h1>

        <p style={{ fontSize: 17, color: '#5a3a3a', lineHeight: 1.72, maxWidth: 540, margin: '0 auto 40px', fontWeight: 300 }}>
          Describe how you're feeling and get plain-language background drawn from public
          health literature, plus questions worth asking at your appointment.
          Pulse AI does not diagnose and is not a substitute for a clinician.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ background: '#7F1D1D', color: '#faf0f1', border: 'none', padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
          >
            Try the demo <ArrowRight size={16} />
          </button>
          <button
            className="btn-outline"
            onClick={() => window.open('https://github.com/Raeed93/MedCore', '_blank', 'noopener,noreferrer')}
            style={{ background: 'transparent', color: '#7F1D1D', border: '1.5px solid #7F1D1D', padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
          >
            Read the source
          </button>
        </div>

        {/* ECG decorative */}
        <div style={{ margin: '52px auto 0', maxWidth: 480, opacity: 0.15 }}>
          <svg viewBox="0 0 480 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }} aria-hidden="true">
            <path d="M0 20 L80 20 L100 4 L115 36 L130 8 L145 20 L480 20" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── STACK ── */}
      <section style={{ padding: '0 48px 64px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stack.map(({ value, label }) => (
            <div key={label} style={{
              background: '#fff', border: '1px solid rgba(127,29,29,0.1)',
              borderRadius: 12, padding: '24px 20px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#7F1D1D', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: '#7a4a4a', fontWeight: 400 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{
        background: 'rgba(127,29,29,0.05)', borderTop: '1px solid rgba(127,29,29,0.08)',
        borderBottom: '1px solid rgba(127,29,29,0.08)', padding: '13px 0', overflow: 'hidden', whiteSpace: 'nowrap',
      }}>
        <div className="marquee-track" style={{ display: 'inline-block' }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 48, fontSize: 12, color: '#7F1D1D', fontWeight: 500, letterSpacing: '0.04em' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7F1D1D', display: 'inline-block' }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: '72px 48px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: '#1a0505', marginBottom: 12 }}>
            How It Works
          </h2>
          <p style={{ fontSize: 15, color: '#7a4a4a', fontWeight: 300 }}>
            Grounded answers, cited sources, and a clear line about what this tool can't do
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="feature-card" style={{
              background: '#fff', border: '1px solid rgba(127,29,29,0.1)',
              borderRadius: 12, padding: '28px 24px',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(127,29,29,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <Icon size={18} color="#7F1D1D" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a0505', marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#7a4a4a', lineHeight: 1.65, fontWeight: 300 }}>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT THIS DEMONSTRATES ── */}
      <section style={{ padding: '0 48px 72px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{
          background: '#7F1D1D', borderRadius: 16, padding: '52px 56px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#faf0f1', marginBottom: 14, lineHeight: 1.3 }}>
              Built to Learn the Full Stack
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(250,240,241,0.65)', fontWeight: 300, lineHeight: 1.7 }}>
              Pulse AI is a personal engineering project. The medical framing is the problem
              domain; the work is in the retrieval pipeline, the deployment, and the security
              posture around it.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {demonstrates.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={16} color="rgba(250,240,241,0.7)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#faf0f1', fontWeight: 400 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <section style={{ padding: '0 48px 48px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{
          border: '1px solid rgba(127,29,29,0.25)', background: 'rgba(127,29,29,0.04)',
          borderRadius: 12, padding: '24px 28px', display: 'flex', gap: 16, alignItems: 'flex-start',
        }}>
          <AlertTriangle size={20} color="#7F1D1D" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13, color: '#5a3a3a', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
            <strong style={{ fontWeight: 500, color: '#7F1D1D' }}>This is not medical advice.</strong>{' '}
            Pulse AI is an educational demonstration and has not been reviewed or cleared by any
            regulatory body. It cannot diagnose conditions, and its output may be incomplete or
            wrong. Always consult a qualified healthcare professional. If you think you may be
            having a medical emergency, contact your local emergency services immediately.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 48px 80px', maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ border: '1px solid rgba(127,29,29,0.12)', borderRadius: 16, padding: '60px 48px', background: '#fff' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#1a0505', marginBottom: 12 }}>
            Take a Look Under the Hood
          </h2>
          <p style={{ fontSize: 15, color: '#7a4a4a', marginBottom: 36, fontWeight: 300 }}>
            Try the demo, or read how the retrieval pipeline and deployment are put together
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ background: '#7F1D1D', color: '#faf0f1', border: 'none', padding: '14px 36px', borderRadius: 8, fontSize: 16, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
          >
            Try the demo <ArrowRight size={16} />
          </button>
          <p style={{ marginTop: 16, fontSize: 12, color: '#b08080' }}>
            Free · No payment details required · Educational use only
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(127,29,29,0.1)', padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={20} />
          <span style={{ fontSize: 13, color: '#7a4a4a' }}>© 2026 Pulse AI. Educational project — not medical advice.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['TLS Encrypted', 'Open Source', 'Educational Use Only'].map(t => (
            <span key={t} style={{ fontSize: 12, color: '#b08080' }}>{t}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}