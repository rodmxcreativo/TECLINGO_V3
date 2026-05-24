/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Mail, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  X, 
  Download,
  ShieldCheck,
  Signature as SigIcon,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext, Folio } from '../context/AppContext';
import { SignaturePadComponent } from './SignaturePadComponent';

export function FoliosDocente() {
  const { folios, signFolio } = useAppContext();
  const [selectedFolio, setSelectedFolio] = useState<Folio | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Filter folios assigned to "current teacher" (hardcoded to USR-901-B33 for demo)
  const teacherId = 'USR-901-B33';
  const myFolios = folios.filter(f => f.assignedToIds.includes(teacherId));

  const handleConfirmSignature = (signatureData: string) => {
    if (!selectedFolio) return;
    
    signFolio(selectedFolio.id, {
      teacherId,
      teacherName: 'Ana López',
      signatureData,
      timestamp: new Date().toLocaleTimeString()
    });
    
    setIsSigning(false);
  };

  const isAlreadySigned = (folio: Folio) => {
    return folio.signatures.some(s => s.teacherId === teacherId);
  };

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Lista de Circulares */}
      <div className="col-span-12 lg:col-span-8">
        <GlassCard title="Buzón de Comunicaciones Oficiales" icon={Mail} accent="green">
           <div className="space-y-4">
              {myFolios.map((folio) => {
                const signed = isAlreadySigned(folio);
                return (
                  <motion.div 
                    key={folio.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedFolio(folio)}
                    className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-center gap-6 group ${
                      !signed 
                      ? 'bg-[#F59E0B]/5 border-[#F59E0B]/20 overflow-hidden relative' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    }`}
                  >
                     {!signed && (
                       <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/10 to-transparent opacity-50" />
                     )}

                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative z-10 ${
                       !signed ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-white/5 text-white/20'
                     }`}>
                        {!signed ? <FileText size={28} /> : <CheckCircle2 size={28} />}
                     </div>

                     <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{folio.id}</span>
                           <span className="text-white/20 text-[8px]">•</span>
                           <span className="text-white/20 text-[8px] font-bold uppercase">{folio.date}</span>
                        </div>
                        <h4 className="text-white text-lg font-bold tracking-tight uppercase truncate">{folio.title}</h4>
                        <p className="text-white/40 text-[10px] font-bold tracking-widest mt-1 truncate">POR: {folio.senderName}</p>
                     </div>

                     <div className="text-right relative z-10">
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                          !signed ? 'text-[#F59E0B]' : 'text-[#4ADE80]'
                        }`}>
                           {signed ? 'FIRMADO' : 'PENDIENTE'}
                        </p>
                        <ChevronRight size={18} className="text-white/10 group-hover:text-white transition-colors ml-auto" />
                     </div>
                  </motion.div>
                );
              })}
              
              {myFolios.length === 0 && (
                <div className="p-12 text-center opacity-20">
                  <Mail size={48} className="mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Buzón Vacío</p>
                </div>
              )}
           </div>
        </GlassCard>
      </div>

      {/* Info Sidebar */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
         <GlassCard title="Firma Biométrica" icon={ShieldCheck} accent="cyan">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center text-[#4ADE80]">
                     <SigIcon size={24} />
                  </div>
                  <div>
                     <p className="text-white text-xs font-black uppercase">Seguridad Digital</p>
                     <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Protocolo TLS v3</p>
                  </div>
               </div>
               <p className="text-white/60 text-[11px] leading-relaxed italic border-l-2 border-white/5 pl-4">
                 "Tu firma digital en estos folios sustituye al papel físico. Una vez firmado, el Director General recibe una notificación de lectura sellada con tu ID y Timestamp."
               </p>
               <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Info size={14} />
                  <p className="text-[8px] font-black uppercase tracking-widest">Se captura IP y dispositivo durante la firma.</p>
               </div>
            </div>
         </GlassCard>
      </div>

      {/* Folio Viewer Modal */}
      <AnimatePresence>
        {selectedFolio && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
          >
             <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-3xl w-full neo-glass border-white/20 rounded-[3rem] overflow-hidden flex flex-col max-h-[85vh] shadow-[0_0_100px_rgba(222,255,154,0.1)]"
             >
                <div className="p-10 border-b border-white/10 flex justify-between items-center">
                   <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{selectedFolio.title}</h3>
                      <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.2em] mt-2">Tecnolingo AI • {selectedFolio.id}</p>
                   </div>
                   <button 
                    onClick={() => { setSelectedFolio(null); setIsSigning(false); }}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
                   >
                      <X size={20} />
                   </button>
                </div>

                <div className="p-12 overflow-y-auto space-y-8 custom-scrollbar">
                   <div className="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                      <span>DOCENTE: ANA LÓPEZ</span>
                      <span>EMISIÓN: {selectedFolio.date}</span>
                   </div>

                   <div className="prose prose-invert max-w-none">
                      <p className="text-white/70 text-base leading-relaxed font-medium whitespace-pre-wrap">
                        {selectedFolio.content}
                        {"\n\n"}
                        Este documento tiene validez institucional bajo el marco de operación "Zero Paper" 2026. Al firmar este folio, usted declara estar enterado de las condiciones y lineamientos aquí descritos.
                      </p>
                   </div>

                   <div className="pt-12 border-t border-white/10">
                      {isAlreadySigned(selectedFolio) ? (
                        <div className="bg-[#4ADE80]/5 border border-[#4ADE80]/20 rounded-[2.5rem] p-8 flex flex-col items-center">
                           <div className="text-center mb-6">
                              <p className="text-[#4ADE80] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Folio Validado</p>
                              <div className="bg-white p-4 rounded-xl">
                                 <img 
                                  src={selectedFolio.signatures.find(s => s.teacherId === teacherId)?.signatureData} 
                                  alt="Firma" 
                                  className="h-24 w-auto object-contain"
                                 />
                              </div>
                           </div>
                           <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">FIRMADO ELECTRÓNICAMENTE POR</p>
                           <p className="text-white text-lg font-black uppercase mb-1">ANA LÓPEZ</p>
                           <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">
                              ID: {teacherId} • {selectedFolio.signatures.find(s => s.teacherId === teacherId)?.timestamp}
                           </p>
                        </div>
                      ) : isSigning ? (
                        <SignaturePadComponent 
                          onSave={handleConfirmSignature}
                          onCancel={() => setIsSigning(false)}
                        />
                      ) : (
                        <div className="space-y-6">
                           <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                              <SigIcon size={32} className="text-[#F59E0B]" />
                              <div>
                                 <p className="text-white text-sm font-black uppercase">Requiere Firma Digital</p>
                                 <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Proceda a validar el documento para su archivo</p>
                              </div>
                           </div>
                           
                           <div className="flex gap-4">
                              <button className="flex-1 py-4 border border-white/10 rounded-2xl text-white/20 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
                                 <Download size={14} /> Descargar PDF
                              </button>
                              <button 
                                onClick={() => setIsSigning(true)}
                                className="flex-[2] py-4 bg-[#F59E0B] text-[#061a1a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_#F59E0B80] hover:scale-[1.02] transition-all"
                              >
                                 Abrir Panel de Firma
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
