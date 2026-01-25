"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import Link from "next/link";
import {
  Route,
  MapPin,
  Calendar,
  Leaf,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Clock,
} from "lucide-react";

export default function JourneyHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = JSON.parse(
      localStorage.getItem("farmchain_scan_history") || "[]",
    );
    setHistory(saved);
  };

  const clearHistory = () => {
    localStorage.removeItem("farmchain_scan_history");
    setHistory([]);
  };

  const removeItem = (qrCode) => {
    const updated = history.filter((h) => h.qrCode !== qrCode);
    localStorage.setItem("farmchain_scan_history", JSON.stringify(updated));
    setHistory(updated);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductEmoji = (title) => {
    const lower = (title || "").toLowerCase();
    if (lower.includes("tomato")) return "🍅";
    if (lower.includes("lettuce")) return "🥬";
    if (lower.includes("pepper")) return "🫑";
    if (lower.includes("cucumber")) return "🥒";
    if (lower.includes("carrot")) return "🥕";
    if (lower.includes("potato")) return "🥔";
    return "🌿";
  };

  return (
    <ConsumerLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                <Route className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  Journey History
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                Your Product Journeys
              </h1>
              <p className="text-lg text-slate-600">
                View all the products you've scanned and their complete journey
              </p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </motion.div>

        {history.length === 0 ? (
          <motion.div
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Route className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Scans Yet
            </h3>
            <p className="text-slate-500 mb-6">
              Start scanning products to build your journey history
            </p>
            <Link href="/consumer/scan">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Scan Your First Product
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {history.map((item, index) => (
              <motion.div
                key={item.qrCode || index}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-6">
                  <div className="text-6xl flex-shrink-0">
                    {getProductEmoji(item.title)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">
                          {item.title || "Unknown Product"}
                        </h3>
                        <p className="text-sm text-slate-500">
                          QR Code: {item.qrCode}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.isVerified && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              Verified
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => removeItem(item.qrCode)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-slate-500">Farmer</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.farmer || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-slate-500">Scanned At</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatDate(item.scannedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                          View complete product journey and traceability
                        </p>
                        <Link href={`/consumer/scan?qr=${item.qrCode}`}>
                          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                            View Full Journey
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ConsumerLayout>
  );
}
