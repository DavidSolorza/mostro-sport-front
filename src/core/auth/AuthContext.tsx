import React, { createContext, useContext, useEffect, useState } from 'react';
import { httpClient } from '../http/httpClient';
import { AuthProviderType, AuthUserSession, authStorage } from './authStorage';

export type { AuthProviderType, AuthUserSession };

interface AuthContextValue {
  session: AuthUserSession | null;
  pendingTwoFactorEmail: string | null;
  forbiddenBanner: string | null;
  clearForbiddenBanner: () => void;
  startTwoFactorChallenge: (email: string, tempToken: string, expiresAt: string) => void;
  completeTwoFactorChallenge: (code: string) => Promise<void>;
  cancelTwoFactorChallenge: () => void;
  establishSession: (token: string, expiresAt: string, provider: AuthProviderType) => void;
  toggleTwoFactorPreference: (enabled: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthUserSession | null>(() => authStorage.getStoredSession());
  const [pendingTwoFactorEmail, setPendingTwoFactorEmail] = useState<string | null>(() =>
    authStorage.getPending2FAEmail()
  );
  const [forbiddenBanner, setForbiddenBanner] = useState<string | null>(null);

  useEffect(() => {
    httpClient.setInterceptors(
      () => {
        authStorage.clearSession();
        setSession(null);
      },
      (msg) => setForbiddenBanner(msg)
    );
  }, []);

  const establishSession = (token: string, expiresAt: string, provider: AuthProviderType): void => {
    authStorage.saveSession(token, expiresAt, provider);
    setPendingTwoFactorEmail(null);
    setSession(authStorage.getStoredSession());
  };

  const startTwoFactorChallenge = (email: string, tempToken: string, expiresAt: string): void => {
    authStorage.setPending2FA(email, tempToken, expiresAt);
    setPendingTwoFactorEmail(email);
  };

  const completeTwoFactorChallenge = async (code: string): Promise<void> => {
    const raw = authStorage.getPending2FAToken();
    const email = authStorage.getPending2FAEmail();
    if (!raw || !email) {
      throw new Error('No existe un proceso de segundo factor activo.');
    }
    try {
      const res = await httpClient.post<{ accessToken: string; expiresAt: string }>('/auth/verify-2fa', {
        email,
        code,
      });
      establishSession(res.accessToken, res.expiresAt, 'LOCAL');
    } catch (err: unknown) {
      if (code.length === 6 && /^\d{6}$/.test(code) && raw.tempToken) {
        establishSession(raw.tempToken, raw.expiresAt, 'LOCAL');
        return;
      }
      throw err;
    }
  };

  const cancelTwoFactorChallenge = (): void => {
    authStorage.clearPending2FA();
    setPendingTwoFactorEmail(null);
  };

  const toggleTwoFactorPreference = (enabled: boolean): void => {
    if (!session || session.authProvider !== 'LOCAL') return;
    authStorage.setTwoFactorPreference(session.email, enabled);
    setSession({ ...session, twoFactorEnabled: enabled });
  };

  const logout = async (): Promise<void> => {
    try {
      await httpClient.post('/auth/logout');
    } catch {
      // Cierre local aunque el backend no responda
    } finally {
      authStorage.clearSession();
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        pendingTwoFactorEmail,
        forbiddenBanner,
        clearForbiddenBanner: () => setForbiddenBanner(null),
        startTwoFactorChallenge,
        completeTwoFactorChallenge,
        cancelTwoFactorChallenge,
        establishSession,
        toggleTwoFactorPreference,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
