// src/components/expenses/AddExpenseModal.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../../contexts/useExpenses';
import TagInput from './TagInput';
import ReceiptUpload from './ReceiptUpload';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
    const navigate = useNavigate();
    const { addExpense, categories, paymentMethods } = useExpenses();
    const [amount, setAmount] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>(undefined);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showPaymentPicker, setShowPaymentPicker] = useState(false);

    // Initialize with today's date and current time
    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            setSelectedDate(now.toISOString().split('T')[0]);
            setSelectedTime(now.toTimeString().slice(0, 5));
            setSelectedCategoryId(categories[0]?.id || '');
            setSelectedPaymentMethodId(paymentMethods[0]?.id || '');
            setTags([]);
            setAttachmentUrl(undefined);
        }
    }, [isOpen, categories, paymentMethods]);

    const handleSave = () => {
        if (!amount || parseFloat(amount) <= 0) return;

        addExpense({
            amount: parseFloat(amount),
            categoryId: selectedCategoryId,
            date: selectedDate,
            time: selectedTime,
            description: description.trim() || undefined,
            paymentMethodId: selectedPaymentMethodId || undefined,
            tags: tags.length > 0 ? tags : undefined,
            attachmentUrl,
        });

        // Reset form
        setAmount('');
        setAmount('');
        setDescription('');
        setTags([]);
        setAttachmentUrl(undefined);
        onClose();
    };

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPaymentMethodId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
            {/* Category Picker Modal */}
            {showCategoryPicker && (
                <div className="absolute inset-0 bg-black/50 z-10" onClick={() => setShowCategoryPicker(false)}>
                    <div className="absolute bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark rounded-t-xl p-6 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="heading-section">Select Category</h3>
                            <button
                                onClick={() => {
                                    navigate('/expense-categories');
                                    onClose();
                                }}
                                className="text-sm text-primary font-medium"
                            >
                                Manage
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setSelectedCategoryId(category.id);
                                        setShowCategoryPicker(false);
                                    }}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selectedCategoryId === category.id
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

            {/* Payment Method Picker Modal */}
            {showPaymentPicker && (
                <div className="absolute inset-0 bg-black/50 z-10" onClick={() => setShowPaymentPicker(false)}>
                    <div className="absolute bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark rounded-t-xl p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="heading-section mb-4">Payment Method</h3>
                        <div className="space-y-2">
                            {paymentMethods.map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => {
                                        setSelectedPaymentMethodId(method.id);
                                        setShowPaymentPicker(false);
                                    }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${selectedPaymentMethodId === method.id
                                        ? 'bg-primary/20 ring-2 ring-primary'
                                        : 'bg-card-light dark:bg-card-dark hover:bg-input-light dark:hover:bg-input-dark'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{method.icon}</span>
                                    <span className="font-medium">{method.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
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
                        New Expense
                    </h2>
                    <button
                        onClick={handleSave}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className={`w-16 text-right text-base font-bold ${amount && parseFloat(amount) > 0
                            ? 'text-primary opacity-100'
                            : 'text-primary opacity-50'
                            }`}
                    >
                        Add
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-4 pt-2 max-h-[70vh] overflow-y-auto">
                    {/* Amount Input */}
                    <div className="card">
                        <label className="flex flex-col w-full">
                            <p className="pb-2 text-base font-medium">Amount</p>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-3xl font-bold text-text-light-secondary dark:text-text-dark-secondary">
                                    $
                                </span>
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

                    {/* Details Section */}
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

                        {/* Date */}
                        <div className="flex min-h-14 items-center justify-between gap-4 py-3">
                            <div className="flex items-center gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-input-light dark:bg-input-dark">
                                    <span className="material-symbols-outlined">calendar_today</span>
                                </div>
                                <p className="flex-1 truncate text-base font-normal">Date</p>
                            </div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input-field h-auto py-2 px-3 text-sm"
                            />
                        </div>

                        {/* Time */}
                        <div className="flex min-h-14 items-center justify-between gap-4 py-3">
                            <div className="flex items-center gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-input-light dark:bg-input-dark">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <p className="flex-1 truncate text-base font-normal">Time</p>
                            </div>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
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
                            placeholder="Add a note..."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Tags */}
                    <TagInput tags={tags} onChange={setTags} />

                    {/* Receipt */}
                    <ReceiptUpload
                        attachmentUrl={attachmentUrl}
                        onUpload={setAttachmentUrl}
                        onRemove={() => setAttachmentUrl(undefined)}
                    />
                </div>

                {/* Bottom Padding */}
                <div className="h-8 w-full" />
            </div>
        </div>
    );
}
