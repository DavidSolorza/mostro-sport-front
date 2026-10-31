import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { useAuth } from './AuthContext';

const DEV_SESSION_HOURS = 8;

const toBase64Url = (value: object): string => {
  const jsonStr = JSON.stringify(value);
  let binary = '';
  for (let i = 0; i < jsonStr.length; i++) {
    binary += String.fromCharCode(jsonStr.charCodeAt(i));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const buildDevToken = (expSeconds: number): string => {
  const header = toBase64Url({ alg: 'none', typ: 'JWT' });
  const payload = toBase64Url({
    sub: '101',
    email: 'admin.dev@mostrosport.com',
    iat: Math.floor(Date.now() / 1000),
    exp: expSeconds,
    jti: 'dev-session-id',
  });
  return `${header}.${payload}.dev`;
};

export const DevLoginBypass: React.FC = () => {
  const { session, establishSession, cancelTwoFactorChallenge } = useAuth();
  const navigate = useNavigate();

  if (!import.meta.env.DEV || session) {
    return null;
  }

  const handleBypass = (): void => {
    const expSeconds = Math.floor(Date.now() / 1000) + DEV_SESSION_HOURS * 3600;
    cancelTwoFactorChallenge();
    establishSession(buildDevToken(expSeconds), new Date(expSeconds * 1000).toISOString(), 'LOCAL');
    navigate('/admin/users');
  };

  return (
    <aside className="fixed bottom-3 right-3 z-50">
      <button
        type="button"
        onClick={handleBypass}
        title="Generar sesion de prueba en entorno local"
        className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/95 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-xl backdrop-blur transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
      >
        <Terminal className="h-3.5 w-3.5 text-indigo-400" />
        <span>Entorno Dev: Acceso Rapido</span>
      </button>
    </aside>
  );
};
