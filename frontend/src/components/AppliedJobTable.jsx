import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, XCircle, Briefcase } from 'lucide-react'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'accepted':
                return <CheckCircle size={18} className='text-green-600' />;
            case 'rejected':
                return <XCircle size={18} className='text-red-600' />;
            case 'pending':
                return <Clock size={18} className='text-yellow-600' />;
            default:
                return <Briefcase size={18} className='text-gray-600' />;
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'rejected':
                return 'bg-red-100/80 text-red-700';
            case 'pending':
                return 'bg-yellow-100/80 text-yellow-700';
            case 'accepted':
                return 'bg-green-100/80 text-green-700';
            default:
                return 'bg-gray-100/80 text-gray-700';
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='overflow-x-auto'
        >
            {allAppliedJobs.length <= 0 ? (
                <motion.div
                    variants={itemVariants}
                    className='glass rounded-xl p-12 text-center'
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className='mb-4'
                    >
                        <Briefcase size={48} className='text-purple-400 opacity-30 mx-auto' />
                    </motion.div>
                    <p className='text-gray-700 font-medium text-lg'>No applications yet</p>
                    <p className='text-gray-600 text-sm mt-2'>Start exploring jobs and apply to positions that interest you!</p>
                </motion.div>
            ) : (
                <Table>
                    <TableCaption className='text-gray-600 pb-4'>
                        You have applied to <span className='font-bold text-purple-600'>{allAppliedJobs.length}</span> job{allAppliedJobs.length > 1 ? 's' : ''}
                    </TableCaption>
                    <TableHeader>
                        <TableRow className='border-b border-gray-200/50 hover:bg-transparent'>
                            <TableHead className='font-bold text-gray-900'>Application Date</TableHead>
                            <TableHead className='font-bold text-gray-900'>Job Role</TableHead>
                            <TableHead className='font-bold text-gray-900'>Company</TableHead>
                            <TableHead className='text-right font-bold text-gray-900'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allAppliedJobs.map((appliedJob, idx) => (
                            <motion.tr
                                key={appliedJob._id}
                                variants={itemVariants}
                                className='border-b border-gray-200/50 hover:bg-purple-50/50 transition-colors group'
                            >
                                <TableCell className='text-gray-700 font-medium'>
                                    {appliedJob?.createdAt?.split("T")[0]}
                                </TableCell>
                                <TableCell className='text-gray-900 font-semibold group-hover:text-purple-600 transition-colors'>
                                    <motion.span whileHover={{ x: 4 }}>
                                        {appliedJob.job?.title}
                                    </motion.span>
                                </TableCell>
                                <TableCell className='text-gray-700'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full' />
                                        {appliedJob.job?.company?.name}
                                    </div>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className='inline-flex'
                                    >
                                        <Badge
                                            className={`${getStatusColor(appliedJob?.status)} font-bold text-xs px-3 py-1.5 flex items-center gap-2 rounded-lg`}
                                        >
                                            {getStatusIcon(appliedJob?.status)}
                                            {appliedJob.status.charAt(0).toUpperCase() + appliedJob.status.slice(1)}
                                        </Badge>
                                    </motion.div>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            )}
        </motion.div>
    )
}

export default AppliedJobTable