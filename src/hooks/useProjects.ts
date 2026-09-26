import { useProjectsContext } from '../context/ProjectsContext';

export function useProjects() {
  const context = useProjectsContext();

  const getProjectStats = (projectId?: string) => {
    // Stat calculation helper
    const project = projectId ? context.projects.find(p => p.id === projectId) : null;
    return {
      project,
      totalProjects: context.projects.length,
      activeProjects: context.projects.filter(p => p.status === 'Active').length,
      completedProjects: context.projects.filter(p => p.status === 'Completed').length,
      onHoldProjects: context.projects.filter(p => p.status === 'On Hold').length
    };
  };

  return {
    projects: context.projects,
    teamMembers: context.teamMembers,
    isLoading: context.isLoading,
    error: context.error,
    refetchProjects: context.refetchProjects,
    createProject: context.createProject,
    updateProject: context.updateProject,
    deleteProject: context.deleteProject,
    getProjectStats,
    triggerErrorTest: context.triggerErrorTest
  };
}
