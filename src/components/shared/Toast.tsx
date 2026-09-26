import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={20} color="#10b981" />,
    error: <AlertCircle size={20} color="#ef4444" />,
    info: <Info size={20} color="#3b82f6" />
  };

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)',
    info: 'rgba(59, 130, 246, 0.1)'
  };

  const borderColors = {
    success: 'rgba(16, 185, 129, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
    info: 'rgba(59, 130, 246, 0.3)'
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: `4px solid ${
          toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6'
        }`,
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        minWidth: '300px',
        maxWidth: '420px',
        animation: 'slideInRight 200ms ease-out'
      }}
      role="alert"
    >
      <div style={{ marginTop: '2px' }}>{icons[toast.type]}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toast.title}</h4>
        {toast.message && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        className="btn btn-ghost"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss toast notification"
        style={{ padding: '0.2rem' }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
