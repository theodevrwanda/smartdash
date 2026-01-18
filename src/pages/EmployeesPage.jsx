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
        <div className="space-y-6">
            <Card className="overflow-hidden p-0">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-800">Team Members</h2>
                    <div className="text-sm text-slate-500">Showing {employees.length} employees</div>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] relative border rounded-lg">
                    <table className="w-full min-w-[1200px] text-left border-separate border-spacing-0 text-sm">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-slate-50 whitespace-nowrap">
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Avatar</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 text-left">Full Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Business Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Branch Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Role</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Phone</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Email</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Status</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">Created At</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                    <td className="px-4 py-3 border-b border-slate-50">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
                                            {emp.firstName ? emp.firstName.charAt(0) : (emp.name ? emp.name.charAt(0) : 'U')}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-800 border-b border-slate-50 text-left">{emp.fullName || emp.name || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{emp.businessName}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{emp.branchName || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 capitalize border-b border-slate-50">{emp.role || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{emp.phone || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-50">{emp.email || '-'}</td>
                                    <td className="px-4 py-3 border-b border-slate-50">
                                        <Badge variant={emp.isActive ? 'success' : 'error'}>
                                            {emp.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs border-b border-slate-50">
                                        {emp.createdAt ? (typeof emp.createdAt === 'object' && emp.createdAt.toDate ? emp.createdAt.toDate().toLocaleString() : new Date(emp.createdAt).toLocaleString()) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right border-b border-slate-50">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200">
                                            <User size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="18" className="px-6 py-8 text-center text-slate-500">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default EmployeesPage;
