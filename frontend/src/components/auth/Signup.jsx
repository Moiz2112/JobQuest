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
import { setLoading } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone, Upload } from 'lucide-react'
import Footer from '../shared/Footer'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
        
        // Create preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await apiClient.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" }
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            const errorMsg = error.response?.data?.message || error.message || "Registration failed";
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
            transition: { staggerChildren: 0.08, delayChildren: 0.2 }
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
                <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-10 -z-10" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-10 -z-10" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-lg"
                >
                    {/* Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 backdrop-blur-sm"
                    >
                        {/* Header */}
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">
                                Join JobQuest
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm">Create your account and find your dream job</p>
                        </motion.div>

                        <form onSubmit={submitHandler} className="space-y-4">
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

                            {/* Full Name */}
                            <motion.div variants={itemVariants}>
                                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <Input
                                        type="text"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Email */}
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

                            {/* Phone Number */}
                            <motion.div variants={itemVariants}>
                                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <Input
                                        type="tel"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                                        placeholder="+92 300 1234567"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Password */}
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

                            {/* Profile Photo Upload */}
                            <motion.div variants={itemVariants}>
                                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Profile Photo
                                </Label>
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-3 hover:border-purple-500 transition-colors cursor-pointer">
                                            <input
                                                accept="image/*"
                                                type="file"
                                                onChange={changeFileHandler}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Upload size={16} />
                                                <span>Click to upload photo</span>
                                            </div>
                                        </div>
                                    </div>
                                    {filePreview && (
                                        <motion.img
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            src={filePreview}
                                            alt="Preview"
                                            className="w-14 h-14 rounded-lg object-cover border-2 border-purple-500"
                                        />
                                    )}
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div variants={itemVariants} className="pt-2">
                                {loading ? (
                                    <Button disabled className="w-full py-3 bg-gray-400 text-white font-bold rounded-lg">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Creating account...
                                    </Button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                                    >
                                        Create Account
                                    </motion.button>
                                )}
                            </motion.div>

                            {/* Login Link */}
                            <motion.div variants={itemVariants} className="text-center">
                                <span className="text-gray-600 text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                                        Sign in
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
                        JobQuest © 2026 | Secure & Privacy-First
                    </motion.p>
                </motion.div>
            </section>
            <Footer />
        </div>
    )
}

export default Signup