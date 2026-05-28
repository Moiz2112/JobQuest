import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, Briefcase, Building2, FileText, AlertCircle, TrendingUp, Eye, UserX } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { Skeleton } from '../ui/skeleton'

const AdminPlatformDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRecruiters: 0,
        totalJobs: 0,
        totalCompanies: 0,
        totalApplications: 0,
        activeJobs: 0,
        pendingVerifications: 0,
        reportedContent: 0
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch all platform statistics
            const [usersRes, jobsRes, companiesRes, applicationsRes] = await Promise.all([
                apiClient.get('/admin/users'),
                apiClient.get('/admin/jobs'),
                apiClient.get('/admin/companies'),
                apiClient.get('/admin/applications')
            ]);

            const users = usersRes.data.users || [];
            const jobs = jobsRes.data.jobs || [];
            const companies = companiesRes.data.companies || [];
            const applications = applicationsRes.data.applications || [];

            const jobSeekers = users.filter(u => u.role === 'student').length;
            const recruiters = users.filter(u => u.role === 'recruiter').length;
            const activeJobs = jobs.filter(j => j.isActive === true).length;

            setStats({
                totalUsers: users.length,
                totalRecruiters: recruiters,
                totalJobs: jobs.length,
                totalCompanies: companies.length,
                totalApplications: applications.length,
                activeJobs: activeJobs,
                pendingVerifications: companies.filter(c => c.status === 'pending').length,
                reportedContent: 0
            });

            // Generate chart data
            const monthlyData = generateMonthlyData();
            setChartData(monthlyData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateMonthlyData = () => {
        return [
            { month: 'Jan', users: 400, jobs: 240, applications: 540 },
            { month: 'Feb', users: 300, jobs: 221, applications: 500 },
            { month: 'Mar', users: 200, jobs: 229, applications: 700 },
            { month: 'Apr', users: 278, jobs: 200, applications: 900 },
            { month: 'May', users: 189, jobs: 229, applications: 1200 },
            { month: 'Jun', users: 239, jobs: 200, applications: 1500 },
        ];
    };

    const StatCard = ({ icon: Icon, label, value, bgColor, textColor }) => (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className='border-0 shadow-md hover:shadow-lg transition-all'>
                <CardContent className='pt-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600 font-medium'>{label}</p>
                            <p className={`text-3xl font-bold mt-2 ${textColor}`}>
                                {loading ? <Skeleton className='h-8 w-16' /> : value}
                            </p>
                        </div>
                        <div className={`${bgColor} bg-opacity-10 p-4 rounded-lg`}>
                            <Icon className={`w-8 h-8 ${textColor}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className='min-h-screen bg-gray-50'>
            <AdminNavbar />
            <div className='flex pt-20'>
                <AdminDashboardSidebar />

                {/* Main Content */}
                <div className='flex-1 p-8 lg:ml-64'>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8'
                    >
                        <h1 className='text-4xl font-bold text-gray-900'>Platform Dashboard</h1>
                        <p className='text-gray-600 mt-2'>Manage and monitor the entire JobQuest platform</p>
                    </motion.div>

                    {/* Stat Cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
                    >
                        <StatCard
                            icon={Users}
                            label='Total Users'
                            value={stats.totalUsers}
                            bgColor='bg-blue-600'
                            textColor='text-blue-600'
                        />
                        <StatCard
                            icon={Briefcase}
                            label='Active Jobs'
                            value={stats.activeJobs}
                            bgColor='bg-purple-600'
                            textColor='text-purple-600'
                        />
                        <StatCard
                            icon={Building2}
                            label='Total Companies'
                            value={stats.totalCompanies}
                            bgColor='bg-green-600'
                            textColor='text-green-600'
                        />
                        <StatCard
                            icon={FileText}
                            label='Total Applications'
                            value={stats.totalApplications}
                            bgColor='bg-orange-600'
                            textColor='text-orange-600'
                        />
                    </motion.div>

                    {/* Charts */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'
                    >
                        {/* Line Chart */}
                        <Card className='lg:col-span-2 border-0 shadow-md'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <TrendingUp size={20} className='text-blue-600' />
                                    Platform Growth
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis dataKey='month' />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type='monotone' dataKey='users' stroke='#3b82f6' strokeWidth={2} />
                                        <Line type='monotone' dataKey='jobs' stroke='#a855f7' strokeWidth={2} />
                                        <Line type='monotone' dataKey='applications' stroke='#f97316' strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* User Distribution */}
                        <Card className='border-0 shadow-md'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Users size={20} className='text-purple-600' />
                                    User Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Job Seekers', value: stats.totalUsers - stats.totalRecruiters },
                                                { name: 'Recruiters', value: stats.totalRecruiters }
                                            ]}
                                            cx='50%'
                                            cy='50%'
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill='#8884d8'
                                            dataKey='value'
                                        >
                                            <Cell fill='#3b82f6' />
                                            <Cell fill='#a855f7' />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Alert Cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='grid grid-cols-1 md:grid-cols-3 gap-6'
                    >
                        <Card className='border-l-4 border-l-yellow-500 border-0 shadow-md bg-yellow-50/50'>
                            <CardContent className='pt-6'>
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-600'>Pending Verifications</p>
                                        <p className='text-2xl font-bold text-yellow-600 mt-2'>{stats.pendingVerifications}</p>
                                    </div>
                                    <AlertCircle className='w-8 h-8 text-yellow-600 opacity-50' />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className='border-l-4 border-l-red-500 border-0 shadow-md bg-red-50/50'>
                            <CardContent className='pt-6'>
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-600'>Reported Content</p>
                                        <p className='text-2xl font-bold text-red-600 mt-2'>{stats.reportedContent}</p>
                                    </div>
                                    <AlertCircle className='w-8 h-8 text-red-600 opacity-50' />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className='border-l-4 border-l-blue-500 border-0 shadow-md bg-blue-50/50'>
                            <CardContent className='pt-6'>
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-600'>Active Sessions</p>
                                        <p className='text-2xl font-bold text-blue-600 mt-2'>
                                            {loading ? <Skeleton className='h-8 w-12' /> : Math.floor(stats.totalUsers * 0.3)}
                                        </p>
                                    </div>
                                    <Eye className='w-8 h-8 text-blue-600 opacity-50' />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminPlatformDashboard;
