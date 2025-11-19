import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import CreateTaskPage from './components/tasks/CreateTaskPage';
import EditTaskPage from './components/tasks/EditTaskPage';
import PlannerPage from './components/planner/PlannerPage';
import CreateGoalPage from './components/goals/CreateGoalPage';
import GoalDetailsPage from './components/goals/GoalDetailsPage';
import GoalOverviewPage from './components/goals/GoalOverviewPage';
import HabitOverviewPage from './components/habits/HabitOverviewPage';
import HabitDetailsPage from './components/habits/HabitDetailsPage';
import CreateHabitPage from './components/habits/CreateHabitPage';
import ExpenseOverviewPage from './components/expenses/ExpenseOverviewPage';
import ExpenseDetailsPage from './components/expenses/ExpenseDetailsPage';
import CategoryManagementPage from './components/expenses/CategoryManagementPage';
import BudgetManagementPage from './components/expenses/BudgetManagementPage';
import AnalyticsPage from './components/expenses/AnalyticsPage';
import RecurringExpensesPage from './components/expenses/RecurringExpensesPage';
import { TaskProvider } from './contexts/TaskContext';
import { GoalProvider } from './contexts/GoalContext';
import { HabitProvider } from './contexts/HabitContext';
import { ExpenseProvider } from './contexts/ExpenseProvider';

function App() {
    return (
        <ExpenseProvider>
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
                            <Route path="/expenses" element={<ExpenseOverviewPage />} />
                            <Route path="/expense-details/:id" element={<ExpenseDetailsPage />} />
                            <Route path="/expense-categories" element={<CategoryManagementPage />} />
                            <Route path="/expense-budgets" element={<BudgetManagementPage />} />
                            <Route path="/expense-analytics" element={<AnalyticsPage />} />
                            <Route path="/expense-recurring" element={<RecurringExpensesPage />} />
                        </Routes>
                    </TaskProvider>
                </GoalProvider>
            </HabitProvider>
        </ExpenseProvider>
    );
}

export default App;