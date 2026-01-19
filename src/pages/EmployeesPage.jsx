import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Mail, Briefcase, MapPin, Building2, User, Clock, ShieldCheck, Eye, Trash2 } from 'lucide-react';
import { adminService } from '../services/adminService';

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchEmployees();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to load employees", error);
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
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Personnel Matrix</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">
                        <Users size={12} />
                        <span>Workforce & Talent</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Team Members
                    </h1>
                </div>
                <button
                    onClick={loadEmployees}
                    className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                    <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white dark:text-slate-900 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Sync Roster</span>
                </button>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1400px] border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-xl">
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">#</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Member</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Business Entity</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Location / Branch</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Role</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Contact Info</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Access Status</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Enrolled</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {employees.map((emp, index) => (
                                <tr key={emp.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-300">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-black text-xs uppercase border border-slate-200 dark:border-slate-700">
                                                {emp.firstName ? emp.firstName.charAt(0) : (emp.name ? emp.name.charAt(0) : 'U')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{emp.fullName || emp.name || '-'}</span>
                                                <span className="text-[10px] font-bold text-slate-400">UID: {emp.id?.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={12} className="text-slate-400" />
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{emp.businessName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{emp.branchName || 'HQ / Corporate'}</span>
                                            {emp.location && <span className="text-[9px] text-slate-400 font-medium">{emp.location}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full w-fit">
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">{emp.role || 'Member'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                <Mail size={10} className="text-slate-400" />
                                                <span>{emp.email || '-'}</span>
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-500">{emp.phone || '-'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${emp.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${emp.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            <span className="text-[10px] font-black uppercase">{emp.isActive ? 'Active' : 'Locked'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center leading-none gap-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">DATE</span>
                                            <span className="text-[11px] font-bold text-slate-600">
                                                {emp.createdAt ? (typeof emp.createdAt === 'object' && emp.createdAt.toDate ? emp.createdAt.toDate().toLocaleDateString() : new Date(emp.createdAt).toLocaleDateString()) : '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100 shadow-sm"><Eye size={14} /></button>
                                            <button className="p-2.5 text-slate-400 bg-slate-50 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-slate-200 shadow-sm"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="20" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <User size={40} className="text-slate-200 dark:text-slate-800" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Zero Personnel Identified</p>
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

export default EmployeesPage;
