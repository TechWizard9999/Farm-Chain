'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import { Sprout, MapPin, Edit, Plus, X, Loader2, Trash2, Mountain, Leaf } from 'lucide-react';
import ImageUpload from '@/components/common/ImageUpload';
import { graphqlRequest } from '@/lib/apollo-client';
import { CREATE_FARM_MUTATION, MY_FARMS_QUERY, UPDATE_FARM_MUTATION, DELETE_FARM_MUTATION } from '@/lib/graphql/farm';

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peat', 'Chalky', 'Black Cotton'];
const ORGANIC_STATUS = ['Organic', 'In Transition', 'Conventional'];

export default function FarmManagement() {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFarmModal, setShowFarmModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [editingFarm, setEditingFarm] = useState(null);

    const [farmFormData, setFarmFormData] = useState({
        latitude: '',
        longitude: '',
        size: '',
        pinCode: '',
        soilType: '',
        organicStatus: '',
        photo: ''
    });

    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        try {
            setLoading(true);
            const data = await graphqlRequest(MY_FARMS_QUERY);
            setFarms(data.myFarms || []);
        } catch (err) {
            console.error('Error fetching farms:', err);
            if (!err.message.includes('Unauthorized')) {
                setError('Failed to load farms');
            }
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFarmFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6)
                    }));
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Could not get your location. Please enter manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    const resetForm = () => {
        setFarmFormData({
            latitude: '',
            longitude: '',
            size: '',
            pinCode: '',
            soilType: '',
            organicStatus: '',
            photo: ''
        });
        setEditingFarm(null);
        setError('');
    };

    const openAddModal = () => {
        resetForm();
        setShowFarmModal(true);
    };

    const openEditModal = (farm) => {
        setFarmFormData({
            latitude: farm.location.latitude.toString(),
            longitude: farm.location.longitude.toString(),
            size: farm.size.toString(),
            pinCode: farm.pinCode,
            soilType: farm.soilType,
            organicStatus: farm.organicStatus,
            photo: farm.photo
        });
        setEditingFarm(farm);
        setShowFarmModal(true);
    };

    const handleFarmSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const variables = {
                location: {
                    latitude: parseFloat(farmFormData.latitude),
                    longitude: parseFloat(farmFormData.longitude)
                },
                size: parseFloat(farmFormData.size),
                pinCode: farmFormData.pinCode,
                soilType: farmFormData.soilType,
                organicStatus: farmFormData.organicStatus,
                photo: farmFormData.photo || 'https://via.placeholder.com/400x300?text=Farm'
            };

            if (editingFarm) {
                const data = await graphqlRequest(UPDATE_FARM_MUTATION, { id: editingFarm.id, ...variables });
                setFarms(prev => prev.map(f => f.id === editingFarm.id ? data.updateFarm : f));
            } else {
                const data = await graphqlRequest(CREATE_FARM_MUTATION, variables);
                setFarms(prev => [...prev, data.createFarm]);
            }

            setShowFarmModal(false);
            resetForm();
        } catch (err) {
            setError(err.message || 'Failed to save farm');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteFarm = async (farmId) => {
        if (!confirm('Are you sure you want to delete this farm? All associated batches will also be affected.')) return;

        try {
            await graphqlRequest(DELETE_FARM_MUTATION, { id: farmId });
            setFarms(prev => prev.filter(f => f.id !== farmId));
        } catch (err) {
            alert('Failed to delete farm: ' + err.message);
        }
    };

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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-800">My Farms</h1>
                        <p className="text-stone-500 mt-1">Manage all your farm locations</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Farm
                    </button>
                </div>

                {/* Farms Grid */}
                {farms.length === 0 ? (
                    <motion.div
                        className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl p-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Sprout className="w-16 h-16 mx-auto mb-4 text-green-600" />
                        <h2 className="text-2xl font-bold text-stone-800 mb-2">No Farms Yet</h2>
                        <p className="text-stone-600 mb-6">Add your first farm to get started</p>
                        <button
                            onClick={openAddModal}
                            className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Farm
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {farms.map((farm, index) => (
                            <motion.div
                                key={farm.id}
                                className="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Farm Image */}
                                <div className="h-40 bg-gradient-to-br from-green-600 to-green-700 relative">
                                    {farm.photo && !farm.photo.includes('placeholder') ? (
                                        <img 
                                            src={farm.photo} 
                                            alt="Farm" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Sprout className="w-16 h-16 text-white/50" />
                                        </div>
                                    )}
                                    
                                    {/* Action Buttons */}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(farm)}
                                            className="p-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFarm(farm.id)}
                                            className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Organic Badge */}
                                    <div className="absolute bottom-3 left-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            farm.organicStatus === 'Organic' 
                                                ? 'bg-green-100 text-green-700' 
                                                : farm.organicStatus === 'In Transition'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-stone-100 text-stone-700'
                                        }`}>
                                            <Leaf className="w-3 h-3 inline mr-1" />
                                            {farm.organicStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Farm Details */}
                                <div className="p-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-stone-600">
                                            <MapPin className="w-4 h-4 text-green-600" />
                                            <span className="font-medium">PIN: {farm.pinCode}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-stone-600">
                                            <Mountain className="w-4 h-4 text-green-600" />
                                            <span>{farm.size} Acres • {farm.soilType} Soil</span>
                                        </div>
                                        <div className="text-xs text-stone-400">
                                            📍 {farm.location.latitude.toFixed(4)}, {farm.location.longitude.toFixed(4)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Farm Modal */}
            <AnimatePresence>
                {showFarmModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFarmModal(false)}
                    >
                        <motion.div
                            className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-stone-800">
                                    {editingFarm ? 'Edit Farm' : 'Add New Farm'}
                                </h2>
                                <button
                                    onClick={() => setShowFarmModal(false)}
                                    className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
                            )}

                            <form onSubmit={handleFarmSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Location (GPS Coordinates) *
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="Latitude"
                                            value={farmFormData.latitude}
                                            onChange={(e) => setFarmFormData(prev => ({ ...prev, latitude: e.target.value }))}
                                            required
                                            className="px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                        />
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="Longitude"
                                            value={farmFormData.longitude}
                                            onChange={(e) => setFarmFormData(prev => ({ ...prev, longitude: e.target.value }))}
                                            required
                                            className="px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Use Current Location
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Farm Size (Acres) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={farmFormData.size}
                                        onChange={(e) => setFarmFormData(prev => ({ ...prev, size: e.target.value }))}
                                        required
                                        placeholder="e.g., 5.5"
                                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">PIN Code *</label>
                                    <input
                                        type="text"
                                        value={farmFormData.pinCode}
                                        onChange={(e) => setFarmFormData(prev => ({ ...prev, pinCode: e.target.value }))}
                                        required
                                        placeholder="e.g., 500001"
                                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Soil Type *</label>
                                    <select
                                        value={farmFormData.soilType}
                                        onChange={(e) => setFarmFormData(prev => ({ ...prev, soilType: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select soil type</option>
                                        {SOIL_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Organic Status *</label>
                                    <select
                                        value={farmFormData.organicStatus}
                                        onChange={(e) => setFarmFormData(prev => ({ ...prev, organicStatus: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select status</option>
                                        {ORGANIC_STATUS.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <ImageUpload
                                    label="Farm Photo"
                                    value={farmFormData.photo}
                                    onChange={(base64) => setFarmFormData(prev => ({ ...prev, photo: base64 }))}
                                    maxSizeMB={5}
                                />

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            {editingFarm ? 'Update Farm' : 'Add Farm'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </FarmerLayout>
    );
}
