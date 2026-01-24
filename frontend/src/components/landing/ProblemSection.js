'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ShieldX, TrendingDown, Link2Off } from 'lucide-react';

const problems = [
    {
        icon: ShieldX,
        title: 'Fake Products',
        description: 'Counterfeit and adulterated food products harm consumer health and trust',
        color: 'text-red-600'
    },
    {
        icon: Link2Off,
        title: 'Broken Supply Chain',
        description: 'No visibility into product journey creates gaps and opportunities for fraud',
        color: 'text-orange-600'
    },
    {
        icon: TrendingDown,
        title: 'Farmer Exploitation',
        description: 'Farmers receive unfair prices due to lack of direct market access',
        color: 'text-amber-600'
    },
    {
        icon: AlertTriangle,
        title: 'Zero Transparency',
        description: 'Consumers have no way to verify product origin and authenticity',
        color: 'text-yellow-600'
    }
];

export default function ProblemSection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-br from-stone-50 to-red-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full opacity-10 blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-semibold text-red-700">The Problem</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
                        Current Food Supply Challenges
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        The traditional food supply chain lacks transparency, leading to serious issues
                    </p>
                </motion.div>

                {/* Problems Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-stone-100"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 bg-red-50 rounded-xl ${problem.color}`}>
                                    <problem.icon className="w-8 h-8" strokeWidth={2} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-stone-800 mb-2">
                                        {problem.title}
                                    </h3>
                                    <p className="text-stone-600 leading-relaxed">
                                        {problem.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Impact Stats */}
                <motion.div
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {[
                        { value: '70%', label: 'Lack Supply Chain Visibility' },
                        { value: '40%', label: 'Food Fraud Cases Annually' },
                        { value: '30%', label: 'Price Gap for Farmers' },
                        { value: '0', label: 'Consumer Trust' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center p-6 bg-white rounded-xl shadow-md"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="text-3xl font-bold text-red-600 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-stone-600">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
