import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
    AreaChart, Area
} from 'recharts';
import {
    Building2, Users, CreditCard, TrendingUp, Wallet, Activity
} from 'lucide-react';
import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

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

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 dark:border-slate-200"></div></div>;
    if (!stats) return <div className="p-8 dark:text-slate-300">Failed to load dashboard data.</div>;

    const { businessStats, userStats, paymentStats, businessGrowthData, paymentsGrowthData } = stats;

    const COLORS = theme === 'dark' ? ['#059669', '#7c3aed', '#2563eb', '#d97706'] : ['#a8dcc0', '#c8bde0', '#b8cdec', '#fcf4dd'];
    const CHART_TEXT = theme === 'dark' ? '#94a3b8' : '#64748b';
    const CHART_GRID = theme === 'dark' ? '#1e293b' : '#f1f5f9';

    const planData = [
        { name: 'Free', value: businessStats.byPlan.free },
        { name: 'Monthly', value: businessStats.byPlan.monthly },
        { name: 'Annually', value: businessStats.byPlan.annually || businessStats.byPlan.yearly },
        { name: 'Forever', value: businessStats.byPlan.forever },
    ];

    const StatGroup = ({ title, icon: Icon, children }) => (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium uppercase text-xs tracking-wider">
                <Icon size={16} /> {title}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {children}
            </div>
        </div>
    );

    const MiniCard = ({ title, value, subtext, color = "bg-white dark:bg-slate-900", textColor = "text-slate-800 dark:text-slate-100" }) => (
        <Card className={`${color} border-none shadow-sm p-4 flex flex-col justify-between h-24`}>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{title}</span>
            <div className={`text-2xl font-bold ${textColor}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {subtext && <span className="text-[10px] text-slate-400 dark:text-slate-500">{subtext}</span>}
        </Card>
    );

    return (
        <div className="space-y-8 pb-8 animate-fade-in">
            {/* Page Navigation / Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span>Pages</span>
                    <span className="text-[10px]">/</span>
                    <span className="text-slate-900 dark:text-slate-200">Dashboard</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Super Admin Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Overview of platform performance and metrics.</p>
            </div>

            {/* Businesses Stats */}
            <StatGroup title="Businesses" icon={Building2}>
                <MiniCard title="Total Businesses" value={businessStats.total} subtext="Registered" />
                <MiniCard title="Active Businesses" value={businessStats.active} textColor="text-green-600 dark:text-green-400" />
                <MiniCard title="Inactive Businesses" value={businessStats.inactive} textColor="text-red-500 dark:text-red-400" />
                <Card className="bg-slate-800 dark:bg-slate-800 text-white p-4 flex flex-col justify-between h-24 border-none">
                    <span className="text-xs text-slate-400 font-medium">Top Plan</span>
                    <div className="text-xl font-bold">
                        {Object.entries(businessStats.byPlan).sort((a, b) => b[1] - a[1])[0][0].toUpperCase()}
                    </div>
                </Card>
            </StatGroup>

            {/* Users Stats */}
            <StatGroup title="Users" icon={Users}>
                <MiniCard title="Total Users" value={userStats.total} />
                <MiniCard title="Active Users" value={userStats.active} textColor="text-green-600 dark:text-green-400" />
                <MiniCard title="Admins" value={userStats.admin} />
                <MiniCard title="Staff" value={userStats.staff} />
            </StatGroup>

            {/* Payments Stats */}
            <StatGroup title="Payments" icon={CreditCard}>
                <MiniCard title="Total Revenue" value={new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(paymentStats.revenue)} />
                <MiniCard title="Total Transactions" value={paymentStats.total} />
                <MiniCard title="Pending Approvals" value={paymentStats.pending} textColor="text-amber-500 dark:text-amber-400" color="bg-amber-50 dark:bg-amber-900/10" />
                <MiniCard title="Approved" value={paymentStats.approved} textColor="text-green-600 dark:text-green-400" />
            </StatGroup>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <Card className="p-6 h-96 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Activity size={18} className="text-blue-500" /> Business Onboarding Velocity
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Past 14 Days</span>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer>
                            <AreaChart data={businessGrowthData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme === 'dark' ? '#0ea5e9' : '#3b82f6'} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={theme === 'dark' ? '#0ea5e9' : '#3b82f6'} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} />
                                <XAxis
                                    dataKey="name"
                                    fontSize={10}
                                    stroke={CHART_TEXT}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    fontSize={10}
                                    stroke={CHART_TEXT}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                                        borderRadius: '8px',
                                        border: theme === 'dark' ? '1px solid #1e293b' : 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={theme === 'dark' ? '#0ea5e9' : '#3b82f6'}
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Revenue Chart */}
                <Card className="p-6 h-96 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Wallet size={18} className="text-purple-500" /> Revenue Flow Velocity
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Past 14 Days</span>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer>
                            <AreaChart data={paymentsGrowthData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme === 'dark' ? '#a78bfa' : '#8b5cf6'} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={theme === 'dark' ? '#a78bfa' : '#8b5cf6'} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} />
                                <XAxis
                                    dataKey="name"
                                    fontSize={10}
                                    stroke={CHART_TEXT}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    fontSize={10}
                                    stroke={CHART_TEXT}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    formatter={(value) => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(value)}
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                                        borderRadius: '8px',
                                        border: theme === 'dark' ? '1px solid #1e293b' : 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={theme === 'dark' ? '#a78bfa' : '#8b5cf6'}
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Plan Distribution */}
                <Card className="p-6 h-[400px] flex flex-col lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Subscription Plan Distribution</h3>
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
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                                            borderRadius: '8px',
                                            border: theme === 'dark' ? '1px solid #1e293b' : 'none'
                                        }}
                                        itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 p-4">
                            {planData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 transition-colors">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{entry.name} Plan</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{entry.value} businesses</span>
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
