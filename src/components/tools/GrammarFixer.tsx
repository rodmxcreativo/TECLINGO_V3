/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Edit3, 
  ChevronLeft, 
  Trash2, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Type,
  FileText,
  MousePointer2,
  Menu,
  Zap,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function GrammarFixer({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-[#061a1a] flex flex-col"
    >
      {/* Header */}
      <header className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-6">
           <button 
             onClick={onClose}
             className="flex items-center gap-3 text-white/40 hover:text-blue-400 transition-colors"
           >
              <ChevronLeft size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Regresar</span>
           </button>
           <div className="h-6 w-px bg-white/10" />
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
                 <Edit3 size={20} />
              </div>
              <h1 className="text-white text-base font-black uppercase tracking-tight">Grammar Fixer</h1>
           </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Rewrite Actions */}
           <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10">
              <button className="px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">Formal</button>
              <button className="px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#DEFF9A] bg-[#DEFF9A]/10 transition-all">Persuasivo</button>
              <button className="px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">Directo</button>
           </div>
           
           <button 
             onClick={handleAnalyze}
             disabled={isAnalyzing || !text.trim()}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
               isAnalyzing || !text.trim()
                 ? 'bg-white/5 text-white/10 border border-white/10'
                 : 'bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105'
             }`}
           >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Refinar Texto
                </>
              )}
           </button>
        </div>
      </header>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
         {/* Main Editor */}
         <div className="flex-1 p-12 bg-white/[0.01]">
            <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6">
               <div className="flex items-center justify-between text-white/20 text-[9px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                     <span className="flex items-center gap-2"><FileText size={12} /> Documento Zen</span>
                     <span className="flex items-center gap-2"><Type size={12} /> {text.split(' ').filter(Boolean).length} palabras</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setText('')} className="hover:text-red-500 transition-colors flex items-center gap-2"><Trash2 size={12} /> Limpiar</button>
                     <button className="hover:text-blue-400 transition-colors flex items-center gap-2"><Copy size={12} /> Copiar</button>
                  </div>
               </div>
               
               <div className="relative flex-1">
                  <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Comienza a escribir tu ensayo, correo o frase..."
                    className="w-full h-full bg-transparent resize-none text-white text-2xl font-medium leading-relaxed focus:outline-none placeholder:text-white/5 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.5em]"
                  />
                  
                  {/* Glowing Underlines Layer (Visualization Only) */}
                  {!isAnalyzing && showAnalysis && text.length > 50 && (
                    <div className="absolute inset-0 pointer-events-none text-transparent text-2xl font-medium leading-relaxed">
                       {/* This would be overlaid precisely over the text in a real implementation */}
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* IA Analysis Sidebar */}
         <AnimatePresence>
            {showAnalysis && (
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-full md:w-96 border-l border-white/5 bg-white/[0.02] backdrop-blur-3xl p-8 overflow-y-auto custom-scrollbar"
              >
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-white text-sm font-black uppercase tracking-tight">Análisis IA</h3>
                       <button onClick={() => setShowAnalysis(false)} className="text-white/20 hover:text-white"><Menu size={16} /></button>
                    </div>

                    <div className="space-y-6">
                       {/* Correction 1 */}
                       <div className="p-6 rounded-2xl bg-amber-400/5 border border-amber-400/20 space-y-4">
                          <div className="flex items-center gap-2 text-amber-400">
                             <Info size={14} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Sugerencia de Estilo</span>
                          </div>
                          <p className="text-white text-xs font-medium leading-relaxed">
                             Cambia <span className="text-amber-400 font-bold decoration-amber-400 underline decoration-2 underline-offset-4">"get more customers"</span> por <span className="text-blue-400 font-bold decoration-blue-400 underline decoration-2 underline-offset-4">"acquire additional clients"</span>.
                          </p>
                          <div className="p-3 rounded-lg bg-white/5 text-[10px] text-white/40 italic leading-relaxed">
                             "Suena más formal y profesional para un entorno corporativo."
                          </div>
                          <button className="w-full py-2 rounded-xl bg-amber-400 text-[#061a1a] text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-transform">APLICAR CAMBIO</button>
                       </div>

                       {/* Correction 2 */}
                       <div className="p-6 rounded-2xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 space-y-4">
                          <div className="flex items-center gap-2 text-[#DEFF9A]">
                             <CheckCircle2 size={14} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Puntuación Fluída</span>
                          </div>
                          <p className="text-white text-xs font-medium leading-relaxed">
                             Tu estructura es excelente. He añadido una coma después de la introducción para mejorar la respiración.
                          </p>
                       </div>

                       {/* Score KPI */}
                       <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2">
                          <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Writing Quality Score</p>
                          <div className="flex items-center justify-center gap-3">
                             <Zap size={20} className="text-blue-400" />
                             <span className="text-3xl font-black text-white">88/100</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Floating Toolbar (Mobile/Selection) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-4 rounded-3xl neo-glass border-white/10 flex items-center gap-6 shadow-2xl">
         <button className="text-white/40 hover:text-white transition-colors" title="Negrita"><Type size={18} /></button>
         <div className="w-px h-6 bg-white/10" />
         <button className="text-white/40 hover:text-white transition-colors" title="Seleccionar IA"><MousePointer2 size={18} /></button>
         <button className="text-[#DEFF9A] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-[#DEFF9A]/10">
            <Zap size={14} fill="currentColor" /> Expert Mode
         </button>
      </div>
    </motion.div>
  );
}
