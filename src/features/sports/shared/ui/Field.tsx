import React from 'react';

export const inputClass = (hasError = false): string =>
  `w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
    hasError ? 'border-rose-300 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
  }`;

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
  </div>
);
