import React, { createContext, useContext, useEffect } from 'react';
import { Preferences } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PreferencesContextType {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
  toggleTheme: () => void;
  setLayout: (layout: 'compact' | 'comfortable') => void;
  setTaskDisplay: (display: 'list' | 'board') => void;
}

const defaultPreferences: Preferences = {
  theme: 'dark',
  layout: 'comfortable',
  taskDisplay: 'list'
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useLocalStorage<Preferences>(
    'taskflow_user_preferences',
    defaultPreferences
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preferences.theme);
    document.documentElement.setAttribute('data-layout', preferences.layout);
  }, [preferences.theme, preferences.layout]);

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const setLayout = (layout: 'compact' | 'comfortable') => {
    setPreferences(prev => ({ ...prev, layout }));
  };

  const setTaskDisplay = (taskDisplay: 'list' | 'board') => {
    setPreferences(prev => ({ ...prev, taskDisplay }));
  };

  return (
    <PreferencesContext.Provider
      value={{ preferences, setPreferences, toggleTheme, setLayout, setTaskDisplay }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
