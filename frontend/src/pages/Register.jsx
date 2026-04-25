import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Lock, User, Calendar, MapPin, Briefcase, GraduationCap, Users, Sparkles, ArrowRight, Shield, Globe } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    address: '',
    income: '',
    caste: 'General',
    education: 'high school',
    username: '',
    password: ''
  });
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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (res.data && res.data.success) {
        // Log them in immediately
        await login(formData.username, formData.password);
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Server error during registration. Please try again.');
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
      {/* Left: Register Form */}
      <div style={{
        flex: '1 1 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 4rem',
        position: 'relative',
        overflowY: 'auto'
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          {/* Logo Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #0f4c5c, #115e59)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={16} color="white" />
              </div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                GovScheme Portal
              </h1>
            </div>
          </div>

          <div style={{ padding: '1.5rem 0', borderTop: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
              Create an Account
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Register as a citizen to access targeted government benefits.
            </p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Shield size={16} color="#dc2626" />
                <p style={{ color: '#991b1b', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="glass-input" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Age</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="number" name="age" required value={formData.age} onChange={handleChange} className="glass-input" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="glass-input" style={{ fontSize: '0.85rem' }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Annual Income (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="number" name="income" required value={formData.income} onChange={handleChange} className="glass-input" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Caste/Category</label>
                  <div style={{ position: 'relative' }}>
                    <Users size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <select name="caste" value={formData.caste} onChange={handleChange} className="glass-input" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Education</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <select name="education" value={formData.education} onChange={handleChange} className="glass-input" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}>
                      <option value="high school">High School</option>
                      <option value="graduate">Graduate</option>
                      <option value="postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Home Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} className="glass-input" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
                </div>
              </div>

              <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Username</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" name="username" required value={formData.username} onChange={handleChange} className="glass-input" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} className="glass-input" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-gradient" style={{ width: '100%', padding: '0.875rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginTop: '0.5rem' }}>
                {isLoading ? 'Creating Account...' : <><Sparkles size={16} /> Register</>}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Already have an account? <Link to="/login" style={{ color: '#0f4c5c', fontWeight: 600, textDecoration: 'none' }}>Sign In here</Link>
              </p>
            </div>

          </div>
          
          <div style={{ paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
            <Globe size={12} />
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
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: 'url("/images/img3.png")',
          backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.7)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,76,92,0.85) 0%, rgba(17,94,89,0.4) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 10, padding: '4rem', color: 'white', maxWidth: '500px' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Citizen Empowerment
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Join the <span style={{ color: '#0d9488' }}>digital</span> ecosystem.
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            Set up your profile to discover eligible schemes and start your application journey today.
          </p>
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

export default Register;
