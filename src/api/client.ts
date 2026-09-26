import { Project, Task, TeamMember } from '../types';
import { mockServer } from './mockServer';

export const apiClient = {
  fetchProjects: () => mockServer.getProjects(),
  fetchProjectById: (id: string) => mockServer.getProjectById(id),
  createProject: (proj: Omit<Project, 'id' | 'createdAt'>) => mockServer.createProject(proj),
  updateProject: (id: string, updates: Partial<Project>) => mockServer.updateProject(id, updates),
  deleteProject: (id: string) => mockServer.deleteProject(id),

  fetchTasks: (projectId?: string) => mockServer.getTasks(projectId),
  fetchTaskById: (id: string) => mockServer.getTaskById(id),
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => mockServer.createTask(task),
  updateTask: (id: string, updates: Partial<Task>) => mockServer.updateTask(id, updates),
  deleteTask: (id: string) => mockServer.deleteTask(id),

  fetchTeamMembers: () => mockServer.getTeamMembers(),

  setSimulateFailure: (fail: boolean) => mockServer.setSimulateFailure(fail)
};
