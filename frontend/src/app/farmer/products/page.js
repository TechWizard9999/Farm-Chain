'use client';

import FarmerLayout from '@/components/farmer/FarmerLayout';
import { ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Products() {
    return (
        <FarmerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                        <p className="text-slate-500">Manage your farm's product catalog</p>
                    </div>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all">
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No Products Yet</h2>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start by adding your first product to begin tracking batches on the blockchain.</p>
                    <button className="px-6 py-3 border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-600 font-bold rounded-xl transition-all">
                        Import from Catalog
                    </button>
                </motion.div>
            </div>
        </FarmerLayout>
    );
}
