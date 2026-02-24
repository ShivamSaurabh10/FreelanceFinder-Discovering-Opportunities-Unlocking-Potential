import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    hourlyRate: user?.hourlyRate || '',
    experience: user?.experience || 'entry',
    skills: user?.skills || [],
    socialLinks: user?.socialLinks || { github: '', linkedin: '', website: '' }
  });

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) {
        setForm(p => ({ ...p, skills: [...p.skills, skillInput.trim()] }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const hue = user?.name?.charCodeAt(0) * 13 % 360;

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Edit Profile</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Keep your profile updated to attract better opportunities</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Avatar & Basic */}
              <div className="card-custom" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>👤 Basic Info</h3>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <div className="avatar-placeholder" style={{ width: 80, height: 80, fontSize: '1.8rem', background: `hsl(${hue}, 65%, 45%)`, flexShrink: 0 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="badge-custom badge-accent" style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>{user?.role}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>⭐ {user?.rating?.toFixed(1) || '0.0'} rating · ✅ {user?.completedJobs || 0} completed jobs</div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Full Name</label>
                    <input type="text" className="form-control-custom" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Location</label>
                    <input type="text" className="form-control-custom" placeholder="e.g. New York, USA" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Bio / About Me</label>
                    <textarea className="form-control-custom" rows={4} placeholder="Tell clients and other freelancers about yourself, your expertise, and what makes you unique..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} maxLength={500} style={{ resize: 'vertical' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{form.bio.length}/500</div>
                  </div>
                </div>
              </div>

              {/* Professional Info (freelancers only) */}
              {user?.role === 'freelancer' && (
                <div className="card-custom" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>💼 Professional Details</h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label-custom">Hourly Rate (USD)</label>
                      <input type="number" className="form-control-custom" placeholder="e.g. 75" min="0" value={form.hourlyRate} onChange={e => setForm(p => ({ ...p, hourlyRate: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">Experience Level</label>
                      <select className="form-control-custom" value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}>
                        <option value="entry">Entry Level (0–2 years)</option>
                        <option value="intermediate">Intermediate (2–5 years)</option>
                        <option value="expert">Expert (5+ years)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem' }}>
                    <label className="form-label-custom">Skills (press Enter to add)</label>
                    <input type="text" className="form-control-custom" placeholder="e.g. React.js" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                    {form.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                        {form.skills.map(skill => (
                          <span key={skill} className="badge-custom badge-accent" style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)}>
                            {skill} ×
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="card-custom" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>🔗 Social Links</h3>
                <div className="row g-3">
                  {[
                    { key: 'github', icon: '🐙', label: 'GitHub URL', placeholder: 'https://github.com/username' },
                    { key: 'linkedin', icon: '💼', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
                    { key: 'website', icon: '🌐', label: 'Portfolio/Website URL', placeholder: 'https://yourportfolio.com' },
                  ].map(link => (
                    <div key={link.key} className="col-md-4">
                      <label className="form-label-custom">{link.icon} {link.label}</label>
                      <input type="url" className="form-control-custom" placeholder={link.placeholder}
                        value={form.socialLinks[link.key]}
                        onChange={e => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [link.key]: e.target.value } }))} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary-custom" style={{ padding: '0.8rem 2.5rem' }} disabled={loading}>
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
