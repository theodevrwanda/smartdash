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
        <div className="flex flex-col h-full -mt-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-slate-800">Payments</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] relative border border-slate-200 rounded-sm shadow-sm bg-white">
                <table className="w-full min-w-[1500px] text-left border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50 font-semibold text-slate-600">
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Transaction ID</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Amount</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Business Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Method</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Plan</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Status</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Type</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Payer Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Email</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Phone</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Manual</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200 text-center">Created At</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-4 py-2 border-b border-r border-slate-100 font-mono text-[10px] text-slate-400">
                                    {txn.id.substring(0, 8)}...
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 font-bold text-slate-800">
                                    {new Intl.NumberFormat('en-RW', { style: 'currency', currency: txn.currency || 'RWF' }).format(txn.amount || 0)}
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-800 font-medium">{txn.businessName || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600 capitalize">{txn.method || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600 capitalize">{txn.plan || 'Standard'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100">
                                    <Badge variant={txn.status === 'approved' ? 'success' : txn.status === 'pending' ? 'warning' : 'default'}>
                                        {txn.status || 'pending'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600 capitalize">{txn.type || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600 capitalize">{txn.ownerName || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{txn.email || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{txn.phoneNumber || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{txn.isManualVerification ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600 text-[11px] text-center font-mono">
                                    {txn.createdAt ? (typeof txn.createdAt === 'object' && txn.createdAt.toDate ? txn.createdAt.toDate().toLocaleString() : new Date(txn.createdAt).toLocaleString()) : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-slate-100 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {txn.status !== 'approved' && (
                                            <button
                                                title="Approve"
                                                onClick={() => handleApprove(txn)}
                                                className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded border border-slate-200"
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        {txn.status === 'pending' && (
                                            <button
                                                title="Reject"
                                                onClick={() => handleReject(txn)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded border border-slate-200"
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
