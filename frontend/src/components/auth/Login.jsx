import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '@/utils/apiClient'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Footer from '../shared/Footer'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student",
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await apiClient.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate(input.role === 'recruiter' ? '/admin/dashboard' : '/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            const errorMsg = error.response?.data?.message || error.message || "Login failed";
            toast.error(errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate(user.role === 'recruiter' ? '/admin/companies' : '/');
        }
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }

    return (
        <div>
            <Navbar />
            <section className="min-h-[calc(100vh-80px)] flex items-center justify-center pt-20 pb-20 px-4 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl opacity-10 -z-10" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-10 -z-10" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 backdrop-blur-sm"
                    >
                        {/* Header */}
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm">Sign in to your JobQuest account</p>
                        </motion.div>

                        <form onSubmit={submitHandler} className="space-y-5">
                            {/* Role Selection */}
                            <motion.div variants={itemVariants} className="flex gap-3">
                                {['student', 'recruiter'].map((r) => (
                                    <motion.button
                                        key={r}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setInput({ ...input, role: r })}
                                        className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                                            input.role === r
                                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {r === 'student' ? '👨‍🎓 Student' : '💼 Recruiter'}
                                    </motion.button>
                                ))}
                            </motion.div>

                            {/* Email Input */}
                            <motion.div variants={itemVariants}>
                                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <Input
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Password Input */}
                            <motion.div variants={itemVariants}>
                                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Remember & Forgot */}
                            <motion.div variants={itemVariants} className="flex justify-between items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-purple-600" />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link to="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
                                    Forgot password?
                                </Link>
                            </motion.div>

                            {/* Login Button */}
                            <motion.div variants={itemVariants}>
                                {loading ? (
                                    <Button disabled className="w-full py-3 bg-gray-400 text-white font-bold rounded-lg">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Signing in...
                                    </Button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                                    >
                                        Sign In
                                    </motion.button>
                                )}
                            </motion.div>

                            {/* Signup Link */}
                            <motion.div variants={itemVariants} className="text-center">
                                <span className="text-gray-600 text-sm">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                                        Sign up
                                    </Link>
                                </span>
                            </motion.div>
                        </form>
                    </motion.div>

                    {/* Bottom decorative text */}
                    <motion.p
                        variants={itemVariants}
                        className="text-center text-gray-500 text-xs mt-6"
                    >
                        JobQuest © 2026 | Your Dream Job Awaits
                    </motion.p>
                </motion.div>
            </section>
            <Footer />
        </div>
    )
}

export default Login