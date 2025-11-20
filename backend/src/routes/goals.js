import express from 'express';
import {
    getAllGoals,
    getGoalById,
    createGoal,
    updateGoal,
    deleteGoal,
    toggleGoalCompletion,
    getGoalProgress
} from '../controllers/goalController.js';

const router = express.Router();

// Goal routes
router.get('/', getAllGoals);
router.get('/:id', getGoalById);
router.get('/:id/progress', getGoalProgress);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.post('/:id/toggle', toggleGoalCompletion);
router.delete('/:id', deleteGoal);

export default router;
