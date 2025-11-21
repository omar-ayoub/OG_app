// src/contexts/HabitContext.tsx
import { useState, type ReactNode, useCallback, useEffect } from 'react';
import type { Habit } from '../types';
import { HabitContext } from './HabitContextDefinition';
import { api } from '../services/api';

// --- HELPER FUNCTIONS ---

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const calculateStreak = (completedDates: string[]): number => {
  if (!completedDates.length) return 0;

  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = getTodayString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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
  const [habits, setHabits] = useState<Habit[]>([]);

  const loadHabits = useCallback(async () => {
    try {
      const fetchedHabits = await api.habits.getAll();
      setHabits(fetchedHabits);
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const toggleHabitCompletion = async (id: number) => {
    const today = getTodayString();

    // Optimistic update
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const isCompletedToday = habit.completedDates.includes(today);
    let newCompletedDates;
    if (isCompletedToday) {
      newCompletedDates = habit.completedDates.filter(d => d !== today);
    } else {
      newCompletedDates = [...habit.completedDates, today];
    }

    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, completedDates: newCompletedDates } : h
    ));

    try {
      await api.habits.toggleCompletion(id, today);
      loadHabits();
    } catch (error) {
      console.error('Failed to toggle habit completion:', error);
      loadHabits();
    }
  };

  const addHabit = (newHabitData: Partial<Habit>) => {
    // Optimistic add with temp ID
    const tempId = Date.now();
    const newHabit: Habit = {
      id: tempId,
      name: newHabitData.name || '',
      icon: newHabitData.icon || 'spa',
      completedDates: [],
      frequency: newHabitData.frequency || 'daily',
      goal: newHabitData.goal || 1,
      taskIds: newHabitData.taskIds || [],
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);

    api.habits.create(newHabitData).then((createdHabit) => {
      setHabits((prevHabits) => prevHabits.map(h => h.id === tempId ? createdHabit : h));
    }).catch(err => {
      console.error('Failed to add habit:', err);
      setHabits(prev => prev.filter(h => h.id !== tempId));
    });
  };

  const editHabit = async (habitId: number, updatedHabitData: Partial<Habit>) => {
    // Optimistic update
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, ...updatedHabitData } : habit
      )
    );

    try {
      await api.habits.update(habitId, updatedHabitData);
      loadHabits();
    } catch (error) {
      console.error('Failed to update habit:', error);
      loadHabits();
    }
  };

  const deleteHabit = async (habitId: number) => {
    // Optimistic delete
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId));

    try {
      await api.habits.delete(habitId);
    } catch (error) {
      console.error('Failed to delete habit:', error);
      loadHabits();
    }
  };

  const getHabit = useCallback((habitId: number): Habit | undefined => {
    return habits.find((habit) => habit.id === habitId);
  }, [habits]);

  const value = {
    habits,
    toggleHabitCompletion,
    addHabit,
    editHabit,
    deleteHabit,
    getHabit,
    calculateStreak,
    calculateBestStreak,
    getTodayString,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}
