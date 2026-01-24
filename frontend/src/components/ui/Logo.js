'use client';
import { Leaf } from 'lucide-react';

export default function Logo({ size = 'medium', color = 'white' }) {
    const sizes = {
        small: { icon: 'w-6 h-6', text: 'text-xl' },
        medium: { icon: 'w-8 h-8', text: 'text-2xl' },
        large: { icon: 'w-12 h-12', text: 'text-4xl' }
    };

    const colors = {
        white: { icon: 'text-emerald-400', text: 'text-white', bg: 'bg-white/10' },
        dark: { icon: 'text-white', text: 'text-slate-900', bg: 'bg-emerald-600' }
    };

    const currentSize = sizes[size] || sizes.medium;
    const currentColor = colors[color] || colors.white;

    return (
        <div className="flex items-center gap-3 select-none">
            <div className={`flex items-center justify-center rounded-xl ${currentColor.bg} backdrop-blur-sm p-2 shadow-lg`}>
                <Leaf className={`${currentSize.icon} ${color === 'dark' ? 'text-white' : 'text-emerald-400'}`} strokeWidth={2.5} fill="currentColor" fillOpacity={0.2} />
            </div>
            <div className="flex flex-col">
                <span className={`font-display font-bold ${currentSize.text} ${currentColor.text} leading-none tracking-tight`}>
                    Farm<span className="text-emerald-500">Chain</span>
                </span>
                <span className={`text-[0.6rem] font-medium tracking-[0.2em] uppercase ${color === 'white' ? 'text-emerald-200' : 'text-emerald-700'} mt-0.5`}>
                    Trust Consumed
                </span>
            </div>
        </div>
    );
}
