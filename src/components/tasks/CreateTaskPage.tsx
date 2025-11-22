// src/components/CreateTaskPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTasks } from '../../contexts/useTasks';
import type { SubTask } from '../../types';

function CreateTaskPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTask, categories } = useTasks();

  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(''); // New state for endDate
  const [time, setTime] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTaskText, setNewSubTaskText] = useState('');
  const [isRepetitive, setIsRepetitive] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState<'daily' | 'weekly' | 'monthly' | undefined>(undefined);
  const [habitId] = useState<number | undefined>(undefined);

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !tag) {
      setTag(categories[0].name);
    }
  }, [categories, tag]);

  const handleAddSubTask = () => {
    if (newSubTaskText.trim()) {
      setSubTasks([...subTasks, { id: Date.now(), text: newSubTaskText, completed: false }]);
      setNewSubTaskText('');
    }
  };

  const handleCreate = async () => {
    console.log('=== handleCreate called ===');
    console.log('Current state:', { text, tag, categories, startDate, endDate });

    if (!text.trim()) {
      alert('Please enter a task name.');
      return;
    }
    const selectedCategory = categories.find(c => c.name === tag);
    console.log('Selected category:', selectedCategory);

    if (!selectedCategory) {
      alert('Please select a valid category.');
      return;
    }

    console.log('Calling addTask with:', {
      text,
      time,
      startDate,
      endDate,
      tag: selectedCategory.name,
      tagColor: selectedCategory.color,
      description,
      subTasks,
      isRepetitive,
      repeatFrequency,
    });

    try {
      const createdTask = await addTask({
        text,
        time: time && time !== 'Anytime' ? time : undefined,
        startDate,
        endDate,
        tag: selectedCategory.name,
        tagColor: selectedCategory.color,
        description,
        subTasks,
        isRepetitive,
        repeatFrequency: isRepetitive ? repeatFrequency : undefined,
        habitId: habitId || undefined,
      });

      console.log('Created task result:', createdTask);

      if (!createdTask) {
        console.error('addTask returned undefined');
        alert('Failed to create task - please check the console for details');
        return;
      }

      console.log('Task created successfully, navigating...');

      const from = location.state?.from;
      const goalData = location.state?.goalData;

      if (from && goalData && from === `/goal-details/${goalData.id}`) {
        const updatedGoalTasks = [...(goalData.tasks || []), createdTask.id];
        navigate(from, { state: { goalData: { ...goalData, tasks: updatedGoalTasks } } });
      } else if (from === '/create-goal' && goalData) {
        navigate(from, { state: { newTaskId: createdTask.id, goalData } });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error in handleCreate:', error);
      alert(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="form-page">
      <div className="flex h-full w-full flex-col">
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="btn-ghost p-0">
            <p className="text-base font-medium">Cancel</p>
          </button>
          <button onClick={handleCreate} className="btn-ghost p-0">
            <p className="text-base font-bold text-primary">Create</p>
          </button>
        </div>
        <main className="form-content">
          <div className="flex flex-col gap-4">
            <input
              className="input-field h-16 text-2xl font-bold tracking-[-0.015em] bg-card-light dark:bg-card-dark"
              placeholder="e.g., Finish Q3 report"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="card flex flex-col gap-4">
              <div className="flex flex-wrap items-end gap-4">
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium">Due Date</p>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      className="input-field pr-12"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="input-icon material-symbols-outlined">calendar_today</span>
                  </div>
                </label>
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium">Time</p>
                  <div className="input-wrapper">
                    <input
                      type="time"
                      className="input-field pr-12"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                    <span className="input-icon material-symbols-outlined">schedule</span>
                  </div>
                </label>
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium">End Date</p>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      className="input-field pr-12"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <span className="input-icon material-symbols-outlined">event</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="card flex flex-col gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isRepetitive}
                  onChange={(e) => setIsRepetitive(e.target.checked)}
                  className="input-checkbox"
                />
                <p className="text-base font-medium">Repetitive Task</p>
              </label>
              {isRepetitive && (
                <div className="flex flex-col gap-2">
                  <p className="pb-2 text-base font-medium">Repeat Frequency</p>
                  <select
                    value={repeatFrequency || ''}
                    onChange={(e) => setRepeatFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                    className="input-select"
                  >
                    <option value="">Select Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>
            <div className="card flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="pb-2 text-base font-medium">Category</p>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="input-select"
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card flex flex-col gap-4">
              <p className="text-base font-medium">Sub-tasks</p>
              <div className="flex flex-col gap-2">
                {subTasks.map(subTask => (
                  <div key={subTask.id} className="flex items-center justify-between">
                    <p className="text-sm">{subTask.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubTaskText}
                  onChange={(e) => setNewSubTaskText(e.target.value)}
                  placeholder="Add a new sub-task"
                  className="input-field flex-1 h-10 text-sm"
                />
                <button onClick={handleAddSubTask} className="btn-primary px-4 py-2 text-sm">Add</button>
              </div>
            </div>
            <div className="card flex flex-col gap-4">
              <label className="flex flex-1 flex-col min-w-40">
                <p className="text-base font-medium pb-2">Description</p>
                <textarea
                  className="input-textarea"
                  placeholder="Add more details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateTaskPage;
