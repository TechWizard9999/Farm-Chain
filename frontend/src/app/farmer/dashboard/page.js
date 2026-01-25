"use client";

import { useState, useEffect } from "react";
<<<<<<< Updated upstream
import { useRouter } from "next/navigation";
=======
>>>>>>> Stashed changes
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FarmerLayout from "@/components/farmer/FarmerLayout";
import CreateBatchModal from "@/components/farmer/CreateBatchModal";
import { useAuth } from "@/context/AuthContext";
import { graphqlRequest } from "@/lib/apollo-client";
import { MY_FARMS_QUERY } from "@/lib/graphql/farm";
<<<<<<< Updated upstream
import { LIST_BATCHES_SIMPLE_QUERY } from "@/lib/graphql/batch";
import { MY_PRODUCTS_QUERY } from "@/lib/graphql/product";
=======
import { LIST_BATCHES_QUERY } from "@/lib/graphql/batch";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  AlertCircle,
} from "lucide-react";

export default function FarmerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
  const [farmId, setFarmId] = useState(null);
  const [loadingFarm, setLoadingFarm] = useState(true);
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return; // Wait for auth

    const fetchFarm = async () => {
      try {
        const data = await graphqlRequest(MY_FARMS_QUERY);
        if (data?.myFarms?.length > 0) {
          setFarmId(data.myFarms[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch farms:", err);
      } finally {
        setLoadingFarm(false);
      }
    };
    fetchFarm();
  }, [user]);

  // Fetch batches and products when farmId is available
  useEffect(() => {
    const fetchData = async () => {
      if (!farmId) {
        setLoadingData(false);
        return;
      }
      
      try {
        const [batchesData, productsData] = await Promise.all([
          graphqlRequest(LIST_BATCHES_SIMPLE_QUERY, { farm: farmId }),
          graphqlRequest(MY_PRODUCTS_QUERY)
        ]);
        
        setBatches(batchesData?.listBatches || []);
        setProducts(productsData?.myProducts || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    
    if (!loadingFarm) {
      fetchData();
    }
  }, [farmId, loadingFarm]);

  const handleCreateBatch = () => {
    if (loadingFarm) return;
    
    if (!farmId) {
      if (confirm("You need to create a farm profile before creating batches. Go to Farm Management?")) {
        router.push("/farmer/farm-management");
      }
      return;
    }
    setIsCreateBatchOpen(true);
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // Calculate real stats from data
  const totalBatches = batches.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  // Hardcoded display values for demo
  const totalSold = 2; // Hardcoded: 2 kg
  const totalEarnings = 120; // Hardcoded: $120

  const stats = [
    {
      label: "Total Batches",
      value: totalBatches.toString(),
      change: totalBatches > 0 ? `${totalBatches} active` : "Start now",
      trend: "up",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-200",
    },
    {
      label: "Active Products",
      value: activeProducts.toString(),
      change: products.length > 0 ? `of ${products.length} total` : "Create products",
      trend: "up",
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-200",
    },
    {
      label: "Total Sold",
      value: `${totalSold.toFixed(0)} kg`,
      change: totalSold > 0 ? "Units sold" : "No sales yet",
      trend: totalSold > 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-200",
    },
    {
      label: "Est. Revenue",
      value: `$${totalEarnings.toFixed(0)}`,
      change: totalEarnings > 0 ? "From sales" : "Pending",
      trend: totalEarnings > 0 ? "up" : "down",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-200",
    },
  ];

  // Get recent batches (last 5)
  const recentBatches = batches.slice(0, 5).map(batch => ({
    id: batch.id?.substring(0, 8) || 'N/A',
    product: batch.cropName || batch.cropCategory || 'Unknown',
    variety: batch.variety || '',
    status: batch.stateLabel || batch.currentState || 'Unknown',
    date: batch.sowingDate ? new Date(batch.sowingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
  }));

  // Map status to colors
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('harvest') || statusLower.includes('complete')) return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-600' };
    if (statusLower.includes('ship') || statusLower.includes('transit')) return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-600' };
    if (statusLower.includes('grow') || statusLower.includes('process')) return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-600' };
    return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-600' };
  };

  // Recent activity from batches (inferred)
  const activityData = batches.slice(0, 4).map((batch, index) => ({
    action: index === 0 ? "Batch created" : batch.stateLabel || "Activity logged",
    batch: batch.cropName || batch.id?.substring(0, 8),
    time: batch.sowingDate ? `Sowed ${new Date(batch.sowingDate).toLocaleDateString()}` : "Recently",
    icon: index % 2 === 0 ? Package : CheckCircle2,
    color: index % 2 === 0 ? "bg-blue-500" : "bg-emerald-500",
  }));
=======
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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
                {batches.length > 0 ? (
                  <>You have <span className="text-white font-bold">{batches.length} batches</span> and <span className="text-white font-bold">{activeProducts} active products</span>.</>
                ) : (
                  <>Get started by creating your first batch to track your farm production.</>
                )}
=======
                You have <span className="text-white font-bold">{farms.length} farms</span> and{" "}
                <span className="text-white font-bold">{batches.length} batches</span> in your portfolio.
>>>>>>> Stashed changes
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
<<<<<<< Updated upstream
                onClick={() => setIsCreateBatchOpen(true)}
                className={`px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 ${loadingFarm ? 'opacity-70 cursor-wait' : ''}`}
                whileHover={{ scale: loadingFarm ? 1 : 1.05 }}
                whileTap={{ scale: loadingFarm ? 1 : 0.95 }}
                disabled={loadingFarm}
=======
                onClick={() => router.push('/farmer/batch-tracking')}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
>>>>>>> Stashed changes
              >
                {loadingFarm ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Package className="w-5 h-5" />
                )}
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
<<<<<<< Updated upstream
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === "up" ? "text-emerald-600" : "text-slate-500"
                  } bg-slate-50 px-2 py-1 rounded-lg`}
                >
                  {stat.change}
                </div>
=======
>>>>>>> Stashed changes
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                  {loadingData ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
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
<<<<<<< Updated upstream
              {loadingData ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : recentBatches.length > 0 ? (
=======
              {batches.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">No batches yet. Create your first batch!</p>
                </div>
              ) : (
>>>>>>> Stashed changes
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
<<<<<<< Updated upstream
                        Batch ID
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Variety
=======
                        Crop
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Category
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                    {recentBatches.map((batch, index) => {
                      const statusColors = getStatusColor(batch.status);
                      return (
                        <motion.tr
                          key={index}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                          onClick={() => router.push('/farmer/batch-tracking')}
=======
                    {batches.slice(0, 5).map((batch, index) => {
                      const status = getStatusFromState(batch.currentState);
                      return (
                        <motion.tr
                          key={batch.id}
                          className="hover:bg-slate-50/80 transition-colors"
>>>>>>> Stashed changes
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          <td className="px-8 py-4 whitespace-nowrap">
<<<<<<< Updated upstream
                            <span className="font-mono text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                              {batch.id}
                            </span>
                          </td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-slate-900">
                              {batch.product}
                            </span>
                          </td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-500">
                              {batch.variety || '-'}
                            </span>
                          </td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusColors.bg} ${statusColors.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}></span>
                              {batch.status}
=======
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
>>>>>>> Stashed changes
                            </span>
                          </td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock className="w-4 h-4" />
<<<<<<< Updated upstream
                              {batch.date}
=======
                              {batch.sowingDate ? new Date(batch.sowingDate).toLocaleDateString() : '-'}
>>>>>>> Stashed changes
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
<<<<<<< Updated upstream
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">No batches yet</p>
                  <p className="text-slate-400 text-sm mt-1">Create your first batch to get started</p>
                  <button
                    onClick={() => setIsCreateBatchOpen(true)}
                    className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium text-sm hover:bg-emerald-600 transition"
                  >
                    Create Batch
                  </button>
                </div>
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              {activityData.length > 0 ? (
                <div className="space-y-6 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-100"></div>

                  {activityData.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="relative flex gap-4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full ${activity.color} shadow-lg shadow-black/5 flex items-center justify-center text-white shrink-0`}
                      >
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-bold text-slate-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          {activity.batch} • {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No recent activity</p>
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  onClick={() => router.push('/farmer/profile')}
                  className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors"
                >
                  Verify Now
=======
                  onClick={() => router.push('/farmer/batch-tracking')}
                  className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors"
                >
                  Log Activity
>>>>>>> Stashed changes
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <CreateBatchModal
        isOpen={isCreateBatchOpen}
        onClose={() => setIsCreateBatchOpen(false)}
        farmId={farmId}
        onSuccess={() => {
          // Refresh batches after creation
          if (farmId) {
            graphqlRequest(LIST_BATCHES_SIMPLE_QUERY, { farm: farmId })
              .then(data => setBatches(data?.listBatches || []))
              .catch(console.error);
          }
        }}
      />
    </FarmerLayout>
  );
}
