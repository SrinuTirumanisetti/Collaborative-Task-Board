import React from 'react';
import { Task, TeamMember, TaskStatus } from '../../types';
import { CheckCircle2, Clock, Circle, Edit3, Trash2, Calendar, User } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  teamMembers: TeamMember[];
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  style?: React.CSSProperties; // Required for react-window virtualization
}

const TaskRowComponent: React.FC<TaskRowProps> = ({
  task,
  teamMembers,
  onToggleStatus,
  onEdit,
  onDelete,
  style
}) => {
  const assignee = teamMembers.find(m => m.id === task.assigneeId);

  const statusIcons = {
    Todo: <Circle size={18} style={{ color: 'var(--status-todo)' }} />,
    'In Progress': <Clock size={18} style={{ color: 'var(--status-in-progress)' }} />,
    Completed: <CheckCircle2 size={18} style={{ color: 'var(--status-completed)' }} />
  };

  const priorityBadgeClass =
    task.priority === 'High'
      ? 'badge-high'
      : task.priority === 'Medium'
      ? 'badge-medium'
      : 'badge-low';

  const statusBadgeClass =
    task.status === 'Completed'
      ? 'badge-completed'
      : task.status === 'In Progress'
      ? 'badge-in-progress'
      : 'badge-todo';

  return (
    <div
      style={{
        ...style,
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '0.65rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        transition: 'all var(--transition-fast)',
        boxSizing: 'border-box'
      }}
      className="task-row-item"
    >
      {/* Quick Status Toggle Button */}
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => onToggleStatus(task)}
        aria-label={`Mark status of ${task.title} as ${
          task.status === 'Completed' ? 'Todo' : 'Completed'
        }`}
        title="Click to cycle status"
        style={{ padding: '0.25rem' }}
      >
        {statusIcons[task.status]}
      </button>

      {/* Title & Description */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {task.title}
          </h4>
          <span className={`badge ${priorityBadgeClass}`}>{task.priority}</span>
        </div>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginTop: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {task.description}
        </p>
      </div>

      {/* Assignee & Due Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        {/* Assignee */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: '100px' }}>
          <User size={14} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {assignee ? assignee.name.split(' ')[0] : 'Unassigned'}
          </span>
        </div>

        {/* Due Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={14} />
          <span>{task.dueDate}</span>
        </div>

        <span className={`badge ${statusBadgeClass}`} style={{ textTransform: 'capitalize' }}>
          {task.status}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => onEdit(task)}
          aria-label={`Edit task ${task.title}`}
          title="Edit Task"
          style={{ padding: '0.35rem' }}
        >
          <Edit3 size={15} />
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => onDelete(task)}
          aria-label={`Delete task ${task.title}`}
          title="Delete Task"
          style={{ padding: '0.35rem', color: '#ef4444' }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

// React.memo optimization to avoid re-rendering rows whose props haven't changed (Topic 1 & Section 10)
export const TaskRow = React.memo(TaskRowComponent);
