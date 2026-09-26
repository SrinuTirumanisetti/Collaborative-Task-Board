import { ALL_INITIAL_TASKS, INITIAL_PROJECTS, INITIAL_TEAM_MEMBERS } from '../data/seed';
import { Project, Task, TeamMember } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'taskflow_projects_v1',
  TASKS: 'taskflow_tasks_v1',
  SIMULATE_FAILURES: 'taskflow_simulate_failures'
};

// Helper for simulated delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get or init stored data
function getStoredProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read projects from storage', e);
  }
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  return INITIAL_PROJECTS;
}

function getStoredTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read tasks from storage', e);
  }
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(ALL_INITIAL_TASKS));
  return ALL_INITIAL_TASKS;
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

// Global failure toggle state
let shouldFailNextRequest = false;

export const mockServer = {
  setSimulateFailure(fail: boolean) {
    shouldFailNextRequest = fail;
  },

  async getProjects(): Promise<Project[]> {
    await delay(250);
    if (shouldFailNextRequest) {
      shouldFailNextRequest = false;
      throw new Error('Simulated Server Error (500): Failed to load projects from server.');
    }
    return getStoredProjects();
  },

  async getProjectById(id: string): Promise<Project> {
    await delay(200);
    const projects = getStoredProjects();
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error(`Project with ID "${id}" was not found.`);
    }
    return project;
  },

  async createProject(newProj: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    await delay(350);
    if (shouldFailNextRequest) {
      shouldFailNextRequest = false;
      throw new Error('Network Failure: Unable to save new project.');
    }
    const projects = getStoredProjects();
    const created: Project = {
      ...newProj,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [created, ...projects];
    saveProjects(updated);
    return created;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await delay(300);
    const projects = getStoredProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error(`Project "${id}" not found.`);
    const updatedProject = { ...projects[idx], ...updates };
    projects[idx] = updatedProject;
    saveProjects(projects);
    return updatedProject;
  },

  async deleteProject(id: string): Promise<string> {
    await delay(300);
    const projects = getStoredProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveProjects(filtered);
    // Also cleanup tasks belonging to deleted project
    const tasks = getStoredTasks().filter(t => t.projectId !== id);
    saveTasks(tasks);
    return id;
  },

  async getTasks(projectId?: string): Promise<Task[]> {
    await delay(250);
    if (shouldFailNextRequest) {
      shouldFailNextRequest = false;
      throw new Error('Simulated Network Error (503): Service temporarily unavailable.');
    }
    const tasks = getStoredTasks();
    if (projectId) {
      return tasks.filter(t => t.projectId === projectId);
    }
    return tasks;
  },

  async getTaskById(id: string): Promise<Task> {
    await delay(200);
    const tasks = getStoredTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with ID "${id}" not found.`);
    }
    return task;
  },

  async createTask(newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await delay(400);
    if (shouldFailNextRequest) {
      shouldFailNextRequest = false;
      throw new Error('Simulated API Failure: Task creation failed due to database timeout.');
    }
    const tasks = getStoredTasks();
    const created: Task = {
      ...newTask,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedList = [created, ...tasks];
    saveTasks(updatedList);
    return created;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay(300);
    if (shouldFailNextRequest) {
      shouldFailNextRequest = false;
      throw new Error('Update Failed: Conflict error while modifying task status.');
    }
    const tasks = getStoredTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Task "${id}" not found.`);
    const updatedTask = {
      ...tasks[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    tasks[idx] = updatedTask;
    saveTasks(tasks);
    return updatedTask;
  },

  async deleteTask(id: string): Promise<string> {
    await delay(300);
    const tasks = getStoredTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
    return id;
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    await delay(150);
    return INITIAL_TEAM_MEMBERS;
  }
};
