import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .latest-section {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: 72px 24px;
                    background: #fafafa;
                }
                .latest-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 36px;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .latest-eyebrow {
                    display: inline-block;
                    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
                    color: #6A38C2;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 5px 14px;
                    border-radius: 100px;
                    margin-bottom: 10px;
                    border: 1px solid #ddd6fe;
                }
                .latest-title {
                    font-size: clamp(1.6rem, 3vw, 2.2rem);
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.5px;
                    margin: 0;
                    line-height: 1.2;
                }
                .latest-title-accent {
                    background: linear-gradient(135deg, #6A38C2 0%, #9b5de5 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .latest-subtitle {
                    color: #64748b;
                    font-size: 0.92rem;
                    margin: 6px 0 0;
                }
                .view-all-btn {
                    display: flex; align-items: center; gap: 6px;
                    color: #6A38C2;
                    background: white;
                    border: 1.5px solid #ddd6fe;
                    padding: 9px 18px;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .view-all-btn:hover {
                    background: #6A38C2; color: white; border-color: #6A38C2;
                }
                .jobs-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                @media (max-width: 1024px) {
                    .jobs-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 640px) {
                    .jobs-grid { grid-template-columns: 1fr; }
                }
                .no-jobs {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    color: #94a3b8;
                }
                .no-jobs-icon {
                    width: 60px; height: 60px;
                    background: #f5f3ff;
                    border-radius: 16px;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 12px;
                    font-size: 1.8rem;
                }
            `}</style>

            <section className="latest-section">
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="latest-header">
                        <div>
                            <div className="latest-eyebrow">Just Posted</div>
                            <h2 className="latest-title">
                                <span className="latest-title-accent">Latest & Top</span> Job Openings
                            </h2>
                            <p className="latest-subtitle">Freshly posted opportunities from top companies</p>
                        </div>
                        <button className="view-all-btn" onClick={() => navigate('/jobs')}>
                            View All Jobs <ArrowRight size={15} />
                        </button>
                    </div>

                    <div className="jobs-grid">
                        {allJobs.length <= 0 ? (
                            <div className="no-jobs">
                                <div className="no-jobs-icon">💼</div>
                                <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>No jobs available yet</p>
                                <p style={{ fontSize: '0.85rem', margin: 0 }}>Check back soon for new opportunities</p>
                            </div>
                        ) : (
                            allJobs.slice(0, 6).map((job) => (
                                <LatestJobCards key={job._id} job={job} />
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default LatestJobs