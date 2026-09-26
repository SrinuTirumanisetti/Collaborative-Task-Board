import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'var(--accent-primary)',
  trend
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {title}
        </span>
        <div
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: `${color}18`,
            color: color
          }}
        >
          <Icon size={22} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)'
          }}
        >
          {value}
        </span>
        {trend && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              padding: '0.1rem 0.4rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</span>
      )}
    </div>
  );
};
