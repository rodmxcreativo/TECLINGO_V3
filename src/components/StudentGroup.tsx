/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, Star, Award, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

const classmates = [
  { id: '1', name: 'JUAN PÉREZ', level: 'A1', streak: 12, status: 'ONLINE', photo: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'MARIA GARCIA', level: 'A1', streak: 8, status: 'OFFLINE', photo: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'LUIS MARTINEZ', level: 'A1', streak: 21, status: 'ONLINE', photo: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'ANA SÁNCHEZ', level: 'A1', streak: 5, status: 'ONLINE', photo: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'PEDRO RODRIGUEZ', level: 'A1', streak: 15, status: 'OFFLINE', photo: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'SOFIA LÓPEZ', level: 'A1', streak: 3, status: 'ONLINE', photo: 'https://i.pravatar.cc/150?u=6' },
];

export function StudentGroup() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Comunidad Inmersiva</h2>
          <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Mi Grupo: B1-Dallas</h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
           <Users className="text-[#DEFF9A]" size={20} />
           <span className="text-xs font-black text-white uppercase tracking-widest">24 INTEGRANTES TOTALES</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Classmates List */}
        <div className="col-span-12 lg:col-span-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classmates.map((student) => (
                <motion.div 
                  key={student.id}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-[#DEFF9A]/20 transition-all flex items-center gap-6 group"
                >
                   <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/10">
                         <img src={student.photo} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#061a1a] ${
                        student.status === 'ONLINE' ? 'bg-[#4ADE80]' : 'bg-white/10'
                      }`} />
                   </div>

                   <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-black uppercase tracking-tight truncate">{student.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                         <span className="text-[9px] font-black text-[#DEFF9A] uppercase tracking-widest bg-[#DEFF9A]/05 px-2 py-0.5 rounded-full border border-[#DEFF9A]/10">
                            {student.level}
                         </span>
                         <span className="text-white/20 text-[9px]">•</span>
                         <div className="flex items-center gap-1 text-[#F59E0B]">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[9px] font-black uppercase">{student.streak} DÍAS</span>
                         </div>
                      </div>
                   </div>

                   <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:bg-[#DEFF9A] hover:text-[#061a1a] transition-all">
                      <MessageCircle size={18} />
                   </button>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Global Group Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <GlassCard title="Estatus Colectivo" icon={Award} accent="green">
              <div className="space-y-6">
                 <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Ritmo del Grupo</p>
                    <p className="text-3xl font-black text-[#DEFF9A] bevel-text">84%</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Eficacia Promedio</p>
                 </div>

                 <div className="space-y-4">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Metas del Mes:</p>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-bold uppercase text-white/60 tracking-tight">Writing Challenge</span>
                       <span className="text-[10px] font-black text-[#DEFF9A]">DONE</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-bold uppercase text-white/60 tracking-tight">Listening Marathon</span>
                       <span className="text-[10px] font-black text-white/20">IN PROGRESS</span>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/5">
                    <button className="w-full py-4 bg-[#DEFF9A]/05 border border-[#DEFF9A]/20 text-[#DEFF9A] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#DEFF9A] hover:text-[#061a1a] transition-all">
                       Ver Leaderboard
                    </button>
                 </div>
              </div>
           </GlassCard>

           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#22D3EE]/10 to-transparent border border-[#22D3EE]/20">
              <div className="flex items-center gap-3 mb-4">
                 <Zap size={20} className="text-[#22D3EE]" />
                 <h4 className="text-white text-[11px] font-black uppercase tracking-widest">Próxima Actividad</h4>
              </div>
              <p className="text-white/60 text-[10px] font-medium leading-relaxed mb-4">
                Mañana tendremos la sesión de "The Bridge" grupal. Prepárate con tu QR institucional.
              </p>
              <p className="text-[#22D3EE] text-[9px] font-black uppercase tracking-widest animate-pulse">08:00 AM • Lab 4-A</p>
           </div>
        </div>
      </div>
    </div>
  );
}
