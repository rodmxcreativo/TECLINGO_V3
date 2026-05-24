export interface HoraLeccion {
  hora: number;
  leccion: string;
  enfoque: string;
  videoId: string;
  track: string;
}

export interface SemanaMalla {
  semana: number;
  fechas: string;
  eje_tematico: string;
  unidad_libro: string;
  paginas: string;
  horas: HoraLeccion[];
  kpi: string;
}

export const mallaCurricularModulo1: SemanaMalla[] = [
  {
    semana: 1,
    fechas: "08 Sep - 12 Sep",
    eje_tematico: "Saludos, Presentaciones Personales y Cortesía Básica",
    unidad_libro: "Unidad 1: Personal Profiles",
    paginas: "Págs. 4-9",
    horas: [
      { hora: 1, leccion: "Placement Test & Platform Onboarding", enfoque: "Examen de diagnóstico inicial para nivel cero.", videoId: "u9fuPGgvLB8", track: "[Vocabulary] [Listening] | Placement Test" },
      { hora: 2, leccion: "El Sujeto Obligatorio (Base TOEFL)", enfoque: "Pronombres personales sujetos (I, You, He, She, It).", videoId: "I2SaZnEjmZw", track: "[Grammar] [Speaking IA] | Sujeto Obligatorio" },
      { hora: 3, leccion: "Greetings & Core Vocabulary", enfoque: "Saludos cordiales, decir nombre, edad y nacionalidades.", videoId: "I2SaZnEjmZw", track: "[Vocabulary] [Listening] | Saludos" },
      { hora: 4, leccion: "First Contact Simulation", enfoque: "Simulación conversacional reactiva de presentación personal.", videoId: "u9fuPGgvLB8", track: "[Speaking IA] | Fluidez Reactiva" }
    ],
    kpi: "🏆 Evidencia: Tarjeta de contacto personal escrita y audio de presentación de 1 min."
  },
  {
    semana: 2,
    fechas: "15 Sep - 19 Sep",
    eje_tematico: "Objetos Escolares y del Aula de Clase",
    unidad_libro: "Unidad 1: Classroom Space",
    paginas: "Págs. 10-15",
    horas: [
      { hora: 1, leccion: "Classroom Vocabulary & Articles", enfoque: "Artículos definidos e indefinidos con objetos del aula.", videoId: "u9fuPGgvLB8", track: "[Grammar] [Vocabulary]" },
      { hora: 2, leccion: "Plural Nouns & Demonstratives", enfoque: "Uso de This, That, These, Those en el entorno escolar.", videoId: "I2SaZnEjmZw", track: "[Grammar] [Reading]" },
      { hora: 3, leccion: "Listening: Classroom Instructions", enfoque: "Identificación de comandos imperativos del docente.", videoId: "fbVEFymdUtk", track: "[Listening] [Speaking IA]" },
      { hora: 4, leccion: "Speaking: My Inventory Check", enfoque: "Estructuración de reportes básicos de material disponible.", videoId: "fbVEFymdUtk", track: "[Speaking IA] [Writing]" }
    ],
    kpi: "🏆 Evidencia: Inventario escrito del aula de clases con uso de demostrativos."
  },
  {
    semana: 3,
    fechas: "22 Sep - 26 Sep",
    eje_tematico: "Miembros de la Familia y Relaciones Básicas",
    unidad_libro: "Unidad 2: Family Tree",
    paginas: "Págs. 16-23",
    horas: [
      { hora: 1, leccion: "Possessive Adjectives (My, Your, His, Her)", enfoque: "Estructuración de relaciones de pertenencia familiar.", videoId: "u9fuPGgvLB8", track: "[Grammar] [Vocabulary]" },
      { hora: 2, leccion: "The Genitive Case ('s)", enfoque: "Uso correcto del apóstrofe de posesión sin redundancias.", videoId: "I2SaZnEjmZw", track: "[Grammar] [Reading]" },
      { hora: 3, leccion: "Reading: Family Profiles", enfoque: "Análisis de árboles genealógicos y textos descriptivos.", videoId: "fbVEFymdUtk", track: "[Reading] [Listening]" },
      { hora: 4, leccion: "Speaking: Presenting My Family", enfoque: "Monólogo de 45 segundos describiendo un núcleo familiar.", videoId: "o8xOJPKfraU", track: "[Speaking IA] [Acreditación]" }
    ],
    kpi: "🏆 Evidencia: Árbol genealógico redactado con descripción de 4 miembros."
  },
  {
    semana: 4,
    fechas: "29 Sep - 03 Oct",
    eje_tematico: "Países, Nacionalidades e Idiomas del Mundo",
    unidad_libro: "Unidad 2: Global Citizens",
    paginas: "Págs. 24-29",
    horas: [
      { hora: 1, leccion: "Prepositions of Place: From & In", enfoque: "Origen geográfico y ubicación actual.", videoId: "u9fuPGgvLB8", track: "[Grammar] [Vocabulary]" },
      { hora: 2, leccion: "Capitalization Rules in TOEFL", enfoque: "Uso obligatorio de mayúsculas en países e idiomas.", videoId: "I2SaZnEjmZw", track: "[Writing] [Grammar]" },
      { hora: 3, leccion: "Listening: Global Interviews", enfoque: "Rastreo de acentos básicos y procedencias en audio.", videoId: "fbVEFymdUtk", track: "[Listening]" },
      { hora: 4, leccion: "Speaking: Passport Control Quiz", enfoque: "Simulación de control migratorio respondiendo a la IA.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Formulario de aduana completado sin errores de capitalización."
  },
  {
    semana: 5,
    fechas: "06 Oct - 10 Oct",
    eje_tematico: "Pasatiempos, Deporte y Actividades Recreativas",
    unidad_libro: "Unidad 3: Free Time & Sports",
    paginas: "Págs. 30-37",
    horas: [
      { hora: 1, leccion: "Contextual Articles (A, An, The)", enfoque: "Dominio de artículos al enunciar gustos genéricos.", videoId: "u9fuPGgvLB8", track: "[Grammar] Dominio Contextual" },
      { hora: 2, leccion: "Listening: Public Surveys", enfoque: "Identificación de actividades preferidas de fin de semana.", videoId: "u9fuPGgvLB8", track: "[Listening] Encuestas Públicas" },
      { hora: 3, leccion: "Reading: Community Clubs Announcements", enfoque: "Interpretación de convocatorias para ligas recreativas.", videoId: "u9fuPGgvLB8", track: "[Reading] Convocatorias" },
      { hora: 4, leccion: "Speaking IA: 40-Second Hobby Pitch", enfoque: "Hablar continuamente justificando su pasatiempo favorito.", videoId: "u9fuPGgvLB8", track: "[Speaking IA] Fluidez Continua" }
    ],
    kpi: "🏆 Evidencia: Ensayo corto sobre hobbys de ocio predilectos."
  },
  {
    semana: 6,
    fechas: "13 Oct - 17 Oct",
    eje_tematico: "Descripción Física de Personas y Adjetivos de Aspecto",
    unidad_libro: "Unidad 3: Character Profiles",
    paginas: "Págs. 38-43",
    horas: [
      { hora: 1, leccion: "Adjective Word Order", enfoque: "Reglas de orden de adjetivos antes del sustantivo.", videoId: "I2SaZnEjmZw", track: "[Grammar] [Structure]" },
      { hora: 2, leccion: "Modifiers: Very, Quite, Really", enfoque: "Gradación de descripciones físicas de forma precisa.", videoId: "fbVEFymdUtk", track: "[Vocabulary] [Grammar]" },
      { hora: 3, leccion: "Listening: Suspect Identification", enfoque: "Aislar rasgos físicos específicos en llamadas de auxilio.", videoId: "fbVEFymdUtk", track: "[Listening]" },
      { hora: 4, leccion: "Speaking: Avatar Builder Simulation", enfoque: "Describir el aspecto de un compañero frente a la plataforma.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Párrafo descriptivo comparativo de dos perfiles."
  },
  {
    semana: 7,
    fechas: "20 Oct - 24 Oct",
    eje_tematico: "Actividades de la Rutina Diaria (Por la Mañana)",
    unidad_libro: "Unidad 4: Morning Routines",
    paginas: "Págs. 44-51",
    horas: [
      { hora: 1, leccion: "Simple Present: First Person", enfoque: "Verbos de acción matutina y conjugación base.", videoId: "u9fuPGgvLB8", track: "[Grammar] [Vocabulary]" },
      { hora: 2, leccion: "Prepositions of Time: At, On, In", enfoque: "Uso exacto de preposiciones con horas y partes del día.", videoId: "I2SaZnEjmZw", track: "[Grammar] Estándar TOEFL" },
      { hora: 3, leccion: "Listening: Morning Schedules", enfoque: "Estructuración de agendas basadas en audios cronológicos.", videoId: "fbVEFymdUtk", track: "[Listening]" },
      { hora: 4, leccion: "Speaking: My First 3 Hours", enfoque: "Detallar la rutina de despertar usando conectores temporales.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Bitácora matutina con marcas de tiempo exactas."
  },
  {
    semana: 8,
    fechas: "27 Oct - 31 Oct",
    eje_tematico: "Rutina de Trabajo y Actividades por la Tarde",
    unidad_libro: "Unidad 4: Afternoon Tasks",
    paginas: "Págs. 52-59",
    horas: [
      { hora: 1, leccion: "Third Person Singular (-s/-es/-ies)", enfoque: "Reglas de ortografía gramatical para He, She, It.", videoId: "I2SaZnEjmZw", track: "[Grammar] Trampa TOEFL" },
      { hora: 2, leccion: "Adverbs of Frequency (Always, Usually)", enfoque: "Posición correcta del adverbio antes del verbo principal.", videoId: "u9fuPGgvLB8", track: "[Grammar] [Structure]" },
      { hora: 3, leccion: "Reading: Corporate Diaries", enfoque: "Comprensión lectora sobre el día laboral de un ejecutivo.", videoId: "fbVEFymdUtk", track: "[Reading]" },
      { hora: 4, leccion: "Speaking: Describing My Peer's Day", enfoque: "Reportar la rutina de un compañero en tercera persona.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Reporte escrito de la rutina laboral de un tercero."
  },
  {
    semana: 9,
    fechas: "03 Nov - 07 Nov",
    eje_tematico: "Hábitos Nocturnos, Descanso y Fin de la Jornada",
    unidad_libro: "Unidad 5: Night Routines",
    paginas: "Págs. 60-67",
    horas: [
      { hora: 1, leccion: "Auxiliaries 'Do' & 'Does' Basics", enfoque: "Estructurar preguntas de confirmación cerradas cotidianas.", videoId: "Ol8bM0u78vO", track: "[Grammar] Preguntas Cerradas" },
      { hora: 2, leccion: "Listening: Night Audio Analysis", enfoque: "Aislar hábitos antes de dormir en grabaciones cortas.", videoId: "Ol8bM0u78vO", track: "[Listening] Grabaciones Cortas" },
      { hora: 3, leccion: "Reading: Relaxation Brochures", enfoque: "Analizar folletos de relajación y guías domésticas.", videoId: "Ol8bM0u78vO", track: "[Reading] Guías Domésticas" },
      { hora: 4, leccion: "Speaking IA: Sleep Habits Debate", enfoque: "Debatir con la IA si prefiere actividades tranquilas o ejercicio.", videoId: "Ol8bM0u78vO", track: "[Speaking IA] Debate con IA" }
    ],
    kpi: "🏆 Evidencia: Cuestionario de hábitos del sueño resuelto y estructurado."
  },
  {
    semana: 10,
    fechas: "10 Nov - 14 Nov",
    eje_tematico: "Ubicación Espacial, Habitaciones y Muebles de Casa",
    unidad_libro: "Unidad 5: Home Space",
    paginas: "Págs. 68-75",
    horas: [
      { hora: 1, leccion: "There is / There are Construction", enfoque: "Uso para existencia singular y plural en la vivienda.", videoId: "u9fuPGgvLB8", track: "[Grammar] [Structure]" },
      { hora: 2, leccion: "Prepositions: In, On, Under, Next to", enfoque: "Ubicación espacial exacta de objetos cotidianos.", videoId: "I2SaZnEjmZw", track: "[Grammar] [Vocabulary]" },
      { hora: 3, leccion: "Listening: Emergency Floor Plan", enfoque: "Dibujar la distribución de una casa según audio guía.", videoId: "fbVEFymdUtk", track: "[Listening]" },
      { hora: 4, leccion: "Speaking: Real Estate Pitch", enfoque: "Simular la descripción y venta de los cuartos de una casa.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Croquis del hogar descrito mediante oraciones afirmativas completas."
  },
  {
    semana: 11,
    fechas: "17 Nov - 21 Nov",
    eje_tematico: "Medios de Transporte y Traslados en la Ciudad",
    unidad_libro: "Unidad 6: City Commute",
    paginas: "Págs. 76-81",
    horas: [
      { hora: 1, leccion: "Verbs: Take, Ride, Drive, Walk", enfoque: "Colocaciones verbales correctas con tipos de transporte.", videoId: "u9fuPGgvLB8", track: "[Vocabulary] [Grammar]" },
      { hora: 2, leccion: "Prepositions of Motion: To, Across, Through", enfoque: "Indicar desplazamientos geográficos en la urbe.", videoId: "I2SaZnEjmZw", track: "[Grammar]" },
      { hora: 3, leccion: "Listening: Lost in the City", enfoque: "Extraer rutas e indicaciones en audios de mapas urbanos.", videoId: "fbVEFymdUtk", track: "[Listening]" },
      { hora: 4, leccion: "Speaking: Commute Diagnostics", enfoque: "Explicar a la IA detalladamente cómo se llega al centro de cómputo.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Guía de direcciones escrita desde origen hasta destino escolar."
  },
  {
    semana: 12,
    fechas: "24 Nov - 28 Nov",
    eje_tematico: "El Tiempo de Ocio y Frecuencia de Actividades",
    unidad_libro: "Unidad 6: Calendar & Frequency",
    paginas: "Págs. 82-89",
    horas: [
      { hora: 1, leccion: "Adverbs of Frequency Extrapolated", enfoque: "Uso de Hardly ever, Seldom, Periodically.", videoId: "I2SaZnEjmZw", track: "[Grammar] [Structure]" },
      { hora: 2, leccion: "Expressions: Once a week, Twice a month", enfoque: "Estructuración de bloques temporales cíclicos.", videoId: "u9fuPGgvLB8", track: "[Vocabulary] [Grammar]" },
      { hora: 3, leccion: "Reading: Routine Metrics", enfoque: "Interpretación de gráficas e histogramas de hábitos.", videoId: "fbVEFymdUtk", track: "[Reading]" },
      { hora: 4, leccion: "Speaking: Balance of Life", enfoque: "Exponer frente a la IA el tiempo asignado al estudio semanal.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Cuadro estadístico personal de asignación de horas de ocio."
  },
  {
    semana: 13,
    fechas: "01 Dic - 05 Dic",
    eje_tematico: "Alimentos, Nutrición Básica y Menú de Casa",
    unidad_libro: "Unidad 7: At the Table",
    paginas: "Págs. 90-97",
    horas: [
      { hora: 1, leccion: "Countable & Uncountable Nouns", enfoque: "Sustantivos elementales junto con cuantificadores (some, any).", videoId: "Ob4WzZ9l0yN", track: "[Grammar] Cuantificadores Básicos" },
      { hora: 2, leccion: "Listening: Slow Café Simulation", enfoque: "Deducir ingredientes específicos solicitados por un comensal.", videoId: "Ob4WzZ9l0yN", track: "[Listening] Simulación Cafetería" },
      { hora: 3, leccion: "Reading: Elementary Kitchen Recipes", enfoque: "Interpretar recetas de cocina, menús y listas de compras.", videoId: "Ob4WzZ9l0yN", track: "[Reading] Listas de Compra" },
      { hora: 4, leccion: "Speaking IA: Interactive Grocery Call", enfoque: "Simular una llamada de pedido de víveres indicando qué comprar.", videoId: "Ob4WzZ9l0yN", track: "[Speaking IA] Pedido de Víveres" }
    ],
    kpi: "🏆 Evidencia: Menú nutricional semanal detallado en inglés."
  },
  {
    semana: 14,
    fechas: "08 Dic - 12 Dic",
    eje_tematico: "Habilidades Cotidianas, Talentos y Capacidades",
    unidad_libro: "Unidad 7: Can & Can't",
    paginas: "Págs. 98-103",
    horas: [
      { hora: 1, leccion: "Modal Verb: Can / Cannot", enfoque: "Uso sintáctico para habilidades físicas y cognitivas básicas.", videoId: "u9fuPGgvLB8", track: "[Grammar] [Structure]" },
      { hora: 2, leccion: "Adverbs of Manner: Well, Quickly, Badly", enfoque: "Modificación de verbos de acción según desempeño.", videoId: "I2SaZnEjmZw", track: "[Grammar] [Vocabulary]" },
      { hora: 3, leccion: "Listening: Talent Scouting", enfoque: "Mapear capacidades de perfiles de candidatos en audio.", videoId: "fbVEFymdUtk", track: "[Listening]" },
      { hora: 4, leccion: "Speaking: Skill Tree Auditing", enfoque: "Declarar a la IA un listado de talentos con justificación técnica.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Matriz de competencias operativas redactada en inglés."
  },
  {
    semana: 15,
    fechas: "15 Dic - 19 Dic",
    eje_tematico: "Estaciones del Año, Ropa y Clima Diario",
    unidad_libro: "Unidad 8: Seasons & Weather",
    paginas: "Págs. 104-111",
    horas: [
      { hora: 1, leccion: "Present Continuous for Weather State", enfoque: "Estructuras temporales activas (It is raining/snowing).", videoId: "u9fuPGgvLB8", track: "[Grammar] Temporalidades" },
      { hora: 2, leccion: "Clothing Vocabulary & Matching", enfoque: "Vocabulario de prendas de vestir acopladas a la estación.", videoId: "I2SaZnEjmZw", track: "[Vocabulary]" },
      { hora: 3, leccion: "Reading: Global Forecast Reports", enfoque: "Análisis de reportes meteorológicos internacionales.", videoId: "fbVEFymdUtk", track: "[Reading]" },
      { hora: 4, leccion: "Speaking: What to Wear Briefing", enfoque: "Exposición oral recomendando ropa para un viaje de negocios.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Reporte climático y maleta sugerida por escrito."
  },
  {
    semana: 16,
    fechas: "12 Ene - 16 Ene",
    eje_tematico: "Compras en Tiendas, Precios y Regateo Básico",
    unidad_libro: "Unidad 8: Retail Experience",
    paginas: "Págs. 112-119",
    horas: [
      { hora: 1, leccion: "How Much vs How Many Rules", enfoque: "Preguntas de costo y cuantificación para tangibles/intangibles.", videoId: "I2SaZnEjmZw", track: "[Grammar] Base TOEFL" },
      { hora: 2, leccion: "Numbers & Currencies up to 10,000", enfoque: "Manejo oral y escrito de cifras financieras complejas.", videoId: "u9fuPGgvLB8", track: "[Vocabulary] [Math]" },
      { hora: 3, leccion: "Listening: Checkout Counter Receipts", enfoque: "Auditoría de precios e importes totales en simulaciones.", videoId: "fbVEFymdUtk", track: "[Listening]" },
      { hora: 4, leccion: "Speaking: Dealing with Discounts", enfoque: "Regatear pacíficamente con el vendedor de IA un precio base.", videoId: "o8xOJPKfraU", track: "[Speaking IA]" }
    ],
    kpi: "🏆 Evidencia: Recibo de compra simulado con desglose gramatical explicativo."
  },
  {
    semana: 17,
    fechas: "19 Ene - 23 Ene",
    eje_tematico: "Fórmulas de Cortesía, Permisos y Pedir Favor",
    unidad_libro: "Unidad 9: Courtesy Rules",
    paginas: "Págs. 120-127",
    horas: [
      { hora: 1, leccion: "Imperativos Suaves & Modales Básicos", enfoque: "Estructurar peticiones con marks de cortesía (Please, Can I, Could you).", videoId: "o8xOJPKfraU", track: "[Grammar] Imperativos Suaves" },
      { hora: 2, leccion: "Listening: Formal vs Informal Request", enfoque: "Distinguir la cortesía formal en bibliotecas o cafeterías.", videoId: "o8xOJPKfraU", track: "[Listening] Requerimientos" },
      { hora: 3, leccion: "Reading: Public Signage & Regulations", enfoque: "Analizar carteles informativos y reglas de conducta básicas.", videoId: "o8xOJPKfraU", track: "[Reading] Señalizaciones" },
      { hora: 4, leccion: "Speaking IA: Tone and Request Tuning", enfoque: "Practicar la emisión de oraciones interrogativas con tono afable.", videoId: "o8xOJPKfraU", track: "[Speaking IA] Tono Afable" }
    ],
    kpi: "🏆 Evidencia: Nota formal de solicitud de asistencia doméstica."
  },
  {
    semana: 18,
    fechas: "26 Ene - 30 Ene",
    eje_tematico: "Planificación Vacacional y Deseos para el Verano",
    unidad_libro: "Unidad 9: Summer Forecast",
    paginas: "Págs. 128-135",
    horas: [
      { hora: 1, leccion: "Future Introduction: Want to + Verb", enfoque: "Expresión de deseos y planes iniciales inmediatos.", videoId: "u9fuPGgvLB8", track: "[Grammar] [Structure]" },
      { hora: 2, leccion: "Time Expressions for Future", enfoque: "Uso de Next week, In two months, Tomorrow afternoon.", videoId: "I2SaZnEjmZw", track: "[Vocabulary] [Grammar]" },
      { hora: 3, leccion: "Reading: Travel Agency Brochures", enfoque: "Extracción de itinerarios en ofertas vacacionales.", videoId: "fbVEFymdUtk", track: "[Reading]" },
      { hora: 4, leccion: "Simulacro de Comunicación en Aula", enfoque: "Evaluación integral final del módulo con el examinador IA.", videoId: "fbVEFymdUtk", track: "[Acreditación Final] TOEFL Run" }
    ],
    kpi: "🏆 Evidencia: Ensayo final del plan de vacaciones y liberación de Módulo 1."
  }
];
