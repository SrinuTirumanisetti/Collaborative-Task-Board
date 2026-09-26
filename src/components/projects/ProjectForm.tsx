import React, { useState } from 'react';
import { Project, ProjectStatus, TeamMember } from '../../types';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ProjectFormProps {
  initialData?: Project | null;
  teamMembers: TeamMember[];
  onSubmit: (data: Omit<Project, 'id' | 'createdAt'> | Partial<Project>) => Promise<void>;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  teamMembers,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(initialData?.status || 'Active');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [ownerId, setOwnerId] = useState(initialData?.ownerId || teamMembers[0]?.id || 'm1');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    initialData?.teamMemberIds || [teamMembers[0]?.id || 'm1']
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Project name is required.';
    if (!description.trim()) errs.description = 'Description is required.';
    if (!dueDate) errs.dueDate = 'Due date is required.';
    if (selectedMembers.length === 0) errs.teamMembers = 'Select at least one team member.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        description,
        status,
        dueDate,
        ownerId,
        teamMemberIds: selectedMembers
      });
    } catch (err: any) {
      setApiError(err.message || 'Failed to save project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMember = (id: string) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
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

      {/* Project Name */}
      <div className="form-group">
        <label htmlFor="project-name" className="form-label">
          Project Name *
        </label>
        <input
          id="project-name"
          type="text"
          className={`form-control ${errors.name ? 'has-error' : ''}`}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. NextGen Web Platform"
          disabled={isSubmitting}
        />
        {errors.name && (
          <span className="error-message">
            <AlertCircle size={14} /> {errors.name}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="project-description" className="form-label">
          Description *
        </label>
        <textarea
          id="project-description"
          rows={3}
          className={`form-control ${errors.description ? 'has-error' : ''}`}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Outline the scope and objectives of this project..."
          disabled={isSubmitting}
        />
        {errors.description && (
          <span className="error-message">
            <AlertCircle size={14} /> {errors.description}
          </span>
        )}
      </div>

      {/* Status & Due Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="project-status" className="form-label">
            Status
          </label>
          <select
            id="project-status"
            className="form-control"
            value={status}
            onChange={e => setStatus(e.target.value as ProjectStatus)}
            disabled={isSubmitting}
          >
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="project-dueDate" className="form-label">
            Target Due Date *
          </label>
          <input
            id="project-dueDate"
            type="date"
            className={`form-control ${errors.dueDate ? 'has-error' : ''}`}
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.dueDate && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.dueDate}
            </span>
          )}
        </div>
      </div>

      {/* Owner */}
      <div className="form-group">
        <label htmlFor="project-owner" className="form-label">
          Project Lead / Owner
        </label>
        <select
          id="project-owner"
          className="form-control"
          value={ownerId}
          onChange={e => setOwnerId(e.target.value)}
          disabled={isSubmitting}
        >
          {teamMembers.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.role})
            </option>
          ))}
        </select>
      </div>

      {/* Team Members */}
      <div className="form-group">
        <span className="form-label">Assign Team Members *</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
          {teamMembers.map(m => {
            const isSelected = selectedMembers.includes(m.id);
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => toggleMember(m.id)}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                disabled={isSubmitting}
              >
                {m.name}
              </button>
            );
          })}
        </div>
        {errors.teamMembers && (
          <span className="error-message">
            <AlertCircle size={14} /> {errors.teamMembers}
          </span>
        )}
      </div>

      {/* Form Buttons */}
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
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...
            </>
          ) : initialData ? (
            'Update Project'
          ) : (
            'Create Project'
          )}
        </button>
      </div>
    </form>
  );
};
