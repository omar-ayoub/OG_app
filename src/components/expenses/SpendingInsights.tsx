// src/components/expenses/SpendingInsights.tsx
import { useMemo } from 'react';
import { useExpenses } from '../../contexts/useExpenses';

export default function SpendingInsights() {
    const { categories, budgets, getExpensesByPeriod } = useExpenses();

    const insights = useMemo(() => {
        const currentMonthExpenses = getExpensesByPeriod('monthly');
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        // Note: getExpensesByPeriod defaults to current date, we'd need to extend it or filter manually for strict "last month"
        // For simplicity in this MVP, we'll compare current week vs last week which is easier with available helpers

        // 1. Top Spending Category
        const categoryTotals: Record<string, number> = {};
        currentMonthExpenses.forEach(e => {
            categoryTotals[e.categoryId] = (categoryTotals[e.categoryId] || 0) + e.amount;
        });

        const sortedCategories = Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a);

        const topCategory = sortedCategories.length > 0
            ? {
                name: categories.find(c => c.id === sortedCategories[0][0])?.name || 'Unknown',
                amount: sortedCategories[0][1]
            }
            : null;

        // 2. Budget Health
        const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
        const totalSpent = currentMonthExpenses.reduce((acc, e) => acc + e.amount, 0);
        const budgetHealth = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

        // 3. Quick Stat (e.g., average daily spend)
        const daysInMonth = new Date().getDate(); // Days passed so far
        const dailyAverage = daysInMonth > 0 ? totalSpent / daysInMonth : 0;

        return {
            topCategory,
            budgetHealth,
            totalSpent,
            dailyAverage
        };
    }, [categories, budgets, getExpensesByPeriod]);

    if (!insights.totalSpent) return null;

    return (
        <div className="grid grid-cols-1 gap-4 mb-6">
            <h3 className="heading-section">Insights</h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Top Category Card */}
                {insights.topCategory && (
                    <div className="card bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary">star</span>
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Top Category</p>
                        </div>
                        <p className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary truncate">
                            {insights.topCategory.name}
                        </p>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                            ${insights.topCategory.amount.toFixed(0)} spent
                        </p>
                    </div>
                )}

                {/* Daily Average Card */}
                <div className="card bg-blue-500/5 border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-blue-500">calendar_today</span>
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Daily Avg</p>
                    </div>
                    <p className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                        ${insights.dailyAverage.toFixed(0)}
                    </p>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                        per day
                    </p>
                </div>
            </div>

            {/* Budget Health Alert */}
            {insights.budgetHealth > 90 && (
                <div className="card bg-red-500/10 border-red-500/20 flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 mt-1">warning</span>
                    <div>
                        <p className="font-bold text-red-600 dark:text-red-400">Budget Alert</p>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                            You've used {insights.budgetHealth.toFixed(0)}% of your total monthly budget.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
