import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Sparkles, ArrowRight, Shield, Globe } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await login(username, password);
      if (data && data.success) {
        if (data.role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'row',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Left: Login Form */}
      <div style={{
        flex: '1 1 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background orbs (subtle light versions) */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,76,92,0.05) 0%, transparent 70%)',
          animation: 'blob 8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(17,94,89,0.04) 0%, transparent 70%)',
          animation: 'blob 10s ease-in-out infinite 3s',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '440px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          {/* Logo Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0f4c5c, #115e59)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(15, 76, 92, 0.2)',
              }}>
                <Sparkles size={20} color="white" />
              </div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                GovScheme Portal
              </h1>
            </div>
            <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>
              National Gateway for Citizen Schemes & Benefits
            </p>
          </div>

          <div style={{
            padding: '2rem 0',
            borderTop: '1px solid #f1f5f9',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem' }}>
              Please enter your details to access your account.
            </p>

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.1)',
                borderRadius: '10px',
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}>
                <Shield size={16} color="#ef4444" />
                <p style={{ color: '#991b1b', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem'
                }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'
                  }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. anmol101"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem'
                }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'
                  }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-gradient"
                style={{
                  width: '100%', padding: '0.875rem', fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                  marginTop: '0.5rem'
                }}
              >
                {isLoading ? 'Authenticating...' : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Don't have an account? <Link to="/register" style={{ color: '#0f4c5c', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
              </p>
            </div>

            {/* Test accounts */}
            <div style={{ marginTop: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
                <span style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Quick Access
                </span>
                <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
                }}
                  onClick={() => { setUsername('rahul.sharma'); setPassword('pass123'); }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#0f4c5c'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <p style={{ fontSize: '0.65rem', color: '#0f4c5c', fontWeight: 700, margin: '0 0 0.125rem' }}>CITIZEN</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>rahul.sharma</p>
                </div>
                <div style={{
                  padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
                }}
                  onClick={() => { setUsername('admin'); setPassword('admin123'); }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#991b1b'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <p style={{ fontSize: '0.65rem', color: '#991b1b', fontWeight: 700, margin: '0 0 0.125rem' }}>ADMIN</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>admin</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.8rem' }}>
            <Globe size={14} />
            <span>Official Government Portal</span>
          </div>
        </div>
      </div>

      {/* Right: Hero Image Section */}
      <div style={{
        flex: '1 1 50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f4c5c',
        overflow: 'hidden',
      }}>
        {/* Placeholder image that looks like a modern office/govt building */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/images/img3.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }} />
        
        {/* Accent Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(15,76,92,0.85) 0%, rgba(17,94,89,0.4) 100%)',
        }} />

        {/* Floating Content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '4rem', color: 'white', maxWidth: '500px' }}>
          <div style={{
            display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem'
          }}>
            Seamless Citizen Services
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Empowering citizens through <span style={{ color: '#0d9488' }}>digital</span> governance.
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            Access all government schemes, track your applications, and receive real-time updates in one unified portal.
          </p>
        </div>

        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Login;
