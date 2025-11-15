// src/contexts/useGoals.ts
import { useContext } from 'react';
import { GoalContext } from './GoalContextDefinition'; // Import from definition file

export function useGoals() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
}
