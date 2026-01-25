"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import { useAuth } from "@/context/AuthContext";
import { graphqlRequest } from "@/lib/apollo-client";
import { LIST_PRODUCTS, TRACE_PRODUCT } from "@/lib/graphql/consumer";
import {
  ScanLine,
  Shield,
  History,
  Award,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Calendar,
  Leaf,
  Share2,
  ExternalLink,
  Loader2,
  Navigation,
  Sprout,
  Truck,
  Store,
  X,
  Droplets,
  FlaskConical,
  Bug,
  Scissors,
  PackageCheck,
  Clock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Activity icons mapping
const ACTIVITY_ICONS = {
  'SEEDING': '🌱',
  'WATERING': '💧',
  'FERTILIZER': '🧪',
  'PESTICIDE': '🐛',
  'HARVEST': '✂️',
  'PACKED': '📦',
  'SHIPPED': '🚚',
  'planted': '🌱',
  'seeding': '🌱',
  'irrigation': '💧',
  'watering': '💧',
  'default': '🌿'
};

const getActivityIcon = (type) => {
  const key = type?.toLowerCase() || 'default';
  return ACTIVITY_ICONS[key] || ACTIVITY_ICONS['default'];
};

// --- Product Journey Modal Component ---
const ProductJourneyModal = ({ product, journeyData, loading, onClose }) => {
  const timelineRef = useRef(null);
  
  // Auto-scroll to last milestone when journey data loads
  useEffect(() => {
    if (journeyData?.timeline?.length > 0 && timelineRef.current) {
      setTimeout(() => {
        timelineRef.current.scrollTo({
          left: timelineRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }, 500); // Delay to allow animations to complete
    }
  }, [journeyData]);

  if (!product) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div 
       className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
    >
       {/* Backdrop */}
       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

       <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
       >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading product journey...</p>
            </div>
          ) : journeyData ? (
            <>
              {/* Verified Banner */}
              <div className={`py-6 px-8 text-center ${journeyData.isVerified ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {journeyData.isVerified ? 'Product Verified! ✓' : 'Verification Pending'}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {journeyData.isVerified ? 'This product is authentic and blockchain-verified' : 'Product information retrieved'}
                </p>
              </div>

              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 text-white transition-all z-20" 
                onClick={onClose}
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                {/* Product Info */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-1">
                      {journeyData.product?.title || product.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      QR Code: {journeyData.product?.qrCode || product.qrCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Overall Score</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {journeyData.scores?.overall || 0}%
                    </p>
                  </div>
                </div>

                {/* Farm & Batch Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Farm Location</p>
                      <p className="font-semibold text-slate-800 text-sm">
                        {journeyData.farm?.latitude
                          ? `${journeyData.farm.latitude.toFixed(4)}, ${journeyData.farm.longitude.toFixed(4)}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Harvest Date</p>
                      <p className="font-semibold text-slate-800 text-sm">
                        {formatDate(journeyData.batch?.harvestDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Journey Timeline */}
                {journeyData.timeline && journeyData.timeline.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Journey Milestone Map</h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 size={12} strokeWidth={3} /> Verified Chain
                      </span>
                    </div>
                    
                    <div ref={timelineRef} className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory">
                      {journeyData.timeline.map((step, idx) => {
                        const isLast = idx === journeyData.timeline.length - 1;
                        return (
                          <motion.div 
                            key={idx}
                            className="flex flex-col items-center min-w-[200px] snap-center relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            {/* Connector Line */}
                            {idx < journeyData.timeline.length - 1 && (
                              <div className="absolute top-8 left-[50%] w-full h-1 bg-slate-100 -z-10">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 origin-left"
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ duration: 0.5, delay: idx * 0.2 + 0.3 }}
                                />
                              </div>
                            )}

                            {/* Icon Circle */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 z-10
                              ${isLast 
                                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 border-4 border-white" 
                                : "bg-white border-4 border-slate-100 shadow-md"}`}
                            >
                              {step.icon || getActivityIcon(step.type)}
                              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center
                                ${isLast ? "bg-white text-emerald-600" : "bg-emerald-500 text-white"}`}>
                                <CheckCircle2 size={10} strokeWidth={3} />
                              </div>
                            </div>

                            {/* Card */}
                            <div className={`p-4 rounded-2xl border text-center w-full
                              ${isLast 
                                ? "bg-emerald-50 border-emerald-200" 
                                : "bg-white border-slate-100 shadow-sm"}`}
                            >
                              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full mb-2 inline-block
                                ${isLast ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                {formatDate(step.date)}
                              </span>
                              <h5 className={`font-bold text-sm mb-1 ${isLast ? "text-emerald-900" : "text-slate-800"}`}>
                                {step.title}
                              </h5>
                              <p className={`text-xs ${isLast ? "text-emerald-700" : "text-slate-500"}`}>
                                {step.description}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Certificate
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-8">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h3>
              <p className="text-slate-500 text-center mb-6">Unable to trace this product. It may not have journey data yet.</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          )}
       </motion.div>
    </motion.div>
  );
};


export default function ConsumerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [journeyData, setJourneyData] = useState(null);
  const [journeyLoading, setJourneyLoading] = useState(false);
   
  useEffect(() => {
    fetchProducts();
    loadScannedHistory();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await graphqlRequest(LIST_PRODUCTS, { filters: {} });
      if (data?.listProducts) {
        setProducts(data.listProducts);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadScannedHistory = () => {
    const history = JSON.parse(
      localStorage.getItem("farmchain_scan_history") || "[]",
    );
    setScannedProducts(history.slice(0, 5));
  };

  const handleTraceProduct = async (product) => {
    setSelectedProduct(product);
    setJourneyLoading(true);
    setJourneyData(null);

    try {
      // Use qrCode if available, otherwise fall back to product ID
      const traceCode = product.qrCode || product.id;
      
      if (!traceCode) {
        console.error("Product has no QR code or ID");
        setJourneyLoading(false);
        return;
      }
      
      const data = await graphqlRequest(TRACE_PRODUCT, { qrCode: traceCode });
      if (data?.traceProduct) {
        setJourneyData(data.traceProduct);
        // Save to history
        const history = JSON.parse(localStorage.getItem("farmchain_scan_history") || "[]");
        const newEntry = {
          id: data.traceProduct.product?.id,
          qrCode: data.traceProduct.product?.qrCode || product.id,
          title: data.traceProduct.product?.title,
          farmer: data.traceProduct.farmer?.name,
          scannedAt: new Date().toISOString(),
          isVerified: data.traceProduct.isVerified,
        };
        const filtered = history.filter((h) => h.qrCode !== newEntry.qrCode);
        localStorage.setItem("farmchain_scan_history", JSON.stringify([newEntry, ...filtered].slice(0, 50)));
        loadScannedHistory();
      }
    } catch (err) {
      console.error("Failed to trace product:", err);
    } finally {
      setJourneyLoading(false);
    }
  };

  const closeJourneyModal = () => {
    setSelectedProduct(null);
    setJourneyData(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = (name) => {
    if (!name) return "Consumer";
    return name.split(" ")[0];
  };

  const getProductEmoji = (category) => {
    const emojiMap = {
      vegetables: "🥬",
      fruits: "🍎",
      grains: "🌾",
      dairy: "🥛",
      tomatoes: "🍅",
      lettuce: "🥬",
      peppers: "🫑",
      cucumber: "🥒",
    };
    const key = category?.toLowerCase() || "";
    for (const [k, v] of Object.entries(emojiMap)) {
      if (key.includes(k)) return v;
    }
    return "🌿";
  };

  const stats = [
    {
      label: "Products Available",
      value: products.length.toString(),
      icon: ScanLine,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Organic Products",
      value: products.filter((p) => p.isOrganic).length.toString(),
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Farmers",
      value: [...new Set(products.map((p) => p.farmer?.id))]
        .filter(Boolean)
        .length.toString(),
      icon: Leaf,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Scanned by You",
      value: scannedProducts.length.toString(),
      icon: Share2,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <ConsumerLayout>
      <div className="space-y-8">
        <motion.div
          className="relative overflow-hidden bg-[#0f172a] rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-blue-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                {getGreeting()}, {getFirstName(user?.name)}! 👋
              </h1>
              <p className="text-blue-100/80 text-lg max-w-xl">
                Verify the authenticity of your food products with blockchain.
              </p>
            </div>
            <Link href="/consumer/scan">
              <motion.button
                className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ScanLine className="w-5 h-5" />
                Scan New Product
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* --- Available Products & Map Section --- */}
        <div className="flex flex-col gap-6">
           <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Available Products</h2>
                  <p className="text-sm text-slate-500">From verified farms near you</p>
                </div>
                <Link href="/consumer/verified" className="text-blue-600 hover:text-blue-700 font-bold text-sm">View All</Link>
              </div>

              {loading ? (
                 <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-slate-400"/></div>
              ) : products.length === 0 ? (
                 <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-500">No products available at the moment.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.slice(0, 8).map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] hover:border-blue-500/30 transition-all duration-300 group flex flex-col h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                        <div className="relative h-40 bg-slate-50 overflow-hidden shrink-0">
                            {/* Background Pattern */}
                             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                             
                            {/* Emoji Hero */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="text-7xl drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110">
                                     {getProductEmoji(product.category)}
                                 </span>
                            </div>

                            {/* Badge Overlay */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                {product.isOrganic && (
                                     <div className="px-2 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                                        <Leaf size={10} strokeWidth={3} /> Organic
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="mb-auto">
                              <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                                {product.title}
                              </h3>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                                <Leaf size={12} className="text-emerald-500" /> {product.farmer?.name}
                              </p>
                              
                              <div className="flex items-center gap-2 mb-4">
                                   <span className="text-2xl font-black text-slate-900 tracking-tight">₹{product.pricePerKg}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase">/ kg</span>
                              </div>
                          </div>

                          <button 
                            onClick={() => handleTraceProduct(product)}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-blue-600 hover:shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                          >
                              <ScanLine className="w-4 h-4" />
                              Trace
                          </button>
                        </div>
                    </motion.div>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* Journey Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductJourneyModal
              product={selectedProduct}
              journeyData={journeyData}
              loading={journeyLoading}
              onClose={closeJourneyModal}
            />
          )}
        </AnimatePresence>
         
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} inline-flex mb-4`}
              >
                <stat.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                {loading ? "-" : stat.value}
              </h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Scan Product",
              desc: "Verify authenticity",
              icon: ScanLine,
              color: "blue",
              href: "/consumer/scan",
            },
            {
              title: "View History",
              desc: "See scanned products",
              icon: History,
              color: "indigo",
              href: "/consumer/journey",
            },
            {
              title: "Verified Products",
              desc: "Browse trusted items",
              icon: Award,
              color: "violet",
              href: "/consumer/verified",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <Link href={item.href}>
                <div className="relative overflow-hidden bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-200 p-6 rounded-3xl transition-all group cursor-pointer shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={`p-4 rounded-2xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </ConsumerLayout>
  );
}
