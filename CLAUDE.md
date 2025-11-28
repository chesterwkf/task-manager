# CLAUDE.md - Task Manager Project Guide

> **Last Updated**: 2025-11-28
> **Project**: Task Manager - React-based task organization application
> **Version**: 0.1.0

This document provides comprehensive guidance for AI assistants working on the Task Manager codebase.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Codebase Structure](#codebase-structure)
4. [Architecture & Patterns](#architecture--patterns)
5. [Development Workflow](#development-workflow)
6. [Key Conventions](#key-conventions)
7. [Common Tasks](#common-tasks)
8. [Testing Guidelines](#testing-guidelines)
9. [Important Files Reference](#important-files-reference)

---

## Project Overview

### What is Task Manager?

A React-based Single Page Application (SPA) that helps users organize tasks with multiple visualization modes:

- **Tasks View**: Hierarchical organization with subject grouping
- **Table View**: Tabular interface with advanced filtering and sorting
- **Kanban Board**: Daily task board with drag-and-drop status management

### Key Features

- Subject-based task organization (e.g., Math, Science, History)
- Parent tasks with multiple subtasks
- Three-level status tracking (To-Do, Ongoing, Completed)
- Date management (To-Do date + Deadline)
- Detail modal with descriptions and checklists
- Dark/light theme with persistence
- Drag-and-drop functionality
- localStorage data persistence
- Responsive design with Tailwind CSS

### Current Status

**Active Development** - Recent commits show steady feature additions:
- Latest: Subject display in table view (commit: 46c3e38)
- Recent: Kanban board filtering, subtask editing, dark mode
- 860 lines in main App.js component
- 3,500+ total lines of code

---

## Technology Stack

### Core Framework
- **React**: 19.2.0 (latest version)
- **React DOM**: 19.2.0
- **Build System**: Create React App (react-scripts 5.0.1)

### Styling
- **Tailwind CSS**: 3.4.18 (utility-first CSS)
- **PostCSS**: 8.5.6
- **Autoprefixer**: 10.4.21

### UI Components & Icons
- **Lucide React**: 0.544.0 (200+ SVG icons)

### Testing
- **@testing-library/react**: 16.3.0
- **@testing-library/jest-dom**: 6.9.1
- **@testing-library/user-event**: 13.5.0

### Utilities
- **web-vitals**: 2.1.4

---

## Codebase Structure

```
/home/user/task-manager/
├── public/                      # Static assets
├── src/
│   ├── App.js                   # Main component (860 lines) - PRIMARY FILE
│   ├── App.css                  # Legacy CSS (minimal use)
│   ├── App.test.js              # Test file
│   ├── index.js                 # Entry point
│   ├── index.css                # Tailwind directives
│   ├── reportWebVitals.js       # Performance monitoring
│   ├── setupTests.js            # Test configuration
│   │
│   ├── components/              # UI Components
│   │   ├── AppHeader.js         # Header with theme toggle
│   │   ├── ViewToggle.js        # View mode switcher
│   │   ├── TasksViewSplit.js    # Hierarchical task view (655 lines)
│   │   ├── TableViewSplit.js    # Table view with filters
│   │   ├── KanbanBoardSplit.js  # Daily Kanban board
│   │   ├── DetailModalSplit.js  # Task/subtask detail modal (87 lines)
│   │   ├── SubjectsPanel.js     # Subject management
│   │   └── SubjectsViewSplit.js # Alternative subject view
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   └── useTasks.js          # Task state management (368 lines)
│   │
│   └── views/                   # View Components
│       └── TasksView.js         # Legacy/alternative view
│
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS plugins
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

### Key Directories

- **`/src/components/`**: All UI components (8 major components)
- **`/src/hooks/`**: Custom React hooks
- **`/src/views/`**: Page-level view components
- **`/src/App.js`**: Root component with all state management

---

## Architecture & Patterns

### State Management Architecture

**All state lives in `App.js`** (centralized state):

```javascript
// Core data
const [tasks, setTasks]                    // Array of task objects
const [subjects, setSubjects]              // Array of subject objects

// UI state
const [view, setView]                      // "tasks" | "table" | "kanban"
const [expandedTasks, setExpandedTasks]    // Set of expanded task IDs
const [expandedSubjects, setExpandedSubjects] // Set of expanded subject IDs

// Form state
const [showTaskForm, setShowTaskForm]      // Task form visibility
const [showSubtaskForm, setShowSubtaskForm] // Subtask form for task ID
const [editingSubtask, setEditingSubtask]  // Currently editing subtask

// Modal state
const [showDetailModal, setShowDetailModal] // Detail modal visibility
const [detailModalData, setDetailModalData] // Modal content data

// Theme
const [isDarkMode, setIsDarkMode]          // Dark mode toggle
```

### Data Models

#### Task Object
```typescript
{
  id: number,                    // Date.now() generated
  title: string,                 // Task title
  status: "todo" | "in-progress" | "completed", // Auto-calculated from subtasks
  description?: string,          // Optional description
  checklist?: Array<{            // Optional checklist
    id: number,
    text: string,
    completed: boolean
  }>,
  subtasks: Array<Subtask>,      // Child subtasks
  createdAt?: string             // ISO 8601 timestamp
}
```

#### Subtask Object
```typescript
{
  id: number,                    // Date.now() generated
  title: string,                 // Subtask title
  status: "todo" | "ongoing" | "completed",
  todoDate: string,              // YYYY-MM-DD format
  deadline: string,              // YYYY-MM-DD format
  description?: string,          // Optional description
  checklist?: Array<ChecklistItem>
}
```

#### Subject Object
```typescript
{
  id: number,                    // Date.now() generated
  name: string,                  // Subject name (e.g., "Mathematics")
  taskIds: Array<number>         // IDs of tasks in this subject
}
```

### Component Architecture

```
App.js (Root - State Container)
├── AppHeader (Theme toggle, clear data)
├── ViewToggle (Tasks/Table/Kanban switcher)
├── [Current View Component]
│   ├── TasksViewSplit (when view === "tasks")
│   │   └── SubjectsPanel
│   ├── TableViewSplit (when view === "table")
│   └── KanbanBoardSplit (when view === "kanban")
└── DetailModalSplit (Overlay modal)
```

**Pattern**: Components receive props from App.js, don't manage their own state. All updates flow through App.js callbacks.

### Data Persistence

**localStorage Strategy** (Auto-save pattern):

```javascript
// Load on mount (App.js lines 212-218)
useEffect(() => {
  const stored = localStorage.getItem("taskManager-tasks");
  if (stored) {
    setTasks(JSON.parse(stored));
  }
}, []);

// Save on every change (App.js lines 285-297)
useEffect(() => {
  localStorage.setItem("taskManager-tasks", JSON.stringify(tasks));
}, [tasks]);
```

**Storage Keys**:
- `taskManager-tasks` - Tasks array
- `taskManager-subjects` - Subjects array
- `taskManager-darkMode` - Boolean as string

### Theme Management

**Centralized Theme Object** (App.js lines 629-657):

```javascript
const getThemeClasses = useMemo(() => ({
  background: isDarkMode ? "bg-gray-900" : "bg-gray-50",
  cardBackground: isDarkMode ? "bg-gray-800" : "bg-white",
  text: isDarkMode ? "text-gray-100" : "text-gray-900",
  textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
  textMuted: isDarkMode ? "text-gray-500" : "text-gray-400",
  border: isDarkMode ? "border-gray-700" : "border-gray-200",
  // ... 15+ more theme properties
}), [isDarkMode]);
```

**Dark Mode Toggle** (App.js lines 300-304):
```javascript
useEffect(() => {
  localStorage.setItem("taskManager-darkMode", isDarkMode.toString());
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [isDarkMode]);
```

---

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
# Opens http://localhost:3000

# Run tests
npm test

# Build for production
npm run build
```

### Git Workflow

**Branch Strategy**:
- Work on feature branches prefixed with `claude/`
- Branch format: `claude/claude-md-<session-id>-<hash>`
- Current branch: `claude/claude-md-miil7o91ur7cotvg-015F4oDpiTiHDj4DQd5FaWmZ`

**Commit Message Style** (from git log):
- Descriptive, lowercase first word
- Action-based: "added", "fixed", "updated"
- Examples:
  - "added subject to table view"
  - "Fixed board view not displaying tasks for current date"
  - "Added filtering for table view"

**Pushing Changes**:
```bash
# Always use -u flag for new branches
git push -u origin <branch-name>

# Branch MUST start with 'claude/' and match session ID
# Retry up to 4 times on network errors (2s, 4s, 8s, 16s backoff)
```

### Making Changes

#### 1. Read Before Modifying
**CRITICAL**: Always read files before editing them.

```bash
# Bad - making changes without reading
❌ Edit file without Read

# Good - read first, then edit
✅ Read file → Understand structure → Edit file
```

#### 2. Preserve Existing Patterns

When adding features:
- Match existing naming conventions
- Use same state management approach
- Follow component prop patterns
- Maintain theme class usage
- Keep immutable update patterns

#### 3. Component Development Pattern

```javascript
// 1. Add state to App.js if needed
const [newFeature, setNewFeature] = useState(initialValue);

// 2. Create handler in App.js
const handleNewFeature = useCallback((param) => {
  setNewFeature(prev => /* immutable update */);
}, [dependencies]);

// 3. Pass to component as props
<ComponentName
  newFeature={newFeature}
  onNewFeature={handleNewFeature}
  theme={getThemeClasses}
/>

// 4. Use in component
const ComponentName = ({ newFeature, onNewFeature, theme }) => {
  return (
    <div className={`${theme.cardBackground} p-4`}>
      {/* component JSX */}
    </div>
  );
};
```

---

## Key Conventions

### Naming Conventions

#### State Variables
- **Booleans**: `show` or `is` prefix
  - `showTaskForm`, `isDarkMode`, `isExpanded`
- **Collections**: Plural nouns
  - `tasks`, `subjects`, `subtasks`
- **Current values**: Descriptive nouns
  - `draggedItem`, `editingSubtask`, `newTask`

#### Functions
- **Event handlers**: `handle` or `on` prefix
  - `handleAddTask`, `onToggleDarkMode`
- **Getters**: `get` prefix
  - `getTodaysSubtasks`, `getTasksForSubject`
- **Toggles**: `toggle` prefix
  - `toggleTaskExpand`, `toggleSubjectExpand`
- **Updates**: `update` or `set` prefix
  - `updateSubtaskStatus`, `setTasks`

#### File Names
- Components: PascalCase with descriptive suffix
  - `TasksViewSplit.js`, `DetailModalSplit.js`
- Hooks: camelCase with `use` prefix
  - `useTasks.js`

### ID Generation

```javascript
// Always use Date.now() for unique IDs
const newTask = {
  id: Date.now(),
  // ... other properties
};
```

### Date Handling

**Format**: `YYYY-MM-DD` (ISO 8601 date strings)

```javascript
// Generate today's date (App.js pattern)
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const todayStr = `${year}-${month}-${day}`;

// Format for display
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
```

### Immutable State Updates

**Always create new objects/arrays**:

```javascript
// Adding item
setTasks(prev => [...prev, newTask]);

// Removing item
setTasks(prev => prev.filter(t => t.id !== taskId));

// Updating item
setTasks(prev => prev.map(t =>
  t.id === taskId ? { ...t, title: newTitle } : t
));

// Nested update
setTasks(prev => prev.map(task =>
  task.id === taskId
    ? {
        ...task,
        subtasks: task.subtasks.map(sub =>
          sub.id === subtaskId ? { ...sub, status: newStatus } : sub
        )
      }
    : task
));

// Set updates
setExpandedTasks(prev => {
  const updated = new Set(prev);
  updated.has(id) ? updated.delete(id) : updated.add(id);
  return updated;
});
```

### Status Management

**Parent Task Status Calculation** (App.js lines 457-474):

```javascript
const calculateTaskStatus = (subtasks) => {
  if (subtasks.length === 0) return "todo";

  const allCompleted = subtasks.every(s => s.status === "completed");
  if (allCompleted) return "completed";

  const hasOngoing = subtasks.some(s => s.status === "ongoing");
  if (hasOngoing) return "in-progress";

  const hasCompleted = subtasks.some(s => s.status === "completed");
  if (hasCompleted) return "in-progress";

  return "todo";
};
```

**Status Values**:
- Tasks: `"todo"`, `"in-progress"`, `"completed"`
- Subtasks: `"todo"`, `"ongoing"`, `"completed"`

### Tailwind CSS Patterns

#### Using Theme Classes

```jsx
// Always use theme classes from getThemeClasses
<div className={`${getThemeClasses.cardBackground} p-6 rounded-lg`}>
  <h2 className={getThemeClasses.text}>Title</h2>
  <p className={getThemeClasses.textSecondary}>Description</p>
</div>
```

#### Common Button Patterns

```jsx
// Primary button
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
  Save
</button>

// Secondary button (theme-aware)
<button className={`${getThemeClasses.buttonSecondary} px-4 py-2 rounded-lg transition-colors`}>
  Cancel
</button>

// Icon button
<button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
  <Icon size={20} />
</button>
```

#### Status Badge Pattern

```jsx
// Light mode colors
const lightColors = {
  completed: "bg-green-100 text-green-800 border-green-200 font-bold",
  ongoing: "bg-blue-100 text-blue-800 border-blue-200 font-bold",
  todo: "bg-gray-100 text-gray-700 border-gray-200 font-bold",
};

// Dark mode colors
const darkColors = {
  completed: "bg-green-800 text-green-100 border-green-600 font-bold",
  ongoing: "bg-blue-800 text-blue-100 border-blue-600 font-bold",
  todo: "bg-gray-600 text-gray-100 border-gray-500 font-bold",
};

// Usage
<span className={`px-2 py-1 rounded-md text-sm border ${statusColors[status]}`}>
  {status}
</span>
```

### Memoization Strategy

Use `useMemo` for expensive calculations:

```javascript
// Theme object (recalculates only when isDarkMode changes)
const getThemeClasses = useMemo(() => ({
  background: isDarkMode ? "bg-gray-900" : "bg-gray-50",
  // ... more properties
}), [isDarkMode]);

// Filtered/sorted data
const filteredSubtasks = useMemo(() => {
  let result = getAllSubtasks();
  // ... filtering logic
  return result;
}, [getAllSubtasks, filters, sortAscending]);

// Today's tasks
const getTodaysSubtasks = useMemo(() => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return tasks.flatMap(task =>
    task.subtasks
      .filter(subtask => subtask.todoDate === todayStr)
      .map(subtask => ({ ...subtask, parentTaskId: task.id, parentTaskTitle: task.title }))
  );
}, [tasks]);
```

Use `useCallback` for function stability:

```javascript
const toggleTaskExpand = useCallback((taskId) => {
  setExpandedTasks(prev => {
    const updated = new Set(prev);
    updated.has(taskId) ? updated.delete(taskId) : updated.add(taskId);
    return updated;
  });
}, []);

const updateSubtaskStatus = useCallback((taskId, subtaskId, newStatus) => {
  setTasks(prev => prev.map(task =>
    task.id === taskId
      ? {
          ...task,
          subtasks: task.subtasks.map(sub =>
            sub.id === subtaskId ? { ...sub, status: newStatus } : sub
          )
        }
      : task
  ));
}, []);
```

### Error Handling

**localStorage Operations**:

```javascript
try {
  localStorage.setItem("taskManager-tasks", JSON.stringify(tasks));
} catch (error) {
  console.error("Error saving tasks to localStorage:", error);
}
```

**Defensive Programming**:

```javascript
// Always check for null/undefined
const taskIds = subject?.taskIds || [];
const tasks = getTasksForSubject(subjectId) || [];

// Validate before operations
if (newTask.title.trim()) {
  addTask(newTask);
}

// Handle missing data
const description = task.description || "";
const checklist = task.checklist || [];
```

### Drag & Drop Pattern

**Task-to-Subject Drag**:

```javascript
// Draggable item
<div
  draggable
  onDragStart={(e) => {
    e.dataTransfer.setData("application/x-task", JSON.stringify({ taskId: task.id }));
    e.dataTransfer.effectAllowed = "move";
  }}
>

// Drop target
<div
  onDragOver={(e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }}
  onDrop={(e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("application/x-task"));
    handleDrop(data.taskId);
  }}
>
```

**Kanban Column Drag**:

```javascript
// Draggable subtask
onDragStart={(e) => {
  setDraggedItem({ taskId, subtaskId, currentStatus: subtask.status });
  e.dataTransfer.effectAllowed = "move";
}}

// Drop on column
onDrop={(e) => {
  e.preventDefault();
  if (draggedItem) {
    updateSubtaskStatus(draggedItem.taskId, draggedItem.subtaskId, newStatus);
    setDraggedItem(null);
  }
}}
```

---

## Common Tasks

### Adding a New Feature

1. **Read existing code**
   ```
   Read src/App.js
   Read src/components/[relevant-component].js
   ```

2. **Plan state requirements**
   - Does this need new state in App.js?
   - Will it affect existing state?
   - Does it need localStorage persistence?

3. **Implement in App.js**
   - Add state variables
   - Create handler functions with useCallback
   - Add to return JSX

4. **Create/modify component**
   - Accept props from App.js
   - Use theme classes
   - Follow immutable update patterns

5. **Test manually**
   - Run `npm start`
   - Test light/dark mode
   - Check localStorage persistence
   - Verify all view modes work

### Adding a New View Mode

Example: Adding a "Calendar" view

1. **Update view state in App.js**:
   ```javascript
   const [view, setView] = useState("tasks"); // Add "calendar" as option
   ```

2. **Update ViewToggle.js**:
   ```javascript
   <button onClick={() => setView("calendar")}>Calendar</button>
   ```

3. **Create CalendarView.js** in `/src/components/`:
   ```javascript
   const CalendarView = ({ tasks, theme, onUpdateTask }) => {
     // Component logic
   };
   ```

4. **Add to App.js render**:
   ```javascript
   {view === "calendar" && (
     <CalendarView
       tasks={tasks}
       theme={getThemeClasses}
       onUpdateTask={handleUpdateTask}
     />
   )}
   ```

### Modifying Data Structure

**IMPORTANT**: Changing data models affects localStorage.

1. **Create migration function**:
   ```javascript
   const migrateData = (oldData) => {
     return oldData.map(item => ({
       ...item,
       newField: defaultValue // Add new field
     }));
   };
   ```

2. **Apply during load**:
   ```javascript
   const loadTasksFromStorage = () => {
     const stored = localStorage.getItem("taskManager-tasks");
     if (stored) {
       const parsed = JSON.parse(stored);
       return migrateData(parsed); // Apply migration
     }
     return defaultTasks;
   };
   ```

3. **Update all usages**:
   - Search for all places the data is accessed
   - Update type definitions in this document
   - Test with existing localStorage data

### Adding a New Theme Color

1. **Update getThemeClasses in App.js**:
   ```javascript
   const getThemeClasses = useMemo(() => ({
     // ... existing colors
     newColor: isDarkMode ? "bg-purple-900" : "bg-purple-100",
   }), [isDarkMode]);
   ```

2. **Use in components**:
   ```jsx
   <div className={theme.newColor}>Content</div>
   ```

### Adding a Filter to Table View

1. **Add filter state in App.js**:
   ```javascript
   const [newFilter, setNewFilter] = useState("");
   ```

2. **Pass to TableViewSplit**:
   ```jsx
   <TableViewSplit
     newFilter={newFilter}
     onNewFilterChange={setNewFilter}
     // ... other props
   />
   ```

3. **Apply in TableViewSplit.js**:
   ```javascript
   const filteredSubtasks = useMemo(() => {
     return subtasks.filter(sub => {
       // Apply new filter logic
       if (newFilter && sub.field !== newFilter) return false;
       return true;
     });
   }, [subtasks, newFilter]);
   ```

### Adding Icon from Lucide React

1. **Import icon in component**:
   ```javascript
   import { Calendar, Check, X } from "lucide-react";
   ```

2. **Use in JSX**:
   ```jsx
   <Calendar size={20} className="text-gray-500" />
   ```

**Common Icons Used**:
- Plus, Trash2, Edit, X
- ChevronDown, ChevronRight
- Calendar, Check, Square
- FileText, BookOpen, Filter
- Moon, Sun, GripVertical

---

## Testing Guidelines

### Current Test Setup

- **Framework**: Jest + React Testing Library
- **Files**:
  - `src/setupTests.js` - Test configuration
  - `src/App.test.js` - Main app tests
- **Status**: Minimal tests currently implemented

### Running Tests

```bash
npm test              # Run tests in watch mode
npm test -- --coverage # Run with coverage report
```

### Writing Component Tests

**Pattern for testing components**:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import TasksViewSplit from './TasksViewSplit';

test('renders tasks correctly', () => {
  const mockTasks = [
    { id: 1, title: "Test Task", subtasks: [] }
  ];

  render(
    <TasksViewSplit
      tasks={mockTasks}
      subjects={[]}
      // ... required props
    />
  );

  expect(screen.getByText("Test Task")).toBeInTheDocument();
});

test('toggles task expansion on click', () => {
  const mockToggle = jest.fn();

  render(
    <TasksViewSplit
      tasks={mockTasks}
      onToggleTaskExpand={mockToggle}
      // ... other props
    />
  );

  fireEvent.click(screen.getByRole('button', { name: /expand/i }));
  expect(mockToggle).toHaveBeenCalledWith(1);
});
```

### Testing localStorage

```javascript
beforeEach(() => {
  localStorage.clear();
});

test('loads tasks from localStorage', () => {
  const mockTasks = [{ id: 1, title: "Task 1", subtasks: [] }];
  localStorage.setItem("taskManager-tasks", JSON.stringify(mockTasks));

  render(<App />);

  expect(screen.getByText("Task 1")).toBeInTheDocument();
});
```

### Manual Testing Checklist

When making changes, test:

- [ ] Light mode and dark mode both work
- [ ] All three view modes render correctly
- [ ] Data persists after page refresh
- [ ] Drag and drop functionality works
- [ ] Status updates propagate correctly
- [ ] Forms validate and submit properly
- [ ] Modal opens and closes correctly
- [ ] Responsive design on mobile/tablet/desktop

---

## Important Files Reference

### Critical Files (Always Review Before Changes)

| File | Lines | Purpose | When to Modify |
|------|-------|---------|----------------|
| `src/App.js` | 860 | Root component, all state management | Adding new features, state, or global handlers |
| `src/components/TasksViewSplit.js` | 655 | Main hierarchical task view | Modifying task display or organization |
| `src/hooks/useTasks.js` | 368 | Custom task management hook | Changing task logic patterns |

### Component Files

| File | Purpose | Key Features |
|------|---------|--------------|
| `src/components/AppHeader.js` | App header bar | Theme toggle, clear data, title |
| `src/components/ViewToggle.js` | View mode switcher | Tasks/Table/Kanban buttons |
| `src/components/TableViewSplit.js` | Table view | Filters, sorting, subtask table |
| `src/components/KanbanBoardSplit.js` | Kanban board | Today's tasks, drag-drop columns |
| `src/components/DetailModalSplit.js` | Detail modal | Description, checklist management |
| `src/components/SubjectsPanel.js` | Subject management | Add/delete subjects |
| `src/components/SubjectsViewSplit.js` | Alternative subject view | Subject-first organization |

### Configuration Files

| File | Purpose | Modify When |
|------|---------|-------------|
| `package.json` | Dependencies, scripts | Adding packages, changing scripts |
| `tailwind.config.js` | Tailwind CSS config | Adding custom colors, breakpoints |
| `postcss.config.js` | PostCSS plugins | Changing CSS processing |
| `.gitignore` | Git ignore rules | Excluding new files from git |

### State Location Quick Reference

**All state is in `src/App.js`**:

- **Line 212-218**: Task loading from localStorage
- **Line 285-297**: Task saving to localStorage
- **Line 300-304**: Dark mode persistence
- **Line 457-474**: Task status calculation logic
- **Line 604-626**: Status badge color definitions
- **Line 629-657**: Theme classes object (getThemeClasses)
- **Line 674-682**: Date formatting function

### Common Code Locations

**Adding a task**:
- Handler: `App.js` - `addTask` function
- Form: `TasksViewSplit.js` - Task form section

**Adding a subtask**:
- Handler: `App.js` - `addSubtask` function
- Form: `TasksViewSplit.js` - Subtask form section

**Editing subtask**:
- Handler: `App.js` - `updateSubtask` function
- UI: `TasksViewSplit.js` - Edit form inline

**Status updates**:
- Handler: `App.js` - `updateSubtaskStatus` function
- Calculation: `App.js` - `calculateTaskStatus` function (lines 457-474)
- UI: All view components have status dropdowns

**Subject management**:
- Add: `App.js` - `addSubject` function
- Delete: `App.js` - `deleteSubject` function
- Assign task: `App.js` - `handleDrop` function (drag-drop)

**Detail modal**:
- Component: `DetailModalSplit.js`
- Data: `App.js` - `detailModalData` state
- Open: All views call `setDetailModalData`

---

## Best Practices for AI Assistants

### Before Making Changes

1. **Always read files first**
   - Use Read tool on files you plan to modify
   - Understand current implementation
   - Check for dependencies

2. **Check git history**
   - Look at recent commits for context
   - Understand recent changes
   - Follow established patterns

3. **Review this CLAUDE.md**
   - Check conventions section
   - Review data models
   - Follow naming patterns

### When Adding Features

1. **Minimize changes**
   - Only modify what's necessary
   - Don't refactor unrelated code
   - Keep changes focused

2. **Preserve patterns**
   - Match existing code style
   - Use same state management approach
   - Follow component prop patterns

3. **Maintain theme support**
   - Use `getThemeClasses` for colors
   - Test in both light and dark mode
   - Add both light/dark variants for new colors

4. **Ensure persistence**
   - Add useEffect for localStorage if needed
   - Test data survives refresh
   - Handle migration for data model changes

### Code Quality Checklist

- [ ] Read relevant files before modifying
- [ ] Follow naming conventions
- [ ] Use immutable state updates
- [ ] Apply theme classes correctly
- [ ] Add appropriate error handling
- [ ] Use useMemo/useCallback where appropriate
- [ ] Test in all view modes
- [ ] Test light and dark themes
- [ ] Verify localStorage persistence
- [ ] Check responsive design

### Communication

When explaining changes:
- Reference file paths with line numbers
- Use format: `src/App.js:629` for specific locations
- Quote existing code when relevant
- Explain why changes were made, not just what

### Debugging Approach

1. **Check browser console** for errors
2. **Verify localStorage** data structure
3. **Test state updates** with React DevTools
4. **Check prop flow** from App.js to components
5. **Validate theme classes** in light/dark mode
6. **Test all view modes** after changes

---

## Glossary

- **Task**: Top-level item, can contain subtasks
- **Subtask**: Child item under a task, has dates and status
- **Subject**: Category for organizing tasks (e.g., "Math", "Science")
- **View Mode**: Tasks, Table, or Kanban display
- **Theme**: Light or dark color scheme
- **Detail Modal**: Popup for editing descriptions and checklists
- **Status**: Task completion state (todo/in-progress/completed)
- **To-Do Date**: When to start working on subtask
- **Deadline**: Due date for subtask

---

## Quick Command Reference

```bash
# Development
npm start                 # Start dev server (localhost:3000)
npm test                  # Run tests
npm run build             # Build for production

# Git
git status                # Check current branch and changes
git add .                 # Stage all changes
git commit -m "message"   # Commit with message
git push -u origin <branch> # Push to remote

# Common Operations
npm install <package>     # Add dependency
npm uninstall <package>   # Remove dependency
```

---

## Changelog

### 2025-11-28
- Initial CLAUDE.md creation
- Documented complete codebase structure
- Added comprehensive conventions and patterns
- Included common tasks and workflows
- Added quick reference sections

---

**For Questions**: Refer to README.md for user documentation or check inline comments in App.js for implementation details.

**Keep This Updated**: When making significant architectural changes, update this document to reflect the new patterns.
