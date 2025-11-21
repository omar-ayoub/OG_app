// src/contexts/ExpenseProvider.tsx
import { type ReactNode, useState, useEffect } from 'react';
import ExpenseContext, { type ExpenseContextType } from './ExpenseContext';
import { type Expense, type ExpenseCategory, type PaymentMethod, type RecurringExpense, type Budget, type ExpensePeriod } from '../types';
import { api } from '../services/api';

interface ExpenseProviderProps {
    children: ReactNode;
}

export function ExpenseProvider({ children }: ExpenseProviderProps) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [
                fetchedExpenses,
                fetchedCategories,
                fetchedBudgets,
                fetchedRecurring,
                fetchedPaymentMethods
            ] = await Promise.all([
                api.expenses.getAll(),
                api.expenses.getCategories(),
                api.expenses.getBudgets(),
                api.expenses.getRecurring(),
                api.expenses.getPaymentMethods()
            ]);

            setExpenses(fetchedExpenses);
            setCategories(fetchedCategories);
            setBudgets(fetchedBudgets);
            setRecurringExpenses(fetchedRecurring);
            setPaymentMethods(fetchedPaymentMethods);
        } catch (error) {
            console.error('Failed to load expense data:', error);
        }
    };

    // Expense CRUD operations
    const addExpense = (expense: Omit<Expense, 'id'>) => {
        // Optimistic add
        const tempId = Date.now().toString();
        const newExpense: Expense = { ...expense, id: tempId };
        setExpenses(prev => [newExpense, ...prev]);

        api.expenses.create(expense).then((createdExpense) => {
            setExpenses(prev => prev.map(e => e.id === tempId ? createdExpense : e));
        }).catch(err => {
            console.error('Failed to add expense:', err);
            setExpenses(prev => prev.filter(e => e.id !== tempId));
        });
    };

    const updateExpense = async (id: string, updates: Partial<Expense>) => {
        setExpenses(prev =>
            prev.map(expense => (expense.id === id ? { ...expense, ...updates } : expense))
        );

        try {
            await api.expenses.update(id, updates);
            const updated = await api.expenses.getAll(); // Reload to ensure consistency
            setExpenses(updated);
        } catch (error) {
            console.error('Failed to update expense:', error);
            loadData();
        }
    };

    const deleteExpense = async (id: string) => {
        setExpenses(prev => prev.filter(expense => expense.id !== id));

        try {
            await api.expenses.delete(id);
        } catch (error) {
            console.error('Failed to delete expense:', error);
            loadData();
        }
    };

    const deleteMultipleExpenses = async (ids: string[]) => {
        setExpenses(prev => prev.filter(expense => !ids.includes(expense.id)));

        try {
            await Promise.all(ids.map(id => api.expenses.delete(id)));
        } catch (error) {
            console.error('Failed to delete multiple expenses:', error);
            loadData();
        }
    };

    // Category operations
    const addCategory = (category: Omit<ExpenseCategory, 'id'>) => {
        const tempId = Date.now().toString();
        const newCategory: ExpenseCategory = { ...category, id: tempId };
        setCategories(prev => [...prev, newCategory]);

        api.expenses.createCategory(category).then((createdCategory) => {
            setCategories(prev => prev.map(c => c.id === tempId ? createdCategory : c));
        }).catch(err => {
            console.error('Failed to add category:', err);
            setCategories(prev => prev.filter(c => c.id !== tempId));
        });
    };

    const updateCategory = async (id: string, updates: Partial<ExpenseCategory>) => {
        // Categories update not implemented in backend yet, mostly static or add/delete
        // But if we had it:
        setCategories(prev =>
            prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
        );
        // api.expenses.updateCategory(id, updates);
    };

    const deleteCategory = async (id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));

        try {
            await api.expenses.deleteCategory(id);
        } catch (error) {
            console.error('Failed to delete category:', error);
            loadData();
        }
    };

    // Budget operations
    const addBudget = (budget: Omit<Budget, 'id'>) => {
        // Upsert logic in backend handles create/update based on category/period
        // But frontend treats it as add.
        // We'll just call upsert.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        api.expenses.upsertBudget(budget).then((_upsertedBudget) => {
            // Reload budgets to reflect changes (upsert might update existing)
            api.expenses.getBudgets().then(setBudgets);
        }).catch(err => console.error('Failed to add budget:', err));
    };

    const updateBudget = async (id: string, updates: Partial<Budget>) => {
        // Backend uses upsert, so we can just send the updates merged with existing
        const existing = budgets.find(b => b.id === id);
        if (!existing) return;

        const payload = { ...existing, ...updates };
        try {
            await api.expenses.upsertBudget(payload);
            const fetched = await api.expenses.getBudgets();
            setBudgets(fetched);
        } catch (error) {
            console.error('Failed to update budget:', error);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deleteBudget = (_id: string) => {
        // Not implemented in backend
        console.warn("Delete budget not implemented in backend");
    };

    // Recurring Expense operations
    const addRecurringExpense = (expense: Omit<RecurringExpense, 'id'>) => {
        const tempId = Date.now().toString();
        const newRecurring: RecurringExpense = { ...expense, id: tempId };
        setRecurringExpenses(prev => [...prev, newRecurring]);

        api.expenses.createRecurring(expense).then((created) => {
            setRecurringExpenses(prev => prev.map(r => r.id === tempId ? created : r));
        }).catch(err => {
            console.error('Failed to add recurring expense:', err);
            setRecurringExpenses(prev => prev.filter(r => r.id !== tempId));
        });
    };

    const updateRecurringExpense = async (id: string, updates: Partial<RecurringExpense>) => {
        setRecurringExpenses(prev =>
            prev.map(exp => (exp.id === id ? { ...exp, ...updates } : exp))
        );

        try {
            await api.expenses.updateRecurring(id, updates);
        } catch (error) {
            console.error('Failed to update recurring expense:', error);
            loadData();
        }
    };

    const deleteRecurringExpense = async (id: string) => {
        setRecurringExpenses(prev => prev.filter(exp => exp.id !== id));

        try {
            await api.expenses.deleteRecurring(id);
        } catch (error) {
            console.error('Failed to delete recurring expense:', error);
            loadData();
        }
    };

    // Payment Method operations
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const addPaymentMethod = (_method: Omit<PaymentMethod, 'id'>) => {
        // Not implemented in backend
        console.warn("Add payment method not implemented in backend");
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deletePaymentMethod = (_id: string) => {
        // Not implemented in backend
        console.warn("Delete payment method not implemented in backend");
    };

    // Helper function to get date range for period
    const getDateRangeForPeriod = (period: ExpensePeriod, date: Date = new Date()): [Date, Date] => {
        const start = new Date(date);
        const end = new Date(date);

        switch (period) {
            case 'daily': {
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            }
            case 'weekly': {
                const dayOfWeek = start.getDay();
                const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday as start
                start.setDate(start.getDate() - diff);
                start.setHours(0, 0, 0, 0);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;
            }
            case 'monthly': {
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                break;
            }
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
