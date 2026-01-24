'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sprout, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-300 rounded-full opacity-10 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Sparkle Icon */}
                    <motion.div
                        className="flex justify-center mb-6"
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <Sparkles className="w-12 h-12 text-yellow-300" />
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Ready to Transform Your Food Journey?
                    </h2>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Join the blockchain revolution in food traceability. Whether you're a farmer looking to reach consumers directly or a consumer seeking authentic products, we've got you covered.
                    </p>
                </motion.div>

                {/* CTA Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Farmer CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Link href="/auth/login?role=farmer">
                            <motion.div
                                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all cursor-pointer group"
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Sprout className="w-8 h-8 text-white" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-stone-800">For Farmers</h3>
                                        <p className="text-green-600 font-semibold">Start Tracking Today</p>
                                    </div>
                                </div>
                                <p className="text-stone-600 mb-6 leading-relaxed">
                                    Create batches, track your products, reach consumers directly, and earn fair prices for your hard work.
                                </p>
                                <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-4 transition-all">
                                    <span>Get Started as Farmer</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Consumer CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <Link href="/auth/login?role=consumer">
                            <motion.div
                                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all cursor-pointer group"
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ShoppingBag className="w-8 h-8 text-white" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-stone-800">For Consumers</h3>
                                        <p className="text-blue-600 font-semibold">Verify Authenticity</p>
                                    </div>
                                </div>
                                <p className="text-stone-600 mb-6 leading-relaxed">
                                    Scan QR codes, view product journey, verify organic certifications, and connect with farmers.
                                </p>
                                <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                                    <span>Explore as Consumer</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>

                {/* Additional Info */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <p className="text-green-100">
                        🔒 Your data is secured with blockchain technology • 🌍 Join 10,000+ farmers and millions of consumers
                    </p>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.div
                className="mt-20 pt-10 border-t border-white/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-green-100 text-sm">
                        © 2026 Blockchain Supply Chain Tracker. Empowering farmers, protecting consumers.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
