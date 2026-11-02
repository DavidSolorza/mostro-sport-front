import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthContext';
import { ProtectedRouteGuard, PublicOnlyGuard } from './core/auth/RouteGuards';
import { DevLoginBypass } from './core/auth/DevLoginBypass';
import { AppShell } from './core/layout/AppShell';
import { PendingModulePage } from './core/layout/PendingModulePage';
import { LoginPage } from './features/auth/infrastructure/LoginPage';
import { RegisterPage } from './features/auth/infrastructure/RegisterPage';
import { PasswordRecoveryPage } from './features/auth/infrastructure/PasswordRecoveryPage';
import { VerifyTwoFactorPage } from './features/auth/infrastructure/VerifyTwoFactorPage';
import { UsersListPage } from './features/users/infrastructure/UsersListPage';
import { RolePermissionMatrixPage } from './features/roles/infrastructure/RolePermissionMatrixPage';
import { ENV_CONFIG } from './core/config/env';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_OAUTH_CLIENT_ID = ENV_CONFIG.GOOGLE_CLIENT_ID;

export const App: React.FC = () => (
  <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyGuard />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<PasswordRecoveryPage />} />
          </Route>

          <Route path="/verify-2fa" element={<VerifyTwoFactorPage />} />

          <Route element={<ProtectedRouteGuard />}>
            <Route element={<AppShell />}>
              <Route path="/admin/users" element={<UsersListPage />} />
              <Route path="/admin/roles" element={<RolePermissionMatrixPage />} />
              <Route path="/admin/permissions" element={<RolePermissionMatrixPage />} />
              <Route path="/profile" element={<PendingModulePage title="Configuracion de Perfil" />} />
            </Route>
          </Route>

          <Route path="/users" element={<Navigate to="/admin/users" replace />} />
          <Route path="/roles" element={<Navigate to="/admin/roles" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <DevLoginBypass />
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);
