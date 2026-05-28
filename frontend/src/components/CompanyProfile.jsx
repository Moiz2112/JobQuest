import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, Users, Globe, Linkedin, Twitter, Facebook, Instagram, ArrowLeft, LinkIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import Footer from './shared/Footer'

const CompanyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    useGetCompanyById(id);
    const { singleCompany } = useSelector(store => store.company);

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
                {/* Back Button */}
                <motion.button
                    whileHover={{ scale: 1.05, x: -5 }}
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-purple-600 font-semibold mb-6 hover:text-purple-700 transition-colors'
                >
                    <ArrowLeft size={20} />
                    Back
                </motion.button>

                {/* Header Section */}
                <motion.div
                    variants={itemVariants}
                    className='card-premium rounded-3xl p-8 mb-8'
                >
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                        <div className='flex items-start gap-6 flex-1'>
                            {/* Company Logo */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className='relative'
                            >
                                <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-lg opacity-20' />
                                <Avatar className='h-32 w-32 border-4 border-purple-200 shadow-xl'>
                                    <AvatarImage src={singleCompany?.logo} alt={singleCompany?.name} />
                                </Avatar>
                            </motion.div>

                            {/* Company Info */}
                            <div className='flex-1 space-y-3'>
                                <motion.h1 className='heading-lg text-gray-900'>
                                    {singleCompany?.name}
                                </motion.h1>
                                <p className='text-gray-600 leading-relaxed max-w-xl'>
                                    {singleCompany?.description || 'A leading company focused on innovation and excellence.'}
                                </p>

                                {/* Quick Info */}
                                <div className='flex flex-wrap gap-3 mt-4'>
                                    {singleCompany?.location && (
                                        <div className='flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg text-purple-700 font-medium'>
                                            <MapPin size={16} />
                                            {singleCompany?.location}
                                        </div>
                                    )}
                                    {singleCompany?.industry && (
                                        <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-blue-700 font-medium'>
                                            <Briefcase size={16} />
                                            {singleCompany?.industry}
                                        </div>
                                    )}
                                    {singleCompany?.companySize && (
                                        <div className='flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg text-green-700 font-medium'>
                                            <Users size={16} />
                                            {singleCompany?.companySize} employees
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div variants={itemVariants} className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
                    <div className='glass rounded-xl p-6 text-center'>
                        <p className='text-3xl font-bold text-purple-600 mb-2'>{singleCompany?.jobsCount || 0}</p>
                        <p className='text-gray-600'>Active Job Postings</p>
                    </div>
                    <div className='glass rounded-xl p-6 text-center'>
                        <p className='text-3xl font-bold text-pink-600 mb-2'>{singleCompany?.applicantsCount || 0}</p>
                        <p className='text-gray-600'>Total Applicants</p>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div variants={itemVariants} className='card-premium rounded-3xl p-8 mb-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {/* Left Column */}
                        <div className='space-y-6'>
                            {singleCompany?.website && (
                                <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                                    <div className='flex items-center gap-2 text-gray-700 font-semibold'>
                                        <Globe size={18} className='text-purple-600' />
                                        Website
                                    </div>
                                    <a
                                        href={singleCompany?.website}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-purple-600 hover:text-purple-700 font-medium break-all'
                                    >
                                        {singleCompany?.website}
                                    </a>
                                </motion.div>
                            )}

                            {singleCompany?.industry && (
                                <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                                    <h3 className='text-gray-700 font-semibold'>Industry</h3>
                                    <p className='text-gray-600'>{singleCompany?.industry}</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className='space-y-6'>
                            {singleCompany?.companySize && (
                                <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                                    <h3 className='text-gray-700 font-semibold'>Company Size</h3>
                                    <p className='text-gray-600'>{singleCompany?.companySize} employees</p>
                                </motion.div>
                            )}

                            {singleCompany?.location && (
                                <motion.div whileHover={{ x: 5 }} className='space-y-2'>
                                    <h3 className='text-gray-700 font-semibold'>Headquarters</h3>
                                    <p className='text-gray-600'>{singleCompany?.location}</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Social Links */}
                {singleCompany?.socialLinks && Object.values(singleCompany?.socialLinks).some(link => link) && (
                    <motion.div variants={itemVariants} className='card-premium rounded-3xl p-8 mb-8'>
                        <h2 className='heading-md mb-6 flex items-center gap-2'>
                            <LinkIcon size={24} className='text-purple-600' />
                            Connect With Us
                        </h2>
                        <div className='flex flex-wrap gap-4'>
                            {singleCompany?.socialLinks?.linkedin && (
                                <motion.a
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    href={singleCompany?.socialLinks?.linkedin}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all'
                                >
                                    <Linkedin size={24} />
                                </motion.a>
                            )}
                            {singleCompany?.socialLinks?.twitter && (
                                <motion.a
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    href={singleCompany?.socialLinks?.twitter}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='p-3 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-all'
                                >
                                    <Twitter size={24} />
                                </motion.a>
                            )}
                            {singleCompany?.socialLinks?.facebook && (
                                <motion.a
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    href={singleCompany?.socialLinks?.facebook}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all'
                                >
                                    <Facebook size={24} />
                                </motion.a>
                            )}
                            {singleCompany?.socialLinks?.instagram && (
                                <motion.a
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    href={singleCompany?.socialLinks?.instagram}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='p-3 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-all'
                                >
                                    <Instagram size={24} />
                                </motion.a>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* CTA Section */}
                <motion.div
                    variants={itemVariants}
                    className='glass rounded-3xl p-8 text-center border-l-4 border-purple-600'
                >
                    <h3 className='heading-md mb-3'>Interested in working here?</h3>
                    <p className='text-gray-600 mb-6'>Browse open positions and apply to join our team</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/jobs')}
                        className='btn-primary px-8 py-3 rounded-lg'
                    >
                        Browse Open Positions
                    </motion.button>
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    )
}

export default CompanyProfile

