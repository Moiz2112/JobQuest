import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import Footer from './shared/Footer';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        console.log("========== FILTER DEBUG ==========");
        console.log("All Jobs Count:", allJobs?.length);
        console.log("All Jobs:", allJobs);
        console.log("Searched Query:", JSON.stringify(searchedQuery));
        
        if (!searchedQuery || searchedQuery.trim() === '') {
            console.log("No search query - showing all jobs");
            setFilterJobs(allJobs || []);
            return;
        }
        
        const query = searchedQuery.toLowerCase().trim();
        console.log("Filtering with query:", query);
        
        const filteredJobs = (allJobs || []).filter((job) => {
            // Handle null/undefined jobs
            if (!job) return false;
            
            // Debug: log each job's location
            console.log(`Job: "${job?.title}" | Location: "${job?.location}" | Type: ${typeof job?.location}`);
            
            // Check if query matches location
            if (job?.location) {
                const jobLocation = String(job.location).toLowerCase().trim();
                if (jobLocation === query || jobLocation.includes(query)) {
                    console.log(`✓ MATCH FOUND: Location "${jobLocation}" matches query "${query}"`);
                    return true;
                }
            }
            
            // Check if query matches job title
            if (job?.title && String(job.title).toLowerCase().includes(query)) {
                console.log(`✓ MATCH FOUND: Title matches`);
                return true;
            }
            
            // Check if query matches description
            if (job?.description && String(job.description).toLowerCase().includes(query)) {
                console.log(`✓ MATCH FOUND: Description matches`);
                return true;
            }
            
            // Check if query is a salary range filter
            const salaryRanges = {
                "0-40k": { min: 0, max: 40000 },
                "40k-1 lakh": { min: 40000, max: 100000 },
                "1 lakh-5 lakh": { min: 100000, max: 500000 },
                "5 lakh+": { min: 500000, max: Infinity }
            };
            
            if (salaryRanges[query]) {
                const salary = job?.salary;
                if (salary && typeof salary === 'object') {
                    const jobMinSalary = salary.min || 0;
                    const jobMaxSalary = salary.max || 0;
                    const range = salaryRanges[query];
                    
                    if (jobMaxSalary >= range.min && jobMinSalary <= range.max) {
                        console.log(`✓ MATCH FOUND: Salary range matches`);
                        return true;
                    }
                }
            }
            
            return false;
        });
        
        console.log(`FINAL RESULT: ${filteredJobs.length} jobs matched`);
        console.log("Filtered Jobs:", filteredJobs);
        console.log("===================================");
        
        setFilterJobs(filteredJobs);
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Jobs