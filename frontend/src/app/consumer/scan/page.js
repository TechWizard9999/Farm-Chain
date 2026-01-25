"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

export default function ConsumerScan() {
  const searchParams = useSearchParams();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [qrInput, setQrInput] = useState("");

  useEffect(() => {
    const qrFromUrl = searchParams.get("qr");
    if (qrFromUrl) {
      setQrInput(qrFromUrl);
      handleScanWithCode(qrFromUrl);
    }
  }, [searchParams]);

  const handleScanWithCode = async (code) => {
    if (!code) return;

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
    <ConsumerLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <ScanLine className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              QR Code Scanner
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Scan Product QR Code
          </h1>
          <p className="text-lg text-slate-600">
            Instantly verify product authenticity and trace its journey
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
                    <p className="text-lg font-semibold">Tracing product...</p>
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

                <button className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" />
                  Open Camera Scanner
                </button>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <Shield className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">100% Verified</h3>
                <p className="text-sm text-slate-600">
                  All products are blockchain-verified for authenticity
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <Leaf className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Farm to Table</h3>
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
                  <p className="text-red-100">Product information retrieved</p>
                </>
              )}
            </motion.div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8">
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
                    <p className="text-sm text-slate-500 mb-1">Overall Score</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {scanResult.scores?.overall || 0}%
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Farmer</p>
                      <p className="font-semibold text-slate-800">
                        {scanResult.farmer?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Farm Location</p>
                      <p className="font-semibold text-slate-800">
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
                      <p className="text-sm text-slate-500">Harvest Date</p>
                      <p className="font-semibold text-slate-800">
                        {formatDate(scanResult.batch?.harvestDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Quality Grade</p>
                      <p className="font-semibold text-slate-800">
                        {scanResult.batch?.qualityGrade || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-slate-600 mb-1">Freshness</p>
                    <p className="text-2xl font-bold text-green-600">
                      {scanResult.scores?.freshness || 0}%
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-slate-600 mb-1">Organic Score</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {scanResult.scores?.organic || 0}%
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-slate-600 mb-1">Overall</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {scanResult.scores?.overall || 0}%
                    </p>
                  </div>
                </div>

                {scanResult.timeline && scanResult.timeline.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-800 mb-6">
                      Product Journey
                    </h4>
                    <div className="space-y-4">
                      {scanResult.timeline.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 text-2xl">
                              {step.icon}
                            </div>
                            {index < scanResult.timeline.length - 1 && (
                              <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-200" />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <h5 className="font-bold text-slate-800">
                              {step.title}
                            </h5>
                            <p className="text-sm text-slate-600">
                              {step.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatDate(step.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share Journey
                  </button>
                  <button
                    onClick={() => {
                      setScanResult(null);
                      setQrInput("");
                      setError(null);
                    }}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
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
