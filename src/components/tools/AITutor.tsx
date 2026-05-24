/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  ChevronLeft, 
  Send, 
  Sparkles, 
  Book, 
  Languages, 
  HelpCircle,
  Clock,
  User,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { db, auth, handleFirestoreError, OperationType } from '../../context/AppContext';
import { collection, getDocs } from 'firebase/firestore';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TutorRule {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
  example: string;
}

export function AITutor({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "¡Hola Alex! Soy tu tutor pedagógico TECLINGO. Veo que estás trabajando en 'Past Perfect' esta semana. ¿En qué puedo apoyarte hoy?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tutorKnowledge, setTutorKnowledge] = useState<TutorRule[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Load knowledge base from Firestore on mount
  useEffect(() => {
    const fetchKnowledge = async () => {
      if (!auth.currentUser) {
        setTutorKnowledge([]);
        return;
      }
      try {
        const snap = await getDocs(collection(db, 'tutor_knowledge'));
        const list: TutorRule[] = [];
        snap.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() } as TutorRule);
        });
        setTutorKnowledge(list);
      } catch (e: any) {
        console.error('Error fetching tutor knowledge base:', e);
        handleFirestoreError(e, OperationType.LIST, 'tutor_knowledge');
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchKnowledge();
      } else {
        setTutorKnowledge([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customText) setInput('');
    setIsGenerating(true);

    try {
      // 1. Detect any matching knowledge directives from the Firestore DB
      const textLower = textToSend.toLowerCase();
      const matchedRules = tutorKnowledge.filter(rule => {
        // If topic or content contains any keywords, or if any of the rule's keywords matches
        const topicMatch = rule.topic.toLowerCase().includes(textLower);
        const keywordMatch = rule.keywords?.some(kbd => textLower.includes(kbd.toLowerCase()));
        return topicMatch || keywordMatch;
      });

      // 2. Initialize Gemini API
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        throw new Error('API Key for Gemini is missing in environment.');
      }

      const ai = new GoogleGenAI({ 
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // 3. Construct system instruction with live database elements
      let directorKnowledgePrompt = '';
      if (matchedRules.length > 0) {
         directorKnowledgePrompt = `
DIRECCIÓN / CONOCIMIENTO PRECONSTRUIDO PRIORITARIO:
El director del plantel ha cargado las siguientes respuestas/reglas de cumplimiento absoluto en la base de datos para responder a esta pregunta específica:
${matchedRules.map(r => `- TEMA: ${r.topic}\n  REGLA OFICIAL: ${r.content}\n  EJEMPLO OFICIAL: ${r.example}`).join('\n')}

IMPORTANTE: Adapta e incorpora estas reglas y explicaciones precisas en tu respuesta de forma orgánica, priorizando su contenido teórico y ejemplos sobre cualquier otra información externa.
         `;
      } else {
         directorKnowledgePrompt = `
REGIONES RELEVANTES GENERALES:
Actualmente el estudiante Alex Rivera está en el nivel A1/A2 (Beginner) trabajando en Week 4: "Past Perfect". 
Suministra explicaciones sumamente amigables, breves, pedagógicas y bilingües.
         `;
      }

      const systemInstruction = `
Eres TECLINGO, un tutor pedagógico de inglés bilingüe y sumamente empático, diseñado para apoyar a los estudiantes del Tecnológico de Ciencias y Tecnologías de forma interactiva y profesional.

Tu rol hoy es guiar pedagógiamente al estudiante "Alex" que cursa con nosotros. El estudiante te hará preguntas de gramática, vocabulario u orientación empresarial (como entrevistas de trabajo).

${directorKnowledgePrompt}

DIRECTRICES OPERATIVAS:
1. Responde de forma cálida, motivadora y clara en ESPAÑOL, pero escribiendo los términos gramaticales y todos tus ejemplos en INGLÉS (con su respectiva traducción).
2. Usa viñetas o formato estructurado para que sea fácil de digerir.
3. Si te preguntan por Dallas o por un botón extracurricular/retos, recomiéndales practicar en el tablero de Memorama en el menú respectivo y sumergirse en la simulación bicultural.
4. Mantén la coherencia pedagógica: nunca uses vocabulario demasiado avanzado si el tema actual está concentrado en Past Perfect (had + past participle).
      `.trim();

      // 4. Map conversational messages to model history format
      const contents = updatedMessages.map(m => ({
         role: m.role === 'user' ? 'user' as const : 'model' as const,
         parts: [{ text: m.content }]
      }));

      // 5. Query Gemini 3.5 Flash standard for text tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const resultText = response.text || "Disculpa, no he podido procesar la respuesta. Por favor intenta de nuevo.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resultText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error('Error generating AI tutor response:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Lo siento, ha ocurrido un detalle de conectividad al procesar tu tutoría. Asegúrate de que el director haya cargado las directrices o intenta de nuevo en unos momentos.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-[#020617] flex flex-col"
    >
      {/* Header */}
      <header className="p-8 border-b border-white/5 bg-[#0b0f19] flex items-center justify-between">
        <button 
          onClick={onClose}
          className="flex items-center gap-3 text-white/40 hover:text-white transition-colors"
        >
           <ChevronLeft size={20} />
           <span className="text-[10px] font-black uppercase tracking-widest">Regresar</span>
        </button>

        <div className="flex items-center gap-4">
           {/* Animated Holographic Core */}
           <div className="relative w-12 h-12">
              <motion.div 
                animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-cyan-500 rounded-full blur-[12px]"
              />
              <div className="relative w-full h-full rounded-full border-2 border-cyan-500/20 flex items-center justify-center bg-[#0d1527] text-cyan-400">
                 <Bot size={24} />
              </div>
           </div>
           <div>
              <h1 className="text-white text-lg font-black uppercase tracking-tight">AI Tutor</h1>
              <p className="text-[#DEFF9A] text-[8px] font-black uppercase tracking-[0.3em]">Apoyo 24/7 Activo</p>
           </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40">
           <Clock size={14} />
           <span className="text-[9px] font-black">MÓDULO: WEEK 4 (PAST PERFECT)</span>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#090d16] space-y-8">
         <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
                   msg.role === 'user' ? 'bg-[#DEFF9A] text-[#020617]' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                 }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Sparkles size={10} className="w-5 h-5" />}
                 </div>

                 <div className={`space-y-2 max-w-[80%]`}>
                    <div className={`p-6 rounded-3xl ${
                      msg.role === 'user' 
                        ? 'bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-white' 
                        : 'bg-[#151c2e]/60 border border-white/5 text-white/90 shadow-xl'
                    }`}>
                       <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <p className={`text-[8px] font-black text-white/20 uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : ''}`}>
                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                 </div>
              </motion.div>
            ))}

            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6"
              >
                 <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse">
                    <Sparkles size={10} className="w-5 h-5" />
                 </div>

                 <div className="space-y-2 max-w-[80%]">
                    <div className="p-6 rounded-3xl bg-[#151c2e]/40 border border-dashed border-cyan-500/20 text-cyan-400/80">
                       <span className="text-xs font-black uppercase tracking-widest animate-pulse">TECLINGO está procesando tu tutoría...</span>
                    </div>
                 </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
         </div>
      </div>

      {/* Footer / Input */}
      <footer className="p-8 pb-12 bg-[#090d16] border-t border-white/5">
         <div className="max-w-3xl mx-auto font-sans">
            {/* Quick Actions (Interactive) */}
            <div className="flex flex-wrap gap-3 mb-6">
               <button 
                 disabled={isGenerating}
                 onClick={() => handleSend("Explícame la regla fundamental del Past Perfect.")}
                 className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:border-white/20 hover:text-white disabled:opacity-50 hover:bg-white/[0.03] transition-all"
               >
                  Explícame esta regla
               </button>
               <button 
                 disabled={isGenerating}
                 onClick={() => handleSend("Dame un ejemplo práctico y conversacional en inglés usando Past Perfect.")}
                 className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:border-white/20 hover:text-white disabled:opacity-50 hover:bg-white/[0.03] transition-all"
               >
                  Dame un ejemplo
               </button>
               <button 
                 disabled={isGenerating}
                 onClick={() => handleSend("DIME QUE ES LA SEGUNDA PERSONA")}
                 className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20 disabled:opacity-50 transition-all font-bold"
               >
                  DIME QUE ES LA SEGUNDA PERSONA
               </button>
               <button 
                 disabled={isGenerating}
                 onClick={() => handleSend("Tradúceme un modismo común en inglés que usaría en mi entrevista en Dallas.")}
                 className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:border-white/20 hover:text-white disabled:opacity-50 hover:bg-white/[0.03] transition-all"
               >
                  Traduce este modismo
               </button>
            </div>

            <div className="relative">
               <input 
                 value={input}
                 disabled={isGenerating}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder={isGenerating ? "Cargando tutoría interactiva..." : "Escribe tu duda académica aquí..."}
                 className="w-full bg-[#0d1323] border border-white/10 rounded-[2rem] p-6 pr-20 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 disabled:opacity-60 transition-all text-sm font-medium"
               />
               <button 
                 onClick={() => handleSend()}
                 disabled={isGenerating || !input.trim()}
                 className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-[#DEFF9A] text-[#020617] flex items-center justify-center hover:scale-105 disabled:hover:scale-100 disabled:opacity-40 transition-transform"
               >
                  <Send size={20} />
               </button>
            </div>
         </div>
      </footer>
    </motion.div>
  );
}
