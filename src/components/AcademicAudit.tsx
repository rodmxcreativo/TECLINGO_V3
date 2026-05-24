/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { 
  Activity, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  Timer, 
  ChevronRight,
  TrendingUp,
  FileSearch,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface AuditData {
  group: string;
  real: number;
  planned: number;
  status: 'OPTIMIZED' | 'DELAY' | 'CRITICAL';
}

const auditMetrics: AuditData[] = [
  { group: 'A1-102', real: 85, planned: 82, status: 'OPTIMIZED' },
  { group: 'B2-201', real: 60, planned: 75, status: 'DELAY' },
  { group: 'C1-304', real: 92, planned: 90, status: 'OPTIMIZED' },
  { group: 'A2-105', real: 45, planned: 70, status: 'CRITICAL' },
  { group: 'B1-108', real: 78, planned: 80, status: 'DELAY' },
];

const evidencePhotos = [
  { id: 1, group: 'A1-102', teacher: 'Ana López', time: 'Hace 2 horas', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop', caption: 'Roleplay: Airport Check-in' },
  { id: 2, group: 'B2-201', teacher: 'Luis Garcia', time: 'Hace 4 horas', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop', caption: 'Grammar Workshop: Conditionals' },
  { id: 3, group: 'C1-304', teacher: 'Ana López', time: 'Hace 5 horas', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop', caption: 'Debate: Future of AI' },
];

export function AcademicAudit() {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof evidencePhotos[0] | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 pb-24"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Auditoría Institucional</h2>
          <h1 className="text-3xl font-bold tracking-tight text-white bevel-text uppercase">Academic Audit Controller</h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Supervisión Pedagógica Zero-Presence</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[#DEFF9A] text-xs font-bold tracking-widest uppercase">Cumplimiento Global</span>
            <span className="text-3xl font-black text-white">92.4%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center">
            <TrendingUp className="text-[#DEFF9A]" size={24} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Progress Comparison Chart */}
        <GlassCard 
          title="Avance Real vs. Planeación TECLINGO" 
          icon={FileSearch}
          className="col-span-12 lg:col-span-8"
        >
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditMetrics} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="group" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff60', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff60' }}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#061a1a', border: '1px solid #DEFF9A20', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '20px' }}
                />
                <Bar name="Avance Real" dataKey="real" radius={[6, 6, 0, 0]} barSize={24}>
                  {auditMetrics.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.status === 'CRITICAL' ? '#ef4444' : entry.status === 'DELAY' ? '#F59E0B' : '#DEFF9A'} 
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
                <Bar name="Planeación" dataKey="planned" fill="#ffffff15" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Risk Monitor Area */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <GlassCard title="Grupos en Riesgo" icon={AlertCircle} accent="orange">
            <div className="space-y-4">
              {auditMetrics.filter(m => m.status !== 'OPTIMIZED').map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-[#F59E0B]/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#F59E0B]'}`} />
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-widest">Grupo {item.group}</h4>
                      <p className="text-white/40 text-[9px] uppercase font-medium mt-1">Rezago: {item.planned - item.real}%</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-[#F59E0B] transition-colors" />
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="IA Auditor Insight" icon={Timer} accent="cyan">
            <div className="p-4 rounded-2xl bg-[#4ADE80]/5 border border-[#4ADE80]/20 flex gap-4">
               <div className="w-1 rounded-full bg-[#4ADE80] shrink-0" />
               <p className="text-white/80 text-[10px] leading-relaxed italic">
                Propuesta: Sincronizar planeación de B2-201 con el módulo de 'Conditionals' omitido. Posible sobrecarga de contenido detectada.
               </p>
            </div>
          </GlassCard>
        </div>

        {/* Evidence Viewer */}
        <GlassCard 
          title="Visor de Evidencia Diaria (Solo Lectura)" 
          icon={Camera}
          className="col-span-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {evidencePhotos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#DEFF9A]/40 transition-all"
              >
                <img 
                  src={photo.url} 
                  alt={photo.caption} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">{photo.group}</span>
                    <Eye size={14} className="text-white" />
                  </div>
                  <p className="text-white text-xs font-bold truncate">{photo.caption}</p>
                  <p className="text-white/40 text-[9px] uppercase font-medium mt-1">Mtro. {photo.teacher}</p>
                </div>
                {/* Info Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest">{photo.time}</span>
                </div>
              </div>
            ))}
            
            {/* Empty Slots */}
            <div className="h-48 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10 p-8 text-center bg-white/[0.01]">
              <FileSearch size={32} className="mb-2 opacity-50" />
              <p className="text-[9px] font-bold uppercase tracking-widest">Esperando evidencia de turno vespertino</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061a1a]/90 backdrop-blur-2xl p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full neo-glass rounded-[3rem] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img src={selectedPhoto.url} className="w-full h-full object-cover" alt="" />
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-black transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-8 lg:p-12 flex flex-col md:flex-row justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1.5 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.2em]">
                      GRUPO {selectedPhoto.group}
                    </span>
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{selectedPhoto.time}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.caption}</h3>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#DEFF9A]" />
                    <span className="text-white/60 text-xs">Evidencia válida integrada a PDP institucional</span>
                  </div>
                </div>
                <div className="md:text-right flex flex-col justify-end">
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Docente Asignado</p>
                   <p className="text-lg font-bold text-white uppercase tracking-tight">Mtro. {selectedPhoto.teacher}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
