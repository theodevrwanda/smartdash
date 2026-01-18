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
        <div className="flex flex-col h-full -mt-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-slate-800">Team Members</h2>
                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">Showing {employees.length} employees</div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] relative border border-slate-200 rounded-sm shadow-sm bg-white">
                <table className="w-full min-w-[1200px] text-left border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50 font-semibold text-slate-600">
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Avatar</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200 text-left">Full Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Business Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Branch Name</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Role</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Phone</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Email</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200">Status</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-r border-slate-200 text-center">Created At</th>
                            <th className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-4 py-2 border-b border-r border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase border border-slate-200">
                                        {emp.firstName ? emp.firstName.charAt(0) : (emp.name ? emp.name.charAt(0) : 'U')}
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 font-medium text-slate-800 text-left">{emp.fullName || emp.name || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{emp.businessName}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{emp.branchName || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600 capitalize">{emp.role || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{emp.phone || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-600">{emp.email || '-'}</td>
                                <td className="px-4 py-2 border-b border-r border-slate-100">
                                    <Badge variant={emp.isActive ? 'success' : 'error'}>
                                        {emp.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2 border-b border-r border-slate-100 text-slate-500 text-[11px] text-center font-mono">
                                    {emp.createdAt ? (typeof emp.createdAt === 'object' && emp.createdAt.toDate ? emp.createdAt.toDate().toLocaleString() : new Date(emp.createdAt).toLocaleString()) : '-'}
                                </td>
                                <td className="px-4 py-2 border-b border-slate-100 text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded border border-slate-200">
                                            <User size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan="20" className="px-6 py-12 text-center text-slate-500">
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
