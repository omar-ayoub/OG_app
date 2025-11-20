import express from 'express';
import {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getAllCategories,
    createCategory,
    deleteCategory,
    getAllBudgets,
    upsertBudget,
    getAllRecurring,
    createRecurring,
    updateRecurring
} from '../controllers/expenseController.js';

const router = express.Router();

// Expense routes
router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

// Category routes
router.get('/categories/all', getAllCategories); // /categories/all to avoid conflict with /:id
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

// Budget routes
router.get('/budgets/all', getAllBudgets);
router.post('/budgets', upsertBudget);

// Recurring routes
router.get('/recurring/all', getAllRecurring);
router.post('/recurring', createRecurring);
router.put('/recurring/:id', updateRecurring);

export default router;
