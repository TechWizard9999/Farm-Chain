'use client';
import ConsumerLayout from '@/components/consumer/ConsumerLayout';
import { User } from 'lucide-react';

export default function ConsumerProfile() {
    return (
        <ConsumerLayout>
            <div className="text-center py-20">
                <User className="w-20 h-20 text-blue-600 mx-auto mb-6" strokeWidth={1.5} />
                <h1 className="text-3xl font-bold text-stone-800 mb-4">Profile & Settings</h1>
                <p className="text-lg text-stone-600">Manage your account settings</p>
            </div>
        </ConsumerLayout>
    );
}
