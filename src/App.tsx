import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateTaskPage from './components/CreateTaskPage';
import EditTaskPage from './components/EditTaskPage';
import PlannerPage from './components/PlannerPage';
import CreateGoalPage from './components/CreateGoalPage'; // Import CreateGoalPage
import { TaskProvider } from './contexts/TaskContext';
import { GoalProvider } from './contexts/GoalContext'; // Import GoalProvider

function App() {
  return (
    <GoalProvider> {/* Wrap with GoalProvider */}
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-task" element={<CreateTaskPage />} />
          <Route path="/edit-task/:id" element={<EditTaskPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/create-goal" element={<CreateGoalPage />} /> {/* New route for CreateGoalPage */}
        </Routes>
      </TaskProvider>
    </GoalProvider>
  );
}

export default App;