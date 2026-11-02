import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogIn, AlertCircle } from 'lucide-react';
import { authApiService } from '../application/authService';
import { AuthProviderType, useAuth } from '../../../core/auth/AuthContext';
import { ENV_CONFIG } from '../../../core/config/env';
import { OAuthProviderButtons } from './OAuthProviderButtons';


import { CredentialResponse, GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const GOOGLE_OAUTH_CLIENT_ID = ENV_CONFIG.GOOGLE_CLIENT_ID;

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { establishSession, startTwoFactorChallenge } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const codeParam = urlParams.get("code");
    const issuerParam = urlParams.get("iss");

    console.log("Code: ", codeParam, issuerParam);
    
    if (codeParam && issuerParam === "https://github.com/login/oauth")
    {
      console.log("meow");
      handleOAuthLogin("GITHUB", codeParam!)
      navigate("/");
    }
  }, [])

  const handleCredentialsLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authApiService.login({ email: email.trim(), password });
      const twoFactorMap = JSON.parse(
        localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED) || '{}'
      );
      const needs2FA = Boolean(response.requiresTwoFactor || twoFactorMap[email.trim()]);

      if (needs2FA) {
        startTwoFactorChallenge(email.trim(), response.accessToken, response.expiresAt);
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

  const handleOAuthLogin = async (provider: Exclude<AuthProviderType, 'LOCAL'>, credential: string): Promise<void> => {
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

  const googleLoginRef = useRef<HTMLDivElement>(null);

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

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electronico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@mostrosport.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Contraseña</label>
              <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:underline">
                ¿Olvido su contraseña?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? 'Validando credenciales...' : 'Ingresar al Sistema'}</span>
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium">O continuar con</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div
          ref={googleLoginRef}
          style={{
            display: "none",
          }}
        >
          <GoogleLogin
            onSuccess={(credentialResponse: CredentialResponse) => handleOAuthLogin("GOOGLE", credentialResponse.credential!)}
            onError={() => {console.log("Google login failed"); }}
            />
        </div>

        <OAuthProviderButtons loading={false} onSelectProvider={(provider) => {
          if (provider === "GOOGLE") {
            googleLoginRef.current
              ?.querySelector("div[role='button']")
              ?.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );
          }
          else if (provider == "GITHUB")
          {
            const github_oauth_page_url = `${ENV_CONFIG.GITHUB_OAUTH_URL}?client_id=${ENV_CONFIG.GITHUB_CLIENT_ID}`;
            window.location.assign(
              github_oauth_page_url
            );
          }
        }}/>

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
