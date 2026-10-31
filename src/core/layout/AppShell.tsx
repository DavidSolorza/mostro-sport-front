import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Users, KeyRound, Lock, UserCircle, LogOut, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const NAV_ITEMS = [
  { group: 'Control de Acceso', items: [
    { to: '/admin/users', label: 'Gestion de Usuarios', icon: Users },
    { to: '/admin/roles', label: 'Roles y Accesos', icon: KeyRound },
    { to: '/admin/permissions', label: 'Matriz de Permisos', icon: Lock },
  ]},
  { group: 'Cuenta', items: [
    { to: '/profile', label: 'Configuracion de Perfil', icon: UserCircle },
  ]},
];

export const AppShell: React.FC = () => {
  const { session, logout, forbiddenBanner, clearForbiddenBanner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login');
  };

  const currentSection = NAV_ITEMS.flatMap((g) => g.items).find((i) => i.to === location.pathname)?.label || 'Panel Principal';

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-900">
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-900">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-sm text-white tracking-tight">Mostro Sport</h1>
              <p className="text-xs text-slate-400">Plataforma de Gestion</p>
            </div>
          </div>

          <nav className="p-3 space-y-5">
            {NAV_ITEMS.map((section) => (
              <div key={section.group} className="space-y-1">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.group}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-900 bg-slate-950/50">
          <div className="mb-3 flex items-center gap-3 px-1">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-indigo-400">
              {session?.email ? session.email[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">{session?.email || 'Usuario'}</p>
              <p className="text-[10px] text-slate-400 truncate">Sesion: {session?.authProvider || 'LOCAL'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Consola de Administracion</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{currentSection}</span>
          </div>
        </header>

        {forbiddenBanner && (
          <div className="bg-rose-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-medium shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>{forbiddenBanner}</span>
            </div>
            <button type="button" onClick={clearForbiddenBanner} className="hover:opacity-75">
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
