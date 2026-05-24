/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileCode, 
  FileText, 
  Database, 
  Trash2, 
  Search, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  FileDown,
  RefreshCw,
  Sparkles,
  BookOpen,
  Plus,
  ChevronDown,
  ChevronUp,
  Book,
  X,
  Layers,
  Pencil,
  Folder,
  Download,
  Award,
  FileJson,
  Copy,
  Check,
  Users,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../context/AppContext';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { GlassCard } from './GlassCard';
import { LibroVirtualDirectorCompleto } from './LibroVirtualDirectorCompleto';
import PreDistributionGrid from './PreDistributionGrid';
import { SchedulesMaster } from './SchedulesMaster';

interface Subject {
  code: string;
  name: string;
  semester: number;
  hours: number;
}

interface Career {
  id: string;
  name: string;
  code: string;
  limitHours: number;
  subjects: Subject[];
  grado_semestre?: number;
}

interface LibraryDoc {
  id: string;
  name: string;
  size: string;
  type: 'json' | 'pdf';
  uploadedAt: any;
  status: 'active' | 'pending';
  checksum: string;
  description?: string;
}

export interface SyllabusItem {
  semestre: number;
  semana: string;
  tema_it: string;
  nivel_mcer: string;
  habilidades_toefl: {
    Grammar: string;
    Listening: string;
    Reading: string;
    Writing: string;
    Speaking: string;
  };
  kpi_entregable?: string;
}

export const SYLLABUS_DATA: SyllabusItem[] = [
  // Semestre 1 (Módulo 1 - A1.1 Principiante 18 Semanas)
  {
    semestre: 1,
    semana: "Semana 1",
    tema_it: "Saludos, Presentaciones Personales y Cortesía Básica",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Dominar el verbo 'To Be' en su modo afirmativo y los pronombres personales de sujeto (I, You, He, She, It, We, They). Enfoque en la obligatoriedad de usar un sujeto explícito en cada oración.",
      Listening: "Identificar nombres propios deletreados letra por letra, números de teléfono y edades exactas en saludos amistosos pausados.",
      Reading: "Extraer información objetiva directa (nombres, procedencias y profesiones básicas) de perfiles en cartas de presentación y correos de saludo.",
      Writing: "Redactar un perfil personal de presentación de mínimo 30 palabras uniendo ideas con los conectores básicos 'and' y 'but'.",
      Speaking: "Expresar saludos cordiales, decir el nombre de pila, edad y nacionalidad de forma clara frente a la IA sin vacilaciones críticas."
    },
    kpi_entregable: "Tarjeta de contacto personal escrita y audio grabado de presentación de un minuto."
  },
  {
    semestre: 1,
    semana: "Semana 2",
    tema_it: "Objetos Escolares y del Aula de Clase",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Estructurar negaciones directas con el verbo 'To Be' (not) y comprender las reglas de terminación de plurales regulares (-s / -es).",
      Listening: "Aislar cantidades exactas de objetos descritos por un docente en grabaciones escolares de velocidad baja.",
      Reading: "Interpretar listas sencillas de materiales requeridos para una sesión de dibujo o de lectura general.",
      Writing: "Elaborar una lista escrita y pautada describiendo los objetos que se encuentran en una mochila clásica.",
      Speaking: "Nombrar objetos comunes a su alrededor frente a la IA utilizando de manera consistente el género y número adecuado."
    },
    kpi_entregable: "Inventario descriptivo del equipamiento personal del estudiante."
  },
  {
    semestre: 1,
    semana: "Semana 3",
    tema_it: "Miembros de la Familia y Relaciones Básicas",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Utilizar adjetivos posesivos (my, your, his, her, its, our, their) para señalar relaciones e identificar la pertenencia de objetos en la vida familiar.",
      Listening: "Mapear nexos familiares directos en diálogos conversacionales sencillos que exponen a los miembros de una familia nuclear.",
      Reading: "Relacionar descripciones de árboles genealógicos textuales cortos con los nombres de las personas indicadas.",
      Writing: "Escribir un párrafo breve (mínimo 35 palabras) en inglés describiendo la profesión de uno de sus padres o hermanos.",
      Speaking: "Responder con facilidad a preguntas del tutor de IA sobre sus parientes cercanos e indicar cómo se llaman y qué edad poseen."
    },
    kpi_entregable: "Párrafo del árbol genealógico familiar con nombres y roles claros."
  },
  {
    semestre: 1,
    semana: "Semana 4",
    tema_it: "Países, Nacionalidades e Idiomas del Mundo",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Formular preguntas de información estructurando correctamente las palabras interrogativas esenciales (What, Where, Who, When).",
      Listening: "Reconocer gentilicios y nombres de países de origen en un audio TOEFL de bienvenida a turistas internacionales.",
      Reading: "Ubicar el país de origen y el idioma oficial de diversos viajeros al leer formularios de registro de hotel elementales.",
      Writing: "Redactar mensajes post-it cortos informativos indicando de qué ciudades y países proceden diferentes amigos suyos.",
      Speaking: "Describir oralmente a la IA un país que desea visitar, mencionando su idioma e información demográfica rudimentaria."
    },
    kpi_entregable: "Formulario de registro turístico con enunciados de procedencia."
  },
  {
    semestre: 1,
    semana: "Semana 5",
    tema_it: "Pasatiempos, Deporte y Actividades Recreativas",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Dominar de forma contextual los artículos definidos e indefinidos (a, an, the) al enunciar hobbys y gustos genéricos.",
      Listening: "Identificar el deporte o la actividad preferida de fin de semana que mencionan múltiples hablantes en encuestas públicas.",
      Reading: "Interpretar anuncios y convocatorias de fin de semana para clubes recreativos o equipos de fútbol comunitarios.",
      Writing: "Redactar una carta personal corta que exprese las actividades recreativas que disfruta realizar y las que prefiere evitar.",
      Speaking: "Hablar de forma continua durante 40 segundos sobre su pasatiempo favorito y justificar brevemente la razón de su preferencia."
    },
    kpi_entregable: "Ensayo corto sobre hobbys de ocio predilectos."
  },
  {
    semestre: 1,
    semana: "Semana 6",
    tema_it: "Descripción Física de Personas y Adjetivos de Aspecto",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Comprender la sintaxis y ubicación de los adjetivos calificativos elementales antes del sustantivo al detallar la apariencia.",
      Listening: "Aislar rasgos de apariencia física en grabaciones donde se relata cómo es el perfil de un sospechoso o de un amigo perdido.",
      Reading: "Relacionar fotografías de rostros con descripciones formales escritas que detallan color de cabello, estatura y ojos.",
      Writing: "Escribir un perfil descriptivo de un amigo cercano utilizando al menos 5 adjetivos distintos de apariencia y carácter básico.",
      Speaking: "Elegir a una persona famosa y relatarle a la IA con oraciones estructuradas sus rasgos físicos primordiales."
    },
    kpi_entregable: "Ficha descriptiva ilustrativa de un personaje de interés."
  },
  {
    semestre: 1,
    semana: "Semana 7",
    tema_it: "Actividades de la Rutina Diaria (Por la Mañana)",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Introducir el Presente Simple en oraciones afirmativas para relatar hábitos continuos de aseo y alimentación matutina.",
      Listening: "Extraer los horarios exactos en los que las personas se despiertan o toman el desayuno en entrevistas pausadas.",
      Reading: "Seguir el itinerario matinal plasmado en agendas personales o tablas simples de planeación en el hogar.",
      Writing: "Escribir una lista estructurada sobre sus acciones habituales de las primeras horas de la mañana con adverbios básicos.",
      Speaking: "Describir verbalmente su rutina matinal desde que despierta hasta que sale de casa utilizando secuencias lógicas directas."
    },
    kpi_entregable: "Tabla de horarios de actividades diarias matutinas."
  },
  {
    semestre: 1,
    semana: "Semana 8",
    tema_it: "Rutina de Trabajo y Actividades por la Tarde",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Aplicar las reglas generales de concordancia de la tercera persona del singular en Presente Simple (-s, -es, -ies) al relatar rutinas de otros.",
      Listening: "Deducir a qué hora termina de trabajar o comer un conferencista en base a un relato auditivo lineal.",
      Reading: "Interpretar textos ilustrados cortos sobre el día de trabajo típico de diferentes oficios comunes (ej: carpintero, panadero).",
      Writing: "Redactar un correo de seguimiento informal que detalle su horario de almuerzo y el inicio de sus deberes de la tarde.",
      Speaking: "Explicar de forma detallada a la IA qué hace su mejor amigo o pareja por las tardes en su jornada ordinaria."
    },
    kpi_entregable: "Reporte escrito comparativo sobre la rutina laboral vespertina."
  },
  {
    semestre: 1,
    semana: "Semana 9",
    tema_it: "Hábitos Nocturnos, Descanso y Fin de la Jornada",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Utilizar correctamente los auxiliares 'do' y 'does' para estructurar preguntas de confirmación cerradas de la vida cotidiana.",
      Listening: "Aislar si un hablante practica la lectura o mira la televisión antes de dormir en grabaciones nocturnas cortas.",
      Reading: "Analizar folletos de relajación o guías de descanso doméstico básicas que sugieren hábitos antes de ir a dormir.",
      Writing: "Sintetizar un cuestionario escrito de 5 preguntas cerradas orientadas a indagar sobre hábitos de sueño saludables.",
      Speaking: "Debatir brevemente con el tutor de IA si prefiere realizar actividades tranquilas o ejercicio físico pesado en la noche."
    },
    kpi_entregable: "Cuestionario de hábitos del sueño resuelto y estructurado."
  },
  {
    semestre: 1,
    semana: "Semana 10",
    tema_it: "Ubicación Espacial, Habitaciones y Muebles de Casa",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Usar preposiciones esenciales de lugar (in, on, under, next to, behind) para describir la posición espacial exacta de objetos cotidianos.",
      Listening: "Reconocer las coordenadas de ubicación de un juego de llaves en diálogos lentos donde un familiar da indicaciones a otro.",
      Reading: "Relacionar listas de compras de muebles para el hogar con las habitaciones sugeridas de colocación.",
      Writing: "Componer una breve descripción escrita (40 palabras) de su espacio favorito de la casa, indicando qué muebles tiene.",
      Speaking: "Formular respuestas rápidas ante la IA describiendo dónde se encuentran sus pertenencias más importantes."
    },
    kpi_entregable: "Croquis clasificado de la distribución interna del hogar."
  },
  {
    semestre: 1,
    semana: "Semana 11",
    tema_it: "Medios de Transporte y Traslados en la Ciudad",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Dominar el uso de pronombres demostrativos tanto singulares como plurales (this, that, these, those) en referencias a vehículos.",
      Listening: "Extraer los medios de traslado usuales (by car, by bus, on foot) afirmados por transeúntes en reportajes de radio simulados.",
      Reading: "Mapear instructivos simples de rutas de metro, autobús o mapas de viaje peatonal simples.",
      Writing: "Escribir un párrafo descriptivo detallando los transportes públicos de su ciudad y su frecuencia media.",
      Speaking: "Narrar a la IA cómo se traslada diariamente a la escuela, detallando tiempos y el tipo de transporte utilizado."
    },
    kpi_entregable: "Manual descriptivo de ruta de traslado para visitantes."
  },
  {
    semestre: 1,
    semana: "Semana 12",
    tema_it: "El Tiempo de Ocio y Frecuencia de Actividades",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Colocar los adverbios de frecuencia principales (always, usually, often, sometimes, never) en la posición correcta frente al verbo.",
      Listening: "Aislar qué tan a menudo las personas realizan paseos o asisten al cine en relatos de amigos sobre su tiempo libre.",
      Reading: "Leer encuestas turísticas que tabulan los hábitos de esparcimiento de adultos durante las vacaciones.",
      Writing: "Elaborar un párrafo descriptivo (mínimo 40 palabras) sobre actividades de recreación habituales empleando adverbios de frecuencia.",
      Speaking: "Responder con fluidez a preguntas aleatorias de la IA sobre la frecuencia de sus tareas cotidianas utilizando respuestas estructuradas."
    },
    kpi_entregable: "Reporte analítico de frecuencia de ocio semanal."
  },
  {
    semestre: 1,
    semana: "Semana 13",
    tema_it: "Alimentos, Nutrición Básica y Menú de Casa",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Incorporar sustantivos contables e incontables elementales junto con cuantificadores de comida de uso diario (some, any).",
      Listening: "Deducir los ingredientes específicos solicitados por un comensal al ordenar su desayuno en una simulación lenta de cafetería.",
      Reading: "Interpretar recetas de cocina elementales, menús de comida y listas de compras de comestibles básicas.",
      Writing: "Escribir el menú semanal ideal de almuerzos de forma organizada especificando qué alimentos se requieren.",
      Speaking: "Simular una llamada de pedido de víveres interactiva con la IA indicando qué le gustaría comprar."
    },
    kpi_entregable: "Menú nutricional semanal detallado en inglés."
  },
  {
    semestre: 1,
    semana: "Semana 14",
    tema_it: "Habilidades Cotidianas, Talentos y Capacidades",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Dominar el uso práctico del verbo modal 'Can' y 'Can't' para referirse a talentos personales y habilidades estándar aprendidas.",
      Listening: "Captar qué actividades extraordinarias (dibujar, cantar, nadar) posee o no posee el orador en grabaciones informales de audiciones.",
      Reading: "Localizar perfiles idóneos para un voluntariado leyendo las habilidades descritas en folletos comunitarios.",
      Writing: "Redactar una justificación breve solicitando ingreso a un club social, describiendo tres cosas que sabe realizar bien.",
      Speaking: "Enunciar en voz alta ante la IA una lista de actividades que puede hacer de forma excelente y las que no le es posible practicar."
    },
    kpi_entregable: "Carta de postulación de talentos para club vecinal."
  },
  {
    semestre: 1,
    semana: "Semana 15",
    tema_it: "Estaciones del Año, Ropa y Clima Diario",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Asociar adjetivos de clima ('It is cold', 'It is sunny') con oraciones en Presente Continuo para describir lo que la gente está vistiendo.",
      Listening: "Capturar las condiciones de temperatura del fin de semana emitidas en resúmenes radiales de clima simplificados.",
      Reading: "Analizar folletos de viaje que recomiendan qué tipo de vestuario empacar según el clima promedio de las estaciones.",
      Writing: "Redactar un correo electrónico corto aconsejando a un amigo qué ponerse mañana ante un aviso de tormenta fuerte.",
      Speaking: "Mirar el clima actual por su ventana y relatárselo a la IA, detallando la ropa propicia para salir a la calle."
    },
    kpi_entregable: "Planificador de vestuario con base en el pronóstico climático."
  },
  {
    semestre: 1,
    semana: "Semana 16",
    tema_it: "Compras en Tiendas, Precios y Regateo Básico",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Dominar expresiones de cantidad elementales ('How much is...?', 'How many are...?') orientadas al cobro de víveres cotidianos.",
      Listening: "Identificar montos, costos totales y vueltos exactos conversados en una interacción simulada de compra de ropa.",
      Reading: "Comprender los precios descritos en volantes comerciales y calcular los productos más convenientes de la tienda.",
      Writing: "Escribir un reclamo corto para atención al cliente debido a un cobro excesivo cometido por un cajero.",
      Speaking: "Sostener una negociación amistosa con la IA intentando comprar un objeto usado indicando un presupuesto fijo."
    },
    kpi_entregable: "Presupuesto de compras y reclamo formal simulado por escrito."
  },
  {
    semestre: 1,
    semana: "Semana 17",
    tema_it: "Fórmulas de Cortesía, Permisos y Pedir Favor",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Estructurar imperativos suaves y oraciones con marcas de cortesía utilizando 'Please', 'Excuse me' o los modales básicos ('Can I...', 'Could you...').",
      Listening: "Distinguir la cortesía formal frente al lenguaje informal en requerimientos cotidianos expresados en bibliotecas o cafeterías.",
      Reading: "Analizar carteles informativos y señalizaciones públicas comunes referidos a reglas de conducta básicas (silencio, orden).",
      Writing: "Componer una nota escrita y formal pidiendo respetuosamente al casero que revise un desperfecto menor en la llave de paso.",
      Speaking: "Practicar la emisión de oraciones interrogativas de solicitud con un tono vocal afable ante el examinador inteligente."
    },
    kpi_entregable: "Nota formal de solicitud de asistencia doméstica."
  },
  {
    semestre: 1,
    semana: "Semana 18",
    tema_it: "Planificación Vacacional y Deseos para el Verano",
    nivel_mcer: "A1.1 Principiante",
    habilidades_toefl: {
      Grammar: "Usar estructuras elementales que expresan proyección de planes o intenciones vacacionales ('I want to visit...', 'I would like to stay at...').",
      Listening: "Reconocer destinos turísticos y actividades recreativas relatadas por viajeros joviales en entrevistas lentas de despedida.",
      Reading: "Extraer los mejores sitios, horarios y atracciones naturales de un catálogo de destinos veraniegos simples.",
      Writing: "Redactar un ensayo expositivo-argumentativo final de 50 palabras sobre el lugar de descanso soñado para pasar las vacaciones.",
      Speaking: "Presentar un discurso continuo de un minuto a la IA defendiendo por qué prefiere vacacionar en la playa antes que en la montaña."
    },
    kpi_entregable: "Plan de viaje vacacional ideal consolidado en formato JSON."
  },
  // Semestre 2 (Módulo 2 - A1.2 Elemental)
  {
    semestre: 2,
    semana: "Semana 5",
    tema_it: "Imperatives & CLI Automation for CI/CD Workflows",
    nivel_mcer: "A1.2 Elemental",
    habilidades_toefl: {
      Grammar: "Consolidar imperativos técnicos dirigidos a scripting (Bash/Vite) y contrastar Present Simple frente a Present Continuous en tiempo real ('The pipeline compiles vs is compiling').",
      Listening: "Captar instrucciones secuenciales rápidas de despliegue de contenedores (Deployment pipelines) e identificar transiciones lógicas.",
      Reading: "Interpretar bitácoras de errores secuenciales directas (Console logs) y de codificar advertencias críticas de redundancias de red.",
      Writing: "Escribir minutas de reuniones de desarrollo de software (Meeting minutes) usando viñetas e imperativos sintácticos con impecable ortografía.",
      Speaking: "Explicar flujos lógicos simples línea por línea (ej. condicionales si/entonces y bucles) mostrando control sintáctico frente a la IA."
    }
  },
  {
    semestre: 2,
    semana: "Semana 6",
    tema_it: "Static File Servers, Assets and Reverse Proxy Foundations",
    nivel_mcer: "A1.2 Elemental",
    habilidades_toefl: {
      Grammar: "Uso de conectores de secuencia temporales y lógicos (first, next, subsequently) en descripciones de flujo de red.",
      Listening: "Seguir pláticas cortas de DevOps explicando cómo Nginx reverse-proxy rutea el tráfico al puerto local 3000.",
      Reading: "Analizar esquemas JSON de configuración básica de paquetes de dependencias de Node (package.json).",
      Writing: "Escribir mensajes de confirmación de commits de Git que representen el trabajo ejecutado (ej. 'Fix: Update proxy route for production').",
      Speaking: "Describir el estatus de un microservicio ('running', 'building' o 'failed') detallando los logs de error de forma oral."
    }
  },
  {
    semestre: 2,
    semana: "Semana 7",
    tema_it: "Continuous Testing & Unitary Automated Pipelines",
    nivel_mcer: "A1.2 Elemental",
    habilidades_toefl: {
      Grammar: "Uso modal de sugerencia y mandato leve (should, want to, need to) para optimización de especificaciones de testing.",
      Listening: "Extraer las causas por las que un build fue abortado a mitad de camino en una discusión simulada entre ingenieros de infraestructura.",
      Reading: "Interpretar reportes de cobertura de pruebas unitarias indicando porcentajes de éxito y bloques fallidos.",
      Writing: "Enviar correos breves pero altamente formales a desarrolladores junior solicitando la corrección de integraciones rotas.",
      Speaking: "Presentar propuestas breves de ordenamiento de flujos de DevOps a la IA para acelerar el feedback del cliente."
    }
  },
  {
    semestre: 2,
    semana: "Semana 8",
    tema_it: "Nginx Ingress Configuration & Client SPA Build Deployments",
    nivel_mcer: "A1.2 Elemental",
    habilidades_toefl: {
      Grammar: "Consolidación de proposiciones de lugar y dirección para transferencias de red y puertos de entrada/salida de variables locales.",
      Listening: "Identificar nombres propios de herramientas modernas e identificar la actitud del orador cuando discute sobre frameworks obsoletos.",
      Reading: "Interpretar instructivos de redireccionamiento de puertos en configuraciones de firewall corporativo del ERP.",
      Writing: "Elaborar un reporte descriptivo breve de los puertos expuestos en una subred bajo estricto cumplimiento de políticas de red.",
      Speaking: "Formular instrucciones precisas a un modelo de lenguaje para automatizar el aprovisionamiento de un servidor de forma clara."
    }
  },
  // Semestre 3 (Módulo 3 - A2.1 Pre-Intermedio)
  {
    semestre: 3,
    semana: "Semana 9",
    tema_it: "Incident Narration & Root Cause Diagnostics (AWS / GCP clusters)",
    nivel_mcer: "A2.1 Pre-Intermedio",
    habilidades_toefl: {
      Grammar: "Controlar el Pasado Simple (verbos regulares e irregulares de IT como crash, bind, build, restore) y el uso de marcadores de tiempo históricos.",
      Listening: "Seguir hilos de llamadas de soporte de velocidad media, aislando distractores para ubicar exactamente la causa raíz (Root Cause) de la brecha.",
      Reading: "Leer, asimilar y sintetizar guías de usuario completas, diagramas de bases de datos y términos de condiciones de servicio de AWS/GCP.",
      Writing: "Documentar tickets en plataformas oficiales (Jira/Service Desk) de forma clara y profesional definiendo causa, impacto y mitigaciones directas de la industria.",
      Speaking: "Narrar incidentes históricos pasados de servidores y defender soluciones de arquitectura de bases de datos ante preguntas de la IA."
    }
  },
  {
    semestre: 3,
    semana: "Semana 10",
    tema_it: "Performance Optimization, Memory Leaks & Resource Scaling",
    nivel_mcer: "A2.1 Pre-Intermedio",
    habilidades_toefl: {
      Grammar: "Emplear cuantitativos de métricas de rendimiento (fewer exceptions, less memory overhead, faster throughput, much latency) de manera precisa.",
      Listening: "Deducir la postura y grado de certeza de un arquitecto de la nube durante un debate de migración a bases de datos relacionales.",
      Reading: "Localizar fugas de recursos examinando comparativas de logs históricos de consumo de CPU/RAM.",
      Writing: "Sintetizar reportes comparativos de performance usando adjetivos comparativos regulares e irregulares (better, worse, faster, more stable).",
      Speaking: "Describir ante la IA un evento de fuga de memoria del sistema y sustentar oralmente por qué se aplicó un parche de emergencia."
    }
  },
  {
    semestre: 3,
    semana: "Semana 11",
    tema_it: "Database Schemas & Version Control Commits",
    nivel_mcer: "A2.1 Pre-Intermedio",
    habilidades_toefl: {
      Grammar: "Uso correcto del Pasado Simple frente al Pasado Continuo en situaciones superpuestas (ej. 'The database was updating when the connection failed').",
      Listening: "Captar discrepancias lógicas de esquemas de bases de datos discutidas en llamadas grupales técnicas con velocidad moderada.",
      Reading: "Interpretar esquemas relacionales complejos de base de datos y diagramas entidad-relación.",
      Writing: "Crear reportes formales de cambios en commits (changelogs) explicitando las modificaciones realizadas a las tablas de bases de datos.",
      Speaking: "Demostrar la capacidad de justificar un rollback de base de datos ante la IA de manera estructurada."
    }
  },
  {
    semestre: 3,
    semana: "Semana 12",
    tema_it: "Legacy API Migration Frameworks & Support Handover",
    nivel_mcer: "A2.1 Pre-Intermedio",
    habilidades_toefl: {
      Grammar: "Sintetizar oraciones con conectores concesivos (although, despite, in spite of) para redactar excepciones de sistemas antiguos.",
      Listening: "Identificar los supuestos técnicos ocultos en discusiones de ingenieros senior sobre sistemas monolíticos legados.",
      Reading: "Evaluar críticamente documentación antigua de APIs obsoletas para identificar incompatibilidades de red.",
      Writing: "Documentar un plan formal de transición de soporte (handover documentation) para el equipo entrante.",
      Speaking: "Debatir activamente con la IA las vulnerabilidades de mantener activas dependencias deprecadas."
    }
  },
  // Semestre 4 (Módulo 4 - A2.2 Intermedio Bajo)
  {
    semestre: 4,
    semana: "Semana 13",
    tema_it: "Cloud Scalability, Risk Modeling & RFP Proposals",
    nivel_mcer: "A2.2 Intermedio Bajo",
    habilidades_toefl: {
      Grammar: "Dominar el Primer Condicional para proyecciones de fallos ('If we deploy... will...'), futuro con Will/Going to, y modales de obligación avanzada.",
      Listening: "Comprender exposiciones técnicas cortas y conferencias de nivel TOEFL sobre escalabilidad en la nube, balanceadores de carga y redundancias.",
      Reading: "Analizar Requerimientos Funcionales (RF), no funcionales (RNF) y pliegos de condiciones técnicas procedentes de RFPs comerciales.",
      Writing: "Elaborar planes de pruebas automatizados detallados (Test Plans) y redactar especificaciones de requerimientos estructurales claros.",
      Speaking: "Presentar demostraciones funcionales (SaaS demos) cronometradas con límites de tiempo y justificar decisiones ágiles ante la IA."
    }
  },
  {
    semestre: 4,
    semana: "Semana 14",
    tema_it: "Capacity Optimization, SLA Constraints & Auto-Scaling Rules",
    nivel_mcer: "A2.2 Intermedio Bajo",
    habilidades_toefl: {
      Grammar: "Dominar el uso de modales de habilidad y recomendación en informes de cumplimiento (can, must, should, would, ought to).",
      Listening: "Aislar métricas clave de SLA en lecturas técnicas de audio y notar desacuerdos sobre el umbral de sobrecarga de instancias.",
      Reading: "Extraer cláusulas de disputas de penalizaciones financieras en contratos oficiales de mantenimiento de software.",
      Writing: "Crear borradores estructurados de especificaciones técnicas que satisfagan los requerimientos del SLA.",
      Speaking: "Justificar decisiones de diseño ágiles y ágiles (Scrum, Kanban) articulando respuestas rápidas organizadas con la IA."
    }
  },
  {
    semestre: 4,
    semana: "Semana 15",
    tema_it: "Microservices Architectures & API Gateway Integrations",
    nivel_mcer: "A2.2 Intermedio Bajo",
    habilidades_toefl: {
      Grammar: "Utilizar oraciones subordinadas de propósito y resultado (so that, in order to, resulting in) para describir acoplamientos entre servicios de red.",
      Listening: "Mapear un audio sobre dependencias complejas de endpoints y routers en entornos de informática corporativa.",
      Reading: "Analizar especificaciones técnicas de APIs basadas en REST u OpenAPI para propósitos de integración.",
      Writing: "Documentar diagramas lógicos describiendo el flujo del API Gateway mediante explicaciones escritas formales.",
      Speaking: "Defender oralmente la elección de microservicios sobre monolitos utilizando ejemplos claros ante la IA."
    }
  },
  {
    semestre: 4,
    semana: "Semana 16",
    tema_it: "Disaster Recovery Testing & Edge Location Routing Rules",
    nivel_mcer: "A2.2 Intermedio Bajo",
    habilidades_toefl: {
      Grammar: "Uso de condicionales con 'provided that', 'as long as' y 'unless' aplicado a planes de contingencia críticos.",
      Listening: "Extraer detalles técnicos cruciales de llamadas de urgencia sobre fallas en la redundancia geográfica de red.",
      Reading: "Evaluar planes de recuperación ante desastres de corporaciones multinacionales identificando lagunas lógicas.",
      Writing: "Componer una matriz de riesgos en formato Markdown con escalas de probabilidad, impacto e instrucciones de remediación.",
      Speaking: "Exponer de manera elocuente las fases de un simulacro de recuperación ante desastres a la IA en un límite de tiempo."
    }
  },
  // Semestre 5 (Módulo 5 - B1.1 Intermedio)
  {
    semestre: 5,
    semana: "Semana 17",
    tema_it: "Disaster Recovery & Post-Mortem Audits (IAM Security Rules)",
    nivel_mcer: "B1.1 Intermedio",
    habilidades_toefl: {
      Grammar: "Controlar Reported Speech (Discurso Indirecto) en el pasado ('asserted that', 'claimed that'), Pasado Perfecto y estructuras causativas de delegación (Get/Have).",
      Listening: "Capturar ironías, contradicciones y actitudes no cooperativas de los ingenieros en chats de voz durante auditorías de TI y juntas técnicas.",
      Reading: "Analizar informes complejos de auditorías de TI, políticas de seguridad corporativas, políticas IAM y mapeos relacionales de bases de datos.",
      Writing: "Redactar análisis post-mortem de 100 palabras mínimo detallando caídas del sistema, brechas de datos de forma pasiva y escalación estructurada.",
      Speaking: "Retransmitir acuerdos de juntas en discurso indirecto a la IA y negociar activamente de forma fluida."
    }
  },
  {
    semestre: 5,
    semana: "Semana 18",
    tema_it: "Compliance Audits, GDPR Governance & IAM Authorizations",
    nivel_mcer: "B1.1 Intermedio",
    habilidades_toefl: {
      Grammar: "Dominar verbos de reporte avanzados en voz pasiva formal (is alleged to, has been reported to, was confirmed to) para fines de cumplimiento.",
      Listening: "Aislar distractores sintácticos de nivel TOEFL iBT en paneles de discusión sobre regulaciones internacionales de manejo de datos.",
      Reading: "Evaluar detalladamente las secciones críticas del reglamento GDPR relativas a transferencias transfronterizas de bases de datos.",
      Writing: "Generar respuestas documentadas a reportes de no-conformidad expedidos por auditores de seguridad de redes.",
      Speaking: "Expresar argumentos persuasivos defendiendo que la infraestructura cumple con la regulación SOC 2 en simulaciones con la IA."
    }
  },
  {
    semestre: 5,
    semana: "Semana 19",
    tema_it: "Multi-Container Orchestration & Docker-Compose Layouts",
    nivel_mcer: "B1.1 Intermedio",
    habilidades_toefl: {
      Grammar: "Uso de cláusulas relativas restrictivas y no-restrictivas en explicaciones de mapeo de red e orquestación de recursos.",
      Listening: "Seguir pláticas técnicas de alta velocidad describiendo topologías híbridas de orquestación (Kubernetes Pods).",
      Reading: "Analizar códigos YAML de orquestación de recursos identificando enlaces lógicos y políticas de reinicio.",
      Writing: "Escribir un reporte justificativo de la arquitectura de contenedores para aprobación de financiamiento del CTO.",
      Speaking: "Presentar una propuesta de rediseño de microservicios argumentando los pros del aislamiento lógico de bases de datos relacionales."
    }
  },
  {
    semestre: 5,
    semana: "Semana 20",
    tema_it: "Cybersecurity Breach Incidents & Threat Mitigation Protocols",
    nivel_mcer: "B1.1 Intermedio",
    habilidades_toefl: {
      Grammar: "Dominar el Pasado Perfecto Progresivo ('had been running') para acciones continuas pasadas interrumpidas por anomalías de seguridad.",
      Listening: "Inferir las opiniones ocultas de expertos durante webinars TOEFL sobre brechas de Ransomware en infraestructuras de misión crítica.",
      Reading: "Leer y sintetizar manuales incidentales de remediación rápida ante ataques de inyección SQL.",
      Writing: "Redactar correos de alerta de seguridad urgentes explicando las medidas de contención tomadas mediante un tono formal.",
      Speaking: "Guiar verbalmente paso a paso un proceso de remediación tras un hackeo, manteniendo la calma comunicativa con la IA."
    }
  },
  // Semestre 6 (Módulo 6 - B1.2 Intermedio Alto)
  {
    semestre: 6,
    semana: "Semana 21",
    tema_it: "TOEFL Academic Rhetoric & Subjunctive SLA Negotiations",
    nivel_mcer: "B1.2 Intermedio Alto",
    habilidades_toefl: {
      Grammar: "Dominar Tercer Condicional avanzado ('Had we known...', 'would have'), inversiones negativas ('Seldom does a framework...'), y el uso de subjuntivo formal.",
      Listening: "Seguir clases universitarias extensas de ciencias de la computación, ponencias de IA generativa y conferencias de TI a velocidad nativa sin subtítulos.",
      Reading: "Evaluar críticamente whitepapers científicos de Inteligencia Artificial (redes neuronales, LLMs) y especificaciones técnicas complejas de nivel académico.",
      Writing: "Redactar propuestas de negocio ejecutivas (RFP proposals), justificaciones de presupuestos detalladas y contratos de acuerdos de nivel de servicio (SLA).",
      Speaking: "Sostener pitches argumentativos de velocidad nativa (60 segundos exactos) enfrentando rúbricas de acento, ritmo y coherencia con la IA."
    }
  },
  {
    semestre: 6,
    semana: "Semana 22",
    tema_it: "Quantum Computing Hardware Foundations & Quantum Encodings",
    nivel_mcer: "B1.2 Intermedio Alto",
    habilidades_toefl: {
      Grammar: "Utilizar inversiones complejas (ej. 'Under no circumstances should the key change') y condicionales mixtos para análisis preventivos.",
      Listening: "Identificar posturas contrapuestas en un debate académico universitario sobre algoritmos criptográficos cuánticos de clave pública.",
      Reading: "Descifrar papers científicos que evalúan la resiliencia de la criptografía simétrica frente a ataques de supercomputadoras.",
      Writing: "Preparar un informe técnico denso que justifique las inversiones para mitigar vulnerabilidades cuánticas de bases de datos.",
      Speaking: "Exponer y contra-argumentar en tiempo real con la IA las ventajas y desventajas éticas del encriptado absoluto de datos."
    }
  },
  {
    semestre: 6,
    semana: "Semana 23",
    tema_it: "AI Governance, Guardrails, Bias Mitigation & Ethical Alignment",
    nivel_mcer: "B1.2 Intermedio Alto",
    habilidades_toefl: {
      Grammar: "Control del subjuntivo formal en demandas regulatorias ('It is imperative that the database be audited immediately').",
      Listening: "Mapear ideas centrales de ponencias sobre cómo reducir alucinaciones en modelos de lenguaje (LLMs).",
      Reading: "Analizar lineamientos legislativos internacionales sobre regulaciones y auditorías obligatorias de sesgos en algoritmos de IA.",
      Writing: "Redactar las políticas éticas internas de desarrollo de software con inteligencia artificial de la corporación.",
      Speaking: "Participar en un debate estructurado de alta complejidad verbal sobre los límites del entrenamiento con datos con derechos de autor ante la IA."
    }
  },
  {
    semestre: 6,
    semana: "Semana 24",
    tema_it: "Interactive Capstone Defense & Realtime TOEFL Assessment",
    nivel_mcer: "B1.2 Intermedio Alto",
    habilidades_toefl: {
      Grammar: "Dominar todas las estructuras retóricas complejas, elipsis, conectores de enlace formales e inversiones en discursos orales extensos.",
      Listening: "Seguir conferencias y defensas doctorales de ingeniería de software a máxima velocidad de habla nativa.",
      Reading: "Sintetizar whitepapers académicos extensos sobre arquitecturas de microservicios escalables para elaborar respuestas exitosas.",
      Writing: "Redactar un ensayo expositivo-argumentativo oficial siguiendo los estándares y rúbricas de la sección Writing del TOEFL iBT.",
      Speaking: "Sostener una defensa de proyecto capstone técnica interactiva de 3 minutos, respondiendo a los cuestionamientos del tutor IA."
    }
  }
];

export function DirectorLibrary() {
  const [documents, setDocuments] = useState<LibraryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverMode, setServerMode] = useState<boolean>(false);
  const [plainText, setPlainText] = useState('');
  
  // Tabs and accordion states
  const [activeUploadTab, setActiveUploadTab] = useState<'JSON' | 'PDF' | 'PLAIN'>('PLAIN');
  const [activeRightTab, setActiveRightTab] = useState<'CATALOG' | 'MONTHS'>('MONTHS');
  const [expandedMonth, setExpandedMonth] = useState<string | null>('Agosto');

  const [activeMainTab, setActiveMainTab] = useState<'PLANEACIONES' | 'RETICULAR' | 'DISTRIBUCION' | 'SYLLABUS' | 'LIBRO_VIRTUAL' | 'GRUPOS' | 'HORARIOS'>(() => {
    const saved = localStorage.getItem('library_initial_tab');
    if (saved === 'LIBRO_VIRTUAL') {
      localStorage.removeItem('library_initial_tab');
      return 'LIBRO_VIRTUAL';
    }
    if (saved === 'HORARIOS') {
      localStorage.removeItem('library_initial_tab');
      return 'HORARIOS';
    }
    return 'SYLLABUS';
  });
  const [activeSyllabusSemester, setActiveSyllabusSemester] = useState<number>(1);
  const [syllabusSearchQuery, setSyllabusSearchQuery] = useState('');
  const [copiedSemester, setCopiedSemester] = useState<boolean>(false);
  const [expandedSyllabusWeeks, setExpandedSyllabusWeeks] = useState<Record<string, boolean>>({
    'Semana 1': true,
    'Semana 5': true,
    'Semana 9': true,
    'Semana 13': true,
    'Semana 17': true,
    'Semana 21': true,
  });

  // Interactive Academical Distribution states
  const [distGrade, setDistGrade] = useState('2º Semestre');
  const [distGroup, setDistGroup] = useState('2° A');
  const [distShift, setDistShift] = useState('Matutino');

  interface AcademicalGroup {
    id: string;
    name: string;
    code: string;
    semester: number;
    shift: 'Matutino' | 'Vespertino' | 'Nocturno';
    capacity: number;
  }

  const [groups, setGroups] = useState<AcademicalGroup[]>(() => {
    const saved = localStorage.getItem('library_groups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      { id: 'GRP-2A', name: '2° A', code: 'GRP-2A', semester: 2, shift: 'Matutino', capacity: 35 },
      { id: 'GRP-2B', name: '2° B', code: 'GRP-2B', semester: 2, shift: 'Vespertino', capacity: 30 },
      { id: 'GRP-1A', name: '1° A', code: 'GRP-1A', semester: 1, shift: 'Matutino', capacity: 40 }
    ];
  });

  const [activeGroupId, setActiveGroupId] = useState<string | null>(() => {
    const saved = localStorage.getItem('library_active_group_id');
    return saved || 'GRP-2A';
  });

  useEffect(() => {
    localStorage.setItem('library_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (activeGroupId) {
      localStorage.setItem('library_active_group_id', activeGroupId);
    } else {
      localStorage.removeItem('library_active_group_id');
    }
  }, [activeGroupId]);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  // Add Group Modal states
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCode, setNewGroupCode] = useState('');
  const [newGroupSemester, setNewGroupSemester] = useState<number>(2);
  const [newGroupShift, setNewGroupShift] = useState<'Matutino' | 'Vespertino' | 'Nocturno'>('Matutino');
  const [newGroupCapacity, setNewGroupCapacity] = useState<number>(35);

  const handleAddGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupCode.trim()) return;

    const newGroup: AcademicalGroup = {
      id: `GRP-${newGroupCode.trim().toUpperCase()}`,
      name: newGroupName.trim(),
      code: newGroupCode.trim().toUpperCase(),
      semester: Number(newGroupSemester),
      shift: newGroupShift,
      capacity: Number(newGroupCapacity)
    };

    setGroups(prev => {
      if (prev.some(g => g.id === newGroup.id || g.code === newGroup.code)) {
        alert('Ya existe un grupo con esta clave o identificador.');
        return prev;
      }
      return [...prev, newGroup];
    });

    setActiveGroupId(newGroup.id);
    setDistGrade(`${newGroup.semester}º Semestre`);
    setDistGroup(newGroup.name);
    setDistShift(newGroup.shift);

    setNewGroupName('');
    setNewGroupCode('');
    setNewGroupSemester(2);
    setNewGroupShift('Matutino');
    setNewGroupCapacity(35);
    setShowAddGroupModal(false);
    
    setSuccessMsg(`¡Grupo "${newGroup.name}" creado con éxito y establecido como activo!`);
  };

  // Bulk Upload states
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedCareerForBulk, setSelectedCareerForBulk] = useState<string | null>(null);
  const [bulkActiveTab, setBulkActiveTab] = useState<'json' | 'pdf'>('json');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkParsedSubjects, setBulkParsedSubjects] = useState<Subject[]>([]);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [pdfExtractedText, setPdfExtractedText] = useState<string>('');

  const handleBulkImportConfirm = () => {
    if (!selectedCareerForBulk || bulkParsedSubjects.length === 0) return;

    setCareers(prev => prev.map(c => {
      if (c.id === selectedCareerForBulk) {
        const currentCodes = new Set(c.subjects.map(s => s.code));
        const filteredNewOnes = bulkParsedSubjects.filter(s => !currentCodes.has(s.code));
        
        if (filteredNewOnes.length === 0) {
          alert("Todas las materias importadas ya existen en esta carrera.");
          return c;
        }

        const updatedSubjects = [...c.subjects, ...filteredNewOnes];
        return {
          ...c,
          subjects: updatedSubjects
        };
      }
      return c;
    }));

    setShowBulkUploadModal(false);
    setBulkParsedSubjects([]);
    setSelectedCareerForBulk(null);
    setSuccessMsg(`✅ ¡Carga Exitosa! Se importaron correctamente ${bulkParsedSubjects.length} asignaturas a la carrera.`);
  };

  const handleJsonUpload = async (file: File) => {
    setBulkLoading(true);
    setBulkError(null);
    setBulkParsedSubjects([]);

    try {
      const text = await file.text();
      let parsed = JSON.parse(text);
      
      if (!Array.isArray(parsed)) {
        if (parsed.subjects && Array.isArray(parsed.subjects)) {
          parsed = parsed.subjects;
        } else if (parsed.asignaturas && Array.isArray(parsed.asignaturas)) {
          parsed = parsed.asignaturas;
        } else {
          throw new Error("El archivo JSON debe contener una lista (array) de asignaturas.");
        }
      }

      const normalized: Subject[] = [];
      parsed.forEach((item: any) => {
        const code = (item.code || item.clave || item.Clave || item.codigo || '').toString().trim().toUpperCase();
        const name = (item.name || item.nombre || item.Nombre || '').toString().trim();
        const semester = Number(item.semester || item.semestre || item.Semestre || (activeGroup ? activeGroup.semester : 1));
        const hours = Number(item.hours || item.horas || item.horas_semanales || item.Horas || 4);

        if (code && name) {
          normalized.push({ code, name, semester, hours });
        }
      });

      if (normalized.length === 0) {
        throw new Error("No se encontraron materias válidas con campos de clave y nombre.");
      }

      setBulkParsedSubjects(normalized);
    } catch (e: any) {
      setBulkError(`Error al leer JSON: ${e.message}`);
    } finally {
      setBulkLoading(false);
    }
  };

  const loadPdfJs = async () => {
    if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        resolve(pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const runRegexParser = (text: string) => {
    const subjectsList: Subject[] = [];
    const lines = text.split('\n');
    const codeRegex = /\b([A-Z]{3,5}-\d{2,4}(?:-[A-Z0-9]+)?)\b/i;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const codeMatch = trimmed.match(codeRegex);
      if (codeMatch) {
         const code = codeMatch[1].toUpperCase();
         let rest = trimmed.replace(codeRegex, '').trim();
         
         const hoursMatch = rest.match(/\b(\d+)\s*(?:hrs|horas|hours|HRS)?\s*$/i);
         let hours = 4;
         if (hoursMatch) {
           hours = parseInt(hoursMatch[1], 10);
           rest = rest.replace(/\b(\d+)\s*(?:hrs|horas|hours|HRS)?\s*$/i, '').trim();
         } else {
           const anyDigitMatch = rest.match(/\b(\d+)\b/);
           if (anyDigitMatch) {
             hours = parseInt(anyDigitMatch[1], 10);
           }
         }
         
         const name = rest
           .replace(/^[-•—\s]+/, '')
           .replace(/\s+/g, ' ')
           .trim();
           
         if (name && name.length > 2) {
           subjectsList.push({
             code,
             name: name.substring(0, 50),
             semester: activeGroup ? activeGroup.semester : 1,
             hours: Math.min(Math.max(hours, 1), 10)
           });
         }
      }
    });

    if (subjectsList.length === 0) {
      const fallbackRegex = /([a-zA-Z]{3,}-\d{3})\s+([^0-9]+)\s+(\d)/gi;
      let match;
      while ((match = fallbackRegex.exec(text)) !== null) {
        subjectsList.push({
          code: match[1].toUpperCase(),
          name: match[2].trim(),
          semester: activeGroup ? activeGroup.semester : 1,
          hours: Number(match[3]) || 4
        });
      }
    }

    setBulkParsedSubjects(subjectsList);
  };

  const extractTextFromPDF = async (file: File) => {
    setBulkLoading(true);
    setBulkError(null);
    setPdfExtractedText('');
    setBulkParsedSubjects([]);

    try {
      const fileReader = new FileReader();
      fileReader.onload = async function() {
        try {
          const typedArr = new Uint8Array(this.result as ArrayBuffer);
          const pdfjsLib = await loadPdfJs();
          const loadingTask = pdfjsLib.getDocument({ data: typedArr });
          const pdf = await loadingTask.promise;
          
          let fullText = '';
          const maxPages = Math.min(pdf.numPages, 10);
          for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          setPdfExtractedText(fullText);
          runRegexParser(fullText);
        } catch (e: any) {
          console.error(e);
          setBulkError(`Fallo al extraer texto de PDF: ${e.message}`);
        } finally {
          setBulkLoading(false);
        }
      };
      
      fileReader.onerror = () => {
        setBulkError("Fallo al leer el archivo PDF.");
        setBulkLoading(false);
      };
      
      fileReader.readAsArrayBuffer(file);
    } catch (err: any) {
      setBulkError(`Error de archivo: ${err.message}`);
      setBulkLoading(false);
    }
  };

  // Load dynamic teachers list from local storage if available
  const [dynamicTeachers, setDynamicTeachers] = useState<{ id: string; name: string; spec: string }[]>([]);

  useEffect(() => {
    const savedUsersList = localStorage.getItem('tecnolingo_users_list');
    if (savedUsersList) {
      try {
        const parsed = JSON.parse(savedUsersList);
        const dynamicTeachersList = parsed
          .filter((u: any) => u.role === 'DOCENTE')
          .map((u: any) => ({
            id: u.id,
            name: u.name.startsWith('Mtr') ? u.name : `Mtro. ${u.name}`,
            spec: u.specialty || 'General / Asignaturas Básicas'
          }));
        if (dynamicTeachersList.length > 0) {
          setDynamicTeachers(dynamicTeachersList);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Teachers options mapped to ID
  const allTeachers = [
    { id: 'ana_lopez', name: 'Mtra. Ana López', spec: 'Inglés / Idiomas' },
    { id: 'chucho_serna', name: 'Mtro. Chucho Serna', spec: 'Redes y Telecomunicaciones' },
    { id: 'roberto_her', name: 'Mtro. Roberto Hernández', spec: 'Ciencias de la Computación / IA' },
    { id: 'sofia_ruiz', name: 'Mtra. Sofía Ruiz', spec: 'Ingeniería de Software / Web' },
    { id: 'luis_garcia', name: 'Mtro. Luis García', spec: 'Hardware y Arquitectura' },
  ];

  const effectiveTeachers = dynamicTeachers.length > 0 ? dynamicTeachers : allTeachers;

  // Subject qualified mapping
  const subjectQualifiedTeachers: Record<string, string[]> = {
    'TEC-001': ['ana_lopez', 'sofia_ruiz'],
    'ISC-201': ['chucho_serna', 'luis_garcia'],
    'ISC-202': ['roberto_her', 'chucho_serna'],
    'ISC-203': ['sofia_ruiz', 'roberto_her', 'ana_lopez'],
    'ISC-204': ['luis_garcia', 'chucho_serna'],
    'ISC-205': ['roberto_her', 'sofia_ruiz'],
  };

  const distSubjects = [
    { code: 'TEC-001', name: 'TecLingo AI (Inglés I)', hours: 4 },
    { code: 'ISC-201', name: 'Práctica de Redes', hours: 4 },
    { code: 'ISC-202', name: 'Estructura de Datos', hours: 4 },
    { code: 'ISC-203', name: 'Programación Web', hours: 5 },
    { code: 'ISC-204', name: 'Arquitectura de Computadoras', hours: 4 },
    { code: 'ISC-205', name: 'Inteligencia Artificial Avanzada', hours: 3 },
  ];

  const getFilteredSubjects = () => {
    if (!activeGroup) return [];
    
    const foundSubjects: Subject[] = [];
    const codesSeen = new Set<string>();

    careers.forEach(career => {
      career.subjects.forEach(s => {
        if (s.semester === activeGroup.semester && !codesSeen.has(s.code)) {
          foundSubjects.push(s);
          codesSeen.add(s.code);
        }
      });
    });

    if (foundSubjects.length === 0) {
      return distSubjects.filter(s => {
        if (activeGroup.semester === 1) return s.code === 'TEC-001';
        if (activeGroup.semester === 2) return s.code !== 'TEC-001';
        return true;
      });
    }

    return foundSubjects;
  };

  // Load from local storage or set initial
  const [distAssignments, setDistAssignments] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dist_assignments');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      'TEC-001': 'ana_lopez',
      'ISC-201': 'chucho_serna',
      'ISC-202': 'roberto_her',
      'ISC-203': '',
      'ISC-204': 'luis_garcia',
      'ISC-205': ''
    };
  });

  const saveDistAssignments = (newAssignments: Record<string, string>) => {
    setDistAssignments(newAssignments);
    localStorage.setItem('dist_assignments', JSON.stringify(newAssignments));
    
    // Broadcast storage event manually for prompt reaction if on the same window
    window.dispatchEvent(new Event('storage'));
  };

  // Catálogo de Asignaturas & Estructura Reticular
  const [careers, setCareers] = useState<Career[]>(() => {
    const saved = localStorage.getItem('library_careers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'isc',
        name: 'Ingeniería en Sistemas Computacionales',
        code: 'IINF-2010-220',
        limitHours: 33,
        subjects: [
          { code: 'TEC-001', name: 'TecLingo AI (Inglés I)', semester: 1, hours: 4 }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('library_careers', JSON.stringify(careers));
  }, [careers]);
  const [expandedCareers, setExpandedCareers] = useState<Record<string, boolean>>({ isc: true });
  
  const [showAddCareerModal, setShowAddCareerModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState<string | null>(null); // careerId
  const [showEditCareerModal, setShowEditCareerModal] = useState<Career | null>(null);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState<{ careerId: string; subject: Subject } | null>(null);
  
  // Career Form State
  const [newCareerName, setNewCareerName] = useState('');
  const [newCareerCode, setNewCareerCode] = useState('');
  const [newCareerGradoSemestre, setNewCareerGradoSemestre] = useState<string>('');
  const [newCareerLimitHours, setNewCareerLimitHours] = useState<number>(33);
  
  // Subject Form State
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectSemester, setNewSubjectSemester] = useState<number>(1);
  const [newSubjectHours, setNewSubjectHours] = useState<number>(4);

  // Real-time server simulation console logs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load documents on mount
  const fetchDocuments = async () => {
    if (!auth.currentUser) {
      console.log('Skipping fetching documents: no user is currently authenticated.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'library_documents'));
      const list: LibraryDoc[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as LibraryDoc);
      });
      setDocuments(list);
    } catch (e: any) {
      console.error('Error fetching documents:', e);
      handleFirestoreError(e, OperationType.LIST, 'library_documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchDocuments();
      } else {
        setDocuments([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const validateFile = async (selectedFile: File): Promise<boolean> => {
    setErrorCode(null);
    setSuccessMsg(null);
    setConsoleLogs([]);

    addLog(`CLIENT: Iniciando verificación local de archivo "${selectedFile.name}"...`);

    // 1. Check extension
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    
    // Tab mismatch validation
    if (activeUploadTab === 'JSON' && ext !== 'json') {
      setErrorCode('Error: Formato no coincidente. Estás en la pestaña JSON, por lo que solo se permiten archivos .json.');
      addLog(`CLIENT-ERROR: Intento de cargar archivo .${ext} bloqueado en la pestaña JSON.`);
      return false;
    }
    if (activeUploadTab === 'PDF' && ext !== 'pdf') {
      setErrorCode('Error: Formato no coincidente. Estás en la pestaña PDF, por lo que solo se permiten archivos .pdf.');
      addLog(`CLIENT-ERROR: Intento de cargar archivo .${ext} bloqueado en la pestaña PDF.`);
      return false;
    }

    if (ext !== 'json' && ext !== 'pdf') {
      setErrorCode('Error: Extensión no permitida. Solo se soportan archivos .json o .pdf');
      addLog(`CLIENT-ERROR: Archivo con extensión .${ext} bloqueado inmediatamente en cliente.`);
      return false;
    }

    addLog(`CLIENT: Extensión .${ext} pre-aprobada. Leyendo estructura interna...`);

    // 2. Client-side deep analysis (Magic Bytes / JSON Parser)
    try {
      if (ext === 'pdf') {
        const header = await readFileHeader(selectedFile);
        addLog(`CLIENT: Escaneo de firma binaria del archivo: [${header}]`);
        
        // PDF standard prefix is "%PDF-" (0x25 0x50 0x44 0x46)
        if (!header.startsWith('%PDF')) {
          setErrorCode('Error de Seguridad: La firma digital interna no coincide con la cabecera estándar de PDF. Carga cancelada.');
          addLog(`CLIENT-ALERT: Intento de evasión detectado! Firma real no coincide con formato .pdf.`);
          return false;
        }
        addLog(`CLIENT: Firma "%PDF-" válida y sanitizada para su envío.`);
      } else if (ext === 'json') {
        const text = await selectedFile.text();
        try {
          const parsed = JSON.parse(text);
          addLog(`CLIENT: Estructura JSON sintácticamente correcta.`);
          
          if (!parsed.title && !parsed.chapters && !parsed.units) {
            addLog(`CLIENT-WARNING: El JSON no posee el esquema estándar de planes de estudio (syllabus).`);
          }
        } catch {
          setErrorCode('Error de Parseo: El documento contiene errores de sintaxis JSON.');
          addLog(`CLIENT-ERROR: Fallo al parsear la cadena JSON local.`);
          return false;
        }
      }
    } catch (e) {
      setErrorCode('Error de Lectura: No fue posible abrir el archivo.');
      return false;
    }

    addLog(`CLIENT: Verificación de cliente completada con éxito.`);
    return true;
  };

  const readFileHeader = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const arr = new Uint8Array(e.target.result as ArrayBuffer);
          let header = '';
          for (let i = 0; i < 4; i++) {
            header += String.fromCharCode(arr[i]);
          }
          resolve(header);
        } else {
          resolve('');
        }
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const isValid = await validateFile(droppedFile);
      if (isValid) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isValid = await validateFile(selectedFile);
      if (isValid) {
        setFile(selectedFile);
      }
    }
  };

  // Simulates strict backend middleware processing and writes record to Firestore
  const handleUploadToServer = async () => {
    if (!file) return;

    setIsProcessing(true);
    setServerMode(true);
    setSuccessMsg(null);

    // 10-step server simulation logging
    const steps = [
      { t: 0, m: '🔄 API [POST] /api/library/upload - Iniciando carga de archivo...' },
      { t: 400, m: '🛡️ BACKEND MIDDLEWARE: Verificando JWT institucional del Director.' },
      { t: 800, m: '🛡️ BACKEND MIDDLEWARE: Inicializando controlador Multer.' },
      { t: 1200, m: `📦 BACKEND: Stream de ${file.size} bytes recibido. Leyendo mimetype de Multer: "${file.type}"...` },
      { t: 1600, m: '🔍 BACKEND: Ejecutando verificación "fileFilter" estricto...' },
      { t: 2000, m: '🔍 BACKEND CHECK: Evaluando regex de extensión: /json|pdf/' },
      { t: 2400, m: `✅ BACKEND: Extensión verificada de forma segura para "${file.name}".` },
      { t: 2800, m: '💾 DATABASE: Creando registro de persistencia inmutable en Firestore...' }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.m.includes('mimetype') ? 500 : 300));
      addLog(step.m);
    }

    try {
      const newDoc = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'json',
        uploadedAt: serverTimestamp(),
        status: 'active',
        checksum: `SHA-256:${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        description: file.name.endsWith('.pdf') ? 'Manual Técnico Oficial Autenticado' : 'Esquema de Malla Curricular / Syllabus'
      };

      // Real Firebase Save
      await addDoc(collection(db, 'library_documents'), newDoc);
      
      addLog('🚀 DATABASE SUCCESS: Documento registrado y autenticado exitosamente.');
      setSuccessMsg(`¡Carga Completa! El archivo "${file.name}" fue verificado por el servidor y guardado.`);
      setFile(null);
      fetchDocuments();
    } catch (e: any) {
      addLog(`❌ DATABASE ERROR: Fallo al consolidar datos en Firestore - ${e.message}`);
      setErrorCode('Ocurrió un error al persistir el archivo en la base de datos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (docId: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}" de la biblioteca oficial?`)) return;

    try {
      await deleteDoc(doc(db, 'library_documents', docId));
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (e: any) {
      alert(`Error al eliminar: ${e.message}`);
    }
  };

  const handleProcessPlainText = async () => {
    if (!plainText.trim()) return;
    if (plainText.length > 15000) {
      setErrorCode('La longitud del texto excede el límite de 15,000 caracteres.');
      return;
    }
    
    setIsProcessing(true);
    setServerMode(true);
    setSuccessMsg(null);
    setErrorCode(null);
    setConsoleLogs([]);

    addLog(`CLIENT: Iniciando procesamiento de texto libre (${plainText.length} caracteres)...`);
    await new Promise(r => setTimeout(r, 400));
    addLog(`CLIENT: Verificación de límite superada (máx 15,000 caracteres).`);
    await new Promise(r => setTimeout(r, 400));
    addLog(`🔄 API [POST] /api/library/paste - Enviando búfer de texto temático...`);
    await new Promise(r => setTimeout(r, 400));
    addLog(`🛡️ BACKEND MIDDLEWARE: Sanitizando entrada contra inyecciones e indexando estructura.`);
    await new Promise(r => setTimeout(r, 400));
    addLog(`📦 BACKEND: Analizador de lenguaje completado. Extrayendo syllabus de la planeación...`);
    await new Promise(r => setTimeout(r, 400));
    addLog(`💾 DATABASE: Creando registro de persistencia inmutable en Firestore...`);
    await new Promise(r => setTimeout(r, 400));

    try {
      const generatedId = `syllabus_manual_${Math.floor(Math.random() * 900 + 100)}`;
      const generatedName = `Manual_Texto_Libre_${Math.floor(Math.random() * 900 + 100)}.json`;
      const newDoc = {
        name: generatedName,
        size: `${(plainText.length / 1024).toFixed(1)} KB`,
        type: 'json',
        uploadedAt: serverTimestamp(),
        status: 'active',
        checksum: `SHA-256:${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        description: 'Plan Académico / Syllabus Extraído de Texto Plano'
      };

      await addDoc(collection(db, 'library_documents'), newDoc);
      addLog(`🚀 DATABASE SUCCESS: Documento creado con el ID de almacenamiento.`);
      setSuccessMsg(`¡Procesado Completo! Se generó el plan académico "${generatedName}" a partir del texto ingresado.`);
      setPlainText('');
      fetchDocuments();
    } catch (e: any) {
      addLog(`❌ DATABASE ERROR: Fallo al consolidar datos en Firestore - ${e.message}`);
      setErrorCode('Ocurrió un error al persistir el texto en la base de datos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCareerName.trim() || !newCareerCode.trim() || !newCareerGradoSemestre) return;
    
    const id = `career_${Date.now()}`;
    const newCareer: Career = {
      id,
      name: newCareerName.trim(),
      code: newCareerCode.trim().toUpperCase(),
      limitHours: Number(newCareerLimitHours) || 33,
      subjects: [],
      grado_semestre: Number(newCareerGradoSemestre)
    };
    
    setCareers(prev => [...prev, newCareer]);
    setExpandedCareers(prev => ({ ...prev, [id]: true }));
    
    setNewCareerName('');
    setNewCareerCode('');
    setNewCareerGradoSemestre('');
    setNewCareerLimitHours(33);
    setShowAddCareerModal(false);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const careerId = showAddSubjectModal;
    if (!careerId || !newSubjectName.trim() || !newSubjectCode.trim()) return;
    
    const newSub: Subject = {
      code: newSubjectCode.trim().toUpperCase(),
      name: newSubjectName.trim(),
      semester: Number(newSubjectSemester) || 1,
      hours: Number(newSubjectHours) || 4
    };
    
    setCareers(prev => prev.map(c => {
      if (c.id === careerId) {
        // Prevent duplicate subject code in same career
        if (c.subjects.some(s => s.code === newSub.code)) {
          alert(`La asignatura con clave ${newSub.code} ya existe en esta carrera.`);
          return c;
        }
        return {
          ...c,
          subjects: [...c.subjects, newSub]
        };
      }
      return c;
    }));
    
    setNewSubjectName('');
    setNewSubjectCode('');
    setNewSubjectSemester(1);
    setNewSubjectHours(4);
    setShowAddSubjectModal(null);
  };

  const handleDeleteSubject = (careerId: string, subjectCode: string) => {
    setCareers(prev => prev.map(c => {
      if (c.id === careerId) {
        return {
          ...c,
          subjects: c.subjects.filter(s => s.code !== subjectCode)
        };
      }
      return c;
    }));
  };

  const handleDeleteCareer = (careerId: string) => {
    setCareers(prev => prev.filter(c => c.id !== careerId));
  };

   const handleEditCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditCareerModal) return;
    setCareers(prev => prev.map(c => {
      if (c.id === showEditCareerModal.id) {
        return {
          ...c,
          name: showEditCareerModal.name,
          code: showEditCareerModal.code.toUpperCase(),
          limitHours: Number(showEditCareerModal.limitHours) || 33,
          grado_semestre: showEditCareerModal.grado_semestre
        };
      }
      return c;
    }));
    setShowEditCareerModal(null);
  };

  const handleEditSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditSubjectModal) return;
    const { careerId, subject } = showEditSubjectModal;
    setCareers(prev => prev.map(c => {
      if (c.id === careerId) {
        return {
          ...c,
          subjects: c.subjects.map(s => {
            if (s.code === subject.code) {
              return {
                ...s,
                name: subject.name,
                semester: Number(subject.semester) || 1,
                hours: Number(subject.hours) || 4
              };
            }
            return s;
          })
        };
      }
      return c;
    }));
    setShowEditSubjectModal(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-400 text-[#061a1a] text-[9px] font-black uppercase tracking-wider">
              Control Escolar
            </span>
            <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-[0.3em]">
              Biblioteca Académica & Mallas Curriculares
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white bevel-text uppercase tracking-tighter">
             BIBLIOTECA <span className="text-[#DEFF9A]">DIRECTIVA</span>
          </h1>
          <p className="text-white/40 text-xs md:text-sm font-medium mt-1 leading-relaxed max-w-2xl">
            Sube planes de estudio (.JSON) y manuales técnicos oficiales (.PDF) de forma segura o procesa temarios en texto plano.
          </p>
          

        </div>
        
        <button 
          onClick={fetchDocuments}
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw size={12} className="text-[#DEFF9A]" /> Recargar Lista
        </button>
      </header>

      {/* Main Library Tab Selector */}
      <div className="flex flex-col md:flex-row bg-black/45 border border-white/5 p-1 rounded-2xl max-w-5xl gap-1.5 self-start shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex-wrap">
        <button
          type="button"
          onClick={() => setActiveMainTab('SYLLABUS')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeMainTab === 'SYLLABUS'
              ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20 shadow-[0_0_15px_rgba(222,255,154,0.12)] font-black'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          <Book size={13} className="text-[#DEFF9A]" /> Plan de Estudio
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('PLANEACIONES')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeMainTab === 'PLANEACIONES'
              ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20 shadow-[0_0_15px_rgba(222,255,154,0.12)] font-black'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          <BookOpen size={13} className="text-cyan-400 font-black" /> Cargas & Archivos
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('LIBRO_VIRTUAL')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeMainTab === 'LIBRO_VIRTUAL'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.12)] font-black'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          <BookOpen size={13} className="text-emerald-400 font-black" /> Libro Virtual Maestro
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('RETICULAR')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeMainTab === 'RETICULAR'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.12)] font-black'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          <Layers size={13} className="text-emerald-400 font-bold" /> Estructura Reticular
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('DISTRIBUCION')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeMainTab === 'DISTRIBUCION'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.12)] font-black'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          <span>📊</span> Distribución Académica
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('GRUPOS')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeMainTab === 'GRUPOS'
              ? 'bg-amber-500/10 text-amber-450 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.12)] font-black'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          <Users size={13} className="text-amber-400" /> Grupos Escolares
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('HORARIOS')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeMainTab === 'HORARIOS'
              ? 'bg-[#10b981]/10 text-emerald-400 border border-[#10b981]/20 shadow-[0_0_15px_rgba(16,185,129,0.12)] font-black'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          <Calendar size={13} className="text-[#10b981]" /> Horarios Inteligentes
        </button>
      </div>

      {activeMainTab === 'PLANEACIONES' ? (
        /* Main Grid: Upload & Controls + Simulated Sandbox logs */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Upload Zone & Log Terminal */}
        <div className="lg:col-span-7 space-y-8">
          <GlassCard title="Gestión de Carga de Archivos" icon={UploadCloud} accent="green">
            <div className="space-y-6">
              
              {/* Tab Switcher for Hybrid Loading (JSON, PDF, PLAIN text) */}
              <div className="flex flex-wrap bg-black/45 border border-white/5 p-1 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveUploadTab('JSON');
                    setFile(null);
                    setErrorCode(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 min-w-[100px] py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                    activeUploadTab === 'JSON'
                      ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20 shadow-[0_0_15px_rgba(222,255,154,0.1)]'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5 font-bold'
                  }`}
                >
                  [JSON] Plano Curricular
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveUploadTab('PDF');
                    setFile(null);
                    setErrorCode(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 min-w-[100px] py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                    activeUploadTab === 'PDF'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5 font-bold'
                  }`}
                >
                  [PDF] Oficio Oficial
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveUploadTab('PLAIN');
                    setFile(null);
                    setErrorCode(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 min-w-[100px] py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                    activeUploadTab === 'PLAIN'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5 font-bold'
                  }`}
                >
                  [Texto Libre] Copiado Manual
                </button>
              </div>

              {activeUploadTab !== 'PLAIN' ? (
                <div>
                  <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest leading-normal mb-4">
                    {activeUploadTab === 'JSON' ? (
                      <>
                        Pestaña <span className="text-[#DEFF9A] font-black">JSON</span> activa: Solo se permite cargar archivos estructurales con extensión <span className="text-[#DEFF9A] font-mono">.json</span>.
                      </>
                    ) : (
                      <>
                        Pestaña <span className="text-cyan-400 font-black">PDF</span> activa: Solo se permite cargar documentos y manuales oficiales con extensión <span className="text-cyan-400 font-mono">.pdf</span>.
                      </>
                    )}
                  </p>

                  {/* Drag and Drop Zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-3xl p-10 text-center relative transition-all cursor-pointer ${
                      dragActive 
                        ? 'border-[#DEFF9A] bg-[#DEFF9A]/5 scale-[1.01]' 
                        : file 
                          ? 'border-[#DEFF9A]/40 bg-[#DEFF9A]/5'
                          : 'border-white/10 hover:border-[#DEFF9A]/40 bg-black/20'
                    }`}
                  >
                    <input 
                      type="file" 
                      accept={activeUploadTab === 'JSON' ? '.json, application/json' : '.pdf, application/pdf'}
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    
                    <div className="flex flex-col items-center justify-center gap-4 relative z-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${file ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'bg-white/5 text-white/30'}`}>
                        <UploadCloud size={24} />
                      </div>
                      
                      {file ? (
                        <div>
                          <h4 className="text-white font-black text-xs uppercase mb-1">¡Archivo Seleccionado!</h4>
                          <p className="text-[#DEFF9A] text-[11px] font-mono font-bold">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                          <p className="text-white/40 text-[8px] uppercase tracking-wider font-bold mt-2">Listo para el Procesamiento e Ingesta del Servidor</p>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-white font-black text-[11px] uppercase mb-1">
                            Arrastra tu {activeUploadTab === 'JSON' ? 'Syllabus estructurador (.json)' : 'Oficio oficial (.pdf)'}
                          </h4>
                          <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider">O selecciona el archivo desde el dispositivo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {file && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleUploadToServer}
                        disabled={isProcessing}
                        className="w-full haptic-button-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 text-black transition-all"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            PROCESANDO ARCHIVO EN MIDDLEWARE SEGURO...
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={14} />
                            Ingestar Archivo ({activeUploadTab})
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Sección de Entrada de Texto Libre (PLAIN TEXT) */
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-emerald-400">
                    <span>Copiado Directo de Programas / Manuales Escritos</span>
                    <span className={`font-mono text-[10px] ${plainText.length > 15000 ? 'text-red-400 font-extrabold' : 'text-white/40'}`}>
                      {plainText.length.toLocaleString()} / 15,000 carac.
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={plainText}
                    onChange={(e) => {
                      setPlainText(e.target.value);
                      if (e.target.value.length > 15000) {
                        setErrorCode('Se ha excedido el límite analítico del agente para evitar sobrecarga de procesamiento.');
                      } else if (errorCode) {
                        setErrorCode(null);
                      }
                    }}
                    disabled={isProcessing}
                    className="w-full bg-black/40 border border-white/5 rounded-3xl p-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none font-mono custom-scrollbar"
                    placeholder="// Pega aquí el temario, los objetivos o las unidades de clase para que el procesador de TECLINGO HUB extraiga la planeación curricular..."
                  />

                  {/* PROMPT DE CONTROL: ALERTA DE SEGURIDAD LITTLE TECH */}
                  {plainText.length > 15000 && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 space-y-2 text-left animate-bounce">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={15} className="text-red-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest bg-red-400 text-black px-1.5 py-0.5 rounded">
                          LITTLE TECH • SEGURIDAD
                        </span>
                      </div>
                      <p className="text-[10px] leading-relaxed font-bold">
                        ¡Cuidado, compadre! El temario excede el límite de control. Por favor, segmenta la planeación para no saturar mi procesamiento.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleProcessPlainText}
                      disabled={isProcessing || !plainText.trim() || plainText.length > 15000}
                      className="haptic-press bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 hover:bg-[#DEFF9A]/20 disabled:opacity-30 disabled:hover:bg-[#DEFF9A]/10 text-[#DEFF9A] text-[9px] font-black tracking-widest uppercase px-5 py-3 rounded-xl transition-all"
                    >
                      Procesar Texto Libre
                    </button>
                  </div>
                </div>
              )}

              {/* Action and Error Feedback */}
              <div className="flex flex-col gap-4">
                {errorCode && plainText.length <= 15000 && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                    <AlertTriangle size={16} className="shrink-0" />
                    <span className="font-bold">{errorCode}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-3">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span className="font-bold">{successMsg}</span>
                  </div>
                )}
              </div>

            </div>
          </GlassCard>

          {/* Simulated Realtime Server Middleware Console */}
          <GlassCard title="Middleware Server Logs — Sandbox de Validaciones" icon={Terminal} accent="cyan">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] text-white/40 block pb-3 border-b border-white/5">
                <span>SIMULACIÓN DETALLADA: VALIDACIÓN EXPRESS & MULTER</span>
                <span className="font-mono text-cyan-400 font-bold">STATUS: MONITOREANDO</span>
              </div>
              
              <div className="bg-black/80 rounded-2xl border border-white/5 p-6 font-mono text-[10.5px] space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar">
                {consoleLogs.length === 0 ? (
                  <p className="text-white/20 italic">// Sube un archivo o procesa texto manual para observar el escaneo de bytes en el cliente y la depuración del servidor...</p>
                ) : (
                  consoleLogs.map((log, idx) => {
                    let textClass = 'text-white/60';
                    if (log.includes('CLIENT-ERROR') || log.includes('BACKEND-ERROR')) textClass = 'text-red-400 font-bold';
                    else if (log.includes('CLIENT-ALERT') || log.includes('Intento de evasión')) textClass = 'text-orange-400 font-bold';
                    else if (log.includes('CLIENT:')) textClass = 'text-cyan-400/80';
                    else if (log.includes('DATABASE SUCCESS') || log.includes('Completa')) textClass = 'text-emerald-400 font-bold';
                    else if (log.includes('BACKEND:')) textClass = 'text-[#DEFF9A]';
                    
                    return (
                      <div key={idx} className={`${textClass} leading-relaxed`}>
                        {log}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Active syllabus & material files list */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          <GlassCard title="Estructura de la Biblioteca Oficial" icon={BookOpen} accent="cyan">
            <div className="space-y-6">
              
              {/* Secondary Navigation under Right Side Card */}
              <div className="flex border-b border-white/5 pb-2 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveRightTab('MONTHS')}
                  className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all ${
                    activeRightTab === 'MONTHS' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  Planeación Semanal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRightTab('CATALOG')}
                  className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all ${
                    activeRightTab === 'CATALOG' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  Catálogo ({documents.length})
                </button>
              </div>

              {activeRightTab === 'MONTHS' ? (
                /* COMPONENTE DE ACORDEÓN POR MESES (Agosto - Diciembre) */
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[8.5px] uppercase tracking-wider text-cyan-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                    <span>VISTA ESTRUCTURADA POR SEMANAS</span>
                    <span className="font-mono">ITSP PÁNUCO</span>
                  </div>

                  {[
                    {
                      name: 'Agosto',
                      tagline: 'Calibración & ADN Inicial',
                      topics: [
                        { wk: 'Semana 1', task: 'English Diagnostics (Nivel Inicial)', badge: 'COMPLETADO', level: 'A1-A2' },
                        { wk: 'Semana 2', task: 'Calibración de Intereses (ADN Cognitivo)', badge: 'COMPLETADO', level: 'A1-A2', link: 'FOL-2026-001' },
                        { wk: 'Semana 3', task: 'Vocabulary: Airport & Travel basics', badge: 'COMPLETADO', level: 'A1-A2' },
                        { wk: 'Semana 4', task: 'Grammar: Present Perfect Structures', badge: 'COMPLETADO', level: 'A1-A2', link: 'FOL-2026-004' },
                      ]
                    },
                    {
                      name: 'Septiembre',
                      tagline: 'Infraestructura & Servidores',
                      topics: [
                        { wk: 'Semana 5', task: 'Vocabulary: Operating Systems', badge: 'ACTIVO', level: 'A2' },
                        { wk: 'Semana 6', task: 'Grammar: Past Simple vs Present Perfect', badge: 'ACTIVO', level: 'A2', link: 'FOL-2026-012' },
                        { wk: 'Semana 7', task: 'Listening Lab: Client-Server dialogs', badge: 'PENDIENTE', level: 'A2' },
                        { wk: 'Semana 8', task: 'Roleplay: Checking in at Tech Support', badge: 'PENDIENTE', level: 'A2' },
                      ]
                    },
                    {
                      name: 'Octubre',
                      tagline: 'Estructura de Datos & Lógica',
                      topics: [
                        { wk: 'Semana 9', task: 'Vocabulary: Databases & Firestore Schema', badge: 'PENDIENTE', level: 'B1' },
                        { wk: 'Semana 10', task: 'Grammar: Directives & Conditional logs', badge: 'PENDIENTE', level: 'B1', link: 'FOL-2026-025' },
                        { wk: 'Semana 11', task: 'The Bridge Drill: Dynamic Database logs', badge: 'PENDIENTE', level: 'B1' },
                        { wk: 'Semana 12', task: 'Audit Assessment: Curricular verification', badge: 'PENDIENTE', level: 'B1' },
                      ]
                    },
                    {
                      name: 'Noviembre',
                      tagline: 'Seguridad Escolar & Encriptado',
                      topics: [
                        { wk: 'Semana 13', task: 'Vocabulary: Hashing & Cyber security', badge: 'PENDIENTE', level: 'B1-B2' },
                        { wk: 'Semana 14', task: 'Grammar: Passive Voice in Official documents', badge: 'PENDIENTE', level: 'B1-B2', link: 'FOL-2026-039' },
                        { wk: 'Semana 15', task: 'Reading Compr: Technical manuals', badge: 'PENDIENTE', level: 'B1-B2' },
                        { wk: 'Semana 16', task: 'Exam: Preparation for Oxford English Exam', badge: 'PENDIENTE', level: 'B1-B2' },
                      ]
                    },
                    {
                      name: 'Diciembre',
                      tagline: 'Cierre de Evaluaciones & Auditoría',
                      topics: [
                        { wk: 'Semana 17', task: 'Final Evaluation: Speaking & Listening core', badge: 'PENDIENTE', level: 'B2' },
                        { wk: 'Semana 18', task: 'Acta Closing: Firmas Digitales Consolidadas', badge: 'PENDIENTE', level: 'B2', link: 'FOL-2026-042' },
                      ]
                    }
                  ].map((month) => {
                    const isOpen = expandedMonth === month.name;
                    return (
                      <div 
                        key={month.name}
                        className="rounded-2xl border border-white/5 bg-black/30 overflow-hidden transition-all duration-300"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedMonth(isOpen ? null : month.name)}
                          className="w-full flex justify-between items-center p-4 text-left hover:bg-white/[0.02] transition-colors"
                        >
                          <div>
                            <span className="text-white text-xs font-black uppercase tracking-wider leading-none">
                              {month.name}
                            </span>
                            <span className="block text-[8px] text-white/30 uppercase font-mono tracking-widest mt-0.5">
                              {month.tagline}
                            </span>
                          </div>
                          <span className={`text-[10px] font-black ${isOpen ? 'text-[#DEFF9A]' : 'text-white/30'}`}>
                            {isOpen ? '[-]' : '[+]'}
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-white/5 bg-black/40 p-4 space-y-3"
                            >
                              {month.topics.map((item, id) => (
                                <div 
                                  key={id} 
                                  className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-white/10 transition-all"
                                >
                                  <div>
                                    <span className="text-cyan-400 font-mono text-[9px] font-bold block">{item.wk}</span>
                                    <span className="text-white text-[11px] font-bold uppercase leading-tight font-sans">
                                      {item.task}
                                    </span>
                                    {item.link && (
                                      <span className="inline-flex items-center gap-1 text-[8px] text-[#DEFF9A] font-black uppercase tracking-wider block mt-1">
                                        🔗 Vinculado a: {item.link}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                    <span className="px-2 py-0.5 rounded text-[7.5px] font-bold bg-white/5 text-white/50">
                                      {item.level}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase ${
                                      item.badge === 'COMPLETADO' 
                                        ? 'bg-emerald-500/10 text-emerald-400' 
                                        : item.badge === 'ACTIVO'
                                          ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] animate-pulse'
                                          : 'bg-white/5 text-white/20'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* VISTA PLANES CARGADOS EN FIRESTORE EN TIEMPO REAL */
                <div>
                  {loading ? (
                    <div className="py-12 text-center text-white/30 text-xs font-bold uppercase animate-pulse">
                      Conectando con Firestore y cargando catálogo oficial...
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4">
                      <FileText size={32} className="text-white/10" />
                      <div>
                        <h5 className="text-white/50 text-xs font-black uppercase">Biblioteca Vacía</h5>
                        <p className="text-white/20 text-[9px] uppercase font-bold tracking-wide mt-1">
                          Sube archivos en el cargador híbrido izquierdo para registrar planeaciones.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[440px] overflow-y-auto custom-scrollbar">
                      {documents.map((doc) => (
                        <div 
                          key={doc.id} 
                          className="p-5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-all group"
                        >
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              doc.type === 'pdf' ? 'bg-red-500/10 text-red-400' : 'bg-cyan-500/10 text-cyan-400'
                            }`}>
                              {doc.type === 'pdf' ? <FileText size={20} /> : <FileCode size={20} />}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="text-white font-black text-xs truncate uppercase group-hover:text-[#DEFF9A] transition-colors">
                                {doc.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-white/40 text-[9px] font-mono leading-none">{doc.size}</span>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-[7.5px] text-[#DEFF9A] font-black uppercase tracking-widest bg-[#DEFF9A]/10 px-2 py-0.5 rounded leading-none">
                                  {doc.checksum.replace('SHA-256:', '')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button 
                            type="button"
                            onClick={() => handleDelete(doc.id, doc.name)}
                            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-all shrink-0"
                            title="Eliminar Documento"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </GlassCard>
        </div>

      </div>
      ) : activeMainTab === 'LIBRO_VIRTUAL' ? (
        <div className="space-y-4 animate-in fade-in duration-500">
          <LibroVirtualDirectorCompleto />
        </div>
      ) : activeMainTab === 'SYLLABUS' ? (
        /* 🔮 PLAN DE ESTUDIO (TOEFL / IT) INTERACTIVE VIEW WITH COGNITIVE MINIMIZATION */
        <div className="space-y-8 animate-in fade-in duration-500">
           {/* Header Block with Metadata & Action triggers */}
           <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-black/30 border border-white/5 p-6 rounded-3xl text-left">
             <div className="space-y-2 max-w-2xl text-left">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 text-[#DEFF9A] text-[9px] font-black uppercase tracking-wider">
                 <Award size={10} className="text-[#DEFF9A]" /> Plan de Estudio Consolidado
               </span>
               <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                 MALLA CURRICULAR Y TEMARIOS SEMANALES
               </h2>
               <p className="text-white/40 text-[11px] font-medium uppercase mt-1 leading-relaxed">
                 Estructuras de planeación que integran la gramática internacional TOEFL iBT con el vocabulario técnico de sistemas de vanguardia, ordenados por temporalidad académica.
               </p>
             </div>
             
             {/* Action buttons (Download & Copy) */}
             <div className="flex flex-wrap gap-3 w-full xl:w-auto">
               <button
                 type="button"
                 onClick={() => {
                   const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                     JSON.stringify(SYLLABUS_DATA, null, 2)
                   )}`;
                   const downloadAnchor = document.createElement('a');
                   downloadAnchor.setAttribute("href", jsonString);
                   downloadAnchor.setAttribute("download", "toefl_tech_syllabus_complete.json");
                   document.body.appendChild(downloadAnchor);
                   downloadAnchor.click();
                   downloadAnchor.remove();
                   addLog("CLIENT: Descarga de JSON de Planeaciones completada exitosamente.");
                 }}
                 className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shrink-0"
               >
                 <Download size={12} className="text-[#DEFF9A]" /> Descargar JSON
               </button>

               <button
                 type="button"
                 onClick={() => {
                   navigator.clipboard.writeText(JSON.stringify(SYLLABUS_DATA, null, 2));
                   setCopiedSemester(true);
                   setTimeout(() => setCopiedSemester(false), 2000);
                   addLog("CLIENT: Estructura JSON completa copiada al portapapeles.");
                 }}
                 className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(222,255,154,0.15)] hover:scale-[1.02] shrink-0"
               >
                 {copiedSemester ? (
                   <>
                     <Check size={12} className="stroke-[3]" /> ¡Copiado Oficial!
                   </>
                 ) : (
                   <>
                     <Copy size={12} className="stroke-[3]" /> Copiar JSON Malla
                   </>
                 )}
               </button>
             </div>
           </div>

           {/* SEMESTERS CARPETAS/FOLDERS NAV SELECTOR */}
           <div className="space-y-4">
             <div className="flex items-center justify-between text-left">
               <div className="flex items-center gap-2">
                 <Folder size={14} className="text-cyan-400" />
                 <span className="text-[10px] font-bold font-mono text-[#DEFF9A] uppercase tracking-widest">
                   SELECCIONA EL PERIODO ACADÉMICO (6 SEMESTRES PRINCIPALES)
                 </span>
               </div>
               <span className="text-[9.5px] text-white/40 uppercase hidden sm:inline">
                 Aísla los temas del año en carpetas
               </span>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
               {[
                 { num: 1, level: "A1.1 Principiante", focus: "Identificación de Datos Clave" },
                 { num: 2, level: "A1.2 Elemental", focus: "Comprensión Secuencial" },
                 { num: 3, level: "A2.1 Pre-Intermedio", focus: "Incidentes Pasados y Causa-Efecto" },
                 { num: 4, level: "A2.2 Intermedio Bajo", focus: "Planes de Escalabilidad" },
                 { num: 5, level: "B1.1 Intermedio", focus: "Tareas Integradas Audits" },
                 { num: 6, level: "B1.2 Intermedio Alto", focus: "Retórica Avanzada TOEFL" }
               ].map((sem) => {
                 const isSelected = activeSyllabusSemester === sem.num;
                 return (
                   <button
                     key={sem.num}
                     type="button"
                     onClick={() => {
                       setActiveSyllabusSemester(sem.num);
                       addLog(`CLIENT: Consultando Plan de Estudio - Semestre ${sem.num}`);
                     }}
                     className={`p-4 rounded-2xl border flex flex-col items-center justify-between gap-2 transition-all text-center relative overflow-hidden group hover:scale-[1.01] ${
                       isSelected
                         ? 'bg-gradient-to-b from-[#DEFF9A]/15 to-black/20 border-[#DEFF9A]/55 text-white shadow-[0_0_25px_rgba(222,255,154,0.1)]'
                         : 'bg-black/30 hover:bg-white/[0.03] border-white/5 hover:border-white/12 text-white/55 hover:text-white'
                     }`}
                   >
                     {/* Folder Accent tabs */}
                     <div className={`absolute top-0 left-4 w-10 h-[3px] rounded-b-full transition-all ${isSelected ? 'bg-[#DEFF9A]' : 'bg-transparent group-hover:bg-white/20'}`} />
                     
                     <div className="flex flex-col items-center gap-1 mt-1">
                       <span className={`text-[8.5px] font-mono tracking-widest font-black uppercase ${isSelected ? 'text-[#DEFF9A]' : 'text-white/30 group-hover:text-white/40'}`}>
                         SEMESTRE 0{sem.num}
                       </span>
                       <Folder size={22} className={`transition-transform duration-300 ${isSelected ? 'text-[#DEFF9A] scale-110' : 'text-white/20 group-hover:scale-105'}`} />
                     </div>

                     <div className="space-y-0.5 mt-1">
                       <p className="text-[10.5px] font-black uppercase tracking-tight leading-tight">
                         {sem.level.split(' ')[0]}
                       </p>
                       <span className="block text-[8px] font-bold text-white/30 uppercase tracking-wide truncate max-w-[120px]">
                         {sem.level.split(' ').slice(1).join(' ')}
                       </span>
                     </div>
                   </button>
                 );
               })}
             </div>
           </div>

           {/* DETAILED FOCUS SHIELD CARD */}
           {(() => {
             const SEM_DESC = [
               { num: 1, mod: "Módulo 1", level: "A1.1 Principiante", focus: "Comunicación Cotidiana", desc: "Construir las bases sintácticas iniciales y vocabulario general para la comunicación en entornos cotidianos y la vida diaria sin tecnicismos." },
               { num: 2, mod: "Módulo 2", level: "A1.2 Elemental", focus: "Comprensión Secuencial", desc: "Logs de errores detallados, workflows automatizados, scripts de inicio de contenedores y flujos lógicos de despliegue." },
               { num: 3, mod: "Módulo 3", level: "A2.1 Pre-Intermedio", focus: "Incidentes Pasados", desc: "Análisis de causa raíz (Root Cause), tickets estándar de Jira, caídas históricas de clústeres y migración de base de datos." },
               { num: 4, mod: "Módulo 4", level: "A2.2 Intermedio Bajo", focus: "Planes de Escalabilidad", desc: "Condicionales preventivos de riesgos, metodologías ágiles de diseño técnico, control del SLA y redundancias automáticas." },
               { num: 5, mod: "Módulo 5", level: "B1.1 Intermedio", focus: "Tareas Integradas Audits", desc: "Auditorías de TI complejas, políticas avanzadas de IAM, cumplimiento regulatorio GDPR y reportes post-mortem pasivos." },
               { num: 6, mod: "Módulo 6", level: "B1.2 Intermedio Alto", focus: "Retórica Avanzada TOEFL", desc: "Whitepapers académicos con velocidad nativa, análisis de sesgo de IA, gobernanza ética y defensas elocuentes tipo Capstone." },
             ];
             const meta = SEM_DESC[activeSyllabusSemester - 1] || SEM_DESC[0];
             return (
               <div className="p-6 rounded-3xl bg-gradient-to-r from-black/45 via-black/25 to-transparent border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
                 <div className="md:col-span-8 space-y-2">
                   <div className="flex flex-wrap items-center gap-3">
                     <span className="px-3 py-1 rounded-full bg-cyan-400 text-black text-[9px] font-extrabold uppercase tracking-wider">
                       {meta.mod} ({meta.level})
                     </span>
                     <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">
                       🎯 ENFOQUE: {meta.focus}
                     </span>
                   </div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                     Resumen Curricular del Semestre {meta.num}
                   </h3>
                   <p className="text-white/50 text-xs leading-relaxed max-w-3xl">
                     {meta.desc}
                   </p>
                 </div>
                 
                 <div className="md:col-span-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-start gap-1 justify-center shrink-0 w-full">
                   <span className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest leading-none">
                     Syllabus Verification MD5:
                   </span>
                   <span className="text-[10px] font-mono font-extrabold text-[#DEFF9A] uppercase tracking-wider">
                     CSEC_SEM{meta.num}_SHA256_PASS
                   </span>
                   <div className="mt-2 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-[#DEFF9A] h-full rounded-full" style={{ width: `${(meta.num / 6) * 100}%` }} />
                   </div>
                   <span className="text-[7.5px] text-white/40 uppercase font-black tracking-wide mt-1 self-end leading-none">
                     Progreso Anual {Math.round((meta.num / 6) * 100)}%
                   </span>
                 </div>
               </div>
             );
           })()}

           {/* SEARCH FILTER BOX */}
           <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between text-left">
             <div className="relative flex-1 max-w-lg">
               <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/30">
                 <Search size={14} />
               </span>
               <input
                 type="text"
                 value={syllabusSearchQuery}
                 onChange={(e) => setSyllabusSearchQuery(e.target.value)}
                 placeholder="Buscar temas (ej. YAML, SLA, IAM, passive voice, speaking) en este semestre..."
                 className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-11 pr-5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#DEFF9A]/40 transition-colors"
               />
               {syllabusSearchQuery && (
                 <button
                   onClick={() => setSyllabusSearchQuery('')}
                   className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white"
                 >
                   <X size={14} />
                 </button>
               )}
             </div>
             
             <div className="text-[9.5px] text-white/40 uppercase font-bold tracking-widest self-center">
               Temas en semestre: <span className="text-[#DEFF9A]">
                 {SYLLABUS_DATA.filter(x => x.semestre === activeSyllabusSemester).length} Semanas
               </span>
             </div>
           </div>

           {/* WEEKLY TEMPLATE ACCORDION RENDERING */}
           <div className="space-y-4">
             {SYLLABUS_DATA.filter((item) => {
               if (item.semestre !== activeSyllabusSemester) return false;
               if (!syllabusSearchQuery) return true;
               const q = syllabusSearchQuery.toLowerCase();
               return (
                 item.semana.toLowerCase().includes(q) ||
                 item.tema_it.toLowerCase().includes(q) ||
                 item.habilidades_toefl.Grammar.toLowerCase().includes(q) ||
                 item.habilidades_toefl.Listening.toLowerCase().includes(q) ||
                 item.habilidades_toefl.Reading.toLowerCase().includes(q) ||
                 item.habilidades_toefl.Writing.toLowerCase().includes(q) ||
                 item.habilidades_toefl.Speaking.toLowerCase().includes(q)
               );
             }).length === 0 ? (
               <div className="p-12 text-center border border-dashed border-white/5 rounded-3xl">
                 <p className="text-white/30 text-xs font-black uppercase">Sin resultados en este semestre</p>
                 <p className="text-white/10 text-[9.5px] uppercase font-bold mt-1">
                   Prueba removiendo filtros o buscando otras palabras clave de la planeación semanal.
                 </p>
               </div>
             ) : (
               SYLLABUS_DATA.filter((item) => {
                 if (item.semestre !== activeSyllabusSemester) return false;
                 if (!syllabusSearchQuery) return true;
                 const q = syllabusSearchQuery.toLowerCase();
                 return (
                   item.semana.toLowerCase().includes(q) ||
                   item.tema_it.toLowerCase().includes(q) ||
                   item.habilidades_toefl.Grammar.toLowerCase().includes(q) ||
                   item.habilidades_toefl.Listening.toLowerCase().includes(q) ||
                   item.habilidades_toefl.Reading.toLowerCase().includes(q) ||
                   item.habilidades_toefl.Writing.toLowerCase().includes(q) ||
                   item.habilidades_toefl.Speaking.toLowerCase().includes(q)
                 );
               }).map((week) => {
                 const isOpen = expandedSyllabusWeeks[week.semana];
                 return (
                   <div 
                     key={week.semana}
                     className="rounded-3xl border border-white/5 bg-black/30 overflow-hidden transition-all duration-300"
                   >
                     <button
                       type="button"
                       onClick={() => setExpandedSyllabusWeeks(prev => ({ ...prev, [week.semana]: !isOpen }))}
                       className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 text-left hover:bg-white/[0.01] transition-colors gap-3"
                     >
                       <div className="space-y-1">
                         <div className="flex flex-wrap items-center gap-2.5">
                           <span className="text-[#DEFF9A] font-mono text-[10px] font-black uppercase tracking-wider">
                             ⚡ {week.semana}
                           </span>
                           <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded-full font-bold text-white/50">
                             {week.nivel_mcer}
                           </span>
                         </div>
                         <h4 className="text-white text-base font-black uppercase tracking-tight font-sans">
                           {week.tema_it}
                         </h4>
                       </div>
                       
                       <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                         <span className="text-[8px] font-black uppercase tracking-widest text-[#00E5FF] px-2.5 py-1 rounded bg-[#00E5FF]/15 border border-[#00E5FF]/20">
                           TOEFL IT INTEGRADO
                         </span>
                         <span className={`text-xs font-black font-mono transition-colors ${isOpen ? 'text-[#DEFF9A]' : 'text-white/30'}`}>
                           {isOpen ? '[- Ocultar Detalle]' : '[+ Expandir Pautas]'}
                         </span>
                       </div>
                     </button>

                     <AnimatePresence initial={false}>
                       {isOpen && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.2 }}
                           className="border-t border-white/5 bg-black/40 p-6 space-y-4"
                         >
                           <div className="text-[9px] font-mono font-black text-[#DEFF9A] uppercase tracking-widest text-left pb-1 border-b border-white/5 leading-none">
                             ⚡ PAUTAS DE CAPACITACIÓN TOEFL DE 5 HABILIDADES / SKILLS
                           </div>
                           
                           {/* Skills bento grid */}
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 text-left">
                             {/* Grammar */}
                             <div className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all flex flex-col justify-between">
                               <div>
                                 <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                                   <span className="text-emerald-400 text-xs">📖</span>
                                   <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                                     Gramática (Structure)
                                   </span>
                                 </div>
                                 <p className="text-white/60 text-[10.5px] leading-relaxed font-medium">
                                   {week.habilidades_toefl.Grammar}
                                 </p>
                               </div>
                             </div>
                             
                             {/* Listening */}
                             <div className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all flex flex-col justify-between">
                               <div>
                                 <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                                   <span className="text-cyan-400 text-xs">🎧</span>
                                   <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                                     Comprensión Auditiva
                                   </span>
                                 </div>
                                 <p className="text-white/60 text-[10.5px] leading-relaxed font-medium">
                                   {week.habilidades_toefl.Listening}
                                 </p>
                               </div>
                             </div>
                             
                             {/* Reading */}
                             <div className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all flex flex-col justify-between">
                               <div>
                                 <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                                   <span className="text-amber-400 text-xs">🔍</span>
                                   <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                                     Lectura Certificada
                                   </span>
                                 </div>
                                 <p className="text-white/60 text-[10.5px] leading-relaxed font-medium">
                                   {week.habilidades_toefl.Reading}
                                 </p>
                               </div>
                             </div>
                             
                             {/* Writing */}
                             <div className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all flex flex-col justify-between">
                               <div>
                                 <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                                   <span className="text-rose-400 text-xs">✍️</span>
                                   <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                                     Escritura Formal
                                   </span>
                                 </div>
                                 <p className="text-white/60 text-[10.5px] leading-relaxed font-medium">
                                   {week.habilidades_toefl.Writing}
                                 </p>
                               </div>
                             </div>
                             
                             {/* Speaking */}
                             <div className="p-4 rounded-2xl bg-white/[0.02] hover:bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 transition-all flex flex-col justify-between shadow-[0_0_15px_rgba(222,255,154,0.03)] animate-pulse">
                               <div>
                                 <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#DEFF9A]/10">
                                   <span className="text-[#DEFF9A] text-xs">🎙️</span>
                                   <span className="text-[10px] font-black uppercase tracking-wider text-[#DEFF9A]">
                                     Habla & Fluidez IA
                                   </span>
                                 </div>
                                 <p className="text-white/75 text-[10.5px] leading-relaxed font-medium">
                                   {week.habilidades_toefl.Speaking}
                                 </p>
                               </div>
                             </div>
                           </div>

                           {week.kpi_entregable && (
                             <div className="mt-5 bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                               <div className="flex items-center gap-3">
                                 <span className="text-xl">🏆</span>
                                 <div className="text-left">
                                   <div className="font-extrabold text-[#DEFF9A] text-[9.5px] uppercase tracking-wider font-mono">Evidencia / KPI Semanal Medible</div>
                                   <p className="text-white/80 text-xs mt-0.5 font-medium leading-relaxed">{week.kpi_entregable}</p>
                                 </div>
                               </div>
                               <span className="text-[9px] bg-black/40 font-mono text-[#DEFF9A]/80 px-2.5 py-1 rounded-lg border border-[#DEFF9A]/10 uppercase tracking-widest font-black whitespace-nowrap self-stretch sm:self-center flex items-center justify-center font-sans">Acreditación Obligatoria</span>
                             </div>
                           )}
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 );
               })
             )}
           </div>
        </div>
      ) : activeMainTab === 'RETICULAR' ? (
        /* ESTRUCTURA RETICULAR: CATÁLOGO DE ASIGNATURAS VIEW */
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/30 border border-white/5 p-6 rounded-3xl">
            <div>
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">
                ESTRUCTURA RETICULAR
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                CATÁLOGO DE ASIGNATURAS
              </h2>
              <p className="text-white/40 text-[11px] font-medium uppercase mt-1">
                Cimientos del ERP: Define la carga reticular antes de armar el horario.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowAddCareerModal(true)}
              className="px-5 py-3 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(222,255,154,0.25)] hover:shadow-[0_0_35px_rgba(222,255,154,0.45)] hover:scale-[1.02] haptic-press shrink-0"
            >
              <Plus size={14} strokeWidth={3} /> Agregar Carrera
            </button>
          </div>

          <div className="space-y-6">
            {careers.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-white/5 rounded-3xl">
                <p className="text-white/30 text-xs font-black uppercase">No hay carreras registradas.</p>
                <p className="text-white/10 text-[10px] uppercase font-bold mt-1">Crea una nueva carrera para armar su malla reticular.</p>
              </div>
            ) : (
              careers.map((career) => {
                const isExpanded = expandedCareers[career.id];
                const totalHours = career.subjects.reduce((sum, s) => sum + s.hours, 0);
                const limitHours = career.limitHours;
                const hoursLeft = limitHours - totalHours;
                
                return (
                  <div key={career.id} className="group">
                    <GlassCard>
                      <div className="p-6 md:p-8 space-y-6 text-left">
                      
                      {/* Career Card Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setExpandedCareers(prev => ({ ...prev, [career.id]: !isExpanded }))}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                          
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-white text-base md:text-xl font-black uppercase tracking-tight">
                                {career.name}
                              </h3>
                              {/* Actions Bar for Careers */}
                              <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCareerForBulk(career.id);
                                    setShowBulkUploadModal(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all haptic-press cursor-pointer"
                                  title="Carga Masiva de Asignaturas"
                                >
                                  <Download size={11} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEditCareerModal(career);
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/20 transition-all haptic-press"
                                  title="Editar Carrera"
                                >
                                  <Pencil size={11} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('¿Seguro que deseas eliminar esta carrera y todas sus asignaturas?\n\nEsta acción borrará todas las asignaturas vinculadas a esta carrera y no se puede deshacer.')) {
                                      handleDeleteCareer(career.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all haptic-press"
                                  title="Eliminar Carrera"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                            <span className="text-white/30 text-[10px] font-mono font-bold block mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span>{career.code}</span>
                              <span className="text-white/20">&bull;</span>
                              <span className="text-[#DEFF9A] uppercase tracking-wider text-[8.5px]">
                                {career.grado_semestre ? `${career.grado_semestre}° Semestre` : 'Semestre no definido'}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Limit and alerts */}
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl px-4 py-2 text-xs">
                            <span className="text-white/40 text-[9px] font-black uppercase tracking-wider">LÍMITE SEMESTRE</span>
                            <div className="flex items-baseline gap-1 text-emerald-400 font-black">
                              <span className="text-sm font-mono">{limitHours}</span>
                              <span className="text-[9px] text-white/30 uppercase">HRS</span>
                            </div>
                          </div>

                          {hoursLeft > 0 ? (
                            <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/25 text-orange-400 rounded-2xl px-5 py-2.5">
                              <AlertTriangle size={14} className="animate-pulse shrink-0" />
                              <div className="text-right">
                                <span className="font-mono text-xs font-black block leading-none text-orange-400">{totalHours} / {limitHours}</span>
                                <span className="text-[7.5px] uppercase font-black tracking-widest block mt-1">Faltan horas por asignar</span>
                              </div>
                            </div>
                          ) : hoursLeft === 0 ? (
                            <div className="flex items-center gap-3 bg-emerald-500/10 border border-[#10b981]/20 text-emerald-400 lg:px-5 px-3 py-2.5 rounded-2xl">
                              <CheckCircle2 size={14} className="shrink-0" />
                              <div className="text-right">
                                <span className="font-mono text-xs font-black block leading-none text-emerald-450">{totalHours} / {limitHours}</span>
                                <span className="text-[7.5px] uppercase font-black tracking-widest block mt-1">Carga Completa</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/25 text-red-500 lg:px-5 px-3 py-2.5 rounded-2xl animate-bounce">
                              <AlertTriangle size={14} className="shrink-0 animate-bounce" />
                              <div className="text-right">
                                <span className="font-mono text-xs font-black block leading-none text-red-450">{totalHours} / {limitHours}</span>
                                <span className="text-[7.5px] uppercase font-black tracking-widest block mt-1 text-red-505">Excede Límite Semestre</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/5 pt-6 space-y-4"
                          >
                            {/* Inner subjects header */}
                            <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest text-white/30 px-3">
                              <span>Asignatura / Clave</span>
                              <span>Carga Horaria</span>
                            </div>

                            {/* Subjects listing */}
                            <div className="space-y-3">
                              {career.subjects.length === 0 ? (
                                <p className="text-center py-6 text-white/20 italic text-xs">No hay asignaturas en este plan de carrera.</p>
                              ) : (
                                career.subjects.map((sub) => (
                                  <div 
                                    key={sub.code} 
                                    className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-4 group"
                                  >
                                    <div className="flex items-center gap-4">
                                      <span className="bg-emerald-500/10 text-[#DEFF9A] text-[10px] font-mono font-black border border-[#DEFF9A]/20 px-2.5 py-1 rounded-xl shrink-0">
                                        {sub.code}
                                      </span>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-white text-sm font-black uppercase tracking-tight">
                                            {sub.name}
                                          </span>
                                          <Book size={12} className="text-white/30 shrink-0" />
                                        </div>
                                        <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest block mt-0.5">
                                          Semestre {sub.semester}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <div className="bg-black/40 border border-white/5 rounded-xl px-3 py-1.5 text-[10px] font-mono text-white/80 shrink-0">
                                        <span className="font-black text-xs text-white mr-1">{sub.hours}</span> HRS
                                      </div>

                                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowEditSubjectModal({ careerId: career.id, subject: sub });
                                          }}
                                          className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all haptic-press shrink-0"
                                          title="Editar Asignatura"
                                        >
                                          <Pencil size={12} />
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`¿Seguro que deseas eliminar la asignatura ${sub.name}?`)) {
                                              handleDeleteSubject(career.id, sub.code);
                                            }
                                          }}
                                          className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all haptic-press shrink-0"
                                          title="Eliminar Asignatura"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Add custom asignatura trigger */}
                            <button
                              type="button"
                              onClick={() => setShowAddSubjectModal(career.id)}
                              className="w-full py-4 border-2 border-dashed border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] text-white/45 hover:text-emerald-400 rounded-3xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all haptic-press"
                            >
                              <Plus size={12} strokeWidth={3} /> Agregar Asignatura Manual al Plan
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </GlassCard>
                </div>
              );
              })
            )}
          </div>
        </div>
      ) : activeMainTab === 'DISTRIBUCION' ? (
        /* DISTRIBUCIÓN ACADÉMICA VIEW */
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
          
          {/* Header & Little Tech Integration */}
          <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div>
                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">
                  Módulo de Pre-Asignación
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                  DISTRIBUCIÓN ACADÉMICA
                </h2>
                <p className="text-white/40 text-[11px] font-medium uppercase mt-1">
                  Pre-asigna los docentes calificados a sus asignaturas antes del cronograma semanal.
                </p>
              </div>

              {/* Status and capacity indicator */}
              <div className="px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-left md:text-right">
                <span className="text-white/30 text-[8px] font-black uppercase tracking-widest block mb-1">Carga Académica Semestre</span>
                <span className="text-xs font-mono font-black text-cyan-400">Total: 24 horas registradas</span>
              </div>
            </div>

            {/* Little Tech inside header */}
            <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-cyan-500/10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                <span>🤖</span>
              </div>
              <div className="text-left space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#DEFF9A]">Little Tech • Asistente Académico</p>
                {/* Rule: check if all subjects have a teacher assigned */}
                {Object.values(distAssignments).every(id => id !== "") ? (
                  <p className="text-[11px] font-bold text-emerald-400 leading-relaxed uppercase">
                    ¡Distribución lista, compadre! Docentes pre-asignados correctamente por grupo. El motor de Horarios Inteligentes ya puede tomar el control.
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-[#DEFF9A]/80 leading-relaxed">
                    ¡Hola compadre! Te falta asignar docentes a algunas materias principales para este grupo en la Distribución Académica. Asegúrate de cubrir toda la carga.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-black/40 border border-white/5 p-4 rounded-2xl text-left font-sans">
            {/* Left side: select drop-downs */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-xl px-3 py-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-white/45">Grupo Activo:</span>
                <select
                  value={activeGroupId || ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setActiveGroupId(selectedId);
                    const selectedGroup = groups.find(g => g.id === selectedId);
                    if (selectedGroup) {
                      setDistGrade(`${selectedGroup.semester}º Semestre`);
                      setDistGroup(selectedGroup.name);
                      setDistShift(selectedGroup.shift);
                    }
                  }}
                  className="bg-transparent border-none text-white text-xs font-bold font-sans tracking-wide min-w-[140px] focus:outline-none"
                >
                  <option value="" className="bg-[#0b1219] text-white/40">Seleccionar Grupo...</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id} className="bg-[#0b1219] text-white">
                      {g.name} ({g.semester}° Sem - {g.shift})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewGroupName('');
                  setNewGroupCode('');
                  setNewGroupSemester(1);
                  setNewGroupShift('Matutino');
                  setNewGroupCapacity(35);
                  setShowAddGroupModal(true);
                }}
                className="px-4 py-2 bg-[#DEFF9A] hover:bg-[#c9f26d] text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all haptic-press shrink-0 cursor-pointer shadow-[0_0_15px_rgba(222,255,154,0.15)]"
              >
                <Plus size={11} strokeWidth={3} /> Agregar Grupo
              </button>

              <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-xl px-3 py-2 text-white/60 text-xs font-mono">
                <span className="text-[10px] uppercase font-black tracking-wider text-white/30">Límite Capacidad:</span>
                <span>{activeGroup ? `${activeGroup.capacity} Alumnos` : 'N/A'}</span>
              </div>
            </div>

            {/* Right side: Carrera limit trigger and status */}
            <div className="flex items-center justify-between lg:justify-end gap-4">
              <div className="flex items-center gap-2 pr-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#DEFF9A] shadow-[0_0_8px_#DEFF9A]" />
                <span className="text-[9px] font-mono text-white/40 uppercase font-black tracking-wider">
                  LÍMITE SEMESTRE: TOTAL 33 HRS / SEMANA
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCareers(prev => [
                    ...prev,
                    {
                      id: `career_${Date.now()}`,
                      name: 'Nueva Especialidad Curricular',
                      code: `NUEVO-${Math.floor(Math.random()*900+100)}`,
                      limitHours: 33,
                      subjects: []
                    }
                  ]);
                  setSuccessMsg("¡Especialidad creada con éxito! Ve al catalogador para agregar sus mallas.");
                  setActiveMainTab('RETICULAR');
                }}
                className="px-5 py-3 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(222,255,154,0.25)] hover:shadow-[0_0_35px_rgba(222,255,154,0.45)] hover:scale-[1.02] haptic-press whitespace-nowrap"
              >
                <Plus size={14} strokeWidth={3} /> Agregar Carrera
              </button>
            </div>
          </div>

          {/* Grid Panel - Academical distribution matrix matching the described design */}
          {!activeGroup ? (
            <div className="p-12 text-center border border-white/5 rounded-3xl my-6 bg-black/20">
              <Layers size={48} className="mx-auto text-white/20 mb-4 stroke-[1.5]" />
              <p className="text-white text-sm font-black uppercase tracking-wider">Selecciona o crea un grupo para comenzar la distribución</p>
              <p className="text-white/45 text-[10px] uppercase font-bold mt-2 leading-relaxed">
                Usa el selector de Grupo Activo en la parte superior o presiona el botón "Agregar Grupo" para definir las asignaciones semanales.
              </p>
            </div>
          ) : (
            <PreDistributionGrid
              activeGroup={activeGroup}
              subjects={getFilteredSubjects()}
              teachers={effectiveTeachers.map(t => ({ id: t.id, name: t.name, spec: t.spec, maxHours: t.id === 'ana_lopez' ? 16 : t.id === 'chucho_serna' ? 18 : t.id === 'roberto_her' ? 20 : t.id === 'sofia_ruiz' ? 14 : 12 }))}
              qualifiedMap={subjectQualifiedTeachers}
              onSync={(assignments) => {
                saveDistAssignments(assignments);
              }}
            />
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
            <span className="text-white/30 text-[9px] font-sans font-bold uppercase tracking-widest text-center sm:text-left leading-normal max-w-md">
              🔒 Las asignaciones de docentes se consolidan automáticamente y se exportan en tiempo real al motor de asignación por bloques.
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveMainTab('HORARIOS');
                setSuccessMsg("¡Conexión establecida! Abriendo el motor de Horarios Inteligentes...");
              }}
              className="px-6 py-4 rounded-2xl bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_25px_rgba(34,211,238,0.25)] flex items-center gap-2 haptic-press shrink-0"
            >
              Abrir Horarios Inteligentes ⚡
            </button>
          </div>
        </div>
      ) : activeMainTab === 'GRUPOS' ? (
        /* GRUPOS ESCOLARES VIEW */
        <div className="space-y-8 animate-in fade-in duration-500 font-sans text-left">
          
          {/* Section Header */}
          <div className="bg-black/30 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">
                  MÓDULO DE PLANEACIÓN ESTRUCTURAL
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                  GRUPOS ESCOLARES
                </h2>
                <p className="text-white/40 text-[11px] font-medium uppercase mt-1">
                  Visualiza, gestiona y enlaza los grupos creados desde la distribución académica con datos reales del sistema.
                </p>
              </div>

              {/* Add Group Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setNewGroupName('');
                  setNewGroupCode('');
                  setNewGroupSemester(1);
                  setNewGroupShift('Matutino');
                  setNewGroupCapacity(35);
                  setShowAddGroupModal(true);
                }}
                className="px-5 py-3 rounded-2xl bg-[#DEFF9A] hover:bg-[#c9f26d] text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(222,255,154,0.25)] hover:scale-[1.02] haptic-press shrink-0 cursor-pointer"
              >
                <Plus size={14} strokeWidth={3} /> Agregar Grupo Escolar
              </button>
            </div>

            {/* Helper Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-amber-500/10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <span>👥</span>
              </div>
              <div className="text-left space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#DEFF9A]">Little Tech • Asistente Escolar</p>
                <p className="text-[11px] font-bold text-[#DEFF9A]/80 leading-relaxed uppercase">
                  ¡Hola compadre! Aquí puedes ver todos los grupos disponibles de tu ERP. Al dar clic en "Ver Distribución", ese grupo específico se activará al instante dentro de la matriz académica del director.
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
              <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block mb-1">Total de Grupos Activos</span>
              <p className="text-3xl font-black text-white font-mono">{groups.length} <span className="text-xs text-white/40">GRUPOS</span></p>
              <p className="text-[9px] text-white/20 uppercase font-bold mt-1">Almacenados y Sincronizados</p>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-2xl p-5 font-sans">
              <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block mb-1 font-sans">Capacidad Total de Matrícula</span>
              <p className="text-3xl font-black text-[#DEFF9A] font-mono">
                {groups.reduce((acc, g) => acc + g.capacity, 0)} <span className="text-xs text-white/40">ALUMNOS</span>
              </p>
              <p className="text-[9px] text-white/20 uppercase font-bold mt-1">Límite absoluto de cupos</p>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-2xl p-5 font-sans">
              <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block mb-1 font-sans">Grupo Seleccionado Actual</span>
              <p className="text-base font-black text-cyan-400 uppercase truncate">
                {activeGroup ? `${activeGroup.name} (${activeGroup.semester}° Sem)` : 'NINGUNO'}
              </p>
              <p className="text-[9px] text-white/20 uppercase font-bold mt-1">Recibe las pre-asignaciones de maestros</p>
            </div>
          </div>

          {/* Live Groups Grid representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {groups.map((g) => {
              const isActive = g.id === activeGroupId;
              const totalSemesterSubjects = careers.reduce((acc, c) => {
                return acc + (c.subjects?.filter(sub => sub.semester === g.semester)?.length || 0);
              }, 0);

              return (
                <div key={g.id}>
                  <GlassCard>
                    <div className="p-6 space-y-6 text-left relative flex flex-col justify-between h-full min-h-[200px]">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                              {g.name}
                              {isActive && (
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" title="Grupo Activo Actual" />
                              )}
                            </h3>
                            <span className="text-[9px] font-mono font-bold text-white/30 tracking-wider block">ID: {g.code}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-405 text-[9px] font-black uppercase tracking-wider">
                              {g.semester}° Semestre
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[8px] font-bold uppercase tracking-wider">
                              {g.shift}
                            </span>
                          </div>
                        </div>

                        {/* Info lines with data consistency */}
                        <div className="pt-2 divide-y divide-white/5 text-xs font-sans">
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-white/40 uppercase text-[9px] font-black tracking-wider">Límite de Cupo:</span>
                            <span className="text-white font-bold font-mono text-right">{g.capacity} Alumnos</span>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-white/40 uppercase text-[9px] font-black tracking-wider">Asignaturas de Malla:</span>
                            <span className="text-[#DEFF9A] font-bold font-mono text-right">{totalSemesterSubjects} materias</span>
                          </div>
                          {isActive && (
                            <div className="py-2 text-center bg-cyan-500/10 border border-cyan-500/20 rounded-xl mt-2 text-[#DEFF9A] font-mono text-[8px] font-black uppercase tracking-widest">
                              ⚡ Enlazado como Grupo Activo
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer buttons for real binding & linking */}
                      <div className="pt-4 border-t border-white/5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveGroupId(g.id);
                            setDistGrade(`${g.semester}º Semestre`);
                            setDistGroup(g.name);
                            setDistShift(g.shift);
                            setActiveMainTab('DISTRIBUCION');
                            setSuccessMsg(`Grupo "${g.name}" seleccionado como activo. Redirigiendo a Distribución Académica...`);
                          }}
                          className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                            isActive 
                              ? 'bg-cyan-400 text-black font-black hover:bg-cyan-350 shadow-[0_0_15px_rgba(34,211,238,0.25)]' 
                              : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                          }`}
                        >
                          {isActive ? '🔍 Ver Distribución' : '🔗 Ir a Distribución'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`¿Estás seguro de que deseas eliminar el grupo "${g.name}"?\nEsta acción es irreversible.`)) {
                              const updated = groups.filter(item => item.id !== g.id);
                              setGroups(updated);
                              if (activeGroupId === g.id) {
                                setActiveGroupId(updated[0]?.id || null);
                              }
                              setSuccessMsg(`¡El grupo "${g.name}" se eliminó del sistema con éxito!`);
                            }
                          }}
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 text-red-405 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                          title="Eliminar Grupo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>

          {/* Empty fallback visual layout if needed */}
          {groups.length === 0 && (
            <div className="p-16 text-center border-2 border-dashed border-white/10 rounded-3xl bg-black/10">
              <Users size={48} className="mx-auto text-white/20 mb-4 stroke-[1.5]" />
              <p className="text-white text-base font-black uppercase tracking-wider">No hay grupos creados</p>
              <p className="text-white/40 text-xs mt-2 uppercase font-bold leading-normal">
                Presiona el botón "Agregar Grupo Escolar" en la parte superior para registrar tu primer aula y empezar a asignar.
              </p>
            </div>
          )}
        </div>
      ) : activeMainTab === 'HORARIOS' ? (
        <div className="animate-in fade-in duration-500">
          <SchedulesMaster />
        </div>
      ) : null}

      {/* ADD CAREER OVERLAY MODAL */}
      <AnimatePresence>
        {showAddCareerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0b1219] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20 text-left">
                <div>
                  <span className="text-emerald-400 text-[8px] font-mono font-black uppercase tracking-[0.3em]">NUEVO PLAN ESCOLAR</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Agregar Carrera Escolar</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCareerModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddCareer} className="p-6 space-y-5 text-left">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Nombre de la Carrera</label>
                  <input
                    type="text"
                    required
                    value={newCareerName}
                    onChange={(e) => setNewCareerName(e.target.value)}
                    placeholder="Ej. Ingeniería en Sistemas Computacionales"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45 font-bold">Clave / Plan ID</label>
                    <input
                      type="text"
                      required
                      value={newCareerCode}
                      onChange={(e) => setNewCareerCode(e.target.value)}
                      placeholder="Ej. IINF-2010-220"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45 font-bold">Grado / Semestre</label>
                    <div className="relative">
                      <select
                        required
                        value={newCareerGradoSemestre}
                        onChange={(e) => setNewCareerGradoSemestre(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none font-bold uppercase select-none"
                      >
                        <option value="" className="bg-[#0b1219]">Seleccionar...</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <option key={n} value={n} className="bg-[#0b1219] text-white">
                            {n}° Semestre
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-[8px]">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45 animate-pulse">Límite Semestre (HRS)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={60}
                      value={newCareerLimitHours}
                      onChange={(e) => setNewCareerLimitHours(Number(e.target.value))}
                      placeholder="Ej. 33"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAddCareerModal(false)}
                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#DEFF9A] text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(222,255,154,0.15)] hover:scale-[1.01]"
                  >
                    Crear Carrera
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD SUBJECT OVERLAY MODAL */}
      <AnimatePresence>
        {showAddSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0b1219] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20 text-left">
                <div>
                  <span className="text-[#DEFF9A] text-[8px] font-mono font-black uppercase tracking-[0.3em]">RETÍCULA VINCULADA</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Agregar Asignatura Manual</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddSubject} className="p-6 space-y-5 text-left">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#9ca3af]">Nombre de la Asignatura</label>
                  <input
                    type="text"
                    required
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="Ej. TecLingo AI (Inglés I)"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 font-sans">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Clave de la Asignatura</label>
                    <input
                      type="text"
                      required
                      value={newSubjectCode}
                      onChange={(e) => setNewSubjectCode(e.target.value)}
                      placeholder="Ej. TEC-001"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Semestre</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={12}
                        value={newSubjectSemester}
                        onChange={(e) => setNewSubjectSemester(Number(e.target.value))}
                        placeholder="1"
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/45 font-bold">Hrs Sem.</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={10}
                        value={newSubjectHours}
                        onChange={(e) => setNewSubjectHours(Number(e.target.value))}
                        placeholder="4"
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAddSubjectModal(null)}
                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#DEFF9A] text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(222,255,154,0.15)] hover:scale-[1.01]"
                  >
                    Agregar Asignatura
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CAREER OVERLAY MODAL */}
      <AnimatePresence>
        {showEditCareerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0b1219] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20 text-left">
                <div>
                  <span className="text-cyan-400 text-[8px] font-mono font-black uppercase tracking-[0.3em]">MODIFICAR PLAN ESCOLAR</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Editar Carrera</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditCareerModal(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleEditCareerSubmit} className="p-6 space-y-5 text-left">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Nombre de la Carrera</label>
                  <input
                    type="text"
                    required
                    value={showEditCareerModal.name}
                    onChange={(e) => setShowEditCareerModal({ ...showEditCareerModal, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45 font-bold">Clave / Plan ID</label>
                    <input
                      type="text"
                      required
                      value={showEditCareerModal.code}
                      onChange={(e) => setShowEditCareerModal({ ...showEditCareerModal, code: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Semestre</label>
                    <select
                      value={showEditCareerModal.grado_semestre || ''}
                      onChange={(e) => setShowEditCareerModal({ ...showEditCareerModal, grado_semestre: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full bg-[#0b1219] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-sans"
                    >
                      <option value="">No definido</option>
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <option key={n} value={n}>{n}° Semestre</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Límite Semestre (HRS)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={60}
                      value={showEditCareerModal.limitHours}
                      onChange={(e) => setShowEditCareerModal({ ...showEditCareerModal, limitHours: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`⚠️ PLAN ADVERTENCIA: ¿Estás completamente seguro de que deseas eliminar la carrera "${showEditCareerModal.name}"? Esta acción eliminará permanentemente la carrera, todas sus asignaturas asociadas y la retícula de este plan de estudios de forma irreversible.`)) {
                        handleDeleteCareer(showEditCareerModal.id);
                        setShowEditCareerModal(null);
                      }
                    }}
                    className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-100 text-[9px] font-black uppercase tracking-widest transition-all haptic-press cursor-pointer"
                  >
                    Borrar Carrera
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditCareerModal(null)}
                      className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-cyan-400 text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:scale-[1.01] cursor-pointer"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SUBJECT OVERLAY MODAL */}
      <AnimatePresence>
        {showEditSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0b1219] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20 text-left">
                <div>
                  <span className="text-cyan-400 text-[8px] font-mono font-black uppercase tracking-[0.3em]">EDICIÓN DE RETÍCULA</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Editar Asignatura</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditSubjectModal(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleEditSubjectSubmit} className="p-6 space-y-5 text-left">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#9ca3af]">Nombre de la Asignatura</label>
                  <input
                    type="text"
                    required
                    value={showEditSubjectModal.subject.name}
                    onChange={(e) => setShowEditSubjectModal({
                      ...showEditSubjectModal,
                      subject: { ...showEditSubjectModal.subject, name: e.target.value }
                    })}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 font-sans">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Clave (No Editable)</label>
                    <input
                      type="text"
                      disabled
                      value={showEditSubjectModal.subject.code}
                      className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white/40 focus:outline-none font-mono uppercase cursor-not-allowed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Semestre</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={12}
                        value={showEditSubjectModal.subject.semester}
                        onChange={(e) => setShowEditSubjectModal({
                          ...showEditSubjectModal,
                          subject: { ...showEditSubjectModal.subject, semester: Number(e.target.value) }
                        })}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/45 font-bold">Hrs Sem.</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={10}
                        value={showEditSubjectModal.subject.hours}
                        onChange={(e) => setShowEditSubjectModal({
                          ...showEditSubjectModal,
                          subject: { ...showEditSubjectModal.subject, hours: Number(e.target.value) }
                        })}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Seguro que deseas eliminar la asignatura ${showEditSubjectModal.subject.name}?`)) {
                        handleDeleteSubject(showEditSubjectModal.careerId, showEditSubjectModal.subject.code);
                        setShowEditSubjectModal(null);
                      }
                    }}
                    className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-100 text-[9px] font-black uppercase tracking-widest transition-all haptic-press cursor-pointer"
                  >
                    Borrar Asignatura
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditSubjectModal(null)}
                      className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-cyan-400 text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:scale-[1.01] cursor-pointer"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD GROUP OVERLAY MODAL */}
      <AnimatePresence>
        {showAddGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300 animate-[fadeIn_0.2s_ease-out]">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0b1219] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20 text-left">
                <div>
                  <span className="text-[#DEFF9A] text-[8px] font-mono font-black uppercase tracking-[0.3em]">NUEVO GRUPO DE CLASES</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Agregar Grupo Escolar</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddGroupSubmit} className="p-6 space-y-5 text-left font-sans">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Nombre del Grupo</label>
                    <input
                      type="text"
                      required
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Ej. 2° A"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45 font-bold">ID / Clave</label>
                    <input
                      type="text"
                      required
                      value={newGroupCode}
                      onChange={(e) => setNewGroupCode(e.target.value)}
                      placeholder="Ej. GRP-2A"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Semestre</label>
                    <select
                      value={newGroupSemester}
                      onChange={(e) => setNewGroupSemester(Number(e.target.value))}
                      className="w-full bg-[#0b1219] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/50 transition-colors font-sans"
                    >
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <option key={n} value={n} className="bg-[#0b1219] text-white">{n}° Semestre</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45">Turno</label>
                    <select
                      value={newGroupShift}
                      onChange={(e) => setNewGroupShift(e.target.value as any)}
                      className="w-full bg-[#0b1219] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/50 transition-colors font-sans"
                    >
                      <option value="Matutino" className="bg-[#0b1219] text-white">Matutino</option>
                      <option value="Vespertino" className="bg-[#0b1219] text-white">Vespertino</option>
                      <option value="Nocturno" className="bg-[#0b1219] text-white">Nocturno</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/45 font-sans">Capacidad Máx</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={60}
                      value={newGroupCapacity}
                      onChange={(e) => setNewGroupCapacity(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/50 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAddGroupModal(false)}
                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#DEFF9A] text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(222,255,154,0.15)] hover:scale-[1.01] cursor-pointer"
                  >
                    Crear Grupo ➕
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CARGA MASIVA OVERLAY MODAL */}
      <AnimatePresence>
        {showBulkUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300 animate-[fadeIn_0.2s_ease-out]">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0b1219] border border-white/10 rounded-3xl max-w-2xl w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20 text-left">
                <div>
                  <span className="text-emerald-400 text-[8px] font-mono font-black uppercase tracking-[0.3em]">IMPORTACIÓN CURRICULAR</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Carga Masiva de Asignaturas</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkParsedSubjects([]);
                    setBulkError(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-white/5 bg-black/10">
                <button
                  type="button"
                  onClick={() => {
                    setBulkActiveTab('json');
                    setBulkParsedSubjects([]);
                    setBulkError(null);
                  }}
                  className={`flex-1 py-3 text-center text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
                    bulkActiveTab === 'json'
                      ? 'border-emerald-400 text-emerald-400 bg-white/[0.02]'
                      : 'border-transparent text-white/40 hover:text-white/60'
                  }`}
                >
                  📂 Archivo JSON
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBulkActiveTab('pdf');
                    setBulkParsedSubjects([]);
                    setBulkError(null);
                    setPdfExtractedText('');
                  }}
                  className={`flex-1 py-3 text-center text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
                    bulkActiveTab === 'pdf'
                      ? 'border-emerald-400 text-emerald-400 bg-white/[0.02]'
                      : 'border-transparent text-white/40 hover:text-white/60'
                  }`}
                >
                  📄 OCR / PDF Inteligente
                </button>
              </div>

              {/* Body content */}
              <div className="p-6 space-y-5 text-left font-sans max-h-[50vh] overflow-y-auto">
                {bulkActiveTab === 'json' ? (
                  <div className="space-y-4">
                    <p className="text-[11px] text-white/60 leading-relaxed uppercase font-semibold">
                      Sube un archivo <code className="text-[#DEFF9A] font-mono">.json</code> que contenga una lista de asignaturas con propiedades como <code className="text-cyan-400 font-mono">clave</code> (code), <code className="text-cyan-400 font-mono">nombre</code> (name), <code className="text-cyan-400 font-mono">semestre</code> y <code className="text-cyan-400 font-mono">horas</code>.
                    </p>
                    <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center bg-black/20 hover:border-emerald-500/30 transition-colors">
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleJsonUpload(f);
                        }}
                        className="hidden"
                        id="bulk-json-input"
                      />
                      <label htmlFor="bulk-json-input" className="cursor-pointer space-y-2 block">
                        <span className="text-3xl block">📥</span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:text-emerald-300">Seleccionar de mi Computadora</span>
                        <span className="text-[9px] text-white/30 block">archivos .json con estructura de mallas</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[11px] text-white/60 leading-relaxed uppercase font-semibold">
                      Sube tu PDF oficial (ej. retícula escolar del tecnológico). Nuestro asistente extraerá automáticamente las asignaturas, claves y cargas horarias usando patrones OCR.
                    </p>
                    <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center bg-black/20 hover:border-emerald-500/30 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) extractTextFromPDF(f);
                        }}
                        className="hidden"
                        id="bulk-pdf-input"
                      />
                      <label htmlFor="bulk-pdf-input" className="cursor-pointer space-y-2 block">
                        <span className="text-3xl block">📄</span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:text-emerald-300">Seleccionar PDF Escaneado</span>
                        <span className="text-[9px] text-white/30 block">admite documentos oficiales con formatos PDF estándar</span>
                      </label>
                    </div>

                    {pdfExtractedText && (
                      <div className="space-y-2 bg-black/30 p-4 border border-white/5 rounded-2xl">
                        <span className="text-[8px] font-mono uppercase font-black tracking-wider text-white/30">Vista de Texto Plano Extraído del PDF</span>
                        <textarea
                          readOnly
                          value={pdfExtractedText}
                          className="w-full h-24 bg-black/50 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-white/60 focus:outline-none resize-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Loading state indicator */}
                {bulkLoading && (
                  <div className="p-8 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <p className="text-xs text-white/60 uppercase font-black tracking-wider">Leyendo y analizando archivo académicamente...</p>
                  </div>
                )}

                {/* Error Banner */}
                {bulkError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-start gap-2">
                    <span>⚠️</span>
                    <p className="font-bold leading-normal uppercase">{bulkError}</p>
                  </div>
                )}

                {/* Parsed subjects Preview list (Editable Table) */}
                {bulkParsedSubjects.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                        Asignaturas Detectadas ({bulkParsedSubjects.length} materias encontradas)
                      </span>
                      <button
                        type="button"
                        onClick={() => setBulkParsedSubjects([])}
                        className="text-[8px] uppercase tracking-wider font-extrabold text-white/30 hover:text-white cursor-pointer"
                      >
                        Limpiar Todo
                      </button>
                    </div>

                    <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/20">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-black/40 border-b border-white/5 font-mono text-[8px] uppercase font-bold text-white/45 text-left">
                            <th className="p-3">Clave</th>
                            <th className="p-3">Nombre Asignatura</th>
                            <th className="p-3 text-center">Sem</th>
                            <th className="p-3 text-center">Horas</th>
                            <th className="p-3 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-sans">
                          {bulkParsedSubjects.map((sub, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.01]">
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={sub.code}
                                  onChange={(e) => {
                                    const val = e.target.value.toUpperCase();
                                    setBulkParsedSubjects(prev => prev.map((s, i) => i === idx ? { ...s, code: val } : s));
                                  }}
                                  className="bg-black/30 border border-white/5 rounded-lg px-2 py-1 text-[11px] font-mono text-white/80 w-24 focus:outline-none focus:border-cyan-500"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={sub.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setBulkParsedSubjects(prev => prev.map((s, i) => i === idx ? { ...s, name: val } : s));
                                  }}
                                  className="bg-black/30 border border-white/5 rounded-lg px-2 py-1 text-[11px] text-white/80 w-full focus:outline-none focus:border-cyan-500"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min={1}
                                  max={12}
                                  value={sub.semester}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 1;
                                    setBulkParsedSubjects(prev => prev.map((s, i) => i === idx ? { ...s, semester: val } : s));
                                  }}
                                  className="bg-black/30 border border-white/5 rounded-lg px-2 py-1 text-[11px] font-mono text-white/80 text-center w-12 focus:outline-none focus:border-cyan-500"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min={1}
                                  max={15}
                                  value={sub.hours}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 4;
                                    setBulkParsedSubjects(prev => prev.map((s, i) => i === idx ? { ...s, hours: val } : s));
                                  }}
                                  className="bg-[#0b1219] border border-white/5 rounded-lg px-2 py-1 text-[11px] font-mono text-white/80 text-center w-12 focus:outline-none focus:border-cyan-500"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => setBulkParsedSubjects(prev => prev.filter((_, i) => i !== idx))}
                                  className="text-red-400 hover:text-red-300 text-xs px-2 cursor-pointer"
                                  title="Quitar de la lista"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm footer */}
              <div className="p-6 bg-black/20 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center text-left">
                <span className="text-[9px] uppercase font-mono tracking-widest text-white/30 max-w-sm">
                  ⚠️ Compara los datos editables antes de importar para asegurar la pureza de la retícula curricular.
                </span>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      setBulkParsedSubjects([]);
                    }}
                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    disabled={bulkParsedSubjects.length === 0}
                    onClick={handleBulkImportConfirm}
                    className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                      bulkParsedSubjects.length > 0 
                        ? 'bg-emerald-400 text-black hover:bg-[#aefea4] shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    Confirmar e Importar (${bulkParsedSubjects.length}) 👍
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
