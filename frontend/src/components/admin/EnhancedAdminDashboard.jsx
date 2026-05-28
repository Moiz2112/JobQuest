import React, { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Briefcase, Users, FileText, TrendingUp, Plus, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { JOB_API_END_POINT, COMPANY_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'

const EnhancedAdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalCompanies: 0,
        avgApplicationsPerJob: 0
    });

    const [chartData, setChartData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch jobs
            const jobsRes = await apiClient.get(`${JOB_API_END_POINT}/admin/jobs`);
            const jobs = jobsRes.data.jobs || [];

            // Fetch companies
            const companiesRes = await apiClient.get(`${COMPANY_API_END_POINT}/get`);
            const companies = companiesRes.data.companies || [];

            // Calculate stats
            const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
            const activeJobs = jobs.filter(job => job.isActive !== false).length;
            const avgApplicationsPerJob = jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0;

            setStats({
                totalJobs: jobs.length,
                activeJobs: activeJobs,
                totalApplications: totalApplications,
                totalCompanies: companies.length,
                avgApplicationsPerJob: avgApplicationsPerJob
            });

            // Prepare chart data
            const chartDataFormatted = jobs.slice(0, 8).map(job => ({
                name: job.title.substring(0, 12) + '...',
                applications: job.applicationCount || 0
            }));
            setChartData(chartDataFormatted);

            // Prepare status data
            setStatusData([
                { name: 'Active', value: activeJobs, color: '#22C55E' },
                { name: 'Inactive', value: jobs.length - activeJobs, color: '#EF4444' }
            ]);

            // Get recent jobs
            const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRecentJobs(sortedJobs.slice(0, 5));

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.message || 'Failed to load dashboard data');
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className='h-full'
        >
            <Card className={`${bgColor} border-0 shadow-md hover:shadow-lg transition-all`}>
                <CardContent className='pt-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600 font-medium'>{label}</p>
                            <p className={`text-3xl font-bold mt-2 ${color}`}>{loading ? <Skeleton className='h-8 w-16' /> : value}</p>
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
                        <h1 className='text-4xl font-bold text-gray-900 mb-2'>Admin Dashboard</h1>
                        <p className='text-gray-600'>Welcome back! Here's your overview of the job portal.</p>
                    </motion.div>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'
                        >
                            <AlertCircle className='text-red-600' size={20} />
                            <p className='text-red-700 font-medium'>{error}</p>
                            <Button onClick={fetchDashboardData} variant='outline' className='ml-auto' size='sm'>
                                Retry
                            </Button>
                        </motion.div>
                    )}

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'
                    >
                        <StatCard
                            icon={Briefcase}
                            label='Total Jobs'
                            value={stats.totalJobs}
                            color='text-purple-600'
                            bgColor='bg-purple-50/50'
                        />
                        <StatCard
                            icon={CheckCircle}
                            label='Active Jobs'
                            value={stats.activeJobs}
                            color='text-green-600'
                            bgColor='bg-green-50/50'
                        />
                        <StatCard
                            icon={FileText}
                            label='Applications'
                            value={stats.totalApplications}
                            color='text-blue-600'
                            bgColor='bg-blue-50/50'
                        />
                        <StatCard
                            icon={Users}
                            label='Companies'
                            value={stats.totalCompanies}
                            color='text-orange-600'
                            bgColor='bg-orange-50/50'
                        />
                        <StatCard
                            icon={TrendingUp}
                            label='Avg Apps/Job'
                            value={stats.avgApplicationsPerJob}
                            color='text-pink-600'
                            bgColor='bg-pink-50/50'
                        />
                    </motion.div>

                    {/* Charts Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'
                    >
                        {/* Applications Chart */}
                        <Card className='lg:col-span-2 border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <BarChart size={20} className='text-purple-600' />
                                    Applications by Job
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className='h-64 w-full' />
                                ) : (
                                    <ResponsiveContainer width='100%' height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                                            <XAxis dataKey='name' fontSize={12} />
                                            <YAxis fontSize={12} />
                                            <Tooltip />
                                            <Bar dataKey='applications' fill='#7C3AED' radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Pie Chart */}
                        <Card className='border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <PieChart size={20} className='text-blue-600' />
                                    Job Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className='h-64 w-full' />
                                ) : (
                                    <ResponsiveContainer width='100%' height={250}>
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx='50%'
                                                cy='50%'
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey='value'
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                                <div className='mt-4 space-y-2 text-sm'>
                                    {statusData.map((item) => (
                                        <div key={item.name} className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <div
                                                    className='w-3 h-3 rounded-full'
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className='text-gray-600'>{item.name}</span>
                                            </div>
                                            <span className='font-semibold text-gray-900'>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Jobs & Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='grid grid-cols-1 lg:grid-cols-3 gap-6'
                    >
                        {/* Recent Jobs */}
                        <Card className='lg:col-span-2 border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                            <CardHeader>
                                <div className='flex items-center justify-between'>
                                    <CardTitle>Recent Job Postings</CardTitle>
                                    <Button
                                        onClick={() => navigate('/admin/jobs')}
                                        variant='ghost'
                                        size='sm'
                                        className='text-purple-600 hover:text-purple-700'
                                    >
                                        View All <ArrowRight size={16} className='ml-2' />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    {loading ? (
                                        Array(3).fill(0).map((_, i) => <Skeleton key={i} className='h-16 w-full' />)
                                    ) : recentJobs.length > 0 ? (
                                        recentJobs.map((job) => (
                                            <motion.div
                                                key={job._id}
                                                whileHover={{ x: 5 }}
                                                className='p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-all cursor-pointer border border-blue-100/50'
                                                onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                                            >
                                                <div className='flex items-start justify-between'>
                                                    <div>
                                                        <p className='font-semibold text-gray-900'>{job.title}</p>
                                                        <p className='text-xs text-gray-600 mt-1'>{job.company?.name} • {job.location}</p>
                                                    </div>
                                                    <div className='text-right'>
                                                        <p className='text-sm font-bold text-purple-600'>{job.applicationCount || 0}</p>
                                                        <p className='text-xs text-gray-500'>Applications</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className='text-gray-500 text-center py-8'>No jobs posted yet</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className='border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    <motion.div whileHover={{ scale: 1.02 }}>
                                        <Button
                                            onClick={() => navigate('/admin/jobs/create')}
                                            className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                                        >
                                            <Plus size={18} className='mr-2' />
                                            Post New Job
                                        </Button>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.02 }}>
                                        <Button
                                            onClick={() => navigate('/admin/companies/create')}
                                            className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                                        >
                                            <Plus size={18} className='mr-2' />
                                            Add Company
                                        </Button>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.02 }}>
                                        <Button
                                            onClick={() => navigate('/admin/jobs')}
                                            variant='outline'
                                            className='w-full border-purple-200 text-purple-600 hover:bg-purple-50'
                                        >
                                            <Briefcase size={18} className='mr-2' />
                                            Manage Jobs
                                        </Button>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.02 }}>
                                        <Button
                                            onClick={() => navigate('/admin/companies')}
                                            variant='outline'
                                            className='w-full border-blue-200 text-blue-600 hover:bg-blue-50'
                                        >
                                            <Users size={18} className='mr-2' />
                                            Manage Companies
                                        </Button>
                                    </motion.div>

                                    <div className='pt-3 border-t border-gray-200'>
                                        <Button
                                            onClick={fetchDashboardData}
                                            variant='ghost'
                                            className='w-full text-gray-600 hover:text-gray-700'
                                            size='sm'
                                        >
                                            Refresh Data
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default EnhancedAdminDashboard
