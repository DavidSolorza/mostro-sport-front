import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { authApiService } from '../application/authService';

interface PasswordRequestTokenFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  onAdvanceToReset: (email: string) => void;
}

export const PasswordRequestTokenForm: React.FC<PasswordRequestTokenFormProps> = ({
  onSuccess,
  onError,
  onAdvanceToReset,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    onError('');
    onSuccess('');
    setLoading(true);
    try {
      const res = await authApiService.requestPasswordRecovery({ email: email.trim() });
      onSuccess(res.message || 'Se ha enviado un token de recuperacion a su correo.');
      onAdvanceToReset(email.trim());
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error al solicitar el token de recuperacion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electronico Registrado</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@mostrosport.com"
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {loading ? 'Enviando solicitud...' : 'Enviar Token de Seguridad'}
      </button>
    </form>
  );
};
