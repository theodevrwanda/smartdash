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
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span>Pages</span>
                    <span className="text-[10px]">/</span>
                    <span className="text-slate-900 dark:text-slate-200">Branches</span>
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Business Branches
                    </h1>
                    <div className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-200 dark:border-slate-800 shadow-sm font-medium">
                        {branches.length} active branches found
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] relative border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm bg-white dark:bg-slate-900">
                <table className="w-full min-w-[1000px] text-left border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Branch Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Business Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Location</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Sector</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Cell</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Village</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700 text-center">Created At</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700 text-center">Updated At</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {branches.map((branch) => (
                            <tr key={branch.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-100">{branch.name}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{branch.businessName}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{branch.district || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{branch.sector || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{branch.cell || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{branch.village || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-500 text-[11px] text-center font-mono">
                                    {branch.createdAt ? (typeof branch.createdAt === 'object' && branch.createdAt.toDate ? branch.createdAt.toDate().toLocaleString() : new Date(branch.createdAt).toLocaleString()) : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-500 text-[11px] text-center font-mono">
                                    {branch.updatedAt ? (typeof branch.updatedAt === 'object' && branch.updatedAt.toDate ? branch.updatedAt.toDate().toLocaleString() : new Date(branch.updatedAt).toLocaleString()) : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-slate-200 dark:border-slate-700">
                                            <Building2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {branches.length === 0 && (
                            <tr>
                                <td colSpan="10" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
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
