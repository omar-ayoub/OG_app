// src/components/expenses/AnalyticsPage.tsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../../contexts/useExpenses';
import SpendingInsights from './SpendingInsights';

type AnalyticsPeriod = 'weekly' | 'monthly' | 'yearly';

export default function AnalyticsPage() {
    const navigate = useNavigate();
    const { categories, getExpensesByPeriod, getSpendingTrend } = useExpenses();
    const [period, setPeriod] = useState<AnalyticsPeriod>('monthly');

    // Get expenses for the selected period
    // Note: getExpensesByPeriod handles weekly/monthly. For yearly we'd need to implement it or just fetch all and filter.
    // For this MVP, we'll map 'yearly' to a longer trend fetch or just use monthly for now as the context supports it.
    // Let's stick to what the context provides: 'daily' | 'weekly' | 'monthly'. 
    // We'll use 'monthly' as the default view which is most useful.
    const expenses = getExpensesByPeriod(period === 'yearly' ? 'monthly' : period as 'daily' | 'weekly' | 'monthly');

    // --- Pie Chart Data Calculation ---
    const pieData = useMemo(() => {
        const totals: Record<string, number> = {};
        let totalAmount = 0;

        expenses.forEach(e => {
            totals[e.categoryId] = (totals[e.categoryId] || 0) + e.amount;
            totalAmount += e.amount;
        });

        return Object.entries(totals)
            .map(([catId, amount]) => {
                const category = categories.find(c => c.id === catId);
                return {
                    id: catId,
                    name: category?.name || 'Unknown',
                    color: category?.color || '#ccc',
                    amount,
                    percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
                };
            })
            .sort((a, b) => b.amount - a.amount); // Sort largest first
    }, [expenses, categories]);

    // --- Trend Data Calculation ---
    const trendData = useMemo(() => {
        // Fetch 7 days for weekly, 30 for monthly
        const days = period === 'weekly' ? 7 : 30;
        return getSpendingTrend(days);
    }, [period, getSpendingTrend]);

    const maxTrendAmount = Math.max(...trendData.map(d => d.amount), 1);

    // --- SVG Pie Chart Helper ---
    const renderPieChart = () => {
        if (pieData.length === 0) return <p className="text-center py-10 text-gray-400">No data available</p>;

        let cumulativePercent = 0;

        return (
            <div className="relative size-48 mx-auto my-6">
                <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }} className="overflow-visible">
                    {pieData.map((slice) => {
                        const startAngle = cumulativePercent * Math.PI * 2;
                        cumulativePercent += slice.percentage / 100;
                        const endAngle = cumulativePercent * Math.PI * 2;

                        const x1 = Math.cos(startAngle);
                        const y1 = Math.sin(startAngle);
                        const x2 = Math.cos(endAngle);
                        const y2 = Math.sin(endAngle);

                        const largeArcFlag = slice.percentage > 50 ? 1 : 0;

                        // If it's a full circle (100%), draw a circle instead of a path
                        if (slice.percentage >= 99.9) {
                            return (
                                <circle key={slice.id} cx="0" cy="0" r="1" fill={slice.color} />
                            );
                        }

                        const pathData = [
                            `M 0 0`,
                            `L ${x1} ${y1}`,
                            `A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            `Z`
                        ].join(' ');

                        return (
                            <path
                                key={slice.id}
                                d={pathData}
                                fill={slice.color}
                                stroke="white"
                                strokeWidth="0.02"
                                className="dark:stroke-gray-800 transition-all hover:opacity-80"
                            />
                        );
                    })}
                </svg>
                {/* Center Hole for Donut Chart effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="size-32 rounded-full bg-background-light dark:bg-background-dark flex flex-col items-center justify-center">
                        <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">Total</p>
                        <p className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
                            ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(0)}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="page-container">
            <header className="app-bar">
                <div className="flex items-center justify-between pb-2">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="heading-page flex-1 text-center">Analytics</h1>
                    <div className="size-10" />
                </div>
            </header>

            <main className="content-main pb-24">
                {/* Period Selector */}
                <div className="flex justify-center mb-6">
                    <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
                        {(['weekly', 'monthly'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${period === p
                                    ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                                    : 'text-text-light-secondary dark:text-text-dark-secondary'
                                    }`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Spending Insights Component */}
                <SpendingInsights />

                {/* Spending Breakdown (Pie Chart) */}
                <div className="card mb-6">
                    <h3 className="heading-section mb-2">Spending Breakdown</h3>
                    {renderPieChart()}

                    {/* Legend / List */}
                    <div className="space-y-3 mt-4">
                        {pieData.map(item => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">
                                        ${item.amount.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                                        {item.percentage.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spending Trend (Bar Chart) */}
                <div className="card">
                    <h3 className="heading-section mb-4">Spending Trend</h3>
                    <div className="h-48 flex items-end justify-between gap-2 pt-4">
                        {trendData.map((day, idx) => {
                            const heightPercent = (day.amount / maxTrendAmount) * 100;
                            const isToday = new Date(day.date).toDateString() === new Date().toDateString();

                            return (
                                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="relative w-full flex justify-center items-end h-[85%] bg-gray-100 dark:bg-gray-800/50 rounded-t-md overflow-hidden">
                                        <div
                                            className={`w-full mx-0.5 rounded-t-sm transition-all duration-500 ${isToday ? 'bg-primary' : 'bg-primary/60 group-hover:bg-primary/80'
                                                }`}
                                            style={{ height: `${Math.max(heightPercent, 0)}%` }}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            ${day.amount.toFixed(0)}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-text-light-secondary dark:text-text-dark-secondary mt-2 truncate w-full text-center">
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </main>
        </div>
    );
}
