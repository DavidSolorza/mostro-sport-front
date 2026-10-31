import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  KeyRound,
  Lock,
  UserCircle,
  LogOut,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const AppShell: React.FC = () => {
  const { session, logout, forbiddenBanner, clearForbiddenBanner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-indigo-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight">Mostro Sport</h1>
              <p className="text-xs text-slate-400">Módulo de Seguridad</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Administración RBAC
            </p>
            <NavLink to="/admin/users" className={navLinkClass}>
              <Users className="h-4 w-4" />
              <span>Usuarios (HU-SE-01)</span>
            </NavLink>
            <NavLink to="/admin/roles" className={navLinkClass}>
              <KeyRound className="h-4 w-4" />
              <span>Roles (HU-SE-03/04)</span>
            </NavLink>
            <NavLink to="/admin/permissions" className={navLinkClass}>
              <Lock className="h-4 w-4" />
              <span>Permisos (HU-SE-05/06)</span>
            </NavLink>

            <p className="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cuenta Personal
            </p>
            <NavLink to="/profile" className={navLinkClass}>
              <UserCircle className="h-4 w-4" />
              <span>Mi Perfil y 2FA (HU-02/10)</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-3 px-2">
            <p className="text-xs text-slate-400 truncate">Sesión activa ({session?.authProvider})</p>
            <p className="text-sm font-medium text-white truncate">{session?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {forbiddenBanner && (
          <div className="bg-rose-600 text-white px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 text-sm font-medium">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{forbiddenBanner}</span>
            </div>
            <button type="button" onClick={clearForbiddenBanner} className="hover:opacity-80">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

