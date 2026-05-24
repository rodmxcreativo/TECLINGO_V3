/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ClipboardList, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Play,
  Zap,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

interface Task {
  id: string;
  title: string;
  deadline: string;
  timeLeft: string;
  status: 'PENDIENTE' | 'ENTREGADO';
  type: 'TAREA' | 'PROYECTO';
}

const mockTasks: Task[] = [
  { id: '1', title: 'Airport Vocabulary Review', deadline: 'Today, 11:59 PM', timeLeft: '12h 45m', status: 'PENDIENTE', type: 'TAREA' },
  { id: '2', title: 'AR Scenario: Coffee Shop', deadline: 'Tomorrow, 08:00 AM', timeLeft: '1d 0h', status: 'PENDIENTE', type: 'TAREA' },
  { id: '3', title: 'Listening Unit 4 Practice', deadline: 'May 15, 2026', timeLeft: '2d 4h', status: 'ENTREGADO', type: 'TAREA' },
  { id: '4', title: 'Video: Self Introduction', deadline: 'May 20, 2026', timeLeft: '7d 0h', status: 'PENDIENTE', type: 'PROYECTO' },
];

export function StudentTasks() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Control de Responsabilidad</h2>
          <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Tareas y Evaluaciones</h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
           <AlertCircle className="text-orange-400" size={20} />
           <span className="text-xs font-black text-white uppercase tracking-widest">3 TAREAS PENDIENTES ESTA SEMANA</span>
        </div>
      </header>

      {/* Seccion Exámenes (Highlighted) */}
      <div className="p-1 px-1 rounded-[3rem] bg-gradient-to-r from-cyan-500/20 via-[#DEFF9A]/20 to-orange-500/20 shadow-[0_0_50px_rgba(222,255,154,0.1)]">
         <GlassCard className="!bg-[#061a1a]/80 !border-0 !p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 relative">
               <Zap className="animate-pulse" size={48} fill="currentColor" />
               <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
               <div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">Evaluación Activa</span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mt-2">Examen Parcial: Listening & Grammar A1</h3>
               </div>
               <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xl">
                 Este examen evalúa tus capacidades de comprensión auditiva y estructuras gramaticales básicas vistas en el bloque 1. Asegúrate de estar en un lugar tranquilo.
               </p>
            </div>
            <button className="px-10 py-5 bg-cyan-500 text-[#061a1a] rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(6,182,212,0.4)] flex items-center gap-3 hover:scale-105 transition-transform">
               <Play size={16} fill="currentColor" /> Iniciar Evaluación
            </button>
         </GlassCard>
      </div>

      {/* Seccion Tareas Grid */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-white text-xl font-black uppercase tracking-tight flex items-center gap-3">
               <ClipboardList className="text-[#DEFF9A]" size={20} /> Listado de Actividades
            </h3>
            <div className="flex gap-2">
               <button className="px-4 py-2 rounded-xl bg-[#DEFF9A]/10 text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest border border-[#DEFF9A]/20">Todas</button>
               <button className="px-4 py-2 rounded-xl bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest border border-white/5">Pendientes</button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTasks.map((task) => (
              <motion.div 
                key={task.id}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-[#DEFF9A]/20 transition-all group flex flex-col justify-between h-full"
              >
                 <div className="space-y-6">
                    <div className="flex justify-between items-start">
                       <div className={`p-3 rounded-2xl ${task.status === 'ENTREGADO' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-white/5 text-white/40'}`}>
                          {task.status === 'ENTREGADO' ? <CheckCircle2 size={20} /> : <BookOpen size={20} />}
                       </div>
                       <span className={`text-[8px] font-black px-2 py-1 rounded-full border ${
                         task.type === 'PROYECTO' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-white/5 text-white/20 border-white/10'
                       }`}>
                          {task.type}
                       </span>
                    </div>

                    <div>
                       <h4 className="text-white text-lg font-black uppercase tracking-tight group-hover:text-[#DEFF9A] transition-colors">{task.title}</h4>
                       <div className="flex items-center gap-2 mt-2 text-white/20 text-[9px] font-bold uppercase tracking-widest">
                          <Calendar size={10} /> {task.deadline}
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    {task.status === 'PENDIENTE' ? (
                      <div className="flex items-center gap-2 text-orange-400">
                         <Clock size={12} className="animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{task.timeLeft}</span>
                      </div>
                    ) : (
                      <span className="text-[#4ADE80] text-[10px] font-black uppercase tracking-widest italic">Completado</span>
                    )}

                    <button className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      task.status === 'ENTREGADO' 
                        ? 'bg-white/5 text-white/30 border border-white/10' 
                        : 'bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20 hover:bg-[#DEFF9A] hover:text-[#061a1a]'
                    }`}>
                       {task.status === 'ENTREGADO' ? 'Ver Entrega' : 'Entregar'}
                    </button>
                 </div>
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
