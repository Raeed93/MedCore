import { useState } from 'react';
import { AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { DiagnosisResults } from './DiagnosisResults';
import type { DiagnosisResult } from './DiagnosisResults';

// Symptoms that need a person, now. Same list as the dashboard home so the
// wording never drifts between the two places it appears.
//
// NOTE: this is a static notice, not screening. Nothing here inspects what
// the user typed. The deterministic check that would do that (red_flags.py)
// does not exist yet, and until it does neither this page nor the landing
// page should imply otherwise.
const EMERGENCY = [
  'Chest pain or pressure',
  'Difficulty breathing',
  'Sudden weakness or slurred speech',
  'Bleeding that will not stop',
  'Sudden confusion or fainting',
  'Thoughts of harming yourself',
];

export default function PatientManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    age: '', gender: '', symptoms: '', duration: '', history: '',
  });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.symptoms.trim() || !form.age || !form.gender) {
      setError('Add your symptoms, age and sex to continue.');
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
          // The backend contract is unchanged — same endpoint, same field
          // names. patientId is no longer collected from the user (see the
          // comment on the form below) so it is generated here to keep the
          // payload shape identical.
          patientId: `check-${Date.now()}`,
          age: parseInt(form.age, 10),
          gender: form.gender,
          symptoms: form.symptoms,
          duration: form.duration,
          history: form.history,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed (${response.status})`);
      }
      const data = await response.json();
      setResult({
        primaryDiagnosis: data.primaryDiagnosis || [],
        differentialDiagnosis: data.differentialDiagnosis || [],
        recommendedTests: data.recommendedTests || [],
        urgencyLevel: data.urgencyLevel || 'unknown',
        recommendations: data.recommendations || [],
        notes: data.notes || '',
        sources: data.sources || [],
        groundedInLiterature: data.groundedInLiterature !== false,
      });
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Could not reach the service. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 780 }}>

      {/* ── Header ───────────────────────────────────────────────────────
          Was "Patient Diagnosis" / "generate an AI-assisted clinical
          assessment" — a clinician writing about someone else. The person
          on this page is describing their own body. */}
      <div className="eyebrow" style={{ marginBottom: 14 }}>Symptom check</div>
      <h2 className="display-md" style={{ marginBottom: 10 }}>
        Tell us what you&rsquo;re feeling
      </h2>
      <p className="lede" style={{ fontSize: 14, marginBottom: 40 }}>
        Plain language is fine — no medical vocabulary needed. You&rsquo;ll get
        background on what these symptoms commonly relate to, drawn from public
        health literature, plus questions worth raising at your appointment.
      </p>

      {/* ── Emergency ────────────────────────────────────────────────────
          Above the form, not below it. Someone with chest pain should reach
          this before they start typing, not after they have waited on a
          model response. */}
      <div className="notice-emergency" style={{ marginBottom: 40 }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={17} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Do not use this tool in an emergency
            </p>
            <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.6, opacity: 0.85, marginBottom: 14 }}>
              Call your local emergency number or go to the nearest emergency
              department if you have any of these:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {EMERGENCY.map(item => (
                <li key={item} style={{ fontSize: 13, fontWeight: 300, opacity: 0.92 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {error && (
        <div className="notice notice-alert" style={{ marginBottom: 28 }} role="alert">
          {error}
        </div>
      )}

      {/* ── Form ─────────────────────────────────────────────────────────
          The Patient ID field is gone. It defaulted to "P-2024-001" and
          asked a person to identify themselves as a case number. The
          backend still receives a patientId — generated above — so no
          server or schema change is needed. */}
      <form onSubmit={handleSubmit}>

        <label htmlFor="sym" className="label">What are you feeling?</label>
        <textarea
          id="sym" name="symptoms" rows={4} value={form.symptoms} onChange={update}
          placeholder="For example: a sore throat and a low fever for the past three days, worse in the mornings"
          className="field"
          style={{ resize: 'vertical', lineHeight: 1.6, marginBottom: 32 }}
          required
        />

        <label htmlFor="dur" className="label">How long has this been going on?</label>
        <input
          id="dur" name="duration" value={form.duration} onChange={update}
          placeholder="A few days, two weeks, since last month…"
          className="field" style={{ marginBottom: 32 }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8" style={{ marginBottom: 32 }}>
          <div>
            <label htmlFor="age" className="label">Your age</label>
            <input
              id="age" name="age" type="number" min="0" max="120"
              value={form.age} onChange={update}
              placeholder="Years" className="field" required
            />
          </div>
          <div>
            {/* "Sex" rather than "Gender": the retrieval corpus and the
                clinical literature behind it are organised around sex, and
                that is what the answer will actually be conditioned on. */}
            <label htmlFor="sex" className="label">Sex</label>
            <select id="sex" name="gender" value={form.gender} onChange={update} className="field" required>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>

        <label htmlFor="hist" className="label">
          Anything else worth knowing? <span style={{ color: 'var(--color-faint)', fontWeight: 300 }}>Optional</span>
        </label>
        <textarea
          id="hist" name="history" rows={2} value={form.history} onChange={update}
          placeholder="Ongoing conditions, medicines you take, allergies"
          className="field"
          style={{ resize: 'vertical', lineHeight: 1.6, marginBottom: 36 }}
        />

        <button type="submit" disabled={isLoading} className="btn">
          {isLoading
            ? <><Loader2 size={14} className="spin" /> Searching the library…</>
            : <>Explain my symptoms <ArrowRight size={14} /></>}
        </button>
      </form>

      {/* ── Result ───────────────────────────────────────────────────── */}
      {result && (
        <div style={{ marginTop: 48 }}>
          <DiagnosisResults result={result} onClose={() => setResult(null)} />
        </div>
      )}

      <hr className="rule" style={{ margin: '48px 0 20px' }} />
      <p className="meta" style={{ lineHeight: 1.7, maxWidth: '62ch' }}>
        Pulse AI provides general health education only. It does not diagnose,
        treat, or prescribe, and its output may be incomplete or wrong. Always
        consult a licensed clinician about your health.
      </p>
    </div>
  );
}