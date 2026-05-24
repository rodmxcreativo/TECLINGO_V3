/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useSpring, useTransform, animate } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

interface VoltageMeterProps {
  value: number; // 0 to 100
  isProcessing?: boolean;
}

export function VoltageMeter({ value, isProcessing }: VoltageMeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Use springs for smooth needle movement
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 10,
    mass: 1
  });

  const playSound = (type: 'spark' | 'ping') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'spark') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (type === 'spark' ? 0.1 : 0.5));
  };

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        springValue.set(40 + Math.random() * 20);
      }, 50);
      return () => clearInterval(interval);
    } else {
      // Ease-out-back animation manually via animate function
      animate(springValue, value, {
        duration: 1.5,
        ease: [0.34, 1.56, 0.64, 1], // Ease out back
        onUpdate: (latest) => {
          setDisplayValue(latest);
        }
      });

      if (value >= 76) {
        setTimeout(() => playSound('ping'), 1000);
      }
    }
  }, [value, isProcessing]);

  // Map 0-100 to -90 to 90 degrees rotation
  const rotation = useTransform(springValue, [0, 100], [-90, 90]);

  const getStatus = (v: number) => {
    if (v >= 76) return { label: 'NATIVE MATCH', color: 'text-[#DEFF9A]' };
    if (v >= 41) return { label: 'HIGH PERFORMANCE', color: 'text-yellow-400' };
    return { label: 'KEEP PRACTICING', color: 'text-red-500' };
  };

  const status = getStatus(value);

  return (
    <div className="relative w-full max-w-[340px] mx-auto flex flex-col items-center">
      <div className="relative w-full aspect-[2/1] overflow-hidden rounded-t-[10rem] neo-glass border-[#DEFF9A]/30 p-1 bg-black/60 shadow-[0_0_80px_rgba(222,255,154,0.1)]">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="redZone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f87171" opacity="0.8" />
            </linearGradient>
            <linearGradient id="yellowZone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fcd34d" opacity="0.8" />
            </linearGradient>
            <linearGradient id="greenZone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#DEFF9A" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Arc */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />

          {/* Zones */}
          <path d="M 20 100 A 80 80 0 0 1 84 52" fill="none" stroke="url(#redZone)" strokeWidth="12" />
          <path d="M 84 52 A 80 80 0 0 1 144 52" fill="none" stroke="url(#yellowZone)" strokeWidth="12" />
          <path d="M 144 52 A 80 80 0 0 1 180 100" fill="none" stroke="url(#greenZone)" strokeWidth="12" className="drop-shadow-[0_0_5px_#DEFF9A]" />

          {/* Ticks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const angle = (i * 18 - 180) * (Math.PI / 180);
            const x1 = 100 + 75 * Math.cos(angle);
            const y1 = 100 + 75 * Math.sin(angle);
            const x2 = 100 + 90 * Math.cos(angle);
            const y2 = 100 + 90 * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeOpacity="0.2" strokeWidth="1" />
            );
          })}

          {/* Needle */}
          <motion.g style={{ rotate: rotation, originX: '100px', originY: '100px' }}>
             <line x1="100" y1="100" x2="100" y2="20" stroke="#DEFF9A" strokeWidth="3" filter="url(#glow)" />
             <circle cx="100" cy="20" r="2" fill="white" />
          </motion.g>

          {/* Center */}
          <circle cx="100" cy="100" r="10" fill="#061a1a" stroke="#DEFF9A" strokeWidth="2" />
          <circle cx="100" cy="100" r="4" fill="#DEFF9A" />
        </svg>
      </div>

      <div className="mt-8 text-center space-y-2">
        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${status.color}`}>
          {isProcessing ? 'SCANNING VOLTAGE...' : status.label}
        </span>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-mono font-black text-white">{displayValue.toFixed(1)}</span>
          <span className="text-white/20 font-black text-sm">%</span>
        </div>
      </div>
    </div>
  );
}
