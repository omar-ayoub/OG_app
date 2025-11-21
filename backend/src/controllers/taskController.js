import { taskQueries, subtaskQueries } from '../models/queries.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all tasks
export const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await taskQueries.getAll();
    res.json(tasks);
});

// Get task by ID
export const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const task = await taskQueries.getById(id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
});

// Create task
export const createTask = asyncHandler(async (req, res) => {
    const task = await taskQueries.create(req.body);
    res.status(201).json(task);
});

// Update task
export const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const task = await taskQueries.update(id, req.body);
    res.json(task);
});

// Delete task
export const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const task = await taskQueries.delete(id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task });
});

// Get tasks by goal ID
export const getTasksByGoalId = asyncHandler(async (req, res) => {
    const { goalId } = req.params;
    const tasks = await taskQueries.getByGoalId(goalId);
    res.json(tasks);
});

// Get tasks by date range
export const getTasksByDateRange = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const tasks = await taskQueries.getByDateRange(startDate, endDate);
    res.json(tasks);
});

// Add subtask to task
export const addSubtask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { text, completed, position } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Subtask text is required' });
    }

    const subtask = await subtaskQueries.create(id, text, completed, position);
    res.status(201).json(subtask);
});

// Update subtask
export const updateSubtask = asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    const { text, completed } = req.body;

    const subtask = await subtaskQueries.update(subtaskId, text, completed);

    if (!subtask) {
        return res.status(404).json({ error: 'Subtask not found' });
    }

    res.json(subtask);
});

// Delete subtask
export const deleteSubtask = asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    const subtask = await subtaskQueries.delete(subtaskId);

    if (!subtask) {
        return res.status(404).json({ error: 'Subtask not found' });
    }

    res.json({ message: 'Subtask deleted successfully', subtask });
});

// Get all task categories
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await taskQueries.getAllCategories();
    res.json(categories);
});

