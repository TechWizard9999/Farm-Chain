'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import {
    Plus,
    Search,
    Filter,
    Package,
    Clock,
    MapPin,
    Calendar,
    X,
    Loader2,
    Trash2,
    Leaf,
    Sprout,
    Activity,
    Droplets,
    FlaskConical,
    Bug,
    Scissors,
    PackageCheck,
    Truck
} from 'lucide-react';
import { graphqlRequest } from '@/lib/apollo-client';
import { MY_FARMS_QUERY } from '@/lib/graphql/farm';
import { CREATE_BATCH_MUTATION, LIST_BATCHES_QUERY, DELETE_BATCH_MUTATION, LOG_ACTIVITY_MUTATION } from '@/lib/graphql/batch';

const CROP_CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Other'];

// Activity types from schema enum
const ACTIVITY_TYPES = [
    { value: 'SEEDING', label: 'Seeding', icon: Sprout, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'WATERING', label: 'Watering', icon: Droplets, color: 'bg-blue-100 text-blue-700' },
    { value: 'FERTILIZER', label: 'Fertilizer', icon: FlaskConical, color: 'bg-amber-100 text-amber-700' },
    { value: 'PESTICIDE', label: 'Pesticide', icon: Bug, color: 'bg-red-100 text-red-700' },
    { value: 'HARVEST', label: 'Harvest', icon: Scissors, color: 'bg-green-100 text-green-700' },
    { value: 'PACKED', label: 'Packed', icon: PackageCheck, color: 'bg-purple-100 text-purple-700' },
    { value: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'bg-emerald-100 text-emerald-700' }
];

export default function BatchTracking() {
    const [batches, setBatches] = useState([]);
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        farm: '',
        cropCategory: '',
        cropName: '',
        variety: '',
        seedSource: '',
        sowingDate: '',
        expectedHarvestDate: ''
    });

    const [activityFormData, setActivityFormData] = useState({
        activityType: '',
        productName: '',
        quantity: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const farmsData = await graphqlRequest(MY_FARMS_QUERY);
            const myFarms = farmsData.myFarms || [];
            setFarms(myFarms);

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
                setBatches(allBatches);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            farm: farms.length > 0 ? farms[0].id : '',
            cropCategory: '',
            cropName: '',
            variety: '',
            seedSource: '',
            sowingDate: '',
            expectedHarvestDate: ''
        });
        setError('');
    };

    const resetActivityForm = () => {
        setActivityFormData({
            activityType: '',
            productName: '',
            quantity: '',
            notes: ''
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const input = {
                farm: formData.farm,
                cropCategory: formData.cropCategory,
                cropName: formData.cropName,
                variety: formData.variety || null,
                seedSource: formData.seedSource || null,
                sowingDate: formData.sowingDate,
                expectedHarvestDate: formData.expectedHarvestDate || null
            };

            const data = await graphqlRequest(CREATE_BATCH_MUTATION, { input });
            const selectedFarm = farms.find(f => f.id === formData.farm);
            setBatches(prev => [...prev, { ...data.createBatch, farmInfo: selectedFarm }]);
            setShowCreateModal(false);
            resetForm();
        } catch (err) {
            setError(err.message || 'Failed to create batch');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogActivity = async (e) => {
        e.preventDefault();
        if (!selectedBatch) return;

        setSubmitting(true);
        setError('');

        try {
            const input = {
                activityType: activityFormData.activityType,
                date: new Date().toISOString(),
                productName: activityFormData.productName || null,
                quantity: activityFormData.quantity ? parseFloat(activityFormData.quantity) : null,
                notes: activityFormData.notes || null
            };

            const data = await graphqlRequest(LOG_ACTIVITY_MUTATION, { 
                batchId: selectedBatch.id, 
                input 
            });

            // Update the batch in state with new data
            setBatches(prev => prev.map(b => 
                b.id === selectedBatch.id 
                    ? { ...b, ...data.logActivity, farmInfo: b.farmInfo }
                    : b
            ));

            setShowActivityModal(false);
            setSelectedBatch(null);
            resetActivityForm();
        } catch (err) {
            setError(err.message || 'Failed to log activity');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this batch?')) return;

        try {
            await graphqlRequest(DELETE_BATCH_MUTATION, { id });
            setBatches(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            alert('Failed to delete batch: ' + err.message);
        }
    };

    const openActivityModal = (batch) => {
        setSelectedBatch(batch);
        resetActivityForm();
        setShowActivityModal(true);
    };

    const getActivityInfo = (activityType) => {
        return ACTIVITY_TYPES.find(a => a.value === activityType) || ACTIVITY_TYPES[0];
    };

    const getCurrentStateInfo = (batch) => {
        // Get the last activity type or show 'Not Started'
        if (batch.activities && batch.activities.length > 0) {
            const lastActivity = batch.activities[batch.activities.length - 1];
            return getActivityInfo(lastActivity.activityType);
        }
        return { value: 'NONE', label: 'Not Started', icon: Clock, color: 'bg-gray-100 text-gray-700' };
    };

    const filteredBatches = batches.filter(batch =>
        batch.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 mb-1">Batch Tracking</h1>
                        <p className="text-stone-600">Create and monitor your crop batches</p>
                    </div>
                    <motion.button
                        onClick={() => { resetForm(); setShowCreateModal(true); }}
                        disabled={farms.length === 0}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: farms.length > 0 ? 1.02 : 1, y: farms.length > 0 ? -2 : 0 }}
                        whileTap={{ scale: farms.length > 0 ? 0.98 : 1 }}
                    >
                        <Plus className="w-5 h-5" />
                        Create New Batch
                    </motion.button>
                </div>

                {farms.length === 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700">
                        ⚠️ Please create a farm first in <strong>Farm Management</strong> before adding batches.
                    </div>
                )}

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search batches by crop name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                        />
                    </div>
                    <button className="px-6 py-3 bg-white border-2 border-stone-200 rounded-xl font-semibold hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filter
                    </button>
                </div>

                {/* Batches Grid */}
                {filteredBatches.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-12 text-center">
                        <Sprout className="w-16 h-16 mx-auto mb-4 text-green-600 opacity-50" />
                        <h3 className="text-xl font-bold text-stone-800 mb-2">No Batches Yet</h3>
                        <p className="text-stone-500">Create your first crop batch to start tracking</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredBatches.map((batch, index) => {
                            const stateInfo = getCurrentStateInfo(batch);
                            const StateIcon = stateInfo.icon;

                            return (
                                <motion.div
                                    key={batch.id}
                                    className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden hover:shadow-xl transition-shadow group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-green-50 rounded-xl">
                                                    <Package className="w-8 h-8 text-green-600" strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-stone-800 mb-1">{batch.cropName}</h3>
                                                    <p className="text-sm text-stone-500">
                                                        {batch.variety && <span>{batch.variety} • </span>}
                                                        {batch.cropCategory}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${stateInfo.color}`}>
                                                    <StateIcon className="w-4 h-4" />
                                                    {batch.stateLabel || stateInfo.label}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(batch.id); }}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="flex items-start gap-3">
                                                <Leaf className="w-5 h-5 text-stone-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-stone-500">Seed Source</p>
                                                    <p className="text-sm font-semibold text-stone-800">{batch.seedSource || 'Not specified'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-stone-500">Sowing Date</p>
                                                    <p className="text-sm font-semibold text-stone-800">
                                                        {batch.sowingDate ? new Date(batch.sowingDate).toLocaleDateString() : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-stone-500">Expected Harvest</p>
                                                    <p className="text-sm font-semibold text-stone-800">
                                                        {batch.expectedHarvestDate ? new Date(batch.expectedHarvestDate).toLocaleDateString() : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-stone-500">Farm Location</p>
                                                    <p className="text-sm font-semibold text-stone-800">
                                                        PIN: {batch.farmInfo?.pinCode || batch.farm}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="border-t border-stone-100 pt-4">
                                            <button 
                                                onClick={() => openActivityModal(batch)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                                            >
                                                <Activity className="w-4 h-4" />
                                                Log Activity
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Create Batch Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                        >
                            <motion.div
                                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-stone-800">Create New Batch</h2>
                                    <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-stone-100 rounded-xl">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Select Farm *</label>
                                        <select
                                            value={formData.farm}
                                            onChange={(e) => setFormData(prev => ({ ...prev, farm: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                        >
                                            <option value="">Choose a farm</option>
                                            {farms.map(farm => (
                                                <option key={farm.id} value={farm.id}>
                                                    PIN: {farm.pinCode} • {farm.size} Acres • {farm.soilType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Crop Category *</label>
                                        <select
                                            value={formData.cropCategory}
                                            onChange={(e) => setFormData(prev => ({ ...prev, cropCategory: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                        >
                                            <option value="">Select category</option>
                                            {CROP_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Crop Name *</label>
                                        <input
                                            type="text"
                                            value={formData.cropName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, cropName: e.target.value }))}
                                            required
                                            placeholder="e.g., Organic Tomatoes"
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Variety / Strain</label>
                                        <input
                                            type="text"
                                            value={formData.variety}
                                            onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
                                            placeholder="e.g., Cherry Tomatoes"
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Seed Source</label>
                                        <input
                                            type="text"
                                            value={formData.seedSource}
                                            onChange={(e) => setFormData(prev => ({ ...prev, seedSource: e.target.value }))}
                                            placeholder="e.g., Local Nursery"
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">Sowing Date *</label>
                                            <input
                                                type="date"
                                                value={formData.sowingDate}
                                                onChange={(e) => setFormData(prev => ({ ...prev, sowingDate: e.target.value }))}
                                                required
                                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">Expected Harvest</label>
                                            <input
                                                type="date"
                                                value={formData.expectedHarvestDate}
                                                onChange={(e) => setFormData(prev => ({ ...prev, expectedHarvestDate: e.target.value }))}
                                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-3 bg-stone-100 text-stone-600 rounded-xl font-semibold">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={submitting} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                                            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : 'Create Batch'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Log Activity Modal */}
                <AnimatePresence>
                    {showActivityModal && selectedBatch && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowActivityModal(false)}
                        >
                            <motion.div
                                className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-stone-800">Log Activity</h2>
                                        <p className="text-sm text-stone-500 mt-1">{selectedBatch.cropName}</p>
                                    </div>
                                    <button onClick={() => setShowActivityModal(false)} className="p-2 hover:bg-stone-100 rounded-xl">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

                                <form onSubmit={handleLogActivity} className="space-y-5">
                                    {/* Activity Type Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-3">Activity Type *</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {ACTIVITY_TYPES.map((activity) => {
                                                const Icon = activity.icon;
                                                const isSelected = activityFormData.activityType === activity.value;
                                                return (
                                                    <button
                                                        key={activity.value}
                                                        type="button"
                                                        onClick={() => setActivityFormData(prev => ({ ...prev, activityType: activity.value }))}
                                                        className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                                                            isSelected 
                                                                ? 'border-green-500 bg-green-50 text-green-700' 
                                                                : 'border-stone-200 hover:border-stone-300'
                                                        }`}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        <span className="font-medium">{activity.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Product Name (for fertilizer/pesticide) */}
                                    {(activityFormData.activityType === 'FERTILIZER' || activityFormData.activityType === 'PESTICIDE') && (
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">Product Name</label>
                                            <input
                                                type="text"
                                                value={activityFormData.productName}
                                                onChange={(e) => setActivityFormData(prev => ({ ...prev, productName: e.target.value }))}
                                                placeholder="e.g., Urea, Neem Oil"
                                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                            />
                                        </div>
                                    )}

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Quantity (kg/liters)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={activityFormData.quantity}
                                            onChange={(e) => setActivityFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                            placeholder="e.g., 50"
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Notes</label>
                                        <textarea
                                            value={activityFormData.notes}
                                            onChange={(e) => setActivityFormData(prev => ({ ...prev, notes: e.target.value }))}
                                            placeholder="Any additional notes..."
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 outline-none resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setShowActivityModal(false)} className="flex-1 px-6 py-3 bg-stone-100 text-stone-600 rounded-xl font-semibold">
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={submitting || !activityFormData.activityType} 
                                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : 'Log Activity'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </FarmerLayout>
    );
}
