/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  Zap, 
  User, 
  BookOpen, 
  BarChart3, 
  FileText 
} from 'lucide-react';

interface LittleTechProps {
  context: 'docente' | 'director';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function LittleTech({ context }: LittleTechProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message based on context
  useEffect(() => {
    if (context === 'docente') {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "¡Ánimo, compadre! Ya casi terminamos la carga temática. ¿Listo para el Roleplay de hoy? Hoy nos enfocamos en Everyday English sin tecnicismos complejos para fomentar confianza oral. ¿En qué compadrazgo académico te apoyo hoy?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Análisis de KPIs completo, Director. El grupo B2-201 presenta un rezago del 15% en Comprehending. Sugiero remedial IA inmediato. He indexado folios y ratios de aprobación, ¿desea ver el plan remedial detallado?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [context]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const getMessage = () => {
    if (context === 'docente') {
      return "¡Ánimo, compadre! Ya casi terminamos la carga temática. ¿Listo para el Roleplay de hoy?";
    }
    return "Análisis de KPIs completo, Director. El grupo B2-201 presenta un rezago del 15% en Comprehending. Sugiero remedial IA inmediato.";
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsGenerating(true);

    try {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        const ai = new GoogleGenAI({ 
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const systemInstruction = context === 'docente'
          ? `Eres Little Tech, el cariñoso y carismático robot bilingüe y asistente AI de TECLINGO para Docentes.
             Respondes siempre amigable, con términos de camaradería como "compadre", combinando español fluido con ejemplos sencillos en inglés (con sus traducciones).
             Tu meta única es ayudar a los profesores en sus planificaciones de clases de "Everyday English" tradicionales y sin terminología abrumadora. 
             Propón roleplays cortos, dinámicas de juego divertidas, rompehielos (icebreakers) y formas de medir el avance oral de forma amigable. Keep it lightweight, clear, with neat bullet points.`
          : `Eres Little Tech, el asistente biónico estratégico de analítica y planeación escolar para Directores de TECLINGO.
             Respondes con gran profesionalismo, tono corporativo pero empático y de apoyo.
             Tu enfoque es resolver dudas sobre KPIs académicos, el rezago histórico de 15% del grupo B2-201, estados de circular de firmas (Folio FOL-2026-042 de protocolo de verano), y brindar planes remediales eficaces. No utilices jerga vacía; ve al grano con datos precisos descritos bilingüemente si es necesario.`;

        const contents = [...messages, userMsg].map(m => ({
          role: m.role === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: m.content }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        });

        const replyText = response.text || "Disculpa compadre, tuve un pequeño parpadeo de señal. ¿Me lo repites?";
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // High quality descriptive fallback rules
        throw new Error("No Gemini Key available, falling back to local simulation.");
      }
    } catch (err) {
      console.warn("Using smart fallback response logic for Little Tech chat.");
      setTimeout(() => {
        const query = textToSend.toLowerCase();
        let fallbackReply = "";

        if (context === 'docente') {
          if (query.includes("roleplay") || query.includes("clase") || query.includes("dinamic") || query.includes("juego")) {
            fallbackReply = `¡Faltaba más, compadre! Aquí tienes una dinámica excelente de **Roleplay Exprés**:
            
**Tema:** Coffee Shop Interaction ☕ (Everyday English)
1. **Pares:** Divide la sesión en parejas (Student A: Customer / Student B: Barista).
2. **Meta:** El cliente debe pedir una bebida customizada ("I'd like an iced latte with oat milk, please") y el barista cobrar y confirmar.
3. **Giro compadre:** Agrega una tarjeta de evento sorpresa: "¡No queda leche de avena!" para forzar respuesta espontánea.
            
*¿Te gustaría medir el avance TOEFL o prefieres que armemos un Icebreaker rápido?*`;
          } else if (query.includes("toefl") || query.includes("kpi") || query.includes("planeacion")) {
            fallbackReply = `¡Buena pregunta compartida, compadre! En el checklist de nuestra planeación académica, evaluamos las **5 competencias TOEFL** asociadas a la vida cotidiana:
            
• **Grammar:** El verbo "To Be" y demostrativos en situaciones reales (no reglas de pizarrón).
• **Vocabulary:** Objetos y diálogos de servicio.
• **Listening:** Extraer datos específicos auditivos (como precios en el supermercado).
• **Reading:** Comprensión rápida de anuncios en tiendas.
• **Speaking:** Expresarse de forma espontánea por 60 segundos.
            
*¡Toda la malla está programada en 18 semanas de inglés fluido!*`;
          } else {
            fallbackReply = `¡Claro que sí, compadre! Estoy contigo en el aula. Recuerda que la clave es divertirse y quitarle el miedo a equivocarse a los alumnos. 

Prueba a escribir: **"roleplay"** para darte una actividad interactiva bilingüe lista para usar, o bien **"TOEFL"** para desglosar la matriz de competencias.`;
          }
        } else {
          // Director Context fallback
          if (query.includes("b2-201") || query.includes("rezago") || query.includes("kpi")) {
            fallbackReply = `Entendido, Director. Aquí está el desglose analítico para **B2-201**:
            
• **Métrica:** Rezago puntual del **15%** en la competencia de *Comprehending & Speaking* en comparación con el promedio general institucional.
• **Causa Raíz:** Falta de ejercicios directos de simulación conversacional y vocabulario práctico de toma de decisiones.
• **Acción Recomendada:** Implementar un laboratorio de Roleplay interactivo diario de 15 minutos utilizando la guía directa del docente Ana López.
            
¿Desea que redactemos las directrices técnicas para enviar por Folio oficial?`;
          } else if (query.includes("folio") || query.includes("circular")) {
            fallbackReply = `Reporte de Control Escolar sobre Folios:
            
• El folio oficial **FOL-2026-042** (Protocolo de Evaluación Verano) se encuentra en estado **PENDIENTE** para su signado por parte de la Academia Docente.
• Recomendamos que el departamento administrativo use la firma electrónica integrada en el portal de folios para agilizar los procesos.
            
*¿Desea ver el plan escolar de verano o redactar un nuevo aviso?*`;
          } else {
            fallbackReply = `Entendido, Director. Mi núcleo de datos reporta que la malla institucional de 18 semanas está totalmente consolidada. 

Para obtener información focalizada, puede consultarme sobre:
• **"B2-201"** para analizar el rezago y plan remedial.
• **"Folios"** para ver el estado de firmas de las directivas institucionales.`;
          }
        }

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    }
  };

  const getSuggestedChips = () => {
    if (context === 'docente') {
      return [
        { label: "🚀 Proponer Roleplay", action: "roleplay" },
        { label: "📚 Competencias TOEFL", action: "toefl" },
        { label: "💡 Consejo Compadre", action: "consejo de clase" }
      ];
    }
    return [
      { label: "📊 Analizar B2-201", action: "rezago b2-201" },
      { label: "📂 Auditar Folios", action: "estado de folios" },
      { label: "🛡️ Tácticas de Mejora", action: "plan de mejora" }
    ];
  };

  return (
    <>
      {/* 1. Main Mascot and Floating Speech Bubble (Completamente reubicable con drag manual) */}
      <motion.div 
        drag
        dragMomentum={false}
        className="fixed top-20 md:top-24 right-4 md:right-8 z-50 flex items-start gap-3 flex-row-reverse pointer-events-auto select-none cursor-grab active:cursor-grabbing"
        onMouseEnter={() => {
          setIsHovered(true);
          setIsOpen(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
        title="¡Compadre, arrástrame para reubicarme!"
      >
        {/* Robot Button Carrier */}
        <div className="pointer-events-auto">
          <motion.button
            onClick={() => {
              // Clicking Little Tech opens the Chat Box
              setIsChatOpen(v => !v);
            }}
            className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md flex items-center justify-center text-[#10b981] transition-all hover:border-[#10b981]/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] focus:outline-none`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated Neon Blink/Pulse Glow */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-black animate-pulse shadow-[0_0_8px_#10b981]" />

            {/* Sympathetic Robot SVG */}
            <svg
              className={`w-6 h-6 md:w-7 md:h-7 transition-transform ${isHovered || isOpen || isChatOpen ? 'animate-bounce' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M9 13h.01" />
              <path d="M15 13h.01" />
              <path d="M10 17h4" />
            </svg>
          </motion.button>
        </div>

        {/* Floating Dialog Bubble */}
        <AnimatePresence>
          {isOpen && !isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 15 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="pointer-events-auto max-w-[240px] md:max-w-[280px]"
            >
              {/* Click triggers chat drawer */}
              <div 
                onClick={() => setIsChatOpen(true)}
                className="relative p-3.5 md:p-4 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl text-left shadow-[0_10px_25px_rgba(0,0,0,0.6)] cursor-pointer hover:border-[#10b981]/40 transition-all hover:bg-slate-900/90 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
              >
                {/* Little Tech Identity Tag */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase text-[#10b981] tracking-[0.2em] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                    LITTLE TECH
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="text-white/20 hover:text-white/50 text-[10px] uppercase font-bold px-1 transition-colors pointer-events-auto"
                  >
                    Ocultar
                  </button>
                </div>

                {/* Message Content */}
                <p className="text-white/90 text-[10px] md:text-[11px] leading-relaxed font-medium">
                  {getMessage()}
                </p>

                {/* Speech bubble arrow pointer */}
                <div className="absolute right-[-6px] top-[18px] md:top-[22px] w-3 h-3 bg-black/80 border-t border-r border-white/10 rotate-45 transform" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. Chat Cabinet (Interactive Drawer Panel on Click - Draggable to ensure no overlap) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            drag
            dragHandleClassName="chat-drag-header"
            dragMomentum={false}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-4 md:bottom-24 right-4 md:right-8 w-[350px] md:w-[400px] h-[550px] md:h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] z-[1000] flex flex-col rounded-3xl bg-[#031414]/95 border border-[#10b981]/30 shadow-[0_20px_50px_rgba(16,185,129,0.25)] overflow-hidden backdrop-blur-2xl"
          >
            {/* Header - Drag Handle with visual cues */}
            <div className="chat-drag-header p-4 md:p-5 border-b border-white/5 bg-[#10b981]/5 flex items-center justify-between cursor-grab active:cursor-grabbing select-none hover:bg-[#10b981]/8 transition-colors" title="Arrastra desde aquí para mover la ventana">
              <div className="flex items-center gap-3 pointer-events-none">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
                    <Bot size={20} className="animate-pulse" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_#34d399]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    LITTLE TECH AI
                    <span className="text-[7.5px] text-[#10b981] font-bold opacity-80 tracking-widest bg-emerald-500/10 px-1 py-0.5 rounded leading-none">↔ MÓVIL</span>
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[7px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded uppercase tracking-widest">
                      {context === 'docente' ? 'Asistente de Clase' : 'Asistente Académico'}
                    </span>
                    <span className="text-[7.5px] text-slate-400 font-mono font-semibold uppercase">Activo</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-all border border-white/5 pointer-events-auto shrink-0 relative z-[10]"
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages Stream */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 custom-scrollbar text-left"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    {msg.role === 'user' ? <User size={8} /> : <Bot size={8} />}
                    {msg.role === 'user' ? 'Tú (Docente)' : 'Little Tech'}
                  </div>
                  <div className={`max-w-[88%] p-3.5 rounded-2xl text-[11px] md:text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#10b981] to-emerald-600 text-slate-950 font-bold rounded-tr-none shadow-[0_4px_12px_rgba(16,185,129,0.2)]'
                      : 'bg-white/[0.03] text-slate-200 border border-white/5 rounded-tl-none whitespace-pre-wrap'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-1.5 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Bot size={12} className="animate-spin" />
                  </div>
                  <div className="bg-white/[0.01] border border-white/[0.03] px-3.5 py-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest animate-pulse font-semibold">
                      {context === 'docente' ? 'Little Tech está planificando compadre...' : 'Little Tech está analizando la métrica...'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions Chips Wrapper */}
            <div className="px-4 md:px-5 pb-2 pt-1">
              <div className="flex flex-wrap gap-1.5 justify-start">
                {getSuggestedChips().map((chip, idx) => (
                  <button
                    key={idx}
                    disabled={isGenerating}
                    onClick={() => handleSendMessage(chip.action)}
                    className="px-3 py-1.5 text-[9.5px] font-bold bg-[#10b981]/5 hover:bg-[#10b981]/15 text-emerald-400 rounded-xl border border-[#10b981]/15 hover:border-[#10b981]/30 transition-all text-left uppercase tracking-tight flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Zap size={10} className="text-emerald-400" />
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 md:p-5 pt-2 border-t border-white/5 bg-black/40">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-2xl p-1 focus-within:border-emerald-500/30 transition-all"
              >
                <input 
                  type="text"
                  value={inputText}
                  placeholder={context === 'docente' ? "Escribe un mensaje de clase (Ej: roleplay, toefl)..." : "Consulta analítica (Ej: b2-201, folios)..."}
                  disabled={isGenerating}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-xs text-white px-2.5 py-2 placeholder-slate-500 disabled:opacity-75"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isGenerating}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-[#10b981] text-slate-950 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-30"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
