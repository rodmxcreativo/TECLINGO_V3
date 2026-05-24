/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Send, 
  Info,
  Calendar,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

const HOURS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

export function AvailabilityModule() {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const toggleSlot = (day: string, hour: string) => {
    const slotId = `${day}-${hour}`;
    setSelectedSlots(prev => 
      prev.includes(slotId) ? prev.filter(s => s !== slotId) : [...prev, slotId]
    );
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => setIsSending(false), 2000);
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Calendario Semanal Grid */}
      <div className="col-span-12 lg:col-span-9">
        <GlassCard title="Calendario de Disponibilidad Semanal" icon={Calendar} accent="cyan">
           <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                 <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-2 mb-6">
                    <div />
                    {DAYS.map(day => (
                      <div key={day} className="text-center p-3 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{day}</span>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-2">
                    {HOURS.map(hour => (
                      <div key={hour} className="grid grid-cols-[80px_repeat(6,1fr)] gap-2">
                         <div className="flex items-center justify-center p-3">
                            <span className="text-[10px] font-black text-white/20 font-mono tracking-widest">{hour}</span>
                         </div>
                         {DAYS.map(day => {
                           const isSelected = selectedSlots.includes(`${day}-${hour}`);
                           return (
                             <button
                               key={`${day}-${hour}`}
                               onClick={() => toggleSlot(day, hour)}
                               className={`aspect-video rounded-xl border transition-all duration-300 flex items-center justify-center group ${
                                 isSelected 
                                   ? 'bg-[#22D3EE] border-[#22D3EE] shadow-[0_0_15px_#22D3EE40]' 
                                   : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                               }`}
                             >
                                <Plus size={16} className={`transition-transform ${isSelected ? 'text-[#061a1a] scale-125' : 'text-white/5 group-hover:text-white/20'}`} />
                             </button>
                           );
                         })}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </GlassCard>
      </div>

      {/* Control Sidebar */}
      <div className="col-span-12 lg:col-span-3 space-y-8">
         <GlassCard title="Control de Propuesta" icon={Info} accent="green">
            <div className="space-y-6">
               <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Horas Seleccionadas</p>
                  <p className="text-3xl font-black text-white bevel-text">{selectedSlots.length}</p>
                  <p className="text-[10px] font-bold text-[#22D3EE] uppercase tracking-widest mt-1">Total Semanal</p>
               </div>

               <div className="border-t border-white/5 pt-6">
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-4">Notas para el Director</p>
                  <textarea 
                    placeholder="Escribe comentarios sobre tu horario..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#22D3EE]/40 transition-all min-h-[120px] font-medium"
                   />
               </div>

               <button 
                onClick={handleSend}
                disabled={isSending || selectedSlots.length === 0}
                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  isSending || selectedSlots.length === 0
                  ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                  : 'bg-[#22D3EE] text-[#061a1a] hover:shadow-[0_0_40px_#22D3EE80] active:scale-95'
                }`}
               >
                  {isSending ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                       <Zap size={18} />
                    </motion.div>
                  ) : (
                    <>
                       Enviar a Smart Scheduler <Send size={16} />
                    </>
                  )}
               </button>
            </div>
         </GlassCard>

         <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#22D3EE]/20 to-transparent border border-[#22D3EE]/20 space-y-4">
            <div className="flex items-center gap-3">
               <Zap size={20} className="text-[#22D3EE]" />
               <h4 className="text-white text-[11px] font-black uppercase tracking-widest">Sincronización AI</h4>
            </div>
            <p className="text-white/40 text-[9px] font-bold leading-relaxed uppercase tracking-widest">
               Tu disponibilidad se usará para optimizar el calendario institucional automáticamente.
            </p>
         </div>
      </div>
    </div>
  );
}
