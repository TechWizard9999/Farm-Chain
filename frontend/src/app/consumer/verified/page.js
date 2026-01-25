"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import { graphqlRequest } from "@/lib/apollo-client";
import { LIST_PRODUCTS } from "@/lib/graphql/consumer";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  Leaf,
  MapPin,
  Star,
  Loader2,
  Filter,
  ScanLine,
} from "lucide-react";

export default function Verified() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "organic") return p.isOrganic;
    return true;
  });

  return (
    <ConsumerLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                Verified Products
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Trusted Farm Products
            </h1>
            <p className="text-lg text-slate-600">
              All products verified on blockchain for authenticity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilter("organic")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  filter === "organic"
                    ? "bg-green-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Leaf className="w-4 h-4" />
                Organic Only
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <span className="ml-4 text-lg text-slate-600">
              Loading verified products...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Products Found
            </h3>
            <p className="text-slate-500">
              {filter === "organic"
                ? "No organic products available right now"
                : "No verified products available yet"}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                      {getProductEmoji(product.category)}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">Verified</span>
                      </div>
                      {product.isOrganic && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                          <Leaf className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">Organic</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Leaf className="w-4 h-4 text-green-500" />
                      <span>{product.farmer?.name || "Unknown Farmer"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>₹{product.pricePerKg}/kg</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Available</p>
                      <p className="font-bold text-slate-800">
                        {product.availableQty} kg
                      </p>
                    </div>
                    <Link href={`/consumer/scan?qr=${product.qrCode}`}>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <ScanLine className="w-4 h-4" />
                        Trace
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-2">🔒 Blockchain Verified</h3>
            <p className="text-blue-100">
              Every product on this page has been verified on the blockchain for
              authenticity and traceability
            </p>
          </motion.div>
        )}
      </div>
    </ConsumerLayout>
  );
}
