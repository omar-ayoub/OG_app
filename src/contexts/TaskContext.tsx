// src/contexts/TaskContext.tsx
import { useState, type ReactNode, useCallback } from 'react';
import type { Task, Category, SubTask } from '../types';
import { TaskContext } from './TaskContextDefinition';

// --- PROVIDER COMPONENT ---
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [nextId, setNextId] = useState(5);
  const [nextSubTaskId, setNextSubTaskId] = useState(3);

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const newIsCompleted = !task.isCompleted;
          const updatedSubTasks =
            task.subTasks?.map((sub) => ({
              ...sub,
              completed: newIsCompleted,
            })) || [];
          return {
            ...task,
            isCompleted: newIsCompleted,
            subTasks: updatedSubTasks,
          };
        }
        return task;
      })
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
      isRepetitive: newTaskData.isRepetitive || false,
      repeatFrequency: newTaskData.repeatFrequency,
      habitId: newTaskData.habitId,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNextId(nextId + 1);
    return newTask.id;
  };

  const updateTask = (taskId: number, updatedTaskData: Partial<Task>) => {
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
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubTasks = (task.subTasks || []).map((subTask) =>
            subTask.id === subTaskId
              ? { ...subTask, completed: !subTask.completed }
              : subTask
          );

          const allSubTasksCompleted = updatedSubTasks.every(
            (subTask) => subTask.completed
          );

          return {
            ...task,
            isCompleted: allSubTasksCompleted,
            subTasks: updatedSubTasks,
          };
        }
        return task;
      })
    );
  };

  const editSubTask = (taskId: number, subTaskId: number, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
            ...task,
            subTasks: (task.subTasks || []).map((subTask) =>
              subTask.id === subTaskId ? { ...subTask, text: newText } : subTask
            ),
          }
          : task
      )
    );
  };

  const deleteSubTask = (taskId: number, subTaskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
            ...task,
            subTasks: (task.subTasks || []).filter(
              (subTask) => subTask.id !== subTaskId
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