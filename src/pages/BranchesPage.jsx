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
        <div className="flex flex-col h-full -mt-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-slate-800">All Branches</h2>
                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">Showing {branches.length} branches</div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] relative border border-slate-200 rounded-sm shadow-sm bg-white">
                <table className="w-full min-w-[1000px] text-left border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50 font-semibold text-slate-600">
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Branch Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Business Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Location</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Sector</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Cell</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Village</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200 text-center">Created At</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200 text-center">Updated At</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {branches.map((branch) => (
                            <tr key={branch.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-4 py-2 border-b border-r border-slate-100 font-medium text-slate-800">{branch.name}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{branch.businessName}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{branch.district || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{branch.sector || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{branch.cell || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{branch.village || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-500 text-[11px] text-center font-mono">
                                    {branch.createdAt ? (typeof branch.createdAt === 'object' && branch.createdAt.toDate ? branch.createdAt.toDate().toLocaleString() : new Date(branch.createdAt).toLocaleString()) : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-500 text-[11px] text-center font-mono">
                                    {branch.updatedAt ? (typeof branch.updatedAt === 'object' && branch.updatedAt.toDate ? branch.updatedAt.toDate().toLocaleString() : new Date(branch.updatedAt).toLocaleString()) : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-slate-100 text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded border border-slate-200">
                                            <Building2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {branches.length === 0 && (
                            <tr>
                                <td colSpan="10" className="px-6 py-12 text-center text-slate-500">
                                    No branches found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BranchesPage;
