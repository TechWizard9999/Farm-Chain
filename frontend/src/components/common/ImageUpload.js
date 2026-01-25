'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ 
    value, 
    onChange, 
    maxSizeMB = 5,
    accept = "image/*",
    label = "Upload Image"
}) {
    const [preview, setPreview] = useState(value || null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');

        // Check file size
        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setUploading(true);

        try {
            // Convert to base64
            const base64 = await fileToBase64(file);
            setPreview(base64);
            onChange(base64);
        } catch (err) {
            setError('Failed to process image');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleRemove = () => {
        setPreview(null);
        onChange('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">{label}</label>
            
            {preview ? (
                <div className="relative inline-block">
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full max-w-xs h-40 object-cover rounded-xl border border-stone-200"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    className="w-full border-2 border-dashed border-stone-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                    {uploading ? (
                        <div className="animate-pulse">
                            <ImageIcon className="w-10 h-10 mx-auto text-stone-400 mb-2" />
                            <p className="text-stone-500">Processing...</p>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-10 h-10 mx-auto text-stone-400 mb-2" />
                            <p className="text-stone-600 font-medium">Click to upload</p>
                            <p className="text-stone-400 text-sm">Max {maxSizeMB}MB</p>
                        </>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
}
