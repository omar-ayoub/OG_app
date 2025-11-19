// src/contexts/ExpenseContext.tsx
import { createContext } from 'react';
import { type Expense, type ExpenseCategory, type PaymentMethod, type RecurringExpense, type Budget, type ExpensePeriod } from '../types';

export interface ExpenseContextType {
    // Expenses
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    updateExpense: (id: string, updates: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    deleteMultipleExpenses: (ids: string[]) => void;

    // Categories
    categories: ExpenseCategory[];
    addCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
    updateCategory: (id: string, updates: Partial<ExpenseCategory>) => void;
    deleteCategory: (id: string) => void;

    // Budgets
    budgets: Budget[];
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    updateBudget: (id: string, updates: Partial<Budget>) => void;
    deleteBudget: (id: string) => void;

    // Recurring Expenses
    recurringExpenses: RecurringExpense[];
    addRecurringExpense: (expense: Omit<RecurringExpense, 'id'>) => void;
    updateRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => void;
    deleteRecurringExpense: (id: string) => void;

    // Payment Methods
    paymentMethods: PaymentMethod[];
    addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
    deletePaymentMethod: (id: string) => void;

    // Filtering & Analytics
    getExpensesByPeriod: (period: ExpensePeriod, date?: Date) => Expense[];
    getExpensesByCategory: (categoryId: string) => Expense[];
    getTotalSpent: (period: ExpensePeriod, date?: Date) => number;
    getCategorySpending: (period: ExpensePeriod) => { [categoryId: string]: number };
    getSpendingTrend: (days: number) => { date: string; amount: number }[];

    // Export
    exportToCSV: () => void;
    exportToPDF: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export default ExpenseContext;
