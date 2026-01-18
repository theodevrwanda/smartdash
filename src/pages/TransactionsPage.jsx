import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Download, Filter, CheckCircle, XCircle } from 'lucide-react';
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
                // Call adminService.rejectTransaction (need to implement this in service)
                await adminService.rejectTransaction(txn.id, reason);
                loadTransactions();
            } catch (error) {
                alert("Failed to reject");
            }
        }
    };

    if (loading) {
        return <div className="p-6">Loading transactions...</div>;
    }

    return (
        <div className="flex flex-col h-full -mt-2 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">Payments</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] relative border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm bg-white dark:bg-slate-900">
                <table className="w-full min-w-[1500px] text-left border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Transaction ID</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Amount</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Business Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Method</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Plan</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Status</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Type</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Payer Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Email</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Phone</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Manual</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700 text-center">Created At</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                    {txn.id.substring(0, 8)}...
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-100">
                                    {new Intl.NumberFormat('en-RW', { style: 'currency', currency: txn.currency || 'RWF' }).format(txn.amount || 0)}
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-medium">{txn.businessName || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 capitalize">{txn.method || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 capitalize">{txn.plan || 'Standard'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800">
                                    <Badge variant={txn.status === 'approved' ? 'success' : txn.status === 'pending' ? 'warning' : 'default'}>
                                        {txn.status || 'pending'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 capitalize">{txn.type || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 capitalize">{txn.ownerName || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{txn.email || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{txn.phoneNumber || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{txn.isManualVerification ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] text-center font-mono">
                                    {txn.createdAt ? (typeof txn.createdAt === 'object' && txn.createdAt.toDate ? txn.createdAt.toDate().toLocaleString() : new Date(txn.createdAt).toLocaleString()) : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {txn.status !== 'approved' && (
                                            <button
                                                title="Approve"
                                                onClick={() => handleApprove(txn)}
                                                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded border border-slate-200 dark:border-slate-700"
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        {txn.status === 'pending' && (
                                            <button
                                                title="Reject"
                                                onClick={() => handleReject(txn)}
                                                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-slate-200 dark:border-slate-700"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentsPage;
