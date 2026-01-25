"use client";

import { useState, useEffect } from "react";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import { graphqlRequest } from "@/lib/apollo-client";
import { AUCTIONS_QUERY, PLACE_BID_MUTATION } from "@/lib/graphql/auction";
import { MY_PRODUCT_REQUESTS_QUERY, CREATE_PRODUCT_REQUEST_MUTATION, ACCEPT_OFFER_MUTATION, REJECT_OFFER_MUTATION, CANCEL_REQUEST_MUTATION } from "@/lib/graphql/productRequest";
import { 
    Gavel, 
    ShoppingBag, 
    Plus, 
    Clock, 
    DollarSign, 
    CheckCircle2, 
    X, 
    Loader2,
    TrendingUp,
    Check,
    XCircle,
    History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BusinessPage() {
    const [activeTab, setActiveTab] = useState("auctions");
    const [auctions, setAuctions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modals
    const [showBidModal, setShowBidModal] = useState(false);
    const [showCreateRequest, setShowCreateRequest] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState(null);

    // Forms
    const [bidAmount, setBidAmount] = useState("");
    const [requestForm, setRequestForm] = useState({
        productName: "",
        quantity: "",
        description: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [auctionsData, requestsData] = await Promise.all([
                graphqlRequest(AUCTIONS_QUERY),
                graphqlRequest(MY_PRODUCT_REQUESTS_QUERY)
            ]);

            const fetchedAuctions = auctionsData.openAuctions || [];
            setAuctions(fetchedAuctions);
            setRequests(requestsData.getMyProductRequests || []);
            
        } catch (error) {
            console.error("Error fetching consumer business data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        try {
            const bidValue = parseFloat(bidAmount);
            
            if (!selectedAuction) return;

            // Validation
            const currentHighest = selectedAuction.highestBid > 0 
                ? selectedAuction.highestBid 
                : selectedAuction.minPricePerKg;
                
            if (bidValue <= currentHighest) {
                alert(`Bid must be higher than $${currentHighest}`);
                return;
            }

            // Call backend mutation to place bid
            const result = await graphqlRequest(PLACE_BID_MUTATION, {
                auctionId: selectedAuction.id,
                pricePerKg: bidValue
            });

            // Update local state with new bid
            if (result.placeBid) {
                setAuctions(prevAuctions => 
                    prevAuctions.map(a => 
                        a.id === selectedAuction.id 
                            ? { ...a, highestBid: result.placeBid.highestBid }
                            : a
                    )
                );
            }
            
            setShowBidModal(false);
            setBidAmount("");
            alert("Bid placed successfully!");
            
        } catch (error) {
            console.error("Error placing bid:", error);
            alert("Failed to place bid: " + error.message);
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        try {
            await graphqlRequest(CREATE_PRODUCT_REQUEST_MUTATION, {
                input: {
                    productName: requestForm.productName,
                    quantity: parseFloat(requestForm.quantity),
                    description: requestForm.description
                }
            });
            setShowCreateRequest(false);
            setRequestForm({productName: "", quantity: "", description: ""});
            fetchData();
            alert("Request sent! Farmers will send you price offers.");
        } catch (error) {
            console.error("Error creating request:", error);
            alert("Failed to create request: " + error.message);
        }
    };

    const handleAcceptOffer = async (requestId, offerIndex) => {
        if (!confirm("Are you sure you want to accept this offer? This will close the request.")) return;
        try {
            await graphqlRequest(ACCEPT_OFFER_MUTATION, { requestId, offerIndex });
            fetchData();
            alert("Offer accepted successfully!");
        } catch (error) {
            console.error("Error accepting offer:", error);
            alert("Failed to accept offer: " + error.message);
        }
    };

    const handleRejectOffer = async (requestId, offerIndex) => {
        try {
            await graphqlRequest(REJECT_OFFER_MUTATION, { requestId, offerIndex });
            fetchData();
        } catch (error) {
            console.error("Error rejecting offer:", error);
            alert("Failed to reject offer: " + error.message);
        }
    };

    const handleCancelRequest = async (requestId) => {
        if (!confirm("Are you sure you want to cancel this request?")) return;
        try {
            await graphqlRequest(CANCEL_REQUEST_MUTATION, { id: requestId });
            fetchData();
            alert("Request cancelled");
        } catch (error) {
            console.error("Error cancelling request:", error);
            alert("Failed to cancel request: " + error.message);
        }
    };

    // Separate open and closed requests
    const openRequests = requests.filter(r => r.status === 'open');
    const historyRequests = requests.filter(r => r.status !== 'open');

    const getStatusBadge = (status) => {
        switch(status) {
            case 'open': return 'bg-green-100 text-green-700';
            case 'fulfilled': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'expired': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    return (
        <ConsumerLayout>
            <div className="max-w-6xl mx-auto space-y-8 p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
                        <p className="text-slate-500 mt-1">Participate in auctions or request specific products</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab("auctions")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "auctions"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-600 hover:text-blue-600"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Gavel className="w-4 h-4" />
                            Live Auctions
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "requests"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-600 hover:text-blue-600"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            My Requests
                            {openRequests.length > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{openRequests.length}</span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "history"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-600 hover:text-blue-600"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {auctions.map((auction) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={auction.id} 
                                        className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
                                    >
                                        {/* Card Header Image Placeholder */}
                                        <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative p-6 flex flex-col justify-between">
                                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                                                LIVE AUCTION
                                            </div>
                                            <div className="text-white">
                                                <h3 className="font-bold text-2xl mb-1">{auction.product.title}</h3>
                                                <p className="text-blue-100 text-sm">Batch: {auction.product.batch?.batchId || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex justify-between items-end mb-6">
                                                <div>
                                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Current Highest Bid</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-3xl font-black text-slate-800">
                                                            ${auction.highestBid > 0 ? auction.highestBid : auction.minPricePerKg}
                                                        </span>
                                                        <span className="text-slate-500 font-medium">/kg</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Ends In</p>
                                                    <div className="flex items-center justify-end gap-1 text-orange-600 font-bold text-sm">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {new Date(auction.deadline).toLocaleString(undefined, {
                                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div>
                                                    <p className="text-slate-400 text-xs mb-1">Quantity Available</p>
                                                    <p className="font-bold text-slate-700">{auction.quantity} kg</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-xs mb-1">Starting Price</p>
                                                    <p className="font-bold text-slate-700">${auction.minPricePerKg}/kg</p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => {
                                                    setSelectedAuction(auction);
                                                    setShowBidModal(true);
                                                }}
                                                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                                            >
                                                <Gavel className="w-5 h-5" />
                                                Place Your Bid
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                                {auctions.length === 0 && (
                                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                        <Gavel className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500">No active auctions at the moment. Check back later!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "requests" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <p className="text-slate-500">Tell farmers what you need. They'll send you price offers.</p>
                                    <button 
                                        onClick={() => setShowCreateRequest(true)}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-lg shadow-blue-500/20"
                                    >
                                        <Plus className="w-5 h-5" />
                                        New Request
                                    </button>
                                </div>

                                {/* Open Requests */}
                                <div className="grid grid-cols-1 gap-6">
                                    {openRequests.map((request) => (
                                        <div key={request.id} className="bg-white rounded-2xl border border-slate-200 p-6">
                                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-bold text-xl text-slate-900">{request.productName}</h3>
                                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                                                            WAITING FOR OFFERS
                                                        </span>
                                                    </div>
                                                    {request.description && (
                                                        <p className="text-slate-600 mb-4">{request.description}</p>
                                                    )}
                                                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                                                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                                                            <span className="text-blue-600 font-bold text-lg">{request.quantity} kg</span>
                                                            <span className="text-blue-500 ml-1">requested</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleCancelRequest(request.id)}
                                                        className="text-red-500 text-sm hover:text-red-700 flex items-center gap-1"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel Request
                                                    </button>
                                                </div>

                                                <div className="w-full md:w-2/5 bg-slate-50 rounded-xl p-4">
                                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-emerald-500" />
                                                        Price Offers ({request.offers?.length || 0})
                                                    </h4>
                                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                                        {request.offers?.length > 0 ? (
                                                            request.offers.map((offer, idx) => (
                                                                <div key={idx} className={`bg-white p-4 rounded-lg border text-sm ${
                                                                    offer.status === 'rejected' ? 'border-red-200 bg-red-50/50 opacity-60' : 'border-slate-200'
                                                                }`}>
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div>
                                                                            <span className="font-bold text-2xl text-emerald-600">${offer.pricePerKg}</span>
                                                                            <span className="text-slate-500">/kg</span>
                                                                        </div>
                                                                        {offer.status === 'rejected' && (
                                                                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">Rejected</span>
                                                                        )}
                                                                    </div>
                                                                    {offer.message && (
                                                                        <p className="text-slate-600 text-xs mb-3 italic">"{offer.message}"</p>
                                                                    )}
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                            <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                                                                                {offer.farmer?.name?.[0] || 'F'}
                                                                            </div>
                                                                            <span className="font-medium text-slate-700">{offer.farmer?.name || 'Farmer'}</span>
                                                                        </div>
                                                                        {(!offer.status || offer.status === 'pending') && (
                                                                            <div className="flex gap-2">
                                                                                <button 
                                                                                    onClick={() => handleAcceptOffer(request.id, idx)}
                                                                                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 flex items-center gap-1 shadow-sm"
                                                                                >
                                                                                    <Check className="w-4 h-4" />
                                                                                    Accept
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => handleRejectOffer(request.id, idx)}
                                                                                    className="bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-300 flex items-center gap-1"
                                                                                >
                                                                                    <X className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-center py-6">
                                                                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                                                <p className="text-sm text-slate-500">Waiting for farmers to send offers...</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {openRequests.length === 0 && (
                                        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 mb-4">No active requests yet.</p>
                                            <button 
                                                onClick={() => setShowCreateRequest(true)}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                            >
                                                Create Your First Request
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Request History
                                </h3>
                                {historyRequests.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {historyRequests.map((request) => (
                                            <div key={request.id} className={`bg-white rounded-xl border p-5 ${
                                                request.status === 'fulfilled' ? 'border-green-200 bg-green-50/30' :
                                                request.status === 'cancelled' ? 'border-red-200 bg-red-50/30' :
                                                'border-slate-200'
                                            }`}>
                                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-bold text-lg text-slate-900">{request.productName}</h3>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(request.status)}`}>
                                                                {request.status === 'fulfilled' ? '✓ SUCCESS' : 
                                                                 request.status === 'cancelled' ? '✗ CANCELLED' : 
                                                                 request.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                                            <span>Quantity: {request.quantity} kg</span>
                                                        </div>
                                                    </div>
                                                    {request.status === 'fulfilled' && request.acceptedOffer && (
                                                        <div className="bg-green-100 rounded-lg p-4 text-sm">
                                                            <p className="text-green-800 font-medium mb-1">Accepted Offer</p>
                                                            <p className="text-green-700 font-bold text-xl">${request.acceptedOffer.pricePerKg}/kg</p>
                                                            <p className="text-green-600 text-xs mt-1">from {request.acceptedOffer.farmer?.name || 'Farmer'}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                        <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">No request history yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Bid Modal */}
                <AnimatePresence>
                    {showBidModal && selectedAuction && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Place Bid</h2>
                                    <button onClick={() => setShowBidModal(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 mb-1">Current Highest Bid</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {selectedAuction.highestBid > 0 ? `$${selectedAuction.highestBid}` : `$${selectedAuction.minPricePerKg}`}
                                        <span className="text-sm text-slate-400 font-normal">/kg</span>
                                    </p>
                                </div>

                                <form onSubmit={handlePlaceBid} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Bid ($/kg)</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            min={selectedAuction.highestBid > 0 ? selectedAuction.highestBid + 0.1 : selectedAuction.minPricePerKg}
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Must be higher than current bid.</p>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
                                    >
                                        Confirm Bid
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Create Request Modal */}
                <AnimatePresence>
                    {showCreateRequest && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Request a Product</h2>
                                    <button onClick={() => setShowCreateRequest(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <p className="text-slate-500 text-sm mb-6">
                                    Tell farmers what you need. They'll send you price offers that you can accept or reject.
                                </p>
                                
                                <form onSubmit={handleCreateRequest} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">What do you need?</label>
                                        <input 
                                            type="text" 
                                            className="w-full rounded-xl border-slate-200 text-lg py-3"
                                            value={requestForm.productName}
                                            onChange={(e) => setRequestForm({...requestForm, productName: e.target.value})}
                                            placeholder="e.g., Organic Tomatoes, Fresh Mangoes..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">How much? (kg)</label>
                                        <input 
                                            type="number" 
                                            className="w-full rounded-xl border-slate-200 text-lg py-3"
                                            value={requestForm.quantity}
                                            onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                                            placeholder="Enter quantity in kg"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Any specific requirements? (optional)</label>
                                        <textarea 
                                            className="w-full rounded-xl border-slate-200"
                                            rows="3"
                                            value={requestForm.description}
                                            onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                                            placeholder="e.g., Organic only, specific variety, ripeness level..."
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition text-lg"
                                    >
                                        Send Request to Farmers
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </ConsumerLayout>
    );
}

