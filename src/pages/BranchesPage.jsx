import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { MapPin, Users, User, Building2 } from 'lucide-react';
import { adminService } from '../services/adminService';

const BranchesPage = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBranches = async () => {
            try {
                const data = await adminService.fetchBranches();
                setBranches(data);
            } catch (error) {
                console.error("Failed to load branches", error);
            } finally {
                setLoading(false);
            }
        };
        loadBranches();
    }, []);

    if (loading) {
        return <div className="p-6">Loading branches...</div>;
    }

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden p-0">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-800">All Branches</h2>
                    <div className="text-sm text-slate-500">Showing {branches.length} branches</div>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] relative border rounded-lg">
                    <table className="w-full min-w-[1000px] text-left border-separate border-spacing-0 text-sm">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-slate-50 whitespace-nowrap">
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Branch Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Business Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Location</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Sector</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Cell</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Village</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Created At</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Updated At</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {branches.map((branch) => (
                                <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                    <td className="px-4 py-3 font-medium text-slate-800 border-b border-slate-50">{branch.name}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{branch.businessName}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{branch.district || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{branch.sector || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{branch.cell || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{branch.village || '-'}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs border-b border-slate-50">
                                        {branch.createdAt ? (typeof branch.createdAt === 'object' && branch.createdAt.toDate ? branch.createdAt.toDate().toLocaleString() : new Date(branch.createdAt).toLocaleString()) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs border-b border-slate-50">
                                        {branch.updatedAt ? (typeof branch.updatedAt === 'object' && branch.updatedAt.toDate ? branch.updatedAt.toDate().toLocaleString() : new Date(branch.updatedAt).toLocaleString()) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right border-b border-slate-50">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200">
                                            <Building2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {branches.length === 0 && (
                                <tr>
                                    <td colSpan="10" className="px-6 py-8 text-center text-slate-500">
                                        No branches found.
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

export default BranchesPage;
