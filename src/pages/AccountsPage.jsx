import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useParams as useRouterParams, useNavigate as useRouterNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trash2, CheckCircle, Eye, CreditCard, X, Edit, MapPin, Mail, User, Calendar, Clock, AlertTriangle, Power, ShieldCheck, ShieldAlert } from 'lucide-react';
import { adminService } from '../services/adminService';

const Modal = ({ isOpen, onClose, title, children, footer, variant = 'default' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className={`flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 ${variant === 'danger' ? 'bg-red-50/50 dark:bg-red-950/20' : variant === 'warning' ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}`}>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8">
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

const AccountsPage = () => {
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    // Modals state
    const [modals, setModals] = useState({
        edit: false,
        plan: false,
        delete: false,
        status: false
    });

    // Form states
    const [editForm, setEditForm] = useState({
        businessName: '',
        district: '',
        sector: '',
        ownerName: '',
        email: ''
    });
    const [selectedPlan, setSelectedPlan] = useState('');

    useEffect(() => {
        loadBusinesses();
    }, []);

    const loadBusinesses = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchAllBusinesses();
            setBusinesses(data);
        } catch (error) {
            console.error("Failed to load businesses", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, business) => {
        setSelectedBusiness(business);
        if (type === 'edit') {
            setEditForm({
                businessName: business.businessName || '',
                district: business.district || '',
                sector: business.sector || '',
                ownerName: business.ownerName || '',
                email: business.email || business.ownerEmail || ''
            });
        } else if (type === 'plan') {
            setSelectedPlan(business.plan || (business.subscription?.plan) || 'free');
        }
        setModals(prev => ({ ...prev, [type]: true }));
    };

    const closeModal = (type) => {
        setModals(prev => ({ ...prev, [type]: false }));
        if (type === 'edit' || type === 'plan' || type === 'delete' || type === 'status') {
            setTimeout(() => setSelectedBusiness(null), 200);
        }
    };

    const handleUpdateBusiness = async () => {
        try {
            await adminService.updateBusinessDetails(selectedBusiness.id, editForm);
            closeModal('edit');
            loadBusinesses();
        } catch (error) {
            alert("Failed to update business details");
        }
    };

    const handleChangePlan = async () => {
        try {
            await adminService.updateBusinessPlan(selectedBusiness.id, selectedPlan);
            closeModal('plan');
            loadBusinesses();
        } catch (error) {
            alert("Failed to update plan");
        }
    };

    const handleDeleteBusiness = async () => {
        try {
            await adminService.deleteBusiness(selectedBusiness.id);
            closeModal('delete');
            loadBusinesses();
        } catch (error) {
            alert("Failed to delete business");
        }
    };

    const handleConfirmToggleStatus = async () => {
        const newStatus = selectedBusiness.isActive ? false : true;
        try {
            await adminService.updateBusinessStatus(selectedBusiness.id, newStatus);
            closeModal('status');
            loadBusinesses();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const calculateRemainingDays = (endDate) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const today = new Date();
        const diff = end - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Secure Data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">
                        <ShieldCheck size={12} />
                        <span>Security & Access Control</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Business Hub
                    </h1>
                </div>
                <button
                    onClick={loadBusinesses}
                    className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                    <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white dark:text-slate-900 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Sync Data</span>
                </button>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1700px] border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-xl">
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">#</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Entity Name</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Identified Owner</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">District</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Sector</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Plan</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Active</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Sub Status</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Start Date</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">End Date</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Remain</th>
                                <th className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {businesses.map((business, index) => {
                                const remain = calculateRemainingDays(business.subscription?.endDate);
                                return (
                                    <tr key={business.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-300">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{business.businessName || 'Unnamed'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter leading-tight">{business.ownerName || '-'}</span>
                                                <span className="text-[10px] font-bold text-slate-400 leading-tight">{business.email || business.ownerEmail || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="font-bold border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                {business.district || '-'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {business.sector || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                                                ${(business.plan === 'forever' || business.subscription?.plan === 'forever') ? 'bg-purple-100 text-purple-700' :
                                                    (business.plan === 'year' || business.subscription?.plan === 'year') ? 'bg-blue-100 text-blue-700' :
                                                        (business.plan === 'month' || business.subscription?.plan === 'month') ? 'bg-sky-100 text-sky-700' :
                                                            'bg-slate-100 text-slate-600'}`}>
                                                {business.plan || (business.subscription?.plan) || 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${business.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${business.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                <span className="text-[10px] font-black uppercase">{business.isActive ? 'Active' : 'Offline'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={business.subscription?.status === 'active' ? 'success' : 'warning'}>
                                                {business.subscription?.status || 'Expired'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                            {business.subscription?.startDate ? new Date(business.subscription.startDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                            {business.subscription?.endDate ? new Date(business.subscription.endDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {remain !== null ? (
                                                <div className={`text-center py-1 rounded-lg border font-black text-xs min-w-[40px] ${remain <= 7 ? 'bg-red-600 text-white border-red-500' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                                                    {remain} <span className="text-[8px] opacity-70">D</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => navigate(`/business/${business.id}`)} className="p-2.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100 dark:border-blue-800 shadow-sm"><Eye size={14} /></button>
                                                <button onClick={() => openModal('edit', business)} className="p-2.5 text-amber-600 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-600 hover:text-white rounded-xl transition-all border border-amber-100 dark:border-amber-800 shadow-sm"><Edit size={14} /></button>
                                                <button onClick={() => openModal('plan', business)} className="p-2.5 text-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-600 hover:text-white rounded-xl transition-all border border-purple-100 dark:border-purple-800 shadow-sm"><CreditCard size={14} /></button>
                                                <button onClick={() => openModal('status', business)} className={`p-2.5 rounded-xl transition-all border shadow-sm ${business.isActive ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 hover:text-white border-rose-100 dark:border-rose-800' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-600 hover:text-white border-emerald-100 dark:border-emerald-800'}`}><Power size={14} /></button>
                                                <button onClick={() => openModal('delete', business)} className="p-2.5 text-slate-400 bg-slate-50 dark:bg-slate-900/20 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-slate-200 dark:border-slate-800 shadow-sm hover:border-red-600"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Status Modal */}
            <Modal
                isOpen={modals.status}
                onClose={() => closeModal('status')}
                title="System Access Modification"
                variant="warning"
                footer={
                    <>
                        <button onClick={() => closeModal('status')} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
                        <button onClick={handleConfirmToggleStatus} className={`px-8 py-3 rounded-2xl font-black text-white shadow-xl hover:scale-105 transition-all ${selectedBusiness?.isActive ? 'bg-rose-600 shadow-rose-200' : 'bg-emerald-600 shadow-emerald-200'}`}>
                            Confirm {selectedBusiness?.isActive ? 'Deactivation' : 'Activation'}
                        </button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${selectedBusiness?.isActive ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        <Power size={32} />
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                        Are you sure you want to <span className="font-black text-slate-900">{selectedBusiness?.isActive ? 'DEACTIVATE' : 'ACTIVATE'}</span> access for <span className="font-black text-slate-900">{selectedBusiness?.businessName}</span>?
                        This will immediately impact their ability to log into the terminal.
                    </p>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={modals.edit}
                onClose={() => closeModal('edit')}
                title="Update Business Intelligence"
                footer={
                    <>
                        <button onClick={() => closeModal('edit')} className="px-6 py-3 font-bold text-slate-500">Discard</button>
                        <button onClick={handleUpdateBusiness} className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">Save Matrix</button>
                    </>
                }
            >
                <div className="space-y-4">
                    {[
                        { label: 'Business Name', key: 'businessName', placeholder: 'Legal Entity Name' },
                        { label: 'Owner Full Name', key: 'ownerName', placeholder: 'Primary Contact' },
                        { label: 'Contact Email', key: 'email', placeholder: 'billing@example.com', type: 'email' },
                        { label: 'District', key: 'district', placeholder: 'Operational Region' },
                        { label: 'Sector', key: 'sector', placeholder: 'Local Sector' }
                    ].map((field) => (
                        <div key={field.key} className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                            <input
                                type={field.type || 'text'}
                                value={editForm[field.key]}
                                onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-950 outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-300"
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Plan Modal */}
            <Modal
                isOpen={modals.plan}
                onClose={() => closeModal('plan')}
                title="Protocol Adjustment"
                footer={
                    <>
                        <button onClick={() => closeModal('plan')} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
                        <button onClick={handleChangePlan} className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all">Apply Protocol</button>
                    </>
                }
            >
                <div className="grid grid-cols-1 gap-3">
                    {['free', 'month', 'year', 'forever'].map((plan) => (
                        <button
                            key={plan}
                            onClick={() => setSelectedPlan(plan)}
                            className={`p-5 rounded-2xl border-2 text-left transition-all relative ${selectedPlan === plan ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                        >
                            <span className="font-black uppercase tracking-widest text-sm text-slate-900 dark:text-slate-100">{plan}</span>
                            {selectedPlan === plan && (
                                <div className="absolute right-5 top-5 text-purple-600">
                                    <ShieldCheck size={20} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={modals.delete}
                onClose={() => closeModal('delete')}
                title="Termination Request"
                variant="danger"
                footer={
                    <>
                        <button onClick={() => closeModal('delete')} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
                        <button onClick={handleDeleteBusiness} className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-200 hover:scale-105 transition-all">Execute Deletion</button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center gap-6 py-4">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-950/40 rounded-[2.5rem] flex items-center justify-center text-red-600 border-2 border-red-200 dark:border-red-900 animate-pulse">
                        <Trash2 size={40} />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">Irreversible Action</h4>
                        <p className="text-slate-500 leading-relaxed max-w-sm">
                            You are about to purge all data for <span className="font-black text-slate-900">{selectedBusiness?.businessName}</span>. This node and all associated branches will be disconnected permanently.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AccountsPage;
