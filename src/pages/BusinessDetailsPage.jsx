import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    ArrowLeft, Building2, MapPin, Users, Package, ShoppingCart,
    History, CreditCard, Shield, User, Mail, Smartphone
} from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const BusinessDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info'); // info, users, branches, products, sales, history
    const [tabData, setTabData] = useState({ users: [], branches: [], products: [], sales: [], transactions: [] });

    useEffect(() => {
        const loadBusiness = async () => {
            try {
                // Fetch basic business info
                const businesses = await adminService.fetchAllBusinesses();
                const found = businesses.find(b => b.id === id);
                setBusiness(found);

                // Load sub-collection data concurrently
                const usersQ = query(collection(db, 'users'), where('businessId', '==', id));
                const branchesQ = query(collection(db, 'branches'), where('businessId', '==', id));
                const productsQ = query(collection(db, 'products'), where('businessId', '==', id));
                const paymentsQ = query(collection(db, 'payments'), where('businessId', '==', id));

                const [uSnap, bSnap, pSnap, paySnap] = await Promise.all([
                    getDocs(usersQ),
                    getDocs(branchesQ),
                    getDocs(productsQ),
                    getDocs(paymentsQ)
                ]);

                setTabData({
                    users: uSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                    branches: bSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                    products: pSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                    transactions: paySnap.docs.map(d => ({ id: d.id, ...d.data() }))
                });

            } catch (error) {
                console.error("Failed to load business details", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadBusiness();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Compiling Intelligence</p>
                </div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="p-8 text-center">
                <Shield className="mx-auto text-slate-300 mb-4" size={48} />
                <h2 className="text-xl font-black text-slate-800">Business Not Identified</h2>
                <button onClick={() => navigate('/accounts')} className="mt-4 text-blue-600 font-bold">Return to Hub</button>
            </div>
        );
    }

    const tabs = [
        { id: 'info', label: 'Overview', icon: Building2 },
        { id: 'users', label: 'Personnel', icon: Users, count: tabData.users.length },
        { id: 'branches', label: 'Nodes', icon: MapPin, count: tabData.branches.length },
        { id: 'products', label: 'Inventory', icon: Package, count: tabData.products.length },
        { id: 'history', label: 'Ledger', icon: History, count: tabData.transactions.length },
    ];

    return (
        <div className="flex flex-col gap-8 animate-fade-in py-6">
            {/* Premium Header */}
            <div className="bg-slate-900 rounded-none p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Building2 size={200} />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <button
                        onClick={() => navigate('/accounts')}
                        className="p-4 bg-white/10 hover:bg-white/20 rounded-none transition-all border border-white/10 group"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center flex-wrap justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-4xl font-black uppercase tracking-tight">{business.businessName}</h1>
                            <Badge variant={business.isActive ? 'success' : 'error'} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-none">
                                {business.isActive ? 'Active Node' : 'Suspended'}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400 font-medium">
                            <div className="flex items-center gap-2"><User size={14} /> {business.ownerName}</div>
                            <div className="flex items-center gap-2"><Mail size={14} /> {business.email || business.ownerEmail}</div>
                            <div className="flex items-center gap-2"><Smartphone size={14} /> {business.phoneNumber}</div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-none p-6 border border-white/10 min-w-[200px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Current Protocol</p>
                        <p className="text-2xl font-black text-blue-400 uppercase tracking-tight leading-none">{business.plan || 'Free Tier'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-none w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-none flex items-center gap-3 text-sm font-black transition-all
                            ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50'}
                        `}
                    >
                        <tab.icon size={16} />
                        <span className="uppercase tracking-wider text-[11px]">{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className={`px-2 py-0.5 rounded-none text-[10px] ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 p-8 space-y-8 bg-white dark:bg-slate-950 rounded-none border-slate-200 dark:border-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Deployment Details</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Business Entity', val: business.businessName },
                                            { label: 'System District', val: business.district },
                                            { label: 'Regional Sector', val: business.sector },
                                            { label: 'Deployment Date', val: business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'Historical' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between border-b border-slate-50 pb-2 dark:border-slate-900">
                                                <span className="text-slate-400 text-xs font-bold uppercase">{item.label}</span>
                                                <span className="text-slate-900 dark:text-white font-black text-sm">{item.val || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-purple-600 uppercase tracking-[0.2em]">Subscription Matrix</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Active Plan', val: business.plan, color: 'text-purple-600' },
                                            { label: 'License Status', val: business.subscription?.status },
                                            { label: 'Renewal Date', val: business.subscription?.endDate ? new Date(business.subscription.endDate).toLocaleDateString() : '-' },
                                            { label: 'Verification', val: business.isActive ? 'Validated' : 'Pending' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between border-b border-slate-50 pb-2 dark:border-slate-900">
                                                <span className="text-slate-400 text-xs font-bold uppercase">{item.label}</span>
                                                <span className={`font-black text-sm uppercase ${item.color || 'text-slate-900 dark:text-white'}`}>{item.val || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-slate-50 dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col justify-center text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-none mx-auto flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-6">
                                {business.businessName?.charAt(0)}
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2">Network ID</h4>
                            <p className="font-mono text-xs text-slate-400 break-all bg-white dark:bg-slate-950 p-4 rounded-none border border-slate-200 dark:border-slate-800">{id}</p>
                        </Card>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-900">
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                    {tabData.users.map(u => (
                                        <tr key={u.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all even:bg-slate-50/50 dark:even:bg-slate-900/10">
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 font-black text-slate-900 dark:text-white uppercase tracking-tight text-xs">{u.fullName || `${u.firstName} ${u.lastName}`}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-black uppercase rounded-none">{u.role}</span>
                                            </td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-xs">{u.phone}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">
                                                <Badge variant={u.isActive ? 'success' : 'error'} className="rounded-none uppercase text-[9px]">{u.isActive ? 'Active' : 'Banned'}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'branches' && (
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-900">
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Name</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Context</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">System Hash</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                    {tabData.branches.map(b => (
                                        <tr key={b.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all even:bg-slate-50/50 dark:even:bg-slate-900/10">
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 font-black text-slate-900 dark:text-white uppercase tracking-tight text-xs">{b.branchName || 'Alpha Node'}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-xs uppercase">{b.sector}, {b.district}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-emerald-600">ONLINE</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right font-mono text-[10px] text-slate-400">NODE_{b.id.substring(0, 12).toUpperCase()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-900">
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory Item</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Volume</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Unit Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                    {tabData.products.map(p => (
                                        <tr key={p.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all even:bg-slate-50/50 dark:even:bg-slate-900/10">
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 font-black text-slate-900 dark:text-white uppercase tracking-tight text-xs">{p.productName}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-xs uppercase">{p.category}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right text-xs font-bold text-slate-700 dark:text-slate-300">{p.quantity} {p.unit}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right text-xs font-black text-blue-600">{p.sellingPrice?.toLocaleString()} RWF</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest text-left">
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800">Timestamp</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800">Entry Type</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right">Credit/Debit</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">Protocol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                    {tabData.transactions.map(t => (
                                        <tr key={t.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all even:bg-slate-50/50 dark:even:bg-slate-900/10">
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-[10px] uppercase">
                                                {t.createdAt ? (typeof t.createdAt === 'object' && t.createdAt.toDate ? t.createdAt.toDate().toLocaleString() : new Date(t.createdAt).toLocaleString()) : '-'}
                                            </td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 font-black uppercase text-slate-700 dark:text-slate-300 tracking-tighter text-xs">{t.type}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right font-black text-slate-900 dark:text-white text-xs">{t.amount?.toLocaleString()} {t.currency}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">
                                                <Badge variant={t.status === 'approved' ? 'success' : 'warning'} className="uppercase text-[9px] font-black rounded-none">
                                                    {t.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessDetailsPage;
