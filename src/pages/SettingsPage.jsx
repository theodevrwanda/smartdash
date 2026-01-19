import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { Save, Settings as SettingsIcon, Shield, DollarSign, Activity } from 'lucide-react';
import { adminService } from '../services/adminService';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Loading from '../components/ui/Loading';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        pricing: { month: 0, year: 0, forever: 0 },
        enableFreePlan: true,
        limits: { maxProducts: 50, maxUsers: 2, maxBranches: 1 },
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Fetch settings from a specific document, e.g., 'config/appSettings'
                const docRef = doc(db, 'config', 'appSettings');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data());
                }
            } catch (error) {
                console.error("Failed to load settings", error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleChange = (section, field, value) => {
        setSettings(prev => {
            if (section) {
                return { ...prev, [section]: { ...prev[section], [field]: value } };
            }
            return { ...prev, [field]: value };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, 'config', 'appSettings');
            await setDoc(docRef, settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading message="Loading Settings" />;

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">App Settings</h1>
                    <p className="text-slate-500">Global configuration for the platform.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Pricing Configuration */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-600" /> Subscription Pricing (RWF)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Plan</label>
                            <input
                                type="number"
                                value={settings.pricing?.month || 0}
                                onChange={(e) => handleChange('pricing', 'month', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Yearly Plan</label>
                            <input
                                type="number"
                                value={settings.pricing?.year || 0}
                                onChange={(e) => handleChange('pricing', 'year', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Forever Plan</label>
                            <input
                                type="number"
                                value={settings.pricing?.forever || 0}
                                onChange={(e) => handleChange('pricing', 'forever', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </Card>

                {/* Free Plan Limits */}
                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Shield size={20} className="text-blue-600" /> Free Plan Limits
                        </h3>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableFreePlan}
                                onChange={(e) => handleChange(null, 'enableFreePlan', e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Enable Free Plan</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-100 disabled:opacity-50">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Products</label>
                            <input
                                type="number"
                                value={settings.limits?.maxProducts || 0}
                                onChange={(e) => handleChange('limits', 'maxProducts', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Users</label>
                            <input
                                type="number"
                                value={settings.limits?.maxUsers || 0}
                                onChange={(e) => handleChange('limits', 'maxUsers', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Branches</label>
                            <input
                                type="number"
                                value={settings.limits?.maxBranches || 0}
                                onChange={(e) => handleChange('limits', 'maxBranches', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </Card>

                {/* System Maintenance */}
                <Card className="p-6 border-red-100 bg-red-50">
                    <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
                        <Activity size={20} /> System Control
                    </h3>
                    <p className="text-red-600 text-sm mb-4">
                        Enabling Maintenance Mode will prevent standard users from accessing the system. Only admins will have access.
                    </p>
                    <label className="flex items-center gap-2">
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => handleChange(null, 'maintenanceMode', e.target.checked)}
                                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-red-600"
                            />
                            <span className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></span>
                        </div>
                        <span className="text-sm font-bold text-red-700">
                            {settings.maintenanceMode ? 'Maintenance Mode ACTIVE' : 'Maintenance Mode Inactive'}
                        </span>
                    </label>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
