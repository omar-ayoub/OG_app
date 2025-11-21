// src/contexts/GoalContext.tsx
import { useState, useEffect, type ReactNode } from 'react';
import type { Goal } from '../types';
import { GoalContext } from './GoalContextDefinition';
import { api } from '../services/api';

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const loadGoals = useCallback(async () => {
    try {
      const fetchedGoals = await api.goals.getAll();
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    // Optimistic add with temp ID
    const tempId = Date.now().toString();
    const newGoal = { ...goal, id: tempId };
    setGoals((prevGoals) => [...prevGoals, newGoal]);

    api.goals.create(goal).then((createdGoal) => {
      setGoals((prevGoals) => prevGoals.map(g => g.id === tempId ? createdGoal : g));
    }).catch(err => {
      console.error('Failed to add goal:', err);
      setGoals(prev => prev.filter(g => g.id !== tempId));
    });
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    // Optimistic update
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );

    try {
      await api.goals.update(id, updates);
      loadGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
      loadGoals();
    }
  };

  const deleteGoal = async (id: string) => {
    // Optimistic delete
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));

    try {
      await api.goals.delete(id);
    } catch (error) {
      console.error('Failed to delete goal:', error);
      loadGoals();
    }
  };

  const getGoal = (id: string) => {
    return goals.find((goal) => goal.id === id);
  };

  return (
    <GoalContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, getGoal }}>
      {children}
    </GoalContext.Provider>
  );
};
