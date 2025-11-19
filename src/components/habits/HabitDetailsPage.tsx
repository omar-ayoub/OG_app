import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHabits } from '../../contexts/useHabits';

function HabitDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getHabit, calculateStreak, calculateBestStreak, getTodayString } = useHabits();

  const [calendarDate, setCalendarDate] = useState(new Date());

  const habit = id ? getHabit(parseInt(id, 10)) : undefined;

  if (!habit) {
    return <div className="p-4 text-center">Habit not found.</div>;
  }

  // Calculate stats
  const currentStreak = calculateStreak(habit.completedDates);
  const bestStreak = calculateBestStreak(habit.completedDates);

  // Calculate completion rate for the current month
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const completionsThisMonth = habit.completedDates.filter(date => {
    const d = new Date(date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;
  const completionRate = Math.round((completionsThisMonth / daysInMonth) * 100);

  const handlePrevMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCalendarDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCalendarDate(newDate);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
        <button onClick={() => navigate(-1)} className="text-text-primary-light dark:text-text-primary-dark flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-text-primary-light dark:text-text-primary-dark text-lg font-semibold leading-tight tracking-[-0.015em] flex-1 text-center">{habit.name}</h1>
        <button className="text-text-primary-light dark:text-text-primary-dark flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-2xl">more_horiz</span>
        </button>
      </header>
      <main className="flex flex-col gap-6 p-4">
        <section className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-accent-orange text-3xl">local_fire_department</span>
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold leading-tight">{currentStreak}</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium leading-normal">Current Streak</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-accent-green text-3xl">workspace_premium</span>
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold leading-tight">{bestStreak}</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium leading-normal">Best Streak</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-accent-blue text-3xl">check_circle</span>
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold leading-tight">{habit.completedDates.length}</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium leading-normal">Total Completions</p>
          </div>
        </section>

        {/* Completion Rate Card */}
        <section className="flex items-center justify-between rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
            </div>
            <div>
              <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-semibold">Monthly Completion Rate</p>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{completionsThisMonth} of {daysInMonth} days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold">{completionRate}%</p>
          </div>
        </section>
        <section className="flex flex-col rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4">
          <div className="flex items-center justify-between pb-2">
            <button onClick={handlePrevMonth} className="flex size-10 items-center justify-center rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <p className="text-text-primary-light dark:text-text-primary-dark text-base font-semibold leading-tight text-center">
              {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
            <button onClick={handleNextMonth} className="flex size-10 items-center justify-center rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <p key={`${day}-${i}`} className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">{day}</p>
            ))}


            {/* Calendar Logic */}
            {(() => {
              const year = calendarDate.getFullYear();
              const month = calendarDate.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const firstDayOfMonth = new Date(year, month, 1).getDay();

              const days = [];
              // Empty cells for days before start of month
              for (let i = 0; i < firstDayOfMonth; i++) {
                days.push(<div key={`empty-${i}`} className="h-10 w-full"></div>);
              }

              // Days of the month
              for (let i = 1; i <= daysInMonth; i++) {
                // Better date string construction to avoid timezone issues:
                const d = new Date(year, month, i);
                const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                const isCompleted = habit.completedDates.includes(localDateStr);
                const isToday = localDateStr === getTodayString();

                days.push(
                  <div key={i} className="h-10 w-full text-text-primary-light dark:text-text-primary-dark text-sm font-medium leading-normal flex items-center justify-center">
                    <div className={`flex size-9 items-center justify-center rounded-full transition-all ${isCompleted ? 'bg-primary text-white scale-110' : isToday ? 'border-2 border-primary text-primary' : ''}`}>
                      {i}
                    </div>
                  </div>
                );
              }
              return days;
            })()}
          </div>
        </section>
        <section className="flex flex-col rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4">
          <p className="text-text-primary-light dark:text-text-primary-dark text-base font-semibold leading-normal">Completions Over Time</p>
          <div className="flex items-baseline gap-2 pt-1">
            <p className="text-text-primary-light dark:text-text-primary-dark tracking-light text-3xl font-bold leading-tight truncate">
              {habit.completedDates.filter(d => {
                const date = new Date(d);
                const now = new Date();
                return date >= new Date(now.setDate(now.getDate() - 30));
              }).length}
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium leading-normal">in last 30 days</p>
          </div>
          <div className="flex min-h-[200px] flex-1 flex-col pt-6 -mx-2">
            {/* Simple Bar Chart */}
            <div className="flex-1 flex items-end justify-between px-4 gap-3 h-40">
              {(() => {
                const months = [];
                const maxCount = Math.max(...Array.from({ length: 6 }, (_, i) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - (5 - i));
                  const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                  return habit.completedDates.filter(date => date.startsWith(monthKey)).length;
                }), 1); // At least 1 to avoid division by zero

                for (let i = 5; i >= 0; i--) {
                  const d = new Date();
                  d.setMonth(d.getMonth() - i);
                  const monthName = d.toLocaleString('default', { month: 'short' });
                  const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

                  const count = habit.completedDates.filter(date => date.startsWith(monthKey)).length;
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  months.push(
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                      <div className="w-full bg-slate-200/50 dark:bg-slate-700/30 rounded-t-lg relative h-full flex items-end overflow-hidden">
                        <div
                          style={{ height: `${height}%` }}
                          className="w-full bg-gradient-to-t from-primary to-primary/80 rounded-t-lg transition-all duration-500 group-hover:from-primary/90 group-hover:to-primary relative"
                        >
                          {count > 0 && (
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-text-primary-light dark:text-text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity">
                              {count}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">{monthName}</span>
                    </div>
                  );
                }
                return months;
              })()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HabitDetailsPage;
