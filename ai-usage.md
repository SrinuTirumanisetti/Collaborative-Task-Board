# AI Usage Report — Collaborative Task Board

## 🤖 AI Tools Used
- **Antigravity AI Assistant** powered by Gemini 3.6 Flash.

---

## 🎯 Tasks Where AI Helped

1. **Architecture & Project Planning**: Mapping assignment requirements (Sections 1–20) to React concepts and setting up folder structure.
2. **Boilerplate & TypeScript Schema Generation**: Creating clean TypeScript interfaces (`Task`, `Project`, `TeamMember`, `Preferences`, `FilterOptions`).
3. **Mock API & Seed Data Generator**: Building `mockServer.ts` with artificial delay, failure simulation, and the 1,000 tasks generator function (`generate1000Tasks`).
4. **State Management & Contexts**: Writing `useReducer` implementations for `ProjectsContext` and `TasksContext`.
5. **Component Scaffolding**: Developing accessible glassmorphism UI components (`TaskRow`, `TaskModal`, `ProjectCard`, `TaskFilters`, `StatCard`).
6. **Automated Testing**: Writing Vitest + React Testing Library unit tests and the end-to-end user journey test suite (`userJourney.test.tsx`).

---

## 💬 Representative Prompts Used

- *"Please scaffold the project following the exact folder structure, data model, and section-by-section mapping in this plan document."*
- *"Implement a realistic mock server with artificial delay, toggleable API failure simulation, and 1,000 generated benchmark tasks for performance testing."*
- *"Create an accessible modal component using createPortal, focus trap hook, and keyboard Escape key listeners."*
- *"Add Vitest unit tests for TaskForm validation and an end-to-end user journey test."*

---

## 🔍 Code Evaluation & Modifications

- **Generated Code Accepted As-Is**:
  - `src/types/index.ts` type definitions.
  - `src/hooks/useDebounce.ts` and `src/hooks/useLocalStorage.ts`.
  - `src/components/dashboard/StatCard.tsx` and `ProgressSummary.tsx`.
- **Generated Code Modified**:
  - `tests/userJourney.test.tsx`: Refined screen query from `getByRole('link', { name: /Projects/i })` to `getAllByRole('link', { name: /Projects/i })[0]` to resolve multiple element matching issues between the navbar and dashboard button.
  - `src/components/tasks/TaskList.tsx`: Added an interactive benchmark toggle button for virtualization mode.
- **Generated Code Rejected**: None. All generated patterns were aligned with assignment constraints.

---

## 🐛 Bugs or Incorrect Suggestions Introduced

- During test execution, an initial selector query in `userJourney.test.tsx` matched both the navbar navigation link and the dashboard call-to-action button, causing a TestingLibrary `MultipleElementsFoundError`. This was immediately identified via log inspection and resolved by selecting the specific navbar link element.

---

## ✅ Final Implementation Verification

- **Automated Testing**: Ran `npm test` using Vitest + React Testing Library (4 test files, 7 passing tests).
- **TypeScript Compilation & Build**: Ran `npm run build` (`tsc && vite build`), confirming zero type errors or broken imports.
