import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminDashboardSidebar from './AdminDashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Avatar, AvatarImage } from '../ui/avatar'
import { motion } from 'framer-motion'
import { Search, CheckCircle, X, Eye } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const CompaniesManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        filterCompanies();
    }, [companies, searchTerm, statusFilter]);

    const fetchCompanies = async () => {
        try {
            const res = await apiClient.get('/admin/companies');
            setCompanies(res.data.companies || []);
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.error('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    const filterCompanies = () => {
        let filtered = companies;

        if (searchTerm) {
            filtered = filtered.filter(comp =>
                comp.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(comp => comp.status === statusFilter);
        }

        setFilteredCompanies(filtered);
    };

    const handleApproveCompany = async (companyId) => {
        try {
            await apiClient.patch(`/admin/companies/${companyId}/approve`);
            toast.success('Company approved successfully');
            fetchCompanies();
        } catch (error) {
            console.error('Approve error:', error);
            toast.error('Failed to approve company');
        }
    };

    const handleRejectCompany = async (companyId) => {
        try {
            await apiClient.patch(`/admin/companies/${companyId}/reject`);
            toast.success('Company rejected successfully');
            fetchCompanies();
        } catch (error) {
            console.error('Reject error:', error);
            toast.error('Failed to reject company');
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
                        <h1 className='text-4xl font-bold text-gray-900'>Companies Management</h1>
                        <p className='text-gray-600 mt-2'>Verify and manage company profiles</p>
                    </motion.div>

                    {/* Filter Section */}
                    <Card className='mb-8 border-0 shadow-md'>
                        <CardContent className='pt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div className='relative'>
                                    <Search className='absolute left-3 top-3 text-gray-400' size={20} />
                                    <Input
                                        placeholder='Search companies...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='pl-10'
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className='border border-gray-200 rounded-lg px-3 py-2 text-sm'
                                >
                                    <option value='all'>All Status</option>
                                    <option value='pending'>Pending</option>
                                    <option value='approved'>Approved</option>
                                    <option value='rejected'>Rejected</option>
                                </select>
                                <Button onClick={fetchCompanies} className='bg-purple-600 hover:bg-purple-700'>
                                    Refresh
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Companies Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {loading ? (
                            <div className='text-center py-8'>Loading companies...</div>
                        ) : filteredCompanies.length === 0 ? (
                            <div className='text-center py-8'>No companies found</div>
                        ) : (
                            filteredCompanies.map((company) => (
                                <motion.div key={company._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <Card className='border-0 shadow-md hover:shadow-lg transition-all'>
                                        <CardContent className='pt-6'>
                                            <div className='text-center mb-4'>
                                                <Avatar className='w-16 h-16 mx-auto mb-3'>
                                                    <AvatarImage src={company.logo} alt={company.name} />
                                                </Avatar>
                                                <h3 className='font-bold text-gray-900'>{company.name}</h3>
                                                <p className='text-sm text-gray-600 mt-1'>{company.location}</p>
                                            </div>

                                            <div className='mb-4'>
                                                <Badge className={`text-xs ${
                                                    company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    company.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {company.status}
                                                </Badge>
                                            </div>

                                            {company.status === 'pending' && (
                                                <div className='flex gap-2'>
                                                    <Button
                                                        onClick={() => handleApproveCompany(company._id)}
                                                        className='flex-1 bg-green-600 hover:bg-green-700 text-white text-sm'
                                                    >
                                                        <CheckCircle size={16} className='mr-1' /> Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleRejectCompany(company._id)}
                                                        variant='destructive'
                                                        className='flex-1 text-sm'
                                                    >
                                                        <X size={16} className='mr-1' /> Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompaniesManagement;
