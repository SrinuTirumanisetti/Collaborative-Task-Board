import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskModal } from '../src/components/tasks/TaskModal';
import { INITIAL_TEAM_MEMBERS } from '../src/data/seed';

describe('TaskModal & Form Validation', () => {
  it('renders required field validation errors when submitting an empty form', async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        projectId="p1"
        teamMembers={INITIAL_TEAM_MEMBERS}
      />
    );

    // Clear auto-populated title if any
    const titleInput = screen.getByLabelText(/Task Title/i);
    fireEvent.change(titleInput, { target: { value: '' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Create Task/i });
    fireEvent.click(submitBtn);

    // Assert validation error messages appear on screen
    await waitFor(() => {
      expect(screen.getByText(/Task title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Task description is required/i)).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when required fields are valid', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        projectId="p1"
        teamMembers={INITIAL_TEAM_MEMBERS}
      />
    );

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: 'Unit Test Task' }
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Valid test description content.' }
    });
    fireEvent.change(screen.getByLabelText(/Due Date/i), {
      target: { value: '2026-12-31' }
    });

    const submitBtn = screen.getByRole('button', { name: /Create Task/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Unit Test Task',
          description: 'Valid test description content.',
          dueDate: '2026-12-31',
          projectId: 'p1'
        })
      );
    });
  });
});
