"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FarmerLayout from "@/components/farmer/FarmerLayout";
import { graphqlRequest } from "@/lib/apollo-client";
import { MY_PRODUCTS_QUERY } from "@/lib/graphql/product";
import { MY_AUCTIONS_QUERY, CREATE_AUCTION_MUTATION, CLOSE_AUCTION_MUTATION } from "@/lib/graphql/auction";
import { PRODUCT_REQUESTS_QUERY, OFFER_ON_REQUEST_MUTATION, MY_OFFERS_QUERY } from "@/lib/graphql/productRequest";
import { startTransition } from "react";
import { 
    Gavel, 
    ShoppingBag, 
    Plus, 
    Clock, 
    DollarSign, 
    CheckCircle2, 
    X, 
    Loader2,
    Calendar,
    Search,
    History,
    Check,
    XCircle,
    Package,
    StopCircle,
    AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BusinessPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("auctions");
    const [auctions, setAuctions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [myOffers, setMyOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateAuction, setShowCreateAuction] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [endingAuction, setEndingAuction] = useState(null);
    
    // Create Auction State
    const [searchQuery, setSearchQuery] = useState("");
    const [auctionDurationType, setAuctionDurationType] = useState("1h"); // '1h', '6h', '24h', 'custom'
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

    const [offerForm, setOfferForm] = useState({
        pricePerKg: "",
        message: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [auctionsData, requestsData, productsData, myOffersData] = await Promise.all([
                graphqlRequest(MY_AUCTIONS_QUERY),
                graphqlRequest(PRODUCT_REQUESTS_QUERY),
                graphqlRequest(MY_PRODUCTS_QUERY),
                graphqlRequest(MY_OFFERS_QUERY)
            ]);

            setAuctions(auctionsData.myAuctions || []);
            setRequests(requestsData.getProductRequests || []);
            setProducts(productsData.myProducts || []);
            setMyOffers(myOffersData.getMyOffers || []);
            
        } catch (error) {
            console.error("Error fetching business data:", error);
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
            fetchData(); // Refresh
        } catch (error) {
            console.error("Error creating auction:", error);
            alert("Failed to create auction");
        }
    };

    const handleMakeOffer = async (e) => {
        e.preventDefault();
        try {
            await graphqlRequest(OFFER_ON_REQUEST_MUTATION, {
                input: {
                    requestId: selectedRequest.id,
                    pricePerKg: parseFloat(offerForm.pricePerKg),
                    message: offerForm.message
                }
            });
            setShowOfferModal(false);
            fetchData(); // Refresh
        } catch (error) {
            console.error("Error making offer:", error);
            alert("Failed to make offer: " + error.message);
        }
    };

    const handleEndAuction = async (auctionId) => {
        if (!confirm("Are you sure you want to end this auction? The highest bidder (if any) will win.")) {
            return;
        }
        setEndingAuction(auctionId);
        try {
            await graphqlRequest(CLOSE_AUCTION_MUTATION, { auctionId });
            fetchData(); // Refresh
        } catch (error) {
            console.error("Error ending auction:", error);
            alert("Failed to end auction: " + error.message);
        } finally {
            setEndingAuction(null);
        }
    };

    // Format deadline safely
    const formatDeadline = (deadline) => {
        if (!deadline) return "No deadline";
        const date = new Date(deadline);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Check if auction has expired
    const isAuctionExpired = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    // Cancel the category logic, use search instead
    const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Separate active and closed auctions
    const activeAuctions = auctions.filter(a => a.status === 'open');
    const closedAuctions = auctions.filter(a => a.status !== 'open');

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
    );

    return (
        <FarmerLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Business Hub</h1>
                        <p className="text-slate-500 mt-1">Manage auctions and consumer requests</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab("auctions")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "auctions"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-slate-600 hover:text-emerald-600"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Gavel className="w-4 h-4" />
                            Auctions
                            {activeAuctions.length > 0 && (
                                <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{activeAuctions.length}</span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "requests"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-slate-600 hover:text-emerald-600"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Requests
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("myoffers")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "myoffers"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-slate-600 hover:text-emerald-600"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            My Offers
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "history"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-slate-600 hover:text-emerald-600"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4" />
                            History
                        </div>
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="space-y-6">
                        {activeTab === "auctions" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <p className="text-slate-500">Your active auctions where buyers can bid</p>
                                    <button 
                                        onClick={openCreateAuctionModal}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 font-medium shadow-md shadow-emerald-500/20"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Create Auction
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {activeAuctions.map((auction) => (
                                        <motion.div 
                                            key={auction.id} 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-100 group"
                                        >
                                            <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-700 p-6 relative">
                                                <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 flex items-center gap-1 ${isAuctionExpired(auction.deadline) ? 'bg-orange-500/80' : 'bg-white/20'}`}>
                                                    {isAuctionExpired(auction.deadline) ? (
                                                        <>
                                                            <AlertTriangle className="w-3 h-3" />
                                                            EXPIRED
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                                                            LIVE
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-white mt-8">
                                                    <h3 className="font-bold text-2xl truncate">{auction.product?.title || 'Product'}</h3>
                                                    <p className="text-emerald-100">{auction.product?.batch?.cropName || 'Product'}</p>
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
                                                        <span className={`font-bold flex items-center justify-end gap-1 ${isAuctionExpired(auction.deadline) ? 'text-red-600' : 'text-orange-600'}`}>
                                                            <Clock className="w-4 h-4" />
                                                            {formatDeadline(auction.deadline)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-slate-500 text-xs mb-1">Min Price</p>
                                                        <p className="font-bold text-slate-700">${auction.minPricePerKg}/kg</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs mb-1">Quantity</p>
                                                        <p className="font-bold text-slate-700">{auction.quantity} kg</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {activeAuctions.length === 0 && (
                                        <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                            <Gavel className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 mb-4">No active auctions</p>
                                            <button 
                                                onClick={openCreateAuctionModal}
                                                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                                            >
                                                Create Your First Auction
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "requests" && (
                            <div className="grid grid-cols-1 gap-6">
                                {requests.map((request) => {
                                    // Check if farmer already made an offer (we can't easily get farmer ID on client)
                                    // The backend prevents duplicate offers, so show the button anyway
                                    return (
                                        <div key={request.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-xl text-slate-900">{request.productName}</h3>
                                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                                        REQUEST
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 mb-4">{request.description}</p>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                                        <span className="text-slate-500 mr-2">Quantity:</span>
                                                        <span className="font-semibold">{request.quantity} kg</span>
                                                    </div>
                                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                                        <span className="text-slate-500 mr-2">Budget:</span>
                                                        <span className="font-semibold">${request.budgetPerKg}/kg</span>
                                                    </div>
                                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                                        <span className="text-slate-500 mr-2">Consumer:</span>
                                                        <span className="font-semibold">{request.consumer?.name || 'Unknown'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                                <div className="text-right text-sm text-slate-500">
                                                    {request.offers?.length || 0} offers so far
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setShowOfferModal(true);
                                                    }}
                                                    className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                                                >
                                                    Make Offer
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {requests.length === 0 && (
                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500">No active consumer requests</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "myoffers" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Offers You've Made
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {myOffers.map((request) => {
                                        // Find my offer in this request
                                        const myOffer = request.offers?.find(o => o.farmer?.id) || request.offers?.[0];
                                        const isAccepted = request.status === 'fulfilled' && 
                                            request.acceptedOffer?.farmer?.id === myOffer?.farmer?.id;
                                        const isRejected = myOffer?.status === 'rejected';
                                        const isPending = !isAccepted && !isRejected && request.status === 'open';
                                        
                                        return (
                                            <motion.div 
                                                key={request.id} 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`bg-white rounded-xl border p-5 ${
                                                    isAccepted ? 'border-green-300 bg-green-50/50' :
                                                    isRejected ? 'border-red-300 bg-red-50/30' :
                                                    'border-slate-200'
                                                }`}
                                            >
                                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-bold text-lg text-slate-900">{request.productName}</h3>
                                                            {isAccepted && (
                                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                                    <Check className="w-3 h-3" />
                                                                    ACCEPTED
                                                                </span>
                                                            )}
                                                            {isRejected && (
                                                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                                    <XCircle className="w-3 h-3" />
                                                                    REJECTED
                                                                </span>
                                                            )}
                                                            {isPending && (
                                                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    PENDING
                                                                </span>
                                                            )}
                                                            {request.status === 'cancelled' && (
                                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                                                                    REQUEST CANCELLED
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
                                                            <span>Qty: {request.quantity} kg</span>
                                                            <span>•</span>
                                                            <span>Consumer Budget: ${request.budgetPerKg}/kg</span>
                                                            <span>•</span>
                                                            <span>From: {request.consumer?.name || 'Consumer'}</span>
                                                        </div>
                                                        {request.description && (
                                                            <p className="text-sm text-slate-500 italic">"{request.description}"</p>
                                                        )}
                                                    </div>
                                                    
                                                    <div className={`rounded-lg p-4 text-center min-w-[140px] ${
                                                        isAccepted ? 'bg-green-100' :
                                                        isRejected ? 'bg-red-100' :
                                                        'bg-slate-100'
                                                    }`}>
                                                        <p className="text-xs text-slate-500 mb-1">Your Offer</p>
                                                        <p className={`text-2xl font-bold ${
                                                            isAccepted ? 'text-green-700' :
                                                            isRejected ? 'text-red-700' :
                                                            'text-slate-700'
                                                        }`}>
                                                            ${myOffer?.pricePerKg || '?'}/kg
                                                        </p>
                                                        {myOffer?.message && (
                                                            <p className="text-xs text-slate-500 mt-1 truncate max-w-[120px]" title={myOffer.message}>
                                                                "{myOffer.message}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {isAccepted && (
                                                    <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                                                        <p className="text-green-800 text-sm font-medium flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Congratulations! Your offer was accepted. Contact {request.consumer?.name || 'the consumer'} to proceed.
                                                        </p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                    {myOffers.length === 0 && (
                                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-500">You haven't made any offers yet.</p>
                                            <p className="text-slate-400 text-sm mt-1">Browse consumer requests and make your first offer!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Auction History
                                </h3>
                                {closedAuctions.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {closedAuctions.map((auction) => {
                                            const isAwarded = auction.status === 'awarded' || (auction.status === 'closed' && auction.highestBid > 0);
                                            const isExpired = auction.status === 'expired' || (auction.status === 'closed' && auction.highestBid === 0);
                                            const isCancelled = auction.status === 'cancelled';
                                            
                                            return (
                                                <motion.div 
                                                    key={auction.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`bg-white rounded-xl border p-5 ${
                                                        isAwarded ? 'border-green-200 bg-green-50/30' :
                                                        isCancelled ? 'border-red-200 bg-red-50/30' :
                                                        'border-slate-200 bg-slate-50/30'
                                                    }`}
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="font-bold text-lg text-slate-900">{auction.product.title}</h3>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                    isAwarded ? 'bg-green-100 text-green-700' :
                                                                    isCancelled ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                    {isAwarded ? '✓ SOLD' : 
                                                                     isCancelled ? '✗ CANCELLED' : 
                                                                     isExpired ? 'NO BIDS' :
                                                                     auction.status.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                                                <span>Quantity: {auction.quantity} kg</span>
                                                                <span>•</span>
                                                                <span>Min Price: ${auction.minPricePerKg}/kg</span>
                                                                <span>•</span>
                                                                <span>Ended: {new Date(auction.deadline).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {isAwarded && auction.highestBid > 0 && (
                                                            <div className="bg-green-100 rounded-lg p-4 text-center min-w-[140px]">
                                                                <p className="text-green-600 text-xs font-medium mb-1">Final Price</p>
                                                                <p className="text-green-700 font-bold text-2xl">${auction.highestBid}/kg</p>
                                                                <p className="text-green-600 text-xs mt-1">
                                                                    Total: ${(auction.highestBid * auction.quantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {isExpired && (
                                                            <div className="bg-slate-100 rounded-lg p-4 text-center min-w-[140px]">
                                                                <p className="text-slate-500 text-xs font-medium mb-1">Result</p>
                                                                <p className="text-slate-600 font-bold">No Bids</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                        <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">No auction history yet.</p>
                                        <p className="text-slate-400 text-sm mt-1">Completed auctions will appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}
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
                                            <label className="block text-sm font-bold text-slate-700">
                                                1. Select Product to Sell 
                                                <span className="text-slate-400 font-normal ml-2">({products.length} available)</span>
                                            </label>
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
                                                    <button 
                                                        type="button"
                                                        key={p.id}
                                                        onClick={() => setAuctionForm({...auctionForm, productId: p.id})}
                                                        className={`text-left cursor-pointer rounded-xl p-3 border-2 transition-all ${
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
                                                    </button>
                                                );
                                            })}
                                            {filteredProducts.length === 0 && searchQuery && (
                                                <div className="col-span-full py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                    <p className="text-sm mb-3">No products found matching "{searchQuery}"</p>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setShowCreateAuction(false);
                                                            router.push('/farmer/products');
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        Add "{searchQuery}" to Inventory
                                                    </button>
                                                </div>
                                            )}
                                            {filteredProducts.length === 0 && !searchQuery && (
                                                <div className="col-span-full py-8 text-center bg-orange-50 rounded-xl border border-dashed border-orange-200">
                                                    <Package className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                                                    <p className="text-orange-700 font-bold mb-2">No Products Available</p>
                                                    <p className="text-orange-600 text-sm mb-4 max-w-sm mx-auto">
                                                        You need to create products from harvested batches before you can auction them.
                                                    </p>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setShowCreateAuction(false);
                                                            router.push('/farmer/products');
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Go to Product Inventory
                                                    </button>
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

                                        {/* Validation Message */}
                                        {(!auctionForm.productId || !auctionForm.minPricePerKg || !auctionForm.quantity || !auctionDateTime) && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                <div className="text-sm text-amber-700">
                                                    <p className="font-bold mb-1">Complete all fields to launch:</p>
                                                    <ul className="list-disc list-inside space-y-0.5 text-amber-600">
                                                        {!auctionForm.productId && <li>Select a product</li>}
                                                        {!auctionForm.minPricePerKg && <li>Set minimum bid price</li>}
                                                        {!auctionForm.quantity && <li>Enter quantity</li>}
                                                        {!auctionDateTime && <li>Set end date & time</li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={!auctionForm.productId || !auctionForm.minPricePerKg || !auctionForm.quantity || !auctionDateTime}
                                        className={`w-full font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 mt-4 ${
                                            auctionForm.productId && auctionForm.minPricePerKg && auctionForm.quantity && auctionDateTime
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        }`}
                                    >
                                        <Gavel className="w-5 h-5" />
                                        Launch Auction
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Make Offer Modal */}
                <AnimatePresence>
                    {showOfferModal && selectedRequest && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Make an Offer</h2>
                                    <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <div className="bg-slate-50 p-4 rounded-xl mb-6">
                                    <p className="text-sm text-slate-500 mb-1">Request for</p>
                                    <p className="font-bold text-slate-900">{selectedRequest.productName}</p>
                                    <div className="flex gap-4 mt-2 text-sm text-slate-600">
                                        <span>Target: ${selectedRequest.budgetPerKg}/kg</span>
                                        <span>Qty: {selectedRequest.quantity}kg</span>
                                    </div>
                                </div>

                                <form onSubmit={handleMakeOffer} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Price ($/kg)</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            className="w-full rounded-xl border-slate-200"
                                            value={offerForm.pricePerKg}
                                            onChange={(e) => setOfferForm({...offerForm, pricePerKg: e.target.value})}
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-1">If your price is greater than budget, it might be rejected.</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Message (Optional)</label>
                                        <textarea 
                                            className="w-full rounded-xl border-slate-200"
                                            rows="3"
                                            value={offerForm.message}
                                            onChange={(e) => setOfferForm({...offerForm, message: e.target.value})}
                                            placeholder="Details about quality, delivery..."
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition"
                                    >
                                        Send Offer
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

