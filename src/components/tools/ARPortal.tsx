/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Box, 
  ChevronLeft, 
  Maximize2, 
  MapPin, 
  Cpu, 
  Target,
  Layers,
  UtensilsCrossed,
  Plane,
  Home,
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../GlassCard';

export function ARPortal({ onClose }: { onClose: () => void }) {
  const [isScanning, setIsScanning] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const scenarios = [
    { id: 'restaurant', label: 'Restaurante', icon: UtensilsCrossed, difficulty: 'A2' },
    { id: 'airport', label: 'Aeropuerto', icon: Plane, difficulty: 'B1' },
    { id: 'home', label: 'Mi Casa', icon: Home, difficulty: 'A1' },
  ];

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
            className="flex items-center gap-3 text-white/40 hover:text-cyan-400 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/30">
               <ChevronLeft size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Regresar al Toolkit</span>
          </button>

          <div className="text-center">
             <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">AR Portal</h1>
             <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em]">Spatial Interaction Engine</p>
          </div>

          <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
             <Cpu size={16} className="animate-spin-slow" />
             <span className="text-[9px] font-black uppercase tracking-widest leading-none">Neural Mesh Active</span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8 flex-1">
           {/* Sidebar: Scenarios */}
           <div className="col-span-12 lg:col-span-3 space-y-6">
              <h3 className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-8">Selecciona tu Entorno</h3>
              {scenarios.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedScenario(scene.id)}
                  className={`w-full p-6 rounded-[2rem] border transition-all flex flex-col items-center text-center gap-4 ${
                    selectedScenario === scene.id 
                      ? 'bg-cyan-400/10 border-cyan-400 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
                      : 'bg-white/[0.02] border-white/10 text-white/40 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                   <scene.icon size={32} />
                   <div>
                      <h4 className="text-sm font-black uppercase tracking-tight">{scene.label}</h4>
                      <p className="text-[9px] font-black opacity-40 mt-1">NIVEL {scene.difficulty}</p>
                   </div>
                </button>
              ))}
           </div>

           {/* Content: AR Viewport */}
           <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
              <div className="relative flex-1 rounded-[3rem] bg-[#0a0c10] border border-white/10 overflow-hidden min-h-[500px]">
                 {/* AR Scanning Grid Animation */}
                 {isScanning && (
                   <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,211,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,211,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                      <motion.div 
                        initial={{ top: '-10%' }}
                        animate={{ top: '110%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,1)] z-30"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-center space-y-4">
                            <ScanLine size={48} className="text-cyan-400 animate-pulse mx-auto" />
                            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Mapping Reality Mesh...</p>
                         </div>
                      </div>
                   </div>
                 )}

                 {/* AR Scene Content */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80')] bg-cover bg-center grayscale contrast-125 opacity-40" />
                 
                 <AnimatePresence>
                    {!isScanning && selectedScenario && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 w-full h-full p-12"
                      >
                         {/* Interaction Nodes */}
                         <div className="absolute top-1/2 left-1/3 group">
                            <div className="relative">
                               <motion.div 
                                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                                 transition={{ duration: 1.5, repeat: Infinity }}
                                 className="absolute -inset-4 bg-cyan-400 rounded-full blur-[20px]"
                               />
                               <button className="relative w-8 h-8 rounded-full bg-cyan-400 text-[#061a1a] flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                  <Target size={16} />
                               </button>
                               <div className="absolute top-0 left-12 w-64 p-4 rounded-2xl neo-glass border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 translate-x-4 group-hover:translate-x-0">
                                  <p className="text-cyan-400 text-[8px] font-black uppercase mb-1">Mueble / Objeto</p>
                                  <h5 className="text-white text-base font-black uppercase tracking-tight">DINING TABLE</h5>
                                  <div className="mt-4 p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                                     <p className="text-white text-[10px] font-medium leading-relaxed italic">"Excuse me, could we have a table for two?"</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="absolute bottom-1/4 right-1/4 group">
                            <div className="relative">
                               <motion.div 
                                 animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.1, 0.4] }}
                                 transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                 className="absolute -inset-6 bg-cyan-400 rounded-full blur-[25px]"
                               />
                               <button className="relative w-10 h-10 rounded-full bg-cyan-400 text-[#061a1a] flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.5)] border-4 border-[#0a0c10]">
                                  <HelpCircle size={20} />
                               </button>
                               <div className="absolute bottom-12 right-0 w-64 p-4 rounded-2xl neo-glass border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 -translate-y-4 group-hover:translate-y-0">
                                  <h5 className="text-white text-base font-black uppercase tracking-tight">INTERACTUAR</h5>
                                  <p className="text-white/40 text-[9px] font-bold mt-2">Pide el menú al mesero virtual.</p>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>

                 {/* Focus Frame Overlay */}
                 <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-12 left-12 w-24 h-24 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-3xl" />
                    <div className="absolute top-12 right-12 w-24 h-24 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-3xl" />
                    <div className="absolute bottom-12 left-12 w-24 h-24 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-3xl" />
                    <div className="absolute bottom-12 right-12 w-24 h-24 border-b-2 border-r-2 border-cyan-400/50 rounded-br-3xl" />
                 </div>
              </div>

              {/* Status Bar */}
              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <Layers className="text-cyan-400" size={16} />
                       <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">IA Objects: 12 Detected</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <MapPin className="text-cyan-400" size={16} />
                       <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">Ground Locked</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">Streaming 4K Active</span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan-400 cursor-pointer">
                       <Maximize2 size={18} />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function HelpCircle(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
