import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, FolderKanban } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        marginTop: '2rem'
      }}
    >
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          color: 'var(--accent-primary)',
          animation: 'pulse 2s infinite'
        }}
      >
        <Compass size={56} />
      </div>

      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          background: 'var(--accent-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        404 - Page Not Found
      </h1>

      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '1rem' }}>
        The page or route you requested does not exist or has been moved. Use the options below to return to safety.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Go to Dashboard
        </Link>
        <Link to="/projects" className="btn btn-secondary">
          <FolderKanban size={18} /> View Projects
        </Link>
      </div>
    </div>
  );
};
