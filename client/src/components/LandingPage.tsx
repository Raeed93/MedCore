import { useNavigate } from 'react-router';
import {
  Brain, FileText, Shield, ArrowRight,
  TrendingUp, Users, CheckCircle, Zap, Clock, BarChart3
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
  "AI-Powered Diagnostics", "HIPAA Compliant", "24/7 Support",
  "Real-time Analysis", "Clinical Decision Support",
  "Evidence-Based Medicine", "Advanced Medical AI", "Secure Patient Data"
];

const stats = [
  { label: "Accuracy Rate", value: "98.7%" },
  { label: "Diagnoses Daily", value: "15K+" },
  { label: "Medical Professionals", value: "5,000+" },
  { label: "Average Response", value: "<30s" },
];

const features = [
  { icon: Brain,     title: "RAG-Powered Analysis",    description: "Retrieval-Augmented Generation combines your medical documents with advanced AI models for accurate diagnoses." },
  { icon: FileText,  title: "Evidence-Based Results",  description: "Every diagnosis includes references to medical literature and guidelines used in the analysis." },
  { icon: Shield,    title: "Secure & Private",         description: "Patient data is encrypted and handled with HIPAA-compliant security standards at every step." },
  { icon: Zap,       title: "Intelligent Insights",     description: "Advanced machine learning algorithms provide contextual insights and treatment recommendations." },
  { icon: Clock,     title: "Real-time Processing",     description: "Get instant diagnostic suggestions with our optimized AI infrastructure." },
  { icon: BarChart3, title: "Analytics Dashboard",      description: "Track patient outcomes and diagnostic patterns with comprehensive analytics." },
];

const benefits = [
  "Reduce diagnostic time by 60%", "Minimize human error",
  "Access to latest medical research", "Comprehensive differential diagnosis",
  "Integrated test recommendations", "Multi-language support",
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
            MedCore AI
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
            POWERED BY ADVANCED MEDICAL AI
          </span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 54, fontWeight: 700, lineHeight: 1.13, color: '#1a0505', marginBottom: 14 }}>
          AI-Powered Medical<br />
          <span style={{ color: '#7F1D1D' }}>Diagnosis System</span>
        </h1>

        <p style={{ fontSize: 17, color: '#5a3a3a', lineHeight: 1.72, maxWidth: 520, margin: '0 auto 40px', fontWeight: 300 }}>
          Leverage cutting-edge AI and medical knowledge bases to generate evidence-based
          diagnostic recommendations for your patients.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ background: '#7F1D1D', color: '#faf0f1', border: 'none', padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
          >
            Get Started <ArrowRight size={16} />
          </button>
          <button
            className="btn-outline"
            style={{ background: 'transparent', color: '#7F1D1D', border: '1.5px solid #7F1D1D', padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
          >
            Watch Demo
          </button>
        </div>

        {/* ECG decorative */}
        <div style={{ margin: '52px auto 0', maxWidth: 480, opacity: 0.15 }}>
          <svg viewBox="0 0 480 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
            <path d="M0 20 L80 20 L100 4 L115 36 L130 8 L145 20 L480 20" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 48px 64px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{
              background: '#fff', border: '1px solid rgba(127,29,29,0.1)',
              borderRadius: 12, padding: '24px 20px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#7F1D1D', marginBottom: 4 }}>{value}</div>
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
            Powerful Features
          </h2>
          <p style={{ fontSize: 15, color: '#7a4a4a', fontWeight: 300 }}>
            Everything you need for accurate, efficient medical diagnostics
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

      {/* ── BENEFITS ── */}
      <section style={{ padding: '0 48px 72px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{
          background: '#7F1D1D', borderRadius: 16, padding: '52px 56px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#faf0f1', marginBottom: 14, lineHeight: 1.3 }}>
              Why Medical Professionals Choose Us
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(250,240,241,0.65)', fontWeight: 300, lineHeight: 1.7 }}>
              Join thousands of clinicians who trust MedCore AI for faster, more accurate diagnostic support.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {benefits.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={16} color="rgba(250,240,241,0.7)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#faf0f1', fontWeight: 400 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 48px 80px', maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ border: '1px solid rgba(127,29,29,0.12)', borderRadius: 16, padding: '60px 48px', background: '#fff' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#1a0505', marginBottom: 12 }}>
            Ready to Transform Your Practice?
          </h2>
          <p style={{ fontSize: 15, color: '#7a4a4a', marginBottom: 36, fontWeight: 300 }}>
            Join thousands of medical professionals using AI-powered diagnostics
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ background: '#7F1D1D', color: '#faf0f1', border: 'none', padding: '14px 36px', borderRadius: 8, fontSize: 16, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
          >
            Start Free Trial <ArrowRight size={16} />
          </button>
          <p style={{ marginTop: 16, fontSize: 12, color: '#b08080' }}>
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(127,29,29,0.1)', padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={20} />
          <span style={{ fontSize: 13, color: '#7a4a4a' }}>© 2024 MedCore AI. Clinical decision support only.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['HIPAA Compliant', 'FDA Registered', 'ISO 27001'].map(t => (
            <span key={t} style={{ fontSize: 12, color: '#b08080' }}>{t}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}