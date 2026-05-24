/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Users, 
  Zap,
  LayoutGrid,
  Calendar,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

interface ClassBlock {
  id: string;
  day: number; // 1-5
  start: string; // HH:MM
  end: string;
  group: string;
  room: string;
  type: 'PRESENCIAL' | 'VIRTUAL';
}

const mockSchedules: ClassBlock[] = [
  { id: '1', day: 1, start: '08:00', end: '09:40', group: 'A1-102', room: 'Aula 4-A', type: 'PRESENCIAL' },
  { id: '2', day: 1, start: '10:00', end: '11:40', group: 'B2-205', room: 'Zoom Lab 2', type: 'VIRTUAL' },
  { id: '3', day: 2, start: '11:00', end: '12:40', group: 'A1-102', room: 'Aula 4-A', type: 'PRESENCIAL' },
  { id: '4', day: 3, start: '08:00', end: '09:40', group: 'B2-205', room: 'Aula 1-C', type: 'PRESENCIAL' },
  { id: '5', day: 4, start: '14:00', end: '15:40', group: 'B1-105', room: 'Aula Central', type: 'PRESENCIAL' },
  { id: '6', day: 5, start: '09:00', end: '10:40', group: 'C1-302', room: 'Auditorio', type: 'PRESENCIAL' },
];

const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
const HOURS = Array.from({ length: 14 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

export function TeacherSchedules() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getPositionForTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const minutesSinceStart = (h - 7) * 60 + m;
    return (minutesSinceStart / 60) * 100; // 100px per hour
  };

  const getDurationPx = (start: string, end: string) => {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const durationMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    return (durationMinutes / 60) * 100;
  };

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const showIndicator = currentHour >= 7 && currentHour <= 20;
  const indicatorTop = getPositionForTime(`${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Operación Diaria</h2>
          <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Mis Horarios de Clase</h1>
        </div>

        <div className="flex gap-2">
           <button className="px-6 py-3 rounded-2xl bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_#DEFF9A60]">
              Semana Actual
           </button>
           <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
              Exportar ICS
           </button>
        </div>
      </header>

      <GlassCard accent="green" className="!p-0 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
           <div className="min-w-[1200px] h-[1400px] relative p-12">
              {/* Header Days */}
              <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-4 sticky top-0 z-20 mb-8 pb-4 bg-transparent backdrop-blur-2xl">
                 <div />
                 {DAYS.map(day => (
                   <div key={day} className="text-center">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">{day}</p>
                   </div>
                 ))}
              </div>

              <div className="relative">
                 {/* Hour Markers */}
                 <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
                    {HOURS.map((hour, idx) => (
                      <div key={hour} style={{ top: `${idx * 100}px` }} className="absolute inset-x-0 h-px border-t border-white/5 flex items-center">
                         <span className="text-[10px] font-mono font-black text-white/10 -ml-16 w-12 text-right">{hour}</span>
                      </div>
                    ))}
                 </div>

                 {/* "Now" Indicator */}
                 {showIndicator && (
                   <div 
                    style={{ top: `${indicatorTop}px` }} 
                    className="absolute inset-x-0 z-30 pointer-events-none flex items-center"
                   >
                      <div className="w-full h-[2px] bg-[#DEFF9A] shadow-[0_0_15px_#DEFF9A]" />
                      <div className="shrink-0 ml-4 px-3 py-1 bg-[#DEFF9A] text-[#061a1a] text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_#DEFF9A80]">
                         Ahora
                      </div>
                   </div>
                 )}

                 {/* Grid Columns for Days */}
                 <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-4 h-full">
                    <div />
                    {DAYS.map((day, dayIdx) => (
                      <div key={day} className="relative h-full border-x border-white/[0.02]">
                         {mockSchedules
                           .filter(s => s.day === dayIdx + 1)
                           .map(item => (
                             <motion.div
                               key={item.id}
                               whileHover={{ scale: 1.02, x: 2 }}
                               style={{ 
                                 top: `${getPositionForTime(item.start)}px`,
                                 height: `${getDurationPx(item.start, item.end)}px`
                               }}
                               className="absolute inset-x-2 z-10 neo-glass border-white/20 p-4 rounded-3xl group overflow-hidden"
                             >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#DEFF9A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative border-l-2 border-[#DEFF9A] pl-3 h-full flex flex-col justify-between">
                                   <div>
                                      <div className="flex items-center justify-between mb-1">
                                         <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">{item.start} - {item.end}</p>
                                         {item.type === 'VIRTUAL' ? <Zap size={12} className="text-cyan-400" /> : <Layers size={12} className="text-white/20" />}
                                      </div>
                                      <h4 className="text-white text-base font-black uppercase tracking-tight">{item.group}</h4>
                                   </div>

                                   <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-widest">
                                         <MapPin size={10} /> {item.room}
                                      </div>
                                      <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-widest">
                                         <Users size={10} /> 24 ALUMNOS
                                      </div>
                                   </div>
                                </div>
                             </motion.div>
                           ))}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </GlassCard>
    </div>
  );
}
