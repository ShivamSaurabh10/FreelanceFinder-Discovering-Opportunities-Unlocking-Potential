import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Design & Creative', 'Writing & Content', 'Data Science & ML', 'Digital Marketing', 'Video & Animation', 'Finance & Accounting', 'Customer Support', 'Other'];
const DURATION = { 'less-than-1-month': '< 1 Month', '1-3-months': '1–3 Months', '3-6-months': '3–6 Months', 'more-than-6-months': '6+ Months' };

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    budget: { type: 'fixed', min: '', max: '' },
    duration: '1-3-months',
    experienceLevel: 'intermediate',
    location: 'Remote',
    tags: []
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

  const removeSkill = (skill) => {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/jobs', form);
      toast.success('Job posted successfully!');
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  const POPULAR_SKILLS = ['React.js', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'MongoDB', 'AWS', 'Figma', 'SQL', 'Docker'];

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div style={{ marginBottom: '2rem' }}>
              <div className="section-label">New Opportunity</div>
              <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Post a Job</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fill in the details to attract the best freelancers</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="card-custom" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>📋 Job Details</h3>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label-custom">Job Title *</label>
                  <input type="text" className="form-control-custom" placeholder="e.g. Senior React Developer for E-commerce Platform" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required maxLength={200} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{form.title.length}/200</div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label-custom">Category *</label>
                  <select className="form-control-custom" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                    <option value="">Select a category...</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="form-label-custom">Job Description *</label>
                  <textarea
                    className="form-control-custom"
                    rows={8}
                    placeholder={`Describe the project in detail:\n• What needs to be done?\n• What are the goals?\n• What deliverables do you expect?\n• Any specific requirements or preferences?`}
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    required
                    style={{ resize: 'vertical' }}
                    maxLength={5000}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{form.description.length}/5000</div>
                </div>
              </div>

              {/* Skills */}
              <div className="card-custom" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>🛠️ Skills Required</h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label-custom">Add Skills (press Enter)</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="e.g. React.js"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                  />
                </div>

                {/* Selected skills */}
                {form.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {form.skills.map(skill => (
                      <span key={skill} className="badge-custom badge-accent" style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)}>
                        {skill} ×
                      </span>
                    ))}
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Popular skills:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {POPULAR_SKILLS.map(skill => (
                      <button key={skill} type="button" className="skill-tag" style={{ cursor: 'pointer' }}
                        onClick={() => { if (!form.skills.includes(skill)) setForm(p => ({ ...p, skills: [...p.skills, skill] })); }}>
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="card-custom" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>💰 Budget & Timeline</h3>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Budget Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {['fixed', 'hourly'].map(type => (
                        <button key={type} type="button"
                          onClick={() => setForm(p => ({ ...p, budget: { ...p.budget, type } }))}
                          style={{
                            background: form.budget.type === type ? 'rgba(108,99,255,0.15)' : 'var(--surface-2)',
                            border: `1.5px solid ${form.budget.type === type ? 'var(--accent)' : 'var(--border)'}`,
                            borderRadius: 8, padding: '0.6rem', cursor: 'pointer',
                            color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem'
                          }}>
                          {type === 'fixed' ? '📦 Fixed' : '⏱️ Hourly'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Min Budget ($)</label>
                    <input type="number" className="form-control-custom" placeholder="500" min="0" value={form.budget.min} onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, min: e.target.value } }))} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Max Budget ($)</label>
                    <input type="number" className="form-control-custom" placeholder="5000" min="0" value={form.budget.max} onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, max: e.target.value } }))} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Duration</label>
                    <select className="form-control-custom" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}>
                      {Object.entries(DURATION).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Experience Level</label>
                    <select className="form-control-custom" value={form.experienceLevel} onChange={e => setForm(p => ({ ...p, experienceLevel: e.target.value }))}>
                      <option value="entry">Entry Level</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Location</label>
                    <input type="text" className="form-control-custom" placeholder="Remote" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-outline-custom" onClick={() => navigate('/dashboard')}>Cancel</button>
                <button type="submit" className="btn-primary-custom" style={{ padding: '0.8rem 2.5rem' }} disabled={loading}>
                  {loading ? 'Posting...' : '🚀 Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
