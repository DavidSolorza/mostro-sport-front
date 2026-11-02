# Propuesta Tecnica: Implementacion de la Matriz de Permisos por Rol (RBAC)

## 1. Resumen Ejecutivo
Esta propuesta formal define la arquitectura e implementacion de la vista de Matriz de Permisos por Rol conforme al mockup suministrado. La funcionalidad permitira a los administradores visualizar y gestionar de forma matricial los privilegios de acceso (CRUD: View, List, Create, Update, Delete) asociados a cada rol de usuario sobre los modelos clave del sistema (Users, Roles, Permissions).

## 2. Analisis del Mockup
A partir del diagrama proporcionado:
- **Encabezado / Contexto:** Selector y titulo del rol activo (e.g., `Administrator - Permissions`).
- **Estructura Matricial (Filas x Columnas):**
  - **Modelos (Eje Y):** `Users`, `Roles`, `Permissions`.
  - **Operaciones (Eje X):** `View`, `List`, `Create`, `Update`, `Delete`.
  - **Interaccion:** Casillas de seleccion (checkboxes) que representan el estado activo/inactivo del permiso.
- **Ruta de acceso en la aplicacion:** `/admin/roles` y vinculable desde `/admin/permissions` en el AppShell.

## 3. Arquitectura Propuesta (Vertical Slicing)
La solucion se estructurara en el modulo de negocio `src/features/roles/`:

```
src/features/roles/
├── domain/
│   └── roleModels.ts                # Interfaces de Rol, Permiso, Accion y Matriz de Permisos (< 150 lin.)
├── application/
│   └── roleService.ts               # Logica de aplicacion y consumo HTTP con httpClient nativo (< 150 lin.)
└── infrastructure/
    ├── RolePermissionMatrixPage.tsx # Vista contenedora y orquestador de estado (< 150 lin.)
    ├── RoleSelectorBar.tsx          # Selector de rol activo y acciones masivas (< 150 lin.)
    ├── PermissionMatrixTable.tsx    # Tabla matricial con checkboxes accesibles y estilizados (< 150 lin.)
    └── MatrixSaveFooter.tsx         # Barra de estado y guardado de cambios (< 150 lin.)
```

## 4. Reglas de Negocio y Experiencia de Usuario (UI/UX)
- **Persistencia y Reactividad:** Estado local optimista con opcion de revertir cambios no guardados.
- **Acciones Rapidas:** Boton para marcar/desmarcar todos los permisos de una entidad o de un rol completo.
- **Estilo Visual:** Tailwind CSS corporativo alineado con la linea grafica establecida (Slate-900, Indigo-600, bordes Slate-200, checkboxes accesibles con anillos de foco).
- **Cero SDKs Comerciales:** Consumo directo del cliente HTTP base nativo (`src/core/http/httpClient.ts`).
- **Tolerancia a fallos:** Si el backend aun no expone el endpoint de roles/permisos, se cargara un dataset inicial de contingencia con sincronizacion simulada en memoria para permitir la evaluacion completa de la interfaz sin bloqueos.

## 5. Matriz de Cumplimiento de Reglas Inviolables
- **Regla 2.1 (Maximo 150 lineas):** Todos los archivos de la rebanada vertical estaran por debajo de 110 lineas.
- **Regla 5.1 (Vertical Slicing):** Todo el codigo vivira dentro de `src/features/roles/`.
- **Regla Estetica:** Cero emojis en la interfaz y en el codigo.

