import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    Users, Search, Download, Trash2, Eye, Power, Building2,
    MapPin, Mail, Phone, Calendar, Clock, ShieldCheck,
    Hash, Info, User as UserIcon, Filter, ArrowUpDown,
    ChevronUp, ChevronDown
} from 'lucide-react';
import { adminService } from '../services/adminService';

const EmployeesPage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to load employees", error);
        } finally {
            setLoading(false);
        }
    };

    // Processed Data
    const processedEmployees = useMemo(() => {
        let result = [...employees];

        // Universal Search
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(e =>
                (e.fullName || `${e.firstName} ${e.lastName}`).toLowerCase().includes(lowSearch) ||
                (e.email || '').toLowerCase().includes(lowSearch) ||
                (e.phone || '').toLowerCase().includes(lowSearch) ||
                (e.businessName || '').toLowerCase().includes(lowSearch) ||
                (e.branchName || '').toLowerCase().includes(lowSearch)
            );
        }

        // Status Filter
        if (statusFilter !== 'all') {
            const isActive = statusFilter === 'active';
            result = result.filter(e => e.isActive === isActive);
        }

        // Role Filter
        if (roleFilter !== 'all') {
            result = result.filter(e => e.role === roleFilter);
        }

        // Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Handle composite name
                if (sortConfig.key === 'fullName') {
                    aVal = a.fullName || `${a.firstName} ${a.lastName}`;
                    bVal = b.fullName || `${b.firstName} ${b.lastName}`;
                }

                aVal = String(aVal || '').toLowerCase();
                bVal = String(bVal || '').toLowerCase();

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [employees, searchTerm, statusFilter, roleFilter, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ArrowUpDown size={10} className="ml-1 opacity-20 group-hover:opacity-100" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={10} className="ml-1 text-blue-600" /> : <ChevronDown size={10} className="ml-1 text-blue-600" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-20">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Syncing Personnel Data</p>
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
                        <span>Security & Personnel Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        Employee Registry
                    </h1>
                </div>
                <button
                    onClick={loadEmployees}
                    className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-none flex items-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-none"
                >
                    <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-none flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white dark:text-slate-900 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Sync Nodes</span>
                </button>
            </div>

            {/* Filter & Search Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH PERSONNEL BY NAME, EMAIL, PHONE OR NODE..."
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
                        <option value="all">ALL REACHABILITY</option>
                        <option value="active">ONLINE ONLY</option>
                        <option value="inactive">OFFLINE ONLY</option>
                    </select>
                </div>
                <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-blue-600 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="all">ALL ROLE PROFILES</option>
                        <option value="admin">ADMINISTRATORS</option>
                        <option value="staff">OPERATIONAL STAFF</option>
                        <option value="super_admin">SUPER ADMINS</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[2000px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest text-left whitespace-nowrap">
                                <th className="px-4 py-4 border border-slate-200 dark:border-slate-800">#</th>
                                <th onClick={() => requestSort('fullName')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Personnel Name <SortIcon column="fullName" /></div>
                                </th>
                                <th onClick={() => requestSort('email')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Email Address <SortIcon column="email" /></div>
                                </th>
                                <th className="px-4 py-4 border border-slate-200 dark:border-slate-800">Phone Number</th>
                                <th onClick={() => requestSort('role')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Role Profile <SortIcon column="role" /></div>
                                </th>
                                <th onClick={() => requestSort('businessName')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Entity Name <SortIcon column="businessName" /></div>
                                </th>
                                <th onClick={() => requestSort('branchName')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Branch Node <SortIcon column="branchName" /></div>
                                </th>
                                <th className="px-4 py-4 border border-slate-200 dark:border-slate-800">District</th>
                                <th className="px-4 py-4 border border-slate-200 dark:border-slate-800">Sector</th>
                                <th className="px-4 py-4 border border-slate-200 dark:border-slate-800 text-center">Active Status</th>
                                <th onClick={() => requestSort('createdAt')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center">Onboarded <SortIcon column="createdAt" /></div>
                                </th>
                                <th className="px-4 py-4 border border-slate-200 dark:border-slate-800 text-right">Registry Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {processedEmployees.map((employee, index) => (
                                <tr key={employee.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 even:bg-slate-50/50 dark:even:bg-slate-900/10 whitespace-nowrap">
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 shadow-inner">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-none border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shrink-0 shadow-sm relative group-hover:border-blue-500 transition-colors">
                                                {(employee.profileImage || employee.imagephoto) ? (
                                                    <img src={employee.profileImage || employee.imagephoto} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-black text-xs">
                                                        {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                    {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 font-mono">UID: {employee.id.substring(0, 12).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-[11px] font-bold text-slate-500 italic underline decoration-slate-200 underline-offset-4">{employee.email || 'NO_EMAIL_VECTOR'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 uppercase text-[10px] font-black text-slate-600 dark:text-slate-400 tracking-widest bg-slate-50/50 dark:bg-slate-900/20">
                                        {employee.phone || '---'}
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] border-2 shadow-sm ${employee.role === 'super_admin' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                employee.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                            {employee.role?.replace('_', ' ') || 'AGENT'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter leading-tight italic decoration-slate-200 underline decoration-2 underline-offset-4">{employee.businessName || 'INDEPENDENT'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase rounded-none border-blue-100 text-blue-600 bg-blue-50/40 px-3 tracking-widest">
                                            {employee.branchName || 'ROOT_NODE'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{employee.district || '---'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{employee.sector || '---'}</span>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className={`flex items-center gap-2 px-4 py-2 w-fit border-2 ${employee.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40' : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40'}`}>
                                            <div className={`w-2 h-2 rounded-full ${employee.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse' : 'bg-rose-500'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{employee.isActive ? 'Online' : 'Offline'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">
                                                <Calendar size={10} className="text-slate-400" /> {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'UNKNOWN'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => navigate(`/user/${employee.id}`)}
                                                className="p-2 text-blue-600 bg-white dark:bg-slate-900 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800 shadow-sm"
                                                title="Open Personnel Archive"
                                            >
                                                <Eye size={12} />
                                            </button>
                                            <button className="p-2 text-rose-600 bg-white dark:bg-slate-900 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800 shadow-sm" title="Restrict Access">
                                                <Power size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {processedEmployees.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="30" className="px-6 py-40 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-40">
                                            <div className="p-8 border-4 border-slate-100 dark:border-slate-800 rounded-none bg-slate-50 dark:bg-slate-900/50">
                                                <UserIcon size={64} className="text-slate-200 dark:text-slate-700" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-slate-500 font-extrabold uppercase tracking-[0.2em] text-sm">Personnel Vector Not Found</p>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Adjust your search parameters or filter matrix to locate the agent.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;
