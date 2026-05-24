/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Sparkles, 
  Calendar, 
  Trophy, 
  ChevronRight, 
  X, 
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ClubVIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProgress: number; // 0 to 100
}

export function ClubVIPModal({ isOpen, onClose, studentProgress }: ClubVIPModalProps) {
  const isEligibleByMerit = studentProgress >= 80;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#061a1a]/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#061a1a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(222,255,154,0.1)]"
          >
            {/* Header / Banner */}
            <div className="relative h-48 bg-gradient-to-br from-[#DEFF9A]/20 via-cyan-500/10 to-transparent p-12 flex items-center gap-8 overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80')] bg-cover opacity-10 mix-blend-overlay" />
               <div className="w-20 h-20 rounded-3xl bg-[#DEFF9A]/20 border border-[#DEFF9A]/30 flex items-center justify-center text-[#DEFF9A] shadow-glow relative z-10">
                  <Trophy size={40} />
               </div>
               <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">CLUB VIP <span className="text-[#DEFF9A]">ALTO RENDIMIENTO</span></h2>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Membresía Extracurricular Exclusiva</p>
               </div>
               <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
               >
                  <X size={24} />
               </button>
            </div>

            <div className="p-8 md:p-12 space-y-10">
               <div>
                  <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 border-b border-white/5 pb-4 italic">¿CÓMO DESBLOQUEAR TU ACCESO?</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Vía A: Temporal */}
                     <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 relative group">
                        <div className="absolute top-4 right-4 text-white/10">
                           <Calendar size={32} />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                           <Lock size={18} />
                        </div>
                        <h4 className="text-white font-black text-xs uppercase tracking-tight">Vía A: Temporada</h4>
                        <p className="text-white/40 text-[10px] leading-relaxed">
                           Apertura automática durante la <span className="text-cyan-400">Temporada Vacacional</span>. Acceso libre para toda la comunidad institucional.
                        </p>
                        <div className="pt-2">
                           <span className="text-[10px] font-black text-cyan-400/40 uppercase tracking-widest">Estado: BLOQUEADO</span>
                        </div>
                     </div>

                     {/* Vía B: Mérito */}
                     <div className={`p-6 rounded-3xl border-2 space-y-4 relative overflow-hidden transition-all duration-500 ${
                       isEligibleByMerit 
                         ? 'bg-[#DEFF9A]/10 border-[#DEFF9A] shadow-[0_0_30px_rgba(222,255,154,0.1)]' 
                         : 'bg-white/[0.02] border-white/5 opacity-60'
                     }`}>
                        {isEligibleByMerit && (
                           <div className="absolute top-0 right-0 p-3 bg-[#DEFF9A] text-[#061a1a]">
                              <ShieldCheck size={14} />
                           </div>
                        )}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEligibleByMerit ? 'bg-[#DEFF9A] text-[#061a1a]' : 'bg-white/5 border border-white/10 text-white/20'}`}>
                           {isEligibleByMerit ? <Zap size={18} fill="currentColor" /> : <TrendingUp size={18} />}
                        </div>
                        <h4 className="text-white font-black text-xs uppercase tracking-tight">Vía B: Mérito Académico</h4>
                        <p className="text-white/40 text-[10px] leading-relaxed">
                           Desbloqueo inmediato si alcanzas un <span className="text-white font-black">80% de progreso</span> en tu ruta actual.
                        </p>
                        
                        <div className="space-y-3 pt-2 text-center">
                           <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/40 italic">
                              <span>Progreso: {studentProgress}%</span>
                              <span>Meta: 80%</span>
                           </div>
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min(studentProgress, 100)}%` }}
                                 className={`h-full rounded-full ${isEligibleByMerit ? 'bg-[#DEFF9A]' : 'bg-white/20'}`}
                              />
                           </div>
                           {isEligibleByMerit && (
                              <button className="w-full py-3 bg-[#DEFF9A] text-[#061a1a] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                 ENTRAR AHORA
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 rounded-2xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/10 text-center">
                  <p className="text-white/60 text-[11px] font-medium leading-relaxed italic">
                    "El Club VIP es un espacio de alto rendimiento donde la IA diseña retos de inmersión total 24/7. Solo los alumnos más disciplinados dominan esta tecnología."
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
