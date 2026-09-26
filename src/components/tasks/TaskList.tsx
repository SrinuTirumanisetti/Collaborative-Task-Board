import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Task, TeamMember } from '../../types';
import { TaskRow } from './TaskRow';
import { Zap } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  teamMembers,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  const [forceVirtualization, setForceVirtualization] = useState(false);
  const useVirtualization = tasks.length >= 40 || forceVirtualization;

  // Row renderer for react-window
  const VirtualizedRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const task = tasks[index];
    return (
      <TaskRow
        key={task.id}
        task={task}
        teamMembers={teamMembers}
        onToggleStatus={onToggleStatus}
        onEdit={onEdit}
        onDelete={onDelete}
        style={style}
      />
    );
  };

  return (
    <div>
      {/* Benchmark / Virtualization Info Banner when task count > 20 */}
      {tasks.length >= 20 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 1rem',
            backgroundColor: useVirtualization ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-tertiary)',
            border: `1px solid ${useVirtualization ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} color={useVirtualization ? '#8b5cf6' : 'var(--text-muted)'} />
            <span>
              List size: <strong style={{ color: 'var(--text-primary)' }}>{tasks.length} tasks</strong>.{' '}
              {useVirtualization
                ? 'react-window Virtualized rendering active (60 FPS DOM optimization).'
                : 'Standard DOM rendering mode.'}
            </span>
          </div>

          <button
            type="button"
            className={`btn ${useVirtualization ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            onClick={() => setForceVirtualization(!forceVirtualization)}
          >
            {useVirtualization ? 'Disable Virtualization' : 'Enable Virtualization Benchmark'}
          </button>
        </div>
      )}

      {/* Render virtualized list if active */}
      {useVirtualization ? (
        <div
          style={{
            width: '100%',
            height: '600px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <List
            height={600}
            itemCount={tasks.length}
            itemSize={82}
            width="100%"
          >
            {VirtualizedRow}
          </List>
        </div>
      ) : (
        /* Standard mapped list */
        <div>
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
