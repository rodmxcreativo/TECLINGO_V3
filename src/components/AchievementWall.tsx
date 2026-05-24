/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Award, 
  Zap, 
  Leaf, 
  History, 
  Medal,
  ChevronRight,
  Sparkles,
  Calendar,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext } from '../context/AppContext';
import { Logro } from './logrosSchema';

export function AchievementWall() {
  const { logros } = useAppContext();
  const [detalleLogro, setDetalleLogro] = useState<Logro | null>(null);

  // Compute total points safely
  const totalPuntos = logros.reduce((acc, curr) => acc + (curr.puntos || 0), 0);

  const recentFeed = [
    { user: 'Martha S.', text: 'Alcanzó Nivel B2 con 98% de precisión vocal', time: '12m' },
    { user: 'Pedro J.', text: 'Completó 50 horas de práctica en The Bridge', time: '45m' },
    { user: 'Inst. TECLINGO', text: 'Nueva reducción de costos operativos: $12k USD', time: '2h' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-12 gap-8 pb-32 font-sans text-left text-white"
    >
      <div className="col-span-12 lg:col-span-9 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Reconocimiento Institucional</h2>
            <h1 className="text-4xl font-black tracking-tighter text-white bevel-text uppercase leading-none mb-1">Muro de Logros</h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Cada hito es una medalla digital grabada directamente en tu perfil.</p>
          </div>
          
          <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 shrink-0">
             <div className="text-right">
                <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Total Impacto</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-3xl font-black text-[#DEFF9A] leading-none">{totalPuntos}</p>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Puntos</p>
                </div>
             </div>
             <Trophy size={40} className="text-[#F59E0B] shadow-[0_0_30px_#F59E0B] opacity-80" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logros.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className="relative group rounded-[2.5rem] p-6 bg-white/[0.02] border border-white/10 flex flex-col justify-between hover:border-[#DEFF9A]/30 transition-all duration-500 overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#DEFF9A]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
              
              <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/5 flex items-center gap-1.5 text-xs font-bold text-[#DEFF9A]/80 font-mono">
                    <span className="text-[10px] uppercase font-black tracking-wider text-cyan-400">
                      {item.metrica}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest mb-0.5">Métrica</p>
                    <p className="text-xs font-mono font-black text-emerald-400">
                      ✓ Completada
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#080d0d] flex items-center justify-center border border-white/5 text-2xl shadow-inner group-hover:scale-110 transition duration-300 shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-1 truncate flex-1">
                    <h3 className="text-md font-black text-white tracking-tight uppercase truncate">{item.titulo}</h3>
                    <p className="text-white/40 text-[11px] leading-snug">{item.subtitulo}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#DEFF9A] font-mono">+{item.puntos} Pts</span>
                  </div>
                  <button 
                    onClick={() => setDetalleLogro(item)}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors cursor-pointer"
                  >
                    Ver Detalles <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3 space-y-6">
        <GlassCard title="Últimos Logros" icon={Sparkles} accent="green">
          <div className="space-y-4 text-left">
            {recentFeed.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                   <span className="text-[10px] font-black text-[#DEFF9A] uppercase tracking-wider">{log.user}</span>
                   <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{log.time}</span>
                </div>
                <p className="text-[11px] text-white/60 font-medium leading-snug uppercase">{log.text}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#DEFF9A]/20 to-transparent border border-[#DEFF9A]/20 text-center space-y-4">
           <div className="w-16 h-16 rounded-full bg-[#DEFF9A] shadow-[0_0_30px_#DEFF9A80] mx-auto flex items-center justify-center text-[#061a1a]">
              <Trophy size={32} />
           </div>
           <h4 className="text-white text-lg font-black uppercase tracking-tighter">Líder Semanal</h4>
           <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Inmersion Hub Dallas</p>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                className="h-full bg-[#DEFF9A]"
              />
           </div>
           <p className="text-[10px] text-[#DEFF9A] font-black uppercase tracking-widest">850 Puntos de Reducción CO2</p>
        </div>
      </div>

      {/* DETAIL MODAL: AUDIT LOG */}
      <AnimatePresence>
        {detalleLogro && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#080d0d] border border-white/10 rounded-[2.5rem] w-full max-w-md p-6 shadow-2xl relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[60px] pointer-events-none rounded-full" />
              
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-3xl border border-white/5 shrink-0">
                  {detalleLogro.icon}
                </div>
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-tight">{detalleLogro.titulo}</h3>
                  <p className="font-mono text-[9px] text-[#DEFF9A] font-black uppercase tracking-wider">
                    Otorgado el {detalleLogro.fechaAsignado}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-white/80 leading-normal">
                  <span className="text-[9px] text-white/30 uppercase block font-black mb-1.5">
                    Evidencia Registrada por Docente:
                  </span>
                  "{detalleLogro.evidenciaDocente}"
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <UserCheck size={14} className="text-[#DEFF9A]" />
                    Evaluador: <strong className="text-white/80">{detalleLogro.mentor || "Sistema Autogestionado"}</strong>
                  </span>
                  <span className="text-[#40c057] font-black uppercase">
                    +{detalleLogro.puntos} Pts Aplicados
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setDetalleLogro(null)}
                className="mt-6 w-full haptic-button rounded-xl py-3 text-[10px] font-black uppercase tracking-widest text-[#DEFF9A]/80 hover:text-[#DEFF9A] hover:bg-white/5 transition"
              >
                Cerrar Auditoría
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
