import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { authApiService } from '../application/authService';
import { PASSWORD_RULES } from '../domain/authModels';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface PasswordResetSubmitFormProps {
  initialEmail: string;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const PasswordResetSubmitForm: React.FC<PasswordResetSubmitFormProps> = ({
  initialEmail,
  onSuccess,
  onError,
}) => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isPasswordValid =
    PASSWORD_RULES.minLength(newPassword) &&
    PASSWORD_RULES.hasUpper(newPassword) &&
    PASSWORD_RULES.hasDigit(newPassword) &&
    PASSWORD_RULES.hasSpecial(newPassword);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    onError('');
    onSuccess('');

    if (!isPasswordValid) {
      onError('La nueva contraseña debe cumplir con todos los requisitos de seguridad.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApiService.resetPassword({ token: token.trim(), newPassword });
      onSuccess(res.message || 'Contraseña actualizada correctamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Token invalido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {initialEmail && (
        <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
          Token enviado a: <span className="font-semibold text-slate-700">{initialEmail}</span>
        </p>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Token de Seguridad (UUID / Codigo)</label>
        <input
          type="text"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Ingrese el token recibido"
          className="w-full font-mono rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Nueva Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
          />
        </div>
      </div>

      <PasswordStrengthIndicator passwordValue={newPassword} />

      <button
        type="submit"
        disabled={loading || !isPasswordValid}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {loading ? 'Restableciendo...' : 'Guardar Nueva Contraseña'}
      </button>
    </form>
  );
};

