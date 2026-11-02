import React from 'react';
import { Phone, Calendar, Image as ImageIcon, Save } from 'lucide-react';
import { ProfileResponseDTO } from '../domain/profileModels';

interface ProfilePersonalInfoCardProps {
  email: string;
  name: string;
  phone: string;
  birthDate: string;
  photoUrl: string;
  saving: boolean;
  onPhoneChange: (val: string) => void;
  onBirthDateChange: (val: string) => void;
  onPhotoUrlChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  existingProfile: ProfileResponseDTO | null;
}

export const ProfilePersonalInfoCard: React.FC<ProfilePersonalInfoCardProps> = ({
  email,
  name,
  phone,
  birthDate,
  photoUrl,
  saving,
  onPhoneChange,
  onBirthDateChange,
  onPhotoUrlChange,
  onSubmit,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Informacion Personal</h2>
        <p className="text-xs text-slate-500 mt-0.5">Actualice los datos asociados a su perfil corporativo</p>
      </div>

      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {photoUrl ? (
            <img src={photoUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-slate-400">{name.charAt(0) || 'U'}</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-sm text-slate-900">{name || 'Usuario'}</h3>
          <p className="text-xs font-mono text-slate-500">{email}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Telefono de Contacto</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="+57 300 123 4567"
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Nacimiento</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="date"
              value={birthDate}
              onChange={(e) => onBirthDateChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">URL de Fotografia</label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => onPhotoUrlChange(e.target.value)}
              placeholder="https://ejemplo.com/mifoto.jpg"
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? 'Guardando...' : 'Guardar Informacion'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

