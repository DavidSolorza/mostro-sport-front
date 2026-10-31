import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../core/auth/AuthContext';

export const VerifyTwoFactorPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { pendingTwoFactorEmail, completeTwoFactorChallenge, cancelTwoFactorChallenge } = useAuth();
  const navigate = useNavigate();

  if (!pendingTwoFactorEmail) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) {
      setError('El código de verificación debe contener exactamente 6 dígitos numéricos.');
      return;
    }
    setLoading(true);
    try {
      await completeTwoFactorChallenge(code.trim());
      navigate('/admin/users');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código 2FA inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    cancelTwoFactorChallenge();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-xl bg-amber-500 text-white mb-3 shadow-md">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Verificación en Dos Pasos (HU-SE-10)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ingresa el código temporal enviado a{' '}
            <span className="font-semibold text-slate-700">{pendingTwoFactorEmail}</span>.
            Tu sesión permanecerá bloqueada hasta completar este paso.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Código de Verificación (6 dígitos)
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] text-lg font-mono rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{loading ? 'Verificando código...' : 'Confirmar Segundo Factor'}</span>
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <XCircle className="h-4 w-4 text-rose-500" />
            <span>Cancelar proceso y volver al Login</span>
          </button>
        </form>
      </div>
    </div>
  );
};

