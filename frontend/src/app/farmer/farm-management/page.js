'use client';

import { motion } from 'framer-motion';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import { Sprout, MapPin, Calendar, TrendingUp, Edit, Plus } from 'lucide-react';

export default function FarmManagement() {
    return (
        <FarmerLayout>
            <div className="space-y-8">
                {/* Farm Details Card */}
                <motion.div
                    className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 rounded-2xl">
                                <Sprout className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-1">Green Valley Farm</h1>
                                <p className="text-green-100">Organic Farming Since 2015</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center gap-2">
                            <Edit className="w-5 h-5" />
                            Edit Details
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-6 h-6" />
                            <div>
                                <p className="text-green-100 text-sm">Location</p>
                                <p className="font-semibold">Green Valley, California</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6" />
                            <div>
                                <p className="text-green-100 text-sm">Farm Size</p>
                                <p className="font-semibold">50 Acres</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-6 h-6" />
                            <div>
                                <p className="text-green-100 text-sm">Total Production</p>
                                <p className="font-semibold">12,500 kg/month</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Crops Section */}
                <div className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-stone-800">Active Crops</h2>
                        <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Crop
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {['Tomatoes', 'Lettuce', 'Bell Peppers', 'Cucumbers', 'Carrots', 'Spinach'].map((crop, index) => (
                            <motion.div
                                key={index}
                                className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl mb-3">🌱</div>
                                <h3 className="text-lg font-bold text-stone-800 mb-2">{crop}</h3>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-stone-600">Season: Active</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-xs">
                                        Growing
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </FarmerLayout>
    );
}
