// src/contexts/HabitContext.tsx
import { useState, type ReactNode, useCallback } from 'react';
import type { Habit } from '../types';
import { HabitContext } from './HabitContextDefinition';

// --- MOCK DATA ---
const MOCK_HABITS: Habit[] = [
  { id: 1, name: 'Read for 15 mins', icon: 'auto_stories', streak: 12, goal: 30, completedToday: false, progress: 73.33, taskIds: [] },
  { id: 2, name: 'Morning Meditation', icon: 'self_improvement', streak: 21, goal: 60, completedToday: true, progress: 66.66, taskIds: [] },
  { id: 3, name: 'Workout', icon: 'fitness_center', streak: 5, goal: 4, completedToday: false, progress: 50, taskIds: [] },
  { id: 4, name: 'Drink Water', icon: 'water_drop', streak: 33, goal: 3, completedToday: true, progress: 66.66, taskIds: [] },
];

// --- PROVIDER COMPONENT ---
export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [nextId, setNextId] = useState(5);

  const toggleHabitCompletion = (id: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, completedToday: !habit.completedToday } : habit
      )
    );
  };

  const addHabit = (newHabitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: nextId,
      name: newHabitData.name || '',
      icon: newHabitData.icon || 'spa',
      streak: newHabitData.streak || 0,
      goal: newHabitData.goal || 30,
      completedToday: false,
      progress: 0,
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

  const value = {
    habits,
    toggleHabitCompletion,
    addHabit,
    editHabit,
    deleteHabit,
    getHabit,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}
