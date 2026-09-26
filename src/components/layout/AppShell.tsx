import React from 'react';
import { NavBar } from './NavBar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main
        style={{
          flex: 1,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </main>
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <p>© 2026 Collaborative Task Board. Built with React 18, TypeScript & Vite.</p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
            <span>⚡ Virtualized rendering ready</span>
            <span>•</span>
            <span>♿ WCAG Accessible</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
