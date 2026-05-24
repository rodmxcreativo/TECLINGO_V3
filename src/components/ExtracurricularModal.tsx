/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Lock, 
  ChevronRight, 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Calendar,
  Sparkles,
  KeyRound,
  ArrowRight,
  Video,
  ExternalLink,
  Globe,
  Camera,
  Eye,
  Radio,
  Play,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PioneerBadge } from './ui/PioneerBadge';
import { useAppContext } from '../context/AppContext';

interface ExtracurricularModalProps {
  onClose: () => void;
}

const VOCAB_ITEMS = [
  { matchId: 'server', type: 'image', emoji: '🖥️' },
  { matchId: 'server', type: 'word', text: 'SERVER / SERVIDOR' },
  { matchId: 'cloud', type: 'image', emoji: '☁️' },
  { matchId: 'cloud', type: 'word', text: 'CLOUD / NUBE' },
  { matchId: 'shield', type: 'image', emoji: '🛡️' },
  { matchId: 'shield', type: 'word', text: 'FIREWALL / CORTAFUEGOS' },
  { matchId: 'database', type: 'image', emoji: '🗄️' },
  { matchId: 'database', type: 'word', text: 'DATABASE / BASE DE DATOS' },
  { matchId: 'rocket', type: 'image', emoji: '🚀' },
  { matchId: 'rocket', type: 'word', text: 'DEPLOY / DESPLIEGUE' },
  { matchId: 'bug', type: 'image', emoji: '🪲' },
  { matchId: 'bug', type: 'word', text: 'BUG / ERROR DE CÓDIGO' },
];

const DALLAS_QUESTIONS = [
  {
    id: 'q1',
    role: 'Senior Server Lead (Dallas, TX)',
    clue: 'Infrastructure and Failover Operations',
    question: 'Welcome candidate! In Dallas we manage high-availability clusters. Imagine our primary cloud site experiences a sudden router failure and database synchronization gets delayed. What immediate command operations or alerts do you dispatch?',
    keywords: ['backup', 'failover', 'alert', 'ping', 'cluster', 'primary', 'route', 'log', 'restart', 'reboot', 'synchronize']
  },
  {
    id: 'q2',
    role: 'DevOps Principal Architect (Dallas, TX)',
    clue: 'Continuous Deployment and API Keys Security',
    question: 'Excellent. Now, our integration pipeline needs to deliver security hotfixes without exposing confidential environment credentials or third-party secret tokens. What methodology do you adopt to secure our GitHub actions or Google Cloud Run runtime?',
    keywords: ['secret', 'encrypt', 'pipeline', 'key', 'environment', 'variable', 'github', 'access', 'token', 'secure', 'cloud']
  },
  {
    id: 'q3',
    role: 'Cybersecurity Director (Dallas, TX)',
    clue: 'Intrusion Detection and Server Hardening',
    question: 'Final test. An audit log from last night indicates a brute force request hitting our administrative gateway ports. How do you construct the emergency firewall rules and present simple reports in English to our state regulators?',
    keywords: ['firewall', 'block', 'port', 'ip address', 'audit', 'report', 'restrict', 'security', 'emergency', 'log']
  }
];

export function ExtracurricularModal({ onClose }: ExtracurricularModalProps) {
  const { userProgress, addGlobalEvent } = useAppContext();
  const [accessView, setAccessView] = useState<'info' | 'auth'>('info');
  const [secretKey, setSecretKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Tab control in unlocked view
  const [unlockedTab, setUnlockedTab] = useState<'memorama' | 'dallas_ar'>('memorama');
  
  // AR Simulation state
  const [arQuestionIndex, setArQuestionIndex] = useState(0);
  const [arResponse, setArResponse] = useState('');
  const [arFeedback, setArFeedback] = useState<string | null>(null);
  const [arTtsActive, setArTtsActive] = useState(false);
  const [arScore, setArScore] = useState<{ coherence: number; points: number } | null>(null);

  // Game state
  const [cards, setCards] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const isEligibleByProgress = userProgress >= 80;
  const [availableSpots, setAvailableSpots] = useState(3); // First 10 challenge

  const playEffect = (type: 'fanfare' | 'race' | 'success') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'fanfare') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
    } else if (type === 'race') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2);
  };

  useEffect(() => {
    playEffect('fanfare');
  }, []);

  const handleClose = () => {
    playEffect('race');
    setTimeout(onClose, 800);
  };

  const initGame = () => {
    const shuffled = [...VOCAB_ITEMS]
      .map((item, idx) => ({
        ...item,
        id: `${item.matchId}-${item.type}-${idx}-${Math.random()}`,
        isFlipped: true,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setSelectedIds([]);
    setAttempts(0);
    setMatches(0);
    setIsPreviewing(true);

    setTimeout(() => {
      setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
      setIsPreviewing(false);
    }, 3500);
  };

  useEffect(() => {
    if (isUnlocked) {
      initGame();
    }
  }, [isUnlocked]);

  const handleCardClick = (clickedIndex: number) => {
    if (isPreviewing) return;
    if (selectedIds.length >= 2) return;
    
    const currentCard = cards[clickedIndex];
    if (currentCard.isFlipped || currentCard.isMatched) return;

    playEffect('success');

    // Flip the card
    const updatedCards = [...cards];
    updatedCards[clickedIndex].isFlipped = true;
    setCards(updatedCards);

    const nextSelected = [...selectedIds, clickedIndex];
    setSelectedIds(nextSelected);

    if (nextSelected.length === 2) {
      setAttempts(prev => prev + 1);
      const firstCard = cards[nextSelected[0]];
      const secondCard = cards[nextSelected[1]];

      if (firstCard.matchId === secondCard.matchId && firstCard.type !== secondCard.type) {
        setTimeout(() => {
          setCards(prev => {
            const next = [...prev];
            next[nextSelected[0]].isMatched = true;
            next[nextSelected[1]].isMatched = true;
            return next;
          });
          setMatches(m => m + 1);
          setSelectedIds([]);
          playEffect('fanfare');
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => {
            const next = [...prev];
            next[nextSelected[0]].isFlipped = false;
            next[nextSelected[1]].isFlipped = false;
            return next;
          });
          setSelectedIds([]);
        }, 1200);
      }
    }
  };

  const handleVerifyKey = () => {
    setIsVerifying(true);
    setError('');
    
    setTimeout(() => {
      if (secretKey.toUpperCase() === 'TECLINGO_VIP') {
        setIsUnlocked(true);
        playEffect('success');
        
        // Automated Calendar Log
        addGlobalEvent({
          id: Math.random().toString(36).substr(2, 9),
          day: new Date().getDate(),
          title: '📢 Hito Alcanzado: Nuevo Pioneer TECLINGO',
          type: 'TECLINGO',
          description: '¡Alumno_01 ha desbloqueado el acceso de élite y portará la Insignia Pioneer!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        setIsVerifying(false);
      } else {
        setError('Clave inválida. Solicítala a tu Director si ya superaste el 80% de tu curso.');
        setIsVerifying(false);
      }
    }, 1500);
  };

  const handleSpeakArQuestion = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const currentQ = DALLAS_QUESTIONS[arQuestionIndex];
    const utterance = new SpeechSynthesisUtterance(currentQ.question);
    utterance.lang = 'en-US';
    utterance.volume = 1;
    utterance.rate = 0.95;
    utterance.onstart = () => setArTtsActive(true);
    utterance.onend = () => setArTtsActive(false);
    window.speechSynthesis.speak(utterance);
    playEffect('success');
  };

  const handleEvalArResponse = () => {
    if (!arResponse.trim()) {
      setArFeedback("Por favor escribe tu respuesta en inglés para iniciar la evaluación satelital.");
      return;
    }
    playEffect('fanfare');
    const currentQ = DALLAS_QUESTIONS[arQuestionIndex];
    const words = arResponse.toLowerCase();
    
    // Check how many keywords matched
    const matched = currentQ.keywords.filter(keyword => words.includes(keyword));
    const scorePct = Math.min(100, Math.round((matched.length / Math.min(4, currentQ.keywords.length)) * 100));

    if (matched.length >= 2) {
      setArScore({
        coherence: Math.max(75, scorePct),
        points: matched.length * 15
      });
      setArFeedback(`¡SÍNTESIS ACEPTADA POR AR ENGINE! Palabras clave técnicas validadas: [${matched.join(', ')}]. Tu vocabulario bicultural es sólido para ingeniería en Texas.`);
      
      // Add a cool event
      addGlobalEvent({
        id: Math.random().toString(36).substr(2, 9),
        day: new Date().getDate(),
        title: `⚡ AR Dallas: ${currentQ.role}`,
        type: 'TECLINGO',
        description: `¡Alumno_01 superó prueba de entrevista AR en inglés con un nivel de coincidencia de ${Math.max(75, scorePct)}%!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else {
      setArScore(null);
      setArFeedback(`SÍNTESIS INCOMPLETA EN INGLÉS. El analizador AR de Dallas requiere que estructures tu plan con mayor vocabulario técnico. Intenta incorporar al menos dos de los siguientes términos informáticos: [${currentQ.keywords.slice(0, 5).join(', ')}].`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12 overflow-hidden"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#061a1a]/95 backdrop-blur-xl" onClick={handleClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`relative w-full ${isUnlocked ? 'max-w-5xl max-h-[90vh] overflow-y-auto' : 'max-w-4xl overflow-hidden'} neo-glass border-[#DEFF9A]/20 rounded-[4rem] shadow-[0_0_100px_rgba(222,255,154,0.1)] flex flex-col ${isUnlocked ? '' : 'md:flex-row'}`}
      >
         <button onClick={handleClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-20">
            <X size={24} />
         </button>

         {isUnlocked ? (
            /* Unlocked View: Explained differently + Tabbed Dashboard (Memorama & Dallas AR Interview) */
            <div className="p-8 md:p-10 space-y-6 w-full">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/5 gap-4">
                  <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-[#DEFF9A] animate-ping shrink-0" />
                     <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">ALTO VOLTAJE • COMANDO MÁXIMO</h2>
                  </div>
                  <button 
                     onClick={() => setIsUnlocked(false)}
                     className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/10 transition-all text-center"
                  >
                     Cerrar Sesión / Bloquear
                  </button>
               </div>

               {/* Explanatory Banner of why it's different */}
               <div className="p-6 rounded-[2rem] bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 space-y-2">
                  <h3 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                     <Sparkles size={14} /> ¿POR QUÉ ES DIFERENTE ESTA ZONA EXTRACURRICULAR?
                  </h3>
                  <p className="text-white/80 text-[11px] leading-relaxed font-semibold">
                     ¡Bienvenido! Al igual que aprendes jugando con videojuegos o películas en casa, en Alto Voltaje el inglés se entrena con un enfoque <span className="text-[#DEFF9A]">completamente informal, inmersivo y de alta velocidad</span>. Desconectamos la estructura escolar tradicional para dar paso a juegos de agilidad visual, retos de adrenalina y simulaciones biculturales en tiempo real.
                  </p>
               </div>

               {/* TAB SYSTEM CHANNELS */}
               <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
                  <button
                     onClick={() => {
                        setUnlockedTab('memorama');
                        playEffect('success');
                     }}
                     className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${unlockedTab === 'memorama' ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] border-[#DEFF9A]/30 shadow-[0_0_30px_rgba(222,255,154,0.05)]' : 'text-white/40 hover:text-white/80 border-transparent bg-white/[0.01]'}`}
                  >
                     <Zap size={14} /> 1. Memorama de Infraestructura
                  </button>
                  <button
                     onClick={() => {
                        setUnlockedTab('dallas_ar');
                        playEffect('success');
                     }}
                     className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${unlockedTab === 'dallas_ar' ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] border-[#DEFF9A]/30 shadow-[0_0_30px_rgba(222,255,154,0.05)]' : 'text-white/40 hover:text-white/80 border-transparent bg-white/[0.01]'}`}
                  >
                     <Video size={14} /> 2. Portal Dallas: Entrevista AR Live
                  </button>
               </div>

               {/* TAB A: VOCAB MEMORAMA GAME */}
               {unlockedTab === 'memorama' && (
                  <div className="space-y-4">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black/40 p-4 rounded-2xl border border-white/5 gap-4">
                        <div className="flex items-center gap-8">
                           <div>
                              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Intentos (Guesses)</p>
                              <p className="text-white text-base font-black">{attempts}</p>
                           </div>
                           <div>
                              <p className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">Parejas Sincronizadas</p>
                              <p className="text-[#DEFF9A] text-base font-black">{matches} / 6</p>
                           </div>
                        </div>
                        <button
                          onClick={initGame}
                          className="px-4 py-2.5 rounded-xl bg-[#DEFF9A] text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center"
                        >
                          Reiniciar Tablero
                        </button>
                     </div>

                     {/* Pre-memorization alert message */}
                     <AnimatePresence>
                        {isPreviewing && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center bg-cyan-400/10 border border-cyan-400/20 p-3 rounded-2xl"
                          >
                             <p className="text-[10px] text-cyan-400 font-extrabold tracking-widest uppercase animate-pulse">
                                ⚡ ESCANEANDO SISTEMA... MEMORIZA LAS PAREJAS ANTES DE QUE SE OCULTEN (3.5 SEGUNDOS) ⚡
                             </p>
                          </motion.div>
                        )}
                     </AnimatePresence>

                     {/* Victory banner */}
                     {matches === 6 && (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                        >
                           <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest">🏆 ¡COMPILACIÓN EXITOSA • ADRENALINA MÁXIMA! 🏆</h4>
                           <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider text-center">
                              Has completado el memorama técnico. Dominas la relación entre componentes de infraestructura de red bilingües.
                           </p>
                        </motion.div>
                     )}

                     {/* Interactive Cards grid */}
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {cards.map((card, idx) => {
                           const isOpen = card.isFlipped || card.isMatched;
                           return (
                             <button
                               key={card.id}
                               onClick={() => handleCardClick(idx)}
                               disabled={isPreviewing || card.isMatched}
                               className={`h-24 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center p-2 text-center select-none ${
                                  card.isMatched 
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                    : isOpen 
                                      ? 'bg-white/5 border-[#DEFF9A]/30 text-white' 
                                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-white/30 cursor-pointer'
                               }`}
                             >
                                {!isOpen && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black/20 to-black/40">
                                     <Zap size={20} className="text-[#DEFF9A]/20" />
                                  </div>
                                )}

                                {isOpen && (
                                  <motion.div 
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="space-y-1 flex flex-col items-center justify-center w-full h-full"
                                  >
                                     {card.type === 'image' ? (
                                       <>
                                          <span className="text-3xl mb-1">{card.emoji}</span>
                                          <span className="text-[7px] font-black uppercase text-[#DEFF9A]/50 tracking-widest leading-none">IMAGEN técnica</span>
                                       </>
                                     ) : (
                                       <div className="px-1 flex flex-col items-center justify-center overflow-hidden">
                                          <span className="text-[9px] font-black text-white tracking-tighter leading-tight break-words max-w-full">
                                             {card.text?.split(' / ')[0]}
                                          </span>
                                          <span className="text-[8px] font-bold text-[#DEFF9A]/70 uppercase tracking-widest leading-none mt-1">
                                             {card.text?.split(' / ')[1]}
                                          </span>
                                       </div>
                                     )}
                                  </motion.div>
                                )}
                             </button>
                           );
                        })}
                     </div>
                  </div>
               )}

               {/* TAB B: DALLAS AR INTERVIEW SYSTEM */}
               {unlockedTab === 'dallas_ar' && (
                  <div className="space-y-6 w-full">
                     <div className="p-5 rounded-3xl bg-cyan-400/5 border border-cyan-400/20 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400">
                           <Camera size={16} />
                           <span className="text-[10px] font-black uppercase tracking-widest">¿QUÉ ES REALIDAD AUMENTADA? (AR INMERSIÓN)</span>
                        </div>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                           La **Realidad Aumentada (AR)** en <span className="text-cyan-400 font-extrabold">TECLINGO PRO</span> superpone elementos visuales informáticos e interfaces holográficas inteligentes directamente sobre tu entorno físico. En este portal bicultural, simulamos un visor AR holográfico que rastrea tu entonación, léxico y tiempo de respuesta en inglés frente a reclutadores del distrito comercial de Dallas.
                        </p>
                     </div>

                     {/* Main AR Sandbox Arena */}
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                        {/* Interactive HUD / Cam Stream Simulator */}
                        <div className="lg:col-span-7 bg-black/60 rounded-[2rem] border border-white/5 p-6 space-y-4 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                           
                           {/* Decorative Holographic Scanning grid background */}
                           <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] opacity-40 pointer-events-none" />
                           <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-500/20 animate-bounce pointer-events-none" />

                           {/* HUD Header parameters */}
                           <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-[#DEFF9A] z-10">
                              <div className="flex items-center gap-1.5">
                                 <Radio size={10} className="text-red-500 animate-pulse shrink-0" />
                                 <span>[REPRODUCCIÓN ACTIVA: AR_GLASSES_MODE_V3]</span>
                              </div>
                              <span>DALLAS, TX PORT • LATENCY: 12ms</span>
                           </div>

                           {/* Virtual Avatar / Interviewer Interface */}
                           <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 z-10">
                              <div className="relative">
                                 <div className="w-16 h-16 rounded-full bg-cyan-400/10 border-2 border-cyan-400/30 flex items-center justify-center text-cyan-400 animate-pulse">
                                    <Globe size={32} />
                                 </div>
                                 <div className="absolute -inset-2 rounded-full border border-dashed border-[#DEFF9A]/20 animate-spin" />
                                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center text-[7px] text-white font-bold">✓</div>
                              </div>

                              <div className="space-y-1">
                                 <span className="px-2 py-0.5 rounded-full bg-[#DEFF9A]/10 text-[#DEFF9A] text-[8px] font-black tracking-widest uppercase">
                                    {DALLAS_QUESTIONS[arQuestionIndex].role}
                                 </span>
                                 <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider">
                                    Enfoque: {DALLAS_QUESTIONS[arQuestionIndex].clue}
                                 </p>
                              </div>

                              {/* Question subtitles */}
                              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                 <p className="text-white text-[11px] font-medium leading-relaxed italic text-center">
                                    "{DALLAS_QUESTIONS[arQuestionIndex].question}"
                                 </p>
                              </div>
                           </div>

                           {/* HUD Controls */}
                           <div className="flex justify-between items-center z-10 pt-4 border-t border-white/5 gap-2">
                              <button
                                 onClick={handleSpeakArQuestion}
                                 className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${arTtsActive ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-500/20'}`}
                              >
                                 <Volume2 size={12} /> {arTtsActive ? 'SINTETIZADOR DALLAS ACTIVO...' : 'REPRODUCIR PREGUNTA (TTS VOZ)'}
                              </button>
                              
                              <div className="text-[7.5px] font-mono text-white/30 text-right">
                                 <p>[EYE MONITOR: TRACKED]</p>
                                 <p>[ENUNCIADO: EN_US STANDARD]</p>
                              </div>
                           </div>
                        </div>

                        {/* Text Console Response and Grade Evaluation board */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                           <div className="bg-white/[0.01] border border-white/5 p-5 rounded-[2rem] space-y-4 flex-1">
                              <div className="space-y-1">
                                 <label className="text-white/40 text-[9px] font-black uppercase tracking-widest">Tu propuesta en Inglés Técnico</label>
                                 <p className="text-[8px] font-medium text-white/20 uppercase tracking-widest">
                                    Sugerencia AR: Emplea términos como: {DALLAS_QUESTIONS[arQuestionIndex].keywords.slice(0,4).join(', ')}
                                 </p>
                              </div>

                              <textarea
                                 value={arResponse}
                                 onChange={(e) => setArResponse(e.target.value)}
                                 placeholder="Type your response here in professional English..."
                                 rows={4}
                                 className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/10 transition-all resize-none placeholder:text-white/10 text-left"
                              />

                              <div className="flex gap-2">
                                 <button
                                    onClick={handleEvalArResponse}
                                    className="flex-1 py-3 rounded-xl bg-[#DEFF9A] text-black text-[9px] font-black uppercase tracking-widest hover:scale-102 active:scale-98 transition-all shadow-[0_0_20px_rgba(222,255,154,0.15)] text-center"
                                 >
                                    Validar Holograma
                                 </button>
                                 <button
                                    onClick={() => {
                                       const nextIdx = (arQuestionIndex + 1) % DALLAS_QUESTIONS.length;
                                       setArQuestionIndex(nextIdx);
                                       setArResponse('');
                                       setArFeedback(null);
                                       setArScore(null);
                                       playEffect('success');
                                    }}
                                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all"
                                 >
                                    Siguiente Rol
                                 </button>
                              </div>

                              {/* Interactive AR Feedback Area */}
                              <AnimatePresence mode="wait">
                                 {arFeedback && (
                                    <motion.div
                                       key={arFeedback}
                                       initial={{ opacity: 0, y: 5 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       exit={{ opacity: 0, y: -5 }}
                                       className={`p-4 rounded-2xl border text-[10px] leading-relaxed font-semibold text-left ${arScore ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-400/5 border-red-500/10 text-red-300'}`}
                                    >
                                       {arScore && (
                                          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-emerald-500/15">
                                             <ShieldCheck size={12} className="text-emerald-400" />
                                             <span className="font-black text-[9px] uppercase tracking-wider text-emerald-400">
                                                COHERENCIA: {arScore.coherence}% | SCORE: +{arScore.points} EXP
                                             </span>
                                          </div>
                                       )}
                                       <p className="whitespace-pre-line">{arFeedback}</p>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>

                           {/* REAL PORT LEVEL LINK TO DALLAS REDIRECT */}
                           <div className="bg-gradient-to-r from-emerald-500/5 via-cyan-400/5 to-[#DEFF9A]/5 border border-cyan-400/10 p-5 rounded-[2rem] space-y-3">
                              <div className="flex items-center gap-2 text-left">
                                 <Globe size={14} className="text-[#DEFF9A]" />
                                 <h4 className="text-[9px] font-black text-white uppercase tracking-wider">RECLUTAMIENTO PRESENCIAL EN TEXAS</h4>
                              </div>
                              <p className="text-white/50 text-[9px] font-bold leading-relaxed uppercase text-left">
                                 ¿Listo para el salto bicultural? Hemos pre-sincronizado tus mejores puntajes de comandos AR para agilizar entrevistas de empleo directo y visas patrocinadas H1B en Dallas.
                              </p>
                              
                              <a
                                 href="https://www.dallastechspace.com"
                                 target="_blank"
                                 rel="noreferrer"
                                 onClick={() => {
                                    playEffect('fanfare');
                                    addGlobalEvent({
                                       id: Math.random().toString(36).substr(2, 9),
                                       day: new Date().getDate(),
                                       title: '💼 Trámite de Reubicación Dallas',
                                       type: 'ALERTA',
                                       description: 'Alumno_01 solicitó portabilidad de expediente escolar al centro de vinculación en Texas.',
                                       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    });
                                 }}
                                 className="w-full py-3 rounded-xl border border-dashed border-[#DEFF9A]/40 bg-[#DEFF9A]/5 hover:bg-[#DEFF9A]/10 text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                              >
                                 <ExternalLink size={12} /> Redirigir a Entrevistas Reales en Dallas
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         ) : (
            <>
               {/* Left Side: Badge and Status */}
               <div className="md:w-5/12 bg-white/[0.02] border-r border-white/5 p-12 flex flex-col items-center justify-center space-y-8">
                  <PioneerBadge />
                  
                  <div className="text-center space-y-1">
                     <h3 className="text-[#DEFF9A] text-xs font-black uppercase tracking-[0.4em]">Insignia Pioneer TECLINGO</h3>
                     <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Acceso Exclusivo por Mérito</p>
                  </div>

                  <div className="w-full p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Lugares Disponibles</span>
                        <span className="text-[#FBBF24] text-[10px] font-black">{availableSpots}/10</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(10 - availableSpots) * 10}%` }}
                          className="h-full bg-gradient-to-r from-[#FBBF24] to-[#DEFF9A]"
                        />
                     </div>
                     <p className="text-[8px] font-bold text-white/20 leading-relaxed text-center uppercase tracking-widest leading-loose">
                        Si creías que las herramientas actuales eran geniales, espera a ver lo que un Pioneer puede dominar.
                     </p>
                  </div>
               </div>

               {/* Right Side: Content and Actions */}
               <div className="md:w-7/12 p-12 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                     {accessView === 'info' ? (
                       <motion.div 
                         key="info"
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="space-y-8"
                       >
                          <div className="space-y-4">
                             <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">EXTRACURRICULAR <br /><span className="text-cyan-400">ALTO VOLTAJE</span></h2>
                             <p className="text-white/60 text-sm font-medium leading-relaxed">
                                ¿Crees que las herramientas que usas son geniales? ¡Espera a ver lo que este botón esconde! <span className="text-white">Juegos inmersivos, retos de velocidad y actividades de pura adrenalina</span> te esperan.
                             </p>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                             <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-6 items-center">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                                   <Calendar size={20} />
                                </div>
                                <div>
                                   <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Vía A: Apertura Oficial</h4>
                                   <p className="text-white/20 text-[9px] font-bold">DISPONIBLE EN TEMPORADA VACACIONAL.</p>
                                </div>
                             </div>

                             <div className={`p-6 rounded-3xl border flex gap-6 items-center transition-all ${isEligibleByProgress ? 'bg-[#DEFF9A]/5 border-[#DEFF9A]/20' : 'bg-white/[0.02] border-white/5 opacity-40'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${isEligibleByProgress ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/20 text-[#DEFF9A]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                   <Trophy size={20} />
                                </div>
                                <div className="flex-1">
                                   <div className="flex items-center justify-between mb-1">
                                      <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Vía B: Mérito Académico</h4>
                                      <span className={`text-[8px] font-black uppercase ${isEligibleByProgress ? 'text-[#DEFF9A]' : 'text-white/20'}`}>
                                         {userProgress}% / 80%
                                      </span>
                                   </div>
                                   <p className="text-white/20 text-[9px] font-bold">DESBLOQUEA HOY CON CLAVE DE DIRECTOR.</p>
                                </div>
                             </div>
                          </div>

                          <div className="pt-6">
                             <div className="space-y-4">
                                <button 
                                  onClick={() => setAccessView('auth')}
                                  disabled={!isEligibleByProgress}
                                  className="w-full py-5 rounded-[2rem] bg-[#DEFF9A] text-[#061a1a] text-xs font-black uppercase tracking-widest shadow-[0_0_40px_rgba(222,255,154,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:scale-100"
                                >
                                   Ingresar Clave <ArrowRight size={18} />
                                </button>
                                
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setIsUnlocked(true);
                                    playEffect('success');
                                  }}
                                  className="w-full py-4 rounded-[2rem] border border-[#DEFF9A]/30 bg-[#DEFF9A]/5 hover:bg-[#DEFF9A]/10 text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                   <Sparkles size={16} /> Entrar con Usuario Demo (Saltar Bloqueo)
                                </button>
                             </div>
                             
                             <p className="mt-4 text-center text-white/10 text-[8px] font-black uppercase tracking-[0.3em]">
                                {isEligibleByProgress ? '¡RECLAMA TU LUGAR EN EL CALENDARIO!' : 'SIGUE ESFORZÁNDOTE PARA DESBLOQUEAR EL RETO'}
                             </p>
                          </div>
                       </motion.div>
                     ) : (
                       <motion.div 
                         key="auth"
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="space-y-8"
                       >
                          <button onClick={() => setAccessView('info')} className="flex items-center gap-2 text-white/20 hover:text-white transition-colors">
                             <ChevronRight size={16} className="rotate-180" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Regresar</span>
                          </button>

                          <div className="space-y-4">
                             <h2 className="text-3xl font-black text-white uppercase tracking-tight">VERIFICAR <span className="text-[#DEFF9A]">AUTORIZACIÓN</span></h2>
                             <p className="text-white/40 text-xs font-medium leading-relaxed">
                                Has superado el 80% de progreso. Ingresa la Clave Maestra proporcionada por tu Director para reclamar tu Insignia Pioneer.
                             </p>
                          </div>

                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-white/20 text-[9px] font-black uppercase tracking-widest ml-4">Clave de Director</label>
                                <div className="relative">
                                   <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-[#DEFF9A]/40" size={18} />
                                   <input 
                                     type="text"
                                     value={secretKey}
                                     onChange={(e) => setSecretKey(e.target.value)}
                                     placeholder="•••• •••• ••••"
                                     autoFocus
                                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-black uppercase tracking-[0.4em] focus:outline-none focus:border-[#DEFF9A]/50 focus:ring-1 focus:ring-[#DEFF9A]/20 transition-all placeholder:text-white/5"
                                   />
                                </div>
                                {error && (
                                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[9px] font-black uppercase ml-4">{error}</motion.p>
                                )}
                             </div>

                             <button 
                               onClick={handleVerifyKey}
                               disabled={!secretKey || isVerifying}
                               className="w-full py-6 rounded-[2rem] bg-[#DEFF9A] text-[#061a1a] text-xs font-black uppercase tracking-widest shadow-[0_0_50px_rgba(222,255,154,0.4)] flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                             >
                                {isVerifying ? (
                                  <Zap size={20} className="animate-spin" />
                                ) : (
                                  <>VALIDAR Y ANUNCIAR <ShieldCheck size={20} /></>
                                )}
                             </button>
                          </div>
                       </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </>
         )}
      </motion.div>
    </motion.div>
  );
}
