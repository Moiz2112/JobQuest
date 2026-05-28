import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Bell, Lock, User, Mail, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import apiClient from '@/utils/apiClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const AdminSettings = () => {
    const { user } = useSelector(store => store.auth);
    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        weeklyReport: true,
        newApplicationAlerts: true
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        setSaveSuccess(false);
    };

    const handlePreferenceChange = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            // Mock API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Profile updated successfully');
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePreferences = async () => {
        try {
            setLoading(true);
            // Mock API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Preferences updated successfully');
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            toast.error('Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            // Mock API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            toast.error('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const SettingSection = ({ icon: Icon, title, description, children }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card className='border-0 shadow-md bg-white/60 backdrop-blur-sm mb-6'>
                <CardHeader>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-purple-100/50 rounded-lg'>
                            <Icon className='text-purple-600' size={20} />
                        </div>
                        <div>
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );

    const TabButton = ({ id, label, active }) => (
        <motion.button
            onClick={() => setActiveTab(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                active
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
            {label}
        </motion.button>
    );

    return (
        <>
            <AdminSidebar />
            <Navbar />
            <div className='min-h-screen bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-transparent pt-24 lg:ml-64'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20'>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8'
                    >
                        <h1 className='text-4xl font-bold text-gray-900 mb-2'>Settings</h1>
                        <p className='text-gray-600'>Manage your profile, preferences, and security settings</p>
                    </motion.div>

                    {/* Success Message */}
                    {saveSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'
                        >
                            <CheckCircle className='text-green-600' size={20} />
                            <p className='text-green-700 font-medium'>Changes saved successfully!</p>
                        </motion.div>
                    )}

                    {/* Tab Navigation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='flex gap-3 mb-8'
                    >
                        <TabButton id='profile' label='Profile' active={activeTab === 'profile'} />
                        <TabButton id='preferences' label='Preferences' active={activeTab === 'preferences'} />
                        <TabButton id='security' label='Security' active={activeTab === 'security'} />
                    </motion.div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <SettingSection
                                icon={User}
                                title='Profile Information'
                                description='Update your personal information'
                            >
                                <div className='space-y-4'>
                                    <div>
                                        <Label htmlFor='fullname'>Full Name</Label>
                                        <Input
                                            id='fullname'
                                            name='fullname'
                                            value={profileData.fullname}
                                            onChange={handleProfileChange}
                                            className='mt-2'
                                            placeholder='Your full name'
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor='email'>Email Address</Label>
                                        <Input
                                            id='email'
                                            name='email'
                                            type='email'
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className='mt-2'
                                            placeholder='your@email.com'
                                            disabled
                                        />
                                        <p className='text-xs text-gray-500 mt-1'>Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <Label htmlFor='phone'>Phone Number</Label>
                                        <Input
                                            id='phone'
                                            name='phoneNumber'
                                            value={profileData.phoneNumber}
                                            onChange={handleProfileChange}
                                            className='mt-2'
                                            placeholder='+92 300 1234567'
                                        />
                                    </div>

                                    <div className='pt-4'>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSaveProfile}
                                            disabled={loading}
                                            className='px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50'
                                        >
                                            {loading ? <Loader2 className='animate-spin' size={18} /> : 'Save Changes'}
                                        </motion.button>
                                    </div>
                                </div>
                            </SettingSection>
                        </motion.div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <SettingSection
                                icon={Bell}
                                title='Notification Preferences'
                                description='Choose how you want to receive updates'
                            >
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200'>
                                        <div>
                                            <p className='font-semibold text-gray-900'>Email Notifications</p>
                                            <p className='text-sm text-gray-600'>Receive updates via email</p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={preferences.emailNotifications}
                                                onChange={() => handlePreferenceChange('emailNotifications')}
                                                className='sr-only peer'
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>

                                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200'>
                                        <div>
                                            <p className='font-semibold text-gray-900'>SMS Notifications</p>
                                            <p className='text-sm text-gray-600'>Receive SMS alerts</p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={preferences.smsNotifications}
                                                onChange={() => handlePreferenceChange('smsNotifications')}
                                                className='sr-only peer'
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>

                                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200'>
                                        <div>
                                            <p className='font-semibold text-gray-900'>Weekly Reports</p>
                                            <p className='text-sm text-gray-600'>Get weekly insights and analytics</p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={preferences.weeklyReport}
                                                onChange={() => handlePreferenceChange('weeklyReport')}
                                                className='sr-only peer'
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>

                                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200'>
                                        <div>
                                            <p className='font-semibold text-gray-900'>Application Alerts</p>
                                            <p className='text-sm text-gray-600'>Alert on new applications</p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={preferences.newApplicationAlerts}
                                                onChange={() => handlePreferenceChange('newApplicationAlerts')}
                                                className='sr-only peer'
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>

                                    <div className='pt-4'>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSavePreferences}
                                            disabled={loading}
                                            className='px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50'
                                        >
                                            {loading ? <Loader2 className='animate-spin' size={18} /> : 'Save Preferences'}
                                        </motion.button>
                                    </div>
                                </div>
                            </SettingSection>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <SettingSection
                                icon={Lock}
                                title='Change Password'
                                description='Update your password to keep your account secure'
                            >
                                <div className='space-y-4'>
                                    <div>
                                        <Label htmlFor='currentPassword'>Current Password</Label>
                                        <Input
                                            id='currentPassword'
                                            name='currentPassword'
                                            type='password'
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className='mt-2'
                                            placeholder='Enter your current password'
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor='newPassword'>New Password</Label>
                                        <Input
                                            id='newPassword'
                                            name='newPassword'
                                            type='password'
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className='mt-2'
                                            placeholder='Enter your new password'
                                        />
                                        <p className='text-xs text-gray-500 mt-1'>At least 6 characters</p>
                                    </div>

                                    <div>
                                        <Label htmlFor='confirmPassword'>Confirm Password</Label>
                                        <Input
                                            id='confirmPassword'
                                            name='confirmPassword'
                                            type='password'
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className='mt-2'
                                            placeholder='Confirm your new password'
                                        />
                                    </div>

                                    <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3'>
                                        <AlertCircle className='text-blue-600 mt-0.5' size={18} />
                                        <p className='text-sm text-blue-700'>Make sure you use a strong password with uppercase, lowercase, and numbers</p>
                                    </div>

                                    <div className='pt-4'>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleChangePassword}
                                            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                                            className='px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50'
                                        >
                                            {loading ? <Loader2 className='animate-spin' size={18} /> : 'Change Password'}
                                        </motion.button>
                                    </div>
                                </div>
                            </SettingSection>

                            <SettingSection
                                icon={Lock}
                                title='Account Security'
                                description='Manage your account security settings'
                            >
                                <div className='space-y-3'>
                                    <div className='p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200'>
                                        <div>
                                            <p className='font-semibold text-gray-900'>Two-Factor Authentication</p>
                                            <p className='text-sm text-gray-600'>Add an extra layer of security</p>
                                        </div>
                                        <Button variant='outline' size='sm'>Enable</Button>
                                    </div>

                                    <div className='p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200'>
                                        <div>
                                            <p className='font-semibold text-gray-900'>Active Sessions</p>
                                            <p className='text-sm text-gray-600'>Manage your login sessions</p>
                                        </div>
                                        <Button variant='outline' size='sm'>View</Button>
                                    </div>
                                </div>
                            </SettingSection>
                        </motion.div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AdminSettings
