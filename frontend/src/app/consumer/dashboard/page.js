'use client';

import { motion } from 'framer-motion';
import ConsumerLayout from '@/components/consumer/ConsumerLayout';
import {
    ScanLine,
    Shield,
    History,
    Award,
    ArrowRight,
    CheckCircle2,
    MapPin,
    Calendar,
    Leaf,
    Share2,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// Mock Data
const recentScans = [
    {
        id: 'BCH-001',
        product: 'Organic Tomatoes',
        farmer: 'Green Valley Farm',
        location: 'California, USA',
        verified: true,
        scannedDate: 'Jan 23, 2026',
        image: '🍅'
    },
    {
        id: 'BCH-005',
        product: 'Fresh Lettuce',
        farmer: 'Sunny Acres Farm',
        location: 'Oregon, USA',
        verified: true,
        scannedDate: 'Jan 22, 2026',
        image: '🥬'
    },
    {
        id: 'BCH-009',
        product: 'Bell Peppers',
        farmer: 'Valley View Farm',
        location: 'Washington, USA',
        verified: true,
        scannedDate: 'Jan 20, 2026',
        image: '🫑'
    },
];

const stats = [
    { label: 'Products Scanned', value: '24', icon: ScanLine, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Verified Products', value: '24', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Farmers Supported', value: '12', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Shares Made', value: '8', icon: Share2, color: 'text-violet-500', bg: 'bg-violet-500/10' },
];

export default function ConsumerDashboard() {
    return (
        <ConsumerLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <motion.div
                    className="relative overflow-hidden bg-[#0f172a] rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-blue-900/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                                Welcome back, Sarah! 👋
                            </h1>
                            <p className="text-blue-100/80 text-lg max-w-xl">
                                Verify the authenticity of your food products with blockchain. You've made <span className="text-white font-bold">12 sustainable choices</span> this week.
                            </p>
                        </div>
                        <Link href="/consumer/scan">
                            <motion.button
                                className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ScanLine className="w-5 h-5" />
                                Scan New Product
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} inline-flex mb-4`}>
                                <stat.icon className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: 'Scan Product', desc: 'Verify authenticity', icon: ScanLine, color: 'blue', href: '/consumer/scan' },
                        { title: 'View History', desc: 'See scanned products', icon: History, color: 'indigo', href: '/consumer/journey' },
                        { title: 'Achievements', desc: 'View rewards', icon: Award, color: 'violet', href: '/consumer/profile' }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                        >
                            <Link href={item.href}>
                                <div className={`relative overflow-hidden bg-white hover:bg-slate-50 border border-slate-200 hover:border-${item.color}-200 p-6 rounded-3xl transition-all group cursor-pointer shadow-sm hover:shadow-md`}>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`p-4 rounded-2xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-8 h-8" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Scans */}
                <motion.div
                    className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Recently Scanned</h2>
                            <p className="text-sm text-slate-500 mt-1">Your supply chain journey history</p>
                        </div>
                        <Link href="/consumer/journey" className="text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                            View All
                        </Link>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="space-y-4">
                            {recentScans.map((scan, index) => (
                                <motion.div
                                    key={scan.id}
                                    className="group flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50/50 hover:bg-blue-50/30 border border-transparent hover:border-blue-100 rounded-2xl transition-all cursor-pointer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                >
                                    {/* Product Image */}
                                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                                        {scan.image}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 w-full text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-slate-900">{scan.product}</h3>
                                            {scan.verified && (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full mx-auto md:mx-0">
                                                    <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
                                                    <span className="text-xs font-bold uppercase tracking-wide">Verified</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Leaf className="w-4 h-4 text-emerald-500" />
                                                <span>{scan.farmer}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                <span>{scan.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-violet-500" />
                                                <span>{scan.scannedDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <div className="w-full md:w-auto">
                                        <button className="w-full md:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 group-hover:border-blue-200 group-hover:text-blue-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                                            View Journey
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </ConsumerLayout>
    );
}
