# Propuesta Tecnica: Rediseño Estructural de la Matriz de Permisos RBAC Segun Mockup Corporativo

## 1. Resumen Ejecutivo
Esta propuesta formal define la adaptacion estructural exacta de la vista de asignacion de permisos por rol segun el mockup suministrado. Se replicara la disposicion espacial completa (barra de control superior, matriz agrupada por categorias de recursos y panel lateral derecho de metricas y reglas de acceso), aplicando la paleta de diseño corporativa basada en Tailwind CSS (Slate/Indigo) solicitada expresamente por el usuario ("no los mismos colores"), y conectando los datos con los endpoints del backend Spring Boot (`com.backend.ms_security`).

## 2. Desglose Estructural del Mockup
La interfaz se compone de 3 zonas funcionales principales:

### 2.1. Barra de Control y Acciones Superiores
- **Selector de Rol con desplegable corporativo:** Permite alternar entre los roles del sistema (e.g., Administrador, Coordinador, Operador, etc.).
- **Botones de comando:**
  - `Guardar cambios` (con estado de carga y confirmacion).
  - `Restablecer` (revertir cambios locales a la ultima version persistida).
- **Notificaciones contextuales:**
  - Banner de exito tras la actualizacion.
  - Alerta informativa sobre la vigencia de la sesion y la persistencia de permisos.

### 2.2. Matriz Central de Recursos por Categoria
- **Encabezados:** `Recurso` | `Ver` | `Listar` | `Crear` | `Actualizar` | `Eliminar`.
- **Agrupamiento jerarquico colapsable/expandible:**
  - **Administracion:** Usuarios, Roles, Permisos (conectados a endpoints reales `/api/users`, `/api/roles`, `/api/permissions`).
  - **Gestion Deportiva:** Torneos, Equipos, Jugadores, Partidos.
  - **Comercial:** Entradas.
  - **Infraestructura:** Escenarios.
  - **Reportes:** Reportes del sistema.
- **Micro-interacciones:** Casillas de verificacion con estados hover, focus accesible y seleccion rapida.

### 2.3. Panel Lateral Derecho: Resumen del Rol
- **Ficha tecnica del rol:** Nombre del rol y estado operativo (`Activo`).
- **Metricas cuantitativas:**
  - Cantidad de usuarios asociados al rol.
  - Total de permisos asignados vs disponibles.
  - Cantidad de modulos con acceso concedido.
- **Cuadricula de indicadores:** Total disponibles, Asignados, No asignados.
- **Leyenda visual:** Indicador de permiso asignado / no asignado.
- **Reglas de acceso y advertencia tecnica:** Panel informativo sobre la resolucion jerarquica de roles y recordatorio de integridad del sistema.

## 3. Arquitectura Modular en el Frontend (Vertical Slicing)
Para cumplir rigurosamente con la Regla de Oro de maximo 150 lineas por archivo, la rebanada `src/features/roles/` se fragmenta en submódulos de alta cohesion:

```
src/features/roles/
├── domain/
│   └── roleModels.ts                  # Interfaces, categorias de recursos, acciones y estadisticas (< 150 lin.)
├── application/
│   └── roleService.ts                 # Integracion con /api/roles/, /api/permissions/ y /api/role-permissions (< 150 lin.)
└── infrastructure/
    ├── RolePermissionMatrixPage.tsx   # Contenedor principal y distribucion en grid 12 cols (< 150 lin.)
    ├── RoleMatrixTopBar.tsx           # Barra superior con selector de rol y botones de accion (< 150 lin.)
    ├── RoleMatrixCategoryTable.tsx    # Tabla con filas agrupadas por modulo y checkboxes (< 150 lin.)
    ├── RoleSummarySidebar.tsx         # Panel lateral derecho con indicadores y metricas (< 150 lin.)
    └── RoleAccessRulesCard.tsx        # Subcomponente con leyenda y reglas de acceso (< 150 lin.)
```

## 4. Adaptacion Cromatica (Tailwind CSS Corporativo)
Se descarta el estilo oscuro neon del mockup original y se implementa una interfaz refinada de software empresarial:
- **Contenedores:** Fondos blancos y Slate-50 con bordes definidos `border-slate-200` y sombras suaves `shadow-sm`.
- **Acentos y Controles:** Indigo-600 para botones de guardado y elementos activos, con anillos de foco `focus:ring-2 focus:ring-indigo-500/20`.
- **Checkboxes:** Estilizados en Indigo corporativo con contraste optimizado sobre fondos alternados.
- **Badges y Estados:** Emerald para estados activos/asignados y Slate-400 para permisos inactivos.

## 5. Garantia de Inviolabilidad del Backend
No se modificara ninguna linea de codigo en `mostro-sport-backend`. La sincronizacion consumira directamente las firmas existentes de Spring Boot.

