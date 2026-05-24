/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Users, 
  ChevronDown, 
  Eye, 
  TrendingUp, 
  Mic2, 
  CheckCircle2,
  MoreVertical,
  X,
  Zap,
  Plus,
  MessageCircle,
  Calendar,
  Clock,
  LayoutGrid,
  List as ListIcon,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext, Group } from '../context/AppContext';

// Reusing User interface concept from UsersMaster but simplified for context
interface Student {
  id: string;
  name: string;
  photo: string;
  performance: number;
  attendance: string;
  pronunciation: number;
  tasks: number;
  level?: string;
}

const mockStudents: Student[] = [
  { id: 'USR-304-Z11', name: 'Juan Pérez', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', performance: 92, attendance: '95%', pronunciation: 88, tasks: 12, level: 'A2' },
  { id: 'USR-221-C99', name: 'Sofía Méndez', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop', performance: 85, attendance: '82%', pronunciation: 75, tasks: 10, level: 'B1' },
];

const mockTeachers = [
  { id: 'USR-823-X92', name: 'Ana López', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { id: 'USR-901-B33', name: 'Luis Garcia', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
];

export function GroupManagement({ onTakeAttendance }: { onTakeAttendance?: (group: string) => void }) {
  const { currentRole, groups, addGroup, deleteGroup, updateGroup, setQuickChatUser } = useAppContext();
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  const [newGroup, setNewGroup] = useState<Partial<Group>>({
    name: '',
    level: 'A1 - Beginner',
    teacherId: '',
    studentIds: [],
    schedule: '08:00 - 10:00',
    time: '08:00 AM',
    days: ['LUN', 'MIÉ', 'VIE'],
    status: 'ACTIVE'
  });

  const filteredGroups = useMemo(() => {
    if (currentRole === 'DIRECTOR') return groups;
    if (currentRole === 'DOCENTE') return groups.filter(g => g.teacherId === 'USR-901-B33'); // In production, match current user ID
    if (currentRole === 'ALUMNO') return groups.filter(g => g.studentIds.includes('USR-304-Z11')); // Match student ID
    return [];
  }, [groups, currentRole]);

  const activeGroup = groups.find(g => g.id === selectedGroupId) || filteredGroups[0];

  const handleAddGroup = () => {
    if (newGroup.name && newGroup.teacherId) {
      addGroup({
        ...newGroup as Group,
        id: `GRP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
      });
      setShowAddModal(false);
      setNewGroup({
        name: '',
        level: 'A1 - Beginner',
        teacherId: '',
        studentIds: [],
        schedule: '08:00 - 10:00',
        time: '08:00 AM',
        days: ['LUN', 'MIÉ', 'VIE'],
        status: 'ACTIVE'
      });
    }
  };

  const levels = ['A1 - Beginner', 'A2 - Pre-Int', 'B1 - Intermediate', 'B2 - Upper-Int', 'C1 - Advanced'];

  if (currentRole === 'ALUMNO' && activeGroup) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-center md:text-left">Identidad Estudiantil</h2>
          <h1 className="text-3xl md:text-4xl font-black text-white bevel-text uppercase tracking-tight text-center md:text-left">Mi Grupo Académico</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <GlassCard accent="cyan" className="!p-10">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 rounded-[2rem] bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 flex items-center justify-center text-[#DEFF9A] shadow-[0_0_30px_rgba(222,255,154,0.15)]">
                   <Users size={48} />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{activeGroup.name}</h3>
                   <span className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em] block mt-2">{activeGroup.level}</span>
                </div>

                <div className="flex gap-4 w-full pt-6 border-t border-white/10">
                   <div className="flex-1 text-center">
                      <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Horario</p>
                      <p className="text-white text-xs font-bold uppercase">{activeGroup.schedule}</p>
                   </div>
                   <div className="flex-1 text-center">
                      <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Días</p>
                      <p className="text-white text-xs font-bold uppercase">{activeGroup.days.join(', ')}</p>
                   </div>
                </div>
              </div>
           </GlassCard>

           <GlassCard accent="green" className="!p-10">
              <div className="space-y-8">
                 <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Mi Profesor</h4>
                 <div className="flex items-center gap-6">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" className="w-20 h-20 rounded-full border-2 border-[#DEFF9A]" alt="" />
                    <div className="space-y-1">
                       <h5 className="text-xl font-black text-white uppercase">Luis Garcia</h5>
                       <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Docente Certificado ADN</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setQuickChatUser({ id: activeGroup.teacherId, name: 'Luis Garcia' })}
                  className="w-full py-4 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#DEFF9A] hover:text-black transition-all"
                 >
                    Enviar Mensaje Directo
                 </button>
              </div>
           </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${currentRole === 'DIRECTOR' ? 'text-[#DEFF9A]' : 'text-[#4ADE80]'}`}>
            {currentRole === 'DIRECTOR' ? 'Control de Estructura' : 'Operación Académica'}
          </h2>
          <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Gestión de Grupos</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {currentRole === 'DIRECTOR' && (
             <button 
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 bg-[#DEFF9A] text-[#061a1a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(222,255,154,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
             >
                <Plus size={16} /> Crear Nuevo Grupo
             </button>
           )}
           
           <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1">
              <button 
                onClick={() => setViewMode('GRID')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-[#DEFF9A] text-black shadow-lg' : 'text-white/20 hover:text-white'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('LIST')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-[#DEFF9A] text-black shadow-lg' : 'text-white/20 hover:text-white'}`}
              >
                <ListIcon size={16} />
              </button>
           </div>

           <div className="relative">
              <select 
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className={`appearance-none bg-white/5 border border-white/10 rounded-2xl px-8 py-3 pr-12 text-xs font-black uppercase tracking-widest focus:outline-none cursor-pointer ${currentRole === 'DIRECTOR' ? 'text-[#DEFF9A]' : 'text-[#4ADE80]'}`}
              >
                {filteredGroups.map(g => <option key={g.id} value={g.id} className="bg-[#061a1a]">{g.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
           </div>
        </div>
      </header>

      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-12 gap-8">
          {/* Main Grid: Alumnos (8 Cols) */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockStudents.map((student) => (
                <motion.div
                  key={student.id}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-[#4ADE80]/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                        <img src={student.photo} className="w-16 h-16 rounded-full border-2 border-[#4ADE80]/20 p-1 group-hover:border-[#4ADE80]/50 transition-colors object-cover" alt="" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#4ADE80] rounded-full flex items-center justify-center text-[10px] text-[#061a1a] font-black border-2 border-[#061a1a]">
                          {student.performance}%
                        </div>
                        
                        {student.performance >= 90 && (
                          <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#FBBF24] rounded-lg rotate-12 flex items-center justify-center text-[#061a1a] shadow-[0_0_15px_rgba(251,191,36,0.5)] border border-[#DEFF9A]/30">
                            <Zap size={14} fill="currentColor" />
                          </div>
                        )}
                    </div>
                    <button 
                      onClick={() => setQuickChatUser({ id: student.id, name: student.name })}
                      className="p-2 text-white/20 hover:text-[#DEFF9A] transition-colors"
                    >
                        <MessageCircle size={16} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-white text-lg font-bold tracking-tight uppercase">{student.name}</h4>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">{student.id}</p>
                    <div className="mt-2 text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest bg-[#DEFF9A]/5 inline-block px-2 py-1 rounded">Nivel {student.level}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-6 border-t border-white/5">
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="flex-1 bg-[#4ADE80]/10 hover:bg-[#4ADE80] text-[#4ADE80] hover:text-[#061a1a] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={14} /> Expendiente ADN
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {mockStudents.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4">
                   <Users size={48} className="mx-auto text-white/10" />
                   <p className="text-white/40 uppercase font-black text-xs tracking-widest">Sin alumnos asignados a este grupo</p>
                </div>
              )}
            </div>
          </div>

          {/* Info del Grupo (4 Cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <GlassCard title="Estatus de Grupo" icon={Users} accent={currentRole === 'DIRECTOR' ? 'cyan' : 'green'}>
              <div className="space-y-6">
                  {currentRole === 'DIRECTOR' && (
                    <div className="flex items-center gap-4 mb-4">
                       <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                          <ShieldCheck size={14} className="text-[#DEFF9A]" /> Editar Grupo
                       </button>
                       <button 
                        onClick={() => {
                          if (activeGroup) {
                            // In a real app we'd trigger a broadcast modal
                            alert(`Enviando broadcast al grupo: ${activeGroup.name}`);
                          }
                        }}
                        className="p-3 bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 rounded-2xl text-[#DEFF9A] hover:bg-[#DEFF9A] hover:text-black transition-all"
                       >
                          <MessageCircle size={18} />
                       </button>
                    </div>
                  )}

                  <div className="p-6 rounded-3xl bg-black/20 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Asistencia Semanal</span>
                        <span className="text-[#4ADE80] text-sm font-black">92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#4ADE80] shadow-[0_0_10px_#4ADE80]" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-black/20 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Pronunciación (AI)</span>
                        <span className="text-[#DEFF9A] text-sm font-black">8.4 / 10</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]" style={{ width: '84%' }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center space-y-2">
                        <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Alumnos</p>
                        <p className="text-2xl font-black text-white">{activeGroup?.studentIds.length || 0}</p>
                     </div>
                     <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center space-y-2">
                        <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Nivel IA</p>
                        <p className="text-lg font-black text-[#DEFF9A]">{activeGroup?.level.split(' ')[0]}</p>
                     </div>
                  </div>
              </div>
            </GlassCard>

            <GlassCard title="Insights Analíticos" icon={TrendingUp} accent="cyan">
              <p className="text-white/60 text-[11px] leading-relaxed italic">
                {activeGroup ? (
                   `"El Grupo ${activeGroup.name} muestra una tendencia positiva en el módulo de 'PPD Control'. Se recomienda intensificar prácticas de Listening para cerrar la brecha de pronunciación detectada por la IA."`
                ) : (
                   "Selecciona un grupo para ver el análisis de la IA."
                )}
              </p>
            </GlassCard>
          </div>
        </div>
      ) : (
        <GlassCard className="!p-0 overflow-hidden" accent="green">
           <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-white/5">
                 <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Nombre del Grupo</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Nivel / ADN</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Docente</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Alumnos</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Horario</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Acciones</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {filteredGroups.map(group => (
                    <tr key={group.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 flex items-center justify-center text-[#DEFF9A]">
                                <Users size={14} />
                             </div>
                             <span className="text-white font-bold group-hover:text-[#DEFF9A] transition-colors">{group.name}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 text-[#DEFF9A] rounded-lg">{group.level}</span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-white/10" />
                             <span className="text-white/60 text-xs font-medium">Docente ID: {group.teacherId}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-white font-black">{group.studentIds.length} Alumnos</span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <Clock size={12} className="text-white/20" />
                             <span className="text-white/40 text-[10px] font-bold uppercase">{group.schedule} ({group.days.join('')})</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <button onClick={() => setSelectedGroupId(group.id)} className="p-2 text-white/20 hover:text-white transition-colors">
                             <Eye size={16} />
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </GlassCard>
      )}

      {/* Student PDP Modal (Re-using original logic but keeping it updated) */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061a1a]/90 backdrop-blur-2xl p-8"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-4xl w-full neo-glass border-white/20 rounded-[3rem] p-12 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.5)]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-12 gap-12">
                <div className="col-span-12 md:col-span-4 text-center space-y-6">
                  <div className="relative inline-block">
                     <img src={selectedStudent.photo} className="w-48 h-48 rounded-full border-4 border-[#4ADE80]/40 p-2 object-cover" alt="" />
                     <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#4ADE80] text-[#061a1a] px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(74,222,128,0.4)]">
                        {selectedStudent.performance}% PPD
                     </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedStudent.name}</h3>
                    <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em] mt-2">{selectedStudent.id}</p>
                    <div className="mt-4 px-4 py-1.5 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-bold uppercase tracking-widest inline-block">
                       Nivel IA: {selectedStudent.level || 'A1'}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-8 space-y-12">
                   <div>
                      <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Mapeo Genético de Habilidades</h4>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <div className="flex justify-between items-end">
                               <div className="flex items-center gap-2 text-white/60">
                                  <Mic2 size={14} />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Speaking Accuracy</span>
                                </div>
                               <span className="text-xs font-black text-[#DEFF9A]">{selectedStudent.pronunciation}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-[#DEFF9A]" style={{ width: `${selectedStudent.pronunciation}%` }} />
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex justify-between items-end">
                               <div className="flex items-center gap-2 text-white/60">
                                  <Users size={14} />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Attendance consistency</span>
                               </div>
                               <span className="text-xs font-black text-[#4ADE80]">{selectedStudent.attendance}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-[#4ADE80]" style={{ width: selectedStudent.attendance }} />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
                      <h5 className="text-white text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                         <ShieldCheck size={16} className="text-[#DEFF9A]" /> Certificación Vigente
                      </h5>
                      <div className="flex gap-4">
                         <div className="flex-1 p-4 rounded-2xl bg-black/40 border border-white/5">
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Folios Completos</p>
                            <p className="text-xl font-black text-white">{selectedStudent.tasks}/15</p>
                         </div>
                         <div className="flex-1 p-4 rounded-2xl bg-black/40 border border-white/5">
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Status Global</p>
                            <p className="text-xl font-black text-[#DEFF9A]">AVANZADO</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex gap-4">
                      <button className="flex-1 py-4 bg-[#DEFF9A] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-[0_0_30px_rgba(222,255,154,0.3)] hover:brightness-110 transition-all">
                         Descargar Reporte ADN
                      </button>
                      <button 
                        onClick={() => {
                          setQuickChatUser({ id: selectedStudent.id, name: selectedStudent.name });
                          setSelectedStudent(null);
                        }}
                        className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all"
                      >
                        Contactar Alumno
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Group Modal (Director Only) */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full neo-glass border-white/20 rounded-[3rem] p-10 overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
                     <UserCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Crear Nueva Célula Grupal</h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Configuración Institucional de Grupos</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Nombre del Grupo</label>
                       <input 
                         type="text"
                         value={newGroup.name}
                         onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                         placeholder="Ej. Pioneers A1 - Evening"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50 placeholder:text-white/10"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Nivel Académico (Referencia ADN)</label>
                       <select 
                         value={newGroup.level}
                         onChange={e => setNewGroup({...newGroup, level: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50"
                       >
                          {levels.map(l => <option key={l} value={l} className="bg-[#061a1a]">{l}</option>)}
                       </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Asignar Docente</label>
                       <select 
                         value={newGroup.teacherId}
                         onChange={e => setNewGroup({...newGroup, teacherId: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50"
                       >
                          <option value="" className="bg-[#061a1a]">Seleccionar Docente...</option>
                          {mockTeachers.map(t => <option key={t.id} value={t.id} className="bg-[#061a1a]">{t.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Asignar Alumnos (ID List)</label>
                       <div className="relative">
                          <input 
                            type="text"
                            placeholder="Separar por comas (Ej. USR-001, USR-002)"
                            onChange={e => setNewGroup({...newGroup, studentIds: e.target.value.split(',').map(id => id.trim())})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50 placeholder:text-white/10 text-xs"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 space-y-6">
                     <h4 className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} className="text-[#DEFF9A]" /> Programación de Sesiones
                     </h4>
                     <div className="grid grid-cols-3 gap-3">
                        {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
                          <button
                            key={day}
                            onClick={() => {
                              const current = newGroup.days || [];
                              if (current.includes(day)) {
                                setNewGroup({...newGroup, days: current.filter(d => d !== day)});
                              } else {
                                setNewGroup({...newGroup, days: [...current, day]});
                              }
                            }}
                            className={`py-3 rounded-xl border text-[10px] font-black transition-all ${
                              newGroup.days?.includes(day)
                              ? 'bg-[#DEFF9A] border-[#DEFF9A] text-black shadow-lg shadow-[#DEFF9A]/20'
                              : 'bg-white/5 border-white/10 text-white/40'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-white/20 tracking-widest ml-1">Rango de Horario</label>
                          <input 
                            type="text"
                            placeholder="08:00 - 10:00 AM"
                            value={newGroup.schedule}
                            onChange={e => setNewGroup({...newGroup, schedule: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-white/20 tracking-widest ml-1">Duración (IA Suggestion)</label>
                          <div className="h-10 flex items-center px-4 bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 rounded-xl text-[10px] font-bold text-[#DEFF9A]">
                             2 Horas Pedagógicas
                          </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                    >
                      Descartar
                    </button>
                    <button 
                      onClick={handleAddGroup}
                      className="flex-[2] py-4 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.2)] hover:brightness-110 transition-all"
                    >
                      Establecer Grupo y Chat Automático
                    </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
