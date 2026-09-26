import React from 'react';
import { SearchX, FilterX, FolderOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-tasks' | 'no-search-results' | 'no-filter-results';
  searchTerm?: string;
  onClearFilters?: () => void;
  onCreateTask?: () => void;
}

export const EmptyStates: React.FC<EmptyStateProps> = ({
  type,
  searchTerm,
  onClearFilters,
  onCreateTask
}) => {
  if (type === 'no-search-results') {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 1.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div
          style={{
            padding: '1rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--status-todo)'
          }}
        >
          <SearchX size={36} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            No search results found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px' }}>
            We couldn’t find any tasks matching "<strong>{searchTerm}</strong>". Check your spelling or try clearing your search keyword.
          </p>
        </div>
        {onClearFilters && (
          <button type="button" className="btn btn-secondary" onClick={onClearFilters}>
            Clear Search & Filters
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-filter-results') {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 1.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div
          style={{
            padding: '1rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: 'var(--status-in-progress)'
          }}
        >
          <FilterX size={36} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            No tasks match selected filters
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px' }}>
            No tasks match the specific combination of status, priority, or assignee filters you selected.
          </p>
        </div>
        {onClearFilters && (
          <button type="button" className="btn btn-secondary" onClick={onClearFilters}>
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      <div
        style={{
          padding: '1rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          color: 'var(--accent-primary)'
        }}
      >
        <FolderOpen size={36} />
      </div>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          No tasks in this project yet
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px' }}>
          This project currently has no tasks. Get started by creating the first action item for your team!
        </p>
      </div>
      {onCreateTask && (
        <button type="button" className="btn btn-primary" onClick={onCreateTask}>
          <Plus size={16} /> Create First Task
        </button>
      )}
    </div>
  );
};
