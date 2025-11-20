// src/components/expenses/BulkSelectionMode.tsx
import { useState } from 'react';

interface BulkSelectionModeProps {
    expenseIds: string[];
    onDelete: (ids: string[]) => void;
    onCancel: () => void;
}

export default function BulkSelectionMode({ expenseIds, onDelete, onCancel }: BulkSelectionModeProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleSelectAll = () => {
        if (selectedIds.size === expenseIds.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(expenseIds));
        }
    };

    const handleDelete = () => {
        if (selectedIds.size > 0) {
            if (confirm(`Delete ${selectedIds.size} expense(s)?`)) {
                onDelete(Array.from(selectedIds));
                onCancel();
            }
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-20 bg-primary text-white shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="flex items-center justify-center">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <span className="font-semibold">
                        {selectedIds.size} selected
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleSelectAll}
                        className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
                    >
                        {selectedIds.size === expenseIds.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={selectedIds.size === 0}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedIds.size > 0
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-white/10 text-white/50 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm mr-1">delete</span>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export { type BulkSelectionModeProps };

// eslint-disable-next-line react-refresh/only-export-components
export function useSelection(expenseIds: string[]) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === expenseIds.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(expenseIds));
        }
    };

    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    return {
        selectedIds,
        toggleSelection,
        toggleSelectAll,
        clearSelection,
        isSelected: (id: string) => selectedIds.has(id),
        hasSelection: selectedIds.size > 0,
    };
}
