import { useNavigate, useParams } from 'react-router-dom';
import { useHabits } from '../../contexts/useHabits';

function HabitDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getHabit } = useHabits();

  const habit = id ? getHabit(parseInt(id, 10)) : undefined;

  if (!habit) {
    return <div className="p-4 text-center">Habit not found.</div>;
  }

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
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold leading-tight">{habit.streak}</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium leading-normal">Current Streak</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-accent-green text-3xl">workspace_premium</span>
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold leading-tight">{habit.streak + 10}</p> {/* Placeholder for best streak */}
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium leading-normal">Best Streak</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-accent-blue text-3xl">check_circle</span>
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold leading-tight">{habit.goal}</p> {/* Placeholder for completions */}
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium leading-normal">Completions</p>
          </div>
        </section>
        <section className="flex flex-col rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4">
          <div className="flex items-center justify-between pb-2">
            <button className="flex size-10 items-center justify-center rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <p className="text-text-primary-light dark:text-text-primary-dark text-base font-semibold leading-tight text-center">October 2024</p>
            <button className="flex size-10 items-center justify-center rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">S</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">M</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">T</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">W</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">T</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">F</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">S</p>
            {/* Calendar days - Placeholder */}
            {[...Array(31)].map((_, i) => (
              <div key={i} className="h-10 w-full text-text-primary-light dark:text-text-primary-dark text-sm font-medium leading-normal flex items-center justify-center">
                <div className={`flex size-9 items-center justify-center rounded-full ${i % 5 === 0 ? 'bg-primary text-white' : ''}`}>{i + 1}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="flex flex-col rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4">
          <p className="text-text-primary-light dark:text-text-primary-dark text-base font-semibold leading-normal">Completions Over Time</p>
          <div className="flex items-baseline gap-2 pt-1">
            <p className="text-text-primary-light dark:text-text-primary-dark tracking-light text-3xl font-bold leading-tight truncate">21</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium leading-normal">in last 30 days</p>
          </div>
          <div className="flex min-h-[180px] flex-1 flex-col pt-4 -mx-2">
            {/* Chart Placeholder */}
            <div className="flex-1 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
              [Chart Placeholder]
            </div>
            <div className="flex justify-between px-2 pt-2">
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium leading-normal">Sep</p>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium leading-normal">Oct</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HabitDetailsPage;
