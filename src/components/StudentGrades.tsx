/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Award, 
  BarChart3, 
  TrendingUp, 
  Target,
  ChevronRight,
  Zap,
  GraduationCap,
  Percent
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

const performanceData = [
  { level: 'A1-Init', score: 72 },
  { level: 'A1-Mid', score: 85 },
  { level: 'A1-Fin', score: 78 },
  { level: 'A2-Init', score: 88 },
  { level: 'A2-Now', score: 92 },
];

const skillsScores = [
  { skill: 'Writing', score: 8.5, max: 10, color: 'text-cyan-400' },
  { skill: 'Listening', score: 9.2, max: 10, color: 'text-purple-400' },
  { skill: 'Reading', score: 7.8, max: 10, color: 'text-orange-400' },
  { skill: 'Grammar', score: 8.0, max: 10, color: 'text-red-400' },
  { skill: 'Speaking', score: 9.5, max: 10, color: 'text-[#DEFF9A]' },
];

export function StudentGrades() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Boleta de Cristal</h2>
          <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Mi Histórico Académico</h1>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Status de Certificación</p>
              <div className="flex items-center gap-2 text-[#DEFF9A] justify-end">
                 <Zap size={18} fill="currentColor" />
                 <span className="text-2xl font-black uppercase">EN CURSO A2</span>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Promedio General Circular */}
        <div className="col-span-12 lg:col-span-4">
           <GlassCard accent="green" className="!p-10 flex flex-col items-center text-center justify-center h-full">
              <div className="relative mb-8">
                 <svg className="w-48 h-48 -rotate-90">
                    <circle 
                      cx="96" cy="96" r="88" 
                      className="stroke-white/5 fill-none" 
                      strokeWidth="12" 
                    />
                    <motion.circle 
                      cx="96" cy="96" r="88" 
                      className="stroke-[#DEFF9A] fill-none" 
                      strokeWidth="12"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 553" }}
                      animate={{ strokeDasharray: "475 553" }} // ~86%
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-black text-white leading-none">8.6</p>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">General GPA</p>
                 </div>
                 <div className="absolute inset-0 bg-[#DEFF9A]/10 blur-[60px] rounded-full -z-10" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-white text-lg font-black uppercase tracking-tight">Rango Estudiantil: ELITE</h4>
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-loose">
                    Estás un 12% arriba del promedio global de tu nivel.
                 </p>
              </div>
           </GlassCard>
        </div>

        {/* Matriz de 5 Skills */}
        <div className="col-span-12 lg:col-span-8">
           <GlassCard title="Matriz de Desempeño por Skill" icon={BarChart3} accent="cyan" className="h-full">
              <div className="grid grid-cols-1 gap-4 mt-4">
                 <div className="grid grid-cols-[1fr_80px_100px] gap-4 px-6 text-[8px] font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-4">
                    <span>Habilidad Fundamental</span>
                    <span className="text-center">Puntaje</span>
                    <span className="text-right">Progreso</span>
                 </div>
                 {skillsScores.map((s) => (
                   <div key={s.skill} className="grid grid-cols-[1fr_80px_100px] gap-4 items-center px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                      <div className="flex items-center gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${s.color.replace('text-', 'bg-')}`} />
                         <span className="text-white text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">{s.skill}</span>
                      </div>
                      <div className="text-center">
                         <span className={`text-xs font-black ${s.color}`}>{s.score} <span className="text-white/20">/ {s.max}</span></span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <div 
                          className={`h-full ${s.color.replace('text-', 'bg-')}`} 
                          style={{ width: `${(s.score/s.max)*100}%` }} 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>

        {/* Historial de Niveles (Line Chart) */}
        <div className="col-span-12">
           <GlassCard title="Evolución de Certificación (Vía TECLINGO PRO 1.1)" icon={TrendingUp} accent="green">
              <div className="h-[300px] w-full mt-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                       <XAxis 
                        dataKey="level" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'black' }} 
                       />
                       <YAxis 
                        domain={[0, 100]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} 
                       />
                       <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                        itemStyle={{ color: '#DEFF9A', fontSize: '12px', fontWeight: 'bold' }}
                       />
                       <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#DEFF9A" 
                        strokeWidth={4} 
                        dot={{ fill: '#DEFF9A', r: 6, strokeWidth: 2, stroke: '#061a1a' }}
                        activeDot={{ r: 8, stroke: '#DEFF9A', strokeWidth: 2, fill: '#0a0c10' }}
                       />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-12">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                       <Target size={24} />
                    </div>
                    <div>
                       <p className="text-white text-[10px] font-black uppercase tracking-widest">Target B2</p>
                       <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">En curso: 82% logrado</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                       <GraduationCap size={24} />
                    </div>
                    <div>
                       <p className="text-white text-[10px] font-black uppercase tracking-widest">A1 Certified</p>
                       <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Cerrado con 8.4 GPA</p>
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
