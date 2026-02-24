import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    experience: '',
    skills: '',
    page: 1
  });

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await axios.get(`/api/users/freelancers?${params}`);
      setFreelancers(data.freelancers || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchFreelancers(); }, [fetchFreelancers]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const POPULAR_SKILLS = ['React.js', 'Node.js', 'Python', 'UI/UX Design', 'iOS', 'Android', 'Vue.js', 'Django', 'PostgreSQL', 'AWS'];

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-label">Discover Talent</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Find Expert Freelancers</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {pagination.total?.toLocaleString() || '0'} skilled professionals ready to help
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
          <div className="search-bar" style={{ maxWidth: '100%' }}>
            <span>🔍</span>
            <input type="text" placeholder="Search by name, skill, or expertise..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
            <button type="submit" className="btn-primary-custom">Search</button>
          </div>
        </form>

        {/* Quick skill filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button className={`skill-tag ${filters.skills === '' ? 'active' : ''}`} onClick={() => updateFilter('skills', '')} style={{ cursor: 'pointer' }}>All Skills</button>
          {POPULAR_SKILLS.map(skill => (
            <button key={skill} className="skill-tag" style={{ cursor: 'pointer', background: filters.skills === skill ? 'rgba(108,99,255,0.2)' : '' }}
              onClick={() => updateFilter('skills', filters.skills === skill ? '' : skill)}>
              {skill}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="filter-sidebar">
              <div className="filter-title">🎛️ Filter</div>
              <div className="filter-group">
                <div className="filter-group-label">Experience Level</div>
                {['', 'entry', 'intermediate', 'expert'].map(exp => (
                  <label key={exp} className="check-item">
                    <input type="radio" name="experience" checked={filters.experience === exp} onChange={() => updateFilter('experience', exp)} />
                    {exp ? exp.charAt(0).toUpperCase() + exp.slice(1) : 'Any Level'}
                  </label>
                ))}
              </div>
              <button onClick={() => { setSearchInput(''); setFilters({ search: '', experience: '', skills: '', page: 1 }); }}
                className="btn-ghost-custom" style={{ width: '100%', justifyContent: 'center' }}>
                Clear All
              </button>
            </div>
          </div>

          {/* Freelancers Grid */}
          <div className="col-lg-9">
            {loading ? (
              <div className="row g-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="col-sm-6 col-xl-4">
                    <div className="card-custom" style={{ textAlign: 'center' }}>
                      <div className="skeleton" style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                      <div className="skeleton" style={{ height: 18, width: '60%', margin: '0 auto 0.5rem' }}></div>
                      <div className="skeleton" style={{ height: 14, width: '80%', margin: '0 auto 1rem' }}></div>
                      <div className="skeleton" style={{ height: 36 }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : freelancers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-title">No freelancers found</div>
                <div className="empty-state-text">Try different filters or search terms</div>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {freelancers.map(f => (
                    <div key={f._id} className="col-sm-6 col-xl-4">
                      <Link to={`/freelancers/${f._id}`} className="freelancer-card">
                        <div className="avatar-placeholder" style={{ marginBottom: '0.75rem', width: 64, height: 64, fontSize: '1.3rem', background: `hsl(${f.name?.charCodeAt(0) * 13 % 360}, 65%, 45%)` }}>
                          {f.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.95rem' }}>{f.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          {f.experience ? f.experience.charAt(0).toUpperCase() + f.experience.slice(1) : ''} Level
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                          <span style={{ color: '#FFB347', fontSize: '0.8rem' }}>{'★'.repeat(Math.round(f.rating || 0))}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({f.reviewCount || 0})</span>
                        </div>
                        {f.bio && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                            {f.bio}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
                          {f.skills?.slice(0, 3).map(skill => <span key={skill} className="skill-tag" style={{ fontSize: '0.7rem' }}>{skill}</span>)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', width: '100%' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>✅ {f.completedJobs || 0} jobs</span>
                          {f.hourlyRate > 0 && <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-3)' }}>${f.hourlyRate}/hr</span>}
                          {!f.hourlyRate && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Negotiable</span>}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="pagination-custom">
                    <button className="page-btn" onClick={() => updateFilter('page', Math.max(1, filters.page - 1))}>‹</button>
                    {[...Array(Math.min(pagination.pages, 7))].map((_, i) => (
                      <button key={i + 1} className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`} onClick={() => updateFilter('page', i + 1)}>{i + 1}</button>
                    ))}
                    <button className="page-btn" onClick={() => updateFilter('page', Math.min(pagination.pages, filters.page + 1))}>›</button>
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

export default Freelancers;
