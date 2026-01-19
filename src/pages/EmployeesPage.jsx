import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Users, Search, Download, Trash2, Eye, Power, Building2, MapPin, Mail, Phone, Calendar, Clock, ShieldCheck, Hash, Info, User as UserIcon } from 'lucide-react';
import { adminService } from '../services/adminService';

const EmployeesPage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchAllEmployees();
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
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Syncing Personnel Data</p>
                </div>
            </div>
        );
    }

    const columns = [
        { label: "#", sticky: 'left-0', zIndex: 'z-30' },
        { label: "Identity", sticky: 'left-[3.5rem]', zIndex: 'z-30' },
        { label: "Contact Info" },
        { label: "Role Profile" },
        { label: "Business Node" },
        { label: "Operational Status" },
        { label: "Actions", sticky: 'right-0', zIndex: 'z-30' }
    ];

    return (
        <div className="flex flex-col h-full animate-fade-in py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">
                        <ShieldCheck size={12} />
                        <span>Personnel Integrity Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Employee Roster
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 dark:bg-white p-3 rounded-none text-white dark:text-slate-900 hover:bg-slate-800 transition-all border-none">
                        <Download size={20} />
                    </button>
                    <button
                        onClick={loadEmployees}
                        className="bg-slate-900 dark:bg-white px-6 py-3 rounded-none text-white dark:text-slate-900 font-black uppercase text-xs tracking-wider hover:scale-105 transition-all active:scale-95 shadow-none"
                    >
                        Refresh Network
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={`${col.sticky ? `sticky ${col.sticky} bg-slate-100 dark:bg-slate-900 ${col.zIndex || 'z-20'}` : ''} px-4 py-4 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left whitespace-nowrap`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {employees.map((employee, index) => (
                                <tr key={employee.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                    <td className="sticky left-0 bg-white dark:bg-slate-950 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 px-4 py-4 border border-slate-200 dark:border-slate-800 z-10 transition-colors">
                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="sticky left-[3.5rem] bg-white dark:bg-slate-950 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 px-4 py-4 border border-slate-200 dark:border-slate-800 z-10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                                                {(employee.profileImage || employee.imagephoto) ? (
                                                    <img src={employee.profileImage || employee.imagephoto} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-black text-xs">
                                                        {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                    {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                                                </span>
                                                <span className="text-[10px] font-mono font-bold text-slate-400">{employee.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 italic">{employee.email || '-'}</span>
                                            <span className="text-[10px] font-black text-slate-400">{employee.phone || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 border border-slate-200 dark:border-slate-800">
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${employee.role === 'super_admin' ? 'bg-rose-100 text-rose-700' : employee.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {employee.role?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{employee.businessName || 'N/A'}</span>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{employee.branchName || 'Primary Node'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 border border-slate-200 dark:border-slate-800">
                                        <div className={`flex items-center justify-center gap-1.5 px-3 py-1 border ${employee.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${employee.isActive ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]'}`}></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest">{employee.isActive ? 'Active' : 'Offline'}</span>
                                        </div>
                                    </td>
                                    <td className="sticky right-0 bg-white dark:bg-slate-950 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 px-4 py-4 border border-slate-200 dark:border-slate-800 z-10 transition-colors text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => navigate(`/user/${employee.id}`)}
                                                className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800"
                                                title="Open Personnel Archive"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800" title="Restrict Access">
                                                <Power size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;
