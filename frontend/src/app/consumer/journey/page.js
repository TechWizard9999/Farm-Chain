'use client';

import { motion } from 'framer-motion';
import ConsumerLayout from '@/components/consumer/ConsumerLayout';
import { Route, MapPin, Calendar, Leaf, CheckCircle2, ChevronRight } from 'lucide-react';

const journeyHistory = [
    {
        id: 'BCH-001',
        product: 'Organic Tomatoes',
        farmer: 'Green Valley Farm',
        location: 'California, USA',
        scannedDate: 'Jan 23, 2026',
        image: '🍅',
        stages: 5
    },
    {
        id: 'BCH-005',
        product: 'Fresh Lettuce',
        farmer: 'Sunny Acres Farm',
        location: 'Oregon, USA',
        scannedDate: 'Jan 22, 2026',
        image: '🥬',
        stages: 5
    },
    {
        id: 'BCH-009',
        product: 'Bell Peppers',
        farmer: 'Valley View Farm',
        location: 'Washington, USA',
        scannedDate: 'Jan 20, 2026',
        image: '🫑',
        stages: 4
    },
    {
        id: 'BCH-012',
        product: 'Cucumbers',
        farmer: 'Green Valley Farm',
        location: 'California, USA',
        scannedDate: 'Jan 18, 2026',
        image: '🥒',
        stages: 5
    },
];

export default function JourneyHistory() {
    return (
        <ConsumerLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                        <Route className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">Journey History</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                        Your Product Journeys
                    </h1>
                    <p className="text-lg text-stone-600">
                        View all the products you've scanned and their complete journey
                    </p>
                </motion.div>

                {/* Journey Cards */}
                <div className="grid gap-6">
                    {journeyHistory.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-start gap-6">
                                {/* Product Icon */}
                                <div className="text-6xl flex-shrink-0">
                                    {item.image}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-stone-800 mb-1">
                                                {item.product}
                                            </h3>
                                            <p className="text-sm text-stone-500">Batch ID: {item.id}</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-semibold text-green-700">Verified</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <Leaf className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="text-xs text-stone-500">Farmer</p>
                                                <p className="text-sm font-semibold text-stone-800">{item.farmer}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-xs text-stone-500">Origin</p>
                                                <p className="text-sm font-semibold text-stone-800">{item.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-stone-500">Scanned</p>
                                                <p className="text-sm font-semibold text-stone-800">{item.scannedDate}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Journey Preview */}
                                    <div className="bg-stone-50 rounded-xl p-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-stone-500 mb-2">Journey Stages Completed</p>
                                                <div className="flex items-center gap-2">
                                                    {Array.from({ length: item.stages }).map((_, idx) => (
                                                        <div key={idx} className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                            <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                                                View Full Journey
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </ConsumerLayout>
    );
}
