import React, { useState, useEffect } from 'react';
import { CreatePartidoDto } from '../domain/partidoModels';
import { stubsService } from '../../stubs/application/stubsService';
import { torneosService } from '../../torneos/application/torneosService';
import { toUserMessage } from '../../shared/errorMessage';
import { TorneoOption, FaseOption, EscenarioOption, EquipoOption, PelotaOption } from '../../stubs/domain/stubModels';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreatePartidoDto) => Promise<void>;
}

export const CrearPartidoModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [torneos, setTorneos] = useState<TorneoOption[]>([]);
  const [fases, setFases] = useState<FaseOption[]>([]);
  const [escenarios, setEscenarios] = useState<EscenarioOption[]>([]);
  const [equipos, setEquipos] = useState<EquipoOption[]>([]);
  const [pelotas, setPelotas] = useState<PelotaOption[]>([]);
  const [idTorneo, setIdTorneo] = useState<number>(0);
  const [idFase, setIdFase] = useState<number | undefined>(undefined);
  const [idEscenario, setIdEscenario] = useState<number>(0);
  const [idLocal, setIdLocal] = useState<number>(0);
  const [idVisitante, setIdVisitante] = useState<number>(0);
  const [idPelota, setIdPelota] = useState<number | undefined>(undefined);
  const [fechaHora, setFechaHora] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    setIdFase(undefined);
    Promise.all([stubsService.getTorneos(), stubsService.getEscenarios(), stubsService.getPelotas()]).then(([t, esc, p]) => {
      setTorneos(t);
      setEscenarios(esc);
      setPelotas(p);
      setIdTorneo(t[0]?.id_torneo ?? 0);
      setIdEscenario(esc[0]?.id_escenario ?? 0);
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !idTorneo) return;
    setIdFase(undefined);
    Promise.all([stubsService.getFases(idTorneo), torneosService.equiposInscritos(idTorneo)]).then(([f, ins]) => {
      setFases(f);
      const mapeados: EquipoOption[] = (ins as unknown as Array<Record<string, unknown>>).map((i) => ({
        id_equipo: Number(i.equipoId ?? i.id_equipo ?? i.id ?? 0),
        nombre: String(i.equipoNombre ?? i.nombre ?? 'Equipo'),
      }));
      setEquipos(mapeados);
      setIdLocal(mapeados[0]?.id_equipo ?? 0);
      setIdVisitante(mapeados[1]?.id_equipo ?? 0);
    });
  }, [isOpen, idTorneo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (equipos.length < 2 || !idLocal || !idVisitante) return setErrorMsg('El torneo debe tener al menos 2 equipos inscritos.');
    if (idLocal === idVisitante) return setErrorMsg('El equipo local y el visitante no pueden ser el mismo.');
    setLoading(true);
    try {
      await onSubmit({
        fecha_hora: fechaHora || new Date().toISOString(),
        id_torneo: Number(idTorneo),
        id_fase: idFase ? Number(idFase) : undefined,
        id_escenario: Number(idEscenario),
        id_pelota: idPelota ? Number(idPelota) : undefined,
        id_equipo_local: Number(idLocal),
        id_equipo_visitante: Number(idVisitante),
      });
      onClose();
    } catch (err) {
      setErrorMsg(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-slate-800">Programar Nuevo Partido</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {errorMsg && <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">{errorMsg}</div>}
          {equipos.length < 2 && idTorneo > 0 && <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">Este torneo tiene {equipos.length} equipo(s) inscrito(s). Se requieren al menos 2 inscritos.</div>}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Torneo</label>
            <select value={idTorneo} onChange={(e) => setIdTorneo(Number(e.target.value))} className="w-full border rounded-lg p-2">
              {torneos.map((t) => <option key={t.id_torneo} value={t.id_torneo}>{t.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Fase (Opcional)</label>
            <select value={idFase || ''} onChange={(e) => setIdFase(e.target.value ? Number(e.target.value) : undefined)} className="w-full border rounded-lg p-2">
              <option value="">Sin fase asignada</option>
              {fases.map((f) => <option key={f.id_fase} value={f.id_fase}>{f.nombre} ({f.tipo})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipo Local</label>
              <select value={idLocal} onChange={(e) => setIdLocal(Number(e.target.value))} className="w-full border rounded-lg p-2">
                {equipos.map((eq) => <option key={eq.id_equipo} value={eq.id_equipo}>{eq.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipo Visitante</label>
              <select value={idVisitante} onChange={(e) => setIdVisitante(Number(e.target.value))} className="w-full border rounded-lg p-2">
                {equipos.map((eq) => <option key={eq.id_equipo} value={eq.id_equipo}>{eq.nombre}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Escenario</label>
            <select value={idEscenario} onChange={(e) => setIdEscenario(Number(e.target.value))} className="w-full border rounded-lg p-2">
              {escenarios.map((esc) => <option key={esc.id_escenario} value={esc.id_escenario}>{esc.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pelota Oficial (Opcional)</label>
            <select value={idPelota || ''} onChange={(e) => setIdPelota(e.target.value ? Number(e.target.value) : undefined)} className="w-full border rounded-lg p-2">
              <option value="">Ninguna</option>
              {pelotas.map((p) => <option key={p.id_pelota} value={p.id_pelota}>{p.referencia} ({p.marca || 'N/A'})</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Fecha y Hora</label>
            <input type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} required className="w-full border rounded-lg p-2" />
          </div>
          <div className="flex gap-2 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Guardando...' : 'Crear Partido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
