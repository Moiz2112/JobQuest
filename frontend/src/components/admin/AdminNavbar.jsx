import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/authSlice'
import { Button } from '../ui/button'
import { Bell, Settings, LogOut, Menu, User } from 'lucide-react'
import { toast } from 'sonner'
import apiClient from '@/utils/apiClient'

const AdminNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const handleLogout = async () => {
        try {
            await apiClient.get('http://localhost:3001/api/v1/user/logout');
            dispatch(logout());
            navigate('/admin-login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <nav className='fixed top-0 left-0 right-0 h-20 bg-white border-b border-gray-200 shadow-sm z-50'>
            <div className='h-full px-6 flex items-center justify-between'>
                {/* Logo */}
                <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center'>
                        <span className='text-white font-bold text-lg'>JQ</span>
                    </div>
                    <div>
                        <p className='text-sm font-semibold text-gray-900'>JobQuest</p>
                        <p className='text-xs text-gray-500'>Admin Panel</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-4'>
                    {/* Notifications */}
                    <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors relative'>
                        <Bell size={20} className='text-gray-600' />
                        <span className='absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full'></span>
                    </button>

                    {/* Settings (go to admin profile) */}
                    <button 
                        onClick={() => navigate('/admin/profile')}
                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                    >
                        <Settings size={20} className='text-gray-600' />
                    </button>

                    {/* User Profile */}
                    <div className='relative'>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className='flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            <div className='w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center'>
                                <User size={18} className='text-white' />
                            </div>
                            <span className='text-sm font-medium text-gray-700'>{user?.fullname || 'Admin'}</span>
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className='absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg'>
                                <div className='p-4 border-b border-gray-200'>
                                    <p className='text-sm font-semibold text-gray-900'>{user?.fullname}</p>
                                    <p className='text-xs text-gray-500'>{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className='w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm'
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
