import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react'
import { useSelector } from 'react-redux'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import apiClient from '@/utils/apiClient'
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant'
import { motion } from 'framer-motion'
import Footer from '../shared/Footer'

const AdminDashboard = () => {
    useGetAllAdminJobs();
    const { allAdminJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        applicationStats: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const jobsRes = await apiClient.get(`${JOB_API_END_POINT}/admin/jobs`);
                if (jobsRes.data.success) {
                    const jobs = jobsRes.data.jobs;
                    const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
                    const applicationStats = jobs.reduce((acc, job) => {
                        acc[job.title] = job.applicationCount || 0;
                        return acc;
                    }, {});

                    setStats({
                        totalJobs: jobs.length,
                        activeJobs: jobs.filter(j => j.isActive !== false).length,
                        totalApplications,
                        applicationStats
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Chart data
    const jobsData = Object.entries(stats.applicationStats).map(([title, count]) => ({
        name: title.substring(0, 15) + (title.length > 15 ? '...' : ''),
        applications: count,
        fullName: title
    }));

    const statusData = [
        { name: 'Active', value: stats.activeJobs, color: '#7c3aed' },
        { name: 'Inactive', value: stats.totalJobs - stats.activeJobs, color: '#cbd5e1' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
       
        <div className='min-h-screen bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-transparent'>
            <Navbar />
            
           <div className='max-w-7xl mx-auto px-4' style={{ paddingTop: '7.5rem' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className='space-y-8'
                >
                    {/* Header */}
                    <motion.div variants={itemVariants}>
                        <div className='mb-2'>
                            <h1 className='text-4xl font-bold text-gray-900'>Dashboard</h1>
                            <p className='text-gray-600 text-sm mt-1'>Welcome back, {user?.fullname}</p>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {/* Total Jobs Card */}
                        <motion.div variants={itemVariants}>
                            <Card className='border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-100/60 to-blue-50/40'>
                                <CardContent className='pt-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-gray-600 text-sm font-medium'>Total Jobs</p>
                                            <p className='text-4xl font-bold text-purple-600 mt-2'>{stats.totalJobs}</p>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className='bg-purple-100 p-3 rounded-lg'
                                        >
                                            <Briefcase className='text-purple-600' size={28} />
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Active Jobs Card */}
                        <motion.div variants={itemVariants}>
                            <Card className='border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-100/60 to-blue-50/40'>
                                <CardContent className='pt-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-gray-600 text-sm font-medium'>Active Jobs</p>
                                            <p className='text-4xl font-bold text-blue-600 mt-2'>{stats.activeJobs}</p>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className='bg-blue-100 p-3 rounded-lg'
                                        >
                                            <TrendingUp className='text-blue-600' size={28} />
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Total Applications Card */}
                        <motion.div variants={itemVariants}>
                            <Card className='border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-100/60 to-blue-50/40'>
                                <CardContent className='pt-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-gray-600 text-sm font-medium'>Applications</p>
                                            <p className='text-4xl font-bold text-teal-600 mt-2'>{stats.totalApplications}</p>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className='bg-teal-100 p-3 rounded-lg'
                                        >
                                            <FileText className='text-teal-600' size={28} />
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Conversion Rate Card */}
                        <motion.div variants={itemVariants}>
                            <Card className='border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-100/60 to-blue-50/40'>
                                <CardContent className='pt-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-gray-600 text-sm font-medium'>Avg Rate</p>
                                            <p className='text-4xl font-bold text-orange-600 mt-2'>
                                                {stats.totalJobs > 0 ? Math.round(stats.totalApplications / stats.totalJobs) : 0}
                                            </p>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className='bg-orange-100 p-3 rounded-lg'
                                        >
                                            <Users className='text-orange-600' size={28} />
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Charts */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {/* Bar Chart - Applications per Job */}
                        <motion.div variants={itemVariants}>
                            <Card className='border-0 shadow-md bg-gradient-to-br from-blue-100/60 to-blue-50/40'>
                                <CardHeader>
                                    <CardTitle>Applications by Job</CardTitle>
                                    <CardDescription>Application count for each job posting</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {jobsData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={jobsData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="applications" fill="#7c3aed" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className='h-64 flex items-center justify-center text-gray-500'>
                                            No data available
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pie Chart - Job Status */}
                        <motion.div variants={itemVariants}>
                            <Card className='border-0 shadow-md bg-gradient-to-br from-blue-100/60 to-blue-50/40'>
                                <CardHeader>
                                    <CardTitle>Job Status</CardTitle>
                                    <CardDescription>Active vs Inactive job postings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {stats.totalJobs > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry) => `${entry.name}: ${entry.value}`}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className='h-64 flex items-center justify-center text-gray-500'>
                                            No data available
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Recent Jobs List */}
                    <motion.div variants={itemVariants}>
                        <Card className='border-0 shadow-md bg-gradient-to-br from-blue-100/60 to-blue-50/40' style={{ marginBottom: '40px' }}>
                            <CardHeader>
                                <CardTitle>Recent Job Postings</CardTitle>
                                <CardDescription>Your latest job postings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    {allAdminJobs.length > 0 ? (
                                        allAdminJobs.slice(0, 5).map((job, index) => (
                                            <motion.div
                                                key={job._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                                            >
                                                <div className='flex-1'>
                                                    <p className='font-semibold text-gray-900'>{job.title}</p>
                                                    <p className='text-sm text-gray-600'>{job.company?.name}</p>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='text-lg font-bold text-purple-600'>{job.applicationCount || 0}</p>
                                                    <p className='text-xs text-gray-500'>Applications</p>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className='text-gray-500 text-center py-8'>No job postings yet</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminDashboard
