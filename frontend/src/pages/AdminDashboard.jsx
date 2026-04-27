import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, ShieldAlert, Users, FileText, Filter, TrendingUp, ArrowUpRight, Search } from 'lucide-react';

function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => {
  const count = useCountUp(value);
  const colorMap = {
    blue: { bg: 'rgba(15, 76, 92, 0.1)', icon: '#0f4c5c', bar: 'linear-gradient(90deg, #0f4c5c, #115e59)', border: 'rgba(15, 76, 92, 0.2)' },
    green: { bg: 'rgba(16, 185, 129, 0.1)', icon: '#059669', bar: 'linear-gradient(90deg, #10b981, #059669)', border: 'rgba(16, 185, 129, 0.2)' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', icon: '#d97706', bar: 'linear-gradient(90deg, #f59e0b, #d97706)', border: 'rgba(245, 158, 11, 0.2)' },
    red: { bg: 'rgba(220, 38, 38, 0.1)', icon: '#dc2626', bar: 'linear-gradient(90deg, #ef4444, #dc2626)', border: 'rgba(220, 38, 38, 0.2)' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      opacity: 0,
      animation: `slideUp 0.5s ease-out ${delay}s forwards`,
      transition: 'all 0.3s ease',
      cursor: 'default',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: c.bar }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={c.icon} />
        </div>
        <ArrowUpRight size={14} color="#94a3b8" />
      </div>
      <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>{count}</div>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
    </div>
  );
};

const getStatusBadge = (status) => {
  if (status === 'Approved') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#065f46', border: 'rgba(16, 185, 129, 0.2)' };
  if (status === 'Rejected') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#991b1b', border: 'rgba(239, 68, 68, 0.2)' };
  return { bg: 'rgba(245, 158, 11, 0.1)', color: '#92400e', border: 'rgba(245, 158, 11, 0.2)' };
};

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [citizensConfig, setCitizensConfig] = useState([]);
  const [fraudCount, setFraudCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, citRes, fraudRes] = await Promise.all([
          axios.get('/api/applications'),
          axios.get('/api/citizens'),
          axios.get('/api/fraud'),
        ]);
        setApplications(appRes.data);
        setCitizensConfig(citRes.data);
        setFraudCount(fraudRes.data.length);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/applications/${id}/status`, { status });
      setApplications(applications.map(app => app.appId === id ? { ...app, status } : app));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '44px', height: '44px', border: '3px solid rgba(15, 76, 92, 0.1)',
            borderTopColor: '#0f4c5c', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading officer portal...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const filteredApps = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .app-row:hover td { background: rgba(15, 76, 92, 0.02); }
      `}</style>

      {/* Header Banner Section */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        height: '200px',
        marginBottom: '2rem',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 3rem',
        opacity: 0,
        animation: 'slideUp 0.6s ease-out forwards',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Placeholder image for government building exterior */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/images/img2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.9) saturate(1.1)',
        }} />
        
        {/* Dark Blue/Green Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(15, 76, 92, 0.95) 0%, transparent 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Officer Portal
            </div>
            <ShieldAlert size={16} color="#ef4444" />
          </div>
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-0.02em',
          }}>
            Officer Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: '0.5rem 0 0', fontWeight: 500 }}>
            System overview and application lifecycle management.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={Users} label="Total Citizens" value={citizensConfig.length} color="blue" delay={0.1} />
        <StatCard icon={FileText} label="Total Apps" value={applications.length} color="green" delay={0.2} />
        <StatCard icon={Clock} label="Pending Review" value={pendingCount} color="amber" delay={0.3} />
        <StatCard icon={ShieldAlert} label="Fraud Flags" value={fraudCount} color="red" delay={0.4} />
      </div>

      {/* Applications Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        opacity: 0,
        animation: 'slideUp 0.5s ease-out 0.5s forwards',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}>
        {/* Table Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fcfdfe',
        }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.125rem' }}>Review Queue</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Processing citizen scheme applications</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                style={{ 
                  padding: '0.4rem 0.8rem 0.4rem 2rem', background: '#f1f5f9', border: '1px solid #e2e8f0', 
                  borderRadius: '8px', fontSize: '0.8rem', outline: 'none', color: '#334155' 
                }} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={14} color="#64748b" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#334155',
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Applicant', 'Scheme', 'Eligibility', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#475569',
                    borderBottom: '1px solid #f1f5f9',
                    textAlign: i === 4 ? 'right' : 'left',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => {
                const badge = getStatusBadge(app.status);
                return (
                  <tr key={app.appId} className="app-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{app.citizenName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.125rem' }}>ID: {app.citizen_id}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}>{app.schemeName}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {app.eligibility_result === 'Eligible' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle size={14} color="#10b981" />
                          <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>Qualified</span>
                        </div>
                      ) : app.eligibility_result === 'Non-Eligible' ? (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
                            <XCircle size={14} color="#ef4444" />
                            <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 600 }}>Disqualified</span>
                          </div>
                          {app.remarks && <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>{app.remarks}</p>}
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Not Scanned</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '0.25rem 0.75rem', borderRadius: '20px',
                        fontSize: '0.72rem', fontWeight: 700,
                        background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      {app.status === 'Pending' ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleUpdateStatus(app.appId, 'Approved')}
                            style={{
                              padding: '0.4rem 1rem', borderRadius: '8px',
                              background: '#0f4c5c', color: 'white',
                              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                              border: 'none', transition: 'all 0.2s',
                              boxShadow: '0 2px 4px rgba(15, 76, 92, 0.2)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.appId, 'Rejected')}
                            style={{
                              padding: '0.4rem 1rem', borderRadius: '8px',
                              background: '#ffffff', color: '#991b1b',
                              border: '1px solid #fecaca', fontSize: '0.75rem',
                              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 500 }}>Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <div style={{ opacity: 0.1, marginBottom: '1rem' }}><FileText size={48} style={{ margin: '0 auto' }} /></div>
                    No applications found in this queue.
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

export default AdminDashboard;
