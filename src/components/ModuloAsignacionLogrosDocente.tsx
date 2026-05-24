/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CATALOGO_LOGROS, Logro } from './logrosSchema';
import { useAppContext } from '../context/AppContext';
import { Award, ShieldAlert, Sparkles, Trophy, CheckCircle, ListChecks } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const ALUMNOS_SELECCIONABLES = [
  { id: '1', nombre: 'Martha S.', nivel: 'B2', racha: 21 },
  { id: '2', nombre: 'Pedro J.', nivel: 'A1', racha: 5 },
  { id: '3', nombre: 'Mario Moreno', nivel: 'A2', racha: 14 },
  { id: '4', nombre: 'Juan P.', nivel: 'A1', racha: 12 },
  { id: '5', nombre: 'Maria G.', nivel: 'B1', racha: 9 },
  { id: '6', nombre: 'Luis M.', nivel: 'A2', racha: 3 },
  { id: '7', nombre: 'Ana S.', nivel: 'B2', racha: 18 }
];

export default function ModuloAsignacionLogrosDocente() {
  const { addLogro, logros } = useAppContext();
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('1');
  const [logroSeleccionado, setLogroSeleccionado] = useState(0);
  const [evidencia, setEvidencia] = useState('');
  const [notificacion, setNotificacion] = useState('');

  const otorgarMedalla = (e: React.FormEvent) => {
    e.preventDefault();
    const alumno = ALUMNOS_SELECCIONABLES.find(a => a.id === alumnoSeleccionado);
    const medalla = CATALOGO_LOGROS[logroSeleccionado];

    if (!evidencia.trim()) {
      alert("Por favor, introduce una justificación o evidencia del logro.");
      return;
    }

    const nuevoLogro: Logro = {
      id: `logro_${Date.now()}`,
      idAlumno: alumnoSeleccionado,
      nombreAlumno: alumno?.nombre || 'Estudiante',
      titulo: medalla.titulo,
      subtitulo: medalla.sub,
      metrica: medalla.metrica,
      categoria: medalla.categoria,
      icon: medalla.icon,
      color: medalla.color,
      puntos: medalla.puntos,
      fechaAsignado: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      evidenciaDocente: evidencia,
      mentor: "Profra. Ana López"
    };

    addLogro(nuevoLogro);

    setNotificacion(`🎉 ¡Medalla "${medalla.titulo}" asignada con éxito a ${alumno?.nombre}!`);
    setEvidencia('');
    setTimeout(() => setNotificacion(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#4ADE80]/5 blur-[60px] pointer-events-none rounded-full" />
            
            <div className="border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={16} className="text-[#DEFF9A]" />
                <span className="text-[#DEFF9A] text-[9px] font-mono font-black uppercase tracking-[0.3em]">
                  RECONOCIMIENTOS INSTITUCIONALES
                </span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Asignación de Logros</h2>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider mt-1">
                Premia el esfuerzo académico, la constancia digital y el impacto ecológico.
              </p>
            </div>

            <form onSubmit={otorgarMedalla} className="space-y-6">
              
              {/* 1. SELECCIÓN DE ALUMNO */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">
                  1. Seleccionar Estudiante:
                </label>
                <select 
                  value={alumnoSeleccionado}
                  onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                  className="w-full bg-[#080d0d] border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] transition duration-300 outline-none"
                >
                  {ALUMNOS_SELECCIONABLES.map(al => (
                    <option key={al.id} value={al.id}>
                      {al.nombre} (Nivel {al.nivel} • Racha: {al.racha}d)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. SELECCIÓN DE MEDALLA DISPONIBLE */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">
                  2. Seleccionar Medalla a Otorgar:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATALOGO_LOGROS.map((med, idx) => (
                    <button
                      key={med.titulo}
                      type="button"
                      onClick={() => setLogroSeleccionado(idx)}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition duration-300 cursor-pointer haptic-press ${
                        logroSeleccionado === idx 
                          ? 'bg-[#4ADE80]/10 border-[#4ADE80] shadow-[0_0_20px_rgba(74,222,128,0.1)]' 
                          : 'bg-[#080d0d] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-2xl border border-white/5">
                        {med.icon}
                      </div>
                      <div className="truncate flex-1">
                        <div className="text-xs font-black text-white truncate uppercase">{med.titulo}</div>
                        <div className="text-[9px] text-[#DEFF9A] font-bold font-mono mt-0.5">
                          {med.metrica} • +{med.puntos} Pts
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. CRITERIO / EVIDENCIA DE EVALUACIÓN */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">
                  3. Justificación Pedagógica / Evidencia del Salón:
                </label>
                <textarea 
                  rows={3} 
                  required 
                  value={evidencia}
                  onChange={(e) => setEvidencia(e.target.value)}
                  placeholder="Ej. Alcanzó un 98% de precisión en el ejercicio de conversación presencial sobre viajes..."
                  className="w-full bg-[#080d0d] border border-white/10 rounded-2xl p-4 text-xs font-mono text-slate-200 resize-none focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] transition duration-300 outline-none"
                />
              </div>

              {/* NOTIFICACIÓN Y ENVÍO */}
              <div className="pt-2 flex flex-col gap-4">
                {notificacion && (
                  <div className="text-[11px] font-mono text-[#4ADE80] bg-[#4ADE80]/5 p-3 rounded-2xl border border-[#4ADE80]/15 text-center font-bold animate-pulse">
                    {notificacion}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full haptic-button-primary rounded-2xl py-4 flex items-center justify-center gap-2 text-xs font-black"
                >
                  Grabar Hito en Perfil del Alumno 🏅
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History / Audit Feed Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ListChecks size={16} className="text-[#DEFF9A]" />
                <h3 className="text-white text-xs font-black uppercase tracking-wider">
                  Histórico de Asignaciones
                </h3>
              </div>
              <span className="text-[8px] font-mono font-black px-2 py-0.5 bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] rounded-md">
                LIVE LOGGER
              </span>
            </div>

            <p className="text-white/40 text-[9px] leading-relaxed uppercase font-bold tracking-wide mb-4 text-left">
              Registros guardados en este navegador e indexados en el Hub central del servidor:
            </p>

            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin">
              {logros.length === 0 ? (
                <div className="py-12 text-center text-white/30 text-[10px] font-bold uppercase tracking-widest">
                  Sin asignaciones en esta sesión.
                </div>
              ) : (
                logros.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2 text-left hover:border-white/10 transition duration-300"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <p className="text-xs font-black text-white uppercase truncate max-w-[150px]">{item.titulo}</p>
                          <p className="text-[8px] text-white/30 font-bold uppercase">{item.fechaAsignado} • Por {item.mentor}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-[#40c057]/10 text-[#40c057] border border-[#40c057]/15 rounded text-[8px] font-mono font-black shrink-0">
                        +{item.puntos} Pts
                      </span>
                    </div>
                    <div className="text-[10px] bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-white/60 leading-normal">
                      <span className="text-[8px] text-[#DEFF9A] block font-bold uppercase mb-0.5">Asignado a: {item.nombreAlumno}</span>
                      "{item.evidenciaDocente}"
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
