import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    ArrowLeft, Building2, MapPin, Users, Package, ShoppingCart,
    History, CreditCard, Shield, User, Mail, Smartphone,
    Trash2, Edit, Eye, X, Activity, Globe, Info, Search,
    TrendingUp, TrendingDown, DollarSign, Calendar, Clock
} from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Loading from '../components/ui/Loading';

const Modal = ({ isOpen, onClose, title, children, footer, variant = 'default' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-none shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className={`flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 ${variant === 'danger' ? 'bg-red-50/50 dark:bg-red-950/20' : variant === 'warning' ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}`}>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-none transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8 overflow-y-auto flex-1">
                    {children}
                </div>
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

const BusinessDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info'); // info, users, branches, products, sales, history
    const [tabData, setTabData] = useState({ users: [], branches: [], products: [], sales: [], transactions: [] });
    const [productFilter, setProductFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all'); // all, today, week, year
    const [productSearch, setProductSearch] = useState('');
    const [customDate, setCustomDate] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    // Modal Control
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null); // 'users', 'branches', 'products'
    const [activeModal, setActiveModal] = useState(null); // 'edit', 'delete', 'details'
    const [formData, setFormData] = useState({});

    const openModal = (type, item, modalType) => {
        setItemType(type);
        setSelectedItem(item);
        setActiveModal(modalType);
        if (modalType === 'edit') setFormData(item);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedItem(null);
        setItemType(null);
        setFormData({});
    };

    const loadBusiness = async () => {
        setLoading(true);
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

    const handleDelete = async () => {
        if (!selectedItem || !itemType) return;
        try {
            await adminService.deleteDocument(itemType, selectedItem.id);
            await loadBusiness();
            closeModal();
        } catch (error) {
            alert("Deletion failed: " + error.message);
        }
    };

    const handleUpdate = async () => {
        if (!selectedItem || !itemType) return;
        try {
            // Filter out internal state or IDs if necessary
            const { id, ...updateData } = formData;
            await adminService.updateDocument(itemType, selectedItem.id, updateData);
            await loadBusiness();
            closeModal();
        } catch (error) {
            alert("Update failed: " + error.message);
        }
    };

    useEffect(() => {
        if (id) loadBusiness();
    }, [id]);

    const financialStats = React.useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const tempNowForWeek = new Date();
        const day = tempNowForWeek.getDay();
        const diff = tempNowForWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const startOfCurrentWeek = new Date(tempNowForWeek.setDate(diff));
        startOfCurrentWeek.setHours(0, 0, 0, 0);

        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const periods = {
            today: { revenue: 0, profit: 0, loss: 0 },
            week: { revenue: 0, profit: 0, loss: 0 },
            year: { revenue: 0, profit: 0, loss: 0 }
        };

        tabData.products.forEach(p => {
            const dateStr = p.soldDate || p.updatedAt || p.addedDate;
            if (!dateStr) return;

            const pDate = new Date(dateStr);
            const qty = Number(p.quantity) || 0;
            const sellPrice = Number(p.sellingPrice) || 0;
            const costPrice = Number(p.costPricePerUnit) || 0;

            const updatePeriod = (period) => {
                if (p.status === 'sold') {
                    periods[period].revenue += sellPrice * qty;
                    periods[period].profit += (sellPrice - costPrice) * qty;
                } else if (p.status === 'deleted') {
                    periods[period].loss += costPrice * qty;
                }
            };

            if (pDate >= startOfToday) updatePeriod('today');
            if (pDate >= startOfCurrentWeek) updatePeriod('week');
            if (pDate >= startOfYear) updatePeriod('year');
        });

        return periods;
    }, [tabData.products]);

    const productStats = tabData.products.reduce((acc, p) => {
        const status = p.status || 'store';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, { store: 0, sold: 0, restored: 0, deleted: 0 });

    const tabs = [
        { id: 'info', label: 'Overview', icon: Building2 },
        { id: 'users', label: 'Users', icon: Users, count: tabData.users.length },
        { id: 'branches', label: 'Branches', icon: MapPin, count: tabData.branches.length },
        { id: 'products', label: 'Products', icon: Package, count: tabData.products.length },
        { id: 'history', label: 'Payment History', icon: History, count: tabData.transactions.length },
    ];

    if (loading) {
        return <Loading message="Compiling Intelligence" />;
    }

    if (!business) {
        return (
            <div className="p-8 text-center">
                <Shield className="mx-auto text-slate-300 mb-4" size={48} />
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Business Not Identified</h2>
                <button onClick={() => navigate('/accounts')} className="mt-4 text-blue-600 font-bold">Return to Hub</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in py-6">
            {/* Premium Header */}
            <div className="bg-slate-900 rounded-none p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Building2 size={200} />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <button
                        onClick={() => navigate('/accounts')}
                        className="p-4 bg-white/10 hover:bg-white/20 rounded-none transition-all border border-white/10 group dark:text-white"
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
                        <p className="text-2xl font-black text-blue-400 uppercase tracking-tight leading-none">
                            {(() => {
                                const p = (business.plan || 'free').toLowerCase();
                                if (['monthly', 'month'].includes(p)) return 'monthly';
                                if (['annually', 'yearly', 'year'].includes(p)) return 'annually';
                                return p;
                            })()}
                        </p>
                    </div>
                </div>
            </div>
            {/* Financial Pulse - Big Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { id: 'today', label: 'Today', stats: financialStats.today, icon: Clock, color: 'blue' },
                    { id: 'week', label: 'This Week', stats: financialStats.week, icon: Calendar, color: 'emerald' },
                    { id: 'year', label: 'This Year', stats: financialStats.year, icon: TrendingUp, color: 'purple' },
                ].map((period) => (
                    <div
                        key={period.id}
                        onClick={() => {
                            setTimeFilter(period.id);
                            setActiveTab('products');
                            if (productFilter === 'all') setProductFilter('sold');
                        }}
                        className={`bg-white dark:bg-slate-950 border-2 p-6 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group
                            ${timeFilter === period.id
                                ? period.id === 'today' ? 'border-blue-600 ring-4 ring-blue-500/10'
                                    : period.id === 'week' ? 'border-emerald-600 ring-4 ring-emerald-500/10'
                                        : 'border-purple-600 ring-4 ring-purple-500/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-slate-100`}>
                                <period.icon className={
                                    period.id === 'today' ? 'text-blue-600' :
                                        period.id === 'week' ? 'text-emerald-600' :
                                            'text-purple-600'
                                } size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Pulse</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{period.label} Revenue</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {period.stats.revenue.toLocaleString()} <span className="text-xs opacity-40">RWF</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-900">
                                <div>
                                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Net Profits</p>
                                    <p className="text-sm font-black text-slate-800 dark:text-white">{period.stats.profit.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-rose-600 uppercase tracking-tighter">Inventory Loss</p>
                                    <p className="text-sm font-black text-slate-800 dark:text-white">{period.stats.loss.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { id: 'store', label: 'In Store', count: productStats.store, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40' },
                    { id: 'sold', label: 'Sold', count: productStats.sold, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40' },
                    { id: 'restored', label: 'Restored', count: productStats.restored, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40' },
                    { id: 'deleted', label: 'Deleted', count: productStats.deleted, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20', hover: 'hover:bg-rose-100 dark:hover:bg-rose-900/40' },
                ].map((stat, i) => (
                    <button
                        key={i}
                        onClick={() => { setProductFilter(stat.id); setActiveTab('products'); }}
                        className={`p-4 ${stat.bg} ${stat.hover} border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center transition-all cursor-pointer group
                            ${productFilter === stat.id && activeTab === 'products' ? 'ring-2 ring-inset ring-blue-600 border-transparent' : ''}
                        `}
                    >
                        <span className={`text-2xl font-black ${stat.color} group-hover:scale-110 transition-transform`}>{stat.count}</span>
                        <span className="text-[10px] font-black uppercase text-slate-500 dark:text-white tracking-widest">{stat.label}</span>
                    </button>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-none w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-none flex items-center gap-3 text-sm font-black transition-all
                            ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-800 text-blue-600'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50'}
                        `}
                    >
                        <tab.icon size={16} />
                        <span className="uppercase tracking-wider text-[11px]">{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className={`px-2 py-0.5 rounded-none text-[10px] ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-white'}`}>
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
                                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Operational Overview</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Business Status', val: business.isActive ? 'Validated / Active' : 'Suspended' },
                                            { label: 'Total Users', val: tabData.users.length },
                                            { label: 'Active Branches', val: tabData.branches.length },
                                            { label: 'System District', val: business.district },
                                            { label: 'Regional Sector', val: business.sector },
                                            { label: 'Deployment Date', val: business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'Historical' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between border-b border-slate-50 pb-2 dark:border-slate-900">
                                                <span className="text-slate-400 dark:text-white text-xs font-bold uppercase">{item.label}</span>
                                                <span className="text-slate-900 dark:text-white font-black text-sm">{item.val || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-purple-600 uppercase tracking-[0.2em]">Subscription Matrix</h3>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                label: 'Active Plan',
                                                val: (() => {
                                                    const p = (business.plan || business.subscription?.plan || 'free').toLowerCase();
                                                    if (['monthly', 'month'].includes(p)) return 'monthly';
                                                    if (['annually', 'yearly', 'year'].includes(p)) return 'annually';
                                                    return p;
                                                })(),
                                                color: 'text-purple-600'
                                            },
                                            { label: 'License Status', val: business.subscription?.status },
                                            { label: 'Renewal Date', val: business.subscription?.endDate ? new Date(business.subscription.endDate).toLocaleDateString() : '-' },
                                            { label: 'Verification', val: business.isActive ? 'Validated' : 'Pending' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between border-b border-slate-50 pb-2 dark:border-slate-900">
                                                <span className="text-slate-400 dark:text-white text-xs font-bold uppercase">{item.label}</span>
                                                <span className={`font-black text-sm uppercase ${item.color || 'text-slate-900 dark:text-white'}`}>{item.val || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-slate-50 dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col justify-center text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-none mx-auto flex items-center justify-center text-3xl font-black text-white mb-6">
                                {business.businessName?.charAt(0)}
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2">{business.businessName}</h4>
                            <p className="font-mono text-[10px] text-slate-400 break-all bg-white dark:bg-slate-950 p-4 rounded-none border border-slate-200 dark:border-slate-800">REF_{id.toUpperCase()}</p>
                        </Card>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-900">
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Identity</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Contact</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Role</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Branch</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">District</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Sector</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Cell</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Village</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setSortConfig({ key: 'date', direction: sortConfig.direction === 'desc' ? 'asc' : 'desc' })}>Timeline {sortConfig.direction === 'desc' ? '▼' : '▲'}</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-center">Status</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                    {tabData.users
                                        .sort((a, b) => {
                                            const dateA = new Date(a.createdAt);
                                            const dateB = new Date(b.createdAt);
                                            return sortConfig.direction === 'desc' ? dateB - dateA : dateA - dateB;
                                        })
                                        .map(u => {
                                            const branchName = tabData.branches.find(b => b.id === u.branch)?.branchName || 'Alpha Node';
                                            return (
                                                <tr key={u.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden">
                                                                {(u.profileImage || u.imagephoto) ? (
                                                                    <img src={u.profileImage || u.imagephoto} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User className="w-full h-full p-1.5 text-slate-400" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xs">{u.fullName || `${u.firstName} ${u.lastName}`}</span>
                                                                <span className="text-[9px] font-bold text-slate-400">@{u.username || 'unknown'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-700 dark:text-white">{u.email}</span>
                                                            <span className="text-[9px] font-black text-slate-400 dark:text-white">{u.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[9px] font-black uppercase rounded-none w-fit border border-blue-100 dark:border-blue-800/50">{u.role}</span>
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[9px] font-black text-slate-500 dark:text-white uppercase tracking-tighter italic">
                                                        {branchName}
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-white uppercase tracking-tighter">
                                                        {u.district}
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-white uppercase tracking-tighter">
                                                        {u.sector}
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-white uppercase tracking-tighter">
                                                        {u.cell}
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-white uppercase tracking-tighter">
                                                        {u.village}
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[9px] font-black text-slate-400 dark:text-white uppercase tracking-widest">Registered</span>
                                                            <span className="text-[10px] font-bold text-slate-700 dark:text-white">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">
                                                        <Badge variant={u.isActive ? 'success' : 'error'} className="rounded-none uppercase text-[9px] font-black">{u.isActive ? 'Active' : 'Banned'}</Badge>
                                                    </td>
                                                    <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <button onClick={() => openModal('users', u, 'details')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
                                                            <button onClick={() => openModal('users', u, 'edit')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600 transition-colors"><Edit size={14} /></button>
                                                            <button onClick={() => openModal('users', u, 'delete')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Branch Name</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Context</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Status</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                    {tabData.branches.map(b => (
                                        <tr key={b.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all even:bg-slate-50/50 dark:even:bg-slate-900/10">
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 font-black text-slate-900 dark:text-white uppercase tracking-tight text-xs">{b.branchName || 'Alpha Node'}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-xs uppercase">{b.village || 'N/A'}, {b.sector}, {b.district}</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-emerald-600">ONLINE</td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => openModal('branches', b, 'details')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
                                                    <button onClick={() => openModal('branches', b, 'edit')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600 transition-colors"><Edit size={14} /></button>
                                                    <button onClick={() => openModal('branches', b, 'delete')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="flex flex-col gap-4">
                        {/* Product Filters & Search */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'all', label: 'All Matrix' },
                                    { id: 'store', label: 'In Store' },
                                    { id: 'sold', label: 'Sold' },
                                    { id: 'restored', label: 'Restored' },
                                    { id: 'deleted', label: 'Deleted' }
                                ].map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setProductFilter(f.id)}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border
                                            ${productFilter === f.id
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-blue-600'}
                                        `}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-48 group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                                    <input
                                        type="date"
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 pl-10 text-[11px] font-black uppercase tracking-tight outline-none focus:border-blue-600 transition-colors dark:text-white"
                                    />
                                </div>
                                <div className="relative w-full md:w-72 group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                                    <input
                                        type="text"
                                        placeholder="SEARCH ASSET INVENTORY..."
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 pl-10 text-[11px] font-black uppercase tracking-tight outline-none focus:border-blue-600 transition-colors dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setTimeFilter('all');
                                        setProductFilter('all');
                                        setProductSearch('');
                                        setCustomDate('');
                                    }}
                                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-none">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100 dark:bg-slate-900">
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Product / Identity</th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Branch Context</th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Category</th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-right">Volume</th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-right">Unit Cost</th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-right">Selling Price</th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-right">
                                                {productFilter === 'sold' ? 'Total Revenue' : 'Total Equity'}
                                            </th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setSortConfig({ key: 'date', direction: sortConfig.direction === 'desc' ? 'asc' : 'desc' })}>Timeline {sortConfig.direction === 'desc' ? '▼' : '▲'}</th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-center">Status</th>
                                            <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                        {tabData.products
                                            .filter(p => {
                                                const matchesStatus = productFilter === 'all' || (p.status || 'store') === productFilter;

                                                // Time filtering logic
                                                let matchesTime = true;
                                                if (timeFilter !== 'all') {
                                                    const pDate = new Date(p.soldDate || p.updatedAt || p.addedDate);
                                                    const now = new Date();
                                                    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                                                    const tempNowForWeek = new Date();
                                                    const day = tempNowForWeek.getDay();
                                                    const diff = tempNowForWeek.getDate() - day + (day === 0 ? -6 : 1);
                                                    const startOfCurrentWeek = new Date(tempNowForWeek.setDate(diff));
                                                    startOfCurrentWeek.setHours(0, 0, 0, 0);

                                                    const startOfYear = new Date(now.getFullYear(), 0, 1);

                                                    if (timeFilter === 'today') matchesTime = pDate >= startOfToday;
                                                    else if (timeFilter === 'week') matchesTime = pDate >= startOfCurrentWeek;
                                                    else if (timeFilter === 'year') matchesTime = pDate >= startOfYear;
                                                }

                                                const matchesSearch = !productSearch ||
                                                    p.productName?.toLowerCase().includes(productSearch.toLowerCase()) ||
                                                    p.model?.toLowerCase().includes(productSearch.toLowerCase()) ||
                                                    p.category?.toLowerCase().includes(productSearch.toLowerCase());

                                                const matchesCustomDate = !customDate ||
                                                    (p.soldDate || p.updatedAt || p.addedDate)?.startsWith(customDate);

                                                return matchesStatus && matchesTime && matchesSearch && matchesCustomDate;
                                            })
                                            .sort((a, b) => {
                                                const dateA = new Date(a.soldDate || a.updatedAt || a.addedDate);
                                                const dateB = new Date(b.soldDate || b.updatedAt || b.addedDate);
                                                return sortConfig.direction === 'desc' ? dateB - dateA : dateA - dateB;
                                            })
                                            .map(p => {
                                                const branchName = tabData.branches.find(b => b.id === p.branch)?.branchName || 'Alpha Node';
                                                const priceForEquity = p.status === 'sold' ? (Number(p.sellingPrice) || 0) : (Number(p.costPricePerUnit) || 0);
                                                const totalEquity = priceForEquity * (Number(p.quantity) || 0);
                                                return (
                                                    <tr key={p.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xs">{p.productName}</span>
                                                                <span className="text-[9px] font-bold text-slate-400 dark:text-white">{p.model}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-white uppercase tracking-tighter">
                                                            {branchName}
                                                        </td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-white font-bold text-xs uppercase">{p.category}</td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right text-xs font-bold text-slate-700 dark:text-white">{p.quantity} {p.unit}</td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right font-black text-emerald-600 text-xs">
                                                            {p.costPricePerUnit?.toLocaleString()}
                                                        </td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right font-black text-blue-600 text-xs">
                                                            {p.sellingPrice?.toLocaleString()}
                                                        </td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right font-black text-slate-900 dark:text-white text-xs">
                                                            <div className="flex flex-col items-end">
                                                                <span>{totalEquity.toLocaleString()}</span>
                                                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
                                                                    {p.status === 'sold' ? 'Revenue' : 'Equity'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[9px] font-black text-slate-400 dark:text-white uppercase tracking-[0.1em]">Added: {p.addedDate ? new Date(p.addedDate).toLocaleDateString() : '-'}</span>
                                                                <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.1em]">Exp: {p.expiryDate || p.deadline || '-'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">
                                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${p.status === 'sold' ? 'text-emerald-600 bg-emerald-50' : p.status === 'deleted' ? 'text-rose-600 bg-rose-50' : p.status === 'restored' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'}`}>
                                                                {p.status || 'store'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right">
                                                            <div className="flex justify-end gap-1">
                                                                <button onClick={() => openModal('products', p, 'details')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
                                                                <button onClick={() => openModal('products', p, 'edit')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600 transition-colors"><Edit size={14} /></button>
                                                                <button onClick={() => openModal('products', p, 'delete')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 dark:text-white uppercase tracking-widest text-left">
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800">Timestamp</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800">Method</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right">Amount</th>
                                        <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                    {tabData.transactions.map(t => (
                                        <tr key={t.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all even:bg-slate-50/50 dark:even:bg-slate-900/10">
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-white font-mono text-[10px] uppercase">
                                                {t.createdAt ? (typeof t.createdAt === 'object' && t.createdAt.toDate ? t.createdAt.toDate().toLocaleString() : new Date(t.createdAt).toLocaleString()) : '-'}
                                            </td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 font-black uppercase text-slate-700 dark:text-white tracking-tighter text-xs">
                                                <div className="flex flex-col">
                                                    <span>{t.method || t.type}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold">{t.phoneNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right font-black text-slate-900 dark:text-white text-xs whitespace-nowrap">{t.amount?.toLocaleString()} {t.currency}</td>
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

            {/* Modals Implementation */}
            {/* View Details Modal */}
            <Modal
                isOpen={activeModal === 'details'}
                onClose={closeModal}
                title={`${itemType?.slice(0, -1)} Intelligence Archive`}
                footer={<button onClick={closeModal} className="px-8 py-3 bg-slate-900 text-white font-black uppercase text-xs">Acknowledge</button>}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem && Object.entries(selectedItem)
                        .filter(([key]) => !(itemType === 'users' && (key === 'isActive' || key === 'imagephoto' || key === 'updatedAt')))
                        .map(([key, val]) => (
                            <div key={key} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <p className="text-[9px] font-black text-slate-400 dark:text-white uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-white break-all">
                                    {(key === 'profileImage' || key === 'imagephoto') ? (
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                                            {val ? (
                                                <img src={val} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-full h-full p-4 text-slate-300" />
                                            )}
                                        </div>
                                    ) : (
                                        typeof val === 'object' ? JSON.stringify(val) : String(val)
                                    )}
                                </p>
                            </div>
                        ))}
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={activeModal === 'edit'}
                onClose={closeModal}
                title={`Modify ${itemType?.slice(0, -1)} Parameters`}
                footer={
                    <>
                        <button onClick={closeModal} className="px-6 py-2 font-bold text-slate-500 uppercase text-xs">Cancel</button>
                        <button onClick={handleUpdate} className="px-8 py-3 bg-blue-600 text-white font-black uppercase text-xs">Commit Changes</button>
                    </>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem && Object.keys(selectedItem).filter(k => {
                        const commonExclude = ['id', 'createdAt', 'businessId', 'updatedAt'];
                        const userExclude = ['imagephoto', 'profileImage', 'fullName', 'productNameLower', 'modelLower', 'categoryLower'];
                        return !commonExclude.includes(k) && !(itemType === 'users' && userExclude.includes(k));
                    }).map(key => (
                        <div key={key} className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-widest ml-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                            {((itemType === 'products' || itemType === 'users') && key === 'branch') ? (
                                <select
                                    value={formData[key] || ''}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none outline-none focus:border-blue-500 font-bold text-sm uppercase dark:text-white"
                                >
                                    <option value="">Select Branch</option>
                                    {tabData.branches.map(b => (
                                        <option key={b.id} value={b.id}>{b.branchName}</option>
                                    ))}
                                </select>
                            ) : itemType === 'users' && key === 'role' ? (
                                <select
                                    value={formData[key] || ''}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none outline-none focus:border-blue-500 font-bold text-sm uppercase dark:text-white"
                                >
                                    {['super_admin', 'admin', 'staff'].map(role => (
                                        <option key={role} value={role}>{role.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            ) : itemType === 'users' && key === 'isActive' ? (
                                <select
                                    value={formData[key] === true ? 'true' : 'false'}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value === 'true' })}
                                    className={`w-full px-4 py-3 border rounded-none outline-none font-black text-sm uppercase transition-colors ${formData[key] ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}
                                >
                                    <option value="true">Active (Verified)</option>
                                    <option value="false">Inactive (Suspended)</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={formData[key] || ''}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none outline-none focus:border-blue-500 font-bold text-sm dark:text-white"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={activeModal === 'delete'}
                onClose={closeModal}
                title="Protocol Termination"
                variant="danger"
                footer={
                    <>
                        <button onClick={closeModal} className="px-6 py-2 font-bold text-slate-500 uppercase text-xs">Abort</button>
                        <button onClick={handleDelete} className="px-8 py-3 bg-rose-600 text-white font-black uppercase text-xs">Execute Purege</button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center gap-6 py-4">
                    <div className="w-20 h-20 bg-rose-100 text-rose-600 flex items-center justify-center animate-pulse">
                        <Trash2 size={40} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Irreversible Data Purge</h4>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                            You are about to disconnect this <span className="text-rose-600 font-black uppercase">{itemType?.slice(0, -1)}</span> from the neural network. All associated telemetry will be archived or lost.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BusinessDetailsPage;
