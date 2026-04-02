import { useState } from 'react';
import { Activity, User, Calendar, Clock, FileText, AlertTriangle, HelpCircle } from 'lucide-react';
import { DiagnosisResults } from './DiagnosisResults';
import type { DiagnosisResult } from './DiagnosisResults';

export default function PatientManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Form State
  const [formData, setFormData] = useState({
    patientId: 'P-2024-001',
    age: '',
    gender: '',
    symptoms: '',
    duration: '',
    history: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleGenerate = async () => {
    // Validation
    if (!formData.age || !formData.gender || !formData.symptoms) {
      setError('Please fill in Age, Gender, and Symptoms at minimum');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the REAL API
      const response = await fetch('http://localhost:3000/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: formData.patientId,
          age: parseInt(formData.age),
          gender: formData.gender,
          symptoms: formData.symptoms,
          duration: formData.duration,
          history: formData.history
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate diagnosis');
      }

      const data = await response.json();
      
      // Set the result from API
      setResult({
        primaryDiagnosis: data.primaryDiagnosis || [],
        differentialDiagnosis: data.differentialDiagnosis || [],
        recommendedTests: data.recommendedTests || [],
        urgencyLevel: data.urgencyLevel || 'medium',
        recommendations: data.recommendations || [],
        notes: data.notes || '',
        sources: data.sources || []  // NEW: Medical sources used
      });
    } catch (err) {
      console.error('Error generating diagnosis:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to connect to AI service. Please ensure the server is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  // Common Input Styles
  const inputClass = "w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm transition-all";
  const labelClass = "block text-sm text-white/90 mb-2 font-medium flex items-center gap-2";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* --- SECTION 1: THE INPUT FORM --- */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl">
        <h2 className="text-2xl font-light text-white mb-6 border-b border-white/10 pb-4">
          Patient Information
        </h2>

        <div className="space-y-6">
          {/* Row 1: ID, Age, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}><User className="w-4 h-4" /> Patient ID</label>
              <input 
                name="patientId" 
                value={formData.patientId} 
                onChange={handleInputChange} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}><Calendar className="w-4 h-4" /> Age</label>
              <input 
                name="age" 
                type="number" 
                placeholder="Years" 
                value={formData.age} 
                onChange={handleInputChange} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}><User className="w-4 h-4" /> Gender</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleInputChange} 
                className={`${inputClass} appearance-none`} // appearance-none hides default arrow
              >
                <option value="" className="text-black">Select</option>
                <option value="Male" className="text-black">Male</option>
                <option value="Female" className="text-black">Female</option>
              </select>
            </div>
          </div>

          {/* Row 2: Symptoms */}
          <div>
            <label className={labelClass}><Activity className="w-4 h-4" /> Symptoms & Chief Complaint</label>
            <textarea 
              name="symptoms" 
              rows={3} 
              placeholder="Describe patient symptoms, vital signs, physical examination findings..." 
              value={formData.symptoms} 
              onChange={handleInputChange} 
              className={inputClass} 
            />
          </div>

          {/* Row 3: Duration */}
          <div>
            <label className={labelClass}><Clock className="w-4 h-4" /> Duration of Symptoms</label>
            <input 
              name="duration" 
              placeholder="e.g., 3 days, 2 weeks, 1 month" 
              value={formData.duration} 
              onChange={handleInputChange} 
              className={inputClass} 
            />
          </div>

          {/* Row 4: History */}
          <div>
            <label className={labelClass}><FileText className="w-4 h-4" /> Medical History & Current Medications</label>
            <textarea 
              name="history" 
              rows={2} 
              placeholder="Relevant medical history, allergies, current medications..." 
              value={formData.history} 
              onChange={handleInputChange} 
              className={inputClass} 
            />
          </div>

          {/* Generate Button */}
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-white text-red-900 font-bold py-4 rounded-lg hover:bg-white/90 transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-900"></div>
                Analyzing Clinical Data...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Generate AI Diagnosis
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- SECTION 2: THE RESULTS AREA --- */}
      {result ? (
        // If we have a result, show the fancy component you provided
        <div className="animate-fadeIn">
          <DiagnosisResults result={result} onClose={() => setResult(null)} />
        </div>
      ) : (
        // If no result yet, show the "Placeholder" from your screenshot
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center backdrop-blur-sm min-h-[300px] flex flex-col items-center justify-center text-white/30">
          <Activity className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-xl font-light text-white/70">Fill out the patient information form</h3>
          <p className="text-sm mt-2">Results will appear here</p>
        </div>
      )}

      {/* Footer Warning */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-center gap-3 backdrop-blur-md">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <p className="text-xs text-white/70">
          This AI system is for clinical decision support only. Always validate with professional medical judgment and additional testing.
        </p>
      </div>

      {/* Help Icon (Bottom Right) */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-black/40 p-3 rounded-full hover:bg-black/60 transition-colors text-white/50 hover:text-white border border-white/10">
            <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

