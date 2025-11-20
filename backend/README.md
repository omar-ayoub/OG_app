# Organizer App - Backend API

Backend server for the Organizer App with PostgreSQL database.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database (creates all tables)
node scripts/init-database.js

# Start development server
npm run dev
```

Server will run on `http://localhost:3000`

## 🗄️ Database Schema

For a detailed reference of the database schema, including tables, relationships, and data types, please refer to [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

## 📡 API Endpoints

### Health Check
- `GET /health`: Check server and database status

### Tasks Module
- `GET /api/tasks`: Get all tasks
- `GET /api/tasks?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`: Get tasks by date range
- `POST /api/tasks`: Create a task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

### Goals Module
- `GET /api/goals`: Get all goals with progress
- `POST /api/goals`: Create a goal
- `PUT /api/goals/:id`: Update a goal
- `POST /api/goals/:id/toggle`: Toggle completion
- `DELETE /api/goals/:id`: Delete a goal

### Habits Module
- `GET /api/habits`: Get all habits with completion history
- `POST /api/habits`: Create a habit
- `POST /api/habits/:id/complete`: Toggle completion for a date
- `GET /api/habits/:id/streak`: Get current and best streaks
- `DELETE /api/habits/:id`: Delete a habit

### Expenses Module
- `GET /api/expenses`: Get all expenses
- `POST /api/expenses`: Create an expense
- `GET /api/expenses/categories/all`: Get all categories
- `POST /api/expenses/budgets`: Set a budget
- `POST /api/expenses/recurring`: Create recurring expense

## 🧪 Testing

We have created automated test scripts for each module. You can run them to verify functionality:

```bash
# Test Tasks API
node scripts/test-tasks-api.js

# Test Goals API
node scripts/test-goals-api.js

# Test Habits API
node scripts/test-habits-api.js

# Test Expenses API
node scripts/test-expenses-api.js
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware (error handling)
│   ├── models/         # Database queries
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── scripts/
│   ├── init-db.sql     # SQL schema definition
│   ├── init-database.js # Database initialization script
│   └── test-*.js       # Test scripts
├── .env                # Environment variables
└── DATABASE_SCHEMA.md  # Detailed schema documentation
```

## 🔧 Development

The server uses `nodemon` for hot reloading during development:

```bash
npm run dev
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **Database Client**: node-postgres (pg)
- **CORS**: cors middleware
- **Environment**: dotenv

## ✅ Status

- [x] Database Connection
- [x] Schema Design
- [x] Tasks Module API
- [x] Goals Module API
- [x] Habits Module API
- [x] Expenses Module API
- [ ] Frontend Integration (Next Step)

## 👤 Author

Omar

## 📄 License

Private - Personal use only
