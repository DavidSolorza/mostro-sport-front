import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogIn, AlertCircle, Globe, Github } from 'lucide-react';
import { authApiService } from '../application/authService';
import { AuthProviderType, useAuth } from '../../../core/auth/AuthContext';
import { ENV_CONFIG } from '../../../core/config/env';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { establishSession, startTwoFactorChallenge } = useAuth();
  const navigate = useNavigate();

  const handleCredentialsLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authApiService.login({ email: email.trim(), password });
      const twoFactorMap = JSON.parse(
        localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED) || '{}'
      );
      const needs2FA = Boolean(response.requiresTwoFactor || twoFactorMap[email.trim()]);

      if (needs2FA) {
        startTwoFactorChallenge(email.trim(), response.accessToken, response.expiresAt);
        navigate('/verify-2fa');
        return;
      }

      establishSession(response.accessToken, response.expiresAt, 'LOCAL');
      navigate('/admin/users');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciales inválidas o cuenta deshabilitada.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: Exclude<AuthProviderType, 'LOCAL'>): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const res = await authApiService.loginWithOAuth(provider, email.trim() || undefined);
      establishSession(res.accessToken, res.expiresAt, provider);
      navigate('/admin/users');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? `${err.message} (Verifica que el endpoint /api/auth/oauth/${provider.toLowerCase()} esté habilitado en el servidor y que el correo no pertenezca a una cuenta manual).`
          : `Error al autenticar con ${provider}.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-xl bg-indigo-600 text-white mb-3 shadow-md">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Iniciar Sesión (HU-SE-08)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ingresa con tus credenciales o proveedor externo de identidad
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mostrosport.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Contraseña</label>
              <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? 'Validando...' : 'Ingresar con Credenciales'}</span>
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">O continuar con OAuth2</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthLogin('GOOGLE')}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Globe className="h-4 w-4 text-rose-500" />
            <span>Google</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthLogin('GITHUB')}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Github className="h-4 w-4 text-slate-900" />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthLogin('MICROSOFT')}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Globe className="h-4 w-4 text-sky-600" />
            <span>Microsoft</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          ¿Eres nuevo usuario con credenciales?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Crear cuenta (HU-SE-07)
          </Link>
        </p>
      </div>
    </div>
  );
};

