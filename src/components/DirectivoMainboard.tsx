/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Bell, 
  Calendar, 
  Settings as SettingsIcon,
  Shield,
  Zap,
  ChevronRight,
  TrendingUp,
  Search,
  MessageSquare,
  Globe,
  Sun,
  Moon,
  Monitor,
  Languages,
  Stamp,
  Key,
  BookOpen,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { MasterSwitcher, UserRole } from './MasterSwitcher';
import { Sidebar, SidebarItem } from './Sidebar';
import { GlassCard } from './GlassCard';
import { AcademicBI } from './AcademicBI';
import { OperationalCommand } from './OperationalCommand';
import { InnovationAlerts } from './InnovationAlerts';
import { UsersMaster } from './UsersMaster';
import { AcademicAudit } from './AcademicAudit';
import { UserSettings } from './UserSettings';
import { MessagingModule } from './MessagingModule';
import { QuickChat } from './QuickChat';
import { FolioConstructor } from './FolioConstructor';
import { FolioMonitor } from './FolioMonitor';
import { RegistryControl } from './RegistryControl';
import { DirectorLibrary } from './DirectorLibrary';
import { SchedulesMaster } from './SchedulesMaster';
import { LittleTech } from './LittleTech';
import DemoBotPage from '../app/dashboard/director/demo-bot/page';

interface DirectivoMainboardProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function DirectivoMainboard({ currentRole, onRoleChange }: DirectivoMainboardProps) {
  const { 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    t,
    isSidebarCollapsed,
    isSidebarOpen,
    setIsSidebarOpen,
    institutionName,
    setInstitutionName,
    globalEvents
  } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [targetChatId, setTargetChatId] = useState<string | null>(null);

  useEffect(() => {
    const handleNavigate = () => {
      localStorage.setItem('library_initial_tab', 'HORARIOS');
      setCurrentView('biblioteca');
    };
    window.addEventListener('navigate-to-scheduler', handleNavigate);
    return () => {
      window.removeEventListener('navigate-to-scheduler', handleNavigate);
    };
  }, []);

  const handleNavigateToFullChat = (userId: string) => {
    setTargetChatId(userId);
    setCurrentView('mensajes');
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, section: 'Estratégico & BI' },
    { id: 'bi', label: 'Academic BI', icon: BarChart3, badge: 'REAL-TIME', section: 'Estratégico & BI' },
    { id: 'users', label: 'User Master', icon: Users, section: 'Gestión Institucional' },
    { id: 'audit', label: 'Academic Audit', icon: Search, section: 'Gestión Institucional' },
    { id: 'biblioteca', label: 'Biblioteca Digital', icon: BookOpen, section: 'Gestión Institucional' },
    { id: 'folios', label: 'Gestión Folios', icon: Stamp, badge: 'OFFICIAL', section: 'Control & Certificación' },
    { id: 'registry', label: 'Registry Access', icon: Key, badge: 'DYNAMIC', section: 'Control & Certificación' },
    { id: 'mensajes', label: 'Communication', icon: MessageSquare, section: 'Comunicación & Soporte' },
    { id: 'demo-bot', label: 'Demo Bot AI', icon: Bot, badge: 'SIM v2.5', section: 'Comunicación & Soporte' },
    { id: 'alerts', label: 'Innovation Logs', icon: Bell, badge: '12', section: 'Comunicación & Soporte' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, section: 'Comunicación & Soporte' },
  ];

  const quickStats = [
    { label: 'Matrícula Total', value: '1,284', trend: '+12%', icon: Users, color: 'text-cyan-400' },
    { label: 'Retención IA', value: '94.2%', trend: '+3%', icon: TrendingUp, color: 'text-[#DEFF9A]' },
    { label: 'Eficiencia Docente', value: '88%', trend: '-2%', icon: Zap, color: 'text-orange-400' },
  ];

  return (
    <div className="h-screen bg-[#061a1a] text-white lg:grid lg:grid-cols-[auto_1fr] overflow-hidden relative">
      <Sidebar 
        items={sidebarItems}
        currentView={currentView}
        onViewChange={setCurrentView}
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        userName="Dir. Hub TECLINGO"
        userSub="Nivel Ejecutivo"
        userInitials="DH"
      />

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-screen ${isSidebarOpen ? 'overflow-hidden' : 'overflow-y-auto'} custom-scrollbar pt-20 lg:pt-0 transition-all duration-300`}>
        <div className="p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full space-y-8 md:space-y-12 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {currentView === 'dashboard' ? (
                <div className="space-y-8 md:space-y-12">
                   <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                      <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">{institutionName} Command Center</h2>
                      <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                         ESTADO <span className="text-[#DEFF9A]">OPERATIVO</span>
                      </h1>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {globalEvents.length > 0 && (
                          <div className="px-6 py-3 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center gap-4 hidden xl:flex">
                             <Calendar size={16} className="text-[#DEFF9A]" />
                             <div>
                                <p className="text-[#DEFF9A] text-[8px] font-black uppercase tracking-widest leading-none">Próximo Evento</p>
                                <p className="text-white text-[10px] font-bold uppercase truncate max-w-[150px]">{globalEvents[0].title}</p>
                             </div>
                             <div className="ml-2 px-2 py-1 bg-[#DEFF9A] rounded text-[8px] font-black text-black">MAYO</div>
                          </div>
                        )}
                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#DEFF9A] animate-pulse shadow-[0_0_10px_#DEFF9A]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Sistemas IA Online</span>
                       </div>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {quickStats.map((stat, i) => (
                       <div key={i}>
                         <GlassCard className="!p-8">
                           <div className="flex justify-between items-start mb-4">
                              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                 <stat.icon size={24} />
                              </div>
                              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'bg-red-500/10 text-red-400'}`}>
                                 {stat.trend}
                              </span>
                           </div>
                           <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                           <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                        </GlassCard>
                       </div>
                     ))}
                  </div>

                  {/* Banner / Access block for the Master Virtual Book */}
                  <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-950/25 to-transparent border border-[#10b981]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#10b981]/20 text-[#10b981] font-mono text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">MALLA COMPLETA</span>
                        <span className="text-white/40 text-[10px] font-mono font-bold">• 100% EVERYDAY ENGLISH</span>
                      </div>
                      <h3 className="text-base md:text-lg font-black text-white uppercase italic tracking-tight">Liberación de Contenido Académico (Módulo 1)</h3>
                      <p className="text-xs text-white/60">
                        Se ha sincronizado e inyectado el cronograma real de 18 semanas, con 4 horas por clase y enlaces oficiales directos de apoyo.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        localStorage.setItem('library_initial_tab', 'LIBRO_VIRTUAL');
                        setCurrentView('biblioteca');
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-[#10b981] hover:bg-[#0da471] text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center gap-2 select-none active:scale-95 cursor-pointer shrink-0"
                    >
                      <BookOpen size={14} />
                      Examinar Libro Virtual
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-8">
                        <OperationalCommand onOpenScheduler={() => {
                           localStorage.setItem('library_initial_tab', 'HORARIOS');
                           setCurrentView('biblioteca');
                        }} />
                     </div>
                     <div className="lg:col-span-4">
                        <InnovationAlerts />
                     </div>
                  </div>
                </div>
              ) : currentView === 'bi' ? (
                <AcademicBI />
              ) : currentView === 'operations' ? (
                <SchedulesMaster onBack={() => setCurrentView('dashboard')} />
              ) : currentView === 'users' ? (
                <UsersMaster />
              ) : currentView === 'audit' ? (
                <AcademicAudit />
              ) : currentView === 'folios' ? (
                <div className="space-y-12">
                   <header>
                      <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">Módulo de Documentación</h2>
                      <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                         GESTIÓN DE <span className="text-[#DEFF9A]">FOLIOS</span>
                      </h1>
                   </header>
                   <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                      <div className="xl:col-span-12">
                         <FolioMonitor />
                      </div>
                      <div className="xl:col-span-12">
                         <FolioConstructor />
                      </div>
                   </div>
                </div>
              ) : currentView === 'registry' ? (
                <RegistryControl />
              ) : currentView === 'biblioteca' ? (
                <DirectorLibrary />
              ) : currentView === 'alerts' ? (
                <InnovationAlerts />
              ) : currentView === 'mensajes' ? (
                <MessagingModule initialChatId={targetChatId || undefined} />
              ) : currentView === 'demo-bot' ? (
                <DemoBotPage />
              ) : currentView === 'settings' ? (
                <UserSettings role="DIRECTOR" />
              ) : (
                 <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Shield size={64} className="mb-4" />
                    <h2 className="text-2xl font-black uppercase">Module Encrypted</h2>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <QuickChat onNavigateToFullChat={handleNavigateToFullChat} />
      </main>

      {/* Floating Little Tech Assistant */}
      <LittleTech context="director" />
    </div>
  );
}
