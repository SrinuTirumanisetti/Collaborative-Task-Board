import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { StatCard } from '../components/dashboard/StatCard';
import { ProgressSummary } from '../components/dashboard/ProgressSummary';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { projects, teamMembers, isLoading: loadingProjects, error: projectsError } = useProjects();
  const { tasks, isLoading: loadingTasks, error: tasksError } = useTasks();

  // Derived metrics computed during render via useMemo (Section 3 & Topic 1 requirement)
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const recentProjects = [...projects]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      completionRate,
      recentProjects
    };
  }, [projects, tasks]);

  if (loadingProjects || loadingTasks) {
    return <LoadingSpinner message="Calculating dashboard statistics..." />;
  }

  if (projectsError || tasksError) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          color: '#ef4444'
        }}
      >
        <AlertTriangle size={32} style={{ marginBottom: '0.5rem' }} />
        <h3>Failed to load dashboard metrics</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          {projectsError || tasksError}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
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
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Executive Task Board
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Real-time overview of active projects, task throughput, and team velocity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/projects" className="btn btn-primary">
            <FolderKanban size={18} /> View All Projects
          </Link>
        </div>
      </div>

      {/* Grid of 5-6 Reusable Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          subtitle={`Out of ${stats.totalProjects} total projects`}
          icon={FolderKanban}
          color="#6366f1"
          trend="+2 this month"
        />

        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle="Across all workspace boards"
          icon={TrendingUp}
          color="#3b82f6"
        />

        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          subtitle={`${stats.completionRate}% completion rate`}
          icon={CheckCircle2}
          color="#10b981"
          trend={`${stats.completionRate}% Done`}
        />

        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          subtitle="Require active attention"
          icon={Clock}
          color="#f59e0b"
        />

        <StatCard
          title="High Priority"
          value={stats.highPriorityTasks}
          subtitle="Critical pending items"
          icon={AlertTriangle}
          color="#ef4444"
        />

        <StatCard
          title="Team Members"
          value={teamMembers.length}
          subtitle="Active collaborators"
          icon={Users}
          color="#8b5cf6"
        />
      </div>

      {/* Main Section: Completion chart + Recent Projects */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Progress Breakdown */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Task Distribution
          </h2>
          <ProgressSummary tasks={tasks} />
        </div>

        {/* Quick Recent Projects */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Projects</h2>
            <Link
              to="/projects"
              style={{
                fontSize: '0.85rem',
                color: 'var(--accent-primary)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              See All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.recentProjects.map(project => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const done = projectTasks.filter(t => t.status === 'Completed').length;
              const pct = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="glass-panel"
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{project.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {projectTasks.length} tasks • {done} completed
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--accent-primary)'
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
