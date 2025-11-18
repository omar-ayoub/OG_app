import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateTaskPage from './components/CreateTaskPage';
import EditTaskPage from './components/EditTaskPage';
import PlannerPage from './components/PlannerPage';
import CreateGoalPage from './components/CreateGoalPage';
import GoalDetailsPage from './components/GoalDetailsPage';
import GoalOverviewPage from './components/GoalOverviewPage';
import HabitOverviewPage from './components/HabitOverviewPage';
import HabitDetailsPage from './components/HabitDetailsPage';
import CreateHabitPage from './components/CreateHabitPage';
import { TaskProvider } from './contexts/TaskContext';
import { GoalProvider } from './contexts/GoalContext';
import { HabitProvider } from './contexts/HabitContext';

function App() {
  return (
    <HabitProvider>
      <GoalProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-task" element={<CreateTaskPage />} />
            <Route path="/edit-task/:id" element={<EditTaskPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/create-goal" element={<CreateGoalPage />} />
            <Route path="/goal-details/:id" element={<GoalDetailsPage />} />
            <Route path="/goals" element={<GoalOverviewPage />} />
            <Route path="/habits" element={<HabitOverviewPage />} />
            <Route path="/habit-details/:id" element={<HabitDetailsPage />} />
            <Route path="/create-habit" element={<CreateHabitPage />} />
          </Routes>
        </TaskProvider>
      </GoalProvider>
    </HabitProvider>
  );
}

export default App;