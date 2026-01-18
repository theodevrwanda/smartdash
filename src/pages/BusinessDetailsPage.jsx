import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    ArrowLeft, Building2, MapPin, Users, Package, ShoppingCart,
    History, CreditCard, Shield
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
                const paymentsQ = query(collection(db, 'payments'), where('businessId', '==', id)); // Sales/Txns might differ

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
                    // Assuming sales are transactions for now, or use a 'sales' collection if exists
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

    if (loading) return <div className="p-8">Loading details...</div>;
    if (!business) return <div className="p-8">Business not found.</div>;

    const tabs = [
        { id: 'info', label: 'Overview', icon: Building2 },
        { id: 'users', label: 'Users', icon: Users, count: tabData.users.length },
        { id: 'branches', label: 'Branches', icon: MapPin, count: tabData.branches.length },
        { id: 'products', label: 'Products', icon: Package, count: tabData.products.length },
        { id: 'history', label: 'Payment History', icon: History, count: tabData.transactions.length },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/accounts')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        {business.businessName}
                        <Badge variant={business.isActive ? 'success' : 'error'}>{business.isActive ? 'Active' : 'Inactive'}</Badge>
                    </h1>
                    <p className="text-slate-500 text-sm">Owner: {business.ownerName} ({business.email})</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 px-1 flex items-center gap-2 text-sm font-medium transition-colors relative
                            ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.count !== undefined && <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">{tab.count}</span>}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="space-y-4">
                            <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Subscription & Plan</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-slate-400 block pb-1">Current Plan</span> <span className="font-medium capitalize">{business.plan}</span></div>
                                <div><span className="text-slate-400 block pb-1">Status</span> <span className="font-medium capitalize">{business.subscription?.status}</span></div>
                                <div><span className="text-slate-400 block pb-1">Start Date</span> <span className="font-medium">{business.subscription?.startDate ? new Date(business.subscription.startDate).toLocaleDateString() : '-'}</span></div>
                                <div><span className="text-slate-400 block pb-1">End Date</span> <span className="font-medium">{business.subscription?.endDate ? new Date(business.subscription.endDate).toLocaleDateString() : '-'}</span></div>
                            </div>
                        </Card>
                        <Card className="space-y-4">
                            <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Location & Contact</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-slate-400 block pb-1">District</span> <span className="font-medium">{business.district}</span></div>
                                <div><span className="text-slate-400 block pb-1">Sector</span> <span className="font-medium">{business.sector}</span></div>
                                <div><span className="text-slate-400 block pb-1">Phone</span> <span className="font-medium">{business.phoneNumber}</span></div>
                                <div><span className="text-slate-400 block pb-1">Email</span> <span className="font-medium">{business.email}</span></div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] relative border border-slate-200 rounded-sm shadow-sm bg-white">
                        <table className="w-full text-sm text-left border-separate border-spacing-0">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-slate-50 font-semibold text-slate-600">
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Name</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Role</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Phone</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Branch ID</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-slate-200">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tabData.users.map(u => (
                                    <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-2 border-b border-r border-slate-100 font-medium text-slate-800">{u.fullName || u.firstName + ' ' + u.lastName}</td>
                                        <td className="px-4 py-2 border-b border-r border-slate-100 capitalize text-slate-600">{u.role}</td>
                                        <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{u.phone}</td>
                                        <td className="px-4 py-2 border-b border-r border-slate-100 font-mono text-[11px] text-slate-400">{u.branch?.substring(0, 12) || '-'}</td>
                                        <td className="px-4 py-2 border-b border-slate-100">
                                            <Badge variant={u.isActive ? 'success' : 'error'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'branches' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tabData.branches.map(b => (
                            <div key={b.id} className="p-4 bg-white border border-slate-200 rounded shadow-sm hover:border-blue-300 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-slate-800">{b.branchName || 'Unnamed Branch'}</h4>
                                    <span className="text-[10px] font-mono text-slate-400">ID: {b.id.substring(0, 8)}</span>
                                </div>
                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                    <MapPin size={14} className="text-slate-400" /> {b.sector}, {b.district}
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-[11px] text-slate-400">Status</span>
                                    <Badge variant="success">Active</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] relative border border-slate-200 rounded-sm shadow-sm bg-white">
                        <table className="w-full text-sm text-left border-separate border-spacing-0">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-slate-50 font-semibold text-slate-600">
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Product Name</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Category</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Qty</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Price</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-slate-200">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tabData.products.slice(0, 50).map(p => (
                                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-2 border-b border-r border-slate-100 font-medium text-slate-800">{p.productName}</td>
                                        <td className="px-4 py-2 border-b border-r border-slate-100 capitalize text-slate-600">{p.category}</td>
                                        <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{p.quantity} {p.unit}</td>
                                        <td className="px-4 py-2 border-b border-r border-slate-100 font-bold text-slate-800">{p.sellingPrice?.toLocaleString()}</td>
                                        <td className="px-4 py-2 border-b border-slate-100 capitalize">
                                            <Badge variant={p.status === 'out_of_stock' ? 'error' : p.status === 'low_stock' ? 'warning' : 'success'}>
                                                {p.status?.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] relative border border-slate-200 rounded-sm shadow-sm bg-white">
                        <table className="w-full text-sm text-left border-separate border-spacing-0">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-slate-50 font-semibold text-slate-600">
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Date</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Type</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200 text-center">Amount</th>
                                    <th className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tabData.transactions.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-500 font-mono text-xs">
                                            {t.createdAt ? (typeof t.createdAt === 'object' && t.createdAt.toDate ? t.createdAt.toDate().toLocaleDateString() : new Date(t.createdAt).toLocaleDateString()) : '-'}
                                        </td>
                                        <td className="px-4 py-2 border-b border-r border-slate-100 capitalize text-slate-600 font-medium">{t.type}</td>
                                        <td className="px-4 py-2 border-b border-r border-slate-100 font-bold text-slate-800 text-center">{t.amount?.toLocaleString()} {t.currency}</td>
                                        <td className="px-4 py-2 border-b border-slate-100 text-center"><Badge variant={t.status === 'approved' ? 'success' : 'warning'}>{t.status}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessDetailsPage;
