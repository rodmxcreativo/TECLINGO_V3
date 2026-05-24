/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  FileText, 
  CheckCircle2,
  Clock, 
  Search, 
  FolderOpen, 
  History,
  TrendingUp,
  MoreVertical,
  Filter,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext, Folio } from '../context/AppContext';

export function FolioMonitor() {
  const { folios } = useAppContext();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'ACTIVOS' | 'HISTORICO' | 'TODOS'>('ACTIVOS');
  const [selectedFolioId, setSelectedFolioId] = useState<string | null>(null);

  const filteredFolios = useMemo(() => {
    return folios.filter(folio => {
      const matchesSearch = 
        folio.id.toLowerCase().includes(search.toLowerCase()) ||
        folio.title.toLowerCase().includes(search.toLowerCase()) ||
        folio.subject.toLowerCase().includes(search.toLowerCase());
      
      const matchesDate = !dateFilter || folio.date.toLowerCase().includes(dateFilter.toLowerCase());
      
      const matchesStatus = 
        activeTab === 'TODOS' ? true :
        activeTab === 'ACTIVOS' ? folio.status === 'PENDING' : 
        folio.status === 'COMPLETED';
      
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [folios, search, dateFilter, activeTab]);

  const stats = useMemo(() => {
    const total = folios.length;
    const completed = folios.filter(f => f.status === 'COMPLETED').length;
    const pending = total - completed;
    const signaturesReceived = folios.reduce((acc, f) => acc + f.signatures.length, 0);
    const totalRequired = folios.reduce((acc, f) => acc + f.assignedToIds.length, 0);
    
    return {
      total,
      completed,
      pending,
      signaturesReceived,
      totalRequired,
      percentage: totalRequired > 0 ? (signaturesReceived / totalRequired) * 100 : 0
    };
  }, [folios]);

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Sidebar: Analytics & Filtering (4 col) */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <GlassCard title="Métricas de Trazabilidad" icon={TrendingUp} accent="green">
          <div className="space-y-6">
            <div className="p-5 rounded-[2rem] bg-black/40 border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-[#DEFF9A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex justify-between items-center mb-4 relative z-10">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Sincronización de Firmas</span>
                  <span className="text-[#DEFF9A] text-xs font-black">{stats.percentage.toFixed(0)}%</span>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full relative z-10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percentage}%` }}
                    className="h-full bg-[#DEFF9A] shadow-[0_0_15px_#DEFF9A]" 
                  />
               </div>
               <div className="mt-4 grid grid-cols-3 gap-2 relative z-10">
                  <div className="text-center">
                    <p className="text-[16px] font-black text-white">{stats.total}</p>
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-black text-[#DEFF9A]">{stats.signaturesReceived}</p>
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Firmas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-black text-[#F59E0B]">{stats.pending}</p>
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Espera</p>
                  </div>
               </div>
            </div>

            <nav className="flex flex-col gap-2">
               <button 
                onClick={() => setActiveTab('ACTIVOS')}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  activeTab === 'ACTIVOS' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/30 hover:bg-white/5 hover:text-white/60'
                }`}
               >
                  <div className="flex items-center gap-3">
                     <FolderOpen size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Folios Activos</span>
                  </div>
                  <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded-lg">{stats.pending}</span>
               </button>
               <button 
                onClick={() => setActiveTab('HISTORICO')}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  activeTab === 'HISTORICO' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/30 hover:bg-white/5 hover:text-white/60'
                }`}
               >
                  <div className="flex items-center gap-3">
                     <History size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Archivo Histórico</span>
                  </div>
                  <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded-lg">{stats.completed}</span>
               </button>
               <button 
                onClick={() => setActiveTab('TODOS')}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  activeTab === 'TODOS' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/30 hover:bg-white/5 hover:text-white/60'
                }`}
               >
                  <div className="flex items-center gap-3">
                     <Filter size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Vista Global</span>
                  </div>
                  <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded-lg">{stats.total}</span>
               </button>
            </nav>
          </div>
        </GlassCard>

        <div className="p-6 rounded-[2.5rem] bg-black/40 border border-white/5 border-dashed flex flex-col items-center text-center space-y-4">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
              <Filter size={24} />
           </div>
           <div>
              <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">Filtro Inteligente</p>
              <p className="text-white/20 text-[8px] font-bold uppercase tracking-tighter leading-relaxed">Organiza por fecha, docente o departamento para una gestión Zero-Paper eficiente.</p>
           </div>
        </div>
      </div>

      {/* Main Content: Folder View (8 col) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 group w-full">
               <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#DEFF9A] transition-colors" />
               <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="ID, Asunto..."
                 className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 pl-14 pr-6 text-white text-[11px] font-bold outline-none focus:border-[#DEFF9A]/40 transition-all"
               />
            </div>
            <div className="relative w-full sm:w-48 group">
               <CalendarIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#DEFF9A] transition-colors" />
               <input 
                 type="text" 
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value)}
                 placeholder="Filtrar Fecha..."
                 className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 pl-14 pr-6 text-white text-[11px] font-bold outline-none focus:border-[#DEFF9A]/40 transition-all"
               />
            </div>
            <div className="flex gap-2">
               <button className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:text-white hover:border-white/20 transition-all">
                  <FolderOpen size={18} />
               </button>
               <button className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:text-white hover:border-white/20 transition-all">
                  <MoreVertical size={18} />
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[calc(100vh-350px)]">
            <AnimatePresence mode="popLayout">
               {filteredFolios.map((folio) => (
                 <motion.div 
                   key={folio.id}
                   layout
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className={`p-6 rounded-[2.5rem] bg-black/20 border transition-all hover:border-white/20 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                     selectedFolioId === folio.id ? 'border-[#DEFF9A]/40 bg-[#DEFF9A]/5 shadow-[0_20px_50px_rgba(222,255,154,0.05)]' : 'border-white/5'
                   }`}
                   onClick={() => setSelectedFolioId(selectedFolioId === folio.id ? null : folio.id)}
                 >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                         folio.status === 'COMPLETED' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                       }`}>
                          <FileText size={28} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                             <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{folio.id}</span>
                             <span className="text-white/10 text-[8px]">•</span>
                             <span className="text-[10px] font-black text-[#DEFF9A] uppercase tracking-widest bg-[#DEFF9A]/5 px-2 py-0.5 rounded-lg border border-[#DEFF9A]/10">
                                {folio.signatures.length}/{folio.assignedToIds.length} Firmas
                             </span>
                          </div>
                          <h4 className="text-white text-lg font-black tracking-tight uppercase truncate">{folio.title}</h4>
                          <p className="text-white/40 text-[10px] font-bold tracking-widest mt-1 truncate italic">{folio.subject}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start pt-4 sm:pt-0 border-t sm:border-none border-white/5">
                       <div className="flex flex-col items-end">
                          <p className="text-white text-[10px] font-black uppercase mb-1">{folio.date}</p>
                          <div className="flex -space-x-2">
                             {folio.assignedToIds.map((id, i) => (
                               <div key={id} className={`w-6 h-6 rounded-full border border-[#061a1a] flex items-center justify-center text-[8px] font-black ${
                                 folio.signatures.some(s => s.teacherId === id) ? 'bg-[#4ADE80] text-[#061a1a]' : 'bg-white/10 text-white/40'
                               }`}>
                                  {id.slice(-1)}
                               </div>
                             ))}
                          </div>
                       </div>
                       <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#DEFF9A] group-hover:bg-[#DEFF9A]/10 transition-all border border-white/5">
                          <ChevronRight size={20} />
                       </button>
                    </div>

                    {/* Expanded Detail Panel */}
                    <AnimatePresence>
                       {selectedFolioId === folio.id && (
                         <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="w-full pt-6 mt-6 border-t border-white/5 overflow-hidden"
                         >
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-3">Trazabilidad de Firmas</p>
                                  <div className="space-y-3">
                                     {folio.assignedToIds.map(id => {
                                       const signature = folio.signatures.find(s => s.teacherId === id);
                                       return (
                                         <div key={id} className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-white/60">Docente {id}</span>
                                            {signature ? (
                                              <div className="flex items-center gap-2 text-[#4ADE80]">
                                                 <span className="text-[8px] font-black uppercase">{signature.timestamp}</span>
                                                 <CheckCircle2 size={12} />
                                              </div>
                                            ) : (
                                              <Clock size={12} className="text-[#F59E0B]" />
                                            )}
                                         </div>
                                       );
                                     })}
                                  </div>
                               </div>
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-3">Evidencia Recibida ({folio.evidence.length})</p>
                                  <div className="flex flex-wrap gap-2 text-[8px] font-black text-white/40">
                                     {folio.evidence.length > 0 ? folio.evidence.map((e, idx) => (
                                       <span key={idx} className="bg-white/5 px-2 py-1 rounded-lg border border-white/10 uppercase tracking-widest">{e.fileName}</span>
                                     )) : (
                                       <span className="italic opacity-50">Sin evidencias aún...</span>
                                     )}
                                  </div>
                               </div>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </motion.div>
               ))}

               {filteredFolios.length === 0 && (
                 <div className="p-20 text-center opacity-20">
                    <History size={64} className="mx-auto mb-6" />
                    <p className="text-sm font-black uppercase tracking-[0.4em]">Sin Resultados en {activeTab}</p>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
