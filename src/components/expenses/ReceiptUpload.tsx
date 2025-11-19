// src/components/expenses/ReceiptUpload.tsx
import { useRef } from 'react';

interface ReceiptUploadProps {
    attachmentUrl?: string;
    onUpload: (url: string) => void;
    onRemove: () => void;
}

export default function ReceiptUpload({ attachmentUrl, onUpload, onRemove }: ReceiptUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // In a real app, we would upload to a server/storage.
            // For this local-first app, we'll use FileReader to create a data URL.
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {attachmentUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img
                        src={attachmentUrl}
                        alt="Receipt"
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            onClick={() => window.open(attachmentUrl, '_blank')}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                        >
                            <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button
                            onClick={onRemove}
                            className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-full h-14 gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-text-light-secondary dark:text-text-dark-secondary hover:border-primary hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined">attach_file</span>
                    <span className="text-sm font-medium">Add Receipt</span>
                </button>
            )}
        </div>
    );
}
