import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoals } from '../../contexts/useGoals';
import { useTasks } from '../../contexts/useTasks';

function CreateGoalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addGoal, goals } = useGoals();
  const { tasks } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);

  const assignedTaskIds = new Set(goals.flatMap(goal => goal.tasks));

  const incompleteTasks = tasks.filter(task =>
    !task.isCompleted &&
    (!assignedTaskIds.has(task.id) || selectedTaskIds.includes(task.id))
  );

  useEffect(() => {
    setTimeout(() => {
      if (location.state?.goalData) {
        const { goalData, newTaskId } = location.state;
        setTitle(goalData.title || '');
        setDescription(goalData.description || '');
        setTargetDate(goalData.targetDate || '');

        let taskIds = goalData.selectedTaskIds || [];
        if (newTaskId && !taskIds.includes(newTaskId)) {
          taskIds = [...taskIds, newTaskId];
        }
        setSelectedTaskIds(taskIds);
      }
    }, 0);
  }, [location.state]);


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
      completed: false,
    });
    navigate('/');
  };

  const handleTaskSelection = (taskId: number) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleAddNewTaskClick = () => {
    navigate('/create-task', {
      state: {
        from: '/create-goal',
        goalData: { title, description, targetDate, selectedTaskIds },
      },
    });
  };

  return (
    <div className="form-page">
      <div className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="btn-ghost p-0">
            <p className="text-base font-medium">Cancel</p>
          </button>
          <h2 className="flex-1 text-center text-lg font-bold">New Goal</h2>
          <button onClick={handleCreateGoal} className="btn-ghost p-0">
            <p className="text-base font-bold text-primary">Create</p>
          </button>
        </div>

        {/* Main Content */}
        <main className="form-content">
          <div className="flex flex-col gap-4">
            {/* Goal Title Input */}
            <input
              className="input-field h-16 text-2xl font-bold bg-card-light dark:bg-card-dark"
              placeholder="e.g., Learn Advanced UI Design"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Details Section */}
            <div className="card flex flex-col gap-4">
              {/* Description */}
              <label className="flex flex-1 flex-col">
                <p className="pb-2 text-base font-medium">Description</p>
                <textarea
                  className="input-textarea"
                  placeholder="Add a description..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </label>

              {/* Target Date */}
              <label className="flex flex-1 flex-col">
                <p className="pb-2 text-base font-medium">Target Date</p>
                <div className="input-wrapper">
                  <input
                    type="date"
                    className="input-field pr-12"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                  <span className="input-icon material-symbols-outlined">calendar_today</span>
                </div>
              </label>
            </div>

            {/* Tasks Section */}
            <div className="card flex flex-col gap-4">
              <label className="text-base font-medium">Tasks</label>
              <div className="flex flex-col divide-y divide-border-light rounded-lg border border-border-light bg-input-light dark:divide-border-dark dark:border-border-dark dark:bg-input-dark">
                {incompleteTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-x-3 p-3">
                    <input
                      type="checkbox"
                      className="input-checkbox"
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={() => handleTaskSelection(task.id)}
                    />
                    <span className="flex-1 text-base">{task.text}</span>
                  </div>
                ))}
                <div className="flex items-center gap-x-3 p-3">
                  <button
                    onClick={handleAddNewTaskClick}
                    className="flex w-full items-center gap-x-3"
                  >
                    <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">add</span>
                    <span className="text-base">Add a new task</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateGoalPage;