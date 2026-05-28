import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { Search, Edit, Trash2, Eye } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const JobsManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [jobs, searchTerm]);

    const fetchJobs = async () => {
        try {
            const res = await apiClient.get('/admin/jobs');
            setJobs(res.data.jobs || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = () => {
        let filtered = jobs;

        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredJobs(filtered);
    };

    const handleViewJob = (jobId) => {
        const job = jobs.find(j => j._id === jobId);
        if (job) {
            toast.info(`Viewing: ${job.title}\nCompany: ${job.company?.name}\nPositions: ${job.position}`);
        }
    };

    const handleEditJob = (jobId) => {
        toast.info('Edit feature coming soon');
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await apiClient.delete(`/admin/jobs/${jobId}`);
                toast.success('Job deleted successfully');
                fetchJobs();
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Failed to delete job');
            }
        }
    };

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
                        <h1 className='text-4xl font-bold text-gray-900'>Jobs Management</h1>
                        <p className='text-gray-600 mt-2'>Manage all job postings on the platform</p>
                    </motion.div>

                    {/* Filter Section */}
                    <Card className='mb-8 border-0 shadow-md'>
                        <CardContent className='pt-6'>
                            <div className='flex gap-4'>
                                <div className='relative flex-1'>
                                    <Search className='absolute left-3 top-3 text-gray-400' size={20} />
                                    <Input
                                        placeholder='Search by job title or company...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='pl-10'
                                    />
                                </div>
                                <Button onClick={fetchJobs} className='bg-purple-600 hover:bg-purple-700'>
                                    Refresh
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jobs Table */}
                    <Card className='border-0 shadow-md'>
                        <CardHeader>
                            <CardTitle>All Jobs ({filteredJobs.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className='text-center py-8'>Loading jobs...</div>
                            ) : filteredJobs.length === 0 ? (
                                <div className='text-center py-8'>No jobs found</div>
                            ) : (
                                <div className='space-y-4'>
                                    {filteredJobs.map((job) => (
                                        <motion.div
                                            key={job._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className='p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors'
                                        >
                                            <div className='flex items-start justify-between'>
                                                <div className='flex-1'>
                                                    <h3 className='font-bold text-gray-900'>{job.title}</h3>
                                                    <p className='text-sm text-gray-600 mt-1'>{job.company?.name}</p>
                                                    <div className='flex gap-2 mt-2'>
                                                        <Badge className='text-xs'>{job.position} positions</Badge>
                                                        <Badge className={`text-xs ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {job.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2'>
                                                    <Button 
                                                        variant='ghost' 
                                                        size='sm'
                                                        onClick={() => handleViewJob(job._id)}
                                                        title='View job details'
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button 
                                                        variant='ghost' 
                                                        size='sm'
                                                        onClick={() => handleEditJob(job._id)}
                                                        title='Edit job'
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => handleDeleteJob(job._id)}
                                                        className='text-red-600 hover:text-red-700'
                                                        title='Delete job'
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default JobsManagement;
