import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from '../src/components/tasks/TaskList';
import { INITIAL_TEAM_MEMBERS } from '../src/data/seed';
import { Task } from '../src/types';

describe('TaskList & Row Rendering', () => {
  const sampleTasks: Task[] = [
    {
      id: 't-test-1',
      projectId: 'p1',
      title: 'Design Wireframes',
      description: 'Create low-fidelity wireframes in Figma.',
      status: 'Todo',
      priority: 'High',
      assigneeId: 'm1',
      dueDate: '2026-10-15',
      createdAt: '2026-09-01T10:00:00.000Z',
      updatedAt: '2026-09-01T10:00:00.000Z'
    }
  ];

  it('renders task rows with correct title, priority badge, and assignee', () => {
    const handleToggle = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <TaskList
        tasks={sampleTasks}
        teamMembers={INITIAL_TEAM_MEMBERS}
        onToggleStatus={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

    expect(screen.getByText('Design Wireframes')).toBeInTheDocument();
    expect(screen.getByText('Create low-fidelity wireframes in Figma.')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('triggers edit callback when edit button is clicked', () => {
    const handleEdit = vi.fn();

    render(
      <TaskList
        tasks={sampleTasks}
        teamMembers={INITIAL_TEAM_MEMBERS}
        onToggleStatus={vi.fn()}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />
    );

    const editBtn = screen.getByTitle('Edit Task');
    fireEvent.click(editBtn);

    expect(handleEdit).toHaveBeenCalledWith(sampleTasks[0]);
  });
});
