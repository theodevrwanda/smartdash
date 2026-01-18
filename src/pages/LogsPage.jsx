
import React from 'react';
import Card from '../components/ui/Card';
import { logs } from '../data/mockData';
import { Clock, Shield, AlertCircle, Info } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const LogsPage = () => {
    return (
        <div className="space-y-6">
            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-bold text-lg text-slate-800">System Activity Logs</h2>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <Clock size={16} /> Last updated: Just now
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="min-w-[40px]">
                                {log.action.includes('Failed') ? (
                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><AlertCircle size={20} /></div>
                                ) : log.action.includes('System') ? (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Shield size={20} /></div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><Info size={20} /></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-slate-800">{log.action}</h4>
                                    <span className="text-xs text-slate-400 font-mono">{log.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-600">{log.details}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                                User: {log.user}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button className="text-blue-600 text-sm font-semibold hover:underline">View All Logs</button>
                </div>
            </Card>
        </div>
    );
};

export default LogsPage;
