# Propuesta Tecnica: Implementacion del Modulo de Usuarios y Conexion con Backend Spring Boot

## 1. Resumen Ejecutivo
Esta propuesta formal detalla la integracion completa del frontend con el backend Spring Boot (`com.backend.ms_security`). Se implementa la rebanada vertical de negocio `src/features/users/` para la gestion integral de usuarios (listado, creacion, edicion, eliminacion y asignacion de roles), y se sincroniza la matriz de permisos (`src/features/roles/`) con los endpoints existentes de `/api/users/`, `/api/roles/`, `/api/permissions/`, `/api/user-roles` y `/api/role-permissions`. No se modificara ningun archivo del backend.

## 2. Analisis de Endpoints del Backend
A partir del analisis estatico del servicio Spring Boot:
- **Usuarios (`/api/users/`):**
  - `GET /api/users/`: Obtiene la coleccion de usuarios (`id`, `name`, `email`).
  - `POST /api/users/`: Crea un nuevo usuario corporativo (`name`, `email`, `password`).
  - `PUT /api/users/{id}`: Actualiza datos basicos del usuario (`name`, `email`).
  - `DELETE /api/users/{id}`: Elimina al usuario de la base de datos.
  - `GET /api/users/{id}/detail-with-roles`: Obtiene el usuario con sus roles asignados.
- **Asignacion de Roles (`/api/user-roles`):**
  - `POST /api/user-roles`: Asocia un rol a un usuario (`{ userId, roleId }`).
  - `GET /api/user-roles/users/{userId}`: Lista de roles asignados al usuario.
  - `DELETE /api/user-roles/{userId}/{roleId}`: Remueve la asociacion de rol.
- **Roles y Permisos (`/api/roles/`, `/api/permissions/`, `/api/role-permissions`):**
  - `GET /api/roles/`: Lista de roles registrados.
  - `GET /api/permissions/`: Catalogo maestro de permisos del sistema (`url`, `method`, `model`).
  - `GET /api/role-permissions/roles/{roleId}`: Permisos asignados al rol.
  - `POST /api/role-permissions`: Asigna permiso (`{ roleId, permissionId }`).
  - `DELETE /api/role-permissions/{roleId}/{permissionId}`: Revoca permiso.

## 3. Arquitectura Propuesta en el Frontend (Vertical Slicing)

### 3.1. Modulo de Usuarios (`src/features/users/`)
```
src/features/users/
├── domain/
│   └── userModels.ts           # Interfaces de User, UserRole, CreateUserDTO, UpdateUserDTO (< 150 lin.)
├── application/
│   └── userService.ts          # Casos de uso y llamadas HTTP hacia /api/users/ y /api/user-roles (< 150 lin.)
└── infrastructure/
    ├── UsersListPage.tsx       # Pagina principal con tabla de usuarios, filtros y estado (< 150 lin.)
    ├── UserTableHeader.tsx     # Buscador, contador de registros y boton "Nuevo Usuario" (< 150 lin.)
    ├── UserTable.tsx           # Tabla de datos con visualizacion de roles y acciones (< 150 lin.)
    ├── UserFormModal.tsx       # Modal corporativo para creacion y edicion de usuario (< 150 lin.)
    └── UserRoleAssignModal.tsx # Modal para asignar o remover roles a un usuario (< 150 lin.)
```

### 3.2. Sincronizacion del Modulo de Roles (`src/features/roles/`)
- Ajustar `roleService.ts` para consultar `/api/roles/`, `/api/permissions/` y `/api/role-permissions`.
- Mapear las rutas HTTP del backend con la matriz visual:
  - `GET /api/users/{id}` -> `Model: Users | Action: View`
  - `GET /api/users` -> `Model: Users | Action: List`
  - `POST /api/users` -> `Model: Users | Action: Create`
  - `PUT /api/users/{id}` -> `Model: Users | Action: Update`
  - `DELETE /api/users/{id}` -> `Model: Users | Action: Delete`
  (Mismo mapeo para `Roles` y `Permissions`).
- Persistencia exacta: Al guardar cambios en la matriz, sincronizar mediante `POST` y `DELETE` en `/api/role-permissions`.

## 4. Matriz de Cumplimiento de Reglas Inviolables
- **Regla 2.1 (Maximo 150 lineas por archivo):** Todo componente y servicio se modularizara en submódulos de menos de 130 lineas.
- **Regla 2.3 (Cero SDKs comerciales):** Se utilizara exclusivamente el cliente nativo `src/core/http/httpClient.ts`.
- **Regla 5.1 (Vertical Slicing):** Todo el codigo nuevo se ubicara bajo `src/features/users/` y ajustes puntuales en `src/features/roles/`.
- **Seguridad e integridad del Backend:** No se modificara ningun archivo en `mostro-sport-backend`.

