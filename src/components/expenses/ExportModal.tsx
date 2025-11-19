// src/components/expenses/ExportModal.tsx
import { useState } from 'react';
import { useExpenses } from '../../contexts/useExpenses';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
    const { exportToCSV, exportToPDF } = useExpenses();
    const [format, setFormat] = useState<'csv' | 'pdf'>('csv');

    const handleExport = () => {
        if (format === 'csv') {
            exportToCSV();
        } else {
            exportToPDF();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
            <div className="w-full max-w-lg flex flex-col overflow-hidden rounded-t-xl bg-background-light dark:bg-background-dark">
                {/* Handle */}
                <div className="flex h-5 w-full items-center justify-center pt-3 pb-2">
                    <div className="h-1 w-9 rounded-full bg-gray-300 dark:bg-gray-700" />
                </div>

                {/* Header */}
                <div className="flex items-center px-4 pt-2 pb-4">
                    <button onClick={onClose} className="w-16 text-left text-primary">
                        <span className="text-base font-medium">Cancel</span>
                    </button>
                    <h2 className="flex-1 text-center text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                        Export Expenses
                    </h2>
                    <button
                        onClick={handleExport}
                        className="w-16 text-right text-base font-bold text-primary"
                    >
                        Export
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-4 pt-2 max-h-[70vh] overflow-y-auto">
                    {/* Format Selection */}
                    <div className="card">
                        <p className="pb-2 text-base font-medium">Export Format</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFormat('csv')}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${format === 'csv'
                                        ? 'bg-primary text-white'
                                        : 'bg-input-light dark:bg-input-dark text-text-light-primary dark:text-text-dark-primary'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm mr-2">table_chart</span>
                                CSV
                            </button>
                            <button
                                onClick={() => setFormat('pdf')}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${format === 'pdf'
                                        ? 'bg-primary text-white'
                                        : 'bg-input-light dark:bg-input-dark text-text-light-primary dark:text-text-dark-primary'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm mr-2">picture_as_pdf</span>
                                PDF
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            {format === 'csv'
                                ? 'CSV files can be opened in Excel, Google Sheets, or any spreadsheet application.'
                                : 'PDF files will include a formatted table of your expenses with totals.'}
                        </p>
                    </div>
                </div>

                {/* Bottom Padding */}
                <div className="h-8 w-full" />
            </div>
        </div>
    );
}
