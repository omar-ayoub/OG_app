// src/types/index.ts

export interface SubTask {
  id: number;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  text: string;
  time: string;
  startDate?: string;
  endDate?: string;
  tag: string;
  tagColor: string;
  isCompleted: boolean;
  description?: string;
  subTasks?: SubTask[];
  goalId?: string;
}

export interface Category {
  name: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  tasks: number[];
  completed: boolean;
}

export interface Habit {
  id: number;
  name: string;
  icon: string;
  streak: number;
  goal: number;
  completedToday: boolean;
  progress: number;
}