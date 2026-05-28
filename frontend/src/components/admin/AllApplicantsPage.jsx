import React, { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal, Download, Check, X, Search, Filter, Mail, Phone, Users } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'

const AllApplicantsPage = () => {
    const [applicants, setApplicants] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllApplicants();
    }, []);

    useEffect(() => {
        filterApplicants();
    }, [searchTerm, statusFilter, applicants]);

    const fetchAllApplicants = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all jobs
            const jobsRes = await apiClient.get(`${JOB_API_END_POINT}/admin/jobs`);
            const jobs = jobsRes.data.jobs || [];

            // Fetch applicants for each job
            const allApplicants = [];
            for (const job of jobs) {
                try {
                    const appRes = await apiClient.get(`${APPLICATION_API_END_POINT}/${job._id}/applicants`);
                    const applications = appRes.data.applications || [];
                    
                    applications.forEach(app => {
                        allApplicants.push({
                            ...app,
                            jobTitle: job.title,
                            jobId: job._id,
                            company: job.company?.name || 'Unknown'
                        });
                    });
                } catch (err) {
                    console.log(`Failed to fetch applicants for job ${job._id}`);
                }
            }

            setApplicants(allApplicants);
        } catch (err) {
            console.error('Error fetching applicants:', err);
            setError('Failed to load applicants');
            toast.error('Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    const filterApplicants = () => {
        let filtered = [...applicants];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.applicant?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status?.toLowerCase() === statusFilter.toLowerCase());
        }

        setFilteredApplicants(filtered);
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const res = await apiClient.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status: newStatus });
            if (res.data.success) {
                toast.success(`Application ${newStatus.toLowerCase()}`);
                // Update local state
                setApplicants(prev =>
                    prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
                );
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return 'bg-green-100/80 text-green-700';
            case 'rejected':
                return 'bg-red-100/80 text-red-700';
            default:
                return 'bg-yellow-100/80 text-yellow-700';
        }
    };

    const stats = {
        total: applicants.length,
        accepted: applicants.filter(a => a.status?.toLowerCase() === 'accepted').length,
        pending: applicants.filter(a => !a.status || a.status?.toLowerCase() === 'pending').length,
        rejected: applicants.filter(a => a.status?.toLowerCase() === 'rejected').length
    };

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
                        <h1 className='text-4xl font-bold text-gray-900 mb-2'>All Applicants</h1>
                        <p className='text-gray-600'>Manage and review all applications across all job postings</p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                        className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'
                    >
                        <Card className='bg-blue-50/50 border-0 shadow-md'>
                            <CardContent className='pt-6'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm text-gray-600'>Total Applications</p>
                                        <p className='text-3xl font-bold text-blue-600 mt-2'>{stats.total}</p>
                                    </div>
                                    <Users size={24} className='text-blue-600' />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className='bg-green-50/50 border-0 shadow-md'>
                            <CardContent className='pt-6'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm text-gray-600'>Accepted</p>
                                        <p className='text-3xl font-bold text-green-600 mt-2'>{stats.accepted}</p>
                                    </div>
                                    <Check size={24} className='text-green-600' />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className='bg-yellow-50/50 border-0 shadow-md'>
                            <CardContent className='pt-6'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm text-gray-600'>Pending</p>
                                        <p className='text-3xl font-bold text-yellow-600 mt-2'>{stats.pending}</p>
                                    </div>
                                    <Filter size={24} className='text-yellow-600' />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className='bg-red-50/50 border-0 shadow-md'>
                            <CardContent className='pt-6'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm text-gray-600'>Rejected</p>
                                        <p className='text-3xl font-bold text-red-600 mt-2'>{stats.rejected}</p>
                                    </div>
                                    <X size={24} className='text-red-600' />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='mb-6 flex gap-4'
                    >
                        <div className='flex-1 relative'>
                            <Search className='absolute left-3 top-3 text-gray-400' size={18} />
                            <Input
                                placeholder='Search by name, email, or job...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='pl-10'
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className='w-40'>
                                <SelectValue placeholder='Filter by status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value='all'>All Status</SelectItem>
                                    <SelectItem value='pending'>Pending</SelectItem>
                                    <SelectItem value='accepted'>Accepted</SelectItem>
                                    <SelectItem value='rejected'>Rejected</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button onClick={fetchAllApplicants} variant='outline'>
                            Refresh
                        </Button>
                    </motion.div>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'
                        >
                            <p className='text-red-700 flex-1'>{error}</p>
                            <Button onClick={fetchAllApplicants} variant='outline' size='sm'>
                                Retry
                            </Button>
                        </motion.div>
                    )}

                    {/* Applicants Table */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className='border-0 shadow-md bg-white/60 backdrop-blur-sm'>
                            <CardContent className='pt-6 overflow-x-auto'>
                                <Table>
                                    <TableCaption className='text-gray-600 pb-4'>
                                        Showing {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className='border-b border-gray-200/50 hover:bg-transparent'>
                                            <TableHead className='font-bold text-gray-900'>Candidate</TableHead>
                                            <TableHead className='font-bold text-gray-900'>Email</TableHead>
                                            <TableHead className='font-bold text-gray-900'>Phone</TableHead>
                                            <TableHead className='font-bold text-gray-900'>Applied For</TableHead>
                                            <TableHead className='font-bold text-gray-900'>Company</TableHead>
                                            <TableHead className='font-bold text-gray-900'>Status</TableHead>
                                            <TableHead className='font-bold text-gray-900'>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array(5).fill(0).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className='h-10 w-32' /></TableCell>
                                                    <TableCell><Skeleton className='h-10 w-32' /></TableCell>
                                                    <TableCell><Skeleton className='h-10 w-24' /></TableCell>
                                                    <TableCell><Skeleton className='h-10 w-32' /></TableCell>
                                                    <TableCell><Skeleton className='h-10 w-24' /></TableCell>
                                                    <TableCell><Skeleton className='h-10 w-24' /></TableCell>
                                                    <TableCell><Skeleton className='h-10 w-10' /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredApplicants.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan='7' className='text-center py-8 text-gray-500'>
                                                    No applicants found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredApplicants.map((app) => (
                                                <motion.tr
                                                    key={app._id}
                                                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                                                    className='border-b border-gray-200/50 group'
                                                >
                                                    <TableCell className='py-4'>
                                                        <div className='flex items-center gap-3'>
                                                            <Avatar className='border-2 border-purple-200'>
                                                                <AvatarImage src={app.applicant?.profile?.profilePhoto} />
                                                            </Avatar>
                                                            <span className='text-gray-900 font-semibold'>{app.applicant?.fullname}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='text-gray-700'>
                                                        <div className='flex items-center gap-2'>
                                                            <Mail size={14} className='text-purple-600' />
                                                            {app.applicant?.email}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='text-gray-700'>
                                                        <div className='flex items-center gap-2'>
                                                            <Phone size={14} className='text-purple-600' />
                                                            {app.applicant?.phoneNumber || 'N/A'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='text-gray-700 font-medium'>{app.jobTitle}</TableCell>
                                                    <TableCell className='text-gray-700'>{app.company}</TableCell>
                                                    <TableCell>
                                                        <Badge className={`${getStatusBadgeColor(app.status)}`}>
                                                            {app.status || 'Pending'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className='p-2 hover:bg-purple-100/50 rounded-lg transition-all inline-flex'
                                                                >
                                                                    <MoreHorizontal size={18} className='text-gray-600' />
                                                                </motion.button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className='w-48 glass rounded-xl border-white/20 space-y-1'>
                                                                {app.applicant?.profile?.resume && (
                                                                    <motion.a
                                                                        whileHover={{ x: 4 }}
                                                                        href={app.applicant.profile.resume}
                                                                        target='_blank'
                                                                        rel='noopener noreferrer'
                                                                        className='block w-full text-left px-3 py-2 rounded-lg hover:bg-purple-100/50 transition-all flex items-center gap-2'
                                                                    >
                                                                        <Download size={14} className='text-purple-600' />
                                                                        Download Resume
                                                                    </motion.a>
                                                                )}
                                                                <motion.button
                                                                    whileHover={{ x: 4 }}
                                                                    onClick={() => handleStatusChange(app._id, 'Accepted')}
                                                                    className='block w-full text-left px-3 py-2 rounded-lg hover:bg-green-100/50 transition-all flex items-center gap-2 text-green-700'
                                                                >
                                                                    <Check size={14} />
                                                                    Accept
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ x: 4 }}
                                                                    onClick={() => handleStatusChange(app._id, 'Rejected')}
                                                                    className='block w-full text-left px-3 py-2 rounded-lg hover:bg-red-100/50 transition-all flex items-center gap-2 text-red-700'
                                                                >
                                                                    <X size={14} />
                                                                    Reject
                                                                </motion.button>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </TableCell>
                                                </motion.tr>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AllApplicantsPage
