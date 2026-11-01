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
import { UsersPage } from './features/users/infrastructure/UsersPage';

export const App: React.FC = () => (
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
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/roles" element={<PendingModulePage title="Roles y Accesos" />} />
            <Route path="/admin/permissions" element={<PendingModulePage title="Matriz de Permisos" />} />
            <Route path="/profile" element={<PendingModulePage title="Configuracion de Perfil" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <DevLoginBypass />
    </BrowserRouter>
  </AuthProvider>
);
