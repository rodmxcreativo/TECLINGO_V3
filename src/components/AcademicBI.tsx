/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { GlassCard } from './GlassCard';
import { Activity, Brain, Lightbulb, TrendingUp } from 'lucide-react';

const academicData = [
  { name: 'W1', progress: 10, planning: 12 },
  { name: 'W2', progress: 25, planning: 24 },
  { name: 'W3', progress: 35, planning: 36 },
  { name: 'W4', progress: 48, planning: 48 },
  { name: 'W5', progress: 55, planning: 60 },
  { name: 'W6', progress: 68, planning: 72 },
  { name: 'W7', progress: 82, planning: 84 },
  { name: 'W8', progress: 85, planning: 96 },
];

const skillData = [
  { name: 'Speaking', value: 85, color: '#DEFF9A' },
  { name: 'Grammar', value: 60, color: '#4ADE80' },
  { name: 'Reading', value: 75, color: '#22D3EE' },
  { name: 'Writing', value: 65, color: '#F59E0B' },
];

export function AcademicBI() {
  return (
    <GlassCard 
      title="Business Intelligence Académico" 
      icon={Activity}
      className="col-span-12 lg:col-span-8"
      delay={0.2}
    >
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={academicData}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DEFF9A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#DEFF9A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a1a1a', border: '1px solid #DEFF9A20', borderRadius: '12px' }}
                  itemStyle={{ color: '#DEFF9A', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#DEFF9A" 
                  fillOpacity={1} 
                  fill="url(#colorProgress)" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="planning" 
                  stroke="#ffffff20" 
                  fill="transparent" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex gap-6">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#DEFF9A]" />
                <span className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Progreso Actual</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-dashed border-white/40" />
                <span className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Planeación Week 8</span>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/10 relative group-hover:border-[#DEFF9A]/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-[#DEFF9A]" size={18} />
              <h4 className="text-[#DEFF9A] text-xs font-bold uppercase tracking-[0.1em]">AI Asesor de Datos</h4>
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              Alerta: Grupo A1-104 rezago <span className="text-[#F59E0B]">15% Speaking</span>. Sugerencia: Activación Roleplay "Aeropuerto" (AR).
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Skill Mastery</h5>
            <div className="space-y-3">
              {skillData.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-white/60">{skill.name}</span>
                    <span className="text-white">{skill.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${skill.value}%`, backgroundColor: skill.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <h5 className="text-[9px] font-black uppercase tracking-widest text-[#22D3EE] flex items-center gap-2">
              <Activity size={12} /> Impacto de Asistencia
            </h5>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black text-white">88%</span>
              <span className="text-[8px] font-bold text-[#DEFF9A] uppercase tracking-widest mb-1">vs 94% Objetivo</span>
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed">
              La correlación indica que el <span className="text-white/60 font-bold">12% de inasistencia</span> en el Grupo A1-102 está frenando el avance en <span className="text-[#DEFF9A]">Reading</span> por 2 semanas.
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
