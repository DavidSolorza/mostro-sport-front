import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PasswordRequestTokenForm } from './PasswordRequestTokenForm';
import { PasswordResetSubmitForm } from './PasswordResetSubmitForm';

export const PasswordRecoveryPage: React.FC = () => {
  const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
  const [requestedEmail, setRequestedEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAdvanceToReset = (email: string): void => {
    setRequestedEmail(email);
    setStep('RESET');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-xl bg-indigo-600 text-white mb-3 shadow-sm">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Recuperacion de Contraseña</h1>
          <p className="text-xs text-slate-500 mt-1">
            Restablezca el acceso a su cuenta mediante token de verificacion
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-1 mb-5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setStep('REQUEST')}
            className={`flex-1 py-1.5 rounded-md transition ${
              step === 'REQUEST' ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            1. Solicitar Token
          </button>
          <button
            type="button"
            onClick={() => setStep('RESET')}
            className={`flex-1 py-1.5 rounded-md transition ${
              step === 'RESET' ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700'
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

        {success && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {step === 'REQUEST' ? (
          <PasswordRequestTokenForm
            onError={setError}
            onSuccess={setSuccess}
            onAdvanceToReset={handleAdvanceToReset}
          />
        ) : (
          <PasswordResetSubmitForm
            initialEmail={requestedEmail}
            onError={setError}
            onSuccess={setSuccess}
          />
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          ¿Recordo su clave de acceso?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Volver a inicio de sesion
          </Link>
        </p>
      </div>
    </div>
  );
};
