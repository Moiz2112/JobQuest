import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import apiClient from '@/utils/apiClient'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Loader2 } from 'lucide-react'
import Footer from '../shared/Footer'

const CompanyCreate = () => {
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error('Please enter a company name')
      return
    }
    try {
      setLoading(true)
      const res = await apiClient.post(`${COMPANY_API_END_POINT}/register`, { name: companyName }, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company))
        toast.success(res.data.message)
        navigate(`/admin/companies/${res.data.company._id}`)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <Navbar />

      <main className="max-w-xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-16">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => navigate('/admin/companies')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-violet-600
                     transition-colors duration-200 mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Companies
        </motion.button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500
                            flex items-center justify-center shadow-md flex-shrink-0">
              <Building2 size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              New Company
            </h1>
          </div>
          <p className="text-gray-400 text-sm ml-[52px] mb-8">
            What would you like to name your company? You can change this later.
          </p>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && registerNewCompany()}
              placeholder="e.g. JobHunt, Microsoft..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                         text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none
                         focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                         focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/companies')}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold
                         text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={registerNewCompany}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                         text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-500
                         shadow-lg shadow-violet-200 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Creating...</>
              ) : (
                'Continue'
              )}
            </motion.button>
          </div>
        </motion.div>

      </main>
      <Footer />
    </div>
  )
}

export default CompanyCreate