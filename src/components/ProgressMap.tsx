/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  Trophy, 
  Zap, 
  Lock,
  Flag,
  Award,
  Sparkles,
  ChevronUp,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface Node {
  id: string;
  label: string;
  type: 'CLASS' | 'EXAM' | 'MILESTONE' | 'PIONEER';
  status: 'COMPLETED' | 'PENDING' | 'LOCKED';
  week: number;
  description?: string;
  speakingAccuracy?: number;
}

const mapData: Node[] = [
  { id: '1', label: 'Mission START', type: 'MILESTONE', status: 'COMPLETED', week: 1, description: 'Protocolo de inducción TECLINGO.' },
  { id: '2', label: 'Vocabulario Base', type: 'CLASS', status: 'COMPLETED', week: 2, description: 'Estructuras fundamentales de comunicación.', speakingAccuracy: 7.8 },
  { id: '3', label: 'Examen Parcial 1', type: 'EXAM', status: 'COMPLETED', week: 3, description: 'Certificación inicial de fundamentos.', speakingAccuracy: 8.5 },
  { id: '4', label: 'Estructuras Avanzadas', type: 'CLASS', status: 'PENDING', week: 4, description: 'Construcción de narrativa compleja.' },
  { id: '5', label: 'Inmersión Lab', type: 'CLASS', status: 'PENDING', week: 5, description: 'Desafío en tiempo real en The Bridge.' },
  { id: '6', label: 'PIONEER DIAMOND', type: 'PIONEER', status: 'LOCKED', week: 6, description: 'Reto de los Primeros 10: Dominio Oral.' },
  { id: '7', label: 'Business Vertical', type: 'CLASS', status: 'LOCKED', week: 7 },
  { id: '8', label: 'Negociación Elite', type: 'CLASS', status: 'LOCKED', week: 8 },
  { id: '9', label: 'Presentación Final', type: 'CLASS', status: 'LOCKED', week: 9 },
  { id: '10', label: 'EXAMEN MAESTRO', type: 'EXAM', status: 'LOCKED', week: 10 },
  { id: '11', label: 'DALLAS VIP GOAL', type: 'MILESTONE', status: 'LOCKED', week: 11, description: 'Cumbre de Excelencia: Dallas Certification.' },
];

export function ProgressMap() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Set initial scroll to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="relative h-full flex flex-col overflow-hidden bg-[#061a1a]">
      {/* Background 3D Grid Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-200px)',
            transformOrigin: 'top'
          }} 
        />
      </div>

      {/* LCD Status Tracker - Top Right */}
      <div className="absolute top-8 right-8 z-[60]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-[#38BDF8]/30 px-6 py-3 rounded-xl flex items-center gap-4 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
        >
          <div className="space-y-0.5">
            <p className="text-[#38BDF8]/40 text-[8px] font-black uppercase tracking-[0.3em]">Protocolo Actual</p>
            <p className="text-white text-xs font-black tracking-widest font-mono">ESTATUS: SEMANA 4</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_10px_#38BDF8]" />
        </motion.div>
      </div>

      <header className="relative z-10 p-8 pb-0">
        <h2 className="text-[#38BDF8] text-[10px] font-black uppercase tracking-[0.5em] mb-2">Ascensión Élite</h2>
        <h1 className="text-4xl font-black text-white bevel-text uppercase tracking-tight">Mission Map</h1>
      </header>

      {/* Scrollable Ascension Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar relative p-8 pt-20 pb-48"
      >
        <div className="relative max-w-2xl mx-auto flex flex-col-reverse items-center gap-32">
          
          {/* The High Voltage Ray - Energy Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 pointer-events-none z-0">
            {/* Background Path (Dimmed) */}
            <div className="absolute inset-0 w-1 left-1/2 -translate-x-1/2 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
            
            {/* Active Path (Energy) */}
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '35%' }} // Based on progress (4/11 weeks)
              className="absolute bottom-0 w-1 left-1/2 -translate-x-1/2 bg-[#38BDF8] shadow-[0_0_20px_#38BDF8,0_0_40px_#38BDF8]"
            >
              {/* Particle Trail Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full blur-[4px] animate-pulse" />
            </motion.div>
          </div>

          {[...mapData].map((node, index) => {
            const isPioneer = node.type === 'PIONEER';
            const isGoal = node.id === '11';
            const isCompleted = node.status === 'COMPLETED';
            const isPending = node.status === 'PENDING';
            const isLocked = node.status === 'LOCKED';

            return (
              <div 
                key={node.id}
                className="relative flex items-center w-full justify-center"
              >
                {/* Visual displacement for "winding" effect in vertical flow */}
                <div className={`relative flex items-center w-full ${index % 2 === 0 ? 'justify-end md:pr-32' : 'justify-start md:pl-32'}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10 group"
                  >
                    {/* Tooltip / Data Reveal on Hover */}
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:-translate-y-2 z-30">
                      <div className="neo-glass bg-[#061a1a]/95 border border-[#38BDF8]/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[#38BDF8] text-[8px] font-black uppercase tracking-widest">Semana {node.week}</p>
                          {node.speakingAccuracy && (
                            <div className="bg-[#38BDF8]/10 text-[#38BDF8] px-2 py-0.5 rounded text-[8px] font-black">
                              {node.speakingAccuracy} ACCURACY
                            </div>
                          )}
                        </div>
                        <h4 className="text-white text-[11px] font-black uppercase tracking-tight mb-1">{node.label}</h4>
                        <p className="text-white/40 text-[9px] font-medium leading-relaxed">{node.description || 'Contenido restringido hasta activación.'}</p>
                      </div>
                    </div>

                    {/* Node Visual Implementation */}
                    {isGoal ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 ${
                          isLocked ? 'grayscale opacity-20' : 'neon-border-glow'
                        }`}
                      >
                        <div className="absolute inset-0 bg-[#DEFF9A]/10 rounded-full animate-ping opacity-20" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-t from-[#DEFF9A]/20 to-white/10 border-2 border-[#DEFF9A]/40 flex items-center justify-center overflow-hidden">
                          <Trophy size={48} className="text-[#DEFF9A] drop-shadow-[0_0_15px_#DEFF9A]" />
                        </div>
                        <div className="absolute -bottom-6 whitespace-nowrap">
                          <span className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em] bevel-text">DALLAS VIP</span>
                        </div>
                      </motion.button>
                    ) : isPioneer ? (
                      <motion.button
                        animate={{ 
                          y: [0, -10, 0],
                          rotateY: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`relative w-20 h-20 flex items-center justify-center transition-all duration-700 ${
                          isLocked ? 'opacity-30' : 'drop-shadow-[0_0_20px_#FBBF24]'
                        }`}
                      >
                        <div className="absolute rotate-45 w-16 h-16 border-2 border-[#FBBF24] bg-gradient-to-br from-[#FBBF24]/40 to-[#B45309]/20" />
                        <Sparkles size={24} className="text-[#FBBF24] relative z-10" />
                        <div className="absolute -bottom-6 whitespace-nowrap">
                          <span className="text-[#FBBF24] text-[9px] font-black uppercase tracking-[0.2em]">PIONEER GOLD</span>
                        </div>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                          isCompleted 
                            ? 'bg-[#38BDF8] border-white/20 text-[#061a1a] shadow-[0_0_30px_rgba(56,189,248,0.5)]' 
                            : isPending
                            ? 'bg-black/60 border-[#38BDF8] text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                            : 'bg-white/5 border-white/10 text-white/10'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={24} strokeWidth={3} />
                        ) : isPending ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Zap size={22} fill="currentColor" />
                          </motion.div>
                        ) : (
                          <Lock size={18} />
                        )}
                        
                        <div className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap hidden sm:block ${
                          index % 2 === 0 ? '-left-4 sm:-left-32' : '-right-4 sm:-right-32'
                        }`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${
                            isLocked ? 'text-white/20' : 'text-white'
                          }`}>
                            {node.label}
                          </p>
                        </div>
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              <ChevronUp size={24} className="animate-bounce" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Scroll to Dallas VIP</span>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-[#061a1a] to-transparent" />
        <div className="absolute bottom-0 w-full h-96 bg-gradient-to-t from-[#061a1a] to-transparent" />
      </div>
    </div>
  );
}
