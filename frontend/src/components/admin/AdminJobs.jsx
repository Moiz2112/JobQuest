import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { motion } from 'framer-motion'
import { Plus, Briefcase } from 'lucide-react'
import Footer from '../shared/Footer'

const AdminJobs = () => {
  useGetAllAdminJobs()
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSearchJobByText(input))
  }, [input])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <Navbar />

      <main className="max-w-5xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-16">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500
                            flex items-center justify-center shadow-md">
              <Briefcase size={20} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Jobs
            </h1>
          </div>
          <p className="text-gray-400 text-sm ml-[52px]">
            Manage and view all your posted jobs
          </p>
        </motion.div>

        {/* Search + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="flex items-center justify-between gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Filter by name, role..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
                         text-gray-700 placeholder:text-gray-400 focus:outline-none
                         focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/admin/jobs/create')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                       bg-gradient-to-r from-violet-600 to-purple-500 shadow-lg shadow-violet-200
                       transition-all duration-200 whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Job
          </motion.button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <AdminJobsTable />
        </motion.div>

      </main>
      <Footer />
    </div>
  )
}

export default AdminJobs