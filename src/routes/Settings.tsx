import React from 'react';
import { Sun, Moon, LayoutGrid, List, Check, RotateCcw } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export const Settings: React.FC = () => {
  const { preferences, toggleTheme, setLayout, setTaskDisplay, setPreferences } = usePreferences();

  const handleResetPreferences = () => {
    setPreferences({
      theme: 'dark',
      layout: 'comfortable',
      taskDisplay: 'list'
    });
  };

  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)'
          }}
        >
          Preferences & Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Customize your workspace theme, density, and display choices. Settings persist automatically across sessions.
        </p>
      </div>

      {/* Theme Settings */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Color Theme
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Choose between dark mode or light mode appearance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            className={`glass-panel ${preferences.theme === 'dark' ? 'active-pref' : ''}`}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: `2px solid ${preferences.theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)'
              }}
            >
              <Moon size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Dark Mode</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Default sleek dark theme</span>
            </div>
            {preferences.theme === 'dark' && <Check size={20} color="var(--accent-primary)" />}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`glass-panel ${preferences.theme === 'light' ? 'active-pref' : ''}`}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: `2px solid ${preferences.theme === 'light' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b'
              }}
            >
              <Sun size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Light Mode</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High contrast light theme</span>
            </div>
            {preferences.theme === 'light' && <Check size={20} color="var(--accent-primary)" />}
          </button>
        </div>
      </div>

      {/* Layout Density */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Layout Density
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Control button padding and list row height.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => setLayout('comfortable')}
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: `2px solid ${preferences.layout === 'comfortable' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Comfortable</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standard spacing</span>
            </div>
            {preferences.layout === 'comfortable' && <Check size={18} color="var(--accent-primary)" />}
          </button>

          <button
            type="button"
            onClick={() => setLayout('compact')}
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: `2px solid ${preferences.layout === 'compact' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Compact</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High-density view</span>
            </div>
            {preferences.layout === 'compact' && <Check size={18} color="var(--accent-primary)" />}
          </button>
        </div>
      </div>

      {/* Reset Defaults */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={handleResetPreferences}>
          <RotateCcw size={16} /> Reset to Defaults
        </button>
      </div>
    </div>
  );
};
