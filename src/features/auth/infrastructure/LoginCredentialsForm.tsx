import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { LoginRequestDTO } from '../domain/authModels';

interface LoginCredentialsFormProps {
  loading: boolean;
  error: string | null;
  onSubmit: (dto: LoginRequestDTO) => Promise<void>;
}

export const LoginCredentialsForm: React.FC<LoginCredentialsFormProps> = ({
  loading,
  error,
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSubmit({ email: email.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electronico</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@mostrosport.com"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-700">Contraseña</label>
          <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:underline">
            ¿Olvido su contraseña?
          </Link>
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        <LogIn className="h-4 w-4" />
        <span>{loading ? 'Validando credenciales...' : 'Ingresar al Sistema'}</span>
      </button>
    </form>
  );
};

