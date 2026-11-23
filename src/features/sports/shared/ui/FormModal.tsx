import React from 'react';
import { X } from 'lucide-react';
import { ErrorBanner } from './ErrorBanner';

interface FormModalProps {
  title: string;
  submitLabel: string;
  loading: boolean;
  error?: string | null;
  size?: 'md' | 'lg';
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
  title,
  submitLabel,
  loading,
  error,
  size = 'md',
  onClose,
  onSubmit,
  children,
}) => {
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div
        className={`w-full ${size === 'lg' ? 'max-w-lg' : 'max-w-md'} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <ErrorBanner message={error ?? null} />
          {children}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
