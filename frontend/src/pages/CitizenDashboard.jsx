import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Bell, CheckCircle, Clock, User, TrendingUp, ArrowUpRight, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

// Animated counter hook
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const StatCard = ({ icon: Icon, label, value, color, delay = 0, subtitle }) => {
  const count = useCountUp(value);
  const colorMap = {
    blue: { bg: 'rgba(15, 76, 92, 0.1)', icon: '#0f4c5c', bar: 'linear-gradient(90deg, #0f4c5c, #115e59)', border: 'rgba(15, 76, 92, 0.2)' },
    green: { bg: 'rgba(16, 185, 129, 0.1)', icon: '#059669', bar: 'linear-gradient(90deg, #10b981, #059669)', border: 'rgba(16, 185, 129, 0.2)' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', icon: '#d97706', bar: 'linear-gradient(90deg, #f59e0b, #d97706)', border: 'rgba(245, 158, 11, 0.2)' },
    purple: { bg: 'rgba(124, 58, 237, 0.1)', icon: '#7c3aed', bar: 'linear-gradient(90deg, #8b5cf6, #7c3aed)', border: 'rgba(124, 58, 237, 0.2)' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: `1px solid rgba(0, 0, 0, 0.05)`,
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
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.08)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* Top color bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px', background: c.bar,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={c.icon} />
        </div>
        <ArrowUpRight size={14} color="#94a3b8" />
      </div>

      <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
        {count}
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>{subtitle}</div>
      )}
    </div>
  );
};

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [citizen, setCitizen] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [citizenRes, appsRes, notifsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/citizens/${user.citizenId}`),
          axios.get(`http://localhost:5000/api/applications/${user.citizenId}`),
          axios.get(`http://localhost:5000/api/notifications/${user.citizenId}`),
        ]);
        setCitizen(citizenRes.data);
        setApplications(appsRes.data);
        setNotifications(notifsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.citizenId) fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '44px', height: '44px', border: '3px solid rgba(15, 76, 92, 0.1)',
            borderTopColor: '#0f4c5c', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const unreadNotifs = notifications.filter(n => n.status === 'Unread');

  const profileFields = citizen ? [
    { label: 'Gender', value: citizen.gender },
    { label: 'Age', value: `${citizen.age} years` },
    { label: 'Annual Income', value: `₹${citizen.income?.toLocaleString()}` },
    { label: 'Caste Category', value: citizen.caste },
    { label: 'Education', value: citizen.education },
    { label: 'Address', value: citizen.address },
  ] : [];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(15, 76, 92, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(15, 76, 92, 0); }
        }
      `}</style>

      {/* Hero Banner Section */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        height: '240px',
        marginBottom: '2rem',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 3rem',
        opacity: 0,
        animation: 'slideUp 0.6s ease-out forwards',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Placeholder image for government service interior */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/images/img1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.9) saturate(1.1)',
        }} />
        
        {/* Teal Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(15, 76, 92, 0.9) 0%, transparent 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Citizen Portal
            </div>
            <TrendingUp size={16} color="#0d9488" />
          </div>
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-0.02em',
          }}>
            Welcome back, {citizen?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: '0.5rem 0 0', fontWeight: 500 }}>
            Track your progress and discover new eligible schemes.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={FileText} label="Total Applications" value={applications.length} color="blue" delay={0.1} />
        <StatCard icon={CheckCircle} label="Approved" value={approvedCount} color="green" delay={0.2} subtitle="Successfully processed" />
        <StatCard icon={Clock} label="Pending" value={pendingCount} color="amber" delay={0.3} subtitle="Awaiting review" />
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          opacity: 0,
          animation: 'slideUp 0.5s ease-out 0.4s forwards',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(15, 76, 92, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={20} color="#0f4c5c" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Personal Profile
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Basic verification details</p>
              </div>
            </div>
            <button style={{
              background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.4rem 0.8rem',
              fontSize: '0.75rem', fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}>
              Edit <ExternalLink size={12} />
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {citizen && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {profileFields.map(({ label, value }) => (
                  <div key={label} style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                  }}>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</p>
                    <p style={{
                      fontSize: '0.95rem', color: '#334155', fontWeight: 600,
                      textTransform: 'capitalize', margin: 0
                    }}>{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          opacity: 0,
          animation: 'slideUp 0.5s ease-out 0.5s forwards',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(15, 76, 92, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bell size={20} color="#0f4c5c" />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Updates
              </h2>
            </div>
            {unreadNotifs.length > 0 && (
              <span style={{
                background: '#0f4c5c',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
              }}>
                {unreadNotifs.length}
              </span>
            )}
          </div>

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.slice(0, 4).map(notif => (
              <div key={notif.notification_id} style={{
                padding: '1rem',
                borderRadius: '12px',
                background: notif.status === 'Unread'
                  ? 'rgba(15, 76, 92, 0.05)'
                  : '#ffffff',
                border: notif.status === 'Unread'
                  ? '1px solid rgba(15, 76, 92, 0.1)'
                  : '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '6px',
                  background: notif.status === 'Unread' ? '#0f4c5c' : '#cbd5e1',
                  animation: notif.status === 'Unread' ? 'pulseDot 2s infinite' : 'none',
                }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.85rem', margin: '0 0 0.25rem',
                    color: notif.status === 'Unread' ? '#1e293b' : '#64748b',
                    fontWeight: notif.status === 'Unread' ? 600 : 400,
                    lineHeight: 1.4,
                  }}>
                    {notif.message}
                  </p>
                  {notif.notification_date && (
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
                      {format(new Date(notif.notification_date), 'dd MMM yyyy')}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '1rem', opacity: 0.2 }}><Bell size={40} style={{ margin: '0 auto' }} /></div>
                No new notifications
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
