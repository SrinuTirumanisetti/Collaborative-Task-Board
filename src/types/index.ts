export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type ProjectStatus = 'Active' | 'On Hold' | 'Completed';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  dueDate: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: ProjectStatus;
  dueDate: string;
  teamMemberIds: string[];
  createdAt: string;
}

export interface Preferences {
  theme: 'light' | 'dark';
  layout: 'compact' | 'comfortable';
  taskDisplay: 'list' | 'board';
}

export interface FilterOptions {
  searchTerm: string;
  statusFilter: TaskStatus | 'All';
  priorityFilter: TaskPriority | 'All';
  assigneeFilter: string | 'All';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
