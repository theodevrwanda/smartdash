import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Download, Filter, CheckCircle, XCircle, Clock, CreditCard, ShieldCheck, Eye, Trash2, Hash, ShoppingCart, User, Power } from 'lucide-react';
import { adminService } from '../services/adminService';

const PaymentsPage = () => {
    const navigate = useNavigate();
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
                await adminService.approveTransaction(txn.id, txn.businessId, txn.plan || 'monthly');
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
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all">
                        <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95">
                        <Download size={14} /> Export
                    </button>
                    <button
                        onClick={loadTransactions}
                        className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all active:scale-95"
                    >
                        <Clock className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[2000px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest text-left whitespace-nowrap">
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">No</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Business Name</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Business ID</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Owner Name</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Owner Email</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Owner Phone</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Amount</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Currency</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Method</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Plan</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Type</th>
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
                                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{txn.businessName || '-'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-[10px] font-mono font-bold text-slate-400">{txn.businessId || '-'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{txn.ownerName || '-'}</span>
                                    </td>
                                    <td className="px-4 py-4 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 lowercase">{txn.email || '-'}</span>
                                    </td>
                                    <td className="px-4 py-4 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{txn.phoneNumber || '-'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-right">
                                        <span className="text-sm font-black text-emerald-600 font-mono tracking-tight">{txn.amount?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <span className="text-[10px] font-black text-slate-400">{txn.currency || 'RWF'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{txn.method || 'MOMO'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none bg-purple-50 text-purple-600 border-purple-100">
                                            {(() => {
                                                const p = (txn.plan || '').toLowerCase();
                                                if (['monthly', 'month'].includes(p)) return 'monthly';
                                                if (['annually', 'yearly', 'year'].includes(p)) return 'annually';
                                                return p || 'free';
                                            })()}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none bg-blue-50 text-blue-600 border-blue-100">{txn.type || 'PAYMENT'}</Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                                                {txn.timestamp ? (typeof txn.timestamp === 'object' && txn.timestamp.toDate ? txn.timestamp.toDate().toLocaleDateString() : new Date(txn.timestamp).toLocaleDateString()) : '-'}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-400">
                                                {txn.timestamp ? (typeof txn.timestamp === 'object' && txn.timestamp.toDate ? txn.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <Badge
                                            variant={txn.status === 'success' || txn.status === 'completed' || txn.status === 'approved' ? 'success' : txn.status === 'pending' ? 'warning' : 'error'}
                                            className="rounded-none uppercase text-[9px] font-black px-3 py-1"
                                        >
                                            {txn.status || 'PENDING'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => navigate(`/transactions/${txn.id}`)}
                                                className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800"
                                                title="View Ledger Detail"
                                            >
                                                <Eye size={12} />
                                            </button>
                                            {txn.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => adminService.approveTransaction(txn.id, txn.businessId, txn.plan).then(loadTransactions)}
                                                        className="p-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 dark:border-emerald-800"
                                                        title="Approve Settlement"
                                                    >
                                                        <ShieldCheck size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => adminService.rejectTransaction(txn.id).then(loadTransactions)}
                                                        className="p-1.5 text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800"
                                                        title="Reject Request"
                                                    >
                                                        <Power size={12} />
                                                    </button>
                                                </>
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
