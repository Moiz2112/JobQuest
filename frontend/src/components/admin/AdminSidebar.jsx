import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, BarChart3, Users, Briefcase, Building2, Settings, Menu, X, LogOut } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/authSlice'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard/enhanced' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
        { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
        { id: 'applicants', label: 'Applicants', icon: Users, path: '/admin/all-applicants' },
        { id: 'companies', label: 'Companies', icon: Building2, path: '/admin/companies' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const handleLogout = async () => {
        try {
            const res = await apiClient.get('http://localhost:3001/api/v1/user/logout');
            if (res.data.success) {
                dispatch(logout());
                navigate('/login');
                toast.success('Logged out successfully');
            }
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='fixed top-20 left-4 z-40 lg:hidden p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                transition={{ duration: 0.3 }}
                className='fixed left-0 top-20 h-screen w-64 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl z-30 hidden lg:flex lg:translate-x-0 flex-col'
            >
                <div className='flex-1 overflow-y-auto pt-8 px-4'>
                    {/* User Info */}
                    <div className='mb-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20'>
                        <p className='text-sm text-purple-200'>Admin Panel</p>
                        <p className='text-lg font-bold text-white mt-1'>{user?.fullname}</p>
                        <p className='text-xs text-purple-300 mt-1'>{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <nav className='space-y-2'>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        active
                                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                                            : 'text-purple-100 hover:bg-white/10'
                                    }`}
                                >
                                    <Icon size={20} className={active ? 'text-white' : 'text-purple-300'} />
                                    <span className='font-medium text-sm'>{item.label}</span>
                                    {active && (
                                        <motion.div
                                            layoutId='activeIndicator'
                                            className='ml-auto w-1 h-6 bg-white rounded-full'
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className='p-4 border-t border-white/10'>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-200 rounded-lg transition-all font-semibold text-sm'
                    >
                        <LogOut size={18} />
                        Logout
                    </motion.button>
                </div>
            </motion.div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -400 }}
                        transition={{ duration: 0.3 }}
                        className='fixed left-0 top-20 h-screen w-64 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl z-30 lg:hidden flex flex-col'
                    >
                        <div className='flex-1 overflow-y-auto pt-8 px-4'>
                            {/* User Info */}
                            <div className='mb-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20'>
                                <p className='text-sm text-purple-200'>Admin Panel</p>
                                <p className='text-lg font-bold text-white mt-1'>{user?.fullname}</p>
                                <p className='text-xs text-purple-300 mt-1'>{user?.email}</p>
                            </div>

                            {/* Menu Items */}
                            <nav className='space-y-2'>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);

                                    return (
                                        <motion.button
                                            key={item.id}
                                            onClick={() => {
                                                navigate(item.path);
                                                setIsOpen(false);
                                            }}
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                                active
                                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                                                    : 'text-purple-100 hover:bg-white/10'
                                            }`}
                                        >
                                            <Icon size={20} className={active ? 'text-white' : 'text-purple-300'} />
                                            <span className='font-medium text-sm'>{item.label}</span>
                                            {active && (
                                                <motion.div
                                                    layoutId='activeIndicator'
                                                    className='ml-auto w-1 h-6 bg-white rounded-full'
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Logout Button */}
                        <div className='p-4 border-t border-white/10'>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-200 rounded-lg transition-all font-semibold text-sm'
                            >
                                <LogOut size={18} />
                                Logout
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for mobile */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className='fixed inset-0 bg-black/50 z-20 lg:hidden'
                />
            )}
        </>
    );
};

export default AdminSidebar;
