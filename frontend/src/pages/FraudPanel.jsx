import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

const FraudPanel = () => {
  const [frauds, setFrauds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrauds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/fraud');
        setFrauds(res.data);
      } catch (err) {
        console.error('Error fetching frauds:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFrauds();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', border: '3px solid rgba(239,68,68,0.2)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Loading fraud data...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const getTypeStyle = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('mismatch')) return { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' };
    if (t.includes('duplicate')) return { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' };
    return { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' };
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fraud-row:hover { background: rgba(239,68,68,0.04) !important; }
      `}</style>

      <div style={{ marginBottom: '2rem', opacity: 0, animation: 'slideUp 0.4s ease-out forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ShieldAlert size={18} color="#ef4444" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Security</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f1f5f9, #fca5a5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Fraud Detection Panel
        </h1>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.375rem 0 0' }}>
          Review flagged suspicious applications and duplicate accounts.
        </p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', opacity: 0, animation: 'slideUp 0.5s ease-out 0.1s forwards' }}>
        <div style={{ flex: 1, padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={16} color="#f87171" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f87171', lineHeight: 1 }}>{frauds.length}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>Active Flags</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={16} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
              {frauds.filter(f => (f.fraud_type || '').toLowerCase().includes('mismatch')).length}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>Mismatches</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={16} color="#a78bfa" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>
              {frauds.filter(f => (f.fraud_type || '').toLowerCase().includes('duplicate')).length}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>Duplicates</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', opacity: 0, animation: 'slideUp 0.5s ease-out 0.2s forwards' }}>
        {frauds.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={28} color="#34d399" />
            </div>
            <h3 style={{ color: '#34d399', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.375rem' }}>No Fraud Detected</h3>
            <p style={{ color: '#334155', fontSize: '0.85rem', margin: 0 }}>The system has not identified any suspicious activities.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(239,68,68,0.04)' }}>
                  {['Flag ID', 'Fraud Type', 'Description', 'Severity'].map((h, i) => (
                    <th key={h} style={{ padding: '0.875rem 1.5rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', borderBottom: '1px solid rgba(239,68,68,0.12)', textAlign: i === 3 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {frauds.map((fraud) => {
                  const ts = getTypeStyle(fraud.fraud_type);
                  return (
                    <tr key={fraud.flagId} className="fraud-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>FLAG-{fraud.flagId}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`, textTransform: 'capitalize' }}>
                          {fraud.fraud_type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <AlertTriangle size={14} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>{fraud.description}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '3px', alignItems: 'flex-end' }}>
                          {[1, 2, 3].map(i => (
                            <div key={i} style={{ width: '6px', borderRadius: '2px', background: i === 1 ? '#ef4444' : i === 2 ? '#dc2626' : '#b91c1c', height: `${i * 8}px` }} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudPanel;
