/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Headphones, 
  ChevronLeft, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Music2, 
  Globe2, 
  Wind, 
  Volume2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ListeningLab({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [accent, setAccent] = useState('Dallas');
  const [speed, setSpeed] = useState(1);
  const [backgroundNoise, setBackgroundNoise] = useState(false);

  const fullText = "The global economy is facing unprecedented challenges in the digital era.";
  const ghostText = fullText.split(' ').map(word => "*".repeat(word.length)).join(' ');

  const accents = [
    { name: 'Dallas', country: 'USA' },
    { name: 'London', country: 'UK' },
    { name: 'Sydney', country: 'AUS' },
    { name: 'New York', country: 'USA' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-[#061a1a] flex flex-col"
    >
      {/* Header */}
      <header className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <button 
          onClick={onClose}
          className="flex items-center gap-3 text-white/40 hover:text-orange-400 transition-colors"
        >
           <ChevronLeft size={20} />
           <span className="text-[10px] font-black uppercase tracking-widest">Regresar</span>
        </button>

        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.1)]">
              <Headphones size={24} />
           </div>
           <div>
              <h1 className="text-white text-lg font-black uppercase tracking-tight">Listening Lab</h1>
              <p className="text-orange-400 text-[8px] font-black uppercase tracking-[0.3em]">IA Audio Immersion</p>
           </div>
        </div>

        <div className="flex gap-4">
           {accents.map((acc) => (
             <button
               key={acc.name}
               onClick={() => setAccent(acc.name)}
               className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                 accent === acc.name 
                   ? 'bg-orange-400 border-orange-400 text-[#061a1a]' 
                   : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
               }`}
             >
                {acc.name}
             </button>
           ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
         {/* Visualizer and Player */}
         <div className="w-full max-w-4xl space-y-12">
            {/* Waveform Spectrum */}
            <div className="h-48 w-full flex items-center justify-center gap-1.5 px-12">
               {Array.from({ length: 60 }).map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ 
                     height: isPlaying ? [20, Math.random() * 120 + 20, 20] : 10,
                     opacity: isPlaying ? [0.4, 1, 0.4] : 0.2
                   }}
                   transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.02 }}
                   className={`w-1.5 rounded-full ${isPlaying ? 'bg-orange-400' : 'bg-white/10'}`}
                 />
               ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-8">
               <div className="flex items-center gap-12">
                  <button className="text-white/20 hover:text-white transition-colors"><SkipBack size={32} /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-orange-400 text-[#061a1a] flex items-center justify-center shadow-[0_0_40px_rgba(251,146,60,0.3)] hover:scale-110 transition-transform"
                  >
                     {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                  </button>
                  <button className="text-white/20 hover:text-white transition-colors"><SkipForward size={32} /></button>
               </div>

               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Velocidad</span>
                     <div className="flex gap-2">
                        {[0.5, 0.75, 1, 1.25].map(s => (
                          <button 
                            key={s}
                            onClick={() => setSpeed(s)}
                            className={`px-3 py-1 rounded-lg text-[9px] font-black border transition-all ${
                              speed === s ? 'bg-orange-400 border-orange-400 text-[#061a1a]' : 'bg-white/5 border-white/10 text-white/40'
                            }`}
                          >
                             {s}x
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <button 
                    onClick={() => setBackgroundNoise(!backgroundNoise)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                      backgroundNoise ? 'bg-sky-400/10 border-sky-400 text-sky-300' : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                     <Wind size={16} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Ruido Ambiente</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Dictation Area / Ghost Subtitles */}
         <div className="w-full max-w-2xl text-center space-y-6">
            <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative">
               <button 
                onClick={() => setShowSubtitles(!showSubtitles)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
               >
                  {showSubtitles ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
               <h3 className="text-white text-2xl font-black uppercase tracking-tight leading-relaxed">
                  {showSubtitles ? fullText : ghostText}
               </h3>
               <p className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">DICTADO VIRTUAL IA</p>
            </div>
            <p className="text-white/40 text-[9px] font-medium leading-loose italic">
               Escucha atentamente. Escribe lo que escuchas en la consola (Próximamente) o activa los 'Ghost Subtitles' para validar tu comprensión.
            </p>
         </div>
      </div>
    </motion.div>
  );
}
