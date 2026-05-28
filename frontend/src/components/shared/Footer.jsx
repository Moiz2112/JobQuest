import React from 'react';
import { Briefcase, Mail, MapPin, Phone, Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .footer {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: #0f172a;
                    color: #94a3b8;
                }
                .footer-main {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 60px 24px 40px;
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1.5fr;
                    gap: 40px;
                }
                @media (max-width: 1024px) {
                    .footer-main { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 640px) {
                    .footer-main { grid-template-columns: 1fr; gap: 32px; }
                }
                .footer-logo {
                    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
                }
                .footer-logo-icon {
                    width: 34px; height: 34px; border-radius: 8px;
                    background: linear-gradient(135deg, #6A38C2, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                }
                .footer-logo-text {
                    font-size: 1.3rem; font-weight: 800; color: white; letter-spacing: -0.5px;
                }
                .footer-logo-text span { color: #a78bfa; }
                .footer-desc {
                    font-size: 0.875rem; line-height: 1.7; color: #94a3b8; max-width: 280px; margin-bottom: 20px;
                }
                .footer-socials { display: flex; gap: 10px; }
                .social-btn {
                    width: 36px; height: 36px; border-radius: 9px;
                    background: #1e293b; border: 1px solid #334155;
                    display: flex; align-items: center; justify-content: center;
                    color: #64748b; text-decoration: none; transition: all 0.2s;
                }
                .social-btn:hover { background: #6A38C2; border-color: #6A38C2; color: white; }
                .footer-col-title {
                    font-size: 0.85rem; font-weight: 700; color: white;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    margin-bottom: 18px;
                }
                .footer-link {
                    display: block;
                    font-size: 0.875rem; color: #94a3b8;
                    text-decoration: none; margin-bottom: 10px;
                    transition: color 0.2s;
                }
                .footer-link:hover { color: #a78bfa; }
                .footer-contact-item {
                    display: flex; align-items: flex-start; gap: 10px;
                    font-size: 0.85rem; color: #94a3b8; margin-bottom: 14px; line-height: 1.5;
                }
                .footer-contact-icon {
                    width: 30px; height: 30px; border-radius: 7px;
                    background: #1e293b; border: 1px solid #334155;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; color: #a78bfa;
                }
                .footer-bottom {
                    border-top: 1px solid #1e293b;
                    padding: 20px 24px;
                }
                .footer-bottom-inner {
                    max-width: 1280px; margin: 0 auto;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 12px;
                }
                .footer-copyright { font-size: 0.8rem; }
                .footer-bottom-links { display: flex; gap: 20px; }
                .footer-bottom-link {
                    font-size: 0.8rem; color: #64748b; text-decoration: none; transition: color 0.2s;
                }
                .footer-bottom-link:hover { color: #a78bfa; }
            `}</style>

            <footer className="footer">
                <div className="footer-main">
                    {/* Brand */}
                    <div>
                        <div className="footer-logo">
                            <div className="footer-logo-icon">
                                <Briefcase size={17} color="white" />
                            </div>
                            <span className="footer-logo-text">Job<span>Quest</span></span>
                        </div>
                        <p className="footer-desc">
                            Pakistan's leading job portal connecting talented professionals with top employers. Find your dream career today.
                        </p>
                        <div className="footer-socials">
                            <a href="https://twitter.com" className="social-btn" aria-label="Twitter"><Twitter size={15} /></a>
                            <a href="https://linkedin.com" className="social-btn" aria-label="LinkedIn"><Linkedin size={15} /></a>
                            <a href="https://github.com" className="social-btn" aria-label="GitHub"><Github size={15} /></a>
                            <a href="https://instagram.com" className="social-btn" aria-label="Instagram"><Instagram size={15} /></a>
                        </div>
                    </div>

                    {/* For Job Seekers */}
                    <div>
                        <div className="footer-col-title">For Seekers</div>
                        <Link to="/jobs" className="footer-link">Browse Jobs</Link>
                        <Link to="/browse" className="footer-link">Browse Companies</Link>
                        <Link to="/profile" className="footer-link">My Profile</Link>
                        <Link to="/login" className="footer-link">Career Resources</Link>
                        <Link to="/login" className="footer-link">Salary Guide</Link>
                    </div>

                    {/* For Recruiters */}
                    <div>
                        <div className="footer-col-title">For Employers</div>
                        <Link to="/admin/companies/create" className="footer-link">Post a Job</Link>
                        <Link to="/admin/companies" className="footer-link">Manage Company</Link>
                        <Link to="/admin/jobs" className="footer-link">Job Listings</Link>
                        <Link to="/signup" className="footer-link">Create Account</Link>
                        <Link to="/login" className="footer-link">Pricing Plans</Link>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="footer-col-title">Contact Us</div>
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon"><MapPin size={13} /></div>
                            <span>Gulberg III, Lahore, Punjab, Pakistan</span>
                        </div>
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon"><Mail size={13} /></div>
                            <span>hello@jobquest.pk</span>
                        </div>
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon"><Phone size={13} /></div>
                            <span>+92 300 1234567</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-inner">
                        <span className="footer-copyright">© 2024 JobQuest. All rights reserved.</span>
                        <div className="footer-bottom-links">
                            <a href="#" className="footer-bottom-link">Privacy Policy</a>
                            <a href="#" className="footer-bottom-link">Terms of Service</a>
                            <a href="#" className="footer-bottom-link">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;