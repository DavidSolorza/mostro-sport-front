# Propuesta Tecnica: Rediseño Visual Corporativo y Estandarizacion UI con Tailwind CSS

## 1. Resumen Ejecutivo
Esta propuesta formal aborda la refactorizacion visual del frontend para alinearlo con estandares de software corporativo de grado empresarial (Enterprise SaaS). Se eliminan codigos informales de historias de usuario (e.g., "(HU-SE-08)"), textos provisionales y elementos graficos superfluos, implementando una direccion de arte sobria, consistente y optimizada mediante Tailwind CSS. Adicionalmente, se modularizan las vistas de autenticacion existentes para garantizar el cumplimiento del limite mandatorio de 150 lineas por archivo.

## 2. Diagnostico del Estado Actual
- **Contenido textual no profesional:** Multiples vistas presentan codigos tecnicos en encabezados principales (ejemplo: "Iniciar Sesion (HU-SE-08)", "Usuarios (HU-SE-01)").
- **Elementos visuales temporales:** Componentes como `PendingModulePage` y `DevLoginBypass` exhiben iconografia llamativa y textos coloquiales que desentonan con un entorno de produccion.
- **Incumplimiento del limite de lineas:**
  - `LoginPage.tsx` (169 lineas)
  - `PasswordRecoveryPage.tsx` (179 lineas)
  - `RegisterPage.tsx` (151 lineas)
- **Codificacion y tipografia:** Se identificaron inconsistencias de caracteres en encabezados HTML y textos de feedback.

## 3. Alcance de las Mejoras

### 3.1. Estandarizacion de Textos y Jerarquia Tipografica
- Reemplazo de codigos de historias de usuario por titulos funcionales directos:
  - `Iniciar Sesion (HU-SE-08)` -> `Iniciar Sesion`
  - `Registro Manual (HU-SE-07)` -> `Crear Cuenta Corporativa`
  - `Recuperar Contraseña (HU-SE-09)` -> `Recuperacion de Contraseña`
  - `Verificacion en Dos Pasos (HU-SE-10)` -> `Verificacion de Identidad`
- En el menu de navegacion (`AppShell`):
  - `Usuarios (HU-SE-01)` -> `Gestion de Usuarios`
  - `Roles (HU-SE-03/04)` -> `Roles y Accesos`
  - `Permisos (HU-SE-05/06)` -> `Matriz de Permisos`
  - `Mi Perfil y 2FA (HU-02/10)` -> `Configuracion de Perfil`

### 3.2. Sistema de Diseño con Tailwind CSS
- **Paleta cromatica institucional:** Uso de Slate (grises profundos 950/900/800 para estructura y 50/100 para fondos) combinado con Indigo/Blue (600/700) como acento primario y Rose/Emerald para estados semanticos de error y exito.
- **Topografia y sombras:** Refinamiento de elevaciones (`shadow-sm`, `shadow-xl`), bordes sutiles (`border-slate-200`, `border-slate-800/80`) y estados de foco (`focus:ring-2 focus:ring-indigo-500/20`).
- **Dashboard Placeholder (`PendingModulePage`):** Transformacion de la pagina provisional en una vista de preludio ejecutivo con tarjetas de metricas, barra de busqueda/filtros y estado vacio corporativo.
- **Acceso Rapido de Desarrollo (`DevLoginBypass`):** Rediseño como barra de depuracion integrada (`Developer Toolbar Badge`), discreta y ubicada en la esquina inferior.

### 3.3. Modularizacion y Cumplimiento de Reglas (< 150 lineas)
- `LoginPage.tsx`: Extraccion del bloque de proveedores OAuth hacia `OAuthProviderButtons.tsx` para reducir el archivo a ~115 lineas.
- `RegisterPage.tsx`: Compactacion estructural y extraccion de la validacion visual de requisitos hacia `PasswordStrengthIndicator.tsx`, manteniendo ambos bajo 100 lineas.
- `PasswordRecoveryPage.tsx`: Separacion en dos subcomponentes:
  - `PasswordRequestTokenForm.tsx` (~60 lineas)
  - `PasswordResetSubmitForm.tsx` (~70 lineas)
  - Orquestador `PasswordRecoveryPage.tsx` (~85 lineas).

## 4. Matriz de Impacto Modular
- **Riesgo funcional:** Nulo (se preservan todos los contratos de API, DTOs y logica de sesion).
- **Compatibilidad:** 100% compatible con Vite 6 y React 19.
- **Archivos a modificar:** 5
- **Archivos a crear (subcomponentes modulares):** 3

