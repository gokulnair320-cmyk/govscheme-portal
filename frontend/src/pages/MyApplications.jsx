import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const getStatusStyle = (status) => {
  if (status === 'Approved') return { bg: 'rgba(16,185,129,0.15)', color: '#059669', border: 'rgba(16,185,129,0.3)' };
  if (status === 'Rejected') return { bg: 'rgba(239,68,68,0.15)', color: '#dc2626', border: 'rgba(239,68,68,0.3)' };
  return { bg: 'rgba(245,158,11,0.15)', color: '#d97706', border: 'rgba(245,158,11,0.3)' };
};

const getEligibilityStyle = (result) => {
  if (result === 'Eligible') return { bg: 'rgba(16,185,129,0.12)', color: '#059669', border: 'rgba(16,185,129,0.25)' };
  if (result === 'Non-Eligible') return { bg: 'rgba(100,116,139,0.12)', color: '#475569', border: 'rgba(100,116,139,0.25)' };
  return { bg: 'rgba(99,102,241,0.12)', color: '#4f46e5', border: 'rgba(99,102,241,0.25)' };
};

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/applications/${user.citizenId}`);
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.citizenId) fetchApplications();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', opacity: 0, animation: 'slideUp 0.4s ease-out forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <FileText size={18} color="#0f4c5c" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f4c5c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>History</span>
        </div>
        <h1 style={{
          fontSize: '2rem', fontWeight: 800, margin: 0,
          background: 'linear-gradient(135deg, #0f172a, #0f4c5c)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>My Applications</h1>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.375rem 0 0' }}>
          Track the status of your scheme applications in real-time.
        </p>
      </div>

      {/* Table Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        opacity: 0,
        animation: 'slideUp 0.5s ease-out 0.15s forwards',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}>
        {applications.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center',
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              background: 'rgba(15,76,92,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <FileText size={24} color="#0f4c5c" />
            </div>
            <h3 style={{ color: '#1e293b', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.375rem' }}>
              No applications yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              Browse available schemes and apply to get started.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['App ID', 'Scheme Name', 'Eligibility', 'Remarks', 'Status'].map((h, i) => (
                    <th key={h} style={{
                      padding: '0.875rem 1.5rem',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#64748b',
                      borderBottom: '1px solid #e2e8f0',
                      textAlign: i === 4 ? 'right' : 'left',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const statusStyle = getStatusStyle(app.status);
                  const eligStyle = getEligibilityStyle(app.eligibility_result);
                  return (
                    <tr key={app.appId} style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.2s ease',
                    }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          fontSize: '0.8rem', fontWeight: 700, color: '#0f4c5c',
                          background: 'rgba(15,76,92,0.08)',
                          padding: '0.2rem 0.5rem', borderRadius: '6px',
                        }}>#{app.appId}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#1e293b', fontSize: '0.875rem', fontWeight: 600 }}>
                        {app.schemeName}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {app.eligibility_result ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.25rem 0.7rem', borderRadius: '20px',
                            fontSize: '0.72rem', fontWeight: 700,
                            background: eligStyle.bg, color: eligStyle.color, border: `1px solid ${eligStyle.border}`,
                          }}>
                            {app.eligibility_result === 'Eligible'
                              ? <CheckCircle size={11} />
                              : app.eligibility_result === 'Non-Eligible'
                                ? <XCircle size={11} />
                                : <Clock size={11} />}
                            {app.eligibility_result}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                      <td style={{
                        padding: '1rem 1.5rem', color: '#475569', fontSize: '0.8rem',
                        maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }} title={app.remarks}>
                        {app.remarks || <span style={{ color: '#94a3b8' }}>—</span>}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '0.25rem 0.75rem', borderRadius: '20px',
                          fontSize: '0.72rem', fontWeight: 700,
                          background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`,
                        }}>
                          {app.status}
                        </span>
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

export default MyApplications;
