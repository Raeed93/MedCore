import { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { DiagnosisResults } from '../DiagnosisResults';
import type { DiagnosisResult } from '../DiagnosisResults';

interface HistoryRecord {
  id: number;
  patient_id: string;
  symptoms: string;
  diagnosis_result: DiagnosisResult;
  created_at: string;
}

const urgencyColor: Record<string, string> = {
  critical: 'var(--color-alert)',
  high:     'var(--color-high)',
  medium:   'var(--color-warn)',
  low:      'var(--color-ok)',
  unknown:  'var(--color-muted)',
};

const urgencyLabel: Record<string, string> = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
  unknown:  'Not assessed',
};

export default function HistoryPage() {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<HistoryRecord | null>(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/diagnosis-history`, {
        credentials: 'include',
      });
      if (res.status === 401) {
        setError('Your session expired. Sign in again to see your history.');
        return;
      }
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setRecords(data.history || []);
    } catch {
      setError('Could not load your history. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search now covers symptoms and findings only. Patient ID was dropped:
  // it is a generated reference the user never sees or types.
  const q = query.toLowerCase();
  const filtered = records.filter(r =>
    r.symptoms?.toLowerCase().includes(q) ||
    r.diagnosis_result?.primaryDiagnosis?.some(d => d.toLowerCase().includes(q))
  );

  const summarise = (r: HistoryRecord) => {
    const list = r.diagnosis_result?.primaryDiagnosis;
    if (!list || list.length === 0) return '—';
    const first = list[0];
    return first.length > 52 ? `${first.slice(0, 52)}…` : first;
  };

  const thisWeek = records.filter(r => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(r.created_at).getTime() >= weekAgo;
  }).length;

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 12 }}>History</div>
      <h2 className="display-md" style={{ marginBottom: 10 }}>Your past checks</h2>

      {/* ── Counts ───────────────────────────────────────────────────────
          The old stat row carried four cards, two of which were invented:
          an "Accuracy Rate" hardcoded to 98.2% and an "Avg. Response Time"
          hardcoded to <30s. Neither was measured anywhere. Nothing in this
          app can substantiate an accuracy figure, so the claim is gone
          rather than recalculated.

          What remains are two counts derived from the rows on screen. They
          read as a sentence because two numbers do not need four cards. */}
      <p className="lede" style={{ fontSize: 14, marginBottom: 32 }}>
        {isLoading
          ? 'Loading…'
          : records.length === 0
            ? 'No checks saved yet.'
            : `${records.length} check${records.length === 1 ? '' : 's'} saved${thisWeek > 0 ? `, ${thisWeek} in the last week` : ''}.`}
      </p>

      {error && (
        <div className="notice notice-alert flex items-center gap-3" style={{ marginBottom: 24 }} role="alert">
          <span style={{ flex: 1 }}>{error}</span>
          <button onClick={fetchHistory} className="btn-text">Try again</button>
        </div>
      )}

      {records.length > 0 && (
        <div className="field-row" style={{ maxWidth: 380, marginBottom: 24 }}>
          <Search size={14} />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search symptoms or findings"
            className="field"
            aria-label="Search your past checks"
          />
        </div>
      )}

      {isLoading ? (
        <div className="card flex items-center justify-center gap-3" style={{ padding: 64, color: 'var(--color-muted)' }}>
          <Loader2 size={17} className="spin" />
          <span style={{ fontSize: 13 }}>Loading your history…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--color-ink)', marginBottom: 6 }}>
            {records.length === 0 ? 'Nothing saved yet' : 'No checks match that search'}
          </p>
          <p className="meta">
            {records.length === 0
              ? 'Run a symptom check and it will appear here.'
              : 'Try a different word from your symptoms.'}
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-editorial" style={{ minWidth: 620 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 24 }}>Date</th>
                  <th>Symptoms</th>
                  <th>Most associated with</th>
                  <th>Urgency</th>
                  <th style={{ paddingRight: 24 }}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const level = r.diagnosis_result?.urgencyLevel || 'unknown';
                  const d = new Date(r.created_at);
                  return (
                    <tr key={r.id}>
                      <td style={{ paddingLeft: 24, whiteSpace: 'nowrap' }}>
                        <div style={{ color: 'var(--color-ink)' }}>
                          {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="meta">
                          {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ maxWidth: 220, fontWeight: 300 }}>
                        <span style={{
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {r.symptoms}
                        </span>
                      </td>
                      <td style={{ maxWidth: 200, color: 'var(--color-ink)' }}>{summarise(r)}</td>
                      <td>
                        <span className="pill" style={{ color: urgencyColor[level] || urgencyColor.unknown }}>
                          {urgencyLabel[level] || urgencyLabel.unknown}
                        </span>
                      </td>
                      <td style={{ paddingRight: 24, textAlign: 'right' }}>
                        <button className="btn-text" onClick={() => setSelected(r)}>View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Detail ─────────────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
          style={{
            background: 'color-mix(in srgb, var(--color-ink) 45%, transparent)',
            padding: 'clamp(16px, 4vw, 48px)',
          }}
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Check details"
        >
          <div className="w-full" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <span className="eyebrow" style={{ color: 'var(--color-bone)' }}>
                {new Date(selected.created_at).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="icon-btn"
                style={{ background: 'var(--color-paper)' }}
                aria-label="Close details"
              >
                <X size={15} />
              </button>
            </div>
            <DiagnosisResults result={selected.diagnosis_result} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  );
}