import { AlertTriangle, CheckCircle, Activity, FileText, X } from 'lucide-react';

export interface DiagnosisResult {
  primaryDiagnosis: string[];
  differentialDiagnosis: string[];
  recommendedTests: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  notes: string;
}

interface DiagnosisResultsProps {
  result: DiagnosisResult;
  onClose: () => void;
}

export function DiagnosisResults({ result, onClose }: DiagnosisResultsProps) {
  const getUrgencyColor = () => {
    switch (result.urgencyLevel) {
      case 'critical':
        return 'bg-red-500/20 border-red-400 text-white';
      case 'high':
        return 'bg-orange-500/20 border-orange-400 text-white';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-400 text-white';
      case 'low':
        return 'bg-green-500/20 border-green-400 text-white';
    }
  };

  const getUrgencyIcon = () => {
    if (result.urgencyLevel === 'critical' || result.urgencyLevel === 'high') {
      return <AlertTriangle className="w-5 h-5" />;
    }
    return <CheckCircle className="w-5 h-5" />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl text-white">AI-Generated Diagnosis</h2>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Urgency Level */}
      <div className={`flex items-center gap-3 p-4 rounded-lg border-2 mb-6 backdrop-blur-sm ${getUrgencyColor()}`}>
        {getUrgencyIcon()}
        <div>
          <p className="text-sm text-white/80">Urgency Level</p>
          <p className="uppercase tracking-wide">{result.urgencyLevel}</p>
        </div>
      </div>

      {/* Primary Diagnosis */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-white mb-3">
          <Activity className="w-5 h-5 text-white" />
          Primary Diagnosis
        </h3>
        <ul className="space-y-2">
          {result.primaryDiagnosis.map((diagnosis, index) => (
            <li key={index} className="bg-white/20 backdrop-blur-sm border-l-4 border-white p-3 rounded text-white">
              {diagnosis}
            </li>
          ))}
        </ul>
      </div>

      {/* Differential Diagnosis */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-white mb-3">
          <FileText className="w-5 h-5 text-white" />
          Differential Diagnosis
        </h3>
        <ul className="space-y-2">
          {result.differentialDiagnosis.map((diagnosis, index) => (
            <li key={index} className="flex items-start gap-2 text-white/90">
              <span className="text-white mt-1">•</span>
              <span>{diagnosis}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Tests */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-white mb-3">
          <Activity className="w-5 h-5 text-white" />
          Recommended Tests & Scans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {result.recommendedTests.map((test, index) => (
            <div key={index} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm p-3 rounded border border-white/20">
              <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-white">{test}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h3 className="text-white mb-3">Clinical Recommendations</h3>
        <ul className="space-y-2">
          {result.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-2 text-white/90">
              <span className="text-white mt-1">→</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Notes */}
      {result.notes && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <p className="text-sm text-white/90 mb-2">Additional Notes</p>
          <p className="text-white/80">{result.notes}</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-white/20">
        <p className="text-xs text-white/60 italic">
          ⚠️ This is an AI-generated suggestion. Always use clinical judgment and validate with additional examination and testing.
        </p>
      </div>
    </div>
  );
}