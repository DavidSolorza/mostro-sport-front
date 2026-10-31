import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { authApiService } from '../application/authService';
import { PASSWORD_RULES } from '../domain/authModels';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isPasswordValid =
    PASSWORD_RULES.minLength(password) &&
    PASSWORD_RULES.hasUpper(password) &&
    PASSWORD_RULES.hasDigit(password) &&
    PASSWORD_RULES.hasSpecial(password);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isPasswordValid) {
      setError('La contraseña debe cumplir con todos los requisitos de seguridad.');
      return;
    }

    setLoading(true);
    try {
      await authApiService.register({ name: name.trim(), email: email.trim(), password });
      setSuccess('Cuenta creada exitosamente. Redirigiendo a inicio de sesion...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-xl bg-indigo-600 text-white mb-3 shadow-sm">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Crear Cuenta Corporativa</h1>
          <p className="text-xs text-slate-500 mt-1">Complete sus datos para solicitar acceso a la plataforma</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Perez"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electronico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.perez@mostrosport.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <PasswordStrengthIndicator passwordValue={password} />

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? 'Creando cuenta...' : 'Confirmar Registro'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          ¿Ya dispone de una cuenta?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Iniciar sesion
          </Link>
        </p>
      </div>
    </div>
  );
};
