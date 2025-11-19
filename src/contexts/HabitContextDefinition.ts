// src/contexts/HabitContextDefinition.ts
import { createContext } from 'react';
import type { Habit } from '../types';

interface HabitContextType {
  habits: Habit[];
  toggleHabitCompletion: (id: number) => void;
  addHabit: (newHabitData: Partial<Habit>) => void;
  editHabit: (habitId: number, updatedHabitData: Partial<Habit>) => void;
  deleteHabit: (habitId: number) => void;
  getHabit: (habitId: number) => Habit | undefined;
  calculateStreak: (completedDates: string[]) => number;
  getTodayString: () => string;
}

export const HabitContext = createContext<HabitContextType | undefined>(undefined);
