import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/audit');
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditLogs();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Loading audit records...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const actionColors = {
    'Application Submitted': { bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: 'rgba(99,102,241,0.25)' },
    'Status Updated': { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
    'Document Verified': { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  };

  const getActionStyle = (action) => {
    for (const key of Object.keys(actionColors)) {
      if ((action || '').includes(key)) return actionColors[key];
    }
    return { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: 'rgba(100,116,139,0.25)' };
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .audit-row:hover { background: rgba(99,102,241,0.04) !important; }
      `}</style>

      <div style={{ marginBottom: '2rem', opacity: 0, animation: 'slideUp 0.4s ease-out forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Activity size={18} color="#6366f1" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Compliance</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          System Audit Trail
        </h1>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.375rem 0 0' }}>
          Track all sensitive actions performed across the platform.
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', opacity: 0, animation: 'slideUp 0.5s ease-out 0.1s forwards' }}>
        <div style={{ flex: 1, padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={16} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a5b4fc', lineHeight: 1 }}>{logs.length}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>Total Entries</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(100,116,139,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={16} color="#64748b" />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#94a3b8', lineHeight: 1 }}>
              {logs.length > 0 && logs[0].action_date
                ? format(new Date(logs[0].action_date), 'MMM dd, yyyy')
                : '—'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>Latest Entry</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', opacity: 0, animation: 'slideUp 0.5s ease-out 0.2s forwards' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Timestamp', 'Action', 'Citizen ID'].map((h) => (
                  <th key={h} style={{ padding: '0.875rem 1.5rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const as = getActionStyle(log.action);
                return (
                  <tr key={log.audit_id} className="audit-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#475569' }}>
                        {log.action_date ? format(new Date(log.action_date), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: as.bg, color: as.color, border: `1px solid ${as.border}` }}>
                        <Activity size={11} />
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#818cf8', background: 'rgba(99,102,241,0.08)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                        CID-{log.citizen_id}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#334155', fontSize: '0.875rem' }}>
                    No audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
