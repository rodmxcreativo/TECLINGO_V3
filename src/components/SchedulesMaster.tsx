/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Info,
  Trash2,
  Maximize2,
  RefreshCw,
  Search,
  Book,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

// Schedule days and blocks matching the layout
const days = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'] as const;

interface BlockType {
  id: string;
  name: string;
  time: string;
  isRecess?: boolean;
}

const blocks: BlockType[] = [
  { id: 'BLOCK 01', name: 'BLOCK 01', time: '07:00 AM' },
  { id: 'BLOCK 02', name: 'BLOCK 02', time: '07:50 AM' },
  { id: 'BLOCK 03', name: 'BLOCK 03', time: '08:40 AM' },
  { id: 'RECESS', name: 'RECESO', time: '09:30 AM', isRecess: true },
  { id: 'BLOCK 04', name: 'BLOCK 04', time: '10:00 AM' },
  { id: 'BLOCK 05', name: 'BLOCK 05', time: '10:50 AM' },
  { id: 'BLOCK 06', name: 'BLOCK 06', time: '11:40 AM' },
  { id: 'BLOCK 07', name: 'BLOCK 07', time: '12:30 PM' },
  { id: 'BLOCK 08', name: 'BLOCK 08', time: '01:20 PM' },
];

interface PendingSubject {
  code: string;
  name: string;
  teacherId: string;
  teacherName: string;
  totalHours: number;
  assignedHours: number;
  color: string;
  requiresLab?: boolean;
}

interface AssignedSlot {
  day: typeof days[number];
  blockId: string;
  subjectCode: string;
  room: string;
}

export function SchedulesMaster({ onBack }: { onBack?: () => void }) {
  // Current active filters
  const [activeShift, setActiveShift] = useState<'MORNING' | 'AFTERNOON'>('MORNING');
  const [activeGroup, setActiveGroup] = useState<'2° A' | '1° A' | '3° B'>('2° A');
  const [hasOptimization, setHasOptimization] = useState(true);

  // Classroom requirements options & selector for assignment helper
  const classrooms = ['Aula 104', 'Lab Redes', 'Lab de Computadoras', 'Aula Magna', 'Virtual'] as const;
  const [selectedRoom, setSelectedRoom] = useState<typeof classrooms[number]>('Aula 104');

  // List of pending subjects to be scheduled ("CARGA PENDIENTE")
  const [pendingSubjects, setPendingSubjects] = useState<PendingSubject[]>([
    { 
      code: 'TEC-001', 
      name: 'TecLingo AI (Inglés I)', 
      teacherId: 'ana_lopez', 
      teacherName: 'Mtra. Ana López', 
      totalHours: 4, 
      assignedHours: 0, 
      color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-300 border-emerald-505/20' 
    },
    { 
      code: 'ISC-201', 
      name: 'Práctica de Redes', 
      teacherId: 'chucho_serna', 
      teacherName: 'Mtro. Chucho Serna', 
      totalHours: 4, 
      assignedHours: 0, 
      color: 'from-cyan-500/10 to-cyan-500/5 text-cyan-300 border-cyan-505/20',
      requiresLab: true
    },
    { 
      code: 'ISC-202', 
      name: 'Estructura de Datos', 
      teacherId: 'roberto_her', 
      teacherName: 'Mtro. Roberto Hernández', 
      totalHours: 4, 
      assignedHours: 0, 
      color: 'from-amber-400/10 to-amber-400/5 text-amber-300 border-amber-450/20' 
    },
    { 
      code: 'ISC-203', 
      name: 'Programación Web', 
      teacherId: 'sofia_ruiz', 
      teacherName: 'Mtra. Sofía Ruiz', 
      totalHours: 5, 
      assignedHours: 0, 
      color: 'from-purple-500/10 to-purple-500/5 text-purple-300 border-purple-505/20',
      requiresLab: true
    },
    { 
      code: 'ISC-204', 
      name: 'Arquitectura de Computadoras', 
      teacherId: 'luis_garcia', 
      teacherName: 'Mtro. Luis García', 
      totalHours: 4, 
      assignedHours: 0, 
      color: 'from-blue-500/10 to-blue-500/5 text-blue-300 border-blue-505/20' 
    },
    { 
      code: 'ISC-205', 
      name: 'Inteligencia Artificial Avanzada', 
      teacherId: '', 
      teacherName: 'Sin Docente Asignado', 
      totalHours: 3, 
      assignedHours: 0, 
      color: 'from-pink-500/10 to-pink-500/5 text-pink-300 border-pink-505/20' 
    }
  ]);

  // Main work schedule grid
  const [assignedSlots, setAssignedSlots] = useState<AssignedSlot[]>([]);

  // Simulation of other groups' assignment data to detect teacher overlap conflicts
  // Crucial rule 1: "Cero Empalmes de Profesor"
  // If teacher Y is already busy in another group at slot X, we flag conflict!
  const externalTeacherSchedules = [
    { teacherId: 'chucho_serna', day: 'LUNES', blockId: 'BLOCK 01', group: 'A2-105' },
    { teacherId: 'ana_lopez', day: 'MARTES', blockId: 'BLOCK 02', group: 'B1-201' },
    { teacherId: 'luis_garcia', day: 'MIÉRCOLES', blockId: 'BLOCK 03', group: 'C3-305' },
  ];

  // UI Assist States
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [draggedSubjectCode, setDraggedSubjectCode] = useState<string | null>(null);
  const [draggedOriginSlot, setDraggedOriginSlot] = useState<{ day: typeof days[number]; blockId: string } | null>(null);
  const [cellOver, setCellOver] = useState<{ day: string; blockId: string } | null>(null);

  // Manual configuration modal helper
  const [clickToAssignMode, setClickToAssignMode] = useState<{ day: string; blockId: string } | null>(null);

  // Touch and Select states
  const [touchSelectedSource, setTouchSelectedSource] = useState<{
    subjectCode: string;
    originSlot: { day: typeof days[number]; blockId: string } | null;
  } | null>(null);

  const [touchSelectedDestination, setTouchSelectedDestination] = useState<{
    day: typeof days[number];
    blockId: string;
  } | null>(null);

  // Little Tech Speech Bubble State
  const [littleTechMessage, setLittleTechMessage] = useState<string>(
    '¡Hola, compadre! Estoy listo para validar tu horario. Arrastra las materias al grid escolar.'
  );

  // Count total assigned hours
  const totalAssignedHours = assignedSlots.reduce((sum, slot) => {
    const sub = pendingSubjects.find(s => s.code === slot.subjectCode);
    return sum + (sub ? 1 : 0); // Each block represents 1 hour
  }, 0);

  const totalRequiredHours = pendingSubjects.reduce((sum, s) => sum + s.totalHours, 0);

  // Load pre-assignments from academic distribution module
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dist_assignments');
      if (saved) {
        const assignments = JSON.parse(saved) as Record<string, string>;
        const docentNames: Record<string, string> = {
          'ana_lopez': 'Mtra. Ana López',
          'chucho_serna': 'Mtro. Chucho Serna',
          'roberto_her': 'Mtro. Roberto Hernández',
          'sofia_ruiz': 'Mtra. Sofía Ruiz',
          'luis_garcia': 'Mtro. Luis García'
        };

        setPendingSubjects(prev => prev.map(sub => {
          if (sub.code in assignments) {
            const assignedId = assignments[sub.code];
            return {
              ...sub,
              teacherId: assignedId,
              teacherName: docentNames[assignedId] || 'Sin Docente Asignado'
            };
          }
          return sub;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (totalAssignedHours > 0 && totalAssignedHours === totalRequiredHours) {
      setLittleTechMessage("¡Uff, compadre! ¡Excelente jugada! Todas las asignaturas y docentes están perfectamente asignados, sin empalmes ni reclamos técnicos de horario. ¡Eres el maestro definitivo de la distribución académica!");
    }
  }, [totalAssignedHours, totalRequiredHours]);

  const teacherLimits: Record<string, number> = {
    'ana_lopez': 8,
    'chucho_serna': 10,
    'roberto_her': 8,
    'sofia_ruiz': 12,
    'luis_garcia': 8,
  };

  const getTeacherTotalHours = (teacherId: string, excludeSlot?: { day: typeof days[number]; blockId: string } | null) => {
    if (!teacherId) return 0;
    // Hours assigned in active grid
    const currentGridHours = assignedSlots.filter(s => {
      // If we are evaluating capacity and relocating, ignore the original slot being moved!
      if (excludeSlot && s.day === excludeSlot.day && s.blockId === excludeSlot.blockId) return false;
      const sub = pendingSubjects.find(p => p.code === s.subjectCode);
      return sub && sub.teacherId === teacherId;
    }).length;

    // Hours assigned externally
    const externalHours = externalTeacherSchedules.filter(ext => ext.teacherId === teacherId).length;

    return currentGridHours + externalHours;
  };

  // Pre-fill some slots initially for visual richness
  useEffect(() => {
    const initialSlots: AssignedSlot[] = [
      { day: 'LUNES', blockId: 'BLOCK 02', subjectCode: 'TEC-001', room: 'Aula 104' },
      { day: 'MARTES', blockId: 'BLOCK 03', subjectCode: 'ISC-202', room: 'Aula 104' },
      { day: 'JUEVES', blockId: 'BLOCK 01', subjectCode: 'ISC-204', room: 'Aula Magna' },
    ];
    setAssignedSlots(initialSlots);

    // Sync pending subjects' assigned hours indicator
    updateAssignedHoursIndicators(initialSlots);
  }, []);

  const updateAssignedHoursIndicators = (slotsList: AssignedSlot[]) => {
    setPendingSubjects(prev => prev.map(subject => {
      const count = slotsList.filter(s => s.subjectCode === subject.code).length;
      return { ...subject, assignedHours: count };
    }));
  };

  // Drag and Drop Logic
  const handleDragStart = (subjectCode: string, originSlot: { day: typeof days[number]; blockId: string } | null = null) => {
    setDraggedSubjectCode(subjectCode);
    setDraggedOriginSlot(originSlot);
  };

  const handleDragOver = (e: React.DragEvent, day: typeof days[number], blockId: string) => {
    e.preventDefault();
    if (blockId === 'RECESS') return; // Cannot map on recess
    setCellOver({ day, blockId });
  };

  const handleDrop = (day: typeof days[number], blockId: string) => {
    if (!draggedSubjectCode) return;
    
    // Perform assignment with origin slot information
    const success = performAssignment(draggedSubjectCode, day, blockId, undefined, draggedOriginSlot);
    
    setDraggedSubjectCode(null);
    setDraggedOriginSlot(null);
    setCellOver(null);
  };

  // Execute assignment with all 3 validations
  const performAssignment = (
    subjectCode: string, 
    day: typeof days[number], 
    blockId: string,
    forcedRoom?: typeof classrooms[number],
    originSlot: { day: typeof days[number]; blockId: string } | null = null
  ): boolean => {
    if (blockId === 'RECESS') return false;

    const subject = pendingSubjects.find(s => s.code === subjectCode);
    if (!subject) return false;

    // VALIDATION: Check if a teacher is assigned before scheduling
    if (!subject.teacherId || subject.teacherName.toLowerCase().includes('sin docente')) {
      triggerCollisionError(
        `Falta Docente Asignado para la Asignatura: ${subject.name}`
      );
      setLittleTechMessage(
        `¡Cuidado, compadre! Estás dejando la materia de ${subject.name} en el limbo. Asígnale un docente a este grupo antes de cuadrar las horas en el grid.`
      );
      return false;
    }

    // RULE 2: Topes de Horas Laborales (Max allowance)
    // If we are relocating (originSlot is not null), we offset the current count by minus 1 for the slot we are vacating.
    const effectiveAllocatedCount = originSlot ? Math.max(0, subject.assignedHours - 1) : subject.assignedHours;

    if (effectiveAllocatedCount >= subject.totalHours) {
      triggerCollisionError(
        `¡Horas excedidas! La materia ${subject.name} ya tiene todas sus ${subject.totalHours} horas asignadas.`
      );
      setLittleTechMessage(
        `¡Quieto ahí, compadre! Ya acomodaste las ${subject.totalHours} horas de ${subject.name}. Si pones más, descuadras la planeación.`
      );
      return false;
    }

    // RULE 4: Tope de Horas del Docente (Contract Limits)
    if (subject.teacherId) {
      const maxTeacherHours = teacherLimits[subject.teacherId] || 40;
      const currentTeacherHours = getTeacherTotalHours(subject.teacherId, originSlot);
      if (currentTeacherHours >= maxTeacherHours) {
        triggerCollisionError(
          `Contrato Excedido: Mtro. / Mtra. ${subject.teacherName} ya completó su límite de ${maxTeacherHours} horas semanales.`
        );
        setLittleTechMessage(
          `¡Alto ahí, compadre! El docente ${subject.teacherName} ya llegó a su tope oficial de ${maxTeacherHours} horas contratadas. No podemos asignarle de más.`
        );
        return false;
      }
    }

    // RULE 1: Cero Empalmes de Profesor (Collision check in standard and external groups)
    const activeTeacherId = subject.teacherId;
    
    // Check inside current group grid, ignoring the origin slot to prevent pseudo self-collisions
    const isTeacherBusyHere = assignedSlots.some(
      s => s.day === day && 
           s.blockId === blockId && 
           !(originSlot && s.day === originSlot.day && s.blockId === originSlot.blockId) &&
           pendingSubjects.find(p => p.code === s.subjectCode)?.teacherId === activeTeacherId
    );

    // Check inside other ITSP groups simulated DB
    const isTeacherBusyElsewhere = externalTeacherSchedules.find(
      ext => ext.teacherId === activeTeacherId && ext.day === day && ext.blockId === blockId
    );

    if (isTeacherBusyHere || isTeacherBusyElsewhere) {
      const busyGroup = isTeacherBusyElsewhere ? isTeacherBusyElsewhere.group : 'este mismo salón';
      triggerCollisionError(
        `Colisión del Docente: El Mtro. ${subject.teacherName} ya tiene una clase a esta hora en ${busyGroup}.`
      );
      setLittleTechMessage(
        `¡Quieto ahí, compadre! Si pones a ese maestro a esta hora, me vas a dejar al grupo ${busyGroup} sin clase. Elige otro bloque.`
      );
      return false;
    }

    // RULE 3: Restricción de Infraestructura
    const targetRoom = forcedRoom || (subject.requiresLab ? 'Lab Redes' : selectedRoom);
    if (subject.requiresLab && targetRoom !== 'Lab Redes' && targetRoom !== 'Lab de Computadoras') {
      triggerCollisionError(
        `Restricción de Infraestructura: La materia ${subject.name} exige un laboratorio técnico.`
      );
      setLittleTechMessage(
        `¡Aviso del sistema! Para ${subject.name} ocupamos un laboratorio. Asegúrate de elegir 'Lab Redes' o similar, compadre.`
      );
    }

    // Success placement!
    const newSlots = [
      // Clear out the cell we are targeting, and if we are relocating, also clear the source cell we came from
      ...assignedSlots.filter(s => {
        if (s.day === day && s.blockId === blockId) return false;
        if (originSlot && s.day === originSlot.day && s.blockId === originSlot.blockId) return false;
        return true;
      }),
      { day, blockId, subjectCode, room: targetRoom }
    ];
    setAssignedSlots(newSlots);
    updateAssignedHoursIndicators(newSlots);
    
    setActiveNotification(`Asignatura asignada: ${subject.name}`);
    setLittleTechMessage(
      originSlot 
        ? `¡Movimiento exitoso compadre! Reubiqué ${subject.name} de ${originSlot.day} a ${day} a las ${blocks.find(b => b.id === blockId)?.time || ''}.`
        : `¡Buenísimo compadre! Empalmé bien el Módulo. Añadida la clase de ${subject.name} el ${day.toLowerCase()} a las ${blocks.find(b => b.id === blockId)?.time || ''}.`
    );
    setTimeout(() => setActiveNotification(null), 3000);
    return true;
  };

  const triggerCollisionError = (msg: string) => {
    setCollisionWarning(msg);
    setTimeout(() => setCollisionWarning(null), 4000);
  };

  const handleRemoveSlot = (day: typeof days[number], blockId: string) => {
    const newSlots = assignedSlots.filter(s => !(s.day === day && s.blockId === blockId));
    setAssignedSlots(newSlots);
    updateAssignedHoursIndicators(newSlots);
    setLittleTechMessage('Perfecto compadre, liberé el bloque de hora.');
  };

  const autoOptimizeSchedule = () => {
    // Generate optimized layout matching limits and availability cleanly
    const optimized: AssignedSlot[] = [];
    
    // Clear old state and distribute pending hours intelligently
    pendingSubjects.forEach((sub, sIdx) => {
      let allocatedCount = 0;
      for (let d = 0; d < days.length; d++) {
        const day = days[d];
        for (let b = 0; b < blocks.length; b++) {
          const block = blocks[b];
          if (block.isRecess) continue;
          
          if (allocatedCount >= sub.totalHours) break;

          // Check validations before automatic placement
          const isBusyOther = externalTeacherSchedules.some(ext => ext.teacherId === sub.teacherId && ext.day === day && ext.blockId === block.id);
          const isBusySelf = optimized.some(s => s.day === day && s.blockId === block.id);
          const hasTeacherInDayTime = optimized.some(s => s.day === day && s.blockId === block.id && pendingSubjects.find(p => p.code === s.subjectCode)?.teacherId === sub.teacherId);

          if (!isBusyOther && !isBusySelf && !hasTeacherInDayTime) {
            optimized.push({
              day,
              blockId: block.id,
              subjectCode: sub.code,
              room: sub.requiresLab ? 'Lab Redes' : 'Aula 104'
            });
            allocatedCount++;
          }
        }
      }
    });

    setAssignedSlots(optimized);
    updateAssignedHoursIndicators(optimized);
    setLittleTechMessage('¡Mesa lista, compadre! He distribuido automáticamente las asignaturas con cero empalmes y respetando los límites oficiales.');
    setActiveNotification('Optimización Automática del Algoritmo Aplicada');
    setTimeout(() => setActiveNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#061519] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 text-left relative overflow-hidden font-sans">
      
      {/* Background Ambience Sparks */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#DEFF9A]/2 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Banner Alert / Collision Flash */}
      <AnimatePresence>
        {collisionWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[3000] max-w-xl w-full px-4"
          >
            <div className="bg-red-500/10 border-2 border-red-500/40 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-4 shadow-[0_4px_30px_rgba(239,68,68,0.25)] animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Empalme de Sistema Detectado</p>
                <p className="text-white text-xs font-bold leading-relaxed">{collisionWarning}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[3000] max-w-xl w-full px-4"
          >
            <div className="bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 shadow-[0_4px_30px_rgba(16,185,129,0.15)]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[#DEFF9A] shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <p className="text-white text-xs font-black uppercase tracking-tight">{activeNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION MATCHING THE MOCKUP */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-white/5 relative z-10">
        
        {/* Left Title block with Back Arrow */}
        <div className="flex items-center gap-5">
          {onBack && (
            <button 
              type="button"
              onClick={onBack}
              className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all haptic-press shrink-0"
              title="Volver"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
          )}

          <div>
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] block">
                MESA DE CONTROL
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-400 block" />
              <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-[0.3em] block">
                SCHEDULER
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white uppercase italic tracking-tighter mt-1 flex items-center gap-3">
              ENGINE V2.0 <span className="text-emerald-400 text-xs font-nano font-black border border-emerald-400/20 px-2 py-0.5 rounded-md uppercase tracking-widest not-italic">AI-DRIVEN</span>
            </h1>
          </div>
        </div>

        {/* Center morning/group selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-black/55 border border-white/5 rounded-2xl p-1.5 flex gap-1">
            <button
              type="button"
              onClick={() => setActiveShift('MORNING')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                activeShift === 'MORNING'
                  ? 'bg-[#DEFF9A] text-black shadow-[0_0_15px_rgba(222,255,154,0.3)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              MORNING
            </button>
            <button
              type="button"
              onClick={() => setActiveShift('AFTERNOON')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                activeShift === 'AFTERNOON'
                  ? 'bg-[#DEFF9A] text-black shadow-[0_0_15px_rgba(222,255,154,0.3)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              AFTERNOON
            </button>
          </div>

          <div className="relative">
            <select
              value={activeGroup}
              onChange={(e) => setActiveGroup(e.target.value as any)}
              className="bg-black/55 border border-white/5 rounded-2xl px-5 py-3 text-[10px] font-black tracking-widest text-[#DEFF9A] uppercase appearance-none pr-10 focus:outline-none focus:border-[#DEFF9A]/40"
            >
              <option value="2° A">2° A</option>
              <option value="1° A">1° A</option>
              <option value="3° B">3° B</option>
            </select>
            <ChevronDown size={12} className="absolute right-4 top-4 text-white/40 pointer-events-none" />
          </div>

          {/* Quick Optimization Button */}
          <button
            type="button"
            onClick={autoOptimizeSchedule}
            className={`px-5 py-3 rounded-2xl text-[9px] font-black tracking-widest uppercase flex items-center gap-2 transition-all haptic-press ${
              hasOptimization
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-[#DEFF9A] shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                : 'bg-white/5 border border-white/10 text-white/55'
            }`}
          >
            <Sparkles size={11} className={`${hasOptimization ? 'animate-spin' : ''}`} /> 
            OPTIMIZACIÓN ACTIVA
          </button>
        </div>
      </header>

      {/* CORE WORK AREA CONTROLLERS (MESA DE TRABAJO ACTUAL & STATS) */}
      <section className="bg-black/45 border border-white/5 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        <div className="md:col-span-8 flex flex-col md:flex-row items-baseline md:items-center gap-4">
          <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
            👥 MESA DE TRABAJO ACTUAL:
          </span>
          <div className="relative w-full max-w-sm">
            <select 
              className="w-full bg-black/40 border-2 border-[#DEFF9A]/20 hover:border-[#DEFF9A]/40 text-white font-black text-xs uppercase tracking-widest px-5 py-3.5 rounded-2xl focus:outline-none transition-colors appearance-none pr-12"
              value={`${activeGroup === '2° A' ? 'PIONEERS A1' : 'PIONEERS B2'} - ${activeShift}`}
              onChange={() => {}}
            >
              <option>{activeGroup === '2° A' ? 'PIONEERS A1' : 'PIONEERS B2'} - {activeShift}</option>
            </select>
            <ChevronDown size={14} className="absolute right-5 top-5 text-[#DEFF9A]" />
          </div>
        </div>

        <div className="md:col-span-4 flex justify-end gap-3">
          <div className={`border p-4 rounded-2xl flex items-center justify-between gap-6 w-full max-w-xs text-left transition-all duration-500 ${
            totalAssignedHours === totalRequiredHours 
              ? 'bg-[#DEFF9A]/10 border-[#DEFF9A] shadow-[0_0_20px_rgba(222,255,154,0.25)] animate-pulse' 
              : 'bg-[#0c1214] border-white/5'
          }`}>
            <div>
              <p className="text-white/30 text-[7px] font-black uppercase tracking-widest leading-none mb-1">HORAS ASIGNADAS</p>
              <p className="text-lg font-mono font-black text-white leading-none">
                <span className="text-[#DEFF9A]">{totalAssignedHours}</span> / {totalRequiredHours} <span className="text-[10px] text-white/30 font-sans font-black uppercase">hrs</span>
              </p>
            </div>
            <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              totalAssignedHours === totalRequiredHours
                ? 'bg-[#DEFF9A] text-black shadow-[0_0_15px_#DEFF9A]'
                : 'bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] hover:bg-[#DEFF9A]/20'
            }`}>
              <Clock size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* LITTLE TECH AI ADVISOR */}
      <section className="bg-cyan-500/[0.03] border border-cyan-500/10 p-5 rounded-3xl flex flex-col md:flex-row items-center gap-5 relative z-10 text-left">
        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border-2 border-cyan-400/30 flex items-center justify-center shrink-0 relative animate-pulse">
          <span className="text-xs font-black tracking-tight text-white select-none">AI</span>
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#061519] flex items-center justify-center animate-bounce">
            <Sparkles size={8} className="text-black" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-cyan-400 text-[8px] font-mono font-black uppercase tracking-widest leading-none mb-1">LITTLE TECH - REGLAS EN TIEMPO REAL</p>
          <p className="text-white/80 text-xs font-medium leading-relaxed italic">
            "{littleTechMessage}"
          </p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button 
            type="button" 
            onClick={() => autoOptimizeSchedule()} 
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
          >
            Preguntar Optimización
          </button>
          <button 
            type="button" 
            onClick={() => {
              setAssignedSlots([]);
              updateAssignedHoursIndicators([]);
              setLittleTechMessage("Grid vacío. Todo listo para empezar a programar compadre.");
            }} 
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
            title="Limpiar Grid"
          >
            Limpiar Plan
          </button>
        </div>
      </section>

      {/* THREE VALIDATION RULES CHEAT-SHEET DESCRIPTIVE BANNER */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
          <span className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-black shrink-0">1</span>
          <div>
            <p className="text-white font-black uppercase text-[10px] tracking-wider mb-0.5">Cero Empalmes de Profesor</p>
            <p className="text-white/40 text-[9px] leading-relaxed">Si el docente tiene clase asignada en otro grupo o salón a esa misma hora, el sistema bloquea su disponibilidad.</p>
          </div>
        </div>
        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
          <span className="w-6 h-6 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-black shrink-0">2</span>
          <div>
            <p className="text-white font-black uppercase text-[10px] tracking-wider mb-0.5">Topes de Horas Laborales</p>
            <p className="text-white/40 text-[9px] leading-relaxed">Se calcula la carga reticular contra el total acomodado para impedir la sobreasignación escolar.</p>
          </div>
        </div>
        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
          <span className="w-6 h-6 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono font-black shrink-0">3</span>
          <div>
            <p className="text-white font-black uppercase text-[10px] tracking-wider mb-0.5">Restricción de Infraestructura</p>
            <p className="text-white/40 text-[9px] leading-relaxed">Valida si la asignatura requiere un laboratorio de cómputo o redes y restringe su colocación.</p>
          </div>
        </div>
      </section>

      {/* MAIN SCREEN WORKSPACE LAYOUT (CARGA PENDIENTE VS MAIN MATRIX GRID) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Cargas Pendientes list */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-black/40 border border-white/5 rounded-[24px] overflow-hidden p-6 text-left">
            <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.25em] block mb-1">
              CARGA PENDIENTE
            </span>
            <h3 className="text-white text-[13px] font-black uppercase tracking-wide border-b border-white/5 pb-3">
              {activeGroup === '2° A' ? 'PIONEERS A1' : 'PIONEERS B2'} - {activeShift}
            </h3>

            {/* Draggables subject items */}
            <div className="space-y-3.5 mt-5">
              <AnimatePresence>
                {pendingSubjects
                  .filter((sub) => sub.assignedHours < sub.totalHours)
                  .map((sub) => {
                    const finished = sub.assignedHours >= sub.totalHours;
                    const isSelectedForTouch = touchSelectedSource && touchSelectedSource.subjectCode === sub.code && touchSelectedSource.originSlot === null;
                    
                    return (
                      <motion.div
                        key={sub.code}
                        layout
                        initial={{ opacity: 0, scale: 0.9, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: 'auto' }}
                        exit={{ opacity: 0, scale: 0.8, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        draggable={!finished}
                        onDragStart={() => handleDragStart(sub.code, null)}
                        onClick={() => {
                          if (finished) return;
                          if (isSelectedForTouch) {
                            setTouchSelectedSource(null);
                            setTouchSelectedDestination(null);
                            setLittleTechMessage('Selección táctil cancelada.');
                          } else {
                            setTouchSelectedSource({ subjectCode: sub.code, originSlot: null });
                            setTouchSelectedDestination(null);
                            setLittleTechMessage(`Seleccionaste ${sub.name}. Toca una celda en el grid escolar para colocarla.`);
                          }
                        }}
                        className={`bg-gradient-to-r ${sub.color} p-4 rounded-2xl border transition-all relative group cursor-grab active:cursor-grabbing overflow-hidden ${
                          finished ? 'opacity-35 pointer-events-none' : 'hover:border-white/15 hover:scale-[1.01]'
                        } ${
                          isSelectedForTouch ? 'border-yellow-400 ring-2 ring-yellow-400/50 animate-pulse bg-yellow-500/5 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : ''
                        }`}
                      >
                        <div className="absolute inset-0 border-t border-l border-white/5 rounded-2xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-[10px] font-mono font-black tracking-tight">{sub.code}</span>
                          <div className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-white/50">
                            {sub.assignedHours}/{sub.totalHours} hrs
                          </div>
                        </div>

                        <h4 className="text-white text-xs font-black uppercase tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                          {sub.name}
                        </h4>
                        
                        <div className="mt-2.5 flex items-center justify-between text-[8px] font-bold uppercase tracking-wider text-white/40">
                          <span className="font-sans truncate max-w-[130px]">{sub.teacherName}</span>
                          {sub.requiresLab && (
                            <span className="text-cyan-400 font-black border border-cyan-400/20 px-1.5 py-0.2 rounded shrink-0">LAB REDES</span>
                          )}
                        </div>

                        {!finished && (
                          <div className="mt-3 text-[7.5px] font-black uppercase tracking-widest text-[#DEFF9A] bg-black/30 p-1.5 rounded-lg border border-white/5 text-center block group-hover:bg-black/60 transition-colors">
                            ↔️ Arrastrar o Haz Click
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
              {pendingSubjects.filter((sub) => sub.assignedHours < sub.totalHours).length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] text-center text-[10px] uppercase font-black tracking-widest text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.1)] animate-pulse"
                >
                  🎉 TODAS LAS MATERIAS ASIGNADAS
                </motion.div>
              )}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-black/20 border border-white/5 text-[9px] text-white/30 leading-relaxed uppercase font-bold text-center">
              💡 Tip: Arrastra una materia al bloque horario deseado, o haz click en cualquier bloque vacío del grid para seleccionarla.
            </div>
          </div>

          {/* Institutional validation and Teacher Limits list */}
          <div className="bg-black/40 border border-[#DEFF9A]/15 rounded-[24px] p-6 text-left space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]" />
              <span className="text-[#DEFF9A] text-[9px] font-mono font-black uppercase tracking-widest">
                VALIDACIÓN INSTITUCIONAL
              </span>
            </div>

            <div>
              <h2 className="text-white text-sm font-black uppercase leading-none tracking-tight mb-1">
                ESTADO OK
              </h2>
              <p className="text-white/40 text-[8.5px] uppercase font-black tracking-widest leading-loose">
                MATRIZ DE COLISIÓN VERIFICADA EN TIEMPO REAL POR EL MOTOR DE JERARQUÍA ACADÉMICA.
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <p className="text-[#DEFF9A] text-[8.5px] font-black uppercase tracking-widest">
                📊 CAPACIDAD DE CONTRATO DOCENTE
              </p>

              <div className="space-y-2.5">
                {Object.entries(teacherLimits).map(([teacherId, limit]) => {
                  const name = pendingSubjects.find(s => s.teacherId === teacherId)?.teacherName || teacherId;
                  const currentHours = getTeacherTotalHours(teacherId);
                  const isAtLimit = currentHours >= limit;
                  const ratio = Math.min(100, (currentHours / limit) * 100);

                  return (
                    <div key={teacherId} className="space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span className="text-white/70 truncate max-w-[140px] text-[10px] uppercase font-bold">{name}</span>
                        <span className={isAtLimit ? 'text-red-400 font-black font-mono' : 'text-[#DEFF9A] font-mono font-black'}>
                          {currentHours}/{limit} hrs
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            isAtLimit ? 'bg-red-400 shadow-[0_0_5px_#f87171]' : 'bg-[#DEFF9A]'
                          }`} 
                          style={{ width: `${ratio}%` }} 
                        />
                      </div>
                      {isAtLimit && (
                        <p className="text-[7px] text-red-400 uppercase font-black tracking-widest animate-pulse mt-0.5">⚠️ Contrato Completo - Bloqueado</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Matrix grid */}
        <div className="xl:col-span-9 bg-black/40 border border-white/5 rounded-[24px] p-6 text-left">
          
          {/* Grid Container */}
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[900px] border border-white/5 rounded-2xl overflow-hidden">
              
              {/* Header Titles */}
              <div className="grid grid-cols-6 border-b border-white/5 bg-black/60">
                <div className="p-4 text-center border-r border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">BLOQUE / HORA</span>
                </div>
                {days.map((day) => (
                  <div key={day} className="p-4 text-center border-r border-white/5 last:border-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{day}</span>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="bg-black/20 relative divide-y divide-white/5">
                {blocks.map((block) => {
                  if (block.isRecess) {
                    return (
                      <div 
                        key={block.id}
                        className="grid grid-cols-6 items-center bg-[#DEFF9A]/[0.02] border-y border-white/5"
                      >
                        <div className="p-4 text-center border-r border-white/5">
                          <span className="text-[9px] font-mono text-[#DEFF9A] font-black leading-none">{block.time}</span>
                        </div>
                        <div className="col-span-5 p-3 text-center">
                          <span className="text-[9px] font-black uppercase tracking-[0.6em] text-[#DEFF9A]/40 animate-pulse">
                            R E C E S O &nbsp; I N S T I T U C I O N A L
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={block.id} className="grid grid-cols-6">
                      
                      {/* Left Hour col */}
                      <div className="p-4 border-r border-white/5 bg-black/45 flex flex-col items-center justify-center text-center">
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-wider mb-1">{block.name}</span>
                        <span className="text-[10px] font-mono text-[#DEFF9A]/95 font-black leading-none">{block.time}</span>
                      </div>

                      {/* Days drop cells */}
                      {days.map((day) => {
                        // find if slot is assigned
                        const assigned = assignedSlots.find(s => s.day === day && s.blockId === block.id);
                        const sub = assigned ? pendingSubjects.find(p => p.code === assigned.subjectCode) : null;
                        const isOver = cellOver?.day === day && cellOver?.blockId === block.id;

                        // Touch-and-select flags
                        const isSelectedSource = touchSelectedSource && touchSelectedSource.originSlot?.day === day && touchSelectedSource.originSlot?.blockId === block.id;
                        const isSelectedDestination = touchSelectedDestination?.day === day && touchSelectedDestination?.blockId === block.id;
                        const isAvailableDestination = touchSelectedSource && !isSelectedSource;

                        return (
                          <div
                            key={day}
                            onDragOver={(e) => handleDragOver(e, day, block.id)}
                            onDrop={() => handleDrop(day, block.id)}
                            onDragLeave={() => setCellOver(null)}
                            onClick={() => {
                              if (touchSelectedSource) {
                                if (isSelectedSource) {
                                  // Clicking source again deselects it
                                  setTouchSelectedSource(null);
                                  setTouchSelectedDestination(null);
                                  setLittleTechMessage("Selección cancelada compadre.");
                                } else if (isSelectedDestination) {
                                  // Clicked confirmed active destination again
                                  const success = performAssignment(
                                    touchSelectedSource.subjectCode,
                                    day,
                                    block.id,
                                    undefined,
                                    touchSelectedSource.originSlot
                                  );
                                  if (success) {
                                    setTouchSelectedSource(null);
                                    setTouchSelectedDestination(null);
                                  }
                                } else {
                                  setTouchSelectedDestination({ day, blockId: block.id });
                                }
                              } else {
                                if (assigned) {
                                  // Select assigned cell to relocate
                                  setTouchSelectedSource({
                                    subjectCode: assigned.subjectCode,
                                    originSlot: { day, blockId: block.id }
                                  });
                                  setTouchSelectedDestination(null);
                                  setLittleTechMessage(`Seleccionaste reubicar ${sub?.name} (${day}). Toca una celda de destino (marcado azul) para moverlo.`);
                                } else {
                                  // Simple assign when no active selection
                                  setClickToAssignMode({ day, blockId: block.id });
                                }
                              }
                            }}
                            className={`min-h-[92px] p-2 border-r last:border-0 border-white/5 relative group/slot transition-all cursor-pointer select-none ${
                              isOver ? 'bg-[#DEFF9A]/10 border-2 border-dashed border-[#DEFF9A]/40' : 'hover:bg-white/[0.02]'
                            } ${
                              isAvailableDestination ? 'border-cyan-500/40 ring-1 ring-cyan-500/25 bg-cyan-950/5' : ''
                            } ${
                              isSelectedSource ? 'border-yellow-400 ring-2 ring-yellow-400/40 bg-yellow-500/5' : ''
                            } ${
                              isSelectedDestination ? 'border-[#DEFF9A] ring-2 ring-[#DEFF9A]/50 bg-emerald-900/10' : ''
                            }`}
                          >
                            {assigned && sub ? (
                              <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                draggable={true}
                                onDragStart={(e) => {
                                  handleDragStart(assigned.subjectCode, { day, blockId: block.id });
                                }}
                                className={`h-full rounded-xl p-2.5 flex flex-col justify-between bg-black/55 border border-white/10 shadow-lg relative group overflow-hidden cursor-grab active:cursor-grabbing ${
                                  isSelectedSource ? 'opacity-85' : ''
                                }`}
                              >
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#DEFF9A]" />
                                
                                <div className="flex justify-between items-start gap-1">
                                  <span className="text-[8px] font-mono font-black text-[#DEFF9A] bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 px-1.5 py-0.2 rounded">
                                    {sub.code}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveSlot(day, block.id);
                                    }}
                                    className="p-1 rounded-md text-white/20 hover:text-red-400 hover:bg-white/5 transition-all opacity-0 group-hover/slot:opacity-100"
                                    title="Quitar"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>

                                <p className="text-[10px] font-black uppercase text-white tracking-tight mt-1 line-clamp-1">
                                  {sub.name}
                                </p>

                                <div className="mt-2.5 flex items-center justify-between text-[7px] font-bold text-white/40 uppercase">
                                  <span className="truncate max-w-[85px]">{sub.teacherName}</span>
                                  <div className="flex items-center gap-1 shrink-0 text-cyan-400">
                                    <MapPin size={7} />
                                    <span>{assigned.room}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="h-full border border-dashed border-white/5 hover:border-white/10 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-all text-[8px] font-black uppercase tracking-widest text-[#DEFF9A]/60">
                                {isAvailableDestination ? '🎯 SELECCIONAR' : '➕ ASIGNAR'}
                              </div>
                            )}

                            {/* Floating Confirm relocation button matching screenshot */}
                            {isSelectedDestination && touchSelectedSource && (
                              <div className="absolute inset-1 bg-black/90 backdrop-blur-sm border-2 border-emerald-400 rounded-xl flex flex-col items-center justify-center gap-1.5 z-10 p-1 animate-in zoom-in duration-200">
                                <span className="text-[8px] font-black text-[#DEFF9A] uppercase tracking-widest leading-none">DESTINO OK</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const success = performAssignment(
                                      touchSelectedSource.subjectCode,
                                      day,
                                      block.id,
                                      undefined,
                                      touchSelectedSource.originSlot
                                    );
                                    if (success) {
                                      setTouchSelectedSource(null);
                                      setTouchSelectedDestination(null);
                                    }
                                  }}
                                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-[#DEFF9A] text-black text-[9px] font-black uppercase rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)] tracking-wider transition-all uppercase"
                                >
                                  MOVE HERE?
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* MODAL: CLICK TO QUICK ASIGN */}
      <AnimatePresence>
        {clickToAssignMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              className="bg-[#0b1214] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/30 text-left">
                <div>
                  <span className="text-[#DEFF9A] text-[8px] font-mono font-black uppercase tracking-[0.25em]">ASIGNAR ACCIÓN DIRECTA</span>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">
                    {clickToAssignMode.day} - {blocks.find(b => b.id === clickToAssignMode.blockId)?.time}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setClickToAssignMode(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                </button>
              </div>

              <div className="p-6 space-y-5 text-left">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Asignar Aula / Salón</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {classrooms.map((room) => (
                      <button
                        key={room}
                        type="button"
                        onClick={() => setSelectedRoom(room)}
                        className={`p-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                          selectedRoom === room
                            ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/50 text-[#DEFF9A]'
                            : 'bg-black/20 border-white/5 text-white/40 hover:text-white'
                        }`}
                      >
                        {room}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#DEFF9A]">Selecciona la Asignatura Disponible</label>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {pendingSubjects.map((sub) => {
                      const finished = sub.assignedHours >= sub.totalHours;
                      return (
                        <button
                          key={sub.code}
                          disabled={finished}
                          type="button"
                          onClick={() => {
                            performAssignment(sub.code, clickToAssignMode.day as any, clickToAssignMode.blockId, selectedRoom);
                            setClickToAssignMode(null);
                          }}
                          className={`w-full p-3.5 rounded-2xl border bg-black/40 hover:bg-black/75 transition-all flex items-center justify-between gap-4 text-left ${
                            finished ? 'opacity-30 pointer-events-none' : 'border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono font-black text-[#DEFF9A]">{sub.code}</span>
                              <span className="text-white text-xs font-black uppercase">{sub.name}</span>
                            </div>
                            <span className="text-white/40 text-[8px] uppercase tracking-wider block mt-0.5">{sub.teacherName}</span>
                          </div>

                          <div className="text-[8px] font-mono font-black tracking-widest text-white/60 border border-white/5 bg-black px-2 py-1 rounded">
                            {sub.assignedHours}/{sub.totalHours} HRS
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setClickToAssignMode(null)}
                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all hover:bg-white/10"
                  >
                    Salir
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
