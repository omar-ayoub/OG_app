// src/components/expenses/ExpenseDetailsPage.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../../contexts/useExpenses';
import EditExpenseModal from './EditExpenseModal';

export default function ExpenseDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { expenses, categories, paymentMethods, deleteExpense } = useExpenses();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const expense = expenses.find(e => e.id === id);
    const category = expense ? categories.find(c => c.id === expense.categoryId) : null;
    const paymentMethod = expense?.paymentMethodId
        ? paymentMethods.find(p => p.id === expense.paymentMethodId)
        : null;

    if (!expense) {
        return (
            <div className="page-container">
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <span className="material-symbols-outlined text-6xl text-text-light-secondary">error</span>
                    <p className="text-text-light-secondary">Expense not found</p>
                    <button onClick={() => navigate('/expenses')} className="btn-primary">
                        Back to Expenses
                    </button>
                </div>
            </div>
        );
    }

    const handleDelete = () => {
        deleteExpense(expense.id);
        navigate('/expenses');
    };

    return (
        <div className="page-container">
            {/* Header */}
            <header className="app-bar">
                <div className="flex items-center justify-between pb-2">
                    <button onClick={() => navigate('/expenses')} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="heading-page flex-1 text-center">Expense Details</h1>
                    <button onClick={() => setIsEditModalOpen(true)} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="content-main pb-24">
                {/* Amount Card */}
                <div className="card my-4 text-center">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-2">
                        Amount Spent
                    </p>
                    <h2 className="text-5xl font-bold text-red-500 mb-4">
                        ${expense.amount.toFixed(2)}
                    </h2>
                    {category && (
                        <div className="flex items-center justify-center gap-3">
                            <div
                                className="flex items-center justify-center size-12 rounded-full"
                                style={{ backgroundColor: `${category.color}20` }}
                            >
                                <span className="material-symbols-outlined" style={{ color: category.color }}>
                                    {category.icon}
                                </span>
                            </div>
                            <span className="text-lg font-semibold">{category.name}</span>
                        </div>
                    )}
                </div>

                {/* Details Card */}
                <div className="card divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Date */}
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-text-light-secondary">calendar_today</span>
                            <span className="font-medium">Date</span>
                        </div>
                        <span className="text-text-light-secondary">
                            {new Date(expense.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-text-light-secondary">schedule</span>
                            <span className="font-medium">Time</span>
                        </div>
                        <span className="text-text-light-secondary">{expense.time}</span>
                    </div>

                    {/* Payment Method */}
                    {paymentMethod && (
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-text-light-secondary">payment</span>
                                <span className="font-medium">Payment Method</span>
                            </div>
                            <span className="text-text-light-secondary">{paymentMethod.name}</span>
                        </div>
                    )}

                    {/* Description */}
                    {expense.description && (
                        <div className="flex flex-col gap-2 py-4">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-text-light-secondary">description</span>
                                <span className="font-medium">Note</span>
                            </div>
                            <p className="text-text-light-secondary pl-10">{expense.description}</p>
                        </div>
                    )}

                    {/* Tags */}
                    {expense.tags && expense.tags.length > 0 && (
                        <div className="flex flex-col gap-2 py-4">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-text-light-secondary">label</span>
                                <span className="font-medium">Tags</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-10">
                                {expense.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Button */}
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-danger w-full mt-6"
                >
                    <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">delete</span>
                        Delete Expense
                    </span>
                </button>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="card m-4 max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="heading-section mb-4">Delete Expense?</h3>
                        <p className="text-text-light-secondary mb-6">
                            This action cannot be undone. The expense will be permanently deleted.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="btn-danger flex-1">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            <EditExpenseModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                expenseId={expense.id}
            />
        </div>
    );
}
