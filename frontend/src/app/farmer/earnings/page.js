'use client';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import { TrendingUp } from 'lucide-react';

export default function Earnings() {
    return (
        <FarmerLayout>
            <div className="text-center py-20">
                <TrendingUp className="w-20 h-20 text-green-600 mx-auto mb-6" strokeWidth={1.5} />
                <h1 className="text-3xl font-bold text-stone-800 mb-4">Earnings Report</h1>
                <p className="text-lg text-stone-600">View your sales and earnings visualization</p>
            </div>
        </FarmerLayout>
    );
}
