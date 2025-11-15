// src/contexts/GoalContextDefinition.ts
import { createContext } from 'react';
import type { Goal } from '../types';

// --- CONTEXT TYPE DEFINITION ---
export type GoalContextType = {
  goals: Goal[];
  addGoal: (newGoalData: Partial<Goal>) => void;
};

// --- CREATE CONTEXT ---
export const GoalContext = createContext<GoalContextType | undefined>(undefined);