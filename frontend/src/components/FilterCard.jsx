import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { motion } from 'framer-motion'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Islamabad", "Lahore", "Karachi", "Rawalpindi", "Faisalabad", "Peshawar", "Multan", "Quetta"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "Design", "Product"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "40k-1 Lakh", "1 Lakh-5 Lakh", "5 Lakh+"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [expandedSections, setExpandedSections] = useState({ 0: true, 1: false, 2: false });
    const dispatch = useDispatch();
    
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    
    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    }

    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);

    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='w-full glass-lg p-6 sticky top-24'
        >
            <div className='space-y-6'>
                <div>
                    <h1 className='heading-md bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                        🔍 Filter Jobs
                    </h1>
                    <div className='h-1 w-12 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full' />
                </div>

                <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                    {
                        fitlerData.map((data, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className='border-b border-white/20 pb-4 last:border-b-0'
                            >
                                <motion.button
                                    onClick={() => toggleSection(index)}
                                    className='w-full flex items-center justify-between py-2 hover:text-purple-600 transition-colors'
                                >
                                    <h2 className='font-bold text-gray-900 hover:text-purple-600 transition-colors'>
                                        {data.fitlerType}
                                    </h2>
                                    <motion.span
                                        animate={{ rotate: expandedSections[index] ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='text-purple-600'
                                    >
                                        ▼
                                    </motion.span>
                                </motion.button>

                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                        height: expandedSections[index] ? 'auto' : 0,
                                        opacity: expandedSections[index] ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className='overflow-hidden'
                                >
                                    <div className='pt-3 space-y-3'>
                                        {
                                            data.array.map((item, idx) => {
                                                const itemId = `id${index}-${idx}`
                                                return (
                                                    <motion.div
                                                        key={itemId}
                                                        whileHover={{ x: 4 }}
                                                        className='flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-100/50 transition-colors group'
                                                    >
                                                        <motion.div
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <RadioGroupItem 
                                                                value={item} 
                                                                id={itemId}
                                                                className='border-2 border-purple-300 group-hover:border-purple-600'
                                                            />
                                                        </motion.div>
                                                        <Label 
                                                            htmlFor={itemId}
                                                            className='cursor-pointer font-medium text-gray-700 group-hover:text-purple-600 transition-colors'
                                                        >
                                                            {item}
                                                        </Label>
                                                        {selectedValue === item && (
                                                            <motion.span
                                                                layoutId="active-filter"
                                                                className='ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600'
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                            />
                                                        )}
                                                    </motion.div>
                                                )
                                            })
                                        }
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))
                    }
                </RadioGroup>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setSelectedValue('');
                        dispatch(setSearchedQuery(''));
                    }}
                    className='w-full py-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 font-semibold hover:shadow-lg transition-all text-sm mt-6'
                >
                    ✕ Clear Filters
                </motion.button>
            </div>
        </motion.div>
    )
}

export default FilterCard