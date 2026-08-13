import {
  AlertTriangle, CheckCircle, HelpCircle, BookOpen,
  Activity, GitBranch, FlaskConical, ClipboardList, X,
} from 'lucide-react';


export type Source =
  | string
  | {
      title: string;
      page?: number;
      /** L2 distance from the query embedding. Lower is closer. */
      distance?: number;
      /** The retrieved chunk, if the API starts returning it. */
      excerpt?: string;
      url?: string;
    };

export interface DiagnosisResult {
  primaryDiagnosis: string[];
  differentialDiagnosis: string[];
  recommendedTests: string[];
  // 'unknown' is a real state, not a missing value: it means the system
  // declined to assess urgency because it had no relevant literature.
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  recommendations: string[];
  notes: string;
  sources?: Source[];
  groundedInLiterature?: boolean;
}

interface DiagnosisResultsProps {
  result: DiagnosisResult;
  onClose: () => void;
}

const normaliseSource = (s: Source) =>
  typeof s === 'string' ? { title: s } : s;

/** Strips the storage path and extension so "niams_back_pain.pdf" reads as
 *  "Niams back pain" rather than a filename. */
const prettyTitle = (title: string) =>
  title
    .replace(/^.*[/\\]/, '')
    .replace(/\.(pdf|docx?|txt|md)$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();

const urgencyConfig = {
  critical: { color: 'var(--color-alert)', label: 'Critical', Icon: AlertTriangle },
  high:     { color: 'var(--color-high)',  label: 'High',     Icon: AlertTriangle },
  medium:   { color: 'var(--color-warn)',  label: 'Medium',   Icon: CheckCircle },
  low:      { color: 'var(--color-ok)',    label: 'Low',      Icon: CheckCircle },
  // An unrecognised value previously fell through to `medium`, inventing a
  // judgement the backend had explicitly declined to make.
  unknown:  { color: 'var(--color-muted)', label: 'Not assessed', Icon: HelpCircle },
};

/** Repeated list block. Six near-identical sections were duplicated inline. */
function Section({
  icon: Icon, title, children,
}: {
  icon: typeof Activity; title: string; children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="card-heading">
        <Icon size={12} /> {title}
      </h3>
      {children}
    </div>
  );
}

export function DiagnosisResults({ result, onClose }: DiagnosisResultsProps) {
  const urgency = urgencyConfig[result.urgencyLevel] || urgencyConfig.unknown;
  const sources = (result.sources || []).map(normaliseSource);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

      {/* ── Header ───────────────────────────────────────────────────────
          Was "AI-Generated Diagnosis" / "Review all findings carefully
          before clinical decision-making". The product does not diagnose,
          and the reader is not making a clinical decision. */}
      <div
        className="flex items-start justify-between gap-4"
        style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-rule)' }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>What this could relate to</div>
          <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', lineHeight: 1.6, maxWidth: '52ch' }}>
            Background drawn from health literature — not a diagnosis. Bring it
            to a clinician rather than acting on it.
          </p>
        </div>
        <button onClick={onClose} className="icon-btn" aria-label="Close results">
          <X size={15} />
        </button>
      </div>

      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ── Provenance ─────────────────────────────────────────────────
            The reader must be able to tell which kind of answer this is
            without reading to the bottom of the page. */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="pill" style={{ color: urgency.color }}>
            <urgency.Icon size={12} /> {urgency.label}
          </span>
          <span
            className="pill"
            style={{ color: result.groundedInLiterature === false ? 'var(--color-muted)' : 'var(--color-ok)' }}
          >
            <BookOpen size={12} />
            {result.groundedInLiterature === false ? 'General knowledge' : 'From the library'}
          </span>
        </div>

        {result.groundedInLiterature === false && (
          <div className="notice notice-info">
            Nothing in the indexed documents covered these symptoms, so this is
            general information rather than something drawn from a specific
            source. Treat it as a starting point for a conversation with a
            clinician.
          </div>
        )}

        {result.primaryDiagnosis.length > 0 && (
          <Section icon={Activity} title="Most commonly associated with">
            <div className="flex flex-col gap-2">
              {result.primaryDiagnosis.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--color-bone)',
                    borderRadius: 'var(--radius-input)',
                    borderLeft: '3px solid var(--color-brand)',
                    fontSize: 14,
                    color: 'var(--color-ink)',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </Section>
        )}

        {result.differentialDiagnosis.length > 0 && (
          <Section icon={GitBranch} title="Other possibilities">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.differentialDiagnosis.map((item, i) => (
                <li key={i} style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.65, color: 'var(--color-body)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {result.recommendedTests.length > 0 && (
          <Section icon={FlaskConical} title="Tests a doctor might consider">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.recommendedTests.map((test, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-input)',
                    fontSize: 13,
                    fontWeight: 300,
                    color: 'var(--color-body)',
                  }}
                >
                  {test}
                </div>
              ))}
            </div>
          </Section>
        )}

        {result.recommendations.length > 0 && (
          <Section icon={ClipboardList} title="Questions worth asking">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3" style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.65, color: 'var(--color-body)' }}>
                  <span style={{ color: 'var(--color-brand)', flexShrink: 0 }}>—</span>
                  {rec}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {result.notes && (
          <Section icon={BookOpen} title="Notes">
            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.7, color: 'var(--color-body)' }}>
              {result.notes}
            </p>
          </Section>
        )}

        {/* ── Citations ────────────────────────────────────────────────────
            This is the part of the page that justifies the whole retrieval
            pipeline: it is what separates a grounded answer from a model
            talking. Given its own panel rather than a footnote list.

            page / distance / excerpt render only when the API sends them, so
            enriching the response later needs no change here. */}
        {sources.length > 0 && (
          <div
            style={{
              background: 'var(--color-bone)',
              borderRadius: 'var(--radius-card)',
              padding: '20px 22px',
            }}
          >
            <h3 className="card-heading" style={{ marginBottom: 4 }}>
              <BookOpen size={12} /> Sources · {sources.length}
            </h3>
            <p className="meta" style={{ marginBottom: 14 }}>
              Passages retrieved from the document library and given to the model.
            </p>

            {sources.map((s, i) => (
              <div key={i} className="citation">
                <span className="citation-index">[{i + 1}]</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5 }}>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}
                      >
                        {prettyTitle(s.title)}
                      </a>
                    ) : (
                      prettyTitle(s.title)
                    )}
                  </p>

                  {(s.page !== undefined || s.distance !== undefined) && (
                    <p className="meta" style={{ marginTop: 3 }}>
                      {s.page !== undefined && `Page ${s.page}`}
                      {s.page !== undefined && s.distance !== undefined && ' · '}
                      {s.distance !== undefined && `Distance ${s.distance.toFixed(2)}`}
                    </p>
                  )}

                  {s.excerpt && (
                    <p
                      style={{
                        marginTop: 8,
                        paddingLeft: 12,
                        borderLeft: '2px solid var(--color-rule-strong)',
                        fontSize: 12,
                        fontWeight: 300,
                        lineHeight: 1.6,
                        color: 'var(--color-muted)',
                      }}
                    >
                      {s.excerpt}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-rule)', background: 'var(--color-bone)' }}>
        <p className="meta" style={{ lineHeight: 1.6 }}>
          Generated by a language model from retrieved documents. It may be
          incomplete or wrong. Always consult a licensed clinician.
        </p>
      </div>
    </div>
  );
}