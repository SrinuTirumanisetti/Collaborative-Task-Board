import React from 'react';
import { Task } from '../../types';

interface ProgressSummaryProps {
  tasks: Task[];
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ tasks }) => {
  const total = tasks.length;
  if (total === 0) return null;

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const todo = tasks.filter(t => t.status === 'Todo').length;

  const completedPct = Math.round((completed / total) * 100);
  const inProgressPct = Math.round((inProgress / total) * 100);
  const todoPct = 100 - (completedPct + inProgressPct);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Overall Task Completion</h3>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--status-completed)' }}>
          {completedPct}%
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div
        style={{
          height: '10px',
          width: '100%',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          display: 'flex'
        }}
      >
        <div
          style={{
            width: `${completedPct}%`,
            backgroundColor: 'var(--status-completed)',
            transition: 'width var(--transition-normal)'
          }}
          title={`Completed: ${completed} (${completedPct}%)`}
        />
        <div
          style={{
            width: `${inProgressPct}%`,
            backgroundColor: 'var(--status-in-progress)',
            transition: 'width var(--transition-normal)'
          }}
          title={`In Progress: ${inProgress} (${inProgressPct}%)`}
        />
        <div
          style={{
            width: `${todoPct}%`,
            backgroundColor: 'var(--status-todo)',
            transition: 'width var(--transition-normal)'
          }}
          title={`Todo: ${todo} (${todoPct}%)`}
        />
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-completed)'
            }}
          />
          <span>Completed: {completed}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-in-progress)'
            }}
          />
          <span>In Progress: {inProgress}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-todo)'
            }}
          />
          <span>Todo: {todo}</span>
        </div>
      </div>
    </div>
  );
};
