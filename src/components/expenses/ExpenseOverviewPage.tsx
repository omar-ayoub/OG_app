// src/components/expenses/ExpenseOverviewPage.tsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../../contexts/useExpenses';
import { type ExpensePeriod, type ExpenseSortBy, type ExpenseSortOrder } from '../../types';
import BottomNavBar from '../layout/BottomNavBar';
import AddExpenseModal from './AddExpenseModal';
import SearchAndFilterBar from './SearchAndFilterBar';

export default function ExpenseOverviewPage() {
    const navigate = useNavigate();
    const { categories, getExpensesByPeriod, getTotalSpent, getSpendingTrend } = useExpenses();

    // State
    const [selectedPeriod, setSelectedPeriod] = useState<ExpensePeriod>('weekly');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
    const [sortBy, setSortBy] = useState<ExpenseSortBy>('date');
    const [sortOrder, setSortOrder] = useState<ExpenseSortOrder>('desc');

    // Derived Data
    const periodExpenses = getExpensesByPeriod(selectedPeriod);
    const totalSpent = getTotalSpent(selectedPeriod);
    const weeklyTrend = getSpendingTrend(7);
    const maxSpending = Math.max(...weeklyTrend.map(d => d.amount), 1);

    // Filter and Sort Logic
    const filteredAndSortedExpenses = useMemo(() => {
        let result = [...periodExpenses];

        // 1. Filter by Category
        if (selectedCategoryFilter) {
            result = result.filter(e => e.categoryId === selectedCategoryFilter);
        }

        // 2. Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(e =>
                (e.description?.toLowerCase() || '').includes(query) ||
                categories.find(c => c.id === e.categoryId)?.name.toLowerCase().includes(query)
            );
        }

        // 3. Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    if (comparison === 0) {
                        comparison = a.time.localeCompare(b.time);
                    }
                    break;
                case 'amount':
                    comparison = a.amount - b.amount;
                    break;
                case 'category':
                    const catA = categories.find(c => c.id === a.categoryId)?.name || '';
                    const catB = categories.find(c => c.id === b.categoryId)?.name || '';
                    comparison = catA.localeCompare(catB);
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [periodExpenses, selectedCategoryFilter, searchQuery, sortBy, sortOrder, categories]);

    // Group expenses by date (only if sorting by date)
    const groupedExpenses = useMemo(() => {
        if (sortBy !== 'date') return null;

        const grouped: { [date: string]: typeof periodExpenses } = {};
        filteredAndSortedExpenses.forEach(expense => {
            if (!grouped[expense.date]) {
                grouped[expense.date] = [];
            }
            grouped[expense.date].push(expense);
        });
        return grouped;
    }, [filteredAndSortedExpenses, sortBy]);

    const formatDateLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getDayLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <div className="page-container">
            {/* Header */}
            <header className="app-bar relative">
                <div className="flex items-center justify-between pb-2">
                    <button onClick={() => navigate('/')} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="heading-page flex-1 text-center">Expenses</h1>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>

                {/* Dropdown Menu */}
                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                        <div className="absolute right-4 top-12 z-20 w-48 rounded-xl bg-card-light dark:bg-card-dark shadow-xl border border-gray-100 dark:border-gray-800 py-1">
                            <button
                                onClick={() => {
                                    navigate('/expense-categories');
                                    setShowMenu(false);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <span className="material-symbols-outlined text-text-light-secondary">category</span>
                                Manage Categories
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/expense-budgets');
                                    setShowMenu(false);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <span className="material-symbols-outlined text-text-light-secondary">trending_up</span>
                                Budgets
                            </button>
                        </div>
                    </>
                )}
            </header>

            {/* Main Content */}
            <main className="content-main pb-24">
                {/* Period Selector */}
                <div className="flex py-3">
                    <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-gray-200/50 dark:bg-card-dark p-1">
                        {(['daily', 'weekly', 'monthly'] as ExpensePeriod[]).map((period) => (
                            <label
                                key={period}
                                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all duration-200 ${selectedPeriod === period
                                        ? 'bg-card-light dark:bg-background-dark shadow-sm text-text-light-primary dark:text-text-dark-primary'
                                        : 'text-text-light-secondary dark:text-text-dark-secondary'
                                    }`}
                            >
                                <span className="truncate capitalize">{period}</span>
                                <input
                                    className="invisible w-0"
                                    name="period-toggle"
                                    type="radio"
                                    value={period}
                                    checked={selectedPeriod === period}
                                    onChange={() => setSelectedPeriod(period)}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="card my-4">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                        Total spent this {selectedPeriod === 'daily' ? 'day' : selectedPeriod === 'weekly' ? 'week' : 'month'}
                    </p>
                    <h2 className="text-text-light-primary dark:text-text-dark-primary text-4xl font-bold leading-tight my-2">
                        ${totalSpent.toFixed(2)}
                    </h2>

                    {/* Bar Chart */}
                    {selectedPeriod === 'weekly' && (
                        <div className="grid min-h-[100px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center pt-4">
                            {weeklyTrend.map((day, idx) => {
                                const height = day.amount > 0 ? (day.amount / maxSpending) * 100 : 5;
                                return (
                                    <div key={idx} className="flex flex-col items-center w-full gap-2">
                                        <div className="bg-gray-200 dark:bg-gray-700 w-full rounded-full relative" style={{ height: '100px' }}>
                                            <div
                                                className="bg-primary w-full rounded-full absolute bottom-0 transition-all duration-300"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-bold tracking-wide">
                                            {getDayLabel(day.date)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Search and Filter */}
                <SearchAndFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategoryFilter={selectedCategoryFilter}
                    onCategoryFilterChange={setSelectedCategoryFilter}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                />

                {/* Expense List */}
                <div className="space-y-4">
                    {filteredAndSortedExpenses.length === 0 ? (
                        <div className="card text-center py-8">
                            <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">
                                receipt_long
                            </span>
                            <p className="text-text-light-secondary dark:text-text-dark-secondary">
                                No expenses found
                            </p>
                        </div>
                    ) : groupedExpenses ? (
                        // Grouped View (Date Sort)
                        Object.entries(groupedExpenses)
                            .sort(([dateA], [dateB]) => {
                                const timeA = new Date(dateA).getTime();
                                const timeB = new Date(dateB).getTime();
                                return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
                            })
                            .map(([date, dateExpenses]) => (
                                <div key={date}>
                                    <h3 className="heading-section mt-6 mb-3">{formatDateLabel(date)}</h3>
                                    {dateExpenses.map((expense) => {
                                        const category = categories.find(c => c.id === expense.categoryId);
                                        return (
                                            <div
                                                key={expense.id}
                                                className="card-interactive mb-3 flex items-center space-x-4"
                                                onClick={() => navigate(`/expense-details/${expense.id}`)}
                                            >
                                                <div
                                                    className="flex items-center justify-center size-12 rounded-full"
                                                    style={{ backgroundColor: `${category?.color}20` }}
                                                >
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{ color: category?.color }}
                                                    >
                                                        {category?.icon || 'receipt'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                                                        {expense.description || category?.name || 'Expense'}
                                                    </p>
                                                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                                                        {expense.time}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-red-500 text-lg">
                                                    -${expense.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                    ) : (
                        // Flat List View (Other Sorts)
                        filteredAndSortedExpenses.map((expense) => {
                            const category = categories.find(c => c.id === expense.categoryId);
                            return (
                                <div
                                    key={expense.id}
                                    className="card-interactive mb-3 flex items-center space-x-4"
                                    onClick={() => navigate(`/expense-details/${expense.id}`)}
                                >
                                    <div
                                        className="flex items-center justify-center size-12 rounded-full"
                                        style={{ backgroundColor: `${category?.color}20` }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ color: category?.color }}
                                        >
                                            {category?.icon || 'receipt'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                                            {expense.description || category?.name || 'Expense'}
                                        </p>
                                        <div className="flex gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{expense.time}</span>
                                        </div>
                                    </div>
                                    <p className="font-bold text-red-500 text-lg">
                                        -${expense.amount.toFixed(2)}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* FAB */}
            <div className="fixed bottom-20 right-6 z-10">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center size-16 bg-gradient-to-br from-[#4FD1C5] to-[#3B82F6] rounded-full shadow-lg text-white hover:scale-105 transition-transform"
                >
                    <span className="material-symbols-outlined !text-4xl">add</span>
                </button>
            </div>

            {/* Bottom Navigation */}
            <BottomNavBar />

            {/* Add Expense Modal */}
            <AddExpenseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
