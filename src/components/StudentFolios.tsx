/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Mail, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  ShieldCheck,
  Signature,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface Folio {
  id: string;
  title: string;
  date: string;
  sender: string;
  status: 'PENDIENTE' | 'FIRMADO';
  body: string;
}

const mockFolios: Folio[] = [
  { 
    id: 'FOL-STU-102', 
    title: 'Actualización de Requisitos para el Certificado B1', 
    date: '12 MAYO, 2026', 
    sender: 'Coord. Académica TECLINGO', 
    status: 'PENDIENTE',
    body: 'Estimado Alumno, se le informa que para la validación de su nivel B1 deberá completar al menos 15 sesiones exitosas en "The Bridge" y subir su evidencia de pasaporte digital...'
  },
  { 
    id: 'FOL-STU-095', 
    title: 'Invitación: Workshop AR Inmersivo Verano', 
    date: '05 MAYO, 2026', 
    sender: 'Innovation Hub', 
    status: 'FIRMADO',
    body: 'Te invitamos a participar en el próximo workshop de Realidad Aumentada aplicada a contextos de negocios...'
  },
];

export function StudentFolios() {
  const [selectedFolio, setSelectedFolio] = useState<Folio | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Principal List */}
      <div className="col-span-12 lg:col-span-8">
        <GlassCard title="Buzón de Avisos Oficiales" icon={Mail} accent="green">
           <div className="space-y-4">
              {mockFolios.map((folio) => (
                <motion.div 
                  key={folio.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedFolio(folio)}
                  className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all flex items-center gap-6 group ${
                    folio.status === 'PENDIENTE' 
                    ? 'bg-orange-500/5 border-orange-500/20' 
                    : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                     folio.status === 'PENDIENTE' ? 'bg-orange-500/10 text-orange-400' : 'bg-white/5 text-white/20'
                   }`}>
                      {folio.status === 'PENDIENTE' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                   </div>

                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{folio.id}</span>
                         <span className="text-white/10 text-[8px]">•</span>
                         <span className="text-white/20 text-[9px] font-bold uppercase">{folio.date}</span>
                      </div>
                      <h4 className="text-white text-lg font-black uppercase tracking-tight truncate">{folio.title}</h4>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1 truncate">ORIGEN: {folio.sender}</p>
                   </div>

                   <div className="text-right">
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        folio.status === 'PENDIENTE' ? 'text-orange-400' : 'text-[#4ADE80]'
                      }`}>
                         {folio.status}
                      </p>
                      <ChevronRight size={18} className="text-white/10 group-hover:text-[#DEFF9A] transition-colors ml-auto" />
                   </div>
                </motion.div>
              ))}
           </div>
        </GlassCard>
      </div>

      {/* Logic Sidebar */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
         <GlassCard title="Firma Digital Alumno" icon={ShieldCheck} accent="cyan">
            <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                   <p className="text-[10px] font-black text-white uppercase mb-4 flex items-center gap-2">
                       <Signature size={14} className="text-cyan-400" /> Protocolo de Validez
                   </p>
                   <p className="text-white/40 text-[10px] leading-relaxed font-medium italic">
                     "Al firmar estos documentos, confirmas que has leído y comprendido los avisos oficiales de la institución. Tu firma está protegida por encriptación TECLINGO PRO 1.1."
                   </p>
                </div>
            </div>
         </GlassCard>
      </div>

      {/* Modal View */}
      <AnimatePresence>
        {selectedFolio && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061a1a]/98 backdrop-blur-3xl p-8"
          >
             <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-3xl w-full neo-glass border-white/20 rounded-[3.5rem] overflow-hidden flex flex-col max-h-[90vh]"
             >
                <div className="p-10 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                   <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedFolio.title}</h3>
                      <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mt-2">Expediente Alumno Inmersivo • {selectedFolio.id}</p>
                   </div>
                   <button 
                    onClick={() => { setSelectedFolio(null); setIsSigning(false); }}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
                   >
                      <X size={20} />
                   </button>
                </div>

                <div className="p-12 overflow-y-auto space-y-10 custom-scrollbar">
                   <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-white/20 text-[8px] font-black uppercase mb-1">Emitido por</span>
                        <span className="text-white text-xs font-black uppercase tracking-widest">{selectedFolio.sender}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-white/20 text-[8px] font-black uppercase mb-1">Fecha Emisión</span>
                        <span className="text-white text-xs font-black uppercase tracking-widest">{selectedFolio.date}</span>
                      </div>
                   </div>

                   <p className="text-white/60 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                      {selectedFolio.body}
                   </p>

                   <div className="pt-12 border-t border-white/10">
                      {selectedFolio.status === 'FIRMADO' || isSigning ? (
                        <div className="bg-[#4ADE80]/5 border border-[#4ADE80]/20 rounded-[3rem] p-10 flex flex-col items-center text-center">
                           <div className="w-24 h-24 mb-6 text-[#4ADE80]">
                              <CheckCircle2 size={96} strokeWidth={1} />
                           </div>
                           <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Documento Certificado</p>
                           <p className="text-white text-2xl font-black uppercase mb-2">ALUMNO_ID_042</p>
                           <p className="text-white/40 text-[11px] font-mono tracking-widest uppercase">TIMESTAMP: {new Date().toLocaleString()}</p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                           <div className="p-10 rounded-[2.5rem] bg-black/40 border border-white/5 flex flex-col items-center text-center">
                              <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-6">Dibuja tu firma en el panel</p>
                              <div className="w-full h-40 border-2 border-dashed border-[#DEFF9A]/20 rounded-3xl relative overflow-hidden flex items-center justify-center group">
                                 <Signature size={64} className="text-white/5 group-hover:text-white/10 transition-colors" />
                                 <div className="absolute inset-x-12 bottom-10 h-[2px] bg-[#DEFF9A]/40 shadow-[0_0_10px_#DEFF9A]" />
                                 <button 
                                  onClick={() => setIsSigning(true)}
                                  className="absolute inset-0 z-10"
                                 />
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <button className="flex-1 py-5 border border-white/10 rounded-2xl text-white/40 text-xs font-black uppercase hover:text-white transition-colors">Cancelar</button>
                              <button 
                                onClick={() => setIsSigning(true)}
                                className="flex-[2] py-5 bg-[#DEFF9A] text-[#061a1a] rounded-2xl text-xs font-black uppercase shadow-[0_10px_40px_rgba(222,255,154,0.3)]"
                              >
                                Certificar Folio Now
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
