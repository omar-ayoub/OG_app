import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool, { testConnection, closePool } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
    console.log('🚀 Starting database initialization...\n');

    // Test connection first
    const connectionSuccess = await testConnection();
    if (!connectionSuccess) {
        console.error('❌ Cannot proceed without database connection');
        process.exit(1);
    }

    try {
        // Read SQL file
        const sqlFilePath = join(__dirname, 'init-db.sql');
        console.log(`\n📖 Reading SQL file: ${sqlFilePath}`);
        const sql = readFileSync(sqlFilePath, 'utf8');

        // Execute SQL
        console.log('\n⚙️  Executing database schema...');
        await pool.query(sql);

        console.log('\n✅ Database schema created successfully!');
        console.log('\n📊 Verifying tables...');

        // Verify tables were created
        const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

        console.log('\n📋 Created tables:');
        tablesResult.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        // Get record counts
        const countsResult = await pool.query(`
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
      ORDER BY table_name
    `);

        console.log('\n📈 Initial record counts:');
        countsResult.rows.forEach(row => {
            console.log(`   - ${row.table_name}: ${row.record_count} records`);
        });

        console.log('\n🎉 Database initialization complete!');

    } catch (error) {
        console.error('\n❌ Error initializing database:', error.message);
        console.error('Details:', error);
        process.exit(1);
    } finally {
        await closePool();
    }
}

// Run initialization
initializeDatabase();
