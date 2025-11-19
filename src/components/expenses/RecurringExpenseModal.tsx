// src/components/expenses/RecurringExpenseModal.tsx
import { useState, useEffect } from 'react';
import { useExpenses } from '../../contexts/useExpenses';
import { type RecurringExpense } from '../../types';
import PaymentMethodPicker from './PaymentMethodPicker';

interface RecurringExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingExpense?: RecurringExpense | null;
}

export default function RecurringExpenseModal({ isOpen, onClose, editingExpense }: RecurringExpenseModalProps) {
    const { addRecurringExpense, updateRecurringExpense, categories, paymentMethods } = useExpenses();

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
    const [startDate, setStartDate] = useState('');

    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showPaymentPicker, setShowPaymentPicker] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (editingExpense) {
                setAmount(editingExpense.amount.toString());
                setDescription(editingExpense.description || '');
                setCategoryId(editingExpense.categoryId);
                setPaymentMethodId(editingExpense.paymentMethodId || paymentMethods[0]?.id || '');
                setFrequency(editingExpense.frequency);
                setStartDate(editingExpense.startDate);
            } else {
                setAmount('');
                setDescription('');
                setCategoryId(categories[0]?.id || '');
                setPaymentMethodId(paymentMethods[0]?.id || '');
                setFrequency('monthly');
                setStartDate(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, editingExpense, categories, paymentMethods]);

    const handleSave = () => {
        if (!amount || parseFloat(amount) <= 0 || !categoryId || !startDate) return;

        const expenseData = {
            amount: parseFloat(amount),
            categoryId,
            paymentMethodId,
            frequency,
            startDate,
            description: description.trim() || undefined,
            isActive: true,
            lastGenerated: editingExpense?.lastGenerated
        };

        if (editingExpense) {
            updateRecurringExpense(editingExpense.id, expenseData);
        } else {
            addRecurringExpense(expenseData);
        }
        onClose();
    };

    const selectedCategory = categories.find(c => c.id === categoryId);
    const selectedPaymentMethod = paymentMethods.find(p => p.id === paymentMethodId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
            {/* Category Picker */}
            {showCategoryPicker && (
                <div className="absolute inset-0 bg-black/50 z-10" onClick={() => setShowCategoryPicker(false)}>
                    <div className="absolute bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark rounded-t-xl p-6 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="heading-section mb-4">Select Category</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setCategoryId(category.id);
                                        setShowCategoryPicker(false);
                                    }}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${categoryId === category.id
                                        ? 'bg-primary/20 ring-2 ring-primary'
                                        : 'bg-card-light dark:bg-card-dark hover:bg-input-light dark:hover:bg-input-dark'
                                        }`}
                                >
                                    <div
                                        className="flex items-center justify-center size-12 rounded-full"
                                        style={{ backgroundColor: `${category.color}20` }}
                                    >
                                        <span className="material-symbols-outlined" style={{ color: category.color }}>
                                            {category.icon}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-center">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Picker */}
            {showPaymentPicker && (
                <PaymentMethodPicker
                    selectedId={paymentMethodId}
                    onSelect={setPaymentMethodId}
                    onClose={() => setShowPaymentPicker(false)}
                />
            )}

            {/* Main Modal */}
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
                        {editingExpense ? 'Edit Recurring' : 'New Recurring'}
                    </h2>
                    <button
                        onClick={handleSave}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className={`w-16 text-right text-base font-bold ${amount && parseFloat(amount) > 0 ? 'text-primary opacity-100' : 'text-primary opacity-50'
                            }`}
                    >
                        Save
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-4 pt-2 max-h-[70vh] overflow-y-auto">
                    {/* Amount */}
                    <div className="card">
                        <label className="flex flex-col w-full">
                            <p className="pb-2 text-base font-medium">Amount</p>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-3xl font-bold text-text-light-secondary dark:text-text-dark-secondary">$</span>
                                <input
                                    className="input-field h-20 pl-12 pr-4 text-right text-4xl font-bold"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </label>
                    </div>

                    {/* Details */}
                    <div className="card divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Category */}
                        <button
                            onClick={() => setShowCategoryPicker(true)}
                            className="flex min-h-14 items-center justify-between gap-4 py-3 active:bg-input-light dark:active:bg-input-dark rounded-t-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-input-light dark:bg-input-dark">
                                    <span className="material-symbols-outlined">sell</span>
                                </div>
                                <p className="flex-1 truncate text-base font-normal">Category</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedCategory && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm" style={{ color: selectedCategory.color }}>
                                            {selectedCategory.icon}
                                        </span>
                                        <p className="text-base font-normal">{selectedCategory.name}</p>
                                    </div>
                                )}
                                <span className="material-symbols-outlined text-text-light-secondary">chevron_right</span>
                            </div>
                        </button>

                        {/* Frequency */}
                        <div className="flex min-h-14 items-center justify-between gap-4 py-3">
                            <div className="flex items-center gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-input-light dark:bg-input-dark">
                                    <span className="material-symbols-outlined">update</span>
                                </div>
                                <p className="flex-1 truncate text-base font-normal">Frequency</p>
                            </div>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value as any)}
                                className="bg-transparent text-right font-medium focus:outline-none"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div className="flex min-h-14 items-center justify-between gap-4 py-3">
                            <div className="flex items-center gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-input-light dark:bg-input-dark">
                                    <span className="material-symbols-outlined">calendar_today</span>
                                </div>
                                <p className="flex-1 truncate text-base font-normal">Start Date</p>
                            </div>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input-field h-auto py-2 px-3 text-sm"
                            />
                        </div>

                        {/* Payment Method */}
                        <button
                            onClick={() => setShowPaymentPicker(true)}
                            className="flex min-h-14 items-center justify-between gap-4 py-3 active:bg-input-light dark:active:bg-input-dark rounded-b-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-input-light dark:bg-input-dark">
                                    <span className="material-symbols-outlined">payment</span>
                                </div>
                                <p className="flex-1 truncate text-base font-normal">Payment</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-base font-normal">{selectedPaymentMethod?.name || 'Select'}</p>
                                <span className="material-symbols-outlined text-text-light-secondary">chevron_right</span>
                            </div>
                        </button>
                    </div>

                    {/* Description */}
                    <div className="card">
                        <textarea
                            className="input-textarea w-full"
                            placeholder="Description (e.g., Netflix Subscription)"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* Bottom Padding */}
                <div className="h-8 w-full" />
            </div>
        </div>
    );
}
