import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import {
    Clock, Shield, AlertCircle, Info, ShoppingCart,
    UserPlus, FileText, Activity, ShieldCheck, Eye,
    Trash2, Hash, User, Calendar, Building2, MapPin, Search,
    Filter, ArrowUpDown, ChevronUp, ChevronDown
} from 'lucide-react';
import Loading from '../components/ui/Loading';

const LogsPage = ({ limit }) => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [businesses, setBusinesses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Search & Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const initFilters = async () => {
            try {
                const bizData = await adminService.fetchAllBusinesses();
                setBusinesses(bizData);

                // If limit is provided (dashboard widget), load immediately
                if (limit) {
                    await loadLogs();
                }
            } catch (error) {
                console.error("Failed to initialize log filters", error);
            } finally {
                setIsInitialLoad(false);
                if (!limit) setLoading(false);
            }
        };
        initFilters();
    }, [limit]);

    // Updated load handlers
    useEffect(() => {
        if (selectedBusiness === 'all') {
            setBranches([]);
            setSelectedBranch('');
            loadLogs(null, null);
        } else if (selectedBusiness) {
            loadBranches(selectedBusiness);
            loadLogs(selectedBusiness, '');
            setSelectedBranch('');
        } else {
            setLogs([]);
            setBranches([]);
            setSelectedBranch('');
        }
    }, [selectedBusiness]);

    // Load logs when branch changes
    useEffect(() => {
        if (selectedBusiness && selectedBusiness !== 'all' && selectedBranch) {
            loadLogs(selectedBusiness, selectedBranch);
        } else if (selectedBusiness && selectedBusiness !== 'all' && !selectedBranch) {
            loadLogs(selectedBusiness, null);
        }
    }, [selectedBranch]);

    const loadBranches = async (businessId) => {
        try {
            const allBranches = await adminService.fetchBranches();
            const filteredBranches = allBranches.filter(b => b.businessId === businessId);
            setBranches(filteredBranches);
        } catch (error) {
            console.error("Failed to load branches", error);
        }
    };

    const loadLogs = async (businessId = null, branchId = null) => {
        setLoading(true);
        try {
            const data = await adminService.fetchAuditLogs(businessId, branchId);
            setLogs(limit ? data.slice(0, limit) : data);
        } catch (error) {
            console.error("Failed to load logs", error);
        } finally {
            setLoading(false);
        }
    };

    // Client-side Filter & Sort
    const processedLogs = useMemo(() => {
        let result = [...logs];

        // Universal Search
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(log =>
                (log.action || '').toLowerCase().includes(lowSearch) ||
                (log.actionDetails || '').toLowerCase().includes(lowSearch) ||
                (log.userName || '').toLowerCase().includes(lowSearch) ||
                (log.userEmail || '').toLowerCase().includes(lowSearch) ||
                (log.transactionType || '').toLowerCase().includes(lowSearch) ||
                (log.businessName || '').toLowerCase().includes(lowSearch)
            );
        }

        // Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Special handling for nested or combined fields
                if (sortConfig.key === 'timestamp') {
                    aVal = a.createdAt || a.timestamp || 0;
                    bVal = b.createdAt || b.timestamp || 0;
                    if (typeof aVal === 'object' && aVal.toDate) aVal = aVal.toDate();
                    if (typeof bVal === 'object' && bVal.toDate) bVal = bVal.toDate();
                    return sortConfig.direction === 'asc' ? new Date(aVal) - new Date(bVal) : new Date(bVal) - new Date(aVal);
                }

                aVal = String(aVal || '').toLowerCase();
                bVal = String(bVal || '').toLowerCase();

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [logs, searchTerm, sortConfig]);

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

    const getIcon = (type) => {
        if (!type) return <Info size={16} />;
        const t = type.toLowerCase();
        if (t.includes('error') || t.includes('fail')) return <AlertCircle size={16} />;
        if (t.includes('sale') || t.includes('sold')) return <ShoppingCart size={16} />;
        if (t.includes('user') || t.includes('create')) return <UserPlus size={16} />;
        if (t.includes('admin') || t.includes('approve')) return <Shield size={16} />;
        return <FileText size={16} />;
    };

    const getColor = (type) => {
        if (!type) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        const t = type.toLowerCase();
        if (t.includes('error') || t.includes('fail')) return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800';
        if (t.includes('sale') || t.includes('sold')) return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
        if (t.includes('user')) return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800';
        if (t.includes('admin')) return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800';
        return 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400 border-slate-100 dark:border-slate-800';
    };

    const handleSelectLog = (logId) => {
        setSelectedLogs(prev =>
            prev.includes(logId)
                ? prev.filter(id => id !== logId)
                : [...prev, logId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedLogs(processedLogs.map(log => log.id));
        } else {
            setSelectedLogs([]);
        }
    };

    const handleDeleteLog = async (logId) => {
        if (window.confirm('Are you sure you want to permanently delete this log entry? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await adminService.deleteLog(logId);
                setLogs(prev => prev.filter(log => log.id !== logId));
                setSelectedLogs(prev => prev.filter(id => id !== logId));
            } catch (error) {
                console.error("Failed to delete log:", error);
                alert("Failed to delete log entry");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to permanently delete ${selectedLogs.length} selected log entries? This action cannot be undone.`)) {
            setIsDeleting(true);
            try {
                await adminService.deleteLogs(selectedLogs);
                setLogs(prev => prev.filter(log => !selectedLogs.includes(log.id)));
                setSelectedLogs([]);
            } catch (error) {
                console.error("Failed to delete logs:", error);
                alert("Failed to delete selected log entries");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (isInitialLoad) {
        return <Loading message="Initializing Matrix" />;
    }

    return (
        <div className={`flex flex-col h-full ${limit ? '' : 'animate-fade-in py-6'}`}>
            {!limit && (
                <div className="flex flex-col gap-8 mb-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">
                                <Activity size={12} />
                                <span>System Observability</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                Audit Matrix
                            </h1>
                        </div>
                        <button
                            onClick={() => loadLogs(selectedBusiness, selectedBranch)}
                            className="group bg-slate-900 dark:bg-white p-1 pr-6 rounded-none flex items-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-none"
                        >
                            <div className="w-10 h-10 bg-slate-800 dark:bg-slate-100 rounded-none flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white dark:text-slate-900" />
                            </div>
                            <span className="text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider">Sync Matrix</span>
                        </button>
                    </div>

                    {selectedLogs.length > 0 && (
                        <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 p-4 animate-slide-up">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-rose-600 rounded-none flex items-center justify-center">
                                    <Trash2 className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-black text-rose-600 uppercase tracking-widest">
                                    {selectedLogs.length} Records Marked for Purge
                                </span>
                            </div>
                            <button
                                onClick={handleBulkDelete}
                                disabled={isDeleting}
                                className="px-6 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Purging...' : 'Execute Batch Purge'}
                            </button>
                        </div>
                    )}

                    {/* Filters & Search */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col gap-2 md:col-span-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Building2 size={12} /> Target Entity
                            </label>
                            <select
                                value={selectedBusiness}
                                onChange={(e) => setSelectedBusiness(e.target.value)}
                                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-blue-600 transition-colors cursor-pointer dark:text-white"
                            >
                                <option value="">Select Business</option>
                                <option value="all" className="text-blue-600 font-black">Global Matrix</option>
                                {businesses.map(biz => (
                                    <option key={biz.id} value={biz.id}>{biz.businessName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <MapPin size={12} /> Geographic Node
                            </label>
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                disabled={!selectedBusiness || selectedBusiness === 'all'}
                                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                            >
                                <option value="">All Branch Nodes</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Search size={12} /> Universal Trace
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search events, operators, or logic blocks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-blue-600 transition-colors dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-xl">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="spinner-gradient">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="spinner-bar"
                                        style={{
                                            transform: `rotate(${i * 30}deg) translate(0, -140%)`,
                                            animationDelay: `${-1.2 + i * 0.1}s`,
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Filtering Stream...</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1500px] border-collapse">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 dark:text-white uppercase tracking-widest text-left">
                                    <th className="px-4 py-4 border border-slate-200 dark:border-slate-800 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={processedLogs.length > 0 && selectedLogs.length === processedLogs.length}
                                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-4 py-4 border border-slate-200 dark:border-slate-800">#</th>
                                    <th onClick={() => requestSort('transactionType')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                        <div className="flex items-center">Operational Type <SortIcon column="transactionType" /></div>
                                    </th>
                                    <th onClick={() => requestSort('businessName')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                        <div className="flex items-center">Entity Node <SortIcon column="businessName" /></div>
                                    </th>
                                    <th onClick={() => requestSort('action')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                        <div className="flex items-center">Action Logic <SortIcon column="action" /></div>
                                    </th>
                                    <th onClick={() => requestSort('userName')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                        <div className="flex items-center">Operator Identity <SortIcon column="userName" /></div>
                                    </th>
                                    <th onClick={() => requestSort('timestamp')} className="px-4 py-4 border border-slate-200 dark:border-slate-800 text-center cursor-pointer hover:bg-slate-200/50 transition-colors group">
                                        <div className="flex items-center justify-center">Execution Timestamp <SortIcon column="timestamp" /></div>
                                    </th>
                                    <th className="px-4 py-4 border border-slate-200 dark:border-slate-800 text-right">Matrix Analysis</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                                {processedLogs.map((log, index) => (
                                    <tr key={log.id} className={`group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 ${selectedLogs.includes(log.id) ? 'bg-blue-50/80 dark:bg-blue-900/40' : 'even:bg-slate-50/50 dark:even:bg-slate-900/10'} whitespace-nowrap`}>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedLogs.includes(log.id)}
                                                onChange={() => handleSelectLog(log.id)}
                                                className="w-4 h-4 accent-blue-600 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                            <span className="text-xs font-black text-slate-400 dark:text-white">{String(index + 1).padStart(2, '0')}</span>
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-none border ${getColor(log.transactionType || log.action)}`}>
                                                    {getIcon(log.transactionType || log.action)}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white">
                                                    {log.transactionType?.replace('_', ' ') || 'SYSTEM_SIGNAL'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                                                    {log.businessName || 'Platform Root'}
                                                </span>
                                                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                                                    {log.branchName || 'Primary Node'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                                                    {log.action || log.actionDetails || 'N/A'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-white leading-tight">
                                                    {log.details || 'Baseline automated signal.'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner">
                                                    <User size={14} className="text-slate-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-slate-700 dark:text-white uppercase underline decoration-slate-200 decoration-2 underline-offset-2">
                                                        {log.userName || 'Root User'}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 dark:text-white tracking-tighter lowercase">
                                                        {log.userEmail || 'system@internal'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-white">
                                                    <Calendar size={12} /> {log.createdAt || log.timestamp ? new Date(log.createdAt || log.timestamp).toLocaleDateString() : '-'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 dark:text-white italic">
                                                    <Clock size={10} /> {log.createdAt || log.timestamp ? new Date(log.createdAt || log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/logs/${log.id}`)}
                                                    className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800"
                                                    title="Open Vector Dossier"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLog(log.id)}
                                                    disabled={isDeleting}
                                                    className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800 disabled:opacity-50"
                                                    title="Purge Record"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {processedLogs.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="20" className="px-6 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                <Search size={64} className="text-slate-200 dark:text-slate-800" />
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-slate-400 dark:text-white font-black uppercase tracking-widest text-sm">
                                                        {selectedBusiness ? 'Signal Nullified' : 'Awaiting Input'}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-white uppercase tracking-tighter">
                                                        {selectedBusiness
                                                            ? 'No operational events found for this filter vector.'
                                                            : 'Please select a business entity or global matrix to initialize the stream.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {limit && logs.length > 0 && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => navigate('/logs')}
                        className="px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl"
                    >
                        Access Full Audit Matrix →
                    </button>
                </div>
            )}
        </div>
    );
};

export default LogsPage;
