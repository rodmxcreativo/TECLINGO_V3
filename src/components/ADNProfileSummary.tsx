/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Dna, 
  Brain, 
  Target, 
  Sparkles,
  Zap,
  TrendingUp,
  MessageSquare,
  Mic2,
  Book,
  PenTool,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

const adnStats = [
  { subject: 'Fluidez', A: 65, fullMark: 100 },
  { subject: 'Escritura', A: 58, fullMark: 100 },
  { subject: 'Gramática', A: 71, fullMark: 100 },
  { subject: 'Audición', A: 82, fullMark: 100 },
  { subject: 'Lectura', A: 74, fullMark: 100 },
];

const interestBadges = [
  { label: 'Cineasta', color: 'bg-red-500/10 text-red-400' },
  { label: 'Gaming', color: 'bg-purple-500/10 text-purple-400' },
  { label: 'Techie', color: 'bg-cyan-500/10 text-cyan-400' },
];

const recommendations = [
  { 
    skill: 'Pronunciación', 
    tool: 'The Bridge', 
    icon: Mic2, 
    desc: 'Necesitas ver cómo se mueven los labios en el espejo digital.',
    score: 45,
    accent: '#DEFF9A'
  },
  { 
    skill: 'Estructura', 
    tool: 'Grammar Fixer', 
    icon: Book, 
    desc: 'Para que la IA te explique la lógica mientras escribes tus historias.',
    score: 52,
    accent: '#8B5CF6'
  },
  { 
    skill: 'Miedo a hablar', 
    tool: 'AI Tutor', 
    icon: Brain, 
    desc: 'Practica en un entorno seguro 24/7 sin juicios.',
    score: 38,
    accent: '#22D3EE'
  },
];

export function ADNProfileSummary() {
  return (
    <div className="space-y-10">
       {/* Hero Insight */}
       <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DEFF9A]/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
             <div className="w-24 h-24 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] shadow-[0_0_40px_rgba(222,255,154,0.2)] shrink-0">
                <Dna size={48} className="animate-spin-slow" />
             </div>
             <div className="space-y-4 text-center md:text-left">
                <blockquote className="text-white text-xl md:text-2xl font-black italic leading-tight uppercase tracking-tight">
                   "¡Hola Alex! Tu ADN revela que tienes un motor increíble para el aprendizaje. Tus debilidades no son muros, son solo <span className="text-[#DEFF9A]">áreas que aún no has iluminado</span>. ¡Vamos a por ello!"
                </blockquote>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                   {interestBadges.map(badge => (
                     <span key={badge.label} className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${badge.color}`}>
                        {badge.label}
                     </span>
                   ))}
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-8">
          {/* Radar Insights */}
          <div className="col-span-12 lg:col-span-5">
             <GlassCard title="DNA Skills Radar" icon={Target} accent="green">
                <div className="h-[300px] w-full mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={adnStats}>
                         <PolarGrid stroke="#ffffff10" />
                         <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 900 }} />
                         <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                         <Radar
                            name="Skill Level"
                            dataKey="A"
                            stroke="#DEFF9A"
                            fill="#DEFF9A"
                            fillOpacity={0.4}
                         />
                      </RadarChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-4">
                   <div className="flex items-center justify-between px-2">
                      <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                         <TrendingUp size={12} /> Oportunidades de Crecimiento
                      </span>
                      <span className="text-white/20 text-[8px] font-bold">ACTUALIZADO HOY</span>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-help">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                            <PenTool size={14} />
                         </div>
                         <div>
                            <p className="text-white text-[10px] font-black uppercase tracking-tight">Escritura (Writing)</p>
                            <p className="text-white/20 text-[8px] font-bold">Nivel: Iniciando</p>
                         </div>
                      </div>
                      <ArrowUpRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
                   </div>
                </div>
             </GlassCard>
          </div>

          {/* Actionable Recommendations */}
          <div className="col-span-12 lg:col-span-7">
             <GlassCard title="Misiones Recomendadas" icon={Sparkles} accent="cyan">
                <div className="space-y-4 mt-6">
                   {recommendations.map((rec, i) => (
                     <motion.div 
                        key={i}
                        whileHover={{ x: 10 }}
                        className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row gap-6 items-center"
                     >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 relative overflow-hidden" style={{ color: rec.accent }}>
                           <rec.icon size={28} />
                           <div className="absolute inset-x-0 bottom-0 h-1 bg-current opacity-20" />
                        </div>
                        <div className="flex-1 space-y-1 text-center md:text-left">
                           <div className="flex items-center justify-center md:justify-start gap-3">
                              <h4 className="text-white text-xs font-black uppercase tracking-widest">{rec.skill}</h4>
                              <span className="text-[10px] font-black text-white/20">/ USANDO</span>
                              <span className="text-[10px] font-black" style={{ color: rec.accent }}>{rec.tool}</span>
                           </div>
                           <p className="text-[10px] text-white/40 font-medium leading-relaxed">{rec.desc}</p>
                        </div>
                        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all">
                           Ir a Misión
                        </button>
                     </motion.div>
                   ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-400/20 text-cyan-400">
                         <Trophy size={16} />
                      </div>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Nivel de Adaptabilidad IA: <span className="text-white">92.4%</span></p>
                   </div>
                   <button className="text-[9px] font-black text-[#DEFF9A] uppercase tracking-widest hover:underline decoration-[#DEFF9A]/20">Ver Plan Completo</button>
                </div>
             </GlassCard>
          </div>
       </div>

       {/* Footer Action */}
       <div className="flex flex-col items-center gap-6 py-10">
          <button className="px-10 py-5 rounded-3xl border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#DEFF9A] hover:text-[#061a1a] transition-all shadow-[0_0_30px_rgba(222,255,154,0.1)]">
             Actualizar mi Perfil ADN
          </button>
          <p className="max-w-md text-center text-[9px] font-bold text-white/20 leading-relaxed uppercase tracking-widest px-8">
             Tu ADN evoluciona con tu esfuerzo. Podrás realizar una re-evaluación completa en 90 días o al concluir tu nivel actual.
          </p>
       </div>
    </div>
  );
}
