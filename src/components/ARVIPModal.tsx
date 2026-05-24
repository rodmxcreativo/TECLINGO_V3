/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Box, Zap, ChevronRight, Globe, Wind } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface ARVIPModalProps {
  onClose: () => void;
  userProgress: number;
}

export function ARVIPModal({ onClose, userProgress }: ARVIPModalProps) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playEffect = (type: 'scan' | 'rev') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'scan') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    } else {
      // Race car rev
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (type === 'scan' ? 0.5 : 1.2));
  };

  useEffect(() => {
    playEffect('scan');
  }, []);

  const handleClose = () => {
    playEffect('rev');
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-12 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#061a1a]/90 backdrop-blur-2xl" 
        onClick={handleClose} 
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative w-full max-w-4xl neo-glass border-[#38BDF8]/30 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(56,189,248,0.15)] flex flex-col md:flex-row min-h-[500px]"
      >
        {/* Left Side: Visual Teaser */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#38BDF8]/20 to-[#061a1a] p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-[#38BDF8] rounded-2xl flex items-center justify-center text-[#061a1a] shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                 <Box size={24} />
              </div>
              <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none">DALLAS<br/>VIP PORTAL</h1>
            </div>

            <div className="relative z-10">
               <div className="flex -space-x-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-[#061a1a] bg-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/150?u=vip${i}`} alt="VIP user" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-[#061a1a] bg-[#38BDF8] flex items-center justify-center text-[#061a1a] text-[10px] font-black">
                     +82
                  </div>
               </div>
               <p className="text-[10px] font-black text-[#38BDF8] uppercase tracking-[0.3em]">Exclusivo Elite TECLINGO</p>
            </div>

            {/* Animation Element */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
               className="absolute -right-20 -bottom-20 w-80 h-80 border-2 border-[#38BDF8]/10 rounded-full flex items-center justify-center"
            >
               <div className="w-60 h-60 border border-[#38BDF8]/20 rounded-full" />
            </motion.div>
        </div>

        {/* Right Side: Requisitos */}
        <div className="md:w-7/12 p-12 flex flex-col justify-center space-y-8 bg-black/40">
           <button 
             onClick={handleClose}
             className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
           >
              <X size={24} />
           </button>

           <div className="space-y-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">PORTAL DE INMERSIÓN TOTAL</h2>
              <p className="text-white/50 text-sm font-medium leading-relaxed">
                ¿Estás listo para teletransportarte? Cruza el portal y practica tu inglés en una oficina real de Dallas o en un aeropuerto internacional mediante Realidad Virtual 360°.
              </p>
           </div>

           <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-[#FBBF24]/30 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <Lock className="text-[#FBBF24] animate-bounce" size={20} />
              </div>
              
              <div className="space-y-2">
                 <h4 className="text-[#FBBF24] text-[10px] font-black uppercase tracking-[0.3em]">REQUISITO DE ÉLITE</h4>
                 <p className="text-white text-lg font-black uppercase italic">90% de Progreso Académico</p>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">ESTADO ACTUAL</span>
                    <span className="text-[#22D3EE] font-mono font-black text-lg">{userProgress}%</span>
                 </div>
                 <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${userProgress}%` }}
                       className="h-full bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] rounded-full shadow-[0_0_15px_#22D3EE]"
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#DEFF9A] shrink-0">
                    <Globe size={20} />
                 </div>
                 <div>
                    <h5 className="text-white text-[10px] font-black uppercase">Escenarios Globales</h5>
                    <p className="text-white/20 text-[9px] font-bold mt-1">Dallas Office, London Airport, NYC Coffee Shop.</p>
                 </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/10">
                 <p className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-widest text-center leading-relaxed italic">
                   "Sigue subiendo el voltaje de tu aprendizaje. Al llegar al 90%, el portal se abrirá y tu visor VR cobrará vida."
                 </p>
              </div>
           </div>

           <button 
             onClick={handleClose}
             className="w-full py-5 rounded-2xl border border-white/10 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
           >
              VOLVER AL DASHBOARD <ChevronRight size={14} />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
