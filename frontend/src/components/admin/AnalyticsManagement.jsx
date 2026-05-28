import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Briefcase, Building2, ArrowUp } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const AnalyticsManagement = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        totalCompanies: 0,
        totalApplications: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await apiClient.get('/admin/dashboard/stats');
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to fetch analytics data');
        } finally {
            setLoading(false);
        }
    };

    // Mock analytics data
    const platformGrowth = [
        { month: 'Jan', users: 100, jobs: 45, applications: 120 },
        { month: 'Feb', users: 150, jobs: 62, applications: 180 },
        { month: 'Mar', users: 220, jobs: 85, applications: 250 },
        { month: 'Apr', users: 310, jobs: 110, applications: 380 },
        { month: 'May', users: 420, jobs: 145, applications: 520 },
        { month: 'Jun', users: 580, jobs: 180, applications: 720 }
    ];

    const userDistribution = [
        { name: 'Job Seekers', value: Math.floor(stats.totalUsers * 0.7) },
        { name: 'Recruiters', value: Math.floor(stats.totalUsers * 0.3) }
    ];

    const jobStatusData = [
        { name: 'Open', value: Math.floor(stats.totalJobs * 0.6) },
        { name: 'Closed', value: Math.floor(stats.totalJobs * 0.4) }
    ];

    const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${color} rounded-lg p-6 text-white shadow-lg`}
        >
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm opacity-90'>{label}</p>
                    <p className='text-3xl font-bold mt-2'>{value}</p>
                    <p className='text-xs mt-2 opacity-75 flex items-center gap-1'>
                        <ArrowUp size={14} /> Up from last month
                    </p>
                </div>
                <Icon size={32} className='opacity-20' />
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className='flex h-screen'>
                <AdminDashboardSidebar />
                <div className='flex-1 flex flex-col ml-64'>
                    <AdminNavbar />
                    <div className='flex-1 flex items-center justify-center'>
                        <p className='text-gray-500'>Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
            <AdminDashboardSidebar />

            <div className='flex-1 flex flex-col ml-64'>
                <AdminNavbar />

                <div className='flex-1 overflow-auto p-8'>
                    <div className='max-w-7xl mx-auto'>
                        {/* Header */}
                        <div className='mb-8'>
                            <h1 className='text-3xl font-bold text-slate-900'>Analytics & Insights</h1>
                            <p className='text-slate-600'>Platform performance and growth metrics</p>
                        </div>

                        {/* KPI Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                            <StatCard icon={Users} label='Total Users' value={stats.totalUsers} color='bg-gradient-to-br from-purple-600 to-purple-700' />
                            <StatCard icon={Briefcase} label='Active Jobs' value={stats.totalJobs} color='bg-gradient-to-br from-pink-600 to-pink-700' />
                            <StatCard icon={Building2} label='Companies' value={stats.totalCompanies} color='bg-gradient-to-br from-green-600 to-green-700' />
                            <StatCard icon={TrendingUp} label='Applications' value={stats.totalApplications} color='bg-gradient-to-br from-orange-600 to-orange-700' />
                        </div>

                        {/* Charts */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                            {/* Platform Growth Chart */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className='shadow-lg'>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <TrendingUp size={20} />
                                            Platform Growth (6 Months)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width='100%' height={300}>
                                            <LineChart data={platformGrowth}>
                                                <CartesianGrid strokeDasharray='3 3' />
                                                <XAxis dataKey='month' />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type='monotone' dataKey='users' stroke='#8b5cf6' strokeWidth={2} />
                                                <Line type='monotone' dataKey='jobs' stroke='#ec4899' strokeWidth={2} />
                                                <Line type='monotone' dataKey='applications' stroke='#f97316' strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* User Distribution */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <Card className='shadow-lg'>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <Users size={20} />
                                            User Distribution
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width='100%' height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={userDistribution}
                                                    cx='50%'
                                                    cy='50%'
                                                    labelLine={false}
                                                    label={({ name, value }) => `${name}: ${value}`}
                                                    outerRadius={80}
                                                    fill='#8b5cf6'
                                                    dataKey='value'
                                                >
                                                    {userDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Job Status & Company Distribution */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            {/* Job Status */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <Card className='shadow-lg'>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <Briefcase size={20} />
                                            Job Status Distribution
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width='100%' height={300}>
                                            <BarChart data={jobStatusData}>
                                                <CartesianGrid strokeDasharray='3 3' />
                                                <XAxis dataKey='name' />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey='value' fill='#8b5cf6' />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Conversion Rate */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <Card className='shadow-lg'>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <TrendingUp size={20} />
                                            Key Metrics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='space-y-4'>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-gray-700'>Application Success Rate</span>
                                                <span className='text-2xl font-bold text-purple-600'>
                                                    {stats.totalApplications > 0 ? Math.round((stats.totalApplications / (stats.totalJobs * 5)) * 100) : 0}%
                                                </span>
                                            </div>
                                            <div className='w-full bg-gray-200 rounded-full h-2'>
                                                <div
                                                    className='bg-purple-600 h-2 rounded-full'
                                                    style={{
                                                        width: `${stats.totalApplications > 0 ? Math.round((stats.totalApplications / (stats.totalJobs * 5)) * 100) : 0}%`
                                                    }}
                                                />
                                            </div>

                                            <div className='mt-6 flex justify-between items-center'>
                                                <span className='text-gray-700'>Jobs to Users Ratio</span>
                                                <span className='text-2xl font-bold text-pink-600'>
                                                    {stats.totalUsers > 0 ? (stats.totalJobs / stats.totalUsers).toFixed(2) : 0}x
                                                </span>
                                            </div>
                                            <div className='text-sm text-gray-500 mt-4'>
                                                <p>👥 Total Active Users: {stats.totalUsers}</p>
                                                <p>💼 Total Job Listings: {stats.totalJobs}</p>
                                                <p>🏢 Total Companies: {stats.totalCompanies}</p>
                                                <p>📝 Total Applications: {stats.totalApplications}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsManagement;
