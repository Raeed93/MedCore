import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit, Save, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── Design tokens ───────────────────────────────────────────────────────────
const T = {
  ink: '#2a0a0a',
  body: '#5a3a3a',
  muted: '#7a4a4a',
  faint: '#9a6060',
  brand: '#7F1D1D',
  cream: '#f5ebe8',
  ok: '#166534',
};

const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

interface Profile {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({}));

      // A 401 is a session problem, not a server problem — say so plainly
      // rather than telling the person to "try again" on something retrying
      // will not fix.
      if (res.status === 401) {
        setError('Your session expired. Sign in again to view your profile.');
        return;
      }
      if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);

      setProfile(data.profile);
      setName(data.profile.name || '');
    } catch (err: any) {
      console.error('Profile load failed:', err);
      setError(err.message || 'Could not load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);

      setProfile(data.profile);
      setName(data.profile.name || '');
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Profile save failed:', err);
      setError(err.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(profile?.name || '');
    setIsEditing(false);
    setError(null);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 9,
    background: isEditing ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
    border: `1px solid ${isEditing ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'}`,
    fontSize: 13, color: T.ink, boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
    opacity: isEditing ? 1 : 0.85,
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';

  const styleTag = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
      .prof-serif { font-family:'Playfair Display', serif; }
      .prof-input:focus { border-color:rgba(127,29,29,0.4); box-shadow:0 0 0 3px rgba(127,29,29,0.07); }
      @keyframes prof-spin { to { transform: rotate(360deg); } }
      .prof-spin { animation: prof-spin 0.8s linear infinite; }
      @media (prefers-reduced-motion: reduce) { .prof-spin { animation:none; } }
    `}</style>
  );

  const header = (
    <div>
      <h2 className="prof-serif font-bold mb-1"
        style={{ fontSize: 'clamp(20px,3vw,26px)', color: T.ink }}>
        Profile
      </h2>
      <p className="text-sm font-light" style={{ color: T.muted }}>
        Manage your account details
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {styleTag}
        <div className="mb-6">{header}</div>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3" style={{ color: T.muted }}>
            <Loader2 size={20} className="prof-spin" />
            <span className="text-sm">Loading profile…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: T.ink }}>
      {styleTag}

      <div className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
        {header}
        {saveSuccess && (
          <div className="px-4 py-2 rounded-xl text-sm font-medium" role="status"
            style={{ background: 'rgba(22,101,52,0.08)', border: '1px solid rgba(22,101,52,0.2)', color: T.ok }}>
            Profile saved
          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-3" role="alert"
          style={{ background: 'rgba(127,29,29,0.06)', border: '1px solid rgba(127,29,29,0.18)', color: T.brand }}>
          <span>{error}</span>
          <button onClick={fetchProfile} className="ml-auto text-xs underline"
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start">

        {/* ── Identity card ─────────────────────────────────────────── */}
        <div className="lg:col-span-1 rounded-2xl p-6 md:p-8 text-center" style={frosted}>
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(127,29,29,0.07)', border: '2px solid rgba(127,29,29,0.14)' }}>
            <User size={32} color={T.brand} />
          </div>

          <h3 className="prof-serif font-bold mb-1" style={{ fontSize: 17, color: T.ink }}>
            {profile?.name || user?.name || 'Your name'}
          </h3>
          <p className="text-xs mb-5" style={{ color: T.faint }}>
            {profile?.email || user?.email || '—'}
          </p>

          {isEditing ? (
            <div className="flex flex-col gap-2">
              <button onClick={handleSave} disabled={isSaving}
                className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{
                  background: T.brand, color: T.cream, border: `1.5px solid ${T.brand}`,
                  cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1,
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                {isSaving
                  ? <><Loader2 size={13} className="prof-spin" /> Saving…</>
                  : <><Save size={13} /> Save changes</>}
              </button>
              <button onClick={handleCancel}
                className="w-full py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: 'transparent', color: T.muted,
                  border: '1.5px solid rgba(127,29,29,0.2)', cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)}
              className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              style={{
                background: 'transparent', color: T.brand,
                border: `1.5px solid ${T.brand}`, cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif",
              }}>
              <Edit size={13} /> Edit profile
            </button>
          )}

          <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(127,29,29,0.08)' }}>
            <div className="flex justify-between py-2">
              <span className="text-xs flex items-center gap-1.5" style={{ color: T.faint }}>
                <Calendar size={11} /> Member since
              </span>
              <span className="text-xs font-medium" style={{ color: T.ink }}>{joinedDate}</span>
            </div>
          </div>
        </div>

        {/* ── Account details ───────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          <div className="rounded-2xl p-5 md:p-7" style={frosted}>
            <h3 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: T.ink }}>
              <User size={14} color={T.brand} /> Account details
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="prof-name" className="block text-xs font-medium mb-2"
                  style={{ color: T.body }}>
                  Full name
                </label>
                <input
                  id="prof-name" type="text" value={name} disabled={!isEditing}
                  onChange={e => setName(e.target.value)}
                  className="prof-input" style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="prof-email" className="flex items-center gap-1.5 text-xs font-medium mb-2"
                  style={{ color: T.body }}>
                  <Mail size={11} color={T.faint} /> Email address
                </label>
                <input
                  id="prof-email" type="email" value={profile?.email || ''} disabled
                  className="prof-input"
                  style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                />
                <p className="text-xs mt-1.5 font-light" style={{ color: T.faint }}>
                  Your email is how you sign in, so it cannot be changed here.
                </p>
              </div>
            </div>
          </div>

          {/* ── What we store ─────────────────────────────────────────
              Replaces the old "Preferences" panel, which rendered toggles for
              two-factor auth and end-to-end encryption that were hardcoded to
              on and wired to nothing. Describing what the app actually does is
              more useful — and more honest — than a switch that does not
              switch anything. */}
          <div className="rounded-2xl p-5 md:p-7" style={frosted}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: T.ink }}>
              <Shield size={14} color={T.brand} /> Your data
            </h3>

            <div className="flex flex-col gap-3">
              {[
                {
                  title: 'What is stored',
                  desc: 'Your name, email, and the symptom checks you run, so you can review them later in History.',
                },
                {
                  title: 'How you sign in',
                  desc: 'A single-use link sent to your email. There is no password to leak or reuse.',
                },
                {
                  title: 'Who can see it',
                  desc: 'Your symptom checks are visible only to your own signed-in account.',
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="flex-shrink-0 rounded-full mt-1.5"
                    style={{ width: 4, height: 4, background: T.brand }} />
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: T.ink }}>{title}</p>
                    <p className="text-xs font-light" style={{ color: T.muted, lineHeight: 1.6 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}