import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import Footer from './shared/Footer';

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-purple-50/50 to-transparent pt-20'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className='space-y-10'
                >
                    {/* Header Section */}
                    <motion.div variants={itemVariants}>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='flex items-center gap-3 mb-3'>
                                    <motion.div
                                        initial={{ rotate: -180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ type: 'spring' }}
                                        className='p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg'
                                    >
                                        <Briefcase className='text-white' size={24} />
                                    </motion.div>
                                    <div>
                                        <h1 className='heading-lg gradient-text'>
                                            Browse All Opportunities
                                        </h1>
                                    </div>
                                </div>
                                <p className='text-gray-600 text-lg max-w-2xl'>
                                    Discover {allJobs.length} amazing job opportunities waiting for you
                                </p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className='px-6 py-3 glass rounded-xl text-center'
                            >
                                <p className='text-3xl font-bold gradient-text'>{allJobs.length}</p>
                                <p className='text-sm text-gray-600 mt-1'>Total Jobs</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* No results state */}
                    {allJobs.length === 0 ? (
                        <motion.div
                            variants={itemVariants}
                            className='glass rounded-2xl p-16 text-center'
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className='mb-4'
                            >
                                <Briefcase size={64} className='text-purple-400 opacity-30 mx-auto' />
                            </motion.div>
                            <h2 className='text-2xl font-bold text-gray-900 mb-2'>No Jobs Found</h2>
                            <p className='text-gray-600'>Try adjusting your filters or search query</p>
                        </motion.div>
                    ) : (
                        /* Jobs Grid */
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        >
                            {allJobs.map((job) => (
                                <motion.div key={job._id} variants={itemVariants}>
                                    <Job job={job} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}

export default Browse