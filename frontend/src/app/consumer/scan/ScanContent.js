"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import { graphqlRequest } from "@/lib/apollo-client";
import { TRACE_PRODUCT } from "@/lib/graphql/consumer";
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
  Shield,
  Loader2,
  Search,
  Sprout,
  Truck,
  Store,
  Package,
} from "lucide-react";
import ScannerModal from "@/components/common/ScannerModal";

export default function ScanContent() {
  const searchParams = useSearchParams();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [qrInput, setQrInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [directLoad, setDirectLoad] = useState(false); // Track if we came with QR param
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const qrFromUrl = searchParams.get("qr");
    if (qrFromUrl) {
      setDirectLoad(true); // Hide scanner UI when coming with QR param
      setQrInput(qrFromUrl);
      handleScanWithCode(qrFromUrl);
    }
  }, [searchParams]);

  const handleScanWithCode = async (code) => {
    if (!code) return;

    // Clean URL if present
    let cleanCode = code;
    if (code.includes("/verify/")) {
      const parts = code.split("/verify/");
      cleanCode = parts[1];
    }
    setQrInput(cleanCode);

    setIsScanning(true);
    setError(null);

    try {
      const data = await graphqlRequest(TRACE_PRODUCT, { qrCode: code });

      if (data?.traceProduct) {
        setScanResult(data.traceProduct);
        saveToHistory(data.traceProduct);
      } else {
        setError("Product not found. Please check the QR code.");
      }
    } catch (err) {
      setError(err.message || "Failed to trace product");
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = () => {
    handleScanWithCode(qrInput);
  };

  const saveToHistory = (result) => {
    const history = JSON.parse(
      localStorage.getItem("farmchain_scan_history") || "[]",
    );
    const newEntry = {
      id: result.product?.id,
      qrCode: result.product?.qrCode,
      title: result.product?.title,
      farmer: result.farmer?.name,
      scannedAt: new Date().toISOString(),
      isVerified: result.isVerified,
    };
    const filtered = history.filter((h) => h.qrCode !== newEntry.qrCode);
    localStorage.setItem(
      "farmchain_scan_history",
      JSON.stringify([newEntry, ...filtered].slice(0, 50)),
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Show loading screen when coming directly with QR param */}
        {directLoad && isScanning ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Tracing Product Journey
            </h2>
            <p className="text-slate-500">Verifying blockchain records...</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                <ScanLine className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  {scanResult ? "Product Journey" : "QR Code Scanner"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                {scanResult
                  ? scanResult.product?.title || "Product Details"
                  : "Scan Product QR Code"}
              </h1>
              <p className="text-lg text-slate-600">
                {scanResult
                  ? "View the complete farm-to-table journey"
                  : "Instantly verify product authenticity and trace its journey"}
              </p>
            </motion.div>

            {!scanResult ? (
              <>
                <motion.div
                  className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 aspect-square max-w-md mx-auto flex items-center justify-center">
                    {isScanning ? (
                      <motion.div
                        className="text-white text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="w-20 h-20 animate-spin mx-auto mb-4 text-blue-400" />
                        <p className="text-lg font-semibold">
                          Tracing product...
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="relative"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div className="relative w-64 h-64 border-4 border-white/30 rounded-3xl flex items-center justify-center">
                          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl" />
                          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl" />
                          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl" />
                          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl" />
                          <ScanLine
                            className="w-24 h-24 text-white/50"
                            strokeWidth={1.5}
                          />
                          <motion.div
                            className="absolute inset-x-0 h-1 bg-blue-500 shadow-lg shadow-blue-500"
                            animate={{ y: [0, 240, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={qrInput}
                        onChange={(e) => setQrInput(e.target.value)}
                        placeholder="Enter QR code (e.g., QR-TOMATO-001)"
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <motion.button
                        onClick={handleScan}
                        disabled={isScanning || !qrInput}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        whileHover={!isScanning ? { scale: 1.02 } : {}}
                        whileTap={!isScanning ? { scale: 0.98 } : {}}
                      >
                        <Search className="w-5 h-5" />
                        Trace
                      </motion.button>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500">
                          or scan with camera
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowScanner(true)}
                      className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Open Camera Scanner / Upload Image
                    </button>
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <Shield className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-bold text-slate-800 mb-1">
                      100% Verified
                    </h3>
                    <p className="text-sm text-slate-600">
                      All products are blockchain-verified for authenticity
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <Leaf className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-bold text-slate-800 mb-1">
                      Farm to Table
                    </h3>
                    <p className="text-sm text-slate-600">
                      Complete transparency in product journey
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <Award className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-bold text-slate-800 mb-1">
                      Quality Assured
                    </h3>
                    <p className="text-sm text-slate-600">
                      View quality grades and certifications
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={`rounded-3xl p-8 text-white text-center shadow-xl ${
                    scanResult.isVerified
                      ? "bg-gradient-to-br from-green-600 to-emerald-600"
                      : "bg-gradient-to-br from-red-600 to-red-700"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {scanResult.isVerified ? (
                    <>
                      <CheckCircle2
                        className="w-20 h-20 mx-auto mb-4"
                        strokeWidth={1.5}
                      />
                      <h2 className="text-3xl font-bold mb-2">
                        Product Verified! ✓
                      </h2>
                      <p className="text-green-100">
                        This product is authentic and blockchain-verified
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle
                        className="w-20 h-20 mx-auto mb-4"
                        strokeWidth={1.5}
                      />
                      <h2 className="text-3xl font-bold mb-2">
                        Verification Pending
                      </h2>
                      <p className="text-red-100">
                        Product information retrieved
                      </p>
                    </>
                  )}
                </motion.div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10">
                  {/* Header Image Area */}
                  <div className="h-48 bg-slate-50 relative shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-600/10" />
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />

                    <div className="absolute -bottom-12 left-10 z-10">
                      <div className="w-28 h-28 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-6xl border-4 border-white transform rotate-3">
                        🌿
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-16">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">
                          {scanResult.product?.title || "Unknown Product"}
                        </h3>
                        <p className="text-slate-500">
                          QR Code: {scanResult.product?.qrCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">
                          Overall Score
                        </p>
                        <p className="text-3xl font-bold text-emerald-600">
                          {scanResult.scores?.overall || 0}%
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-bold">
                            Farm Location
                          </p>
                          <p className="font-medium text-slate-800">
                            {scanResult.farm?.latitude
                              ? `${scanResult.farm.latitude.toFixed(4)}, ${scanResult.farm.longitude.toFixed(4)}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-purple-50 rounded-xl">
                          <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-bold">
                            Harvest Date
                          </p>
                          <p className="font-medium text-slate-800">
                            {formatDate(scanResult.batch?.harvestDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC MAP STRUCTURE - HORIZONTAL */}
                    {scanResult.timeline && scanResult.timeline.length > 0 && (
                      <div className="mt-12 mb-12">
                        <div className="flex items-center justify-between mb-8 px-2">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Journey Milestone Map
                          </h3>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                            <CheckCircle2 size={12} strokeWidth={3} /> Verified
                            Chain
                          </span>
                        </div>

                        <div className="relative py-4">
                          <div
                            ref={scrollContainerRef}
                            className="flex flex-row overflow-x-auto pb-12 pt-2 gap-0 relative z-10 px-2 snap-x snap-mandatory mx-2 hide-scrollbar"
                          >
                            {scanResult.timeline.map((step, idx) => {
                              const isLast =
                                idx === scanResult.timeline.length - 1;
                              return (
                                <motion.div
                                  key={idx}
                                  className="flex flex-col items-center min-w-[280px] snap-center relative"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.2 }}
                                >
                                  {/* Connector Line Logic: Connect center to next center */}
                                  {idx < scanResult.timeline.length - 1 && (
                                    <div className="absolute top-10 left-[50%] w-full h-1.5 bg-slate-100 -z-10">
                                      <motion.div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 origin-left"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{
                                          duration: 0.8,
                                          delay: idx * 0.3 + 0.5,
                                          ease: "circOut",
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* Icon Circle */}
                                  <motion.div
                                    className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl relative shrink-0 z-10 mb-6 transition-all duration-500
                                        ${
                                          isLast
                                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/40 border-4 border-white scale-110"
                                            : "bg-white border-4 border-slate-50 shadow-lg shadow-slate-200/50"
                                        }`}
                                    initial={
                                      isLast ? { scale: 1 } : { scale: 1 }
                                    }
                                    animate={
                                      isLast ? { scale: [1, 1.1, 1] } : {}
                                    }
                                    transition={
                                      isLast
                                        ? { duration: 2, repeat: Infinity }
                                        : {}
                                    }
                                  >
                                    {step.icon || "📍"}

                                    {/* Checkmark Badge */}
                                    <div
                                      className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-lg transition-colors
                                         ${isLast ? "bg-white text-emerald-600" : "bg-emerald-500 text-white"}`}
                                    >
                                      <CheckCircle2 size={14} strokeWidth={3} />
                                    </div>
                                  </motion.div>

                                  {/* Card Content */}
                                  <div
                                    className={`
                                      p-5 rounded-3xl border transition-all w-[90%] text-center relative flex flex-col min-h-[180px] relative
                                      ${
                                        isLast
                                          ? "bg-gradient-to-b from-emerald-50 to-white border-emerald-200 shadow-xl shadow-emerald-900/5 ring-4 ring-emerald-500/10"
                                          : "bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-slate-200/50"
                                      }
                                  `}
                                  >
                                    {/* Arrow */}
                                    <div
                                      className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 border-t border-l transform rotate-45 z-20 
                                         ${isLast ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"}`}
                                    />

                                    <div className="mb-3">
                                      <span
                                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm
                                            ${isLast ? "bg-emerald-600 text-white shadow-emerald-500/30" : "bg-slate-100 text-slate-500"}`}
                                      >
                                        {formatDate(step.date).split(",")[0]}
                                      </span>
                                    </div>

                                    <h4
                                      className={`font-bold text-lg leading-tight mb-2 ${isLast ? "text-emerald-900" : "text-slate-900"}`}
                                    >
                                      {step.title}
                                    </h4>

                                    <p
                                      className={`text-sm leading-relaxed p-3 rounded-2xl border mb-3 flex-1
                                         ${isLast ? "bg-white/60 border-emerald-100/50 text-emerald-800" : "bg-slate-50 border-slate-100/50 text-slate-500"}`}
                                    >
                                      {step.description}
                                    </p>

                                    {step.whoClass && (
                                      <div className="mt-auto flex items-center justify-center gap-2 pt-3 border-t border-dashed w-full border-slate-200/50">
                                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px]">
                                          👤
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 capitalize">
                                          {step.whoClass}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <button className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Share Verification Certificate
                      </button>
                      <button
                        onClick={() => {
                          setScanResult(null);
                          setQrInput("");
                          setError(null);
                          setDirectLoad(false); // Reset so scanner can be shown again
                        }}
                        className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                      >
                        Scan Another Product
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanWithCode}
      />
    </>
  );
}
