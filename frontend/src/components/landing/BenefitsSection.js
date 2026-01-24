'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, Heart, Award, Handshake, Globe } from 'lucide-react';

const benefits = [
    {
        icon: Users,
        title: 'Farmer Empowerment',
        description: 'Direct market access and fair pricing for farmers',
        gradient: 'from-green-500 to-emerald-600'
    },
    {
        icon: Heart,
        title: 'Consumer Trust',
        description: 'Verified authenticity builds confidence in purchases',
        gradient: 'from-blue-500 to-cyan-600'
    },
    {
        icon: TrendingUp,
        title: 'Increased Revenue',
        description: 'Better margins through supply chain transparency',
        gradient: 'from-purple-500 to-pink-600'
    },
    {
        icon: Award,
        title: 'Quality Assurance',
        description: 'Certified organic and quality standards verified',
        gradient: 'from-amber-500 to-orange-600'
    },
    {
        icon: Handshake,
        title: 'Stakeholder Collaboration',
        description: 'Seamless coordination across the supply chain',
        gradient: 'from-rose-500 to-red-600'
    },
    {
        icon: Globe,
        title: 'Sustainability',
        description: 'Eco-friendly practices tracked and rewarded',
        gradient: 'from-teal-500 to-green-600'
    }
];

export default function BenefitsSection() {
    return (
        <section className="py-20 px-4 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #16a34a 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Key Benefits</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
                        Everyone Wins
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Our platform creates value for every stakeholder in the food supply chain
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            className="group relative"
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            {/* Card */}
                            <div className="relative bg-gradient-to-br from-white to-stone-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-stone-100 overflow-hidden group-hover:-translate-y-2 duration-300">
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                {/* Icon */}
                                <motion.div
                                    className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                                    whileHover={{ rotate: 12, scale: 1.15 }}
                                >
                                    <benefit.icon className="w-8 h-8 text-white" strokeWidth={2} />
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-green-700 transition-colors">
                                    {benefit.title}
                                </h3>
                                <p className="text-stone-600 leading-relaxed">
                                    {benefit.description}
                                </p>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                                    <div className={`w-full h-full bg-gradient-to-br ${benefit.gradient} transform rotate-45 translate-x-10 -translate-y-10`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call-out Box */}
                <motion.div
                    className="mt-16 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 rounded-3xl p-1 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="bg-white rounded-3xl p-8 md:p-12">
                        <div className="text-center max-w-3xl mx-auto">
                            <motion.div
                                className="inline-block mb-6"
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="text-6xl">🌱</div>
                            </motion.div>
                            <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                                Building Trust from Farm to Plate
                            </h3>
                            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                                Join thousands of farmers and millions of consumers who trust blockchain technology to verify their food's journey.
                            </p>
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { value: '10K+', label: 'Farmers' },
                                    { value: '5M+', label: 'Products Tracked' },
                                    { value: '99.9%', label: 'Accuracy' }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        className="text-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                    >
                                        <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-stone-600">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
