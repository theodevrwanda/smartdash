
import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { adminService } from '../services/adminService';
import { Clock, Shield, AlertCircle, Info, ShoppingCart, UserPlus, FileText } from 'lucide-react';

const LogsPage = ({ limit }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const data = await adminService.fetchAuditLogs();
                setLogs(limit ? data.slice(0, limit) : data);
            } catch (error) {
                console.error("Failed to load logs", error);
            } finally {
                setLoading(false);
            }
        };
        loadLogs();
    }, [limit]);

    const getIcon = (type) => {
        if (!type) return <Info size={20} />;
        if (type.includes('error') || type.includes('fail')) return <AlertCircle size={20} />;
        if (type.includes('sale') || type.includes('sold')) return <ShoppingCart size={20} />;
        if (type.includes('user') || type.includes('create')) return <UserPlus size={20} />;
        if (type.includes('admin') || type.includes('approve')) return <Shield size={20} />;
        return <FileText size={20} />;
    };

    const getColor = (type) => {
        if (!type) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        if (type.includes('error') || type.includes('fail')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
        if (type.includes('sale') || type.includes('sold')) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
        if (type.includes('user')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        if (type.includes('admin')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    };

    if (loading) return <div className="p-4 text-center dark:text-slate-400">Loading activity...</div>;

    return (
        <div className={`flex flex-col h-full ${limit ? '' : '-mt-2'} animate-fade-in`}>
            {!limit && (
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Audit Logs</h1>
                    <div className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                        <Clock size={16} /> Real-time tracking
                    </div>
                </div>
            )}

            <div className={`flex-1 overflow-x-auto overflow-y-auto ${limit ? 'max-h-[400px]' : 'max-h-[calc(100vh-200px)]'} relative border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm bg-white dark:bg-slate-900`}>
                <table className="w-full min-w-[1000px] text-left border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Icon</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Action Type</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700 text-left">Details</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700 text-center">User</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-center">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50 ${getColor(log.transactionType)}`}>
                                        {React.cloneElement(getIcon(log.transactionType), { size: 14 })}
                                    </div>
                                </td>
                                <td className="px-4 py-2 font-bold text-slate-800 dark:text-slate-100 capitalize border-b border-r border-slate-100 dark:border-slate-800">
                                    {log.transactionType?.replace(/_/g, ' ') || 'Action'}
                                </td>
                                <td className="px-4 py-2 text-slate-600 dark:text-slate-400 border-b border-r border-slate-100 dark:border-slate-800 text-left">
                                    {log.actionDetails || 'No details provided'}
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-center">
                                    {log.userName && (
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded uppercase">
                                            {log.userName}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-xs text-slate-400 dark:text-slate-500 font-mono border-b border-slate-100 dark:border-slate-800 text-center">
                                    {log.createdAt ? (log.createdAt.toDate ? log.createdAt.toDate().toLocaleString() : new Date(log.createdAt).toLocaleString()) : '-'}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan="20" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                                    No activity logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {limit && logs.length > 0 && (
                <div className="p-3 bg-white dark:bg-slate-900 border border-t-0 border-slate-200 dark:border-slate-800 rounded-b-sm text-center shadow-sm">
                    <button onClick={() => window.location.href = '/logs'} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline uppercase tracking-wider">
                        View All Activity Reports
                    </button>
                </div>
            )}
        </div>
    );
};

export default LogsPage;
