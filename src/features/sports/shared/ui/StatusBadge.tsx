import React from 'react';

export type BadgeTone = 'amber' | 'emerald' | 'slate' | 'rose' | 'indigo';

const TONES: Record<BadgeTone, string> = {
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-300',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

export const StatusBadge: React.FC<{ tone: BadgeTone; label: string }> = ({ tone, label }) => (
  <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full border ${TONES[tone]}`}>{label}</span>
);

export const ActivoBadge: React.FC<{ activo: boolean }> = ({ activo }) => (
  <StatusBadge tone={activo ? 'emerald' : 'slate'} label={activo ? 'Activo' : 'Inactivo'} />
);
