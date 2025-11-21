import pool from '../config/database.js';

// ============================================
// TASKS QUERIES
// ============================================

export const taskQueries = {
  // Get all tasks
  getAll: async () => {
    const result = await pool.query(`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object('id', s.id, 'text', s.text, 'completed', s.completed, 'position', s.position)
            ORDER BY s.position, s.id
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as subtasks
      FROM tasks t
      LEFT JOIN subtasks s ON t.id = s.task_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `);
    return result.rows;
  },

  // Get task by ID
  getById: async (id) => {
    const result = await pool.query(`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object('id', s.id, 'text', s.text, 'completed', s.completed, 'position', s.position)
            ORDER BY s.position, s.id
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as subtasks
      FROM tasks t
      LEFT JOIN subtasks s ON t.id = s.task_id
      WHERE t.id = $1
      GROUP BY t.id
    `, [id]);
    return result.rows[0];
  },

  // Create task
  create: async (taskData) => {
    const {
      text,
      time,
      startDate,
      endDate,
      tag,
      tagColor,
      description,
      goalId,
      habitId,
      isRepetitive,
      repeatFrequency,
      subTasks
    } = taskData;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert task
      const taskResult = await client.query(`
        INSERT INTO tasks (
          text, time, start_date, end_date, tag, tag_color, 
          description, goal_id, habit_id, is_repetitive, repeat_frequency
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [text, time || null, startDate || null, endDate || null, tag || null, tagColor || null,
        description || null, goalId || null, habitId || null, isRepetitive || false, repeatFrequency || null]);

      const task = taskResult.rows[0];

      // Insert subtasks if provided
      let subtasks = [];
      if (subTasks && subTasks.length > 0) {
        for (let i = 0; i < subTasks.length; i++) {
          const subtask = subTasks[i];
          const subtaskResult = await client.query(`
            INSERT INTO subtasks (task_id, text, completed, position)
            VALUES ($1, $2, $3, $4)
            RETURNING *
          `, [task.id, subtask.text, subtask.completed || false, i]);
          subtasks.push(subtaskResult.rows[0]);
        }
      }

      await client.query('COMMIT');

      return { ...task, subtasks };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Update task
  update: async (id, taskData) => {
    const {
      text,
      time,
      startDate,
      endDate,
      tag,
      tagColor,
      isCompleted,
      description,
      goalId,
      habitId,
      isRepetitive,
      repeatFrequency,
      subTasks
    } = taskData;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update task
      const taskResult = await client.query(`
        UPDATE tasks SET
          text = COALESCE($1, text),
          time = COALESCE($2, time),
          start_date = COALESCE($3, start_date),
          end_date = COALESCE($4, end_date),
          tag = COALESCE($5, tag),
          tag_color = COALESCE($6, tag_color),
          is_completed = COALESCE($7, is_completed),
          description = COALESCE($8, description),
          goal_id = COALESCE($9, goal_id),
          habit_id = COALESCE($10, habit_id),
          is_repetitive = COALESCE($11, is_repetitive),
          repeat_frequency = COALESCE($12, repeat_frequency)
        WHERE id = $13
        RETURNING *
      `, [text, time, startDate, endDate, tag, tagColor, isCompleted, description,
        goalId, habitId, isRepetitive, repeatFrequency, id]);

      if (taskResult.rows.length === 0) {
        throw new Error('Task not found');
      }

      const task = taskResult.rows[0];

      // If subtasks are provided, replace all subtasks
      let subtasks = [];
      if (subTasks !== undefined) {
        // Delete existing subtasks
        await client.query('DELETE FROM subtasks WHERE task_id = $1', [id]);

        // Insert new subtasks
        if (subTasks && subTasks.length > 0) {
          for (let i = 0; i < subTasks.length; i++) {
            const subtask = subTasks[i];
            const subtaskResult = await client.query(`
              INSERT INTO subtasks (task_id, text, completed, position)
              VALUES ($1, $2, $3, $4)
              RETURNING *
            `, [id, subtask.text, subtask.completed || false, i]);
            subtasks.push(subtaskResult.rows[0]);
          }
        }
      } else {
        // If subtasks not provided, fetch existing
        const subtasksResult = await client.query(`
          SELECT * FROM subtasks WHERE task_id = $1 ORDER BY position, id
        `, [id]);
        subtasks = subtasksResult.rows;
      }

      await client.query('COMMIT');

      return { ...task, subtasks };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Delete task
  delete: async (id) => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Get tasks by goal ID
  getByGoalId: async (goalId) => {
    const result = await pool.query(`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object('id', s.id, 'text', s.text, 'completed', s.completed, 'position', s.position)
            ORDER BY s.position, s.id
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as subtasks
      FROM tasks t
      LEFT JOIN subtasks s ON t.id = s.task_id
      WHERE t.goal_id = $1
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `, [goalId]);
    return result.rows;
  },

  // Get tasks by date range
  getByDateRange: async (startDate, endDate) => {
    const result = await pool.query(`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object('id', s.id, 'text', s.text, 'completed', s.completed, 'position', s.position)
            ORDER BY s.position, s.id
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as subtasks
      FROM tasks t
      LEFT JOIN subtasks s ON t.id = s.task_id
      WHERE t.start_date >= $1 AND t.end_date <= $2
      GROUP BY t.id
      ORDER BY t.start_date, t.time
    `, [startDate, endDate]);
    return result.rows;
  },

  // Get all task categories
  getAllCategories: async () => {
    const result = await pool.query('SELECT * FROM task_categories ORDER BY name');
    return result.rows;
  }
};

// ============================================
// SUBTASKS QUERIES
// ============================================

export const subtaskQueries = {
  // Update subtask
  update: async (id, text, completed) => {
    const result = await pool.query(`
      UPDATE subtasks SET
        text = COALESCE($1, text),
        completed = COALESCE($2, completed)
      WHERE id = $3
      RETURNING *
    `, [text, completed, id]);
    return result.rows[0];
  },

  // Delete subtask
  delete: async (id) => {
    const result = await pool.query('DELETE FROM subtasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Add subtask to task
  create: async (taskId, text, completed, position) => {
    const result = await pool.query(`
      INSERT INTO subtasks (task_id, text, completed, position)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [taskId, text, completed || false, position || 0]);
    return result.rows[0];
  }
};

// ============================================
// GOALS QUERIES
// ============================================

export const goalQueries = {
  // Get all goals with task counts and completion status
  getAll: async () => {
    const result = await pool.query(`
      SELECT 
        g.*,
        COALESCE(
          json_agg(
            json_build_object('id', t.id)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as task_ids,
        COUNT(t.id) FILTER (WHERE t.id IS NOT NULL) as total_tasks,
        COUNT(t.id) FILTER (WHERE t.is_completed = true) as completed_tasks
      FROM goals g
      LEFT JOIN tasks t ON g.id = t.goal_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `);

    // Convert task_ids to simple array of numbers
    return result.rows.map(goal => ({
      ...goal,
      tasks: goal.task_ids.map(t => t.id),
      task_ids: undefined
    }));
  },

  // Get goal by ID with full task details
  getById: async (id) => {
    const result = await pool.query(`
      SELECT 
        g.*,
        COALESCE(
          json_agg(
            json_build_object('id', t.id)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as task_ids
      FROM goals g
      LEFT JOIN tasks t ON g.id = t.goal_id
      WHERE g.id = $1
      GROUP BY g.id
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const goal = result.rows[0];
    return {
      ...goal,
      tasks: goal.task_ids.map(t => t.id),
      task_ids: undefined
    };
  },

  // Create goal
  create: async (goalData) => {
    const { title, description, targetDate, tasks } = goalData;

    const result = await pool.query(`
      INSERT INTO goals (title, description, target_date)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [title, description || null, targetDate || null]);

    const goal = result.rows[0];

    // Note: tasks array is just task IDs that should already exist
    // The relationship is managed through tasks.goal_id foreign key
    return {
      ...goal,
      tasks: tasks || []
    };
  },

  // Update goal
  update: async (id, goalData) => {
    const { title, description, targetDate, completed } = goalData;

    const result = await pool.query(`
      UPDATE goals SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        target_date = COALESCE($3, target_date),
        completed = COALESCE($4, completed)
      WHERE id = $5
      RETURNING *
    `, [title, description, targetDate, completed, id]);

    if (result.rows.length === 0) {
      throw new Error('Goal not found');
    }

    return result.rows[0];
  },

  // Delete goal
  delete: async (id) => {
    // Note: This will SET NULL on associated tasks' goal_id because of ON DELETE SET NULL
    const result = await pool.query('DELETE FROM goals WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Toggle goal completion
  toggleCompletion: async (id) => {
    const result = await pool.query(`
      UPDATE goals 
      SET completed = NOT completed
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      throw new Error('Goal not found');
    }

    return result.rows[0];
  },

  // Get goal progress (calculate completion percentage)
  getProgress: async (id) => {
    const result = await pool.query(`
      SELECT 
        g.id,
        g.title,
        g.completed as goal_completed,
        COUNT(t.id) FILTER (WHERE t.id IS NOT NULL) as total_tasks,
        COUNT(t.id) FILTER (WHERE t.is_completed = true) as completed_tasks,
        CASE 
          WHEN COUNT(t.id) FILTER (WHERE t.id IS NOT NULL) = 0 THEN 0
          ELSE ROUND((COUNT(t.id) FILTER (WHERE t.is_completed = true)::DECIMAL / 
                      COUNT(t.id) FILTER (WHERE t.id IS NOT NULL)) * 100)
        END as progress_percentage
      FROM goals g
      LEFT JOIN tasks t ON g.id = t.goal_id
      WHERE g.id = $1
      GROUP BY g.id
    `, [id]);

    return result.rows[0];
  }
};

// ============================================
// HABITS QUERIES
// ============================================

export const habitQueries = {
  // Get all habits with completion history
  getAll: async () => {
    const result = await pool.query(`
      SELECT 
        h.*,
        COALESCE(
          json_agg(hc.completed_date) FILTER (WHERE hc.completed_date IS NOT NULL),
          '[]'
        ) as completed_dates
      FROM habits h
      LEFT JOIN habit_completions hc ON h.id = hc.habit_id
      GROUP BY h.id
      ORDER BY h.created_at DESC
    `);

    // Format dates as YYYY-MM-DD strings
    return result.rows.map(habit => ({
      ...habit,
      completedDates: habit.completed_dates.map(d => {
        const date = new Date(d);
        return date.toISOString().split('T')[0];
      }),
      completed_dates: undefined
    }));
  },

  // Get habit by ID
  getById: async (id) => {
    const result = await pool.query(`
      SELECT 
        h.*,
        COALESCE(
          json_agg(hc.completed_date) FILTER (WHERE hc.completed_date IS NOT NULL),
          '[]'
        ) as completed_dates
      FROM habits h
      LEFT JOIN habit_completions hc ON h.id = hc.habit_id
      WHERE h.id = $1
      GROUP BY h.id
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const habit = result.rows[0];
    return {
      ...habit,
      completedDates: habit.completed_dates.map(d => {
        const date = new Date(d);
        return date.toISOString().split('T')[0];
      }),
      completed_dates: undefined
    };
  },

  // Create habit
  create: async (habitData) => {
    const { name, icon, frequency, goal } = habitData;

    const result = await pool.query(`
      INSERT INTO habits (name, icon, frequency, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, icon, frequency || 'daily', goal || 1]);

    return {
      ...result.rows[0],
      completedDates: []
    };
  },

  // Update habit
  update: async (id, habitData) => {
    const { name, icon, frequency, goal } = habitData;

    const result = await pool.query(`
      UPDATE habits SET
        name = COALESCE($1, name),
        icon = COALESCE($2, icon),
        frequency = COALESCE($3, frequency),
        goal = COALESCE($4, goal)
      WHERE id = $5
      RETURNING *
    `, [name, icon, frequency, goal, id]);

    if (result.rows.length === 0) {
      throw new Error('Habit not found');
    }

    // Fetch completions to return full object
    const completionsResult = await pool.query(`
      SELECT completed_date FROM habit_completions WHERE habit_id = $1
    `, [id]);

    return {
      ...result.rows[0],
      completedDates: completionsResult.rows.map(r => {
        const date = new Date(r.completed_date);
        return date.toISOString().split('T')[0];
      })
    };
  },

  // Delete habit
  delete: async (id) => {
    const result = await pool.query('DELETE FROM habits WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Toggle habit completion for a date
  toggleCompletion: async (id, date) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if already completed
      const checkResult = await client.query(`
        SELECT id FROM habit_completions 
        WHERE habit_id = $1 AND completed_date = $2
      `, [id, date]);

      let action;
      if (checkResult.rows.length > 0) {
        // Remove completion
        await client.query(`
          DELETE FROM habit_completions 
          WHERE habit_id = $1 AND completed_date = $2
        `, [id, date]);
        action = 'removed';
      } else {
        // Add completion
        await client.query(`
          INSERT INTO habit_completions (habit_id, completed_date)
          VALUES ($1, $2)
        `, [id, date]);
        action = 'added';
      }

      await client.query('COMMIT');
      return { action, date };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Calculate streak
  getStreak: async (id) => {
    const result = await pool.query(`
      SELECT completed_date 
      FROM habit_completions 
      WHERE habit_id = $1 
      ORDER BY completed_date DESC
    `, [id]);

    const dates = result.rows.map(r => {
      const d = new Date(r.completed_date);
      return d.toISOString().split('T')[0];
    });

    // Simple streak calculation logic
    // Sort dates descending
    dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let bestStreak = 0; // This would require more complex historical analysis

    // Check if today or yesterday is completed to start counting
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If no dates, streak is 0
    if (dates.length === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }

    // Calculate current streak
    // If most recent date is not today or yesterday, streak is broken (0)
    if (dates[0] !== today && dates[0] !== yesterday) {
      currentStreak = 0;
    } else {
      // Count consecutive days
      currentStreak = 1;
      let currentDate = new Date(dates[0]);

      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i]);
        const diffTime = Math.abs(currentDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak++;
          currentDate = prevDate;
        } else {
          break;
        }
      }
    }

    // For best streak, we'd need to iterate all dates. 
    // For now returning current streak as best streak if it's the only data we calculated
    // Or implementing a simple best streak calc

    let maxStreak = 0;
    let tempStreak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const d1 = new Date(dates[i]);
      const d2 = new Date(dates[i + 1]);
      const diffTime = Math.abs(d1 - d2);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);
    if (dates.length === 0) maxStreak = 0;

    return { currentStreak, bestStreak: maxStreak };
  }
};

// ============================================
// EXPENSES QUERIES
// ============================================

export const expenseQueries = {
  // --- EXPENSES ---

  // Get all expenses with optional filters
  getAll: async (filters = {}) => {
    const { startDate, endDate, categoryId, limit } = filters;
    let query = `
      SELECT 
        e.*,
        ec.name as category_name,
        ec.color as category_color,
        ec.icon as category_icon,
        pm.name as payment_method_name,
        pm.icon as payment_method_icon
      FROM expenses e
      LEFT JOIN expense_categories ec ON e.category_id = ec.id
      LEFT JOIN payment_methods pm ON e.payment_method_id = pm.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (startDate) {
      query += ` AND e.date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND e.date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    if (categoryId) {
      query += ` AND e.category_id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    query += ` ORDER BY e.date DESC, e.time DESC`;

    if (limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(limit);
    }

    const result = await pool.query(query, params);

    // Format dates
    return result.rows.map(expense => ({
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0]
    }));
  },

  // Get expense by ID
  getById: async (id) => {
    const result = await pool.query(`
      SELECT 
        e.*,
        ec.name as category_name,
        ec.color as category_color,
        ec.icon as category_icon,
        pm.name as payment_method_name,
        pm.icon as payment_method_icon
      FROM expenses e
      LEFT JOIN expense_categories ec ON e.category_id = ec.id
      LEFT JOIN payment_methods pm ON e.payment_method_id = pm.id
      WHERE e.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const expense = result.rows[0];
    return {
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0]
    };
  },

  // Create expense
  create: async (expenseData) => {
    const {
      amount, categoryId, date, time, description,
      paymentMethodId, attachmentUrl, tags, recurringId
    } = expenseData;

    const result = await pool.query(`
      INSERT INTO expenses (
        amount, category_id, date, time, description, 
        payment_method_id, attachment_url, tags, recurring_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [amount, categoryId, date, time, description,
      paymentMethodId, attachmentUrl, tags, recurringId]);

    return {
      ...result.rows[0],
      date: new Date(result.rows[0].date).toISOString().split('T')[0]
    };
  },

  // Update expense
  update: async (id, expenseData) => {
    const {
      amount, categoryId, date, time, description,
      paymentMethodId, attachmentUrl, tags
    } = expenseData;

    const result = await pool.query(`
      UPDATE expenses SET
        amount = COALESCE($1, amount),
        category_id = COALESCE($2, category_id),
        date = COALESCE($3, date),
        time = COALESCE($4, time),
        description = COALESCE($5, description),
        payment_method_id = COALESCE($6, payment_method_id),
        attachment_url = COALESCE($7, attachment_url),
        tags = COALESCE($8, tags)
      WHERE id = $9
      RETURNING *
    `, [amount, categoryId, date, time, description,
      paymentMethodId, attachmentUrl, tags, id]);

    if (result.rows.length === 0) throw new Error('Expense not found');

    return {
      ...result.rows[0],
      date: new Date(result.rows[0].date).toISOString().split('T')[0]
    };
  },

  // Delete expense
  delete: async (id) => {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // --- CATEGORIES ---

  // Get all expense categories
  getAllCategories: async () => {
    const result = await pool.query('SELECT * FROM expense_categories ORDER BY name');
    return result.rows;
  },

  // Create expense category
  createCategory: async (categoryData) => {
    const { name, icon, color } = categoryData;
    const result = await pool.query(`
      INSERT INTO expense_categories (name, icon, color, is_custom)
      VALUES ($1, $2, $3, TRUE)
      RETURNING *
    `, [name, icon, color]);
    return result.rows[0];
  },

  // Delete expense category
  deleteCategory: async (id) => {
    // Check if used
    const check = await pool.query('SELECT 1 FROM expenses WHERE category_id = $1 LIMIT 1', [id]);
    if (check.rows.length > 0) {
      throw new Error('Cannot delete category that has expenses');
    }

    const result = await pool.query('DELETE FROM expense_categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // --- BUDGETS ---

  // Get all budgets
  getAllBudgets: async () => {
    const result = await pool.query(`
      SELECT b.*, ec.name as category_name, ec.color as category_color
      FROM budgets b
      JOIN expense_categories ec ON b.category_id = ec.id
      ORDER BY ec.name
    `);
    return result.rows.map(b => ({
      ...b,
      startDate: new Date(b.start_date).toISOString().split('T')[0]
    }));
  },

  // Create or update budget
  upsertBudget: async (budgetData) => {
    const { categoryId, amount, period, startDate } = budgetData;

    const result = await pool.query(`
      INSERT INTO budgets (category_id, amount, period, start_date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (category_id, period, start_date) 
      DO UPDATE SET amount = EXCLUDED.amount
      RETURNING *
    `, [categoryId, amount, period, startDate]);

    return {
      ...result.rows[0],
      startDate: new Date(result.rows[0].start_date).toISOString().split('T')[0]
    };
  },

  // --- RECURRING EXPENSES ---

  // Get all recurring expenses
  getAllRecurring: async () => {
    const result = await pool.query(`
      SELECT r.*, ec.name as category_name
      FROM recurring_expenses r
      JOIN expense_categories ec ON r.category_id = ec.id
      ORDER BY r.created_at DESC
    `);
    return result.rows.map(r => ({
      ...r,
      startDate: new Date(r.start_date).toISOString().split('T')[0],
      endDate: r.end_date ? new Date(r.end_date).toISOString().split('T')[0] : null,
      lastGenerated: r.last_generated ? new Date(r.last_generated).toISOString().split('T')[0] : null
    }));
  },

  // Create recurring expense
  createRecurring: async (recurringData) => {
    const {
      amount, categoryId, description, frequency,
      startDate, endDate, paymentMethodId, tags
    } = recurringData;

    const result = await pool.query(`
      INSERT INTO recurring_expenses (
        amount, category_id, description, frequency, 
        start_date, end_date, payment_method_id, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [amount, categoryId, description, frequency,
      startDate, endDate, paymentMethodId, tags]);

    return {
      ...result.rows[0],
      startDate: new Date(result.rows[0].start_date).toISOString().split('T')[0]
    };
  },

  // Update recurring expense
  updateRecurring: async (id, recurringData) => {
    const {
      amount, categoryId, description, frequency,
      startDate, endDate, paymentMethodId, tags, isActive
    } = recurringData;

    const result = await pool.query(`
      UPDATE recurring_expenses SET
        amount = COALESCE($1, amount),
        category_id = COALESCE($2, category_id),
        description = COALESCE($3, description),
        frequency = COALESCE($4, frequency),
        start_date = COALESCE($5, start_date),
        end_date = COALESCE($6, end_date),
        payment_method_id = COALESCE($7, payment_method_id),
        tags = COALESCE($8, tags),
        is_active = COALESCE($9, is_active)
      WHERE id = $10
      RETURNING *
    `, [amount, categoryId, description, frequency,
      startDate, endDate, paymentMethodId, tags, isActive, id]);

    if (result.rows.length === 0) throw new Error('Recurring expense not found');

    return {
      ...result.rows[0],
      startDate: new Date(result.rows[0].start_date).toISOString().split('T')[0]
    };
  },

  // Get all payment methods
  getAllPaymentMethods: async () => {
    const result = await pool.query('SELECT * FROM payment_methods ORDER BY name');
    return result.rows;
  }
};

