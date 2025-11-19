import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../../contexts/useHabits';

function CreateHabitPage() {
  const navigate = useNavigate();
  const { addHabit } = useHabits();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('fitness_center'); // Default icon
  const [goal, setGoal] = useState(1);

  const handleCreateHabit = () => {
    if (name.trim()) {
      addHabit({
        id: Date.now(),
        name,
        icon,
        completedDates: [],
        frequency: 'daily',
        goal,
        taskIds: [],
      });
      navigate('/habits');
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-text-light-primary dark:text-text-dark-primary">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border-light bg-background-light/80 px-4 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-secondary-light hover:bg-black/5 dark:text-text-secondary-dark dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold leading-tight tracking-[-0.015em]">Create New Habit</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Habit Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="habit-name" className="text-sm font-medium">Habit Name</label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink Water, Read Book"
              className="rounded-lg border border-border-light bg-card-light p-3 text-text-light-primary dark:border-border-dark dark:bg-card-dark dark:text-text-dark-primary"
            />
          </div>

          {/* Habit Icon (simple text input for now) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="habit-icon" className="text-sm font-medium">Icon Name (Material Symbols)</label>
            <input
              id="habit-icon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., fitness_center, book"
              className="rounded-lg border border-border-light bg-card-light p-3 text-text-light-primary dark:border-border-dark dark:bg-card-dark dark:text-text-dark-primary"
            />
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Find icons at <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-primary">Material Symbols</a></p>
          </div>

          {/* Habit Goal (e.g., times per week) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="habit-goal" className="text-sm font-medium">Goal (times per day/week)</label>
            <input
              id="habit-goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(parseInt(e.target.value, 10))}
              min="1"
              className="rounded-lg border border-border-light bg-card-light p-3 text-text-light-primary dark:border-border-dark dark:bg-card-dark dark:text-text-dark-primary"
            />
          </div>
        </div>
      </main>

      {/* Create Button */}
      <div className="sticky bottom-0 flex shrink-0 items-center justify-end gap-3 border-t border-border-light bg-background-light/80 px-4 py-3 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <button onClick={() => navigate(-1)} className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary-light hover:bg-card-light dark:text-text-secondary-dark dark:hover:bg-card-dark">
          Cancel
        </button>
        <button onClick={handleCreateHabit} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          Create Habit
        </button>
      </div>
    </div>
  );
}

export default CreateHabitPage;
