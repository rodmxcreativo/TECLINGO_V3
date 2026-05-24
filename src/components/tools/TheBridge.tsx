/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  ChevronLeft, 
  Mic, 
  Play, 
  Video, 
  RefreshCw, 
  Trophy,
  AlertCircle,
  Check,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../GlassCard';
import { VoltageMeter } from '../ui/VoltageMeter';

interface Phoneme {
  char: string;
  isCorrect: boolean | null;
}

export function TheBridge({ onClose }: { onClose: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const phrase = "The quick brown fox jumps over the lazy dog";

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    // Simulate IA processing
    setTimeout(() => {
      setIsProcessing(false);
      setMatchScore(Math.floor(Math.random() * 20) + 78); // Simulate reach native match
    }, 2000);
  };
  const phonemes: Phoneme[] = phrase.split('').map(char => ({
    char,
    isCorrect: Math.random() > 0.5 ? true : (Math.random() > 0.8 ? false : null)
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-[#061a1a]/98 backdrop-blur-3xl overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto p-8 py-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={onClose}
            className="flex items-center gap-3 text-white/40 hover:text-[#DEFF9A] transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#DEFF9A]/30">
               <ChevronLeft size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Regresar al Toolkit</span>
          </button>

          <div className="text-center">
             <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">The Bridge</h1>
             <p className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-[0.3em]">AI Pronunciation Lab · Beta 1.0</p>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Nativa Similitud</p>
                <p className="text-2xl font-black text-[#DEFF9A] tracking-tighter">84%</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] shadow-[0_0_20px_rgba(222,255,154,0.1)]">
                <Trophy size={20} />
             </div>
          </div>
        </header>

        {/* Main Interface: Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           {/* Lado Izquierdo: AI Master */}
           <div className="space-y-6">
              <GlassCard accent="green" className="relative aspect-video overflow-hidden group">
                 <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" 
                      className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" 
                      alt="AI Teacher"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061a1a] via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
                       <div>
                          <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest mb-2">Native Speaker</p>
                          <h4 className="text-white text-xl font-black uppercase tracking-tight">MS. EMILY AI</h4>
                       </div>
                       <button className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#DEFF9A] hover:text-[#061a1a] transition-all group/btn">
                          <Play size={24} fill="currentColor" className="ml-1" />
                       </button>
                    </div>
                 </div>
                 <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-[#DEFF9A] text-[#061a1a] text-[9px] font-black uppercase tracking-widest">
                    MODELO DE REFERENCIA
                 </div>
              </GlassCard>

              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                 <div className="space-y-4">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Frase Objetivo</p>
                    <div className="flex flex-wrap gap-1 leading-relaxed">
                       {phrase.split(' ').map((word, wIdx) => (
                         <span key={wIdx} className="text-2xl font-black text-white uppercase tracking-tight mr-3">
                            {word.split('').map((char, cIdx) => (
                              <span key={cIdx} className={Math.random() > 0.8 ? 'text-orange-400' : 'text-white'}>{char}</span>
                            ))}
                         </span>
                       ))}
                    </div>
                 </div>

                 {/* High-Voltage Analog Meter */}
                 <div className="pt-8 border-t border-white/5">
                    <VoltageMeter value={matchScore} isProcessing={isProcessing} />
                 </div>
              </div>
           </div>

           {/* Lado Derecho: Alumno / Recording */}
           <div className="space-y-6">
              <GlassCard accent="green" className="relative aspect-video overflow-hidden">
                 <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                    {/* Placeholder for Camera */}
                    <div className="text-center space-y-4 opacity-20">
                       <Video size={64} className="mx-auto" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Cámara Desactivada</p>
                    </div>
                    {/* Recording Overlay */}
                    <AnimatePresence>
                       {isRecording && (
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           className="absolute inset-0 bg-[#DEFF9A]/10 border-4 border-[#DEFF9A]"
                         >
                            <div className="absolute top-6 right-6 flex items-center gap-3">
                               <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                               <span className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">REC EN VIVO</span>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              </GlassCard>

              <div className="flex-1 p-8 rounded-[2.5rem] bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 flex flex-col items-center justify-center text-center space-y-8">
                 {/* Real-time Waveform */}
                 <div className="h-32 w-full flex items-center justify-center gap-1">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ 
                          height: isRecording ? [10, Math.random() * 80 + 10, 10] : 10,
                          opacity: isRecording ? 1 : 0.2
                        }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.01 }}
                        className="w-1 rounded-full bg-[#DEFF9A]"
                      />
                    ))}
                 </div>

                 <div className="flex items-center gap-8">
                    <button 
                      onMouseDown={() => setIsRecording(true)}
                      onMouseUp={handleStopRecording}
                      disabled={isProcessing}
                      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                        isRecording 
                          ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] scale-90' 
                          : isProcessing
                          ? 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
                          : 'bg-[#DEFF9A] text-[#061a1a] shadow-[0_0_30px_rgba(222,255,154,0.3)] hover:scale-110'
                      }`}
                    >
                       {isProcessing ? (
                         <RefreshCw size={40} className="animate-spin text-[#DEFF9A]" />
                       ) : (
                         <Mic size={40} fill={isRecording ? 'none' : 'currentColor'} stroke={isRecording ? 'white' : 'currentColor'} />
                       )}
                    </button>
                 </div>
                 <p className="text-white/30 text-[10px] font-black uppercase tracking-widest italic">Mantén presionado para grabar tu pronunciación</p>
              </div>
           </div>
        </div>

        {/* Bottom Feedback Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-400/20 text-orange-400 flex items-center justify-center">
                 <AlertCircle size={24} />
              </div>
              <div className="flex-1">
                 <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Debilidad Fonética</p>
                 <h5 className="text-white text-xs font-black uppercase">Consonante "R" (Rolled)</h5>
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-400/20 text-blue-400 flex items-center justify-center">
                 <RefreshCw size={24} />
              </div>
              <div className="flex-1">
                 <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Consejo IA</p>
                 <h5 className="text-white text-xs font-black uppercase">Relaja la lengua en "laz-y"</h5>
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/20 text-[#DEFF9A] flex items-center justify-center">
                 <Check size={24} />
              </div>
              <div className="flex-1">
                 <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Acierto Clave</p>
                 <h5 className="text-white text-xs font-black uppercase">Entonación Perfecta</h5>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
