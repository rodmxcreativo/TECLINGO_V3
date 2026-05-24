/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BarChart3, 
  QrCode, 
  BookOpen, 
  Camera, 
  FileText, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Upload,
  Calendar,
  Settings as SettingsIcon,
  Mail,
  MessageSquare,
  ChevronRight,
  UserCheck,
  ClipboardList,
  Activity,
  Sun,
  Moon,
  Monitor,
  Languages,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, SidebarItem } from './Sidebar';
import { GlassCard } from './GlassCard';
import { GroupManagement } from './GroupManagement';
import { UserSettings } from './UserSettings';
import { PlanningModule } from './PlanningModule';
import { EvidenceModule } from './EvidenceModule';
import { FoliosDocente } from './FoliosDocente';
import { AvailabilityModule } from './AvailabilityModule';
import { InstitutionalCalendar } from './InstitutionalCalendar';
import { TeacherSchedules } from './TeacherSchedules';
import { MasterSwitcher, UserRole } from './MasterSwitcher';
import { MessagingModule } from './MessagingModule';
import { AttendanceModule } from './AttendanceModule';
import { TeacherAttendance } from './TeacherAttendance';
import { StudentAcademicActivity } from './StudentAcademicActivity';
import { useAppContext } from '../context/AppContext';
import { LittleTech } from './LittleTech';
import ModuloAsignacionLogrosDocente from './ModuloAsignacionLogrosDocente';

interface DocenteMainboardProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

interface AlumnoAsistencia {
  id: string;
  name: string;
  present: boolean;
  photo: string;
}

const mockAlumnos: AlumnoAsistencia[] = [
  { id: '1', name: 'Juan P.', present: true, photo: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Maria G.', present: true, photo: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Luis M.', present: false, photo: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Ana S.', present: true, photo: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Pedro R.', present: false, photo: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'Sofia L.', present: true, photo: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', name: 'Héctor V.', present: false, photo: 'https://i.pravatar.cc/150?u=7' },
  { id: '8', name: 'Elena D.', present: true, photo: 'https://i.pravatar.cc/150?u=8' },
];
 export function DocenteMainboard({ currentRole, onRoleChange }: DocenteMainboardProps) {
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
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGroupForAttendance, setSelectedGroupForAttendance] = useState<string | null>(null);
  const [presentCount, setPresentCount] = useState(mockAlumnos.filter(a => a.present).length);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Mi Clase', icon: BarChart3 },
    { id: 'academic', label: 'Actividad de Mis Grupos', icon: Activity },
    { id: 'asistencias', label: 'Asistencias', icon: BarChart3 },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'horarios', label: 'Horarios', icon: Clock },
    { id: 'qr', label: 'QR Gate', icon: QrCode },
    { id: 'grupos', label: 'Mis Grupos', icon: Users },
    { id: 'planeacion', label: 'Planeación', icon: BookOpen },
    { id: 'evidencias', label: 'Evidencias', icon: Camera },
    { id: 'folios', label: 'Folios', icon: FileText },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare },
    { id: 'logros', label: 'Reconocimientos', icon: Trophy },
    { id: 'settings', label: 'Configuración', icon: SettingsIcon },
  ];

  return (
    <div className="lg:grid lg:grid-cols-[auto_1fr] h-screen bg-[#061a1a] text-white overflow-hidden relative">
      <Sidebar 
        items={sidebarItems}
        currentView={currentView}
        onViewChange={setCurrentView}
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        userName="Ana López"
        userSub="Senior Teacher"
        userInitials="AL"
        userColor="bg-[#4ADE80]"
      />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col h-screen ${isSidebarOpen ? 'overflow-hidden' : 'overflow-y-auto'} custom-scrollbar pt-20 lg:pt-0 transition-all duration-300`}>
        <div className="p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full space-y-12">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {selectedGroupForAttendance ? (
                <AttendanceModule 
                  groupName={selectedGroupForAttendance} 
                  onBack={() => setSelectedGroupForAttendance(null)} 
                />
              ) : currentView === 'dashboard' ? (
                <>
                  <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h2 className="text-[#4ADE80] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Módulo: Operación y Evidencia</h2>
                        <h1 className="text-3xl md:text-4xl font-black text-white bevel-text uppercase tracking-tight">Clase del Día</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        {globalEvents.some(e => e.visibility.includes('GLOBAL') || e.visibility.includes('DOCENTE')) && (
                          <div className="px-6 py-3 rounded-2xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center gap-4 hidden xl:flex">
                             <Calendar size={16} className="text-[#4ADE80]" />
                             <div className="text-left">
                                <p className="text-[#4ADE80] text-[8px] font-black uppercase tracking-widest leading-none">Circular Institucional</p>
                                <p className="text-white text-[10px] font-bold uppercase truncate max-w-[120px]">
                                   {globalEvents.find(e => e.visibility.includes('GLOBAL') || e.visibility.includes('DOCENTE'))?.title}
                                </p>
                             </div>
                          </div>
                        )}
                        <div className="text-left md:text-right w-full md:w-auto">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Status de Sesión</p>
                        <div className="flex items-center gap-2 text-[#4ADE80] md:justify-end">
                          <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_8px_#4ADE80]" />
                          <span className="text-sm font-black uppercase tracking-widest">En Progreso</span>
                        </div>
                    </div>
                  </div>
                </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Clase Actual Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-8">
                      <GlassCard accent="green" className="!p-6 md:!p-8 h-full">
                          <div className="flex flex-col lg:flex-row justify-between gap-8 h-full">
                            <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-4">
                                  <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-[#4ADE80] text-lg font-black uppercase tracking-tighter">
                                      A1-102
                                  </div>
                                  <div>
                                      <p className="text-white text-xl md:text-2xl font-black tracking-tight uppercase">Basic English Lab</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Clock size={12} className="text-white/30" />
                                        <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">08:00 - 10:00 • SALÓN 102</span>
                                      </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                      <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Asistencia</p>
                                      <p className="text-xl font-black text-white">{presentCount} / {mockAlumnos.length}</p>
                                  </div>
                                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                      <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Evidencia</p>
                                      <p className="text-xl font-black text-white uppercase text-[10px]">Pendiente</p>
                                  </div>
                                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                      <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Tema</p>
                                      <p className="text-[10px] font-black text-white uppercase truncate">Roleplay: Airport</p>
                                  </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <button 
                                  onClick={() => setIsScanning(true)}
                                  className="w-full lg:w-auto bg-[#4ADE80] text-[#061a1a] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 hover:shadow-[0_0_40px_rgba(74,222,128,0.4)] transition-all group overflow-hidden relative min-h-[140px]"
                                >
                                  <QrCode size={40} className="group-hover:scale-110 transition-transform md:size-48" />
                                  <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest">Pase de Lista (QR)</span>
                                  <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-20 animate-scan pointer-events-none" />
                                </button>
                            </div>
                          </div>
                      </GlassCard>
                    </div>

                    {/* Monitor de Asistencia Live */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4">
                      <GlassCard title="Monitor en Vivo" icon={Users} accent="green">
                        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                            {mockAlumnos.map((a) => (
                              <div key={a.id} className="relative group">
                                 <div className={`w-full aspect-square rounded-xl md:rounded-2xl border-2 p-0.5 md:p-1 transition-all ${a.present ? 'border-[#4ADE80]' : 'border-white/5'}`}>
                                    {a.photo ? (
                                      <img src={a.photo} className={`w-full h-full rounded-lg md:rounded-xl object-cover ${a.present ? 'opacity-100' : 'opacity-20'}`} alt={a.name} />
                                    ) : (
                                      <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center">
                                        <Users size={16} className="text-white/20" />
                                      </div>
                                    )}
                                </div>
                                {a.present && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4ADE80] rounded-full border-2 border-[#061a1a] flex items-center justify-center text-[10px] font-black">
                                      ✓
                                  </div>
                                )}
                                <span className="absolute -bottom-1 -left-1 right-1 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded text-[6px] font-black uppercase text-white/80 truncate">{a.name}</span>
                              </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Puntualidad: 75%</span>
                            <button className="text-[8px] font-black text-[#4ADE80] uppercase tracking-widest hover:underline">Ver Todos</button>
                        </div>
                      </GlassCard>
                    </div>

                    {/* Módulo de Evidencia Diaria */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-7">
                      <GlassCard title="Evidencia SMART" icon={Camera} accent="cyan">
                          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center">
                            <div 
                              onClick={() => setIsUploading(true)}
                              className="w-full sm:w-40 h-40 md:w-48 md:h-48 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-[#22D3EE]/40 hover:bg-[#22D3EE]/5 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group shrink-0"
                            >
                                <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 group-hover:bg-[#22D3EE]/20 transition-colors">
                                  <Upload size={24} className="text-white/20 group-hover:text-[#22D3EE] md:size-32" />
                                </div>
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest text-center px-4 leading-tight group-hover:text-white/40 transition-colors">Capturar Evidencia</p>
                            </div>
                            <div className="space-y-4 text-center sm:text-left">
                                <p className="text-white/60 text-[11px] md:text-xs font-medium leading-relaxed italic">
                                  "Sube la evidencia de hoy para validar tu sesión ante Dirección. El sistema TECLINGO PRO 1.1 analizará el contexto pedagógico."
                                </p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                  <div className="px-3 py-1.5 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-[8px] font-black uppercase tracking-widest">JPG, PNG</div>
                                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/20 text-[8px] font-black uppercase tracking-widest">Max 10MB</div>
                                </div>
                            </div>
                          </div>
                      </GlassCard>
                    </div>

                    {/* Folios Pendientes Alert */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-5">
                      <GlassCard title="Mensajería" icon={Mail} accent="orange">
                          <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 relative overflow-hidden group hover:bg-[#F59E0B]/10 transition-all cursor-pointer">
                            <div className="flex items-center gap-4 md:gap-6 mb-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#F59E0B] shadow-[0_0_20px_#F59E0B40] flex items-center justify-center text-[#061a1a] shrink-0">
                                  <AlertTriangle size={20} md:size={24} />
                                </div>
                                <div>
                                  <h4 className="text-white text-md md:text-lg font-black tracking-tight uppercase truncate">Circular Pendiente</h4>
                                  <p className="text-[#F59E0B] text-[8px] font-black uppercase tracking-widest mt-0.5">Acción: Firma Digital</p>
                                </div>
                            </div>
                            <p className="text-white/40 text-[10px] md:text-[11px] leading-relaxed mb-6">
                                Tienes 1 circular del Director esperando tu firma para confirmar el protocolo.
                            </p>
                            <button className="w-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F59E0B] hover:text-[#061a1a] transition-all">
                                Ir al Buzón <ChevronRight size={14} />
                            </button>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
                          </div>
                      </GlassCard>
                    </div>
                  </div>
                </>
              ) : currentView === 'academic' ? (
                <StudentAcademicActivity role="DOCENTE" />
              ) : currentView === 'grupos' ? (
                <GroupManagement onTakeAttendance={(group) => setSelectedGroupForAttendance(group)} />
              ) : currentView === 'asistencias' ? (
                <TeacherAttendance />
              ) : currentView === 'mensajes' ? (
                <MessagingModule />
              ) : currentView === 'calendario' ? (
                <InstitutionalCalendar />
              ) : currentView === 'horarios' ? (
                <TeacherSchedules />
              ) : currentView === 'planeacion' ? (
                <PlanningModule />
              ) : currentView === 'evidencias' ? (
                <EvidenceModule />
              ) : currentView === 'folios' ? (
                <FoliosDocente />
              ) : currentView === 'logros' ? (
                <ModuloAsignacionLogrosDocente />
              ) : currentView === 'disponibilidad' ? (
                <AvailabilityModule />
              ) : currentView === 'settings' ? (
                <UserSettings role="DOCENTE" />
              ) : (
                <div className="flex flex-col items-center justify-center py-24 px-4 opacity-20 text-center">
                  <p className="text-2xl md:text-4xl font-black tracking-[0.3em] md:tracking-[0.5em] uppercase bevel-text leading-tight">Módulo en Desarrollo</p>
                  <p className="text-[10px] md:text-[12px] mt-4 tracking-widest font-bold">DOCENTE OPERATIVO PROTOCOL</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Full Screen QR Scanner Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
             <div className="absolute inset-0 bg-[#061a1a]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
             </div>

             <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[480px] md:h-[480px]">
                <div className="absolute inset-0 border-2 border-white/10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
                   <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-4 border-l-4 border-[#4ADE80] rounded-tl-[2.5rem] md:rounded-tl-[3rem]" />
                   <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t-4 border-r-4 border-[#4ADE80] rounded-tr-[2.5rem] md:rounded-tr-[3rem]" />
                   <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-b-4 border-l-4 border-[#4ADE80] rounded-bl-[2.5rem] md:rounded-bl-[3rem]" />
                   <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-4 border-r-4 border-[#4ADE80] rounded-br-[2.5rem] md:rounded-br-[3rem]" />
                   
                   <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 w-full h-[3px] md:h-[4px] bg-[#4ADE80] shadow-[0_0_20px_#4ADE80]" 
                   />
                </div>
                
                <div className="absolute -bottom-20 left-0 right-0 text-center px-4">
                   <p className="text-white font-black text-lg md:text-xl uppercase tracking-tighter mb-2">Escaneando Identidad AI</p>
                   <p className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Céntrate en el código QR del alumno</p>
                </div>
             </div>

             <button 
              onClick={() => setIsScanning(false)}
              className="absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all font-black z-10"
             >
                ✕
             </button>

             <div className="absolute bottom-8 left-4 right-4 flex justify-center">
                <div className="px-6 py-4 md:px-8 md:py-4 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-3 md:gap-4">
                   <Users size={16} md:size={20} className="text-[#4ADE80]" />
                   <span className="text-white text-sm md:text-lg font-black uppercase tracking-tighter">{presentCount} / {mockAlumnos.length} ALUMNOS REGISTRADOS</span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>

      {/* Floating Little Tech Assistant */}
      <LittleTech context="docente" />
    </div>
  );
}
