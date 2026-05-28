import React, { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, Calendar, Filter, Download, ArrowUp, ArrowDown } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { JOB_API_END_POINT } from '@/utils/constant'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'

const AnalyticsPage = () => {
    const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, 90days
    const [analyticsData, setAnalyticsData] = useState([]);
    const [jobTrends, setJobTrends] = useState([]);
    const [applicationTrends, setApplicationTrends] = useState([]);
    const [topPerformers, setTopPerformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await apiClient.get(`${JOB_API_END_POINT}/admin/jobs`);
            const jobs = res.data.jobs || [];

            // Generate analytics data based on time range
            const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
            const data = generateTimeSeriesData(jobs, days);
            setAnalyticsData(data);

            // Job trends
            const trends = generateJobTrends(jobs);
            setJobTrends(trends);

            // Application trends
            const appTrends = generateApplicationTrends(jobs, days);
            setApplicationTrends(appTrends);

            // Top performers
            const top = jobs
                .sort((a, b) => (b.applicationCount || 0) - (a.applicationCount || 0))
                .slice(0, 5);
            setTopPerformers(top);

        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data');
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const generateTimeSeriesData = (jobs, days) => {
        const data = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const jobsOnDate = jobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return jobDate.toDateString() === date.toDateString();
            });

            const totalApps = jobsOnDate.reduce((sum, job) => sum + (job.applicationCount || 0), 0);

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                jobs: jobsOnDate.length,
                applications: totalApps,
                postings: jobsOnDate.length
            });
        }

        return data;
    };

    const generateJobTrends = (jobs) => {
        const categories = {};
        jobs.forEach(job => {
            const category = job.category || 'Other';
            categories[category] = (categories[category] || 0) + 1;
        });

        return Object.entries(categories).map(([name, value]) => ({
            name,
            value,
            color: ['#7C3AED', '#0F172A', '#EC4899', '#22C55E', '#F59E0B'][Math.floor(Math.random() * 5)]
        }));
    };

    const generateApplicationTrends = (jobs, days) => {
        const data = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i -= Math.ceil(days / 8)) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const totalApps = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
            
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                applications: Math.round(totalApps * (0.5 + Math.random()))
            });
        }

        return data;
    };

    const MetricCard = ({ label, value, change, icon: Icon, color }) => (
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className='border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                <CardContent className='pt-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600 font-medium'>{label}</p>
                            <p className='text-2xl font-bold text-gray-900 mt-2'>{loading ? <Skeleton className='h-6 w-20' /> : value}</p>
                            {change !== undefined && (
                                <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                    {Math.abs(change)}% vs last period
                                </div>
                            )}
                        </div>
                        <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>
                            <Icon size={24} className={color} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <>
            <AdminSidebar />
            <Navbar />
            <div className='min-h-screen bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-transparent pt-24 lg:ml-64'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20'>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8'
                    >
                        <div className='flex items-center justify-between'>
                            <div>
                                <h1 className='text-4xl font-bold text-gray-900 mb-2'>Analytics & Insights</h1>
                                <p className='text-gray-600'>Track your job portal performance and trends</p>
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    variant={timeRange === '7days' ? 'default' : 'outline'}
                                    onClick={() => setTimeRange('7days')}
                                    size='sm'
                                >
                                    7 Days
                                </Button>
                                <Button
                                    variant={timeRange === '30days' ? 'default' : 'outline'}
                                    onClick={() => setTimeRange('30days')}
                                    size='sm'
                                >
                                    30 Days
                                </Button>
                                <Button
                                    variant={timeRange === '90days' ? 'default' : 'outline'}
                                    onClick={() => setTimeRange('90days')}
                                    size='sm'
                                >
                                    90 Days
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Key Metrics */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'
                    >
                        <MetricCard
                            label='Total Applications'
                            value={analyticsData.reduce((sum, d) => sum + d.applications, 0)}
                            change={12}
                            icon={TrendingUp}
                            color='text-purple-600'
                        />
                        <MetricCard
                            label='Jobs Posted'
                            value={analyticsData.reduce((sum, d) => sum + d.postings, 0)}
                            change={8}
                            icon={Calendar}
                            color='text-blue-600'
                        />
                        <MetricCard
                            label='Avg Applications'
                            value={Math.round(analyticsData.reduce((sum, d) => sum + d.applications, 0) / (analyticsData.reduce((sum, d) => sum + d.postings, 0) || 1))}
                            change={5}
                            icon={TrendingUp}
                            color='text-green-600'
                        />
                        <MetricCard
                            label='Top Category'
                            value={topPerformers.length > 0 ? topPerformers[0].category : 'N/A'}
                            icon={Filter}
                            color='text-orange-600'
                        />
                    </motion.div>

                    {/* Charts */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='space-y-6'
                    >
                        {/* Timeline Chart */}
                        <Card className='border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <TrendingUp size={20} className='text-purple-600' />
                                    Activity Timeline
                                </CardTitle>
                                <CardDescription>Jobs posted and applications received over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className='h-72 w-full' />
                                ) : (
                                    <ResponsiveContainer width='100%' height={300}>
                                        <AreaChart data={analyticsData}>
                                            <defs>
                                                <linearGradient id='colorApplications' x1='0' y1='0' x2='0' y2='1'>
                                                    <stop offset='5%' stopColor='#7C3AED' stopOpacity={0.8} />
                                                    <stop offset='95%' stopColor='#7C3AED' stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                                            <XAxis dataKey='date' fontSize={12} />
                                            <YAxis fontSize={12} />
                                            <Tooltip />
                                            <Area
                                                type='monotone'
                                                dataKey='applications'
                                                stroke='#7C3AED'
                                                fillOpacity={1}
                                                fill='url(#colorApplications)'
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Job Trends and Top Performers */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            {/* Category Distribution */}
                            <Card className='border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                                <CardHeader>
                                    <CardTitle>Jobs by Category</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <Skeleton className='h-64 w-full' />
                                    ) : (
                                        <div className='space-y-3'>
                                            {jobTrends.map((item) => (
                                                <div key={item.name} className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-3 flex-1'>
                                                        <div
                                                            className='w-3 h-3 rounded-full'
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span className='text-gray-700'>{item.name}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                                                            <div
                                                                className='h-full transition-all'
                                                                style={{
                                                                    width: `${(item.value / Math.max(...jobTrends.map(t => t.value))) * 100}%`,
                                                                    backgroundColor: item.color
                                                                }}
                                                            />
                                                        </div>
                                                        <span className='font-bold text-gray-900 w-8 text-right'>{item.value}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Top Performers */}
                            <Card className='border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                                <CardHeader>
                                    <CardTitle>Top Performing Jobs</CardTitle>
                                    <CardDescription>Jobs with most applications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-3'>
                                        {loading ? (
                                            Array(3).fill(0).map((_, i) => <Skeleton key={i} className='h-12 w-full' />)
                                        ) : topPerformers.length > 0 ? (
                                            topPerformers.map((job, index) => (
                                                <motion.div
                                                    key={job._id}
                                                    whileHover={{ x: 5 }}
                                                    className='p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100/50'
                                                >
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold'>
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <p className='font-semibold text-gray-900'>{job.title}</p>
                                                                <p className='text-xs text-gray-600'>{job.location}</p>
                                                            </div>
                                                        </div>
                                                        <div className='text-right'>
                                                            <p className='text-sm font-bold text-purple-600'>{job.applicationCount || 0}</p>
                                                            <p className='text-xs text-gray-500'>Applications</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <p className='text-gray-500 text-center py-8'>No data available</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AnalyticsPage
