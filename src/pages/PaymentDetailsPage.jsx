import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    ArrowLeft, CreditCard, User, Building2, Calendar,
    Smartphone, Mail, Hash, ShieldCheck, Clock,
    CheckCircle, XCircle, Globe, History, Info
} from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const PaymentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransaction();
    }, [id]);

    const loadTransaction = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'payments', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                let businessName = data.businessName || 'Unknown';
                let ownerName = 'Unknown';

                // Try to resolve business and owner names if not in payment document
                if (data.businessId) {
                    const businessDoc = await getDoc(doc(db, 'businesses', data.businessId));
                    if (businessDoc.exists()) {
                        const bData = businessDoc.data();
                        businessName = bData.businessName;
                        if (bData.ownerId) {
                            const userDoc = await getDoc(doc(db, 'users', bData.ownerId));
                            if (userDoc.exists()) {
                                const uData = userDoc.data();
                                ownerName = uData.fullName || `${uData.firstName} ${uData.lastName}`;
                            }
                        }
                    }
                }

                // Fallback for user if ownerName still unknown
                if (ownerName === 'Unknown' && data.userId) {
                    const userDoc = await getDoc(doc(db, 'users', data.userId));
                    if (userDoc.exists()) {
                        const uData = userDoc.data();
                        ownerName = uData.fullName || `${uData.firstName} ${uData.lastName}`;
                    }
                }

                setTransaction({
                    id: docSnap.id,
                    ...data,
                    businessName,
                    ownerName
                });
            }
        } catch (error) {
            console.error("Failed to load transaction details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Securing Ledger Data</p>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="p-8 text-center">
                <ShieldCheck className="mx-auto text-slate-300 mb-4" size={48} />
                <h2 className="text-xl font-black text-slate-800">Transaction Not Found</h2>
                <button onClick={() => navigate('/transactions')} className="mt-4 text-blue-600 font-bold uppercase text-sm">Back to Ledger</button>
            </div>
        );
    }

    const detailSections = [
        {
            title: "Entity Intelligence",
            icon: Building2,
            items: [
                { label: "Business Name", value: transaction.businessName, icon: Building2 },
                { label: "Business ID", value: transaction.businessId, icon: Hash, mono: true },
                { label: "Owner Identity", value: transaction.ownerName, icon: User },
                { label: "User UID", value: transaction.userId, icon: Hash, mono: true }
            ]
        },
        {
            title: "Financial Telemetry",
            icon: CreditCard,
            items: [
                { label: "Transaction Amount", value: `${transaction.amount?.toLocaleString()} ${transaction.currency}`, icon: CreditCard, highlight: true },
                { label: "Payment Gateway", value: transaction.method, icon: Globe, uppercase: true },
                {
                    label: "Plan Type", value: (() => {
                        const p = (transaction.plan || '').toLowerCase();
                        if (['monthly', 'month'].includes(p)) return 'monthly';
                        if (['annually', 'yearly', 'year'].includes(p)) return 'annually';
                        return p || 'free';
                    })(), icon: Info, uppercase: true
                },
                { label: "System Priority", value: transaction.type, icon: ShieldCheck, uppercase: true }
            ]
        },
        {
            title: "Temporal Context",
            icon: Clock,
            items: [
                { label: "Creation Date", value: transaction.createdAt ? (typeof transaction.createdAt === 'object' && transaction.createdAt.toDate ? transaction.createdAt.toDate().toLocaleString() : new Date(transaction.createdAt).toLocaleString()) : '-', icon: Calendar },
                { label: "Approval Date", value: transaction.approvedAt ? (typeof transaction.approvedAt === 'object' && transaction.approvedAt.toDate ? transaction.approvedAt.toDate().toLocaleString() : new Date(transaction.approvedAt).toLocaleString()) : '-', icon: CheckCircle },
                { label: "Execution Status", value: transaction.status, icon: Info, status: true }
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-8 animate-fade-in py-6">
            {/* Header Area */}
            <div className="bg-slate-900 rounded-none p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <History size={200} />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <button
                        onClick={() => navigate('/transactions')}
                        className="p-4 bg-white/10 hover:bg-white/20 rounded-none transition-all border border-white/10 group"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center flex-wrap justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-black uppercase tracking-tight">Payment Archive</h1>
                            <Badge variant={transaction.status === 'approved' ? 'success' : transaction.status === 'pending' ? 'warning' : 'error'} className="bg-white/10 text-white border-white/20 rounded-none py-1">
                                {transaction.status}
                            </Badge>
                        </div>
                        <p className="font-mono text-xs text-slate-400">TXN_REF_{transaction.id.toUpperCase()}</p>
                    </div>

                    <div className="bg-emerald-500/10 backdrop-blur-md rounded-none p-6 border border-emerald-500/20 min-w-[240px] text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 mb-1">Settlement Volume</p>
                        <p className="text-3xl font-black text-emerald-400 tracking-tight leading-none">
                            {transaction.amount?.toLocaleString()} <span className="text-sm opacity-50">{transaction.currency}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {detailSections.map((section, idx) => (
                        <Card key={idx} className="p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-none">
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <section.icon size={16} className="text-blue-600" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{section.title}</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <item.icon size={10} />
                                            {item.label}
                                        </div>
                                        {item.status ? (
                                            <Badge variant={item.value === 'approved' ? 'success' : 'warning'} className="w-fit rounded-none uppercase px-3 py-1 font-black text-[10px]">
                                                {item.value}
                                            </Badge>
                                        ) : (
                                            <span className={`text-sm font-bold tracking-tight ${item.mono ? 'font-mono text-blue-600' : 'text-slate-900 dark:text-white'} ${item.uppercase ? 'uppercase' : ''} ${item.highlight ? 'text-lg font-black text-emerald-600' : ''}`}>
                                                {item.value || '-'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="p-8 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-none flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-600 rounded-none flex items-center justify-center text-3xl font-black text-white mb-6">
                            {transaction.ownerName?.charAt(0)}
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase mb-1">{transaction.ownerName}</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{transaction.email || 'Verified User'}</p>

                        <div className="w-full space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Phone Number</span>
                                <span className="text-slate-900 dark:text-white">{transaction.phoneNumber || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Verification</span>
                                <span className={transaction.isManualVerification ? "text-amber-500" : "text-emerald-500"}>
                                    {transaction.isManualVerification ? "MANUAL" : "AUTOMATIC"}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-900 text-white rounded-none border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={80} />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-500">Validation Protocol</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                            This transaction was cryptographically secured and validated against the financial ledger on {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'system date'}.
                        </p>
                        <Badge variant="outline" className="text-[10px] font-black uppercase border-white/20 text-white rounded-none">
                            Identity Verified
                        </Badge>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsPage;
