import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Mail, Briefcase, MapPin, Building2, User } from 'lucide-react';
import { adminService } from '../services/adminService';

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await adminService.fetchEmployees();
                setEmployees(data);
            } catch (error) {
                console.error("Failed to load employees", error);
            } finally {
                setLoading(false);
            }
        };
        loadEmployees();
    }, []);

    if (loading) {
        return <div className="p-6">Loading employees...</div>;
    }

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span>Pages</span>
                    <span className="text-[10px]">/</span>
                    <span className="text-slate-900 dark:text-slate-200">Users</span>
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Team Members
                    </h1>
                    <div className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-200 dark:border-slate-800 shadow-sm font-medium">
                        {employees.length} users registered
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] relative border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm bg-white dark:bg-slate-900">
                <table className="w-full min-w-[1200px] text-left border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Avatar</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700 text-left">Full Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Business Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Branch Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Role</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Phone</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Email</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700">Status</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-r border-slate-200 dark:border-slate-700 text-center">Created At</th>
                            <th className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs uppercase border border-slate-200 dark:border-slate-700">
                                        {emp.firstName ? emp.firstName.charAt(0) : (emp.name ? emp.name.charAt(0) : 'U')}
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-100 text-left">{emp.fullName || emp.name || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{emp.businessName}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{emp.branchName || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 capitalize">{emp.role || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{emp.phone || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{emp.email || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800">
                                    <Badge variant={emp.isActive ? 'success' : 'error'}>
                                        {emp.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] text-center font-mono">
                                    {emp.createdAt ? (typeof emp.createdAt === 'object' && emp.createdAt.toDate ? emp.createdAt.toDate().toLocaleString() : new Date(emp.createdAt).toLocaleString()) : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-slate-200 dark:border-slate-700">
                                            <User size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan="20" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeesPage;
