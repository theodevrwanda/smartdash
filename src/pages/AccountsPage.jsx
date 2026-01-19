import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useParams as useRouterParams, useNavigate as useRouterNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trash2, CheckCircle, Eye, CreditCard, X, Edit, MapPin, Mail, User, Calendar, Clock, AlertTriangle, Power, ShieldCheck, ShieldAlert } from 'lucide-react';
import { adminService } from '../services/adminService';
import Loading from '../components/ui/Loading';

const Modal = ({ isOpen, onClose, title, children, footer, variant = 'default' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-none shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className={`flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 ${variant === 'danger' ? 'bg-red-50/50 dark:bg-red-950/20' : variant === 'warning' ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}`}>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-none transition-colors text-slate-500">
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
        return <Loading message="Loading Secure Data" />;
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
                    className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all active:scale-95"
                >
                    <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white dark:text-slate-900 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Sync Data</span>
                </button>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1700px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900">
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">#</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Entity Name</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Owner Name</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Owner Email</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">District</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Sector</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px) font-black text-slate-500 uppercase tracking-widest text-left">Plan</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Active</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Sub Status</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Start Date</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">End Date</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Remain</th>
                                <th className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {businesses.map((business, index) => {
                                const remain = calculateRemainingDays(business.subscription?.endDate);
                                return (
                                    <tr key={business.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 even:bg-slate-50/50 dark:even:bg-slate-900/10">
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-center">
                                            <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{business.businessName || 'Unnamed'}</span>
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                            <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter leading-tight">{business.ownerName || '-'}</span>
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                            <span className="text-[10px] font-bold text-slate-400 leading-tight">{business.email || business.ownerEmail || '-'}</span>
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                            <Badge variant="outline" className="font-bold border-slate-200 dark:border-slate-800 whitespace-nowrap rounded-none">
                                                {business.district || '-'}
                                            </Badge>
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {business.sector || '-'}
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter
                                                ${(business.plan === 'forever' || business.subscription?.plan === 'forever') ? 'bg-purple-100 text-purple-700' :
                                                    (business.plan === 'annually' || business.subscription?.plan === 'annually' || business.plan === 'yearly' || business.subscription?.plan === 'yearly' || business.plan === 'year' || business.subscription?.plan === 'year') ? 'bg-blue-100 text-blue-700' :
                                                        (business.plan === 'monthly' || business.subscription?.plan === 'monthly' || business.plan === 'month' || business.subscription?.plan === 'month') ? 'bg-sky-100 text-sky-700' :
                                                            'bg-slate-100 text-slate-600'}`}>
                                                {(() => {
                                                    const p = (business.plan || business.subscription?.plan || 'free').toLowerCase();
                                                    if (['monthly', 'month'].includes(p)) return 'monthly';
                                                    if (['annually', 'yearly', 'year'].includes(p)) return 'annually';
                                                    return p;
                                                })()}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                            <div className={`flex items-center gap-2 px-3 py-1 w-fit ${business.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${business.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-tighter">{business.isActive ? 'Active' : 'Offline'}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                            <Badge variant={business.subscription?.status === 'active' ? 'success' : 'warning'} className="rounded-none">
                                                {business.subscription?.status || 'Expired'}
                                            </Badge>
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                            {business.subscription?.startDate ? new Date(business.subscription.startDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                            {business.subscription?.endDate ? new Date(business.subscription.endDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800">
                                            {remain !== null ? (
                                                <div className={`text-center py-0.5 border font-black text-[10px] min-w-[36px] ${remain <= 7 ? 'bg-red-600 text-white border-red-500' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                                                    {remain} <span className="text-[8px] opacity-70">D</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => navigate(`/business/${business.id}`)} className="p-1.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800"><Eye size={12} /></button>
                                                <button onClick={() => openModal('edit', business)} className="p-1.5 text-amber-600 hover:bg-amber-600 hover:text-white transition-all border border-amber-100 dark:border-amber-800"><Edit size={12} /></button>
                                                <button onClick={() => openModal('plan', business)} className="p-1.5 text-purple-600 hover:bg-purple-600 hover:text-white transition-all border border-purple-100 dark:border-purple-800"><CreditCard size={12} /></button>
                                                <button onClick={() => openModal('status', business)} className={`p-1.5 transition-all border ${business.isActive ? 'text-rose-600 hover:bg-rose-600 hover:text-white border-rose-100 dark:border-rose-800' : 'text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-100 dark:border-emerald-800'}`}><Power size={12} /></button>
                                                <button onClick={() => openModal('delete', business)} className="p-1.5 text-slate-400 hover:bg-red-600 hover:text-white transition-all border border-slate-200 dark:border-slate-800 hover:border-red-600"><Trash2 size={12} /></button>
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
                        <button onClick={handleConfirmToggleStatus} className={`px-8 py-3 rounded-none font-black text-white hover:scale-105 transition-all ${selectedBusiness?.isActive ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                            Confirm {selectedBusiness?.isActive ? 'Deactivation' : 'Activation'}
                        </button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-20 h-20 rounded-none flex items-center justify-center ${selectedBusiness?.isActive ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
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
                        <button onClick={handleUpdateBusiness} className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-none font-black hover:scale-105 active:scale-95 transition-all">Save Matrix</button>
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
                                className="w-full px-5 py-3.5 rounded-none border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-950 outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-300"
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
                        <button onClick={handleChangePlan} className="px-8 py-3 bg-purple-600 text-white rounded-none font-black hover:scale-105 active:scale-95 transition-all">Apply Protocol</button>
                    </>
                }
            >
                <div className="grid grid-cols-1 gap-3">
                    {['free', 'monthly', 'annually', 'forever'].map((plan) => (
                        <button
                            key={plan}
                            onClick={() => setSelectedPlan(plan)}
                            className={`p-5 rounded-none border-2 text-left transition-all relative ${selectedPlan === plan ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
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
                        <button onClick={handleDeleteBusiness} className="px-8 py-3 bg-red-600 text-white rounded-none font-black hover:scale-105 transition-all">Execute Deletion</button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center gap-6 py-4">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-950/40 rounded-none flex items-center justify-center text-red-600 border-2 border-red-200 dark:border-red-900 animate-pulse">
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
