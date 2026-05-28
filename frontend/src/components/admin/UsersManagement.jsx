import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Avatar, AvatarImage } from '../ui/avatar'
import { motion } from 'framer-motion'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Search, UserX, CheckCircle, Mail, Phone } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get('http://localhost:3001/api/v1/admin/users');
            setUsers(res.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const handleBanUser = async (userId) => {
        if (window.confirm('Are you sure you want to ban this user?')) {
            try {
                await apiClient.patch(`/admin/users/${userId}/ban`);
                toast.success('User banned successfully');
                fetchUsers();
            } catch (error) {
                console.error('Ban error:', error);
                toast.error('Failed to ban user');
            }
        }
    };

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'student': return 'bg-blue-100 text-blue-800';
            case 'recruiter': return 'bg-purple-100 text-purple-800';
            case 'admin': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <AdminNavbar />
            <div className='flex pt-20'>
                <AdminDashboardSidebar />

                {/* Main Content */}
                <div className='flex-1 p-8 lg:ml-64'>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8'
                    >
                        <h1 className='text-4xl font-bold text-gray-900'>Users Management</h1>
                        <p className='text-gray-600 mt-2'>Manage and monitor all platform users</p>
                    </motion.div>

                    {/* Filter Section */}
                    <Card className='mb-8 border-0 shadow-md'>
                        <CardContent className='pt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {/* Search */}
                                <div className='relative'>
                                    <Search className='absolute left-3 top-3 text-gray-400' size={20} />
                                    <Input
                                        placeholder='Search by name or email...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='pl-10'
                                    />
                                </div>

                                {/* Role Filter */}
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className='border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
                                >
                                    <option value='all'>All Roles</option>
                                    <option value='student'>Job Seekers</option>
                                    <option value='recruiter'>Recruiters</option>
                                </select>

                                {/* Refresh Button */}
                                <Button
                                    onClick={fetchUsers}
                                    className='bg-purple-600 hover:bg-purple-700'
                                >
                                    Refresh Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Table */}
                    <Card className='border-0 shadow-md'>
                        <CardHeader>
                            <CardTitle>
                                All Users ({filteredUsers.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className='text-center py-8 text-gray-500'>Loading users...</div>
                            ) : filteredUsers.length === 0 ? (
                                <div className='text-center py-8 text-gray-500'>No users found</div>
                            ) : (
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-sm'>
                                        <thead className='border-b border-gray-200'>
                                            <tr>
                                                <th className='text-left py-3 px-4 font-semibold text-gray-900'>User</th>
                                                <th className='text-left py-3 px-4 font-semibold text-gray-900'>Email</th>
                                                <th className='text-left py-3 px-4 font-semibold text-gray-900'>Role</th>
                                                <th className='text-left py-3 px-4 font-semibold text-gray-900'>Status</th>
                                                <th className='text-left py-3 px-4 font-semibold text-gray-900'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user, index) => (
                                                <motion.tr
                                                    key={user._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
                                                >
                                                    <td className='py-4 px-4'>
                                                        <div className='flex items-center gap-3'>
                                                            <Avatar className='w-8 h-8'>
                                                                <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                                                            </Avatar>
                                                            <span className='font-medium text-gray-900'>{user.fullname}</span>
                                                        </div>
                                                    </td>
                                                    <td className='py-4 px-4 text-gray-600'>{user.email}</td>
                                                    <td className='py-4 px-4'>
                                                        <Badge className={`${getRoleBadgeColor(user.role)} text-xs`}>
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className='py-4 px-4'>
                                                        {user.banned ? (
                                                            <span className='text-xs font-medium text-red-600 flex items-center gap-1'>
                                                                <UserX size={16} /> Banned
                                                            </span>
                                                        ) : (
                                                            <span className='text-xs font-medium text-green-600 flex items-center gap-1'>
                                                                <CheckCircle size={16} /> Active
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className='py-4 px-4'>
                                                        {!user.banned && (
                                                            <button
                                                                onClick={() => handleBanUser(user._id)}
                                                                className='text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1'
                                                            >
                                                                <UserX size={16} /> Ban
                                                            </button>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
