
import React, { useState, useEffect } from 'react';
import {
    Camera, Mail, MapPin, Phone, Calendar, Globe,
    Shield, Edit3, Grid, Activity, Users, CreditCard,
    Building2, CheckCircle, Smartphone, Layers, Lock
} from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { adminService } from '../services/adminService';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';

const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('about');
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState(null);

    // Security states
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch Stats for "App Summary"
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.fetchDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Error loading stats", error);
            }
        };
        fetchStats();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file);
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { profileImage: imageUrl });
            window.location.reload();
        } catch (error) {
            console.error("Failed to upload image", error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        try {
            await updatePassword(auth.currentUser, newPassword);
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    if (!user) return <Loading message="Loading Profile..." />;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-fade-in font-sans">
            {/* Main Header / Breadcrumb can go here if needed */}
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">User Profile</h1>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* LEFT COLUMN: Image & Sidebar Info */}
                <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
                    {/* Profile Image Card */}
                    <Card className="p-6 flex flex-col items-center bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="relative group w-48 h-48 mb-6">
                            <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border-4 border-slate-50 dark:border-slate-800 relative">
                                {uploading ? (
                                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <img
                                        src={user.profileImage || "https://media.licdn.com/dms/image/v2/D4D03AQE0Jj9aQ_XgMw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718274685322?e=2147483647&v=beta&t=k6hJ6i6d3T2j8_g3y_z6l_x3q_n8m4_j5k7_l2a4_s5"}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        alt="Profile"
                                    />
                                )}
                                {/* Upload Overlay */}
                                <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    <Camera className="text-white drop-shadow-md" size={32} />
                                </label>
                            </div>
                        </div>

                        {/* Work / Status Section (Matching "Work" in image) */}
                        <div className="w-full space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                                System Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">System Health</span>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">98% Stable</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">Security Level</span>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Root Access</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">Active Session</span>
                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">2h 15m</span>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mt-6">
                                Modules
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['Users', 'Payments', 'Audit Logs', 'Branches', 'Settings'].map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Profile Details */}
                <div className="flex-1 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8">

                    {/* Header Details */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</h2>
                                <CheckCircle size={20} className="text-blue-500 fill-blue-50" />
                            </div>
                            <p className="text-indigo-500 font-semibold mb-2">{user.role?.replace('_', ' ').toUpperCase()}</p>

                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">9.8</span>
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map(i => <Activity key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-xs text-slate-400 ml-2">(System Trust Score)</span>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-slate-200 dark:shadow-none">
                                <Edit3 size={16} /> Edit Profile
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                <Layers size={16} /> Reports
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-8 mb-8 border-b border-slate-100 dark:border-slate-800">
                        {['About', 'Platform Summary', 'Settings'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])} // 'platform' for summary
                                className={`pb-4 text-sm font-bold uppercase tracking-wide transition-all relative ${activeTab === tab.toLowerCase().split(' ')[0]
                                        ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
                                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* CONTENT AREA */}
                    {activeTab === 'about' && (
                        <div className="animate-fade-in space-y-8">
                            {/* Contact Info Group */}
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-blue-500"><Phone size={18} /></div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">{user.phone || 'N/A'}</span>
                                            <span className="text-xs text-slate-400">Mobile Number</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-indigo-500"><Mail size={18} /></div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white" title={user.email}>{user.email}</span>
                                            <span className="text-xs text-slate-400">Email Address</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-rose-500"><MapPin size={18} /></div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">{[user.district, user.cell, 'Rwanda'].filter(Boolean).join(', ')}</span>
                                            <span className="text-xs text-slate-400">Current Location</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-emerald-500"><Globe size={18} /></div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">www.smartstock.rw</span>
                                            <span className="text-xs text-slate-400">Website</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info Group */}
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Joined Date</span>
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(user.createdAt)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Gender</span>
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{user.gender || 'Not Specified'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Role ID</span>
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                                            {user.uid?.slice(0, 12)}...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'platform' && (
                        <div className="animate-fade-in">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Platform Overview (All Pages)</h4>

                            {stats ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Card className="p-4 border border-slate-200 dark:border-slate-800 shadow-sm bg-indigo-50 dark:bg-indigo-900/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <Building2 className="text-indigo-600" size={24} />
                                            <span className="text-xs font-bold text-indigo-500 px-2 py-1 bg-white dark:bg-slate-800 rounded-full">Businesses</span>
                                        </div>
                                        <div className="text-3xl font-black text-indigo-900 dark:text-white">{stats.businessStats?.total || 0}</div>
                                        <div className="text-xs text-indigo-600 mt-1">Total Registered</div>
                                    </Card>

                                    <Card className="p-4 border border-slate-200 dark:border-slate-800 shadow-sm bg-emerald-50 dark:bg-emerald-900/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <Users className="text-emerald-600" size={24} />
                                            <span className="text-xs font-bold text-emerald-500 px-2 py-1 bg-white dark:bg-slate-800 rounded-full">Users</span>
                                        </div>
                                        <div className="text-3xl font-black text-emerald-900 dark:text-white">{stats.userStats?.total || 0}</div>
                                        <div className="text-xs text-emerald-600 mt-1">Active Accounts</div>
                                    </Card>

                                    <Card className="p-4 border border-slate-200 dark:border-slate-800 shadow-sm bg-amber-50 dark:bg-amber-900/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <CreditCard className="text-amber-600" size={24} />
                                            <span className="text-xs font-bold text-amber-500 px-2 py-1 bg-white dark:bg-slate-800 rounded-full">Revenue</span>
                                        </div>
                                        <div className="text-3xl font-black text-amber-900 dark:text-white">
                                            {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', notation: "compact" }).format(stats.paymentStats?.revenue || 0)}
                                        </div>
                                        <div className="text-xs text-amber-600 mt-1">Total Transactions</div>
                                    </Card>

                                    {/* Detailed Mini-List */}
                                    <div className="col-span-full mt-4">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                            <h5 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                                <Grid size={16} /> Subscription Distribution
                                            </h5>
                                            <div className="flex gap-4 overflow-x-auto pb-2">
                                                {Object.entries(stats.businessStats?.byPlan || {}).map(([plan, count]) => (
                                                    <div key={plan} className="flex-shrink-0 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 min-w-[120px]">
                                                        <span className="block text-xs uppercase text-slate-500 font-bold">{plan}</span>
                                                        <span className="block text-xl font-bold text-slate-900 dark:text-white">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Loading message="Loading Platform Data..." />
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-fade-in max-w-md">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 leading-relaxed">
                                Security Matrix - Password Update
                            </h4>
                            <form onSubmit={handleUpdatePassword} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">New Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Confirm Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {message.text && (
                                    <div className={`p-3 rounded text-xs font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all">
                                    Update Security Credentials
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
