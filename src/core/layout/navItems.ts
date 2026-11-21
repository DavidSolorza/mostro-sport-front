import {
  Shield,
  Users,
  KeyRound,
  Lock,
  UserCircle,
  Trophy,
  Activity,
  BarChart3,
  Coins,
  Ticket,
  UserCheck,
  Award,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    group: 'Gestión Deportiva (B)',
    items: [
      { to: '/sports/partidos', label: 'Partidos y Marcador', icon: Trophy },
      { to: '/sports/pizarra', label: 'Pizarra Táctica en Vivo', icon: Activity },
      { to: '/sports/desarrollo', label: 'Desarrollo Torneo', icon: BarChart3 },
      { to: '/sports/apuestas', label: 'Apuestas Deportivas', icon: Coins },
      { to: '/sports/boletos', label: 'Boletos y Localidades', icon: Ticket },
      { to: '/sports/aficionado', label: 'Perfil Aficionado', icon: UserCheck },
      { to: '/sports/habilidades', label: 'Habilidades Jugador', icon: Award },
    ],
  },
  {
    group: 'Control de Acceso',
    items: [
      { to: '/admin/users', label: 'Gestion de Usuarios', icon: Users },
      { to: '/admin/roles', label: 'Gestion de Roles', icon: KeyRound },
      { to: '/admin/roles/1/permissions', label: 'Matriz de Permisos', icon: Shield },
      { to: '/admin/permissions', label: 'Catalogo de Permisos', icon: Lock },
    ],
  },
  {
    group: 'Cuenta',
    items: [
      { to: '/profile', label: 'Mi Perfil y Seguridad', icon: UserCircle },
    ],
  },
];
