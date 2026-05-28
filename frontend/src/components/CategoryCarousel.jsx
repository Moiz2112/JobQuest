import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Code2, Database, Palette, Globe, BarChart3, Shield, Smartphone, Cloud } from 'lucide-react';

const categories = [
    { name: "Frontend Developer", icon: <Code2 size={20} />, color: '#6A38C2', bg: '#f5f3ff' },
    { name: "Backend Developer", icon: <Database size={20} />, color: '#3b82f6', bg: '#eff6ff' },
    { name: "Data Science", icon: <BarChart3 size={20} />, color: '#22c55e', bg: '#f0fdf4' },
    { name: "Graphic Designer", icon: <Palette size={20} />, color: '#f59e0b', bg: '#fffbeb' },
    { name: "FullStack Developer", icon: <Globe size={20} />, color: '#8b5cf6', bg: '#fdf4ff' },
    { name: "Cybersecurity", icon: <Shield size={20} />, color: '#ef4444', bg: '#fff1f2' },
    { name: "Mobile Developer", icon: <Smartphone size={20} />, color: '#14b8a6', bg: '#f0fdfa' },
    { name: "Cloud Engineer", icon: <Cloud size={20} />, color: '#0ea5e9', bg: '#f0f9ff' },
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .cat-section {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: 60px 24px;
                    background: white;
                    border-top: 1px solid #f1f5f9;
                    border-bottom: 1px solid #f1f5f9;
                }
                .cat-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .cat-eyebrow {
                    display: inline-block;
                    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
                    color: #6A38C2;
                    font-size: 0.78rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 5px 14px;
                    border-radius: 100px;
                    margin-bottom: 12px;
                    border: 1px solid #ddd6fe;
                }
                .cat-title {
                    font-size: clamp(1.6rem, 3vw, 2.2rem);
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.5px;
                    margin: 0;
                }
                .cat-subtitle {
                    color: #64748b;
                    margin: 8px 0 0;
                    font-size: 0.95rem;
                }
                .cat-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 24px 16px;
                    border-radius: 16px;
                    border: 1.5px solid #f1f5f9;
                    background: white;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    text-align: center;
                    min-height: 110px;
                    user-select: none;
                }
                .cat-card:hover {
                    border-color: transparent;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(106,56,194,0.16);
                }
                .cat-icon-wrap {
                    width: 44px; height: 44px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.2s;
                }
                .cat-card:hover .cat-icon-wrap {
                    transform: scale(1.1);
                }
                .cat-name {
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #374151;
                    line-height: 1.3;
                }
                .cat-card:hover .cat-name {
                    color: #6A38C2;
                }
            `}</style>

            <section className="cat-section">
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="cat-header">
                        <div className="cat-eyebrow">Browse Categories</div>
                        <h2 className="cat-title">Explore Job <span style={{ background: 'linear-gradient(135deg, #6A38C2, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Categories</span></h2>
                        <p className="cat-subtitle">Discover opportunities across all industries</p>
                    </div>

                    <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                        <CarouselContent className="-ml-3">
                            {categories.map((cat, index) => (
                                <CarouselItem key={index} className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                                    <div
                                        className="cat-card"
                                        onClick={() => searchJobHandler(cat.name)}
                                        style={{ '--hover-border': cat.color }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = cat.color + '33';
                                            e.currentTarget.style.background = cat.bg;
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = '#f1f5f9';
                                            e.currentTarget.style.background = 'white';
                                        }}
                                    >
                                        <div className="cat-icon-wrap" style={{ background: cat.bg, color: cat.color }}>
                                            {cat.icon}
                                        </div>
                                        <span className="cat-name">{cat.name}</span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '28px' }}>
                            <CarouselPrevious style={{ position: 'relative', top: 'unset', left: 'unset', right: 'unset', transform: 'none', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
                            <CarouselNext style={{ position: 'relative', top: 'unset', left: 'unset', right: 'unset', transform: 'none', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
                        </div>
                    </Carousel>
                </div>
            </section>
        </>
    );
};

export default CategoryCarousel;