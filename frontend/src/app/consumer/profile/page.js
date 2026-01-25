"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  Calendar,
  ScanLine,
  ChevronRight,
  Bell,
  Lock,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConsumerProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem("farmchain_scan_history") || "[]",
    );
    setScanCount(history.length);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const settingsItems = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage your notification preferences",
    },
    {
      icon: Lock,
      label: "Privacy & Security",
      description: "Control your privacy settings",
    },
    {
      icon: Shield,
      label: "Verification Badge",
      description: "Get verified as a trusted consumer",
    },
  ];

  return (
    <ConsumerLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm border-4 border-white/30">
                {getInitials(user?.name)}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {user?.name || "Consumer"}
                </h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email || "No email"}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                    {user?.role || "consumer"}
                  </span>
                  <span className="text-sm text-blue-100">
                    Member since {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-2xl p-6 text-center">
                <ScanLine className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-700">{scanCount}</p>
                <p className="text-sm text-blue-600">Products Scanned</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-green-700">{scanCount}</p>
                <p className="text-sm text-green-600">Verified Products</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-purple-700">Active</p>
                <p className="text-sm text-purple-600">Account Status</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Account Information
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Full Name</p>
                    <p className="font-medium text-slate-800">
                      {user?.name || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Email Address</p>
                    <p className="font-medium text-slate-800">
                      {user?.email || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Phone Number</p>
                    <p className="font-medium text-slate-800">
                      {user?.phone || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Settings
            </h3>
            <div className="space-y-3 mb-8">
              {settingsItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-800">{item.label}</p>
                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </ConsumerLayout>
  );
}
