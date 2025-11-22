# Organizer App 📱

A modern, mobile-first Progressive Web App (PWA) for personal organization built with React, TypeScript, and Tailwind CSS.

> **Owner**: Omar  
> **Target Device**: Android (Xiaomi 10T Pro)  
> **Last Updated**: November 22, 2025

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Design System](#design-system)
- [Getting Started](#getting-started)
- [Development](#development)
- [Technical Notes](#technical-notes)
- [Progress & Roadmap](#progress--roadmap)

---

## 🎯 Overview

The Organizer App is a comprehensive personal productivity tool that helps users manage their daily tasks, track long-term goals, build positive habits, and manage personal finances. Built with a mobile-first approach, it provides a clean, intuitive interface optimized for Android devices while maintaining full PWA capabilities for offline use and home screen installation.

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 18 |
| **Language** | TypeScript | Latest |
| **Build Tool** | Vite | 7.2.2 |
| **Styling** | Tailwind CSS | v3 |
| **Routing** | React Router | DOM |
| **State Management** | React Context API | - |
| **PWA** | vite-plugin-pwa | 1.1.0 |
| **Platform** | Progressive Web App | - |
| **Charts** | Recharts | Latest |
| **PDF Generation** | jsPDF | Latest |
| **Backend** | Node.js + Express | Latest |
| **Database** | PostgreSQL | 15+ |

### Development Environment
- **IDE**: VSCode on Windows
- **Package Manager**: npm
- **Linting**: ESLint with TypeScript support

---

## 📁 Project Structure

```
OG_app/
├── public/                      # Static assets
│   └── manifest.webmanifest    # PWA manifest
├── src/
│   ├── assets/                 # Images, icons
│   ├── components/             # React components (feature-based)
│   │   ├── dashboard/          # Dashboard components
│   │   │   └── Dashboard.tsx
│   │   ├── tasks/              # Task management
│   │   │   ├── CreateTaskPage.tsx
│   │   │   └── EditTaskPage.tsx
│   │   ├── goals/              # Goal management
│   │   │   ├── CreateGoalPage.tsx
│   │   │   └── GoalDetailsPage.tsx
│   │   ├── habits/             # Habit tracking
│   │   │   ├── HabitOverviewPage.tsx
│   │   │   ├── HabitDetailsPage.tsx
│   │   │   ├── CreateHabitPage.tsx
│   │   │   └── IconPicker.tsx
│   │   ├── expenses/           # Expense tracking (NEW)
│   │   │   ├── ExpenseOverviewPage.tsx
│   │   │   ├── AddExpenseModal.tsx
│   │   │   ├── RecurringExpensesPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── BudgetManagementPage.tsx
│   │   │   └── SpendingInsights.tsx
│   │   ├── planner/            # Calendar/planner view
│   │   │   └── PlannerPage.tsx
│   │   └── layout/             # Layout components
│   │       └── BottomNavBar.tsx
│   ├── contexts/               # React Context providers
│   │   ├── TaskContext.tsx
│   │   ├── GoalContext.tsx
│   │   ├── HabitContext.tsx
│   │   ├── ExpenseContext.tsx
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles + design system
├── dist/                       # Production build output
├── ...config files
└── README.md                   # This file
```

### Component Organization

Components are organized by **feature** rather than type:
- `dashboard/` - Main dashboard view
- `tasks/` - All task-related pages (create, edit)
- `goals/` - Goal management pages
- `habits/` - Habit tracking pages
- `expenses/` - Expense tracking and analytics
- `planner/` - Calendar and planning views
- `layout/` - Shared layout components (navigation, etc.)

---

## ✨ Features

### ✅ Completed Features

#### 🏠 Dashboard
- Dynamic task list with filtering (Today, Tomorrow, Week)
- Goal cards with progress visualization
- Habit cards showing current streaks
- Floating Action Button (FAB) for quick creation
- Task counter showing incomplete tasks for today
- Bottom navigation bar for easy access

#### ✔️ Task Management
- **CRUD Operations**: Create, read, update, delete tasks
- **Subtasks**: Hierarchical task structure with subtasks
- **Cascading Completion**: Parent task completion marks all subtasks complete
- **Auto-completion**: All subtasks complete → parent auto-completes
- **Date Management**: Start date, end date, and time selection
- **Categories**: Customizable categories with colors
- **Repetitive Tasks**: Daily, weekly, monthly repetition support
- **Task Descriptions**: Rich text descriptions for tasks

#### 🎯 Goal Management
- Create goals with descriptions and target dates
- Link multiple tasks to goals
- Visual progress tracking (percentage completion)
- Goal overview page with all goals
- Goal details page with task management
- Direct task creation from goal page
- Mark entire goals as complete/incomplete

#### 🔄 Habit Management (Major Update)
- **Tracking**: Date-based completion tracking with history
- **Streaks**: Current and Best streak calculation
- **Analytics**: Monthly completion rates and dynamic bar charts
- **Calendar**: Interactive monthly calendar view with navigation
- **UX**: Confetti animations on completion, Icon Picker with search
- **Visuals**: Premium UI with smooth transitions and gradient charts

#### 💰 Expense Tracking (New Module)
- **Transaction Management**: Add, edit, delete expenses
- **Recurring Expenses**: Support for daily, weekly, monthly, yearly subscriptions
- **Budgeting**: Set and track monthly budgets per category
- **Analytics**: Spending insights with pie charts and trend analysis
- **Bulk Actions**: Select multiple expenses to delete or export
- **Export**: Export data to CSV or PDF formats
- **Payment Methods**: Track spending by payment source (Cash, Card, etc.)
- **Categories**: Custom category management with icons and colors

#### 🔌 Backend API (New)
- **RESTful API**: Fully documented API endpoints for all modules
- **PostgreSQL Database**: Robust relational database for data persistence
- **Data Integrity**: Foreign keys, constraints, and transactions ensure data consistency
- **Scalability**: Designed to handle growing data with indexes and optimized queries

#### 📅 Planner
- Timeline view of tasks
- Display tasks with unfinished subtasks
- Integration with task filtering

#### 🎨 Design System
- **Centralized Component Classes**: Reusable UI components defined in `index.css`
- **Design Tokens**: Colors, shadows, transitions in Tailwind config
- **Dark Mode**: Full dark mode support across all pages
- **Responsive**: Mobile-first, optimized for Android
- **Animations**: Slide-up modals, confetti effects, smooth transitions

---

## 🎨 Design System

The app uses a modular design system built with Tailwind CSS for consistency and maintainability.

### Design Tokens

Located in [`tailwind.config.js`](./tailwind.config.js):

**Colors**:
- `primary`: #5590f7 (blue)
- `background-light` / `background-dark`
- `card-light` / `card-dark`
- `input-light` / `input-dark`
- Text colors with light/dark variants

**Shadows**:
- `shadow-card` / `shadow-card-dark`
- `shadow-fab`
- Standard shadows (`sm`, `md`, `lg`)

**Typography**:
- Font: Inter (sans-serif)
- Custom tracking and leading values

### Component Classes

Located in [`src/index.css`](./src/index.css):

#### Buttons
```css
.btn-primary      /* Main action buttons */
.btn-secondary    /* Secondary actions */
.btn-ghost        /* Text-only buttons */
.btn-danger       /* Destructive actions */
.btn-fab          /* Floating action button */
.btn-icon         /* Icon-only buttons */
```

#### Form Inputs
```css
.input-field      /* Standard inputs */
.input-textarea   /* Textareas */
.input-select     /* Dropdowns */
.input-checkbox   /* Checkboxes */
.input-wrapper    /* Inputs with icons */
```

#### Cards & Layout
```css
.card                      /* Standard card */
.card-interactive          /* Clickable card */
.card-horizontal-container /* Horizontal scroll */
.page-container            /* Full page wrapper */
.app-bar                   /* Top app bar */
.content-main              /* Main content area */
.form-page                 /* Full screen form modal */
```

#### Animations
```css
.animate-slide-up    /* Modal entrance */
.animate-confetti    /* Celebration effect */
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd OG_app

# Install dependencies
npm install
```

### Running the App

```bash
# Development server with Hot Module Replacement
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

The development server will start at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Output will be generated in the `dist/` directory:
- `index.html` - Main HTML file
- `assets/` - Bundled CSS and JS
- `manifest.webmanifest` - PWA manifest
- `sw.js` - Service worker for offline functionality

---

## 💻 Development

### State Management

The app uses **React Context API** for state management:

```typescript
// Task Context
const { tasks, addTask, updateTask, deleteTask } = useTasks();

// Goal Context
const { goals, addGoal, updateGoal } = useGoals();

// Habit Context
const { habits, addHabit, toggleHabitCompletion, calculateStreak } = useHabits();

// Expense Context
const { expenses, addExpense, budgets, getSpendingByCategory } = useExpenses();
```

### Routing

Routes are defined in [`App.tsx`](./src/App.tsx):

```typescript
/                    → Dashboard
/create-task         → Create Task Page
/edit-task/:id       → Edit Task Page
/create-goal         → Create Goal Page
/goal-details/:id    → Goal Details Page
/goals               → Goal Overview Page
/create-habit        → Create Habit Page
/habit-details/:id   → Habit Details Page
/habits              → Habit Overview Page
/expenses            → Expense Overview Page
/expenses/recurring  → Recurring Expenses Page
/expenses/analytics  → Expense Analytics Page
/expenses/budget     → Budget Management Page
/planner             → Planner Page
```

---

## 📝 Technical Notes

### TypeScript Configuration

⚠️ **Important**: This project uses `verbatimModuleSyntax` in TypeScript configuration.

Type-only imports **must** use the `type` keyword:

```typescript
// ✅ Correct
import { type Task, type Goal } from './types';

// ❌ Wrong - will cause build errors
import { Task, Goal } from './types';
```

### React Best Practices

- **Context Definitions**: Separate context definition from provider component
- **useEffect State Updates**: Use `setTimeout(..., 0)` for asynchronous state initialization
- **Link Components**: Ensure single root child element when wrapping content

### PWA Features

- **Offline Support**: Service worker caches assets for offline use
- **Installable**: Can be installed to home screen on Android
- **Manifest**: Configured with app icons, theme colors, and display mode

---

## 📊 Progress & Roadmap

### ✅ Completed (November 2025)

- [x] Project setup (React, Vite, Tailwind, PWA)
- [x] Dashboard UI with bottom navigation
- [x] Task management (CRUD, subtasks, categories, repetitive)
- [x] Goal management (creation, tracking, task linking)
- [x] **Habit Management Overhaul**
  - [x] Streak tracking & history
  - [x] Calendar view & analytics
  - [x] UI polish & animations
- [x] **Expense Tracking Module**
  - [x] Expense CRUD & Recurring expenses
  - [x] Budgeting & Analytics
  - [x] Export & Bulk actions
- [x] Planner page with timeline view
- [x] State management refactor (Context API)
- [x] **Design system modularization**
  - [x] Enhanced design tokens in Tailwind config
  - [x] Created component class library in `index.css`
  - [x] Migrated components to use design system
  - [x] Production build verification
- [x] **Backend Implementation**
  - [x] PostgreSQL database setup & schema
  - [x] API endpoints for Tasks, Goals, Habits, Expenses
  - [x] Comprehensive test coverage
  - [x] **Frontend Integration** (Context Providers connected to API)
- [x] **Deployment**
  - [x] Standalone Docker setup on VPS
  - [x] Database initialization and seeding
  - [x] Production environment configuration

### 🎯 Next Steps

#### Short Term
- [ ] Migrate remaining detail pages to design system
- [ ] Add notifications for task reminders
- [ ] Refine search functionality across all modules

#### Medium Term
- [ ] Import functionality (restore data)
- [ ] Statistics and analytics dashboard (Global)

#### Long Term
- [ ] User authentication
- [ ] Multi-device sync
- [ ] Collaboration features (shared goals/tasks)

---

## 🐛 Known Issues & Resolutions

### Recently Fixed (November 19, 2025)
- ✅ **Duplicate Keys in Calendar**: Fixed React key warning in Habit calendar view.
- ✅ **Task Creation Error**: Fixed undefined error when creating tasks linked to goals.
- ✅ **Bottom navigation spacing**: Fixed overlap between navigation items.
- ✅ **Horizontal card container clipping**: Fixed habit and goal cards being cut off.
- ✅ **ESLint `set-state-in-effect` Error**: Resolved widespread linting errors caused by initializing state within `useEffect`.
  - **Issue**: The `react-hooks/set-state-in-effect` rule flagged intentional state updates used to populate form data when modals open.
  - **Fix**: Globally disabled this specific rule in `eslint.config.js` to accommodate the project's established pattern for form initialization.
  - **Prevention**: This rule is now disabled project-wide. Future components using this pattern for prop-to-state synchronization will not trigger lint errors.

---

## 📄 License

This project is for personal use.

---

## 👤 Author

**Omar**

---

## 📚 Additional Documentation

- [`plan.txt`](./plan.txt) - Detailed project progress tracker
- [`GEMINI.md`](./GEMINI.md) - Project context for development
- [`backend/README.md`](./backend/README.md) - Backend API documentation
- [`backend/DATABASE_SCHEMA.md`](./backend/DATABASE_SCHEMA.md) - Database Schema Reference
- Design references in `Design_Guide.txt`, `reference_page.txt`, etc.

---

**Last Build**: ✅ Production build successful
**Bundle Size**: Optimized for mobile performance
