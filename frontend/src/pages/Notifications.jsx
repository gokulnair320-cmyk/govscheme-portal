import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, Clock, BellOff, BellRing } from 'lucide-react';
import { format } from 'date-fns';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications/${user.citizenId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.citizenId) fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}`);
      setNotifications(notifications.map(n =>
        n.notification_id === id ? { ...n, status: 'Read' } : n
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Loading notifications...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => n.status === 'Unread').length;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '760px' }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.6);} 50%{box-shadow:0 0 0 6px rgba(99,102,241,0);} }
        .notif-item:hover { background: rgba(255,255,255,0.03) !important; }
        .mark-btn:hover { background: rgba(99,102,241,0.2) !important; }
      `}</style>

      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', opacity: 0, animation: 'slideUp 0.4s ease-out forwards' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Bell size={18} color="#6366f1" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Inbox</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #0f172a, #0f4c5c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Notifications</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.375rem 0 0' }}>Your latest alerts and application updates.</p>
        </div>
        {unreadCount > 0 && (
          <div style={{ padding: '0.4rem 1rem', borderRadius: '20px', background: 'rgba(15, 76, 92, 0.1)', border: '1px solid rgba(15, 76, 92, 0.2)', color: '#0f4c5c', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BellRing size={14} />{unreadCount} Unread
          </div>
        )}
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.05)', overflow: 'hidden', opacity: 0, animation: 'slideUp 0.5s ease-out 0.15s forwards', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        {notifications.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(15, 76, 92, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BellOff size={28} color="#0f4c5c" />
            </div>
            <h3 style={{ color: '#1e293b', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.375rem' }}>No notifications</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>You're all caught up!</p>
          </div>
        ) : notifications.map((notif, idx) => {
          const isUnread = notif.status === 'Unread';
          return (
            <div key={notif.notification_id} className="notif-item" style={{ padding: '1.25rem 1.5rem', borderBottom: idx < notifications.length - 1 ? '1px solid #f1f5f9' : 'none', background: isUnread ? 'rgba(15, 76, 92, 0.03)' : '#ffffff', display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'background 0.2s ease', opacity: 0, animation: `slideUp 0.4s ease-out ${0.2 + idx * 0.05}s forwards` }}>
              <div style={{ paddingTop: '4px', flexShrink: 0 }}>
                {isUnread
                  ? <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0f4c5c', animation: 'pulseDot 2s infinite' }} />
                  : <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#cbd5e1' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.375rem', color: isUnread ? '#0f172a' : '#475569', fontWeight: isUnread ? 600 : 400 }}>{notif.message}</p>
                {notif.notification_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={12} color="#64748b" />
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{format(new Date(notif.notification_date), 'MMM dd, yyyy · h:mm a')}</span>
                  </div>
                )}
              </div>
              {isUnread ? (
                <button onClick={() => markAsRead(notif.notification_id)} className="mark-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', borderRadius: '8px', background: 'rgba(15, 76, 92, 0.08)', border: '1px solid rgba(15, 76, 92, 0.1)', color: '#0f4c5c', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                  <Check size={13} />Mark read
                </button>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', flexShrink: 0, alignSelf: 'center', fontWeight: '500' }}>Read</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
