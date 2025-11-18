// src/components/EditTaskPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../contexts/useTasks';
import { useHabits } from '../contexts/useHabits';
import type { SubTask } from '../types';

function EditTaskPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addTask, updateTask, getTask, categories, addSubTask, editSubTask, deleteSubTask } = useTasks();
  const { habits } = useHabits();

  const [formData, setFormData] = useState({
    text: '',
    startDate: '',
    endDate: '',
    time: '',
    tag: categories[0]?.name || '',
    description: '',
  });
  const [isRepetitive, setIsRepetitive] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState<'daily' | 'weekly' | 'monthly' | undefined>(undefined);
  const [habitId, setHabitId] = useState<number | undefined>(undefined);
  const [newSubTaskText, setNewSubTaskText] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [editingSubTaskId, setEditingSubTaskId] = useState<number | null>(null);
  const [editingSubTaskText, setEditingSubTaskText] = useState('');

  const isEditMode = id !== undefined;
  const task = isEditMode ? getTask(parseInt(id, 10)) : undefined;

  useEffect(() => {
    if (isEditMode && task) {
      setTimeout(() => {
        setFormData({
          text: task.text,
          startDate: task.startDate || '',
          endDate: task.endDate || '',
          time: task.time || '',
          tag: task.tag,
          description: task.description || '',
        });
        setIsRepetitive(task.isRepetitive || false);
        setRepeatFrequency(task.repeatFrequency || undefined);
        setHabitId(task.habitId || undefined);
        setSubTasks(task.subTasks || []);
      }, 0);
    } else {
      // Reset form data when not in edit mode (e.g., creating a new task)
      setTimeout(() => {
        setFormData({
          text: '',
          startDate: '',
          endDate: '',
          time: '',
          tag: categories[0]?.name || '',
          description: '',
        });
        setSubTasks([]);
      }, 0);
    }
  }, [id, isEditMode, getTask, categories, task]);

  const handleSave = () => {
    if (!formData.text.trim()) {
      alert('Please enter a task name.');
      return;
    }
    const selectedCategory = categories.find(c => c.name === formData.tag);
    if (!selectedCategory) {
      alert('Please select a valid category.');
      return;
    }

    const taskData = {
      text: formData.text,
      time: formData.time || 'Anytime',
      startDate: formData.startDate,
      endDate: formData.endDate,
      tag: selectedCategory.name,
      tagColor: selectedCategory.color,
      description: formData.description,
      subTasks: subTasks,
      isRepetitive,
      repeatFrequency: isRepetitive ? repeatFrequency : undefined,
      habitId: habitId || undefined,
    };

    if (isEditMode) {
      const taskId = parseInt(id, 10);
      updateTask(taskId, taskData);
    } else {
      addTask(taskData);
    }

    navigate('/');
  };

  const handleAddSubTask = () => {
    if (newSubTaskText.trim() && isEditMode) {
      const taskId = parseInt(id, 10);
      addSubTask(taskId, newSubTaskText);
      setNewSubTaskText('');
    }
  };

  const handleEditSubTask = (subTask: SubTask) => {
    setEditingSubTaskId(subTask.id);
    setEditingSubTaskText(subTask.text);
  };

  const handleSaveSubTask = (subTaskId: number) => {
    if (editingSubTaskText.trim() && isEditMode) {
      const taskId = parseInt(id, 10);
      editSubTask(taskId, subTaskId, editingSubTaskText);
      setEditingSubTaskId(null);
      setEditingSubTaskText('');
    }
  };

  const handleDeleteSubTask = (subTaskId: number) => {
    if (isEditMode) {
      const taskId = parseInt(id, 10);
      deleteSubTask(taskId, subTaskId);
    }
  };

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-20">
      <div className="flex h-full w-full flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:bg-background-dark/80">
          <button onClick={() => navigate(-1)} className="flex items-center justify-start">
            <p className="shrink-0 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Cancel</p>
          </button>
          <button onClick={handleSave} className="flex items-center justify-end">
            <p className="shrink-0 text-base font-bold leading-normal tracking-[0.015em] text-primary">{isEditMode ? 'Update' : 'Create'}</p>
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-4 pt-0">
          <div className="flex flex-col gap-4">
            <input
              className="form-input h-16 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-card-light p-4 text-2xl font-bold leading-tight tracking-[-0.015em] text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:bg-card-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
              placeholder="e.g., Finish Q3 report"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <div className="flex flex-wrap items-end gap-4">
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Due Date</p>
                  <div className="relative">
                    <input
                      type="date"
                      className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">calendar_today</span>
                  </div>
                </label>
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Time</p>
                  <div className="relative">
                    <input
                      type="time"
                      className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">schedule</span>
                  </div>
                </label>
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">End Date</p>
                  <div className="relative">
                    <input
                      type="date"
                      className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">event</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isRepetitive}
                  onChange={(e) => setIsRepetitive(e.target.checked)}
                  className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary/50"
                />
                <p className="text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Repetitive Task</p>
              </label>
              {isRepetitive && (
                <div className="flex flex-col gap-2">
                  <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Repeat Frequency</p>
                  <div className="relative flex h-14 w-full items-center rounded-lg border-none bg-input-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary">
                    <select
                      value={repeatFrequency || ''}
                      onChange={(e) => setRepeatFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                      className="w-full bg-transparent appearance-none"
                    >
                      <option value="">Select Frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Link to Habit</p>
                <div className="relative flex h-14 w-full items-center rounded-lg border-none bg-input-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary">
                  <select
                    value={habitId || ''}
                    onChange={(e) => setHabitId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    className="w-full bg-transparent appearance-none"
                  >
                    <option value="">No Habit</option>
                    {habits.map(habit => (
                      <option key={habit.id} value={habit.id}>{habit.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <div className="flex flex-col">
                <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Category</p>
                <div className="relative flex h-14 w-full items-center rounded-lg border-none bg-input-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary">
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full bg-transparent appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {isEditMode && (
              <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
                <p className="text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Sub-tasks</p>
                <div className="flex flex-col gap-2">
                  {subTasks.map(subTask => (
                    <div key={subTask.id} className="flex items-center justify-between">
                      {editingSubTaskId === subTask.id ? (
                        <input
                          type="text"
                          value={editingSubTaskText}
                          onChange={(e) => setEditingSubTaskText(e.target.value)}
                          className="form-input flex-1 rounded-lg border-none bg-input-light p-2 text-sm text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                        />
                      ) : (
                        <p className={`text-sm ${subTask.completed ? 'line-through' : ''}`}>{subTask.text}</p>
                      )}
                      <div className="flex gap-2">
                        {editingSubTaskId === subTask.id ? (
                          <button onClick={() => handleSaveSubTask(subTask.id)} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">Save</button>
                        ) : (
                          <button onClick={() => handleEditSubTask(subTask)} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-800">Edit</button>
                        )}
                        <button onClick={() => handleDeleteSubTask(subTask.id)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubTaskText}
                    onChange={(e) => setNewSubTaskText(e.target.value)}
                    placeholder="Add a new sub-task"
                    className="form-input flex-1 rounded-lg border-none bg-input-light p-2 text-sm text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                  />
                  <button onClick={handleAddSubTask} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">Add</button>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <label className="flex flex-1 flex-col min-w-40">
                <p className="text-base font-medium leading-normal pb-2 text-text-light-primary dark:text-text-dark-primary">Description</p>
                <textarea
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-0 border-none bg-input-light dark:bg-input-dark min-h-36 placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary p-4 text-base font-normal leading-normal"
                  placeholder="Add more details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditTaskPage;
