import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate inputs
            if (!formData.email || !formData.password) {
                setError('Please fill in all fields');
                setLoading(false);
                return;
            }

            // Call admin login API
            const res = await apiClient.post(
                'http://localhost:3001/api/v1/admin/login',
                formData,
                { withCredentials: true }
            );

            if (res.data.success) {
                // Store admin user in Redux
                dispatch(setUser({
                    ...res.data.admin,
                    role: 'admin'
                }));

                toast.success('Admin login successful');
                navigate('/admin');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
            {/* Animated background */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md relative z-10'
            >
                <Card className='border-0 shadow-2xl bg-white/95 backdrop-blur-sm'>
                    <CardHeader className='space-y-2'>
                        <div className='flex items-center justify-center mb-4'>
                            <div className='w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center'>
                                <Lock className='w-8 h-8 text-white' />
                            </div>
                        </div>
                        <CardTitle className='text-center text-2xl'>Admin Portal</CardTitle>
                        <CardDescription className='text-center'>
                            Platform Administration Login
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'
                            >
                                <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                                <p className='text-sm text-red-700'>{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {/* Email */}
                            <div className='space-y-2'>
                                <Label className='flex items-center gap-2 text-sm font-medium'>
                                    <Mail className='w-4 h-4' />
                                    Admin Email
                                </Label>
                                <Input
                                    type='email'
                                    name='email'
                                    placeholder='admin@jobquest.com'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className='border-gray-200'
                                />
                            </div>

                            {/* Password */}
                            <div className='space-y-2'>
                                <Label className='flex items-center gap-2 text-sm font-medium'>
                                    <Lock className='w-4 h-4' />
                                    Password
                                </Label>
                                <div className='relative'>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name='password'
                                        placeholder='Enter your password'
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className='border-gray-200 pr-10'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type='submit'
                                disabled={loading}
                                className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                        Logging in...
                                    </>
                                ) : (
                                    'Admin Login'
                                )}
                            </Button>

                            {/* Divider */}
                            <div className='relative my-4'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-gray-200'></div>
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span className='px-2 bg-white text-gray-500'>Other Options</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className='space-y-2 text-center text-sm'>
                                <p className='text-gray-600'>
                                    Looking for recruiter portal?{' '}
                                    <button
                                        type='button'
                                        onClick={() => navigate('/signup')}
                                        className='text-purple-600 hover:text-purple-700 font-semibold'
                                    >
                                        Recruiter Sign Up
                                    </button>
                                </p>
                                <p className='text-gray-600'>
                                    Job seeker?{' '}
                                    <button
                                        type='button'
                                        onClick={() => navigate('/')}
                                        className='text-purple-600 hover:text-purple-700 font-semibold'
                                    >
                                        Back to Home
                                    </button>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <div className='mt-6 text-center text-white/80 text-sm'>
                    <p>🔐 Secure Admin Access Only</p>
                    <p className='mt-2 opacity-70'>This portal is for authorized administrators only</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
