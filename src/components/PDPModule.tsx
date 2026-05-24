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
  Target, 
  Zap, 
  BrainCircuit, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

const data = [
  { subject: 'Speaking', A: 120, B: 110, fullMark: 150 },
  { subject: 'Listening', A: 98, B: 130, fullMark: 150 },
  { subject: 'Reading', A: 86, B: 130, fullMark: 150 },
  { subject: 'Writing', A: 99, B: 100, fullMark: 150 },
];

export function PDPModule() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Personal Development Plan</h2>
          <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Estrategia de Crecimiento AI</h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
           <Target className="text-[#DEFF9A]" size={20} />
           <span className="text-xs font-black text-white uppercase tracking-widest">NIVEL OBJETIVO: B2 (INTERMEDIATE)</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Neon Radar Chart */}
        <div className="col-span-12 lg:col-span-7">
          <GlassCard title="Mapa de Habilidades TECLINGO" icon={TrendingUp} accent="green">
            <div className="h-[400px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 150]} 
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#DEFF9A"
                    fill="#DEFF9A"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-white/20 text-[8px] font-black uppercase mb-1">Punto más Fuerte</p>
                  <p className="text-[#DEFF9A] text-xs font-black uppercase tracking-widest">Speaking (85%)</p>
               </div>
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-white/20 text-[8px] font-black uppercase mb-1">Área Crítica</p>
                  <p className="text-orange-400 text-xs font-black uppercase tracking-widest">Reading (32%)</p>
               </div>
            </div>
          </GlassCard>
        </div>

        {/* AI Insight Sidebar */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
           <GlassCard title="Análisis de Precisión AI" icon={BrainCircuit} accent="cyan">
              <div className="space-y-6">
                 <div className="p-6 rounded-3xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/10">
                    <p className="text-xs font-black text-[#DEFF9A] uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Zap size={14} /> Recomendación del Tutor
                    </p>
                    <p className="text-white/60 text-[11px] leading-relaxed italic border-l-2 border-[#DEFF9A]/40 pl-4">
                      "Detectamos una caída en tu retención de lectura. He ajustado tu plan de hoy para incluir 2 sesiones adicionales de 'English Contextual Reading' en 'The Bridge'."
                    </p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-white/40">Probabilidad de Éxito B2</span>
                       <span className="text-[#22D3EE]">72%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '72%' }}
                        className="h-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]" 
                       />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-white/5">
                    <button className="w-full py-4 bg-[#DEFF9A] text-[#061a1a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10_30px_rgba(222,255,154,0.3)] flex items-center justify-center gap-2">
                       Optimizar PDP Ahora <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
           </GlassCard>

           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#DEFF9A]/10 to-transparent border border-[#DEFF9A]/20">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck size={20} className="text-[#DEFF9A]" />
                 <h4 className="text-white text-[11px] font-black uppercase tracking-widest">Validación de Nivel</h4>
              </div>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                 Tu progreso está validado bajo el estándar TECLINGO PRO 1.1 para garantizar resultados operativos reales.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
