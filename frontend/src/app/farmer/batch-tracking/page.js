'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import {
    Plus,
    Search,
    Filter,
    Package,
    CheckCircle2,
    Clock,
    Truck,
    MapPin,
    Calendar,
    Weight,
    Leaf,
    QrCode
} from 'lucide-react';

// Mock Data
const batches = [
    {
        id: 'BCH-001',
        product: 'Organic Tomatoes',
        quantity: '500 kg',
        status: 'In Transit',
        created: '2026-01-20',
        location: 'Green Valley Farm → Distribution Center',
        blockchainId: '0x7a9f3c...',
        stages: ['Farm', 'Quality Check', 'Processing', 'In Transit']
    },
    {
        id: 'BCH-002',
        product: 'Fresh Lettuce',
        quantity: '300 kg',
        status: 'Delivered',
        created: '2026-01-19',
        location: 'Retail Store',
        blockchainId: '0x8b2e4d...',
        stages: ['Farm', 'Quality Check', 'Processing', 'In Transit', 'Delivered']
    },
    {
        id: 'BCH-003',
        product: 'Bell Peppers',
        quantity: '400 kg',
        status: 'Processing',
        created: '2026-01-18',
        location: 'Processing Facility',
        blockchainId: '0x9c3f5e...',
        stages: ['Farm', 'Quality Check', 'Processing']
    },
];

export default function BatchTracking() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-700';
            case 'In Transit':
                return 'bg-blue-100 text-blue-700';
            case 'Processing':
                return 'bg-amber-100 text-amber-700';
            default:
                return 'bg-stone-100 text-stone-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return CheckCircle2;
            case 'In Transit':
                return Truck;
            case 'Processing':
                return Clock;
            default:
                return Package;
        }
    };

    return (
        <FarmerLayout>
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 mb-1">Batch Tracking</h1>
                        <p className="text-stone-600">Create and monitor your product batches on blockchain</p>
                    </div>
                    <motion.button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-5 h-5" />
                        Create New Batch
                    </motion.button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search batches by ID or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                        />
                    </div>
                    <button className="px-6 py-3 bg-white border-2 border-stone-200 rounded-xl font-semibold hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filter
                    </button>
                </div>

                {/* Batches Grid */}
                <div className="grid gap-6">
                    {batches.map((batch, index) => {
                        const StatusIcon = getStatusIcon(batch.status);
                        return (
                            <motion.div
                                key={batch.id}
                                className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                onClick={() => setSelectedBatch(batch)}
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-green-50 rounded-xl">
                                                <Package className="w-8 h-8 text-green-600" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-stone-800 mb-1">{batch.product}</h3>
                                                <p className="text-sm text-stone-500">Batch ID: {batch.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${getStatusColor(batch.status)}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {batch.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        <div className="flex items-start gap-3">
                                            <Weight className="w-5 h-5 text-stone-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-stone-500">Quantity</p>
                                                <p className="text-sm font-semibold text-stone-800">{batch.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-stone-500">Created</p>
                                                <p className="text-sm font-semibold text-stone-800">{batch.created}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-stone-500">Current Location</p>
                                                <p className="text-sm font-semibold text-stone-800">{batch.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <QrCode className="w-5 h-5 text-stone-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-stone-500">Blockchain ID</p>
                                                <p className="text-sm font-semibold text-stone-800 font-mono">{batch.blockchainId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Timeline */}
                                    <div className="border-t border-stone-100 pt-6">
                                        <p className="text-xs text-stone-500 mb-4 font-semibold uppercase tracking-wider">Journey Progress</p>
                                        <div className="flex items-center justify-between">
                                            {['Farm', 'Quality Check', 'Processing', 'In Transit', 'Delivered'].map((stage, idx) => {
                                                const isCompleted = batch.stages.includes(stage);
                                                const isCurrent = batch.stages[batch.stages.length - 1] === stage;
                                                return (
                                                    <div key={idx} className="flex items-center flex-1">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCompleted
                                                                    ? 'bg-green-500 border-green-500'
                                                                    : 'bg-stone-100 border-stone-300'
                                                                } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                                                                {isCompleted ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                                                ) : (
                                                                    <div className="w-2 h-2 bg-stone-400 rounded-full" />
                                                                )}
                                                            </div>
                                                            <p className={`text-xs mt-2 text-center ${isCompleted ? 'text-green-600 font-semibold' : 'text-stone-500'
                                                                }`}>
                                                                {stage}
                                                            </p>
                                                        </div>
                                                        {idx < 4 && (
                                                            <div className={`flex-1 h-0.5 ${batch.stages.includes(['Farm', 'Quality Check', 'Processing', 'In Transit', 'Delivered'][idx + 1])
                                                                    ? 'bg-green-500'
                                                                    : 'bg-stone-200'
                                                                }`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-6">
                                        <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-100 transition-colors text-sm">
                                            View Details
                                        </button>
                                        <button className="px-4 py-2 bg-stone-50 text-stone-600 rounded-lg font-semibold hover:bg-stone-100 transition-colors text-sm">
                                            Download QR
                                        </button>
                                        <button className="px-4 py-2 bg-stone-50 text-stone-600 rounded-lg font-semibold hover:bg-stone-100 transition-colors text-sm">
                                            View on Blockchain
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Create Batch Modal (Placeholder) */}
                {showCreateModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-stone-800 mb-6">Create New Batch</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                                        placeholder="e.g., Organic Tomatoes"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                                            Quantity
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                                            placeholder="e.g., 500 kg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                                            Harvest Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-6 py-3 bg-stone-100 text-stone-600 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                                        Create Batch
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </FarmerLayout>
    );
}
