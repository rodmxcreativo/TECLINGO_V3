/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus,
  Mail,
  ShieldCheck,
  GraduationCap,
  Users,
  Settings2,
  X,
  ShieldAlert,
  Edit3,
  RefreshCw,
  UserCheck,
  UserX,
  Phone,
  Calendar,
  Zap,
  TrendingUp,
  BrainCircuit,
  Copy,
  Star,
  Lock,
  Map,
  Trash2,
  Eye,
  MessageSquare,
  BarChart3,
  MoreVertical,
  Key,
  Ban,
  Flame,
  AlertCircle,
  Clock,
  Sparkles,
  Hash,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../context/AppContext';
import { exportToExcel, exportToPDF } from '../lib/reports';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

type UserRole = 'DIRECTOR' | 'DOCENTE' | 'ALUMNO' | 'TUTOR' | 'SUPERADMIN';

export interface ADNResults {
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
  criticalPoint: string;
  dominantSkill: string;
  suggestedLevel: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface Subject {
  code: string;
  name: string;
  semester: number;
  hours: number;
  careerId?: string;
  careerName?: string;
}

export interface Career {
  id: string;
  name: string;
  code: string;
  limitHours: number;
  subjects: Subject[];
  grado_semestre?: number;
}

export interface User {
  id: string;
  controlNumber: string;
  curp: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  groups?: string[];
  capacity?: number;
  joinDate?: string;
  level?: string;
  progress?: number;
  nativeMatch?: number;
  photo?: string;
  adnResults?: ADNResults;
  attendancePercentage?: number;
  attendanceStreak?: number;
  attendanceHistory?: AttendanceRecord[];
  career?: string;
  module?: number;
  semester?: string;
  group?: string;
  registeredAt?: string;
  institutionId?: string;
  
  // Custom Docente credentials:
  cedula?: string;
  gradoAcademico?: string;
  disponibilidad?: string[];
  specialty?: string;
  horas_max_semanales?: number;
  horas_asignadas?: number;
  asignaturas_vinculadas?: Subject[];
}

const mockUsers: User[] = [
  { 
    id: 'USR-823-X92', 
    controlNumber: 'TEC-2024-001',
    curp: 'LOZA850101HDFLNR01',
    name: 'Ana López', 
    email: 'ana.lopez@tecnolingo.ai', 
    phone: '+52 833 456 7890',
    location: 'Campus Norte',
    role: 'DOCENTE', 
    status: 'ACTIVE', 
    groups: ['A1-102', 'C1-304'], 
    capacity: 5,
    joinDate: '12 ENE 2024',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    horas_max_semanales: 25,
    horas_asignadas: 12,
    specialty: 'Sistemas inteligentes',
    cedula: '12345678',
    gradoAcademico: 'Maestría',
    disponibilidad: ['Lunes-Matutino', 'Martes-Matutino', 'Miércoles-Matutino'],
    asignaturas_vinculadas: [
      { code: 'TEC-001', name: 'TecLingo AI (Inglés I)', semester: 1, hours: 4, careerId: 'isc', careerName: 'Ingeniería en Sistemas Computacionales' },
      { code: 'PRG-101', name: 'Fundamentos de Programación', semester: 1, hours: 8, careerId: 'isc', careerName: 'Ingeniería en Sistemas Computacionales' }
    ]
  },
  { 
    id: 'USR-102-Y84', 
    controlNumber: 'TEC-2023-045',
    curp: 'RODC801212HDFLNR02',
    name: 'Carlos Rodríguez', 
    email: 'c.rod@tecnolingo.ai', 
    phone: '+52 833 111 2222',
    location: 'Corporate HQ',
    role: 'DIRECTOR', 
    status: 'ACTIVE',
    joinDate: '01 DIC 2023',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  },
  { 
    id: 'USR-304-Z11', 
    controlNumber: 'TEC-2024-502',
    curp: 'PERJ950505HDFLNR03',
    name: 'Juan Pérez', 
    email: 'juan.p@student.ai', 
    phone: '+52 833 555 6666',
    location: 'Campus Sur',
    role: 'ALUMNO', 
    status: 'ACTIVE',
    joinDate: '15 MAR 2024',
    level: 'A2 - Pre-Intermediate',
    progress: 42,
    nativeMatch: 68,
    attendancePercentage: 92,
    attendanceStreak: 12,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    adnResults: {
      speaking: 65,
      listening: 85,
      reading: 70,
      writing: 60,
      criticalPoint: 'Speaking - Pronunciación',
      dominantSkill: 'Listening Comprehension',
      suggestedLevel: 'A2'
    },
    attendanceHistory: [
      { date: '2024-05-10', status: 'PRESENT' },
      { date: '2024-05-09', status: 'PRESENT' },
      { date: '2024-05-08', status: 'PRESENT' },
      { date: '2024-05-07', status: 'PRESENT' },
      { date: '2024-05-06', status: 'LATE' },
    ]
  },
  { 
    id: 'USR-221-C99', 
    controlNumber: 'TEC-2024-991',
    curp: 'MENS981010HDFLNR06',
    name: 'Sofía Méndez', 
    email: 's.mendez@student.ai', 
    phone: '+52 833 222 3333',
    location: 'Campus Sur',
    role: 'ALUMNO', 
    status: 'ACTIVE',
    joinDate: '10 ABR 2024',
    level: 'B1 - Intermediate',
    progress: 15,
    nativeMatch: 55,
    attendancePercentage: 65,
    attendanceStreak: 0,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
    attendanceHistory: [
      { date: '2024-05-10', status: 'ABSENT' },
      { date: '2024-05-09', status: 'ABSENT' },
      { date: '2024-05-08', status: 'ABSENT' },
    ]
  },
  { 
    id: 'USR-552-A12', 
    controlNumber: 'TEC-2024-882',
    curp: 'SILM900808HDFLNR04',
    name: 'Martha Silva', 
    email: 'm.silva@tutor.ai', 
    phone: '+52 833 999 8888',
    location: 'Hub Virtual',
    role: 'TUTOR', 
    status: 'ACTIVE',
    joinDate: '20 FEB 2024',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  },
  { 
    id: 'USR-901-B33', 
    controlNumber: 'TEC-2024-105',
    curp: 'GArL880404HDFLNR05',
    name: 'Luis Garcia', 
    email: 'l.garcia@tecnolingo.ai', 
    phone: '+52 833 777 4444',
    location: 'Campus Norte',
    role: 'DOCENTE', 
    status: 'ACTIVE', 
    groups: ['B2-201', 'A2-105', 'B1-101'], 
    capacity: 5,
    joinDate: '05 ENE 2024',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    horas_max_semanales: 30,
    horas_asignadas: 14,
    specialty: 'Gestión Curricular y Redes',
    cedula: '87654321',
    gradoAcademico: 'Doctorado',
    disponibilidad: ['Lunes-Matutino', 'Miércoles-Matutino', 'Viernes-Matutino', 'Martes-Vespertino', 'Jueves-Vespertino'],
    asignaturas_vinculadas: [
      { code: 'TEC-002', name: 'TecLingo AI (Inglés II)', semester: 2, hours: 4, careerId: 'isc', careerName: 'Ingeniería en Sistemas Computacionales' },
      { code: 'DB-203', name: 'Taller de Base de Datos', semester: 4, hours: 5, careerId: 'isc', careerName: 'Ingeniería en Sistemas Computacionales' },
      { code: 'NET-101', name: 'Redes de Computadoras', semester: 3, hours: 5, careerId: 'isc', careerName: 'Ingeniería en Sistemas Computacionales' }
    ]
  },
];

interface ModalProps {
  user: User;
  onClose: () => void;
  onUpdateRole: (role: UserRole) => void;
  onToggleStatus: () => void;
  onResetADN?: () => void;
  initialMode?: 'VIEW' | 'EDIT';
  onSaveUser?: (updated: User) => void;
  careers?: Career[];
}

export function UserHierarchyModal({ 
  user, 
  onClose, 
  onUpdateRole, 
  onToggleStatus, 
  onResetADN, 
  initialMode = 'VIEW',
  onSaveUser,
  careers
}: ModalProps) {
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>(initialMode);
  const [activeTab, setActiveTab] = useState<'DOISSIER' | 'ATTENDANCE'>('DOISSIER');
  const [editData, setEditData] = useState({ ...user });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const adnData = user.adnResults ? [
    { subject: 'Speaking', A: user.adnResults.speaking },
    { subject: 'Listening', A: user.adnResults.listening },
    { subject: 'Reading', A: user.adnResults.reading },
    { subject: 'Writing', A: user.adnResults.writing },
  ] : [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-[#061a1a]/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <GlassCard className="!p-0 h-full flex flex-col overflow-hidden border-[#DEFF9A]/20" accent="cyan">
          {/* Header */}
          <div className="p-8 border-b border-white/10 flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="relative">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-full border-2 border-[#DEFF9A] shadow-[0_0_20px_#DEFF9A40] object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-[#DEFF9A] flex items-center justify-center text-2xl font-black text-[#DEFF9A]">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#061a1a] ${user.status === 'ACTIVE' ? 'bg-[#DEFF9A]' : 'bg-red-500'}`} />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {mode === 'EDIT' ? (
                    <input 
                      type="text" 
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="text-3xl font-black text-white uppercase tracking-tight bg-transparent focus:outline-none border-b border-[#DEFF9A]/20"
                    />
                  ) : (
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{user.name}</h2>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'DIRECTOR' ? 'bg-purple-500 text-white' : 
                    user.role === 'DOCENTE' ? 'bg-[#DEFF9A] text-[#061a1a]' : 
                    'bg-[#38BDF8] text-white'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="opacity-50 font-mono">ID: {user.id}</span>
                    <button onClick={() => copyToClipboard(user.id)} className="hover:text-[#DEFF9A] transition-colors">
                      <Copy size={12} />
                    </button>
                  </div>
                  <span className="opacity-50">•</span>
                  <span className={user.status === 'ACTIVE' ? 'text-[#DEFF9A]' : 'text-red-500'}>{user.status}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl border border-white/10 text-white/30 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-8 border-b border-white/10 flex gap-8 bg-black/20">
            <button 
              onClick={() => setActiveTab('DOISSIER')}
              className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'DOISSIER' ? 'border-[#DEFF9A] text-[#DEFF9A]' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              Dossier Académico
            </button>
            <button 
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'ATTENDANCE' ? 'border-[#DEFF9A] text-[#DEFF9A]' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              Historial de Asistencia
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {activeTab === 'DOISSIER' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Personal Block */}
                <div className="space-y-4">
                  <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Datos Personales</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 relative group">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Mail size={10} /> Correo Institutional (Bloqueado)
                      </span>
                      <p className="text-white text-xs font-bold truncate opacity-60">{user.email}</p>
                      <Lock size={10} className="absolute top-4 right-4 text-white/10" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 relative group">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert size={10} /> CURP (Protegido)
                      </span>
                      <p className="text-white text-xs font-bold truncate opacity-60 font-mono tracking-tighter">{user.curp}</p>
                      <Lock size={10} className="absolute top-4 right-4 text-white/10" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Phone size={10} /> Teléfono
                      </span>
                      {mode === 'EDIT' ? (
                        <input 
                          type="text" 
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="bg-transparent text-white text-xs font-bold w-full focus:outline-none border-b border-[#DEFF9A]/20"
                        />
                      ) : (
                        <p className="text-white text-xs font-bold">{user.phone}</p>
                      )}
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 relative">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Hash size={10} /> No. Control
                      </span>
                      <p className="text-white text-xs font-bold font-mono">{user.controlNumber}</p>
                      <Lock size={10} className="absolute top-4 right-4 text-white/10" />
                    </div>
                  </div>
                </div>

                {/* Institutional Block */}
                <div className="space-y-4">
                  <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Trayectoria Académica ITSP</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <GraduationCap size={10} /> Carrera
                      </span>
                      {mode === 'EDIT' && (user.role === 'ALUMNO' || editData.role === 'ALUMNO') ? (
                        <select
                          value={editData.career || ''}
                          onChange={(e) => setEditData({ ...editData, career: e.target.value })}
                          className="bg-black/80 text-white text-xs font-bold w-full focus:outline-none border-b border-[#DEFF9A]/20 p-1 rounded"
                        >
                          {careers && careers.length > 0 ? (
                            careers.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))
                          ) : (
                            <>
                              <option value="Ingeniería en Sistemas Computacionales">Ingeniería en Sistemas Computacionales</option>
                              <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                              <option value="Ingeniería en Gestión Empresarial">Ingeniería en Gestión Empresarial</option>
                              <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                              <option value="Licenciatura en Administración">Licenciatura en Administración</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <p className="text-white text-xs font-bold truncate">{editData.career || user.career || 'No asignada'}</p>
                      )}
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={10} /> Ingreso Sistema
                      </span>
                      <p className="text-white text-xs font-bold">{user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'Pendiente'}</p>
                    </div>
                    <div className="col-span-2 grid grid-cols-3 gap-4">
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-center">
                          <span className="text-white/20 text-[8px] font-black uppercase">Módulo</span>
                          {mode === 'EDIT' ? (
                            <input 
                              type="number"
                              value={editData.module !== undefined ? editData.module : (user.module || '')}
                              onChange={(e) => setEditData({ ...editData, module: parseInt(e.target.value) || 0 })}
                              className="bg-transparent text-center text-[#DEFF9A] text-lg font-black w-full focus:outline-none border-b border-[#DEFF9A]/20"
                            />
                          ) : (
                            <p className="text-[#DEFF9A] text-lg font-black">{editData.module !== undefined ? editData.module : (user.module || '-')}</p>
                          )}
                       </div>
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-center">
                          <span className="text-white/20 text-[8px] font-black uppercase">Semestre</span>
                          {mode === 'EDIT' ? (
                            <select
                              value={editData.semester || '1'}
                              onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
                              className="bg-black/80 text-center text-cyan-400 text-lg font-black w-full focus:outline-none border-b border-[#DEFF9A]/20"
                            >
                              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-cyan-400 text-lg font-black">{editData.semester || user.semester || '-'}</p>
                          )}
                       </div>
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-center">
                          <span className="text-white/20 text-[8px] font-black uppercase">Grupo</span>
                          {mode === 'EDIT' ? (
                            <input 
                              type="text"
                              maxLength={3}
                              value={editData.group || ''}
                              onChange={(e) => setEditData({ ...editData, group: e.target.value.toUpperCase() })}
                              className="bg-transparent text-center text-white text-lg font-black w-full focus:outline-none border-b border-[#DEFF9A]/20 uppercase"
                            />
                          ) : (
                            <p className="text-white text-lg font-black">{editData.group || user.group || '-'}</p>
                          )}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Operational Block */}
                <div className="space-y-4">
                  <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Estatus Operativo</h4>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    {user.role === 'DOCENTE' ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                           <div>
                              {mode === 'EDIT' ? (
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={editData.capacity}
                                    onChange={(e) => setEditData({...editData, capacity: parseInt(e.target.value)})}
                                    className="text-white text-2xl font-black bg-transparent w-16 focus:outline-none border-b border-[#DEFF9A]/20"
                                  />
                                  <p className="text-white text-2xl font-black">Límite</p>
                                </div>
                              ) : (
                                <p className="text-white text-2xl font-black">{user.groups?.length || 0} / {user.capacity || 5}</p>
                              )}
                              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Carga de Grupos</p>
                           </div>
                           <div className="text-right">
                              <p className={`text-xl font-black ${ (user.groups?.length || 0) >= (user.capacity || 5) ? 'text-red-500' : 'text-[#DEFF9A]'}`}>
                                {Math.round(((user.groups?.length || 0) / (user.capacity || 5)) * 100)}%
                              </p>
                              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Ocupación</p>
                           </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${((user.groups?.length || 0) / (user.capacity || 5)) * 100}%` }}
                             className={`h-full rounded-full ${ (user.groups?.length || 0) >= (user.capacity || 5) ? 'bg-red-500' : 'bg-[#DEFF9A]'}`}
                           />
                        </div>
                      </div>
                    ) : user.role === 'ALUMNO' ? (
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#38BDF8]">
                               <TrendingUp size={16} />
                               <span className="text-xl font-black">{user.progress}%</span>
                            </div>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Avance Curricular</p>
                         </div>
                         <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#DEFF9A]">
                               <Zap size={16} fill="currentColor" />
                               <span className="text-xl font-black">{user.nativeMatch}%</span>
                            </div>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Native Match</p>
                         </div>
                      </div>
                    ) : (
                      <p className="text-white/20 text-xs italic font-medium">No se requiere monitoreo operativo para este rol.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {user.role === 'ALUMNO' && user.adnResults ? (
                  <div className="space-y-6">
                    <h4 className="text-[#38BDF8] text-[10px] font-black uppercase tracking-[0.4em]">Perfil Genético Académico (ADN Test)</h4>
                    
                    <div className="p-6 rounded-[2.5rem] bg-black/40 border border-[#38BDF8]/20 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[#38BDF8]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="h-[250px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={adnData}>
                            <PolarGrid stroke="#ffffff10" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 900 }} />
                            <Radar
                              name="ADN"
                              dataKey="A"
                              stroke="#38BDF8"
                              fill="#38BDF8"
                              fillOpacity={0.5}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[#38BDF8] text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                            <BrainCircuit size={10} /> Fortaleza
                          </span>
                          <p className="text-white text-[11px] font-black leading-tight">{user.adnResults.dominantSkill}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-orange-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert size={10} /> Punto Crítico
                          </span>
                          <p className="text-white text-[11px] font-black leading-tight">{user.adnResults.criticalPoint}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8]">
                        <div className="flex items-center gap-3">
                          <Star size={18} fill="currentColor" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Nivel Sugerido IA</p>
                            <p className="text-sm font-black">{user.adnResults.suggestedLevel}</p>
                          </div>
                        </div>
                        <button 
                          onClick={onResetADN}
                          className="p-2 hover:bg-[#38BDF8]/10 rounded-lg transition-colors"
                          title="Repetir Test"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center p-12 text-center space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/10">
                      <ShieldCheck size={40} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white text-lg font-black uppercase tracking-tight">Acceso Concedido</h4>
                      <p className="text-white/20 text-xs font-medium max-w-xs leading-relaxed">
                        Este usuario cuenta con privilegios {user.role === 'DIRECTOR' ? 'administrativos totales' : 'operativos verificados'}. No requiere perfil genético.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <GlassCard accent="green" className="!bg-white/[0.03]">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Racha de Asistencia</p>
                    <div className="flex items-center gap-3">
                      <Flame size={24} className="text-[#F59E0B]" fill="currentColor" />
                      <h3 className="text-3xl font-black text-white">{user.attendanceStreak || 0} DÍAS</h3>
                    </div>
                  </GlassCard>
                  <GlassCard accent="cyan" className="!bg-white/[0.03]">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Porcentaje Global</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-3xl font-black text-white">{user.attendancePercentage || 0}%</h3>
                       <span className="text-[#DEFF9A] text-[10px] font-bold">Óptimo</span>
                    </div>
                  </GlassCard>
                  <GlassCard accent="orange" className="!bg-white/[0.03]">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Inasistencias</p>
                    <h3 className="text-3xl font-black text-white">{user.attendanceHistory?.filter(r => r.status === 'ABSENT').length || 0} Sesiones</h3>
                  </GlassCard>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5">
                  <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Calendar size={16} className="text-[#DEFF9A]" />
                    Registro de Actividad Reciente
                  </h4>
                  <div className="space-y-3">
                    {user.attendanceHistory?.map((record, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#DEFF9A]/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                             record.status === 'PRESENT' ? 'bg-[#DEFF9A]' : 
                             record.status === 'ABSENT' ? 'bg-red-500' : 'bg-orange-500'
                          }`} />
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{record.date}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                           record.status === 'PRESENT' ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 
                           record.status === 'ABSENT' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                    {!user.attendanceHistory?.length && (
                      <p className="text-white/20 text-xs italic py-8 text-center">No hay registros de asistencia para este periodo.</p>
                    )}
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-[#DEFF9A]/5 border border-[#DEFF9A]/10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
                         <BarChart3 size={24} />
                      </div>
                      <div>
                         <h5 className="text-white text-sm font-black uppercase tracking-tight">Análisis de Permanencia</h5>
                         <p className="text-white/40 text-[10px] font-medium leading-relaxed">El alumno mantiene una puntualidad promedio del 92%. Se recomienda intervención del tutor para evitar rezago en Speaking.</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/10 bg-black/20 flex flex-wrap gap-4 relative">
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 bg-red-600 backdrop-blur-xl z-[110] flex items-center justify-between px-8"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <ShieldAlert size={24} className="text-white" />
                    <div>
                      <p className="text-white text-[10px] font-black uppercase tracking-widest">CONFIRMACIÓN VIP REQUERIDA</p>
                      <p className="text-white/80 text-[8px] font-bold">Ingresa contraseña de Director para eliminar a {user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none placeholder:text-white/30"
                    />
                    <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-white/10 text-white font-bold uppercase text-[9px] tracking-widest hover:bg-white/20 transition-colors">Cancelar</button>
                    <button onClick={() => { alert('Usuario eliminado de la comunidad.'); onClose(); }} className="px-6 py-2 rounded-lg bg-white text-red-600 font-black uppercase text-[9px] tracking-widest shadow-2xl hover:bg-red-50 transition-colors">Confirmar</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 mr-auto">
              {['DIRECTOR', 'DOCENTE', 'ALUMNO', 'TUTOR'].map(roleVal => (
                <button
                  key={roleVal}
                  onClick={() => onUpdateRole(roleVal as UserRole)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    user.role === roleVal 
                      ? 'bg-[#DEFF9A] border-[#DEFF9A] text-[#061a1a]' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                  }`}
                >
                  {roleVal}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all overflow-hidden relative group"
            >
              <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={onToggleStatus}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                user.status === 'ACTIVE' 
                  ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' 
                  : 'bg-[#DEFF9A]/10 border-[#DEFF9A]/30 text-[#DEFF9A] hover:bg-[#DEFF9A] hover:text-[#061a1a]'
              }`}
            >
              {user.status === 'ACTIVE' ? (
                <>
                  <UserX size={14} /> Suspender
                </>
              ) : (
                <>
                  <UserCheck size={14} /> Activar
                </>
              )}
            </button>
            
            {mode === 'VIEW' ? (
              <button 
                onClick={() => setMode('EDIT')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#061a1a] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all"
              >
                <Edit3 size={14} /> Editar Perfil
              </button>
            ) : (
              <button 
                onClick={() => { 
                  setMode('VIEW'); 
                  if (onSaveUser) onSaveUser(editData);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_#DEFF9A80]"
              >
                <ShieldCheck size={14} /> Guardar
              </button>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

export function UsersMaster() {
  const { setQuickChatUser, currentUser, logActivity } = useAppContext();
  const [filter, setFilter] = useState<UserRole | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT'>('VIEW');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Docentes Specific States:
  const [showAddDocenteModal, setShowAddDocenteModal] = useState(false);
  const [showAssignSubjectsModal, setShowAssignSubjectsModal] = useState(false);
  const [selectedDocenteForSubjects, setSelectedDocenteForSubjects] = useState<User | null>(null);
  const [assignedCareersList, setAssignedCareersList] = useState<Career[]>([]);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  
  // Hierarchical Selectors:
  const [selectedCareerId, setSelectedCareerId] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('');
  const [tempAssignedSubjects, setTempAssignedSubjects] = useState<Subject[]>([]);
  const [tempLimitHours, setTempLimitHours] = useState<number>(20);

  // Add Docente Form States:
  const [personalName, setPersonalName] = useState('');
  const [personalLastname, setPersonalLastname] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [personalCurp, setPersonalCurp] = useState('');
  const [personalPhoto, setPersonalPhoto] = useState('');
  const [gradoAcademico, setGradoAcademico] = useState('Licenciatura');
  const [cedula, setCedula] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [docenteStatus, setDocenteStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [newDocenteAvailability, setNewDocenteAvailability] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Add Alumno Form States:
  const [showAddAlumnoModal, setShowAddAlumnoModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentLastname, setStudentLastname] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCurp, setStudentCurp] = useState('');
  const [studentPhoto, setStudentPhoto] = useState('');
  const [studentCareer, setStudentCareer] = useState('');
  const [studentSemester, setStudentSemester] = useState('1');
  const [studentGroup, setStudentGroup] = useState('A');
  const [studentLevel, setStudentLevel] = useState('A1 - Beginner');
  const [studentStatus, setStudentStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');

  // Alumno Quick Group Link states:
  const [showLinkStudentModal, setShowLinkStudentModal] = useState(false);
  const [studentToLink, setStudentToLink] = useState<User | null>(null);
  const [linkStudentCareer, setLinkStudentCareer] = useState('');
  const [linkStudentSemester, setLinkStudentSemester] = useState('1');
  const [linkStudentGroup, setLinkStudentGroup] = useState('A');

  // Dynamic calculations for the Docente Monitor Panel
  const docentes = users.filter(u => u.role === 'DOCENTE');
  const totalMaxSelectedHours = docentes.reduce((acc, curr) => acc + (curr.horas_max_semanales || 20), 0);
  const totalAssignedSelectedHours = docentes.reduce((acc, curr) => acc + (curr.horas_asignadas || 0), 0);
  const calculatedCargaPromedio = totalMaxSelectedHours > 0 ? (totalAssignedSelectedHours / totalMaxSelectedHours) * 100 : 0;
  
  let dynamicIASuggestion = "Optimización sugerida: Rebalancear carga docente.";
  if (calculatedCargaPromedio > 85) {
    dynamicIASuggestion = "Sugerencia Inteligente IA: La plantilla docente está cerca del límite. Se recomienda contratar nuevos docentes o rebalancear asignaturas.";
  } else if (calculatedCargaPromedio < 40) {
    dynamicIASuggestion = "Sugerencia Inteligente IA: Carga sub-utilizada. Puede asignar más horas o asignaturas a la plantilla actual sin exceder límites.";
  } else {
    dynamicIASuggestion = "Sugerencia Inteligente IA: Estado óptimo. El balance general de horas asignadas y disponibles se encuentra en rangos saludables.";
  }

  // Load Career catalogs from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('library_careers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const unique: Career[] = [];
          const seen = new Set<string>();
          parsed.forEach((c: any) => {
            if (c && c.id && !seen.has(c.id)) {
              unique.push(c);
              seen.add(c.id);
            }
          });
          setAssignedCareersList(unique);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [showAssignSubjectsModal]);

  const handleCreateDocenteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!personalName.trim()) errors.name = 'El nombre es requerido';
    if (!personalLastname.trim()) errors.lastname = 'El apellido es requerido';
    if (!personalEmail.trim() || !/^\S+@\S+\.\S+$/.test(personalEmail)) errors.email = 'Correo electrónico inválido';
    if (!personalPhone.trim() || !/^\d{10}$/.test(personalPhone)) errors.phone = 'Teléfono debe tener 10 dígitos';
    if (!personalCurp.trim() || personalCurp.trim().length !== 18) errors.curp = 'CURP debe tener exactamente 18 caracteres';
    if (!cedula.trim()) errors.cedula = 'La cédula profesional es requerida';
    if (!specialty.trim()) errors.specialty = 'La especialidad es requerida';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Create unique control number
    const randomHex = Math.floor(Math.random() * 0xfff).toString(16).toUpperCase().padStart(3, '0');
    const controlNumber = `DOC-${new Date().getFullYear()}-${randomHex}`;

    const newDocente: User = {
      id: `USR-DOC-${Date.now()}`,
      controlNumber,
      name: `${personalName.trim()} ${personalLastname.trim()}`,
      email: personalEmail.trim().toLowerCase(),
      curp: personalCurp.trim().toUpperCase(),
      phone: personalPhone.trim(),
      role: 'DOCENTE',
      status: docenteStatus === 'ACTIVE' ? 'ACTIVE' : 'SUSPENDED', // mapped to User status
      photo: personalPhoto.trim() || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      institutionId: currentUser?.institutionId || 'teclingo-default',
      registeredAt: new Date().toISOString(),
      horas_max_semanales: 20, // default limit, can be customized in assignment
      horas_asignadas: 0,
      cedula: cedula.trim(),
      gradoAcademico,
      specialty: specialty.trim(),
      disponibilidad: newDocenteAvailability,
      asignaturas_vinculadas: []
    };

    await handleSaveUser(newDocente);
    setShowAddDocenteModal(false);
  };

  const handleCreateAlumnoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!studentName.trim()) errors.s_name = 'El nombre es requerido';
    if (!studentLastname.trim()) errors.s_lastname = 'El apellido es requerido';
    if (!studentEmail.trim() || !/^\S+@\S+\.\S+$/.test(studentEmail)) errors.s_email = 'Correo electrónico inválido';
    if (!studentPhone.trim() || !/^\d{10}$/.test(studentPhone)) errors.s_phone = 'Teléfono debe tener 10 dígitos';
    if (!studentCurp.trim() || studentCurp.trim().length !== 18) errors.s_curp = 'CURP debe tener exactamente 18 caracteres';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const randomHex = Math.floor(Math.random() * 0xfff).toString(16).toUpperCase().padStart(3, '0');
    const controlNumber = `ALU-${new Date().getFullYear()}-${randomHex}`;

    const newAlumno: User = {
      id: `USR-ALU-${Date.now()}`,
      controlNumber,
      curp: studentCurp.trim().toUpperCase(),
      name: `${studentName.trim()} ${studentLastname.trim()}`,
      email: studentEmail.trim().toLowerCase(),
      phone: studentPhone.trim(),
      role: 'ALUMNO',
      status: studentStatus,
      career: studentCareer || 'Ingeniería en Sistemas Computacionales',
      semester: studentSemester,
      group: studentGroup,
      level: studentLevel,
      progress: 0,
      nativeMatch: 0,
      attendancePercentage: 100,
      attendanceStreak: 0,
      attendanceHistory: [
        { date: new Date().toISOString().split('T')[0], status: 'PRESENT' }
      ],
      photo: studentPhoto.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      institutionId: currentUser?.institutionId || 'teclingo-default',
      registeredAt: new Date().toISOString(),
      adnResults: {
        speaking: 0,
        listening: 0,
        reading: 0,
        writing: 0,
        criticalPoint: 'No evaluado',
        dominantSkill: 'Ninguna',
        suggestedLevel: studentLevel.split(' - ')[0]
      }
    };

    await handleSaveUser(newAlumno);
    setShowAddAlumnoModal(false);
  };

  const handleLinkStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToLink) return;

    const updatedAlumno: User = {
      ...studentToLink,
      career: linkStudentCareer,
      semester: linkStudentSemester,
      group: linkStudentGroup
    };

    await handleSaveUser(updatedAlumno);
    setShowLinkStudentModal(false);
    setStudentToLink(null);
  };

  const handleAddSubjectToDocente = () => {
    if (!selectedCareerId || !selectedSubjectCode) return;
    const careerObj = assignedCareersList.find(c => c.id === selectedCareerId);
    if (!careerObj) return;
    const subjectObj = careerObj.subjects.find(s => s.code === selectedSubjectCode);
    if (!subjectObj) return;

    // Check if subject is already added in temp
    const exists = tempAssignedSubjects.some(s => s.code === selectedSubjectCode);
    if (exists) {
      alert("⚠️ Esta asignatura ya está vinculada a este docente.");
      return;
    }

    const updatedSubject: Subject = {
      ...subjectObj,
      careerId: selectedCareerId,
      careerName: careerObj.name
    };

    setTempAssignedSubjects(prev => [...prev, updatedSubject]);
    setSelectedSubjectCode('');
  };

  const handleRemoveSubjectFromDocenteTemp = (code: string) => {
    setTempAssignedSubjects(prev => prev.filter(s => s.code !== code));
  };

  const handleSaveSubjectsAssignSubmit = async () => {
    if (!selectedDocenteForSubjects) return;

    // Sum of hours in the new assignment
    const totalHours = tempAssignedSubjects.reduce((total, s) => total + (s.hours || 0), 0);

    const updatedDocenteObj: User = {
      ...selectedDocenteForSubjects,
      horas_max_semanales: tempLimitHours,
      horas_asignadas: totalHours,
      asignaturas_vinculadas: tempAssignedSubjects
    };

    await handleSaveUser(updatedDocenteObj);
    setShowAssignSubjectsModal(false);
    setSelectedDocenteForSubjects(null);
  };

  useEffect(() => {
    const instId = currentUser?.institutionId || 'teclingo-default';

    if (firebaseConfig.projectId === 'remixed-project-id') {
      // Local fallback mode
      const savedUsersList = localStorage.getItem('tecnolingo_users_list');
      if (savedUsersList) {
        try {
          setUsers(JSON.parse(savedUsersList));
          setLoading(false);
        } catch (e) {
          // ignore
        }
      } else {
        localStorage.setItem('tecnolingo_users_list', JSON.stringify(mockUsers));
        setUsers(mockUsers);
        setLoading(false);
      }

      const handleStorageChange = () => {
        const list = localStorage.getItem('tecnolingo_users_list');
        if (list) {
          try {
            setUsers(JSON.parse(list));
          } catch (e) {
            // ignore
          }
        }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }

    const q = query(
      collection(db, 'users'),
      where('institutionId', '==', instId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      if (usersList.length === 0) {
        // Retrieve from localStorage if any, otherwise fall back to mockUsers
        const savedUsersList = localStorage.getItem('tecnolingo_users_list');
        let initialList = mockUsers;
        if (savedUsersList) {
          try {
            initialList = JSON.parse(savedUsersList);
          } catch (e) {
            // use default mockUsers
          }
        }
        
        // Write the initial/saved users list to Firestore so they don't get wiped out!
        initialList.forEach(async (u) => {
          try {
            await setDoc(doc(db, 'users', u.id), {
              ...u,
              institutionId: instId
            });
          } catch (err) {
            console.error("Error bootstrapping user to Firestore:", err);
          }
        });
        
        setUsers(initialList);
        localStorage.setItem('tecnolingo_users_list', JSON.stringify(initialList));
      } else {
        setUsers(usersList);
        localStorage.setItem('tecnolingo_users_list', JSON.stringify(usersList));
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore loading error, falling back to local storage:", error);
      const savedUsersList = localStorage.getItem('tecnolingo_users_list');
      if (savedUsersList) {
        try {
          setUsers(JSON.parse(savedUsersList));
        } catch (e) {
          setUsers(mockUsers);
        }
      } else {
        setUsers(mockUsers);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser?.institutionId]);

  const handleSaveUser = async (updatedUser: User) => {
    setUsers(prev => {
      const exists = prev.some(u => u.id === updatedUser.id);
      const newList = exists 
        ? prev.map(u => u.id === updatedUser.id ? updatedUser : u)
        : [...prev, updatedUser];
      localStorage.setItem('tecnolingo_users_list', JSON.stringify(newList));
      return newList;
    });

    if (firebaseConfig.projectId !== 'remixed-project-id') {
      try {
        await setDoc(doc(db, 'users', updatedUser.id), updatedUser);
      } catch (e) {
        console.error("Failed to save user in Firestore:", e);
      }
    }

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('DOCENTE_ACTUALIZADO', { detail: updatedUser }));
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers(prev => {
      const newList = prev.filter(u => u.id !== userId);
      localStorage.setItem('tecnolingo_users_list', JSON.stringify(newList));
      return newList;
    });

    if (firebaseConfig.projectId !== 'remixed-project-id') {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (e) {
        console.error("Failed to delete user from Firestore:", e);
      }
    }

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('DOCENTE_ACTUALIZADO', { detail: { id: userId, deleted: true } }));
  };

  const filteredUsers = users.filter(user => {
    if (user.role?.toUpperCase() === 'DIRECTOR') return false;
    const matchesRole = filter === 'ALL' || user.role?.toUpperCase() === filter.toUpperCase();
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || 
                          user.email?.toLowerCase().includes(search.toLowerCase()) ||
                          user.controlNumber?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const stats = {
    total: users.length,
    alumnos: users.filter(u => u.role === 'ALUMNO').length,
    docentes: users.filter(u => u.role === 'DOCENTE').length,
    newEntries: users.filter(u => {
      if (!u.registeredAt) return false;
      const regDate = new Date(u.registeredAt);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return regDate > yesterday;
    }).length
  };

  const handleOpenUser = (user: User, mode: 'VIEW' | 'EDIT' = 'VIEW') => {
    setSelectedUser(user);
    setModalMode(mode);
  };

  const handleExport = async (format: 'EXCEL' | 'PDF') => {
    const dataToExport = filteredUsers.map(u => ({
      name: u.name,
      controlNumber: u.controlNumber || 'S/N',
      curp: u.curp || 'S/N',
      career: u.career || 'N/A',
      semester: u.semester || 'N/A',
      group: u.group || 'N/A',
      module: String(u.module || 'N/A'),
      registeredAt: u.registeredAt || '',
      status: u.status
    }));

    const title = `Reporte de Inscritos - ${filter === 'ALL' ? 'General' : filter}`;
    
    if (format === 'EXCEL') {
      await exportToExcel(dataToExport, title);
    } else {
      exportToPDF(dataToExport, title, currentUser?.institutionId || 'Tecnolingo AI');
    }

    await logActivity('REPORT_GENERATION', { 
      format, 
      filter, 
      count: dataToExport.length,
      institutionId: currentUser?.institutionId 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Comunidad Tecnolingo</h2>
          <h1 className="text-3xl font-bold tracking-tight text-white bevel-text uppercase">Control de Jerarquía</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
             <button 
               onClick={() => handleExport('EXCEL')}
               className="p-3 hover:bg-[#DEFF9A]/20 text-white/40 hover:text-[#DEFF9A] transition-all rounded-xl"
               title="Exportar Excel"
             >
                <FileSpreadsheet size={18} />
             </button>
             <button 
               onClick={() => handleExport('PDF')}
               className="p-3 hover:bg-cyan-400/20 text-white/40 hover:text-cyan-400 transition-all rounded-xl"
               title="Exportar PDF"
             >
                <FileText size={18} />
             </button>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
                <p className="text-[#DEFF9A] text-2xl font-black">{stats.alumnos}</p>
                <p className="text-white/20 text-[8px] font-bold uppercase">Total Alumnos</p>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div className="text-right">
                <p className="text-cyan-400 text-2xl font-black">{stats.docentes}</p>
                <p className="text-white/20 text-[8px] font-bold uppercase">Total Docentes</p>
             </div>
             {stats.newEntries > 0 && (
                <>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-right flex flex-col items-end">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                        <p className="text-orange-400 text-2xl font-black">{stats.newEntries}</p>
                     </div>
                     <p className="text-white/20 text-[8px] font-bold uppercase">Nuevos (24h)</p>
                  </div>
                </>
             )}
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#DEFF9A] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/40 w-full md:w-60 transition-all backdrop-blur-xl"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {[
            { label: 'Todos', value: 'ALL', icon: Users },
            { label: 'Docentes', value: 'DOCENTE', icon: GraduationCap },
            { label: 'Alumnos', value: 'ALUMNO', icon: UserPlus },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                filter === btn.value 
                  ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/30 text-[#DEFF9A] shadow-[0_0_15px_#DEFF9A15]' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
              }`}
            >
              <btn.icon size={14} />
              {btn.label}
            </button>
          ))}
        </div>

        {filter === 'DOCENTE' && (
          <button
            onClick={() => {
              setPersonalName('');
              setPersonalLastname('');
              setPersonalEmail('');
              setPersonalPhone('');
              setPersonalCurp('');
              setPersonalPhoto('');
              setSpecialty('');
              setGradoAcademico('Licenciatura');
              setCedula('');
              setDocenteStatus('ACTIVE');
              setNewDocenteAvailability([]);
              setShowAddDocenteModal(true);
            }}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(222,255,154,0.3)] self-end sm:self-auto"
          >
            <UserPlus size={14} />
            Nuevo Docente
          </button>
        )}

        {filter === 'ALUMNO' && (
          <button
            onClick={() => {
              setStudentName('');
              setStudentLastname('');
              setStudentEmail('');
              setStudentPhone('');
              setStudentCurp('');
              setStudentPhoto('');
              setStudentCareer(assignedCareersList[0]?.name || 'Ingeniería en Sistemas Computacionales');
              setStudentSemester('1');
              setStudentGroup('A');
              setStudentLevel('A1 - Beginner');
              setStudentStatus('ACTIVE');
              setShowAddAlumnoModal(true);
            }}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-[#38BDF8] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] self-end sm:self-auto"
          >
            <UserPlus size={14} />
            Nuevo Alumno
          </button>
        )}
      </div>

      <GlassCard className="!p-0 overflow-hidden" accent={filter === 'DOCENTE' ? 'green' : 'cyan'}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/5">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Usuario</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Rol</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Estado</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Carga / Avance</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Asistencia</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  onClick={() => handleOpenUser(user)}
                  className="group hover:bg-[#DEFF9A]/05 transition-colors cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {user.photo ? (
                          <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-2xl border border-white/10 object-cover group-hover:border-[#DEFF9A]/40 transition-all" />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#DEFF9A] font-bold group-hover:border-[#DEFF9A]/40 transition-all">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        {(user.registeredAt && new Date(user.registeredAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)) && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DEFF9A] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]"></span>
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold tracking-tight group-hover:text-[#DEFF9A] transition-colors flex items-center gap-2">
                          {user.name}
                          {(user.registeredAt && new Date(user.registeredAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)) && (
                            <span className="text-[#DEFF9A] text-[8px] font-black italic tracking-tighter">NEW</span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail size={10} className="text-white/20" />
                          <p className="text-white/30 text-[10px] font-medium font-mono">{user.controlNumber}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                      user.role === 'DIRECTOR' ? 'text-purple-400 bg-purple-400/5 border-purple-400/10' :
                      user.role === 'DOCENTE' ? 'text-[#DEFF9A] bg-[#DEFF9A]/5 border-[#DEFF9A]/10' :
                      'text-[#38BDF8] bg-[#38BDF8]/5 border-[#38BDF8]/10'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-[#DEFF9A] shadow-[0_0_8px_#DEFF9A]' : 'bg-red-500'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${user.status === 'ACTIVE' ? 'text-white/60' : 'text-red-500/80'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {user.role === 'DOCENTE' ? (
                      <div className="w-40 space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-wider text-white/40">
                          <span>{user.horas_asignadas || 0} / {user.horas_max_semanales || 20} HRS</span>
                          <span className={(user.horas_asignadas || 0) >= (user.horas_max_semanales || 20) ? 'text-orange-400' : 'text-[#DEFF9A]'}>
                            {Math.round(((user.horas_asignadas || 0) / (user.horas_max_semanales || 20)) * 100)}%
                          </span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              (user.horas_asignadas || 0) >= (user.horas_max_semanales || 20) ? 'bg-orange-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#DEFF9A]'
                            }`}
                            style={{ width: `${Math.min(100, (((user.horas_asignadas || 0) / (user.horas_max_semanales || 20)) * 100))}%` }}
                          />
                        </div>
                        {user.asignaturas_vinculadas && user.asignaturas_vinculadas.length > 0 && (
                          <p className="text-[7px] text-white/30 truncate max-w-[150px] uppercase leading-tight mt-1">
                            {user.asignaturas_vinculadas.map(a => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                    ) : user.role === 'ALUMNO' && user.progress !== undefined ? (
                      <div className="w-40 space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-wider text-white/40">
                          <span>AVANCE CURRICULAR</span>
                          <span className="text-[#38BDF8]">{user.progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-[#38BDF8] transition-all duration-1000 shadow-[0_0_10px_#38BDF8]"
                            style={{ width: `${user.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/20 text-[10px] uppercase font-bold italic tracking-tighter">N/A</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {user.role === 'ALUMNO' && user.attendancePercentage !== undefined ? (
                      <div className="flex items-center gap-3">
                         <div className="relative w-10 h-10">
                            <svg className="w-full h-full transform -rotate-90">
                               <circle
                                  cx="20"
                                  cy="20"
                                  r="16"
                                  fill="transparent"
                                  stroke="rgba(255,255,255,0.05)"
                                  strokeWidth="3"
                               />
                               <circle
                                  cx="20"
                                  cy="20"
                                  r="16"
                                  fill="transparent"
                                  stroke={user.attendancePercentage > 85 ? "#DEFF9A" : "#ef4444"}
                                  strokeWidth="3"
                                  strokeDasharray={2 * Math.PI * 16}
                                  strokeDashoffset={2 * Math.PI * 16 * (1 - user.attendancePercentage / 100)}
                                  strokeLinecap="round"
                               />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                               <span className="text-[8px] font-black text-white">{user.attendancePercentage}%</span>
                            </div>
                         </div>
                         {user.attendancePercentage < 80 && (
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse" title="RIESGO DE DESERCIÓN">
                               <AlertCircle size={14} />
                            </div>
                         )}
                      </div>
                    ) : (
                      <span className="text-white/10 italic text-[10px]">N/A</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'DOCENTE' && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedDocenteForSubjects(user);
                            setTempAssignedSubjects(user.asignaturas_vinculadas || []);
                            setTempLimitHours(user.horas_max_semanales || 20);
                            setSelectedCareerId('');
                            setSelectedSubjectCode('');
                            setShowAssignSubjectsModal(true); 
                          }}
                          title="Asignar Materias" 
                          className="p-2 rounded-xl border border-white/5 text-white/35 hover:text-[#DEFF9A] hover:bg-[#DEFF9A]/10 hover:border-[#DEFF9A]/30 transition-all"
                        >
                          <BookOpen size={14} />
                        </button>
                      )}
                      {user.role === 'ALUMNO' && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setStudentToLink(user);
                            setLinkStudentCareer(user.career || (assignedCareersList[0]?.name || 'Ingeniería en Sistemas Computacionales'));
                            setLinkStudentSemester(user.semester || '1');
                            setLinkStudentGroup(user.group || 'A');
                            setShowLinkStudentModal(true);
                          }}
                          title="Vincular a Carrera y Grupo" 
                          className="p-2 rounded-xl border border-white/5 text-white/35 hover:text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]/30 transition-all"
                        >
                          <Users size={14} className="text-[#38BDF8]" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenUser(user, 'VIEW'); }}
                        title="Ver Expediente" 
                        className="p-2 rounded-xl border border-white/5 text-white/30 hover:text-[#DEFF9A] hover:bg-[#DEFF9A]/10 hover:border-[#DEFF9A]/30 transition-all"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setQuickChatUser(user);
                        }}
                        title="Enviar Mensaje"
                        className="p-2 rounded-xl border border-white/5 text-white/30 hover:text-[#DEFF9A] hover:bg-[#DEFF9A]/10 hover:border-[#DEFF9A]/30 transition-all"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenUser(user, 'EDIT'); }}
                        title="Editar Jerarquía"
                        className="p-2 rounded-xl border border-white/5 text-white/30 hover:text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]/30 transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      {deletingUserId === user.id ? (
                        <div className="flex items-center gap-1 bg-red-950/40 p-1 border border-red-500/20 rounded-xl">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleDeleteUser(user.id);
                              setDeletingUserId(null);
                            }}
                            title="Confirmar baja"
                            className="bg-red-500 hover:bg-red-600 text-[8px] text-white font-black uppercase px-2 py-1 rounded-lg transition-colors"
                          >
                            Baja
                          </button>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setDeletingUserId(null);
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[8px] font-bold uppercase px-2 py-1 rounded-lg transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setDeletingUserId(user.id);
                          }}
                          title="Eliminar Usuario"
                          className="p-2 rounded-xl border border-white/5 text-white/30 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <AnimatePresence>
        {selectedUser && (
          <UserHierarchyModal 
            user={selectedUser} 
            initialMode={modalMode}
            onClose={() => setSelectedUser(null)}
            onUpdateRole={async (newRole) => {
              if (selectedUser) {
                const updated = { ...selectedUser, role: newRole };
                setSelectedUser(updated);
                await handleSaveUser(updated);
              }
            }}
            onToggleStatus={async () => {
              if (selectedUser) {
                const newStatus = selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                const updated = { ...selectedUser, status: newStatus as 'ACTIVE' | 'SUSPENDED' };
                setSelectedUser(updated);
                await handleSaveUser(updated);
              }
            }}
            onResetADN={() => {
              console.log('Resetting ADN for:', selectedUser?.id);
            }}
            onSaveUser={async (updatedUser) => {
              setSelectedUser(updatedUser);
              await handleSaveUser(updatedUser);
            }}
            careers={assignedCareersList}
          />
        )}
      </AnimatePresence>

      {/* Docente Specific Monitor - Real Calculations */}
      {filter === 'DOCENTE' && (
        <div className="grid grid-cols-12 gap-6 mt-8">
          <GlassCard className="col-span-12 lg:col-span-12" title="Monitor de Carga Docente" icon={BarChart3} accent="green">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
                <div className="space-y-2">
                   <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em]">Carga Promedio de Plantilla</p>
                   <p className="text-3xl font-black text-[#DEFF9A] bevel-text tracking-tighter">
                     {totalMaxSelectedHours > 0 ? Math.round((totalAssignedSelectedHours / totalMaxSelectedHours) * 100) : 0}%
                   </p>
                   <p className="text-[8px] text-white/20 font-mono">({totalAssignedSelectedHours} de {totalMaxSelectedHours} horas totales máx)</p>
                </div>
                <div className="space-y-2">
                   <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em]">Disponibilidad Total</p>
                   <p className="text-3xl font-black text-[#4ADE80] bevel-text tracking-tighter">
                     {calculatedCargaPromedio > 100 ? 0 : Math.max(0, totalMaxSelectedHours - totalAssignedSelectedHours)} HORAS
                   </p>
                   <p className="text-[8px] text-white/20 font-mono">({docentes.length} Docentes registrados)</p>
                </div>
                <div className="space-y-2">
                   <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em]">Sugerencia IA / Planificación</p>
                   <p className="text-[10px] text-white/80 leading-relaxed italic">{dynamicIASuggestion}</p>
                </div>
             </div>
          </GlassCard>
        </div>
      )}

      {/* ADD DOCENTE MODAL */}
      <AnimatePresence>
        {showAddDocenteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#0b1f1f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-black uppercase tracking-wider">Registrar Nuevo Docente</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-normal">Agregar perfil profesional a la comunidad académica Teclingo</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowAddDocenteModal(false); setFormErrors({}); }}
                  className="p-2 rounded-xl border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCreateDocenteSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal details card */}
                  <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Datos Personales</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Nombre *</label>
                        <input 
                          type="text"
                          required
                          placeholder="Alberto"
                          value={personalName}
                          onChange={(e) => setPersonalName(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/40 transition-colors"
                        />
                        {formErrors.name && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.name}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Apellidos *</label>
                        <input 
                          type="text"
                          required
                          placeholder="Camacho"
                          value={personalLastname}
                          onChange={(e) => setPersonalLastname(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/40 transition-colors"
                        />
                        {formErrors.lastname && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.lastname}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Correo Electrónico *</label>
                      <input 
                        type="email"
                        required
                        placeholder="alberto.camacho@tecnolingo.ai"
                        value={personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/40 transition-colors"
                      />
                      {formErrors.email && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Teléfono (10 dígs) *</label>
                        <input 
                          type="tel"
                          required
                          placeholder="8331234567"
                          value={personalPhone}
                          onChange={(e) => setPersonalPhone(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/40 transition-colors"
                        />
                        {formErrors.phone && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.phone}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">CURP / ID Oficial (18 chars) *</label>
                        <input 
                          type="text"
                          maxLength={18}
                          required
                          placeholder="CAMA850101HDFLNR01"
                          value={personalCurp}
                          onChange={(e) => setPersonalCurp(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors font-mono uppercase"
                        />
                        {formErrors.curp && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.curp}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Foto de Perfil (Dirección URL / Opcional)</label>
                      <input 
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={personalPhoto}
                        onChange={(e) => setPersonalPhoto(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Professional details card */}
                  <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Datos Profesionales & Jerarquía</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Grado Académico</label>
                        <select
                          value={gradoAcademico}
                          onChange={(e) => setGradoAcademico(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400/40 transition-colors active:bg-black/80"
                        >
                          <option value="Licenciatura">Licenciatura</option>
                          <option value="Maestría">Maestría</option>
                          <option value="Doctorado">Doctorado</option>
                          <option value="Especialidad">Especialidad</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">No. Cédula Profesional *</label>
                        <input 
                          type="text"
                          required
                          placeholder="12345678"
                          value={cedula}
                          onChange={(e) => setCedula(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/40 transition-colors font-mono"
                        />
                        {formErrors.cedula && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.cedula}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Especialidad Temática *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Lingüística Aplicada, Inteligencia Artificial, etc."
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                      />
                      {formErrors.specialty && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.specialty}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Estado Inicial</label>
                        <select
                          value={docenteStatus}
                          onChange={(e) => setDocenteStatus(e.target.value as any)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400/40 transition-colors"
                        >
                          <option value="ACTIVE">Activo</option>
                          <option value="SUSPENDED">Inactivo / Licencia</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Rol de Comunidad</label>
                        <button
                          type="button"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#DEFF9A] text-left font-bold cursor-not-allowed uppercase text-[9px] tracking-wider"
                        >
                          🎓 DOCENTE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HORARY DISPONIBILITY INTERACTIVE BOX */}
                <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">Matriz de Disponibilidad Horaria</h4>
                      <p className="text-white/30 text-[8px] uppercase tracking-wider font-bold">Selecciona las franjas horarias activas de Lunes a Viernes</p>
                    </div>
                    {newDocenteAvailability.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setNewDocenteAvailability([])}
                        className="text-[#ef4444] text-[8px] font-black uppercase tracking-widest hover:underline"
                      >
                        Limpiar Todo ({newDocenteAvailability.length})
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => (
                      <div key={day} className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-normal text-white/60 block text-center mb-1 border-b border-white/5 pb-1">{day}</span>
                        {['Matutino', 'Vespertino', 'Nocturno'].map((slot) => {
                          const value = `${day}-${slot}`;
                          const isSelected = newDocenteAvailability.includes(value);
                          return (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => {
                                if (isSelected) {
                                  setNewDocenteAvailability(prev => prev.filter(v => v !== value));
                                } else {
                                  setNewDocenteAvailability(prev => [...prev, value]);
                                }
                              }}
                              className={`w-full py-2 rounded-lg text-[9px] font-bold uppercase transition-all block text-center border ${
                                isSelected 
                                  ? 'bg-[#DEFF9A]/20 border-[#DEFF9A] text-[#DEFF9A] shadow-[0_0_10px_rgba(222,255,154,0.1)]' 
                                  : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10 hover:text-white'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              {/* Botones */}
              <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => { setShowAddDocenteModal(false); setFormErrors({}); }}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateDocenteSubmit}
                  className="px-8 py-3 rounded-2xl bg-[#DEFF9A] text-[#061a1a] text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_#DEFF9A80]"
                >
                  Adicionar Docente
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD ALUMNO MODAL */}
      <AnimatePresence>
        {showAddAlumnoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#09181f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-[#38BDF8]">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-black uppercase tracking-wider">Registrar Nuevo Alumno</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-normal">Agregar perfil de estudiante a la comunidad académica Teclingo</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowAddAlumnoModal(false); setFormErrors({}); }}
                  className="p-2 rounded-xl border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCreateAlumnoSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal details card */}
                  <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-[#38BDF8] text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Datos Personales</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Nombre *</label>
                        <input 
                          type="text"
                          required
                          placeholder="Felipe"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                        />
                        {formErrors.s_name && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.s_name}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Apellidos *</label>
                        <input 
                          type="text"
                          required
                          placeholder="Hernández"
                          value={studentLastname}
                          onChange={(e) => setStudentLastname(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                        />
                        {formErrors.s_lastname && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.s_lastname}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Correo Electrónico *</label>
                      <input 
                        type="email"
                        required
                        placeholder="felipe.h@student.ai"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                      />
                      {formErrors.s_email && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.s_email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Teléfono (10 dígs) *</label>
                        <input 
                          type="tel"
                          required
                          placeholder="8339876543"
                          value={studentPhone}
                          onChange={(e) => setStudentPhone(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                        />
                        {formErrors.s_phone && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.s_phone}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">CURP / ID Oficial (18 chars) *</label>
                        <input 
                          type="text"
                          maxLength={18}
                          required
                          placeholder="HERF020101HDFLNR01"
                          value={studentCurp}
                          onChange={(e) => setStudentCurp(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#38BDF8]/40 transition-colors font-mono uppercase"
                        />
                        {formErrors.s_curp && <p className="text-red-400 text-[8px] font-bold uppercase">{formErrors.s_curp}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Foto de Estudiante (Dirección URL / Opcional)</label>
                      <input 
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={studentPhoto}
                        onChange={(e) => setStudentPhoto(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Academic details card */}
                  <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Segmentación Académica</h4>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Carrera *</label>
                      <select
                        value={studentCareer}
                        onChange={(e) => setStudentCareer(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                      >
                        {assignedCareersList && assignedCareersList.length > 0 ? (
                          assignedCareersList.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="Ingeniería en Sistemas Computacionales">Ingeniería en Sistemas Computacionales</option>
                            <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                            <option value="Ingeniería en Gestión Empresarial">Ingeniería en Gestión Empresarial</option>
                            <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                            <option value="Licenciatura en Administración">Licenciatura en Administración</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Semestre *</label>
                        <select
                          value={studentSemester}
                          onChange={(e) => setStudentSemester(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                        >
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(sem => (
                            <option key={sem} value={sem}>{sem}° Semestre</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Grupo *</label>
                        <input 
                          type="text"
                          required
                          maxLength={3}
                          placeholder="A"
                          value={studentGroup}
                          onChange={(e) => setStudentGroup(e.target.value.toUpperCase())}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#38BDF8]/40 transition-colors uppercase font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Nivel de Inglés Inicial</label>
                        <select
                          value={studentLevel}
                          onChange={(e) => setStudentLevel(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                        >
                          <option value="A1 - Beginner">A1 - Beginner</option>
                          <option value="A2 - Pre-Intermediate">A2 - Pre-Intermediate</option>
                          <option value="B1 - Intermediate">B1 - Intermediate</option>
                          <option value="B2 - Upper-Intermediate">B2 - Upper-Intermediate</option>
                          <option value="C1 - Advanced">C1 - Advanced</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Estado Inicial</label>
                        <select
                          value={studentStatus}
                          onChange={(e) => setStudentStatus(e.target.value as any)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                        >
                          <option value="ACTIVE">Activo</option>
                          <option value="SUSPENDED">Inactivo / Baja</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 space-y-1 text-cyan-400">
                      <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles size={11} fill="currentColor" /> Diagnóstico Genético IA
                      </span>
                      <p className="text-[9px] leading-snug text-white/60">
                        Al guardar, se iniciará al estudiante con una métrica genérica de rendimiento adaptativo y un espacio para la resolución de su prueba de ADN Teclingo.
                      </p>
                    </div>
                  </div>
                </div>
              </form>

              {/* Botones */}
              <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-end gap-4 font-bold">
                <button
                  type="button"
                  onClick={() => { setShowAddAlumnoModal(false); setFormErrors({}); }}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateAlumnoSubmit}
                  className="px-8 py-3 rounded-2xl bg-[#38BDF8] text-white text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                >
                  Adicionar Alumno
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK LINK STUDENT TO GROUP MODAL */}
      <AnimatePresence>
        {showLinkStudentModal && studentToLink && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-[#09181f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-[#38BDF8]">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-black uppercase tracking-wider">Vincular Estudiante a Grupo</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-normal">Asociar al estudiante con una carrera, semestre y grupo</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowLinkStudentModal(false); setStudentToLink(null); }}
                  className="p-2 rounded-xl border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleLinkStudentSubmit} className="p-8 space-y-6">
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  {studentToLink.photo ? (
                    <img src={studentToLink.photo} alt={studentToLink.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center font-bold font-mono">
                      {studentToLink.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <p className="text-white text-sm font-bold">{studentToLink.name}</p>
                    <p className="text-white/40 text-[10px] font-mono">{studentToLink.controlNumber || 'S/N'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Carrera *</label>
                    <select
                      value={linkStudentCareer}
                      onChange={(e) => setLinkStudentCareer(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                    >
                      {assignedCareersList && assignedCareersList.length > 0 ? (
                        assignedCareersList.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))
                      ) : (
                        <>
                          <option value="Ingeniería en Sistemas Computacionales">Ingeniería en Sistemas Computacionales</option>
                          <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                          <option value="Ingeniería en Gestión Empresarial">Ingeniería en Gestión Empresarial</option>
                          <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                          <option value="Licenciatura en Administración">Licenciatura en Administración</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Semestre *</label>
                      <select
                        value={linkStudentSemester}
                        onChange={(e) => setLinkStudentSemester(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]/40 transition-colors"
                      >
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(sem => (
                          <option key={sem} value={sem}>{sem}° Semestre</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Grupo *</label>
                      <input 
                        type="text"
                        required
                        maxLength={3}
                        placeholder="A"
                        value={linkStudentGroup}
                        onChange={(e) => setLinkStudentGroup(e.target.value.toUpperCase())}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#38BDF8]/40 transition-colors uppercase font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 font-bold">
                  <button
                    type="button"
                    onClick={() => { setShowLinkStudentModal(false); setStudentToLink(null); }}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#38BDF8] text-white text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                  >
                    Vincular Grupo
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ASIGNACIÓN DE MATERIAS MODAL */}
      <AnimatePresence>
        {showAssignSubjectsModal && selectedDocenteForSubjects && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#0b1f1f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {selectedDocenteForSubjects.photo ? (
                      <img src={selectedDocenteForSubjects.photo} alt={selectedDocenteForSubjects.name} className="w-12 h-12 rounded-2xl border border-white/10 object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#DEFF9A] font-bold">
                        {selectedDocenteForSubjects.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#DEFF9A] border-2 border-[#0b1f1f] flex items-center justify-center text-[7px]" title="Asignar">📚</span>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-black uppercase tracking-wider">Asignación de Materias</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-normal">Docente: <span className="text-white font-black">{selectedDocenteForSubjects.name}</span> • Código: <span className="text-cyan-400 font-mono font-bold">{selectedDocenteForSubjects.controlNumber}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowAssignSubjectsModal(false); setSelectedDocenteForSubjects(null); }}
                  className="p-2 rounded-xl border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* 1. LÍMITE HORAS SEMANALES */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="col-span-2">
                    <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest mb-1">Carga Horaria Máxima Docente</h4>
                    <p className="text-white/40 text-[9px] uppercase font-bold">Límite semanal acumulado permitido para este docente académico.</p>
                    <p className="text-[8px] text-[#DEFF9A]/60 italic mt-1">Este límite se usará en Distribución Académica para el algoritmo inteligente de horarios.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-white/30">Horas Máx Semanales</label>
                    <input 
                      type="number"
                      min={1}
                      max={45}
                      required
                      value={tempLimitHours}
                      onChange={(e) => setTempLimitHours(Number(e.target.value))}
                      className="w-full bg-black/40 border border-[#DEFF9A]/30 rounded-xl px-4 py-3 text-sm text-[#DEFF9A] font-black text-center focus:outline-none focus:border-[#DEFF9A]"
                    />
                  </div>
                </div>

                {/* 2. SELECTORES JERÁRQUICOS DE ASIGNATURAS */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2">Vincular Nueva Asignatura</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Career selector */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/45">Carrera Escolar</label>
                      <select
                        value={selectedCareerId}
                        onChange={(e) => {
                          setSelectedCareerId(e.target.value);
                          setSelectedSemester(1);
                          setSelectedSubjectCode('');
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20"
                      >
                        <option value="">-- SELECCIONAR --</option>
                        {assignedCareersList.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Grade/Semester selector */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/45">Grado / Semestre</label>
                      <select
                        disabled={!selectedCareerId}
                        value={selectedSemester}
                        onChange={(e) => {
                          setSelectedSemester(Number(e.target.value));
                          setSelectedSubjectCode('');
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 disabled:opacity-40"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(sem => (
                          <option key={sem} value={sem}>{sem}° Semestre</option>
                        ))}
                      </select>
                    </div>

                    {/* Subject selector */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/45">Asignatura</label>
                      <select
                        disabled={!selectedCareerId}
                        value={selectedSubjectCode}
                        onChange={(e) => setSelectedSubjectCode(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 disabled:opacity-40"
                      >
                        <option value="">-- SELECCIONAR --</option>
                        {(assignedCareersList.find(c => c.id === selectedCareerId)?.subjects || [])
                          .filter(s => Number(s.semester) === Number(selectedSemester))
                          .filter(s => !tempAssignedSubjects.some(ts => ts.code === s.code))
                          .map(s => (
                            <option key={s.code} value={s.code}>{s.name} ({s.hours} HRS)</option>
                          ))}
                      </select>
                    </div>

                    {/* Action button */}
                    <button
                      type="button"
                      disabled={!selectedCareerId || !selectedSubjectCode}
                      onClick={handleAddSubjectToDocente}
                      className="w-full py-2.5 rounded-xl bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(222,255,154,0.15)]"
                    >
                      <UserPlus size={12} /> Vincular Asignatura
                    </button>
                  </div>
                </div>

                {/* 3. LIST OF ASSIGNED SUBJECTS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">Asignaturas Vinculadas ({tempAssignedSubjects.length})</h4>
                    <span className="text-[9px] font-mono text-white/40">
                      Carga total: <span className={`font-black ${tempAssignedSubjects.reduce((s, c) => s + (c.hours || 0), 0) >= tempLimitHours ? 'text-orange-400' : 'text-[#DEFF9A]'}`}>{tempAssignedSubjects.reduce((s, c) => s + (c.hours || 0), 0)}</span> / <span className="font-bold text-white/60">{tempLimitHours} HRS</span>
                    </span>
                  </div>

                  <GlassCard className="!p-0 overflow-hidden" accent="green">
                    {tempAssignedSubjects.length === 0 ? (
                      <div className="p-8 text-center space-y-2">
                        <BookOpen size={24} className="text-white/20 mx-auto" />
                        <p className="text-white/40 text-xs font-bold uppercase tracking-normal">Sin Asignaturas Vinculadas</p>
                        <p className="text-white/20 text-[9px] max-w-md mx-auto leading-relaxed">Este docente no cuenta con materias adscritas en este momento. Utilice el selector de arriba para vincular materias de las retículas.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-black/30 border-b border-white/5">
                            <tr>
                              <th className="px-6 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Cód / Clave</th>
                              <th className="px-6 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Materia Académica</th>
                              <th className="px-6 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Carrera</th>
                              <th className="px-6 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Semestre</th>
                              <th className="px-6 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Horas/Sem</th>
                              <th className="px-6 py-3 text-[8px] font-black uppercase tracking-widest text-white/30 text-right">Desvincular</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {tempAssignedSubjects.map((sub, index) => (
                              <tr key={`${sub.code}-${index}`} className="hover:bg-white/02 transition-colors">
                                <td className="px-6 py-3 text-[10px] font-mono font-bold text-white/50">{sub.code}</td>
                                <td className="px-6 py-3 text-xs font-black text-white">{sub.name}</td>
                                <td className="px-6 py-3 text-[10px] font-bold text-cyan-400/80 uppercase tracking-tighter max-w-[150px] truncate">{sub.careerName || sub.careerId || 'N/A'}</td>
                                <td className="px-6 py-3 text-[10px] text-white/60 font-black">{sub.semester}° Semestre</td>
                                <td className="px-6 py-3">
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#DEFF9A]">{sub.hours} HRS</span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <button
                                    onClick={() => handleRemoveSubjectFromDocenteTemp(sub.code)}
                                    title="Quitar"
                                    className="p-1.5 rounded-lg border border-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/30 transition-all"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </GlassCard>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-end gap-4">
                <button
                  onClick={() => { setShowAssignSubjectsModal(false); setSelectedDocenteForSubjects(null); }}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveSubjectsAssignSubmit}
                  className="px-8 py-3 rounded-2xl bg-[#DEFF9A] text-[#061a1a] text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_#DEFF9A80]"
                >
                  Guardar Asignación
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
