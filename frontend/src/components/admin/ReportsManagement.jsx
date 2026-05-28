import React, { useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { AlertCircle, FileText, Download, Eye } from 'lucide-react'
import { toast } from 'sonner'

const ReportsManagement = () => {
    const [reports] = useState([
        {
            id: 1,
            type: 'User Report',
            title: 'Suspicious Account Activity',
            severity: 'high',
            status: 'pending',
            date: '2024-06-20',
            description: 'Multiple accounts with similar patterns detected',
            reportedBy: 'admin@jobquest.com'
        },
        {
            id: 2,
            type: 'Job Report',
            title: 'Inappropriate Job Posting',
            severity: 'medium',
            status: 'in-review',
            date: '2024-06-19',
            description: 'Job posting contains potentially offensive content',
            reportedBy: 'user123@gmail.com'
        },
        {
            id: 3,
            type: 'Company Report',
            title: 'Unverified Company Profile',
            severity: 'low',
            status: 'resolved',
            date: '2024-06-18',
            description: 'Company details could not be verified',
            reportedBy: 'recruiter@company.com'
        },
        {
            id: 4,
            type: 'User Report',
            title: 'Spam Applications',
            severity: 'high',
            status: 'pending',
            date: '2024-06-17',
            description: 'User applying to irrelevant jobs with generic messages',
            reportedBy: 'recruiter2@company.com'
        },
        {
            id: 5,
            type: 'Content Report',
            title: 'Abusive Communication',
            severity: 'critical',
            status: 'pending',
            date: '2024-06-16',
            description: 'Abusive messages sent between users on platform',
            reportedBy: 'admin@jobquest.com'
        }
    ]);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'in-review':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'resolved':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const handleResolve = (id) => {
        toast.success(`Report #${id} marked as resolved`);
    };

    const handleDownload = () => {
        toast.success('Reports downloaded successfully');
    };

    return (
        <div className='flex h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
            <AdminDashboardSidebar />

            <div className='flex-1 flex flex-col ml-64'>
                <AdminNavbar />

                <div className='flex-1 overflow-auto p-8'>
                    <div className='max-w-7xl mx-auto'>
                        {/* Header */}
                        <div className='mb-8 flex justify-between items-start'>
                            <div>
                                <h1 className='text-3xl font-bold text-slate-900'>Reports & Incidents</h1>
                                <p className='text-slate-600'>Monitor and manage platform reports and issues</p>
                            </div>
                            <Button onClick={handleDownload} className='bg-purple-600 hover:bg-purple-700 flex items-center gap-2'>
                                <Download size={16} /> Export Reports
                            </Button>
                        </div>

                        {/* Summary Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-red-50 border border-red-200 rounded-lg p-4'
                            >
                                <p className='text-red-700 text-sm font-medium'>Critical Issues</p>
                                <p className='text-3xl font-bold text-red-800 mt-2'>1</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className='bg-orange-50 border border-orange-200 rounded-lg p-4'
                            >
                                <p className='text-orange-700 text-sm font-medium'>High Priority</p>
                                <p className='text-3xl font-bold text-orange-800 mt-2'>2</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'
                            >
                                <p className='text-yellow-700 text-sm font-medium'>Pending Review</p>
                                <p className='text-3xl font-bold text-yellow-800 mt-2'>3</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className='bg-green-50 border border-green-200 rounded-lg p-4'
                            >
                                <p className='text-green-700 text-sm font-medium'>Resolved</p>
                                <p className='text-3xl font-bold text-green-800 mt-2'>1</p>
                            </motion.div>
                        </div>

                        {/* Reports List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <CardTitle className='flex items-center gap-2'>
                                        <AlertCircle size={20} />
                                        Active Reports ({reports.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-4'>
                                        {reports.map((report, idx) => (
                                            <motion.div
                                                key={report.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`border-2 rounded-lg p-4 ${getStatusColor(report.status)}`}
                                            >
                                                <div className='flex justify-between items-start'>
                                                    <div className='flex-1'>
                                                        <div className='flex items-center gap-3 mb-2'>
                                                            <Badge className={getSeverityColor(report.severity)}>
                                                                {report.severity.toUpperCase()}
                                                            </Badge>
                                                            <Badge variant='outline'>{report.type}</Badge>
                                                            <Badge variant='secondary'>{report.status.replace('-', ' ')}</Badge>
                                                        </div>
                                                        <h3 className='text-lg font-semibold mb-1'>{report.title}</h3>
                                                        <p className='text-sm mb-2'>{report.description}</p>
                                                        <div className='text-xs opacity-75'>
                                                            <p>📅 {new Date(report.date).toLocaleDateString()}</p>
                                                            <p>👤 Reported by: {report.reportedBy}</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex gap-2'>
                                                        <Button
                                                            variant='outline'
                                                            size='sm'
                                                            className='text-purple-600 border-purple-600 hover:bg-purple-50'
                                                        >
                                                            <Eye size={16} className='mr-1' /> View
                                                        </Button>
                                                        {report.status !== 'resolved' && (
                                                            <Button
                                                                size='sm'
                                                                onClick={() => handleResolve(report.id)}
                                                                className='bg-green-600 hover:bg-green-700'
                                                            >
                                                                Mark Resolved
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3'
                        >
                            <FileText size={20} className='text-blue-600 flex-shrink-0 mt-1' />
                            <div className='text-sm text-blue-700'>
                                <p className='font-semibold'>Report Guidelines</p>
                                <p className='mt-1'>All reports are automatically categorized by severity. Critical issues should be addressed within 24 hours. Users should be notified of report outcomes.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsManagement;
