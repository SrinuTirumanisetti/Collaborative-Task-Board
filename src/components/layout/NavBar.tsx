import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  Sun,
  Moon,
  Kanban,
  Menu,
  X
} from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';

export const NavBar: React.FC = () => {
  const { preferences, toggleTheme } = usePreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'all var(--transition-normal)'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo */}
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: 'var(--text-primary)'
          }}
        >
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Kanban size={22} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              TaskFlow Pro
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                display: 'block',
                marginTop: '-3px'
              }}
            >
              Collaborative Task Board
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          className="desktop-nav"
        >
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={({ isActive }) => ({
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem'
                })}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={toggleTheme}
            aria-label={`Switch to ${preferences.theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${preferences.theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ padding: '0.5rem' }}
          >
            {preferences.theme === 'dark' ? (
              <Sun size={20} style={{ color: '#f59e0b' }} />
            ) : (
              <Moon size={20} style={{ color: '#6366f1' }} />
            )}
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="btn btn-ghost mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{ padding: '0.5rem' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
          className="mobile-nav"
        >
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: inline-flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
};
