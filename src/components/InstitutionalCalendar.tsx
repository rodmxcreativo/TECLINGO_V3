/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  X,
  Zap,
  Star,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface Event {
  id: string;
  day: number;
  title: string;
  type: 'SCHOOL' | 'HOLIDAY' | 'TECLINGO';
  description: string;
  time?: string;
  visibility: ('GLOBAL' | 'DOCENTE' | 'ALUMNO')[];
}

import { useAppContext } from '../context/AppContext';

export function InstitutionalCalendar() {
  const { globalEvents, currentRole, addGlobalEvent, deleteGlobalEvent, updateGlobalEvent } = useAppContext();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    day: 1,
    title: '',
    type: 'SCHOOL',
    description: '',
    time: '08:00 AM',
    visibility: ['GLOBAL']
  });

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  const getEventsForDay = (day: number) => {
    return globalEvents.filter(e => {
      if (e.day !== day) return false;
      if (currentRole === 'DIRECTOR') return true;
      return e.visibility.includes('GLOBAL') || e.visibility.includes(currentRole as any);
    });
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.day) {
      addGlobalEvent({
        ...newEvent as Event,
        id: Math.random().toString(36).substr(2, 9)
      });
      setShowAddModal(false);
      setNewEvent({
        day: 1,
        title: '',
        type: 'SCHOOL',
        description: '',
        time: '08:00 AM',
        visibility: ['GLOBAL']
      });
    }
  };

  const handleDeleteEvent = (id: string) => {
    deleteGlobalEvent(id);
    setSelectedEvent(null);
  };

  const getTypeStyles = (type: Event['type']) => {
    switch (type) {
      case 'SCHOOL': return 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]';
      case 'HOLIDAY': return 'bg-orange-500 shadow-[0_0_10px_#f97316]';
      case 'TECLINGO': return 'bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]';
    }
  };

  const getIcon = (type: Event['type']) => {
    switch (type) {
      case 'SCHOOL': return <Award size={10} className="text-[#061a1a]" />;
      case 'HOLIDAY': return <Star size={10} className="text-[#061a1a]" />;
      case 'TECLINGO': return <Zap size={10} className="text-[#061a1a]" />;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Agenda Global</h2>
          <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Calendario Institucional</h1>
        </div>

        <div className="flex items-center gap-4">
          {currentRole === 'DIRECTOR' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(222,255,154,0.3)] transition-all flex items-center gap-2"
            >
              <CalendarIcon size={14} />
              Agregar Evento
            </button>
          )}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 h-12">
             <button className="p-2 text-white/20 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
             <span className="text-xs font-black text-white uppercase tracking-widest px-4">Mayo 2026</span>
             <button className="p-2 text-white/20 hover:text-white transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
           <GlassCard accent="green" className="!p-0 overflow-hidden">
              <div className="grid grid-cols-7 border-b border-white/10">
                 {weekDays.map(d => (
                   <div key={d} className="p-4 text-center text-[10px] font-black text-white/20 uppercase tracking-widest border-r border-white/5 last:border-0">{d}</div>
                 ))}
              </div>
              <div className="grid grid-cols-7">
                 {/* Empty days placeholder for grid alignment */}
                 <div className="aspect-square border-r border-b border-white/5 bg-white/[0.01]" />
                 <div className="aspect-square border-r border-b border-white/5 bg-white/[0.01]" />
                 <div className="aspect-square border-r border-b border-white/5 bg-white/[0.01]" />
                 <div className="aspect-square border-r border-b border-white/5 bg-white/[0.01]" />
                 
                 {daysInMonth.map(day => {
                   const events = getEventsForDay(day);
                   return (
                     <div key={day} className="aspect-square border-r border-b border-white/5 p-3 flex flex-col gap-1.5 hover:bg-white/[0.02] transition-colors relative group">
                        <span className="text-[10px] font-black text-white/10 group-hover:text-white/40 transition-colors">{day}</span>
                        <div className="flex flex-col gap-1 overflow-y-auto max-h-[80%] custom-scrollbar">
                           {events.map(event => (
                             <button 
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className={`w-full h-1.5 min-h-[6px] rounded-full ${getTypeStyles(event.type)} transition-transform hover:scale-x-110`} 
                              title={event.title}
                             />
                           ))}
                        </div>
                     </div>
                   );
                 })}
              </div>
           </GlassCard>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
           <GlassCard title="Leyenda Operativa" icon={Info} accent="cyan">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Escolar (Exámenes)</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Días de Asueto</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]" />
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Eventos TECLINGO PRO</span>
                 </div>
              </div>
           </GlassCard>

           <div className="p-8 rounded-[2.5rem] bg-gradient-to-t from-white/5 to-transparent border border-white/10 text-center">
              <Star className="mx-auto text-[#DEFF9A] mb-4" />
              <p className="text-white text-xs font-black uppercase tracking-widest mb-1">Próximo Hito</p>
              <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Lanzamiento Version 2.0</p>
              <p className="mt-4 text-[10px] font-black text-[#DEFF9A]">FALTAN 12 DÍAS</p>
           </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full neo-glass border-white/20 rounded-[3rem] p-10 overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
               <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
               >
                  <X size={18} />
               </button>

               <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center ${getTypeStyles(selectedEvent.type)} !shadow-none`}>
                  {getIcon(selectedEvent.type)}
               </div>

               <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-full border ${
                         selectedEvent.type === 'SCHOOL' ? 'text-cyan-500 border-cyan-500/30' :
                         selectedEvent.type === 'HOLIDAY' ? 'text-orange-500 border-orange-500/30' :
                         'text-[#DEFF9A] border-[#DEFF9A]/30'
                       }`}>
                          {selectedEvent.type}
                       </span>
                       <span className="text-white/20 text-[8px]">•</span>
                       <span className="text-white/40 text-[8px] font-black uppercase tracking-widest">Institución TECLINGO</span>
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">{selectedEvent.title}</h3>
                  </div>

                  <p className="text-white/60 text-sm font-medium leading-relaxed italic">
                    "{selectedEvent.description}"
                  </p>

                  <div className="flex items-center gap-3 pt-6 border-t border-white/5 justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#DEFF9A]">
                           <Zap size={16} />
                        </div>
                        <div>
                           <p className="text-white text-[10px] font-black uppercase tracking-widest">Hora de Programación</p>
                           <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{selectedEvent.time}</p>
                        </div>
                     </div>
                     {currentRole === 'DIRECTOR' && (
                        <button 
                          onClick={() => handleDeleteEvent(selectedEvent.id)}
                          className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all font-black"
                        >
                          Eliminar
                        </button>
                      )}
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-xl w-full neo-glass border-white/20 rounded-[3rem] p-10 overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Programar Evento Institucional</h3>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Título del Evento</label>
                       <input 
                         type="text"
                         value={newEvent.title}
                         onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                         placeholder="Ej. Examen de ADN"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Día (Mayo)</label>
                       <input 
                         type="number"
                         min="1"
                         max="31"
                         value={newEvent.day}
                         onChange={e => setNewEvent({...newEvent, day: parseInt(e.target.value)})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Tipo de Evento</label>
                       <select 
                         value={newEvent.type}
                         onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50"
                       >
                          <option value="SCHOOL" className="bg-[#061a1a]">Escolar (Examen)</option>
                          <option value="HOLIDAY" className="bg-[#061a1a]">Feriado</option>
                          <option value="TECLINGO" className="bg-[#061a1a]">Evento Teclingo</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Hora / Duración</label>
                       <input 
                         type="text"
                         value={newEvent.time}
                         onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                         placeholder="Ej. 10:00 AM"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Descripción</label>
                    <textarea 
                      value={newEvent.description}
                      onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Visibilidad (Jerarquía)</label>
                    <div className="flex gap-4">
                       {['GLOBAL', 'DOCENTE', 'ALUMNO'].map(role => (
                         <button
                           key={role}
                           onClick={() => {
                             const current = newEvent.visibility || [];
                             if (current.includes(role as any)) {
                               setNewEvent({...newEvent, visibility: current.filter(r => r !== role)});
                             } else {
                               setNewEvent({...newEvent, visibility: [...current, role as any]});
                             }
                           }}
                           className={`flex-1 py-3 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                             newEvent.visibility?.includes(role as any) 
                             ? 'bg-[#DEFF9A]/20 border-[#DEFF9A] text-[#DEFF9A]' 
                             : 'bg-white/5 border-white/10 text-white/40'
                           }`}
                         >
                           {role}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleAddEvent}
                      className="flex-[2] py-4 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.2)] hover:brightness-110 transition-all"
                    >
                      Emitir Evento Global
                    </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
