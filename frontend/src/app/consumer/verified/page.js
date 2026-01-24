'use client';
import ConsumerLayout from '@/components/consumer/ConsumerLayout';
import { Shield } from 'lucide-react';

export default function Verified() {
    return (
        <ConsumerLayout>
            <div className="text-center py-20">
                <Shield className="w-20 h-20 text-blue-600 mx-auto mb-6" strokeWidth={1.5} />
                <h1 className="text-3xl font-bold text-stone-800 mb-4">Verified Products</h1>
                <p className="text-lg text-stone-600">All your verified organic products</p>
            </div>
        </ConsumerLayout>
    );
}
