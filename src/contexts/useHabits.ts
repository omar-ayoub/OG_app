// src/contexts/useHabits.ts
import { useContext } from 'react';
import { HabitContext } from './HabitContextDefinition';

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
