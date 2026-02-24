import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(user?.role === 'client' ? 'jobs' : 'proposals');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'client') {
          const { data } = await axios.get(`/api/users/${user._id}/jobs`);
          setMyJobs(data.jobs || []);
        } else {
          const { data } = await axios.get('/api/proposals/my');
          setMyProposals(data.proposals || []);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (user) fetchData();
  }, [user]);

  const STATUS_COLORS = {
    open: 'badge-green', 'in-progress': 'badge-yellow', completed: 'badge-accent', cancelled: 'badge-red',
    pending: 'badge-yellow', accepted: 'badge-green', rejected: 'badge-red', withdrawn: 'badge-red'
  };

  const hue = user?.name?.charCodeAt(0) * 13 % 360;

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="avatar-placeholder" style={{ width: 56, height: 56, fontSize: '1.4rem', background: `hsl(${hue}, 65%, 45%)` }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Syne', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.15rem' }}>
                Hey, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                {user?.role === 'client' ? 'Manage your projects and talent' : 'Track your proposals and opportunities'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {user?.role === 'client' ? (
              <Link to="/post-job" className="btn-primary-custom">+ Post a Job</Link>
            ) : (
              <Link to="/jobs" className="btn-primary-custom">Browse Jobs →</Link>
            )}
            <Link to="/profile" className="btn-outline-custom">Edit Profile</Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3" style={{ marginBottom: '2rem' }}>
          {user?.role === 'client' ? (
            <>
              {[
                { icon: '💼', color: '#6C63FF', value: myJobs.length, label: 'Total Jobs Posted', bg: 'rgba(108,99,255,0.1)' },
                { icon: '🟢', color: '#00D9A3', value: myJobs.filter(j => j.status === 'open').length, label: 'Open Jobs', bg: 'rgba(0,217,163,0.1)' },
                { icon: '⚡', color: '#FFC107', value: myJobs.filter(j => j.status === 'in-progress').length, label: 'In Progress', bg: 'rgba(255,193,7,0.1)' },
                { icon: '✅', color: '#00D9A3', value: myJobs.filter(j => j.status === 'completed').length, label: 'Completed', bg: 'rgba(0,217,163,0.1)' },
              ].map(stat => (
                <div key={stat.label} className="col-6 col-md-3">
                  <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: stat.bg }}><span style={{ fontSize: '1.5rem' }}>{stat.icon}</span></div>
                    <div style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                { icon: '📝', color: '#6C63FF', value: myProposals.length, label: 'Total Proposals', bg: 'rgba(108,99,255,0.1)' },
                { icon: '⏳', color: '#FFC107', value: myProposals.filter(p => p.status === 'pending').length, label: 'Pending', bg: 'rgba(255,193,7,0.1)' },
                { icon: '✅', color: '#00D9A3', value: myProposals.filter(p => p.status === 'accepted').length, label: 'Accepted', bg: 'rgba(0,217,163,0.1)' },
                { icon: '⭐', color: '#FFB347', value: user?.rating?.toFixed(1) || '0.0', label: 'Avg Rating', bg: 'rgba(255,179,71,0.1)' },
              ].map(stat => (
                <div key={stat.label} className="col-6 col-md-3">
                  <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: stat.bg }}><span style={{ fontSize: '1.5rem' }}>{stat.icon}</span></div>
                    <div style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {user?.role === 'client' ? (
              <button className={`btn-ghost-custom ${activeTab === 'jobs' ? 'active' : ''}`}
                style={{ borderRadius: '8px 8px 0 0', borderBottom: activeTab === 'jobs' ? '2px solid var(--accent)' : '2px solid transparent', background: activeTab === 'jobs' ? 'var(--surface-2)' : 'transparent' }}
                onClick={() => setActiveTab('jobs')}>
                💼 My Jobs
              </button>
            ) : (
              <button className={`btn-ghost-custom ${activeTab === 'proposals' ? 'active' : ''}`}
                style={{ borderRadius: '8px 8px 0 0', borderBottom: activeTab === 'proposals' ? '2px solid var(--accent)' : '2px solid transparent', background: activeTab === 'proposals' ? 'var(--surface-2)' : 'transparent' }}
                onClick={() => setActiveTab('proposals')}>
                📝 My Proposals
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner"></div></div>
        ) : user?.role === 'client' ? (
          myJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💼</div>
              <div className="empty-state-title">No jobs posted yet</div>
              <div className="empty-state-text">Post your first job and find amazing talent</div>
              <Link to="/post-job" className="btn-primary-custom" style={{ marginTop: '1.5rem' }}>Post a Job →</Link>
            </div>
          ) : (
            <div>
              {myJobs.map(job => (
                <div key={job._id} className="card-custom" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <Link to={`/jobs/${job._id}`} style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
                        {job.title}
                      </Link>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span className={`badge-custom ${STATUS_COLORS[job.status] || ''}`} style={{ fontSize: '0.72rem' }}>{job.status}</span>
                        <span>💬 {job.proposalCount} proposals</span>
                        <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/jobs/${job._id}`} className="btn-ghost-custom" style={{ fontSize: '0.78rem' }}>View</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          myProposals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-title">No proposals submitted yet</div>
              <div className="empty-state-text">Browse jobs and submit your first proposal</div>
              <Link to="/jobs" className="btn-primary-custom" style={{ marginTop: '1.5rem' }}>Browse Jobs →</Link>
            </div>
          ) : (
            <div>
              {myProposals.map(proposal => (
                <div key={proposal._id} className="card-custom" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <Link to={`/jobs/${proposal.job?._id}`} style={{ fontFamily: 'Syne', fontWeight: 700, textDecoration: 'none', color: 'var(--text-primary)' }}>
                        {proposal.job?.title || 'Job Deleted'}
                      </Link>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                        <span className={`badge-custom ${STATUS_COLORS[proposal.status] || ''}`} style={{ fontSize: '0.72rem' }}>{proposal.status}</span>
                        <span style={{ color: 'var(--accent-3)', fontWeight: 600 }}>💰 ${proposal.bidAmount?.toLocaleString()}</span>
                        <span style={{ color: 'var(--text-muted)' }}>⏱️ {proposal.deliveryTime} days</span>
                        <span style={{ color: 'var(--text-muted)' }}>📅 {new Date(proposal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link to={`/jobs/${proposal.job?._id}`} className="btn-ghost-custom" style={{ fontSize: '0.78rem' }}>View Job</Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
