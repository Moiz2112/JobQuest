import React, { useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { Settings, Shield, Bell, Lock, User, Save } from 'lucide-react'
import { toast } from 'sonner'

const AdminSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        fullname: 'Platform Admin',
        email: 'admin@jobquest.com',
        phone: '+1-800-ADMIN-00',
        newPassword: '',
        confirmPassword: '',
        notifications: true,
        emailAlerts: true,
        securityAlerts: true
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Password changed successfully');
            setFormData(prev => ({
                ...prev,
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            toast.error('Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className='flex h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
            <AdminDashboardSidebar />

            <div className='flex-1 flex flex-col ml-64'>
                <AdminNavbar />

                <div className='flex-1 overflow-auto p-8'>
                    <div className='max-w-4xl mx-auto'>
                        {/* Header */}
                        <div className='mb-8'>
                            <h1 className='text-3xl font-bold text-slate-900'>Settings</h1>
                            <p className='text-slate-600'>Manage your admin account and preferences</p>
                        </div>

                        {/* Tabs */}
                        <div className='flex gap-4 mb-8 border-b border-gray-200'>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                                    activeTab === 'profile'
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <User className='inline mr-2' size={18} />
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                                    activeTab === 'security'
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Lock className='inline mr-2' size={18} />
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                                    activeTab === 'notifications'
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Bell className='inline mr-2' size={18} />
                                Notifications
                            </button>
                        </div>

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className='shadow-lg'>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <User size={20} />
                                            Profile Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-6'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Full Name
                                                </label>
                                                <Input
                                                    type='text'
                                                    name='fullname'
                                                    value={formData.fullname}
                                                    onChange={handleInputChange}
                                                    className='w-full'
                                                />
                                            </div>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Email Address
                                                </label>
                                                <Input
                                                    type='email'
                                                    name='email'
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled
                                                    className='w-full'
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Phone Number
                                            </label>
                                            <Input
                                                type='tel'
                                                name='phone'
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className='w-full'
                                            />
                                        </div>

                                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                                            <p className='text-sm text-blue-700'>
                                                ✓ Your account has admin privileges with full platform access
                                            </p>
                                        </div>

                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className='bg-purple-600 hover:bg-purple-700 flex items-center gap-2'
                                        >
                                            <Save size={16} />
                                            {isSaving ? 'Saving...' : 'Save Profile'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className='shadow-lg'>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <Shield size={20} />
                                            Security Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                New Password
                                            </label>
                                            <Input
                                                type='password'
                                                name='newPassword'
                                                placeholder='Enter new password'
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                className='w-full'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Confirm Password
                                            </label>
                                            <Input
                                                type='password'
                                                name='confirmPassword'
                                                placeholder='Confirm new password'
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className='w-full'
                                            />
                                        </div>

                                        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                                            <p className='text-sm text-yellow-700 font-medium mb-2'>Password Requirements:</p>
                                            <ul className='text-sm text-yellow-700 space-y-1'>
                                                <li>✓ At least 6 characters</li>
                                                <li>✓ Mix of uppercase and lowercase letters</li>
                                                <li>✓ At least one number or special character</li>
                                            </ul>
                                        </div>

                                        <Button
                                            onClick={handleChangePassword}
                                            disabled={isSaving}
                                            className='bg-red-600 hover:bg-red-700 flex items-center gap-2'
                                        >
                                            <Lock size={16} />
                                            {isSaving ? 'Changing...' : 'Change Password'}
                                        </Button>

                                        <div className='border-t pt-6 mt-6'>
                                            <h3 className='font-semibold text-gray-900 mb-3'>Active Sessions</h3>
                                            <div className='bg-gray-50 rounded-lg p-4'>
                                                <div className='flex justify-between items-center'>
                                                    <div>
                                                        <p className='font-medium text-gray-900'>Current Session</p>
                                                        <p className='text-sm text-gray-500'>Windows • Chrome</p>
                                                    </div>
                                                    <Badge className='bg-green-100 text-green-800'>Active</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className='shadow-lg'>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <Bell size={20} />
                                            Notification Preferences
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                                            <div>
                                                <p className='font-medium text-gray-900'>Platform Notifications</p>
                                                <p className='text-sm text-gray-500'>Get notified about platform updates and announcements</p>
                                            </div>
                                            <input
                                                type='checkbox'
                                                name='notifications'
                                                checked={formData.notifications}
                                                onChange={handleInputChange}
                                                className='w-6 h-6 cursor-pointer'
                                            />
                                        </div>

                                        <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                                            <div>
                                                <p className='font-medium text-gray-900'>Email Alerts</p>
                                                <p className='text-sm text-gray-500'>Receive important updates via email</p>
                                            </div>
                                            <input
                                                type='checkbox'
                                                name='emailAlerts'
                                                checked={formData.emailAlerts}
                                                onChange={handleInputChange}
                                                className='w-6 h-6 cursor-pointer'
                                            />
                                        </div>

                                        <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                                            <div>
                                                <p className='font-medium text-gray-900'>Security Alerts</p>
                                                <p className='text-sm text-gray-500'>Get alerts for suspicious activities and security events</p>
                                            </div>
                                            <input
                                                type='checkbox'
                                                name='securityAlerts'
                                                checked={formData.securityAlerts}
                                                onChange={handleInputChange}
                                                className='w-6 h-6 cursor-pointer'
                                            />
                                        </div>

                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className='bg-purple-600 hover:bg-purple-700 w-full flex items-center justify-center gap-2'
                                        >
                                            <Save size={16} />
                                            {isSaving ? 'Saving...' : 'Save Preferences'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
