// src/components/expenses/SearchAndFilterBar.tsx
import { type ExpenseSortBy, type ExpenseSortOrder } from '../../types';
import { useExpenses } from '../../contexts/useExpenses';

interface SearchAndFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategoryFilter: string;
    onCategoryFilterChange: (categoryId: string) => void;
    sortBy: ExpenseSortBy;
    onSortByChange: (sort: ExpenseSortBy) => void;
    sortOrder: ExpenseSortOrder;
    onSortOrderChange: (order: ExpenseSortOrder) => void;
}

export default function SearchAndFilterBar({
    searchQuery,
    onSearchChange,
    selectedCategoryFilter,
    onCategoryFilterChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
}: SearchAndFilterBarProps) {
    const { categories } = useExpenses();

    return (
        <div className="space-y-3 mb-4">
            {/* Search Input */}
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary material-symbols-outlined">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="input-field pl-10 py-2 h-10 text-sm w-full"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light-secondary hover:text-primary"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                )}
            </div>

            {/* Filters Row */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {/* Category Filter */}
                <select
                    value={selectedCategoryFilter}
                    onChange={(e) => onCategoryFilterChange(e.target.value)}
                    className="h-8 px-3 rounded-lg bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-xs font-medium min-w-[100px]"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                {/* Sort By */}
                <select
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value as ExpenseSortBy)}
                    className="h-8 px-3 rounded-lg bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-xs font-medium min-w-[90px]"
                >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="category">Category</option>
                </select>

                {/* Sort Order */}
                <button
                    onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="h-8 px-3 rounded-lg bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 flex items-center gap-1"
                >
                    <span className="text-xs font-medium">{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
                    <span className="material-symbols-outlined text-sm">
                        {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                </button>
            </div>
        </div>
    );
}
