// src/components/ProtectedRoute.jsx (NEW FILE)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoadingAuth } = useAuth();

    // Show a loading indicator while checking authentication
    if (isLoadingAuth) {
        // You can make this a nicer loading spinner component
        return <div>Checking authentication...</div>;
    }

    // If authenticated, render the child route's element using <Outlet>
    // Otherwise, redirect to the login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;