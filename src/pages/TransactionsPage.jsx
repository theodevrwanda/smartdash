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
        <div className="space-y-6">
            <Card className="overflow-hidden p-0">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-800">Recent Transactions</h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                            <Filter size={16} /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] relative">
                    <table className="w-full text-left border-separate border-spacing-0 text-sm">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-slate-50 whitespace-nowrap">
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Transaction ID</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Amount</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Business Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Method</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Plan</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Status</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Type</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Payer Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Email</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Phone</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Manual</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Created At</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                    <td className="px-4 py-3 text-slate-500 font-mono text-xs border-b border-slate-50">{txn.id.substring(0, 8)}...</td>
                                    <td className="px-4 py-3 font-bold text-slate-800 border-b border-slate-50">
                                        {new Intl.NumberFormat('en-RW', { style: 'currency', currency: txn.currency || 'RWF' }).format(txn.amount || 0)}
                                    </td>
                                    <td className="px-4 py-3 text-slate-800 font-medium border-b border-slate-50">{txn.businessName || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 capitalize border-b border-slate-50">{txn.method || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 capitalize border-b border-slate-50">{txn.plan || 'Standard'}</td>
                                    <td className="px-4 py-3 border-b border-slate-50">
                                        <Badge variant={txn.status === 'approved' ? 'success' : txn.status === 'pending' ? 'warning' : 'default'}>
                                            {txn.status || 'pending'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 capitalize border-b border-slate-50">{txn.type || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 capitalize border-b border-slate-50">{txn.ownerName || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{txn.email || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{txn.phoneNumber || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{txn.isManualVerification ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3 text-slate-600 text-xs border-b border-slate-50">
                                        {txn.createdAt ? (typeof txn.createdAt === 'object' && txn.createdAt.toDate ? txn.createdAt.toDate().toLocaleString() : new Date(txn.createdAt).toLocaleString()) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right border-b border-slate-50">
                                        {txn.status !== 'approved' && (
                                            <button
                                                title="Approve"
                                                onClick={() => handleApprove(txn)}
                                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-slate-200"
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        {txn.status === 'pending' && (
                                            <button
                                                title="Reject"
                                                onClick={() => handleReject(txn)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200 ml-2"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="15" className="px-6 py-8 text-center text-slate-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default PaymentsPage;
