import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';
import { FilterOptions, TaskPriority, TaskStatus, TeamMember } from '../../types';

interface TaskFiltersProps {
  filters: FilterOptions;
  teamMembers: TeamMember[];
  onFilterChange: (updates: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalResultsCount: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  teamMembers,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  totalResultsCount
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          alignItems: 'center'
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', gridColumn: 'span 2' }} className="search-group">
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.35rem' }}
            placeholder="Search tasks by title or description..."
            value={filters.searchTerm}
            onChange={e => onFilterChange({ searchTerm: e.target.value })}
            aria-label="Search tasks by title"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            className="form-control"
            value={filters.statusFilter}
            onChange={e => onFilterChange({ statusFilter: e.target.value as TaskStatus | 'All' })}
            aria-label="Filter by status"
          >
            <option value="All">Status: All</option>
            <option value="Todo">Status: Todo</option>
            <option value="In Progress">Status: In Progress</option>
            <option value="Completed">Status: Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            className="form-control"
            value={filters.priorityFilter}
            onChange={e => onFilterChange({ priorityFilter: e.target.value as TaskPriority | 'All' })}
            aria-label="Filter by priority"
          >
            <option value="All">Priority: All</option>
            <option value="High">Priority: High</option>
            <option value="Medium">Priority: Medium</option>
            <option value="Low">Priority: Low</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <select
            className="form-control"
            value={filters.assigneeFilter}
            onChange={e => onFilterChange({ assigneeFilter: e.target.value })}
            aria-label="Filter by assignee"
          >
            <option value="All">Assignee: All</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.id}>
                Assignee: {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            className="form-control"
            value={filters.sortBy}
            onChange={e =>
              onFilterChange({
                sortBy: e.target.value as 'dueDate' | 'priority' | 'createdAt' | 'title'
              })
            }
            aria-label="Sort tasks by"
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="createdAt">Sort: Created Date</option>
            <option value="title">Sort: Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Filter status bar & Clear button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '0.75rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Filter size={15} />
          <span>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{totalResultsCount}</strong> tasks
          </span>
          {hasActiveFilters && (
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600
              }}
            >
              Active Filters Applied
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClearFilters}
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem', color: '#ef4444' }}
          >
            <RotateCcw size={14} /> Clear Filters
          </button>
        )}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .search-group { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  );
};
