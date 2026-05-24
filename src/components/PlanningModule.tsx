/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  ExternalLink,
  FileText,
  Sparkles,
  Calendar,
  CheckCircle2,
  X,
  Printer,
  Download,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award,
  Lock,
  Stamp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { mallaCurricularModulo1 } from '../data/mallaCurricularModulo1';

// Comprehensive dataset with ALL 18 weeks, 100% focused on Everyday English general situations (No technical jargon)
const semanasDemoData: { [key: number]: any } = {
  1: {
    eje_tematico: "Saludos, Presentaciones Personales y Cortesía Básica",
    kpi: "🏆 Tarjeta de contacto escrita y audio grabado de presentación de un minuto.",
    items: [
      { id: 's1_1', label: 'Grammar: Verbo "To Be" en modo afirmativo y Pronombres de Sujeto obligatorios (I, You, He, She, It, We, They).', category: 'Grammar' },
      { id: 's1_2', label: 'Vocabulary: Saludos cordiales, decir nombre de pila, edad y nacionalidad de origen.', category: 'Vocabulary' },
      { id: 's1_3', label: 'Listening: Identificar nombres deletreados letra por letra, números de teléfono y edades exactas.', category: 'Listening' },
      { id: 's1_4', label: 'Reading: Extraer información directa (nombres, procedencias) de cartas de presentación y correos.', category: 'Reading' },
      { id: 's1_5', label: 'Speaking: Expresar información demográfica básica frente a la IA sin vacilaciones críticas.', category: 'Speaking' },
    ]
  },
  2: {
    eje_tematico: "Objetos Escolares y del Aula de Clase",
    kpi: "🏆 Inventario descriptivo del equipamiento personal del estudiante.",
    items: [
      { id: 's2_1', label: 'Grammar: Estructurar negaciones con verbo "To Be" (not) y plurales regulares (-s / -es).', category: 'Grammar' },
      { id: 's2_2', label: 'Vocabulary: Mochila, lápiz, goma, libros, cuadernos y mobiliario de aula común.', category: 'Vocabulary' },
      { id: 's2_3', label: 'Listening: Aislar cantidades exactas de objetos descritos por un docente a velocidad baja.', category: 'Listening' },
      { id: 's2_4', label: 'Reading: Interpretar listas sencillas de materiales requeridos para una sesión de dibujo.', category: 'Reading' },
      { id: 's2_5', label: 'Speaking: Nombrar objetos comunes a su alrededor frente a la IA utilizando género y número adecuado.', category: 'Speaking' },
    ]
  },
  3: {
    eje_tematico: "Miembros de la Familia y Relaciones Básicas",
    kpi: "🏆 Párrafo del árbol genealógico familiar con nombres y roles claros.",
    items: [
      { id: 's3_1', label: 'Grammar: Utilizar adjetivos posesivos (my, your, his, her, its, our, their) para señalar relaciones.', category: 'Grammar' },
      { id: 's3_2', label: 'Vocabulary: Familiares nucleares (mother, father, siblings, parents, grandparents, uncle).', category: 'Vocabulary' },
      { id: 's3_3', label: 'Listening: Mapear lazos familiares directos en diálogos conversacionales sencillos.', category: 'Listening' },
      { id: 's3_4', label: 'Reading: Relacionar descripciones de árboles genealógicos textuales con los nombres indicados.', category: 'Reading' },
      { id: 's3_5', label: 'Speaking: Responder a preguntas de la IA sobre familiares y describir sus profesiones básicas.', category: 'Speaking' },
    ]
  },
  4: {
    eje_tematico: "Países, Nacionalidades e Idiomas del Mundo",
    kpi: "🏆 Formulario de registro turístico con enunciados de procedencia.",
    items: [
      { id: 's4_1', label: 'Grammar: Formular preguntas de información con palabras interrogativas base (What, Where, Who, When).', category: 'Grammar' },
      { id: 's4_2', label: 'Vocabulary: Nombres de países, gentilicios correspondientes e idiomas del mundo más hablados.', category: 'Vocabulary' },
      { id: 's4_3', label: 'Listening: Reconocer gentilicios y nacionalidades en un audio de bienvenida de hotel.', category: 'Listening' },
      { id: 's4_4', label: 'Reading: Ubicar procedencias oficiales leyendo formularios o post-its de registro.', category: 'Reading' },
      { id: 's4_5', label: 'Speaking: Contar a la IA qué país le gustaría visitar y qué idioma se habla allí.', category: 'Speaking' },
    ]
  },
  5: {
    eje_tematico: "Pasatiempos, Deporte y Actividades Recreativas",
    kpi: "🏆 Ensayo corto sobre hobbys de ocio predilectos.",
    items: [
      { id: 's5_1', label: 'Grammar: Dominar de forma contextual los artículos definidos e indefinidos (a, an, the).', category: 'Grammar' },
      { id: 's5_2', label: 'Vocabulary: Deportes comunes (soccer, tennis, swimming) y hobbys favoritos de fin de semana.', category: 'Vocabulary' },
      { id: 's5_3', label: 'Listening: Identificar hobbys y deportes preferidos en encuestas públicas en audio.', category: 'Listening' },
      { id: 's5_4', label: 'Reading: Interpretar anuncios y convocatorias para clubes recreativos o deportivos del vecindario.', category: 'Reading' },
      { id: 's5_5', label: 'Speaking: Hablar de forma continua durante 40 segundos sobre su pasatiempo favorito.', category: 'Speaking' },
    ]
  },
  6: {
    eje_tematico: "Descripción Física de Personas y Adjetivos de Aspecto",
    kpi: "🏆 Ficha descriptiva ilustrativa de un personaje de interés.",
    items: [
      { id: 's6_1', label: 'Grammar: Sintaxis y posición de los adjetivos calificativos antes del sustantivo en descripciones.', category: 'Grammar' },
      { id: 's6_2', label: 'Vocabulary: Rasgos de apariencia física (tall, short, eyes, hair) y adjetivos básicos de carácter.', category: 'Vocabulary' },
      { id: 's6_3', label: 'Listening: Aislar rasgos físicos en resúmenes narrados de familiares perdidos.', category: 'Listening' },
      { id: 's6_4', label: 'Reading: Relacionar perfiles de fotos de rostros con descripciones formales escritas.', category: 'Reading' },
      { id: 's6_5', label: 'Speaking: Elegir una persona famosa y describir detalladamente su aspecto físico a la IA.', category: 'Speaking' },
    ]
  },
  7: {
    eje_tematico: "Actividades de la Rutina Diaria (Por la Mañana)",
    kpi: "🏆 Tabla de horarios de actividades diarias matutinas.",
    items: [
      { id: 's7_1', label: 'Grammar: Presente Simple en oraciones afirmativas para hábitos normales y continuos.', category: 'Grammar' },
      { id: 's7_2', label: 'Vocabulary: Acciones matinales habituales (wake up, brush teeth, take a shower, eat breakfast).', category: 'Vocabulary' },
      { id: 's7_3', label: 'Listening: Extraer los horarios exactos en los que las personas despiertan o toman café.', category: 'Listening' },
      { id: 's7_4', label: 'Reading: Seguir diarios y agendas personales de planeación de actividades en el hogar.', category: 'Reading' },
      { id: 's7_5', label: 'Speaking: Describir oralmente su rutina de mañana usando conectores secuenciales (then, after that).', category: 'Speaking' },
    ]
  },
  8: {
    eje_tematico: "Rutina de Trabajo y Actividades por la Tarde",
    kpi: "🏆 Reporte escrito comparativo sobre la rutina laboral vespertina.",
    items: [
      { id: 's8_1', label: 'Grammar: Concordancia y reglas de la tercera persona singular en Presente Simple (-s, -es, -ies).', category: 'Grammar' },
      { id: 's8_2', label: 'Vocabulary: Labores de oficina, tareas cotidianas de tarde y almuerzos comunes.', category: 'Vocabulary' },
      { id: 's8_3', label: 'Listening: Deducir a qué hora termina su jornada laboral un conferencista en audios lineales.', category: 'Listening' },
      { id: 's8_4', label: 'Reading: Interpretar historias sencillas basadas en una jornada ordinaria de oficios tradicionales.', category: 'Reading' },
      { id: 's8_5', label: 'Speaking: Explicar en detalle a la IA la rutina tarde/noche de su mejor amigo o pareja.', category: 'Speaking' },
    ]
  },
  9: {
    eje_tematico: "Hábitos Nocturnos, Descanso y Fin de la Jornada",
    kpi: "🏆 Cuestionario de hábitos del sueño resuelto y estructurado.",
    items: [
      { id: 's9_1', label: 'Grammar: Utilizar de forma correcta auxiliares "do" y "does" para preguntas cerradas.', category: 'Grammar' },
      { id: 's9_2', label: 'Vocabulary: Hábitos nocturnos (reading, watching TV, going to bed) y relajación.', category: 'Vocabulary' },
      { id: 's9_3', label: 'Listening: Aislar si un hablante prefiere leer o mirar televisión antes de dormir.', category: 'Listening' },
      { id: 's9_4', label: 'Reading: Analizar folletos informativos de descanso doméstico y sugerencias de sueño.', category: 'Reading' },
      { id: 's9_5', label: 'Speaking: Debatir con el examinador IA si es mejor leer o relajarse de forma tranquila de noche.', category: 'Speaking' },
    ]
  },
  10: {
    eje_tematico: "Ubicación Espacial, Habitaciones y Muebles de Casa",
    kpi: "🏆 Croquis clasificado de la distribución interna del hogar.",
    items: [
      { id: 's10_1', label: 'Grammar: Preposiciones de lugar esenciales (in, on, under, next to, behind) para ubicar objetos.', category: 'Grammar' },
      { id: 's10_2', label: 'Vocabulary: Habitaciones de la casa (kitchen, bedroom, living room) y muebles cotidianos.', category: 'Vocabulary' },
      { id: 's10_3', label: 'Listening: Reconocer dónde se encuentran objetos extraviados en diálogos de familiares.', category: 'Listening' },
      { id: 's10_4', label: 'Reading: Relacionar listas de compras de muebles con la habitación recomendada.', category: 'Reading' },
      { id: 's10_5', label: 'Speaking: Formular respuestas rápidas a la IA describiendo la posición exacta de sus cosas en casa.', category: 'Speaking' },
    ]
  },
  11: {
    eje_tematico: "Medios de Transporte y Traslados en la Ciudad",
    kpi: "🏆 Manual descriptivo de ruta de traslado para visitantes.",
    items: [
      { id: 's11_1', label: 'Grammar: Uso consistente de pronombres demostrativos singulares y plurales (this, that, these, those).', category: 'Grammar' },
      { id: 's11_2', label: 'Vocabulary: Autobús, metro, coche, transbordos y verbos de desplazamiento urbano.', category: 'Vocabulary' },
      { id: 's11_3', label: 'Listening: Extraer el medio de traslado preferido por ciudadanos de grabaciones cortas.', category: 'Listening' },
      { id: 's11_4', label: 'Reading: Mapear rutas de transporte urbano y diagramas peatonales sencillos.', category: 'Reading' },
      { id: 's11_5', label: 'Speaking: Detallar a la IA cómo se moviliza diariamente y cuánto tiempo tarda en promedio.', category: 'Speaking' },
    ]
  },
  12: {
    eje_tematico: "El Tiempo de Ocio y Frecuencia de Actividades",
    kpi: "🏆 Reporte analítico de frecuencia de ocio semanal.",
    items: [
      { id: 's12_1', label: 'Grammar: Colocar de forma sintáctica los adverbios de frecuencia (always, usually, often, sometimes, never).', category: 'Grammar' },
      { id: 's12_2', label: 'Vocabulary: Salidas con amigos, paseos en parque y escalas temporales de frecuencia común.', category: 'Vocabulary' },
      { id: 's12_3', label: 'Listening: Aislar qué tan a menudo hacen ejercicio o van al cine múltiples hablantes.', category: 'Listening' },
      { id: 's12_4', label: 'Reading: Leer cuestionarios turísticos sobre hábitos de ocio vacacional en adultos.', category: 'Reading' },
      { id: 's12_5', label: 'Speaking: Responder con fluidez a preguntas rápidas de la IA acerca de sus rutinas libres.', category: 'Speaking' },
    ]
  },
  13: {
    eje_tematico: "Alimentos, Nutrición Básica y Menú de Casa",
    kpi: "🏆 Menú nutricional semanal detallado en inglés.",
    items: [
      { id: 's13_1', label: 'Grammar: Sustantivos contables e incontables con cuantificadores de uso común (some, any, much, many).', category: 'Grammar' },
      { id: 's13_2', label: 'Vocabulary: Ingredientes de desayuno, frutas, verduras, lácteos, carnes y granos.', category: 'Vocabulary' },
      { id: 's13_3', label: 'Listening: Deducir solicitudes nutricionales orales hechas en una cafetería o bar.', category: 'Listening' },
      { id: 's13_4', label: 'Reading: Interpretar recetas familiares elementales, menús y listas básicas de supermercado.', category: 'Reading' },
      { id: 's13_5', label: 'Speaking: Simular un pedido de víveres interactivo con la IA indicando cantidades exactas.', category: 'Speaking' },
    ]
  },
  14: {
    eje_tematico: "Habilidades Cotidianas, Talentos y Capacidades",
    kpi: "🏆 Carta de postulación de talentos para club vecinal.",
    items: [
      { id: 's14_1', label: 'Grammar: Uso del modal "Can" y "Can\'t" para expresar talentos artísticos, deportivos y personales.', category: 'Grammar' },
      { id: 's14_2', label: 'Vocabulary: Talentos (cantar, bailar, nadar, dibujar, tocar piano, hablar idiomas).', category: 'Vocabulary' },
      { id: 's14_3', label: 'Listening: Captar qué habilidades extraordinarias posee o no el orador en audios informales.', category: 'Listening' },
      { id: 's14_4', label: 'Reading: Localizar perfiles idóneos para voluntariado comunitarios en base a habilidades.', category: 'Reading' },
      { id: 's14_5', label: 'Speaking: Enunciar a la IA una lista organizada de talentos propios y actividades más difíciles.', category: 'Speaking' },
    ]
  },
  15: {
    eje_tematico: "Estaciones del Año, Ropa y Clima Diario",
    kpi: "🏆 Planificador de vestuario con base en el pronóstico climático.",
    items: [
      { id: 's15_1', label: 'Grammar: Asociar adjetivos de clima con Presente Continuo para detallar vestuario actual (I am wearing...).', category: 'Grammar' },
      { id: 's15_2', label: 'Vocabulary: Estaciones del año, prendas de vestir (shirt, coat, boots, hat) y climas comunes.', category: 'Vocabulary' },
      { id: 's15_3', label: 'Listening: Capturar los avisos climáticos y temperaturas semanales de un reporte radial en inglés.', category: 'Listening' },
      { id: 's15_4', label: 'Reading: Analizar guías de viaje recomendadas según el clima promedio de las capitales.', category: 'Reading' },
      { id: 's15_5', label: 'Speaking: Detallar de forma oral a la IA cómo está el clima hoy en su ciudad y qué ropa es propicia.', category: 'Speaking' },
    ]
  },
  16: {
    eje_tematico: "Compras en Tiendas, Precios y Regateo Básico",
    kpi: "🏆 Presupuesto de compras y reclamo formal simulado por escrito.",
    items: [
      { id: 's16_1', label: 'Grammar: Expresiones de cantidad y recargo monetario ("How much is...?", "How many are...?").', category: 'Grammar' },
      { id: 's16_2', label: 'Vocabulary: Costos de prendas, tallas, descuentos simples y vueltos en la caja registradora.', category: 'Vocabulary' },
      { id: 's16_3', label: 'Listening: Identificar montos exactos y costos totales en audios de diálogos de compraventa.', category: 'Listening' },
      { id: 's16_4', label: 'Reading: Comprender folletos comerciales y calcular el costo neto de una canasta de compras.', category: 'Reading' },
      { id: 's16_5', label: 'Speaking: Sostener una simulación de compra con la IA buscando una rebaja amigable.', category: 'Speaking' },
    ]
  },
  17: {
    eje_tematico: "Fórmulas de Cortesía, Permisos y Pedir Favor",
    kpi: "🏆 Nota formal de solicitud de asistencia doméstica.",
    items: [
      { id: 's17_1', label: 'Grammar: Estructurar imperativos suaves y oraciones interrogativas con "Please", "Excuse me", "Could you".', category: 'Grammar' },
      { id: 's17_2', label: 'Vocabulary: Modales de cortesía cotidianos, expresiones de disculpa y pedidos vecinales.', category: 'Vocabulary' },
      { id: 's17_3', label: 'Listening: Distinguir cortesía educada formal frente a demandas informales en audiciones lentas.', category: 'Listening' },
      { id: 's17_4', label: 'Reading: Analizar avisos y carteles públicos referentes a reglas de cortesía básica y orden.', category: 'Reading' },
      { id: 's17_5', label: 'Speaking: Practicar preguntas de favor estructuradas con un tono formal y empático.', category: 'Speaking' },
    ]
  },
  18: {
    eje_tematico: "Planificación Vacacional y Deseos para el Verano",
    kpi: "🏆 Plan de viaje vacacional ideal consolidado en formato JSON.",
    items: [
      { id: 's18_1', label: 'Grammar: Estructuras que expresan intenciones y deseos ("I want to visit...", "I would like to stay at...").', category: 'Grammar' },
      { id: 's18_2', label: 'Vocabulary: Destinos turísticos de descanso, actividades veraniegas libres y sitios de hospedaje.', category: 'Vocabulary' },
      { id: 's18_3', label: 'Listening: Reconocer destinos y atracciones seleccionadas por viajeros en entrevistas grabadas.', category: 'Listening' },
      { id: 's18_4', label: 'Reading: Ubicar los mejores horarios y actividades estivales de un catálogo turístico elemental.', category: 'Reading' },
      { id: 's18_5', label: 'Speaking: Exponer verbalmente durante un minuto por qué prefiere vacacionar en climas playeros o de montaña.', category: 'Speaking' },
    ]
  }
};

export function PlanningModule() {
  const [semanaActiva, setSemanaActiva] = useState<number>(1);
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    s1_1: true,
    s1_2: true, // Simulación inicial de clase en desarrollo
  });

  const clase = semanasDemoData[semanaActiva] || semanasDemoData[1];

  const handleCheckboxChange = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Cálculo del progreso dinámico
  const totalItems = clase.items.length;
  const completedCount = clase.items.filter((item: any) => checkedItems[item.id]).length;
  const progressPercentage = Math.round((completedCount / totalItems) * 100);

  // Helper arrays to lay out all 18 weeks elegantly
  const allWeeks = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Contenedor Izquierdo: Selector de Semanas + Detalle de Malla + PDF Oficial */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <GlassCard title="Planeación Académica TECLINGO" icon={BookOpen} accent="cyan">
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-xs text-slate-400 font-medium">Módulo 1 (A1.1 Principiante)</p>
                <div className="text-[10px] text-[#22D3EE] font-mono uppercase tracking-wider font-bold mt-1">
                  Enfoque Cotidiano y Situaciones Reales (Sin Tecnicismos)
                </div>
              </div>
              <span className="px-3 py-1 text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold">
                Vista Docente Oficial
              </span>
            </div>

            {/* SELECTOR DE TODAS LAS 18 SEMANAS EN UN GRID ELEGANTE */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                  📅 Malla Curricular y Temarios Semanales (18 Semanas):
                </label>
                <span className="text-[10px] text-indigo-400 font-bold font-mono">
                  Semana Seleccionada: {semanaActiva} de 18
                </span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 bg-black/40 p-2 rounded-2xl border border-white/5 shadow-inner">
                {allWeeks.map((num) => {
                  const isActive = semanaActiva === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setSemanaActiva(num)}
                      className={`h-9 font-mono rounded-xl font-bold transition-all text-xs border flex items-center justify-center ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border-indigo-400/40 font-black scale-105' 
                          : 'text-slate-400 border-white/[0.03] bg-white/[0.01] hover:text-slate-200 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      S{num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BANNER DINÁMICO DE LA SEMANA SELECCIONADA */}
            <motion.div 
              key={semanaActiva}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 rounded-3xl p-5 border border-indigo-500/10 flex flex-col justify-between shadow-xl"
            >
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#22D3EE]" /> Inglés General Estándar
                </span>
                <span className="bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-700/60 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-400" /> Semana {semanaActiva}
                </span>
              </div>
              <h2 className="text-white text-md font-extrabold mt-3.5 leading-snug tracking-wide">
                {clase.eje_tematico}
              </h2>
              <p className="text-[10.5px] text-slate-400 mt-2 leading-relaxed">
                Estructura de planeación diaria/semanal libre de tecnicismos para el desarrollo fluido de las 5 competencias y saberes TOEFL integrados.
              </p>

              {/* Official Textbook Reference Box for the Teacher */}
              {mallaCurricularModulo1.find(s => s.semana === semanaActiva) && (() => {
                const bookRef = mallaCurricularModulo1.find(s => s.semana === semanaActiva)!;
                return (
                  <div className="mt-4 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-slate-300 md:flex flex-col gap-2.5 font-sans">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="text-emerald-400 font-mono font-bold text-[9px] block uppercase tracking-wider mb-0.5">LIBRO VIRTUAL DE REFERENCIA DE ALUMNO:</span>
                        <strong className="text-white text-xs">{bookRef.unidad_libro}</strong>
                        <span className="text-slate-400 block mt-0.5 font-mono text-[10px]">Ubicación para estudio: <span className="text-emerald-400 font-bold">{bookRef.paginas}</span></span>
                      </div>
                      <span className="text-[9px] font-mono bg-black/40 text-[#DEFF9A] border border-[#DEFF9A]/20 px-2 py-0.5 rounded-md font-bold uppercase shrink-0">
                        100% Sincronizado
                      </span>
                    </div>
                    
                    <div className="border-t border-white/5 pt-2 flex flex-wrap gap-2">
                      <span className="text-[8.5px] font-mono text-white/40 uppercase font-black tracking-wider self-center">Vídeos de Soporte Oral:</span>
                      {bookRef.horas.map(h => (
                        <a 
                          key={h.hora} 
                          href={`https://youtube.com/watch?v=${h.videoId}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg text-[9px] font-mono font-black flex items-center gap-1 shrink-0 border border-red-500/15"
                        >
                          H{h.hora}: ▶ Video ({h.videoId})
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>

            {/* VISOR DE DOCUMENTACIÓN OFICIAL */}
            <div className="bg-black/30 p-4 rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
                <div className="w-12 h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative">
                  <FileText size={24} className="text-[#22D3EE]/60" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 font-mono break-all leading-tight">V1-PLANEACION-GENERAL-2026.pdf</div>
                  <div className="text-[9.5px] text-slate-500 mt-1 font-mono">HASH: CSEC_SEM1_SHA256_PASS</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setPdfPage(1);
                  setIsPdfOpen(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 text-[#22D3EE] border border-[#22D3EE]/30 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
              >
                Abrir Visor <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Contenedor Derecho: Checklist de Avance + KPI + Estado de Sincronización */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <GlassCard title="Checklist de Avance" icon={CheckSquare} accent="green">
          <div className="space-y-5 text-left">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Progreso de la Sesión</span>
                <span className="text-[#DEFF9A] text-sm font-black font-mono">{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full bg-[#DEFF9A] shadow-[0_0_15px_#DEFF9A80]" 
                />
              </div>
            </div>

            {/* Listado de Tareas Dinámico con Animaciones */}
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {clase.items.map((item: any) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <motion.label 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                        isChecked 
                          ? 'bg-[#DEFF9A]/5 border-[#DEFF9A]/10 text-slate-400 line-through' 
                          : 'bg-white/[0.02] border-white/5 text-slate-200 hover:border-white/25 hover:bg-white/[0.04]'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-black/40 cursor-pointer"
                      />
                      <div className="text-[11.5px] leading-snug">
                        <span className={`text-[9.5px] font-bold uppercase tracking-wider mr-1.5 px-2 py-0.5 rounded-md font-mono ${
                          item.category === 'Grammar' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                          item.category === 'Vocabulary' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' :
                          item.category === 'Listening' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/10' :
                          item.category === 'Reading' ? 'bg-emerald-500/10 text-emerald-400 border border-[#DEFF9A]/20' : 
                          'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                        }`}>
                          {item.category}
                        </span>
                        {item.label}
                      </div>
                    </motion.label>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* KPI de Cierre de Clase Directivo */}
            <div className="bg-indigo-950/25 border border-indigo-500/10 rounded-2xl p-4">
              <div className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
                Evidencia de Acreditación Obligatoria (KPI):
              </div>
              <p className="font-semibold text-slate-100 text-xs leading-relaxed">
                {clase.kpi}
              </p>
            </div>

            {/* Footer de Sincronización */}
            <div className="bg-[#DEFF9A]/5 border border-[#DEFF9A]/10 rounded-2xl p-4 flex items-center gap-3.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-200 uppercase tracking-wider font-mono">Sincronización Máster Activa</div>
                <p className="text-[9.5px] text-slate-500 leading-normal mt-0.5 font-sans">
                  Tus avances semanales se sincronizan de manera directa y segura con la Auditoría Académica de la Dirección General.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* MODAL DEL VISOR DE PDF OFICIAL TECLINGO */}
      <AnimatePresence>
        {isPdfOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPdfOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Main Document Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="relative w-full max-w-4xl h-[85vh] bg-[#0c131d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header tools */}
              <div className="p-4 border-b border-white/5 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      V1-PLANEACION-GENERAL-2026.pdf
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
                        VERIFICADO
                      </span>
                    </h3>
                    <div className="text-[9.5px] text-[#22D3EE] font-mono mt-0.5 opacity-90">
                      SHA256: CSEC_SEM1_SHA256_PASS
                    </div>
                  </div>
                </div>

                {/* PDF Actions & Navigation */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Page Indicator */}
                  <div className="flex items-center bg-black/40 border border-white/5 px-2.5 py-1 rounded-xl gap-2 mr-2">
                    <button 
                      onClick={() => setPdfPage(p => Math.max(1, p - 1))}
                      disabled={pdfPage === 1}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-slate-200">
                      Pág. {pdfPage} / 3
                    </span>
                    <button 
                      onClick={() => setPdfPage(p => Math.min(3, p + 1))}
                      disabled={pdfPage === 3}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Utility buttons */}
                  <div className="flex items-center bg-black/30 border border-white/5 rounded-xl p-0.5">
                    <button 
                      onClick={() => window.print()}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[10px]"
                      title="Imprimir Planeación"
                    >
                      <Printer size={14} />
                    </button>
                    <button 
                      onClick={() => alert("Simulación de Descarga: Archivo PDF auditado firmado digitalmente por Dirección Académica.")}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[10px]"
                      title="Descargar Planeación"
                    >
                      <Download size={14} />
                    </button>
                  </div>

                  {/* Close modal */}
                  <button 
                    onClick={() => setIsPdfOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all ml-1.5"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900/40 text-slate-200 custom-scrollbar relative">
                
                {/* PDF Digital Watermark background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
                  <div className="text-center font-black uppercase text-white transform -rotate-12 select-none">
                    <div className="text-[80px] tracking-widest leading-none">TECLINGO</div>
                    <div className="text-3xl font-mono mt-4">DIRECCIÓN GENERAL ACADÉMICA</div>
                  </div>
                </div>

                {/* Inner Sheet container styled with standard A4 paper colors and layout rules */}
                <div className="w-full max-w-3xl mx-auto bg-slate-950/85 border border-white/5 rounded-2xl p-6 md:p-10 shadow-xl relative min-h-[70vh] flex flex-col justify-between">
                  
                  {/* Top Sheet Header */}
                  <div className="border-b border-white/15 pb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="text-[9px] font-mono tracking-[0.25em] text-[#22D3EE] font-black uppercase mb-1">
                          SISTEMA DE AUDITORÍA ACADÉMICA CENTRALIZADA
                        </div>
                        <h2 className="text-lg font-black text-white leading-tight">
                          TECLINGO • PROGRAMA MATRIZ GENERAL DE CURSOS 2026
                        </h2>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          MÓDULO: INGLES GENERAL PARA ESCENARIOS REALES (NIVEL INICIAL A1.1)
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end text-left md:text-right">
                        <span className="px-2.5 py-1 text-[8px] font-mono font-bold bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 rounded-md">
                          CÓDIGO: TEC-A11-M1-2026
                        </span>
                        <span className="text-[8.5px] text-slate-500 mt-1 font-mono">
                          Revisión: v1.0.4-Múltiple
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Page conditional renders */}
                  <AnimatePresence mode="wait">
                    {pdfPage === 1 && (
                      <motion.div
                        key="page1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="py-6 space-y-6 text-left"
                      >
                        {/* Section 1: Intro */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#22D3EE] font-mono">
                            I. DIRECTIVAS DEL MODELO EDUCATIVO TECLINGO
                          </h4>
                          <p className="text-[11px] leading-relaxed text-slate-300">
                            La presente planeación oficial establece las pautas pedagógicas obligatorias para la enseñanza de inglés general inicial. Este programa curricular se enfoca en situaciones de <strong>"Everyday English" o Inglés del Día a Día</strong> sin el uso de tecnicismos complejos de negocios o jergas abrumadoras. De esta manera, garantizamos que el estudiante adquiera una base de conversación y expresión oral fluida, libre de pánico escénico y perfectamente sincronizada con los estándares internacionales TOEFL.
                          </p>
                        </div>

                        {/* Section 2: Competencias Clave */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#22D3EE] font-mono">
                            II. MATRIZ DE COMPETENCIAS INTEGRADAS (MÉTODO TOEFL)
                          </h4>
                          <span className="text-[10px] text-slate-400 block -mt-1 leading-normal">
                            Cada clase de TECLINGO incluye el desarrollo medible de 5 saberes independientes:
                          </span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3">
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-400/15 border border-amber-400/20 px-2 py-0.5 rounded font-mono uppercase">
                                GRAMMAR
                              </span>
                              <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
                                Estructuras gramaticales puras aplicadas directamente a hábitos reales, presentadas sin explicaciones complejas de pizarrones antiguos.
                              </p>
                            </div>

                            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3">
                              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-400/15 border border-indigo-400/20 px-2 py-0.5 rounded font-mono uppercase">
                                VOCABULARY
                              </span>
                              <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
                                Vocabulario funcional para el hogar, la cafetería, tiendas, y aeropuertos que permite la comunicación instantánea y descriptiva.
                              </p>
                            </div>

                            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3">
                              <span className="text-[9px] font-bold text-sky-400 bg-sky-400/15 border border-sky-400/20 px-2 py-0.5 rounded font-mono uppercase">
                                LISTENING
                              </span>
                              <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
                                Comprensión y aislamiento de datos directos (números de teléfono, precios, horas exactas, nombres de pila deletreados).
                              </p>
                            </div>

                            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3">
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/15 border border-emerald-400/20 px-2 py-0.5 rounded font-mono uppercase">
                                SPEAKING
                              </span>
                              <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
                                Formulación oral fluida interactuando bilingüemente con nuestro motor inteligente de Inteligencia Artificial para perder la timidez.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Audit Details */}
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3">
                          <ShieldCheck className="text-amber-400 shrink-0 mt-0.5" size={16} />
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block font-mono">
                              AVISO DE AUDITORÍA ACADÉMICA MANDATORIA:
                            </span>
                            <p className="text-[10px] text-slate-300 leading-relaxed mt-1">
                              Esta planeación es un documento legal interno. Los docentes deben firmar y verificar el avance semanal para mantener la acreditación. Los KPI de cierre de semana son obligatorios y auditables por la Dirección General.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {pdfPage === 2 && (
                      <motion.div
                        key="page2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="py-6 space-y-6 text-left"
                      >
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#22D3EE] font-mono">
                          III. PROGRAMACIÓN Y MALLA CURRICULAR: BLOQUE SEMANAS 1 AL 9
                        </h4>

                        <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/40">
                          <table className="w-full text-[10.5px] border-collapse">
                            <thead>
                              <tr className="bg-slate-950 text-[#22D3EE] font-bold border-b border-white/10 font-mono text-[9px] uppercase tracking-wider text-left">
                                <th className="p-3">Semana</th>
                                <th className="p-3">Eje Temático Principal (Everyday English)</th>
                                <th className="p-3">Evidencia / KPI Mandatorio</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-300">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => (
                                <tr key={w} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="p-3 font-mono text-center font-bold text-white bg-slate-900/40">
                                    {w}
                                  </td>
                                  <td className="p-3 font-semibold text-slate-200">
                                    {semanasDemoData[w].eje_tematico}
                                  </td>
                                  <td className="p-3 text-[10px] text-emerald-400/90 italic">
                                    {semanasDemoData[w].kpi}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}

                    {pdfPage === 3 && (
                      <motion.div
                        key="page3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="py-6 space-y-6 text-left"
                      >
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#22D3EE] font-mono">
                          IV. PROGRAMACIÓN Y MALLA CURRICULAR: BLOQUE SEMANAS 10 AL 18
                        </h4>

                        <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/40 mb-6">
                          <table className="w-full text-[10.5px] border-collapse">
                            <thead>
                              <tr className="bg-slate-950 text-[#22D3EE] font-bold border-b border-white/10 font-mono text-[9px] uppercase tracking-wider text-left">
                                <th className="p-3">Semana</th>
                                <th className="p-3">Eje Temático Principal (Everyday English)</th>
                                <th className="p-3">Evidencia / KPI Mandatorio</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-300">
                              {[10, 11, 12, 13, 14, 15, 16, 17, 18].map((w) => (
                                <tr key={w} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="p-3 font-mono text-center font-bold text-white bg-slate-900/40">
                                    {w}
                                  </td>
                                  <td className="p-3 font-semibold text-slate-200">
                                    {semanasDemoData[w].eje_tematico}
                                  </td>
                                  <td className="p-3 text-[10px] text-emerald-400/90 italic">
                                    {semanasDemoData[w].kpi}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Signature area and stamps to match high authenticity */}
                        <div className="border-t border-white/10 pt-6 mt-8">
                          <div className="text-[9.5px] font-mono uppercase text-[#22D3EE] font-bold tracking-widest mb-4">
                            V. SECCIÓN DE FIRMAS Y VALIDEZ DIGITAL DE LA ACADEMIA
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            
                            {/* General Board Stamp */}
                            <div className="border border-white/10 rounded-2xl p-4 bg-slate-950 text-left flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full border-2 border-emerald-500/40 border-dashed flex items-center justify-center text-emerald-400 animate-spin-slow shrink-0">
                                <Award size={20} />
                              </div>
                              <div>
                                <span className="text-[9px] font-mono text-slate-500 block">DIRECCIÓN DE CONTROL ESCOLAR</span>
                                <span className="text-[10.5px] font-bold text-white block mt-1 leading-none">
                                  Dr. Roberto A. Garza S.
                                </span>
                                <p className="text-[8px] text-emerald-400/90 font-mono mt-1 uppercase tracking-wider font-bold">
                                  ✓ AUTORIZADO ELECTRONICALLY
                                </p>
                              </div>
                            </div>

                            {/* Academic Audit Stamp */}
                            <div className="border border-white/10 rounded-2xl p-4 bg-slate-950 text-left flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full border-2 border-[#22D3EE]/40 border-dashed flex items-center justify-center text-[#22D3EE] shrink-0">
                                <ShieldCheck size={20} />
                              </div>
                              <div>
                                <span className="text-[9px] font-mono text-slate-500 block">CONSEJO ACADÉMICO TECLINGO</span>
                                <span className="text-[10.5px] font-bold text-white block mt-1 leading-none">
                                  Dra. Elena Ruiz de L.
                                </span>
                                <p className="text-[8px] text-[#22D3EE]/90 font-mono mt-1 uppercase tracking-wider font-bold">
                                  ✓ FIRMADO COMPILADO S1-S18
                                </p>
                              </div>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom Sheet Footer */}
                  <div className="border-t border-white/10 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-center text-[8.5px] font-mono text-slate-500 gap-2">
                    <span>
                      TECLINGO INTERNATIONAL SCHOOL OF ENGLISH © 2026
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      <Lock size={8} /> ENCRIPTACIÓN SEGURA CSEC_PASS-V1
                    </span>
                    <span>
                      Pág. {pdfPage} de 3
                    </span>
                  </div>

                </div>

              </div>
              
              {/* Footer status line with details */}
              <div className="p-3 bg-black/90 border-t border-white/5 text-[9px] text-slate-400 font-mono flex flex-col md:flex-row md:justify-between items-center gap-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Archivo certificado mediante Protocolo de Encriptación de Auditoría General de la Secretaría General de TECLINGO
                </span>
                <span>
                  Reg. CSEC-A1.1-2026
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

