# Organizer App 📱

A modern, mobile-first Progressive Web App (PWA) for personal organization built with React, TypeScript, and Tailwind CSS.

> **Owner**: Omar  
> **Target Device**: Android (Xiaomi 10T Pro)  
> **Last Updated**: November 18, 2025

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

The Organizer App is a comprehensive personal productivity tool that helps users manage their daily tasks, track long-term goals, and build positive habits. Built with a mobile-first approach, it provides a clean, intuitive interface optimized for Android devices while maintaining full PWA capabilities for offline use and home screen installation.

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
│   │   │   ├── GoalDetailsPage.tsx
│   │   │   └── GoalOverviewPage.tsx
│   │   ├── habits/             # Habit tracking
│   │   │   ├── HabitOverviewPage.tsx
│   │   │   ├── HabitDetailsPage.tsx
│   │   │   └── CreateHabitPage.tsx
│   │   ├── planner/            # Calendar/planner view
│   │   │   └── PlannerPage.tsx
│   │   └── layout/             # Layout components
│   │       └── BottomNavBar.tsx
│   ├── contexts/               # React Context providers
│   │   ├── TaskContext.tsx
│   │   ├── TaskProvider.tsx
│   │   ├── useTasks.ts
│   │   ├── GoalContext.tsx
│   │   ├── GoalProvider.tsx
│   │   ├── useGoals.ts
│   │   ├── HabitContext.tsx
│   │   ├── HabitProvider.tsx
│   │   └── useHabits.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles + design system
├── dist/                       # Production build output
├── node_modules/               # Dependencies
├── .gitignore
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Project dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── plan.txt                    # Project progress tracker
├── GEMINI.md                   # Project context documentation
└── README.md                   # This file
```

### Component Organization

Components are organized by **feature** rather than type:
- `dashboard/` - Main dashboard view
- `tasks/` - All task-related pages (create, edit)
- `goals/` - Goal management pages
- `habits/` - Habit tracking pages
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

#### 🔄 Habit Management
- Habit creation with icons and descriptions
- Streak tracking (consecutive days)
- Habit overview page
- Habit details page with history
- Visual habit cards on dashboard

#### 📅 Planner
- Timeline view of tasks
- Display tasks with unfinished subtasks
- Integration with task filtering

#### 🎨 Design System (Recently Implemented)
- **Centralized Component Classes**: Reusable UI components defined in `index.css`
- **Design Tokens**: Colors, shadows, transitions in Tailwind config
- **Dark Mode**: Full dark mode support across all pages
- **Responsive**: Mobile-first, optimized for Android
- **Consistent Styling**: Single source of truth for all UI elements

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
```

#### Form Inputs
```css
.input-field      /* Standard inputs */
.input-textarea   /* Textareas */
.input-select     /* Dropdowns */
.input-checkbox   /* Checkboxes */
```

#### Cards & Layout
```css
.card                      /* Standard card */
.card-interactive          /* Clickable card */
.card-horizontal-container /* Horizontal scroll */
.page-container            /* Full page wrapper */
.app-bar                   /* Top app bar */
.content-main              /* Main content area */
```

#### Typography
```css
.heading-page      /* Page titles */
.heading-section   /* Section headers */
.text-secondary    /* Muted text */
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
const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();

// Goal Context
const { goals, addGoal, updateGoal, deleteGoal } = useGoals();

// Habit Context
const { habits, addHabit, updateHabit, deleteHabit } = useHabits();
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
/planner             → Planner Page
```

### Code Style

- **TypeScript**: All components use TypeScript with strict mode
- **Functional Components**: Using React Hooks
- **Tailwind CSS**: Utility-first CSS with custom component classes
- **ESLint**: Code linting with React and TypeScript rules

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
- [x] Task management (CRUD, subtasks, categories)
- [x] Goal management (creation, tracking, task linking)
- [x] Habit management (creation, streak tracking)
- [x] Planner page with timeline view
- [x] State management refactor (Context API)
- [x] **Design system modularization** ⭐ NEW
  - [x] Enhanced design tokens in Tailwind config
  - [x] Created component class library in `index.css`
  - [x] Migrated components to use design system
  - [x] Production build verification

### 🎯 Next Steps

#### Short Term
- [ ] Migrate remaining detail pages to design system
- [ ] Add calendar view integration
- [ ] Implement habit tracking logic (check-in system)
- [ ] Add notifications for task reminders

#### Medium Term
- [ ] Task/Goal/Habit relationship refinement
- [ ] Data persistence (LocalStorage or Backend)
- [ ] Export/Import functionality
- [ ] Statistics and analytics dashboard

#### Long Term
- [ ] Backend integration (API)
- [ ] User authentication
- [ ] Multi-device sync
- [ ] Collaboration features (shared goals/tasks)

---

## 🐛 Known Issues & Resolutions

All major issues have been resolved. See [`plan.txt`](./plan.txt) for historical debugging notes including:
- Goal creation page input interactivity fixes
- ESLint linter compliance improvements
- React Fast Refresh compatibility

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
- Design references in `Design_Guide.txt`, `reference_page.txt`, etc.

---

**Last Build**: ✅ Production build successful (1.32s)  
**Bundle Size**: 290.27 kB (83.55 kB gzipped)  
**CSS Size**: 37.34 kB (5.87 kB gzipped)
