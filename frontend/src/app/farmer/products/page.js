'use client';

import { useState, useEffect } from "react";
import FarmerLayout from '@/components/farmer/FarmerLayout';
import { ShoppingCart, Plus, Loader2, X, Leaf, Package, DollarSign, Tag, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { graphqlRequest } from "@/lib/apollo-client";
import { MY_PRODUCTS_QUERY, CREATE_PRODUCT_MUTATION } from "@/lib/graphql/product";
import { MY_FARMS_QUERY } from "@/lib/graphql/farm";
import { LIST_BATCHES_SIMPLE_QUERY } from "@/lib/graphql/batch";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [farmId, setFarmId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        batchId: "",
        category: "Vegetables",
        pricePerKg: "",
        availableQty: "",
        description: "",
        isOrganic: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        console.log("Fetching products and batches...");
        try {
            // 1. Fetch Products
            const productsData = await graphqlRequest(MY_PRODUCTS_QUERY);
            setProducts(productsData.myProducts || []);

            // 2. Fetch Farm to get Batches
            try {
                const farmsData = await graphqlRequest(MY_FARMS_QUERY);
                
                if (farmsData.myFarms && farmsData.myFarms.length > 0) {
                    console.log(`Found ${farmsData.myFarms.length} farms. Fetching batches for each...`);
                    
                    // Fetch batches from ALL farms in parallel
                    const batchPromises = farmsData.myFarms.map(async (farm) => {
                        try {
                            const batchesData = await graphqlRequest(LIST_BATCHES_SIMPLE_QUERY, { farm: farm.id });
                            return batchesData.listBatches || [];
                        } catch (err) {
                            console.error(`Error fetching batches for farm ${farm.id}:`, err);
                            return [];
                        }
                    });

                    const results = await Promise.all(batchPromises);
                    const allBatches = results.flat();
                    console.log(`Total batches found: ${allBatches.length}`);
                    setBatches(allBatches);
                } else {
                    console.warn("No farms found for this user.");
                    setBatches([]);
                }
            } catch (farmError) {
                console.error("Error fetching farms:", farmError);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await graphqlRequest(CREATE_PRODUCT_MUTATION, {
                title: form.title,
                batchId: form.batchId,
                category: form.category,
                pricePerKg: parseFloat(form.pricePerKg),
                availableQty: parseFloat(form.availableQty),
                description: form.description,
                isOrganic: form.isOrganic
            });
            setShowAddModal(false);
            setForm({
                title: "",
                batchId: "",
                category: "Vegetables",
                pricePerKg: "",
                availableQty: "",
                description: "",
                isOrganic: true
            });
            fetchData(); // Refresh list
            alert("Product added successfully!");
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Failed to create product: " + error.message);
        }
    };

    // Auto-fill title from batch if selected
    useEffect(() => {
        if (form.batchId) {
            const batch = batches.find(b => b.id === form.batchId);
            if (batch && !form.title) {
                setForm(prev => ({ ...prev, title: batch.cropName + (batch.variety ? ` - ${batch.variety}` : "") }));
            }
        }
    }, [form.batchId, batches]);

    const categories = ["Vegetables", "Fruits", "Grains", "Spices", "Dairy", "Other"];

    // Helper to check if batch is ready for product creation
    const isBatchReady = (batch) => {
        const readyStates = ['harvest', 'packed', 'shipped']; 
        // Note: checking lowercase because backend schema uses lowercase "harvest", but enum definitions use Uppercase?
        // Backend Schema: currentState: { type: String, enum: ["idle", ..., "harvest", ...], default: "idle" }
        // Let's support both just in case.
        const state = (batch.currentState || "").toLowerCase();
        return readyStates.includes(state);
    };

    return (
        <FarmerLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Product Inventory</h1>
                        <p className="text-slate-500 mt-1">Manage your harvest and set prices for the marketplace</p>
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Product
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No Products Yet</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Start by converting your harvested batches into sellable products.
                        </p>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-600 font-bold rounded-xl transition-all"
                        >
                            Add Your First Product
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <motion.div 
                                key={product.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {product.category}
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${product.availableQty > 0 ? "bg-green-500" : "bg-red-500"}`} />
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{product.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                                    <Leaf className="w-3 h-3" />
                                    {product.batch?.cropName || "Unknown Crop"} Batch
                                </p>

                                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl mb-4">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Available</p>
                                        <p className="font-bold text-slate-700">{product.availableQty} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Price</p>
                                        <p className="font-bold text-slate-700">${product.pricePerKg}/kg</p>
                                    </div>
                                </div>

                                <button className="w-full py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                    Manage Stock
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Add Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-[90vh]"
                            >
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
                                    <button onClick={fetchData} title="Refresh Data" className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-all">
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-6">
                                    {/* Batch Selection */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">1. Select Source Batch</label>
                                        {batches.length > 0 ? (
                                            <div className="space-y-2">
                                                <select
                                                    required
                                                    className="w-full rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 py-3"
                                                    value={form.batchId}
                                                    onChange={(e) => setForm({...form, batchId: e.target.value})}
                                                >
                                                    <option value="">-- Choose a Harvested Batch --</option>
                                                    {batches.map(b => {
                                                        const ready = isBatchReady(b);
                                                        return (
                                                            <option key={b.id} value={b.id} disabled={!ready}>
                                                                {b.cropName} ({b.variety || 'Standard'}) 
                                                                {ready ? ` - Harvested` : ` - ${b.currentState} (Not Ready)`}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                {!batches.some(isBatchReady) && (
                                                    <p className="text-xs text-orange-600 font-medium">
                                                        Note: Only harvested batches can be used to create products. You have {batches.length} active batches in progress.
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl text-sm border border-orange-100 flex flex-col gap-2">
                                                <p className="font-bold">No batches found!</p>
                                                <p>You need to create and harvest a batch in Farm Management first.</p>
                                                <a href="/farmer/batch-tracking" className="text-emerald-600 underline hover:text-emerald-700 font-bold">
                                                    Go to Batch Tracking
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Product Title</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Organic Red Onions"
                                            className="w-full rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={form.title}
                                            onChange={(e) => setForm({...form, title: e.target.value})}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                            <select
                                                className="w-full rounded-xl border-slate-200"
                                                value={form.category}
                                                onChange={(e) => setForm({...form, category: e.target.value})}
                                            >
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Organic?</label>
                                            <div className="flex items-center h-10">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                                                    checked={form.isOrganic}
                                                    onChange={(e) => setForm({...form, isOrganic: e.target.checked})}
                                                />
                                                <span className="ml-2 text-slate-600">Yes, Organic</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Quantity (kg)</label>
                                            <div className="relative">
                                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="number"
                                                    required
                                                    className="w-full pl-9 rounded-xl border-slate-200"
                                                    value={form.availableQty}
                                                    onChange={(e) => setForm({...form, availableQty: e.target.value})}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Price ($/kg)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="number"
                                                    required
                                                    step="0.01"
                                                    className="w-full pl-9 rounded-xl border-slate-200"
                                                    value={form.pricePerKg}
                                                    onChange={(e) => setForm({...form, pricePerKg: e.target.value})}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={!form.batchId}
                                        className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                                    >
                                        Add Product to Inventory
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </FarmerLayout>
    );
}
