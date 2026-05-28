import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Menu, X, Home, Briefcase, BarChart3 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import apiClient from '@/utils/apiClient'
import { USER_API_END_POINT } from '@/utils/constant'
import { logout } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const Navbar = () => {
    const { user, isAuthenticated } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = async () => {
        try {
            const res = await apiClient.get(`${USER_API_END_POINT}/logout`);
            if (res.data.success) {
                dispatch(logout());
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }
    }

    const navVariants = {
        hidden: { y: -100 },
        visible: { y: 0, transition: { duration: 0.3 } }
    };

    const menuVariants = {
        closed: { opacity: 0, x: -300 },
        open: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    return (
        <>
            <motion.div
                variants={navVariants}
                initial="hidden"
                animate="visible"
                className="fixed w-full top-0 z-50 transition-all duration-300 bg-black text-white shadow-xl"
            >
                <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                    {/* Logo */}
                    <motion.div whileHover={{ scale: 1.05 }} className='flex items-center gap-2 group cursor-pointer'>
                        <Link to="/" className='flex items-center gap-2'>
                            <motion.div 
                                whileHover={{ rotate: 5 }}
                                className='w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-purple-600/50 transition-all'
                            >
                                JQ
                            </motion.div>
                            <span className='text-xl font-bold gradient-text hidden sm:inline'>
                                JobQuest
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center gap-8'>
                        <ul className='flex font-medium items-center gap-6'>
                            {
                                isAuthenticated && user ? (
                                    <>
                                        {user.role === 'student' && (
                                            <motion.li whileHover={{ y: -2 }} className='hover:text-purple-600 transition-colors'>
                                                <Link to="/">Home</Link>
                                            </motion.li>
                                        )}
                                        {user.role === 'recruiter' ? (
                                            <>
                                                <motion.li whileHover={{ y: -2 }} className='hover:text-purple-600 transition-colors'>
                                                    <Link to="/admin/dashboard">Dashboard</Link>
                                                </motion.li>
                                                <motion.li whileHover={{ y: -2 }} className='hover:text-purple-600 transition-colors'>
                                                    <Link to="/admin/companies">Companies</Link>
                                                </motion.li>
                                                <motion.li whileHover={{ y: -2 }} className='hover:text-purple-600 transition-colors'>
                                                    <Link to="/admin/jobs">Jobs</Link>
                                                </motion.li>
                                            </>
                                        ) : (
                                            <>
                                                <motion.li whileHover={{ y: -2 }} className='hover:text-purple-600 transition-colors'>
                                                    <Link to="/jobs">Jobs</Link>
                                                </motion.li>
                                                <motion.li whileHover={{ y: -2 }} className='hover:text-purple-600 transition-colors'>
                                                    <Link to="/browse">Browse</Link>
                                                </motion.li>
                                            </>
                                        )
                                        }
                                    </>
                                ) : (
                                    <>
                                        <li className='hover:text-purple-600 transition-colors'>
                                            <Link to="/">Home</Link>
                                        </li>
                                    </>
                                )
                            }
                        </ul>

                        {
                            !isAuthenticated ? (
                                <div className='flex items-center gap-3'>
                                    <Link to="/login">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button className='btn-secondary border-purple-400/50 hover:border-purple-600/80 hover:shadow-lg'>
                                                Login
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <Link to="/signup">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button className="btn-primary shadow-lg hover:shadow-purple-600/50">
                                                Sign Up
                                            </Button>
                                        </motion.div>
                                    </Link>
                                </div>
                            ) : (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer w-10 h-10 hover:shadow-lg transition-all bg-gradient-to-br from-purple-600 to-pink-600">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold">
                                                {user?.fullname?.substring(0, 2).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className='space-y-4'>
                                            <div className='flex gap-3'>
                                                <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-sm">
                                                        {user?.fullname?.substring(0, 2).toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className='font-semibold text-gray-900'>{user?.fullname}</h4>
                                                    <p className='text-sm text-gray-600'>{user?.role === 'student' ? 'Job Seeker' : 'Recruiter'}</p>
                                                    <p className='text-xs text-gray-500'>{user?.email}</p>
                                                </div>
                                            </div>
                                            <div className='border-t pt-3 space-y-2'>
                                                {
                                                    user && user.role === 'student' && (
                                                        <Link to="/profile">
                                                            <div className='flex items-center gap-2 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors'>
                                                                <User2 size={18} className='text-purple-600' />
                                                                <span className='text-sm font-medium'>View Profile</span>
                                                            </div>
                                                        </Link>
                                                    )
                                                }
                                                {
                                                    user && user.role === 'recruiter' && (
                                                        <Link to="/admin/dashboard">
                                                            <div className='flex items-center gap-2 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors'>
                                                                <BarChart3 size={18} className='text-purple-600' />
                                                                <span className='text-sm font-medium'>Dashboard</span>
                                                            </div>
                                                        </Link>
                                                    )
                                                }

                                                <div
                                                    onClick={logoutHandler}
                                                    className='flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors'
                                                >
                                                    <LogOut size={18} />
                                                    <span className='text-sm font-medium'>Logout</span>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )
                        }
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white'
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <motion.div
                variants={menuVariants}
                initial="closed"
                animate={isOpen ? 'open' : 'closed'}
                className="fixed inset-0 top-16 md:hidden bg-black text-white z-40 border-t border-gray-800 overflow-y-auto"
            >
                <div className="p-4 space-y-2">
                    {isAuthenticated && user ? (
                        <>
                            {user.role === 'student' && (
                                <Link
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-white"
                                >
                                    Home
                                </Link>
                            )}
                            {user.role === 'recruiter' ? (
                                <>
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-white"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/admin/companies"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-white"
                                    >
                                        Companies
                                    </Link>
                                    <Link
                                        to="/admin/jobs"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-white"
                                    >
                                        Jobs
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/jobs"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-white"
                                    >
                                        Jobs
                                    </Link>
                                    <Link
                                        to="/browse"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-white"
                                    >
                                        Browse
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-white"
                                    >
                                        Profile
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    logoutHandler();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-purple-400 hover:bg-white/10 rounded-lg transition-colors font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg transition-colors font-medium"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </>
    )
}

export default Navbar