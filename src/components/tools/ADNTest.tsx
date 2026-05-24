/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Dna, 
  ChevronLeft, 
  ChevronRight, 
  Brain, 
  Target, 
  Sparkles,
  Search,
  Book,
  Globe,
  Monitor,
  Heart,
  Palette,
  Camera,
  Coffee,
  Plane,
  Gamepad2,
  Mic2,
  Lightbulb,
  Zap,
  LogIn,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DNAInterest {
  id: string;
  label: string;
  icon: any;
  color: string;
}

const INTERESTS: DNAInterest[] = [
  { id: 'tech', label: 'Tecnología', icon: Monitor, color: 'text-cyan-400' },
  { id: 'travel', label: 'Viajes', icon: Plane, color: 'text-orange-400' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'text-purple-400' },
  { id: 'art', label: 'Arte & Diseño', icon: Palette, color: 'text-pink-400' },
  { id: 'music', label: 'Música', icon: Mic2, color: 'text-yellow-400' },
  { id: 'photo', label: 'Fotografía', icon: Camera, color: 'text-blue-400' },
  { id: 'food', label: 'Gastronomía', icon: Coffee, color: 'text-red-400' },
  { id: 'nature', label: 'Naturaleza', icon: TreeIcon, color: 'text-green-400' },
];

function TreeIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 10 3 3-3 3"/><path d="M14 6h1a2 2 0 0 1 2 2v2"/><path d="M12 2v20"/><path d="M7 10 4 13l3 3"/><path d="M10 6H9a2 2 0 0 0-2 2v2"/></svg>
  );
}

export function ADNTest({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Calibrando Algoritmo Neuronal...');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState<string | null>(null);
  const [academicAnswers, setAcademicAnswers] = useState<Record<string, string>>({});
  
  // Audio State
  const [audioPlays, setAudioPlays] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePlayAudio = () => {
    if (audioPlays >= 2) return;
    
    setIsAudioLoading(true);
    setTimeout(() => {
      setIsAudioLoading(false);
      setIsPlaying(true);
      setAudioPlays(prev => prev + 1);
      
      // Simulate audio duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 4000);
    }, 800);
  };

  const nextStep = () => {
    if (step === 3) {
      setIsSyncing(true);
      
      const statuses = [
        'Analizando Sintaxis de Escritura...',
        'Mapeando Intereses: ' + selectedInterests.join(', '),
        'Calibrando Nivel Oxford...',
        'Generando Plan de Aprendizaje Adaptativo...',
        'Sincronización Completa.'
      ];

      statuses.forEach((status, index) => {
        setTimeout(() => setSyncStatus(status), index * 1000);
      });

      setTimeout(() => {
        setIsSyncing(false);
        onClose();
      }, 5500);
    } else {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  if (isSyncing) {
    return (
      <div className="fixed inset-0 z-[160] bg-[#061a1a] flex flex-col items-center justify-center p-8">
        <div className="relative w-48 h-48 mb-8">
          <div className="absolute inset-0 bg-[#DEFF9A]/10 blur-[60px] rounded-full animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-full flex items-center justify-center"
          >
            <Dna size={80} className="text-[#DEFF9A]" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">PROCESANDO ADN...</h2>
        <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-8">{syncStatus}</p>
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: "easeInOut" }}
            className="h-full bg-[#DEFF9A]"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-[#061a1a] flex flex-col overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-4xl mx-auto w-full p-8 py-20 flex flex-col min-h-screen">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-20 text-white/20">
           <button onClick={onClose} className="hover:text-white transition-colors flex items-center gap-2">
              <ChevronLeft size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Abandonar Test</span>
           </button>
           
           <div className="flex gap-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`h-1 w-12 rounded-full transition-all ${step >= i ? 'bg-[#DEFF9A]' : 'bg-white/10'}`} />
              ))}
           </div>

           <div className="flex items-center gap-3">
              <Dna className="text-[#DEFF9A]" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">ADN MODULO {step}/3</span>
           </div>
        </div>

        <AnimatePresence mode="wait">
           {step === 0 && (
             <motion.div 
               key="step0"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-12 max-w-2xl mx-auto"
             >
                <div className="text-center space-y-4 md:space-y-6">
                   <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-[#DEFF9A]/10 border-2 border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] mx-auto shadow-[0_0_60px_rgba(222,255,154,0.3)] relative">
                      <ShieldSecret size={32} className="md:size-[48px]" />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-[#DEFF9A]/5 rounded-[2rem] md:rounded-[2.5rem]"
                      />
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">PROTOCOLÓ DE <span className="text-[#DEFF9A]">HONESTIDAD</span></h2>
                   <p className="text-[#DEFF9A] text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]">Tu ADN define tu éxito</p>
                </div>

                <div className="neo-glass border-[#DEFF9A]/10 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8">
                   <div className="flex gap-4 md:gap-6 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                         <Target size={20} className="text-white md:size-[24px]" />
                      </div>
                      <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed">
                         Este examen no es para calificarte, es para <span className="text-white font-black">conocerte</span>. Responde con tu propio esfuerzo.
                      </p>
                   </div>
                   <div className="flex gap-4 md:gap-6 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                         <Zap size={20} className="text-red-400 md:size-[24px]" />
                      </div>
                      <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed italic">
                         "Si recibes ayuda, la IA diseñará contenido con un nivel superior al tuyo, lo que causará frustración y detendrá tu progreso real."
                      </p>
                   </div>
                   <div className="pt-2 md:pt-4 flex items-center justify-center gap-3 md:gap-4 text-[#DEFF9A]">
                      <Sparkles size={14} />
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest font-mono">Datos reales = Contenido que amas.</span>
                      <Sparkles size={14} />
                   </div>
                </div>

                <div className="pt-4 md:pt-8 text-center">
                   <button 
                    onClick={nextStep}
                    className="w-full sm:w-auto px-12 md:px-16 py-5 md:py-6 rounded-2xl md:rounded-3xl bg-[#DEFF9A] text-[#061a1a] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(222,255,154,0.4)] hover:scale-105 active:scale-95 transition-all"
                   >
                      ACEPTO EL PROTOCOLO
                   </button>
                </div>
             </motion.div>
           )}

           {step === 1 && (
             <motion.div 
               key="step1"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8 md:space-y-12 text-center"
             >
                <div className="space-y-4">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] mx-auto shadow-[0_0_50px_rgba(222,255,154,0.2)]">
                      <Heart size={32} className="md:size-[40px]" />
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">¿Qué te apasiona?</h2>
                   <p className="text-white/40 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em]">HACKEAREMOS TU MOTIVACIÓN CON TUS GUSTOS</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   {INTERESTS.map((item) => (
                     <button
                        key={item.id}
                        onClick={() => toggleInterest(item.id)}
                        className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 md:gap-4 group ${
                          selectedInterests.includes(item.id)
                            ? 'bg-[#DEFF9A]/10 border-[#DEFF9A] text-[#DEFF9A] shadow-[0_0_30px_rgba(222,255,154,0.2)]'
                            : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.05] hover:border-white/20'
                        }`}
                     >
                        <item.icon size={24} className={`md:size-[32px] ${selectedInterests.includes(item.id) ? item.color : 'group-hover:text-white'}`} />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                     </button>
                   ))}
                </div>

                <div className="pt-8 md:pt-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                   <button onClick={prevStep} className="w-full sm:w-auto px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl border border-white/10 text-white/40 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-white transition-all order-2 sm:order-1">Regresar</button>
                   <button 
                    disabled={selectedInterests.length < 3}
                    onClick={nextStep}
                    className="w-full sm:w-auto px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl bg-[#DEFF9A] text-[#061a1a] text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_40px_rgba(222,255,154,0.4)] hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all flex items-center justify-center gap-4 order-1 sm:order-2"
                   >
                      Siguiente Paso <ChevronRight size={18} />
                   </button>
                </div>
             </motion.div>
           )}

           {step === 2 && (
             <motion.div 
               key="step2"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8 md:space-y-12"
             >
                <div className="text-center space-y-4">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mx-auto">
                      <Brain size={32} className="md:size-[40px]" />
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Tu Canal de Aprendizaje</h2>
                   <p className="text-white/40 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em]">DESCUBRIREMOS CÓMO PROCESA TU CEREBRO</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                   {[
                     { id: 'visual', label: 'Visual', desc: 'Aprendo mejor con videos, mapas mentales e imágenes.', icon: Camera },
                     { id: 'auditory', label: 'Auditivo', desc: 'Retengo mejor la información escuchando y participando.', icon: Mic2 },
                     { id: 'kinesthetic', label: 'Kinestésico', desc: 'Necesito interactuar, moverme y aplicar el conocimiento.', icon: Zap },
                   ].map((style) => (
                     <button
                        key={style.id}
                        onClick={() => setLearningStyle(style.id)}
                        className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 transition-all flex flex-col items-center text-center gap-4 md:gap-6 ${
                          learningStyle === style.id
                            ? 'bg-cyan-400/10 border-cyan-400 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                            : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.05] hover:border-white/20'
                        }`}
                     >
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center ${learningStyle === style.id ? 'bg-cyan-400 text-[#061a1a]' : 'bg-white/5'}`}>
                           <style.icon size={24} className="md:size-[32px]" />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-base md:text-lg font-black uppercase tracking-tight">{style.label}</h4>
                           <p className="text-[9px] md:text-[10px] font-medium leading-relaxed opacity-60 px-2 md:px-4">{style.desc}</p>
                        </div>
                     </button>
                   ))}
                </div>

                <div className="pt-8 md:pt-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                   <button onClick={prevStep} className="w-full sm:w-auto px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl border border-white/10 text-white/40 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-white transition-all order-2 sm:order-1">Regresar</button>
                   <button 
                    disabled={!learningStyle}
                    onClick={nextStep}
                    className="w-full sm:w-auto px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl bg-cyan-400 text-[#061a1a] text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all flex items-center justify-center gap-4 order-1 sm:order-2"
                   >
                      Diagnóstico Académico <ChevronRight size={18} />
                   </button>
                </div>
             </motion.div>
           )}

           {step === 3 && (
             <motion.div 
               key="step3"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8 md:space-y-12"
             >
                <div className="text-center space-y-4">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                      <Target size={32} className="md:size-[40px]" />
                   </div>
                   <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter italic">DIAGNÓSTICO <span className="text-purple-400">LAS 5 SKILLS</span></h2>
                   <p className="text-white/40 text-[9px] md:text-xs font-medium uppercase tracking-[0.3em]">CALIBRAREMOS TU NIVEL INSTITUCIONAL</p>
                </div>

                <div className="neo-glass border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-8 md:space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                     {/* Section 1: Grammar/Reading */}
                     <div className="space-y-6 md:space-y-8">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-purple-400">
                              <Book size={14} className="md:size-[16px]" />
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Grammar & Reading</span>
                           </div>
                           <h4 className="text-white text-sm md:text-base font-black leading-tight">1. "If I ________ more time, I would have traveled to Japan last year."</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                              {['had', 'have', 'had had', 'would have had'].map(ans => (
                                <button 
                                  key={ans}
                                  onClick={() => setAcademicAnswers({...academicAnswers, q1: ans})}
                                  className={`px-4 md:px-6 py-3 md:py-4 rounded-xl border text-[9px] md:text-[10px] font-black uppercase tracking-widest text-left transition-all ${
                                    academicAnswers.q1 === ans ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                                  }`}
                                >
                                  {ans}
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Section 2: Listening/Speaking Simulation */}
                     <div className="space-y-6 md:space-y-8">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-cyan-400">
                                 <Mic2 size={14} className="md:size-[16px]" />
                                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Listening & Speaking</span>
                              </div>
                              <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${audioPlays >= 2 ? 'text-red-400' : 'text-white/20'}`}>
                                 {audioPlays}/2 Intentos
                              </span>
                           </div>
                           <div className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden">
                              {isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                                   {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                                     <motion.div 
                                       key={i}
                                       animate={{ height: [10, 40, 10] }}
                                       transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                       className="w-1 bg-cyan-400 rounded-full"
                                     />
                                   ))}
                                </div>
                              )}

                              <button 
                                onClick={handlePlayAudio}
                                disabled={audioPlays >= 2 || isAudioLoading || isPlaying}
                                className={`w-full py-3 md:py-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${
                                  audioPlays >= 2 
                                    ? 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed' 
                                    : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20'
                                }`}
                              >
                                 {isAudioLoading ? (
                                   <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                 ) : isPlaying ? (
                                   <Zap size={14} className="animate-pulse md:size-[18px]" />
                                 ) : (
                                   <Play size={14} className="md:size-[18px]" />
                                 )}
                                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                   {isAudioLoading ? 'Cargando Audio...' : isPlaying ? 'Reproduciendo...' : audioPlays >= 2 ? 'Límite de Escucha' : 'Reproducir Audio Corto'}
                                 </span>
                               </button>
                              <h4 className="text-white text-[10px] md:text-[11px] font-black uppercase tracking-tight">¿Cuál fue la intención principal del hablante?</h4>
                              <div className="grid grid-cols-1 gap-2">
                                 {['Pedir disculpas', 'Dar una instrucción', 'Hacer un reclamo'].map(ans => (
                                   <button 
                                     key={ans}
                                     onClick={() => setAcademicAnswers({...academicAnswers, q2: ans})}
                                     className={`px-4 py-2 md:py-3 rounded-lg border text-[8px] md:text-[9px] font-black uppercase tracking-widest text-left transition-all ${
                                       academicAnswers.q2 === ans ? 'bg-cyan-400 border-cyan-400 text-[#061a1a]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                                     }`}
                                   >
                                     {ans}
                                   </button>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Writing Sample */}
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-orange-400">
                              <Palette size={14} className="md:size-[16px]" />
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Writing Sample</span>
                           </div>
                           <textarea 
                               placeholder="CUÉNTANOS BREVEMENTE TUS PLANES PARA ESTE FIN DE SEMANA..."
                               className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-white text-[10px] md:text-xs font-medium focus:outline-none focus:border-orange-400/50 min-h-[120px] placeholder:text-white/10 uppercase tracking-widest"
                               onChange={(e) => setAcademicAnswers({...academicAnswers, writing: e.target.value})}
                           ></textarea>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-8 md:pt-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                  <button onClick={prevStep} className="w-full sm:w-auto px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl border border-white/10 text-white/40 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-white transition-all order-2 sm:order-1">Regresar</button>
                  <button 
                   disabled={!academicAnswers.q1 || !academicAnswers.q2 || !academicAnswers.writing}
                   onClick={nextStep}
                   className="w-full sm:w-auto px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl bg-[#DEFF9A] text-[#061a1a] text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_40px_rgba(222,255,154,0.4)] hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all flex items-center justify-center gap-4 order-1 sm:order-2"
                  >
                     FINALIZAR Y HACKEAR ADN <Sparkles size={16} />
                  </button>
               </div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-auto pt-20 text-center space-y-4">
           <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4">
              <ShieldSecret size={12} />
              Datos protegidos por Protocolo TECLINGO v4.0
           </p>
        </div>
      </div>
    </motion.div>
  );
}

function ShieldSecret(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 22V12"/><path d="m9 15 3-3 3 3"/></svg>
  );
}
