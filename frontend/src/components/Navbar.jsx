import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  FileText, 
  List, 
  Bell, 
  LogOut, 
  ShieldAlert, 
  Activity,
  Database,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const citizenLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Schemes', path: '/schemes', icon: List },
    { name: 'My Applications', path: '/applications', icon: FileText },
    { name: 'My Documents', path: '/documents', icon: Database },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const adminLinks = [
    { name: 'Admin Hub', path: '/admin', icon: Home },
    { name: 'Document Queue', path: '/admin/documents', icon: Database },
    { name: 'Fraud Panel', path: '/admin/fraud', icon: ShieldAlert },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Audit Trail', path: '/admin/audit', icon: Activity },
  ];

  const links = user.role === 'admin' ? adminLinks : citizenLinks;

  return (
    <div
      style={{
        width: '260px',
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.75rem 1.5rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0f4c5c, #115e59)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(15, 76, 92, 0.2)',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #0f172a, #0f4c5c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.01em',
          }}>
            GovScheme
          </span>
        </div>
        <div style={{
          display: 'inline-block',
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '0.2rem 0.6rem',
          borderRadius: '20px',
          background: user.role === 'admin'
            ? 'rgba(153, 27, 27, 0.1)'
            : 'rgba(15, 76, 92, 0.1)',
          color: user.role === 'admin' ? '#991b1b' : '#0f4c5c',
          border: user.role === 'admin'
            ? '1px solid rgba(153, 27, 27, 0.2)'
            : '1px solid rgba(15, 76, 92, 0.2)',
          marginLeft: '2.5rem',
        }}>
          {user.role === 'admin' ? 'Admin Panel' : 'Citizen Portal'}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0 1.5rem' }} />

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <p style={{
          fontSize: '0.65rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#1e293b',
          padding: '0 0.75rem',
          marginBottom: '0.5rem',
        }}>
          Navigation
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.625rem 0.875rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                position: 'relative',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(15, 76, 92, 0.08)' : 'transparent',
                color: isActive ? '#0f172a' : '#475569',
                border: isActive ? '1px solid rgba(15, 76, 92, 0.1)' : '1px solid transparent',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#0f172a';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '55%',
                  background: 'linear-gradient(180deg, #0f4c5c, #115e59)',
                  borderRadius: '0 3px 3px 0',
                }} />
              )}
              <Icon
                size={16}
                style={{
                  marginRight: '0.75rem',
                  flexShrink: 0,
                  color: isActive ? '#0f4c5c' : '#94a3b8',
                }}
              />
              {link.name}
              {isActive && (
                <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#0f4c5c', opacity: 0.7 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0 1.5rem' }} />

      {/* User section */}
      <div style={{ padding: '1rem 0.75rem 1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.04)',
          marginBottom: '0.5rem',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f4c5c, #115e59)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(15, 76, 92, 0.2)',
            marginRight: '0.75rem',
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.username}
            </p>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, textTransform: 'capitalize' }}>
              {user.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '0.5rem 0.875rem',
            borderRadius: '8px',
            background: 'transparent',
            border: '1px solid transparent',
            color: '#64748b',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.05)';
            e.currentTarget.style.color = '#991b1b';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <LogOut size={14} style={{ marginRight: '0.625rem' }} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
