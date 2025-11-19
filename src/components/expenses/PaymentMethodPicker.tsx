// src/components/expenses/PaymentMethodPicker.tsx
import { useExpenses } from '../../contexts/useExpenses';

interface PaymentMethodPickerProps {
    selectedId: string;
    onSelect: (id: string) => void;
    onClose: () => void;
}

export default function PaymentMethodPicker({ selectedId, onSelect, onClose }: PaymentMethodPickerProps) {
    const { paymentMethods } = useExpenses();

    return (
        <div className="absolute inset-0 bg-black/50 z-10" onClick={onClose}>
            <div
                className="absolute bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark rounded-t-xl p-6"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="heading-section mb-4">Payment Method</h3>
                <div className="space-y-2">
                    {paymentMethods.map(method => (
                        <button
                            key={method.id}
                            onClick={() => {
                                onSelect(method.id);
                                onClose();
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${selectedId === method.id
                                    ? 'bg-primary/20 ring-2 ring-primary'
                                    : 'bg-card-light dark:bg-card-dark hover:bg-input-light dark:hover:bg-input-dark'
                                }`}
                        >
                            <span className="material-symbols-outlined">{method.icon}</span>
                            <span className="font-medium text-text-light-primary dark:text-text-dark-primary">{method.name}</span>
                            {selectedId === method.id && (
                                <span className="material-symbols-outlined text-primary ml-auto">check</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
