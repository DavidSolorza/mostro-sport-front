import React, { useState, useEffect } from 'react';
import { CreatePartidoDto } from '../domain/partidoModels';
import { stubsService } from '../../stubs/application/stubsService';
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

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      stubsService.getTorneos(),
      stubsService.getEscenarios(),
      stubsService.getEquipos(),
      stubsService.getPelotas(),
    ]).then(([t, esc, eq, p]) => {
      setTorneos(t);
      setEscenarios(esc);
      setEquipos(eq);
      setPelotas(p);
      if (t.length > 0) setIdTorneo(t[0].id_torneo);
      if (esc.length > 0) setIdEscenario(esc[0].id_escenario);
      if (eq.length > 1) {
        setIdLocal(eq[0].id_equipo);
        setIdVisitante(eq[1].id_equipo);
      }
    });
  }, [isOpen]);

  useEffect(() => {
    if (!idTorneo) return;
    stubsService.getFases(idTorneo).then(setFases);
  }, [idTorneo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idLocal === idVisitante) {
      alert('El equipo local y el visitante no pueden ser el mismo.');
      return;
    }
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
