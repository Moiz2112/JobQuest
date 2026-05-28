import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
    LayoutDashboard, Users, Briefcase, Building2, FileText, 
    Settings, Menu, X, BarChart3, Shield, AlertCircle 
} from 'lucide-react'

const AdminDashboardSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { id: 'users', label: 'Users Management', icon: Users, path: '/admin/users' },
        { id: 'jobs', label: 'Jobs Management', icon: Briefcase, path: '/admin/jobs-management' },
        { id: 'companies', label: 'Companies', icon: Building2, path: '/admin/companies-management' },
        { id: 'applications', label: 'Applications', icon: FileText, path: '/admin/applications-management' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics-management' },
        { id: 'reports', label: 'Reports', icon: AlertCircle, path: '/admin/reports' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='fixed top-24 left-4 z-40 lg:hidden p-2 bg-purple-600 text-white rounded-lg'
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                transition={{ duration: 0.3 }}
                className='fixed left-0 top-20 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl z-30 hidden lg:flex lg:translate-x-0 flex-col'
            >
                <div className='flex-1 overflow-y-auto pt-6 px-4 space-y-2'>
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
                                        : 'text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                <Icon size={20} />
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
                </div>

                {/* Footer Info */}
                <div className='p-4 border-t border-white/10'>
                    <p className='text-xs text-gray-400 text-center'>🔐 Admin Control Panel</p>
                </div>
            </motion.div>

            {/* Mobile Overlay */}
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

export default AdminDashboardSidebar;
