import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskFilters } from '../src/components/tasks/TaskFilters';
import { INITIAL_TEAM_MEMBERS } from '../src/data/seed';
import { FilterOptions } from '../src/types';

describe('TaskFilters Component', () => {
  const defaultFilters: FilterOptions = {
    searchTerm: '',
    statusFilter: 'All',
    priorityFilter: 'All',
    assigneeFilter: 'All',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  };

  it('triggers onFilterChange when search input changes', () => {
    const handleFilterChange = vi.fn();

    render(
      <TaskFilters
        filters={defaultFilters}
        teamMembers={INITIAL_TEAM_MEMBERS}
        onFilterChange={handleFilterChange}
        onClearFilters={vi.fn()}
        hasActiveFilters={false}
        totalResultsCount={5}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search tasks by title/i);
    fireEvent.change(searchInput, { target: { value: 'OAuth' } });

    expect(handleFilterChange).toHaveBeenCalledWith({ searchTerm: 'OAuth' });
  });

  it('renders clear filters button when active filters exist', () => {
    const handleClear = vi.fn();

    render(
      <TaskFilters
        filters={{ ...defaultFilters, statusFilter: 'Completed' }}
        teamMembers={INITIAL_TEAM_MEMBERS}
        onFilterChange={vi.fn()}
        onClearFilters={handleClear}
        hasActiveFilters={true}
        totalResultsCount={2}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /Clear Filters/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalled();
  });
});
