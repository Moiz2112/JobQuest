import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Bookmark, Heart, MapPin, DollarSign, Clock, Briefcase } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import apiClient from '@/utils/apiClient'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { allAppliedJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    // Check if this job has been applied for
    useEffect(() => {
        if (allAppliedJobs && job?._id) {
            const isJobApplied = allAppliedJobs.some(application => 
                application?.job?._id === job?._id || application?.jobId === job?._id
            );
            setIsApplied(isJobApplied);
        }
    }, [allAppliedJobs, job?._id]);

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return 0;
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    const hoverVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.02, transition: { duration: 0.3 } }
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Competitive';
        if (typeof salary === 'object' && salary.min && salary.max) {
            return `${salary.min} - ${salary.max} ${salary.currency || 'PKR'}`;
        }
        return salary;
    };

    const applyJobHandler = async () => {
        try {
            if (!user) {
                toast.error("Please login to apply for jobs");
                navigate('/login');
                return;
            }

            if (!user?.profile?.resume) {
                toast.error("Please upload a resume before applying");
                navigate('/profile');
                return;
            }

            const res = await apiClient.post(`${APPLICATION_API_END_POINT}/apply/${job?._id}`, {
                resume: user?.profile?.resume,
                coverLetter: ""
            });
            
            if(res.data.success){
                setIsApplied(true);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply for job");
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='group cursor-pointer h-full'
        >
            <motion.div
                variants={hoverVariants}
                whileHover="hover"
                className='relative h-full p-6 card-job group bg-white/50 hover:bg-white/80 rounded-2xl border border-white/30 hover:border-purple-300/50 overflow-hidden backdrop-blur-sm'
            >
                {/* Premium glassmorphism background */}
                <div className='absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                
                {/* Animated glow effect */}
                <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-pink-600/0 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300 -z-10' />

                <div className='relative z-10 h-full flex flex-col'>
                    {/* Header with date and save button */}
                    <div className='flex items-center justify-between mb-4 pb-3 border-b border-gray-200/50'>
                        <div className='flex items-center gap-2'>
                            <Clock size={14} className='text-purple-500' />
                            <p className='text-xs font-semibold text-gray-600 bg-gray-100/50 px-2 py-1 rounded-full'>
                                {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)}d ago`}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.15, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSaved(!isSaved)}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                isSaved
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'bg-gray-100/50 text-gray-600 hover:bg-purple-100/50 hover:text-purple-600'
                            }`}
                        >
                            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                        </motion.button>
                    </div>

                    {/* Company and Job Title */}
                    <div className='flex items-start gap-4 mb-4'>
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className='p-2.5 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 transition-all'
                        >
                            <Avatar className='w-10 h-10'>
                                <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                            </Avatar>
                        </motion.div>
                        <div className='flex-1 min-w-0'>
                            <h2 className='text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all truncate'>
                                {job?.title}
                            </h2>
                            <div className='flex items-center gap-2 mt-1.5 flex-wrap'>
                                <p className='font-semibold text-sm text-gray-800'>{job?.company?.name}</p>
                                {job?.location && (
                                    <>
                                        <span className='text-gray-300'>•</span>
                                        <div className='flex items-center gap-1 text-gray-600 text-sm hover:text-purple-600 transition-colors'>
                                            <MapPin size={14} />
                                            {job?.location}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className='text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed'>
                        {job?.description}
                    </p>

                    {/* Tags with glassmorphism */}
                    <div className='flex flex-wrap gap-2 mb-4'>
                        {job?.skills && job.skills.slice(0, 3).map((skill, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                className='px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium text-xs hover:shadow-md transition-all'
                            >
                                {skill}
                            </motion.div>
                        ))}
                        {job?.skills && job.skills.length > 3 && (
                            <div className='px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-medium text-xs'>
                                +{job.skills.length - 3}
                            </div>
                        )}
                    </div>

                    {/* Job Info Grid */}
                    <div className='grid grid-cols-2 gap-2.5 mb-4 py-3 border-t border-gray-200/50 mt-auto'>
                        {[
                            { icon: DollarSign, label: 'Salary', value: formatSalary(job?.salary) },
                            { icon: Briefcase, label: 'Type', value: job?.jobType },
                            { icon: MapPin, label: 'Mode', value: job?.workMode },
                            { icon: Clock, label: 'Level', value: job?.experienceLevel }
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div 
                                    key={idx} 
                                    whileHover={{ scale: 1.05 }}
                                    className='p-2 rounded-lg bg-gray-50/50 hover:bg-purple-50/50 transition-all text-center group/item'
                                >
                                    <Icon size={14} className='text-purple-600/60 group-hover/item:text-purple-600 mx-auto mb-1 transition-colors' />
                                    <p className='text-xs text-gray-500 font-medium group-hover/item:text-gray-600'>{item.label}</p>
                                    <p className='text-xs font-bold text-gray-900 group-hover/item:text-purple-600 transition-colors mt-0.5 truncate'>{item.value}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2.5 mt-4 pt-3 border-t border-gray-200/50'>
                        <motion.button
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/description/${job?._id}`)}
                            className='flex-1 px-3 py-2.5 rounded-lg border border-purple-300/50 text-purple-600 font-semibold hover:bg-purple-50/50 hover:border-purple-400 transition-all text-sm'
                        >
                            Details
                        </motion.button>
                        <motion.button
                            whileHover={isApplied ? {} : { scale: 1.02, x: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={isApplied ? () => {} : (user?.role === 'student' ? applyJobHandler : () => navigate(`/description/${job?._id}`))}
                            disabled={isApplied}
                            className={`flex-1 px-3 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                                isApplied
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/30 cursor-not-allowed opacity-90'
                                    : user?.role === 'student'
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-600/30 cursor-pointer'
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:shadow-lg hover:shadow-gray-600/30 cursor-pointer'
                            }`}
                        >
                            {isApplied ? '✓ Applied' : (user?.role === 'student' ? 'Apply' : 'View')}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Job