import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Download, Filter, CheckCircle, XCircle, Clock, CreditCard, ShieldCheck, Eye, Trash2 } from 'lucide-react';
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

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1600px] border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-xl">
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Ref ID</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Amount</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Business Entity</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Method</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Plan</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Status</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Contact</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Manual</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Timestamp</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-300">
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black text-slate-400 font-mono tracking-tighter uppercase">#{txn.id?.substring(0, 8)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                                {new Intl.NumberFormat('en-RW', { style: 'currency', currency: txn.currency || 'RWF' }).format(txn.amount || 0)}
                                            </span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{txn.type || 'subscription'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{txn.businessName || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full w-fit">
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">{txn.method || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 capitalize">
                                        {txn.plan || 'Standard'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={txn.status === 'approved' ? 'success' : txn.status === 'pending' ? 'warning' : 'default'}>
                                            {txn.status || 'pending'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{txn.ownerName || '-'}</span>
                                            <span className="text-[10px] text-slate-500">{txn.email || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${txn.isManualVerification ? 'text-amber-600' : 'text-slate-400'}`}>
                                            {txn.isManualVerification ? 'Manual' : 'System'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center leading-none gap-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">SECURE</span>
                                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                                {txn.createdAt ? (typeof txn.createdAt === 'object' && txn.createdAt.toDate ? txn.createdAt.toDate().toLocaleDateString() : new Date(txn.createdAt).toLocaleDateString()) : '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {txn.status !== 'approved' && (
                                                <button onClick={() => handleApprove(txn)} className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-100 shadow-sm"><CheckCircle size={14} /></button>
                                            )}
                                            {txn.status === 'pending' && (
                                                <button onClick={() => handleReject(txn)} className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-rose-100 shadow-sm"><XCircle size={14} /></button>
                                            )}
                                            <button className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100 shadow-sm"><Eye size={14} /></button>
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
