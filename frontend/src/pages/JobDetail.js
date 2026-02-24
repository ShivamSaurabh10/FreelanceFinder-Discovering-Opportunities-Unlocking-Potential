import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProposal, setShowProposal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [proposal, setProposal] = useState({
    coverLetter: '',
    bidAmount: '',
    deliveryTime: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/jobs/${id}`);
        setJob(data.job);
        if (user) setSaved(user.savedJobs?.includes(id));
      } catch {
        toast.error('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) { toast.info('Please login to save jobs'); return; }
    try {
      const { data } = await axios.post(`/api/jobs/${id}/save`);
      setSaved(data.saved);
      toast.success(data.saved ? 'Job saved!' : 'Job removed from saved');
    } catch { toast.error('Error saving job'); }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to submit proposals'); return; }
    setSubmitting(true);
    try {
      await axios.post('/api/proposals', { jobId: id, ...proposal });
      toast.success('Proposal submitted successfully!');
      setShowProposal(false);
      setProposal({ coverLetter: '', bidAmount: '', deliveryTime: '' });
      setJob(prev => ({ ...prev, proposalCount: (prev.proposalCount || 0) + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const formatBudget = (job) => {
    if (!job?.budget) return 'Negotiable';
    const { min, max, type } = job.budget;
    const suffix = type === 'hourly' ? '/hr' : '';
    if (min && max && min !== max) return `$${min.toLocaleString()} – $${max.toLocaleString()}${suffix}`;
    if (min) return `$${min.toLocaleString()}${suffix}`;
    return 'Negotiable';
  };

  const timeAgo = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  if (!job) return (
    <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <h2>Job not found</h2>
      <Link to="/jobs" className="btn-primary-custom" style={{ marginTop: '1rem' }}>Back to Jobs</Link>
    </div>
  );

  const DURATION_LABELS = {
    'less-than-1-month': 'Less than 1 Month',
    '1-3-months': '1 to 3 Months',
    '3-6-months': '3 to 6 Months',
    'more-than-6-months': 'More than 6 Months'
  };

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/jobs" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Jobs</Link>
        </div>

        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="card-custom" style={{ marginBottom: '1.5rem' }}>
              {/* Status badges */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="badge-custom badge-accent">{job.category}</span>
                <span className={`badge-custom ${job.status === 'open' ? 'badge-green' : 'badge-red'}`} style={{ textTransform: 'capitalize' }}>
                  ● {job.status}
                </span>
                {job.isFeatured && <span className="badge-custom badge-yellow">⭐ Featured</span>}
              </div>

              <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
                {job.title}
              </h1>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>📅 Posted {timeAgo(job.createdAt)}</span>
                <span>👁️ {job.views} views</span>
                <span>💬 {job.proposalCount} proposals</span>
                <span>📍 {job.location || 'Remote'}</span>
              </div>

              <div className="divider"></div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>Project Description</h3>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                  {job.description}
                </div>
              </div>

              {/* Skills Required */}
              {job.skills?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>Skills Required</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {job.skills.map(skill => (
                      <span key={skill} className="badge-custom badge-accent">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {job.tags?.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>Tags</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {job.tags.map(tag => (
                      <span key={tag} className="skill-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Proposal Form */}
            {showProposal && user?.role === 'freelancer' && (
              <div className="card-custom">
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '1.5rem' }}>📝 Submit Your Proposal</h3>
                <form onSubmit={handleSubmitProposal}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label-custom">Cover Letter *</label>
                    <textarea
                      className="form-control-custom"
                      rows={6}
                      placeholder="Explain why you're the best fit for this project. Highlight relevant experience, your approach, and what makes you stand out..."
                      value={proposal.coverLetter}
                      onChange={e => setProposal(p => ({ ...p, coverLetter: e.target.value }))}
                      required
                      style={{ resize: 'vertical' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{proposal.coverLetter.length}/2000</div>
                  </div>
                  <div className="row g-3" style={{ marginBottom: '1.25rem' }}>
                    <div className="col-6">
                      <label className="form-label-custom">Your Bid (USD) *</label>
                      <input
                        type="number"
                        className="form-control-custom"
                        placeholder={`Budget: ${formatBudget(job)}`}
                        value={proposal.bidAmount}
                        onChange={e => setProposal(p => ({ ...p, bidAmount: e.target.value }))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label-custom">Delivery Time (days) *</label>
                      <input
                        type="number"
                        className="form-control-custom"
                        placeholder="e.g. 14"
                        value={proposal.deliveryTime}
                        onChange={e => setProposal(p => ({ ...p, deliveryTime: e.target.value }))}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn-primary-custom" disabled={submitting}>
                      {submitting ? 'Submitting...' : '🚀 Submit Proposal'}
                    </button>
                    <button type="button" className="btn-outline-custom" onClick={() => setShowProposal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Action Card */}
            <div className="card-custom" style={{ marginBottom: '1.25rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, color: 'var(--accent-3)' }}>
                  {formatBudget(job)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {job.budget?.type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
                </div>
              </div>

              {!user ? (
                <Link to="/login" className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  Login to Apply
                </Link>
              ) : user.role === 'freelancer' ? (
                job.status === 'open' ? (
                  <button className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}
                    onClick={() => setShowProposal(!showProposal)}>
                    {showProposal ? 'Cancel' : '🚀 Submit Proposal'}
                  </button>
                ) : (
                  <div className="alert-custom alert-error" style={{ textAlign: 'center' }}>Job is {job.status}</div>
                )
              ) : user._id === job.client?._id ? (
                <div className="alert-custom alert-success" style={{ textAlign: 'center' }}>This is your job posting</div>
              ) : null}

              <button
                onClick={handleSave}
                className="btn-outline-custom"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {saved ? '❤️ Saved' : '🤍 Save Job'}
              </button>
            </div>

            {/* Job Details */}
            <div className="card-custom" style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Job Details</h4>
              {[
                { label: '⏱️ Duration', value: DURATION_LABELS[job.duration] || job.duration },
                { label: '🎓 Experience', value: job.experienceLevel?.charAt(0).toUpperCase() + job.experienceLevel?.slice(1) },
                { label: '📍 Location', value: job.location || 'Remote' },
                { label: '💬 Proposals', value: `${job.proposalCount} submitted` },
                { label: '👁️ Views', value: job.views },
              ].map(detail => (
                <div key={detail.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{detail.label}</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{detail.value}</span>
                </div>
              ))}
            </div>

            {/* Client Info */}
            {job.client && (
              <div className="card-custom">
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>About the Client</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="avatar-placeholder" style={{ width: 48, height: 48, fontSize: '1.2rem', background: 'var(--gradient-1)', flexShrink: 0 }}>
                    {job.client.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700 }}>
                      {job.client.name}
                      {job.client.isVerified && <span style={{ color: 'var(--accent-3)', marginLeft: '0.4rem', fontSize: '0.8rem' }}>✓ Verified</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.client.location || 'Remote'}</div>
                  </div>
                </div>
                {[
                  { label: '⭐ Rating', value: job.client.rating ? `${job.client.rating.toFixed(1)} (${job.client.reviewCount} reviews)` : 'No reviews yet' },
                  { label: '✅ Jobs Posted', value: job.client.completedJobs || 0 },
                  { label: '📅 Member Since', value: new Date(job.client.createdAt).getFullYear() },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.82rem', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                  </div>
                ))}
                <Link to={`/freelancers/${job.client._id}`} className="btn-ghost-custom" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  View Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
