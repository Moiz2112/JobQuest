import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Avatar, AvatarImage } from '../ui/avatar'
import { motion } from 'framer-motion'
import { Search, Eye, Download } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const ApplicationsManagement = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [applications, searchTerm, statusFilter]);

    const fetchApplications = async () => {
        try {
            const res = await apiClient.get('/admin/applications');
            setApplications(res.data.applications || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = applications;

        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.applicant?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        setFilteredApplications(filtered);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='flex h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
            <AdminDashboardSidebar />

            <div className='flex-1 flex flex-col ml-64'>
                <AdminNavbar />

                <div className='flex-1 overflow-auto p-8'>
                    <div className='max-w-7xl mx-auto'>
                        {/* Header */}
                        <div className='mb-8'>
                            <h1 className='text-3xl font-bold text-slate-900'>Applications Management</h1>
                            <p className='text-slate-600'>Manage all job applications across the platform</p>
                        </div>

                        {/* Controls */}
                        <div className='flex gap-4 mb-6 flex-wrap'>
                            <div className='flex-1 min-w-64'>
                                <div className='relative'>
                                    <Search className='absolute left-3 top-3 text-gray-400' size={20} />
                                    <Input
                                        placeholder='Search by applicant name or job...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='pl-10'
                                    />
                                </div>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className='px-4 py-2 border border-gray-300 rounded-lg bg-white'
                            >
                                <option value='all'>All Status</option>
                                <option value='pending'>Pending</option>
                                <option value='accepted'>Accepted</option>
                                <option value='rejected'>Rejected</option>
                            </select>
                            <Button onClick={fetchApplications} className='bg-purple-600 hover:bg-purple-700'>
                                Refresh Data
                            </Button>
                        </div>

                        {/* Applications Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <CardTitle className='text-lg font-semibold'>
                                        All Applications ({filteredApplications.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className='text-center py-8 text-gray-500'>Loading applications...</div>
                                    ) : filteredApplications.length === 0 ? (
                                        <div className='text-center py-8 text-gray-500'>No applications found</div>
                                    ) : (
                                        <div className='overflow-x-auto'>
                                            <table className='w-full'>
                                                <thead className='bg-gray-50'>
                                                    <tr>
                                                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Applicant</th>
                                                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Job</th>
                                                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Company</th>
                                                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Status</th>
                                                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Applied On</th>
                                                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='divide-y divide-gray-200'>
                                                    {filteredApplications.map((app, idx) => (
                                                        <motion.tr
                                                            key={app._id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className='hover:bg-gray-50 transition-colors'
                                                        >
                                                            <td className='px-6 py-4'>
                                                                <div className='flex items-center gap-2'>
                                                                    <Avatar className='w-8 h-8'>
                                                                        <AvatarImage src={app.applicant?.profile?.profilePhoto} />
                                                                    </Avatar>
                                                                    <span className='text-sm font-medium text-gray-900'>
                                                                        {app.applicant?.fullname}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className='px-6 py-4'>
                                                                <span className='text-sm text-gray-700'>{app.job?.title}</span>
                                                            </td>
                                                            <td className='px-6 py-4'>
                                                                <span className='text-sm text-gray-700'>{app.job?.company?.name || 'N/A'}</span>
                                                            </td>
                                                            <td className='px-6 py-4'>
                                                                <Badge className={`${getStatusColor(app.status)} capitalize`}>
                                                                    {app.status}
                                                                </Badge>
                                                            </td>
                                                            <td className='px-6 py-4'>
                                                                <span className='text-sm text-gray-700'>
                                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </td>
                                                            <td className='px-6 py-4'>
                                                                <Button variant='outline' size='sm' className='text-purple-600'>
                                                                    <Eye size={16} className='mr-1' /> View
                                                                </Button>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsManagement;
