import { useNavigate } from 'react-router';
import { Brain, FileText, Shield, ArrowRight, CheckCircle, Zap, Clock, BarChart3 } from 'lucide-react';

const Logo = ({ size = 32, color = '#7F1D1D' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width={size} height={size}>
    <defs>
      <mask id="lp-ring">
        <rect width="48" height="48" fill="white" />
        <rect x="3" y="22" width="8" height="4" fill="black" />
        <rect x="37" y="22" width="8" height="4" fill="black" />
      </mask>
    </defs>
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.5" fill="none" mask="url(#lp-ring)" />
    <path d="M2 24 L17 24 L20 17 L24 31 L28 19 L31 24 L46 24"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Visual-only styles — never touch layout
const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

const marqueeItems = [
  'AI-Powered Diagnostics', 'HIPAA Compliant', '24/7 Support', 'Real-time Analysis',
  'Clinical Decision Support', 'Evidence-Based Medicine', 'Advanced Medical AI', 'Secure Patient Data',
];
const stats = [
  { value: '98.7%', label: 'Accuracy Rate' },
  { value: '15K+',  label: 'Diagnoses Daily' },
  { value: '5,000+',label: 'Medical Professionals' },
  { value: '<30s',  label: 'Average Response' },
];
const features = [
  { icon: Brain,     title: 'RAG-Powered Analysis',   desc: 'Combines your medical documents with advanced AI models for accurate diagnoses.' },
  { icon: FileText,  title: 'Evidence-Based Results', desc: 'Every diagnosis includes references to medical literature and guidelines.' },
  { icon: Shield,    title: 'Secure & Private',        desc: 'HIPAA-compliant security standards protect patient data at every step.' },
  { icon: Zap,       title: 'Intelligent Insights',    desc: 'Contextual insights and treatment recommendations from advanced ML algorithms.' },
  { icon: Clock,     title: 'Real-time Processing',    desc: 'Get instant diagnostic suggestions with our optimized AI infrastructure.' },
  { icon: BarChart3, title: 'Analytics Dashboard',     desc: 'Track patient outcomes and diagnostic patterns with comprehensive analytics.' },
];
const benefits = [
  'Reduce diagnostic time by 60%', 'Minimize human error',
  'Access to latest medical research', 'Comprehensive differential diagnosis',
  'Integrated test recommendations', 'Multi-language support',
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#f5ebe8', fontFamily: "'DM Sans', sans-serif", color: '#2a0a0a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes lp-marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        .lp-serif { font-family: 'Playfair Display', serif; }
        .lp-primary { background:#7F1D1D; color:#f5ebe8; border:none; border-radius:9px; font-weight:500; cursor:pointer; display:inline-flex; align-items:center; gap:8px; font-family:'DM Sans',sans-serif; transition:background 0.18s; }
        .lp-primary:hover { background:#6b1818; }
        .lp-outline { background:transparent; color:#7F1D1D; border:1.5px solid rgba(127,29,29,0.35); border-radius:9px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.18s; }
        .lp-outline:hover { background:rgba(127,29,29,0.05); }
        .lp-navlink:hover { color:#7F1D1D !important; }
        .lp-feat { transition:transform 0.2s ease; }
        .lp-feat:hover { transform:translateY(-2px); }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className="flex items-center justify-between px-6 md:px-12 py-4 sticky top-0 z-50"
        style={{ ...frosted, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
      >
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="lp-serif text-lg font-bold" style={{ color: '#7F1D1D' }}>Pulse AI</span>
        </div>
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Security'].map(l => (
            <span key={l} className="lp-navlink text-sm cursor-pointer transition-colors" style={{ color: '#6a3a3a' }}>{l}</span>
          ))}
          <button className="lp-primary text-sm px-4 py-2" onClick={() => navigate('/login')}>
            Sign In <ArrowRight size={13} />
          </button>
        </div>
        {/* Mobile sign in only */}
        <button className="flex md:hidden lp-primary text-sm px-4 py-2" onClick={() => navigate('/login')}>
          Sign In
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="px-6 md:px-12 lg:px-20 pt-16 md:pt-20 pb-10 md:pb-14 max-w-5xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7"
          style={{ background: 'rgba(127,29,29,0.07)', border: '1px solid rgba(127,29,29,0.14)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#7F1D1D' }} />
          <span className="text-xs font-medium tracking-widest" style={{ color: '#7F1D1D' }}>POWERED BY ADVANCED MEDICAL AI</span>
        </div>

        <h1 className="lp-serif font-bold leading-tight mb-3" style={{ fontSize: 'clamp(36px, 6vw, 54px)', color: '#2a0a0a' }}>
          AI-Powered Medical<br />
          <span style={{ color: '#7F1D1D' }}>Diagnosis System</span>
        </h1>

        <p className="text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto mb-9" style={{ color: '#6a3a3a' }}>
          Leverage cutting-edge AI and medical knowledge bases to generate evidence-based
          diagnostic recommendations for your patients.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button className="lp-primary text-sm md:text-base px-6 md:px-8 py-3" onClick={() => navigate('/login')}>
            Get Started <ArrowRight size={15} />
          </button>
          <button className="lp-outline text-sm md:text-base px-6 md:px-8 py-3">Watch Demo</button>
        </div>

        {/* ECG motif */}
        <div className="mt-12 mx-auto max-w-md opacity-10">
          <svg viewBox="0 0 440 36" fill="none" className="w-full">
            <path d="M0 18 L70 18 L88 3 L100 33 L112 7 L124 18 L440 18"
              stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 md:px-12 lg:px-20 pb-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-2xl p-5 md:p-6 text-center" style={frosted}>
              <div className="lp-serif font-bold mb-1" style={{ fontSize: 'clamp(22px,4vw,28px)', color: '#7F1D1D' }}>{value}</div>
              <div className="text-xs font-light" style={{ color: '#8a5050' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div
        className="py-3 overflow-hidden whitespace-nowrap"
        style={{ background: 'rgba(127,29,29,0.05)', borderTop: '1px solid rgba(127,29,29,0.08)', borderBottom: '1px solid rgba(127,29,29,0.08)' }}
      >
        <div style={{ display: 'inline-block', animation: 'lp-marquee 22s linear infinite' }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mr-12 text-xs font-medium tracking-wide" style={{ color: '#7F1D1D' }}>
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#7F1D1D' }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-20 max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="lp-serif font-bold mb-3" style={{ fontSize: 'clamp(26px,4vw,36px)', color: '#2a0a0a' }}>Powerful Features</h2>
          <p className="text-sm font-light" style={{ color: '#7a4a4a' }}>Everything you need for accurate, efficient medical diagnostics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="lp-feat rounded-2xl p-6" style={frosted}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(127,29,29,0.08)' }}>
                <Icon size={16} color="#7F1D1D" />
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#2a0a0a' }}>{title}</h3>
              <p className="text-xs font-light leading-relaxed" style={{ color: '#7a4a4a' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="px-6 md:px-12 lg:px-20 pb-16 md:pb-20 max-w-6xl mx-auto">
        <div
          className="rounded-2xl p-8 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          style={{ background: '#7F1D1D' }}
        >
          <div>
            <h2 className="lp-serif font-bold mb-3 leading-snug" style={{ fontSize: 'clamp(22px,3vw,28px)', color: '#fae0d8' }}>
              Why Medical Professionals Choose Us
            </h2>
            <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(250,224,216,0.6)' }}>
              Join thousands of clinicians who trust Pulse AI for faster, more accurate diagnostic support.
            </p>
          </div>
          <div className="grid gap-3">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle size={14} color="rgba(250,224,216,0.6)" className="flex-shrink-0" />
                <span className="text-sm" style={{ color: '#fae0d8' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 lg:px-20 pb-20 max-w-6xl mx-auto text-center">
        <div className="rounded-2xl p-10 md:p-16" style={frosted}>
          <h2 className="lp-serif font-bold mb-3" style={{ fontSize: 'clamp(24px,4vw,34px)', color: '#2a0a0a' }}>
            Ready to Transform Your Practice?
          </h2>
          <p className="text-sm md:text-base font-light mb-8" style={{ color: '#6a3a3a' }}>
            Join thousands of medical professionals using AI-powered diagnostics
          </p>
          <button className="lp-primary text-sm md:text-base px-8 md:px-10 py-3 md:py-4" onClick={() => navigate('/login')}>
            Start Free Trial <ArrowRight size={16} />
          </button>
          <p className="mt-4 text-xs" style={{ color: '#9a6060' }}>No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-12 py-6"
        style={{ borderTop: '1px solid rgba(127,29,29,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <Logo size={18} />
          <span className="text-xs" style={{ color: '#8a5050' }}>© 2024 Pulse AI. Clinical decision support only.</span>
        </div>
        <div className="flex gap-5">
          {['HIPAA Compliant', 'FDA Registered', 'ISO 27001'].map(t => (
            <span key={t} className="text-xs" style={{ color: '#9a6060' }}>{t}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}