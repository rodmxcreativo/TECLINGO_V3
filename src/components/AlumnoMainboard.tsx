/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users,
  Sparkles, 
  Map,
  Calendar as CalendarIcon, 
  Mail, 
  Trophy, 
  Settings as SettingsIcon,
  MessageSquare,
  Flame,
  CheckCircle2,
  QrCode,
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Dna,
  Sun,
  Moon,
  Monitor,
  Languages,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, SidebarItem } from './Sidebar';
import { GlassCard } from './GlassCard';
import { MasterSwitcher, UserRole } from './MasterSwitcher';
import { UserSettings } from './UserSettings';
import { InstitutionalCalendar } from './InstitutionalCalendar';
import { FoliosDocente } from './FoliosDocente';
import { AchievementWall } from './AchievementWall';
import { AISkillsSupport } from './AISkillsSupport';
import { StudentGroup } from './StudentGroup';
import { PDPModule } from './PDPModule';
import { StudentTasks } from './StudentTasks';
import { StudentLibrary } from './StudentLibrary';
import { StudentGrades } from './StudentGrades';
import { StudentFolios } from './StudentFolios';
import { MessagingModule } from './MessagingModule';
import { ProgressMap } from './ProgressMap';
import { ADNTest } from './tools/ADNTest';
import { ExtracurricularModal } from './ExtracurricularModal';
import { useAppContext } from '../context/AppContext';
import { useMemo } from 'react';

interface AlumnoMainboardProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

 export function AlumnoMainboard({ currentRole, onRoleChange }: AlumnoMainboardProps) {
  const { 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    t,
    isSidebarCollapsed,
    isSidebarOpen,
    setIsSidebarOpen,
    globalEvents
  } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showADNTest, setShowADNTest] = useState(false);
  const [showClubVIP, setShowClubVIP] = useState(false);
  const [isADNDone, setIsADNDone] = useState(() => {
    return localStorage.getItem('adn_done') === 'true';
  });
  const attendancePercentage = 98;
  const attendanceStreak = 12;

  const sidebarItems: SidebarItem[] = useMemo(() => [
    { id: 'dashboard', label: t('my_dashboard'), icon: LayoutDashboard },
    { id: 'progress-map', label: t('progress_map'), icon: Map, badge: 'IA' },
    { id: 'pdp', label: t('pdp'), icon: BarChart3 },
    { id: 'ai-support', label: t('ai_support'), icon: Sparkles, badge: t('new') },
    { id: 'grupo', label: t('my_group'), icon: Users },
    { id: 'tareas', label: t('tasks'), icon: ClipboardList },
    { id: 'biblioteca', label: t('library'), icon: BookOpen, badge: t('new') },
    { id: 'notas', label: t('grades'), icon: BarChart3 },
    { id: 'calendario', label: t('calendar'), icon: CalendarIcon },
    { id: 'folios', label: t('folios'), icon: Mail },
    { id: 'extracurricular', label: 'EXTRACURRICULAR', icon: Sparkles, badge: 'PRÓXIMAMENTE' },
    { id: 'mensajes', label: t('messages'), icon: MessageSquare },
    { id: 'logros', label: t('achievements'), icon: Trophy },
    { id: 'settings', label: t('settings'), icon: SettingsIcon },
  ], [t]);

  const handleExtracurricular = () => {
    if (attendancePercentage < 85) {
      alert('ACCESO DENEGADO: Necesitas un mínimo de 85% de asistencia para el AR Portal VIP.');
      return;
    }
    setShowClubVIP(true);
  };

  return (
    <div className="h-screen bg-[#061a1a] text-white lg:grid lg:grid-cols-[auto_1fr] overflow-hidden relative">
      <Sidebar 
        items={sidebarItems}
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'extracurricular') {
            handleExtracurricular();
          } else {
            setCurrentView(view);
          }
        }}
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        userName="Alumno Inmersivo"
        userSub="Nivel A1 • Dallas"
        userInitials="AL"
        userColor="bg-[#22D3EE]"
      />

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-screen ${isSidebarOpen ? 'overflow-hidden' : 'overflow-y-auto'} custom-scrollbar pt-20 lg:pt-0 transition-all duration-300`}>
        <div className="p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full space-y-8 md:space-y-12 pb-32">
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
                      <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">Hola, Alumno_01!</h2>
                      <h1 className="text-3xl md:text-4xl font-black text-white bevel-text uppercase tracking-tight">Good Morning.</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        {globalEvents.filter(e => e.visibility.includes('GLOBAL') || e.visibility.includes('ALUMNO')).length > 0 && (
                          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hidden xl:flex">
                             <CalendarIcon size={16} className="text-[#DEFF9A]" />
                             <div className="text-left">
                                <p className="text-[#DEFF9A] text-[8px] font-black uppercase tracking-widest leading-none">Aviso Institucional</p>
                                <p className="text-white text-[10px] font-bold uppercase truncate max-w-[120px]">
                                   {globalEvents.find(e => e.visibility.includes('GLOBAL') || e.visibility.includes('ALUMNO'))?.title}
                                </p>
                             </div>
                          </div>
                        )}
                        <button 
                         onClick={() => setCurrentView('progress-map')}
                         className="flex items-center justify-center gap-3 px-6 py-4 md:py-3 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest hover:bg-[#DEFF9A] hover:text-[#061a1a] transition-all"
                       >
                         Continuar Ruta <ChevronRight size={14} />
                       </button>
                             <div className="flex items-center gap-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5 sm:bg-transparent sm:border-0 sm:p-0">
                                <div className="text-left md:text-right w-full">
                                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Tu Constancia</p>
                                    <div className="flex items-center gap-3 text-[#F59E0B] md:justify-end">
                                      <div className="relative">
                                        <Flame size={24} fill="currentColor" className="animate-pulse" />
                                        <div className="absolute inset-0 blur-lg bg-[#F59E0B]/40 animate-pulse" />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-2xl font-black uppercase leading-none">{attendanceStreak} DÍAS</span>
                                        <span className="text-[8px] font-bold text-[#F59E0B]/60 uppercase tracking-widest">Streak Activo</span>
                                      </div>
                                    </div>
                                </div>
                              </div>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* ADN Alert Banner */}
                    {!isADNDone && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-1 md:col-span-2 lg:col-span-12 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br md:bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-transparent border border-purple-500/30 flex flex-col lg:flex-row items-center lg:justify-between gap-8 md:gap-10 overflow-hidden relative group text-center lg:text-left"
                      >
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] -translate-y-1/2 translate-x-1/2 rounded-full" />
                         <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 w-full lg:w-auto">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_40px_rgba(139,92,246,0.2)] shrink-0">
                               <Dna size={32} className="animate-pulse" />
                            </div>
                            <div className="space-y-2">
                               <div className="flex flex-col md:flex-row items-center gap-3">
                                  <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-tight">Tu ADN Académico está incompleto</h3>
                                  <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-[8px] font-black uppercase">Obligatorio</span>
                               </div>
                               <p className="text-white/40 text-[10px] md:text-[11px] font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                                 Para que la IA de TECLINGO pueda personalizar tus tareas y exámenes con tus gustos, necesitamos recalibrar tu ADN inicial.
                               </p>
                            </div>
                         </div>
                         <button 
                           onClick={() => setShowADNTest(true)}
                           className="w-full lg:w-auto px-10 py-5 rounded-2xl md:rounded-3xl bg-white text-[#061a1a] text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10"
                         >
                            Iniciar ADN Test
                         </button>
                      </motion.div>
                    )}

                    {isADNDone && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-1 md:col-span-2 lg:col-span-12 p-6 md:p-10 rounded-[2.5rem] bg-black/40 border border-[#DEFF9A]/20 shadow-[0_0_50px_rgba(222,255,154,0.05)] relative overflow-hidden text-left"
                      >
                         <div className="absolute top-0 right-0 w-80 h-80 bg-[#DEFF9A]/05 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                         <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/02 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                         
                         <div className="relative z-10 space-y-8">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                     <Dna size={16} className="text-[#DEFF9A] animate-pulse" />
                                     <span className="text-[#DEFF9A] text-[9px] font-mono font-black uppercase tracking-[0.3em]">
                                        Resultados de Diagnóstico Inicial
                                     </span>
                                  </div>
                                  <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                                     ANÁLISIS DE LAS 5 SKILLS • ADN ACADÉMICO
                                  </h2>
                               </div>
                               <button 
                                 onClick={() => {
                                    if (window.confirm('¿Quieres reiniciar tu diagnóstico de 5 Skills para recalibrar tu nivel?')) {
                                       setIsADNDone(false);
                                       localStorage.removeItem('adn_done');
                                       setShowADNTest(true);
                                    }
                                 }}
                                 className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-widest uppercase text-white/40 hover:text-white hover:border-[#DEFF9A]/30 hover:bg-[#DEFF9A]/10 transition-all flex items-center gap-2"
                               >
                                  <span>🔄</span> Re-calibrar ADN
                               </button>
                            </div>

                            {/* Scale Table */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                               
                               {/* Left Scale Table */}
                               <div className="lg:col-span-7 space-y-4">
                                  <div className="flex items-center justify-between text-[10px] font-mono font-black text-white/30 uppercase tracking-widest pl-2">
                                     <span>Habilidad Académica</span>
                                     <span>Rendimiento / Escala</span>
                                  </div>

                                  <div className="space-y-3">
                                     {[
                                       { name: "Grammar & Structure", score: "4.8", max: "10", type: "Debilidad ⚠️", desc: "Errores recurrentes en condicionales y conjugación pasiva.", color: "text-red-400", barColor: "bg-red-500", glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]", border: "border-red-500/10" },
                                       { name: "Reading Comprehension", score: "8.5", max: "10", type: "Poder ⚡", desc: "Excelente retención de ideas principales y vocabulario contextual.", color: "text-emerald-400", barColor: "bg-emerald-400", glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]", border: "border-emerald-500/10" },
                                       { name: "Listening & Audio Focus", score: "7.2", max: "10", type: "Poder ⚡", desc: "Buena decodificación de audio, comprensión de acentos estándar.", color: "text-emerald-400", barColor: "bg-[#22D3EE]", glow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]", border: "border-cyan-500/10" },
                                       { name: "Speaking Accuracy", score: "8.2", max: "10", type: "Poder ⚡", desc: "Gran fluidez y modulación de pronunciación en contextos guiados.", color: "text-[#DEFF9A]", barColor: "bg-[#DEFF9A]", glow: "shadow-[0_0_15px_rgba(222,255,154,0.3)]", border: "border-[#DEFF9A]/20" },
                                       { name: "Writing & Composition", score: "5.5", max: "10", type: "Debilidad ⚠️", desc: "Requiere mayor precisión de concordancia y cohesión formal.", color: "text-red-400", barColor: "bg-red-400", glow: "shadow-[0_0_15px_rgba(248,113,113,0.3)]", border: "border-red-500/10" }
                                     ].map((item, idx) => (
                                       <div 
                                         key={idx}
                                         className={`p-4 rounded-2xl bg-black/20 border ${item.border} flex flex-col md:flex-row md:items-center justify-between gap-4`}
                                       >
                                          <div className="space-y-1 max-w-sm">
                                             <div className="flex items-center gap-2.5">
                                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${item.type.includes('Poder') ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'bg-red-500/10 text-red-400'}`}>
                                                   {item.type}
                                                </span>
                                                <span className="text-white text-xs font-black uppercase tracking-tight">{item.name}</span>
                                             </div>
                                             <p className="text-white/40 text-[9px] leading-relaxed uppercase">{item.desc}</p>
                                          </div>

                                          <div className="flex items-center gap-4 shrink-0 md:w-48">
                                             <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                                                <div 
                                                  className={`h-full rounded-full ${item.barColor} ${item.glow}`}
                                                  style={{ width: `${parseFloat(item.score) * 10}%` }}
                                                />
                                             </div>
                                             <div className="font-mono text-right min-w-[45px]">
                                                <span className="text-xs font-black text-white">{item.score}</span>
                                                <span className="text-[9px] text-[#DEFF9A]/60">/{item.max}</span>
                                             </div>
                                          </div>
                                       </div>
                                     ))}
                                  </div>
                               </div>

                               {/* Right Details, Placement & Personalization Details */}
                               <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                                  
                                  {/* Student Placement Frame */}
                                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                     <span className="text-white/30 text-[8px] font-black uppercase tracking-widest block">Ubicación Institucional Actual</span>
                                     <div className="flex items-baseline gap-2">
                                        <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-tight">B1 INICIAL</h3>
                                        <span className="text-[10px] font-bold text-white/55 uppercase">(Pre-Intermediate)</span>
                                     </div>
                                     <p className="text-white/40 text-[10px] leading-relaxed uppercase">
                                        Tu conocimiento general se sitúa en un estatus conversacional promedio. Dominas el vocabulario de supervivencia, pero requieres corregir los vacíos ortográficos estructurales.
                                     </p>
                                  </div>

                                  {/* Consejo o Achievement Comment */}
                                  <div className="p-5 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 space-y-2">
                                     <div className="flex items-center gap-2 text-[#DEFF9A]">
                                        <Trophy size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Consejo del Evaluador • Little Tech Recommendation</span>
                                     </div>
                                     <p className="text-white/80 text-[10.5px] leading-relaxed font-bold uppercase tracking-wide">
                                        "¡Estás muy bien ubicado, compadre! Tu fluidez conversacional en Speaking es tu gran as bajo la manga, pero no descuides tu talón de Aquiles escrito. Esta semana te recomiendo jugar con el módulo 'Grammar Fixer' y pedirle a la IA que te ayude a blindar tu sintaxis."
                                     </p>
                                  </div>

                                  {/* Adaptive Content Note */}
                                  <div className="p-5 rounded-2xl bg-cyan-400/5 border border-cyan-400/10 space-y-2.5">
                                     <div className="flex items-center gap-2 text-cyan-400">
                                        <Sparkles size={14} className="animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Educación Adaptativa 100% Personalizada</span>
                                     </div>
                                     <p className="text-white/55 text-[10px] leading-relaxed uppercase">
                                        ✨ **Sistema Automatizado**: Las mallas curriculares, lecturas guiadas de biblioteca y ejercicios prácticos de tu simulador de conversación se recalibrarán dinámicamente para priorizar precisión y concordancia escrita, evitando que pierdas tiempo en contenidos que ya dominas perfectamente de acuerdo con tu ADN del curso.
                                     </p>
                                  </div>

                               </div>

                            </div>
                         </div>
                      </motion.div>
                    )}

                    {/* Progress Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-8">
                       <GlassCard accent="green" className="!p-6 md:!p-10 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DEFF9A]/05 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10 lg:gap-12">
                             <div className="flex-1 space-y-6 md:space-y-8">
                                <div>
                                   <div className="flex items-center gap-4 mb-3">
                                      <span className="px-3 py-1 rounded-full bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase">NIVEL A1</span>
                                      <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">75% Completado</span>
                                   </div>
                                   <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                                      <div className="h-full bg-[#DEFF9A] rounded-full shadow-[0_0_15px_#DEFF9A]" style={{ width: '75%' }} />
                                   </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:gap-8">
                                   <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-black/20 border border-white/5">
                                      <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-2">Speaking Accuracy</p>
                                      <div className="flex items-end gap-2">
                                         <p className="text-2xl md:text-3xl font-black text-[#DEFF9A]">8.2</p>
                                         <p className="text-[10px] text-white/40 font-bold mb-1">/ 10</p>
                                      </div>
                                   </div>
                                   <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-black/20 border border-white/5">
                                      <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-2">Attendance Score</p>
                                      <p className="text-2xl md:text-3xl font-black text-white">98%</p>
                                   </div>
                                </div>
                             </div>

                             <div className="w-full md:w-64 flex flex-col justify-center items-center gap-6 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 text-center">
                                <QrCode size={48} className="text-[#DEFF9A] opacity-60 md:size-64" />
                                <div>
                                   <p className="text-white text-xs font-black uppercase">Acceso Rápido</p>
                                   <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest mt-2 leading-relaxed max-w-[150px] mx-auto">Escanea tu ID en el campus al llegar.</p>
                                </div>
                                <button 
                                  onClick={() => setCurrentView('settings')}
                                  className="w-full py-4 bg-[#DEFF9A] text-[#061a1a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(222,255,154,0.3)]"
                                >
                                   Ver ID Card
                                </button>
                             </div>
                          </div>
                       </GlassCard>
                    </div>

                    {/* Upcoming Tasks */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4">
                       <GlassCard title="Próxima Clase" icon={Clock} accent="cyan">
                          <div className="space-y-6">
                             <div className="flex justify-between items-center text-[9px] font-black text-white/30 uppercase tracking-[0.2em] pb-4 border-b border-white/5">
                                <span>MAÑANA • 08:00 AM</span>
                                <span>SALÓN 102</span>
                             </div>
                             
                             <div className="space-y-4">
                                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Tareas por Completar:</p>
                                <div className="space-y-3">
                                   {[
                                     { t: 'Review Airport Vocab', c: true },
                                     { t: 'Practice "The Bridge" AI', c: false },
                                     { t: 'Upload Passport Evidence', c: false }
                                   ].map((task, i) => (
                                     <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${task.c ? 'bg-[#4ADE80] border-[#4ADE80] text-[#061a1a]' : 'border-white/10'}`}>
                                           {task.c && <CheckCircle2 size={12} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-tight truncate ${task.c ? 'text-white/60 line-through' : 'text-white'}`}>{task.t}</span>
                                     </div>
                                   ))}
                                </div>
                             </div>

                             <button className="w-full py-4 bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#22D3EE] hover:text-[#061a1a] transition-all">
                                Ir a Laboratorio IA <ChevronRight size={14} />
                             </button>
                          </div>
                       </GlassCard>
                    </div>

                    {/* Insights Widget */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-12">
                       <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br md:bg-gradient-to-r from-[#DEFF9A]/10 to-transparent border border-[#DEFF9A]/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                             <div className="w-16 h-16 rounded-2xl md:rounded-3xl bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] shrink-0">
                                <TrendingUp size={32} />
                             </div>
                             <div>
                                <h4 className="text-white text-lg md:text-xl font-black uppercase tracking-tight">AI Achievement Alert</h4>
                                <p className="text-white/40 text-[10px] md:text-[11px] font-medium leading-relaxed max-w-xl">
                                   "Tu desempeño en 'Pronunciación de Vocales' ha aumentado un 15% esta semana. ¡Sigue practicando en 'The Bridge' para alcanzar el rango ELITE!"
                                </p>
                             </div>
                          </div>
                          <button 
                            onClick={() => setCurrentView('logros')}
                            className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all shrink-0"
                          >
                            Ver Detalles
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              ) : currentView === 'progress-map' ? (
                <ProgressMap />
              ) : currentView === 'pdp' ? (
                <PDPModule />
              ) : currentView === 'grupo' ? (
                <StudentGroup />
              ) : currentView === 'ai-support' ? (
                <AISkillsSupport />
              ) : currentView === 'tareas' ? (
                <StudentTasks />
              ) : currentView === 'biblioteca' ? (
                <StudentLibrary />
              ) : currentView === 'notas' ? (
                <StudentGrades />
              ) : currentView === 'calendario' ? (
                <InstitutionalCalendar />
              ) : currentView === 'folios' ? (
                <StudentFolios />
              ) : currentView === 'mensajes' ? (
                <MessagingModule />
              ) : currentView === 'logros' ? (
                <AchievementWall />
              ) : currentView === 'settings' ? (
                <UserSettings role="ALUMNO" />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 opacity-20 text-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center mb-8">
                     <GraduationCap size={48} className="text-white/40 md:size-64" />
                  </div>
                  <p className="text-2xl md:text-4xl font-black tracking-[0.3em] md:tracking-[0.5em] uppercase bevel-text mb-4 leading-tight">Module Locked</p>
                  <p className="text-[10px] md:text-[12px] tracking-widest font-bold max-w-md mx-auto leading-relaxed">
                    ESTE MÓDULO ESTÁ EN FASE DE DESARROLLO INMERSIVO. PRÓXIMAMENTE DISPONIBLE PARA EL CICLO 2026-B.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showADNTest && (
          <ADNTest onClose={() => {
            setShowADNTest(false);
            setIsADNDone(true);
            localStorage.setItem('adn_done', 'true');
          }} />
        )}
        {showClubVIP && (
          <ExtracurricularModal 
            onClose={() => setShowClubVIP(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
