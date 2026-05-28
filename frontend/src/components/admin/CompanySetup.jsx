import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '@/utils/apiClient'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Globe, MapPin, FileText, ImagePlus, Loader2 } from 'lucide-react'
import Footer from '../shared/Footer'

const FIELDS = [
  { name: 'name',        label: 'Company Name', icon: Building2, type: 'text',  placeholder: 'e.g. Cirronex' },
  { name: 'description', label: 'Description',  icon: FileText,  type: 'text',  placeholder: 'What does your company do?' },
  { name: 'website',     label: 'Website',      icon: Globe,     type: 'url',   placeholder: 'https://yourcompany.com' },
  { name: 'location',    label: 'Location',     icon: MapPin,    type: 'text',  placeholder: 'City, Country' },
]

const CompanySetup = () => {
  const params = useParams()
  useGetCompanyById(params.id)
  const { singleCompany } = useSelector(store => store.company)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [input, setInput] = useState({
    name: '', description: '', website: '', location: '', file: null
  })

  useEffect(() => {
    setInput({
      name:        singleCompany.name        || '',
      description: singleCompany.description || '',
      website:     singleCompany.website     || '',
      location:    singleCompany.location    || '',
      file:        null,
    })
    if (singleCompany.logo) setPreview(singleCompany.logo)
  }, [singleCompany])

  const changeEventHandler = e =>
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const changeFileHandler = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setInput(prev => ({ ...prev, file }))
    setPreview(URL.createObjectURL(file))
  }

  const submitHandler = async e => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(input).forEach(([k, v]) => { if (v) formData.append(k === 'file' ? 'file' : k, v) })
    try {
      setLoading(true)
      const res = await apiClient.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/admin/companies')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <Navbar />

      <main className="max-w-2xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-16">

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
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500
                              flex items-center justify-center shadow-md flex-shrink-0">
                <Building2 size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Company Setup</h1>
            </div>
            <p className="text-gray-400 text-sm ml-[52px]">Update your company profile information</p>
          </div>

          <form onSubmit={submitHandler} className="px-8 py-6 space-y-5">

            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Company Logo
              </label>
              <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200
                               hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-200 cursor-pointer group">
                <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0
                                bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus size={22} className="text-violet-300 group-hover:text-violet-500 transition-colors" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-violet-600 transition-colors">
                    {preview ? 'Change logo' : 'Upload logo'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
                </div>
                <input type="file" accept="image/*" onChange={changeFileHandler} className="hidden" />
              </label>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map(({ name, label, icon: Icon, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={type}
                      name={name}
                      value={input[name]}
                      onChange={changeEventHandler}
                      placeholder={placeholder}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none
                                 focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                                 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/companies')}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold
                           text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                           text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-500
                           shadow-lg shadow-violet-200 transition-all duration-200 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving...</>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

      </main>
      <Footer />
    </div>
  )
}

export default CompanySetup