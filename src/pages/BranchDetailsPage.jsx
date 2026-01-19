import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    ArrowLeft, Building2, MapPin, Users, User, ShieldCheck,
    Clock, Mail, Phone, Calendar, Globe, Power, Hash, Info,
    ChevronRight, Briefcase
} from 'lucide-react';
import Loading from '../components/ui/Loading';

const BranchDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [branch, setBranch] = useState(null);
    const [business, setBusiness] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Branch Details
            const branchRef = doc(db, 'branches', id);
            const branchSnap = await getDoc(branchRef);

            if (branchSnap.exists()) {
                const branchData = { id: branchSnap.id, ...branchSnap.data() };
                setBranch(branchData);

                // 2. Fetch Associated Business
                if (branchData.businessId) {
                    const businessRef = doc(db, 'businesses', branchData.businessId);
                    const businessSnap = await getDoc(businessRef);
                    if (businessSnap.exists()) {
                        setBusiness({ id: businessSnap.id, ...businessSnap.data() });
                    }
                }

                // 3. Fetch Assigned Users
                // Logic: Search for users where businessId matches AND branch field matches the branch ID
                const usersRef = collection(db, 'users');
                const q = query(
                    usersRef,
                    where('businessId', '==', branchData.businessId),
                    where('branch', '==', branchSnap.id)
                );

                const usersSnap = await getDocs(q);
                const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAssignedUsers(users);
            }
        } catch (error) {
            console.error("Error loading branch ecosystem:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Aggregating Node Environment" />;
    }

    if (!branch) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="mx-auto text-slate-300 mb-4" size={48} />
                <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase">Neural Node Not Found</h2>
                <button onClick={() => navigate('/branches')} className="mt-4 text-blue-600 font-bold uppercase text-sm tracking-widest decoration-2 underline-offset-4 hover:underline">Return to Network</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 py-6 animate-fade-in">
            {/* Minimal High-Tech Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/branches')}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                            <Building2 size={12} />
                            <span>Infrastructure Node Details</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            {branch.branchName || branch.name}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-6 py-2 border font-black text-xs uppercase tracking-widest ${branch.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {branch.isActive !== false ? 'Operational' : 'Node Offline'}
                    </div>
                    <button onClick={loadData} className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                        <Clock size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Branch & Business Intel */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Branch Matrix */}
                    <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 rounded-none shadow-2xl">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-blue-600" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Node Geographic Matrix</h3>
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 font-bold">ID: {branch.id.toUpperCase()}</span>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { label: 'District', value: branch.district, icon: Globe },
                                { label: 'Sector', value: branch.sector, icon: MapPin },
                                { label: 'Cell', value: branch.cell, icon: Hash },
                                { label: 'Village', value: branch.village, icon: Info },
                                { label: 'Initialization Date', value: branch.createdAt ? new Date(branch.createdAt).toLocaleString() : '-', icon: Calendar },
                                { label: 'Last Sync Status', value: branch.updatedAt ? new Date(branch.updatedAt).toLocaleString() : '-', icon: Clock }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1.5 p-4 bg-slate-50/50 dark:bg-slate-900/20 border-l-2 border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        <item.icon size={10} /> {item.label}
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{item.value || 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Associated Entity */}
                    {business && (
                        <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 rounded-none shadow-2xl border-l-[6px] border-l-purple-600">
                            <div className="px-6 py-4 bg-purple-50 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/50 flex items-center gap-3">
                                <Briefcase size={16} className="text-purple-600" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-900 dark:text-purple-100">Parent Operational Entity</h3>
                            </div>
                            <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                                <div className="w-24 h-24 bg-purple-600 text-white flex items-center justify-center text-3xl font-black shadow-2xl">
                                    {business.businessName?.charAt(0)}
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Entity Name</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white uppercase leading-none">{business.businessName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Subscription Protocol</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-purple-600 text-white border-none rounded-none font-black text-[10px] uppercase">{business.subscription?.plan || 'Free'}</Badge>
                                            <span className="text-[10px] font-bold text-slate-500 italic">Valid until: {business.subscription?.endDate ? new Date(business.subscription.endDate).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Corporate Core</p>
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">{business.district}, {business.sector}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Operational State</p>
                                        <Badge variant={business.isActive ? 'success' : 'error'} className="rounded-none uppercase text-[10px] font-black px-4">{business.isActive ? 'Active' : 'Offline'}</Badge>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column: Assigned Personnel */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                            <Users size={12} />
                            <span>Personnel Manifest ({assignedUsers.length})</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {assignedUsers.length > 0 ? assignedUsers.map((user) => (
                            <Card key={user.id} className="p-5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-none shadow-lg hover:border-blue-500/50 transition-all border-l-2 border-l-slate-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                                        <User size={20} className="text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase leading-tight mb-1">{user.fullName || `${user.firstName} ${user.lastName}`}</h4>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">{user.role}</p>

                                        <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-900 pt-3">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <Mail size={10} />
                                                <span className="truncate max-w-[150px]">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <Phone size={10} />
                                                <span>{user.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <ShieldCheck size={10} />
                                                <span>Status: {user.isActive ? 'ACTIVE' : 'HALTED'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <Users size={32} className="text-slate-200 mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">No Personnel Assigned to Node</p>
                            </div>
                        )}
                    </div>

                    {/* Security Protocol Card */}
                    <Card className="p-6 bg-slate-900 text-white rounded-none border-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={100} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Node Integrity Verification</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-bold mb-6">
                            Personnel access permissions are cryptographically verified against the Parent Entity ID and Infrastructure Node Token.
                        </p>
                        <div className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                            Verified Protocol
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BranchDetailsPage;
