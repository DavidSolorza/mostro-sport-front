import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import { profileApiService } from '../application/profileService';
import { ProfileResponseDTO } from '../domain/profileModels';
import { ProfilePersonalInfoCard } from './ProfilePersonalInfoCard';
import { ProfileSecurityCard } from './ProfileSecurityCard';

export const ProfilePage: React.FC = () => {
  const { session, toggleTwoFactorPreference } = useAuth();
  const [profile, setProfile] = useState<ProfileResponseDTO | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const userId = session?.userId || 1;

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await profileApiService.getProfile(userId);
      if (data) {
        setProfile(data);
        setPhone(data.phone || '');
        setBirthDate(data.birthDate || '');
        setPhotoUrl(data.photoUrl || '');
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await profileApiService.saveProfile(
        userId,
        { phone, birthDate, photoUrl },
        Boolean(profile)
      );
      setProfile(updated);
      setFeedback('Perfil actualizado exitosamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mi Perfil</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gestion de informacion personal y preferencias de seguridad
        </p>
      </div>

      {feedback && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800">
          {feedback}
        </div>
      )}

      <ProfilePersonalInfoCard
        email={session?.email || ''}
        name={session?.name || session?.email?.split('@')[0] || ''}
        phone={phone}
        birthDate={birthDate}
        photoUrl={photoUrl}
        saving={saving}
        onPhoneChange={setPhone}
        onBirthDateChange={setBirthDate}
        onPhotoUrlChange={setPhotoUrl}
        onSubmit={handleSubmit}
        existingProfile={profile}
      />

      <ProfileSecurityCard
        authProvider={session?.authProvider || 'LOCAL'}
        twoFactorEnabled={Boolean(session?.twoFactorEnabled)}
        onToggleTwoFactor={(enabled) => toggleTwoFactorPreference(enabled)}
      />
    </div>
  );
};

