import { AlertTriangle, CheckCircle, Activity, FileText, X, FlaskConical, ClipboardList } from 'lucide-react';

export interface DiagnosisResult {
  primaryDiagnosis: string[];
  differentialDiagnosis: string[];
  recommendedTests: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  notes: string;
  sources?: string[];
}

interface DiagnosisResultsProps {
  result: DiagnosisResult;
  onClose: () => void;
}

const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

const urgencyConfig = {
  critical: {
    bg: 'rgba(127,29,29,0.1)',
    border: 'rgba(127,29,29,0.35)',
    color: '#7F1D1D',
    label: 'Critical',
    icon: <AlertTriangle size={16} />,
  },
  high: {
    bg: 'rgba(154,60,10,0.08)',
    border: 'rgba(154,60,10,0.3)',
    color: '#9a3c0a',
    label: 'High',
    icon: <AlertTriangle size={16} />,
  },
  medium: {
    bg: 'rgba(146,96,10,0.08)',
    border: 'rgba(146,96,10,0.3)',
    color: '#92600a',
    label: 'Medium',
    icon: <CheckCircle size={16} />,
  },
  low: {
    bg: 'rgba(22,101,52,0.08)',
    border: 'rgba(22,101,52,0.3)',
    color: '#166534',
    label: 'Low',
    icon: <CheckCircle size={16} />,
  },
};

export function DiagnosisResults({ result, onClose }: DiagnosisResultsProps) {
  const urgency = urgencyConfig[result.urgencyLevel] || urgencyConfig.medium;

  return (
    <div
      className="rounded-2xl p-6 md:p-8 flex flex-col gap-6"
      style={{ ...frosted, fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .dr-serif { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="dr-serif font-bold mb-1" style={{ fontSize: 20, color: '#2a0a0a' }}>
            AI-Generated Diagnosis
          </h2>
          <p className="text-xs font-light" style={{ color: '#8a5050' }}>
            Review all findings carefully before clinical decision-making
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
          style={{ color: '#9a6060', border: '1px solid rgba(127,29,29,0.12)', background: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Urgency banner */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: urgency.bg, border: `1px solid ${urgency.border}` }}
      >
        <span style={{ color: urgency.color }}>{urgency.icon}</span>
        <div>
          <p className="text-xs font-light mb-0.5" style={{ color: urgency.color, opacity: 0.75 }}>Urgency Level</p>
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: urgency.color }}>
            {urgency.label}
          </p>
        </div>
      </div>

      {/* Primary Diagnosis */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7F1D1D' }}>
          <Activity size={13} /> Primary Diagnosis
        </h3>
        <div className="flex flex-col gap-2">
          {result.primaryDiagnosis.map((diagnosis, i) => (
            <div
              key={i}
              className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(127,29,29,0.18)',
                borderLeft: '3px solid #7F1D1D',
                color: '#2a0a0a',
                borderRadius: '0 10px 10px 0',
              }}
            >
              {diagnosis}
            </div>
          ))}
        </div>
      </div>

      {/* Differential Diagnosis */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7F1D1D' }}>
          <FileText size={13} /> Differential Diagnosis
        </h3>
        <div className="flex flex-col gap-2">
          {result.differentialDiagnosis.map((diagnosis, i) => (
            <div key={i} className="flex items-start gap-3 text-sm" style={{ color: '#3a1a1a' }}>
              <div
                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                style={{ background: 'rgba(127,29,29,0.35)' }}
              />
              <span className="font-light leading-relaxed">{diagnosis}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tests */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7F1D1D' }}>
          <FlaskConical size={13} /> Recommended Tests & Scans
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {result.recommendedTests.map((test, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm"
              style={{
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.7)',
                color: '#2a0a0a',
              }}
            >
              <CheckCircle size={13} color="#7F1D1D" className="flex-shrink-0" />
              <span className="font-light">{test}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7F1D1D' }}>
          <ClipboardList size={13} /> Clinical Recommendations
        </h3>
        <div className="flex flex-col gap-2">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 text-sm" style={{ color: '#3a1a1a' }}>
              <span className="font-medium mt-0.5 flex-shrink-0" style={{ color: '#7F1D1D' }}>→</span>
              <span className="font-light leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      {result.notes && (
        <div
          className="px-4 py-4 rounded-xl"
          style={{ background: 'rgba(127,29,29,0.04)', border: '1px solid rgba(127,29,29,0.1)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7F1D1D' }}>
            Additional Notes
          </p>
          <p className="text-sm font-light leading-relaxed" style={{ color: '#5a3a3a' }}>{result.notes}</p>
        </div>
      )}

      {/* Sources */}
      {result.sources && result.sources.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9a6060' }}>
            Medical Sources
          </h3>
          <div className="flex flex-col gap-1.5">
            {result.sources.map((source, i) => (
              <div key={i} className="flex items-start gap-2 text-xs font-light" style={{ color: '#7a4a4a' }}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: '#9a6060' }}>[{i + 1}]</span>
                <span className="leading-relaxed">{source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer disclaimer */}
      <div
        className="pt-4 flex items-start gap-2"
        style={{ borderTop: '1px solid rgba(127,29,29,0.08)' }}
      >
        <AlertTriangle size={12} color="#9a6060" className="flex-shrink-0 mt-0.5" />
        <p className="text-xs font-light italic leading-relaxed" style={{ color: '#9a6060' }}>
          This is an AI-generated suggestion. Always use clinical judgment and validate with additional examination and testing.
        </p>
      </div>
    </div>
  );
}