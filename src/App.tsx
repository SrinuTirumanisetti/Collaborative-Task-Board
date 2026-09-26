import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PreferencesProvider } from './context/PreferencesContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { TasksProvider } from './context/TasksContext';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { Dashboard } from './routes/Dashboard';
import { Projects } from './routes/Projects';
import { ProjectDetail } from './routes/ProjectDetail';
import { Settings } from './routes/Settings';
import { NotFound } from './routes/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <ProjectsProvider>
          <TasksProvider>
            <AppShell>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </AppShell>
          </TasksProvider>
        </ProjectsProvider>
      </PreferencesProvider>
    </BrowserRouter>
  );
};

export default App;
