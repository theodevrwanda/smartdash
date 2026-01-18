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
        <div className="space-y-6">
            <Card className="overflow-hidden p-0">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-800">All Businesses</h2>
                    <div className="flex gap-2">
                        <button onClick={loadBusinesses} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Refresh</button>
                    </div>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] relative border rounded-lg">
                    <table className="w-full min-w-[1200px] text-left border-separate border-spacing-0 text-sm">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-slate-50 whitespace-nowrap">
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Business Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Owner</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Plan</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Sub. Status</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Active</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Start Date</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">End Date</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Location</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {businesses.map((business) => (
                                <tr key={business.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                    <td className="px-4 py-3 font-bold text-slate-800 border-b border-slate-50">
                                        <div className="flex flex-col">
                                            <span>{business.businessName || 'Unnamed'}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">ID: {business.id.substring(0, 8)}...</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700">{business.ownerName || '-'}</span>
                                            <span className="text-xs text-slate-400">{business.email || business.ownerEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-50">
                                        {editingId === business.id ? (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={selectedPlan}
                                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                                                ${(business.plan === 'forever' || business.subscription?.plan === 'forever') ? 'bg-purple-100 text-purple-700' :
                                                    (business.plan === 'year' || business.subscription?.plan === 'year') ? 'bg-blue-100 text-blue-700' :
                                                        (business.plan === 'month' || business.subscription?.plan === 'month') ? 'bg-sky-100 text-sky-700' :
                                                            'bg-slate-100 text-slate-600'}`}>
                                                {business.plan || (business.subscription?.plan) || 'Free'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 border-b border-slate-50">
                                        <Badge variant={business.subscription?.status === 'active' ? 'success' : 'warning'}>
                                            {business.subscription?.status || 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 border-b border-slate-50">
                                        <Badge variant={business.isActive ? 'success' : 'error'}>
                                            {business.isActive ? 'Yes' : 'No'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs border-b border-slate-50">
                                        {business.subscription?.startDate ? new Date(business.subscription.startDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs border-b border-slate-50">
                                        {business.subscription?.endDate ? new Date(business.subscription.endDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 text-xs border-b border-slate-50">
                                        {[business.district, business.sector].filter(Boolean).join(', ') || '-'}
                                    </td>

                                    <td className="px-4 py-3 text-right border-b border-slate-50">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                title="View Details"
                                                onClick={() => window.location.href = `/business/${business.id}`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
                                            >
                                                <Eye size={14} />
                                            </button>

                                            {editingId !== business.id && (
                                                <button title="Change Plan" onClick={() => handleEditPlan(business)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-slate-200">
                                                    <CreditCard size={14} />
                                                </button>
                                            )}

                                            <button
                                                title={business.isActive ? "Deactivate" : "Activate"}
                                                onClick={() => handleToggleStatus(business.id, business.isActive ? 'Active' : 'Inactive')}
                                                className={`p-2 rounded-lg transition-colors border border-slate-200 ${business.isActive ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                                            >
                                                {business.isActive ? <Trash2 size={14} /> : <CheckCircle size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {businesses.length === 0 && (
                                <tr>
                                    <td colSpan="20" className="px-6 py-8 text-center text-slate-500">
                                        No businesses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AccountsPage;
