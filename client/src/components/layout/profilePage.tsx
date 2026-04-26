import { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Award, Calendar, Edit, Save, Shield, Bell, Lock } from 'lucide-react';

const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [encryption, setEncryption] = useState(true);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 9,
    background: isEditing ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
    border: `1px solid ${isEditing ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'}`,
    fontSize: 13, color: '#2a0a0a', boxSizing: 'border-box' as const,
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    opacity: isEditing ? 1 : 0.8,
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{ width:42, height:23, borderRadius:100, position:'relative', cursor:'pointer', background: value ? '#7F1D1D' : 'rgba(127,29,29,0.15)', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:3, left: value ? 'auto' : 3, right: value ? 3 : 'auto', width:17, height:17, borderRadius:'50%', background:'#fff', transition:'left 0.2s, right 0.2s' }} />
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color:'#2a0a0a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .prof-input:focus { border-color:rgba(127,29,29,0.4) !important; box-shadow:0 0 0 3px rgba(127,29,29,0.07) !important; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#2a0a0a', marginBottom:4 }}>Profile Settings</h2>
        <p style={{ fontSize:13, color:'#7a4a4a', fontWeight:300 }}>Manage your account information and preferences</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:18 }}>

        {/* Profile card */}
        <div style={{ ...frosted, borderRadius:16, padding:'28px 22px', textAlign:'center', alignSelf:'start' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', margin:'0 auto 14px', background:'rgba(127,29,29,0.07)', border:'2px solid rgba(127,29,29,0.14)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <User size={34} color="#7F1D1D" />
          </div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#2a0a0a', marginBottom:3 }}>Dr. Sarah Johnson</h3>
          <p style={{ fontSize:12, color:'#8a5050', marginBottom:14 }}>Cardiologist</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, marginBottom:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#166534' }} />
            <span style={{ fontSize:11, color:'#166534', fontWeight:500 }}>Verified Professional</span>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} style={{
            width:'100%', padding:'10px 0', borderRadius:9,
            background: isEditing ? '#7F1D1D' : 'transparent',
            color: isEditing ? '#fae0d8' : '#7F1D1D',
            border:'1.5px solid #7F1D1D', fontSize:13, fontWeight:500,
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7,
            transition:'all 0.18s', fontFamily:"'DM Sans',sans-serif",
          }}>
            {isEditing ? <><Save size={14} /> Save Changes</> : <><Edit size={14} /> Edit Profile</>}
          </button>
          <div style={{ borderTop:'1px solid rgba(127,29,29,0.08)', marginTop:20, paddingTop:16 }}>
            {[{ label:'Member since', value:'Jan 2023' },{ label:'Diagnoses run', value:'247' },{ label:'Department', value:'Cardiology' }].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(127,29,29,0.05)' }}>
                <span style={{ fontSize:11, color:'#9a6060' }}>{label}</span>
                <span style={{ fontSize:11, fontWeight:500, color:'#2a0a0a' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panels */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Personal info */}
          <div style={{ ...frosted, borderRadius:16, padding:'26px 28px' }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:'#2a0a0a', marginBottom:18, display:'flex', alignItems:'center', gap:8 }}>
              <User size={15} color="#7F1D1D" /> Personal Information
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[{ label:'First Name', value:'Sarah' },{ label:'Last Name', value:'Johnson' }].map(({ label, value }) => (
                  <div key={label}>
                    <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#7a4a4a', marginBottom:6 }}>{label}</label>
                    <input type="text" defaultValue={value} disabled={!isEditing} className="prof-input" style={inputStyle} />
                  </div>
                ))}
              </div>
              {[{ label:'Email address', icon:Mail, type:'email', value:'sarah.johnson@medcore.ai' },{ label:'Phone number', icon:Phone, type:'tel', value:'+1 (555) 123-4567' }].map(({ label, icon:Icon, type, value }) => (
                <div key={label}>
                  <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:500, color:'#7a4a4a', marginBottom:6 }}><Icon size={12} color="#9a6060" /> {label}</label>
                  <input type={type} defaultValue={value} disabled={!isEditing} className="prof-input" style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* Professional info */}
          <div style={{ ...frosted, borderRadius:16, padding:'26px 28px' }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:'#2a0a0a', marginBottom:18, display:'flex', alignItems:'center', gap:8 }}>
              <Award size={15} color="#7F1D1D" /> Professional Information
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[{ label:'Specialization', icon:Award, value:'Cardiology' },{ label:'Hospital / Clinic', icon:Building, value:'Central Medical Center' },{ label:'Location', icon:MapPin, value:'New York, NY' },{ label:'License Number', icon:Calendar, value:'MD-12345-NY' }].map(({ label, icon:Icon, value }) => (
                <div key={label}>
                  <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:500, color:'#7a4a4a', marginBottom:6 }}><Icon size={12} color="#9a6060" /> {label}</label>
                  <input type="text" defaultValue={value} disabled={!isEditing} className="prof-input" style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div style={{ ...frosted, borderRadius:16, padding:'26px 28px' }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:'#2a0a0a', marginBottom:18, display:'flex', alignItems:'center', gap:8 }}>
              <Shield size={15} color="#7F1D1D" /> Preferences
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[
                { icon:Bell,   title:'Email Notifications',       desc:'Receive updates via email',        value:notifications, toggle:() => setNotifications(v => !v) },
                { icon:Shield, title:'Two-Factor Authentication', desc:'Enhanced account security',         value:twoFactor,     toggle:() => setTwoFactor(v => !v) },
                { icon:Lock,   title:'Data Encryption',           desc:'End-to-end encryption enabled',     value:encryption,    toggle:() => setEncryption(v => !v) },
              ].map(({ icon:Icon, title, desc, value, toggle }) => (
                <div key={title} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:34, height:34, borderRadius:8, background:'rgba(127,29,29,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={15} color="#7F1D1D" />
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:500, color:'#2a0a0a', marginBottom:2, margin:0 }}>{title}</p>
                      <p style={{ fontSize:11, color:'#9a6060', fontWeight:300, margin:0 }}>{desc}</p>
                    </div>
                  </div>
                  <div onClick={toggle} style={{ width:42, height:23, borderRadius:100, position:'relative', cursor:'pointer', background: value ? '#7F1D1D' : 'rgba(127,29,29,0.15)', transition:'background 0.2s', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:3, right: value ? 3 : 'auto', left: value ? 'auto' : 3, width:17, height:17, borderRadius:'50%', background:'#fff', transition:'all 0.2s' }} />
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