import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="var(--status-hadir)" />,
    error: <AlertCircle size={18} color="var(--status-sakit)" />,
    info: <Info size={18} color="var(--accent-secondary)" />
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-glass)',
      borderRadius: '12px',
      padding: '0.9rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      color: '#fff',
      animation: 'fadeIn 0.25s ease-out',
      maxWidth: '400px'
    }}>
      {icons[toast.type] || icons.info}
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', marginLeft: 'auto', display: 'flex' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
