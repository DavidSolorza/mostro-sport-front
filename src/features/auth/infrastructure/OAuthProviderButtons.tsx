import React from 'react';
import { Globe, Github } from 'lucide-react';
import { AuthProviderType } from '../../../core/auth/AuthContext';

interface OAuthProviderButtonsProps {
  loading: boolean;
  onSelectProvider: (provider: Exclude<AuthProviderType, 'LOCAL'>) => void;
}

export const OAuthProviderButtons: React.FC<OAuthProviderButtonsProps> = ({
  loading,
  onSelectProvider,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <button
        type="button"
        disabled={loading}
        onClick={() => onSelectProvider('GOOGLE')}
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
      >
        <Globe className="h-3.5 w-3.5 text-rose-500" />
        <span>Google</span>
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => onSelectProvider('GITHUB')}
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
      >
        <Github className="h-3.5 w-3.5 text-slate-900" />
        <span>GitHub</span>
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => onSelectProvider('MICROSOFT')}
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
      >
        <Globe className="h-3.5 w-3.5 text-sky-600" />
        <span>Microsoft</span>
      </button>
    </div>
  );
};

