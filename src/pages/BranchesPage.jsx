import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { MapPin, Users, User, Building2, Clock, ShieldCheck, Eye, Trash2, Phone, Power, Hash, Edit, UserPlus, X } from 'lucide-react';
import { adminService } from '../services/adminService';
import { Badge } from '../components/ui/Badge';

const Modal = ({ isOpen, onClose, title, children, footer, variant = 'default' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-none shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className={`flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 ${variant === 'danger' ? 'bg-red-50/50 dark:bg-red-950/20' : variant === 'warning' ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}`}>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{title}</h3>
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

const BranchesPage = () => {
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [businessUsers, setBusinessUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Modals state
    const [modals, setModals] = useState({
        edit: false,
        delete: false,
        assign: false
    });

    // Form states
    const [editForm, setEditForm] = useState({
        branchName: '',
        district: '',
        sector: '',
        cell: '',
        village: ''
    });
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchBranches();
            setBranches(data);
        } catch (error) {
            console.error("Failed to load branches", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = async (type, branch) => {
        setSelectedBranch(branch);
        if (type === 'edit') {
            setEditForm({
                branchName: branch.branchName || branch.name || '',
                district: branch.district || '',
                sector: branch.sector || '',
                cell: branch.cell || '',
                village: branch.village || ''
            });
        } else if (type === 'assign') {
            setLoadingUsers(true);
            try {
                const users = await adminService.fetchUsersByBusiness(branch.businessId);
                setBusinessUsers(users);
                setSelectedUserId('');
            } catch (error) {
                console.error("Failed to load users", error);
            } finally {
                setLoadingUsers(false);
            }
        }
        setModals(prev => ({ ...prev, [type]: true }));
    };

    const closeModal = (type) => {
        setModals(prev => ({ ...prev, [type]: false }));
        setTimeout(() => {
            setSelectedBranch(null);
            setBusinessUsers([]);
        }, 200);
    };

    const handleUpdateBranch = async () => {
        try {
            await adminService.updateBranch(selectedBranch.id, editForm);
            closeModal('edit');
            loadBranches();
        } catch (error) {
            alert("Failed to update branch");
        }
    };

    const handleDeleteBranch = async () => {
        try {
            await adminService.deleteBranch(selectedBranch.id);
            closeModal('delete');
            loadBranches();
        } catch (error) {
            alert("Failed to delete branch");
        }
    };

    const handleAssignUser = async () => {
        if (!selectedUserId) {
            alert("Please select a user");
            return;
        }
        try {
            await adminService.assignUserToBranch(selectedUserId, selectedBranch.id);
            closeModal('assign');
            alert("User assigned successfully");
        } catch (error) {
            alert("Failed to assign user");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Network Data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">
                        <MapPin size={12} />
                        <span>Logistics & Infrastructure</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        Branch Network
                    </h1>
                </div>
                <button
                    onClick={loadBranches}
                    className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all active:scale-95"
                >
                    <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white dark:text-slate-900 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Sync Nodes</span>
                </button>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1400px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest text-left whitespace-nowrap">
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">No</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Branch Name</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Business Name</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">District</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Sector</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Cell</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Village</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Created At</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Updated At</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Status</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {branches.map((branch, index) => (
                                <tr key={branch.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                <Building2 size={12} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{branch.branchName || branch.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{branch.businessName}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none border-blue-100 text-blue-600">{branch.district}</Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none border-slate-100 text-slate-600">{branch.sector}</Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase italic">
                                        {branch.cell}
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase italic">
                                        {branch.village}
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                                            <Clock size={10} /> {branch.createdAt ? (typeof branch.createdAt === 'object' && branch.createdAt.toDate ? branch.createdAt.toDate().toLocaleDateString() : new Date(branch.createdAt).toLocaleDateString()) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-400 uppercase">
                                            <ShieldCheck size={10} /> {branch.updatedAt ? (typeof branch.updatedAt === 'object' && branch.updatedAt.toDate ? branch.updatedAt.toDate().toLocaleDateString() : new Date(branch.updatedAt).toLocaleDateString()) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-none w-fit mx-auto ${branch.isActive !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${branch.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-tight">{branch.isActive !== false ? 'Operational' : 'Halted'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => navigate(`/branch/${branch.id}`)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800"
                                                title="View Ecosystem"
                                            >
                                                <Eye size={12} />
                                            </button>
                                            <button
                                                onClick={() => openModal('edit', branch)}
                                                className="p-1.5 text-amber-600 hover:bg-amber-600 hover:text-white transition-all border border-amber-100 dark:border-amber-800"
                                                title="Edit Node"
                                            >
                                                <Edit size={12} />
                                            </button>
                                            <button
                                                onClick={() => openModal('assign', branch)}
                                                className="p-1.5 text-purple-600 hover:bg-purple-600 hover:text-white transition-all border border-purple-100 dark:border-purple-800"
                                                title="Assign Personnel"
                                            >
                                                <UserPlus size={12} />
                                            </button>
                                            <button
                                                onClick={() => openModal('delete', branch)}
                                                className="p-1.5 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800"
                                                title="Purge Node"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={modals.edit}
                onClose={() => closeModal('edit')}
                title="Protocol Modification"
                footer={
                    <>
                        <button onClick={() => closeModal('edit')} className="px-6 py-3 font-bold text-slate-500">Discard</button>
                        <button onClick={handleUpdateBranch} className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-none font-black hover:scale-105 active:scale-95 transition-all">Update Node</button>
                    </>
                }
            >
                <div className="space-y-4">
                    {[
                        { label: 'Branch Name', key: 'branchName', placeholder: 'Operational Name' },
                        { label: 'District', key: 'district', placeholder: 'Rubavu' },
                        { label: 'Sector', key: 'sector', placeholder: 'Gisenyi' },
                        { label: 'Cell', key: 'cell', placeholder: 'Cell Name' },
                        { label: 'Village', key: 'village', placeholder: 'Village Name' }
                    ].map((field) => (
                        <div key={field.key} className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                            <input
                                type="text"
                                value={editForm[field.key]}
                                onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-none border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-950 outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-300"
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={modals.delete}
                onClose={() => closeModal('delete')}
                title="Node Termination"
                variant="danger"
                footer={
                    <>
                        <button onClick={() => closeModal('delete')} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
                        <button onClick={handleDeleteBranch} className="px-8 py-3 bg-red-600 text-white rounded-none font-black hover:scale-105 transition-all">Execute Purge</button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center gap-6 py-4">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-950/40 rounded-none flex items-center justify-center text-red-600 border-2 border-red-200 dark:border-red-900 animate-pulse">
                        <Trash2 size={40} />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Irreversible Action</h4>
                        <p className="text-slate-500 leading-relaxed max-w-sm">
                            You are about to permanently disconnect <span className="font-black text-slate-900">{selectedBranch?.branchName || selectedBranch?.name}</span> from the network infrastructure.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Assign User Modal */}
            <Modal
                isOpen={modals.assign}
                onClose={() => closeModal('assign')}
                title="Personnel Deployment"
                footer={
                    <>
                        <button onClick={() => closeModal('assign')} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
                        <button onClick={handleAssignUser} className="px-8 py-3 bg-purple-600 text-white rounded-none font-black hover:scale-105 active:scale-95 transition-all">Deploy Personnel</button>
                    </>
                }
            >
                {loadingUsers ? (
                    <div className="flex flex-col items-center py-10 gap-4">
                        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Business Personnel</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-l-4 border-purple-600 mb-6">
                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Target Infrastructure</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{selectedBranch?.branchName || selectedBranch?.name}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Available Personnel</label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full px-5 py-4 rounded-none border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-950 outline-none focus:border-purple-600 transition-all font-bold text-slate-900 dark:text-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:24px] bg-[right_1rem_center] bg-no-repeat"
                            >
                                <option value="" className="text-slate-400">DEPLOYMENT TARGET UNSET</option>
                                {businessUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName || `${user.firstName} ${user.lastName}`} — {user.role.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            {businessUsers.length === 0 && (
                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest text-center py-2">No Authorized Personnel Found</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BranchesPage;
