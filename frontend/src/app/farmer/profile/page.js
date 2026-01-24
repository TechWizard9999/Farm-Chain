'use client';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import { User } from 'lucide-react';

export default function Profile() {
    return (
        <FarmerLayout>
            <div className="text-center py-20">
                <User className="w-20 h-20 text-green-600 mx-auto mb-6" strokeWidth={1.5} />
                <h1 className="text-3xl font-bold text-stone-800 mb-4">Profile & Settings</h1>
                <p className="text-lg text-stone-600">Manage your personal and farm details</p>
            </div>
        </FarmerLayout>
    );
}
