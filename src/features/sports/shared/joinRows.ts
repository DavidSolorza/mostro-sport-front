/**
 * ms_negocio devuelve las relaciones N:M como filas de union
 * (`{equipoId, equipoNombre}`, `{escenarioId, escenarioNombre}`...), no como entidades.
 * `fromJoin` las convierte a `{id, nombre}`; si la fila ya es una entidad la deja igual.
 */
type Row = Record<string, unknown>;

export function fromJoin<T extends { id: number; nombre: string }>(
  rows: unknown[],
  prefix: 'equipo' | 'escenario' | 'torneo' | 'deporte',
  extra?: (row: Row) => Partial<T>
): T[] {
  return rows.map((raw) => {
    const row = raw as Row;
    if (typeof row[`${prefix}Id`] !== 'number') return raw as T;
    const cap = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    return {
      id: row[`${prefix}Id`] as number,
      nombre: (row[`${prefix}Nombre`] as string | undefined) ?? `${cap} ${String(row[`${prefix}Id`])}`,
      ...(extra ? extra(row) : {}),
    } as T;
  });
}
