import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Building, Award, Calendar, Edit, Save, Shield, Bell, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  specialty: string | null;
  hospital: string | null;
  location: string | null;
  license_number: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [encryption] = useState(true);

  // Profile form state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    hospital: '',
    location: '',
    license_number: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load profile');
      const data = await response.json();
      setProfile(data.profile);
      setFormData({
        name: data.profile.name || '',
        specialty: data.profile.specialty || '',
        hospital: data.profile.hospital || '',
        location: data.profile.location || '',
        license_number: data.profile.license_number || '',
      });
    } catch (err) {
      setError('Could not load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to save profile');
      const data = await response.json();
      setProfile(data.profile);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Could not save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current profile values
    if (profile) {
      setFormData({
        name: profile.name || '',
        specialty: profile.specialty || '',
        hospital: profile.hospital || '',
        location: profile.location || '',
        license_number: profile.license_number || '',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const getInputStyle = (): React.CSSProperties => ({
    width: '100%', padding: '11px 14px', borderRadius: 9,
    background: isEditing ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
    border: `1px solid ${isEditing ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'}`,
    fontSize: 13, color: '#2a0a0a', boxSizing: 'border-box' as const,
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
    opacity: isEditing ? 1 : 0.85,
    transition: 'border-color 0.15s, box-shadow 0.15s',
  });

  // Format joined date
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';

  // Loading skeleton
  if (isLoading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
        <div className="mb-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px,3vw,26px)', fontWeight: 700, color: '#2a0a0a', marginBottom: 4 }}>Profile Settings</h2>
          <p className="text-sm font-light" style={{ color: '#7a4a4a' }}>Manage your account information and preferences</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3" style={{ color: '#7a4a4a' }}>
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#2a0a0a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .prof-serif { font-family:'Playfair Display',serif; }
        .prof-input:focus { border-color:rgba(127,29,29,0.4)!important; box-shadow:0 0 0 3px rgba(127,29,29,0.07)!important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* Page header */}
      <div className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="prof-serif font-bold mb-1" style={{ fontSize: 'clamp(20px,3vw,26px)', color: '#2a0a0a' }}>Profile Settings</h2>
          <p className="text-sm font-light" style={{ color: '#7a4a4a' }}>Manage your account information and preferences</p>
        </div>

        {/* Success message */}
        {saveSuccess && (
          <div className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(22,101,52,0.08)', border: '1px solid rgba(22,101,52,0.2)', color: '#166534' }}>
            ✓ Profile saved successfully
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: 'rgba(127,29,29,0.06)', border: '1px solid rgba(127,29,29,0.18)', color: '#7F1D1D' }}>
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start">

        {/* Profile card */}
        <div className="lg:col-span-1 rounded-2xl p-6 md:p-8 text-center" style={frosted}>
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(127,29,29,0.07)', border: '2px solid rgba(127,29,29,0.14)' }}>
            <User size={32} color="#7F1D1D" />
          </div>

          <h3 className="prof-serif font-bold mb-1" style={{ fontSize: 17, color: '#2a0a0a' }}>
            {profile?.name || user?.name || 'Your Name'}
          </h3>
          <p className="text-xs mb-4" style={{ color: '#8a5050' }}>
            {formData.specialty || 'Medical Professional'}
          </p>
          <div className="flex items-center justify-center gap-1.5 mb-5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#166534' }} />
            <span className="text-xs font-medium" style={{ color: '#166534' }}>Verified Professional</span>
          </div>

          {/* Edit / Save / Cancel buttons */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <button onClick={handleSave} disabled={isSaving}
                className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{ background: '#7F1D1D', color: '#fae0d8', border: '1.5px solid #7F1D1D', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1, fontFamily: "'DM Sans',sans-serif" }}>
                {isSaving
                  ? <><Loader2 size={13} className="spin" /> Saving...</>
                  : <><Save size={13} /> Save Changes</>
                }
              </button>
              <button onClick={handleCancel}
                className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{ background: 'transparent', color: '#7a4a4a', border: '1.5px solid rgba(127,29,29,0.2)', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)}
              className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
              style={{ background: 'transparent', color: '#7F1D1D', border: '1.5px solid #7F1D1D', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
              <Edit size={13} /> Edit Profile
            </button>
          )}

          {/* Quick stats */}
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(127,29,29,0.08)' }}>
            {[
              { label: 'Member since', value: joinedDate },
              { label: 'Email', value: profile?.email || user?.email || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(127,29,29,0.05)' }}>
                <span className="text-xs" style={{ color: '#9a6060' }}>{label}</span>
                <span className="text-xs font-medium truncate ml-2 max-w-32" style={{ color: '#2a0a0a' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panels */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Personal info */}
          <div className="rounded-2xl p-5 md:p-7" style={frosted}>
            <h3 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: '#2a0a0a' }}>
              <User size={14} color="#7F1D1D" /> Personal Information
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#7a4a4a' }}>Full Name</label>
                <input
                  type="text" value={formData.name} disabled={!isEditing}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="prof-input" style={getInputStyle()}
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#7a4a4a' }}>
                  <Mail size={11} color="#9a6060" /> Email address
                </label>
                <input
                  type="email" value={profile?.email || ''} disabled
                  className="prof-input"
                  style={{ ...getInputStyle(), opacity: 0.6, cursor: 'not-allowed' }}
                />
                <p className="text-xs mt-1 font-light" style={{ color: '#9a6060' }}>Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Professional info */}
          <div className="rounded-2xl p-5 md:p-7" style={frosted}>
            <h3 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: '#2a0a0a' }}>
              <Award size={14} color="#7F1D1D" /> Professional Information
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Specialization',    icon: Award,    key: 'specialty',       placeholder: 'e.g. Cardiology' },
                { label: 'Hospital / Clinic', icon: Building, key: 'hospital',        placeholder: 'e.g. Central Medical Center' },
                { label: 'Location',          icon: MapPin,   key: 'location',        placeholder: 'e.g. New York, NY' },
                { label: 'License Number',    icon: Calendar, key: 'license_number',  placeholder: 'e.g. MD-12345-NY' },
              ].map(({ label, icon: Icon, key, placeholder }) => (
                <div key={key}>
                  <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#7a4a4a' }}>
                    <Icon size={11} color="#9a6060" /> {label}
                  </label>
                  <input
                    type="text"
                    value={formData[key as keyof typeof formData]}
                    placeholder={isEditing ? placeholder : '—'}
                    disabled={!isEditing}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    className="prof-input" style={getInputStyle()}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-2xl p-5 md:p-7" style={frosted}>
            <h3 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: '#2a0a0a' }}>
              <Shield size={14} color="#7F1D1D" /> Preferences
            </h3>
            <div className="flex flex-col gap-5">
              {[
                { icon: Bell,   title: 'Email Notifications',       desc: 'Receive updates via email',     value: notifications, toggle: () => setNotifications(v => !v) },
                { icon: Shield, title: 'Two-Factor Authentication', desc: 'Enhanced account security',      value: twoFactor,     toggle: () => setTwoFactor(v => !v) },
                { icon: Lock,   title: 'Data Encryption',           desc: 'End-to-end encryption enabled',  value: encryption,    toggle: () => {} },
              ].map(({ icon: Icon, title, desc, value, toggle }) => (
                <div key={title} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(127,29,29,0.07)' }}>
                      <Icon size={14} color="#7F1D1D" />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: '#2a0a0a' }}>{title}</p>
                      <p className="text-xs font-light" style={{ color: '#9a6060' }}>{desc}</p>
                    </div>
                  </div>
                  <div onClick={toggle} className="relative flex-shrink-0 rounded-full cursor-pointer transition-all"
                    style={{ width: 40, height: 22, background: value ? '#7F1D1D' : 'rgba(127,29,29,0.15)' }}>
                    <div className="absolute top-0.5 rounded-full bg-white transition-all"
                      style={{ width: 18, height: 18, right: value ? 2 : 'auto', left: value ? 'auto' : 2 }} />
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