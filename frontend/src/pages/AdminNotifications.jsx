import { useState } from 'react';
import axios from 'axios';
import { Bell, FileText, Send, CheckCircle } from 'lucide-react';

const AdminNotifications = () => {
  const [formData, setFormData] = useState({ citizen_id: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await axios.post('/api/notifications', formData);
      setSuccessMsg('Notification successfully dispatched.');
      setFormData({ citizen_id: '', message: '' });
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send notification.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem', opacity: 0, animation: 'slideUp 0.4s ease-out forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Bell size={18} color="#0f4c5c" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f4c5c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Communication Hub</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #0f172a, #0f4c5c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Notification Manager
        </h1>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.375rem 0 0' }}>
          Broadcast alerts to all citizens or dispatch precise updates regarding individual applications.
        </p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', opacity: 0, animation: 'slideUp 0.5s ease-out 0.1s forwards' }}>
        
        {successMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#166534', fontSize: '0.85rem', fontWeight: 500 }}>
            <CheckCircle size={18} color="#166534" />
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#991b1b', fontSize: '0.85rem', fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Recipient Citizen ID</label>
            <div style={{ position: 'relative' }}>
              <FileText size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                required
                placeholder="Enter Citizen ID (e.g., 1) or 'ALL' to broadcast"
                value={formData.citizen_id}
                onChange={e => setFormData({ ...formData, citizen_id: e.target.value })}
                className="glass-input"
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>Use <strong>ALL</strong> to send to every citizen in the database.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Notification Message</label>
            <textarea
              required
              rows={4}
              placeholder="Enter the official notification context..."
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className="glass-input"
              style={{ padding: '0.875rem', fontSize: '0.9rem', width: '100%', resize: 'vertical' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gradient" style={{ padding: '0.875rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginTop: '0.5rem', width: '200px' }}>
            {loading ? 'Sending...' : <><Send size={16} /> Dispatch</>}
          </button>
        </form>
      </div>

    </div>
  );
}

export default AdminNotifications;
