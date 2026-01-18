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
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 whitespace-nowrap">
                                <th className="px-4 py-3 font-semibold text-slate-500">Branch Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Business ID</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Business Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Province/District</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Sector</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Cell</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Village</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Created At</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Updated At</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {branches.map((branch) => (
                                <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                    <td className="px-4 py-3 font-medium text-slate-800">{branch.name}</td>
                                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{branch.businessId || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{branch.businessName}</td>
                                    <td className="px-4 py-3 text-slate-600">{branch.district || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{branch.sector || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{branch.cell || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{branch.village || '-'}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {branch.createdAt ? new Date(branch.createdAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {branch.updatedAt ? new Date(branch.updatedAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-2 py-1 rounded">Edit</button>
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
