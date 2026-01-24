'use client';

import { motion } from 'framer-motion';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import {
    TrendingUp,
    Package,
    DollarSign,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    MapPin,
    Calendar,
    BarChart3,
    Clock,
    CheckCircle2
} from 'lucide-react';

// Mock Data
const stats = [
    {
        label: 'Total Batches',
        value: '124',
        change: '+12%',
        trend: 'up',
        icon: Package,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-200'
    },
    {
        label: 'Active Products',
        value: '48',
        change: '+8%',
        trend: 'up',
        icon: Activity,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-200'
    },
    {
        label: 'Total Earnings',
        value: '$45,280',
        change: '+23%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
        border: 'border-violet-200'
    },
    {
        label: 'This Month',
        value: '$12,540',
        change: '-5%',
        trend: 'down',
        icon: TrendingUp,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-200'
    },
];

const recentBatches = [
    { id: 'BCH-001', product: 'Organic Tomatoes', quantity: '500 kg', status: 'In Transit', date: 'Jan 20, 2026' },
    { id: 'BCH-002', product: 'Fresh Lettuce', quantity: '300 kg', status: 'Delivered', date: 'Jan 19, 2026' },
    { id: 'BCH-003', product: 'Bell Peppers', quantity: '400 kg', status: 'Processing', date: 'Jan 18, 2026' },
    { id: 'BCH-004', product: 'Cucumbers', quantity: '350 kg', status: 'In Transit', date: 'Jan 17, 2026' },
];

const activityData = [
    { action: 'New batch created', batch: 'BCH-001', time: '2 hours ago', icon: Package, color: 'bg-blue-500' },
    { action: 'Batch delivered', batch: 'BCH-002', time: '5 hours ago', icon: CheckCircle2, color: 'bg-emerald-500' },
    { action: 'Quality verified', batch: 'BCH-003', time: '1 day ago', icon: Activity, color: 'bg-violet-500' },
    { action: 'Payment received', amount: '$2,450', time: '2 days ago', icon: DollarSign, color: 'bg-amber-500' },
];

export default function FarmerDashboard() {
    return (
        <FarmerLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <motion.div
                    className="relative overflow-hidden bg-[#022c22] rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-emerald-900/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                                Good Morning, John! 👋
                            </h1>
                            <p className="text-emerald-100/80 text-lg max-w-xl">
                                Your farm is operating at <span className="text-white font-bold">94% efficiency</span> today. You have 3 pending tasks.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Package className="w-5 h-5" />
                                Create Batch
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-500'
                                    } bg-slate-50 px-2 py-1 rounded-lg`}>
                                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                                    {stat.value}
                                </h3>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Batches */}
                    <motion.div
                        className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Recent Batches</h2>
                                <p className="text-sm text-slate-500 mt-1">Track your latest production</p>
                            </div>
                            <button className="text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg transition-colors">
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Batch ID</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentBatches.map((batch, index) => (
                                        <motion.tr
                                            key={index}
                                            className="hover:bg-slate-50/80 transition-colors"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 + index * 0.05 }}
                                        >
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className="font-mono text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{batch.id}</span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-slate-900">{batch.product}</span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-500">{batch.quantity}</span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${batch.status === 'Delivered'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : batch.status === 'In Transit'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${batch.status === 'Delivered' ? 'bg-emerald-600' :
                                                            batch.status === 'In Transit' ? 'bg-blue-600' : 'bg-amber-600'
                                                        }`}></span>
                                                    {batch.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Clock className="w-4 h-4" />
                                                    {batch.date}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <div className="space-y-6">
                        <motion.div
                            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                            <div className="space-y-6 relative">
                                {/* Timeline Line */}
                                <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-100"></div>

                                {activityData.map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative flex gap-4"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <div className={`relative z-10 w-10 h-10 rounded-full ${activity.color} shadow-lg shadow-black/5 flex items-center justify-center text-white shrink-0`}>
                                            <activity.icon className="w-5 h-5" />
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-sm font-bold text-slate-900">
                                                {activity.action}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                                {activity.batch || activity.amount} • {activity.time}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                                <p className="text-indigo-100 text-sm mb-4">Complete your profile verification to unlock lower transaction fees.</p>
                                <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors">
                                    Verify Now
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </FarmerLayout>
    );
}
