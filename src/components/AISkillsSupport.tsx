/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Waves, 
  Box, 
  MessageSquare, 
  Edit3, 
  Headphones, 
  Zap, 
  TrendingUp,
  ChevronRight,
  Sparkles,
  Search,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { TheBridge } from './tools/TheBridge';
import { ARPortal } from './tools/ARPortal';
import { TestMaker } from './tools/TestMaker';
import { AITutor } from './tools/AITutor';
import { ListeningLab } from './tools/ListeningLab';
import { GrammarFixer } from './tools/GrammarFixer';
import { ExtracurricularModal } from './ExtracurricularModal';
import { ARVIPModal } from './ARVIPModal';
import { useAppContext } from '../context/AppContext';

interface Skill {
  name: string;
  progress: number;
  color: string;
}

const skills: Skill[] = [
  { name: 'Writing', progress: 65, color: '#22D3EE' },
  { name: 'Listening', progress: 80, color: '#A855F7' },
  { name: 'Reading', progress: 70, color: '#F59E0B' },
  { name: 'Grammar', progress: 55, color: '#EF4444' },
  { name: 'Speaking', progress: 90, color: '#DEFF9A' },
];

export function AISkillsSupport() {
  const { userProgress } = useAppContext();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [showARVIPModal, setShowARVIPModal] = useState(false);

  const handleARClick = () => {
    if (userProgress < 90) {
      setShowARVIPModal(true);
    } else {
      setActiveTool('ar');
    }
  };

  const ToolButton = ({ label, onClick, accent = 'green' }: { label: string, onClick?: () => void, accent?: 'green' | 'cyan' | 'purple' | 'white' }) => {
    const colors = {
      green: 'bg-[#DEFF9A]/10 border-[#DEFF9A] text-[#DEFF9A] shadow-[0_0_15px_rgba(222,255,154,0.2)]',
      cyan: 'bg-cyan-400/10 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]',
      purple: 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
      white: 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
    };

    return (
      <button 
        onClick={onClick}
        className={`px-8 py-3 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${colors[accent]}`}
      >
        VAMOS AHORA
      </button>
    );
  };

  return (
    <div className="space-y-12 pb-32">
      {/* A. Perfil e Información (Header) */}
      <GlassCard accent="green" className="!p-0 overflow-hidden">
        <div className="relative p-10 flex flex-col md:flex-row items-center gap-8">
           <div className="absolute inset-0 bg-gradient-to-r from-[#DEFF9A]/5 to-transparent pointer-events-none" />
           <div className="relative">
              <div className="w-32 h-32 rounded-full border-2 border-[#DEFF9A] p-1 shadow-[0_0_20px_rgba(222,255,154,0.3)]">
                 <img 
                   src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" 
                   className="w-full h-full rounded-full object-cover"
                   alt="Student"
                 />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#DEFF9A] rounded-xl flex items-center justify-center text-[#061a1a] shadow-lg">
                 <Zap size={20} fill="currentColor" />
              </div>
           </div>

           <div className="text-center md:text-left flex-1 space-y-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">ALUMNO_01: ALEX RIVERA</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/5 border border-white/5">ID: ROD-2026-STU01</span>
                 <span className="text-[10px] font-black text-[#DEFF9A] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 shadow-[0_0_15px_rgba(222,255,154,0.1)]">NIVEL ACTUAL: A1 (BEGINNER)</span>
              </div>
           </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-12 gap-8">
        {/* B. Monitor de 5 Skills (Progress Matrix) */}
        <div className="col-span-12 lg:col-span-5">
           <GlassCard title="Monitor de 5 Skills" icon={TrendingUp} accent="cyan" className="h-full">
              <div className="space-y-8 py-4">
                 {skills.map((skill) => (
                   <div key={skill.name} className="space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{skill.name}</span>
                         <span className="text-xs font-black leading-none" style={{ color: skill.color }}>{skill.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${skill.progress}%` }}
                           transition={{ duration: 1.5, ease: 'easeOut' }}
                           className="h-full rounded-full relative"
                           style={{ backgroundColor: skill.color }}
                         >
                            <div 
                              className="absolute inset-0 blur-[4px] opacity-50" 
                              style={{ backgroundColor: skill.color }} 
                            />
                         </motion.div>
                      </div>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 leading-loose">
                      Tu dominio promedio es de 72%.<br/>Enfócate en Gramática para subir al nivel A2.
                    </p>
                 </div>
              </div>
           </GlassCard>
        </div>

        {/* C. AI Toolkit (Botones) */}
        <div className="col-span-12 lg:col-span-7">
           <GlassCard title="Ecosistema AI Alumno" icon={Sparkles} accent="green">
              <div className="mb-8">
                 <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/20">
                    <span className="w-2 h-2 rounded-full bg-[#DEFF9A] animate-pulse" />
                    <span className="text-[9px] font-black text-[#DEFF9A] uppercase tracking-widest">Update 2026.4: Completado</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* The Bridge */}
                 <div className="p-8 rounded-[2.5rem] bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 flex flex-col items-center text-center group hover:bg-[#DEFF9A]/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DEFF9A] to-transparent" />
                    <Waves className="text-[#DEFF9A] mb-4 group-hover:scale-110 transition-transform" size={40} />
                    <h4 className="text-white text-lg font-black uppercase tracking-tight">The Bridge</h4>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-2 mb-8">Inmersión IA & Pronunciación</p>
                    <ToolButton label="VAMOS AHORA" onClick={() => setActiveTool('bridge')} accent="green" />
                 </div>

                 {/* AR Portal VIP Gateway */}
                 <motion.div 
                   onClick={handleARClick}
                   className={`p-8 rounded-[2.5rem] flex flex-col items-center text-center group cursor-pointer transition-all relative overflow-hidden ${
                     userProgress < 90 
                       ? 'bg-black/40 border border-[#38BDF8]/40 opacity-70 hover:opacity-100 hover:border-[#38BDF8] shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]' 
                       : 'bg-[#38BDF8]/5 border border-[#38BDF8] hover:bg-[#38BDF8]/10 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                   }`}
                 >
                    {/* Glowing background for VIP */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative mb-4">
                       <Box className="text-[#38BDF8] group-hover:scale-110 transition-transform" size={40} />
                       {userProgress < 90 && (
                          <motion.div 
                            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-[#FBBF24] rounded-lg flex items-center justify-center text-[#061a1a] shadow-[0_0_15px_#FBBF24]"
                          >
                             <Lock size={14} fill="currentColor" />
                          </motion.div>
                       )}
                    </div>

                    <h4 className="text-white text-lg font-black uppercase tracking-tight relative z-10">
                       {userProgress < 90 ? 'DALLAS VIP ACCESS' : 'AR PORTAL'}
                    </h4>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-2 mb-8 relative z-10">
                       {userProgress < 90 ? 'SOLO PARA ÉLITE 90%' : 'ESCENARIOS EN REALIDAD AUMENTADA'}
                    </p>
                    
                    <button className={`px-8 py-3 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
                      userProgress < 90 
                        ? 'border-[#38BDF8]/30 text-[#38BDF8]' 
                        : 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]'
                    }`}>
                       {userProgress < 90 ? 'BLOQUEADO' : 'VAMOS AHORA'}
                    </button>

                    {/* Scan effect */}
                    <motion.div 
                       animate={{ y: [0, 100, 0] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-0 bg-gradient-to-b from-transparent via-[#38BDF8]/5 to-transparent h-20 w-full pointer-events-none"
                    />
                 </motion.div>

                 {/* Creador de Exámenes */}
                 <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    <Edit3 className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={40} />
                    <h4 className="text-white text-lg font-black uppercase tracking-tight">Test Maker</h4>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-2 mb-8">Evaluación Adaptativa IA</p>
                    <ToolButton label="VAMOS AHORA" onClick={() => setActiveTool('test')} accent="purple" />
                 </div>

                 {/* AI Tutor */}
                 <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all">
                    <MessageSquare className="text-white/40 mb-4 group-hover:scale-110 transition-transform" size={40} />
                    <h4 className="text-white text-lg font-black uppercase tracking-tight">AI Tutor</h4>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-2 mb-8">Apoyo Pedagógico 24/7</p>
                    <ToolButton label="VAMOS AHORA" onClick={() => setActiveTool('tutor')} accent="white" />
                 </div>

                 {/* Extra Tools Row */}
                 <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all">
                       <Headphones className="text-orange-400 mb-3" size={32} />
                       <span className="text-white text-[10px] font-black uppercase tracking-tight mb-4">Listening Lab</span>
                       <button 
                        onClick={() => setActiveTool('listening')}
                        className="w-full py-2.5 rounded-xl border border-orange-400/30 text-orange-400 text-[8px] font-black uppercase tracking-widest hover:bg-orange-400/10 transition-all"
                       >
                          VAMOS AHORA
                       </button>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all">
                       <TrendingUp className="text-blue-400 mb-3" size={32} />
                       <span className="text-white text-[10px] font-black uppercase tracking-tight mb-4">Grammar Fixer</span>
                       <button 
                        onClick={() => setActiveTool('grammar')}
                        className="w-full py-2.5 rounded-xl border border-blue-400/30 text-blue-400 text-[8px] font-black uppercase tracking-widest hover:bg-blue-400/10 transition-all"
                       >
                          VAMOS AHORA
                       </button>
                    </div>

                    {/* Extracurriculares (MODULO ESPECIAL CON ACCESO VIP) */}
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 flex flex-col items-center text-center relative group overflow-hidden transition-all hover:bg-white/[0.05]">
                       <div className="absolute top-0 right-0 p-3">
                          <Zap size={14} className="text-[#DEFF9A] opacity-30 group-hover:opacity-100 transition-opacity" />
                       </div>
                       <Sparkles className="text-[#FBBF24] mb-3 animate-pulse" size={32} />
                       <span className="text-white text-[10px] font-black uppercase tracking-tight mb-4">Extracurricular</span>
                       <button 
                        onClick={() => setShowExtraModal(true)}
                        className="w-full py-2.5 rounded-xl border border-[#DEFF9A]/30 text-[#DEFF9A] text-[8px] font-black uppercase tracking-widest hover:bg-[#DEFF9A] hover:text-[#061a1a] transition-all"
                       >
                          PRÓXIMAMENTE
                       </button>
                       
                       {/* Glass Tooltip */}
                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-[#0a0c10] border border-white/10 text-[8px] font-bold text-[#DEFF9A] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-2xl backdrop-blur-md">
                          Acceso VIP: Reto Pioneer
                       </div>
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Detail Modules */}
      <AnimatePresence mode="wait">
        {activeTool === 'bridge' && (
          <TheBridge onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'ar' && (
          <ARPortal onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'test' && (
          <TestMaker onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'tutor' && (
          <AITutor onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'listening' && (
          <ListeningLab onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'grammar' && (
          <GrammarFixer onClose={() => setActiveTool(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExtraModal && (
          <ExtracurricularModal 
            onClose={() => setShowExtraModal(false)} 
          />
        )}
        {showARVIPModal && (
          <ARVIPModal 
            onClose={() => setShowARVIPModal(false)} 
            userProgress={userProgress}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
