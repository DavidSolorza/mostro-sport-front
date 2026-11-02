import React, { useEffect, useState } from 'react';
import { roleApiService } from '../application/roleService';
import { CrudAction, PermissionMatrixMap, RoleDTO, RoleSummaryMetrics } from '../domain/roleModels';
import { RoleMatrixTopBar } from './RoleMatrixTopBar';
import { RoleMatrixCategoryTable } from './RoleMatrixCategoryTable';
import { RoleSummarySidebar } from './RoleSummarySidebar';

export const RolePermissionMatrixPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);
  const [matrix, setMatrix] = useState<PermissionMatrixMap>({});
  const [originalMatrix, setOriginalMatrix] = useState<PermissionMatrixMap>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const init = async () => {
      const rolesData = await roleApiService.getRoles();
      setRoles(rolesData);
      const initialId = rolesData[0]?.id || 1;
      setSelectedRoleId(initialId);
      const matrixData = await roleApiService.getRolePermissions(initialId);
      setMatrix(matrixData);
      setOriginalMatrix(matrixData);
    };
    init();
  }, []);

  const handleSelectRole = async (roleId: number): Promise<void> => {
    setSelectedRoleId(roleId);
    setFeedback(null);
    const matrixData = await roleApiService.getRolePermissions(roleId);
    setMatrix(matrixData);
    setOriginalMatrix(matrixData);
  };

  const handleToggleCell = (resourceKey: string, action: CrudAction): void => {
    setMatrix((prev) => ({
      ...prev,
      [resourceKey]: {
        ...prev[resourceKey],
        [action]: !prev[resourceKey]?.[action],
      },
    }));
  };

  const handleReset = (): void => {
    setMatrix(originalMatrix);
    setFeedback(null);
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    setFeedback(null);
    try {
      await roleApiService.saveRolePermissions(selectedRoleId, matrix);
      setOriginalMatrix(matrix);
      setFeedback({ type: 'success', message: 'Permisos actualizados correctamente.' });
    } catch {
      setFeedback({ type: 'error', message: 'Error al persistir la matriz de permisos.' });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(matrix) !== JSON.stringify(originalMatrix);
  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0] || { id: 1, name: 'Administrador', description: '' };
  const metrics: RoleSummaryMetrics = roleApiService.calculateMetrics(currentRole, matrix);

  return (
    <div className="space-y-6">
      <RoleMatrixTopBar
        roles={roles}
        selectedRoleId={selectedRoleId}
        onSelectRole={handleSelectRole}
        onSave={handleSave}
        onReset={handleReset}
        saving={saving}
        hasChanges={hasChanges}
        feedback={feedback}
        onClearFeedback={() => setFeedback(null)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-4">
          <RoleMatrixCategoryTable
            matrix={matrix}
            onToggleCell={handleToggleCell}
            disabled={saving}
          />
        </div>

        <div className="xl:col-span-4 space-y-4">
          <RoleSummarySidebar metrics={metrics} />
        </div>
      </div>
    </div>
  );
};
