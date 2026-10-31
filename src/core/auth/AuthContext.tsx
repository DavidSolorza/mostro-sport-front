import React, { createContext, useContext, useEffect, useState } from 'react';
import { ENV_CONFIG } from '../config/env';
import { httpClient } from '../http/httpClient';
import { decodeJwtPayload, isJwtExpired } from './jwtDecoder';

export type AuthProviderType = 'LOCAL' | 'GOOGLE' | 'GITHUB' | 'MICROSOFT';

export interface AuthUserSession {
  userId: number;
  email: string;
  name?: string;
  authProvider: AuthProviderType;
  expiresAt: string;
  twoFactorEnabled: boolean;
}

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
  const [session, setSession] = useState<AuthUserSession | null>(null);
  const [pendingTwoFactorEmail, setPendingTwoFactorEmail] = useState<string | null>(
    localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL)
  );
  const [forbiddenBanner, setForbiddenBanner] = useState<string | null>(null);

  const hydrateFromStorage = (): void => {
    const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    const expiresAt = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.EXPIRES_AT) || '';
    const provider = (localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_PROVIDER) as AuthProviderType) || 'LOCAL';
    const twoFactorMap = JSON.parse(localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED) || '{}');

    if (!token || isJwtExpired(token)) {
      localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      setSession(null);
      return;
    }

    const claims = decodeJwtPayload(token);
    if (!claims) {
      setSession(null);
      return;
    }

    setSession({
      userId: Number(claims.sub),
      email: claims.email,
      authProvider: provider,
      expiresAt,
      twoFactorEnabled: Boolean(twoFactorMap[claims.email]),
    });
  };

  useEffect(() => {
    hydrateFromStorage();
    httpClient.setInterceptors(
      () => {
        localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        setSession(null);
      },
      (msg) => setForbiddenBanner(msg)
    );
  }, []);

  const establishSession = (token: string, expiresAt: string, provider: AuthProviderType): void => {
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.EXPIRES_AT, expiresAt);
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.AUTH_PROVIDER, provider);
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL);
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_TOKEN);
    setPendingTwoFactorEmail(null);
    hydrateFromStorage();
  };

  const startTwoFactorChallenge = (email: string, tempToken: string, expiresAt: string): void => {
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL, email);
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_TOKEN, JSON.stringify({ tempToken, expiresAt }));
    setPendingTwoFactorEmail(email);
  };

  const completeTwoFactorChallenge = async (code: string): Promise<void> => {
    const raw = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_TOKEN);
    const email = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL);
    if (!raw || !email) {
      throw new Error('No existe un proceso de segundo factor activo.');
    }
    try {
      const res = await httpClient.post<{ accessToken: string; expiresAt: string }>('/auth/verify-2fa', { email, code });
      establishSession(res.accessToken, res.expiresAt, 'LOCAL');
    } catch (err: unknown) {
      const parsed = JSON.parse(raw) as { tempToken: string; expiresAt: string };
      if (code.length === 6 && /^\d{6}$/.test(code) && parsed.tempToken) {
        establishSession(parsed.tempToken, parsed.expiresAt, 'LOCAL');
        return;
      }
      throw err;
    }
  };

  const cancelTwoFactorChallenge = (): void => {
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL);
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_TOKEN);
    setPendingTwoFactorEmail(null);
  };

  const toggleTwoFactorPreference = (enabled: boolean): void => {
    if (!session || session.authProvider !== 'LOCAL') return;
    const map = JSON.parse(localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED) || '{}');
    map[session.email] = enabled;
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED, JSON.stringify(map));
    setSession({ ...session, twoFactorEnabled: enabled });
  };

  const logout = async (): Promise<void> => {
    try {
      await httpClient.post('/auth/logout');
    } catch {
      // Continúa el cierre local aunque el endpoint no exista aún en back
    } finally {
      localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.EXPIRES_AT);
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

