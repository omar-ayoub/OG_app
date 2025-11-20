import express from 'express';
import {
    getAllHabits,
    getHabitById,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitStreak
} from '../controllers/habitController.js';

const router = express.Router();

// Habit routes
router.get('/', getAllHabits);
router.get('/:id', getHabitById);
router.get('/:id/streak', getHabitStreak);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.post('/:id/complete', toggleHabitCompletion);
router.delete('/:id', deleteHabit);

export default router;
