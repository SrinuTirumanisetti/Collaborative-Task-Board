import React, { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Users,
  AlertCircle,
  FolderX,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Task, FilterOptions } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useDebounce';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';
import { EmptyStates } from '../components/tasks/EmptyStates';
import { TaskModal } from '../components/tasks/TaskModal';
import { DeleteConfirmDialog } from '../components/projects/DeleteConfirmDialog';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { projects, teamMembers, isLoading: loadingProjects } = useProjects();
  const {
    tasks,
    isLoading: loadingTasks,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    triggerErrorTest
  } = useTasks(id);

  const project = useMemo(() => projects.find(p => p.id === id), [projects, id]);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    statusFilter: 'All',
    priorityFilter: 'All',
    assigneeFilter: 'All',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  // Debounced search term for performance optimization (Section 4 & 10)
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Memoized task filtering & sorting pipeline (Topic 1 & Section 10 performance requirement)
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Debounced Title / Description Search
        if (debouncedSearchTerm.trim()) {
          const query = debouncedSearchTerm.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }

        // Status filter
        if (filters.statusFilter !== 'All' && task.status !== filters.statusFilter) {
          return false;
        }

        // Priority filter
        if (filters.priorityFilter !== 'All' && task.priority !== filters.priorityFilter) {
          return false;
        }

        // Assignee filter
        if (filters.assigneeFilter !== 'All' && task.assigneeId !== filters.assigneeFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (filters.sortBy === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'priority') {
          const weight = { High: 3, Medium: 2, Low: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (filters.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, debouncedSearchTerm, filters.statusFilter, filters.priorityFilter, filters.assigneeFilter, filters.sortBy]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm.trim() !== '' ||
      filters.statusFilter !== 'All' ||
      filters.priorityFilter !== 'All' ||
      filters.assigneeFilter !== 'All'
    );
  }, [filters]);

  const handleFilterChange = (updates: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'All',
      priorityFilter: 'All',
      assigneeFilter: 'All',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    });
  };

  // Handlers with useCallback for stable references to TaskRow (Section 10 memoization)
  const handleToggleStatus = useCallback(
    async (task: Task) => {
      const nextStatus: Task['status'] =
        task.status === 'Completed' ? 'Todo' : task.status === 'Todo' ? 'In Progress' : 'Completed';
      await updateTask(task.id, { status: nextStatus });
    },
    [updateTask]
  );

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const handleOpenDeleteModal = useCallback((task: Task) => {
    setDeletingTask(task);
  }, []);

  const handleTaskModalSubmit = async (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> | Partial<Task>
  ) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  if (loadingProjects || loadingTasks) {
    return <LoadingSpinner message="Loading project tasks board..." />;
  }

  // Section 13 Invalid Project ID handling
  if (!project) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          marginTop: '2rem'
        }}
      >
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444'
          }}
        >
          <FolderX size={48} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Project Not Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem' }}>
            The project with ID "<code>{id}</code>" does not exist or may have been deleted.
          </p>
        </div>
        <Link to="/projects" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Projects List
        </Link>
      </div>
    );
  }

  // Project team members
  const projectMembers = teamMembers.filter(m => project.teamMemberIds.includes(m.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back button & header */}
      <div>
        <Link
          to="/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            marginBottom: '0.75rem',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> All Projects
        </Link>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {project.name}
              </h1>
              <span className={`badge ${project.status === 'Active' ? 'badge-in-progress' : 'badge-completed'}`}>
                {project.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '750px' }}>
              {project.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={triggerErrorTest}
              title="Simulate API task failure"
            >
              <RefreshCw size={16} /> Simulate Task Error
            </button>
            <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
              <Plus size={18} /> New Task
            </button>
          </div>
        </div>

        {/* Project Meta Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={15} />
            <span>Target Due: {project.dueDate}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={15} />
            <span>Team ({projectMembers.length}): {projectMembers.map(m => m.name.split(' ')[0]).join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Task Filters & Search */}
      <TaskFilters
        filters={filters}
        teamMembers={projectMembers}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalResultsCount={filteredAndSortedTasks.length}
      />

      {/* Error Notice */}
      {tasksError && (
        <div
          className="glass-panel"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '4px solid #ef4444',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          role="alert"
        >
          <AlertCircle size={20} />
          <span>{tasksError}</span>
        </div>
      )}

      {/* Tasks View logic: Empty states or List */}
      {tasks.length === 0 ? (
        <EmptyStates type="no-tasks" onCreateTask={handleOpenCreateModal} />
      ) : filteredAndSortedTasks.length === 0 ? (
        filters.searchTerm.trim() ? (
          <EmptyStates
            type="no-search-results"
            searchTerm={filters.searchTerm}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <EmptyStates type="no-filter-results" onClearFilters={handleClearFilters} />
        )
      ) : (
        <TaskList
          tasks={filteredAndSortedTasks}
          teamMembers={teamMembers}
          onToggleStatus={handleToggleStatus}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      )}

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskModalSubmit}
        initialData={editingTask}
        projectId={project.id}
        teamMembers={projectMembers}
      />

      {/* Delete Task Confirmation */}
      {deletingTask && (
        <DeleteConfirmDialog
          isOpen={!!deletingTask}
          title="Delete Task"
          message={`Are you sure you want to delete "${deletingTask.title}"? This operation cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};
