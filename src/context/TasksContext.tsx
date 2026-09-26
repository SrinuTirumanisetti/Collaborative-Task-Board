import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { apiClient } from '../api/client';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string };

const initialState: TasksState = {
  tasks: [],
  isLoading: true,
  error: null
};

function tasksReducer(state: TasksState, action: Action): TasksState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, tasks: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t))
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      };
    default:
      return state;
  }
}

interface TasksContextType extends TasksState {
  refetchTasks: (projectId?: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  triggerErrorTest: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const loadTasks = useCallback(async (projectId?: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await apiClient.fetchTasks(projectId);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err: any) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Failed to fetch tasks.' });
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await apiClient.createTask(newTask);
    dispatch({ type: 'ADD_TASK', payload: created });
    return created;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updated = await apiClient.updateTask(id, updates);
    dispatch({ type: 'UPDATE_TASK', payload: updated });
    return updated;
  };

  const deleteTask = async (id: string) => {
    await apiClient.deleteTask(id);
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const triggerErrorTest = () => {
    apiClient.setSimulateFailure(true);
    loadTasks();
  };

  return (
    <TasksContext.Provider
      value={{
        ...state,
        refetchTasks: loadTasks,
        createTask,
        updateTask,
        deleteTask,
        triggerErrorTest
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
}
