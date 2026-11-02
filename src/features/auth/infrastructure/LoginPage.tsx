import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { authApiService } from '../application/authService';
import { AuthProviderType, useAuth } from '../../../core/auth/AuthContext';
import { ENV_CONFIG } from '../../../core/config/env';
import { LoginRequestDTO } from '../domain/authModels';
import { OAuthProviderButtons } from './OAuthProviderButtons';
import { LoginCredentialsForm } from './LoginCredentialsForm';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const googleLoginRef = useRef<HTMLDivElement>(null);

  const { establishSession, startTwoFactorChallenge } = useAuth();
  const navigate = useNavigate();

  const handleOAuthLogin = async (
    provider: Exclude<AuthProviderType, 'LOCAL'>,
    credential: string
  ): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const res = await authApiService.loginWithOAuth(provider, credential);
      establishSession(res.accessToken, res.expiresAt, provider);
      navigate('/admin/users');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Error de autenticacion con ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    const issuerParam = urlParams.get('iss');
    if (codeParam && issuerParam === 'https://github.com/login/oauth') {
      handleOAuthLogin('GITHUB', codeParam);
    }
  }, []);

  const handleCredentialsLogin = async (dto: LoginRequestDTO): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const response = await authApiService.login(dto);
      const twoFactorMap = JSON.parse(
        localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED) || '{}'
      );
      if (response.requiresTwoFactor || twoFactorMap[dto.email.trim()]) {
        startTwoFactorChallenge(dto.email.trim(), response.accessToken, response.expiresAt);
        navigate('/verify-2fa');
        return;
      }
      establishSession(response.accessToken, response.expiresAt, 'LOCAL');
      navigate('/admin/users');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciales invalidas o cuenta deshabilitada.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOAuth = (provider: Exclude<AuthProviderType, 'LOCAL'>): void => {
    if (provider === 'GOOGLE') {
      googleLoginRef.current?.querySelector<HTMLButtonElement>("div[role='button']")?.click();
    } else if (provider === 'GITHUB') {
      window.location.assign(`${ENV_CONFIG.GITHUB_OAUTH_URL}?client_id=${ENV_CONFIG.GITHUB_CLIENT_ID}`);
    } else {
      handleOAuthLogin(provider, '');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-xl bg-indigo-600 text-white mb-3 shadow-sm">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Iniciar Sesion</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ingrese sus credenciales de acceso a la plataforma corporativa
          </p>
        </div>

        <LoginCredentialsForm loading={loading} error={error} onSubmit={handleCredentialsLogin} />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium">O continuar con</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div ref={googleLoginRef} className="hidden">
          <GoogleLogin
            onSuccess={(res: CredentialResponse) => {
              if (res.credential) handleOAuthLogin('GOOGLE', res.credential);
            }}
            onError={() => setError('Fallo en la autenticacion con Google.')}
          />
        </div>

        <OAuthProviderButtons loading={loading} onSelectProvider={handleSelectOAuth} />

        <p className="mt-6 text-center text-xs text-slate-500">
          ¿No dispone de una cuenta?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Solicitar registro
          </Link>
        </p>
      </div>
    </div>
  );
};
