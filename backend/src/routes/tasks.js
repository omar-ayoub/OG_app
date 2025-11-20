import express from 'express';
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByGoalId,
    getTasksByDateRange,
    addSubtask,
    updateSubtask,
    deleteSubtask
} from '../controllers/taskController.js';

const router = express.Router();

// Task routes
router.get('/', getAllTasks);
router.get('/by-date-range', getTasksByDateRange);
router.get('/goal/:goalId', getTasksByGoalId);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Subtask routes
router.post('/:id/subtasks', addSubtask);
router.put('/subtasks/:subtaskId', updateSubtask);
router.delete('/subtasks/:subtaskId', deleteSubtask);

export default router;
