// src/components/expenses/RecurringExpensesPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../../contexts/useExpenses';
import { type RecurringExpense } from '../../types';
import RecurringExpenseModal from './RecurringExpenseModal';

export default function RecurringExpensesPage() {
    const navigate = useNavigate();
    const { recurringExpenses, deleteRecurringExpense, updateRecurringExpense, categories } = useExpenses();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);

    const handleEdit = (expense: RecurringExpense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this recurring expense?')) {
            deleteRecurringExpense(id);
        }
    };

    const toggleActive = (expense: RecurringExpense) => {
        updateRecurringExpense(expense.id, { isActive: !expense.isActive });
    };

    return (
        <div className="page-container">
            <header className="app-bar">
                <div className="flex items-center justify-between pb-2">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="heading-page flex-1 text-center">Recurring Expenses</h1>
                    <div className="size-10" />
                </div>
            </header>

            <main className="content-main pb-24">
                {recurringExpenses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <span className="material-symbols-outlined text-4xl text-gray-400">update</span>
                        </div>
                        <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">
                            No recurring expenses
                        </h3>
                        <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2 max-w-xs">
                            Add subscriptions, bills, or other regular payments to track them automatically.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recurringExpenses.map((expense) => {
                            const category = categories.find(c => c.id === expense.categoryId);
                            return (
                                <div key={expense.id} className={`card ${!expense.isActive ? 'opacity-60' : ''}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex items-center justify-center size-10 rounded-full"
                                                style={{ backgroundColor: `${category?.color}20` }}
                                            >
                                                <span className="material-symbols-outlined text-sm" style={{ color: category?.color }}>
                                                    {category?.icon || 'receipt'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                                                    {expense.description || category?.name}
                                                </h3>
                                                <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary capitalize">
                                                    {expense.frequency} • Next: {new Date(expense.startDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-lg text-text-light-primary dark:text-text-dark-primary">
                                            ${expense.amount.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={expense.isActive}
                                                    onChange={() => toggleActive(expense)}
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                <span className="ml-2 text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary">
                                                    {expense.isActive ? 'Active' : 'Paused'}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(expense)}
                                                className="p-2 text-text-light-secondary hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="p-2 text-text-light-secondary hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* FAB */}
            <div className="fixed bottom-6 right-6 z-10">
                <button
                    onClick={() => {
                        setEditingExpense(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center size-14 bg-primary rounded-full shadow-lg text-white hover:scale-105 transition-transform"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </div>

            <RecurringExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingExpense={editingExpense}
            />
        </div>
    );
}
