import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../../contexts/useTasks';
import { useGoals } from '../../contexts/useGoals';
import { useHabits } from '../../contexts/useHabits';
import BottomNavBar from '../layout/BottomNavBar';

function Dashboard() {
  const { tasks, toggleTaskCompletion, toggleSubTaskCompletion, deleteTask } = useTasks();
  const { goals } = useGoals();
  const { habits, calculateStreak } = useHabits();

  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'Dashboard' | 'Tomorrow' | 'Week'>('Dashboard');

  if (!tasks || !goals || !habits) {
    return <div>Loading...</div>;
  }

  const isTomorrow = (taskDate?: string) => {
    if (!taskDate) return false;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const task = new Date(taskDate);

    return task.getDate() === tomorrow.getDate() &&
      task.getMonth() === tomorrow.getMonth() &&
      task.getFullYear() === tomorrow.getFullYear();
  };

  const getFilteredTasks = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    switch (selectedFilter) {
      case 'Dashboard':
        return tasks.filter(task => {
          if (!task.startDate) return true;
          return task.startDate === todayString;
        });
      case 'Tomorrow':
        return tasks.filter(task => isTomorrow(task.startDate));
      case 'Week':
        return tasks;
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const incompleteTasks = tasks.filter(task => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return !task.isCompleted && (!task.startDate || task.startDate === todayString);
  }).length;

  return (
    <div className="page-container">
      {/* Top App Bar */}
      <div className="app-bar">
        <div className="flex items-center h-12 justify-between">
          <h1 className="heading-page">Hi, Omar!</h1>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card-light dark:bg-card-dark">
            <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">notifications</span>
          </div>
        </div>
        <p className="text-secondary">
          You have {incompleteTasks} {incompleteTasks === 1 ? 'task' : 'tasks'} for today.
        </p>
      </div>

      {/* My Goals Section */}
      <h2 className="heading-section content-section">My Goals</h2>
      <div className="card-horizontal-container">
        {goals.map((goal) => {
          const goalTasks = tasks.filter(task => goal.tasks.includes(task.id));
          const completedGoalTasks = goalTasks.filter(task => task.isCompleted).length;
          const progress = goalTasks.length > 0 ? (completedGoalTasks / goalTasks.length) * 100 : 0;

          return (
            <Link to={`/goal-details/${goal.id}`} key={goal.id} className="card-horizontal w-64">
              <div>
                <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">{goal.title}</h3>
                {goal.description && <p className="text-small-secondary mt-1">{goal.description}</p>}
                {goal.targetDate && <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">Target: {goal.targetDate}</p>}
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">{Math.round(progress)}% Complete</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* My Habits Section */}
      <h2 className="heading-section content-section">My Habits</h2>
      <div className="card-horizontal-container">
        {habits.map((habit) => (
          <Link to={`/habit-details/${habit.id}`} key={habit.id} className="card-horizontal w-32 flex flex-col items-center justify-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">{habit.icon}</span>
            </div>
            <p className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary mt-2 text-center">{habit.name}</p>
            <p className="text-xs font-medium text-amber-500">🔥 {calculateStreak(habit.completedDates)} days</p>
          </Link>
        ))}
      </div>

      {/* Tasks Section */}
      <main className="content-main">
        <h2 className="heading-section pb-3">Tasks</h2>
        <div className="flex w-full items-center gap-2 rounded-lg bg-background-light dark:bg-card-dark p-1 mb-4">
          <button
            onClick={() => setSelectedFilter('Dashboard')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${selectedFilter === 'Dashboard' ? 'bg-primary text-white' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setSelectedFilter('Tomorrow')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${selectedFilter === 'Tomorrow' ? 'bg-primary text-white' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setSelectedFilter('Week')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${selectedFilter === 'Week' ? 'bg-primary text-white' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}
          >
            Week
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="card flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={task.isCompleted ? 'task-checkbox-checked' : 'task-checkbox-unchecked'}
                >
                  {task.isCompleted && <span className="material-symbols-outlined text-white !text-lg">check</span>}
                </button>
                <div className="flex-1">
                  <p className={`text-base font-medium ${task.isCompleted ? 'line-through' : ''}`}>{task.text}</p>
                  <p className="text-small-secondary">{task.time}</p>
                </div>
                <div
                  className="category-tag"
                  style={{ backgroundColor: `${task.tagColor}20`, color: task.tagColor }}
                >
                  {task.tag}
                </div>
                <div className="flex gap-2">
                  <Link to={`/edit-task/${task.id}`} className="text-primary text-sm">Edit</Link>
                  <button onClick={() => deleteTask(task.id)} className="text-red-500 text-sm">Delete</button>
                </div>
              </div>
              {task.subTasks && task.subTasks.length > 0 && (
                <div className="flex flex-col gap-2 pl-10">
                  {task.subTasks.map((subTask) => (
                    <div key={subTask.id} className="flex items-center gap-4">
                      <button
                        onClick={() => toggleSubTaskCompletion(task.id, subTask.id)}
                        className={subTask.completed ? 'subtask-checkbox-checked' : 'subtask-checkbox-unchecked'}
                      >
                        {subTask.completed && <span className="material-symbols-outlined text-white !text-base">check</span>}
                      </button>
                      <p className={`text-sm ${subTask.completed ? 'line-through' : ''}`}>{subTask.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="h-24"></div> {/* Spacer for FAB and Bottom Nav */}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-10">
        {isFabMenuOpen && (
          <div className="flex flex-col items-end gap-4 mb-4">
            <Link to="/create-task" className="card flex items-center gap-3 shadow-lg">
              <span className="font-medium">Task</span>
              <span className="material-symbols-outlined">task</span>
            </Link>
            <Link to="/create-goal" className="card flex items-center gap-3 shadow-lg">
              <span className="font-medium">Goal</span>
              <span className="material-symbols-outlined">flag</span>
            </Link>
            <Link to="/create-habit" className="card flex items-center gap-3 shadow-lg">
              <span className="font-medium">Habit</span>
              <span className="material-symbols-outlined">sync</span>
            </Link>
          </div>
        )}
        <button
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          className="flex items-center justify-center size-16 bg-gradient-to-br from-[#4FD1C5] to-[#3B82F6] rounded-full shadow-lg text-white hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined !text-4xl">{isFabMenuOpen ? 'close' : 'add'}</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
}

export default Dashboard;