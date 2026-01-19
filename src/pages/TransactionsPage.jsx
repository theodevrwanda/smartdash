import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Download, Filter, CheckCircle, XCircle, Clock, CreditCard, ShieldCheck, Eye, Trash2, Hash, ShoppingCart, User } from 'lucide-react';
import { adminService } from '../services/adminService';

const PaymentsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to load transactions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (txn) => {
        if (!txn.businessId) {
            alert("Cannot approve: Missing Business ID in transaction");
            return;
        }
        if (confirm(`Approve payment of ${txn.amount} ${txn.currency || 'RWF'} for plan '${txn.plan}'?`)) {
            try {
                await adminService.approveTransaction(txn.id, txn.businessId, txn.plan || 'month');
                loadTransactions();
            } catch (error) {
                console.error(error);
                alert("Failed to approve transaction");
            }
        }
    };

    const handleReject = async (txn) => {
        const reason = prompt("Enter reason for rejection:");
        if (reason) {
            try {
                await adminService.rejectTransaction(txn.id, reason);
                loadTransactions();
            } catch (error) {
                alert("Failed to reject");
            }
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
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Processing Ledger Data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">
                        <CreditCard size={12} />
                        <span>Financial Reconciliation</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Payments Ledger
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm">
                        <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                        <Download size={14} /> Export
                    </button>
                    <button
                        onClick={loadTransactions}
                        className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg active:scale-95"
                    >
                        <Clock className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest text-left whitespace-nowrap">
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">No</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Document ID</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Business Context</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">User Identity</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Financial Data</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Connectivity</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Meta Params</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Execution Date</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Status</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {transactions.map((txn, index) => (
                                <tr key={txn.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 border border-slate-200 dark:border-slate-800">
                                            <Hash size={10} />
                                            {txn.id.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{txn.businessName}</span>
                                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">ID: {txn.businessId}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <User size={12} className="text-blue-600" />
                                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{txn.ownerName}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">UID: {txn.userId}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-emerald-600">{txn.amount?.toLocaleString()}</span>
                                                <span className="text-[10px] font-black text-slate-400">{txn.currency}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{txn.method} GATEWAY</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 lowercase">{txn.email}</span>
                                            <span className="text-[11px] font-bold text-slate-500 tracking-widest">{txn.phoneNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none bg-purple-50 text-purple-600 border-purple-100">{txn.plan}</Badge>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none bg-blue-50 text-blue-600 border-blue-100">{txn.type}</Badge>
                                            </div>
                                            {txn.isManualVerification && (
                                                <div className="flex items-center gap-1 text-[9px] font-black text-amber-600">
                                                    <ShieldCheck size={10} /> MANUAL OVERRIDE
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase">
                                                {txn.createdAt ? (typeof txn.createdAt === 'object' && txn.createdAt.toDate ? txn.createdAt.toDate().toLocaleDateString() : new Date(txn.createdAt).toLocaleDateString()) : '-'}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400">
                                                {txn.createdAt ? (typeof txn.createdAt === 'object' && txn.createdAt.toDate ? txn.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <Badge variant={txn.status === 'approved' ? 'success' : txn.status === 'pending' ? 'warning' : 'error'} className="rounded-none uppercase text-[9px] font-black w-24 flex justify-center py-1">
                                            {txn.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {txn.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(txn)}
                                                        className="px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 rounded-none"
                                                    >
                                                        <CheckCircle size={12} /> Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(txn)}
                                                        className="px-4 py-1.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2 rounded-none"
                                                    >
                                                        <XCircle size={12} /> Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800 shadow-sm"><Eye size={12} /></button>
                                            )}
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

export default PaymentsPage;
