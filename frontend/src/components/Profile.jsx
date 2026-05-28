import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Download, Award, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { motion } from 'framer-motion'
import Footer from './shared/Footer'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

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
        <div className='min-h-screen bg-gradient-to-b from-purple-50/50 to-transparent pt-20'>
            <Navbar />
            
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'
            >
                {/* Profile Header Card */}
                <motion.div
                    variants={itemVariants}
                    className='card-premium rounded-3xl p-8 mb-8'
                >
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                        <div className='flex items-start gap-6 flex-1'>
                            {/* Avatar */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className='relative'
                            >
                                <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-lg opacity-20' />
                                <Avatar className="h-32 w-32 border-4 border-purple-200 shadow-xl">
                                    <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                                </Avatar>
                            </motion.div>

                            {/* User Info */}
                            <div className='flex-1 space-y-2'>
                                <motion.h1 className='heading-lg text-gray-900'>
                                    {user?.fullname}
                                </motion.h1>
                                <p className='text-gray-600 leading-relaxed max-w-xl'>
                                    {user?.profile?.bio || 'Add a bio to let employers know more about you'}
                                </p>
                                
                                {/* Contact Info */}
                                <div className='flex flex-col gap-2 mt-4 text-sm'>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className='flex items-center gap-2 text-gray-700'
                                    >
                                        <Mail size={16} className='text-purple-600' />
                                        <span>{user?.email}</span>
                                    </motion.div>
                                    {user?.phoneNumber && (
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            className='flex items-center gap-2 text-gray-700'
                                        >
                                            <Contact size={16} className='text-purple-600' />
                                            <span>{user?.phoneNumber}</span>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setOpen(true)}
                            className='btn-primary flex items-center gap-2 shadow-lg'
                        >
                            <Pen size={18} />
                            Edit Profile
                        </motion.button>
                    </div>
                </motion.div>

                {/* Skills Section */}
                <motion.div
                    variants={itemVariants}
                    className='card-premium rounded-3xl p-8 mb-8'
                >
                    <div className='flex items-center gap-3 mb-6'>
                        <Award size={24} className='text-purple-600' />
                        <h2 className='heading-md'>Skills & Expertise</h2>
                    </div>
                    
                    {user?.profile?.skills && user?.profile?.skills.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            className='flex flex-wrap gap-3'
                        >
                            {user?.profile?.skills.map((skill, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Badge className='bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold px-4 py-2 text-sm hover:shadow-md transition-all'>
                                        {skill}
                                    </Badge>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className='glass rounded-xl p-6 text-center'>
                            <p className='text-gray-600'>No skills added yet</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setOpen(true)}
                                className='text-purple-600 font-semibold text-sm mt-2'
                            >
                                Add Skills →
                            </motion.button>
                        </div>
                    )}
                </motion.div>

                {/* Resume Section */}
                <motion.div
                    variants={itemVariants}
                    className='card-premium rounded-3xl p-8 mb-8'
                >
                    <div className='flex items-center gap-3 mb-6'>
                        <FileText size={24} className='text-purple-600' />
                        <h2 className='heading-md'>Resume</h2>
                    </div>

                    {user?.profile?.resume ? (
                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            href={user?.profile?.resume}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='glass rounded-xl p-6 flex items-center justify-between group hover:bg-purple-50/80 transition-all'
                        >
                            <div className='flex items-center gap-4'>
                                <div className='p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg group-hover:from-purple-200 group-hover:to-pink-200 transition-all'>
                                    <FileText size={24} className='text-purple-600' />
                                </div>
                                <div>
                                    <p className='font-semibold text-gray-900'>{user?.profile?.resumeOriginalName}</p>
                                    <p className='text-sm text-gray-600'>Click to download</p>
                                </div>
                            </div>
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Download size={20} className='text-purple-600' />
                            </motion.div>
                        </motion.a>
                    ) : (
                        <div className='glass rounded-xl p-8 text-center'>
                            <FileText size={40} className='text-gray-400 mx-auto mb-3' />
                            <p className='text-gray-600 font-medium'>No resume uploaded yet</p>
                            <p className='text-sm text-gray-500 mt-1'>Upload a resume to increase your visibility to employers</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setOpen(true)}
                                className='text-purple-600 font-semibold text-sm mt-4'
                            >
                                Upload Resume →
                            </motion.button>
                        </div>
                    )}
                </motion.div>

                {/* Applied Jobs Section */}
                <motion.div
                    variants={itemVariants}
                    className='card-premium rounded-3xl p-8'
                >
                    <h2 className='heading-md mb-6'>Application History</h2>
                    {/* Applied Job Table */}
                    <AppliedJobTable />
                </motion.div>
            </motion.div>

            {/* Update Profile Dialog */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile