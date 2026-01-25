"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FarmerLayout from "@/components/farmer/FarmerLayout";
import { graphqlRequest } from "@/lib/apollo-client";
import { MY_PRODUCTS_QUERY } from "@/lib/graphql/product";
import { MY_AUCTIONS_QUERY, CREATE_AUCTION_MUTATION } from "@/lib/graphql/auction";
import { 
    Gavel, 
    Plus, 
    Clock, 
    X, 
    Loader2,
    Calendar,
    Search,
    CheckCircle2,
    TrendingUp,
    Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuctionsPage() {
    const [auctions, setAuctions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateAuction, setShowCreateAuction] = useState(false);
    
    // Create Auction State
    const [searchQuery, setSearchQuery] = useState("");
    const [auctionDurationType, setAuctionDurationType] = useState("1h");
    const [auctionDateTime, setAuctionDateTime] = useState("");

    // Helper to get formatted datetime for X hours from now
    const getDateTimeForHours = (hours) => {
        const d = new Date();
        d.setHours(d.getHours() + hours);
        return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    };

    // Initialize default auction time when modal opens
    const openCreateAuctionModal = () => {
        setAuctionDateTime(getDateTimeForHours(1));
        setAuctionDurationType("1h");
        setShowCreateAuction(true);
    };

    // Form States
    const [auctionForm, setAuctionForm] = useState({
        productId: "",
        minPricePerKg: "",
        quantity: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [auctionsData, productsData] = await Promise.all([
                graphqlRequest(MY_AUCTIONS_QUERY),
                graphqlRequest(MY_PRODUCTS_QUERY)
            ]);

            setAuctions(auctionsData.myAuctions || []);
            setProducts(productsData.myProducts || []);
            
        } catch (error) {
            console.error("Error fetching auction data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAuction = async (e) => {
        e.preventDefault();
        try {
            const now = new Date();
            const selectedDate = new Date(auctionDateTime);
            
            if (selectedDate <= now) {
                alert("Auction must end in the future");
                return;
            }

            // Find selected product to get batch ID
            const selectedProduct = products.find(p => p.id === auctionForm.productId);
            if (!selectedProduct) {
                alert("Please select a valid product");
                return;
            }

            if (!selectedProduct.batch) {
                alert("This product is missing batch/traceability data. Cannot create an auction for untracked products.");
                return;
            }

            await graphqlRequest(CREATE_AUCTION_MUTATION, {
                productId: auctionForm.productId,
                batchId: selectedProduct.batch.id, 
                minPricePerKg: parseFloat(auctionForm.minPricePerKg),
                quantity: parseFloat(auctionForm.quantity),
                deadline: selectedDate.toISOString()
            });
            setShowCreateAuction(false);
            setAuctionForm({ productId: "", minPricePerKg: "", quantity: "" });
            setAuctionDateTime("");
            fetchData();
            alert("Auction created successfully!");
        } catch (error) {
            console.error("Error creating auction:", error);
            alert("Failed to create auction: " + error.message);
        }
    };

    const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'open': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-gray-100 text-gray-700';
            case 'awarded': return 'bg-blue-100 text-blue-700';
            case 'expired': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return (
            <FarmerLayout>
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            </FarmerLayout>
        );
    }

    return (
        <FarmerLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Auctions</h1>
                        <p className="text-slate-500 mt-1">Create and manage your product auctions</p>
                    </div>
                    <button 
                        onClick={openCreateAuctionModal}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 font-bold shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Auction
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Gavel className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {auctions.filter(a => a.status === 'open').length}
                                </p>
                                <p className="text-slate-500 text-sm">Active Auctions</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    ${auctions.reduce((sum, a) => sum + (a.highestBid || 0), 0).toFixed(2)}
                                </p>
                                <p className="text-slate-500 text-sm">Total Highest Bids</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {auctions.filter(a => a.status === 'awarded').length}
                                </p>
                                <p className="text-slate-500 text-sm">Completed Auctions</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auctions Grid */}
                {auctions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Gavel className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No Auctions Yet</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Create your first auction to start selling your products to the highest bidder.
                        </p>
                        <button 
                            onClick={openCreateAuctionModal}
                            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
                        >
                            Create Your First Auction
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auctions.map((auction) => (
                            <motion.div 
                                key={auction.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-100 group"
                            >
                                <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-700 p-6 relative">
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(auction.status)}`}>
                                        {auction.status.toUpperCase()}
                                    </div>
                                    <div className="text-white mt-8">
                                        <h3 className="font-bold text-2xl truncate">{auction.product?.title || 'Unknown Product'}</h3>
                                        <p className="text-emerald-100 text-sm">Qty: {auction.quantity} kg</p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Highest Bid</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`text-3xl font-black ${auction.highestBid > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                                                    {auction.highestBid > 0 ? `$${auction.highestBid}` : "No Bids"}
                                                </span>
                                                {auction.highestBid > 0 && <span className="text-emerald-500 font-medium text-sm">/kg</span>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Ends</p>
                                            <span className="text-orange-600 font-bold flex items-center justify-end gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(auction.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-slate-500 text-xs mb-1">Min Price</p>
                                            <p className="font-bold text-slate-700">${auction.minPricePerKg}/kg</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs mb-1">Total Value</p>
                                            <p className="font-bold text-slate-700">
                                                ${((auction.highestBid || auction.minPricePerKg) * auction.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Create Auction Modal */}
                <AnimatePresence>
                    {showCreateAuction && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Start New Auction</h2>
                                    <button onClick={() => setShowCreateAuction(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleCreateAuction} className="space-y-8">
                                    
                                    {/* 1. Product Selection */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-bold text-slate-700">1. Select Product to Sell</label>
                                            <div className="relative w-1/2">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input 
                                                    type="text"
                                                    placeholder="Search your inventory..."
                                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                                            {filteredProducts.map(p => {
                                                const isSelected = auctionForm.productId === p.id;
                                                return (
                                                    <div 
                                                        key={p.id}
                                                        onClick={() => setAuctionForm({...auctionForm, productId: p.id})}
                                                        className={`cursor-pointer rounded-xl p-3 border-2 transition-all ${
                                                            isSelected 
                                                                ? "border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500" 
                                                                : "border-slate-100 bg-white hover:border-emerald-200 hover:shadow-sm"
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                                isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                                                            }`}>
                                                                {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                                {p.availableQty}kg
                                                            </span>
                                                        </div>
                                                        <p className="font-bold text-slate-800 text-sm truncate">{p.title}</p>
                                                        <p className="text-xs text-slate-500 truncate">Batch: {p.batch?.id?.substring(0,6) || 'N/A'}</p>
                                                    </div>
                                                );
                                            })}
                                            {filteredProducts.length === 0 && (
                                                <div className="col-span-full py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                    <p className="text-sm mb-3">No products found matching "{searchQuery}"</p>
                                                    <Link href="/farmer/products" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
                                                        <Plus className="w-3 h-3" />
                                                        Add New Product
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400">Select a product card above. Only products with available quantity are shown.</p>
                                    </div>
                                    
                                    {/* 2. Price & Quantity */}
                                    <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Min Bid Price ($/kg)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-slate-500 font-bold">$</span>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    step="0.01"
                                                    className="w-full pl-8 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                                    value={auctionForm.minPricePerKg}
                                                    onChange={(e) => setAuctionForm({...auctionForm, minPricePerKg: e.target.value})}
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Auction Quantity (kg)</label>
                                            <input 
                                                type="number" 
                                                className="w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                                value={auctionForm.quantity}
                                                onChange={(e) => setAuctionForm({...auctionForm, quantity: e.target.value})}
                                                placeholder="Amount to sell"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Time Selection */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">3. Auction Duration</label>
                                        
                                        <div className="grid grid-cols-4 gap-3 mb-4">
                                            {[
                                                { label: '+1 Hour', val: 1 },
                                                { label: '+6 Hours', val: 6 },
                                                { label: '+24 Hours', val: 24 },
                                                { label: 'Custom', val: 0 }
                                            ].map((opt) => (
                                                <button
                                                    type="button"
                                                    key={opt.label}
                                                    onClick={() => {
                                                        if (opt.val > 0) {
                                                            setAuctionDateTime(getDateTimeForHours(opt.val));
                                                            setAuctionDurationType(`${opt.val}h`);
                                                        } else {
                                                            // For custom, keep current value or set 1 hour default
                                                            if (!auctionDateTime) {
                                                                setAuctionDateTime(getDateTimeForHours(1));
                                                            }
                                                            setAuctionDurationType('custom');
                                                        }
                                                    }}
                                                    className={`py-2 px-3 rounded-lg text-sm font-bold border transition-all ${
                                                        (opt.val > 0 && auctionDurationType === `${opt.val}h`) || (opt.val === 0 && auctionDurationType === 'custom')
                                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input 
                                                type="datetime-local"
                                                className={`w-full pl-10 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 ${
                                                    auctionDurationType !== 'custom' ? 'bg-slate-50 text-slate-500' : 'bg-white'
                                                }`}
                                                value={auctionDateTime}
                                                onChange={(e) => {
                                                    setAuctionDateTime(e.target.value);
                                                    setAuctionDurationType('custom');
                                                }}
                                                min={new Date().toISOString().slice(0, 16)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={!auctionForm.productId}
                                        className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Gavel className="w-5 h-5" />
                                        Launch Auction
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
