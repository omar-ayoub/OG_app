import { expenseQueries } from '../models/queries.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// --- EXPENSES ---

export const getAllExpenses = asyncHandler(async (req, res) => {
    const expenses = await expenseQueries.getAll(req.query);
    res.json(expenses);
});

export const getExpenseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const expense = await expenseQueries.getById(id);

    if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
});

export const createExpense = asyncHandler(async (req, res) => {
    const expense = await expenseQueries.create(req.body);
    res.status(201).json(expense);
});

export const updateExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const expense = await expenseQueries.update(id, req.body);
    res.json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const expense = await expenseQueries.delete(id);

    if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully', expense });
});

// --- CATEGORIES ---

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await expenseQueries.getAllCategories();
    res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
    const category = await expenseQueries.createCategory(req.body);
    res.status(201).json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await expenseQueries.deleteCategory(id);
    res.json({ message: 'Category deleted successfully', category });
});

// --- BUDGETS ---

export const getAllBudgets = asyncHandler(async (req, res) => {
    const budgets = await expenseQueries.getAllBudgets();
    res.json(budgets);
});

export const upsertBudget = asyncHandler(async (req, res) => {
    const budget = await expenseQueries.upsertBudget(req.body);
    res.json(budget);
});

// --- RECURRING EXPENSES ---

export const getAllRecurring = asyncHandler(async (req, res) => {
    const recurring = await expenseQueries.getAllRecurring();
    res.json(recurring);
});

export const createRecurring = asyncHandler(async (req, res) => {
    const recurring = await expenseQueries.createRecurring(req.body);
    res.status(201).json(recurring);
});

export const updateRecurring = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const recurring = await expenseQueries.updateRecurring(id, req.body);
    res.json(recurring);
});

// --- PAYMENT METHODS ---

export const getAllPaymentMethods = asyncHandler(async (req, res) => {
    const methods = await expenseQueries.getAllPaymentMethods();
    res.json(methods);
});
