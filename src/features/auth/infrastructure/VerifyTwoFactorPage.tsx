import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../core/auth/AuthContext';

export const VerifyTwoFactorPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { pendingTwoFactorEmail, completeTwoFactorChallenge, cancelTwoFactorChallenge } = useAuth();
  const navigate = useNavigate();

  if (!pendingTwoFactorEmail) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) {
      setError('El codigo de verificacion debe contener exactamente 6 digitos numericos.');
      return;
    }
    setLoading(true);
    try {
      await completeTwoFactorChallenge(code.trim());
      navigate('/admin/users');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Codigo 2FA invalido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    cancelTwoFactorChallenge();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-xl bg-indigo-600 text-white mb-3 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Verificacion de Identidad</h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Hemos enviado un codigo temporal de seguridad a{' '}
            <span className="font-semibold text-slate-800">{pendingTwoFactorEmail}</span>.
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
              Codigo de Seguridad (6 digitos)
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center tracking-[0.6em] text-lg font-mono rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{loading ? 'Validando codigo...' : 'Confirmar Verificacion'}</span>
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
            <span>Cancelar y volver al inicio de sesion</span>
          </button>
        </form>
      </div>
    </div>
  );
};
