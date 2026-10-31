import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApiService } from '../application/authService';
import { PASSWORD_RULES } from '../domain/authModels';

export const PasswordRecoveryPage: React.FC = () => {
  const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await authApiService.requestPasswordRecovery({ email: email.trim() });
      setMessage(res.message || 'Se ha enviado un código/token temporal a tu correo.');
      setStep('RESET');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo procesar la solicitud. Recuerda que cuentas OAuth no recuperan contraseña aquí.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!PASSWORD_RULES.isValid(newPassword)) {
      setError('La nueva contraseña debe tener mayúscula, minúscula, número y símbolo (@$!%*?&).');
      return;
    }
    setLoading(true);
    try {
      const res = await authApiService.resetPassword({ token: token.trim(), newPassword });
      setMessage(res.message || 'Contraseña actualizada y sesiones previas invalidadas.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Token inválido, expirado o ya utilizado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-xl bg-indigo-600 text-white mb-3">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Recuperar Contraseña (HU-SE-09)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Disponible únicamente para cuentas con correo y contraseña propios (No aplica a Google/GitHub/Microsoft)
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-1 mb-5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setStep('REQUEST')}
            className={`flex-1 py-1.5 rounded-md ${
              step === 'REQUEST' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
            }`}
          >
            1. Solicitar Token
          </button>
          <button
            type="button"
            onClick={() => setStep('RESET')}
            className={`flex-1 py-1.5 rounded-md ${
              step === 'RESET' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
            }`}
          >
            2. Nueva Contraseña
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {step === 'REQUEST' ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico Asociado
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.com"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Enviando solicitud...' : 'Generar Mecanismo Temporal'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Token Temporal de Recuperación
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Ingresa el código o token temporal"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nueva Contraseña Segura
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Establecer Nueva Contraseña'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Volver al Inicio de Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

