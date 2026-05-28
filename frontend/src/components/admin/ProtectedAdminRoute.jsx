import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedAdminRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);

    if (!user) {
        return <Navigate to='/admin-login' replace />
    }

    // Check if user is admin
    if (user.role !== 'admin') {
        return <Navigate to='/' replace />
    }

    return children;
};

export default ProtectedAdminRoute;
