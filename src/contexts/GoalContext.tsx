// src/contexts/GoalContext.tsx
import { useState, type ReactNode } from 'react';
import type { Goal } from '../types';
import { GoalContext } from './GoalContextDefinition'; // Only import the context, not the type

// --- MOCK DATA ---
const MOCK_GOALS: Goal[] = [
  { id: 'g1', title: 'Learn Advanced UI Design', description: 'Complete a course on Udemy', targetDate: '2025-12-31', tasks: [1, 2], completed: false },
  { id: 'g2', title: 'Launch a Side Project', description: 'Develop and deploy the organizer app', targetDate: '2026-01-31', tasks: [3, 4], completed: false },
];

// --- PROVIDER COMPONENT ---
export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState(MOCK_GOALS);

  const addGoal = (newGoalData: Partial<Goal>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: `g${Date.now()}`,
      completed: false,
    } as Goal;
    setGoals((prevGoals) => [newGoal, ...prevGoals]);
  };

  const value = {
    goals,
    addGoal,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
}