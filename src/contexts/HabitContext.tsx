// src/contexts/HabitContext.tsx
import { useState, type ReactNode, useCallback, useEffect } from 'react';
import type { Habit } from '../types';
import { HabitContext } from './HabitContextDefinition';

// --- HELPER FUNCTIONS ---

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const calculateStreak = (completedDates: string[]): number => {
  if (!completedDates.length) return 0;

  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = getTodayString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // If not completed today or yesterday, streak is broken (unless it's early in the day and we completed yesterday)
  // Actually, simpler logic: count backwards from most recent date.
  // If most recent is not today or yesterday, streak is 0.

  const lastCompletion = sortedDates[0];
  if (lastCompletion !== today && lastCompletion !== yesterday) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(lastCompletion);

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const expectedDateStr = prevDate.toISOString().split('T')[0];

    if (sortedDates[i] === expectedDateStr) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};

const calculateBestStreak = (completedDates: string[]): number => {
  if (!completedDates.length) return 0;

  const sortedDates = [...completedDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);

    // Calculate the difference in days
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return bestStreak;
};

// --- PROVIDER COMPONENT ---
export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [nextId, setNextId] = useState(() => {
    const saved = localStorage.getItem('habits_nextId');
    return saved ? parseInt(saved, 10) : 5;
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('habits_nextId', nextId.toString());
  }, [habits, nextId]);

  const toggleHabitCompletion = (id: number) => {
    const today = getTodayString();
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          const isCompletedToday = habit.completedDates.includes(today);
          let newCompletedDates;
          if (isCompletedToday) {
            newCompletedDates = habit.completedDates.filter(d => d !== today);
          } else {
            newCompletedDates = [...habit.completedDates, today];
          }
          return { ...habit, completedDates: newCompletedDates };
        }
        return habit;
      })
    );
  };

  const addHabit = (newHabitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: nextId,
      name: newHabitData.name || '',
      icon: newHabitData.icon || 'spa',
      completedDates: [],
      frequency: newHabitData.frequency || 'daily',
      goal: newHabitData.goal || 1,
      taskIds: newHabitData.taskIds || [],
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
    setNextId(nextId + 1);
  };

  const editHabit = (habitId: number, updatedHabitData: Partial<Habit>) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, ...updatedHabitData } : habit
      )
    );
  };

  const deleteHabit = (habitId: number) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId));
  };

  const getHabit = useCallback((habitId: number): Habit | undefined => {
    return habits.find((habit) => habit.id === habitId);
  }, [habits]);

  // Adapter to expose "streak" and "completedToday" dynamically for UI compatibility
  // We wrap the habits in a proxy or just map them when returning value?
  // Better to just expose helper functions or let the UI calculate it.
  // But to keep it simple for now, let's expose the raw habits and let the UI use helpers if needed,
  // OR we can map them to a "View Model" if we really wanted to avoid changing UI much.
  // Given the instructions, I should update the UI to use the new data structure.

  const value = {
    habits,
    toggleHabitCompletion,
    addHabit,
    editHabit,
    deleteHabit,
    getHabit,
    calculateStreak, // Expose helper
    calculateBestStreak, // Expose helper
    getTodayString, // Expose helper
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}
