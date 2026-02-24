import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FreelancerProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [userRes] = await Promise.all([
          axios.get(`/api/users/${id}`)
        ]);
        setUser(userRes.data.user);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><div className="spinner"></div></div>;
  if (!user) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}><h2>User not found</h2></div>;

  const hue = user.name?.charCodeAt(0) * 13 % 360;

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/freelancers" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Freelancers</Link>
        </div>

        <div className="row g-4">
          {/* Left - Profile */}
          <div className="col-lg-4">
            <div className="profile-header" style={{ textAlign: 'center' }}>
              <div className="avatar-placeholder" style={{ width: 96, height: 96, fontSize: '2rem', background: `hsl(${hue}, 65%, 45%)`, margin: '0 auto 1rem' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.25rem' }}>{user.name}</h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                {user.experience?.charAt(0).toUpperCase() + user.experience?.slice(1)} Level Freelancer
              </div>
              {user.location && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>📍 {user.location}</div>}

              {/* Rating */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ color: '#FFB347', fontSize: '1rem' }}>{'★'.repeat(Math.round(user.rating || 0))}{'☆'.repeat(5 - Math.round(user.rating || 0))}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user.rating?.toFixed(1) || '0.0'} ({user.reviewCount || 0})</span>
              </div>

              {user.isVerified && <div className="badge-custom badge-green" style={{ marginBottom: '1rem' }}>✓ Verified Professional</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                {[
                  { icon: '✅', value: user.completedJobs || 0, label: 'Jobs Done' },
                  { icon: '⭐', value: (user.rating || 0).toFixed(1), label: 'Rating' },
                  { icon: '💰', value: user.hourlyRate ? `$${user.hourlyRate}` : 'Open', label: 'Per Hour' },
                  { icon: '🏆', value: user.experience?.charAt(0).toUpperCase() + user.experience?.slice(1), label: 'Level' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{stat.icon}</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {(user.socialLinks?.github || user.socialLinks?.linkedin || user.socialLinks?.website) && (
              <div className="card-custom" style={{ marginTop: '1rem' }}>
                <h5 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Links</h5>
                {user.socialLinks?.github && <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="btn-ghost-custom" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}>🐙 GitHub</a>}
                {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="btn-ghost-custom" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}>💼 LinkedIn</a>}
                {user.socialLinks?.website && <a href={user.socialLinks.website} target="_blank" rel="noreferrer" className="btn-ghost-custom" style={{ width: '100%', justifyContent: 'center' }}>🌐 Portfolio</a>}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="col-lg-8">
            {/* Bio */}
            {user.bio && (
              <div className="card-custom" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>About Me</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>{user.bio}</p>
              </div>
            )}

            {/* Skills */}
            {user.skills?.length > 0 && (
              <div className="card-custom" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {user.skills.map(skill => (
                    <span key={skill} className="badge-custom badge-accent">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {user.portfolio?.length > 0 && (
              <div className="card-custom" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>Portfolio</h3>
                <div className="row g-3">
                  {user.portfolio.map((item, i) => (
                    <div key={i} className="col-sm-6">
                      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                        <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>{item.title}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>{item.description}</div>
                        {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="btn-ghost-custom" style={{ fontSize: '0.78rem' }}>View Project →</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member since */}
            <div className="card-custom">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.25rem' }}>Member Since</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
                </div>
                <Link to="/jobs" className="btn-primary-custom">
                  Hire for a Job →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
