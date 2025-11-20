import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const { Pool } = pg;

// Load environment variables
dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test connection function
export async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('✅ Database connection successful!');
        console.log('📅 Server time:', result.rows[0].current_time);
        console.log('🐘 PostgreSQL version:', result.rows[0].pg_version);
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Query helper function
export async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
}

// Get a client from the pool (for transactions)
export async function getClient() {
    const client = await pool.connect();
    return client;
}

// Graceful shutdown
export async function closePool() {
    await pool.end();
    console.log('Database pool closed');
}

// If running this file directly, test the connection
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMainModule) {
    testConnection().then((success) => {
        if (success) {
            console.log('\n🎉 Ready to create database schema!');
        } else {
            console.log('\n⚠️  Please check your database credentials and try again.');
        }
        closePool();
    });
}

export default pool;
