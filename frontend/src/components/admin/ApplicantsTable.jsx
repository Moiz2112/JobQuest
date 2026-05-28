import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Download, Check, X, Users, Mail, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import apiClient from '@/utils/apiClient';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage } from '../ui/avatar';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

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

    const statusHandler = async (status, id) => {
        try {
            const res = await apiClient.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const getStatusBadgeColor = (status) => {
        switch(status.toLowerCase()) {
            case 'accepted':
                return 'bg-green-100/80 text-green-700';
            case 'rejected':
                return 'bg-red-100/80 text-red-700';
            default:
                return 'bg-yellow-100/80 text-yellow-700';
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='overflow-x-auto'
        >
            {!applicants || applicants?.length === 0 ? (
                <motion.div
                    variants={itemVariants}
                    className='glass rounded-xl p-12 text-center'
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className='mb-4'
                    >
                        <Users size={48} className='text-purple-400 opacity-30 mx-auto' />
                    </motion.div>
                    <p className='text-gray-700 font-medium text-lg'>No applicants yet</p>
                    <p className='text-gray-600 text-sm mt-2'>Candidates will appear here when they apply to your jobs</p>
                </motion.div>
            ) : (
                <Table>
                    <TableCaption className='text-gray-600 pb-4'>
                        You have <span className='font-bold text-purple-600'>{applicants?.length}</span> applicant{applicants?.length > 1 ? 's' : ''} for this position
                    </TableCaption>
                    <TableHeader>
                        <TableRow className='border-b border-gray-200/50 hover:bg-transparent'>
                            <TableHead className='font-bold text-gray-900'>Candidate</TableHead>
                            <TableHead className='font-bold text-gray-900'>Email</TableHead>
                            <TableHead className='font-bold text-gray-900'>Phone</TableHead>
                            <TableHead className='font-bold text-gray-900'>Resume</TableHead>
                            <TableHead className='font-bold text-gray-900'>Applied Date</TableHead>
                            <TableHead className='text-right font-bold text-gray-900'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applicants?.map((item, idx) => (
                            <motion.tr
                                key={item._id}
                                variants={itemVariants}
                                className='border-b border-gray-200/50 hover:bg-purple-50/50 transition-colors group'
                            >
                                <TableCell className='py-4'>
                                    <div className='flex items-center gap-3'>
                                        <Avatar className='border-2 border-purple-200'>
                                            <AvatarImage src={item?.applicant?.profile?.profilePhoto} alt={item?.applicant?.fullname} />
                                        </Avatar>
                                        <span className='text-gray-900 font-semibold'>{item?.applicant?.fullname}</span>
                                    </div>
                                </TableCell>
                                <TableCell className='text-gray-700'>
                                    <motion.div whileHover={{ x: 4 }} className='flex items-center gap-2'>
                                        <Mail size={14} className='text-purple-600' />
                                        {item?.applicant?.email}
                                    </motion.div>
                                </TableCell>
                                <TableCell className='text-gray-700'>
                                    <motion.div whileHover={{ x: 4 }} className='flex items-center gap-2'>
                                        <Phone size={14} className='text-purple-600' />
                                        {item?.applicant?.phoneNumber}
                                    </motion.div>
                                </TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <motion.a
                                            whileHover={{ scale: 1.05 }}
                                            href={item?.applicant?.profile?.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/50 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-semibold text-sm'
                                        >
                                            <Download size={14} />
                                            Download
                                        </motion.a>
                                    ) : (
                                        <span className='text-gray-500 text-sm'>Not uploaded</span>
                                    )}
                                </TableCell>
                                <TableCell className='text-gray-700'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full' />
                                        {item?.applicant?.createdAt?.split("T")[0]}
                                    </div>
                                </TableCell>
                                <TableCell className='text-right'>
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
                                            {shortlistingStatus.map((status, index) => (
                                                <motion.button
                                                    key={index}
                                                    whileHover={{ x: 4 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg hover:bg-purple-100/50 transition-all group/item ${
                                                        status === 'Accepted' ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                                >
                                                    <div className='flex items-center gap-2'>
                                                        {status === 'Accepted' ? (
                                                            <Check size={16} />
                                                        ) : (
                                                            <X size={16} />
                                                        )}
                                                        <span className='font-semibold text-gray-900 group-hover/item:text-purple-700 text-sm'>{status}</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            )}
        </motion.div>
    )
}

export default ApplicantsTable