import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Briefcase, ChevronRight } from 'lucide-react'

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: i => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.07, ease: [0.25, 1, 0.5, 1] }
  }),
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } }
}

const getInitialColor = name => {
  const palettes = [
    'from-violet-500 to-purple-400',
    'from-sky-500 to-blue-400',
    'from-emerald-500 to-teal-400',
    'from-rose-500 to-pink-400',
    'from-amber-500 to-orange-400',
  ]
  if (!name) return palettes[0]
  return palettes[name.charCodeAt(0) % palettes.length]
}

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job)
  const [filterJobs, setFilterJobs] = useState(allAdminJobs)
  const navigate = useNavigate()

  useEffect(() => {
    const filtered = allAdminJobs?.filter(job =>
      !searchJobByText
        ? true
        : job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
    )
    setFilterJobs(filtered)
  }, [allAdminJobs, searchJobByText])

  if (!filterJobs?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center px-6"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-4"
        >
          <Briefcase size={26} className="text-violet-400" />
        </motion.div>
        <p className="font-bold text-gray-800 text-base">No jobs posted yet</p>
        <p className="text-gray-400 text-sm mt-1 max-w-xs">
          Post your first job to start attracting talented candidates
        </p>
      </motion.div>
    )
  }

  return (
    <>
      {/* Table Header */}
      <div className="grid grid-cols-[80px_1fr_1fr_1fr_80px] px-6 py-3.5 border-b border-gray-100 bg-gray-50/60">
        {['Company', 'Job Title', 'Posted Date', 'Applicants', 'Action'].map((h, i) => (
          <span key={h}
            className={`text-xs font-bold uppercase tracking-widest text-gray-400 ${i === 4 ? 'text-right' : ''}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <AnimatePresence mode="popLayout">
        {filterJobs.map((job, i) => {
          const gradient = getInitialColor(job?.company?.name)
          const initial = job?.company?.name?.[0]?.toUpperCase() ?? '?'

          return (
            <motion.div
              key={job._id}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="grid grid-cols-[80px_1fr_1fr_1fr_80px] items-center px-6 py-4
                         border-b border-gray-100 last:border-0 hover:bg-violet-50/30
                         transition-colors duration-200 group"
            >
              {/* Company Logo Initial */}
              <div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient}
                                flex items-center justify-center shadow-sm
                                group-hover:shadow-md transition-shadow duration-200`}>
                  <span className="text-white font-black text-sm">{initial}</span>
                </div>
              </div>

              {/* Job Title */}
              <div>
                <span className="font-bold text-gray-900 text-sm group-hover:text-violet-600
                                 transition-colors duration-200">
                  {job?.title}
                </span>
                <p className="text-xs text-gray-400 mt-0.5">{job?.company?.name}</p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse flex-shrink-0" />
                <span className="text-sm text-gray-500">
                  {job?.createdAt?.split('T')[0]}
                </span>
              </div>

              {/* Applicants count */}
              <div>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">
                    {job?.applications?.length ?? 0}
                  </span>
                  applicant{job?.applications?.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Action */}
              <div className="flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center
                                 hover:bg-violet-100 transition-colors duration-200"
                    >
                      <MoreHorizontal size={17} className="text-gray-400 group-hover:text-violet-500 transition-colors" />
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-1.5 rounded-xl border border-gray-100 shadow-xl bg-white">
                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                                 hover:bg-violet-50 transition-colors group/item"
                    >
                      <div className="flex items-center gap-2">
                        <Edit2 size={14} className="text-violet-500" />
                        <span className="text-sm font-semibold text-gray-800 group-hover/item:text-violet-700">
                          Edit
                        </span>
                      </div>
                      <ChevronRight size={13} className="text-gray-300 group-hover/item:text-violet-400" />
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                                 hover:bg-violet-50 transition-colors group/item"
                    >
                      <div className="flex items-center gap-2">
                        <Eye size={14} className="text-pink-500" />
                        <span className="text-sm font-semibold text-gray-800 group-hover/item:text-violet-700">
                          Applicants
                        </span>
                      </div>
                      <ChevronRight size={13} className="text-gray-300 group-hover/item:text-pink-400" />
                    </motion.button>
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        <p className="text-xs text-gray-400 font-medium">
          You have posted{' '}
          <strong className="text-violet-600 font-bold">{filterJobs.length}</strong>{' '}
          job{filterJobs.length !== 1 ? 's' : ''}
        </p>
      </div>
    </>
  )
}

export default AdminJobsTable