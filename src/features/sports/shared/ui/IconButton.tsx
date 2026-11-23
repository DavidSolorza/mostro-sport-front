import React from 'react';

interface IconButtonProps {
  title: string;
  icon: React.ElementType;
  onClick: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ title, icon: Icon, onClick, tone = 'default', disabled }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    disabled={disabled}
    className={`p-1.5 rounded-md text-slate-500 transition-colors disabled:opacity-40 disabled:pointer-events-none ${
      tone === 'danger' ? 'hover:text-rose-600 hover:bg-rose-50' : 'hover:text-indigo-600 hover:bg-slate-100'
    }`}
  >
    <Icon className="h-4 w-4" />
  </button>
);
