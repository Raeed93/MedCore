import { useState } from 'react';
import { Search, Filter, Calendar, FileText, TrendingUp, Clock } from 'lucide-react';

const frosted: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const diagnosisHistory = [
    { id:1, patientId:'P-2024-001', date:'2024-04-15', time:'14:32', primaryDiagnosis:'Acute Bronchitis',     urgency:'medium', age:45, gender:'Male'   },
    { id:2, patientId:'P-2024-002', date:'2024-04-14', time:'10:15', primaryDiagnosis:'Hypertension',          urgency:'high',   age:62, gender:'Female' },
    { id:3, patientId:'P-2024-003', date:'2024-04-14', time:'09:20', primaryDiagnosis:'Type 2 Diabetes',       urgency:'medium', age:55, gender:'Male'   },
    { id:4, patientId:'P-2024-004', date:'2024-04-13', time:'16:45', primaryDiagnosis:'Migraine',              urgency:'low',    age:34, gender:'Female' },
    { id:5, patientId:'P-2024-005', date:'2024-04-13', time:'11:30', primaryDiagnosis:'Asthma Exacerbation',   urgency:'high',   age:28, gender:'Female' },
  ];

  const filtered = diagnosisHistory.filter(r =>
    r.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const urgencyConfig: Record<string, { bg: string; color: string; border: string; label: string }> = {
    high:   { bg:'rgba(127,29,29,0.08)',  color:'#7F1D1D', border:'rgba(127,29,29,0.2)',  label:'High'   },
    medium: { bg:'rgba(180,120,0,0.08)',  color:'#92600a', border:'rgba(180,120,0,0.2)',  label:'Medium' },
    low:    { bg:'rgba(22,101,52,0.08)',  color:'#166534', border:'rgba(22,101,52,0.2)',  label:'Low'    },
  };

  const stats = [
    { icon: FileText,   value:'247',   label:'Total Diagnoses'    },
    { icon: Calendar,   value:'12',    label:'This Week'          },
    { icon: Clock,      value:'18s',   label:'Avg. Response Time' },
    { icon: TrendingUp, value:'98.2%', label:'Accuracy Rate'      },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color:'#2a0a0a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hist-input:focus { border-color:rgba(127,29,29,0.4) !important; box-shadow:0 0 0 3px rgba(127,29,29,0.07) !important; outline:none; }
        .hist-input::placeholder { color:#9a6060; }
        .hist-row:hover td { background:rgba(127,29,29,0.02); }
        .hist-action:hover { color:#6b1818 !important; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#2a0a0a', marginBottom:4 }}>Diagnosis History</h2>
        <p style={{ fontSize:13, color:'#7a4a4a', fontWeight:300 }}>View and manage past patient diagnoses</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} style={{ ...frosted, borderRadius:13, padding:'20px 18px' }}>
            <Icon size={17} color="#7F1D1D" style={{ marginBottom:10 }} />
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:'#2a0a0a', marginBottom:2 }}>{value}</div>
            <div style={{ fontSize:11, color:'#8a5050', fontWeight:300 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ ...frosted, borderRadius:12, padding:'14px 18px', marginBottom:14 }}>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ flex:1, position:'relative' }}>
            <Search size={14} color="#9a6060" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }} />
            <input
              type="text" placeholder="Search by patient ID or diagnosis..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="hist-input"
              style={{ width:'100%', paddingLeft:38, paddingRight:14, paddingTop:10, paddingBottom:10, background:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.7)', borderRadius:8, fontSize:13, color:'#2a0a0a', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif", transition:'border-color 0.15s, box-shadow 0.15s' }}
            />
          </div>
          <button style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', background:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.7)', borderRadius:8, fontSize:13, color:'#6a3a3a', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...frosted, borderRadius:14, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(127,29,29,0.08)', background:'rgba(127,29,29,0.03)' }}>
                {['Patient ID','Date & Time','Demographics','Diagnosis','Urgency','Actions'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'13px 20px', fontSize:10, fontWeight:600, color:'#7F1D1D', letterSpacing:'0.07em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, i) => {
                const u = urgencyConfig[record.urgency] || urgencyConfig.low;
                return (
                  <tr key={record.id} className="hist-row" style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(127,29,29,0.05)', transition:'background 0.12s' }}>
                    <td style={{ padding:'13px 20px', fontSize:13, fontWeight:600, color:'#2a0a0a' }}>{record.patientId}</td>
                    <td style={{ padding:'13px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#6a3a3a' }}>
                        <Calendar size={12} color="#9a6060" />
                        {record.date}
                        <span style={{ color:'#c4a0a0' }}>·</span>
                        {record.time}
                      </div>
                    </td>
                    <td style={{ padding:'13px 20px', fontSize:13, color:'#6a3a3a' }}>{record.age}y, {record.gender}</td>
                    <td style={{ padding:'13px 20px', fontSize:13, color:'#2a0a0a', fontWeight:500 }}>{record.primaryDiagnosis}</td>
                    <td style={{ padding:'13px 20px' }}>
                      <span style={{ display:'inline-flex', padding:'4px 10px', borderRadius:100, fontSize:11, fontWeight:600, letterSpacing:'0.04em', background:u.bg, color:u.color, border:`1px solid ${u.border}` }}>
                        {u.label.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding:'13px 20px' }}>
                      <button className="hist-action" style={{ fontSize:13, fontWeight:500, color:'#7F1D1D', background:'none', border:'none', cursor:'pointer', transition:'color 0.15s', fontFamily:"'DM Sans',sans-serif" }}>
                        View Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding:'40px', textAlign:'center', fontSize:14, color:'#9a6060' }}>No records match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}