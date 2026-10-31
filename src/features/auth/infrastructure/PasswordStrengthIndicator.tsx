import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { PASSWORD_RULES } from '../domain/authModels';

interface PasswordStrengthIndicatorProps {
  passwordValue: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  passwordValue,
}) => {
  const rules = [
    { label: 'Minimo 8 caracteres', ok: PASSWORD_RULES.minLength(passwordValue) },
    { label: 'Una mayuscula (A-Z)', ok: PASSWORD_RULES.hasUpper(passwordValue) },
    { label: 'Un digito numerico (0-9)', ok: PASSWORD_RULES.hasDigit(passwordValue) },
    { label: 'Un caracter especial (!@#$%...)', ok: PASSWORD_RULES.hasSpecial(passwordValue) },
  ];

  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
      <p className="text-[11px] font-semibold text-slate-700 mb-1.5">Politica de seguridad de contraseña:</p>
      <ul className="space-y-1">
        {rules.map((r) => (
          <li
            key={r.label}
            className={`flex items-center gap-1.5 text-[11px] transition-colors ${
              r.ok ? 'text-emerald-700 font-medium' : 'text-slate-400'
            }`}
          >
            {r.ok ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : <Circle className="h-3 w-3 text-slate-300" />}
            <span>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

