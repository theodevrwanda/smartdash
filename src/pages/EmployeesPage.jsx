import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 whitespace-nowrap">
                                <th className="px-4 py-3 font-semibold text-slate-500">Avatar</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Full Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Business ID</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Business Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Branch ID</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Branch Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Role</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Phone</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Email</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Gender</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Province/District</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Sector</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Cell</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Village</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Status</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Created At</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Updated At</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                    <td className="px-4 py-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
                                            {emp.firstName ? emp.firstName.charAt(0) : (emp.name ? emp.name.charAt(0) : 'U')}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{emp.fullName || emp.name || '-'}</td>
                                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{emp.businessId || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{emp.businessName}</td>
                                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{emp.branch && emp.branch.length > 20 ? emp.branch.substring(0, 8) + '...' : (emp.branch || '-')}</td>
                                    <td className="px-4 py-3 text-slate-600">{emp.branchName || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 capitalize">{emp.role || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{emp.phone || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{emp.email || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 capitalize">{emp.gender || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{emp.district || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{emp.sector || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{emp.cell || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{emp.village || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {emp.isActive ? 'True' : 'False'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {emp.createdAt ? new Date(emp.createdAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {emp.updatedAt ? new Date(emp.updatedAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-2 py-1 rounded">Edit</button>
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
