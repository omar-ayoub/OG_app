// src/contexts/TaskContext.tsx
import { useState, useEffect, type ReactNode, useCallback } from 'react';
import type { Task, Category } from '../types';
import { TaskContext } from './TaskContextDefinition';
import { api } from '../services/api';

// Default categories matching the database
const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Work', color: '#5590f7' },
  { name: 'Personal', color: '#22c55e' },
  { name: 'Health', color: '#ef4444' },
  { name: 'Study', color: '#f59e0b' },
  { name: 'Shopping', color: '#8b5cf6' },
];

// --- PROVIDER COMPONENT ---
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const loadTasks = useCallback(async () => {
    try {
      const fetchedTasks = await api.tasks.getAll();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const fetchedCategories = await api.tasks.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Keep default categories if API fails
    }
  }, []);

  // Fetch tasks and categories on mount
  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [loadTasks, loadCategories]);

  const toggleTaskCompletion = async (id: number) => {
    // Optimistic update
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newIsCompleted = !task.isCompleted;

    // Update local state immediately
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, isCompleted: newIsCompleted } : t
    ));

    try {
      await api.tasks.update(id, { isCompleted: newIsCompleted });
      // Reload to get side effects (like subtask completion) from backend
      loadTasks();
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      // Revert on error
      loadTasks();
    }
  };

  const addTask = (newTaskData: Partial<Task>): number => {
    // We can't return the real ID immediately since it's async.
    // For now, we'll return a temporary ID or 0, but the UI might depend on it.
    const tempId = Date.now();

    const newTaskPayload = {
      ...newTaskData,
      tag: newTaskData.tag || categories[0]?.name || 'Work',
      tagColor: newTaskData.tagColor || categories[0]?.color || '#3b82f6',
    };

    api.tasks.create(newTaskPayload).then((createdTask) => {
      setTasks(prev => [...prev, createdTask]);
    }).catch(err => console.error("Failed to add task", err));

    return tempId;
  };

  const updateTask = async (taskId: number, updatedTaskData: Partial<Task>) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedTaskData } : t));

    try {
      await api.tasks.update(taskId, updatedTaskData);
      loadTasks(); // Reload to ensure consistency
    } catch (error) {
      console.error('Failed to update task:', error);
      loadTasks();
    }
  };

  const deleteTask = async (taskId: number) => {
    // Optimistic delete
    setTasks(prev => prev.filter(t => t.id !== taskId));

    try {
      await api.tasks.delete(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
      loadTasks();
    }
  };

  const getTask = useCallback((taskId: number): Task | undefined => {
    return tasks.find((task) => task.id === taskId);
  }, [tasks]);

  const addCategory = (newCategory: Category) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    // Note: Categories are not persisted to backend yet
  };

  const deleteCategory = (categoryName: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.name !== categoryName)
    );
  };

  const addSubTask = async (taskId: number, subTaskText: string) => {
    try {
      await api.tasks.addSubtask(taskId, { text: subTaskText });
      loadTasks();
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  };

  const toggleSubTaskCompletion = async (taskId: number, subTaskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    const subtask = task?.subTasks?.find(s => s.id === subTaskId);
    if (!subtask) return;

    try {
      await api.tasks.updateSubtask(subTaskId, { completed: !subtask.completed });
      loadTasks();
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  };

  const editSubTask = async (_taskId: number, subTaskId: number, newText: string) => {
    try {
      await api.tasks.updateSubtask(subTaskId, { text: newText });
      loadTasks();
    } catch (error) {
      console.error('Failed to edit subtask:', error);
    }
  };

  const deleteSubTask = async (_taskId: number, subTaskId: number) => {
    try {
      await api.tasks.deleteSubtask(subTaskId);
      loadTasks();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  const value = {
    tasks,
    categories,
    toggleTaskCompletion,
    addTask,
    updateTask,
    deleteTask,
    getTask,
    addCategory,
    deleteCategory,
    addSubTask,
    toggleSubTaskCompletion,
    editSubTask,
    deleteSubTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}