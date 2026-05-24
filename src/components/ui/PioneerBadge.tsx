/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Zap, Sparkles } from 'lucide-react';

export function PioneerBadge() {
  return (
    <div className="relative group cursor-help">
      {/* Outer Glow - Pulsing Energy */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[#FBBF24]/30 blur-3xl rounded-full" 
      />
      
      <motion.div
        animate={{ 
          y: [0, -12, 0],
          rotateY: [0, 8, -8, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative w-32 h-32 flex items-center justify-center"
      >
        {/* Metalic Background SVG - Liquid Gold */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="45%" stopColor="#FFFBEB" />
              <stop offset="55%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            
            <filter id="liquidMetal">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feSpecularLighting in="blur" surfaceScale="8" specularConstant="1" specularExponent="30" lightingColor="#white" result="spec">
                <fePointLight x="-100" y="-100" z="300" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
            </filter>
          </defs>

          {/* Hexagon Shield */}
          <path
            d="M 50 5 L 90 25 L 90 75 L 50 95 L 10 75 L 10 25 Z"
            fill="url(#goldGradient)"
            stroke="#DEFF9A"
            strokeWidth="3"
            filter="url(#liquidMetal)"
          />
        </svg>

        {/* Center Icons */}
        <div className="relative z-10 flex flex-col items-center">
          <Zap size={36} className="text-[#061a1a] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" fill="currentColor" />
          <div className="flex gap-1 mt-1">
             <Sparkles size={10} className="text-[#DEFF9A]" />
             <Sparkles size={12} className="text-[#DEFF9A] animate-pulse" />
             <Sparkles size={10} className="text-[#DEFF9A]" />
          </div>
        </div>

        {/* White Flare Effect on Entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 3, 4] }}
          transition={{ duration: 1.2, times: [0, 0.3, 1], ease: "easeOut" }}
          className="absolute inset-0 bg-white rounded-full mix-blend-overlay pointer-events-none blur-xl"
        />
      </motion.div>
    </div>
  );
}
