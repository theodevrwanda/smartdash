import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import {
    MapPin, Users, User, Building2, Clock, ShieldCheck,
    Eye, Trash2, Phone, Power, Hash, Edit, UserPlus,
    X, Search, Filter, ArrowUpDown, ChevronUp, ChevronDown
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { Badge } from '../components/ui/Badge';
import Loading from '../components/ui/Loading';

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

    // Filtering & Sorting State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'branchName', direction: 'asc' });

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

    // Filtered and Sorted Data
    const processedBranches = useMemo(() => {
        let result = [...branches];

        // Search Filter
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(b =>
                (b.branchName || b.name || '').toLowerCase().includes(lowSearch) ||
                (b.businessName || '').toLowerCase().includes(lowSearch) ||
                (b.district || '').toLowerCase().includes(lowSearch) ||
                (b.sector || '').toLowerCase().includes(lowSearch)
            );
        }

        // Status Filter
        if (statusFilter !== 'all') {
            const isActive = statusFilter === 'active';
            result = result.filter(b => (b.isActive !== false) === isActive);
        }

        // Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aVal = String(a[sortConfig.key] || '').toLowerCase();
                const bVal = String(b[sortConfig.key] || '').toLowerCase();

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [branches, searchTerm, statusFilter, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ArrowUpDown size={10} className="ml-1 opacity-20 group-hover:opacity-100" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={10} className="ml-1 text-blue-600" /> : <ChevronDown size={10} className="ml-1 text-blue-600" />;
    };

    if (loading) {
        return <Loading message="Loading Network Data" />;
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
                    className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-none flex items-center gap-3 hover:scale-105 transition-all active:scale-95"
                >
                    <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-none flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white dark:text-slate-900 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Sync Nodes</span>
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800">
                <div className="relative col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH NODES, BUSINESSES OR LOCATION VECTORS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-blue-600 transition-colors"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-blue-600 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="all">ALL SYSTEM STATUSES</option>
                        <option value="active">OPERATIONAL ONLY</option>
                        <option value="inactive">HALTED ONLY</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1400px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest text-left whitespace-nowrap">
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">No</th>
                                <th onClick={() => requestSort('branchName')} className="px-4 py-3 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Branch Name <SortIcon column="branchName" /></div>
                                </th>
                                <th onClick={() => requestSort('businessName')} className="px-4 py-3 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Business Name <SortIcon column="businessName" /></div>
                                </th>
                                <th onClick={() => requestSort('district')} className="px-4 py-3 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">District <SortIcon column="district" /></div>
                                </th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Sector</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Cell</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Village</th>
                                <th onClick={() => requestSort('createdAt')} className="px-4 py-3 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Creation Date <SortIcon column="createdAt" /></div>
                                </th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800">Last Sync</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Operational State</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">Matrix Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {processedBranches.map((branch, index) => (
                                <tr key={branch.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 font-black">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                <Building2 size={12} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic decoration-blue-500/30 decoration-2 underline-offset-4">{branch.branchName || branch.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight underline decoration-slate-200 underline-offset-4">{branch.businessName}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none border-blue-100 text-blue-600 bg-blue-50/30 tracking-widest">{branch.district}</Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none border-slate-100 text-slate-600 tracking-widest">{branch.sector}</Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase italic">
                                        {branch.cell || '---'}
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase italic">
                                        {branch.village || '---'}
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                            <Calendar size={10} className="text-slate-400" /> {branch.createdAt ? (typeof branch.createdAt === 'object' && branch.createdAt.toDate ? branch.createdAt.toDate().toLocaleDateString() : new Date(branch.createdAt).toLocaleDateString()) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 uppercase tracking-tighter">
                                            <ShieldCheck size={10} className="text-blue-400" /> {branch.updatedAt ? (typeof branch.updatedAt === 'object' && branch.updatedAt.toDate ? branch.updatedAt.toDate().toLocaleDateString() : new Date(branch.updatedAt).toLocaleDateString()) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-none w-fit mx-auto border-2 ${branch.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40' : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40'}`}>
                                            <div className={`w-2 h-2 rounded-full ${branch.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{branch.isActive !== false ? 'Active Node' : 'Suspended'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => navigate(`/branch/${branch.id}`)}
                                                className="p-2 text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800 shadow-sm"
                                                title="View Analysis"
                                            >
                                                <Eye size={12} />
                                            </button>
                                            <button
                                                onClick={() => openModal('edit', branch)}
                                                className="p-2 text-amber-600 bg-white hover:bg-amber-600 hover:text-white transition-all border border-amber-100 dark:border-amber-800 shadow-sm"
                                                title="Modify Node"
                                            >
                                                <Edit size={12} />
                                            </button>
                                            <button
                                                onClick={() => openModal('assign', branch)}
                                                className="p-2 text-purple-600 bg-white hover:bg-purple-600 hover:text-white transition-all border border-purple-100 dark:border-purple-800 shadow-sm"
                                                title="Deploy Operator"
                                            >
                                                <UserPlus size={12} />
                                            </button>
                                            <button
                                                onClick={() => openModal('delete', branch)}
                                                className="p-2 text-rose-600 bg-white hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800 shadow-sm"
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

            {/* Modals are kept below with standard styling ... */}
            <Modal
                isOpen={modals.edit}
                onClose={() => closeModal('edit')}
                title="Node Modification Protocol"
                footer={
                    <>
                        <button onClick={() => closeModal('edit')} className="px-6 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Discard</button>
                        <button onClick={handleUpdateBranch} className="px-8 py-3 bg-slate-900 border-none text-white dark:bg-white dark:text-slate-900 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all">Update Vector</button>
                    </>
                }
            >
                <div className="space-y-4">
                    {[
                        { label: 'Operational Name', key: 'branchName', placeholder: 'Node Identifier' },
                        { label: 'Primary District', key: 'district', placeholder: 'Kigali / Center' },
                        { label: 'Operational Sector', key: 'sector', placeholder: 'Sector Vector' },
                        { label: 'Cell Identity', key: 'cell', placeholder: 'Digital Cell' },
                        { label: 'Village Node', key: 'village', placeholder: 'Unit Node' }
                    ].map((field) => (
                        <div key={field.key} className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                            <input
                                type="text"
                                value={editForm[field.key]}
                                onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold placeholder:text-slate-300 text-xs shadow-inner"
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={modals.delete}
                onClose={() => closeModal('delete')}
                title="Network Purge Protocol"
                variant="danger"
                footer={
                    <>
                        <button onClick={() => closeModal('delete')} className="px-6 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-widest">Abort</button>
                        <button onClick={handleDeleteBranch} className="px-10 py-3 bg-rose-600 text-white rounded-none font-black uppercase text-[10px] tracking-[0.2em] border-none shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-700 transition-all">Execute Purge</button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center gap-6 py-4">
                    <div className="w-24 h-24 bg-rose-50 dark:bg-rose-950/20 rounded-none flex items-center justify-center text-rose-600 border-4 border-rose-100 dark:border-rose-900 shadow-xl">
                        <Trash2 size={40} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Irreversible Purge</h4>
                        <p className="text-[11px] font-bold text-slate-400 leading-relaxed max-w-sm uppercase tracking-tight">
                            You are about to permanently disconnect <span className="text-rose-600 decoration-rose-200 underline underline-offset-4">{selectedBranch?.branchName || selectedBranch?.name}</span> from the infrastructure matrix. All associated operational links will be severed.
                        </p>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modals.assign}
                onClose={() => closeModal('assign')}
                title="Personnel Deployment Matrix"
                footer={
                    <>
                        <button onClick={() => closeModal('assign')} className="px-6 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-widest">Abort</button>
                        <button onClick={handleAssignUser} className="px-8 py-3 bg-purple-600 text-white border-none font-black uppercase text-[10px] tracking-widest shadow-lg shadow-purple-100 dark:shadow-none hover:bg-purple-700 transition-all">Execute Deployment</button>
                    </>
                }
            >
                {loadingUsers ? (
                    <div className="flex flex-col items-center py-10 gap-4">
                        <div className="w-12 h-12 border-4 border-purple-600/10 border-t-purple-600 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Scanning IDs</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Deployment Node</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedBranch?.branchName || selectedBranch?.name}</p>
                            </div>
                            <MapPin className="text-purple-600 opacity-20" size={32} />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Personnel Identifier</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 outline-none focus:border-purple-600 transition-all font-black text-xs uppercase tracking-tight text-slate-900 dark:text-white appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-slate-400">SELECT OPERATIONAL AGENT</option>
                                    {businessUsers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.fullName || `${user.firstName} ${user.lastName}`} — {user.role?.toUpperCase() || 'AGENT'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {businessUsers.length === 0 && (
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center py-4 bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-100 dark:border-rose-900/40">No Authorized Personnel Found in Cluster</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// Re-using defined icons for group display
const Calendar = ({ size, className }) => <Clock size={size} className={className} />;

export default BranchesPage;
