# Propuesta Tecnica: Implementacion Integral de Requerimientos Faltantes del Modulo de Seguridad (HU-SE-01 a HU-SE-10)

## 1. Resumen Ejecutivo
Esta propuesta formal detalla la implementacion del 100% de los componentes, vistas y flujos faltantes en el Frontend para satisfacer la totalidad de Historias de Usuario (HU-SE-01 a HU-SE-10) y contratos REST del backend Spring Boot (`com.backend.ms_security`). Se mantiene de forma estricta la arquitectura de rebanadas verticales (Vertical Slicing), el consumo del cliente HTTP nativo (sin SDKs comerciales) y el limite inviolable de maximo 150 lineas por archivo, con cero emojis y estetica corporativa Tailwind CSS.

## 2. Diagnostico de Brechas Funcionales (Gap Analysis)
Tras contrastar el estado actual del frontend contra la lista de requerimientos:
1. **Cuenta Propia (HU-SE-02, HU-SE-10):**
   - Ruta `/profile`: Actualmente es un placeholder (`PendingModulePage`). Requiere formulario de visualizacion y edicion de Telefono, Fecha de Nacimiento, Fotografia (URL/preview), y seccion de seguridad con switch 2FA (bloqueado/oculto para usuarios OAuth, configurable para cuentas locales).
2. **Gestion de Roles CRUD y Usuarios de Rol (HU-SE-03, HU-SE-04):**
   - Ruta `/admin/roles`: Actualmente conduce directo a la matriz. Debe existir una tabla de roles (Nombre, Descripcion, Usuarios asignados) con CRUD completo, bloqueo de eliminacion si posee usuarios asignados, y enlaces directos a "Usuarios del Rol" y "Matriz de Permisos".
   - Ruta `/admin/roles/:roleId/users`: Vista de gestion de usuarios por rol con selector para vincular nuevos usuarios (`POST /api/user-roles`) y desvinculacion con modal de confirmacion mandatorio.
3. **Catalogo Maestro de Permisos (HU-SE-05):**
   - Ruta `/admin/permissions`: Actualmente conduce a la matriz. Debe existir la tabla y modal CRUD de permisos (`id`, `url`, `method`, `model`) consumiendo `/api/permissions/`.
4. **Enlace Especifico de Matriz de Permisos (HU-SE-06):**
   - Ruta `/admin/roles/:roleId/permissions`: Apertura contextual de la matriz avanzada para un rol especifico.
5. **Detalle y Perfil en Usuarios (HU-SE-01):**
   - Modal de detalle ampliado y acceso rapido a la edicion de perfil de cada usuario (`/api/users/{userId}/profile`).
6. **Ruta Autonoma de Restablecimiento (HU-SE-09):**
   - Ruta `/reset-password` accesible mediante enlace directo o query param de token.

## 3. Arquitectura Propuesta por Modulos (Vertical Slicing)

### 3.1. Modulo de Perfil y Cuenta Propia (`src/features/profile/`)
- `domain/profileModels.ts`: DTOs de perfil (`phone`, `birthDate`, `photoUrl`), validaciones (< 150 lin.).
- `application/profileService.ts`: Consumo de `/api/users/{userId}/profile` y actualizacion de preferencia 2FA (< 150 lin.).
- `infrastructure/ProfilePage.tsx`: Vista principal de `/profile` (< 150 lin.).
- `infrastructure/ProfilePersonalInfoCard.tsx`: Formulario de datos personales y preview de foto (< 150 lin.).
- `infrastructure/ProfileSecurityCard.tsx`: Gestion de segundo factor (2FA) segun proveedor de autenticacion (< 150 lin.).

### 3.2. Modulo de Roles y Usuarios de Rol (`src/features/roles/`)
- `domain/roleModels.ts`: Ampliacion con DTOs de CRUD de roles (`CreateRoleDTO`, `UpdateRoleDTO`, `RoleUserDTO`) (< 150 lin.).
- `application/roleService.ts`: Incorporacion de llamadas a `/api/roles/` (POST, PUT, DELETE) y `/api/user-roles/roles/{roleId}` (< 150 lin.).
- `infrastructure/RolesListPage.tsx`: Vista de tabla de roles en `/admin/roles` con boton "Nueva Matriz" y acciones (< 150 lin.).
- `infrastructure/RoleFormModal.tsx`: Modal para crear o editar rol (< 150 lin.).
- `infrastructure/RoleUsersManagementPage.tsx`: Vista `/admin/roles/:roleId/users` con lista de miembros y modal selector (< 150 lin.).
- `infrastructure/RoleAddUserModal.tsx`: Modal para agregar usuarios del sistema al rol (< 150 lin.).

### 3.3. Modulo de Catalogo de Permisos (`src/features/permissions/`)
- `domain/permissionModels.ts`: Entidad de Permiso (`id`, `url`, `method`, `model`) (< 150 lin.).
- `application/permissionService.ts`: Integracion HTTP con `/api/permissions/` (< 150 lin.).
- `infrastructure/PermissionsListPage.tsx`: Vista de `/admin/permissions` con tabla paginada y filtros (< 150 lin.).
- `infrastructure/PermissionFormModal.tsx`: Modal para crear y editar permisos maestros (< 150 lin.).

### 3.4. Refactorizacion del Enrutamiento (`src/App.tsx`)
- Configurar rutas especificas:
  - `/profile` -> `ProfilePage`
  - `/admin/users` -> `UsersListPage`
  - `/admin/roles` -> `RolesListPage`
  - `/admin/roles/:roleId/users` -> `RoleUsersManagementPage`
  - `/admin/roles/:roleId/permissions` -> `RolePermissionMatrixPage`
  - `/admin/permissions` -> `PermissionsListPage`
  - `/reset-password` -> `PasswordRecoveryPage`

## 4. Matriz de Cumplimiento de Reglas Inviolables
- **Regla 2.1 (Maximo 150 lineas):** Cada uno de los archivos se mantendra estrictamente por debajo de 130 lineas.
- **Regla 2.3 (Cero SDKs comerciales):** Consumo exclusivo del cliente nativo `httpClient`.
- **Integridad del Backend:** Ningun archivo del directorio `mostro-sport-backend` sera tocado.
- **Estilo:** Tailwind CSS corporativo sobrio (Slate, Indigo, Emerald), sin emojis.

