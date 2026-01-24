'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Building, ArrowRight, Eye, EyeOff, ShoppingBag, Leaf, ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import Image from 'next/image';

function AuthContainer() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // UI States
    const [mode, setMode] = useState('login');
    const [role, setRole] = useState('farmer');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '',
        farmName: '', farmLocation: '', address: ''
    });

    useEffect(() => {
        const modeParam = searchParams.get('mode');
        if (modeParam === 'signup') setMode('signup');

        const roleParam = searchParams.get('role');
        if (roleParam === 'consumer' || roleParam === 'farmer') {
            setRole(roleParam);
        }
    }, [searchParams]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            router.push(role === 'farmer' ? '/farmer/dashboard' : '/consumer/dashboard');
            setIsLoading(false);
        }, 1500);
    };

    const isFarmer = role === 'farmer';

    return (
        // BACKGROUND: Very Light Gray/Slate - "Even Less Dark"
        <div className="h-screen w-full flex items-center justify-center bg-[#f1f5f9] p-4 lg:p-8 font-sans relative overflow-hidden">

            {/* VIGNETTE EFFECT: Darkness coming from corners (Now subtle & light) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Soft Slate Blobs in Corners */}
                <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-slate-300/40 blur-[150px] rounded-br-full" />
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-slate-300/40 blur-[150px] rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-slate-300/40 blur-[150px] rounded-tr-full" />
                <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-slate-300/40 blur-[150px] rounded-tl-full" />

                {/* Global Radial Vignette for Light Theme */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(148,163,184,0.15)_100%)]" />
            </div>

            <motion.div
                layout
                // CARD: Pure White for maximum clarity
                className="w-full max-w-[1100px] h-[85vh] min-h-[650px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row relative z-10 border border-slate-200/50"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* IMAGE SECTION */}
                <div className="hidden lg:block w-[45%] relative bg-slate-100 overflow-hidden border-r border-slate-100">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={role}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 h-full w-full"
                        >
                            <Image
                                src={isFarmer
                                    ? "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2000&auto=format&fit=crop"
                                    : "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"
                                }
                                alt="Context"
                                fill
                                className="object-cover"
                                unoptimized
                                priority
                            />
                            {/* Light Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                            <div className="absolute top-10 left-10">
                                <Logo size="medium" color="white" />
                            </div>

                            <div className="absolute bottom-12 left-12 right-12 text-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-[2px] bg-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                                        {isFarmer ? 'Producer Access' : 'Consumer Portal'}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-bold mb-4 leading-tight drop-shadow-sm">
                                    {isFarmer ? 'Grow with Transparency.' : 'Know Your Origins.'}
                                </h2>
                                <p className="text-white/90 text-sm font-medium leading-relaxed max-w-xs drop-shadow-sm">
                                    {isFarmer
                                        ? "Verify every harvest on the blockchain and build lasting trust."
                                        : "Scan any product to view its real-time journey from the soil."
                                    }
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* FORM SECTION - Light Theme Form */}
                <div className="w-full lg:w-[55%] flex flex-col bg-white">
                    <div className="flex flex-col h-full p-10 lg:p-14 justify-center overflow-y-auto no-scrollbar">

                        <div className="mb-4 shrink-0 flex justify-between items-center">
                            {mode === 'signup' && (
                                <button onClick={() => setMode('login')} className="text-slate-400 hover:text-emerald-600 transition-colors text-[10px] font-black tracking-widest flex items-center gap-1 group">
                                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> BACK TO LOGIN
                                </button>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col h-full justify-center"
                            >
                                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">
                                    {mode === 'login' ? 'Sign In' : 'Sign Up'}
                                </h1>
                                <p className="text-slate-400 mb-10 text-sm font-medium">
                                    {mode === 'login' ? 'Access your dashboard.' : 'Create an account to join the network.'}
                                </p>

                                {/* Role Selector - Balanced Pills */}
                                <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200 mb-8 shrink-0">
                                    <button
                                        onClick={() => setRole('farmer')}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isFarmer ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Farmer
                                    </button>
                                    <button
                                        onClick={() => setRole('consumer')}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isFarmer ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Consumer
                                    </button>
                                </div>

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    {mode === 'signup' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                                <input type="text" name="name" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none" placeholder="John" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact</label>
                                                <input type="tel" name="phone" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none" placeholder="+1..." />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500" />
                                            <input type="email" name="email" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none" placeholder="you@domain.com" />
                                        </div>
                                    </div>

                                    {mode === 'signup' && (
                                        isFarmer ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Farm Name</label>
                                                    <input type="text" name="farmName" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none" placeholder="Green Hill" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                                                    <input type="text" name="farmLocation" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none" placeholder="Dallas, TX" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                                                <input type="text" name="address" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none" placeholder="City, State, Zip" />
                                            </div>
                                        )
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500" />
                                            <input type={showPassword ? 'text' : 'password'} name="password" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-11 text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none" placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" disabled={isLoading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                                            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Join Network'} <ArrowRight className="w-4 h-4 text-emerald-200" />
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 pt-6 border-t border-slate-100 text-center shrink-0">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        {mode === 'login' ?
                                            <>New member? <button onClick={() => setMode('signup')} className="text-emerald-600 hover:underline">Register Now</button></> :
                                            <>Existing member? <button onClick={() => setMode('login')} className="text-emerald-600 hover:underline">Login here</button></>
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-[#f1f5f9] flex items-center justify-center text-emerald-500 text-xs font-black uppercase tracking-[0.3em]">Loading Account...</div>}>
            <AuthContainer />
        </Suspense>
    );
}
