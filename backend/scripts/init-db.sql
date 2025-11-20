-- Organizer App Database Schema
-- PostgreSQL 15.14
-- Created: 2025-11-21

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS habit_completions CASCADE;
DROP TABLE IF EXISTS subtasks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS recurring_expenses CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS expense_categories CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS task_categories CASCADE;

-- Custom ENUM types
CREATE TYPE task_repeat_frequency AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly');
CREATE TYPE expense_frequency AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
CREATE TYPE budget_period AS ENUM ('weekly', 'monthly');

-- ============================================
-- GOALS TABLE
-- ============================================
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goals_completed ON goals(completed);
CREATE INDEX idx_goals_created_at ON goals(created_at DESC);

-- ============================================
-- TASK CATEGORIES TABLE
-- ============================================
CREATE TABLE task_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL, -- Hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO task_categories (name, color) VALUES
    ('Work', '#5590f7'),
    ('Personal', '#22c55e'),
    ('Health', '#ef4444'),
    ('Study', '#f59e0b'),
    ('Shopping', '#8b5cf6');

-- ============================================
-- HABITS TABLE
-- ============================================
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100) NOT NULL, -- Material Symbols icon name
    frequency habit_frequency NOT NULL DEFAULT 'daily',
    goal INTEGER NOT NULL DEFAULT 1, -- Target completions per frequency period
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_habits_created_at ON habits(created_at DESC);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    time TIME,
    start_date DATE,
    end_date DATE,
    tag VARCHAR(100),
    tag_color VARCHAR(7), -- Hex color code
    is_completed BOOLEAN DEFAULT FALSE,
    description TEXT,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    habit_id INTEGER REFERENCES habits(id) ON DELETE SET NULL,
    is_repetitive BOOLEAN DEFAULT FALSE,
    repeat_frequency task_repeat_frequency,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_completed ON tasks(is_completed);
CREATE INDEX idx_tasks_start_date ON tasks(start_date);
CREATE INDEX idx_tasks_end_date ON tasks(end_date);
CREATE INDEX idx_tasks_goal_id ON tasks(goal_id);
CREATE INDEX idx_tasks_habit_id ON tasks(habit_id);

-- ============================================
-- SUBTASKS TABLE
-- ============================================
CREATE TABLE subtasks (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    position INTEGER DEFAULT 0, -- For ordering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);

-- ============================================
-- HABIT COMPLETIONS TABLE
-- ============================================
CREATE TABLE habit_completions (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, completed_date)
);

CREATE INDEX idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(completed_date DESC);

-- ============================================
-- EXPENSE CATEGORIES TABLE
-- ============================================
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100) NOT NULL, -- Material Symbols icon name
    color VARCHAR(7) NOT NULL, -- Hex color code
    is_custom BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default expense categories
INSERT INTO expense_categories (id, name, icon, color, is_custom) VALUES
    (gen_random_uuid(), 'Food & Dining', 'restaurant', '#ef4444', FALSE),
    (gen_random_uuid(), 'Transportation', 'directions_car', '#3b82f6', FALSE),
    (gen_random_uuid(), 'Shopping', 'shopping_cart', '#8b5cf6', FALSE),
    (gen_random_uuid(), 'Entertainment', 'movie', '#ec4899', FALSE),
    (gen_random_uuid(), 'Healthcare', 'medical_services', '#22c55e', FALSE),
    (gen_random_uuid(), 'Bills & Utilities', 'receipt_long', '#f59e0b', FALSE),
    (gen_random_uuid(), 'Education', 'school', '#06b6d4', FALSE),
    (gen_random_uuid(), 'Other', 'more_horiz', '#6b7280', FALSE);

-- ============================================
-- PAYMENT METHODS TABLE
-- ============================================
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default payment methods
INSERT INTO payment_methods (id, name, icon) VALUES
    (gen_random_uuid(), 'Cash', 'payments'),
    (gen_random_uuid(), 'Credit Card', 'credit_card'),
    (gen_random_uuid(), 'Debit Card', 'credit_card'),
    (gen_random_uuid(), 'Mobile Payment', 'phone_android'),
    (gen_random_uuid(), 'Bank Transfer', 'account_balance');

-- ============================================
-- RECURRING EXPENSES TABLE
-- ============================================
CREATE TABLE recurring_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10, 2) NOT NULL,
    category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
    description TEXT,
    frequency expense_frequency NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    last_generated DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recurring_expenses_active ON recurring_expenses(is_active);
CREATE INDEX idx_recurring_expenses_category ON recurring_expenses(category_id);

-- ============================================
-- EXPENSES TABLE
-- ============================================
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10, 2) NOT NULL,
    category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    description TEXT,
    payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
    attachment_url VARCHAR(500),
    tags TEXT[],
    recurring_id UUID REFERENCES recurring_expenses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_date ON expenses(date DESC);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_amount ON expenses(amount);

-- ============================================
-- BUDGETS TABLE
-- ============================================
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    period budget_period NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, period, start_date)
);

CREATE INDEX idx_budgets_category ON budgets(category_id);
CREATE INDEX idx_budgets_start_date ON budgets(start_date DESC);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_expenses_updated_at BEFORE UPDATE ON recurring_expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- View all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count records in each table
SELECT 
    'goals' as table_name, COUNT(*) as record_count FROM goals
UNION ALL SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL SELECT 'subtasks', COUNT(*) FROM subtasks
UNION ALL SELECT 'habits', COUNT(*) FROM habits
UNION ALL SELECT 'habit_completions', COUNT(*) FROM habit_completions
UNION ALL SELECT 'task_categories', COUNT(*) FROM task_categories
UNION ALL SELECT 'expense_categories', COUNT(*) FROM expense_categories
UNION ALL SELECT 'payment_methods', COUNT(*) FROM payment_methods
UNION ALL SELECT 'expenses', COUNT(*) FROM expenses
UNION ALL SELECT 'recurring_expenses', COUNT(*) FROM recurring_expenses
UNION ALL SELECT 'budgets', COUNT(*) FROM budgets
ORDER BY table_name;
