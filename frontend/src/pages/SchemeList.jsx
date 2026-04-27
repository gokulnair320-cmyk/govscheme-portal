import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Info, 
  ArrowRight, 
  Zap, 
  Users, 
  Award,
  BookOpen,
  IndianRupee,
  Building2,
  CheckCircle2,
  AlertCircle,
  List,
  FileCheck
} from 'lucide-react';

const SchemeList = () => {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get('/api/schemes');
        setSchemes(res.data);
      } catch (err) {
        console.error('Error fetching schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const handleApply = async (schemeId) => {
    setApplyingId(schemeId);
    setMessage(null);
    try {
      const res = await axios.post('/api/applications', {
        citizenId: user.citizenId,
        schemeId: schemeId
      });
      setMessage({ type: 'success', text: res.data.message || 'Application submitted successfully!' });
    } catch (err) {
      console.error('Error applying:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error submitting application' });
    } finally {
      setApplyingId(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         (s.description?.toLowerCase().includes(search.toLowerCase()) || false);
    const matchesCategory = category === 'All' || s.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(schemes.map(s => s.category))];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid rgba(15, 76, 92, 0.1)',
            borderTopColor: '#0f4c5c', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading schemes...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      <style>{`
        .scheme-card:hover { transform: translateY(-3px); border-color: rgba(99,102,241,0.2) !important; box-shadow: 0 12px 40px rgba(0,0,0,0.4) !important; }
        .scheme-card:hover .card-top-bar { opacity: 1 !important; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '2rem', opacity: 0, animation: 'slideUp 0.4s ease-out forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <List size={18} color="#6366f1" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Browse</span>
        </div>
        <h1 style={{
          fontSize: '2rem', fontWeight: 800, margin: 0,
          background: 'linear-gradient(135deg, #0f172a, #0f4c5c)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Available Schemes</h1>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.375rem 0 0' }}>
          Browse and apply for government welfare schemes you may be eligible for.
        </p>
      </div>

      {/* Notification Toast */}
      {message && (
        <div style={{
          padding: '0.875rem 1.25rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slideInDown 0.3s ease-out forwards',
          background: message.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          boxShadow: message.type === 'success' ? '0 4px 20px rgba(16,185,129,0.15)' : '0 4px 20px rgba(239,68,68,0.15)',
        }}>
          {message.type === 'success'
            ? <CheckCircle2 size={18} color="#34d399" />
            : <AlertCircle size={18} color="#f87171" />}
          <span style={{
            fontSize: '0.875rem', fontWeight: 500,
            color: message.type === 'success' ? '#34d399' : '#f87171',
          }}>
            {message.text}
          </span>
        </div>
      )}

      {/* Scheme Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {schemes.map((scheme, idx) => (
          <div
            key={scheme.schemeId}
            className="scheme-card"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
              opacity: 0,
              animation: `slideUp 0.5s ease-out ${0.1 + idx * 0.07}s forwards`,
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
          >
            {/* Top accent bar */}
            <div className="card-top-bar" style={{
              height: '3px',
              background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }} />

            {/* Card Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
            }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Zap size={18} color="#818cf8" />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: 1.3 }}>
                {scheme.name}
              </h2>
            </div>

            {/* Card Body */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                {[
                  { icon: BookOpen, label: 'Age Range', value: `${scheme.age_lower} – ${scheme.age_upper} yrs` },
                  { icon: IndianRupee, label: 'Income Limit', value: `₹${Number(scheme.income)?.toLocaleString()}` },
                  { icon: Users, label: 'Gender', value: scheme.gender },
                  { icon: Users, label: 'Caste Category', value: scheme.caste },
                  { icon: IndianRupee, label: 'Benefit Amount', value: `₹${Number(scheme.benefit_amount)?.toLocaleString()}` },
                  { icon: Building2, label: 'Department', value: scheme.department },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <p style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>
                      {label}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Required Document */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '8px',
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.12)',
                marginBottom: '1.25rem',
              }}>
                <FileCheck size={14} color="#818cf8" />
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                  Required: <span style={{ color: '#a5b4fc', fontWeight: 600, textTransform: 'capitalize' }}>{scheme.required_document || 'General Document'}</span>
                </span>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => handleApply(scheme.schemeId)}
                disabled={applyingId === scheme.schemeId}
                className="apply-btn"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: applyingId === scheme.schemeId
                    ? 'rgba(99,102,241,0.3)'
                    : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: applyingId === scheme.schemeId ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {applyingId === scheme.schemeId ? (
                  <>
                    <div style={{
                      width: '16px', height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    Processing...
                  </>
                ) : (
                  <>
                    Apply Now
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {schemes.length === 0 && !loading && (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <List size={40} color="#334155" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>No schemes available at this time.</p>
        </div>
      )}
    </div>
  );
};

export default SchemeList;
