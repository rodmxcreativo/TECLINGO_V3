/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Video, 
  ArrowLeft, 
  ArrowRight,
  BookMarked,
  Printer,
  Download,
  X,
  FileText,
  AlertCircle,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  List,
  Layers,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mallaCurricularModulo1, SemanaMalla } from '../data/mallaCurricularModulo1';
import { reactivosPorSemana, Reactivo } from '../data/reactivosWorkbook';

// Detailed grammar lessons simulator for the 18 weeks (TOEFL Prep Focus)
function getLessonTheoryExplanation(semanaNum: number, ejeTematico: string): {
  grammarFocus: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  bullets: string[];
  toeflTip: string;
} {
  switch (semanaNum) {
    case 1:
      return {
        grammarFocus: "THE MANDATORY SUBJECT PRONOUNS (Sujeto Obligatorio)",
        tableHeaders: ["Subject Pronoun", "Verbo BE (Simple)", "Example Syntax"],
        tableRows: [
          ["I", "am", "I am a support engineer."],
          ["You", "are", "You are ready for TOEFL."],
          ["He / She / It", "is", "It is bound to port 3000."],
          ["We / They", "are", "They are from Monterrey."]
        ],
        bullets: [
          "Regla Base: En inglés, a diferencia del español, NUNCA se omite el pronombre sujeto. 'Es un ingeniero' se traduce obligatoriamente como 'He/She is an engineer'.",
          "El pronombre 'It' es vital para sistemas informáticos, servidores y estados operativos de error.",
          "Fórmulas de Cortesía: Complementa las interacciones con 'Nice to meet you', 'Good morning' y formas formales."
        ],
        toeflTip: "TOEFL iBT Key: En la sección de Structure & Written Expression, los reactivos suelen inducir al error omitiendo el sujeto 'It' antes de verbos meteorológicos o de estado. Recuerda siempre verificar su presencia."
      };
    case 2:
      return {
        grammarFocus: "DEMONSTRATIVES AND ARTICLES (This, That, These, Those)",
        tableHeaders: ["Type", "Singular", "Plural", "Relative Distance"],
        tableRows: [
          ["Near (Cerca)", "This (This pen)", "These (These boxes)", "Immediate interaction zone"],
          ["Far (Lejos)", "That (That system)", "Those (Those consoles)", "Auxiliary or remote server zone"]
        ],
        bullets: [
          "Regla de Artículos: Usa 'A' antes de consonantes (a laptop) y 'An' antes de vocales (an error).",
          "Para plurales irregulares o terminados en s, ch, sh, x, z, agrega '-es' (box ➔ boxes, brush ➔ brushes).",
          "Los pronombres demostrativos clasifican objetos físicos del aula y componentes de software."
        ],
        toeflTip: "TOEFL iBT Key: Presta atención a la correspondencia entre adjetivos demostrativos plurales ('These') y sustantivos singulares o viceversa — es una trampa recurrente para identificar fallas en concordancia de número."
      };
    case 3:
      return {
        grammarFocus: "THE GENITIVE CASE & POSSESSIVES ('s vs Of)",
        tableHeaders: ["Owner Profile", "Grammar Rule", "Example Output"],
        tableRows: [
          ["Singular Person", "Add 's", "Robert's workstation"],
          ["Plural ends in s", "Add only '", "The engineers' database"],
          ["Inanimate objects", "Prefer 'of'", "The port of the local proxy"]
        ],
        bullets: [
          "Possessive Adjectives (My, Your, His, Her, Its, Our, Their) indican pertenencia inequívoca.",
          "El Genitivo Sajón ('s) expresa relaciones familiares directas. Evita la traducción literal de 'La oficina de mi padre' (The office of my father) ➔ Prefiere 'My father's office'.",
          "No dupliques la posesión: 'Her Robert's cat' es incorrecto."
        ],
        toeflTip: "TOEFL iBT Key: En redacción formal, el uso excesivo de la preposición 'of' denota falta de fluidez natural. Reemplazarlo apropiadamente con el genitivo sajón o adjetivos posesivos aumenta la puntuación en cohesión."
      };
    case 4:
      return {
        grammarFocus: "CAPITALIZATION & PREPOSITIONS OF PLACE",
        tableHeaders: ["Category", "Grammar Rule", "Toefl Compliance Example"],
        tableRows: [
          ["Languages", "Always Capitalized", "I speak fluent English and Spanish."],
          ["Countries", "Always Capitalized", "We are originally from Mexico."],
          ["Origin Prep.", "Use 'From'", "She is from Monterrey, Canada."],
          ["Location Prep.", "Use 'In'", "We are currently living in Guadalajara."]
        ],
        bullets: [
          "Uso estricto de mayúsculas: Nacionalidades (French, British), Idiomas (Japanese), Ciudades y Países.",
          "La preposición 'From' denota procedencia u origen geográfico de datos o personas.",
          "'In' se utiliza para ciudades, países y continentes para delimitar posicionamiento operativo."
        ],
        toeflTip: "TOEFL iBT Key: La sección de Writing califica de forma muy estricta el uso de mayúsculas para idiomas ('english' con minúscula se considera error ortográfico grave). Revisa siempre tu texto final."
      };
    default:
      return {
        grammarFocus: `CONSOLIDATED ANALYSIS: ${ejeTematico.split(',')[0].toUpperCase()}`,
        tableHeaders: ["Parameter", "Target Grammatical Core", "Pedagogical Standard"],
        tableRows: [
          ["Active Structure", "Grammar block aligned to SEP guidelines", "Level A1.1 Common European Framework"],
          ["KPI Metric", "Speech timing, fluency under 1 minute limits", "TOEFL Primary and TOEFL Junior guidelines"]
        ],
        bullets: [
          "Repasa la unidad correspondiente para estructurar respuestas espontáneas y precisas.",
          "Fomenta la audición asidua de pistas fonológicas para erradicar el acento regional en ambientes corporativos.",
          "Integra estas variables en tus reportes semanales de evidencias escolares."
        ],
        toeflTip: "TOEFL iBT Key: En las tareas integradas síncronas, priorizar la síntesis directa del texto sobre la redundancia verbal te asegura el máximo rango de aceptación por los evaluadores."
      };
  }
}

// Academic exercises generators based on weekly parameters
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

export function LibroVirtualAlumnoCompleto() {
  const STORAGE_KEY = 'libro_alumno_comprension';

  // State maps for comprehension checklist (Weeks read/unread)
  const [comprensionMap, setComprensionMap] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading student book progress:', e);
    }
    return { 1: true };
  });

  // Current selected week active (index 0 to 17 representing Weeks 1 to 18)
  const [semanaActivaIndice, setSemanaActivaIndice] = useState<number>(0);

  // Layout View mode toggle ('pdf' | 'duplex')
  const [viewMode, setViewMode] = useState<'pdf' | 'duplex'>('pdf');

  // Zoom management inside the PDF viewer (80% to 150%)
  const [zoomPdf, setZoomPdf] = useState<number>(100);

  // Fullscreen view toggle of the PDF viewer sheet
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Active sub-section tab underneath the PDF Viewer ('ejercicios' | 'tareas')
  const [subSeccion, setSubSeccion] = useState<'ejercicios' | 'tareas'>('ejercicios');

  // WORKBOOK REAL-TIME PERSISTENT STATE AND CAPTURING
  const WORKBOOK_STORAGE_KEY = 'teclingo_alumno_workbook_answers_v2';

  const [workbookAnswers, setWorkbookAnswers] = useState<Record<number, {
    classwork?: Record<string, any>;
    homework: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem(WORKBOOK_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading workbook answers:', e);
    }
    return {};
  });

  const [feedbackMap, setFeedbackMap] = useState<Record<number, {
    classworkSaved: boolean;
    homeworkSaved: boolean;
  }>>({});

  const [feedbackIA, setFeedbackIA] = useState<Record<number, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('teclingo_alumno_workbook_feedback');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [cargandoIA, setCargandoIA] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem(WORKBOOK_STORAGE_KEY, JSON.stringify(workbookAnswers));
  }, [workbookAnswers]);

  useEffect(() => {
    localStorage.setItem('teclingo_alumno_workbook_feedback', JSON.stringify(feedbackIA));
  }, [feedbackIA]);

  const saveClasswork = (semanaNum: number) => {
    setFeedbackMap(prev => ({
      ...prev,
      [semanaNum]: { ...prev[semanaNum], classworkSaved: true }
    }));
    setTimeout(() => {
      setFeedbackMap(prev => ({
        ...prev,
        [semanaNum]: { ...prev[semanaNum], classworkSaved: false }
      }));
    }, 4000);
  };

  const saveHomework = (semanaNum: number) => {
    setFeedbackMap(prev => ({
      ...prev,
      [semanaNum]: { ...prev[semanaNum], homeworkSaved: true }
    }));
    setTimeout(() => {
      setFeedbackMap(prev => ({
        ...prev,
        [semanaNum]: { ...prev[semanaNum], homeworkSaved: false }
      }));
    }, 4000);
  };

  const updateClassworkAnswerVal = (semanaNum: number, reactivoId: string, flagOrVal: string) => {
    setWorkbookAnswers(prev => {
      const weekData = prev[semanaNum] || { homework: '' };
      const weekClasswork = weekData.classwork || {};
      const reactivoData = weekClasswork[reactivoId] || {};
      return {
        ...prev,
        [semanaNum]: {
          ...weekData,
          classwork: {
            ...weekClasswork,
            [reactivoId]: {
              ...reactivoData,
              valor: flagOrVal
            }
          }
        }
      };
    });
  };

  const handleInputChange = (semanaNum: number, reactivoId: string, campo: string, valor: string) => {
    setWorkbookAnswers(prev => {
      const weekData = prev[semanaNum] || { homework: '' };
      const weekClasswork = weekData.classwork || {};
      const reactivoData = weekClasswork[reactivoId] || {};
      return {
        ...prev,
        [semanaNum]: {
          ...weekData,
          classwork: {
            ...weekClasswork,
            [reactivoId]: {
              ...reactivoData,
              [campo]: valor
            }
          }
        }
      };
    });
  };

  const updateHomeworkAnswer = (semanaNum: number, value: string) => {
    setWorkbookAnswers(prev => {
      const weekData = prev[semanaNum] || { homework: '' };
      return {
        ...prev,
        [semanaNum]: {
          ...weekData,
          homework: value
        }
      };
    });
  };

  const procesarConAsistenteIA = (semanaNum: number, reactivo: Reactivo) => {
    const id = reactivo.id;
    const key = `${semanaNum}_${id}`;
    const datosSemana = workbookAnswers[semanaNum]?.classwork?.[id] || {};

    setCargandoIA(prev => ({ ...prev, [key]: true }));

    setTimeout(() => {
      let retro = '';
      
      if (reactivo.tipo === 'inputs-dobles') {
        const valA = (datosSemana.a || '').trim();
        const valB = (datosSemana.b || '').trim();
        if (!valA && !valB) {
          retro = "🤖 Por favor, completa los campos antes de consultar al Tutor IA.";
        } else {
          retro = "🤖 Estructura analizada. Verbos base e identificadores sintácticos correctos para el inicio de módulo.";
        }
      } else if (reactivo.tipo === 'glosario') {
        const count = ['v1', 'v2', 'v3'].filter(v => (datosSemana[v] || '').trim().length > 0).length;
        if (count < 3) {
          retro = `🤖 Has completado ${count} de 3 campos. Asegúrate de ingresar las 3 palabras del glosario para obtener la puntuación completa.`;
        } else {
          retro = "🤖 Vocabulario y verbos de acción validados con el diccionario escolar del Aula TecLingo.";
        }
      } else if (reactivo.tipo === 'dialogo') {
        const val1 = (datosSemana.l1 || '').trim();
        const val3 = (datosSemana.l3 || '').trim();
        if (!val1 || !val3) {
          retro = "🤖 Por favor, completa tus partes del diálogo intermedio para activar la fluidez comunicativa con la IA.";
        } else {
          retro = `🤖 ¡Interacción conversacional terminada con éxito! Diálogo fluido integrado en tu bitácora de la Semana ${semanaNum}.`;
        }
      } else if (reactivo.tipo === 'error-check') {
        const texto = (datosSemana.valor || '').toLowerCase();
        if (!texto.trim()) {
          retro = "🤖 El campo está vacío. Ingresa tu oración analítica para validarla.";
        } else if (reactivo.config.errorKeywords?.some(wk => texto.includes(wk))) {
          retro = reactivo.config.errorMessage || "🤖 Se detectó un error estructural común. Por favor, revisa las reglas gramaticales.";
        } else if (reactivo.config.correctKeywords && !reactivo.config.correctKeywords.some(wk => texto.includes(wk))) {
          retro = reactivo.config.errorMessage || `🤖 Recuerda utilizar la palabra clave recomendada en este reactivo estructurado del examen.`;
        } else {
          retro = "🤖 ¡Estructura gramatical excelente! Cumple con los requisitos para tus reactivos del examen estándar.";
        }
      } else {
        const texto = (datosSemana.valor || '').trim();
        if (texto.length < 15) {
          retro = "🤖 Tu redacción es un poco corta. Intenta expandir tu idea para demostrar mayor fluidez léxica.";
        } else {
          retro = "🤖 Longitud y nivel léxico auditados con éxito. Cumple con la fluidez requerida para tu aprobación.";
        }
      }

      setFeedbackIA(prev => {
        const weekFeed = prev[semanaNum] || {};
        return {
          ...prev,
          [semanaNum]: {
            ...weekFeed,
            [id]: retro
          }
        };
      });
      setCargandoIA(prev => ({ ...prev, [key]: false }));
    }, 1200);
  };

  const renderClassworkWorkbook = (semanaNum: number) => {
    const reactivos = reactivosPorSemana[semanaNum] || [];
    const isSaved = feedbackMap[semanaNum]?.classworkSaved;

    if (reactivos.length === 0) {
      return (
        <div className="space-y-4 font-sans text-left">
          <p className="text-xs text-white/60 leading-relaxed">
            Resuelve estos ejercicios prácticos en tiempo real y guárdalos para acumular calificación síncrona:
          </p>
          <div className="text-center py-8 text-xs font-mono text-white/40 bg-black/40 border border-white/5 rounded-2xl">
            [ No hay reactivos interactivos configurados para esta semana ]
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 font-sans text-left">
        <p className="text-xs text-white/50 leading-relaxed">
          Resuelve los {reactivos.length} reactivos estructurados para la Semana {semanaNum.toString().padStart(2, '0')} interactuando con los campos de captura:
        </p>
        
        <div className="space-y-4">
          {reactivos.map((reactivo) => {
            const dataS = workbookAnswers[semanaNum]?.classwork?.[reactivo.id] || {};
            const key = `${semanaNum}_${reactivo.id}`;
            const feedbackText = feedbackIA[semanaNum]?.[reactivo.id];
            const isLoading = cargandoIA[key];

            return (
              <div key={reactivo.id} className="p-4 bg-black/40 border border-indigo-500/10 hover:border-indigo-500/20 transition-all rounded-2xl flex flex-col gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {reactivo.titulo}
                  </span>
                  <p className="text-[11.5px] text-white/90 leading-relaxed pt-1">
                    {reactivo.instruccion}
                  </p>
                </div>

                {/* 1. INPUTS-DOBLES INTERFACE */}
                {reactivo.tipo === 'inputs-dobles' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pl-2">
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] text-white/50 font-mono block">
                        {reactivo.config.labelA}
                      </span>
                      <input 
                        type="text" 
                        value={dataS.a || ''} 
                        onChange={(e) => handleInputChange(semanaNum, reactivo.id, 'a', e.target.value)}
                        placeholder={reactivo.config.placeholderA || "Escribe tu respuesta..."} 
                        className="w-full bg-[#030e0e] border border-white/10 focus:border-[#10b981] outline-none rounded-xl p-2 text-xs text-white font-mono placeholder-white/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] text-white/50 font-mono block">
                        {reactivo.config.labelB}
                      </span>
                      <input 
                        type="text" 
                        value={dataS.b || ''} 
                        onChange={(e) => handleInputChange(semanaNum, reactivo.id, 'b', e.target.value)}
                        placeholder={reactivo.config.placeholderB || "Escribe tu respuesta..."} 
                        className="w-full bg-[#030e0e] border border-white/10 focus:border-[#10b981] outline-none rounded-xl p-2 text-xs text-white font-mono placeholder-white/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* 2. GLOSARIO INTERFACE */}
                {reactivo.tipo === 'glosario' && (
                  <div className="grid grid-cols-3 gap-3 pl-2">
                    {['v1', 'v2', 'v3'].map((vId, i) => (
                      <div key={vId} className="space-y-1">
                        <span className="text-[9px] text-white/40 font-mono block text-center">Palabra {i + 1}</span>
                        <input 
                          type="text" 
                          value={dataS[vId] || ''} 
                          onChange={(e) => handleInputChange(semanaNum, reactivo.id, vId, e.target.value)}
                          placeholder={reactivo.config.placeholder || "Buscar..."} 
                          className="w-full bg-[#030e0e] border border-white/10 focus:border-[#10b981] outline-none rounded-xl p-2 text-center text-xs text-white font-mono placeholder-white/25 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. DIALOGO INTERFACE */}
                {reactivo.tipo === 'dialogo' && (
                  <div className="space-y-2.5 pl-2 font-mono text-[11px]">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <span className="text-[10px] text-indigo-400 font-bold min-w-[150px] shrink-0">
                        {reactivo.config.label1 || "01. Tú:"}
                      </span>
                      <input 
                        type="text" 
                        value={dataS.l1 || ''} 
                        onChange={(e) => handleInputChange(semanaNum, reactivo.id, 'l1', e.target.value)}
                        placeholder="Escribe tu frase de apertura..." 
                        className="flex-1 bg-[#030e0e] border border-white/10 focus:border-[#10b981] outline-none rounded-xl p-1.5 px-2.5 text-xs text-white font-mono placeholder-white/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-indigo-950/10 p-1.5 rounded-xl border border-indigo-505/5">
                      <span className="text-[10px] text-white/40 font-black min-w-[150px] shrink-0">
                        {reactivo.config.label2 || "02. Tutor IA:"}
                      </span>
                      <input 
                        type="text" 
                        value={feedbackText ? reactivo.config.promptIA1 : ''} 
                        readOnly
                        placeholder="[ Esperando que inicies la conversación ]" 
                        className="flex-1 bg-transparent border-none text-white/60 text-xs font-sans outline-none cursor-not-allowed select-none placeholder-white/20"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <span className="text-[10px] text-indigo-400 font-bold min-w-[150px] shrink-0">
                        {reactivo.config.label3 || "03. Tú:"}
                      </span>
                      <input 
                        type="text" 
                        value={dataS.l3 || ''} 
                        onChange={(e) => handleInputChange(semanaNum, reactivo.id, 'l3', e.target.value)}
                        placeholder="Escribe tu frase de seguimiento..." 
                        className="flex-1 bg-[#030e0e] border border-white/10 focus:border-[#10b981] outline-none rounded-xl p-1.5 px-2.5 text-xs text-white font-mono placeholder-white/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-indigo-950/10 p-1.5 rounded-xl border border-indigo-505/5">
                      <span className="text-[10px] text-white/40 font-black min-w-[150px] shrink-0">
                        {reactivo.config.label4 || "04. Tutor IA:"}
                      </span>
                      <input 
                        type="text" 
                        value={feedbackText ? reactivo.config.promptIA2 : ''} 
                        readOnly
                        placeholder="[ Esperando cierre del diálogo ]" 
                        className="flex-1 bg-transparent border-none text-white/60 text-xs font-sans outline-none cursor-not-allowed select-none placeholder-white/20"
                      />
                    </div>
                  </div>
                )}

                {/* 4. ERROR-CHECK OR TEXTAREA */}
                {(reactivo.tipo === 'error-check' || reactivo.tipo === 'textarea') && (
                  <div className="pl-2">
                    {reactivo.tipo === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={dataS.valor || ''}
                        onChange={(e) => updateClassworkAnswerVal(semanaNum, reactivo.id, e.target.value)}
                        placeholder={reactivo.config.placeholder || "Escribe tu respuesta analítica..."}
                        className="w-full bg-[#030e0e] border border-white/10 focus:border-[#10b981] outline-none rounded-xl p-2.5 text-xs text-white font-mono placeholder-white/20 transition-all resize-none font-sans"
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={dataS.valor || ''} 
                        onChange={(e) => updateClassworkAnswerVal(semanaNum, reactivo.id, e.target.value)}
                        placeholder={reactivo.config.placeholder || "Escribe tu respuesta analítica..."}
                        className="w-full bg-[#030e0e] border border-white/10 focus:border-[#10b981] outline-none rounded-xl p-2 px-3 text-xs text-white font-mono placeholder-white/20 transition-all"
                      />
                    )}
                  </div>
                )}

                {/* IA ACTION ROW */}
                <div className="pt-1.5 flex flex-col gap-2">
                  <button 
                    type="button"
                    onClick={() => procesarConAsistenteIA(semanaNum, reactivo)}
                    className="self-start text-[9.5px] font-mono font-black bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span>Consultar Tutor IA 🤖</span>
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {feedbackText && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="text-[11px] font-mono leading-relaxed text-indigo-300 bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/10 flex items-start gap-2">
                          <span className="text-xs">👋</span>
                          <span>{feedbackText}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUBMIT ROW */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Respuestas seguras archivadas en TecLingo</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto self-end justify-end">
            {isSaved && (
              <span className="text-emerald-400 font-mono text-[10px] font-bold animate-fadeIn animate-pulse">
                ✓ Práctica Guardada con Éxito
              </span>
            )}
            <button 
              type="button"
              onClick={() => saveClasswork(semanaNum)}
              className="w-full sm:w-auto bg-indigo-600/80 hover:bg-indigo-600 text-white text-[10px] font-mono font-black px-4 py-2 rounded-xl transition shadow-lg shrink-0 cursor-pointer border border-white/5 active:scale-95"
            >
              Guardar Trabajo de Clase
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHomeworkWorkbook = (semanaNum: number) => {
    const assets = getWeeklyAcademicAssets(semanaNum, mallaCurricularModulo1[semanaNum - 1].eje_tematico, mallaCurricularModulo1[semanaNum - 1].kpi);
    const state = workbookAnswers[semanaNum] || {
      homework: ''
    };

    const isSaved = feedbackMap[semanaNum]?.homeworkSaved;

    return (
      <div className="space-y-4 font-sans text-left">
        <p className="text-xs text-white/60 leading-relaxed">
          Sube tus evidencias semanales para auditar y acreditar tus horas de autoestudio obligatorio:
        </p>
        <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded">
              PORTAFOLIO DE EVIDENCIAS DIGITAL
            </span>
            <span className="text-white/30 text-[9px] font-mono">Auditoría TOEFL iBT</span>
          </div>
          
          <p className="text-[11.5px] text-white/80 font-sans leading-relaxed pl-1">
            {assets.homework}
          </p>

          <div className="space-y-2 pt-1">
            <span className="text-[10px] text-white/50 font-mono block">Ingresa tu redacción de tarea ó transcripción oral de control:</span>
            <textarea
              rows={4}
              value={state.homework || ''}
              onChange={(e) => updateHomeworkAnswer(semanaNum, e.target.value)}
              placeholder="Desarrolla detalladamente tu entregable escrito o sube tu reporte semanal..."
              className="w-full bg-[#030e0e] border border-white/5 focus:border-amber-400 outline-none rounded-xl p-3 text-xs text-white font-mono placeholder-white/20 transition-all resize-y custom-scrollbar"
            />
          </div>

          <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[10px] text-white/40 font-mono">
            *Seguridad Académica:* Al entregar tu evidencia, nuestro filtro de IA TecLingo procesará la sintaxis para validar la fluidez del vocabulario.
          </div>
        </div>

        {/* COMPREHENSIVE SUBMIT ACTIONS ROW */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Preparado para acreditación escolar oficial</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto self-end justify-end">
            {isSaved && (
              <span className="text-[#10b981] font-mono text-[10px] font-bold">
                ✓ Enviado al Portafolio
              </span>
            )}
            <button 
              type="button"
              onClick={() => saveHomework(semanaNum)}
              className="w-full sm:w-auto bg-amber-600/80 hover:bg-amber-600 text-slate-900 text-[10px] font-mono font-black px-4 py-2 rounded-xl transition shadow-lg shrink-0 cursor-pointer border border-white/5 active:scale-95"
            >
              Subir Tarea a Portafolio
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Print drawer/modal triggers and simulation state
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [exportType, setExportType] = useState<'digital' | 'workbook' | 'both'>('digital');

  const pageContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize comprehensionMap with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comprensionMap));
  }, [comprensionMap]);

  const toggleSemanaCompletada = (semanaNum: number) => {
    setComprensionMap(prev => ({
      ...prev,
      [semanaNum]: !prev[semanaNum]
    }));
  };

  const totalSemanas = mallaCurricularModulo1.length;
  const totalComprendidadas = Object.values(comprensionMap).filter(Boolean).length;
  const porcentajeProgreso = Math.round((totalComprendidadas / totalSemanas) * 100);

  // Week details calculations
  const semanaActual = mallaCurricularModulo1[semanaActivaIndice];
  const leftAssets = getWeeklyAcademicAssets(semanaActual.semana, semanaActual.eje_tematico, semanaActual.kpi);
  const theoryDetails = getLessonTheoryExplanation(semanaActual.semana, semanaActual.eje_tematico);

  // Duplex Spread calculation indices
  // There are 9 spreads total (Spread Index 0 represents weeks 1-2, Spread Index 1 represents 3-4, etc.)
  const spreadIndex = Math.floor(semanaActivaIndice / 2);
  const spreadLeftWeek = mallaCurricularModulo1[spreadIndex * 2];
  const spreadRightWeek = mallaCurricularModulo1[spreadIndex * 2 + 1];

  // Individual page tabs inside Duplex mode
  const [innerTabLeft, setInnerTabLeft] = useState<'teoria' | 'ejercicios' | 'tareas'>('teoria');
  const [innerTabRight, setInnerTabRight] = useState<'teoria' | 'ejercicios' | 'tareas'>('teoria');

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const semNum = Number(e.target.value);
    setSemanaActivaIndice(semNum - 1);
  };

  const handlePageNext = () => {
    if (viewMode === 'pdf') {
      if (semanaActivaIndice < totalSemanas - 1) {
        setSemanaActivaIndice(prev => prev + 1);
      }
    } else {
      if (spreadIndex < 8) {
        setSemanaActivaIndice((spreadIndex + 1) * 2);
        setInnerTabLeft('teoria');
        setInnerTabRight('teoria');
      }
    }
  };

  const handlePagePrev = () => {
    if (viewMode === 'pdf') {
      if (semanaActivaIndice > 0) {
        setSemanaActivaIndice(prev => prev - 1);
      }
    } else {
      if (spreadIndex > 0) {
        setSemanaActivaIndice((spreadIndex - 1) * 2);
        setInnerTabLeft('teoria');
        setInnerTabRight('teoria');
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const zoomIn = () => setZoomPdf(prev => Math.min(prev + 10, 150));
  const zoomOut = () => setZoomPdf(prev => Math.max(prev - 10, 80));
  const zoomReset = () => setZoomPdf(100);

  // PDF Compilation & Download simulator
  const startPdfSimulation = () => {
    setIsExporting(true);
    setExportProgress(5);
    setExportStatus('Ensamblando portadas del libro base de la materia...');

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            window.print();
          }, 850);
          return 100;
        }
        
        let next = prev + Math.floor(Math.random() * 20) + 5;
        if (next > 100) next = 100;

        if (next < 30) {
          setExportStatus('Compilando esquemas léxico-gramaticales de la SEP...');
        } else if (next < 60) {
          setExportStatus(`Mapeando actividades del ${exportType === 'workbook' ? 'Cuaderno Práctico' : 'Libro de Texto'}...`);
        } else if (next < 85) {
          setExportStatus('Anidando enlaces multimedia e hipervínculos TOEFL...');
        } else {
          setExportStatus('Comprimiendo material didáctico de alta resolución (vectorial)...');
        }

        return next;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Printable high-fidelity CSS configurations */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          #print-area-active-folio, #print-area-active-folio * {
            visibility: visible;
          }
          #print-area-active-folio {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: #0c151c !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Primary Dashboard Header with Progress Hub */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#10b981]/15 via-[#0d2e2e]/10 to-transparent border border-[#10b981]/25 shadow-xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 no-print">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#10b981]/15 text-[#10b981] font-mono text-[9px] font-black px-2 py-0.5 rounded border border-[#10b981]/25 uppercase tracking-wider">
              MATERIAL DIDÁCTICO OFICIAL
            </span>
            <span className="text-white/40 text-[10px] font-mono">• MÓDULO 1: EVERYDAY ENGLISH • SEP-V</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">
            BIBLIOTECA & VISOR CURRICULAR DIGITAL
          </h2>
          <p className="text-xs text-white/50 max-w-xl leading-relaxed">
            Explora las guías oficiales basadas en la malla SEP de forma interactiva. Alterna entre la experiencia física del visor A4 de un libro impreso, y el cuaderno de prácticas modulares.
          </p>
        </div>

        {/* Dynamic HUD Tracking Circle & Active Actions */}
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Progress Circular HUD */}
          <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2.5 rounded-2xl shrink-0">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="20" cy="20" r="16" className="stroke-white/10" strokeWidth="3" fill="none" />
                <circle cx="20" cy="20" r="16" className="stroke-[#10b981] transition-all duration-500" strokeWidth="3" fill="none" strokeDasharray={`${Math.PI * 2 * 16}`} strokeDashoffset={`${Math.PI * 2 * 16 * (1 - porcentajeProgreso / 100)}`} />
              </svg>
              <span className="text-[10px] font-mono font-black text-white">{porcentajeProgreso}%</span>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono font-bold leading-tight">Tu Progreso</p>
              <p className="text-xs font-sans text-white font-extrabold">{totalComprendidadas} de {totalSemanas} Leídas</p>
            </div>
          </div>

          <button 
            onClick={() => {
              setExportType('digital');
              setShowPdfModal(true);
            }}
            className="flex-1 sm:flex-initial bg-[#10b981] text-[#052222] hover:bg-[#34d399] font-mono text-xs font-black px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] active:scale-95 uppercase border border-emerald-400/25 cursor-pointer shrink-0"
          >
            <Printer size={15} />
            Imprimir Guía A4
          </button>
        </div>
      </div>

      {/* Tactile Book Selection Selector Shelf & Mode Toggle */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-[#051515]/80 border border-[#10b981]/15 p-4 rounded-2xl shadow-inner no-print">
        {/* Navigation jump drop down */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] rounded-xl">
            <BookMarked size={16} />
          </div>
          <div className="text-left shrink-0">
            <p className="text-white text-xs font-bold font-sans">Visualizador Académico</p>
            <p className="text-[10px] text-white/40 font-mono">
              Semana {semanaActual.semana.toString().padStart(2, '0')} • {semanaActual.unidad_libro}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-1 sm:ml-4">
            <span className="text-[10px] font-mono text-white/40 font-bold uppercase">Ir a Semana:</span>
            <select
              value={semanaActual.semana}
              onChange={handleDropdownSelect}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10b981] font-mono font-semibold cursor-pointer"
            >
              {mallaCurricularModulo1.map((s) => (
                <option key={s.semana} value={s.semana} className="bg-[#0c1a1a] text-white">
                  Semana {s.semana.toString().padStart(2, '0')} — {s.unidad_libro.split(':')[1]?.trim() || s.unidad_libro}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mode Toggle tabs */}
        <div className="flex items-center bg-black/50 p-1 border border-white/5 rounded-xl self-end lg:self-center">
          <button
            onClick={() => setViewMode('pdf')}
            className={`px-4 py-2 rounded-lg text-xs font-black font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'pdf'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <FileText size={13} />
            Visor PDF
          </button>
          <button
            onClick={() => setViewMode('duplex')}
            className={`px-4 py-2 rounded-lg text-xs font-black font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'duplex'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <BookOpen size={13} />
            Tactile Booklet
          </button>
        </div>
      </div>

      {/* PRIMARY RENDER ZONE: TWO DIFFERENT VIEWS */}
      
      {/* 1. VISOR PDF PROFESIONAL EXPERIENCE */}
      {viewMode === 'pdf' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
          
          {/* INDEX COLUMN (LEFT 3 GRID SPACES) */}
          <div className="lg:col-span-3 bg-black/40 border border-white/5 p-4 rounded-3xl space-y-4 max-h-[750px] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black font-mono text-[#10b981] tracking-widest uppercase flex items-center gap-1.5">
                <List size={13} />
                Índice de Folios
              </span>
              <span className="text-[9px] font-mono text-white/30 lowercase italic">
                {totalSemanas} semanas
              </span>
            </div>

            <div className="space-y-1.5">
              {mallaCurricularModulo1.map((week, idx) => {
                const isActive = idx === semanaActivaIndice;
                const isRead = comprensionMap[week.semana];
                return (
                  <button
                    key={week.semana}
                    onClick={() => setSemanaActivaIndice(idx)}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                      isActive 
                        ? 'bg-[#10b981]/15 text-white border-[#10b981]/40 shadow-inner' 
                        : 'bg-black/20 text-white/50 border-white/[0.02] hover:bg-white/5 hover:text-white/80'
                    }`}
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono text-[9px] font-black px-1.5 py-0.2 rounded ${
                          isActive ? 'bg-[#10b981] text-[#052222]' : 'bg-white/5 text-white/40'
                        }`}>
                          S{week.semana.toString().padStart(2, '0')}
                        </span>
                        <span className="font-extrabold truncate">
                          {week.unidad_libro.split(':')[1]?.trim() || week.unidad_libro}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/30 truncate group-hover:text-white/40 font-mono italic">
                        {week.fechas}
                      </p>
                    </div>

                    {isRead ? (
                      <CheckCircle size={14} className="text-[#10b981] shrink-0 fill-[#10b981]/10" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/20 group-hover:bg-white/10 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN VISOR COMPANION GRID (RIGHT 9 GRID SPACES) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* The PDF Reader Chrome Layout */}
            <div className="border border-white/10 rounded-3xl bg-[#091515] overflow-hidden shadow-2xl">
              
              {/* PDF TOOLBAR */}
              <div className="bg-[#051111] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                
                {/* PDF Left Info tag */}
                <div className="flex items-center gap-2 text-white text-[11px] font-mono">
                  <div className="p-1 px-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-extrabold text-[9px]">
                    PDF
                  </div>
                  <span className="truncate max-w-[180px] sm:max-w-none text-white/80 font-semibold italic">
                    TecLingo_M1_Student_Book_A1.1.pdf
                  </span>
                </div>

                {/* PDF Tool center controls: Zoom & Navigation */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={zoomOut}
                    disabled={zoomPdf <= 80}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white disabled:opacity-20 transition active:scale-90"
                    title="Zoom Out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <button 
                    onClick={zoomReset}
                    className="font-mono text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-white/80 hover:text-white"
                    title="Reset Zoom"
                  >
                    {zoomPdf}%
                  </button>
                  <button 
                    onClick={zoomIn}
                    disabled={zoomPdf >= 150}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white disabled:opacity-20 transition active:scale-90"
                    title="Zoom In"
                  >
                    <ZoomIn size={13} />
                  </button>

                  <div className="h-4 border-l border-white/10 mx-1.5 hidden sm:block" />

                  {/* Document pagination indicator */}
                  <div className="items-center gap-1.5 text-white/40 ml-1.5 font-mono text-[10px] hidden sm:flex">
                    <button
                      onClick={handlePagePrev}
                      disabled={semanaActivaIndice === 0}
                      className="p-1 bg-white/5 rounded hover:bg-white/10 hover:text-white disabled:opacity-20"
                    >
                      ◀
                    </button>
                    <span className="text-white/80 font-bold bg-black/60 px-2 py-0.5 rounded">
                      Pag. {semanaActual.semana * 2 - 1} de {totalSemanas * 2}
                    </span>
                    <button
                      onClick={handlePageNext}
                      disabled={semanaActivaIndice === totalSemanas - 1}
                      className="p-1 bg-white/5 rounded hover:bg-white/10 hover:text-white disabled:opacity-20"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* PDF Toolbar Action ends */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => {
                      setExportType('digital');
                      setShowPdfModal(true);
                    }}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition"
                    title="Print / Save PDF"
                  >
                    <Printer size={13} />
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition"
                    title="Full Screen Canvas"
                  >
                    {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  </button>
                </div>

              </div>

              {/* PDF CANVAS WRAPPER */}
              <div 
                className={`bg-slate-700/40 p-6 md:p-12 overflow-x-auto overflow-y-auto max-h-[600px] flex justify-center custom-scrollbar relative ${
                  isFullscreen ? 'fixed inset-12 z-[110] max-h-none h-auto bg-slate-900 border border-white/20 shadow-2xl' : ''
                }`}
                style={{ scrollBehavior: 'smooth' }}
              >
                {isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/70 hover:bg-black text-white hover:text-[#10b981] rounded-full border border-white/10"
                  >
                    <Minimize2 size={18} />
                  </button>
                )}

                {/* DYNAMIC SCALING PAPER CONTAINER */}
                <div 
                  id="print-area-active-folio"
                  className="bg-white text-slate-800 rounded-lg shadow-2xl overflow-hidden shadow-black/50 transition-all duration-300 relative shrink-0 text-left"
                  style={{
                    width: `${650 * (zoomPdf / 100)}px`,
                    minHeight: `${840 * (zoomPdf / 100)}px`,
                    transformOrigin: 'top center',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Subtle watermarks and prints details */}
                  <div className="absolute top-0 right-0 p-1 transform rotate-45 translate-x-12 translate-y-4 bg-[#10b981]/15 text-[#10b981] font-mono text-[7px] font-black uppercase tracking-widest pointer-events-none no-print">
                    TECLINGO DIGITAL CURRICULA
                  </div>

                  {/* MAIN RETINA PAGE CONTAINER */}
                  <div className="p-8 md:p-12 flex flex-col justify-between h-full space-y-8 h-full" style={{ minHeight: `${820 * (zoomPdf / 100)}px` }}>
                    
                    {/* Header bar section */}
                    <div className="border-b-2 border-indigo-900/15 pb-3 flex justify-between items-center text-[9px] font-mono text-slate-400 font-black uppercase tracking-widest">
                      <span>TECLINGO ACADEMIC EDUCATION PROJECT</span>
                      <span className="text-[#059669] font-black">{semanaActual.paginas}</span>
                    </div>

                    {/* Book Identity Titles */}
                    <div className="space-y-4 flex-1">
                      
                      {/* Identity labels */}
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-[#0c4f34] text-[8.5px] font-mono font-black px-2 py-0.5 rounded border border-[#a7f3d0] uppercase tracking-wider">
                          {semanaActual.unidad_libro}
                        </span>
                        <span className="text-slate-400 text-[9px] font-mono">• WEEKLY STUDENT RESOURCE</span>
                      </div>

                      {/* Lesson title headings */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#059669] font-extrabold uppercase tracking-wide block">
                          SEMANA {semanaActual.semana.toString().padStart(2, '0')} • CURRÍCULO BASE DE LA SEP
                        </span>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                          {semanaActual.eje_tematico}
                        </h1>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Periodo lectivo estimado: {semanaActual.fechas}
                        </p>
                      </div>

                      {/* CORE PEDAGOGICAL GRAMMAR FOCUS SHEET */}
                      <div className="space-y-5 pt-4">
                        
                        {/* 1. Grammar conceptual block */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 space-y-2">
                          <strong className="text-[10px] font-mono font-black text-[#059669] block uppercase tracking-wider">
                            📝 CONCEPTUAL GRAMMAR CORE:
                          </strong>
                          <p className="text-[11px] leading-relaxed font-semibold text-slate-800">
                            {theoryDetails.grammarFocus}
                          </p>
                          <p className="text-[10.5px] leading-relaxed text-slate-500">
                            Revisa con atención los principios sintácticos estructurados a continuación. Este bloque contiene construcciones estandarizadas requeridas para el descriptor curricular TOEFL iBT:
                          </p>
                        </div>

                        {/* 2. Structured Grammar Table (Retina rendering) */}
                        {theoryDetails.tableHeaders && theoryDetails.tableRows && (
                          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <table className="w-full text-left border-collapse text-[10.5px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wide">
                                  {theoryDetails.tableHeaders.map((head, i) => (
                                    <th key={i} className="p-2.5 font-bold">{head}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {theoryDetails.tableRows.map((row, i) => (
                                  <tr key={i} className="border-b border-slate-100 last:border-none text-slate-800 hover:bg-slate-50/50">
                                    {row.map((val, k) => (
                                      <td key={k} className="p-2.5 font-medium">{val}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* 3. Logical bullets */}
                        <div className="space-y-2 text-[11px] text-slate-600 leading-normal pl-1">
                          {theoryDetails.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-[#059669] font-black mt-0.5">•</span>
                              <p className="flex-1">{bullet}</p>
                            </div>
                          ))}
                        </div>

                        {/* 4. Official KPI and TOEFL Tip box */}
                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs space-y-2 font-sans">
                          <strong className="text-[10px] font-mono font-black text-amber-700 block uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={11} className="text-amber-600" />
                            TOEFL IBT PREPARATION STANDARD:
                          </strong>
                          <p className="text-[10.5px] leading-relaxed italic text-amber-800">
                            "{theoryDetails.toeflTip}"
                          </p>
                          <div className="pt-2 border-t border-amber-200/40 text-[9.5px] text-amber-600 font-mono font-black uppercase tracking-wide">
                            Evidencia Requerida: {semanaActual.kpi.replace('🏆 Evidencia: ', '')}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Footer bar section */}
                    <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-[9px] font-mono text-slate-400 font-medium">
                      <span>© TECNOLINGO PROFESSIONAL ENGLISH SYSTEMS</span>
                      <span>PAGE {semanaActual.semana * 2 - 1} OF 36</span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Lower navigator pagination button bar (for simple clicks) */}
              <div className="bg-[#051111] border-t border-white/5 p-3 flex justify-between items-center px-6 no-print">
                <button
                  type="button"
                  onClick={handlePagePrev}
                  disabled={semanaActivaIndice === 0}
                  className="bg-black/40 hover:bg-black/70 disabled:opacity-20 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-xl text-[10.5px] font-mono font-bold flex items-center gap-1 text-white cursor-pointer transition"
                >
                  ◀ ANTERIOR
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSemanaCompletada(semanaActual.semana)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9.5px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                      comprensionMap[semanaActual.semana]
                        ? 'bg-[#10b981] border-[#10b981] text-[#052222] shadow-[0_2px_10px_rgba(16,185,129,0.15)]'
                        : 'bg-black/60 border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    <CheckCircle size={11} className="stroke-[3]" />
                    {comprensionMap[semanaActual.semana] ? 'Semana Leída' : 'Marcar Leído'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePageNext}
                  disabled={semanaActivaIndice === totalSemanas - 1}
                  className="bg-black/40 hover:bg-black/70 disabled:opacity-20 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-xl text-[10.5px] font-mono font-bold flex items-center gap-1 text-white cursor-pointer transition"
                >
                  SIGUIENTE ▶
                </button>
              </div>

            </div>

            {/* LOWER COMPARTMENT: STUDENT PRACTICES WORKBENCHES */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-5 text-left no-print">
              
              {/* Tabs for Homework / Classwork */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-3">
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setSubSeccion('ejercicios')}
                    className={`px-4 py-2 rounded-xl text-xs font-black font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      subSeccion === 'ejercicios'
                        ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400'
                        : 'text-white/40 hover:text-white/60 bg-transparent border border-transparent'
                    }`}
                  >
                    <FileText size={13} />
                    Classwork (Síncrono)
                  </button>
                  <button
                    onClick={() => setSubSeccion('tareas')}
                    className={`px-4 py-2 rounded-xl text-xs font-black font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      subSeccion === 'tareas'
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                        : 'text-white/40 hover:text-white/60 bg-transparent border border-transparent'
                    }`}
                  >
                    <HelpCircle size={13} />
                    Homework (Asíncrono)
                  </button>
                </div>

                <span className="text-[10px] text-white/40 font-mono tracking-wider italic uppercase">
                  Cuaderno de Evidencias • Semana {semanaActual.semana}
                </span>
              </div>

              {/* RENDER ACTIVE PRACTICE SECTIONS */}
              <AnimatePresence mode="wait">
                {subSeccion === 'ejercicios' ? (
                  <motion.div
                    key="classwork-sec"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    {renderClassworkWorkbook(semanaActual.semana)}
                  </motion.div>
                ) : (
                  <motion.div
                    key="homework-sec"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    {renderHomeworkWorkbook(semanaActual.semana)}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      )}

      {/* 2. THE DUPLEX BOOKLET SPREAD DUKED LAYOUT */}
      {viewMode === 'duplex' && (
        <div className="space-y-6 animate-fadeIn no-print">
          
          {/* CORE COMPREHENSIVE SPREAD CONTAINER */}
          <div className="relative border-4 border-[#071919] bg-[#030e0e] rounded-3xl shadow-2xl p-2 md:p-3 overflow-hidden transition-colors duration-300">
            {/* Binder shadow and tactile lomo feel lines (hidden in printout) */}
            <div className="absolute inset-y-0 left-1/2 w-[8px] -translate-x-1/2 bg-gradient-to-r from-black/85 via-black/20 to-black/85 z-20 pointer-events-none hidden md:block border-x border-white/[0.02]" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 relative z-10 min-h-[500px]">
              
              {/* ================= DUPLEX: LEFT PAGE ================= */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`left-sem-${spreadLeftWeek.semana}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.15 }}
                  className={`p-6 rounded-2xl flex flex-col justify-between border text-left relative overflow-hidden shadow-inner ${
                    comprensionMap[spreadLeftWeek.semana]
                      ? 'bg-emerald-950/15 border-emerald-400/30'
                      : 'bg-black/30 border-white/[0.05]'
                  }`}
                >
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#10b981]/5 to-transparent pointer-events-none" />

                  <div>
                    {/* Page header banner */}
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2.5 mb-4">
                      <span className="text-[#DEFF9A] font-extrabold uppercase tracking-widest">
                        Semana {spreadLeftWeek.semana.toString().padStart(2, '0')}
                      </span>
                      <span className="bg-black/30 px-2 py-0.5 rounded text-white/50 border border-white/5">
                        {spreadLeftWeek.paginas}
                      </span>
                    </div>

                    {/* Left Switcther tabs */}
                    <div className="flex gap-1 mb-5 bg-black/60 p-1 rounded-xl border border-white/5">
                      <button
                        onClick={() => setInnerTabLeft('teoria')}
                        className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                          innerTabLeft === 'teoria' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        📖 Teoría
                      </button>
                      <button
                        onClick={() => setInnerTabLeft('ejercicios')}
                        className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                          innerTabLeft === 'ejercicios' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-400/20' : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        📝 Práctica
                      </button>
                      <button
                        onClick={() => setInnerTabLeft('tareas')}
                        className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                          innerTabLeft === 'tareas' ? 'bg-amber-500/15 text-amber-400 border border-amber-400/20' : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        🏠 Tarea
                      </button>
                    </div>

                    {/* RENDER LEFT DUPLEX PORTIONS */}
                    {innerTabLeft === 'teoria' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-black uppercase text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {spreadLeftWeek.unidad_libro}
                          </span>
                          <h3 className="text-sm font-black text-white uppercase italic tracking-tight font-sans text-neutral-200">
                            {spreadLeftWeek.eje_tematico}
                          </h3>
                        </div>

                        <div className="p-4 rounded-xl bg-black/60 border border-white/5 text-xs text-white/70 space-y-2 leading-relaxed">
                          <span className="text-[10px] font-mono font-black text-[#10b981] block uppercase tracking-wider">
                            📋 SÍNTESIS PEDAGÓGICA:
                          </span>
                          <p className="text-[11px] leading-relaxed">
                            {getLessonTheoryExplanation(spreadLeftWeek.semana, spreadLeftWeek.eje_tematico).grammarFocus}
                          </p>
                          <p className="text-[10.5px] text-white/50 leading-relaxed">
                            Revisa el visor de PDF escolar para encontrar la diagramación teórica completa, vocabulario y claves de soporte.
                          </p>
                        </div>
                        
                        <div className="text-[9.5px] text-white/40 italic font-mono pt-1">
                          KPI: {spreadLeftWeek.kpi}
                        </div>
                      </div>
                    )}

                    {innerTabLeft === 'ejercicios' && (
                      <div className="space-y-3 font-sans">
                        <div className="flex items-center gap-1.5 text-indigo-400 mb-2">
                          <FileText size={14} />
                          <h4 className="text-xs font-black font-mono uppercase tracking-wider">
                            Classwork (Práctica)
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {renderClassworkWorkbook(spreadLeftWeek.semana)}
                        </div>
                      </div>
                    )}

                    {innerTabLeft === 'tareas' && (
                      <div className="space-y-3 font-sans text-left">
                        <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                          <HelpCircle size={14} />
                          <h4 className="text-xs font-black font-mono uppercase tracking-wider">
                            Homework (Tarea)
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {renderHomeworkWorkbook(spreadLeftWeek.semana)}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Left Bottom controls row */}
                  <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => toggleSemanaCompletada(spreadLeftWeek.semana)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                        comprensionMap[spreadLeftWeek.semana]
                          ? 'bg-[#10b981] border-[#10b981] text-[#052222]'
                          : 'bg-black/60 border-white/10 text-white/40'
                      }`}
                    >
                      <CheckCircle size={11} />
                      {comprensionMap[spreadLeftWeek.semana] ? 'Leído' : 'Marcar Leído'}
                    </button>
                    <span className="font-mono text-[10px] text-white/20 font-black">
                      PAG. {(spreadLeftWeek.semana * 2) - 1}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ================= DUPLEX: RIGHT PAGE ================= */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`right-sem-${spreadRightWeek?.semana || 'end'}`}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.15 }}
                  className={`p-6 rounded-2xl flex flex-col justify-between border text-left relative overflow-hidden shadow-inner ${
                    spreadRightWeek 
                      ? comprensionMap[spreadRightWeek.semana]
                        ? 'bg-emerald-950/15 border-emerald-400/30'
                        : 'bg-black/30 border-white/[0.05]'
                      : 'bg-black/10 border-white/[0.02]'
                  }`}
                >
                  {spreadRightWeek ? (
                    <>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#10b981]/5 to-transparent pointer-events-none" />

                      <div>
                        {/* Page header banner */}
                        <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2.5 mb-4">
                          <span className="text-[#DEFF9A] font-extrabold uppercase tracking-widest">
                            Semana {spreadRightWeek.semana.toString().padStart(2, '0')}
                          </span>
                          <span className="bg-black/30 px-2 py-0.5 rounded text-white/50 border border-white/5">
                            {spreadRightWeek.paginas}
                          </span>
                        </div>

                        {/* Right Switcther tabs */}
                        <div className="flex gap-1 mb-5 bg-black/60 p-1 rounded-xl border border-white/5">
                          <button
                            onClick={() => setInnerTabRight('teoria')}
                            className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                              innerTabRight === 'teoria' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                            }`}
                          >
                            📖 Teoría
                          </button>
                          <button
                            onClick={() => setInnerTabRight('ejercicios')}
                            className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                              innerTabRight === 'ejercicios' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-400/20' : 'text-white/40 hover:text-white/60'
                            }`}
                          >
                            📝 Práctica
                          </button>
                          <button
                            onClick={() => setInnerTabRight('tareas')}
                            className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                              innerTabRight === 'tareas' ? 'bg-amber-500/15 text-amber-400 border border-amber-400/20' : 'text-white/40 hover:text-white/60'
                            }`}
                          >
                            🏠 Tarea
                          </button>
                        </div>

                        {/* RENDER RIGHT DUPLEX PORTIONS */}
                        {innerTabRight === 'teoria' && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono font-black uppercase text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                {spreadRightWeek.unidad_libro}
                              </span>
                              <h3 className="text-sm font-black text-white uppercase italic tracking-tight font-sans text-neutral-200">
                                {spreadRightWeek.eje_tematico}
                              </h3>
                            </div>

                            <div className="p-4 rounded-xl bg-black/60 border border-white/5 text-xs text-white/70 space-y-2 leading-relaxed">
                              <span className="text-[10px] font-mono font-black text-[#10b981] block uppercase tracking-wider">
                                📋 SÍNTESIS PEDAGÓGICA:
                              </span>
                              <p className="text-[11px] leading-relaxed">
                                {getLessonTheoryExplanation(spreadRightWeek.semana, spreadRightWeek.eje_tematico).grammarFocus}
                              </p>
                              <p className="text-[10.5px] text-white/50 leading-relaxed">
                                Revisa el visor de PDF escolar para encontrar la diagramación teórica completa, vocabulario y claves de soporte.
                              </p>
                            </div>
                            
                            <div className="text-[9.5px] text-white/40 italic font-mono pt-1">
                              KPI: {spreadRightWeek.kpi}
                            </div>
                          </div>
                        )}

                        {innerTabRight === 'ejercicios' && (
                          <div className="space-y-3 font-sans">
                            <div className="flex items-center gap-1.5 text-indigo-400 mb-2">
                              <FileText size={14} />
                              <h4 className="text-xs font-black font-mono uppercase tracking-wider">
                                Classwork (Práctica)
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {renderClassworkWorkbook(spreadRightWeek.semana)}
                            </div>
                          </div>
                        )}

                        {innerTabRight === 'tareas' && (
                          <div className="space-y-3 font-sans text-left">
                            <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                              <HelpCircle size={14} />
                              <h4 className="text-xs font-black font-mono uppercase tracking-wider">
                                Homework (Tarea)
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {renderHomeworkWorkbook(spreadRightWeek.semana)}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Right Bottom controls row */}
                      <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => toggleSemanaCompletada(spreadRightWeek.semana)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                            comprensionMap[spreadRightWeek.semana]
                              ? 'bg-[#10b981] border-[#10b981] text-[#052222]'
                              : 'bg-black/60 border-white/10 text-white/40'
                          }`}
                        >
                          <CheckCircle size={11} />
                          {comprensionMap[spreadRightWeek.semana] ? 'Leído' : 'Marcar Leído'}
                        </button>
                        <span className="font-mono text-[10px] text-white/20 font-black">
                          PAG. {spreadRightWeek.semana * 2}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/20 font-mono text-center p-8 space-y-2">
                      <BookOpen size={48} className="stroke-[1.5] text-white/10" />
                      <p className="text-xs font-black uppercase tracking-widest">[ FIN DEL MÓDULO 1 ]</p>
                      <p className="text-[10px] text-white/30">Contraportada Posterior del Cuaderno de Prácticas</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

          {/* Lower Page Tuners (Manual triggers) */}
          <div className="flex justify-between items-center bg-[#051515]/60 p-3 rounded-2xl border border-white/5">
            <button
              onClick={handlePagePrev}
              disabled={spreadIndex === 0}
              className="bg-black/60 hover:bg-black/80 disabled:opacity-30 border border-white/10 px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 transition text-white rounded-xl cursor-pointer"
            >
              ◀ OJEAR ATRÁS
            </button>

            <span className="text-xs font-mono text-white/50">
              Mostrando Semanas <strong className="text-[#10b981]">{spreadLeftWeek.semana}</strong> y <strong className="text-[#10b981]">{spreadRightWeek ? spreadRightWeek.semana : '-'}</strong> de {totalSemanas}
            </span>

            <button
              onClick={handlePageNext}
              disabled={spreadIndex === 8}
              className="bg-black/60 hover:bg-black/80 disabled:opacity-30 border border-white/10 px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 transition text-white rounded-xl cursor-pointer"
            >
              OJEAR ADELANTE ▶
            </button>
          </div>

        </div>
      )}

      {/* ================= PDF EXPORTING DRAWERS/MODAL SIMULATOR ================= */}
      <AnimatePresence>
        {showPdfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden bg-[#0a1818] border border-emerald-500/25 rounded-3xl p-6 shadow-2xl space-y-5 text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  if (!isExporting) setShowPdfModal(false);
                }}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-lg transition"
                disabled={isExporting}
              >
                <X size={18} />
              </button>

              {/* Title Header */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 rounded-xl">
                  <Printer size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Exportar / Imprimir Libro De Texto
                  </h3>
                  <p className="text-[11px] text-white/40 font-mono leading-none">
                    Módulo 1 Curricula Basada En La SEP
                  </p>
                </div>
              </div>

              {isExporting ? (
                /* EXPORT PROGRESS INTERFACE */
                <div className="space-y-4 p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                    <motion.div 
                      className="h-full bg-emerald-400 rounded-full"
                      animate={{ width: `${exportProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                    <span>{exportStatus}</span>
                    <span className="font-bold text-emerald-400">{exportProgress}%</span>
                  </div>
                </div>
              ) : (
                /* CHOOSE EXPORT TYPE DIALOGUE */
                <div className="space-y-4">
                  <p className="text-xs text-white/70 leading-relaxed">
                    Personaliza los alcances del material impreso modular para uso fuera de línea (offline). Puedes imprimir el módulo síncrono o exportarlo como ficha individual.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setExportType('digital')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        exportType === 'digital' 
                          ? 'bg-emerald-950/20 border-emerald-400/30' 
                          : 'bg-black/45 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border ${exportType === 'digital' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' : 'bg-white/5 text-white/30 border-white/5'} mt-0.5 shrink-0`}>
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <strong className="text-xs text-white block">Libro de Texto Digital Teórico</strong>
                        <span className="text-[10.5px] text-white/40 block mt-0.5 leading-snug">
                          Incluye diagramación conceptual base y las explicaciones síncronas de la semana actual {semanaActual.semana}.
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExportType('workbook')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        exportType === 'workbook' 
                          ? 'bg-emerald-950/20 border-emerald-400/30' 
                          : 'bg-black/45 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border ${exportType === 'workbook' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' : 'bg-white/5 text-white/30 border-white/5'} mt-0.5 shrink-0`}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <strong className="text-xs text-white block">Cuaderno Práctico de Entregables (Worksheets)</strong>
                        <span className="text-[10.5px] text-white/40 block mt-0.5 leading-snug">
                          Exporta una plantilla limpia de classwork y homework de la semana actual lista para rellenar a mano.
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Warning label */}
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[10.5px] text-amber-200/80 flex items-start gap-2.5">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      <strong>Requisito de Portabilidad:</strong> El navegador desplegará el panel de guardado nativo. Configura el fondo o habilita "Gráficos de fondo" en las opciones para preservar la diagramación.
                    </p>
                  </div>
                </div>
              )}

              {/* Action row at bottom */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-xs font-mono font-bold transition active:scale-95 cursor-pointer text-center"
                  disabled={isExporting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={startPdfSimulation}
                  className="flex-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#041c1c] rounded-2xl text-xs font-mono font-black uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isExporting}
                >
                  <Download size={14} />
                  Generar e Imprimir
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
