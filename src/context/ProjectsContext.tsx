import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Project, TeamMember } from '../types';
import { apiClient } from '../api/client';

interface ProjectsState {
  projects: Project[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { projects: Project[]; teamMembers: TeamMember[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string };

const initialState: ProjectsState = {
  projects: [],
  teamMembers: [],
  isLoading: true,
  error: null
};

function projectsReducer(state: ProjectsState, action: Action): ProjectsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        projects: action.payload.projects,
        teamMembers: action.payload.teamMembers,
        error: null
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => (p.id === action.payload.id ? action.payload : p))
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload)
      };
    default:
      return state;
  }
}

interface ProjectsContextType extends ProjectsState {
  refetchProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  triggerErrorTest: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectsReducer, initialState);

  const loadData = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const [projects, teamMembers] = await Promise.all([
        apiClient.fetchProjects(),
        apiClient.fetchTeamMembers()
      ]);
      dispatch({ type: 'FETCH_SUCCESS', payload: { projects, teamMembers } });
    } catch (err: any) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Failed to fetch projects.' });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createProject = async (newProj: Omit<Project, 'id' | 'createdAt'>) => {
    const created = await apiClient.createProject(newProj);
    dispatch({ type: 'ADD_PROJECT', payload: created });
    return created;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updated = await apiClient.updateProject(id, updates);
    dispatch({ type: 'UPDATE_PROJECT', payload: updated });
    return updated;
  };

  const deleteProject = async (id: string) => {
    await apiClient.deleteProject(id);
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  const triggerErrorTest = () => {
    apiClient.setSimulateFailure(true);
    loadData();
  };

  return (
    <ProjectsContext.Provider
      value={{
        ...state,
        refetchProjects: loadData,
        createProject,
        updateProject,
        deleteProject,
        triggerErrorTest
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export function useProjectsContext() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
}
