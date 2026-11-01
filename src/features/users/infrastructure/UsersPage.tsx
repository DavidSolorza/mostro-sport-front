import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  LoaderCircle,
  Mail,
  Pencil,
  Plus,
  RotateCw,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { HttpError } from '../../../core/errors/HttpError';
import { ConfirmDialog } from '../../../core/layout/ConfirmDialog';
import { userApiService } from '../application/userService';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from '../domain/userModels';

type UserFormValues = {
  name: string;
  email: string;
  password: string;
};

type UserField = keyof UserFormValues;
type UserFieldErrors = Partial<Record<UserField, string>>;

interface UserFormDialogProps {
  user: UserResponseDTO | null;
  onClose: () => void;
  onSave: (values: UserFormValues) => Promise<void>;
}

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])\S{8,72}$/;

const validateUser = (values: UserFormValues, isEditing: boolean): UserFieldErrors => {
  const errors: UserFieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (name.length < 2 || name.length > 100) {
    errors.name = 'El nombre debe tener entre 2 y 100 caracteres.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingresa un correo electronico valido.';
  }

  if (!isEditing && !values.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (values.password && !PASSWORD_PATTERN.test(values.password)) {
    errors.password =
      'Usa de 8 a 72 caracteres, con mayuscula, minuscula, numero y uno de @$!%*?&. No uses espacios.';
  }

  return errors;
};

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const getFieldErrors = (error: unknown): UserFieldErrors =>
  error instanceof HttpError ? (error.fieldErrors as UserFieldErrors | undefined) ?? {} : {};

const UserFormDialog: React.FC<UserFormDialogProps> = ({ user, onClose, onSave }) => {
  const isEditing = user !== null;
  const [values, setValues] = useState<UserFormValues>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<UserFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateValue = (field: UserField, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setFormError(null);

    const errors = validateUser(values, isEditing);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    try {
      await onSave({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
    } catch (error: unknown) {
      setFormError(getErrorMessage(error, 'No fue posible guardar el usuario.'));
      setFieldErrors(getFieldErrors(error));
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName = (field: UserField): string =>
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
        aria-labelledby="user-form-title"
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="user-form-title" className="text-base font-semibold text-slate-900">
              {isEditing ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {isEditing
                ? 'Actualiza los datos de la cuenta.'
                : 'Completa los datos para crear una cuenta.'}
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
            <label htmlFor="user-name" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Nombre completo
            </label>
            <input
              id="user-name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              value={values.name}
              onChange={(event) => updateValue('name', event.target.value)}
              className={inputClassName('name')}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'user-name-error' : undefined}
            />
            {fieldErrors.name && <p id="user-name-error" className="mt-1 text-xs text-rose-600">{fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="user-email" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Correo electronico
            </label>
            <input
              id="user-email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={(event) => updateValue('email', event.target.value)}
              className={inputClassName('email')}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'user-email-error' : undefined}
            />
            {fieldErrors.email && <p id="user-email-error" className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="user-password" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Contraseña {isEditing && <span className="font-normal text-slate-400">(opcional)</span>}
            </label>
            <input
              id="user-password"
              type="password"
              autoComplete="new-password"
              required={!isEditing}
              maxLength={72}
              value={values.password}
              onChange={(event) => updateValue('password', event.target.value)}
              placeholder={isEditing ? 'Dejar vacio para conservarla' : 'Minimo 8 caracteres'}
              className={inputClassName('password')}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'user-password-error' : undefined}
            />
            {fieldErrors.password && <p id="user-password-error" className="mt-1 text-xs text-rose-600">{fieldErrors.password}</p>}
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
              {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formUser, setFormUser] = useState<UserResponseDTO | null | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<UserResponseDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setUsers(await userApiService.list());
    } catch (error: unknown) {
      setLoadError(getErrorMessage(error, 'No fue posible cargar los usuarios.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return users;
    return users.filter((user) =>
      `${user.name} ${user.email}`.toLocaleLowerCase().includes(normalizedQuery)
    );
  }, [query, users]);

  const saveUser = async (values: UserFormValues): Promise<void> => {
    if (formUser) {
      const dto: UpdateUserDTO = {
        name: values.name,
        email: values.email,
        ...(values.password ? { password: values.password } : {}),
      };
      const updatedUser = await userApiService.update(formUser.id, dto);
      setUsers((current) => current.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    } else {
      const dto: CreateUserDTO = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      const createdUser = await userApiService.create(dto);
      setUsers((current) => [createdUser, ...current]);
    }
    setFormUser(undefined);
  };

  const deleteUser = async (): Promise<void> => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await userApiService.remove(userToDelete.id);
      setUsers((current) => current.filter((user) => user.id !== userToDelete.id));
      setUserToDelete(null);
      setLoadError(null);
    } catch (error: unknown) {
      setDeleteError(getErrorMessage(error, 'No fue posible eliminar el usuario.'));
      setUserToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Gestion de Usuarios</h1>
          <p className="mt-0.5 text-xs text-slate-500">Administra las cuentas registradas en la plataforma.</p>
        </div>
        <button
          type="button"
          onClick={() => setFormUser(null)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo usuario
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Usuarios registrados</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {isLoading ? '...' : users.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Resultados visibles</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {isLoading ? '...' : filteredUsers.length}
              </p>
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
              onClick={() => void loadUsers()}
              className="flex shrink-0 items-center gap-1 font-semibold hover:text-rose-900"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Reintentar
            </button>
          )}
          {deleteError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}
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
              placeholder="Buscar por nombre o correo..."
              aria-label="Buscar usuarios por nombre o correo"
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <span className="text-[11px] text-slate-500">
            Busqueda local sobre los usuarios cargados
          </span>
        </div>

        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <LoaderCircle className="h-4 w-4 animate-spin text-indigo-600" />
            Cargando usuarios...
          </div>
        ) : loadError && users.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center px-6 text-center text-xs text-slate-500">
            No se pudieron mostrar los usuarios. Revisa la conexion y vuelve a intentarlo.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400">
              {query ? <Search className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            </div>
            <h2 className="text-sm font-semibold text-slate-800">
              {query ? 'Sin resultados' : 'Aun no hay usuarios'}
            </h2>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
              {query
                ? 'No encontramos usuarios que coincidan con la busqueda.'
                : 'Crea el primer usuario para comenzar a gestionar las cuentas.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead className="bg-white">
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-5 py-3">Usuario</th>
                  <th scope="col" className="px-5 py-3">Correo electronico</th>
                  <th scope="col" className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-xs font-semibold text-indigo-700">
                          {user.name.trim().charAt(0).toUpperCase() || <UserRound className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {user.email}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFormUser(user)}
                          aria-label={`Editar a ${user.name}`}
                          className="rounded-md border border-slate-200 p-2 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserToDelete(user)}
                          aria-label={`Eliminar a ${user.name}`}
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

      {formUser !== undefined && (
        <UserFormDialog
          key={formUser?.id ?? 'new'}
          user={formUser}
          onClose={() => setFormUser(undefined)}
          onSave={saveUser}
        />
      )}

      <ConfirmDialog
        isOpen={userToDelete !== null}
        title="Eliminar usuario"
        message={
          userToDelete
            ? `¿Seguro que deseas eliminar a ${userToDelete.name}? Esta accion no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar usuario"
        isLoading={isDeleting}
        onConfirm={() => void deleteUser()}
        onCancel={() => {
          if (!isDeleting) setUserToDelete(null);
        }}
      />
    </div>
  );
};
