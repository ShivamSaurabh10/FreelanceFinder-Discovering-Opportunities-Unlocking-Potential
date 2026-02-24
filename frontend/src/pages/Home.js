import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  { name: 'Web Development', icon: '🌐', slug: 'Web Development' },
  { name: 'Mobile Development', icon: '📱', slug: 'Mobile Development' },
  { name: 'Design & Creative', icon: '🎨', slug: 'Design & Creative' },
  { name: 'Writing & Content', icon: '✍️', slug: 'Writing & Content' },
  { name: 'Data Science & ML', icon: '🤖', slug: 'Data Science & ML' },
  { name: 'Digital Marketing', icon: '📈', slug: 'Digital Marketing' },
  { name: 'Video & Animation', icon: '🎬', slug: 'Video & Animation' },
  { name: 'Finance & Accounting', icon: '💰', slug: 'Finance & Accounting' },
];

const StarRating = ({ rating }) => {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#FFB347' : 'var(--surface-3)' }}>★</span>
      ))}
    </span>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topFreelancers, setTopFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, freelancersRes] = await Promise.all([
          axios.get('/api/jobs?limit=6&sort=-createdAt'),
          axios.get('/api/users/freelancers?limit=4')
        ]);
        setFeaturedJobs(jobsRes.data.jobs || []);
        setTopFreelancers(freelancersRes.data.freelancers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/jobs?search=${encodeURIComponent(search)}`);
    else navigate('/jobs');
  };

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="badge-custom badge-accent">✦ 50,000+ Active Opportunities</span>
              </div>
              <h1 className="hero-title fade-in-up">
                Discover<br />
                <span className="gradient-text">Opportunities,</span><br />
                Unlock Potential.
              </h1>
              <p className="hero-subtitle fade-in-up delay-1">
                Connect with world-class freelancers or find your next breakthrough project. The future of work starts here.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="fade-in-up delay-2" style={{ marginBottom: '2rem' }}>
                <div className="search-bar">
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search for jobs, skills, or categories..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn-primary-custom" style={{ flexShrink: 0 }}>
                    Search
                  </button>
                </div>
              </form>

              <div className="fade-in-up delay-3" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Popular:</span>
                {['React.js', 'Node.js', 'UI/UX Design', 'Python', 'Mobile Dev'].map(tag => (
                  <button key={tag} onClick={() => navigate(`/jobs?search=${tag}`)} className="skill-tag" style={{ cursor: 'pointer' }}>
                    {tag}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="fade-in-up delay-4" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                {[
                  { num: '50K+', label: 'Active Jobs' },
                  { num: '120K+', label: 'Freelancers' },
                  { num: '$2B+', label: 'Paid Out' },
                  { num: '95%', label: 'Satisfaction' }
                ].map(stat => (
                  <div key={stat.label} className="stat-item">
                    <div className="stat-number">{stat.num}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="col-lg-5 d-none d-lg-flex justify-content-center" style={{ position: 'relative' }}>
              <div style={{
                width: 380, height: 420,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 24,
                padding: '1.5rem',
                position: 'relative',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)'
              }}>
                {/* Mock job card in hero */}
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="badge-custom badge-green" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>● Live</div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Senior React Developer</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>TechCorp Inc. · Remote</div>
                    </div>
                    <div style={{ color: 'var(--accent-3)', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem' }}>$120/hr</div>
                  </div>
                </div>
                {[
                  { label: 'Full Stack Developer Needed', budget: '$5k', proposals: 12 },
                  { label: 'Mobile App UI Design', budget: '$2k', proposals: 7 },
                  { label: 'Data Analysis & ML Model', budget: '$3.5k', proposals: 5 },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.15rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.proposals} proposals</div>
                    </div>
                    <div style={{ color: 'var(--accent-3)', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem' }}>{item.budget}</div>
                  </div>
                ))}

                {/* Floating badges */}
                <div style={{ position: 'absolute', bottom: -20, left: -20, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '0.75rem 1rem', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>New proposal</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>🚀 Sarah accepted your offer</div>
                </div>
                <div style={{ position: 'absolute', top: -20, right: -20, background: 'var(--surface-2)', border: '1px solid rgba(0,217,163,0.3)', borderRadius: 12, padding: '0.75rem 1rem', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-3)' }}>⚡ Instant hire</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Job completed ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section style={{ padding: '5rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">Browse Categories</div>
            <h2 className="section-title">Find Work in Your Domain</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: '0.95rem' }}>
              From development to design, find the right category for your skills or project needs.
            </p>
          </div>
          <div className="row g-3">
            {CATEGORIES.map(cat => (
              <div key={cat.slug} className="col-6 col-sm-4 col-md-3">
                <Link to={`/jobs?category=${encodeURIComponent(cat.slug)}`} className="category-card">
                  <div className="category-icon">{cat.icon}</div>
                  <div className="category-name">{cat.name}</div>
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/jobs" className="btn-outline-custom">View All Categories →</Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED JOBS ─── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Latest Opportunities</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Recently Posted Jobs</h2>
            </div>
            <Link to="/jobs" className="btn-outline-custom">View all jobs →</Link>
          </div>

          {loading ? (
            <div className="row g-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="card-custom">
                    <div className="skeleton" style={{ height: 20, marginBottom: 12 }}></div>
                    <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ height: 50, marginBottom: 12 }}></div>
                    <div className="skeleton" style={{ height: 32 }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="row g-3">
              {featuredJobs.map(job => (
                <div key={job._id} className="col-md-6 col-lg-4">
                  <Link to={`/jobs/${job._id}`} className="job-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge-custom badge-accent" style={{ fontSize: '0.7rem' }}>{job.category}</span>
                      <span className="job-budget">${job.budget?.min?.toLocaleString()}{job.budget?.type === 'hourly' ? '/hr' : ''}</span>
                    </div>
                    <div className="job-title">{job.title}</div>
                    <div className="job-client">
                      {job.client?.isVerified && <span style={{ color: 'var(--accent-3)', marginRight: '0.3rem' }}>✓</span>}
                      {job.client?.name}
                    </div>
                    <div className="job-desc">{job.description}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                      {job.skills?.slice(0, 3).map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="job-meta">📝 {job.proposalCount || 0} proposals</span>
                      <span className="job-meta">📍 {job.location || 'Remote'}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">💼</div>
              <div className="empty-state-title">No jobs yet</div>
              <div className="empty-state-text">Be the first to post a job!</div>
            </div>
          )}
        </div>
      </section>

      {/* ─── TOP FREELANCERS ─── */}
      <section style={{ padding: '5rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Top Talent</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Vetted Professionals</h2>
            </div>
            <Link to="/freelancers" className="btn-outline-custom">Browse all talent →</Link>
          </div>

          <div className="row g-3">
            {topFreelancers.length > 0 ? topFreelancers.map(f => (
              <div key={f._id} className="col-sm-6 col-lg-3">
                <Link to={`/freelancers/${f._id}`} className="freelancer-card">
                  <div className="avatar-placeholder" style={{ marginBottom: '0.75rem', background: `hsl(${f.name?.charCodeAt(0) * 13 % 360}, 70%, 45%)` }}>
                    {f.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.25rem' }}>{f.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {f.skills?.slice(0, 2).join(' · ') || 'Freelancer'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <StarRating rating={f.rating || 0} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({f.reviewCount || 0})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>✅ {f.completedJobs || 0} jobs</span>
                    {f.hourlyRate > 0 && <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-3)' }}>${f.hourlyRate}/hr</span>}
                  </div>
                </Link>
              </div>
            )) : (
              <div className="col-12">
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <div className="empty-state-title">No freelancers yet</div>
                  <div className="empty-state-text">Register as a freelancer to get started!</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label">Simple Process</div>
            <h2 className="section-title">How FreelanceFinder Works</h2>
          </div>
          <div className="row g-4">
            {[
              { step: '01', icon: '🔍', title: 'Post or Browse', desc: 'Clients post jobs with details. Freelancers browse thousands of opportunities filtered to their skills.' },
              { step: '02', icon: '📝', title: 'Submit Proposals', desc: 'Freelancers submit tailored proposals. Clients review profiles, portfolios, and bids.' },
              { step: '03', icon: '🤝', title: 'Collaborate', desc: 'Accept a proposal, kick off the project, and communicate seamlessly through our platform.' },
              { step: '04', icon: '💸', title: 'Get Paid', desc: 'Secure payments, milestone tracking, and reviews. Build your reputation for future work.' },
            ].map((item, i) => (
              <div key={item.step} className="col-md-6 col-lg-3">
                <div className="card-custom" style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px',
                    color: 'var(--accent)', marginBottom: '1rem',
                    fontFamily: 'Syne'
                  }}>STEP {item.step}</div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                  <h5 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.75rem' }}>{item.title}</h5>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: '4rem 3rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: 'Syne', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
                Ready to Get Started?
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7 }}>
                Join 120,000+ professionals already growing their careers and businesses on FreelanceFinder.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-primary-custom" style={{ padding: '0.8rem 2rem' }}>Start Free Today →</Link>
                <Link to="/jobs" className="btn-outline-custom" style={{ padding: '0.8rem 2rem' }}>Browse Jobs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
