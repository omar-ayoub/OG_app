// src/components/CreateGoalPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../contexts/useGoals';
import { useTasks } from '../contexts/useTasks'; // To get incomplete tasks

function CreateGoalPage() {
  const navigate = useNavigate();
  const { addGoal } = useGoals();
  const { tasks, addTask, categories } = useTasks(); // Get all tasks and addTask

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [resources, setResources] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [newTaskText, setNewTaskText] = useState(''); // For adding new tasks directly

  const incompleteTasks = tasks.filter(task => !task.isCompleted);

  const handleCreateGoal = () => {
    if (!title.trim()) {
      alert('Please enter a goal title.');
      return;
    }

    addGoal({
      title,
      description,
      targetDate,
      tasks: selectedTaskIds,
      completed: false, // Goals are initially not completed
    });

    navigate('/'); // Navigate back to dashboard
  };

  const handleTaskSelection = (taskId: number) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleAddNewTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      const defaultCategory = categories[0]; // Use the first category as default
      const newTaskId = addTask({
        text: newTaskText.trim(),
        time: 'Anytime', // Default time
        tag: defaultCategory.name,
        tagColor: defaultCategory.color,
        isCompleted: false,
      });
      setSelectedTaskIds((prev) => [...prev, newTaskId]);
      setNewTaskText(''); // Clear the input field
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/30">
      <div className="flex h-[95dvh] max-h-[880px] w-full flex-col overflow-y-auto rounded-t-xl bg-background-light dark:bg-background-dark shadow-2xl">
        <div className="sticky top-0 z-10 flex h-16 items-center border-b border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm">
          <button onClick={() => navigate(-1)} className="flex items-center justify-start text-base font-medium text-primary">Cancel</button>
          <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-text-dark-primary">New Goal</h2>
          <button onClick={handleCreateGoal} className="flex items-center justify-end text-base font-bold text-primary">Create</button>
        </div>
        <div className="flex-1 pb-4">
          <div className="flex flex-col gap-y-4 p-4">
            <div className="flex flex-col gap-1.5">
              <label className="px-1 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary" htmlFor="goal-title">Goal Title</label>
              <input
                className="w-full rounded-lg border-border-light bg-card-light px-4 py-3 text-base text-text-light-primary placeholder:text-text-light-secondary/70 focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-card-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary/70"
                id="goal-title"
                placeholder="e.g. Learn Advanced UI Design"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="px-1 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary" htmlFor="description">Description</label>
              <textarea
                className="w-full rounded-lg border-border-light bg-card-light px-4 py-3 text-base text-text-light-primary placeholder:text-text-light-secondary/70 focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-card-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary/70"
                id="description"
                placeholder="Add a description..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <button className="flex w-full items-center justify-between rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 text-left">
              <div className="flex items-center gap-x-3">
                <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">calendar_month</span>
                <span className="text-base font-medium text-text-light-primary dark:text-text-dark-primary">Set Target Date</span>
              </div>
              <input
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
              <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>
            </button>
          </div>
          <div className="px-4">
            <div className="flex flex-col gap-1.5">
              <label className="px-1 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary" htmlFor="resources">Resources</label>
              <textarea
                className="w-full rounded-lg border-border-light bg-card-light px-4 py-3 text-base text-text-light-primary placeholder:text-text-light-secondary/70 focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-card-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary/70"
                id="resources"
                placeholder="Add links, notes, or files..."
                rows={3}
                value={resources}
                onChange={(e) => setResources(e.target.value)}
              ></textarea>
            </div>
            <div className="mt-4">
              <label className="px-1 pb-2 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">Tasks</label>
              <div className="mt-1.5 flex flex-col divide-y divide-border-light rounded-lg border border-border-light bg-card-light dark:divide-border-dark dark:border-border-dark dark:bg-card-dark">
                {incompleteTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-x-3 p-4">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary"
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={() => handleTaskSelection(task.id)}
                    />
                    <span className="flex-1 text-base text-text-light-primary dark:text-text-dark-primary">{task.text}</span>
                  </div>
                ))}
                <div className="flex items-center gap-x-3 p-4">
                  <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">add</span>
                  <input
                    className="flex-1 border-0 bg-transparent p-0 text-base text-text-light-primary placeholder:text-text-light-secondary/70 focus:ring-0 dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary/70"
                    placeholder="Add a new task"
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={handleAddNewTask}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGoalPage;
