/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  Users,
  GraduationCap,
  ShieldCheck,
  Check,
  Image as ImageIcon,
  Eye,
  Star,
  BrainCircuit,
  Zap,
  Mic,
  Languages,
  Sparkles,
  Info,
  X,
  Volume2,
  Crown,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Hash,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, ChatThread, Message as AppMessage, Folio } from '../context/AppContext';
import { UserHierarchyModal, User } from './UsersMaster';

// Helper to convert Chat to User for the modal
export const chatToUser = (chat: ChatThread): User => ({
  id: chat.id,
  controlNumber: 'TEC-2024-' + chat.id.slice(-3),
  curp: 'XXXX000000XXXXXX00',
  name: chat.name,
  email: chat.name.toLowerCase().replace(' ', '.') + '@tecnolingo.ai',
  phone: '+52 833 000 0000',
  location: 'Campus General',
  role: chat.type === 'GLOBAL' ? 'DIRECTOR' : (chat.type === 'GROUP' ? 'ALUMNO' : 'DOCENTE'),
  status: 'ACTIVE',
  joinDate: '01 ENE 2024',
  photo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop',
});

export function MessagingModule({ initialChatId }: { initialChatId?: string }) {
  const { currentRole, chats, communities, addMessage, setQuickChatUser, folios } = useAppContext();
  const [selectedChatId, setSelectedChatId] = useState<string>(chats[0]?.id || '');
  const [expandedCommunities, setExpandedCommunities] = useState<string[]>(['COM-ITSP']);
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [showADNPin, setShowADNPin] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showDossier, setShowDossier] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [replicateBroadcast, setReplicateBroadcast] = useState(false);
  const [showFolioSelector, setShowFolioSelector] = useState(false);

  const handleShareFolio = (folio: Folio) => {
    if (!selectedChat) return;
    
    const folioMsg: AppMessage = {
      id: Date.now().toString(),
      senderId: 'ME',
      senderName: currentRole === 'DIRECTOR' ? 'Dirección' : 'Usuario',
      senderRole: currentRole,
      content: `[FOLIO:${folio.id}]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDirector: currentRole === 'DIRECTOR'
    };

    addMessage(selectedChat.id, folioMsg);
    setShowFolioSelector(false);
  };

  const allAvailableChannels = useMemo(() => {
    const directChats = chats;
    const communityChannels = communities.flatMap(c => c.channels);
    return [...directChats, ...communityChannels];
  }, [chats, communities]);

  const filteredChats = useMemo(() => {
    return allAvailableChannels.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(search.toLowerCase());
      if (currentRole === 'ALUMNO') {
         return matchesSearch && (chat.type === 'GROUP' || chat.type === 'GLOBAL' || chat.type === 'CHANNEL');
      }
      return matchesSearch;
    });
  }, [allAvailableChannels, currentRole, search]);

  const selectedChat = allAvailableChannels.find(c => c.id === selectedChatId) || filteredChats[0];

  const toggleCommunity = (id: string) => {
    setExpandedCommunities(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSendMessage = () => {
    if (!inputText || !selectedChat) return;

    const newMessage: AppMessage = {
      id: Date.now().toString(),
      senderId: 'ME', // Should be the actual user ID
      senderName: currentRole === 'DIRECTOR' ? 'Dirección' : 'Usuario',
      senderRole: currentRole,
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDirector: currentRole === 'DIRECTOR'
    };

    addMessage(selectedChat.id, newMessage);
    setInputText('');
  };

  const handleBroadcast = () => {
    if (!broadcastText) return;
    
    // Broadcast to GLOBAL chat
    const broadcastMsg: AppMessage = {
      id: Date.now().toString(),
      senderId: 'DIR-001',
      senderName: 'Dirección General',
      senderRole: 'DIRECTOR',
      content: broadcastText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDirector: true
    };

    addMessage('CHAT-GLOBAL', broadcastMsg);

    if (replicateBroadcast) {
      communities.forEach(comm => {
        comm.channels.forEach(chan => {
          addMessage(chan.id, {
            ...broadcastMsg,
            id: `${broadcastMsg.id}-${chan.id}`
          });
        });
      });
    }

    setBroadcastText('');
    setReplicateBroadcast(false);
    setShowBroadcastModal(false);
  };

  const handleAISuggest = () => {
    if (!inputText) return;
    setAiSuggestion(`Sugerencia IA: "Hi team! I've published the new administrative updates. Please confirm once you've read them."`);
    setShowAIAssistant(true);
  };

  const applyAISuggestion = () => {
    if (aiSuggestion) {
      setInputText(aiSuggestion.split('"')[1]);
      setAiSuggestion(null);
      setShowAIAssistant(false);
    }
  };

  const ChatThreadItem = ({ chat, isSmall = false }: { chat: ChatThread; isSmall?: boolean; key?: string }) => (
    <motion.button 
      whileHover={{ x: 5 }}
      onClick={() => setSelectedChatId(chat.id)}
      className={`haptic-press w-full p-4 rounded-[2rem] border text-left flex items-center gap-4 group transition-all relative overflow-hidden ${
        selectedChatId === chat.id 
        ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/20 shadow-[0_10px_30px_rgba(222,255,154,0.05)]' 
        : 'bg-white/[0.01] border-white/5 hover:border-white/10'
      } ${isSmall ? 'p-3 rounded-2xl gap-3' : ''}`}
    >
       <div className="relative">
          <div className={`${isSmall ? 'w-8 h-8 rounded-xl' : 'w-12 h-12 rounded-2xl'} border border-white/10 overflow-hidden group-hover:border-[#DEFF9A]/40 transition-all bg-black/40 flex items-center justify-center text-[#DEFF9A]`}>
             {chat.type === 'CHANNEL' ? <Hash size={isSmall ? 14 : 18} /> : (chat.type === 'GROUP' ? <Users size={isSmall ? 16 : 20} /> : <Crown size={isSmall ? 16 : 20} />)}
          </div>
          <div className={`absolute -bottom-1 -right-1 ${isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} rounded-full border-2 border-[#061a1a] bg-[#4ADE80] shadow-[0_0_10px_#4ADE80]`} />
       </div>

       <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
             <h4 className={`${isSmall ? 'text-[11px]' : 'text-[13px]'} text-white font-black uppercase tracking-tight truncate`}>{chat.name}</h4>
             <span className="text-white/20 text-[8px] font-black">
                {chat.messages[chat.messages.length - 1]?.timestamp || '...'}
             </span>
          </div>
          {!isSmall && (
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                chat.type === 'GLOBAL' ? 'bg-orange-500/20 text-orange-400' :
                chat.type === 'GROUP' ? 'bg-[#DEFF9A]/20 text-[#DEFF9A]' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {chat.type} CHANNEL
              </span>
            </div>
          )}
          <p className={`text-[10px] truncate font-medium ${chat.unreadCount > 0 ? 'text-[#DEFF9A] font-black' : 'text-white/20'}`}>
             {chat.lastMessage || 'Inicia la conversación...'}
          </p>
       </div>

       {chat.unreadCount > 0 && (
         <div className="bg-[#DEFF9A] text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_#DEFF9A]">
            {chat.unreadCount}
         </div>
       )}
    </motion.button>
  );

  const FolioAttachmentCard = ({ folioId }: { folioId: string }) => {
    const folio = folios.find(f => f.id === folioId);
    if (!folio) return <div className="text-red-400">Documento no encontrado</div>;

    return (
      <div className="mt-2 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer group min-w-[240px]">
         <div className="w-12 h-12 rounded-xl bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
            <FileText size={20} />
         </div>
         <div className="flex-1">
            <h5 className="text-[11px] font-black uppercase tracking-tight text-white mb-0.5">{folio.title}</h5>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{folio.subject}</p>
         </div>
         <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/20 group-hover:text-[#DEFF9A] group-hover:border-[#DEFF9A]/20 transition-all">
            <Eye size={14} />
         </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-200px)] grid grid-cols-12 gap-8 pb-12 animate-in fade-in duration-700">
      {/* Sidebar: Red de Apoyo List */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
         <div className="space-y-6">
            <header className="flex items-center justify-between">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DEFF9A] shadow-[0_0_8px_#DEFF9A]" />
                    <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Sincronización Real-Time</h2>
                  </div>
                  <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Red de Apoyo</h1>
               </div>
               
               {currentRole === 'DIRECTOR' && (
                 <button 
                  onClick={() => setShowBroadcastModal(true)}
                  className="haptic-button-primary p-3 rounded-2xl shadow-[0_0_20px_rgba(222,255,154,0.4)]"
                  title="Broadcast Institucional"
                 >
                    <Volume2 size={20} />
                 </button>
               )}
            </header>

            <div className="relative group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#DEFF9A] transition-colors" size={18} />
               <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar chats o grupos..."
                className="haptic-input w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-[11px] placeholder:text-white/10 outline-none focus:border-[#DEFF9A]/40 transition-all font-bold"
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {/* Direct & Global Chats */}
            <div className="space-y-3">
              {filteredChats.filter(c => !c.communityId).map((chat) => (
                <ChatThreadItem key={chat.id} chat={chat} />
              ))}
            </div>

            {/* Communities Section */}
            <div className="space-y-4 border-t border-white/5 pt-4">
              <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Comunidades Académicas</h3>
              
              {communities.map(comm => (
                <div key={comm.id} className="space-y-2">
                   <button 
                    onClick={() => toggleCommunity(comm.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all group ${
                      expandedCommunities.includes(comm.id)
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
                    }`}
                   >
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all ${
                          expandedCommunities.includes(comm.id) ? 'bg-[#DEFF9A]/20 border-[#DEFF9A]/20 text-[#DEFF9A]' : 'bg-white/5 border-white/10'
                        }`}>
                           <FolderOpen size={18} />
                        </div>
                        <div className="text-left">
                           <h4 className="text-[11px] font-black uppercase tracking-tight">{comm.name}</h4>
                           <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{comm.channels.length} CANALES</p>
                        </div>
                     </div>
                     {expandedCommunities.includes(comm.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                   </button>

                   <AnimatePresence>
                     {expandedCommunities.includes(comm.id) && (
                       <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-2 pl-4"
                       >
                          {comm.channels.map(channel => (
                            <ChatThreadItem key={channel.id} chat={channel} isSmall />
                          ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* Main Window: Support Chat */}
      <div className="col-span-12 lg:col-span-8 h-full flex flex-col rounded-[3.5rem] bg-black/40 border border-white/5 overflow-hidden relative glass shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-b from-[#DEFF9A]/05 to-transparent pointer-events-none" />
         
         {selectedChat ? (
           <>
             <header className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02] backdrop-blur-3xl relative z-20">
                <div className="flex items-center gap-5">
                   <div className="relative">
                      <div className="w-14 h-14 rounded-2xl border border-[#DEFF9A]/20 overflow-hidden shadow-2xl bg-black/40 flex items-center justify-center text-[#DEFF9A]">
                          {selectedChat.type === 'CHANNEL' ? <Hash size={24} /> : (selectedChat.type === 'GROUP' ? <Users size={24} /> : <Crown size={24} />)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0c10] bg-[#4ADE80] shadow-[0_0_15px_#4ADE80]" />
                   </div>
                   <div>
                      <button 
                        className="group flex items-center gap-3 text-left"
                        onClick={() => setShowDossier(true)}
                      >
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-[#DEFF9A] transition-colors">
                          {selectedChat.name}
                        </h3>
                        <Eye size={16} className="text-white/20 group-hover:text-[#DEFF9A] transition-all" />
                      </button>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[8px] font-black text-[#DEFF9A] uppercase tracking-widest bg-[#DEFF9A]/10 px-2.5 py-1 rounded-lg border border-[#DEFF9A]/20">
                            CANAL {selectedChat.type}
                         </span>
                         <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-[#4ADE80] animate-pulse" />
                            Activo ahora
                         </span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all shadow-xl">
                      <MoreVertical size={20} />
                   </button>
                </div>
             </header>

             {/* Chat Body */}
             <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-0">
                {selectedChat.messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderId === 'ME' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                     <div className="flex items-center gap-3 mb-3 px-2">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] leading-none">
                           {msg.senderId === 'ME' ? `Tú (${msg.senderRole})` : `${msg.senderName} (${msg.senderRole})`}
                        </span>
                        {msg.isDirector && (
                          <span className="bg-[#fbbf24]/10 text-[#fbbf24] px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border border-[#fbbf24]/20">
                            [DIRECTOR]
                          </span>
                        )}
                        <span className="text-white/10 text-[8px] tracking-tighter">•</span>
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-widest leading-none">{msg.timestamp}</span>
                     </div>
                     
                     <div className={`max-w-[80%] p-6 rounded-[2.5rem] text-[13px] font-semibold leading-relaxed relative ${
                        msg.isDirector && msg.senderId !== 'ME'
                        ? 'bg-[#fbbf24]/10 border-2 border-[#fbbf24]/30 text-[#fbbf24] shadow-[0_0_30px_rgba(251,191,36,0.1)]'
                        : msg.senderId === 'ME' 
                        ? 'bg-[#DEFF9A] text-[#061a1a] rounded-tr-none shadow-[0_15px_40px_rgba(222,255,154,0.1)]' 
                        : 'bg-white/[0.03] text-white/90 border border-white/5 rounded-tl-none backdrop-blur-3xl'
                     }`}>
                        {msg.isDirector && <div className="flex items-center gap-2 mb-2 text-[#fbbf24] text-[10px] font-black uppercase tracking-widest border-b border-[#fbbf24]/10 pb-2">
                          <Crown size={12} fill="currentColor" /> MENSAJE INSTITUCIONAL
                        </div>}
                        {msg.content.startsWith('[FOLIO:') ? (
                          <FolioAttachmentCard folioId={msg.content.split(':')[1].replace(']', '')} />
                        ) : (
                          msg.content
                        )}
                        {msg.senderId === 'ME' && (
                          <div className="absolute bottom-4 right-6 flex items-center gap-0.5">
                             <Check size={12} className="text-[#061a1a]/40" />
                             <Check size={12} className="text-[#061a1a]/40 -ml-1.5" />
                          </div>
                        )}
                     </div>
                  </div>
                ))}
                
                {selectedChat.messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                     <MessageSquare size={48} />
                     <p className="text-xs font-black uppercase tracking-widest">Sin mensajes en este canal</p>
                  </div>
                )}
                <div className="h-4" />
             </div>

             {/* AI Assistant Suggestion */}
             <AnimatePresence>
               {showAIAssistant && aiSuggestion && (
                 <motion.div 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: 20, opacity: 0 }}
                   className="mx-10 mb-[-2rem] p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-2xl relative z-20 flex flex-col gap-3"
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-purple-400">
                          <Sparkles size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">IA SMART REPLY</span>
                       </div>
                       <button onClick={() => setShowAIAssistant(false)} className="text-white/20 hover:text-white">
                          <X size={14} />
                       </button>
                    </div>
                    <p className="text-white/80 text-[11px] font-medium leading-relaxed italic">{aiSuggestion}</p>
                    <button 
                      onClick={applyAISuggestion}
                      className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all"
                    >
                      Aplicar Sugerencia
                    </button>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Chat Input */}
             <div className="p-10 pb-12 bg-black/80 backdrop-blur-3xl border-t border-white/10 relative z-20">
                <div className="flex items-center gap-4 bg-white/05 border border-white/10 rounded-[2.5rem] p-3 pl-8 shadow-2xl focus-within:border-[#DEFF9A]/40 transition-all">
                   <button 
                     onClick={() => setShowFolioSelector(true)}
                     className="text-white/20 hover:text-[#DEFF9A] transition-colors p-2 hidden sm:block"
                   >
                      <Paperclip size={20} />
                   </button>
                   <button className="text-white/20 hover:text-[#DEFF9A] transition-colors p-2 mr-2 hidden sm:block">
                      <Mic size={20} />
                   </button>
                   
                   <form 
                    className="flex-1 relative flex items-center"
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                   >
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={currentRole === 'DIRECTOR' ? "Escribe un mensaje de autoridad..." : "Escribe un mensaje oficial..."}
                        className="w-full bg-transparent text-white text-[13px] font-bold outline-none placeholder:text-white/10"
                      />
                      {inputText && (
                        <button 
                          type="button"
                          onClick={handleAISuggest}
                          className="absolute right-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all scale-90"
                        >
                          <Sparkles size={14} />
                          <span className="text-[8px] font-black uppercase tracking-widest">AI Check</span>
                        </button>
                      )}
                   </form>

                   <button 
                    onClick={handleSendMessage}
                    className="haptic-button-primary w-14 h-14 rounded-3xl"
                   >
                      <Send size={22} fill="currentColor" />
                   </button>
                </div>
             </div>
           </>
         ) : (
           <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-6">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                 <MessageSquare size={48} />
              </div>
              <div>
                 <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Selecciona un Canal</h3>
                 <p className="text-white/20 text-xs font-medium max-w-xs leading-relaxed">
                   Conéctate con tu red de apoyo institucional o gestiona tus grupos académicos en tiempo real.
                 </p>
              </div>
           </div>
         )}
      </div>

      <AnimatePresence>
        {showDossier && selectedChat && (
          <UserHierarchyModal 
            user={chatToUser(selectedChat)} 
            onClose={() => setShowDossier(false)}
            onUpdateRole={() => {}}
            onToggleStatus={() => {}}
          />
        )}
      </AnimatePresence>

      {/* Broadcast Modal (Director Only) */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
            onClick={() => setShowBroadcastModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-xl w-full neo-glass border-white/20 rounded-[3rem] p-10 overflow-hidden relative shadow-[0_0_100px_rgba(222,255,154,0.1)]"
              onClick={e => e.stopPropagation()}
            >
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                     <Volume2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Broadcast Global</h3>
                    <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Mensaje de Máxima Difusión Institucional</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/20">
                     <textarea 
                        value={broadcastText}
                        onChange={(e) => setBroadcastText(e.target.value)}
                        placeholder="Redacta el anuncio para toda la comunidad..."
                        className="w-full bg-transparent text-white text-sm font-bold h-40 outline-none resize-none placeholder:text-white/10"
                     />
                  </div>

                   <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                      <input 
                        type="checkbox" 
                        id="replicate"
                        checked={replicateBroadcast}
                        onChange={(e) => setReplicateBroadcast(e.target.checked)}
                        className="w-4 h-4 rounded appearance-none border-2 border-orange-500/40 checked:bg-orange-500 transition-all cursor-pointer"
                      />
                      <label htmlFor="replicate" className="text-[10px] font-black uppercase tracking-widest cursor-pointer select-none">Replicar en todos los canales de comunidad</label>
                   </div>

                  <div className="flex gap-4">
                     <button 
                      onClick={() => setShowBroadcastModal(false)}
                      className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                     >
                        Cancelar
                     </button>
                     <button 
                      onClick={handleBroadcast}
                      className="flex-[2] py-4 rounded-2xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-[1.02] transition-all"
                     >
                        Lanzar Difusión Global
                     </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folio Selector Modal */}
      <AnimatePresence>
        {showFolioSelector && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
            onClick={() => setShowFolioSelector(false)}
          >
             <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full neo-glass border-white/20 rounded-[3rem] p-10 overflow-hidden relative shadow-[0_0_100px_rgba(222,255,154,0.1)]"
              onClick={e => e.stopPropagation()}
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
                         <FileText size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Compartir Folio</h3>
                        <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">Selecciona un documento oficial para enviar</p>
                      </div>
                   </div>
                   <button onClick={() => setShowFolioSelector(false)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white">
                      <X size={20} />
                   </button>
                </div>

                <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                   {folios.map(folio => (
                     <div 
                      key={folio.id}
                      onClick={() => handleShareFolio(folio)}
                      className="p-5 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#DEFF9A]/40 hover:bg-[#DEFF9A]/5 transition-all cursor-pointer group flex items-center justify-between"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-white/20 group-hover:text-[#DEFF9A]">
                              <FileText size={18} />
                           </div>
                           <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-tight">{folio.title}</h4>
                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{folio.date}</p>
                           </div>
                        </div>
                        <Send size={18} className="text-white/10 group-hover:text-[#DEFF9A] transition-all" />
                     </div>
                   ))}

                   {folios.length === 0 && (
                     <div className="py-20 text-center opacity-20">
                        <Info size={48} className="mx-auto mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">No hay folios generados para compartir</p>
                     </div>
                   )}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
