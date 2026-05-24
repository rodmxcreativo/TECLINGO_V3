/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Eye, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { UserHierarchyModal } from './UsersMaster';
import { chatToUser } from './MessagingModule';

interface QuickChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export function QuickChat({ onNavigateToFullChat }: { onNavigateToFullChat: (userId: string) => void }) {
  const { quickChatUser, setQuickChatUser } = useAppContext();
  const [showDossier, setShowDossier] = useState(false);
  const [messages, setMessages] = useState<QuickChatMessage[]>([
    { id: '1', text: 'Hola, ¿en qué puedo apoyarte?', sender: 'them', timestamp: '10:00 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messageCount >= 3 && quickChatUser) {
      // Small delay for UX transition
      const timer = setTimeout(() => {
        onNavigateToFullChat(quickChatUser.id);
        setQuickChatUser(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messageCount, quickChatUser, onNavigateToFullChat, setQuickChatUser]);

  if (!quickChatUser) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMsg: QuickChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
    setMessageCount(prev => prev + 1);

    // Simulate response after 1s
    if (messageCount < 2) {
      setTimeout(() => {
        const reply: QuickChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Entendido, verifiquemos los detalles.',
          sender: 'them',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, reply]);
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        className="fixed bottom-8 right-8 w-[340px] h-[500px] z-[1000] flex flex-col rounded-[2.5rem] bg-black/60 backdrop-blur-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden glass"
      >
        {/* Header */}
        <header className="p-5 border-b border-white/10 bg-[#38BDF8]/10 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="relative">
                 <div className="w-10 h-10 rounded-xl border border-white/20 overflow-hidden">
                    <img src={quickChatUser.photo} alt="" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#4ADE80] border-2 border-[#0a0c10] shadow-[0_0_10px_#4ADE80]" />
              </div>
              <div>
                 <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{quickChatUser.name}</h4>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[7px] font-black text-[#38BDF8] uppercase tracking-widest bg-[#38BDF8]/10 px-1.5 py-0.5 rounded">DIRECT CHAT</span>
                    <span className="text-white/30 text-[7px] font-bold uppercase">Activo</span>
                 </div>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowDossier(true)}
                className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all"
              >
                 <Info size={14} />
              </button>
              <button 
                onClick={() => setQuickChatUser(null)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-all"
              >
                 <X size={14} />
              </button>
           </div>
        </header>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
        >
           {messages.map((msg) => (
             <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[11px] font-medium leading-relaxed ${
                  msg.sender === 'me' 
                  ? 'bg-[#DEFF9A] text-[#061a1a] rounded-tr-none' 
                  : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'
                }`}>
                   {msg.text}
                </div>
                <span className="text-[7px] font-black text-white/10 uppercase tracking-widest mt-1 px-1">
                   {msg.timestamp}
                </span>
             </div>
           ))}
           
           {messageCount >= 2 && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex items-center justify-center gap-2 py-4"
             >
                <div className="h-px bg-white/5 flex-1" />
                <span className="text-[7px] font-black text-[#DEFF9A] uppercase tracking-[0.2em] animate-pulse italic">Escalando a Red de Apoyo...</span>
                <div className="h-px bg-white/5 flex-1" />
             </motion.div>
           )}
        </div>

        {/* Input */}
        <div className="p-4 pt-2">
           {messageCount < 3 ? (
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 pl-4 focus-within:border-[#38BDF8]/40 transition-all">
                   <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Mensaje rápido..."
                    className="flex-1 bg-transparent text-[11px] font-bold text-white outline-none placeholder:text-white/10"
                   />
                   <button 
                    onClick={handleSend}
                    className="w-8 h-8 rounded-xl bg-[#38BDF8] text-[#061a1a] flex items-center justify-center shadow-[0_0_15px_#38BDF840] hover:scale-105 transition-all"
                   >
                      <Send size={14} fill="currentColor" />
                   </button>
                </div>
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-1">
                      <div className={`w-1 h-1 rounded-full ${messageCount >= 1 ? 'bg-[#DEFF9A]' : 'bg-white/20'}`} />
                      <div className={`w-1 h-1 rounded-full ${messageCount >= 2 ? 'bg-[#DEFF9A]' : 'bg-white/20'}`} />
                      <div className={`w-1 h-1 rounded-full ${messageCount >= 3 ? 'bg-[#DEFF9A]' : 'bg-white/20'}`} />
                   </div>
                   <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">{messageCount}/3 Mensajes</span>
                </div>
             </div>
           ) : (
             <div className="p-4 bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 rounded-2xl flex flex-col items-center gap-2">
                <Sparkles size={20} className="text-[#DEFF9A] animate-spin-slow" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Abriendo Sistema Completo</span>
             </div>
           )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showDossier && quickChatUser && (
          <UserHierarchyModal 
            user={chatToUser(quickChatUser)} 
            onClose={() => setShowDossier(false)}
            onUpdateRole={() => {}}
            onToggleStatus={() => {}}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
