import React, { useState, useEffect } from 'react'
import { Search, MapPin, Briefcase, TrendingUp, Users, Star } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [animateIn, setAnimateIn] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const t = setTimeout(() => setAnimateIn(true), 100);
        return () => clearTimeout(t);
    }, []);

    const searchJobHandler = () => {
        if (!query.trim()) return;
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    const handleKey = (e) => {
        if (e.key === 'Enter') searchJobHandler();
    };

    const stats = [
        { icon: <Briefcase size={18} />, value: '10,000+', label: 'Jobs Posted' },
        { icon: <Users size={18} />, value: '50,000+', label: 'Job Seekers' },
        { icon: <Star size={18} />, value: '2,500+', label: 'Companies' },
        { icon: <TrendingUp size={18} />, value: '95%', label: 'Success Rate' },
    ];

    const popularSearches = ['Frontend Developer', 'UI/UX Designer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

                .hero-section {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    position: relative;
                    min-height: 88vh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: #fafafa;
                    margin-top: 5rem;
                }

                .hero-bg {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(106,56,194,0.12) 0%, transparent 70%),
                                radial-gradient(ellipse 40% 40% at 90% 60%, rgba(155,93,229,0.08) 0%, transparent 60%),
                                radial-gradient(ellipse 50% 50% at 10% 80%, rgba(99,102,241,0.06) 0%, transparent 60%);
                }

                .blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.25;
                    animation: floatBlob 8s ease-in-out infinite;
                }
                .blob-1 {
                    width: 400px; height: 400px;
                    background: linear-gradient(135deg, #6A38C2, #8b5cf6);
                    top: -100px; right: -80px;
                    animation-delay: 0s;
                }
                .blob-2 {
                    width: 300px; height: 300px;
                    background: linear-gradient(135deg, #6366f1, #a78bfa);
                    bottom: -60px; left: -60px;
                    animation-delay: -4s;
                }
                @keyframes floatBlob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -30px) scale(1.05); }
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 60px 24px 80px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }

                @media (max-width: 900px) {
                    .hero-content { grid-template-columns: 1fr; gap: 40px; padding: 40px 24px 60px; }
                    .hero-visual { display: none; }
                }

                .badge-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
                    border: 1px solid #ddd6fe;
                    color: #6A38C2;
                    padding: 6px 14px 6px 8px;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .badge-dot {
                    width: 22px; height: 22px;
                    background: linear-gradient(135deg, #6A38C2, #8b5cf6);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 10px;
                }

                .hero-title {
                    font-size: clamp(2.4rem, 5vw, 3.6rem);
                    font-weight: 900;
                    line-height: 1.1;
                    color: #0f172a;
                    letter-spacing: -1.5px;
                    margin: 0 0 16px;
                }
                .hero-title-accent {
                    background: linear-gradient(135deg, #6A38C2 0%, #9b5de5 50%, #c084fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-subtitle {
                    font-size: 1.05rem;
                    color: #64748b;
                    line-height: 1.7;
                    max-width: 480px;
                    margin: 0 0 32px;
                    font-weight: 400;
                }

                .search-box {
                    display: flex;
                    align-items: center;
                    background: white;
                    border-radius: 16px;
                    border: 2px solid #e2e8f0;
                    box-shadow: 0 8px 40px rgba(106,56,194,0.12);
                    overflow: hidden;
                    max-width: 520px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    margin-bottom: 20px;
                }
                .search-box:focus-within {
                    border-color: #6A38C2;
                    box-shadow: 0 8px 40px rgba(106,56,194,0.2);
                }
                .search-icon-wrap {
                    padding: 0 14px;
                    color: #94a3b8;
                }
                .search-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 0.95rem;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: #0f172a;
                    padding: 14px 0;
                    background: transparent;
                }
                .search-input::placeholder { color: #94a3b8; }
                .search-divider {
                    width: 1px; height: 28px;
                    background: #e2e8f0;
                    margin: 0 4px;
                }
                .search-btn {
                    margin: 6px;
                    background: linear-gradient(135deg, #6A38C2 0%, #8b5cf6 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 10px 22px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    transition: all 0.2s;
                    white-space: nowrap;
                    box-shadow: 0 4px 14px rgba(106,56,194,0.35);
                }
                .search-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(106,56,194,0.5);
                }

                .popular-tags {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .popular-label {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    font-weight: 500;
                }
                .tag {
                    font-size: 0.78rem;
                    color: #6A38C2;
                    background: #f5f3ff;
                    border: 1px solid #ddd6fe;
                    padding: 4px 12px;
                    border-radius: 100px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .tag:hover {
                    background: #6A38C2;
                    color: white;
                    border-color: #6A38C2;
                }

                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                    margin-top: 48px;
                    max-width: 520px;
                }
                @media (max-width: 600px) {
                    .stats-row { grid-template-columns: repeat(2, 1fr); }
                }
                .stat-item {
                    background: white;
                    border: 1px solid #f1f5f9;
                    border-radius: 12px;
                    padding: 14px 12px;
                    text-align: center;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                }
                .stat-icon {
                    width: 32px; height: 32px;
                    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    color: #6A38C2;
                    margin: 0 auto 6px;
                }
                .stat-value {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1;
                    margin-bottom: 2px;
                }
                .stat-label {
                    font-size: 0.7rem;
                    color: #94a3b8;
                    font-weight: 500;
                }

                /* Right Visual */
                .hero-visual {
                    position: relative;
                    height: 480px;
                }
                .visual-card {
                    position: absolute;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.1);
                    border: 1px solid #f1f5f9;
                    animation: floatCard 6s ease-in-out infinite;
                }
                .main-card {
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 300px;
                    padding: 24px;
                    animation-delay: 0s;
                }
                .side-card-1 {
                    top: 15%; right: 5%;
                    width: 160px;
                    padding: 14px;
                    animation-delay: -2s;
                }
                .side-card-2 {
                    bottom: 20%; left: 5%;
                    width: 180px;
                    padding: 14px;
                    animation-delay: -4s;
                }
                @keyframes floatCard {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-12px); }
                }
                .side-card-1 { animation: floatSide1 7s ease-in-out infinite; }
                .side-card-2 { animation: floatSide2 5s ease-in-out infinite; }
                @keyframes floatSide1 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes floatSide2 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .company-logo-row {
                    display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
                }
                .company-logo-circle {
                    width: 36px; height: 36px; border-radius: 8px;
                    background: linear-gradient(135deg, #6A38C2, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-weight: 800; font-size: 0.85rem;
                }
                .company-name { font-weight: 700; color: #0f172a; font-size: 0.9rem; }
                .company-location { font-size: 0.75rem; color: #94a3b8; display: flex; align-items: center; gap: 3px; }

                .job-title-card { font-weight: 800; font-size: 1rem; color: #0f172a; margin: 8px 0 4px; }
                .job-desc-card { font-size: 0.75rem; color: #64748b; line-height: 1.5; margin-bottom: 14px; }

                .badge-card {
                    display: inline-flex; align-items: center;
                    padding: 4px 10px; border-radius: 100px;
                    font-size: 0.7rem; font-weight: 600; margin-right: 6px;
                }
                .apply-btn-card {
                    width: 100%; margin-top: 14px;
                    background: linear-gradient(135deg, #6A38C2, #8b5cf6);
                    color: white; border: none; border-radius: 8px;
                    padding: 10px 0; font-size: 0.85rem; font-weight: 700;
                    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
                    box-shadow: 0 4px 14px rgba(106,56,194,0.3);
                }

                .fade-up { opacity: 0; transform: translateY(24px); }
                .fade-up.in { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease, transform 0.6s ease; }
                .delay-1.in { transition-delay: 0.1s; }
                .delay-2.in { transition-delay: 0.2s; }
                .delay-3.in { transition-delay: 0.35s; }
                .delay-4.in { transition-delay: 0.5s; }
                .delay-5.in { transition-delay: 0.65s; }
            `}</style>

            <section className="hero-section">
                <div className="hero-bg" />
                <div className="blob blob-1" />
                <div className="blob blob-2" />

                <div className="hero-content">
                    {/* Left: Text Content */}
                    <div>
                        <div className={`badge-pill fade-up ${animateIn ? 'in' : ''}`}>
                            <span className="badge-dot">✦</span>
                            No. 1 Job Hunt Platform in Pakistan
                        </div>

                        <h1 className={`hero-title fade-up delay-1 ${animateIn ? 'in' : ''}`}>
                            Find Your<br />
                            <span className="hero-title-accent">Dream Career</span><br />
                            Starts Here
                        </h1>

                        <p className={`hero-subtitle fade-up delay-2 ${animateIn ? 'in' : ''}`}>
                            Connect with top employers across Pakistan. Search thousands of jobs, apply with ease, and land the opportunity you deserve.
                        </p>

                        <div className={`fade-up delay-3 ${animateIn ? 'in' : ''}`}>
                            <div className="search-box">
                                <span className="search-icon-wrap"><Search size={18} /></span>
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Job title, keywords, or company..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKey}
                                />
                                <button className="search-btn" onClick={searchJobHandler}>
                                    <Search size={15} /> Search Jobs
                                </button>
                            </div>

                            <div className="popular-tags">
                                <span className="popular-label">Popular:</span>
                                {popularSearches.map((s) => (
                                    <button
                                        key={s}
                                        className="tag"
                                        onClick={() => { dispatch(setSearchedQuery(s)); navigate('/browse'); }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`stats-row fade-up delay-4 ${animateIn ? 'in' : ''}`}>
                            {stats.map((s, i) => (
                                <div key={i} className="stat-item">
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-value">{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual Cards */}
                    <div className={`hero-visual fade-up delay-5 ${animateIn ? 'in' : ''}`}>
                        {/* Main job card */}
                        <div className="visual-card main-card">
                            <div className="company-logo-row">
                                <div className="company-logo-circle">G</div>
                                <div>
                                    <div className="company-name">Google Pakistan</div>
                                    <div className="company-location"><MapPin size={10} /> Karachi, PK</div>
                                </div>
                            </div>
                            <div className="job-title-card">Senior Frontend Developer</div>
                            <div className="job-desc-card">Build beautiful, high-performance web applications using React and modern tooling.</div>
                            <div>
                                <span className="badge-card" style={{ background: '#eff6ff', color: '#3b82f6' }}>Full-time</span>
                                <span className="badge-card" style={{ background: '#f0fdf4', color: '#22c55e' }}>Remote</span>
                                <span className="badge-card" style={{ background: '#fdf4ff', color: '#a855f7' }}>80K–120K</span>
                            </div>
                            <button className="apply-btn-card">Apply Now →</button>
                        </div>

                        {/* Side card 1 - match count */}
                        <div className="visual-card side-card-1" style={{ top: '12%', right: '0%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TrendingUp size={14} color="#22c55e" />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>New Matches</span>
                            </div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#6A38C2', lineHeight: 1 }}>24</div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>jobs match your profile</div>
                        </div>

                        {/* Side card 2 - profile views */}
                        <div className="visual-card side-card-2" style={{ bottom: '18%', left: '0%' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Star size={13} color="#f59e0b" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Top Rated</div>
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>4.9 ★ Employer</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '10px', display: 'flex', gap: '-8px' }}>
                                {['#6A38C2', '#8b5cf6', '#c084fc', '#a78bfa'].map((c, i) => (
                                    <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i === 0 ? 0 : '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '9px', fontWeight: 700 }}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                                <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginLeft: '6px', alignSelf: 'center' }}>+240 hired</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroSection