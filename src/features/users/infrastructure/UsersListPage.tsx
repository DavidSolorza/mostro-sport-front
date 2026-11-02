import React, { useEffect, useState } from 'react';
import { userApiService } from '../application/userService';
import { roleApiService } from '../../roles/application/roleService';
import { CreateUserDTO, UpdateUserDTO, UserWithRolesDTO, UserRoleResponseDTO } from '../domain/userModels';
import { UserTableHeader } from './UserTableHeader';
import { UserTable } from './UserTable';
import { UserFormModal } from './UserFormModal';
import { UserRoleAssignModal } from './UserRoleAssignModal';

export const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState<UserWithRolesDTO[]>([]);
  const [availableRoles, setAvailableRoles] = useState<UserRoleResponseDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserWithRolesDTO | null>(null);
  const [roleModalUser, setRoleModalUser] = useState<UserWithRolesDTO | null>(null);

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    const data = await userApiService.getUsers();
    setUsers(data);
    const rolesData = await roleApiService.getRoles();
    setAvailableRoles(rolesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateOrUpdate = async (dto: CreateUserDTO | UpdateUserDTO): Promise<void> => {
    if (userToEdit) {
      await userApiService.updateUser(userToEdit.id, dto as UpdateUserDTO);
    } else {
      await userApiService.createUser(dto as CreateUserDTO);
    }
    setModalOpen(false);
    setUserToEdit(null);
    await fetchUsers();
  };

  const handleDelete = async (user: UserWithRolesDTO): Promise<void> => {
    if (window.confirm(`¿Esta seguro de eliminar al usuario ${user.name}?`)) {
      await userApiService.deleteUser(user.id);
      await fetchUsers();
    }
  };

  const handleAssignRole = async (userId: number, roleId: number): Promise<void> => {
    await userApiService.assignRole({ userId, roleId });
    await fetchUsers();
    if (roleModalUser && roleModalUser.id === userId) {
      const updated = await userApiService.getUsers();
      setRoleModalUser(updated.find((u) => u.id === userId) || null);
    }
  };

  const handleRemoveRole = async (userId: number, roleId: number): Promise<void> => {
    await userApiService.removeRole(userId, roleId);
    await fetchUsers();
    if (roleModalUser && roleModalUser.id === userId) {
      const updated = await userApiService.getUsers();
      setRoleModalUser(updated.find((u) => u.id === userId) || null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <UserTableHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalUsers={filteredUsers.length}
        onOpenCreateModal={() => {
          setUserToEdit(null);
          setModalOpen(true);
        }}
      />

      <UserTable
        users={filteredUsers}
        onEdit={(u) => {
          setUserToEdit(u);
          setModalOpen(true);
        }}
        onManageRoles={(u) => setRoleModalUser(u)}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <UserFormModal
          userToEdit={userToEdit}
          onClose={() => {
            setModalOpen(false);
            setUserToEdit(null);
          }}
          onSubmit={handleCreateOrUpdate}
          loading={loading}
        />
      )}

      {roleModalUser && (
        <UserRoleAssignModal
          user={roleModalUser}
          availableRoles={availableRoles}
          onClose={() => setRoleModalUser(null)}
          onAssignRole={handleAssignRole}
          onRemoveRole={handleRemoveRole}
        />
      )}
    </div>
  );
};

