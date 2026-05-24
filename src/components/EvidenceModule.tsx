/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  FileCheck, 
  History,
  Trash2,
  Maximize2,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext } from '../context/AppContext';

export function EvidenceModule() {
  const { folios, addFolioEvidence } = useAppContext();
  const [isHovering, setIsHovering] = useState(false);
  const [selectedFolioId, setSelectedFolioId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Filter signed folios for the current teacher (demo USR-901-B33)
  const teacherId = 'USR-901-B33';
  const mySignedFolios = folios.filter(f => 
    f.assignedToIds.includes(teacherId) && 
    f.signatures.some(s => s.teacherId === teacherId)
  );

  const handleUpload = () => {
    if (!selectedFolioId) return;
    setIsUploading(true);
    
    setTimeout(() => {
      addFolioEvidence(selectedFolioId, {
        teacherId,
        teacherName: 'Ana López',
        fileName: `EVIDENCIA_${Math.floor(Math.random() * 1000)}.pdf`,
        fileUrl: '#',
        timestamp: new Date().toLocaleTimeString()
      });
      setIsUploading(false);
      setSelectedFolioId('');
    }, 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-12 gap-8">
        {/* Dropzone de Cristal */}
        <div className="col-span-12 lg:col-span-7">
          <GlassCard title="Repository: Carga de Evidencia" icon={Camera} accent="cyan">
             <div className="space-y-6">
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Vincular a Folio Firmado</label>
                   <select 
                    value={selectedFolioId}
                    onChange={(e) => setSelectedFolioId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs font-bold focus:border-[#22D3EE]/40 outline-none appearance-none"
                   >
                      <option value="" className="bg-[#061a1a]">-- Selecciona un folio validado --</option>
                      {mySignedFolios.map(f => (
                        <option key={f.id} value={f.id} className="bg-[#061a1a]">{f.id} - {f.title}</option>
                      ))}
                   </select>
                </div>

                <div 
                  onDragOver={() => setIsHovering(true)}
                  onDragLeave={() => setIsHovering(false)}
                  onClick={() => selectedFolioId && handleUpload()}
                  className={`aspect-video rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-12 group cursor-pointer ${
                    !selectedFolioId ? 'opacity-20 cursor-not-allowed border-white/5' :
                    isHovering ? 'bg-[#22D3EE]/5 border-[#22D3EE] scale-[1.02]' : 
                    'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                   <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#22D3EE] group-hover:bg-[#22D3EE]/10 transition-all mb-6">
                      {isUploading ? <div className="w-12 h-12 border-4 border-[#22D3EE] border-t-transparent rounded-full animate-spin" /> : <Upload size={40} />}
                   </div>
                   <h4 className="text-white text-xl font-black uppercase tracking-tight mb-2">
                      {isUploading ? 'Validando Archivos...' : 'Subir Evidencia PDF'}
                   </h4>
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] text-center max-w-sm leading-loose">
                      {!selectedFolioId 
                        ? 'Primero selecciona un folio firmado para habilitar el repositorio.' 
                        : 'Arrastra tus evidencias PDF o toca para seleccionar archivos. El sistema TECLINGO PRO 1.1 vinculará la evidencia al folio seleccionado.'}
                   </p>
                </div>
             </div>
          </GlassCard>
        </div>

        {/* Metadata & Status Dashboard */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
           <GlassCard title="Estatus de Validación" icon={FileCheck} accent="green">
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Folios con Evidencia</p>
                       <p className="text-xs font-black text-white">{folios.filter(f => f.evidence.length > 0).length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Total Archivos</p>
                       <p className="text-xs font-black text-white">{folios.reduce((acc, f) => acc + f.evidence.length, 0)}</p>
                    </div>
                 </div>

                 <div className="p-6 rounded-3xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/10">
                    <p className="text-xs font-black text-[#DEFF9A] uppercase tracking-widest mb-2 flex items-center gap-2">
                       <History size={14} /> Trazabilidad Institucional
                    </p>
                    <p className="text-white/40 text-[10px] font-medium leading-relaxed italic">
                       "Cada documento adjunto se vincula perpetuamente a la ID de tu folio firmado. Este proceso garantiza la transparencia académica ante auditorías."
                    </p>
                 </div>

                 <div className="bg-black/40 rounded-2xl border border-white/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Recién Vinculados</p>
                    <div className="space-y-2">
                       {folios.flatMap(f => f.evidence).slice(0, 3).map((e, idx) => (
                         <div key={idx} className="flex items-center gap-3 text-[10px] text-white/60">
                            <Paperclip size={12} className="text-[#DEFF9A]" />
                            <span className="truncate">{e.fileName}</span>
                            <CheckCircle2 size={10} className="text-[#4ADE80] ml-auto" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
