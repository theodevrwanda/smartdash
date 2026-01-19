import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { MapPin, Users, User, Building2, Clock, ShieldCheck, Eye, Trash2, Phone, Power, Hash } from 'lucide-react';
import { adminService } from '../services/adminService';
import { Badge } from '../components/ui/Badge';

const BranchesPage = () => {
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchBranches();
            setBranches(data);
        } catch (error) {
            console.error("Failed to load branches", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Network Data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">
                        <MapPin size={12} />
                        <span>Logistics & Infrastructure</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Branch Network
                    </h1>
                </div>
                <button
                    onClick={loadBranches}
                    className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                    <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white dark:text-slate-900 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Sync Nodes</span>
                </button>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1400px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest text-left whitespace-nowrap">
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">No</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Branch Name</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Business Name</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">District</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Sector</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Cell</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Village</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Created At</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Updated At</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Status</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {branches.map((branch, index) => (
                                <tr key={branch.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                <Building2 size={12} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{branch.branchName || branch.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{branch.businessName}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none border-blue-100 text-blue-600">{branch.district}</Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none border-slate-100 text-slate-600">{branch.sector}</Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase italic">
                                        {branch.cell}
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase italic">
                                        {branch.village}
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                                            <Clock size={10} /> {branch.createdAt ? (typeof branch.createdAt === 'object' && branch.createdAt.toDate ? branch.createdAt.toDate().toLocaleDateString() : new Date(branch.createdAt).toLocaleDateString()) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-400 uppercase">
                                            <ShieldCheck size={10} /> {branch.updatedAt ? (typeof branch.updatedAt === 'object' && branch.updatedAt.toDate ? branch.updatedAt.toDate().toLocaleDateString() : new Date(branch.updatedAt).toLocaleDateString()) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-none w-fit mx-auto ${branch.isActive !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${branch.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-tight">{branch.isActive !== false ? 'Operational' : 'Halted'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate(`/branch/${branch.id}`)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800 shadow-sm"
                                            >
                                                <Eye size={12} />
                                            </button>
                                            <button className="p-1.5 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800 shadow-sm"><Power size={12} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {branches.length === 0 && (
                                <tr>
                                    <td colSpan="10" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Building2 size={40} className="text-slate-200 dark:text-slate-800" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Nodes Online</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BranchesPage;
