import { habitQueries } from '../models/queries.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all habits
export const getAllHabits = asyncHandler(async (req, res) => {
    const habits = await habitQueries.getAll();
    res.json(habits);
});

// Get habit by ID
export const getHabitById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const habit = await habitQueries.getById(id);

    if (!habit) {
        return res.status(404).json({ error: 'Habit not found' });
    }

    res.json(habit);
});

// Create habit
export const createHabit = asyncHandler(async (req, res) => {
    const habit = await habitQueries.create(req.body);
    res.status(201).json(habit);
});

// Update habit
export const updateHabit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const habit = await habitQueries.update(id, req.body);
    res.json(habit);
});

// Delete habit
export const deleteHabit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const habit = await habitQueries.delete(id);

    if (!habit) {
        return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully', habit });
});

// Toggle habit completion
export const toggleHabitCompletion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    const result = await habitQueries.toggleCompletion(id, date);
    res.json(result);
});

// Get habit streak
export const getHabitStreak = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const streak = await habitQueries.getStreak(id);

    if (!streak) {
        return res.status(404).json({ error: 'Habit not found' });
    }

    res.json(streak);
});
