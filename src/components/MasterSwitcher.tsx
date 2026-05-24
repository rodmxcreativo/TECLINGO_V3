/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ShieldAlert, 
  User, 
  GraduationCap, 
  ChevronDown,
  Terminal,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type UserRole = 'DIRECTOR' | 'DOCENTE' | 'ALUMNO' | 'TUTOR' | 'SUPERADMIN';

interface MasterSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function MasterSwitcher({ currentRole, onRoleChange }: MasterSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'DIRECTOR', label: 'Director Master', icon: ShieldAlert, color: 'text-[#DEFF9A]' },
    { id: 'DOCENTE', label: 'Docente Operativo', icon: GraduationCap, color: 'text-[#4ADE80]' },
    { id: 'ALUMNO', label: 'Alumno Inmersión', icon: User, color: 'text-[#22D3EE]' },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="haptic-press flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group overflow-hidden"
      >
        <div className="w-2 h-2 rounded-full bg-[#DEFF9A] animate-pulse shadow-[0_0_8px_#DEFF9A]" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Master Switcher</span>
        <ChevronDown size={14} className={`text-white/20 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DEFF9A]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-3 w-72 bg-[#0a0c10]/98 backdrop-blur-[40px] border-t-2 border-[#DEFF9A]/50 border-x border-b border-white/20 rounded-[2.5rem] overflow-hidden z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-4 border-b border-white/10 bg-white/5">
               <div className="flex items-center gap-2 mb-1">
                  <Terminal size={12} className="text-[#DEFF9A]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Modo Simulación Omnipresente</span>
               </div>
               <p className="text-[10px] font-medium text-white/20 leading-tight">Vístete con cualquier rol institucional para validar UX.</p>
            </div>

            <div className="p-2 space-y-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleChange(role.id);
                    setIsOpen(false);
                  }}
                  className={`haptic-press w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                    currentRole === role.id 
                      ? 'bg-[#DEFF9A]/10 border border-[#DEFF9A]/20' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentRole === role.id ? 'bg-[#DEFF9A]/20' : 'bg-white/5'}`}>
                      <role.icon size={16} className={currentRole === role.id ? 'text-[#DEFF9A]' : 'text-white/40'} />
                    </div>
                    <span className={`text-xs font-bold ${currentRole === role.id ? 'text-white' : 'text-white/40'}`}>
                      {role.label}
                    </span>
                  </div>
                  {currentRole === role.id && (
                    <Zap size={12} className="text-[#DEFF9A] animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 bg-black/40 space-y-3">
               <button 
                onClick={() => onRoleChange('DIRECTOR')}
                className="haptic-press w-full text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors block"
               >
                 Regreso Instantáneo a Master
               </button>
               <div className="h-px bg-white/5" />
               <button 
                onClick={() => {
                  setIsOpen(false);
                  (window as any).tecnolingoLogout?.();
                }}
                className="haptic-button w-full py-2.5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#DEFF9A]/60 hover:text-[#DEFF9A] hover:bg-[#DEFF9A]/5 transition-all flex items-center justify-center gap-2"
               >
                  Portal de Acceso
               </button>
               <button 
                onClick={() => {
                  setIsOpen(false);
                  // We'll hook this up in App.tsx
                  (window as any).tecnolingoLogout?.();
                }}
                className="haptic-press w-full text-[9px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-400 transition-colors block text-center"
               >
                 Desconectarse
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
