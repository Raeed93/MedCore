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

const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

const marqueeItems = [
  'AI-Powered Diagnostics','HIPAA Compliant','24/7 Support','Real-time Analysis',
  'Clinical Decision Support','Evidence-Based Medicine','Advanced Medical AI','Secure Patient Data',
];
const stats = [
  { value: '98.7%', label: 'Accuracy Rate' },
  { value: '15K+', label: 'Diagnoses Daily' },
  { value: '5,000+', label: 'Medical Professionals' },
  { value: '<30s', label: 'Average Response' },
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
  'Reduce diagnostic time by 60%','Minimize human error','Access to latest medical research',
  'Comprehensive differential diagnosis','Integrated test recommendations','Multi-language support',
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f5ebe8', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#2a0a0a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes lp-marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        .lp-nav-link:hover { color: #7F1D1D !important; }
        .lp-primary { background:#7F1D1D; color:#f5ebe8; border:none; border-radius:9px; font-size:14px; font-weight:500; cursor:pointer; display:inline-flex; align-items:center; gap:8px; font-family:'DM Sans',sans-serif; transition:background 0.18s; padding:12px 26px; }
        .lp-primary:hover { background:#6b1818; }
        .lp-outline { background:transparent; color:#7F1D1D; border:1.5px solid rgba(127,29,29,0.35); border-radius:9px; font-size:14px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.18s; padding:11px 26px; }
        .lp-outline:hover { background:rgba(127,29,29,0.05); }
        .lp-feat:hover { transform:translateY(-2px); }
        .lp-feat { transition:transform 0.2s ease; }
      `}</style>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 52px', position:'sticky', top:0, zIndex:50, ...frosted, borderRadius:0, borderLeft:'none', borderRight:'none', borderTop:'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Logo size={30} />
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, color:'#7F1D1D' }}>MedCore AI</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:32 }}>
          {['Features','How it works','Security'].map(l => (
            <span key={l} className="lp-nav-link" style={{ fontSize:14, color:'#6a3a3a', cursor:'pointer', transition:'color 0.15s' }}>{l}</span>
          ))}
          <button className="lp-primary" style={{ padding:'9px 20px', fontSize:13 }} onClick={() => navigate('/login')}>Sign In <ArrowRight size={14} /></button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding:'80px 52px 56px', maxWidth:880, margin:'0 auto', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(127,29,29,0.07)', border:'1px solid rgba(127,29,29,0.14)', borderRadius:100, padding:'6px 16px', marginBottom:28 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#7F1D1D' }} />
          <span style={{ fontSize:11, color:'#7F1D1D', fontWeight:500, letterSpacing:'0.06em' }}>POWERED BY ADVANCED MEDICAL AI</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:54, fontWeight:700, lineHeight:1.13, color:'#2a0a0a', marginBottom:14 }}>
          AI-Powered Medical<br /><span style={{ color:'#7F1D1D' }}>Diagnosis System</span>
        </h1>
        <p style={{ fontSize:17, color:'#6a3a3a', lineHeight:1.72, maxWidth:500, margin:'0 auto 36px', fontWeight:300 }}>
          Leverage cutting-edge AI and medical knowledge bases to generate evidence-based diagnostic recommendations for your patients.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="lp-primary" onClick={() => navigate('/login')}>Get Started <ArrowRight size={15} /></button>
          <button className="lp-outline">Watch Demo</button>
        </div>
        <div style={{ margin:'48px auto 0', maxWidth:440, opacity:0.13 }}>
          <svg viewBox="0 0 440 36" fill="none" style={{ width:'100%' }}>
            <path d="M0 18 L70 18 L88 3 L100 33 L112 7 L124 18 L440 18" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding:'0 52px 60px', maxWidth:880, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ ...frosted, borderRadius:14, padding:'22px 18px', textAlign:'center' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#7F1D1D', marginBottom:4 }}>{value}</div>
              <div style={{ fontSize:12, color:'#8a5050', fontWeight:300 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background:'rgba(127,29,29,0.05)', borderTop:'1px solid rgba(127,29,29,0.08)', borderBottom:'1px solid rgba(127,29,29,0.08)', padding:'13px 0', overflow:'hidden', whiteSpace:'nowrap' }}>
        <div style={{ display:'inline-block', animation:'lp-marquee 22s linear infinite' }}>
          {[...marqueeItems,...marqueeItems,...marqueeItems].map((item,i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, marginRight:48, fontSize:12, color:'#7F1D1D', fontWeight:500, letterSpacing:'0.04em' }}>
              <span style={{ width:4, height:4, borderRadius:'50%', background:'#7F1D1D', display:'inline-block' }} />{item}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{ padding:'72px 52px', maxWidth:980, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:'#2a0a0a', marginBottom:10 }}>Powerful Features</h2>
          <p style={{ fontSize:14, color:'#7a4a4a', fontWeight:300 }}>Everything you need for accurate, efficient medical diagnostics</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="lp-feat" style={{ ...frosted, borderRadius:16, padding:'26px 22px' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:'rgba(127,29,29,0.08)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                <Icon size={17} color="#7F1D1D" />
              </div>
              <h3 style={{ fontSize:14, fontWeight:600, color:'#2a0a0a', marginBottom:7 }}>{title}</h3>
              <p style={{ fontSize:13, color:'#7a4a4a', lineHeight:1.65, fontWeight:300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ padding:'0 52px 72px', maxWidth:980, margin:'0 auto' }}>
        <div style={{ background:'#7F1D1D', borderRadius:18, padding:'52px 56px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#fae0d8', marginBottom:12, lineHeight:1.3 }}>Why Medical Professionals Choose Us</h2>
            <p style={{ fontSize:14, color:'rgba(250,224,216,0.6)', fontWeight:300, lineHeight:1.75 }}>Join thousands of clinicians who trust MedCore AI for faster, more accurate diagnostic support.</p>
          </div>
          <div style={{ display:'grid', gap:13 }}>
            {benefits.map(b => (
              <div key={b} style={{ display:'flex', alignItems:'center', gap:11 }}>
                <CheckCircle size={15} color="rgba(250,224,216,0.6)" style={{ flexShrink:0 }} />
                <span style={{ fontSize:14, color:'#fae0d8' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'0 52px 80px', maxWidth:980, margin:'0 auto', textAlign:'center' }}>
        <div style={{ ...frosted, borderRadius:18, padding:'60px 48px' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700, color:'#2a0a0a', marginBottom:12 }}>Ready to Transform Your Practice?</h2>
          <p style={{ fontSize:15, color:'#6a3a3a', marginBottom:32, fontWeight:300 }}>Join thousands of medical professionals using AI-powered diagnostics</p>
          <button className="lp-primary" style={{ fontSize:15, padding:'13px 34px' }} onClick={() => navigate('/login')}>Start Free Trial <ArrowRight size={16} /></button>
          <p style={{ marginTop:16, fontSize:12, color:'#9a6060' }}>No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(127,29,29,0.1)', padding:'24px 52px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <Logo size={20} />
          <span style={{ fontSize:13, color:'#8a5050' }}>© 2024 MedCore AI. Clinical decision support only.</span>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {['HIPAA Compliant','FDA Registered','ISO 27001'].map(t => (
            <span key={t} style={{ fontSize:12, color:'#9a6060' }}>{t}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}