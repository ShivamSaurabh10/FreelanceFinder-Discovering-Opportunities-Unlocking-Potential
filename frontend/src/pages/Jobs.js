import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['all', 'Web Development', 'Mobile Development', 'Design & Creative', 'Writing & Content', 'Data Science & ML', 'Digital Marketing', 'Video & Animation', 'Finance & Accounting', 'Customer Support', 'Other'];
const EXPERIENCE = ['entry', 'intermediate', 'expert'];
const DURATION = ['less-than-1-month', '1-3-months', '3-6-months', 'more-than-6-months'];
const DURATION_LABELS = { 'less-than-1-month': '< 1 Month', '1-3-months': '1–3 Months', '3-6-months': '3–6 Months', 'more-than-6-months': '6+ Months' };

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    experience: '',
    duration: '',
    page: 1,
    sort: '-createdAt'
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'all') params.append(k, v); });
      const { data } = await axios.get(`/api/jobs?${params}`);
      setJobs(data.jobs || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const formatBudget = (job) => {
    if (!job.budget) return 'Negotiable';
    const { min, max, type } = job.budget;
    const suffix = type === 'hourly' ? '/hr' : '';
    if (min && max && min !== max) return `$${min.toLocaleString()} – $${max.toLocaleString()}${suffix}`;
    if (min) return `$${min.toLocaleString()}${suffix}`;
    return 'Negotiable';
  };

  const timeAgo = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Browse Jobs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {pagination.total?.toLocaleString() || '0'} opportunities available
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
          <div className="search-bar" style={{ maxWidth: '100%' }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by title, skill, or keyword..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn-primary-custom">Search</button>
          </div>
        </form>

        <div className="row g-4">
          {/* Sidebar Filters */}
          <div className="col-lg-3">
            <div className="filter-sidebar">
              <div className="filter-title">🎛️ Filter Jobs</div>

              {/* Sort */}
              <div className="filter-group">
                <div className="filter-group-label">Sort By</div>
                <select className="form-control-custom" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="-budget.max">Highest Budget</option>
                  <option value="-views">Most Views</option>
                  <option value="-proposalCount">Most Proposals</option>
                </select>
              </div>

              {/* Category */}
              <div className="filter-group">
                <div className="filter-group-label">Category</div>
                {CATEGORIES.map(cat => (
                  <label key={cat} className="check-item">
                    <input type="radio" name="category" checked={filters.category === cat} onChange={() => updateFilter('category', cat)} />
                    {cat === 'all' ? 'All Categories' : cat}
                  </label>
                ))}
              </div>

              {/* Experience */}
              <div className="filter-group">
                <div className="filter-group-label">Experience Level</div>
                <label className="check-item">
                  <input type="radio" name="experience" checked={filters.experience === ''} onChange={() => updateFilter('experience', '')} />
                  Any Level
                </label>
                {EXPERIENCE.map(exp => (
                  <label key={exp} className="check-item">
                    <input type="radio" name="experience" checked={filters.experience === exp} onChange={() => updateFilter('experience', exp)} />
                    {exp.charAt(0).toUpperCase() + exp.slice(1)}
                  </label>
                ))}
              </div>

              {/* Duration */}
              <div className="filter-group">
                <div className="filter-group-label">Project Duration</div>
                <label className="check-item">
                  <input type="radio" name="duration" checked={filters.duration === ''} onChange={() => updateFilter('duration', '')} />
                  Any Duration
                </label>
                {DURATION.map(d => (
                  <label key={d} className="check-item">
                    <input type="radio" name="duration" checked={filters.duration === d} onChange={() => updateFilter('duration', d)} />
                    {DURATION_LABELS[d]}
                  </label>
                ))}
              </div>

              <button onClick={() => { setSearchInput(''); setFilters({ search: '', category: 'all', experience: '', duration: '', page: 1, sort: '-createdAt' }); }}
                className="btn-ghost-custom" style={{ width: '100%', justifyContent: 'center' }}>
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="col-lg-9">
            {loading ? (
              <div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="card-custom" style={{ marginBottom: '1rem' }}>
                    <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 10 }}></div>
                    <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 16 }}></div>
                    <div className="skeleton" style={{ height: 60, marginBottom: 16 }}></div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[...Array(4)].map((_, j) => <div key={j} className="skeleton" style={{ height: 26, width: 70 }}></div>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">No jobs found</div>
                <div className="empty-state-text">Try adjusting your filters or search terms</div>
              </div>
            ) : (
              <>
                {jobs.map(job => (
                  <Link key={job._id} to={`/jobs/${job._id}`} className="job-card" style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          <span className="badge-custom badge-accent" style={{ fontSize: '0.7rem' }}>{job.category}</span>
                          {job.isFeatured && <span className="badge-custom badge-yellow" style={{ fontSize: '0.7rem' }}>⭐ Featured</span>}
                          <span className="badge-custom" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{job.experienceLevel}</span>
                        </div>
                        <div className="job-title" style={{ fontSize: '1.1rem' }}>{job.title}</div>
                        <div className="job-client">
                          {job.client?.isVerified && <span style={{ color: 'var(--accent-3)', marginRight: '0.3rem' }}>✓</span>}
                          <span>{job.client?.name}</span>
                          {job.client?.rating > 0 && <span style={{ color: '#FFB347', marginLeft: '0.5rem' }}>★ {job.client.rating.toFixed(1)}</span>}
                          <span style={{ margin: '0 0.4rem', color: 'var(--text-muted)' }}>·</span>
                          <span style={{ color: 'var(--text-muted)' }}>{job.location || 'Remote'}</span>
                        </div>
                        <div className="job-desc">{job.description}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                          {job.skills?.slice(0, 5).map(skill => (
                            <span key={skill} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div className="job-budget" style={{ fontSize: '1.15rem' }}>{formatBudget(job)}</div>
                        <div className="job-meta" style={{ marginTop: '0.4rem' }}>💬 {job.proposalCount} proposals</div>
                        <div className="job-meta" style={{ marginTop: '0.2rem' }}>👁️ {job.views} views</div>
                        <div className="job-meta" style={{ marginTop: '0.2rem' }}>🕐 {timeAgo(job.createdAt)}</div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination-custom">
                    <button className="page-btn" onClick={() => updateFilter('page', Math.max(1, filters.page - 1))} disabled={filters.page === 1}>‹</button>
                    {[...Array(Math.min(pagination.pages, 7))].map((_, i) => {
                      const p = i + 1;
                      return (
                        <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`} onClick={() => updateFilter('page', p)}>{p}</button>
                      );
                    })}
                    <button className="page-btn" onClick={() => updateFilter('page', Math.min(pagination.pages, filters.page + 1))} disabled={filters.page === pagination.pages}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
