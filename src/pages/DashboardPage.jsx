import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import {
    Building2, Users, CreditCard, TrendingUp, AlertCircle,
    CheckCircle2, XCircle, Wallet
} from 'lucide-react';
import Card from '../components/ui/Card';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await adminService.fetchDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div></div>;
    if (!stats) return <div className="p-8">Failed to load dashboard data.</div>;

    const { businessStats, userStats, paymentStats, businessGrowthData, paymentsGrowthData } = stats;

    const COLORS = ['#a8dcc0', '#c8bde0', '#b8cdec', '#fcf4dd']; // Mint, Lavender, Sky, Yellow
    const STATUS_COLORS = { active: '#10b981', inactive: '#ef4444', pending: '#f59e0b' };

    const planData = [
        { name: 'Free', value: businessStats.byPlan.free },
        { name: 'Monthly', value: businessStats.byPlan.monthly },
        { name: 'Yearly', value: businessStats.byPlan.yearly },
        { name: 'Forever', value: businessStats.byPlan.forever },
    ];

    const StatGroup = ({ title, icon: Icon, children }) => (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-500 font-medium uppercase text-xs tracking-wider">
                <Icon size={16} /> {title}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {children}
            </div>
        </div>
    );

    const MiniCard = ({ title, value, subtext, color = "bg-white", textColor = "text-slate-800" }) => (
        <Card className={`${color} border-none shadow-sm p-4 flex flex-col justify-between h-24`}>
            <span className="text-xs text-slate-500 font-medium">{title}</span>
            <div className={`text-2xl font-bold ${textColor}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {subtext && <span className="text-[10px] text-slate-400">{subtext}</span>}
        </Card>
    );

    return (
        <div className="space-y-8 pb-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Super Admin Dashboard</h1>
                <p className="text-slate-500">Overview of platform performance and metrics.</p>
            </div>

            {/* Businesses Stats */}
            <StatGroup title="Businesses" icon={Building2}>
                <MiniCard title="Total Businesses" value={businessStats.total} subtext="Registered" />
                <MiniCard title="Active Businesses" value={businessStats.active} textColor="text-green-600" />
                <MiniCard title="Inactive Businesses" value={businessStats.inactive} textColor="text-red-500" />
                <Card className="bg-slate-800 text-white p-4 flex flex-col justify-between h-24 border-none">
                    <span className="text-xs text-slate-400 font-medium">Top Plan</span>
                    <div className="text-xl font-bold">
                        {Object.entries(businessStats.byPlan).sort((a, b) => b[1] - a[1])[0][0].toUpperCase()}
                    </div>
                </Card>
            </StatGroup>

            {/* Users Stats */}
            <StatGroup title="Users" icon={Users}>
                <MiniCard title="Total Users" value={userStats.total} />
                <MiniCard title="Active Users" value={userStats.active} textColor="text-green-600" />
                <MiniCard title="Admins" value={userStats.admin} />
                <MiniCard title="Staff" value={userStats.staff} />
            </StatGroup>

            {/* Payments Stats */}
            <StatGroup title="Payments" icon={CreditCard}>
                <MiniCard title="Total Revenue" value={new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(paymentStats.revenue)} textColor="text-slate-800" />
                <MiniCard title="Total Transactions" value={paymentStats.total} />
                <MiniCard title="Pending Approvals" value={paymentStats.pending} textColor="text-amber-500" color="bg-amber-50" />
                <MiniCard title="Approved" value={paymentStats.approved} textColor="text-green-600" />
            </StatGroup>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <Card className="p-6 h-96 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} /> Business Growth (Monthly)
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer>
                            <BarChart data={businessGrowthData}>
                                <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                                <YAxis fontSize={12} stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#a8dcc0" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Revenue Chart */}
                <Card className="p-6 h-96 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Wallet size={18} /> Revenue Over Time
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer>
                            <LineChart data={paymentsGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                                <YAxis fontSize={12} stroke="#94a3b8" />
                                <Tooltip
                                    formatter={(value) => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Plan Distribution */}
                <Card className="p-6 h-80 flex flex-col lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-700 mb-4">Subscription Plan Distribution</h3>
                    <div className="flex flex-col md:flex-row items-center h-full">
                        <div className="h-full w-full md:w-1/2">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={planData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {planData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 p-4">
                            {planData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-700">{entry.name} Plan</span>
                                        <span className="text-xs text-slate-500">{entry.value} businesses</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
