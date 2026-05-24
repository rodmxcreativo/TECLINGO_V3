/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Edit3, 
  ChevronLeft, 
  Timer, 
  Zap, 
  Brain, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Choose the correct form: 'She ________ to the park every morning.'",
    options: ["Go", "Goes", "Going", "Gone"],
    correct: 1,
    explanation: "Para la tercera persona del singular en Presente Simple, añadimos 's' o 'es' al verbo.",
    level: 'A1'
  },
  {
    id: 2,
    text: "Identify the error: 'I has been working here for three years.'",
    options: ["I", "has", "working", "for"],
    correct: 1,
    explanation: "El auxiliar correcto para 'I' en Presente Perfecto es 'have', no 'has'.",
    level: 'A2'
  }
];

export function TestMaker({ onClose }: { onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isAnswered]);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === mockQuestions[currentIdx].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < mockQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[120] bg-[#061a1a] flex items-center justify-center p-8"
      >
         <div className="max-w-xl w-full text-center space-y-12">
            <div className="w-32 h-32 rounded-[2.5rem] bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto shadow-[0_0_50px_rgba(168,85,247,0.3)]">
               <Award size={64} />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-white uppercase tracking-tight">Evaluación Completada</h2>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Resumen de Desempeño IA</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Puntaje Final</p>
                  <h4 className="text-3xl font-black text-white">{Math.round((score / mockQuestions.length) * 100)}%</h4>
               </div>
               <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Nivel Detectado</p>
                  <h4 className="text-3xl font-black text-purple-400">A2+</h4>
               </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 text-left">
               <div className="flex items-center gap-3 mb-4">
                  <Brain size={20} className="text-purple-400" />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Análisis de la IA</span>
               </div>
               <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                  Has demostrado un dominio sólido en Presente Simple, pero detectamos una ligera confusión en auxiliares de tiempos compuestos. Tu ruta PDP ha sido actualizada con 3 ejercicios de reforzamiento.
               </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-6 rounded-3xl bg-purple-500 text-white text-[11px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform"
            >
               Regresar al Dashboard
            </button>
         </div>
      </motion.div>
    );
  }

  const currentQ = mockQuestions[currentIdx];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-[#061a1a] overflow-hidden flex flex-col"
    >
      {/* Top Progress Bar */}
      <div className="h-1.5 w-full bg-white/5">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${((currentIdx + 1) / mockQuestions.length) * 100}%` }}
           className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,1)]"
         />
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center p-8 py-20 relative">
        {/* Timer Pulse */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
           <div className="relative">
              <svg className="w-16 h-16 -rotate-90">
                 <circle 
                  cx="32" cy="32" r="28" 
                  fill="none" stroke="currentColor" 
                  strokeWidth="4" 
                  className="text-white/5"
                 />
                 <motion.circle 
                  cx="32" cy="32" r="28" 
                  fill="none" stroke="currentColor" 
                  strokeWidth="4" 
                  strokeDasharray="175.9"
                  animate={{ strokeDashoffset: 175.9 - (175.9 * (timeLeft / 30)) }}
                  className="text-purple-400"
                 />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white text-xs font-black">{timeLeft}</span>
              </div>
           </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-12 left-8 flex items-center gap-3 text-white/20 hover:text-white transition-colors"
        >
           <ChevronLeft size={20} />
           <span className="text-[9px] font-black uppercase tracking-widest">Salir del Examen</span>
        </button>

        {/* Level Indicator */}
        <div className="mb-12 px-6 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center gap-3">
           <Zap size={14} className="text-purple-400" />
           <span className="text-purple-400 text-[9px] font-black uppercase tracking-widest">Dificultad Adaptativa: {currentQ.level}</span>
        </div>

        {/* Question Panel */}
        <div className="w-full neo-glass border-white/5 rounded-[4rem] p-16 space-y-12">
            <h3 className="text-white text-3xl font-black uppercase tracking-tight text-center leading-tight">
               {currentQ.text}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {currentQ.options.map((opt, i) => {
                 let statusStyles = "bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.08] hover:border-white/20";
                 if (isAnswered) {
                    if (i === currentQ.correct) {
                      statusStyles = "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
                    } else if (selectedOption === i) {
                      statusStyles = "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
                    } else {
                      statusStyles = "bg-white/[0.01] border-white/5 text-white/20 opacity-40";
                    }
                 }

                 return (
                   <button
                     key={i}
                     onClick={() => handleAnswer(i)}
                     disabled={isAnswered}
                     className={`p-8 rounded-[2rem] border-2 transition-all text-lg font-black uppercase tracking-tight flex items-center justify-between group ${statusStyles}`}
                   >
                      <span>{opt}</span>
                      {isAnswered && i === currentQ.correct && <CheckCircle2 size={24} />}
                      {isAnswered && i === selectedOption && i !== currentQ.correct && <XCircle size={24} />}
                   </button>
                 );
               })}
            </div>

            <AnimatePresence>
               {isAnswered && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-8"
                 >
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border-l-4 border-purple-500">
                       <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-2">Explicación IA</p>
                       <p className="text-white text-base font-medium leading-relaxed">{currentQ.explanation}</p>
                    </div>

                    <button 
                      onClick={handleNext}
                      className="w-full py-6 rounded-3xl bg-white text-[#061a1a] text-xs font-black uppercase tracking-[0.2em] hover:bg-purple-400 hover:text-white transition-all flex items-center justify-center gap-4 group"
                    >
                       Siguiente Pregunta <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </motion.div>
               )}
            </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
