import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    ArrowLeft, Activity, ShieldCheck, Mail, User, Clock,
    Hash, Info, Building2, MapPin, Tag, DollarSign,
    Package, BarChart3, Layers, UserCircle, Briefcase,
    FileText, AlertTriangle
} from 'lucide-react';
import Loading from '../components/ui/Loading';

const LogDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [log, setLog] = useState(null);

    useEffect(() => {
        loadLogData();
    }, [id]);

    const loadLogData = async () => {
        setLoading(true);
        try {
            const logRef = doc(db, 'transactions', id);
            const logSnap = await getDoc(logRef);

            if (logSnap.exists()) {
                setLog({ id: logSnap.id, ...logSnap.data() });
            }
        } catch (error) {
            console.error("Error loading high-resolution log data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Reconstructing Event Buffer" />;
    }

    if (!log) {
        return (
            <div className="p-12 text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <Activity className="mx-auto text-slate-200 mb-4" size={64} />
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Event Protocol Not Found</h2>
                <button onClick={() => navigate('/logs')} className="mt-6 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">Return to Matrix</button>
            </div>
        );
    }

    const detailGroups = [
        {
            title: "Security & Narrative",
            icon: ShieldCheck,
            items: [
                { label: "Execution Logic (Action)", value: log.action || log.actionDetails || 'N/A', icon: Info },
                { label: "Transaction Type", value: log.transactionType, icon: Activity, uppercase: true },
                { label: "Subject Narrative", value: log.details || 'Automated system event record.', icon: FileText }
            ]
        },
        {
            title: "Identity & Access Matrix",
            icon: UserCircle,
            items: [
                { label: "Authorized Operator", value: log.userName || log.userEmail || 'System Process', icon: User },
                { label: "Security Role", value: log.userRole, icon: Briefcase, uppercase: true },
                { label: "Operator UID", value: log.userId, icon: Hash }
            ]
        },
        {
            title: "Organizational Context",
            icon: Building2,
            items: [
                { label: "Parent Business", value: log.businessName, icon: Building2 },
                { label: "Business UID", value: log.businessId, icon: Hash },
                { label: "Assigned Infrastructure Node", value: log.branchName, icon: MapPin },
                { label: "Branch UID", value: log.branchId, icon: Hash }
            ]
        },
        {
            title: "Financial Matrix",
            icon: DollarSign,
            items: [
                { label: "Product/Asset Name", value: log.productName, icon: Package },
                { label: "Asset Category", value: log.category, icon: Tag },
                { label: "Quantity Vector", value: log.quantity, icon: Layers },
                { label: "Total Cost Basis", value: log.costPrice ? `${log.costPrice.toLocaleString()} RWF` : null, icon: DollarSign },
                { label: "Unit Cost Basis", value: log.costPricePerUnit || log.unitCost ? `${(log.costPricePerUnit || log.unitCost).toLocaleString()} RWF` : null, icon: DollarSign },
                { label: "Selling Valuation", value: log.sellingPrice ? `${log.sellingPrice.toLocaleString()} RWF` : null, icon: DollarSign },
                { label: "Profit Attained", value: log.profit ? `${log.profit.toLocaleString()} RWF` : null, icon: BarChart3, color: 'text-emerald-600' },
                { label: "System Loss", value: log.loss ? `${log.loss.toLocaleString()} RWF` : null, icon: AlertTriangle, color: 'text-rose-600' }
            ]
        },
        {
            title: "Temporal Registry",
            icon: Clock,
            items: [
                { label: "Execution Timestamp", value: log.createdAt || log.timestamp ? new Date(log.createdAt || log.timestamp).toLocaleString() : 'N/A', icon: Clock },
                { label: "Internal Protocol ID", value: log.id, icon: Hash }
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-8 py-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/logs')}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                            <Activity size={12} />
                            <span>Operational Intelligence Stream</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                            Log Vector Detail
                        </h1>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                            Transaction Hash: {log.id.substring(0, 20)}...
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-6 py-2 border font-black text-xs uppercase tracking-widest ${log.severity === 'error' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                        {log.severity || 'Information Signal'}
                    </div>
                </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {detailGroups.map((group, gIdx) => (
                    <Card key={gIdx} className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-none border-l-4 border-l-blue-600">
                        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <group.icon size={16} className="text-blue-600" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{group.title}</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {group.items.filter(item => item.value !== undefined && item.value !== null).map((item, iIdx) => (
                                <div key={iIdx} className="flex flex-col gap-1 border-b border-slate-50 dark:border-slate-900 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        <item.icon size={10} /> {item.label}
                                    </div>
                                    <span className={`text-sm font-black ${item.color || 'text-slate-900 dark:text-white'} ${item.uppercase ? 'uppercase' : ''}`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}

                {/* Metadata Raw View if exists */}
                {log.metadata && (
                    <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-none border-l-4 border-l-amber-500 lg:col-span-2">
                        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <Layers size={16} className="text-amber-500" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Raw Payload (Metadata)</h3>
                        </div>
                        <div className="p-6">
                            <pre className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 overflow-x-auto text-[10px] font-mono text-slate-600 dark:text-slate-400">
                                {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                        </div>
                    </Card>
                )}
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-4 pt-12 border-t border-slate-100 dark:border-slate-900">
                <button
                    onClick={() => navigate('/logs')}
                    className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all border-none"
                >
                    Return to Audit Registry
                </button>
            </div>
        </div>
    );
};

export default LogDetailsPage;
