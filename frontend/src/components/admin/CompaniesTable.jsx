import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Building2, ChevronRight } from 'lucide-react'

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: i => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.07, ease: [0.25, 1, 0.5, 1] }
  }),
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } }
}

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(store => store.company)
  const [filterCompanies, setFilterCompanies] = useState(companies)
  const navigate = useNavigate()

  useEffect(() => {
    const filtered = companies?.filter(c =>
      !searchCompanyByText
        ? true
        : c?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    )
    setFilterCompanies(filtered)
  }, [companies, searchCompanyByText])

  if (!filterCompanies?.length) {
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
          <Building2 size={26} className="text-violet-400" />
        </motion.div>
        <p className="font-bold text-gray-800 text-base">No companies registered yet</p>
        <p className="text-gray-400 text-sm mt-1 max-w-xs">
          Add your first company to get started posting jobs
        </p>
      </motion.div>
    )
  }

  return (
    <>
      {/* Table Header */}
      <div className="grid grid-cols-[80px_1fr_1fr_80px] px-6 py-3.5 border-b border-gray-100 bg-gray-50/60">
        {['Logo', 'Company Name', 'Registered Date', 'Action'].map((h, i) => (
          <span key={h}
            className={`text-xs font-bold uppercase tracking-widest text-gray-400 ${i === 3 ? 'text-right' : ''}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <AnimatePresence mode="popLayout">
        {filterCompanies.map((company, i) => (
          <motion.div
            key={company._id}
            custom={i}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="grid grid-cols-[80px_1fr_1fr_80px] items-center px-6 py-4
                       border-b border-gray-100 last:border-0 hover:bg-violet-50/30
                       transition-colors duration-200 group"
          >
            {/* Logo */}
            <div>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100
                              shadow-sm group-hover:shadow-md transition-shadow duration-200">
                {company?.logo ? (
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={company.logo} className="object-cover w-full h-full" />
                  </Avatar>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100
                                  flex items-center justify-center">
                    <span className="text-violet-600 font-black text-sm">
                      {company?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <span className="font-bold text-gray-900 text-sm group-hover:text-violet-600
                               transition-colors duration-200">
                {company?.name}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse flex-shrink-0" />
              <span className="text-sm text-gray-500">
                {company?.createdAt?.split('T')[0]}
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
                <PopoverContent className="w-40 p-1.5 rounded-xl border border-gray-100 shadow-xl bg-white">
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => navigate(`/admin/companies/${company._id}`)}
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
                </PopoverContent>
              </Popover>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Footer count */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        <p className="text-xs text-gray-400 font-medium">
          You have registered{' '}
          <strong className="text-violet-600 font-bold">{filterCompanies.length}</strong>{' '}
          {filterCompanies.length === 1 ? 'company' : 'companies'}
        </p>
      </div>
    </>
  )
}

export default CompaniesTable