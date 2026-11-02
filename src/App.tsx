import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthContext';
import { ProtectedRouteGuard, PublicOnlyGuard } from './core/auth/RouteGuards';
import { DevLoginBypass } from './core/auth/DevLoginBypass';
import { AppShell } from './core/layout/AppShell';
import { LoginPage } from './features/auth/infrastructure/LoginPage';
import { RegisterPage } from './features/auth/infrastructure/RegisterPage';
import { PasswordRecoveryPage } from './features/auth/infrastructure/PasswordRecoveryPage';
import { VerifyTwoFactorPage } from './features/auth/infrastructure/VerifyTwoFactorPage';
import { ProfilePage } from './features/profile/infrastructure/ProfilePage';
import { UsersListPage } from './features/users/infrastructure/UsersListPage';
import { RolesListPage } from './features/roles/infrastructure/RolesListPage';
import { RoleUsersManagementPage } from './features/roles/infrastructure/RoleUsersManagementPage';
import { RolePermissionMatrixPage } from './features/roles/infrastructure/RolePermissionMatrixPage';
import { PermissionsListPage } from './features/permissions/infrastructure/PermissionsListPage';
import { ENV_CONFIG } from './core/config/env';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UsersPage } from './features/users/infrastructure/UsersPage';
import { RolesPage } from './features/roles/infrastructure/RolesPage';

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
            <Route path="/reset-password" element={<PasswordRecoveryPage />} />
          </Route>

          <Route path="/verify-2fa" element={<VerifyTwoFactorPage />} />

          <Route element={<ProtectedRouteGuard />}>
            <Route element={<AppShell />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin/users" element={<UsersListPage />} />
              <Route path="/admin/roles" element={<RolesListPage />} />
              <Route path="/admin/roles/:roleId/users" element={<RoleUsersManagementPage />} />
              <Route path="/admin/roles/:roleId/permissions" element={<RolePermissionMatrixPage />} />
              <Route path="/admin/permissions" element={<PermissionsListPage />} />
            </Route>
          </Route>

          <Route path="/users" element={<Navigate to="/admin/users" replace />} />
          <Route path="/roles" element={<Navigate to="/admin/roles" replace />} />
          <Route path="/permissions" element={<Navigate to="/admin/permissions" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <DevLoginBypass />
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);
