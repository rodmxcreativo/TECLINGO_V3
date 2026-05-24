/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageSquare, Bell, Zap, User } from 'lucide-react';
import { GlassCard } from './GlassCard';

const alerts = [
  { student: 'Ana Maria', risk: 'High', reason: 'Attendance < 70%' },
  { student: 'Juan Pérez', risk: 'Medium', reason: 'Grammar scores dropping' },
];

export function InnovationAlerts() {
  return (
    <div className="space-y-6">
      <GlassCard title="The Bridge" icon={MessageSquare} accent="cyan" delay={0.4}>
        <div className="space-y-4">
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">AI</div>
             <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/10">
               <p className="text-white/80 text-[10px] leading-relaxed">System integration complete. Pánuco Link established.</p>
             </div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
             <div className="w-8 h-8 rounded-full bg-[#DEFF9A] flex items-center justify-center text-[10px] font-bold text-black">DR</div>
             <div className="flex-1 p-3 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20">
               <p className="text-[#DEFF9A] text-[10px] leading-relaxed">Proceed with Group A1-104 roleplay activation.</p>
             </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard title="Alertas Tempranas" icon={Bell} accent="orange" delay={0.45}>
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <div className={`w-1 h-8 rounded-full ${alert.risk === 'High' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-[#F59E0B]'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-bold">{alert.student}</span>
                  <span className={`text-[8px] font-bold uppercase ${alert.risk === 'High' ? 'text-red-500' : 'text-[#F59E0B]'}`}>{alert.risk} Risk</span>
                </div>
                <p className="text-white/40 text-[9px] uppercase tracking-tighter mt-1">{alert.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
