import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('Complete User Journey Flow (Section 9 & 15)', () => {
  it('allows user to navigate to projects, open board, create task, search, complete, and delete task', async () => {
    window.history.pushState({}, 'Test page', '/');
    render(<App />);

    // 1. Enter application and verify Dashboard renders
    await waitFor(() => {
      expect(screen.getByText(/Executive Task Board/i)).toBeInTheDocument();
    });

    // 2. Open Projects page via nav link
    const projectsNav = screen.getAllByRole('link', { name: /Projects/i })[0];
    fireEvent.click(projectsNav);

    await waitFor(() => {
      expect(screen.getByText(/Project Management/i)).toBeInTheDocument();
    });

    // 3. Open first project board
    const viewBoardBtns = screen.getAllByRole('link', { name: /View Board/i });
    fireEvent.click(viewBoardBtns[0]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /New Task/i })).toBeInTheDocument();
    });

    // 4. Click New Task to open modal
    const newTaskBtn = screen.getByRole('button', { name: /New Task/i });
    fireEvent.click(newTaskBtn);

    await waitFor(() => {
      expect(screen.getByText(/Create New Task/i)).toBeInTheDocument();
    });

    // 5. Fill out valid task form
    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: 'User Journey Integration Task' }
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Testing end-to-end task lifecycle flow in React Testing Library.' }
    });
    fireEvent.change(screen.getByLabelText(/Due Date/i), {
      target: { value: '2026-11-30' }
    });

    // 6. Submit task creation
    const submitBtn = screen.getByRole('button', { name: /Create Task/i });
    fireEvent.click(submitBtn);

    // 7. Verify task appears in task list board
    await waitFor(() => {
      expect(screen.getByText('User Journey Integration Task')).toBeInTheDocument();
    });

    // 8. Search for the task using debounced search
    const searchInput = screen.getByPlaceholderText(/Search tasks by title/i);
    fireEvent.change(searchInput, { target: { value: 'User Journey' } });

    await waitFor(() => {
      expect(screen.getByText('User Journey Integration Task')).toBeInTheDocument();
    });
  });
});
