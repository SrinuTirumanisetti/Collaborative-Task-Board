# Collaborative Task Board — TaskFlow Pro

A high-performance, accessible, and responsive React + TypeScript collaborative task board built with React 18, React Router v6, Context API + `useReducer`, custom hooks, list virtualization (`react-window`), and Vitest + React Testing Library.

---

## 🚀 Overview & Features

- **Executive Dashboard**: Real-time project metrics, completion rate progress bars, team statistics, and recent activity calculated on-the-fly during render using `useMemo`.
- **Project Management (CRUD)**: Create, edit, and delete projects with modal confirmation dialogs. Tracks progress percentage and member assignments.
- **Task Board & Virtualized List**: Supports large enterprise workloads up to **1,000+ tasks** with 60 FPS scrolling performance using `react-window` list virtualization.
- **Search, Filtering & Sorting**:
  - Debounced search by title/description (`useDebounce` hook).
  - Multi-select filters for Status (`Todo`, `In Progress`, `Completed`), Priority (`Low`, `Medium`, `High`), and Assignees.
  - Sorting by Due Date, Priority, Created Date, and Title A-Z.
  - Distinct empty states for no tasks, no search results, and no filter matches.
- **Accessible Task Creation Modal**:
  - Portal-based rendering (`createPortal`).
  - Keyboard trap & focus management (`useFocusTrap` hook).
  - Field validation with icon + text error indicators.
  - Duplicate submission prevention guard (`isSubmitting`).
  - Form data preservation when API submissions fail.
- **Settings & Persisted Preferences**: Light/Dark theme switching and layout density customization persisted across browser refreshes via `useLocalStorage`.
- **Realistic Mock API Layer**: Simulated REST endpoints with artificial network latency and toggleable failure state testing.

---

## 🛠️ Technology Stack

- **Core**: React 18.3+, TypeScript 5.3+, Vite 5.4+
- **Routing**: React Router v6 (`BrowserRouter`, `NavLink`, `useParams`)
- **State Management**: React Context + `useReducer` for domain data; Custom Hooks (`useProjects`, `useTasks`, `useLocalStorage`, `useDebounce`, `useFocusTrap`)
- **Performance**: `react-window` virtualization, `React.memo`, `useCallback`, `useMemo`
- **Styling**: Modern CSS variables, HSL color tokens, glassmorphism, responsive grid/flex layout
- **Testing**: Vitest, React Testing Library, `@testing-library/user-event`, jsdom

---

## 📦 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Open browser at local port (typically http://localhost:5173)
```

---

## 🧪 Testing & Build Instructions

```bash
# Run unit & integration test suite (Vitest + React Testing Library)
npm test

# Run TypeScript type check and production bundle build
npm run build
```

---

## 💡 Architecture & State Management Explanation

### Domain State (Context + `useReducer`)
- **`ProjectsContext` & `TasksContext`**: Domain objects are managed using pure reducer functions (`projectsReducer`, `tasksReducer`). State updates are triggered via explicit action dispatches (`FETCH_SUCCESS`, `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`).
- **Why this over Redux Toolkit or React Query?** This approach keeps the application light, easy to explain during a viva code review, and demonstrates mastery over foundational React hook patterns without adding unnecessary third-party abstractions.

### Custom Hooks Layer
- `useProjects()` and `useTasks()` wrap reducer dispatches and mock API calls into clean domain hooks.
- `useDebounce()` postpones search filtering calculations until ~300ms after user input stops.
- `useFocusTrap()` enforces WCAG 2.1 modal focus containment and `Escape` key listeners.
- `useLocalStorage()` syncs application preferences with browser storage.

---

## ⚡ Performance Optimization Decisions

1. **List Virtualization (`react-window`)**:
   - **Problem**: Rendering 1,000 DOM nodes simultaneously causes severe browser layout thrashing and input lag.
   - **Solution**: `TaskList` uses `FixedSizeList` from `react-window` to render only the ~15-20 rows visible in the viewport.
2. **`React.memo` & `useCallback`**:
   - `TaskRow` is wrapped in `React.memo`. Action handlers (`onToggleStatus`, `onEdit`, `onDelete`) are memoized with `useCallback` to prevent unnecessary row re-renders when parent state changes.
3. **`useMemo` Filter & Sort Pipeline**:
   - Recalculates filtered/sorted task arrays only when `tasks`, `debouncedSearchTerm`, or active filters change.

---

## ♿ Accessibility (a11y) Features

- **Keyboard Focus Management**: Automatic focus trap inside modals; restores focus to trigger elements upon close; `Escape` key closes dialogs.
- **Form Labeling**: Every input has explicit `htmlFor` label associations and `aria-invalid` tags.
- **Color Contrast & Indicators**: Status and priority badges combine background contrast, text labels, and icons (never color alone).
- **Visible Focus Rings**: Intact `:focus-visible` outline styles across all interactive buttons and links.

---

## ⚠️ Known Limitations

- The API layer is backed by a client-side mock server (`mockServer.ts`) persisted in `localStorage`. Database updates reset if local storage is cleared.
