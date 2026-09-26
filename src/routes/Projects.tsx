import React, { useState } from 'react';
import { Plus, FolderPlus, AlertCircle, RefreshCw } from 'lucide-react';
import { Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { DeleteConfirmDialog } from '../components/projects/DeleteConfirmDialog';
import { Modal } from '../components/shared/Modal';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

export const Projects: React.FC = () => {
  const {
    projects,
    teamMembers,
    isLoading: loadingProjects,
    error: projectsError,
    createProject,
    updateProject,
    deleteProject,
    triggerErrorTest
  } = useProjects();

  const { tasks, isLoading: loadingTasks } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Project, 'id' | 'createdAt'> | Partial<Project>) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await createProject(data as Omit<Project, 'id' | 'createdAt'>);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deletingProject) {
      await deleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  if (loadingProjects || loadingTasks) {
    return <LoadingSpinner message="Loading workspace projects..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)'
            }}
          >
            Project Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Overview of active projects, assigned leads, team allocations, and milestone deadlines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={triggerErrorTest}
            title="Simulate API 500 error for Section 8 testing"
          >
            <RefreshCw size={16} /> Simulate Server Error
          </button>
          <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      {/* API Error state notice */}
      {projectsError && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ef4444'
          }}
          role="alert"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={22} />
            <div>
              <h4 style={{ fontWeight: 600 }}>API Error Encountered</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{projectsError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 1.5rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <FolderPlus size={48} color="var(--accent-primary)" />
          <h3>No Projects Created</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Get started by adding your team's first project board.
          </p>
          <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={18} /> Create Project
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasks}
              teamMembers={teamMembers}
              onEdit={handleOpenEditModal}
              onDelete={p => setDeletingProject(p)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm
          initialData={editingProject}
          teamMembers={teamMembers}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      {deletingProject && (
        <DeleteConfirmDialog
          isOpen={!!deletingProject}
          title="Delete Project"
          message={`Are you sure you want to delete "${deletingProject.name}"? All associated tasks will be permanently removed.`}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingProject(null)}
        />
      )}
    </div>
  );
};
