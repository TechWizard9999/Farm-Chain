'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import { 
    ShoppingCart, 
    Plus, 
    Loader2, 
    Trash2, 
    Edit2, 
    Eye, 
    Leaf, 
    Package,
    DollarSign,
    QrCode,
    CheckCircle2,
    Clock,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { graphqlRequest } from '@/lib/apollo-client';
import { MY_PRODUCTS_QUERY, DELETE_PRODUCT_MUTATION, PUBLISH_PRODUCT_MUTATION } from '@/lib/graphql/product';

export default function Products() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await graphqlRequest(MY_PRODUCTS_QUERY);
            setProducts(data.myProducts || []);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await graphqlRequest(DELETE_PRODUCT_MUTATION, { id });
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete product: ' + err.message);
        }
    };

    const handlePublish = async (id) => {
        setPublishing(id);
        try {
            const data = await graphqlRequest(PUBLISH_PRODUCT_MUTATION, { id });
            setProducts(prev => prev.map(p => 
                p.id === id ? { ...p, ...data.publishProduct } : p
            ));
        } catch (err) {
            alert('Failed to publish product: ' + err.message);
        } finally {
            setPublishing(null);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Clock },
            'active': { label: 'Published', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
            'sold_out': { label: 'Sold Out', color: 'bg-red-100 text-red-700', icon: Package }
        };
        return statusMap[status] || statusMap['draft'];
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
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                        <p className="text-slate-500">Manage your farm's product catalog</p>
                    </div>
                    <button 
                        onClick={() => router.push('/farmer/batch-tracking')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No Products Yet</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Harvest a batch first, then add it as a product to start selling.
                        </p>
                        <button 
                            onClick={() => router.push('/farmer/batch-tracking')}
                            className="px-6 py-3 border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-600 font-bold rounded-xl transition-all"
                        >
                            Go to Batch Tracking
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => {
                            const statusInfo = getStatusInfo(product.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <motion.div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {/* Product Image or Placeholder */}
                                    <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center relative">
                                        {product.photos && product.photos.length > 0 ? (
                                            <img 
                                                src={product.photos[0]} 
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Package className="w-16 h-16 text-green-300" />
                                        )}
                                        {product.isOrganic && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                                                <Leaf className="w-3 h-3" />
                                                Organic
                                            </div>
                                        )}
                                        <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-lg flex items-center gap-1 ${statusInfo.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusInfo.label}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{product.title}</h3>
                                        <p className="text-sm text-slate-500 mb-3">{product.category}</p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                                                <DollarSign className="w-5 h-5" />
                                                ₹{product.pricePerKg}/kg
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {product.availableQty} kg available
                                            </div>
                                        </div>

                                        {/* Batch Info */}
                                        {product.batch && (
                                            <div className="p-3 bg-slate-50 rounded-xl mb-4 text-sm">
                                                <p className="text-slate-500">
                                                    From batch: <span className="font-semibold text-slate-700">{product.batch.cropName}</span>
                                                </p>
                                            </div>
                                        )}

                                        {/* QR Code */}
                                        {product.qrCode && (
                                            <div className="p-3 bg-purple-50 rounded-xl mb-4 flex items-center gap-3">
                                                <QrCode className="w-8 h-8 text-purple-600" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-purple-600 font-semibold">QR Code Active</p>
                                                    <p className="text-xs text-purple-500 font-mono truncate">{product.qrCode}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {product.status === 'draft' && (
                                                <button 
                                                    onClick={() => handlePublish(product.id)}
                                                    disabled={publishing === product.id}
                                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                                                >
                                                    {publishing === product.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Publish
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            {product.status === 'active' && product.qrCode && (
                                                <button 
                                                    onClick={() => window.open(`/trace/${product.qrCode}`, '_blank')}
                                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm flex items-center justify-center gap-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    View Trace
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </FarmerLayout>
    );
}
