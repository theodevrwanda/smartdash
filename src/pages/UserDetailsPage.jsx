import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    ArrowLeft, User, ShieldCheck, Mail, Phone, Calendar,
    Globe, Power, Hash, Info, Briefcase, MapPin, Clock,
    UserCircle, Map, Activity
} from 'lucide-react';
import Loading from '../components/ui/Loading';

const UserDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [businessName, setBusinessName] = useState('N/A');
    const [branchName, setBranchName] = useState('N/A');

    useEffect(() => {
        loadUserData();
    }, [id]);

    const loadUserData = async () => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', id);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = { id: userSnap.id, ...userSnap.data() };
                setUser(userData);

                // Fetch Business Name
                if (userData.businessId) {
                    const bizSnap = await getDoc(doc(db, 'businesses', userData.businessId));
                    if (bizSnap.exists()) {
                        setBusinessName(bizSnap.data().businessName);
                    }
                }

                // Fetch Branch Name
                if (userData.branch) {
                    const branchSnap = await getDoc(doc(db, 'branches', userData.branch));
                    if (branchSnap.exists()) {
                        setBranchName(branchSnap.data().branchName || branchSnap.data().name);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading user intelligence:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Decoding Personnel Signature" />;
    }

    if (!user) {
        return (
            <div className="p-12 text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <UserCircle className="mx-auto text-slate-200 mb-4" size={64} />
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Subject Not Found In Database</h2>
                <button onClick={() => navigate('/employees')} className="mt-6 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">Return to Roster</button>
            </div>
        );
    }

    const detailGroups = [
        {
            title: "Identity Protocol",
            icon: User,
            items: [
                { label: "Full Nomenclature", value: user.fullName || `${user.firstName} ${user.lastName}`, icon: User },
                { label: "Given Name", value: user.firstName, icon: Info },
                { label: "Family Name", value: user.lastName, icon: Info },
                { label: "Gender Orientation", value: user.gender, icon: UserCircle },
                { label: "Username / Alias", value: user.username, icon: Hash }
            ]
        },
        {
            title: "Communication Channels",
            icon: Mail,
            items: [
                { label: "Electronic Mail", value: user.email, icon: Mail },
                { label: "Signal Frequency (Phone)", value: user.phone, icon: Phone }
            ]
        },
        {
            title: "Geographical Matrix",
            icon: Map,
            items: [
                { label: "District", value: user.district, icon: Globe },
                { label: "Sector", value: user.sector, icon: MapPin },
                { label: "Cell", value: user.cell, icon: Hash },
                { label: "Village / Unit", value: user.village, icon: Info }
            ]
        },
        {
            title: "Operational Context",
            icon: Briefcase,
            items: [
                { label: "Security Role", value: user.role?.replace('_', ' '), icon: ShieldCheck, uppercase: true },
                { label: "Parent Business Entity", value: businessName, icon: Briefcase },
                { label: "Assigned Infrastructure Node", value: branchName, icon: MapPin },
                { label: "Business UID", value: user.businessId, icon: Hash },
                { label: "Branch UID", value: user.branch, icon: Hash }
            ]
        },
        {
            title: "Temporal Ledger",
            icon: Clock,
            items: [
                { label: "Initialization Date", value: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A', icon: Calendar },
                { label: "Last Matrix Update", value: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A', icon: Activity },
                { label: "Subject Database ID", value: user.id, icon: Hash }
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-8 py-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/employees')}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl">
                            {(user.profileImage || user.imagephoto) ? (
                                <img src={user.profileImage || user.imagephoto} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-black text-2xl">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                                <ShieldCheck size={12} />
                                <span>Personnel High-Resolution Data</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                                {user.fullName || `${user.firstName} ${user.lastName}`}
                            </h1>
                            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{user.role?.replace('_', ' ')} • {user.email}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-6 py-2 border font-black text-xs uppercase tracking-widest ${user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {user.isActive ? 'Active Protocol' : 'Access Suspended'}
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
                            {group.items.map((item, iIdx) => (
                                <div key={iIdx} className="flex flex-col gap-1 border-b border-slate-50 dark:border-slate-900 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        <item.icon size={10} /> {item.label}
                                    </div>
                                    <span className={`text-sm font-black text-slate-900 dark:text-white ${item.uppercase ? 'uppercase' : ''}`}>
                                        {item.value || 'NOT_FOUND'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions Footer */}
            <div className="flex items-center gap-4 pt-12 border-t border-slate-100 dark:border-slate-900">
                <button className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <Power size={16} /> Update Matrix Status
                </button>
                <button
                    onClick={() => window.location.href = `mailto:${user.email}`}
                    className="px-8 py-4 border-2 border-slate-900 dark:border-white font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
                >
                    Contact Personnel
                </button>
            </div>
        </div>
    );
};

export default UserDetailsPage;
