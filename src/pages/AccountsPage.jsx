import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trash2, CheckCircle, MoreVertical, Eye, CreditCard, XCircle } from 'lucide-react';
import { adminService } from '../services/adminService';

const AccountsPage = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('');

    useEffect(() => {
        loadBusinesses();
    }, []);

    const loadBusinesses = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchAllBusinesses();
            setBusinesses(data);
        } catch (error) {
            console.error("Failed to load businesses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? false : true;
        if (confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this business?`)) {
            try {
                await adminService.updateBusinessStatus(id, newStatus);
                loadBusinesses(); // Reload to get fresh data
            } catch (error) {
                alert("Failed to update status");
            }
        }
    };

    const handleEditPlan = (business) => {
        setEditingId(business.id);
        setSelectedPlan(business.plan);
    };

    const savePlan = async (id) => {
        try {
            await adminService.updateBusinessPlan(id, selectedPlan);
            setEditingId(null);
            loadBusinesses();
        } catch (error) {
            alert("Failed to update plan");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setSelectedPlan('');
    };

    if (loading) {
        return <div className="p-6">Loading businesses...</div>;
    }

    return (
        <div className="flex flex-col h-full -mt-2 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">All Businesses</h2>
                <button onClick={loadBusinesses} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">Refresh</button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] relative border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm bg-white dark:bg-slate-900">
                <table className="w-full min-w-[1200px] text-left border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Business Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Owner</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Plan</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Sub. Status</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Active</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Start Date</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">End Date</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Location</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {businesses.map((business) => (
                            <tr key={business.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-100">
                                    <div className="flex flex-col">
                                        <span>{business.businessName || 'Unnamed'}</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {business.id.substring(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{business.ownerName || '-'}</span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500">{business.email || business.ownerEmail}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
                                    {editingId === business.id ? (
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={selectedPlan}
                                                onChange={(e) => setSelectedPlan(e.target.value)}
                                                className="border dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="free">Free</option>
                                                <option value="month">Monthly</option>
                                                <option value="year">Yearly</option>
                                                <option value="forever">Forever</option>
                                            </select>
                                            <button onClick={() => savePlan(business.id)} className="text-green-600 hover:text-green-800"><CheckCircle size={16} /></button>
                                            <button onClick={cancelEdit} className="text-red-600 hover:text-red-800"><XCircle size={16} /></button>
                                        </div>
                                    ) : (
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize
                                            ${(business.plan === 'forever' || business.subscription?.plan === 'forever') ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                                (business.plan === 'year' || business.subscription?.plan === 'year') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                                    (business.plan === 'month' || business.subscription?.plan === 'month') ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' :
                                                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                            {business.plan || (business.subscription?.plan) || 'Free'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800">
                                    <Badge variant={business.subscription?.status === 'active' ? 'success' : 'warning'}>
                                        {business.subscription?.status || 'Inactive'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800">
                                    <Badge variant={business.isActive ? 'success' : 'error'}>
                                        {business.isActive ? 'Yes' : 'No'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs text-center">
                                    {business.subscription?.startDate ? new Date(business.subscription.startDate).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs text-center">
                                    {business.subscription?.endDate ? new Date(business.subscription.endDate).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                                    {[business.district, business.sector].filter(Boolean).join(', ') || '-'}
                                </td>

                                <td className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            title="View Details"
                                            onClick={() => window.location.href = `/business/${business.id}`}
                                            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-slate-200 dark:border-slate-700"
                                        >
                                            <Eye size={14} />
                                        </button>

                                        {editingId !== business.id && (
                                            <button title="Change Plan" onClick={() => handleEditPlan(business)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded border border-slate-200 dark:border-slate-700">
                                                <CreditCard size={14} />
                                            </button>
                                        )}

                                        <button
                                            title={business.isActive ? "Deactivate" : "Activate"}
                                            onClick={() => handleToggleStatus(business.id, business.isActive ? 'Active' : 'Inactive')}
                                            className={`p-1.5 rounded border border-slate-200 dark:border-slate-700 ${business.isActive ? 'text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                                        >
                                            {business.isActive ? <Trash2 size={14} /> : <CheckCircle size={14} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {businesses.length === 0 && (
                            <tr>
                                <td colSpan="20" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                                    No businesses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountsPage;
