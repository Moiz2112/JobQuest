# JobQuest - Code Snippets for Remaining Components

## 1. LOGIN PAGE TEMPLATE

```jsx
// frontend/src/components/auth/Login.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import apiClient from '@/utils/apiClient'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser, setLoading } from '@/redux/authSlice'
import { toast } from 'sonner'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('student')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogin = async (e) => {
        e.preventDefault()
        
        try {
            dispatch(setLoading(true))
            const res = await apiClient.post(
                `${USER_API_END_POINT}/login`,
                { email, password, role },
                { headers: { 'Content-Type': 'application/json' } }
            )
            
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                navigate(role === 'recruiter' ? '/admin/jobs' : '/')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            dispatch(setLoading(false))
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    return (
        <section className="min-h-screen flex items-center justify-center pt-20 px-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                {/* Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 mt-2">Sign in to continue to JobQuest</p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Role Selection */}
                        <motion.div variants={itemVariants} className="flex gap-4">
                            {['student', 'recruiter'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                                        role === r
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </motion.div>

                        {/* Email Input */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember & Forgot */}
                        <motion.div variants={itemVariants} className="flex justify-between items-center">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                <span className="text-sm text-gray-700">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                Forgot password?
                            </Link>
                        </motion.div>

                        {/* Login Button */}
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                        >
                            Sign In
                        </motion.button>

                        {/* Signup Link */}
                        <motion.div variants={itemVariants} className="text-center">
                            <span className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
                                    Sign up
                                </Link>
                            </span>
                        </motion.div>
                    </form>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-20 -z-10" />
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10" />
            </motion.div>
        </section>
    )
}

export default Login
```

---

## 2. JOB POSTING FORM TEMPLATE

```jsx
// frontend/src/pages/admin/PostJob.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import apiClient from '@/utils/apiClient'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const PostJob = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: { min: '', max: '', currency: 'PKR' },
        location: 'Islamabad',
        jobType: 'Full-time',
        workMode: 'Onsite',
        experienceLevel: 'Entry-level',
        category: '',
        industry: '',
        position: 1,
        skills: '',
        companyId: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.includes('salary.')) {
            const key = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                salary: { ...prev.salary, [key]: value }
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            setLoading(true)
            const payload = {
                ...formData,
                requirements: formData.requirements.split(','),
                skills: formData.skills.split(','),
                salary: {
                    min: parseInt(formData.salary.min),
                    max: parseInt(formData.salary.max),
                    currency: formData.salary.currency
                }
            }

            const res = await apiClient.post(
                `${JOB_API_END_POINT}/post`,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (res.data.success) {
                toast.success('Job posted successfully!')
                navigate('/admin/jobs')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post job')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="min-h-screen bg-gray-50 pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
                    <p className="text-gray-600 mb-8">Fill in the details below to create a new job posting</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                placeholder="e.g., Senior React Developer"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                placeholder="Describe the job role, responsibilities, and what you're looking for..."
                                required
                            />
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location *
                                </label>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                >
                                    {['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'].map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Job Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Type *
                                </label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                >
                                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Work Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Work Mode *
                                </label>
                                <select
                                    name="workMode"
                                    value={formData.workMode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                >
                                    {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                                        <option key={mode} value={mode}>{mode}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Experience Level *
                                </label>
                                <select
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                >
                                    {['Entry-level', 'Mid-level', 'Senior', 'Executive'].map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Salary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Minimum Salary *
                                </label>
                                <input
                                    type="number"
                                    name="salary.min"
                                    value={formData.salary.min}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                    placeholder="50000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Maximum Salary *
                                </label>
                                <input
                                    type="number"
                                    name="salary.max"
                                    value={formData.salary.max}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                    placeholder="100000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Currency
                                </label>
                                <input
                                    type="text"
                                    name="salary.currency"
                                    value={formData.salary.currency}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                                    placeholder="PKR"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post Job'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </section>
    )
}

export default PostJob
```

---

## 3. FILTER COMPONENT TEMPLATE

```jsx
// frontend/src/components/FilterCard.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FilterCard = ({ filters, onChange }) => {
    const locations = ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']
    const workModes = ['Remote', 'Hybrid', 'Onsite']
    const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Executive']

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 sticky top-20"
        >
            <h3 className="font-bold text-lg mb-6 text-gray-900">Filters</h3>

            {/* Location Filter */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Location</h4>
                <div className="space-y-2">
                    {locations.map(loc => (
                        <label key={loc} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="location"
                                value={loc}
                                onChange={(e) => onChange('location', e.target.value)}
                                className="w-4 h-4 text-purple-600"
                            />
                            <span className="text-gray-700">{loc}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Job Type Filter */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Job Type</h4>
                <div className="space-y-2">
                    {jobTypes.map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                value={type}
                                onChange={(e) => onChange('jobType', e.target.value)}
                                className="w-4 h-4 text-purple-600 rounded"
                            />
                            <span className="text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Salary Range Filter */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Salary Range</h4>
                <div className="space-y-2">
                    <input
                        type="number"
                        placeholder="Min"
                        onChange={(e) => onChange('salaryMin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        onChange={(e) => onChange('salaryMax', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => onChange('reset', null)}
                className="w-full py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
                Clear All Filters
            </button>
        </motion.div>
    )
}

export default FilterCard
```

---

## 4. BACKEND ROUTE SETUP TEMPLATE

```javascript
// backend/routes/user.route.js - Add these routes

import express from 'express'
import { 
    register, 
    login, 
    logout, 
    updateProfile,
    addEducation,
    addExperience,
    updateResume,
    saveJob,
    unsaveJob,
    getSavedJobs,
    getProfile
} from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import multer from 'multer'
import getDataUri from '../utils/datauri.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Auth routes
router.route('/register').post(upload.single('file'), register)
router.route('/login').post(login)
router.route('/logout').get(logout)

// Profile routes (Protected)
router.route('/profile').get(isAuthenticated, getProfile)
router.route('/profile/update').post(isAuthenticated, upload.single('file'), updateProfile)
router.route('/profile/education').post(isAuthenticated, addEducation)
router.route('/profile/experience').post(isAuthenticated, addExperience)
router.route('/profile/resume').post(isAuthenticated, upload.single('resume'), updateResume)

// Job saving routes (Protected)
router.route('/jobs/save/:jobId').post(isAuthenticated, saveJob)
router.route('/jobs/unsave/:jobId').post(isAuthenticated, unsaveJob)
router.route('/jobs/saved').get(isAuthenticated, getSavedJobs)

export default router
```

---

## KEY POINTS FOR IMPLEMENTATION

1. **Always import from correct paths** - Use `@/` for absolute imports
2. **Handle loading states** - Show spinners during API calls
3. **Validate form inputs** - Both frontend and backend
4. **Show error messages** - Use toast notifications
5. **Use proper typing** - TypeScript would be better but not required
6. **Test with real data** - Don't just test with empty forms
7. **Mobile first** - Design for mobile then expand to desktop
8. **Performance** - Use lazy loading and pagination

---

## NEXT COMPONENTS TO CREATE (Priority Order)

1. `frontend/src/components/auth/Signup.jsx`
2. `frontend/src/pages/Jobs.jsx` (with search & filtering)
3. `frontend/src/pages/Profile.jsx`
4. `frontend/src/pages/AppliedJobs.jsx`
5. `frontend/src/pages/admin/AdminDashboard.jsx`
6. `frontend/src/pages/admin/AdminJobs.jsx`
7. `frontend/src/pages/admin/Applicants.jsx`
8. `frontend/src/components/JobDescription.jsx`
9. `frontend/src/components/UpdateProfileDialog.jsx`
10. `frontend/src/components/Footer.jsx` (Modern animated footer)

---

## API ENDPOINTS REFERENCE

```
Auth:
POST /api/v1/user/register
POST /api/v1/user/login
GET /api/v1/user/logout
GET /api/v1/user/profile

Jobs:
GET /api/v1/job/get
POST /api/v1/job/post
PUT /api/v1/job/:id
DELETE /api/v1/job/:id
GET /api/v1/job/:id
GET /api/v1/job/admin/jobs
GET /api/v1/job/:id/applicants

Applications:
POST /api/v1/application/apply/:id
GET /api/v1/application/get
PUT /api/v1/application/:id/status
POST /api/v1/application/:id/interview

Companies:
POST /api/v1/company/register
GET /api/v1/company/get
GET /api/v1/company/get/:id
PUT /api/v1/company/:id
GET /api/v1/company/:id/stats
```

---

Happy coding! 🚀
