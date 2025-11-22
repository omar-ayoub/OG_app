import type { Task, Goal, Habit, Expense, ExpenseCategory, Budget, RecurringExpense, SubTask } from '../types';

const BASE_URL = '/api';

// Helper to convert snake_case to camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toCamelCase = (obj: any): any => {
    if (obj === null || typeof obj === 'undefined') return obj;

    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (typeof obj === 'object' && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => {
                const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

                result[camelKey] = toCamelCase(obj[key]);
                return result;
            },
            {} as any // eslint-disable-line @typescript-eslint/no-explicit-any
        );
    }
    return obj;
};

// Helper to convert camelCase to snake_case
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toSnakeCase = (obj: any): any => {
    if (obj === null || typeof obj === 'undefined') return obj;

    if (Array.isArray(obj)) {
        return obj.map(v => toSnakeCase(v));
    } else if (typeof obj === 'object' && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => {
                const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

                result[snakeKey] = toSnakeCase(obj[key]);
                return result;
            },
            {} as any // eslint-disable-line @typescript-eslint/no-explicit-any
        );
    }
    return obj;
};

const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    if (response.status === 204) return null;

    const data = await response.json();
    return toCamelCase(data);
};

export const api = {
    tasks: {
        getAll: () => fetchApi('/tasks'),
        getById: (id: number) => fetchApi(`/tasks/${id}`),
        getCategories: () => fetchApi('/tasks/categories'),
        create: (data: Partial<Task>) => fetchApi('/tasks', {
            method: 'POST',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        update: (id: number, data: Partial<Task>) => fetchApi(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        delete: (id: number) => fetchApi(`/tasks/${id}`, {
            method: 'DELETE',
        }),
        addSubtask: (taskId: number, data: Partial<SubTask>) => fetchApi(`/tasks/${taskId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        updateSubtask: (subtaskId: number, data: Partial<SubTask>) => fetchApi(`/tasks/subtasks/${subtaskId}`, {
            method: 'PUT',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        deleteSubtask: (subtaskId: number) => fetchApi(`/tasks/subtasks/${subtaskId}`, {
            method: 'DELETE',
        }),
    },

    goals: {
        getAll: () => fetchApi('/goals'),
        getById: (id: string) => fetchApi(`/goals/${id}`),
        create: (data: Partial<Goal>) => fetchApi('/goals', {
            method: 'POST',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        update: (id: string, data: Partial<Goal>) => fetchApi(`/goals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        delete: (id: string) => fetchApi(`/goals/${id}`, {
            method: 'DELETE',
        }),
        toggleCompletion: (id: string) => fetchApi(`/goals/${id}/toggle`, {
            method: 'POST',
        }),
    },

    habits: {
        getAll: () => fetchApi('/habits'),
        getById: (id: number) => fetchApi(`/habits/${id}`),
        create: (data: Partial<Habit>) => fetchApi('/habits', {
            method: 'POST',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        update: (id: number, data: Partial<Habit>) => fetchApi(`/habits/${id}`, {
            method: 'PUT',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        delete: (id: number) => fetchApi(`/habits/${id}`, {
            method: 'DELETE',
        }),
        toggleCompletion: (id: number, date: string) => fetchApi(`/habits/${id}/complete`, {
            method: 'POST',
            body: JSON.stringify({ date }),
        }),
        getStreak: (id: number) => fetchApi(`/habits/${id}/streak`),
    },

    expenses: {
        getAll: () => fetchApi('/expenses'),
        create: (data: Partial<Expense>) => fetchApi('/expenses', {
            method: 'POST',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        update: (id: string, data: Partial<Expense>) => fetchApi(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        delete: (id: string) => fetchApi(`/expenses/${id}`, {
            method: 'DELETE',
        }),
        getCategories: () => fetchApi('/expenses/categories/all'),
        createCategory: (data: Partial<ExpenseCategory>) => fetchApi('/expenses/categories', {
            method: 'POST',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        deleteCategory: (id: string) => fetchApi(`/expenses/categories/${id}`, {
            method: 'DELETE',
        }),
        getBudgets: () => fetchApi('/expenses/budgets/all'),
        upsertBudget: (data: Partial<Budget>) => fetchApi('/expenses/budgets', {
            method: 'POST',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        getRecurring: () => fetchApi('/expenses/recurring/all'),
        createRecurring: (data: Partial<RecurringExpense>) => fetchApi('/expenses/recurring', {
            method: 'POST',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        updateRecurring: (id: string, data: Partial<RecurringExpense>) => fetchApi(`/expenses/recurring/${id}`, {
            method: 'PUT',
            body: JSON.stringify(toSnakeCase(data)),
        }),
        deleteRecurring: (id: string) => fetchApi(`/expenses/recurring/${id}`, {
            method: 'DELETE',
        }),
        getPaymentMethods: () => fetchApi('/expenses/payment-methods/all'),
    }
};
