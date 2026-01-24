'use client';

import { motion } from 'framer-motion';
import { Sprout, Factory, Truck, Store, ScanLine, ChevronRight } from 'lucide-react';

const flowSteps = [
    {
        icon: Sprout,
        title: 'Farmer',
        description: 'Creates batch & records harvest',
        color: 'from-green-400 to-green-600'
    },
    {
        icon: Factory,
        title: 'Processing',
        description: 'Manufacturing & packaging',
        color: 'from-amber-400 to-amber-600'
    },
    {
        icon: Truck,
        title: 'Logistics',
        description: 'Transportation & tracking',
        color: 'from-blue-400 to-blue-600'
    },
    {
        icon: Store,
        title: 'Retail',
        description: 'Store distribution',
        color: 'from-purple-400 to-purple-600'
    },
    {
        icon: ScanLine,
        title: 'Consumer',
        description: 'Scan & verify authenticity',
        color: 'from-green-500 to-emerald-600'
    }
];

export default function FlowVisualization() {
    return (
        <section className="py-20 px-4 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Title */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Every step of your food's journey, securely recorded on the blockchain
                    </p>
                </motion.div>

                {/* Flow Steps */}
                <div className="relative">
                    {/* Desktop View */}
                    <div className="hidden md:flex items-center justify-between">
                        {flowSteps.map((step, index) => (
                            <div key={index} className="flex items-center">
                                <motion.div
                                    className="flex flex-col items-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15, duration: 0.6 }}
                                >
                                    {/* Icon Circle */}
                                    <motion.div
                                        className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <step.icon className="w-12 h-12 text-white" strokeWidth={2} />
                                    </motion.div>

                                    {/* Title & Description */}
                                    <h3 className="text-lg font-bold text-stone-800 mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-stone-600 text-center max-w-[140px]">
                                        {step.description}
                                    </p>
                                </motion.div>

                                {/* Arrow between steps */}
                                {index < flowSteps.length - 1 && (
                                    <motion.div
                                        className="mx-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                                    >
                                        <ChevronRight className="w-8 h-8 text-green-500" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-8">
                        {flowSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-4"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                {/* Icon Circle */}
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                    <step.icon className="w-8 h-8 text-white" strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-stone-800 mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-stone-600">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Blockchain Badge */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-green-700">
                            Secured by Blockchain Technology
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
