
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../ui/Loading';

const RequireAuth = ({ children }) => {
    const { user, loading, logout } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loading message="Authenticating..." />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'super_admin') {
        // Log them out if they are not super_admin, or show unauthorized page. 
        // For security, it is often better to just deny access completely.
        // We will log them out here to prevent 'stuck' non-admin sessions.
        // You might want to wrap this in a useEffect to avoid side-effects in render, 
        // but for a guard component, returning a strictly different view is also valid.
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        You do not have permission to access the Super Admin Dashboard.
                        Current Role: <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-sm">{user.role}</span>
                    </p>
                    <button
                        onClick={() => logout()}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-black transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default RequireAuth;
