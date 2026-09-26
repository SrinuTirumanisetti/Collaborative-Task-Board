import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskPriority, TaskStatus, TeamMember } from '../../types';
import { Modal } from '../shared/Modal';
import { AlertCircle, Loader2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> | Partial<Task>) => Promise<void>;
  initialData?: Task | null;
  projectId: string;
  teamMembers: TeamMember[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  projectId,
  teamMembers
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Todo');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assigneeId, setAssigneeId] = useState<string>(teamMembers[0]?.id || '');
  const [dueDate, setDueDate] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize initial data when opening modal
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setStatus(initialData.status);
        setPriority(initialData.priority);
        setAssigneeId(initialData.assigneeId || teamMembers[0]?.id || '');
        setDueDate(initialData.dueDate);
      } else {
        // Reset form for new task creation
        setTitle('');
        setDescription('');
        setStatus('Todo');
        setPriority('Medium');
        setAssigneeId(teamMembers[0]?.id || '');
        // Default due date to +7 days
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        setDueDate(defaultDate.toISOString().split('T')[0]);
      }
      setErrors({});
      setApiError(null);

      // Focus first input automatically
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialData, teamMembers]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Task title is required.';
    } else if (title.trim().length < 3) {
      errs.title = 'Task title must be at least 3 characters.';
    }

    if (!description.trim()) {
      errs.description = 'Task description is required.';
    }

    if (!dueDate) {
      errs.dueDate = 'Due date is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Prevent duplicate submission if already in flight
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        projectId,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || null,
        dueDate
      });
      // Close only on success
      onClose();
    } catch (err: any) {
      // Preserve form data on failure and display server/mock API error
      setApiError(err.message || 'Failed to submit task. Your entered data has been preserved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Create New Task'}
      ariaLabelledBy="task-modal-title"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* API Failure notification */}
        {apiError && (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            role="alert"
          >
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
        )}

        {/* Task Title */}
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Task Title *
          </label>
          <input
            id="task-title"
            ref={titleInputRef}
            type="text"
            className={`form-control ${errors.title ? 'has-error' : ''}`}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Implement OAuth login flow"
            disabled={isSubmitting}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.title}
            </span>
          )}
        </div>

        {/* Task Description */}
        <div className="form-group">
          <label htmlFor="task-description" className="form-label">
            Description *
          </label>
          <textarea
            id="task-description"
            rows={3}
            className={`form-control ${errors.description ? 'has-error' : ''}`}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Provide detail on requirements, acceptance criteria, or context..."
            disabled={isSubmitting}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.description}
            </span>
          )}
        </div>

        {/* Status & Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="task-status" className="form-label">
              Status
            </label>
            <select
              id="task-status"
              className="form-control"
              value={status}
              onChange={e => setStatus(e.target.value as TaskStatus)}
              disabled={isSubmitting}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-priority" className="form-label">
              Priority
            </label>
            <select
              id="task-priority"
              className="form-control"
              value={priority}
              onChange={e => setPriority(e.target.value as TaskPriority)}
              disabled={isSubmitting}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Assignee & Due Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="task-assignee" className="form-label">
              Assignee
            </label>
            <select
              id="task-assignee"
              className="form-control"
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Unassigned</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-due-date" className="form-label">
              Due Date *
            </label>
            <input
              id="task-due-date"
              type="date"
              className={`form-control ${errors.dueDate ? 'has-error' : ''}`}
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              disabled={isSubmitting}
              aria-invalid={!!errors.dueDate}
            />
            {errors.dueDate && (
              <span className="error-message">
                <AlertCircle size={14} /> {errors.dueDate}
              </span>
            )}
          </div>
        </div>

        {/* Modal Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...
              </>
            ) : initialData ? (
              'Save Changes'
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
