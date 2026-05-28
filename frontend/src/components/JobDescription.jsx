import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/utils/apiClient';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, DollarSign, Users, Calendar, CheckCircle, Heart, Share2, FileText } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import Footer from './shared/Footer';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [isSaved, setIsSaved] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

            const res = await apiClient.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
                resume: user?.profile?.resume,
                coverLetter: ""
            });
            
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply for job");
        }
    }

    const handleShare = async () => {
        try {
            const url = window.location.href;
            if (navigator.share) {
                await navigator.share({
                    title: singleJob?.title,
                    text: `Check out this job: ${singleJob?.title} at ${singleJob?.company?.name}`,
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url);
                toast.success("Job link copied to clipboard!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to share");
        }
    }

    const handleViewCompanyProfile = () => {
        navigate(`/company/${singleJob?.company?._id}`);
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await apiClient.get(`${JOB_API_END_POINT}/get/${jobId}`);
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className='pt-20 min-h-screen bg-gradient-to-b from-purple-50/50 to-transparent'>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'
            >
            {/* Header Section */}
            <motion.div
                variants={itemVariants}
                className='card-premium rounded-2xl p-8 mb-8'
            >
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6'>
                    <div className='flex-1 space-y-4'>
                        {/* Company Logo & Title */}
                        <div className='flex items-start gap-4'>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className='p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0'
                            >
                                <Avatar className='w-12 h-12'>
                                    <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                                </Avatar>
                            </motion.div>
                            <div className='flex-1'>
                                <p className='text-sm font-semibold text-purple-600 uppercase tracking-wide'>
                                    {singleJob?.company?.name}
                                </p>
                                <h1 className='heading-lg text-gray-900 mt-2'>
                                    {singleJob?.title}
                                </h1>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className='flex flex-wrap gap-3 mt-4'>
                            {singleJob?.jobType && (
                                <Badge className='bg-pink-100/80 text-pink-700 font-semibold text-xs'>
                                    {singleJob?.jobType}
                                </Badge>
                            )}
                            {singleJob?.experience && (
                                <Badge className='bg-blue-100/80 text-blue-700 font-semibold text-xs'>
                                    {singleJob?.experience}+ Years
                                </Badge>
                            )}
                            {singleJob?.salary && (
                                <Badge className='bg-green-100/80 text-green-700 font-semibold text-xs'>
                                    {formatSalary(singleJob?.salary)}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col gap-3 w-full md:w-auto'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                                isApplied
                                    ? 'bg-green-500 cursor-not-allowed'
                                    : 'btn-primary shadow-lg hover:shadow-purple-600/50'
                            }`}
                        >
                            {isApplied ? (
                                <>
                                    <CheckCircle size={18} />
                                    Applied
                                </>
                            ) : (
                                'Apply Now'
                            )}
                        </motion.button>

                        <div className='flex gap-2'>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSaved(!isSaved)}
                                className={`flex-1 md:flex-none px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                                    isSaved
                                        ? 'bg-red-50 border-red-300 text-red-600'
                                        : 'border-gray-300 text-gray-600 hover:border-purple-300'
                                }`}
                            >
                                <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShare}
                                className='flex-1 md:flex-none px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-purple-300 transition-all flex items-center justify-center gap-2'
                            >
                                <Share2 size={18} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Info Grid */}
            <motion.div variants={itemVariants} className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                {[
                    { icon: MapPin, label: 'Location', value: singleJob?.location || 'N/A' },
                    { icon: Briefcase, label: 'Job Type', value: singleJob?.jobType || 'N/A' },
                    { icon: DollarSign, label: 'Salary', value: formatSalary(singleJob?.salary) || 'N/A' },
                    { icon: Users, label: 'Applicants', value: singleJob?.applications?.length || 0 }
                ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className='glass rounded-xl p-4 text-center'
                        >
                            <Icon size={24} className='mx-auto mb-2 text-purple-600' />
                            <p className='text-xs text-gray-600 mb-1'>{item.label}</p>
                            <p className='font-bold text-gray-900 text-sm line-clamp-1'>{item.value}</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Job Details */}
            <motion.div variants={itemVariants} className='card-premium rounded-2xl p-8 space-y-6 mb-8'>
                <div>
                    <div className='flex items-center gap-2 mb-4'>
                        <FileText size={20} className='text-purple-600' />
                        <h2 className='heading-md'>Job Description</h2>
                    </div>
                    <p className='text-gray-700 leading-relaxed'>
                        {singleJob?.description}
                    </p>
                </div>

                {/* Details Grid */}
                <div className='border-t border-gray-200/50 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                        <h3 className='font-bold text-gray-900'>Role</h3>
                        <p className='text-gray-600'>{singleJob?.title}</p>
                    </motion.div>

                    <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                        <h3 className='font-bold text-gray-900'>Experience Required</h3>
                        <p className='text-gray-600'>{singleJob?.experience} years</p>
                    </motion.div>

                    <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                        <h3 className='font-bold text-gray-900'>Positions Available</h3>
                        <p className='text-gray-600'>{singleJob?.position || singleJob?.postion} opening{(singleJob?.position || singleJob?.postion) > 1 ? 's' : ''}</p>
                    </motion.div>

                    <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                        <h3 className='font-bold text-gray-900'>Salary Range</h3>
                        <p className='text-gray-600'>{formatSalary(singleJob?.salary)}</p>
                    </motion.div>

                    <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                        <h3 className='font-bold text-gray-900'>Job Type</h3>
                        <p className='text-gray-600'>{singleJob?.jobType}</p>
                    </motion.div>

                    <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                        <h3 className='font-bold text-gray-900'>Posted Date</h3>
                        <p className='text-gray-600'>{singleJob?.createdAt?.split("T")[0]}</p>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className='border-t border-gray-200/50 pt-6'>
                    <h3 className='font-bold text-gray-900 mb-3 flex items-center gap-2'>
                        <Users size={18} className='text-purple-600' />
                        Applications & Activity
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-4 bg-purple-50 rounded-lg'>
                            <p className='text-2xl font-bold text-purple-600'>{singleJob?.applications?.length || 0}</p>
                            <p className='text-sm text-gray-600'>Total Applications</p>
                        </div>
                        <div className='p-4 bg-pink-50 rounded-lg'>
                            <p className='text-2xl font-bold text-pink-600'>{singleJob?.position || 1}</p>
                            <p className='text-sm text-gray-600'>Positions Open</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Company Info Section */}
            {singleJob?.company && (
                <motion.div variants={itemVariants} className='card-premium rounded-2xl p-8'>
                    <h2 className='heading-md mb-4'>About {singleJob?.company?.name}</h2>
                    <p className='text-gray-700 leading-relaxed mb-6'>
                        {singleJob?.company?.description || 'A leading company focused on innovation and excellence.'}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleViewCompanyProfile}
                        className='btn-secondary px-6 py-2 rounded-lg'
                    >
                        View Company Profile
                    </motion.button>
                </motion.div>
            )}

            {/* Application Status */}
            {isApplied && (
                <motion.div
                    variants={itemVariants}
                    className='glass border-l-4 border-green-500 rounded-xl p-6 mt-8 bg-green-50/50'
                >
                    <div className='flex items-start gap-3'>
                        <CheckCircle size={24} className='text-green-600 flex-shrink-0 mt-0.5' />
                        <div>
                            <h3 className='font-bold text-green-900'>Application Submitted!</h3>
                            <p className='text-sm text-green-800 mt-1'>
                                Your application has been submitted successfully. The recruiter will review your profile and get back to you soon.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
            </motion.div>
        </div>
    )
}

export default JobDescription