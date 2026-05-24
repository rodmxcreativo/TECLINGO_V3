/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Tooltip } from 'recharts';
import { 
  Smile, 
  Frown, 
  Meh, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp,
  Brain,
  Hash
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

const sentimentData = [
  { name: 'Felicidad', value: 88, fill: '#DEFF9A' },
  { name: 'Compromiso', value: 75, fill: '#4ADE80' },
  { name: 'Satisfación', value: 92, fill: '#22D3EE' },
];

const keywords = [
  { text: 'Inmersivo', size: 'text-2xl', color: 'text-[#DEFF9A]' },
  { text: 'Fluidez', size: 'text-xl', color: 'text-white' },
  { text: 'Práctica', size: 'text-lg', color: 'text-[#4ADE80]' },
  { text: 'Gramática', size: 'text-sm', color: 'text-white/40' },
  { text: 'Roleplay', size: 'text-2xl', color: 'text-[#DEFF9A]' },
  { text: 'Acento', size: 'text-base', color: 'text-white/60' },
  { text: 'Divertido', size: 'text-xl', color: 'text-[#22D3EE]' },
  { text: 'Desafío', size: 'text-sm', color: 'text-white/30' },
  { text: 'ZeroPaper', size: 'text-lg', color: 'text-[#DEFF9A]' },
  { text: 'Pánuco', size: 'text-base', color: 'text-white/50' },
];

const dropoutAlerts = [
  { student: 'Héctor Ruiz', group: 'A1-104', risk: 'HIGH', reason: 'Frustración detectada en Speaking', trend: 'down' },
  { student: 'Elena Vasquez', group: 'B1-202', risk: 'MEDIUM', reason: 'Baja interacción en The Bridge', trend: 'neutral' },
];

export function Sentiment() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-32"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Salud Institucional</h2>
          <h1 className="text-3xl font-bold tracking-tight text-white bevel-text uppercase underline decoration-[#DEFF9A]/20">Sentiment Analysis</h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Monitor Emocional • Pánuco & Dallas Hub</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-6 py-4 neo-glass border-[#DEFF9A]/20 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                <Smile size={32} />
              </div>
              <div>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Índice Global</span>
                <span className="text-2xl font-black text-white">8.8/10</span>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Radial Happiness Chart */}
        <GlassCard 
          title="Felicidad Institucional" 
          icon={Brain}
          className="col-span-12 lg:col-span-4"
        >
          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="30%" 
                outerRadius="100%" 
                barSize={15} 
                data={sentimentData} 
                startAngle={180} 
                endAngle={-180}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                  background={{ fill: 'rgba(255,255,255,0.05)' }}
                  dataKey="value"
                  cornerRadius={10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#061a1a', border: '1px solid #DEFF9A20', borderRadius: '12px', fontSize: '10px' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <Smile size={24} className="text-[#DEFF9A] mb-1" />
               <span className="text-xs font-black text-white">OPTIMIZADO</span>
            </div>
          </div>
        </GlassCard>

        {/* Word Cloud from The Bridge */}
        <GlassCard 
          title="Conceptos 'The Bridge'" 
          icon={Hash}
          className="col-span-12 lg:col-span-8"
        >
          <div className="h-full flex flex-wrap items-center justify-center gap-x-12 gap-y-8 p-12 bg-black/20 rounded-3xl border border-white/5 relative overflow-hidden">
             {/* Background decorative wave */}
             <div className="absolute inset-0 pointer-events-none opacity-5">
               <svg width="100%" height="100%" viewBox="0 0 800 400">
                 <path d="M0,200 Q200,100 400,200 T800,200" fill="none" stroke="#DEFF9A" strokeWidth="2" />
               </svg>
             </div>

             {keywords.map((word, i) => (
               <motion.span 
                 key={i}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 whileHover={{ scale: 1.1, color: '#DEFF9A' }}
                 className={`cursor-pointer font-black uppercase tracking-tighter transition-all ${word.size} ${word.color} bevel-text`}
               >
                 {word.text}
               </motion.span>
             ))}
          </div>
        </GlassCard>

        {/* AI Dropout Alerts */}
        <GlassCard 
          title="Alertas de Deserción Escolar (AI Predictor)" 
          icon={AlertTriangle} 
          accent="orange"
          className="col-span-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dropoutAlerts.map((alert, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex items-start gap-6 group hover:border-[#F59E0B]/40 transition-all">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${alert.risk === 'HIGH' ? 'bg-red-500/20 text-red-500' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                  <Frown size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white text-lg font-bold uppercase tracking-tight">{alert.student}</h4>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${alert.risk === 'HIGH' ? 'border-red-500/40 text-red-500' : 'border-[#F59E0B]/40 text-[#F59E0B]'} bg-black/40`}>
                      RIESGO {alert.risk}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Grupo {alert.group}</p>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-white/80 text-[11px] leading-relaxed italic">
                      "Sentiment: {alert.reason}. Probabilidad de abandono: {alert.risk === 'HIGH' ? '82%' : '45%'}"
                    </p>
                  </div>
                </div>
                <button className="self-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#DEFF9A] hover:text-black transition-all">
                  <MessageSquare size={16} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
