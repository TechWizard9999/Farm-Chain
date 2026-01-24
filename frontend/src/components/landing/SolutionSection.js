'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Zap, CheckCircle2 } from 'lucide-react';

const solutions = [
    {
        icon: Shield,
        title: 'Blockchain Security',
        description: 'Immutable records ensure data cannot be tampered with or falsified',
    },
    {
        icon: Eye,
        title: 'Full Transparency',
        description: 'Every step of the supply chain is visible and verifiable',
    },
    {
        icon: Lock,
        title: 'Authentic Verification',
        description: 'QR codes and blockchain verification prevent counterfeiting',
    },
    {
        icon: Zap,
        title: 'Real-time Tracking',
        description: 'Instant updates as products move through the supply chain',
    },
];

export default function SolutionSection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-green-300 rounded-full opacity-10 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full opacity-10 blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">The Solution</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
                        Blockchain-Powered Traceability
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Leveraging blockchain technology to create a transparent, secure, and trustworthy food supply chain
                    </p>
                </motion.div>

                {/* Solutions Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {solutions.map((solution, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-green-100 group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                        >
                            <motion.div
                                className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                            >
                                <solution.icon className="w-7 h-7 text-white" strokeWidth={2} />
                            </motion.div>
                            <h3 className="text-lg font-bold text-stone-800 mb-2">
                                {solution.title}
                            </h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                {solution.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* How Blockchain Helps */}
                <motion.div
                    className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-4">
                                How Blockchain Ensures Trust
                            </h3>
                            <p className="text-green-100 text-lg mb-6 leading-relaxed">
                                Every transaction is recorded in an immutable ledger, creating a permanent and transparent history that anyone can verify but no one can alter.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Decentralized & tamper-proof records',
                                    'Smart contracts automate verification',
                                    'Cryptographic security ensures authenticity',
                                    'Instant access to product history'
                                ].map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-green-50">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Visual Representation */}
                        <div className="relative">
                            <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                        <Lock className="w-10 h-10 text-green-600" strokeWidth={2} />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1">256-bit</div>
                                        <div className="text-green-100 text-sm">Encryption Security</div>
                                    </div>
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-white rounded-full"
                                            initial={{ width: "0%" }}
                                            whileInView={{ width: "100%" }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.8, duration: 1.5 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
