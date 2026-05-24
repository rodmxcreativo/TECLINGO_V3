/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: any;
  accent?: 'green' | 'cyan' | 'orange';
  delay?: number;
}

export function GlassCard({ children, className = '', title, icon: Icon, accent = 'green', delay = 0 }: GlassCardProps) {
  const accentColors = {
    green: 'border-[#DEFF9A]/20 shadow-[#DEFF9A]/5',
    cyan: 'border-[#4ADE80]/20 shadow-[#4ADE80]/5',
    orange: 'border-[#F59E0B]/20 shadow-[#F59E0B]/5',
  };

  const glowColors = {
    green: 'bg-[#DEFF9A]',
    cyan: 'bg-[#4ADE80]',
    orange: 'bg-[#F59E0B]',
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group haptic-press ${className}`}
    >
      {/* Main Glass Panel using the new neo-glass utility */}
      <div className={`relative h-full neo-glass rounded-3xl overflow-hidden ${accentColors[accent]}`}>
        {/* Subtle beveled highlight (internal) */}
        <div className="absolute inset-0 border-t border-l border-white/5 rounded-3xl pointer-events-none" />
        
        {/* Interior glow effect */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 ${glowColors[accent]} blur-[100px] opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700`} />

        {(title || Icon) && (
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && <Icon className={accent === 'green' ? 'text-[#DEFF9A]' : accent === 'cyan' ? 'text-[#4ADE80]' : 'text-[#F59E0B]'} size={18} />}
              {title && <h3 className="text-white/90 font-bold tracking-[0.2em] text-[10px] uppercase bevel-text">{title}</h3>}
            </div>
          </div>
        )}
        
        <div className={`${(title || Icon) ? 'px-6 pb-6 pt-2' : 'p-6'} h-full relative z-10`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
