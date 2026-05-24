/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Users, 
  AlertCircle, 
  MapPin, 
  Search, 
  Calendar as CalendarIcon, 
  QrCode,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AttendanceGroup {
  id: string;
  name: string;
  percentage: number;
}

interface LiveCheckIn {
  id: string;
  name: string;
  photo: string;
  time: string;
  group: string;
}

const groupsData: AttendanceGroup[] = [
  { id: '1', name: 'A1-101', percentage: 95 },
  { id: '2', name: 'A1-102', percentage: 82 },
  { id: '3', name: 'B2-205', percentage: 70 },
  { id: '4', name: 'C1-304', percentage: 98 },
  { id: '5', name: 'A2-105', percentage: 60 },
  { id: '6', name: 'B1-108', percentage: 88 },
];

const mockLiveCheckIns: LiveCheckIn[] = [
  { id: '1', name: 'Juan Pérez', group: 'A1-102', time: '14:22:05', photo: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Maria Garcia', group: 'B2-205', time: '14:22:15', photo: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Luis M.', group: 'A1-101', time: '14:23:01', photo: 'https://i.pravatar.cc/150?u=3' },
];

export interface AttendanceIntervention {
  id: string;
  userName: string;
  userId: string;
  absences: number;
  lastAbsence: string;
}

const mockInterventions: AttendanceIntervention[] = [
  { id: '1', userName: 'Sofía Méndez', userId: 'USR-221-C99', absences: 3, lastAbsence: 'Ayer' },
  { id: '2', userName: 'Carlos K.', userId: 'USR-772-K', absences: 4, lastAbsence: 'Hoy' },
];

export function AsistenciasMaster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInterventions, setShowInterventions] = useState(true);
  const [liveLog, setLiveLog] = useState<LiveCheckIn[]>(mockLiveCheckIns);

  // Simulate live feed
  useEffect(() => {
    const interval = setInterval(() => {
      const newEntry = {
        id: Math.random().toString(),
        name: ['Héctor R.', 'Elena V.', 'Carlos S.', 'Ana P.'][Math.floor(Math.random() * 4)],
        group: ['A1-101', 'B2-205', 'C1-304'][Math.floor(Math.random() * 3)],
        time: new Date().toLocaleTimeString(),
        photo: `https://i.pravatar.cc/150?u=${Math.random()}`
      };
      setLiveLog(prev => [newEntry, ...prev.slice(0, 4)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-32"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Visión Macro de Puntualidad</h2>
          <h1 className="text-3xl font-bold tracking-tight text-white bevel-text uppercase underline decoration-[#DEFF9A]/20">Asistencias Panorámicas</h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Tecnolingo • Live Attendance Monitoring</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
          <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[#DEFF9A] bg-white/5 rounded-xl border border-white/10">Hoy</button>
          <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Semana</button>
          <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Mes</button>
        </div>
      </header>

      {/* KPIs Globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard accent="green">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Puntualidad Global</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl font-black text-white bevel-text">94%</h3>
                   <span className="text-[#DEFF9A] text-[10px] font-bold">+2.1%</span>
                </div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
                <UserCheck size={24} />
             </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]" style={{ width: '94%' }} />
          </div>
        </GlassCard>

        <GlassCard accent="orange">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Ausentismo Crítico</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl font-black text-[#F59E0B] bevel-text">12 ALUMNOS</h3>
                   <button 
                     onClick={() => setShowInterventions(!showInterventions)}
                     className="px-2 py-1 rounded bg-[#F59E0B]/10 text-[#F59E0B] text-[8px] font-black uppercase hover:bg-[#F59E0B]/20 transition-all ml-2"
                   >
                     {showInterventions ? 'Ocultar' : 'Ver Lista'}
                   </button>
                </div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                <AlertCircle size={24} />
             </div>
          </div>
          <p className="mt-4 text-[9px] font-bold uppercase text-white/40 tracking-widest flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
             Riesgo de deserción alto (3+ faltas)
          </p>
        </GlassCard>

        <GlassCard accent="cyan">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Grupo Crítico</p>
                <h3 className="text-4xl font-black text-white bevel-text">A2-105</h3>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE]">
                <MapPin size={24} />
             </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
             <span className="text-white/40">Asistencia Hoy:</span>
             <span className="text-red-500">60%</span>
          </div>
        </GlassCard>
      </div>

      {/* Panoramic Grid */}
      <AnimatePresence>
        {showInterventions && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
             <GlassCard title="Alertas de Intervención Inmediata" icon={AlertCircle} accent="orange" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {mockInterventions.map((alert) => (
                     <div key={alert.id} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col justify-between group hover:bg-red-500/10 transition-all">
                        <div className="space-y-2">
                           <div className="flex justify-between">
                              <span className="text-red-500 text-[8px] font-black uppercase tracking-widest">Alerta de Deserción</span>
                              <span className="text-white/20 text-[8px] font-mono">{alert.userId}</span>
                           </div>
                           <h4 className="text-white text-sm font-black uppercase tracking-tight">{alert.userName}</h4>
                           <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Inasistencias: <span className="text-red-500">{alert.absences} consecutivas</span></p>
                        </div>
                        <div className="mt-4 flex gap-2">
                           <button className="flex-1 py-2 rounded-lg bg-red-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">Reportar Tutor</button>
                           <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"><Search size={12} /></button>
                        </div>
                     </div>
                   ))}
                </div>
             </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-8">
        {/* Panoramic Grid */}
        <div className="col-span-12 lg:col-span-8">
          <GlassCard title="Vista Panorámica por Grupos" icon={Users} accent="green">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {groupsData.map((group) => (
                  <motion.div 
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-[2rem] bg-black/20 border border-white/5 hover:border-[#DEFF9A]/30 transition-all cursor-pointer group"
                  >
                     <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-[#DEFF9A] transition-colors">{group.name}</span>
                        <ArrowUpRight size={14} className="text-white/20 group-hover:text-white" />
                     </div>
                     <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie
                                data={[
                                  { value: group.percentage },
                                  { value: 100 - group.percentage }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius="65%"
                                outerRadius="90%"
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={450}
                             >
                                <Cell key="cell-0" fill={group.percentage > 80 ? '#DEFF9A' : group.percentage > 70 ? '#4ADE80' : '#F59E0B'} stroke="none" />
                                <Cell key="cell-1" fill="rgba(255,255,255,0.05)" stroke="none" />
                             </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                           <span className="text-xl font-black text-white">{group.percentage}%</span>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
          </GlassCard>
          
          {/* Individual Search & Heatmap */}
          <div className="mt-8">
            <GlassCard title="Monitor Individual" icon={Search} accent="cyan">
               <div className="mb-8">
                  <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#DEFF9A] transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Identificar alumno por nombre o ID..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/40 transition-all font-bold tracking-tight"
                    />
                  </div>
               </div>

               {searchQuery && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-8 rounded-[2.5rem] bg-black/40 border border-[#DEFF9A]/20"
                 >
                    <div className="flex items-center gap-6 mb-10">
                       <div className="w-16 h-16 rounded-full bg-[#DEFF9A] flex items-center justify-center text-[#061a1a] text-2xl font-black ring-4 ring-[#DEFF9A]/20">
                          {searchQuery[0].toUpperCase()}
                       </div>
                       <div>
                          <h4 className="text-2xl font-bold text-white uppercase tracking-tight">{searchQuery}</h4>
                          <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest mt-1">ID: TEC-9942-X • Grupo B2-205</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Heatmap de Asistencia (Últimos 6 meses)</p>
                       <div className="flex flex-wrap gap-1.5 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                          {Array.from({ length: 90 }).map((_, i) => {
                            const isPresent = Math.random() > 0.1;
                            const isVeryActive = isPresent && Math.random() > 0.7;
                            return (
                              <div 
                                key={i} 
                                className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-150 ${
                                  !isPresent ? 'bg-white/5' : isVeryActive ? 'bg-[#DEFF9A] shadow-[0_0_8px_#DEFF9A]' : 'bg-[#DEFF9A]/30'
                                }`} 
                              />
                            );
                          })}
                       </div>
                       <div className="flex items-center gap-4 text-[9px] font-black uppercase text-white/30 tracking-widest mt-2">
                          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-white/5 rounded-sm" /> Falta</div>
                          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#DEFF9A]/30 rounded-sm" /> Asistencia</div>
                          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#DEFF9A] rounded-sm" /> Puntualidad Perfecta</div>
                       </div>
                    </div>
                 </motion.div>
               )}
            </GlassCard>
          </div>
        </div>

        {/* Live Feed */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <GlassCard title="Live Check-in Feed" icon={QrCode} accent="green" className="h-full flex flex-col">
             <div className="flex-1 space-y-6">
                <AnimatePresence mode="popLayout">
                  {liveLog.map((log) => (
                    <motion.div 
                      key={log.id}
                      layout
                      initial={{ opacity: 0, x: 20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 group hover:border-[#DEFF9A]/40 transition-all"
                    >
                      <div className="relative">
                        <img src={log.photo} className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-[#DEFF9A]/40 transition-colors" alt="" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#DEFF9A] rounded-full flex items-center justify-center text-[10px] text-[#061a1a]">
                           <QrCode size={10} strokeWidth={3} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate tracking-tight">{log.name}</p>
                        <p className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">Grupo {log.group}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/20 text-[9px] font-mono">{log.time}</p>
                        <span className="text-[10px] text-[#4ADE80] font-bold">IN</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
             
             <div className="mt-8 p-6 bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 rounded-3xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A] mx-auto flex items-center justify-center shadow-[0_0_20px_#DEFF9A40]">
                   <CalendarIcon className="text-[#061a1a]" size={24} />
                </div>
                <h4 className="text-white text-[11px] font-black uppercase tracking-widest">Sincronización QR Gate</h4>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-loose">
                   Terminal Dallas Hub: <span className="text-[#4ADE80]">ONLINE</span><br />
                   Terminal Pánuco Hub: <span className="text-[#4ADE80]">ONLINE</span>
                </p>
             </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
