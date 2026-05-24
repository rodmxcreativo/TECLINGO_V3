/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  User, 
  Search, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Download, 
  UserCheck, 
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Days of the week matching original layout
const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'] as const;

export interface Teacher {
  id: string;
  name: string;
  spec: string;
  maxHours: number;
}

export interface Subject {
  code: string;
  name: string;
  hours: number;
}

interface PreDistributionGridProps {
  subjects?: Subject[];
  teachers?: Teacher[];
  qualifiedMap?: Record<string, string[]>;
  onSync?: (assignments: Record<string, string>) => void;
  activeGroup?: {
    id: string;
    name: string;
    code: string;
    semester: number;
    shift: string;
    capacity: number;
  } | null;
}

// Default data mirroring the design
const DEFAULT_TEACHERS: Teacher[] = [
  { id: 'ana_lopez', name: 'Mtra. Ana López', spec: 'Inglés / Idiomas', maxHours: 16 },
  { id: 'chucho_serna', name: 'Mtro. Chucho Serna', spec: 'Redes y Telecomunicaciones', maxHours: 18 },
  { id: 'roberto_her', name: 'Mtro. Roberto Hernández', spec: 'Ciencias de la Computación / IA', maxHours: 20 },
  { id: 'sofia_ruiz', name: 'Mtra. Sofía Ruiz', spec: 'Ingeniería de Software / Web', maxHours: 14 },
  { id: 'luis_garcia', name: 'Mtro. Luis García', spec: 'Hardware y Arquitectura', maxHours: 12 },
];

const DEFAULT_SUBJECTS: Subject[] = [
  { code: 'TEC-001', name: 'TecLingo AI (Inglés I)', hours: 4 },
  { code: 'ISC-201', name: 'Práctica de Redes', hours: 4 },
  { code: 'ISC-202', name: 'Estructura de Datos', hours: 4 },
  { code: 'ISC-203', name: 'Programación Web', hours: 5 },
  { code: 'ISC-204', name: 'Arquitectura de Computadoras', hours: 4 },
  { code: 'ISC-205', name: 'Inteligencia Artificial Avanzada', hours: 3 },
];

const DEFAULT_QUALIFIED_MAP: Record<string, string[]> = {
  'TEC-001': ['ana_lopez', 'sofia_ruiz'],
  'ISC-201': ['chucho_serna', 'luis_garcia'],
  'ISC-202': ['roberto_her', 'chucho_serna'],
  'ISC-203': ['sofia_ruiz', 'roberto_her', 'ana_lopez'],
  'ISC-204': ['luis_garcia', 'chucho_serna'],
  'ISC-205': ['roberto_her', 'sofia_ruiz'],
};

export default function PreDistributionGrid({
  subjects = DEFAULT_SUBJECTS,
  teachers = DEFAULT_TEACHERS,
  qualifiedMap = DEFAULT_QUALIFIED_MAP,
  onSync,
  activeGroup
}: PreDistributionGridProps) {
  
  const [matrix, setMatrix] = useState<Record<string, Record<string, string>>>(( ) => {
    const saved = localStorage.getItem('pre_distribution_matrix_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Set some nice initial dummy data
    return {
      'TEC-001': { 'LUNES': 'ana_lopez', 'MARTES': 'ana_lopez' },
      'ISC-201': { 'MIÉRCOLES': 'chucho_serna' },
      'ISC-202': { 'JUEVES': 'roberto_her' },
      'ISC-203': {},
      'ISC-204': {},
      'ISC-205': {}
    };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCell, setActiveCell] = useState<{ code: string; day: string } | null>(null);
  const [showExportModal, setShowExportModal] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Keyboard navigation & highlight states for Search
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const popoverRef = useRef<HTMLDivElement>(null);

  const subjectCodesStr = subjects.map(s => s.code).join(',');
  const onSyncRef = useRef(onSync);

  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  // Save matrix to local storage on change
  useEffect(() => {
    localStorage.setItem('pre_distribution_matrix_v1', JSON.stringify(matrix));
    
    // Auto-update standard format dist_assignments if sync callback exists
    const currentOnSync = onSyncRef.current;
    if (currentOnSync) {
      const standardSync: Record<string, string> = {};
      subjects.forEach(sub => {
        const assignedInDay = Object.values(matrix[sub.code] || {}) as string[];
        // Find the first assigned teacher in the matrix for this subject to use as pre-assigned
        const firstTeacher = assignedInDay.find(td => td);
        standardSync[sub.code] = firstTeacher || '';
      });
      currentOnSync(standardSync);
    }
  }, [matrix, subjectCodesStr]);

  // Click outside listener for the popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActiveCell(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute stats in real-time
  // Total assigned hours per subject
  const getSubjectAssignedHours = (code: string) => {
    const dayObj = matrix[code] || {};
    return Object.values(dayObj).filter(id => id).length;
  };

  // Total assigned hours per teacher in active matrix
  const getTeacherAssignedHoursInMatrix = (teacherId: string) => {
    let count = 0;
    Object.keys(matrix).forEach(code => {
      Object.keys(matrix[code] || {}).forEach(day => {
        if (matrix[code][day] === teacherId) count++;
      });
    });
    return count;
  };

  // Sum of hours assigned for each column day
  const getDayTotalHours = (day: string) => {
    let sum = 0;
    Object.keys(matrix).forEach(code => {
      if (matrix[code] && matrix[code][day]) {
        sum += 1; // Each day block is 1 hour
      }
    });
    return sum;
  };

  // Business Rules checking
  const maxDailyLimit = 8;

  const handleAssign = (teacherId: string | null) => {
    if (!activeCell) return;
    const { code, day } = activeCell;
    
    setMatrix(prev => {
      const subjectRow = { ...(prev[code] || {}) };
      if (teacherId) {
        subjectRow[day] = teacherId;
      } else {
        delete subjectRow[day];
      }
      return {
        ...prev,
        [code]: subjectRow
      };
    });
    
    setActiveCell(null);
    setSearchQuery('');
  };

  // Filter qualified and search lists
  const getQualifiedTeachersForSubject = (code: string) => {
    const qIds = qualifiedMap[code] || [];
    return teachers.filter(t => qIds.includes(t.id));
  };

  // Filter teachers for the search dropdown/popover, excluding those that reached their limits
  const getSearchedTeachersAndFiltered = (code: string) => {
    return teachers.filter(t => {
      // Rule limit check: if teacher reaches limit, hide from list (unless already assigned to this cell)
      const currentHours = getTeacherAssignedHoursInMatrix(t.id);
      const isCurrentlyAssignedToThisCell = activeCell && matrix[activeCell.code]?.[activeCell.day] === t.id;
      if (currentHours >= t.maxHours && !isCurrentlyAssignedToThisCell) {
        return false;
      }
      
      const text = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(text) || t.spec.toLowerCase().includes(text);
    });
  };

  // Keyboard navigation within the filtered search list
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!activeCell) return;
    const list = getSearchedTeachersAndFiltered(activeCell.code);
    if (list.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % list.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + list.length) % list.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (list[highlightedIndex]) {
        handleAssign(list[highlightedIndex].id);
      }
    } else if (e.key === 'Escape') {
      setActiveCell(null);
    }
  };

  // Validation function
  const validarDistribucion = () => {
    const errores: string[] = [];
    const advertencias: string[] = [];

    // Rule 1: check if all subjects met their weekly load
    subjects.forEach(sub => {
      const assigned = getSubjectAssignedHours(sub.code);
      if (assigned < sub.hours) {
        errores.push(`La asignatura ${sub.name} (${sub.code}) tiene asignadas ${assigned} horas, de un total requerido de ${sub.hours} horas.`);
      } else if (assigned > sub.hours) {
        errores.push(`La asignatura ${sub.name} (${sub.code}) supera el límite semanal con ${assigned}/${sub.hours} asignadas.`);
      }
    });

    // Rule 2: check day limits
    DAYS.forEach(day => {
      const dailyHours = getDayTotalHours(day);
      if (dailyHours > maxDailyLimit) {
        errores.push(`El límite de horas diario para el grupo se ha superado el ${day} con ${dailyHours}/${maxDailyLimit} horas.`);
      }
    });

    // Rule 3: check teacher weekly limits
    teachers.forEach(t => {
      const assigned = getTeacherAssignedHoursInMatrix(t.id);
      if (assigned > t.maxHours) {
        errores.push(`El docente ${t.name} supera su límite máximo permitido de ${t.maxHours} horas, tiene ${assigned} horas asignadas.`);
      } else if (assigned > 0 && assigned < 4) {
        advertencias.push(`El docente ${t.name} tiene poca carga asignada (${assigned} de ${t.maxHours} horas).`);
      }
    });

    return {
      valido: errores.length === 0,
      errores,
      advertencias
    };
  };

  // Generate JSON plan for Scheduler engine
  const exportarParaMotorHorarios = () => {
    const distribution: any[] = [];
    Object.keys(matrix).forEach(code => {
      Object.keys(matrix[code] || {}).forEach(day => {
        const teacherId = matrix[code][day];
        if (teacherId) {
          distribution.push({
            asignatura_id: code,
            docente_id: teacherId,
            dia: day,
            bloques: 1
          });
        }
      });
    });

    const payload = activeGroup ? {
      grupo_id: activeGroup.id,
      nombre_grupo: activeGroup.name,
      grado: `${activeGroup.semester}° Semestre`,
      turno: activeGroup.shift,
      capacidad: activeGroup.capacity,
      distribucion: distribution
    } : {
      distribucion: distribution
    };

    const val = validarDistribucion();
    setShowExportModal({
      json: JSON.stringify(payload, null, 2),
      valido: val.valido,
      errores: val.errores,
      advertencias: val.advertencias
    });
  };

  const copyToClipboard = () => {
    if (!showExportModal) return;
    navigator.clipboard.writeText(showExportModal.json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Info Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-4 mb-2">
        <div>
          <span className="text-cyan-400 text-[9px] font-mono font-black uppercase tracking-[0.3em]">
            GRID DE PRE-DISTRIBUCIÓN
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex flex-wrap items-center gap-2">
            {activeGroup 
              ? (
                <>
                  <span>Distribución Matricial para:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 uppercase tracking-wider">
                    {activeGroup.name}
                  </span>
                  <span className="text-white/30 text-lg font-light">|</span>
                  <span className="text-sm font-bold text-white/60 lowercase tracking-normal">
                    {activeGroup.semester}° semestre • {activeGroup.shift}
                  </span>
                </>
              ) : (
                "Distribución Matricial por Días"
              )
            }
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">
            Asigna las horas semanales requeridas en los días de clase evitando empalmes y sobrecargas de horario.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={exportarParaMotorHorarios}
            className="px-5 py-3 rounded-2xl bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-95 cursor-pointer haptic-press"
          >
            <Download size={14} strokeWidth={3} /> Validar y Exportar JSON
          </button>
        </div>
      </div>

      {/* Grid Table Container */}
      <div className="w-full rounded-3xl border border-white/10 bg-black/45 shadow-2xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            
            {/* Header Columns */}
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 text-left text-[10px] font-bold uppercase font-mono text-white/40 tracking-widest min-w-[240px]">
                  Asignatura / Plan ISC
                </th>
                <th className="p-4 text-center text-[10px] font-bold uppercase font-mono text-white/40 tracking-widest">
                  Hrs Req.
                </th>
                {DAYS.map((day) => {
                  const dayTotalHours = getDayTotalHours(day);
                  const isDayOverLimit = dayTotalHours > maxDailyLimit;
                  return (
                    <th 
                      key={day} 
                      className="p-4 text-center min-w-[130px]"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase font-mono text-white/70 tracking-widest block">
                          {day}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          isDayOverLimit 
                            ? 'bg-red-500/10 border-red-500/25 text-red-400 animate-pulse' 
                            : 'bg-white/5 border-white/5 text-slate-400'
                        }`}>
                          {dayTotalHours} / {maxDailyLimit} hrs
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body rows */}
            <tbody className="divide-y divide-white/5">
              {subjects.map((sub) => {
                const assigned = getSubjectAssignedHours(sub.code);
                const isCompleted = assigned >= sub.hours;
                
                return (
                  <tr 
                    key={sub.code} 
                    className={`transition-all duration-300 hover:bg-white/[0.01] ${
                      isCompleted ? 'opacity-60 bg-white/[0.01]' : ''
                    }`}
                  >
                    
                    {/* Subject info cells */}
                    <td className="p-4 text-left">
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-[9px] font-black tracking-wider text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/15 shrink-0 select-none">
                          {sub.code}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-black text-white uppercase truncate">{sub.name}</p>
                          <p className="text-white/30 text-[8px] font-mono font-bold uppercase tracking-wider mt-0.5">
                            Carga Semestral • Sem. 2
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Progress tracking badge cells */}
                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`text-[10px] font-mono font-black ${
                          isCompleted ? 'text-emerald-400' : 'text-[#DEFF9A]'
                        }`}>
                          {assigned} / {sub.hours}
                        </span>
                        <div className="w-12 h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              isCompleted ? 'bg-emerald-400' : 'bg-[#DEFF9A]'
                            }`}
                            style={{ width: `${Math.min(100, (assigned / sub.hours) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Class scheduling cells */}
                    {DAYS.map((day) => {
                      const teacherId = matrix[sub.code]?.[day];
                      const currentTeacher = teachers.find(t => t.id === teacherId);
                      const isCellActive = activeCell?.code === sub.code && activeCell?.day === day;
                      
                      // Identify column-specific day sum limits check for highlights
                      const dayHrs = getDayTotalHours(day);
                      const isGroupDayFull = dayHrs >= maxDailyLimit;
                      
                      // Row limit status checks
                      const isCompletedAndCellEmpty = isCompleted && !teacherId;

                      // Display character/badge
                      return (
                        <td 
                          key={day} 
                          className="p-3 relative text-center"
                        >
                          <div className="relative">
                            <button
                              type="button"
                              disabled={isCompletedAndCellEmpty || (isGroupDayFull && !teacherId)}
                              onClick={() => {
                                setActiveCell({ code: sub.code, day });
                                setHighlightedIndex(0);
                              }}
                              className={`w-full py-3.5 px-2 rounded-2xl border text-center transition-all duration-300 haptic-press shrink-0 text-xs font-black uppercase tracking-wider outline-none flex flex-col items-center justify-center gap-1 min-h-[58px] select-none ${
                                teacherId
                                  ? 'bg-cyan-500/10 border-cyan-400/30 text-[#DEFF9A] shadow-[inset_0_0_10px_rgba(34,211,238,0.05)] hover:border-cyan-400'
                                  : isCompletedAndCellEmpty
                                    ? 'bg-white/[0.01] border-white/5 text-white/20 select-none cursor-default'
                                    : isGroupDayFull
                                      ? 'bg-red-500/5 border-red-500/15 text-red-400/40 cursor-not-allowed select-none'
                                      : 'bg-black/20 border-white/5 text-white/30 hover:bg-black/40 hover:border-white/20 hover:text-white/60 cursor-pointer'
                              }`}
                              title={
                                isCompletedAndCellEmpty
                                  ? '✅ Carga semanal completada'
                                  : isGroupDayFull && !teacherId
                                    ? '⚠️ Límite diario del grupo alcanzado'
                                    : teacherId
                                      ? `Asignado: ${currentTeacher?.name}`
                                      : 'No Asignado (Mapear bloque)'
                              }
                            >
                              {teacherId ? (
                                <>
                                  <span className="text-[10px] font-black tracking-tight">{currentTeacher?.name.split(' ').slice(-1)[0]}</span>
                                  <span className="text-[7.5px] font-mono font-bold text-white/50">{currentTeacher?.spec.split('/')[0]}</span>
                                </>
                              ) : isCompletedAndCellEmpty ? (
                                <span className="text-[8.5px] font-bold text-white/20">Carga Lista</span>
                              ) : isGroupDayFull ? (
                                <span className="text-[8.5px] font-bold text-red-400/40">Día Lleno</span>
                              ) : (
                                <span className="text-[14px]">...</span>
                              )}
                            </button>

                            {/* Dropdown / Popover Relative */}
                            <AnimatePresence>
                              {isCellActive && (
                                <div 
                                  ref={popoverRef}
                                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#0b1219] border border-white/10 p-4 rounded-3xl z-40 shadow-2xl space-y-3 font-sans text-left"
                                >
                                  {/* Title block */}
                                  <div className="border-b border-white/5 pb-2">
                                    <span className="text-[7.5px] font-black text-cyan-400 uppercase tracking-widest font-mono block">
                                      {day} • {sub.code}
                                    </span>
                                    <h4 className="text-xs font-black text-white uppercase truncate">{sub.name}</h4>
                                  </div>

                                  {/* SECTION A: Pre-Asignados */}
                                  <div className="space-y-1.5">
                                    <span className="text-[8px] font-mono font-black text-white/30 uppercase tracking-widest block">
                                      ➤ Docentes Calificados:
                                    </span>
                                    {getQualifiedTeachersForSubject(sub.code).length === 0 ? (
                                      <p className="text-[9px] text-white/30 font-bold uppercase italic p-1 pl-2">Sin catálogo mapeado</p>
                                    ) : (
                                      <div className="space-y-1 max-h-24 overflow-y-auto">
                                        {getQualifiedTeachersForSubject(sub.code).map((teacher) => {
                                          const assignedGlobal = getTeacherAssignedHoursInMatrix(teacher.id);
                                          const isFull = assignedGlobal >= teacher.maxHours;
                                          return (
                                            <button 
                                              key={teacher.id}
                                              type="button"
                                              disabled={isFull && matrix[sub.code]?.[day] !== teacher.id}
                                              onClick={() => handleAssign(teacher.id)}
                                              className={`w-full p-2 rounded-xl text-left text-[11px] font-bold transition flex items-center justify-between cursor-pointer ${
                                                matrix[sub.code]?.[day] === teacher.id
                                                  ? 'bg-cyan-500/10 border border-cyan-400/35 text-cyan-300'
                                                  : isFull
                                                    ? 'opacity-40 bg-black/5 text-white/20 cursor-not-allowed'
                                                    : 'bg-black/30 border border-white/5 text-white/70 hover:bg-white/5 hover:text-white'
                                              }`}
                                            >
                                              <span className="truncate">{teacher.name}</span>
                                              <span className="text-[8.5px] font-mono font-black shrink-0 text-white/40">
                                                {assignedGlobal}/{teacher.maxHours}h
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>

                                  {/* SECTION B: Buscar Otro Docente */}
                                  <div className="space-y-2 pt-1 border-t border-white/5">
                                    <span className="text-[8px] font-mono font-black text-white/30 uppercase tracking-widest block">
                                      ➤ Buscar Otro Docente:
                                    </span>
                                    <div className="relative">
                                      <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                      <input 
                                        type="text"
                                        placeholder="Ej. Serna, López..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                          setSearchQuery(e.target.value);
                                          setHighlightedIndex(0);
                                        }}
                                        onKeyDown={handleSearchKeyDown}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-8 pr-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-cyan-500/50"
                                      />
                                    </div>

                                    {/* Typeahead Search Results dropdown */}
                                    <div className="max-h-24 overflow-y-auto space-y-1">
                                      {getSearchedTeachersAndFiltered(sub.code).map((teacher, index) => {
                                        const assignedGlob = getTeacherAssignedHoursInMatrix(teacher.id);
                                        return (
                                          <button 
                                            key={teacher.id}
                                            type="button"
                                            onClick={() => handleAssign(teacher.id)}
                                            className={`w-full p-2 rounded-xl text-left text-[10px] font-medium transition flex items-center justify-between cursor-pointer ${
                                              matrix[sub.code]?.[day] === teacher.id
                                                ? 'bg-cyan-500/10 text-cyan-300'
                                                : highlightedIndex === index
                                                  ? 'bg-white/10 text-white font-bold'
                                                  : 'bg-black/20 text-white/60 hover:bg-white/5 hover:text-white'
                                            }`}
                                          >
                                            <div className="truncate flex-1">
                                              <div className="font-bold truncate text-white text-[10.5px]">{teacher.name}</div>
                                              <div className="text-[8px] text-white/30 truncate">{teacher.spec}</div>
                                            </div>
                                            <span className="text-[8px] font-mono text-white/40 shrink-0 pr-1 select-none">
                                              {assignedGlob}/{teacher.maxHours}h
                                            </span>
                                          </button>
                                        );
                                      })}
                                      {getSearchedTeachersAndFiltered(sub.code).length === 0 && searchQuery && (
                                        <p className="text-[8.5px] text-white/30 text-center py-2 uppercase font-black">Sin resultados</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Delete Button */}
                                  {teacherId && (
                                    <button
                                      type="button"
                                      onClick={() => handleAssign(null)}
                                      className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center transition border border-red-500/15 cursor-pointer mt-1"
                                    >
                                      Remover Docente
                                    </button>
                                  )}

                                </div>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      );
                    })}

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* Grid Totals/KPIs board panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI: Docentes Libres */}
        <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 text-left flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
            <UserCheck size={20} />
          </div>
          <div>
            <span className="text-white/30 text-[8px] font-black uppercase tracking-widest block">Capacidad Docentes</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-white">
                {teachers.filter(t => getTeacherAssignedHoursInMatrix(t.id) < t.maxHours).length} / {teachers.length}
              </span>
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase">Disponibles</span>
            </div>
          </div>
        </div>

        {/* KPI: Grupos Completados */}
        <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 text-left flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-white/30 text-[8px] font-black uppercase tracking-widest block">Asignaturas Cubiertas</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-white">
                {subjects.filter(s => getSubjectAssignedHours(s.code) >= s.hours).length} / {subjects.length}
              </span>
              <span className="text-[9px] font-mono text-[#DEFF9A] font-bold uppercase">Listas</span>
            </div>
          </div>
        </div>

        {/* KPI: Conflictos activos */}
        <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 text-left flex items-center gap-4">
          {validarDistribucion().errores.length > 0 ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center text-red-400 animate-pulse">
                <ShieldAlert size={20} />
              </div>
              <div>
                <span className="text-white/30 text-[8px] font-black uppercase tracking-widest block">Advertencias / Bloqueos</span>
                <div className="flex items-baseline gap-1.5 mt-0.5 animate-pulse">
                  <span className="text-xl font-black text-red-400">
                    {validarDistribucion().errores.length}
                  </span>
                  <span className="text-[9px] font-mono text-red-400 font-bold uppercase">Detectados</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                <CheckCircle size={20} />
              </div>
              <div>
                <span className="text-white/30 text-[8px] font-black uppercase tracking-widest block">Conflictos / Reglas</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-black text-emerald-400">0</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Estado Verde</span>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* EXPORT AND PLAN COMPONENT OVERLAY SHOWER */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0b1219] border border-white/10 rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20">
                <div>
                  <span className="text-cyan-400 text-[8px] font-mono font-black uppercase tracking-[0.3em]">
                    MOTOR DE ASIGNACIÓN INTEGRADO
                  </span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    Validación y Estructura JSON
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportModal(null);
                    setCopied(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body stats block */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[460px]">
                
                {/* Validation messages list widget */}
                <div className="space-y-2.5">
                  <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block">
                    Reporte de Validación de Reglas:
                  </span>
                  {showExportModal.errores.length === 0 && showExportModal.advertencias.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                      <CheckCircle size={16} /> ¡Cero advertencias detectadas! El plan es 100% válido y listo para el secuenciador.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {showExportModal.errores.map((err: string, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-300 text-xs font-mono flex items-start gap-2 leading-relaxed">
                          <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-400 animate-pulse" />
                          <span>{err}</span>
                        </div>
                      ))}
                      {showExportModal.advertencias.map((warn: string, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-start gap-2 leading-relaxed">
                          <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-400" />
                          <span>{warn}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* JSON preview */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block">
                      Insumo estructurado de distribución para Motor Horarios:
                    </span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] font-black uppercase tracking-widest transition cursor-pointer border border-white/5"
                    >
                      {copied ? '✅ Copiado' : '📋 Copiar Código'}
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono p-4 rounded-2xl bg-black/60 border border-white/5 text-teal-400 overflow-auto max-h-48 whitespace-pre">
                    {showExportModal.json}
                  </pre>
                </div>

              </div>

              {/* Footer action */}
              <div className="p-6 border-t border-white/5 bg-black/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowExportModal(null)}
                  className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
