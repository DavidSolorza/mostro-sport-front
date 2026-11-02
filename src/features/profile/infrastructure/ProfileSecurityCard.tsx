import React from 'react';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { AuthProviderType } from '../../../core/auth/AuthContext';

interface ProfileSecurityCardProps {
  authProvider: AuthProviderType;
  twoFactorEnabled: boolean;
  onToggleTwoFactor: (enabled: boolean) => void;
}

export const ProfileSecurityCard: React.FC<ProfileSecurityCardProps> = ({
  authProvider,
  twoFactorEnabled,
  onToggleTwoFactor,
}) => {
  const isLocalAccount = authProvider === 'LOCAL';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Seguridad de la Cuenta</h2>
          <p className="text-xs text-slate-500">Mecanismos de autenticacion y verificacion en dos pasos</p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-900">Autenticacion en Dos Pasos (2FA)</h3>
          </div>
          <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
            Exige un codigo numerico temporal de 6 digitos al iniciar sesion para proteger la cuenta contra accesos no autorizados.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            disabled={!isLocalAccount}
            onChange={(e) => onToggleTwoFactor(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
        </label>
      </div>

      {!isLocalAccount ? (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-100 text-[11px] text-slate-600 border border-slate-200">
          <ExternalLink className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Su sesion actual proviene de <strong>{authProvider}</strong>. La configuracion de segundo factor es gestionada directamente por las politicas de seguridad de dicho proveedor.
          </span>
        </div>
      ) : (
        <p className="text-[11px] text-slate-400">
          Estado actual: {twoFactorEnabled ? 'Protegido con 2FA activo' : 'Autenticacion estandar activa'}
        </p>
      )}
    </div>
  );
};

