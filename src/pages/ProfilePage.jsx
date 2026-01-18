import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { User, Lock, Mail, Shield, History } from 'lucide-react';
import { updatePassword, updateEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import LogsPage from './LogsPage';

const ProfilePage = () => {
    const user = auth.currentUser;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

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
            await updatePassword(user, newPassword);
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Info */}
                <Card className="p-6 md:col-span-1 border-t-4 border-t-indigo-500">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                            <User size={48} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{user?.displayName || 'Super Admin'}</h2>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mt-2">
                            <Shield size={12} /> SUPER_ADMIN
                        </span>
                        <div className="w-full mt-6 space-y-3 text-left">
                            <div className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded">
                                <Mail size={16} />
                                <span className="truncate">{user?.email}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Change Password */}
                <Card className="p-6 md:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Lock size={20} /> Security Settings
                    </h3>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Re-enter password"
                            />
                        </div>

                        {message.text && (
                            <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Activity Log Preview */}
            <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <History size={20} /> Recent Activity
                </h3>
                <LogsPage limit={5} />
            </div>
        </div>
    );
};

export default ProfilePage;
