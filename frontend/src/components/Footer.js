import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="navbar-brand-custom mb-3" style={{ fontSize: '1.3rem', display: 'block' }}>⚡ FreelanceFinder</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 300, lineHeight: 1.7 }}>
              Connecting world-class talent with innovative companies. Discover opportunities, unlock your potential.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {['🐦', '💼', '🐙', '📸'].map((icon, i) => (
                <button key={i} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{icon}</button>
              ))}
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h6 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Platform</h6>
            {['Browse Jobs', 'Find Talent', 'Post a Job', 'How it Works'].map(item => (
              <div key={item} style={{ marginBottom: '0.5rem' }}>
                <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</Link>
              </div>
            ))}
          </div>
          <div className="col-6 col-lg-2">
            <h6 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Company</h6>
            {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
              <div key={item} style={{ marginBottom: '0.5rem' }}>
                <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</Link>
              </div>
            ))}
          </div>
          <div className="col-6 col-lg-2">
            <h6 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Support</h6>
            {['Help Center', 'Trust & Safety', 'Terms', 'Privacy'].map(item => (
              <div key={item} style={{ marginBottom: '0.5rem' }}>
                <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</Link>
              </div>
            ))}
          </div>
          <div className="col-6 col-lg-2">
            <h6 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Categories</h6>
            {['Web Dev', 'Mobile', 'Design', 'Writing', 'Data Science'].map(item => (
              <div key={item} style={{ marginBottom: '0.5rem' }}>
                <Link to="/jobs" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</Link>
              </div>
            ))}
          </div>
        </div>
        <div className="divider"></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            © 2024 FreelanceFinder. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Built with ❤️ for the global freelance community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
