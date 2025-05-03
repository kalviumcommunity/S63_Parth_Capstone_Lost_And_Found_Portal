// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use navigate inside provider if needed

// 1. Create the Context
const AuthContext = createContext(null);

// Helper function to get initial state from localStorage
const getInitialAuthState = () => {
    try {
        const token = localStorage.getItem('authToken');
        const userDataString = localStorage.getItem('userData');
        if (token && userDataString) {
            const user = JSON.parse(userDataString);
            // Optional: Add token validation/expiry check here if needed
            return { token, user, isAuthenticated: true };
        }
    } catch (error) {
        console.error("Error reading auth state from localStorage", error);
    }
    return { token: null, user: null, isAuthenticated: false };
};

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(getInitialAuthState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Note: Using useNavigate inside provider directly is complex.
    // It's often better to handle navigation in the component calling login/logout.

    // --- Login Function ---
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/users/login`, { email, password });

            if (response.data && response.data.token && response.data.user) {
                const { token, user } = response.data;
                localStorage.setItem('authToken', token);
                localStorage.setItem('userData', JSON.stringify(user));
                setAuthState({ token, user, isAuthenticated: true });
                setLoading(false);
                return true; // Indicate success
            } else {
                throw new Error("Invalid response data from server during login.");
            }
        } catch (err) {
            console.error("Login API Error:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Login failed. Please check credentials.';
            setError(errorMessage);
            setAuthState({ token: null, user: null, isAuthenticated: false }); // Ensure logged out state on error
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setLoading(false);
            return false; // Indicate failure
        }
    };

    // --- Logout Function ---
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setAuthState({ token: null, user: null, isAuthenticated: false });
        // Navigation is usually handled in the component calling logout
        // For example, navigate('/login') in Navbar's handler
        console.log("User logged out.");
    };

     // Optional: Add effect to sync logout across tabs (advanced)
     useEffect(() => {
        const syncLogout = event => {
          if (event.key === 'authToken' && event.newValue === null) {
            console.log('Detected logout from another tab/window');
            logout();
          }
        };
        window.addEventListener('storage', syncLogout);
        return () => {
          window.removeEventListener('storage', syncLogout);
        };
      }, []);

    // --- Update User Function ---
    const updateUser = (newUser) => {
        setAuthState((prev) => {
            const updated = { ...prev, user: newUser };
            localStorage.setItem('userData', JSON.stringify(newUser));
            return updated;
        });
    };

    // Value provided to consuming components
    const value = {
        ...authState, // includes isAuthenticated, user, token
        loading,
        error,
        login,
        logout,
        updateUser,
        isLoadingAuth: loading // alias for clarity if needed
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook for easy consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};