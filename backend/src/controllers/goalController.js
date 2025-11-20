import { goalQueries } from '../models/queries.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all goals
export const getAllGoals = asyncHandler(async (req, res) => {
    const goals = await goalQueries.getAll();
    res.json(goals);
});

// Get goal by ID
export const getGoalById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const goal = await goalQueries.getById(id);

    if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
    }

    res.json(goal);
});

// Create goal
export const createGoal = asyncHandler(async (req, res) => {
    const goal = await goalQueries.create(req.body);
    res.status(201).json(goal);
});

// Update goal
export const updateGoal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const goal = await goalQueries.update(id, req.body);
    res.json(goal);
});

// Delete goal
export const deleteGoal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const goal = await goalQueries.delete(id);

    if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully', goal });
});

// Toggle goal completion
export const toggleGoalCompletion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const goal = await goalQueries.toggleCompletion(id);
    res.json(goal);
});

// Get goal progress
export const getGoalProgress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const progress = await goalQueries.getProgress(id);

    if (!progress) {
        return res.status(404).json({ error: 'Goal not found' });
    }

    res.json(progress);
});
