import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'freelancer' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome to FreelanceFinder!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'freelancer', icon: '🧑‍💻', title: 'Freelancer', desc: 'Find projects & earn' },
    { value: 'client', icon: '🏢', title: 'Client', desc: 'Hire top talent' }
  ];

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', padding: '2rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,217,163,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card-custom" style={{ padding: '2.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div className="navbar-brand-custom" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '1rem' }}>⚡ FreelanceFinder</div>
                <h2 style={{ fontFamily: 'Syne', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Your Account</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Join 120,000+ professionals on the platform</p>
              </div>

              {/* Role selector */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label className="form-label-custom">I want to...</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {roles.map(role => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, role: role.value }))}
                      style={{
                        background: form.role === role.value ? 'rgba(108,99,255,0.15)' : 'var(--surface-2)',
                        border: `2px solid ${form.role === role.value ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 12,
                        padding: '1rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{role.icon}</div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{role.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{role.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label-custom">Full Name</label>
                  <input type="text" className="form-control-custom" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label-custom">Email Address</label>
                  <input type="email" className="form-control-custom" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label-custom">Password</label>
                  <input type="password" className="form-control-custom" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
                </div>

                <button type="submit" className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }} disabled={loading}>
                  {loading ? 'Creating Account...' : `Create ${form.role === 'client' ? 'Client' : 'Freelancer'} Account →`}
                </button>
              </form>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.25rem' }}>
                By creating an account, you agree to our <Link to="/" style={{ color: 'var(--accent)' }}>Terms of Service</Link> and <Link to="/" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>
              </p>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <div className="divider"></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1.25rem' }}>
                  Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
