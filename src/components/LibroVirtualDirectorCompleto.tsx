/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Video, 
  ExternalLink, 
  Clock, 
  Calendar,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Layers,
  BookMarked,
  Printer,
  FileText,
  HelpCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mallaCurricularModulo1, SemanaMalla } from '../data/mallaCurricularModulo1';

// Academic assets generator to match the student book perfectly
function getWeeklyAcademicAssets(semanaNum: number, ejeTematico: string, kpi: string) {
  switch (semanaNum) {
    case 1:
      return {
        classwork: [
          'Completa tu perfil personal: "Good morning! My name is ____, I am ____ years old, and I am from ____."',
          'Identifica el error en el pronombre: "Mary is from Canada. He is an engineer."',
          'Pronuncia en voz alta los pronombres clave: I, You, He, She, It, We, They.'
        ],
        homework: 'Elabora una nota breve presentándote formalmente e indicando tu nacionalidad y un saludo de cortesía. Grábate leyendo el enunciado y expórtalo a la bitácora.'
      };
    case 2:
      return {
        classwork: [
          'Rellena usando "this", "that", "these", "those": "_____ is my pen here on the desk, and _____ are your notebooks on the bookshelf."',
          'Nombra 5 objetos escolares de uso diario en menos de 10 segundos.',
          'Forma el plural correcto de: box, pencil, brush, classroom.'
        ],
        homework: 'Haz un inventario descriptivo detallando 6 objetos diferentes en tu entorno de estudio desde casa con sus adjetivos y pronombres demostrativos.'
      };
    case 3:
      return {
        classwork: [
          'Aplica el genitivo sajón (\'s): "The house of Robert" ➔ "_____", "The cat of my sister" ➔ "_____".',
          'Elige el adjetivo posesivo adecuado: "My parents are lawyers. _____ office is downtown."',
          'Dibuja o numera a 4 miembros de una familia hipotética expresando su parentesco.'
        ],
        homework: 'Dibuja tu propio árbol familiar simplificado y escribe al menos un enunciado descriptivo para cada familiar utilizando his, her o the genitive case.'
      };
    case 4:
      return {
        classwork: [
          'Corrige las mayúsculas (TOEFL): "he speaks french, spanish and english in mexico."',
          'Usa las preposiciones "from" e "in": "We are originally _____ Germany, but we currently work _____ Guadalajara."',
          'Menciona las nacionalidades correspondientes a: Brazil, China, Italy, Japan, Turkey.'
        ],
        homework: 'Consigue y completa el boleto migratorio simulado de entrada al país sin errores de mayúsculas ni omisiones. Graba tu audio de control TOEFL.'
      };
    case 11:
      return {
        classwork: [
          'Resuelve 2 cuestionamientos prácticos interactivos sobre: "Medios de Transporte y Traslados en la Ciudad" (e.g. ¿Cómo dices "ir en metro al trabajo" y "tomar un taxi en la esquina"?).',
          'Busca 3 palabras clave en el glosario de apoyo y compártelas en clase con tus compañeros.',
          'Usa las preposiciones de movimiento adecuadas ("to", "across", "through"): "Walk _____ the street and take the subway _____ the museum."',
          'Genera un diálogo corto de 4 líneas aplicando la gramática explicada en el bloque (por ejemplo, pedir indicaciones para llegar a TecLingo).',
          'Completa tu autodiagnóstico: describe de manera breve en inglés cuál es tu medio de transporte diario favorito y por qué.'
        ],
        homework: 'Redacta un texto descriptivo e instructivo detallando paso a paso cuál es tu trayecto diario habitual, usando verbos de transporte y preposiciones de dirección.'
      };
    default:
      return {
        classwork: [
          `Resuelve 2 cuestionamientos prácticos interactivos sobre: "${ejeTematico.split(',')[0]}".`,
          'Busca 3 palabras clave en el glosario de apoyo y compártelas en clase con tus compañeros.',
          'Genera un diálogo corto de 4 líneas aplicando la gramática explicada en el bloque.'
        ],
        homework: `Redacta un párrafo corto de 50 palabras que consolide como evidencia de portafolio el siguiente indicador de avance semanal: "${kpi}".`
      };
  }
}

export function LibroVirtualDirectorCompleto() {
  const [semanaIndice, setSemanaIndice] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Selector for student tab viewpoint on left page (Teoría, Ejercicios, Tareas)
  const [innerTabLeft, setInnerTabLeft] = useState<'teoria' | 'ejercicios' | 'tareas'>('teoria');

  // PDF Export model states
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');

  const activeSemana = mallaCurricularModulo1[semanaIndice] || mallaCurricularModulo1[0];

  // Search through all 18 weeks
  const searchResults = mallaCurricularModulo1.filter(sem => 
    sem.eje_tematico.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sem.unidad_libro.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `semana ${sem.semana}`.includes(searchQuery.toLowerCase())
  );

  const goNext = () => {
    if (semanaIndice < mallaCurricularModulo1.length - 1) {
      setSemanaIndice(prev => prev + 1);
      setInnerTabLeft('teoria');
    }
  };

  const goPrev = () => {
    if (semanaIndice > 0) {
      setSemanaIndice(prev => prev - 1);
      setInnerTabLeft('teoria');
    }
  };

  const selectDropdownSemana = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const semIndex = Number(e.target.value);
    setSemanaIndice(semIndex);
    setInnerTabLeft('teoria');
  };

  const triggerExport = () => {
    setIsExporting(true);
    setExportProgress(10);
    setExportStatus('Ensamblando portafolios docentes de TecLingo...');

    const timer = setInterval(() => {
      setExportProgress(curr => {
        if (curr >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExporting(false);
            window.print();
          }, 800);
          return 100;
        }
        let next = curr + Math.floor(Math.random() * 25) + 5;
        if (next > 100) next = 100;

        if (next < 40) {
          setExportStatus('Anclando claves de respuestas síncronas...');
        } else if (next < 80) {
          setExportStatus('Generando bitácoras de avance de los alumnos...');
        } else {
          setExportStatus('Consolidando KPI e indicadores curriculares SEP...');
        }
        return next;
      });
    }, 180);
  };

  const assets = getWeeklyAcademicAssets(activeSemana.semana, activeSemana.eje_tematico, activeSemana.kpi);

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          #printable-teacher-area, #printable-teacher-area * {
            visibility: visible;
          }
          #printable-teacher-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Premium Header HUD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2 border-b border-white/5 print:hidden">
        <div>
          <h2 className="text-[#10b981] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            MÓDULO DE SEGUIMIENTO INTEGRADO
          </h2>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic font-sans">
            LIBRO VIRTUAL <span className="text-[#10b981]">MAESTRO</span>
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-2 max-w-2xl font-medium">
            Sincronía docente premium en tiempo real. Visualiza el libro digital del alumno a la izquierda (con pestañas adaptativas) y tu guía de planeación operativa por horas a la derecha.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setShowPdfModal(true)}
            className="px-4 py-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-mono text-xs font-black flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition active:scale-95 cursor-pointer shadow-lg"
          >
            <Printer size={14} />
            IMPRIMIR GUÍA DOCENTE
          </button>

          <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-[#10b981]/20 flex items-center gap-3 font-mono justify-center">
            <Layers size={14} className="text-[#10b981]" />
            <div className="text-left">
              <p className="text-[#10b981] text-[8px] font-black uppercase tracking-widest leading-none">Semestre Activo</p>
              <p className="text-white text-[10px] font-bold">Mód 1 — 18 Semanas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip (Search, Jump, and Page Navigation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#0a1818]/90 border border-[#10b981]/15 p-4 rounded-3xl shadow-lg relative items-center print:hidden">
        {/* Weekly search input */}
        <div className="lg:col-span-5 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            <Search size={16} />
          </span>
          <input 
            type="text"
            placeholder="Buscar tema o palabra clave..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />

          {/* Search suggestions popover */}
          <AnimatePresence>
            {showSearchResults && searchQuery.trim().length > 0 && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setShowSearchResults(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#0c2323] border border-white/10 shadow-2xl p-2 max-h-56 overflow-y-auto custom-scrollbar"
                >
                  {searchResults.length === 0 ? (
                    <p className="p-3 text-[10px] text-white/30 font-mono text-center">No hay coincidencias</p>
                  ) : (
                    searchResults.map((s, idx) => {
                      const realIdx = mallaCurricularModulo1.findIndex(org => org.semana === s.semana);
                      return (
                        <button
                          key={s.semana}
                          onClick={() => {
                            setSemanaIndice(realIdx);
                            setSearchQuery('');
                            setShowSearchResults(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-[#10b981]/10 flex justify-between items-center transition cursor-pointer"
                        >
                          <div>
                            <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase block">
                              Semana {s.semana}
                            </span>
                            <span className="text-xs font-bold text-white block truncate max-w-[220px]">
                              {s.eje_tematico}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-white/40">{s.paginas}</span>
                        </button>
                      );
                    })
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Quick jump select dropdown */}
        <div className="lg:col-span-4 flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/40 font-bold uppercase shrink-0">Ir a Semana:</span>
          <select
            value={semanaIndice}
            onChange={selectDropdownSemana}
            className="bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono w-full cursor-pointer"
          >
            {mallaCurricularModulo1.map((s, idx) => (
              <option key={s.semana} value={idx}>
                Semana {s.semana.toString().padStart(2, '0')} ({s.fechas}) — {s.eje_tematico.substring(0, 16)}...
              </option>
            ))}
          </select>
        </div>

        {/* Navigation manual triggers */}
        <div className="lg:col-span-3 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={goPrev}
            disabled={semanaIndice === 0}
            className="p-2.5 bg-white/5 border border-white/10 hover:border-white/15 text-white/60 hover:text-white rounded-xl disabled:opacity-25 transition active:scale-95 flex items-center justify-center cursor-pointer"
            title="Semana Anterior"
          >
            <ArrowLeft size={14} />
          </button>
          
          <span className="text-[11px] font-mono text-white/50 px-2 font-bold uppercase shrink-0">
            Semana {activeSemana.semana}/18
          </span>

          <button
            onClick={goNext}
            disabled={semanaIndice === mallaCurricularModulo1.length - 1}
            className="p-2.5 bg-white/5 border border-white/10 hover:border-white/15 text-white/60 hover:text-white rounded-xl disabled:opacity-25 transition active:scale-95 flex items-center justify-center cursor-pointer"
            title="Siguiente Semana"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* DUAL-PAGE SPREAD MASTER VIEW (SIMULATOR CARD) */}
      <div 
        id="printable-teacher-area"
        className="relative border-4 border-[#071d1d] bg-[#030e0e] rounded-3xl shadow-2xl p-2 md:p-3 overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none"
      >
        {/* Ring binders simulation down the middle (hidden in printout) */}
        <div className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-gradient-to-r from-black/80 via-black/20 to-black/80 z-20 pointer-events-none hidden md:block border-x border-white/[0.02] print:hidden" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 relative z-10 min-h-[500px]">
          
          {/* ================= LEFT PAGE: SYNCHRONIZED STUDENT VIEW WITH INTERACTIVE TABS ================= */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`teacher-left-${activeSemana.semana}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="p-5 md:p-6 rounded-2xl bg-black/40 border border-white/[0.05] flex flex-col justify-between text-left print:bg-white print:text-black print:border-b-2 print:border-gray-200"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2.5 mb-4 text-white/40 print:border-gray-200">
                  <span className="flex items-center gap-1.5 uppercase font-bold text-emerald-400">
                    <BookMarked size={12} />
                    Libro Alumno (Espejo)
                  </span>
                  <span>{activeSemana.paginas}</span>
                </div>

                {/* Left Page tabs mimic */}
                <div className="flex gap-1 mb-5 bg-black/60 p-1 rounded-xl border border-white/5 print:hidden">
                  <button
                    onClick={() => setInnerTabLeft('teoria')}
                    className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                      innerTabLeft === 'teoria' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    📖 Teoría
                  </button>
                  <button
                    onClick={() => setInnerTabLeft('ejercicios')}
                    className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                      innerTabLeft === 'ejercicios' 
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-400/20' 
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    📝 Práctica
                  </button>
                  <button
                    onClick={() => setInnerTabLeft('tareas')}
                    className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                      innerTabLeft === 'tareas' 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-400/20' 
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    🏠 Tarea
                  </button>
                </div>

                {/* Sub-components rendering based on selected Tab */}
                {(innerTabLeft === 'teoria' || window.matchMedia('print').matches) && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-black uppercase text-[#DEFF9A] bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 px-2 py-0.5 rounded print:bg-gray-100 print:text-black">
                        {activeSemana.unidad_libro}
                      </span>
                      <h3 className="text-base font-black text-white uppercase italic tracking-tight mt-1 print:text-black print:not-italic">
                        {activeSemana.eje_tematico}
                      </h3>
                      <p className="text-[10px] text-white/40 font-mono italic print:text-gray-500">
                        Periodo Escolar: {activeSemana.fechas}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-black/50 border border-white/5 text-xs text-white/70 leading-relaxed space-y-2.5 print:bg-gray-50 print:border-gray-200 print:text-black">
                      <span className="text-[9.5px] font-mono font-black text-emerald-400 block uppercase tracking-wider">
                        📝 NOTA METODOLÓGICA DE AUDITORÍA:
                      </span>
                      <p className="text-[11px]">
                        El alumno está visualizando este bloque conceptual directamente en su interfaz interactiva del curso. El objetivo es proporcionar un marco referencial léxico-gramatical inmediato.
                      </p>
                      <p className="text-[10.5px] text-[#DEFF9A] font-semibold font-mono uppercase bg-black/30 p-2 rounded border border-white/5 print:border-gray-200 print:bg-gray-100 print:text-emerald-700">
                        Evidencia: {activeSemana.kpi}
                      </p>
                    </div>
                  </div>
                )}

                {innerTabLeft === 'ejercicios' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-indigo-400">
                      <FileText size={14} />
                      <h4 className="text-xs font-black font-mono uppercase tracking-wider">
                        Classwork Oficial en Salón
                      </h4>
                    </div>
                    <p className="text-[11px] text-white/50 font-sans">
                      Ejercicios didácticos sincrónicos que los alumnos están resolviendo en su libro:
                    </p>

                    <div className="space-y-2 mt-2">
                      {assets.classwork.map((exercise, index) => (
                        <div key={index} className="p-3 rounded-xl bg-black/60 border border-indigo-500/10 font-mono text-xs text-white/70 flex items-start gap-2">
                          <span className="text-indigo-400 font-medium">{index + 1}.</span>
                          <span className="leading-relaxed">{exercise}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {innerTabLeft === 'tareas' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <HelpCircle size={14} />
                      <h4 className="text-xs font-black font-mono uppercase tracking-wider">
                        Homework / Asignación en Casa
                      </h4>
                    </div>
                    <p className="text-[11px] text-white/50 font-sans">
                      Petición de portafolio para el autoestudio asíncrono del estudiante:
                    </p>

                    <div className="p-4 rounded-xl bg-black/60 border border-amber-500/10 text-xs font-mono text-white/80 leading-relaxed space-y-1.5 mt-1">
                      <p className="text-[9px] text-amber-400 uppercase tracking-widest font-black">
                        ENTREGABLE DEL ALUMNO:
                      </p>
                      <p>{assets.homework}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom page count */}
              <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase font-bold print:border-gray-200 print:text-gray-400">
                <span>Pauta Curricular Base</span>
                <span>Pág. {(activeSemana.semana * 2) - 1}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ================= RIGHT PAGE: DETAILED LESSON PLAN & VIDEOS ================= */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`teacher-right-${activeSemana.semana}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="p-5 md:p-6 rounded-2xl bg-black/40 border border-white/[0.05] flex flex-col justify-between text-left print:bg-white print:text-black print:border-b-2 print:border-gray-200"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2.5 mb-4 text-white/40 print:border-gray-200">
                  <span className="flex items-center gap-1.5 uppercase font-bold text-amber-500">
                    <Clock size={12} />
                    Bitácora de Sesión por Horas
                  </span>
                  <span>4 Horas Totales</span>
                </div>

                {/* Hours sequence list */}
                <div className="space-y-3">
                  {activeSemana.horas.map((h) => (
                    <div 
                      key={h.hora} 
                      className="p-3 rounded-xl bg-black/60 border border-white/5 hover:border-[#10b981]/30 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:bg-gray-50 print:border-gray-200 print:text-black"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 text-[8px] font-mono bg-amber-500/10 text-amber-400 rounded font-bold uppercase tracking-wider print:bg-gray-200 print:text-black">
                            Hora {h.hora}
                          </span>
                          <span className="text-[9.5px] text-white/40 font-mono italic print:text-gray-500">{h.track}</span>
                        </div>
                        <h4 className="text-xs font-extrabold text-white leading-tight print:text-black">
                          {h.leccion}
                        </h4>
                        <p className="text-[10px] text-white/60 leading-normal print:text-gray-600">
                          {h.enfoque}
                        </p>
                      </div>

                      {/* Video clip trigger (hidden in printing) */}
                      <a
                        href={`https://youtube.com/watch?v=${h.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/15 text-red-400 rounded-lg text-[8.5px] font-mono font-black flex items-center gap-1 transition-all shrink-0 uppercase self-start sm:self-center print:hidden"
                        title="Abrir Video de Apoyo Directo"
                      >
                        <Video size={10} />
                        VIDEO {h.videoId}
                        <ExternalLink size={8} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom page count */}
              <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase font-bold print:border-gray-200 print:text-gray-400">
                <span>TECLINGO PRO GUIDELINES</span>
                <span>Pág. {(activeSemana.semana * 2)}</span>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* ================= PDF EXPORTING MODAL (MAESTRO) ================= */}
      <AnimatePresence>
        {showPdfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden bg-[#0a1818] border border-indigo-500/20 rounded-3xl p-6 shadow-2xl space-y-5 text-left"
            >
              <button
                onClick={() => { if (!isExporting) setShowPdfModal(false); }}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-lg transition"
                disabled={isExporting}
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <Printer size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Impresión Docente de Portafolios
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono tracking-wider leading-none">
                    GUÍA DE REFERENCIA FÍSICA • SEMANA {activeSemana.semana}
                  </p>
                </div>
              </div>

              {isExporting ? (
                <div className="space-y-4 p-4 rounded-xl bg-black/45 border border-white/5 text-center">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      className="h-full bg-indigo-400 rounded-full"
                      animate={{ width: `${exportProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                    <span>{exportStatus}</span>
                    <strong className="text-indigo-400">{exportProgress}%</strong>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 font-sans">
                  <p className="text-xs text-white/75 leading-relaxed">
                    Prepararás un dossier completo para impresión físico del docente. La diagramación se optimizará automáticamente para papel bond A4 / Carta con fondo claro de alta definición.
                  </p>
                  
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-2 text-xs">
                    <p className="font-mono text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest leading-none">
                      Contenido incluído en la guía:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-white/60 text-[11px]">
                      <li>Unidad académica: {activeSemana.unidad_libro}</li>
                      <li>Claves de ejercicios (classwork) e instrucciones de tareas</li>
                      <li>Bitácora de planeación de 4 horas por sesión</li>
                      <li>KPI curriculares autorizados por la SEP</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-[10px] text-amber-200/70 flex gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p className="leading-snug">
                      Recuerda habilitar "Gráficos de fondo" en la configuración de la impresora de tu sistema para no omitir las líneas de separación del folio curricular.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold rounded-2xl transition cursor-pointer"
                  disabled={isExporting}
                >
                  Cancelar
                </button>
                <button
                  onClick={triggerExport}
                  className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-mono text-xs font-black uppercase rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  disabled={isExporting}
                >
                  <Printer size={13} />
                  Proceder
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
