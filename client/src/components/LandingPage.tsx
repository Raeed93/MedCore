import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Lock, Server, Activity, HelpCircle,
  ClipboardList, MessageSquareText, Stethoscope, AlertTriangle,
} from 'lucide-react';
import Logo from './Logo';

const MARQUEE = [
  'Retrieval-augmented generation',
  'Symptom education',
  'Cited sources',
  'Not a diagnostic tool',
  'Local embeddings',
  'TLS encrypted',
  'Self-hosted',
  'Portfolio project',
];


const PREVIEW_ASSOCIATED = 'Viral pharyngitis';
const PREVIEW_OTHER = ['Strep throat', 'Seasonal allergies'];
const PREVIEW_SOURCES = [
  { title: 'CDC sore throat', page: 2 },
  { title: 'NIH fever in adults', page: 5 },
];

const STACK = [
  { label: 'Inference',    value: 'gpt-oss-120b' },
  { label: 'Embeddings',   value: 'MiniLM-L6-v2' },
  { label: 'Vector store', value: 'ChromaDB' },
  { label: 'Runtime',      value: 'Docker on EC2' },
];

const STEPS = [
  {
    n: '01',
    icon: ClipboardList,
    title: 'Describe what you feel',
    body: 'Plain language. No medical vocabulary needed.',
  },
  {
    n: '02',
    icon: MessageSquareText,
    title: 'Read the explanation',
    body: 'What those symptoms commonly relate to, drawn from public health documents, with every source listed.',
  },
  {
    n: '03',
    icon: Stethoscope,
    title: 'Bring it to your doctor',
    body: 'Walk in able to describe what is happening and ask better questions.',
  },
];

/* Each line is checkable against the repository. "Urgent symptom screening" is
   deliberately absent: the deterministic red-flag module is planned, not
   built, and this page previously advertised it as shipped. */
const BUILT = [
  'Retrieval-augmented generation over a curated document corpus',
  'Distance-thresholded retrieval with an explicit out-of-corpus path',
  'Local embedding generation — no third-party embedding API',
  'Passwordless auth with single-use email links',
  'Containerised multi-service deployment behind TLS',
  'CI/CD via GitHub Actions with automated certificate renewal',
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav className="nav-landing">
        <div className="flex items-center gap-2.5">
          <Logo size={24} />
          <span className="wordmark" style={{ fontSize: 19 }}>Pulse AI</span>
        </div>
        <div className="flex items-center gap-7">
          <a href="#how" className="hidden sm:inline">How it works</a>
          <a href="#built" className="hidden sm:inline">What it runs on</a>
          <button className="btn" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => navigate('/login')}>
            Sign in
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: 'clamp(36px, 6vw, 64px)' }}>
        <div className="measure grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          <div className="lg:col-span-6">
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              Symptom education · Not medical advice
            </div>
            <h1 className="display-xl" style={{ marginBottom: 24 }}>
              Understand your symptoms before you see a doctor.
            </h1>
            <p className="lede" style={{ marginBottom: 34 }}>
              Describe how you&rsquo;re feeling and get plain-language background
              drawn from public health literature, plus questions worth asking at
              your appointment. Pulse AI does not diagnose and is not a substitute
              for a clinician.
            </p>
            <button className="btn" onClick={() => navigate('/login')}>
              Start a symptom check <ArrowRight size={14} />
            </button>
          </div>

          {/* ── Preview ─────────────────────────────────────────────────
              Was a monospace pipeline trace, which showed the retrieval but
              looked nothing like the product. This is the result view the app
              actually renders, shortened. */}
          <div className="lg:col-span-6 preview">
            <span className="eyebrow preview-tag">Example result</span>

            <div className="card" style={{ padding: 24 }}>
              <div className="flex flex-wrap gap-2" style={{ marginBottom: 20 }}>
                <span className="pill" style={{ color: 'var(--color-muted)' }}>
                  <HelpCircle size={11} /> Not assessed
                </span>
                <span className="pill" style={{ color: 'var(--color-ok)' }}>
                  <BookOpen size={11} /> From the library
                </span>
              </div>

              <h3 className="card-heading">
                <Activity size={12} /> Most commonly associated with
              </h3>
              <div style={{
                padding: '11px 14px',
                background: 'var(--color-bone)',
                borderRadius: 'var(--radius-input)',
                borderLeft: '3px solid var(--color-brand)',
                fontSize: 13.5,
                color: 'var(--color-ink)',
                marginBottom: 22,
              }}>
                {PREVIEW_ASSOCIATED}
              </div>

              <h3 className="card-heading">Other possibilities</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px' }}>
                {PREVIEW_OTHER.map(item => (
                  <li key={item} style={{
                    fontSize: 13, fontWeight: 300, lineHeight: 1.7,
                    color: 'var(--color-body)',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{
                background: 'var(--color-bone)',
                borderRadius: 'var(--radius-card)',
                padding: '16px 18px',
              }}>
                <h3 className="card-heading card-heading-plain">
                  <BookOpen size={12} /> Sources · {PREVIEW_SOURCES.length}
                </h3>
                {PREVIEW_SOURCES.map((s, i) => (
                  <div key={s.title} className="citation" style={{ padding: '8px 0' }}>
                    <span className="citation-index">[{i + 1}]</span>
                    <div>
                      <p style={{ fontSize: 12.5, color: 'var(--color-ink)', lineHeight: 1.4 }}>
                        {s.title}
                      </p>
                      <p className="meta" style={{ marginTop: 2 }}>Page {s.page}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ────────────────────────────────────────────────────── */}
      <div className="marquee">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ── Bento ──────────────────────────────────────────────────────── */}
      <section className="section" id="built" style={{ paddingBottom: 0 }}>
        <div className="measure grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="tile col-span-2 lg:row-span-2" style={{ justifyContent: 'center' }}>
            <BookOpen size={17} style={{ color: 'var(--color-brand)', marginBottom: 18 }} />
            <h3 className="display-md" style={{ marginBottom: 12 }}>Grounded, then cited</h3>
            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.7, color: 'var(--color-body)' }}>
              Answers are built from a curated library of public health documents
              rather than model recall alone. Every response lists the passages it
              drew from, so you can read the original material. When nothing in the
              library covers your symptoms, the app says so instead of inventing an
              answer.
            </p>
          </div>

          {STACK.map(({ label, value }) => (
            <div key={label} className="tile">
              <div className="eyebrow" style={{ marginBottom: 10 }}>{label}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 13,
                color: 'var(--color-ink)', lineHeight: 1.4,
              }}>
                {value}
              </div>
            </div>
          ))}

          <div className="tile col-span-2">
            <Lock size={16} style={{ color: 'var(--color-muted)', marginBottom: 14 }} />
            <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink)', marginBottom: 8 }}>
              No passwords
            </h3>
            <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.65, color: 'var(--color-muted)' }}>
              Sign-in is a single-use link sent to your email. There is no password
              stored to leak or reuse. Traffic runs over TLS with certificates
              renewed automatically.
            </p>
          </div>

          <div className="tile col-span-2">
            <Server size={16} style={{ color: 'var(--color-muted)', marginBottom: 14 }} />
            <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink)', marginBottom: 8 }}>
              Self-hosted
            </h3>
            <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.65, color: 'var(--color-muted)' }}>
              Runs on infrastructure I control, with embeddings generated locally.
              No third-party analytics and no advertising trackers.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section className="section" id="how" style={{ paddingBottom: 0 }}>
        <div className="measure">
          <div className="eyebrow" style={{ marginBottom: 16 }}>How it works</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {STEPS.map(({ n, icon: Icon, title, body }) => (
              <div key={n} style={{ borderTop: '1px solid var(--color-rule-strong)', paddingTop: 20 }}>
                <div className="flex items-center gap-2.5" style={{ marginBottom: 14 }}>
                  <span className="eyebrow">{n}</span>
                  <Icon size={14} style={{ color: 'var(--color-faint)' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-ink)', marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13.5, fontWeight: 300, lineHeight: 1.7, color: 'var(--color-muted)' }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What was built ─────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="measure card grid grid-cols-1 md:grid-cols-2 gap-10"
          style={{ padding: 'clamp(28px, 5vw, 52px)' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>What this is</div>
            <h2 className="display-md" style={{ marginBottom: 14 }}>
              A personal engineering project.
            </h2>
            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: 'var(--color-body)' }}>
              The medical framing is the problem domain. The work is in the
              retrieval pipeline, the deployment, and the security posture around it.
            </p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {BUILT.map((item, i) => (
              <li key={item} style={{
                fontSize: 13.5, fontWeight: 300, lineHeight: 1.6, color: 'var(--color-body)',
                padding: '13px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--color-rule)',
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="measure notice-emergency">
          <div className="flex items-start gap-3">
            <AlertTriangle size={17} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13.5, fontWeight: 300, lineHeight: 1.7, maxWidth: '76ch' }}>
              <strong style={{ fontWeight: 500 }}>This is not medical advice.</strong>{' '}
              Pulse AI is an educational demonstration. It has not been reviewed or
              cleared by any regulatory body, it cannot diagnose conditions, and its
              output may be incomplete or wrong. Always consult a qualified
              healthcare professional. If you think you may be having a medical
              emergency, contact your local emergency services immediately.
            </p>
          </div>
        </div>
      </section>

      {/* ── Close ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="measure-tight" style={{ textAlign: 'center' }}>
          <h2 className="display-lg" style={{ marginBottom: 16 }}>
            Put it to work on what you&rsquo;re feeling.
          </h2>
          <p className="lede" style={{ margin: '0 auto 30px' }}>
            Describe your symptoms in your own words and see what the library has
            to say about them.
          </p>
          <button className="btn" onClick={() => navigate('/login')}>
            Start a symptom check <ArrowRight size={14} />
          </button>
          <p className="meta" style={{ marginTop: 18 }}>
            Free · No payment details · Educational use only
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--color-rule)', padding: '26px clamp(20px, 5vw, 64px)' }}>
        <div className="measure flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size={18} />
            <span className="meta">
              © {new Date().getFullYear()} Pulse AI — educational project, not medical advice.
            </span>
          </div>
          <span className="meta">Symptom education · Not a diagnostic tool</span>
        </div>
      </footer>
    </div>
  );
}