import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, BrainCircuit, RefreshCw, Terminal, Eye, HelpCircle, User, Sparkles } from 'lucide-react';
import { LITTLE_TECH_KNOWLEDGE } from '../../../../data/littleTechContext';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function DemoBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hub de Simulación Listo, compadre! Soy Little Tech v2.5. Explora mi base de conocimiento local en el panel izquierdo y ponme a prueba con preguntas abiertas sobre costos, docentes, horas, KPIs de dirección o la matriz de habilidades.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking
    setTimeout(() => {
      let botResponse = '';
      const lowercaseText = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // SEARCH ENGINE BY KEYWORDS
      if (
        lowercaseText.includes('costo') || 
        lowercaseText.includes('precio') || 
        lowercaseText.includes('inversion') || 
        lowercaseText.includes('pagar') || 
        lowercaseText.includes('mxn') ||
        lowercaseText.includes('pesos')
      ) {
        botResponse = `¡Eso está bien planificado, compadre! Nuestro modelo económico es de ${LITTLE_TECH_KNOWLEDGE.app_info.modelo_economico} para asegurar que sea de muy alta accesibilidad. Nuestro enfoque principal está puesto en la ${LITTLE_TECH_KNOWLEDGE.app_info.enfoque}, dándole un beneficio de nivel internacional a cada estudiante.`;
      } else if (
        lowercaseText.includes('hora') || 
        lowercaseText.includes('grid') || 
        lowercaseText.includes('pendiente') || 
        lowercaseText.includes('coordinador') ||
        lowercaseText.includes('carga')
      ) {
        const estatusInfo = LITTLE_TECH_KNOWLEDGE.datos_coordinador.estatus_docentes
          .map(d => `• ${d.nombre}: ${d.horas} (${d.estado})`)
          .join('\n');
        
        botResponse = `¡Oído al parche, compadre! Respecto a la coordinación de horarios:\n${LITTLE_TECH_KNOWLEDGE.datos_coordinador.carga_horaria_global}.\n\nAdemás, aquí está el estatus de carga docente registrado:\n${estatusInfo}\n\n⚠️ Regla clave implementada: ${LITTLE_TECH_KNOWLEDGE.datos_coordinador.regla_negocio}`;
      } else if (
        lowercaseText.includes('maestro') || 
        lowercaseText.includes('docente') || 
        lowercaseText.includes('profesor') || 
        lowercaseText.includes('ana lopez') || 
        lowercaseText.includes('chucho') || 
        lowercaseText.includes('serna')
      ) {
        const report = LITTLE_TECH_KNOWLEDGE.datos_coordinador.estatus_docentes
          .map(d => `• ${d.nombre} -> Materia: ${d.materia} | Horas: ${d.horas} | Estatus: [${d.estado}]`)
          .join('\n');
        botResponse = `¡Entendido, compadre! Te doy el reporte rápido de mis maestros analizado desde el motor docente:\n\n${report}\n\nEn el ecosistema docente contamos con herramientas avanzadas como: ${LITTLE_TECH_KNOWLEDGE.datos_docente.herramientas}. ¡Todos los profesores están bajo control!`;
      } else if (
        lowercaseText.includes('kpi') ||
        lowercaseText.includes('desercion') ||
        lowercaseText.includes('rezago') ||
        lowercaseText.includes('asistencia') ||
        lowercaseText.includes('b2-201') ||
        lowercaseText.includes('comprehending')
      ) {
        botResponse = `¡Reporte estratégico en pantalla, compadre! Para el Director, los KPIs generales indican: ${LITTLE_TECH_KNOWLEDGE.datos_director.kpis}.\n\n⚠️ Alerta de rezago detectada: ${LITTLE_TECH_KNOWLEDGE.datos_director.alertas}.\n\nEn cuanto a optimización de folios: ${LITTLE_TECH_KNOWLEDGE.datos_director.folios}.`;
      } else if (
        lowercaseText.includes('alumno') || 
        lowercaseText.includes('estudiante') || 
        lowercaseText.includes('evidencia') || 
        lowercaseText.includes('habilidad') || 
        lowercaseText.includes('qr') || 
        lowercaseText.includes('creden')
      ) {
        botResponse = `¡Ese es el motor de los muchachos, compadre! Para nuestros alumnos manejamos una matriz de habilidades avanzada: ${LITTLE_TECH_KNOWLEDGE.datos_alumno.skills_matrix}.\n\nLa credencial escolar es un ${LITTLE_TECH_KNOWLEDGE.datos_alumno.credencial}. Del lado de los docentes, procesamos el pase con un ${LITTLE_TECH_KNOWLEDGE.datos_docente.herramientas}. ¡Tecnología de punta!`;
      } else {
        botResponse = `Esa información no la tengo cargada en este módulo de prueba, compadre, pero pregúntame sobre los costos ($ pesos), los horarios (horas/grid), maestros (Ana López/Chucho Serna), alertas de dirección (KPIs) o la matriz de habilidades QR de alumnos y te lo cuadro en un segundo. 🚀`;
      }

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1100);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputValue(promptText);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans max-w-7xl mx-auto p-4 md:p-6 text-left">
      
      {/* Visual Identity Header */}
      <div className="bg-black/30 border border-white/5 rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.05)]">
        <div className="absolute inset-0 bg-[#10b981]/5 blur-[80px] -mr-40 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span className="text-[#10b981] text-[9px] font-mono font-black uppercase tracking-[0.3em]">
                MODULO DE SIMULACIÓN MVP
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              LITTLE TECH <span className="text-[#DEFF9A]">INTELLIGENT BOT</span>
            </h1>
            <p className="text-white/40 text-[11px] md:text-xs font-bold uppercase tracking-wider">
              Motor de simulación cognitivo basado en el repositorio de conocimiento institucional de TecLingo AI Hub.
            </p>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
            <BrainCircuit size={20} className="text-[#DEFF9A]" />
            <div className="text-left font-mono">
              <p className="text-white/30 text-[8px] font-black uppercase tracking-wider">Engine Status</p>
              <p className="text-[11px] font-black text-[#DEFF9A]">KNOWLEDGE ENGINE v2.5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Repository Knowledge Viewer */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-cyan-400" />
                <h3 className="text-white text-xs font-black uppercase tracking-wider">
                  Base de Conocimiento Local
                </h3>
              </div>
              <span className="text-[9px] font-mono font-black px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-lg">
                JSON SCHEMATIC
              </span>
            </div>

            <p className="text-white/55 text-[10px] leading-relaxed uppercase font-bold tracking-wide mb-4">
              A continuación se muestra el repositorio estructurado que Little Tech mapea para indexar variables y responder con precisión milimétrica al rol institucional:
            </p>

            <div className="flex-1 overflow-auto rounded-2xl bg-[#080d0d] border border-white/5 p-4 max-h-[500px]">
              <pre className="text-[10.5px] font-mono leading-relaxed text-emerald-400 whitespace-pre-wrap text-left selection:bg-white/20">
                {JSON.stringify(LITTLE_TECH_KNOWLEDGE, null, 2)}
              </pre>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-bold text-white/30 uppercase">
              <span>RM Tecnologías Operativas</span>
              <span className="flex items-center gap-1"><Eye size={12} className="text-[#DEFF9A]" /> Evaluador Activo</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Conversational Grid Simulator */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-black/40 border border-white/5 rounded-3xl p-6 h-[600px] flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Context bar inside dialogue */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#10b981] to-[#DEFF9A] p-[1.5px]">
                  <div className="w-full h-full rounded-[11px] bg-black flex items-center justify-center text-white text-sm">
                    🤖
                  </div>
                </div>
                <div>
                  <h4 className="text-white text-xs font-black uppercase tracking-wide leading-none mb-1">
                    Little Tech AI Bot
                  </h4>
                  <span className="text-[8.5px] text-[#DEFF9A] font-mono font-bold uppercase tracking-widest flex items-center gap-1 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                    En línea • Simulación Interactiva
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome_${Date.now()}`,
                      sender: 'bot',
                      text: '¡Memoria conversacional reseteada con éxito, compadre! Vamos de nuevo, pregúntame lo que gustes sobre el modelo.',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase text-white/50 tracking-widest hover:border-white/10 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                title="Resetear chat"
              >
                <RefreshCw size={10} /> Reset
              </button>
            </div>

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin scrollbar-thumb-white/10"
            >
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-start gap-2.5 max-w-[85%] text-left">
                      {msg.sender === 'bot' && (
                        <div className="w-7 h-7 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-xs text-[#10b981] shrink-0 mt-1">
                          🤖
                        </div>
                      )}
                      
                      <div 
                        className={`rounded-2xl p-3.5 border text-xs leading-relaxed font-medium whitespace-pre-line ${
                          msg.sender === 'user' 
                            ? 'bg-[#10b981]/10 border-[#10b981]/20 text-white rounded-tr-none' 
                            : 'bg-white/[0.02] border-white/5 text-white/90 rounded-tl-none'
                        }`}
                      >
                        <p className="font-sans">{msg.text}</p>
                        <div className={`mt-2 text-[8px] font-mono uppercase tracking-widest font-bold ${
                          msg.sender === 'user' ? 'text-[#10b981]/60 text-right' : 'text-white/20 text-left'
                        }`}>
                          {msg.timestamp}
                        </div>
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-7 h-7 rounded-lg bg-orange-400/10 border border-orange-400/20 flex items-center justify-center text-xs text-orange-400 shrink-0 mt-1">
                          <User size={13} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-2.5 bg-white/[0.01] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white/40">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="font-mono text-[9px] uppercase font-black tracking-widest pl-1 text-[#10b981]/70">Procesando...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Helper prompts */}
            <div className="mb-3 space-y-1">
              <span className="text-[7.5px] font-mono font-black text-white/30 tracking-widest uppercase block mb-1 flex items-center gap-1">
                <Sparkles size={10} className="text-[#DEFF9A]" /> Atajos de Prueba Directos:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickPrompt('¿Cuál es el costo del semestre y enfoque del plan de estudios?')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#10b981]/30 hover:bg-[#10b981]/5 transition-all text-[9px] font-bold text-white/60 uppercase cursor-pointer"
                >
                  💵 Modelo y Costo Semestre
                </button>
                <button
                  onClick={() => handleQuickPrompt('Muestra las horas pendientes en el grid general')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all text-[9px] font-bold text-white/60 uppercase cursor-pointer"
                >
                  📅 Carga y Horas Grid
                </button>
                <button
                  onClick={() => handleQuickPrompt('¿Cómo están de horas Ana López y los maestros?')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-purple-400/30 hover:bg-purple-400/5 transition-all text-[9px] font-bold text-white/60 uppercase cursor-pointer"
                >
                  👩‍🏫 Estatus de Docentes
                </button>
                <button
                  onClick={() => handleQuickPrompt('¿Qué reportes de KPI y rezago cognitivo tiene el Director?')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-red-400/30 hover:bg-red-400/5 transition-all text-[9px] font-bold text-white/60 uppercase cursor-pointer"
                >
                  📊 KPIs de Dirección
                </button>
              </div>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="flex gap-2.5 items-stretch">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu prompt para Little Tech (Ej: costo, maestros, grid, KPIs, QR)..."
                className="flex-1 bg-[#090f0f] border border-white/5 hover:border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-white/30 font-medium focus:outline-none focus:border-[#10b981]/50 focus:ring-1 focus:ring-[#10b981]/30 transition-all"
              />
              <button
                type="submit"
                className="px-5 rounded-2xl bg-[#10b981] text-black hover:bg-[#10b981]/90 hover:scale-[1.02] active:scale-95 duration-200 transition-all flex items-center justify-center font-black"
              >
                <Send size={15} />
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
