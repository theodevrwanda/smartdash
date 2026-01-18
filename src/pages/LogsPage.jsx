
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
        if (!type) return 'bg-slate-100 text-slate-600';
        if (type.includes('error') || type.includes('fail')) return 'bg-red-100 text-red-600';
        if (type.includes('sale') || type.includes('sold')) return 'bg-green-100 text-green-600';
        if (type.includes('user')) return 'bg-blue-100 text-blue-600';
        if (type.includes('admin')) return 'bg-purple-100 text-purple-600';
        return 'bg-slate-100 text-slate-600';
    };

    if (loading) return <div className="p-4 text-center">Loading activity...</div>;

    return (
        <div className="space-y-6">
            {!limit && (
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-800">Audit Logs</h1>
                    <p className="text-slate-500">System-wide activity tracking</p>
                </div>
            )}

            <Card className="p-0 overflow-hidden">
                {!limit && (
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="font-bold text-lg text-slate-800">System Activity</h2>
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                            <Clock size={16} /> Real-time
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] relative border rounded-lg">
                    <table className="w-full min-w-[1000px] text-left border-separate border-spacing-0 text-sm">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-slate-50 whitespace-nowrap">
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Icon</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Action Type</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 text-left">Details</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">User</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors whitespace-nowrap">
                                    <td className="px-4 py-3 border-b border-slate-50">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColor(log.transactionType)}`}>
                                            {getIcon(log.transactionType)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-800 capitalize border-b border-slate-50">
                                        {log.transactionType?.replace(/_/g, ' ') || 'Action'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50 text-left max-w-xs truncate">
                                        {log.actionDetails || 'No details provided'}
                                    </td>
                                    <td className="px-4 py-3 border-b border-slate-50">
                                        {log.userName && (
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                                {log.userName}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-400 font-mono border-b border-slate-50">
                                        {log.createdAt ? (log.createdAt.toDate ? log.createdAt.toDate().toLocaleString() : new Date(log.createdAt).toLocaleString()) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No activity logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {limit && logs.length > 0 && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                        <button onClick={() => window.location.href = '/logs'} className="text-blue-600 text-sm font-semibold hover:underline">
                            View All Logs
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LogsPage;
