/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Crown, Calendar, AlertCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

const scheduleData = [
  { group: 'A1-102', teacher: 'Ana López', time: '08:00 - 10:00', status: 'alert', location: 'Pánuco' },
  { group: 'B2-201', teacher: 'Luis Garcia', time: '10:30 - 12:30', status: 'ok', location: 'Virtual' },
  { group: 'C1-304', teacher: 'Ana López', time: '13:00 - 15:00', status: 'ok', location: 'Pánuco' },
  { group: 'A2-105', teacher: 'Pedro S.', time: '15:30 - 17:30', status: 'conflict', location: 'Pánuco' },
];

export function OperationalCommand({ onOpenScheduler }: { onOpenScheduler?: () => void }) {
  return (
    <GlassCard 
      title="Master Operational Command" 
      icon={Crown}
      className="col-span-12"
      delay={0.1}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenScheduler}
            className="flex items-center gap-3 bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 px-4 py-2 rounded-xl text-left hover:bg-[#DEFF9A]/20 transition-all group"
          >
             <Calendar size={16} className="text-[#DEFF9A] group-hover:scale-110 transition-transform" />
             <span className="text-[#DEFF9A] text-xs font-bold uppercase tracking-widest">Smart Scheduler Matrix ⚡</span>
          </button>
          <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
            May 13, 2026 • 10 Active Classes
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {scheduleData.map((item, idx) => (
            <div 
              key={idx}
              className={`flex-shrink-0 w-64 p-5 rounded-3xl neo-glass transition-all group relative ${
                item.status === 'alert' || item.status === 'conflict' ? 'border-[#F59E0B]/40 bg-[#F59E0B]/5' : 'border-white/5 bg-black/20'
              }`}
            >
              <div className="absolute inset-0 border-t border-l border-white/5 rounded-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">GRUPO {item.group}</h4>
                  <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest mt-1 opacity-60">{item.location}</p>
                </div>
                {item.status === 'alert' || item.status === 'conflict' ? (
                   <div className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_12px_#F59E0B]" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[#DEFF9A] shadow-[0_0_8px_#DEFF9A]" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 text-[10px] font-bold">
                    {item.teacher.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white/60 text-[10px] uppercase font-bold">Mtro. {item.teacher}</p>
                    <p className="text-white/30 text-[9px] uppercase font-bold">{item.time}</p>
                  </div>
                </div>
              </div>

              {item.status === 'conflict' && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                  <AlertCircle size={12} className="text-[#F59E0B]" />
                  <span className="text-[#F59E0B] text-[9px] font-bold uppercase tracking-tighter">Teacher Availability Conflict</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
