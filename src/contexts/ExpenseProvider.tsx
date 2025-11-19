// src/contexts/ExpenseProvider.tsx
import { type ReactNode, useState, useEffect } from 'react';
import ExpenseContext, { type ExpenseContextType } from './ExpenseContext';
import { type Expense, type ExpenseCategory, type PaymentMethod, type RecurringExpense, type Budget, type ExpensePeriod } from '../types';

interface ExpenseProviderProps {
    children: ReactNode;
}

// Default expense categories
const DEFAULT_CATEGORIES: ExpenseCategory[] = [
    { id: '1', name: 'Groceries', icon: 'shopping_cart', color: '#10B981', isCustom: false },
    { id: '2', name: 'Restaurant', icon: 'restaurant', color: '#F59E0B', isCustom: false },
    { id: '3', name: 'Transportation', icon: 'directions_bus', color: '#3B82F6', isCustom: false },
    { id: '4', name: 'Entertainment', icon: 'movie', color: '#8B5CF6', isCustom: false },
    { id: '5', name: 'Shopping', icon: 'shopping_bag', color: '#EC4899', isCustom: false },
    { id: '6', name: 'Health', icon: 'local_hospital', color: '#EF4444', isCustom: false },
    { id: '7', name: 'Utilities', icon: 'bolt', color: '#F97316', isCustom: false },
    { id: '8', name: 'Other', icon: 'more_horiz', color: '#6B7280', isCustom: false },
];

// Default payment methods
const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
    { id: '1', name: 'Cash', icon: 'payments' },
    { id: '2', name: 'Credit Card', icon: 'credit_card' },
    { id: '3', name: 'Debit Card', icon: 'credit_card' },
    { id: '4', name: 'Digital Wallet', icon: 'account_balance_wallet' },
];

export function ExpenseProvider({ children }: ExpenseProviderProps) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>(DEFAULT_CATEGORIES);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);

    // Load data from localStorage on mount
    useEffect(() => {
        setTimeout(() => {
            const savedExpenses = localStorage.getItem('expenses');
            const savedCategories = localStorage.getItem('expenseCategories');
            const savedBudgets = localStorage.getItem('expenseBudgets');
            const savedRecurring = localStorage.getItem('recurringExpenses');
            const savedPaymentMethods = localStorage.getItem('paymentMethods');

            if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
            if (savedCategories) setCategories(JSON.parse(savedCategories));
            if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
            if (savedRecurring) setRecurringExpenses(JSON.parse(savedRecurring));
            if (savedPaymentMethods) setPaymentMethods(JSON.parse(savedPaymentMethods));
        }, 0);
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    useEffect(() => {
        localStorage.setItem('expenseCategories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('expenseBudgets', JSON.stringify(budgets));
    }, [budgets]);

    useEffect(() => {
        localStorage.setItem('recurringExpenses', JSON.stringify(recurringExpenses));
    }, [recurringExpenses]);

    useEffect(() => {
        localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    }, [paymentMethods]);

    // Expense CRUD operations
    const addExpense = (expense: Omit<Expense, 'id'>) => {
        const newExpense: Expense = {
            ...expense,
            id: Date.now().toString(),
        };
        setExpenses(prev => [newExpense, ...prev]);
    };

    const updateExpense = (id: string, updates: Partial<Expense>) => {
        setExpenses(prev =>
            prev.map(expense => (expense.id === id ? { ...expense, ...updates } : expense))
        );
    };

    const deleteExpense = (id: string) => {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
    };

    const deleteMultipleExpenses = (ids: string[]) => {
        setExpenses(prev => prev.filter(expense => !ids.includes(expense.id)));
    };

    // Category operations
    const addCategory = (category: Omit<ExpenseCategory, 'id'>) => {
        const newCategory: ExpenseCategory = {
            ...category,
            id: Date.now().toString(),
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const updateCategory = (id: string, updates: Partial<ExpenseCategory>) => {
        setCategories(prev =>
            prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
        );
    };

    const deleteCategory = (id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    // Budget operations
    const addBudget = (budget: Omit<Budget, 'id'>) => {
        const newBudget: Budget = {
            ...budget,
            id: Date.now().toString(),
        };
        setBudgets(prev => [...prev, newBudget]);
    };

    const updateBudget = (id: string, updates: Partial<Budget>) => {
        setBudgets(prev =>
            prev.map(budget => (budget.id === id ? { ...budget, ...updates } : budget))
        );
    };

    const deleteBudget = (id: string) => {
        setBudgets(prev => prev.filter(budget => budget.id !== id));
    };

    // Recurring Expense operations
    const addRecurringExpense = (expense: Omit<RecurringExpense, 'id'>) => {
        const newRecurring: RecurringExpense = {
            ...expense,
            id: Date.now().toString(),
        };
        setRecurringExpenses(prev => [...prev, newRecurring]);
    };

    const updateRecurringExpense = (id: string, updates: Partial<RecurringExpense>) => {
        setRecurringExpenses(prev =>
            prev.map(exp => (exp.id === id ? { ...exp, ...updates } : exp))
        );
    };

    const deleteRecurringExpense = (id: string) => {
        setRecurringExpenses(prev => prev.filter(exp => exp.id !== id));
    };

    // Payment Method operations
    const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
        const newMethod: PaymentMethod = {
            ...method,
            id: Date.now().toString(),
        };
        setPaymentMethods(prev => [...prev, newMethod]);
    };

    const deletePaymentMethod = (id: string) => {
        setPaymentMethods(prev => prev.filter(method => method.id !== id));
    };

    // Helper function to get date range for period
    const getDateRangeForPeriod = (period: ExpensePeriod, date: Date = new Date()): [Date, Date] => {
        const start = new Date(date);
        const end = new Date(date);

        switch (period) {
            case 'daily':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'weekly':
                const dayOfWeek = start.getDay();
                const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday as start
                start.setDate(start.getDate() - diff);
                start.setHours(0, 0, 0, 0);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;
            case 'monthly':
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                break;
        }

        return [start, end];
    };

    // Filtering & Analytics
    const getExpensesByPeriod = (period: ExpensePeriod, date?: Date): Expense[] => {
        const [start, end] = getDateRangeForPeriod(period, date);
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= start && expenseDate <= end;
        });
    };

    const getExpensesByCategory = (categoryId: string): Expense[] => {
        return expenses.filter(expense => expense.categoryId === categoryId);
    };

    const getTotalSpent = (period: ExpensePeriod, date?: Date): number => {
        const periodExpenses = getExpensesByPeriod(period, date);
        return periodExpenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const getCategorySpending = (period: ExpensePeriod): { [categoryId: string]: number } => {
        const periodExpenses = getExpensesByPeriod(period);
        const spending: { [categoryId: string]: number } = {};

        periodExpenses.forEach(expense => {
            if (!spending[expense.categoryId]) {
                spending[expense.categoryId] = 0;
            }
            spending[expense.categoryId] += expense.amount;
        });

        return spending;
    };

    const getSpendingTrend = (days: number): { date: string; amount: number }[] => {
        const trend: { date: string; amount: number }[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayExpenses = expenses.filter(expense => expense.date === dateStr);
            const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

            trend.push({ date: dateStr, amount: total });
        }

        return trend;
    };

    // Export functions
    const exportToCSV = () => {
        const headers = ['Date', 'Time', 'Category', 'Amount', 'Description', 'Payment Method', 'Tags'];
        const rows = expenses.map(expense => {
            const category = categories.find(c => c.id === expense.categoryId)?.name || 'Unknown';
            const paymentMethod = expense.paymentMethodId
                ? paymentMethods.find(p => p.id === expense.paymentMethodId)?.name || 'N/A'
                : 'N/A';
            const tags = expense.tags?.join('; ') || '';

            return [
                expense.date,
                expense.time,
                category,
                expense.amount.toString(),
                expense.description || '',
                paymentMethod,
                tags,
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportToPDF = () => {
        // Simplified PDF export - creates a printable HTML version
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;

        const content = `
      <html>
        <head>
          <title>Expense Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #5590f7; color: white; }
          </style>
        </head>
        <body>
          <h1>Expense Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${expenses
                .map(expense => {
                    const category = categories.find(c => c.id === expense.categoryId)?.name || 'Unknown';
                    return `
                    <tr>
                      <td>${expense.date}</td>
                      <td>${category}</td>
                      <td>$${expense.amount.toFixed(2)}</td>
                      <td>${expense.description || '-'}</td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    const value: ExpenseContextType = {
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        deleteMultipleExpenses,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        recurringExpenses,
        addRecurringExpense,
        updateRecurringExpense,
        deleteRecurringExpense,
        paymentMethods,
        addPaymentMethod,
        deletePaymentMethod,
        getExpensesByPeriod,
        getExpensesByCategory,
        getTotalSpent,
        getCategorySpending,
        getSpendingTrend,
        exportToCSV,
        exportToPDF,
    };

    return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}
