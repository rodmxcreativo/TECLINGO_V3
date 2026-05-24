/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function CommitmentModal() {
  const { acceptTerms } = useAppContext();
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ip, setIp] = useState('0.0.0.0');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Unknown'));
  }, []);

  const handleAccept = async () => {
    if (!accepted) return;
    setIsSubmitting(true);
    try {
      await acceptTerms(ip);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-orange-950/60 backdrop-blur-2xl flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-[#061a1a] border-4 border-orange-500/30 rounded-[3rem] p-12 relative overflow-hidden shadow-[0_40px_100px_rgba(249,115,22,0.2)]"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#DEFF9A]/10 blur-[100px] rounded-full -ml-32 -mb-32" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center text-orange-500 mb-8 shadow-[0_0_40px_rgba(249,115,22,0.2)]">
            <ShieldAlert size={40} className="animate-pulse" />
          </div>

          <h2 className="text-white text-4xl font-black uppercase tracking-tighter italic mb-4">
            CONTRATO DE <span className="text-orange-500">COMPROMISO</span>
          </h2>
          
          <div className="space-y-6 text-left mb-12">
            <p className="text-white/60 text-sm leading-relaxed font-medium">
              Bienvenido a la red neuronal de <span className="text-[#DEFF9A]">TecnoLingo AI</span>. Estás a punto de acceder a una herramienta diseñada para potenciar tu capacidad lingüística mediante biometría académica y algoritmos de IA.
            </p>
            
            <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
              <p className="text-orange-200 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap size={14} /> Requerimientos del Protocolo:
              </p>
              <ul className="space-y-2 text-[11px] text-orange-200/60 font-bold uppercase tracking-wider">
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Obligatoriedad del Examen ADN Inicial.
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Mantenimiento de KPI de Inmersión Diaria.
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Ética en el uso de Copilotos de Voz.
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full space-y-6">
            <label className="flex items-center justify-center gap-4 cursor-pointer group">
              <div 
                onClick={() => setAccepted(!accepted)}
                className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${accepted ? 'bg-orange-500 border-orange-500' : 'border-white/10 bg-white/5'}`}
              >
                {accepted && <CheckCircle2 size={16} className="text-white" />}
              </div>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">He leído y acepto los términos del protocolo</span>
            </label>

            <button 
              onClick={handleAccept}
              disabled={!accepted || isSubmitting}
              className="w-full py-6 rounded-3xl bg-orange-500 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <Zap size={18} className="animate-spin" />
              ) : (
                <>
                  ACTIVAR MI ACCESO
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
            <span>REG_IP_DETECTOR: {ip}</span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <span>TIMESTAMP: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
