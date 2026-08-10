import { useState } from 'react';
import { Activity, User, Calendar, Clock, FileText, AlertTriangle, HelpCircle } from 'lucide-react';
import { DiagnosisResults } from './DiagnosisResults';
import type { DiagnosisResult } from './DiagnosisResults';

const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 9,
  fontSize: 14,
  color: '#2a0a0a',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box' as const,
  padding: '11px 14px',
};

export default function PatientManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patientId: 'P-2024-001', age: '', gender: '', symptoms: '', duration: '', history: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.age || !formData.gender || !formData.symptoms) {
      setError('Please fill in Age, Gender, and Symptoms at minimum');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patientId: formData.patientId, age: parseInt(formData.age),
          gender: formData.gender, symptoms: formData.symptoms,
          duration: formData.duration, history: formData.history,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate diagnosis');
      }
      const data = await response.json();
      setResult({
        primaryDiagnosis: data.primaryDiagnosis || [],
        differentialDiagnosis: data.differentialDiagnosis || [],
        recommendedTests: data.recommendedTests || [],
        urgencyLevel: data.urgencyLevel || 'umknown',
        recommendations: data.recommendations || [],
        notes: data.notes || '',
        sources: data.sources || [],
        noRelevantContext: data.noRelevantContext || false,   

      });
    } catch (err) {
     setResult(null);
      setError(err instanceof Error ? err.message : 'Could not reach the analysis service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .pm-serif { font-family: 'Playfair Display', serif; }
        .pm-input:focus { border-color:rgba(127,29,29,0.45)!important; box-shadow:0 0 0 3px rgba(127,29,29,0.08)!important; }
        .pm-input::placeholder { color:#9a6060; }
        .pm-btn:hover:not(:disabled) { background:#6b1818!important; }
        @keyframes pm-spin { to { transform:rotate(360deg); } }
        @keyframes pm-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div className="max-w-4xl mx-auto flex flex-col gap-5">

        {/* Page header */}
        <div>
          <h2 className="pm-serif font-bold mb-1" style={{ fontSize: 'clamp(20px,3vw,26px)', color: '#2a0a0a' }}>Patient Diagnosis</h2>
          <p className="text-sm font-light" style={{ color: '#7a4a4a' }}>Fill in patient details to generate an AI-assisted clinical assessment</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-6 md:p-9" style={frosted}>
          <div className="pb-5 mb-6" style={{ borderBottom: '1px solid rgba(127,29,29,0.08)' }}>
            <h3 className="pm-serif font-bold mb-1" style={{ fontSize: 18, color: '#2a0a0a' }}>Patient Information</h3>
            <p className="text-xs font-light" style={{ color: '#8a5050' }}>Age, gender and symptoms are required</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
              style={{ background: 'rgba(127,29,29,0.06)', border: '1px solid rgba(127,29,29,0.18)', color: '#7F1D1D' }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            {/* Row 1: ID / Age / Gender — stacks to 1 col on mobile, 3 on md+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#3a1a1a' }}>
                  <User size={12} color="#7F1D1D" /> Patient ID
                </label>
                <input name="patientId" value={formData.patientId} onChange={handleInputChange} className="pm-input" style={inputBase} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#3a1a1a' }}>
                  <Calendar size={12} color="#7F1D1D" /> Age
                </label>
                <input name="age" type="number" placeholder="Years" value={formData.age} onChange={handleInputChange} className="pm-input" style={inputBase} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#3a1a1a' }}>
                  <User size={12} color="#7F1D1D" /> Gender
                </label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="pm-input" style={{ ...inputBase, appearance: 'none' as const }}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#3a1a1a' }}>
                <Activity size={12} color="#7F1D1D" /> Symptoms & Chief Complaint
              </label>
              <textarea name="symptoms" rows={3} placeholder="Describe patient symptoms, vital signs, physical examination findings..."
                value={formData.symptoms} onChange={handleInputChange} className="pm-input" style={{ ...inputBase, resize: 'vertical' }} />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#3a1a1a' }}>
                <Clock size={12} color="#7F1D1D" /> Duration of Symptoms
              </label>
              <input name="duration" placeholder="e.g., 3 days, 2 weeks, 1 month" value={formData.duration} onChange={handleInputChange} className="pm-input" style={inputBase} />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#3a1a1a' }}>
                <FileText size={12} color="#7F1D1D" /> Medical History & Current Medications
              </label>
              <textarea name="history" rows={2} placeholder="Relevant medical history, allergies, current medications..."
                value={formData.history} onChange={handleInputChange} className="pm-input" style={{ ...inputBase, resize: 'vertical' }} />
            </div>

            <button onClick={handleGenerate} disabled={isLoading} className="pm-btn w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#7F1D1D', color: '#f5ebe8', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.72 : 1, fontFamily: "'DM Sans', sans-serif" }}>
              {isLoading
                ? <><div className="w-4 h-4 rounded-full border-2" style={{ borderColor: 'rgba(250,224,216,0.3)', borderTopColor: '#fae0d8', animation: 'pm-spin 0.8s linear infinite' }} /> Analyzing Clinical Data...</>
                : <><Activity size={15} /> Generate AI Diagnosis</>
              }
            </button>
          </div>
        </div>

        {/* Results */}
        {result ? (
          <div style={{ animation: 'pm-fade 0.3s ease' }}>
            <DiagnosisResults result={result} onClose={() => setResult(null)} />
          </div>
        ) : (
          <div className="rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center" style={{ ...frosted, minHeight: 220 }}>
            <div className="mb-4 opacity-15">
              <svg viewBox="0 0 200 36" fill="none" className="w-40">
                <path d="M0 18 L38 18 L50 5 L58 31 L66 9 L74 18 L200 18" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-sm font-medium mb-1" style={{ color: '#5a3a3a' }}>Fill out the patient information form</h3>
            <p className="text-xs font-light" style={{ color: '#9a6060' }}>AI diagnostic results will appear here</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: 'rgba(127,29,29,0.05)', border: '1px solid rgba(127,29,29,0.1)' }}>
          <AlertTriangle size={14} color="#7F1D1D" className="flex-shrink-0" />
          <p className="text-xs leading-relaxed" style={{ color: '#7a4a4a' }}>
            This AI system is for clinical decision support only. Always validate with professional medical judgment and additional testing.
          </p>
        </div>
      </div>

      {/* Help button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.7)', color: '#7a4a4a', cursor: 'pointer' }}>
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
}