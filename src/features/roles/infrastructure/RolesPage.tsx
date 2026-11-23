import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  LoaderCircle,
  Pencil,
  Plus,
  RotateCw,
  Search,
  Shield,
  Trash2,
  UserRoundPlus,
  Users,
  X,
} from 'lucide-react';
import { HttpError } from '../../../core/errors/HttpError';
import { ConfirmDialog } from '../../../core/layout/ConfirmDialog';
import { roleApiService } from '../application/roleService';
import {
  CreateRoleDTO,
  RoleUserResponseDTO,
  RoleResponseDTO,
  UpdateRoleDTO,
} from '../domain/roleModels';
import { UserResponseDTO } from '../../users/domain/userModels';

type RoleFormValues = {
  name: string;
  description: string;
};

type RoleField = keyof RoleFormValues;
type RoleFieldErrors = Partial<Record<RoleField, string>>;

interface RoleFormDialogProps {
  role: RoleResponseDTO | null;
  onClose: () => void;
  onSave: (values: RoleFormValues) => Promise<void>;
}

interface RoleUsersDialogProps {
  role: RoleResponseDTO;
  onClose: () => void;
}

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const getFieldErrors = (error: unknown): RoleFieldErrors =>
  error instanceof HttpError ? (error.fieldErrors as RoleFieldErrors | undefined) ?? {} : {};

const validateRole = (values: RoleFormValues): RoleFieldErrors => {
  const errors: RoleFieldErrors = {};
  const name = values.name.trim();
  const description = values.description.trim();

  if (name.length < 2 || name.length > 50) {
    errors.name = 'El nombre debe tener entre 2 y 50 caracteres.';
  }
  if (description.length < 5 || description.length > 255) {
    errors.description = 'La descripcion debe tener entre 5 y 255 caracteres.';
  }
  return errors;
};

const RoleFormDialog: React.FC<RoleFormDialogProps> = ({ role, onClose, onSave }) => {
  const isEditing = role !== null;
  const [values, setValues] = useState<RoleFormValues>({
    name: role?.name ?? '',
    description: role?.description ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<RoleFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateValue = (field: RoleField, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setFormError(null);
    const errors = validateRole(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    try {
      await onSave({
        name: values.name.trim(),
        description: values.description.trim(),
      });
    } catch (error: unknown) {
      setFormError(getErrorMessage(error, 'No fue posible guardar el rol.'));
      setFieldErrors(getFieldErrors(error));
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName = (field: RoleField): string =>
    `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
      fieldErrors[field]
        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
    }`;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-form-title"
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="role-form-title" className="text-base font-semibold text-slate-900">
              {isEditing ? 'Editar rol' : 'Nuevo rol'}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Define el nombre y la descripcion del rol.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Cerrar"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 px-6 py-5">
          {formError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          <div>
            <label htmlFor="role-name" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Nombre
            </label>
            <input
              id="role-name"
              type="text"
              required
              minLength={2}
              maxLength={50}
              value={values.name}
              onChange={(event) => updateValue('name', event.target.value)}
              className={inputClassName('name')}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'role-name-error' : undefined}
            />
            {fieldErrors.name && <p id="role-name-error" className="mt-1 text-xs text-rose-600">{fieldErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="role-description" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Descripcion
            </label>
            <textarea
              id="role-description"
              required
              minLength={5}
              maxLength={255}
              rows={3}
              value={values.description}
              onChange={(event) => updateValue('description', event.target.value)}
              className={`${inputClassName('description')} resize-y`}
              aria-invalid={Boolean(fieldErrors.description)}
              aria-describedby={fieldErrors.description ? 'role-description-error' : undefined}
            />
            <div className="mt-1 flex items-start justify-between gap-2">
              {fieldErrors.description ? (
                <p id="role-description-error" className="text-xs text-rose-600">{fieldErrors.description}</p>
              ) : <span />}
              <span className="text-[10px] text-slate-400">{values.description.length}/255</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
              {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear rol'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const RoleUsersDialog: React.FC<RoleUsersDialogProps> = ({ role, onClose }) => {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [assignments, setAssignments] = useState<RoleUserResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const loadData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [allUsers, roleAssignments] = await Promise.all([
        roleApiService.listUsers(),
        roleApiService.listRoleAssignments(role.id),
      ]);
      setUsers(allUsers);
      setAssignments(roleAssignments);
    } catch (error: unknown) {
      setLoadError(getErrorMessage(error, 'No fue posible cargar los usuarios y sus asignaciones.'));
    } finally {
      setIsLoading(false);
    }
  }, [role.id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const assignedUserIds = useMemo(
    () => new Set(assignments.map((assignment) => assignment.user.id)),
    [assignments]
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return users;
    return users.filter((user) =>
      `${user.name} ${user.email}`.toLocaleLowerCase().includes(normalizedQuery)
    );
  }, [query, users]);

  const toggleAssignment = async (user: UserResponseDTO): Promise<void> => {
    setBusyUserId(user.id);
    setActionError(null);
    try {
      if (assignedUserIds.has(user.id)) {
        await roleApiService.removeUserRole(user.id, role.id);
        setAssignments((current) => current.filter((assignment) => assignment.user.id !== user.id));
      } else {
        const assignment = await roleApiService.assignUser(user.id, role.id);
        setAssignments((current) => [
          ...current,
          { id: assignment.id, roleId: role.id, user },
        ]);
      }
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, 'No fue posible actualizar la asignacion del rol.'));
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-users-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h2 id="role-users-title" className="text-base font-semibold text-slate-900">
                Usuarios con el rol {role.name}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Asigna este rol a usuarios existentes o retira la asignacion.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar usuario por nombre o correo..."
              aria-label="Buscar usuario para asignar el rol"
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {actionError && (
          <div role="alert" className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        <div className="min-h-48 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center gap-2 text-xs text-slate-500">
              <LoaderCircle className="h-4 w-4 animate-spin text-indigo-600" />
              Cargando usuarios y relaciones...
            </div>
          ) : loadError ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 text-center">
              <p role="alert" className="text-xs text-rose-700">{loadError}</p>
              <button
                type="button"
                onClick={() => void loadData()}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Reintentar
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-slate-800">
                {query ? 'Sin resultados' : 'No hay usuarios registrados'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {query ? 'Prueba con otro nombre o correo.' : 'Crea usuarios antes de asignarles roles.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isAssigned = assignedUserIds.has(user.id);
                const isBusy = busyUserId === user.id;
                return (
                  <li key={user.id} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600">
                        {user.name.trim().charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800">{user.name}</p>
                        <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void toggleAssignment(user)}
                      disabled={busyUserId !== null}
                      aria-pressed={isAssigned}
                      className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                        isAssigned
                          ? 'border-rose-200 bg-white text-rose-700 hover:bg-rose-50'
                          : 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isBusy ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : isAssigned ? (
                        <X className="h-3.5 w-3.5" />
                      ) : (
                        <UserRoundPlus className="h-3.5 w-3.5" />
                      )}
                      {isAssigned ? 'Quitar rol' : 'Asignar rol'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!isLoading && !loadError && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">
            <span className="text-[11px] text-slate-500">
              {assignedUserIds.size} {assignedUserIds.size === 1 ? 'usuario asignado' : 'usuarios asignados'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleResponseDTO[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formRole, setFormRole] = useState<RoleResponseDTO | null | undefined>(undefined);
  const [roleToDelete, setRoleToDelete] = useState<RoleResponseDTO | null>(null);
  const [roleForUsers, setRoleForUsers] = useState<RoleResponseDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRoles = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setRoles(await roleApiService.list());
    } catch (error: unknown) {
      setLoadError(getErrorMessage(error, 'No fue posible cargar los roles.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  const filteredRoles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return roles;
    return roles.filter((role) =>
      `${role.name} ${role.description}`.toLocaleLowerCase().includes(normalizedQuery)
    );
  }, [query, roles]);

  const saveRole = async (values: RoleFormValues): Promise<void> => {
    if (formRole) {
      const dto: UpdateRoleDTO = { name: values.name, description: values.description };
      const updatedRole = await roleApiService.update(formRole.id, dto);
      setRoles((current) => current.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
    } else {
      const dto: CreateRoleDTO = { name: values.name, description: values.description };
      const createdRole = await roleApiService.create(dto);
      setRoles((current) => [createdRole, ...current]);
    }
    setFormRole(undefined);
  };

  const deleteRole = async (): Promise<void> => {
    if (!roleToDelete) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await roleApiService.remove(roleToDelete.id);
      setRoles((current) => current.filter((role) => role.id !== roleToDelete.id));
      setRoleToDelete(null);
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, 'No fue posible eliminar el rol.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Roles y Accesos</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Define roles y administra a que usuarios estan asignados.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormRole(null)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo rol
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Roles registrados</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">{isLoading ? '...' : roles.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Resultados visibles</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">{isLoading ? '...' : filteredRoles.length}</p>
            </div>
          </div>
        </div>
      </section>

      {loadError && (
        <div role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{loadError}</span>
          </div>
          {!isLoading && (
            <button
              type="button"
              onClick={() => void loadRoles()}
              className="flex shrink-0 items-center gap-1 font-semibold hover:text-rose-900"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Reintentar
            </button>
          )}
        </div>
      )}
      {actionError && (
        <div role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            aria-label="Cerrar error"
            className="text-rose-500 hover:text-rose-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o descripcion..."
              aria-label="Buscar roles"
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <span className="text-[11px] text-slate-500">Busqueda local sobre los roles cargados</span>
        </div>

        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <LoaderCircle className="h-4 w-4 animate-spin text-indigo-600" />
            Cargando roles...
          </div>
        ) : loadError && roles.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center px-6 text-center text-xs text-slate-500">
            No se pudieron mostrar los roles. Revisa la conexion y vuelve a intentarlo.
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400">
              {query ? <Search className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
            </div>
            <h2 className="text-sm font-semibold text-slate-800">
              {query ? 'Sin resultados' : 'Aun no hay roles'}
            </h2>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
              {query
                ? 'No encontramos roles que coincidan con la busqueda.'
                : 'Crea un rol para empezar a asignar accesos a los usuarios.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-5 py-3">Rol</th>
                  <th scope="col" className="px-5 py-3">Descripcion</th>
                  <th scope="col" className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-700">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{role.name}</p>
                          <p className="text-[10px] text-slate-400">ID: {role.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-sm px-5 py-3.5 text-xs text-slate-600">{role.description}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setRoleForUsers(role)}
                          aria-label={`Administrar usuarios del rol ${role.name}`}
                          title="Asignar usuarios"
                          className="rounded-md border border-slate-200 p-2 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Users className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormRole(role)}
                          aria-label={`Editar rol ${role.name}`}
                          className="rounded-md border border-slate-200 p-2 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null);
                            setRoleToDelete(role);
                          }}
                          aria-label={`Eliminar rol ${role.name}`}
                          className="rounded-md border border-slate-200 p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {formRole !== undefined && (
        <RoleFormDialog
          key={formRole?.id ?? 'new'}
          role={formRole}
          onClose={() => setFormRole(undefined)}
          onSave={saveRole}
        />
      )}
      {roleForUsers && (
        <RoleUsersDialog
          key={roleForUsers.id}
          role={roleForUsers}
          onClose={() => setRoleForUsers(null)}
        />
      )}
      <ConfirmDialog
        isOpen={roleToDelete !== null}
        title="Eliminar rol"
        message={
          roleToDelete
            ? `¿Seguro que deseas eliminar el rol ${roleToDelete.name}? Si tiene usuarios asignados, el servidor puede impedir la eliminacion.`
            : ''
        }
        confirmLabel="Eliminar rol"
        isLoading={isDeleting}
        onConfirm={() => void deleteRole()}
        onCancel={() => {
          if (!isDeleting) {
            setRoleToDelete(null);
            setActionError(null);
          }
        }}
      />
    </div>
  );
};
