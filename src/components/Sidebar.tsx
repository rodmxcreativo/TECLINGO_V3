/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  GraduationCap,
  User,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Languages,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { MasterSwitcher, UserRole } from './MasterSwitcher';

export interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  section?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  currentView: string;
  onViewChange: (view: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userName: string;
  userSub: string;
  userInitials: string;
  userColor?: string;
}

export function Sidebar({ 
  items, 
  currentView, 
  onViewChange, 
  currentRole, 
  onRoleChange,
  userName,
  userSub,
  userInitials,
  userColor = 'bg-[#DEFF9A]'
}: SidebarProps) {
  const { 
    isSidebarOpen, 
    setIsSidebarOpen, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    theme,
    setTheme,
    language,
    setLanguage,
    userProgress,
    institutionName,
    institutionLogo
  } = useAppContext();

  useEffect(() => {
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndX = e.touches[0].clientX;
      if (!isSidebarOpen && touchStartX < 30 && touchEndX > 50) {
        setIsSidebarOpen(true);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const closeMobile = () => setIsSidebarOpen(false);

  const sidebarWidth = isSidebarCollapsed ? 'w-24' : 'w-72';

  return (
    <>
      {/* Mobile Floating Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-[70]">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="haptic-button-primary p-3 rounded-2xl text-[#061a1a] shadow-[0_10px_20px_rgba(222,255,154,0.3)] flex items-center justify-center animate-pulse"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-[#061a1a]/80 backdrop-blur-sm z-[80] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : -300,
          width: (typeof window !== 'undefined' && window.innerWidth >= 1024) ? (isSidebarCollapsed ? 96 : 288) : 288
        }}
        className={`fixed lg:relative left-0 top-0 h-full bg-[#061a1a]/60 backdrop-blur-[40px] z-[90] flex flex-col overflow-hidden transition-all duration-300 transform border-r border-white/10 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-24' : 'lg:w-72'}`}
      >
        <div className={`p-8 border-b border-white/5 mb-4 relative neo-glass !border-opacity-0 lg:!border-opacity-10 lg:rounded-[3rem] ${isSidebarCollapsed ? 'px-4' : 'px-8'}`}>
          <div className={`flex items-center gap-3 mb-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className={`w-10 h-10 ${userColor} rounded-xl flex items-center justify-center neon-border-glow shadow-[0_0_20px_rgba(222,255,154,0.3)] shrink-0`}>
              {currentRole === 'DIRECTOR' ? <Shield className="text-[#061a1a]" size={20} fill="currentColor" /> : 
               currentRole === 'DOCENTE' ? <Zap className="text-[#061a1a]" size={20} fill="currentColor" /> :
               <GraduationCap className="text-[#061a1a]" size={20} fill="currentColor" />}
            </div>
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-xl font-black tracking-tighter uppercase italic text-white truncate max-w-[180px]">
                  {institutionName}
                </h1>
                <p className="text-[#DEFF9A]/40 text-[8px] font-black uppercase tracking-[0.3em] truncate">{userSub}</p>
              </motion.div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-3 top-10 w-8 h-8 rounded-full bg-[#061a1a] border border-white/10 items-center justify-center text-white/40 hover:text-[#DEFF9A] transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={closeMobile}
            className="lg:hidden absolute top-8 right-8 text-white/20 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={`flex-1 space-y-3 overflow-y-auto pb-48 custom-scrollbar px-6 ${isSidebarCollapsed ? 'px-2' : 'px-6'}`}>
          {(() => {
            let lastSection = '';
            return items.map((item) => {
              const isActive = currentView === item.id;
              const isVIP = (item.id === 'progress-map' || item.id === 'ai-support') && userProgress >= 90;
              const showSectionHeader = item.section && item.section !== lastSection && !isSidebarCollapsed;
              
              if (item.section) {
                lastSection = item.section;
              }

              return (
                <div key={item.id} className="space-y-1">
                  {showSectionHeader && (
                    <div className="text-[7.5px] font-black text-[#DEFF9A]/40 uppercase tracking-[0.3em] pl-4 pt-4 pb-1">
                      {item.section}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      if (window.innerWidth < 1024) closeMobile();
                    }}
                    className={`haptic-press w-full flex items-center p-4 rounded-2xl transition-all group relative ${
                      isActive 
                        ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20 shadow-[0_0_20px_rgba(222,255,154,0.1)]' 
                        : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                    } ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <item.icon size={18} className={isActive ? 'text-[#DEFF9A]' : 'opacity-40 group-hover:opacity-100'} />
                        {isVIP && !isSidebarCollapsed && (
                           <motion.div 
                             animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22D3EE]" 
                           />
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                      )}
                    </div>
                    {!isSidebarCollapsed && item.badge && (
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                        item.badge === 'IA' || item.badge === 'REAL-TIME' ? 'bg-cyan-400 text-[#061a1a] border-cyan-400' : 'bg-[#DEFF9A] text-[#061a1a] border-[#DEFF9A]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isSidebarCollapsed && isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#DEFF9A] rounded-l-full shadow-[0_0_10px_#DEFF9A]" />
                    )}
                  </button>
                </div>
              );
            });
          })()}
        </nav>

        <div className={`p-6 border-t border-white/5 space-y-6 mt-auto bg-black/20 ${isSidebarCollapsed ? 'px-2 items-center' : 'p-6 pb-12'}`}>
          {!isSidebarCollapsed && (
            <>
              {/* Theme/Language Selectors */}
              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-white/5 rounded-xl border border-white/10 p-1 flex">
                    <button 
                      onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'normal' : 'dark')}
                      className="haptic-press flex-1 flex items-center justify-center py-2 rounded-lg hover:bg-white/5 transition-all text-white/40 hover:text-white"
                      title="Toggle Theme"
                    >
                       {theme === 'dark' ? <Moon size={14} /> : theme === 'light' ? <Sun size={14} /> : <Monitor size={14} />}
                    </button>
                    <div className="w-px h-4 bg-white/10 self-center" />
                    <button 
                      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                      className="haptic-press flex-1 flex items-center justify-center py-2 rounded-lg hover:bg-white/5 transition-all text-white/40 hover:text-white"
                      title="Toggle Language"
                    >
                       <Languages size={14} />
                       <span className="ml-1 text-[8px] font-black uppercase">{language}</span>
                    </button>
                 </div>
                 
                 <button 
                    onClick={() => {
                      onViewChange('settings');
                      if (window.innerWidth < 1024) closeMobile();
                    }}
                    className="bg-white/5 rounded-xl border border-white/10 p-1 flex items-center justify-center hover:bg-white/5 transition-all text-white/40 hover:text-white"
                    title="Settings"
                 >
                    <SettingsIcon size={14} />
                 </button>
              </div>

              <div className="mb-4">
                <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.2em] mb-3">Protocolo Central</p>
                <MasterSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
              </div>

              <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${userColor} flex items-center justify-center text-[#061a1a] font-black shrink-0 shadow-glow`}>
                  {userInitials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-white uppercase leading-none truncate">{userName}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase mt-1 truncate">{userSub}</p>
                </div>
              </div>
            </>
          )}

          {isSidebarCollapsed && (
            <div className="flex flex-col items-center gap-4">
               <button 
                 onClick={() => setIsSidebarCollapsed(false)}
                 className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all"
               >
                  <User size={18} />
               </button>
               <div className={`w-8 h-8 rounded-full ${userColor} flex items-center justify-center text-[#061a1a] font-black shadow-glow`}>
                  {userInitials}
                </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
