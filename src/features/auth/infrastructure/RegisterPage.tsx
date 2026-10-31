import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { authApiService } from '../application/authService';
import { PASSWORD_RULES } from '../domain/authModels';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const rules = [
    { label: 'Entre 8 y 72 caracteres', ok: PASSWORD_RULES.minLength(password) },
    { label: 'Al menos una letra minúscula (a-z)', ok: PASSWORD_RULES.hasLower(password) },
    { label: 'Al menos una letra mayúscula (A-Z)', ok: PASSWORD_RULES.hasUpper(password) },
    { label: 'Al menos un número (0-9)', ok: PASSWORD_RULES.hasDigit(password) },
    { label: 'Un carácter especial (@$!%*?&)', ok: PASSWORD_RULES.hasSpecial(password) },
    { label: 'Sin espacios en blanco', ok: PASSWORD_RULES.noSpaces(password) && password.length > 0 },
  ];

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!PASSWORD_RULES.isValid(password)) {
      setError('La contraseña no cumple todas las condiciones de seguridad del sistema.');
      return;
    }

    setLoading(true);
    try {
      await authApiService.register({ name: name.trim(), email: email.trim(), password });
      setSuccess('Cuenta creada exitosamente. Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al registrar la cuenta. Verifica si el correo ya existe.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-xl bg-indigo-600 text-white mb-3">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Registro Manual (HU-SE-07)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Exclusivo para autenticación tradicional (usuarios OAuth no requieren registro manual)
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico Único
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@correo.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
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
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
            />
            <ul className="mt-2.5 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {rules.map((r) => (
                <li
                  key={r.label}
                  className={`flex items-center gap-2 text-xs ${
                    r.ok ? 'text-emerald-600 font-medium' : 'text-slate-500'
                  }`}
                >
                  {r.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                  <span>{r.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

