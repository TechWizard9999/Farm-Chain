"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FarmerLayout from "@/components/farmer/FarmerLayout";
import { useAuth } from "@/context/AuthContext";
import { graphqlRequest } from "@/lib/apollo-client";
import { MY_FARMS_QUERY } from "@/lib/graphql/farm";
import { LIST_BATCHES_QUERY } from "@/lib/graphql/batch";
import {
  TrendingUp,
  Package,
  Sprout,
  Activity,
  ArrowUpRight,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  Droplets,
  FlaskConical,
  Bug,
  Scissors,
  PackageCheck,
  Truck,
  Leaf
} from "lucide-react";

// Activity type icons and colors
const ACTIVITY_CONFIG = {
  SEEDING: { label: 'Seeding', icon: Sprout, color: 'bg-yellow-500' },
  WATERING: { label: 'Watering', icon: Droplets, color: 'bg-blue-500' },
  FERTILIZER: { label: 'Fertilizer', icon: FlaskConical, color: 'bg-amber-500' },
  PESTICIDE: { label: 'Pesticide', icon: Bug, color: 'bg-red-500' },
  HARVEST: { label: 'Harvest', icon: Scissors, color: 'bg-green-500' },
  PACKED: { label: 'Packed', icon: PackageCheck, color: 'bg-purple-500' },
  SHIPPED: { label: 'Shipped', icon: Truck, color: 'bg-emerald-500' }
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [farms, setFarms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch farms
      const farmsData = await graphqlRequest(MY_FARMS_QUERY);
      const myFarms = farmsData.myFarms || [];
      setFarms(myFarms);

      // Fetch batches for all farms
      if (myFarms.length > 0) {
        const allBatches = [];
        for (const farm of myFarms) {
          try {
            const batchData = await graphqlRequest(LIST_BATCHES_QUERY, { farm: farm.id });
            if (batchData.listBatches) {
              allBatches.push(...batchData.listBatches.map(b => ({ ...b, farmInfo: farm })));
            }
          } catch (e) {
            console.error('Error fetching batches for farm:', farm.id, e);
          }
        }
        // Sort by creation date (most recent first)
        allBatches.sort((a, b) => new Date(b.sowingDate) - new Date(a.sowingDate));
        setBatches(allBatches);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = (name) => {
    if (!name) return "Farmer";
    return name.split(" ")[0];
  };

  const getStatusFromState = (state) => {
    const stateMap = {
      'idle': { label: 'Started', color: 'bg-gray-100 text-gray-700' },
      'seeding': { label: 'Seeding', color: 'bg-yellow-100 text-yellow-700' },
      'watering': { label: 'Growing', color: 'bg-blue-100 text-blue-700' },
      'fertilizer': { label: 'Growing', color: 'bg-blue-100 text-blue-700' },
      'pesticide': { label: 'Growing', color: 'bg-blue-100 text-blue-700' },
      'harvest': { label: 'Harvested', color: 'bg-green-100 text-green-700' },
      'packed': { label: 'Processing', color: 'bg-amber-100 text-amber-700' },
      'shipped': { label: 'In Transit', color: 'bg-purple-100 text-purple-700' },
      'delivered': { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700' }
    };
    return stateMap[state] || { label: 'Not Started', color: 'bg-gray-100 text-gray-700' };
  };

  // Get recent activities from all batches
  const getRecentActivities = () => {
    const allActivities = [];
    batches.forEach(batch => {
      if (batch.activities && batch.activities.length > 0) {
        batch.activities.forEach(activity => {
          allActivities.push({
            ...activity,
            batch: batch,
            cropName: batch.cropName
          });
        });
      }
    });
    // Sort by date (most recent first) and take top 5
    allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    return allActivities.slice(0, 5);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const stats = [
    {
      label: "Total Farms",
      value: farms.length.toString(),
      icon: MapPin,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Batches",
      value: batches.length.toString(),
      icon: Package,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Active Crops",
      value: batches.filter(b => b.currentState !== 'delivered').length.toString(),
      icon: Leaf,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Harvested",
      value: batches.filter(b => ['harvest', 'packed', 'shipped', 'delivered'].includes(b.currentState)).length.toString(),
      icon: Scissors,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const recentActivities = getRecentActivities();

  if (loading) {
    return (
      <FarmerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          className="relative overflow-hidden bg-[#022c22] rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-emerald-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                {getGreeting()}, {getFirstName(user?.name)}! 👋
              </h1>
              <p className="text-emerald-100/80 text-lg max-w-xl">
                You have <span className="text-white font-bold">{farms.length} farms</span> and{" "}
                <span className="text-white font-bold">{batches.length} batches</span> in your portfolio.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={() => router.push('/farmer/batch-tracking')}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package className="w-5 h-5" />
                Create Batch
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Batches */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Batches
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Track your latest production
                </p>
              </div>
              <button 
                onClick={() => router.push('/farmer/batch-tracking')}
                className="text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              {batches.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">No batches yet. Create your first batch!</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Crop
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Sowing Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batches.slice(0, 5).map((batch, index) => {
                      const status = getStatusFromState(batch.currentState);
                      return (
                        <motion.tr
                          key={batch.id}
                          className="hover:bg-slate-50/80 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          <td className="px-8 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-slate-900">
                              {batch.cropName}
                            </span>
                            {batch.variety && (
                              <span className="text-xs text-slate-500 ml-2">({batch.variety})</span>
                            )}
                          </td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-500">
                              {batch.cropCategory}
                            </span>
                          </td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {batch.stateLabel || status.label}
                            </span>
                          </td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock className="w-4 h-4" />
                              {batch.sowingDate ? new Date(batch.sowingDate).toLocaleDateString() : '-'}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Recent Activity
              </h2>
              {recentActivities.length === 0 ? (
                <div className="text-center py-6">
                  <Activity className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 text-sm">No activities yet</p>
                </div>
              ) : (
                <div className="space-y-6 relative">
                  <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-100"></div>

                  {recentActivities.map((activity, index) => {
                    const actConfig = ACTIVITY_CONFIG[activity.activityType] || {
                      label: activity.activityType,
                      icon: Activity,
                      color: 'bg-gray-500'
                    };
                    const ActivityIcon = actConfig.icon;

                    return (
                      <motion.div
                        key={index}
                        className="relative flex gap-4"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className={`relative z-10 w-10 h-10 rounded-full ${actConfig.color} shadow-lg shadow-black/5 flex items-center justify-center text-white shrink-0`}>
                          <ActivityIcon className="w-5 h-5" />
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-bold text-slate-900">
                            {actConfig.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            {activity.cropName} • {formatTimeAgo(activity.date)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                <p className="text-indigo-100 text-sm mb-4">
                  Log activities regularly to maintain accurate crop tracking and blockchain records.
                </p>
                <button 
                  onClick={() => router.push('/farmer/batch-tracking')}
                  className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors"
                >
                  Log Activity
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
