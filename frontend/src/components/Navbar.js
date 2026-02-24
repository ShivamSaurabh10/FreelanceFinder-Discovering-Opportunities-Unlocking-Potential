import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-custom">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand */}
          <Link to="/" className="navbar-brand-custom">
            ⚡ FreelanceFinder
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="d-none d-md-flex">
            <Link to="/jobs" className="nav-link-custom" style={{ color: isActive('/jobs') ? 'white' : undefined }}>Browse Jobs</Link>
            <Link to="/freelancers" className="nav-link-custom" style={{ color: isActive('/freelancers') ? 'white' : undefined }}>Find Talent</Link>
          </div>

          {/* Auth */}
          <div className="d-none d-md-flex align-items-center gap-2">
            {user ? (
              <>
                {user.role === 'client' && (
                  <Link to="/post-job" className="btn-ghost-custom" style={{ fontSize: '0.82rem' }}>
                    + Post Job
                  </Link>
                )}
                <Link to="/dashboard" className="btn-ghost-custom">
                  Dashboard
                </Link>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpen(!open)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}
                  >
                    <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.9rem', background: 'var(--gradient-1)' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>▼</span>
                  </button>
                  {open && (
                    <div style={{
                      position: 'absolute', right: 0, top: '110%',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)', minWidth: 160, zIndex: 1000,
                      boxShadow: 'var(--shadow-lg)', overflow: 'hidden'
                    }}>
                      {[
                        { label: '👤 Profile', to: '/profile' },
                        { label: '📊 Dashboard', to: '/dashboard' },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setOpen(false)} style={{
                          display: 'block', padding: '0.65rem 1rem',
                          fontSize: '0.875rem', color: 'var(--text-secondary)',
                          textDecoration: 'none', transition: 'all 0.15s',
                          borderBottom: '1px solid var(--border)'
                        }}
                          onMouseEnter={e => e.target.style.background = 'var(--surface-2)'}
                          onMouseLeave={e => e.target.style.background = 'transparent'}
                        >{item.label}</Link>
                      ))}
                      <button onClick={handleLogout} style={{
                        display: 'block', width: '100%', padding: '0.65rem 1rem',
                        background: 'none', border: 'none', textAlign: 'left',
                        fontSize: '0.875rem', color: 'var(--accent-2)', cursor: 'pointer'
                      }}>🚪 Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline-custom" style={{ padding: '0.5rem 1.25rem' }}>Log in</Link>
                <Link to="/register" className="btn-primary-custom" style={{ padding: '0.5rem 1.25rem' }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
