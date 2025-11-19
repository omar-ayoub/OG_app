// src/types/index.ts

export interface SubTask {
  id: number;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  text: string;
  time: string;
  startDate?: string;
  endDate?: string;
  tag: string;
  tagColor: string;
  isCompleted: boolean;
  description?: string;
  subTasks?: SubTask[];
  goalId?: string;
  isRepetitive?: boolean;
  repeatFrequency?: 'daily' | 'weekly' | 'monthly';
  habitId?: number;
}

export interface Category {
  name: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  tasks: number[];
  completed: boolean;
}

export interface Habit {
  id: number;
  name: string;
  icon: string;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
  frequency: 'daily' | 'weekly';
  goal: number; // Target completions per frequency period
  taskIds?: number[];
}

// ============================================
// EXPENSE TRACKING TYPES
// ============================================

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string; // Material Symbols icon name
  color: string; // Hex color
  isCustom: boolean; // true for user-created categories
}

export interface PaymentMethod {
  id: string;
  name: string; // "Cash", "Credit Card", "Debit Card", etc.
  icon: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  description?: string;
  paymentMethodId?: string;
  attachmentUrl?: string; // URL to receipt photo
  tags?: string[]; // Custom tags
  recurringId?: string; // Link to recurring expense template
}

export interface RecurringExpense {
  id: string;
  amount: number;
  categoryId: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string; // Optional end date
  paymentMethodId?: string;
  tags?: string[];
  isActive: boolean;
  lastGenerated?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly';
  startDate: string;
}

export type ExpensePeriod = 'daily' | 'weekly' | 'monthly';
export type ExpenseSortBy = 'date' | 'amount' | 'category';
export type ExpenseSortOrder = 'asc' | 'desc';