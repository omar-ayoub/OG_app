// src/contexts/TaskContextDefinition.ts
import { createContext } from 'react';
import type { Task, Category } from '../types';

// --- CONTEXT TYPE DEFINITION ---
export type TaskContextType = {
  tasks: Task[];
  categories: Category[];
  toggleTaskCompletion: (id: number) => void;
  addTask: (newTaskData: Partial<Task>) => Promise<Task | undefined>;

  deleteTask: (taskId: number) => void;
  getTask: (taskId: number) => Task | undefined;
  addCategory: (newCategory: Category) => void;
  deleteCategory: (categoryName: string) => void;
  addSubTask: (taskId: number, subTaskText: string) => void;
  toggleSubTaskCompletion: (taskId: number, subTaskId: number) => void;
  editSubTask: (taskId: number, subTaskId: number, newText: string) => void;
  deleteSubTask: (taskId: number, subTaskId: number) => void;
  updateTask: (taskId: number, updatedData: Partial<Task>) => void;
};

// --- CREATE CONTEXT ---
export const TaskContext = createContext<TaskContextType | undefined>(undefined);
