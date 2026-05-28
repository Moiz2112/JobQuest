import React from 'react'
import { MapPin, Clock, Bookmark, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'C';

    const formatSalary = (salary) => {
        if (!salary) return 'Competitive';
        if (typeof salary === 'object' && salary.min && salary.max) {
            return `${salary.min} - ${salary.max} ${salary.currency || 'PKR'}`;
        }
        return salary;
    };

    const gradients = [
        'linear-gradient(135deg, #6A38C2, #8b5cf6)',
        'linear-gradient(135deg, #3b82f6, #60a5fa)',
        'linear-gradient(135deg, #22c55e, #4ade80)',
        'linear-gradient(135deg, #f59e0b, #fbbf24)',
        'linear-gradient(135deg, #ef4444, #f87171)',
        'linear-gradient(135deg, #14b8a6, #2dd4bf)',
    ];
    const grad = gradients[job?.title?.charCodeAt(0) % gradients.length] || gradients[0];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .job-card {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: white;
                    border-radius: 16px;
                    border: 1.5px solid #f1f5f9;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .job-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6A38C2, #8b5cf6);
                    opacity: 0;
                    transition: opacity 0.25s;
                }
                .job-card:hover {
                    border-color: #e9d5ff;
                    transform: translateY(-4px);
                    box-shadow: 0 16px 40px rgba(106,56,194,0.12);
                }
                .job-card:hover::before { opacity: 1; }

                .jc-header { display: flex; align-items: flex-start; justify-content: space-between; }
                .jc-logo {
                    width: 44px; height: 44px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 1.1rem; font-weight: 800;
                    flex-shrink: 0;
                }
                .jc-bookmark {
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .jc-bookmark:hover { background: #f5f3ff; color: #6A38C2; border-color: #ddd6fe; }

                .jc-company { font-size: 0.8rem; color: #94a3b8; font-weight: 500; margin-top: 10px; }
                .jc-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 4px 0 6px; line-height: 1.3; }

                .jc-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
                .jc-meta-item {
                    display: flex; align-items: center; gap: 4px;
                    font-size: 0.75rem; color: #64748b; font-weight: 500;
                }

                .jc-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px; }
                .jc-badge {
                    font-size: 0.72rem; font-weight: 600;
                    padding: 3px 10px; border-radius: 100px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .jc-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    padding-top: 12px;
                    border-top: 1px solid #f1f5f9;
                    margin-top: auto;
                }
                .jc-salary { font-size: 0.88rem; font-weight: 700; color: #6A38C2; }
                .jc-salary span { font-size: 0.72rem; font-weight: 400; color: #94a3b8; }
                .jc-apply-btn {
                    display: flex; align-items: center; gap: 4px;
                    font-size: 0.78rem; font-weight: 700;
                    color: #6A38C2; background: #f5f3ff;
                    border: 1px solid #ddd6fe;
                    padding: 6px 12px; border-radius: 8px;
                    cursor: pointer; transition: all 0.2s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .jc-apply-btn:hover {
                    background: #6A38C2; color: white; border-color: #6A38C2;
                }
            `}</style>

            <div className="job-card" onClick={() => navigate(`/description/${job._id}`)}>
                <div className="jc-header">
                    <div className="jc-logo" style={{ background: grad }}>{getInitial(job?.company?.name)}</div>
                    <div className="jc-bookmark" onClick={(e) => e.stopPropagation()}>
                        <Bookmark size={15} />
                    </div>
                </div>

                <div>
                    <div className="jc-company">{job?.company?.name}</div>
                    <div className="jc-title">{job?.title}</div>
                    <div className="jc-meta">
                        <span className="jc-meta-item"><MapPin size={12} /> Pakistan</span>
                        <span className="jc-meta-item"><Clock size={12} /> {job?.jobType || 'Full-time'}</span>
                    </div>
                </div>

                <div className="jc-badges">
                    <span className="jc-badge" style={{ background: '#eff6ff', color: '#3b82f6' }}>{job?.position} Position{job?.position > 1 ? 's' : ''}</span>
                    <span className="jc-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>{job?.jobType}</span>
                </div>

                <div className="jc-footer">
                    <div className="jc-salary">
                        {formatSalary(job?.salary)} <span>/ month</span>
                    </div>
                    <button className="jc-apply-btn" onClick={(e) => { e.stopPropagation(); navigate(`/description/${job._id}`); }}>
                        Apply <ArrowRight size={13} />
                    </button>
                </div>
            </div>
        </>
    )
}

export default LatestJobCards