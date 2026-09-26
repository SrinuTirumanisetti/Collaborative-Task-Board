import { useTasksContext } from '../context/TasksContext';

export function useTasks(projectId?: string) {
  const context = useTasksContext();

  const filteredByProject = projectId
    ? context.tasks.filter(t => t.projectId === projectId)
    : context.tasks;

  return {
    tasks: filteredByProject,
    allTasks: context.tasks,
    isLoading: context.isLoading,
    error: context.error,
    refetchTasks: context.refetchTasks,
    createTask: context.createTask,
    updateTask: context.updateTask,
    deleteTask: context.deleteTask,
    triggerErrorTest: context.triggerErrorTest
  };
}
