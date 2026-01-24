'use client';

import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-40 h-40 bg-green-300 rounded-full opacity-20 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -30, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/3 w-36 h-36 bg-yellow-200 rounded-full opacity-15 blur-3xl"
                    animate={{
                        scale: [1, 1.4, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-6xl mx-auto text-center">
                {/* Logo/Icon */}
                <motion.div
                    className="flex justify-center mb-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        duration: 0.8
                    }}
                >
                    <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-3xl shadow-2xl">
                        <Leaf className="w-16 h-16 text-white" strokeWidth={2} />
                    </div>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Track Food from Farm to Plate
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    className="text-xl md:text-2xl text-stone-600 mb-4 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Using Blockchain Technology
                </motion.p>

                <motion.p
                    className="text-base md:text-lg text-stone-500 mb-12 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                >
                    Transparent, tamper-proof tracking of food products ensuring authenticity,
                    preventing counterfeiting, and building trust between farmers and consumers.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                >
                    <Link href="/auth/login?role=farmer">
                        <motion.button
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full font-semibold text-lg shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Leaf className="w-5 h-5" />
                            Login as Farmer
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>

                    <Link href="/auth/login?role=consumer">
                        <motion.button
                            className="px-8 py-4 bg-white border-2 border-green-600 text-green-600 rounded-full font-semibold text-lg shadow-md flex items-center gap-2 hover:bg-green-50 transition-all"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Explore as Consumer
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{
                        opacity: { delay: 1.2, duration: 0.5 },
                        y: { delay: 1.2, duration: 2, repeat: Infinity }
                    }}
                >
                    <div className="w-6 h-10 border-2 border-green-600 rounded-full flex justify-center pt-2">
                        <div className="w-1.5 h-2 bg-green-600 rounded-full" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
