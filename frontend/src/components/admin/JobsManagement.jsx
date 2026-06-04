import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { motion } from 'framer-motion'
import { Search, Edit, Trash2, Eye } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const JobsManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        location: '',
        jobType: '',
        workMode: '',
        experienceLevel: '',
        category: '',
        industry: '',
        position: 1,
        salaryMin: '',
        salaryMax: '',
        requirements: '',
        skills: '',
        isActive: true,
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        let filtered = jobs;

        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredJobs(filtered);
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

    const handleViewJob = (jobId) => {
        const job = jobs.find(item => item._id === jobId);
        if (!job) {
            toast.error('Job not found');
            return;
        }
        setSelectedJob(job);
        setIsViewOpen(true);
    };

    const handleEditJob = (jobId) => {
        const job = jobs.find(item => item._id === jobId);
        if (!job) {
            toast.error('Job not found');
            return;
        }

        setSelectedJob(job);
        setEditForm({
            title: job.title || '',
            description: job.description || '',
            location: job.location || '',
            jobType: job.jobType || '',
            workMode: job.workMode || '',
            experienceLevel: job.experienceLevel || '',
            category: job.category || '',
            industry: job.industry || '',
            position: job.position || 1,
            salaryMin: job.salary?.min ?? '',
            salaryMax: job.salary?.max ?? '',
            requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
            skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
            isActive: job.isActive ?? true,
        });
        setIsEditOpen(true);
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveEdit = async () => {
        if (!selectedJob) return;

        try {
            setIsSaving(true);
            const payload = {
                title: editForm.title,
                description: editForm.description,
                location: editForm.location,
                jobType: editForm.jobType,
                workMode: editForm.workMode,
                experienceLevel: editForm.experienceLevel,
                category: editForm.category,
                industry: editForm.industry,
                position: Number(editForm.position),
                salary: {
                    min: Number(editForm.salaryMin),
                    max: Number(editForm.salaryMax),
                    currency: selectedJob.salary?.currency || 'PKR',
                },
                requirements: editForm.requirements,
                skills: editForm.skills,
                isActive: editForm.isActive,
            };

            const res = await apiClient.patch(`/admin/jobs/${selectedJob._id}`, payload);
            const updatedJob = res.data.job;

            setJobs(prev => prev.map(job => job._id === updatedJob._id ? updatedJob : job));
            setSelectedJob(updatedJob);
            setIsEditOpen(false);
            toast.success('Job updated successfully');
        } catch (error) {
            console.error('Edit error:', error);
            toast.error(error.response?.data?.message || 'Failed to update job');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await apiClient.delete(`/admin/jobs/${jobId}`);
                toast.success('Job deleted successfully');
                fetchJobs();
            } catch (error) {
                console.error('Delete error:', error);
                toast.error(error.response?.data?.message || 'Failed to delete job');
            }
        }
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <AdminNavbar />
            <div className='flex pt-20'>
                <AdminDashboardSidebar />

                <div className='flex-1 p-8 lg:ml-64'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8'
                    >
                        <h1 className='text-4xl font-bold text-gray-900'>Jobs Management</h1>
                        <p className='text-gray-600 mt-2'>Manage all job postings on the platform</p>
                    </motion.div>

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
                                            <div className='flex items-start justify-between gap-4'>
                                                <div className='flex-1'>
                                                    <h3 className='font-bold text-gray-900'>{job.title}</h3>
                                                    <p className='text-sm text-gray-600 mt-1'>{job.company?.name}</p>
                                                    <div className='flex gap-2 mt-2 flex-wrap'>
                                                        <Badge className='text-xs'>{job.position} positions</Badge>
                                                        <Badge className={`text-xs ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {job.isActive ? 'open' : 'closed'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2'>
                                                    <Button variant='ghost' size='sm' onClick={() => handleViewJob(job._id)} title='View job details'>
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button variant='ghost' size='sm' onClick={() => handleEditJob(job._id)} title='Edit job'>
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

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className='sm:max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>Job Details</DialogTitle>
                    </DialogHeader>
                    {selectedJob && (
                        <div className='space-y-4 text-sm'>
                            <div>
                                <h3 className='text-xl font-bold text-gray-900'>{selectedJob.title}</h3>
                                <p className='text-gray-600'>{selectedJob.company?.name || 'Unknown company'}</p>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <p><strong>Location:</strong> {selectedJob.location}</p>
                                <p><strong>Type:</strong> {selectedJob.jobType}</p>
                                <p><strong>Work Mode:</strong> {selectedJob.workMode}</p>
                                <p><strong>Experience:</strong> {selectedJob.experienceLevel}</p>
                                <p><strong>Category:</strong> {selectedJob.category}</p>
                                <p><strong>Industry:</strong> {selectedJob.industry}</p>
                                <p><strong>Positions:</strong> {selectedJob.position}</p>
                                <p><strong>Status:</strong> {selectedJob.isActive ? 'Open' : 'Closed'}</p>
                            </div>
                            <p><strong>Salary:</strong> {selectedJob.salary?.min} - {selectedJob.salary?.max} {selectedJob.salary?.currency || 'PKR'}</p>
                            <div>
                                <strong>Description:</strong>
                                <p className='mt-1 text-gray-700 whitespace-pre-wrap'>{selectedJob.description}</p>
                            </div>
                            <div>
                                <strong>Requirements:</strong>
                                <p className='mt-1 text-gray-700'>{selectedJob.requirements?.join(', ') || 'N/A'}</p>
                            </div>
                            <div>
                                <strong>Skills:</strong>
                                <p className='mt-1 text-gray-700'>{selectedJob.skills?.join(', ') || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className='sm:max-w-3xl'>
                    <DialogHeader>
                        <DialogTitle>Edit Job</DialogTitle>
                    </DialogHeader>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Input value={editForm.title} onChange={(e) => handleEditChange('title', e.target.value)} placeholder='Job title' />
                        <Input value={editForm.location} onChange={(e) => handleEditChange('location', e.target.value)} placeholder='Location' />
                        <Input value={editForm.jobType} onChange={(e) => handleEditChange('jobType', e.target.value)} placeholder='Job type' />
                        <Input value={editForm.workMode} onChange={(e) => handleEditChange('workMode', e.target.value)} placeholder='Work mode' />
                        <Input value={editForm.experienceLevel} onChange={(e) => handleEditChange('experienceLevel', e.target.value)} placeholder='Experience level' />
                        <Input value={editForm.category} onChange={(e) => handleEditChange('category', e.target.value)} placeholder='Category' />
                        <Input value={editForm.industry} onChange={(e) => handleEditChange('industry', e.target.value)} placeholder='Industry' />
                        <Input type='number' value={editForm.position} onChange={(e) => handleEditChange('position', e.target.value)} placeholder='Positions' />
                        <Input type='number' value={editForm.salaryMin} onChange={(e) => handleEditChange('salaryMin', e.target.value)} placeholder='Salary min' />
                        <Input type='number' value={editForm.salaryMax} onChange={(e) => handleEditChange('salaryMax', e.target.value)} placeholder='Salary max' />
                        <div className='md:col-span-2'>
                            <Textarea value={editForm.description} onChange={(e) => handleEditChange('description', e.target.value)} placeholder='Description' />
                        </div>
                        <div className='md:col-span-2'>
                            <Input value={editForm.requirements} onChange={(e) => handleEditChange('requirements', e.target.value)} placeholder='Requirements, comma separated' />
                        </div>
                        <div className='md:col-span-2'>
                            <Input value={editForm.skills} onChange={(e) => handleEditChange('skills', e.target.value)} placeholder='Skills, comma separated' />
                        </div>
                        <label className='flex items-center gap-2 text-sm text-gray-700'>
                            <input
                                type='checkbox'
                                checked={editForm.isActive}
                                onChange={(e) => handleEditChange('isActive', e.target.checked)}
                            />
                            Job is active
                        </label>
                    </div>
                    <div className='flex justify-end gap-2 mt-4'>
                        <Button variant='outline' onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} disabled={isSaving} className='bg-purple-600 hover:bg-purple-700'>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JobsManagement;
