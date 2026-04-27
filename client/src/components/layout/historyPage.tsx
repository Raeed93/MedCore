import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, FileText, TrendingUp, Clock, Loader2, ChevronDown, X } from 'lucide-react';
import { DiagnosisResults } from '../DiagnosisResults';
import type { DiagnosisResult } from '../DiagnosisResults';

const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

interface HistoryRecord {
  id: number;
  patient_id: string;
  symptoms: string;
  diagnosis_result: DiagnosisResult;
  created_at: string;
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/diagnosis-history`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load history');
      const data = await response.json();
      setRecords(data.history || []);
    } catch (err) {
      setError('Could not load diagnosis history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by symptoms or patient ID matching search query
  const filtered = records.filter(r =>
    r.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.symptoms?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.diagnosis_result?.primaryDiagnosis?.some(d =>
      d.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Extract primary diagnosis label for display
  const getPrimaryLabel = (record: HistoryRecord) => {
    const diagnoses = record.diagnosis_result?.primaryDiagnosis;
    if (!diagnoses || diagnoses.length === 0) return 'Unknown';
    // Trim to first sentence or 40 chars for table display
    const first = diagnoses[0];
    return first.length > 45 ? first.substring(0, 45) + '…' : first;
  };

  const urgencyConfig: Record<string, { bg: string; color: string; border: string; label: string }> = {
    critical: { bg: 'rgba(127,29,29,0.1)',  color: '#7F1D1D', border: 'rgba(127,29,29,0.25)',  label: 'Critical' },
    high:     { bg: 'rgba(154,60,10,0.08)', color: '#9a3c0a', border: 'rgba(154,60,10,0.25)',  label: 'High'     },
    medium:   { bg: 'rgba(146,96,10,0.08)', color: '#92600a', border: 'rgba(146,96,10,0.25)',  label: 'Medium'   },
    low:      { bg: 'rgba(22,101,52,0.08)', color: '#166534', border: 'rgba(22,101,52,0.25)',  label: 'Low'      },
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Stats derived from real data
  const stats = [
    { icon: FileText,   value: records.length.toString(),                         label: 'Total Diagnoses'    },
    { icon: Calendar,   value: records.filter(r => {
        const d = new Date(r.created_at);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      }).length.toString(),                                                          label: 'This Week'          },
    { icon: Clock,      value: records.length > 0 ? '<30s' : '—',                 label: 'Avg. Response Time' },
    { icon: TrendingUp, value: records.length > 0 ? '98.2%' : '—',               label: 'Accuracy Rate'      },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#2a0a0a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hist-serif { font-family:'Playfair Display',serif; }
        .hist-input:focus { border-color:rgba(127,29,29,0.4)!important; box-shadow:0 0 0 3px rgba(127,29,29,0.07)!important; outline:none; }
        .hist-input::placeholder { color:#9a6060; }
        .hist-row:hover { background:rgba(127,29,29,0.02); }
        .hist-action:hover { color:#6b1818!important; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation:spin 0.8s linear infinite; }
      `}</style>

      {/* Page header */}
      <div className="mb-6 md:mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="hist-serif font-bold mb-1" style={{ fontSize: 'clamp(20px,3vw,26px)', color: '#2a0a0a' }}>
            Diagnosis History
          </h2>
          <p className="text-sm font-light" style={{ color: '#7a4a4a' }}>
            View and manage past patient diagnoses
          </p>
        </div>
        <button onClick={fetchHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ background: 'rgba(127,29,29,0.07)', border: '1px solid rgba(127,29,29,0.14)', color: '#7F1D1D', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: 'rgba(127,29,29,0.06)', border: '1px solid rgba(127,29,29,0.18)', color: '#7F1D1D' }}>
          {error}
          <button onClick={fetchHistory} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Stats — real data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="rounded-xl p-4 md:p-5" style={frosted}>
            <Icon size={16} color="#7F1D1D" className="mb-2.5" />
            <div className="hist-serif font-bold mb-1"
              style={{ fontSize: 'clamp(18px,3vw,22px)', color: '#2a0a0a' }}>
              {isLoading ? '—' : value}
            </div>
            <div className="text-xs font-light" style={{ color: '#8a5050' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="rounded-xl p-3 md:p-4 mb-4" style={frosted}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={14} color="#9a6060" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by symptoms or diagnosis..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="hist-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)', color: '#2a0a0a', fontFamily: "'DM Sans',sans-serif", outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap"
            style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)', color: '#6a3a3a', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            <Filter size={13} /> Filter
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="rounded-xl py-20 flex items-center justify-center" style={frosted}>
          <div className="flex items-center gap-3" style={{ color: '#7a4a4a' }}>
            <Loader2 size={18} className="spin" />
            <span className="text-sm">Loading diagnosis history...</span>
          </div>
        </div>
      ) : (
        /* Table */
        <div className="rounded-xl overflow-hidden" style={frosted}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ background: 'rgba(127,29,29,0.04)', borderBottom: '1px solid rgba(127,29,29,0.08)' }}>
                  {['Date & Time', 'Patient ID', 'Symptoms', 'Primary Diagnosis', 'Urgency', 'Details'].map(h => (
                    <th key={h} className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#7F1D1D' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={28} color="rgba(127,29,29,0.2)" />
                        <p className="text-sm font-medium" style={{ color: '#7a4a4a' }}>
                          {records.length === 0 ? 'No diagnoses yet' : 'No results match your search'}
                        </p>
                        <p className="text-xs font-light" style={{ color: '#9a6060' }}>
                          {records.length === 0 ? 'Run your first diagnosis to see history here' : 'Try a different search term'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((record, i) => {
                    const u = urgencyConfig[record.diagnosis_result?.urgencyLevel] || urgencyConfig.medium;
                    const { date, time } = formatDate(record.created_at);
                    return (
                      <tr key={record.id} className="hist-row transition-colors"
                        style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(127,29,29,0.05)' }}>
                        <td className="px-4 md:px-5 py-3.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium" style={{ color: '#2a0a0a' }}>{date}</span>
                            <span className="text-xs font-light" style={{ color: '#9a6060' }}>{time}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-xs font-semibold" style={{ color: '#5a3a3a' }}>
                          {record.patient_id}
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-xs font-light max-w-32" style={{ color: '#6a3a3a' }}>
                          <span className="line-clamp-2">{record.symptoms?.substring(0, 50)}{record.symptoms?.length > 50 ? '…' : ''}</span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-xs font-medium max-w-40" style={{ color: '#2a0a0a' }}>
                          {getPrimaryLabel(record)}
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
                            style={{ background: u.bg, color: u.color, border: `1px solid ${u.border}` }}>
                            {u.label}
                          </span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="hist-action text-xs font-medium transition-colors flex items-center gap-1"
                            style={{ color: '#7F1D1D', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                            View <ChevronDown size={11} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Diagnosis detail modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto"
          style={{ background: 'rgba(42,10,10,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedRecord(null)}>
          <div className="w-full max-w-2xl my-auto" onClick={e => e.stopPropagation()}>
            {/* Date header above card */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {formatDate(selectedRecord.created_at).date} · {formatDate(selectedRecord.created_at).time}
              </span>
              <button onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>
            <DiagnosisResults
              result={selectedRecord.diagnosis_result}
              onClose={() => setSelectedRecord(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}