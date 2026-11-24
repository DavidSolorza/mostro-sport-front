import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface BannerProps {
  message: string | null;
  onClose?: () => void;
}

export const ErrorBanner: React.FC<BannerProps> = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Cerrar" className="text-rose-500 hover:text-rose-700">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const SuccessBanner: React.FC<BannerProps> = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div role="status" className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
      <span className="flex-1">{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Cerrar" className="text-emerald-500 hover:text-emerald-700">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
