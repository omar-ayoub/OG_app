// src/components/expenses/BudgetManagementPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../../contexts/useExpenses';
import { type Budget } from '../../types';

export default function BudgetManagementPage() {
    const navigate = useNavigate();
    const { budgets, categories, addBudget, updateBudget, deleteBudget, getCategorySpending } = useExpenses();
    const [isAddingBudget, setIsAddingBudget] = useState(false);
    const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');

    // Get spending for current period
    const categorySpending = getCategorySpending(period);

    const handleSave = () => {
        if (!selectedCategoryId || !amount || parseFloat(amount) <= 0) return;

        if (editingBudgetId) {
            updateBudget(editingBudgetId, {
                categoryId: selectedCategoryId,
                amount: parseFloat(amount),
                period,
            });
            setEditingBudgetId(null);
        } else {
            addBudget({
                categoryId: selectedCategoryId,
                amount: parseFloat(amount),
                period,
                startDate: new Date().toISOString().split('T')[0],
            });
            setIsAddingBudget(false);
        }

        // Reset form
        setSelectedCategoryId('');
        setAmount('');
        setPeriod('monthly');
    };

    const handleEdit = (budget: Budget) => {
        setEditingBudgetId(budget.id);
        setSelectedCategoryId(budget.categoryId);
        setAmount(budget.amount.toString());
        setPeriod(budget.period);
        setIsAddingBudget(false);
    };

    const handleDelete = (budgetId: string) => {
        if (window.confirm('Delete this budget?')) {
            deleteBudget(budgetId);
        }
    };

    const calculateProgress = (budget: Budget) => {
        const spent = categorySpending[budget.categoryId] || 0;
        const percentage = (spent / budget.amount) * 100;
        return { spent, percentage: Math.min(percentage, 100) };
    };

    return (
        <div className="page-container">
            <header className="app-bar">
                <div className="flex items-center justify-between pb-2">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="heading-page flex-1 text-center">Budgets</h1>
                    <div className="size-10" />
                </div>
            </header>

            <main className="content-main pb-24">
                {/* Add New Budget Button */}
                {!isAddingBudget && !editingBudgetId && (
                    <button
                        onClick={() => setIsAddingBudget(true)}
                        className="btn-primary w-full mb-6 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Set Budget
                    </button>
                )}

                {/* Add/Edit Budget Form */}
                {(isAddingBudget || editingBudgetId) && (
                    <div className="card mb-6 border-2 border-primary/20">
                        <h3 className="heading-section mb-4">
                            {editingBudgetId ? 'Edit Budget' : 'New Budget'}
                        </h3>

                        <div className="space-y-4">
                            {/* Category Selection */}
                            <div>
                                <label className="text-sm font-medium text-text-light-secondary mb-1 block">Category</label>
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    className="input-field w-full"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="text-sm font-medium text-text-light-secondary mb-1 block">Budget Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-text-light-secondary">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="input-field w-full pl-8"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Period */}
                            <div>
                                <label className="text-sm font-medium text-text-light-secondary mb-1 block">Period</label>
                                <div className="flex gap-3">
                                    <label className={`flex-1 cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${period === 'weekly'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="period"
                                            value="weekly"
                                            checked={period === 'weekly'}
                                            onChange={() => setPeriod('weekly')}
                                            className="hidden"
                                        />
                                        <span className="font-medium">Weekly</span>
                                    </label>
                                    <label className={`flex-1 cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${period === 'monthly'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="period"
                                            value="monthly"
                                            checked={period === 'monthly'}
                                            onChange={() => setPeriod('monthly')}
                                            className="hidden"
                                        />
                                        <span className="font-medium">Monthly</span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setIsAddingBudget(false);
                                        setEditingBudgetId(null);
                                        setSelectedCategoryId('');
                                        setAmount('');
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!selectedCategoryId || !amount || parseFloat(amount) <= 0}
                                    className="btn-primary flex-1"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Budget List */}
                <div className="space-y-4">
                    {budgets.length === 0 ? (
                        <div className="card text-center py-8">
                            <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">
                                trending_up
                            </span>
                            <p className="text-text-light-secondary dark:text-text-dark-secondary">
                                No budgets set. Start tracking your spending!
                            </p>
                        </div>
                    ) : (
                        budgets.map(budget => {
                            const category = categories.find(c => c.id === budget.categoryId);
                            const { spent, percentage } = calculateProgress(budget);
                            const isOverBudget = spent > budget.amount;

                            return (
                                <div key={budget.id} className="card">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex items-center justify-center size-12 rounded-full"
                                                style={{ backgroundColor: `${category?.color}20` }}
                                            >
                                                <span className="material-symbols-outlined" style={{ color: category?.color }}>
                                                    {category?.icon || 'category'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                                                    {category?.name || 'Unknown'}
                                                </h3>
                                                <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary capitalize">
                                                    {budget.period}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(budget)}
                                                className="p-2 text-text-light-secondary hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(budget.id)}
                                                className="p-2 text-text-light-secondary hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-2">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${isOverBudget
                                                        ? 'bg-red-500'
                                                        : percentage > 80
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Spending Info */}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className={`font-bold ${isOverBudget ? 'text-red-500' : 'text-text-light-primary dark:text-text-dark-primary'}`}>
                                            ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                                        </span>
                                        <span className={`font-medium ${isOverBudget ? 'text-red-500' : 'text-text-light-secondary'}`}>
                                            {isOverBudget ? `${((spent - budget.amount)).toFixed(2)} over` : `${(budget.amount - spent).toFixed(2)} left`}
                                        </span>
                                    </div>

                                    {/* Warning */}
                                    {isOverBudget && (
                                        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
                                            <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">Over budget!</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
