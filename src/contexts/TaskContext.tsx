// src/contexts/TaskContext.tsx
import { useState, type ReactNode, useCallback } from 'react';
import type { Task, Category, SubTask } from '../types';
import { TaskContext } from './TaskContextDefinition';

// --- MOCK DATA ---
const MOCK_CATEGORIES: Category[] = [
  { name: 'Work', color: '#3b82f6' },
  { name: 'Personal', color: '#10b981' },
  { name: 'Health', color: '#f59e0b' },
  { name: 'Learning', color: '#8b5cf6' },
];

const MOCK_TASKS: Task[] = [
  { id: 1, text: 'Complete UI mockups', time: '10:00 AM', startDate: '2025-11-17', tag: 'Work', tagColor: '#3b82f6', isCompleted: false, subTasks: [{id: 1, text: "sub task 1", completed: false}, {id: 2, text: "sub task 2", completed: true}] },
  { id: 2, text: 'Review design system', time: '2:00 PM', startDate: '2025-11-17', tag: 'Work', tagColor: '#3b82f6', isCompleted: false },
  { id: 3, text: 'Setup development environment', time: '9:00 AM', startDate: '2025-11-18', tag: 'Learning', tagColor: '#8b5cf6', isCompleted: false },
  { id: 4, text: 'Deploy to production', time: 'Anytime', startDate: '2025-11-19', tag: 'Work', tagColor: '#3b82f6', isCompleted: false },
];

// --- PROVIDER COMPONENT ---
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [nextId, setNextId] = useState(5);
  const [nextSubTaskId, setNextSubTaskId] = useState(3);

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const addTask = (newTaskData: Partial<Task>): number => {
    const newTask: Task = {
      id: nextId,
      text: newTaskData.text || '',
      time: newTaskData.time || 'Anytime',
      startDate: newTaskData.startDate,
      endDate: newTaskData.endDate,
      tag: newTaskData.tag || categories[0]?.name || 'Work',
      tagColor: newTaskData.tagColor || categories[0]?.color || '#3b82f6',
      isCompleted: false,
      description: newTaskData.description,
      subTasks: newTaskData.subTasks || [],
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNextId(nextId + 1);
    return newTask.id;
  };

  const editTask = (taskId: number, updatedTaskData: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTaskData } : task
      )
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const getTask = useCallback((taskId: number): Task | undefined => {
    return tasks.find((task) => task.id === taskId);
  }, [tasks]);

  const addCategory = (newCategory: Category) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const deleteCategory = (categoryName: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.name !== categoryName)
    );
  };

  const addSubTask = (taskId: number, subTaskText: string) => {
    const newSubTask: SubTask = {
      id: nextSubTaskId,
      text: subTaskText,
      completed: false,
    };
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [...(task.subTasks || []), newSubTask],
            }
          : task
      )
    );
    setNextSubTaskId(nextSubTaskId + 1);
  };

  const toggleSubTaskCompletion = (taskId: number, subTaskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: (task.subTasks || []).map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              ),
            }
          : task
      )
    );
  };

  const value = {
    tasks,
    categories,
    toggleTaskCompletion,
    addTask,
    editTask,
    deleteTask,
    getTask,
    addCategory,
    deleteCategory,
    addSubTask,
    toggleSubTaskCompletion,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}