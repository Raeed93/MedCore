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

export default function PatientManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ patientId:'P-2024-001', age:'', gender:'', symptoms:'', duration:'', history:'' });

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
      const response = await fetch('http://localhost:3000/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: formData.patientId, age: parseInt(formData.age), gender: formData.gender, symptoms: formData.symptoms, duration: formData.duration, history: formData.history }),
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
        urgencyLevel: data.urgencyLevel || 'medium',
        recommendations: data.recommendations || [],
        notes: data.notes || '',
        sources: data.sources || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to AI service. Please ensure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: 9, fontSize: 14, color: '#2a0a0a',
    boxSizing: 'border-box' as const,
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, fontWeight: 500, color: '#3a1a1a', marginBottom: 8,
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", maxWidth:860, margin:'0 auto' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .pm-input:focus { border-color:rgba(127,29,29,0.45) !important; box-shadow:0 0 0 3px rgba(127,29,29,0.08) !important; }
        .pm-input::placeholder { color:#9a6060; }
        .pm-btn:hover:not(:disabled) { background:#6b1818 !important; }
        @keyframes pm-spin { to { transform:rotate(360deg); } }
        @keyframes pm-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

        {/* Page header */}
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#2a0a0a', marginBottom:4 }}>Patient Diagnosis</h2>
          <p style={{ fontSize:13, color:'#7a4a4a', fontWeight:300 }}>Fill in patient details to generate an AI-assisted clinical assessment</p>
        </div>

        {/* Form card */}
        <div style={{ ...frosted, borderRadius:16, padding:'32px 36px' }}>
          <div style={{ borderBottom:'1px solid rgba(127,29,29,0.08)', paddingBottom:18, marginBottom:26 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#2a0a0a', marginBottom:3 }}>Patient Information</h3>
            <p style={{ fontSize:12, color:'#8a5050', fontWeight:300 }}>Age, gender and symptoms are required</p>
          </div>

          {error && (
            <div style={{ marginBottom:20, padding:'11px 16px', borderRadius:9, background:'rgba(127,29,29,0.06)', border:'1px solid rgba(127,29,29,0.18)', fontSize:13, color:'#7F1D1D', display:'flex', alignItems:'center', gap:8 }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Row 1 */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              <div>
                <label style={labelStyle}><User size={13} color="#7F1D1D" /> Patient ID</label>
                <input name="patientId" value={formData.patientId} onChange={handleInputChange} className="pm-input" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><Calendar size={13} color="#7F1D1D" /> Age</label>
                <input name="age" type="number" placeholder="Years" value={formData.age} onChange={handleInputChange} className="pm-input" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><User size={13} color="#7F1D1D" /> Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="pm-input" style={{ ...inputStyle, appearance:'none' as const }}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}><Activity size={13} color="#7F1D1D" /> Symptoms & Chief Complaint</label>
              <textarea name="symptoms" rows={3} placeholder="Describe patient symptoms, vital signs, physical examination findings..."
                value={formData.symptoms} onChange={handleInputChange} className="pm-input" style={{ ...inputStyle, resize:'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}><Clock size={13} color="#7F1D1D" /> Duration of Symptoms</label>
              <input name="duration" placeholder="e.g., 3 days, 2 weeks, 1 month" value={formData.duration} onChange={handleInputChange} className="pm-input" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}><FileText size={13} color="#7F1D1D" /> Medical History & Current Medications</label>
              <textarea name="history" rows={2} placeholder="Relevant medical history, allergies, current medications..."
                value={formData.history} onChange={handleInputChange} className="pm-input" style={{ ...inputStyle, resize:'vertical' }} />
            </div>

            <button onClick={handleGenerate} disabled={isLoading} className="pm-btn" style={{
              width:'100%', background:'#7F1D1D', color:'#f5ebe8', border:'none',
              padding:'13px 0', borderRadius:9, fontSize:14, fontWeight:500,
              cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.72 : 1,
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              transition:'background 0.18s', fontFamily:"'DM Sans',sans-serif",
            }}>
              {isLoading
                ? <><div style={{ width:17, height:17, border:'2px solid rgba(250,224,216,0.3)', borderTopColor:'#fae0d8', borderRadius:'50%', animation:'pm-spin 0.8s linear infinite' }} /> Analyzing Clinical Data...</>
                : <><Activity size={16} /> Generate AI Diagnosis</>
              }
            </button>
          </div>
        </div>

        {/* Results */}
        {result ? (
          <div style={{ animation:'pm-fade 0.3s ease' }}>
            <DiagnosisResults result={result} onClose={() => setResult(null)} />
          </div>
        ) : (
          <div style={{ ...frosted, borderRadius:16, padding:'52px 36px', textAlign:'center', minHeight:240, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ marginBottom:18, opacity:0.15 }}>
              <svg viewBox="0 0 200 36" fill="none" style={{ width:180 }}>
                <path d="M0 18 L38 18 L50 5 L58 31 L66 9 L74 18 L200 18" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontSize:15, fontWeight:500, color:'#5a3a3a', marginBottom:5 }}>Fill out the patient information form</h3>
            <p style={{ fontSize:13, color:'#9a6060', fontWeight:300 }}>AI diagnostic results will appear here</p>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ background:'rgba(127,29,29,0.05)', border:'1px solid rgba(127,29,29,0.1)', borderRadius:10, padding:'13px 18px', display:'flex', alignItems:'center', gap:12 }}>
          <AlertTriangle size={15} color="#7F1D1D" style={{ flexShrink:0 }} />
          <p style={{ fontSize:12, color:'#7a4a4a', lineHeight:1.6, margin:0 }}>
            This AI system is for clinical decision support only. Always validate with professional medical judgment and additional testing.
          </p>
        </div>
      </div>

      {/* Help button */}
      <div style={{ position:'fixed', bottom:24, right:24 }}>
        <button style={{ background:'rgba(255,255,255,0.55)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.7)', borderRadius:'50%', width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#7a4a4a' }}>
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
}