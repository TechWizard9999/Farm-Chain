'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ConsumerLayout from '@/components/consumer/ConsumerLayout';
import {
    ScanLine,
    Camera,
    Upload,
    CheckCircle2,
    XCircle,
    Leaf,
    MapPin,
    Calendar,
    Award,
    Share2,
    ChevronRight,
    Shield
} from 'lucide-react';

export default function ConsumerScan() {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    // Mock scan function
    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setScanResult({
                verified: true,
                batchId: 'BCH-001',
                product: 'Organic Tomatoes',
                farmer: 'Green Valley Farm',
                location: 'California, USA',
                harvestDate: '2026-01-15',
                quantity: '500 kg',
                certifications: ['USDA Organic', 'Non-GMO', 'Fair Trade'],
                blockchainId: '0x7a9f3c2d8b1e4f5a9c6d3e7b2a1f8c4e',
                journey: [
                    { stage: 'Farm', location: 'Green Valley Farm, CA', date: '2026-01-15', status: 'completed' },
                    { stage: 'Quality Check', location: 'Quality Assurance Center', date: '2026-01-16', status: 'completed' },
                    { stage: 'Processing', location: 'Processing Facility', date: '2026-01-17', status: 'completed' },
                    { stage: 'In Transit', location: 'Distribution Center', date: '2026-01-18', status: 'completed' },
                    { stage: 'Retail', location: 'Your Local Store', date: '2026-01-20', status: 'completed' }
                ]
            });
        }, 2000);
    };

    return (
        <ConsumerLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                        <ScanLine className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">QR Code Scanner</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                        Scan Product QR Code
                    </h1>
                    <p className="text-lg text-stone-600">
                        Instantly verify product authenticity and trace its journey
                    </p>
                </motion.div>

                {!scanResult ? (
                    <>
                        {/* Scanner Interface */}
                        <motion.div
                            className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {/* Camera Preview Area */}
                            <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 aspect-square max-w-md mx-auto flex items-center justify-center">
                                {isScanning ? (
                                    <motion.div
                                        className="text-white text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="w-20 h-20 border-4 border-white border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-lg font-semibold">Scanning...</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="relative"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {/* Scanner Frame */}
                                        <div className="relative w-64 h-64 border-4 border-white/30 rounded-3xl flex items-center justify-center">
                                            {/* Corner Decorations */}
                                            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl" />
                                            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl" />
                                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl" />
                                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl" />

                                            {/* Scanner Icon */}
                                            <ScanLine className="w-24 h-24 text-white/50" strokeWidth={1.5} />

                                            {/* Scanning Line Animation */}
                                            <motion.div
                                                className="absolute inset-x-0 h-1 bg-blue-500 shadow-lg shadow-blue-500"
                                                animate={{
                                                    y: [0, 240, 0],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-8 space-y-4">
                                <motion.button
                                    onClick={handleScan}
                                    disabled={isScanning}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    whileHover={!isScanning ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={!isScanning ? { scale: 0.98 } : {}}
                                >
                                    <Camera className="w-5 h-5" />
                                    {isScanning ? 'Scanning...' : 'Start Camera Scan'}
                                </motion.button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-stone-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-stone-500">or</span>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-stone-100 text-stone-600 rounded-xl font-semibold hover:bg-stone-200 transition-colors flex items-center justify-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    Upload QR Code Image
                                </button>
                            </div>
                        </motion.div>

                        {/* Info Cards */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                                <Shield className="w-8 h-8 text-blue-600 mb-3" />
                                <h3 className="font-bold text-stone-800 mb-1">100% Verified</h3>
                                <p className="text-sm text-stone-600">All products are blockchain-verified for authenticity</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                                <Leaf className="w-8 h-8 text-green-600 mb-3" />
                                <h3 className="font-bold text-stone-800 mb-1">Farm to Table</h3>
                                <p className="text-sm text-stone-600">Complete transparency in product journey</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                <Award className="w-8 h-8 text-purple-600 mb-3" />
                                <h3 className="font-bold text-stone-800 mb-1">Certifications</h3>
                                <p className="text-sm text-stone-600">View all organic and quality certifications</p>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Scan Result */
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Verification Badge */}
                        <motion.div
                            className={`rounded-3xl p-8 text-white text-center shadow-xl ${scanResult.verified
                                    ? 'bg-gradient-to-br from-green-600 to-emerald-600'
                                    : 'bg-gradient-to-br from-red-600 to-red-700'
                                }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            {scanResult.verified ? (
                                <>
                                    <CheckCircle2 className="w-20 h-20 mx-auto mb-4" strokeWidth={1.5} />
                                    <h2 className="text-3xl font-bold mb-2">Product Verified! ✓</h2>
                                    <p className="text-green-100">This product is authentic and blockchain-verified</p>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-20 h-20 mx-auto mb-4" strokeWidth={1.5} />
                                    <h2 className="text-3xl font-bold mb-2">Verification Failed</h2>
                                    <p className="text-red-100">This product could not be verified</p>
                                </>
                            )}
                        </motion.div>

                        {/* Product Details */}
                        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-stone-800 mb-1">
                                            {scanResult.product}
                                        </h3>
                                        <p className="text-stone-500">Batch ID: {scanResult.batchId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-stone-500 mb-1">Blockchain ID</p>
                                        <p className="text-xs font-mono text-stone-600">{scanResult.blockchainId.substring(0, 20)}...</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 bg-green-50 rounded-xl">
                                            <Leaf className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-stone-500">Farmer</p>
                                            <p className="font-semibold text-stone-800">{scanResult.farmer}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 bg-blue-50 rounded-xl">
                                            <MapPin className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-stone-500">Origin</p>
                                            <p className="font-semibold text-stone-800">{scanResult.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 bg-purple-50 rounded-xl">
                                            <Calendar className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-stone-500">Harvest Date</p>
                                            <p className="font-semibold text-stone-800">{scanResult.harvestDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 bg-amber-50 rounded-xl">
                                            <Award className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-stone-500">Quantity</p>
                                            <p className="font-semibold text-stone-800">{scanResult.quantity}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div className="mb-8">
                                    <h4 className="font-bold text-stone-800 mb-4">Certifications</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {scanResult.certifications.map((cert, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Journey Timeline */}
                                <div>
                                    <h4 className="font-bold text-stone-800 mb-6">Product Journey</h4>
                                    <div className="space-y-4">
                                        {scanResult.journey.map((step, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="relative">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.status === 'completed'
                                                            ? 'bg-green-500'
                                                            : 'bg-stone-200'
                                                        }`}>
                                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    {index < scanResult.journey.length - 1 && (
                                                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-stone-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-8">
                                                    <h5 className="font-bold text-stone-800">{step.stage}</h5>
                                                    <p className="text-sm text-stone-600">{step.location}</p>
                                                    <p className="text-xs text-stone-500 mt-1">{step.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-8">
                                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                        <Share2 className="w-5 h-5" />
                                        Share Journey
                                    </button>
                                    <button
                                        onClick={() => setScanResult(null)}
                                        className="px-6 py-3 bg-stone-100 text-stone-600 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
                                    >
                                        Scan Another
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </ConsumerLayout>
    );
}
