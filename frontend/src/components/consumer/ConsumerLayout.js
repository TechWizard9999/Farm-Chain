'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ScanLine,
    Route,
    Shield,
    Share2,
    User,
    Menu,
    X,
    LogOut,
    ShoppingBag,
    Bell
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navigation = [
    { name: 'Dashboard', href: '/consumer/dashboard', icon: LayoutDashboard },
    { name: 'Scan QR Code', href: '/consumer/scan', icon: ScanLine },
    { name: 'Journey History', href: '/consumer/journey', icon: Route },
    { name: 'Verified Products', href: '/consumer/verified', icon: Shield },
    { name: 'Profile', href: '/consumer/profile', icon: User },
];

export default function ConsumerLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className={`fixed top-0 left-0 h-full w-72 bg-[#0f172a] text-white z-50 shadow-2xl transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                initial={false}
            >
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <Link href="/consumer/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">FarmChain</h1>
                                <p className="text-xs text-blue-400 font-medium tracking-wider uppercase">Consumer Portal</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white p-2"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <nav className="p-4 flex-1 overflow-y-auto mt-4 px-6">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link href={item.href}>
                                        <motion.div
                                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative overflow-hidden ${isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-nav"
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 z-0"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : ''}`} strokeWidth={2} />
                                            <span className="font-medium relative z-10">{item.name}</span>
                                        </motion.div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LogOut className="w-5 h-5" strokeWidth={2} />
                        <span>Sign Out</span>
                    </motion.button>
                </div>
            </motion.aside>

            <div className="lg:ml-72 transition-all duration-300">
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 lg:px-10 py-5">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                            </h2>
                        </div>

                        <div className="flex items-center gap-6">
                            <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                <Bell className="w-6 h-6" />
                            </button>
                            <div className="h-8 w-[1px] bg-slate-200"></div>
                            <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-bold text-slate-900">Sarah Consumer</p>
                                    <p className="text-xs text-slate-500 font-medium">Pro Member</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center text-white font-bold ring-4 ring-white">
                                    SC
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6 lg:p-10 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
