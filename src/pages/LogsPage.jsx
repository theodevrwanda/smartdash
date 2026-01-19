import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { Clock, Shield, AlertCircle, Info, ShoppingCart, UserPlus, FileText, Activity, ShieldCheck, Eye, Trash2, Hash, User, Calendar } from 'lucide-react';

const LogsPage = ({ limit }) => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, [limit]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchAuditLogs();
            setLogs(limit ? data.slice(0, limit) : data);
        } catch (error) {
            console.error("Failed to load logs", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        if (!type) return <Info size={16} />;
        const t = type.toLowerCase();
        if (t.includes('error') || t.includes('fail')) return <AlertCircle size={16} />;
        if (t.includes('sale') || t.includes('sold')) return <ShoppingCart size={16} />;
        if (t.includes('user') || t.includes('create')) return <UserPlus size={16} />;
        if (t.includes('admin') || t.includes('approve')) return <Shield size={16} />;
        return <FileText size={16} />;
    };

    const getColor = (type) => {
        if (!type) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        const t = type.toLowerCase();
        if (t.includes('error') || t.includes('fail')) return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800';
        if (t.includes('sale') || t.includes('sold')) return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
        if (t.includes('user')) return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800';
        if (t.includes('admin')) return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800';
        return 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400 border-slate-100 dark:border-slate-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600/20 rounded-full border-t-blue-600 animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Filtering Stream...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full ${limit ? '' : 'animate-fade-in py-6'}`}>
            {!limit && (
                <div className="flex items-center justify-between mb-8 px-0">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">
                            <Activity size={12} />
                            <span>System Observability</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Audit Matrix
                        </h1>
                    </div>
                    <button
                        onClick={loadLogs}
                        className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-none flex items-center gap-3 hover:scale-105 transition-all active:scale-95"
                    >
                        <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-none flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white dark:text-slate-900" />
                        </div>
                        <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Refresh Buffer</span>
                    </button>
                </div>
            )}

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1500px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest text-left">
                                <th className="px-3 py-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">#</th>
                                <th className="px-3 py-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">Type</th>
                                <th className="px-3 py-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">Business</th>
                                <th className="px-3 py-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">Action Logic</th>
                                <th className="px-3 py-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">Operator</th>
                                <th className="px-3 py-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">Execution Date</th>
                                <th className="px-3 py-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {logs.map((log, index) => (
                                <tr key={log.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">
                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-none ${getColor(log.transactionType || log.action)}`}>
                                                {getIcon(log.transactionType || log.action)}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                                                {log.transactionType?.replace('_', ' ') || 'SYSTEM_EVENT'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                        <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                                            {log.businessName || 'Platform Root'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                                                {log.action || log.actionDetails || 'N/A'}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 leading-tight">
                                                {log.details || 'Baseline operational signal.'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase underline decoration-slate-200">
                                                {log.userName || log.userEmail || 'Platform'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 dark:text-slate-400">
                                                <Calendar size={10} /> {log.createdAt || log.timestamp ? new Date(log.createdAt || log.timestamp).toLocaleDateString() : '-'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400">
                                                <Clock size={8} /> {log.createdAt || log.timestamp ? new Date(log.createdAt || log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right">
                                        <button
                                            onClick={() => navigate(`/logs/${log.id}`)}
                                            className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800"
                                            title="View Analysis"
                                        >
                                            <Eye size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="20" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Shield size={40} className="text-slate-200 dark:text-slate-800" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Events Logged</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {limit && logs.length > 0 && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => window.location.href = '/logs'}
                        className="px-6 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
                    >
                        Inspect Full Audit Stream →
                    </button>
                </div>
            )}
        </div>
    );
};

export default LogsPage;
