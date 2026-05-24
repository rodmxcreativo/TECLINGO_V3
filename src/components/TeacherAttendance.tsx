/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  Download,
  Calendar,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

const attendanceByDay = [
  { day: 'Lun', percentage: 98 },
  { day: 'Mar', percentage: 85 },
  { day: 'Mie', percentage: 92 },
  { day: 'Jue', percentage: 78 },
  { day: 'Vie', percentage: 88 },
];

const studentsRecord = [
  { id: '1', name: 'JUAN PÉREZ', photo: 'https://i.pravatar.cc/150?u=1', attendance: '98%', trend: [1, 1, 1, 0, 1, 1, 1] },
  { id: '2', name: 'MARIA GARCIA', photo: 'https://i.pravatar.cc/150?u=2', attendance: '85%', trend: [1, 0, 1, 1, 0, 1, 1] },
  { id: '3', name: 'LUIS MARTINEZ', photo: 'https://i.pravatar.cc/150?u=3', attendance: '72%', trend: [0, 0, 1, 1, 0, 0, 1], alerts: true },
  { id: '4', name: 'ANA SÁNCHEZ', photo: 'https://i.pravatar.cc/150?u=4', attendance: '100%', trend: [1, 1, 1, 1, 1, 1, 1] },
  { id: '5', name: 'PEDRO RODRIGUEZ', photo: 'https://i.pravatar.cc/150?u=5', attendance: '92%', trend: [1, 1, 0, 1, 1, 1, 1] },
];

export function TeacherAttendance() {
  const [selectedGroup, setSelectedGroup] = useState('A1-102');
  const [range, setRange] = useState('SEMANA');

  return (
    <div className="space-y-12 pb-32">
      {/* Header & Filters */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Reporte Analítico</h2>
           <h1 className="text-4xl font-black text-white bevel-text uppercase tracking-tight">Módulo de Asistencias</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="relative">
              <select 
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-6 py-3 pr-12 text-[10px] font-black uppercase tracking-widest text-[#DEFF9A] outline-none"
              >
                 <option value="A1-102" className="bg-[#0a0c10]">Grupo A1-102</option>
                 <option value="B2-201" className="bg-[#0a0c10]">Grupo B2-201</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
           </div>

           <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
              {['HOY', 'SEMANA', 'MES', 'CICLO'].map((r) => (
                <button 
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                    range === r ? 'bg-[#DEFF9A] text-[#061a1a]' : 'text-white/20 hover:text-white'
                  }`}
                >
                   {r}
                </button>
              ))}
           </div>

           <button className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl text-cyan-400 hover:bg-white/10 transition-all">
              <Filter size={18} />
           </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <GlassCard accent="green" className="!p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/10 blur-[60px] rounded-full" />
            <div className="flex items-center gap-6">
               <div className="relative">
                  <svg className="w-20 h-20 -rotate-90">
                     <circle cx="40" cy="40" r="36" className="stroke-white/5 fill-none" strokeWidth="6" />
                     <motion.circle 
                       cx="40" cy="40" r="36" 
                       className="stroke-[#DEFF9A] fill-none" 
                       strokeWidth="6"
                       strokeLinecap="round"
                       initial={{ strokeDasharray: "0 226" }}
                       animate={{ strokeDasharray: "208 226" }} // 92%
                     />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-xl font-black text-white">92%</span>
                  </div>
               </div>
               <div>
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Asistencia Total</p>
                  <h3 className="text-white text-lg font-black uppercase">KPI Saludable</h3>
                  <p className="text-[#DEFF9A] text-[10px] font-bold mt-1 tracking-tight">+5% vs anterior</p>
               </div>
            </div>
         </GlassCard>

         <GlassCard accent="cyan" className="!p-8">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Clock size={40} />
               </div>
               <div>
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Puntualidad QR</p>
                  <h3 className="text-white text-3xl font-black uppercase">08:04 <span className="text-[10px] text-white/40">AM</span></h3>
                  <p className="text-cyan-400 text-[10px] font-bold mt-1 tracking-tight">PROMEDIO ENTRADA</p>
               </div>
            </div>
         </GlassCard>

         <GlassCard accent="orange" className="!p-8">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 relative">
                  <AlertTriangle size={40} />
                  <span className="absolute top-0 right-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-[#061a1a] text-[10px] font-black border-4 border-[#0a0c10]">2</span>
               </div>
               <div>
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Alertas Deserción</p>
                  <h3 className="text-white text-lg font-black uppercase">Riesgo Detectado</h3>
                  <p className="text-orange-400 text-[10px] font-bold mt-1 tracking-tight">2 ALUMNOS CRÍTICOS</p>
               </div>
            </div>
         </GlassCard>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-12 gap-8">
         {/* Attendance Weekly Chart */}
         <div className="col-span-12 lg:col-span-8">
            <GlassCard title="Rendimiento Semanal del Grupo" icon={BarChart3} accent="green">
               <div className="h-[350px] w-full mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={attendanceByDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="day" 
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
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                        />
                        <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                           {attendanceByDay.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.percentage > 90 ? '#DEFF9A' : entry.percentage > 80 ? '#22D3EE' : '#F87171'} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </GlassCard>
         </div>

         {/* Heatmap/Calendar Placeholder */}
         <div className="col-span-12 lg:col-span-4">
            <GlassCard title="Heatmap Mensual" icon={Calendar} accent="cyan">
               <div className="grid grid-cols-7 gap-2 mt-8">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const intensity = Math.random();
                    return (
                      <div 
                        key={i} 
                        className="aspect-square rounded-lg border border-white/5 transition-all hover:scale-110"
                        style={{ 
                          backgroundColor: intensity > 0.8 ? '#DEFF9A' : intensity > 0.5 ? 'rgba(222,255,154,0.4)' : intensity > 0.2 ? 'rgba(222,255,154,0.1)' : 'rgba(255,255,255,0.02)',
                          boxShadow: intensity > 0.8 ? '0 0 10px rgba(222,255,154,0.3)' : 'none'
                        }}
                      />
                    );
                  })}
               </div>
               <div className="mt-8 flex items-center justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                  <span>Asistencia Baja</span>
                  <div className="flex gap-1">
                     {[0.1, 0.4, 0.8].map((v, i) => (
                       <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(222,255,154, ${v})` }} />
                     ))}
                  </div>
                  <span>Éxito Total</span>
               </div>
            </GlassCard>
         </div>
      </div>

      {/* Detailed Student Table */}
      <GlassCard title="Trend Individual de Asistencia" icon={Users} accent="green">
         <div className="overflow-x-auto custom-scrollbar -mx-6 px-6">
            <table className="w-full mt-6">
               <thead>
                  <tr className="text-left text-[9px] font-black text-white/20 uppercase tracking-widest border-b border-white/5">
                     <th className="pb-6 px-4">Alumno</th>
                     <th className="pb-6 px-4 text-center">Porcentaje</th>
                     <th className="pb-6 px-4">Trend (Últimos 7 días)</th>
                     <th className="pb-6 px-4 text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {studentsRecord.map((student) => (
                    <tr key={student.id} className="group hover:bg-white/[0.02] transition-all">
                       <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                             <div className="relative">
                                <img src={student.photo} className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                {student.alerts && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse border-2 border-[#0a0c10]" />
                                )}
                             </div>
                             <div>
                                <p className="text-white text-xs font-black uppercase tracking-tight">{student.name}</p>
                                <p className="text-white/20 text-[8px] font-bold uppercase mt-1">ID: ROD-2026-00{student.id}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-6 px-4 text-center">
                          <span className={`text-xs font-black ${parseInt(student.attendance) > 90 ? 'text-[#DEFF9A]' : parseInt(student.attendance) > 80 ? 'text-cyan-400' : 'text-orange-400'}`}>
                             {student.attendance}
                          </span>
                       </td>
                       <td className="py-6 px-4">
                          <div className="flex gap-2">
                             {student.trend.map((v, i) => (
                               <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full shadow-sm ${v === 1 ? 'bg-[#4ADE80] shadow-[0_0_5px_#4ADE80]' : 'bg-red-500/20'}`}
                               />
                             ))}
                          </div>
                       </td>
                       <td className="py-6 px-4">
                          <div className="flex justify-end gap-3">
                             <button className="p-2.5 rounded-xl bg-white/5 text-white/30 hover:text-white transition-all">
                                <Search size={14} />
                             </button>
                             <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-[#DEFF9A] hover:bg-[#DEFF9A]/10 transition-all">
                                <Download size={14} /> Reporte
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </GlassCard>
    </div>
  );
}
