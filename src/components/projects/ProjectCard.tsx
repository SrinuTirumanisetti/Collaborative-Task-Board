import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { Project, Task, TeamMember } from '../../types';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  teamMembers: TeamMember[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  teamMembers,
  onEdit,
  onDelete
}) => {
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const owner = teamMembers.find(m => m.id === project.ownerId);
  const members = teamMembers.filter(m => project.teamMemberIds.includes(m.id));

  const statusBadgeClass =
    project.status === 'Active'
      ? 'badge-in-progress'
      : project.status === 'Completed'
      ? 'badge-completed'
      : 'badge-todo';

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.25rem',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '0.75rem'
          }}
        >
          <span className={`badge ${statusBadgeClass}`}>{project.status}</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onEdit(project)}
              aria-label={`Edit project ${project.name}`}
              title="Edit Project"
              style={{ padding: '0.35rem' }}
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onDelete(project)}
              aria-label={`Delete project ${project.name}`}
              title="Delete Project"
              style={{ padding: '0.35rem', color: '#ef4444' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <Link
          to={`/projects/${project.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}
          >
            {project.name}
          </h3>
        </Link>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}
        >
          {project.description}
        </p>
      </div>

      <div>
        {/* Progress bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.35rem'
            }}
          >
            <span>Progress ({completedTasks}/{totalTasks} tasks)</span>
            <span style={{ fontWeight: 600 }}>{progressPct}%</span>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                backgroundColor:
                  progressPct === 100 ? 'var(--status-completed)' : 'var(--accent-primary)',
                transition: 'width var(--transition-normal)'
              }}
            />
          </div>
        </div>

        {/* Footer info & open button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} />
            <span>Due {project.dueDate}</span>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            View Board <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
