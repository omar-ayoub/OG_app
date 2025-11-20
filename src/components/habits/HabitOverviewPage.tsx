import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHabits } from '../../contexts/useHabits';
import BottomNavBar from '../layout/BottomNavBar';

function HabitOverviewPage() {
  const { habits, toggleHabitCompletion, calculateStreak, getTodayString } = useHabits();
  const [completedHabits, setCompletedHabits] = useState<Set<number>>(new Set());

  const handleToggle = (habitId: number) => {
    toggleHabitCompletion(habitId);

    // Add pulse animation
    setCompletedHabits(prev => new Set(prev).add(habitId));
    setTimeout(() => {
      setCompletedHabits(prev => {
        const next = new Set(prev);
        next.delete(habitId);
        return next;
      });
    }, 600);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-200/80 bg-background-light/80 px-4 backdrop-blur-sm dark:border-slate-800/80 dark:bg-background-dark/80">
        <h1 className="flex-1 text-xl font-bold text-slate-900 dark:text-slate-100">My Habits</h1>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>
      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <div className="flex flex-col gap-4">
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-100/50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>spa</span>
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">Start a New Habit</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tap the '+' button to begin your journey.</p>
            </div>
          ) : (
            habits.map((habit) => {
              const streak = calculateStreak(habit.completedDates);
              const isCompletedToday = habit.completedDates.includes(getTodayString());
              // Simple progress calculation: completed today = 100%, else 0% (for daily habits)
              // Or better: if frequency is weekly, calculate based on this week's completions.
              // For now, let's stick to daily logic:
              const progress = isCompletedToday ? 100 : 0;
              const isAnimating = completedHabits.has(habit.id);

              return (
                <Link to={`/habit-details/${habit.id}`} key={habit.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">{habit.icon}</span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{habit.name}</p>
                        <p className="text-sm font-medium text-amber-500">🔥 {streak} days</p>
                      </div>
                    </div>
                    <button
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${isCompletedToday
                        ? 'border-primary bg-primary text-white'
                        : 'border-slate-300 bg-transparent text-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-500 dark:hover:bg-slate-800'
                        } ${isAnimating ? 'animate-confetti' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggle(habit.id);
                      }}
                    >
                      <span className="material-symbols-outlined text-lg">check</span>
                    </button>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-10">
        <Link
          to="/create-habit"
          className="flex items-center justify-center size-16 bg-gradient-to-br from-[#4FD1C5] to-[#3B82F6] rounded-full shadow-lg text-white hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined !text-4xl">add</span>
        </Link>
      </div>
      <BottomNavBar />
    </div>
  );
}

export default HabitOverviewPage;
