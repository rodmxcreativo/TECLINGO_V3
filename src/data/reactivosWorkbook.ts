export interface Reactivo {
  id: string;
  tipo: 'inputs-dobles' | 'glosario' | 'dialogo' | 'error-check' | 'textarea';
  titulo: string;
  instruccion: string;
  config: {
    labelA?: string;
    labelB?: string;
    placeholder?: string;
    placeholderA?: string;
    placeholderB?: string;
    promptIA1?: string;
    promptIA2?: string;
    actorA?: string;
    actorB?: string;
    label1?: string;
    label2?: string;
    label3?: string;
    label4?: string;
    errorKeywords?: string[];
    correctKeywords?: string[];
    correctMessage?: string;
    errorMessage?: string;
  };
}

export const reactivosPorSemana: Record<number, Reactivo[]> = {
  1: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • PRESENTACIONES BÁSICAS',
      instruccion: 'Completa tu perfil personal con tu nombre y ocupación usando el verbo To Be:',
      config: { 
        labelA: 'What is your full name? (I am...)', 
        labelB: 'What do you do? (I am a...)',
        placeholderA: 'e.g. I am Carlos Ortega...',
        placeholderB: 'e.g. I am a software engineer...'
      }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • GLOSARIO DE BIENVENIDA',
      instruccion: 'Identifica tres pronombres personales sujeto básicos y regístralos a continuación:',
      config: { placeholder: 'Pronombre' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • DIÁLOGO DE CORTESÍA BÁSICA',
      instruccion: 'Ingresa tus líneas para completar una conversación de bienvenida adaptada al salón de clases:',
      config: {
        label1: '01. Tú (Saludo inicial):',
        label2: '02. Tutor IA (Respuesta cordial):',
        label3: '03. Tú (Pregunta sobre bienestar):',
        label4: '04. Tutor IA (Agradecimiento final):',
        promptIA1: 'Hello! Welcome to TecLingo. It is a pleasure to meet you.',
        promptIA2: 'I am doing wonderful, thank you for asking! Enjoy your lesson today.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • VALIDACIÓN DE CONTRACCIÓN',
      instruccion: 'Describe de dónde eres usando una contracción del verbo "to be" (e.g. I\'m from...). El tutor validará la ortografía.',
      config: { 
        placeholder: 'e.g. I\'m from Mexico...',
        correctKeywords: ["i'm", "im", "i am"],
        errorMessage: "🤖 ¡Alerta! No olvides indicar el sujeto gramatical obligatorio 'I' junto con el verbo 'am' (o su contracción 'I'm')."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • PÁRRAFO DE METAS ACADÉMICAS',
      instruccion: 'Redacta un texto breve detallando por qué quieres dominar el idioma inglés este ciclo:',
      config: { placeholder: 'I want to learn English because...' }
    }
  ],
  2: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • ARTÍCULOS DEFINIDOS E INDEFINIDOS',
      instruccion: 'Coloca el artículo correcto para una manzana ("apple") y un libro ("book"):',
      config: { labelA: 'Apple article:', labelB: 'Book article:', placeholderA: 'e.g. An apple', placeholderB: 'e.g. A book' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • OBJETOS DEL AULA',
      instruccion: 'Transcribe tres objetos comunes que utilices sobre tu escritorio de control:',
      config: { placeholder: 'Objeto' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • SOLICITUD DE MATERIAL ESCOLAR',
      instruccion: 'Simula pedir prestado un borrador o libreta en el salón:',
      config: {
        label1: '01. Tú (Pedir objeto):',
        label2: '02. Tutor IA (Prestar objeto):',
        label3: '03. Tú (Agradecer):',
        label4: '04. Tutor IA (Cierre):',
        promptIA1: 'Sure! Here is the pen you requested. Do you need anything else?',
        promptIA2: 'You are very welcome. Have a productive class.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • DEMOSTRATIVOS DE CERCANÍA',
      instruccion: 'Usa "This" o "These" para hablar de plumas ("pens") que tienes en tu mano:',
      config: { 
        placeholder: 'e.g. These are my pens...',
        correctKeywords: ['these'],
        errorMessage: "🤖 Tip TOEFL: Al usar el sustantivo plural 'pens', debes utilizar el demostrativo plural 'These'."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • REPORTE DE INVENTARIO DIGITAL',
      instruccion: 'Redacta una descripción espacial breve de tu oficina, indicando por lo menos 3 herramientas físicas:',
      config: { placeholder: 'On my desk, there is a computer, a notebook...' }
    }
  ],
  3: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • ADJETIVOS POSESIVOS',
      instruccion: 'Completa usando "His" para él y "Her" para ella:',
      config: { labelA: 'John and ___ sister', labelB: 'Mary and ___ brother', placeholderA: 'his', placeholderB: 'her' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • MIEMBROS DEL NÚCLEO FAMILIAR',
      instruccion: 'Busca y transcribe tres sustantivos del árbol genealógico en tu glosario de soporte:',
      config: { placeholder: 'Miembro' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • PRESENTACIÓN FAMILIAR',
      instruccion: 'Sostén un diálogo describiendo a tus parientes cercanos:',
      config: {
        label1: '01. Tú (Pregunta sobre familia):',
        label2: '02. Tutor IA (Respuesta familiar):',
        label3: '03. Tú (Describir a mamá o papá):',
        label4: '04. Tutor IA (Comentario amable):',
        promptIA1: 'My family lives in Monterrey. What about your family?',
        promptIA2: 'That sounds like a warm and supportive family context!'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • EL CASO GENITIVO (\'s)',
      instruccion: 'Traduce correctamente "El auto de mi hermano" usando el apóstrofe de posesión:',
      config: { 
        placeholder: 'e.g. My brother\'s car...',
        correctKeywords: ["brother's"],
        errorMessage: "🤖 ¡Alerta! Recuerda estructurar [Poseedor] + 's + [Objeto] para evitar la traducción literal redundante 'of my'."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • PERFIL FAMILIAR AMPLIO',
      instruccion: 'Redacta un párrafo corto presentando a tres integrantes de tu familia con sus profesiones y edades:',
      config: { placeholder: 'This is my mother, she is a teacher...' }
    }
  ],
  4: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • ORIGEN GEOGRÁFICO y PREPOSICIONES',
      instruccion: 'Completa con la preposición de origen ("from") y localización activa ("in"):',
      config: { labelA: 'I am ___ Mexico.', labelB: 'I live ___ Monterrey.', placeholderA: 'from', placeholderB: 'in' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • IDIOMAS Y LENGUAS',
      instruccion: 'Escribe tres idiomas del mundo respetando el uso estricto de mayúsculas:',
      config: { placeholder: 'e.g. French, Japanese, Italian' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • DIÁLOGO EN ADUANA/MIGRACIÓN',
      instruccion: 'Simula el diálogo interactivo con el oficial de protección fronteriza:',
      config: {
        label1: '01. Tú (Saludo y entrega de pasaporte):',
        label2: '02. Tutor IA (Pregunta sobre origen):',
        label3: '03. Tú (Confirmar nacionalidad):',
        label4: '04. Tutor IA (Autorización de entrada):',
        promptIA1: 'Welcome. What is your country of origin and citizenship?',
        promptIA2: 'Perfect. Your passport is stamped. Have a wonderful stay!'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • MAYÚSCULAS DE NACIONALIDAD',
      instruccion: 'Escribe "I speak Spanish and English" respetando estrictamente las reglas de capitalización de idiomas:',
      config: { 
        placeholder: 'e.g. I speak Spanish and English...',
        correctKeywords: ['Spanish', 'English'],
        errorMessage: "🤖 Regla Crítica TOEFL: En inglés, los idiomas (Spanish, English) y los gentilicios siempre llevan mayúscula inicial."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • RESEÑA TURÍSTICA BREVE',
      instruccion: 'Escribe sobre algún país que te gustaría visitar y por qué:',
      config: { placeholder: 'I would like to visit Canada because...' }
    }
  ],
  5: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • GUSTOS Y ESTRUCTRA DE GERUNDIO (-ing)',
      instruccion: 'Completa tus pasatiempos predilectos usando la terminación -ing en los verbos de ocio:',
      config: { 
        labelA: 'What do you love doing on rainy days?', 
        labelB: 'Name an activity you do not enjoy doing:',
        placeholderA: 'e.g. I love reading books at home...',
        placeholderB: 'e.g. I do not enjoy studying grammar exercises...'
      }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • GLOSARIO DE APOYO RÁPIDO',
      instruccion: 'Busca tres verbos de acción relacionados con actividades físicas en tu glosario de soporte y transcríbelos:',
      config: { placeholder: 'Verbo de ocio (e.g. Run)' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • DIÁLOGO CASUAL CON EL TUTOR IA',
      instruccion: 'Genera tu diálogo interactivo simulando una conversación sobre tus pasatiempos:',
      config: {
        label1: '01. Tú (Pregunta inicial):',
        label2: '02. Tutor IA (Respuesta de ocio):',
        label3: '03. Tú (Seguimiento de diálogo):',
        label4: '04. Tutor IA (Cierre afable):',
        promptIA1: 'I enjoy reading data architectures and learning languages. What about you?',
        promptIA2: 'That sounds incredible! Balancing work with hobbies is great.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • DETECCIÓN DE ERRORES CRÍTICOS',
      instruccion: 'Escribe un enunciado usando la frase "I enjoy" + tu pasatiempo favorito. El asesor revisará que no añadas un infinitivo con "to" (redundante).',
      config: { 
        placeholder: 'I enjoy...',
        correctKeywords: ['enjoy'],
        errorKeywords: ['enjoy to'],
        errorMessage: "🤖 ¡Alerta de error! El verbo 'enjoy' requiere gerundio directo (e.g. 'I enjoy reading'), elimina el 'to'."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • CONSOLIDACIÓN: PÁRRAFO COMPUESTO',
      instruccion: 'Redacta un párrafo breve (mínimo 2 ideas) donde resumas por qué es importante balancear el estudio con el ocio:',
      config: { placeholder: 'In my free time, reading helps me disconnect...' }
    }
  ],
  6: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • ORDEN DE LOS ADJETIVOS',
      instruccion: 'Une correctamente los adjetivos de tamaño y de color para describir ojos y cabello:',
      config: { labelA: 'Describe she has (big / blue) eyes:', labelB: 'Describe he has (short / dark) hair:', placeholderA: 'big blue eyes', placeholderB: 'short dark hair' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • GLOSARIO DE ADJETIVOS DE ASPECTO',
      instruccion: 'Anota tres adjetivos útiles para describir la fisionomía humana:',
      config: { placeholder: 'Adjetivo' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • INTERCAMBIO CON EL RETRATISTA',
      instruccion: 'Sigue la conversación describiendo las facciones de un familiar ficticio:',
      config: {
        label1: '01. Tú (Intro de aspecto):',
        label2: '02. Tutor IA (Pregunta sobre cabello):',
        label3: '03. Tú (Respuesta amplia):',
        label4: '04. Tutor IA (Cierre del perfil):',
        promptIA1: 'Does your person have straight dark hair or curly blonde hair?',
        promptIA2: 'Perfect, that is highly descriptive for the avatar builder!'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • ADJETIVOS ANTES DEL SUSTANTIVO',
      instruccion: 'Escribe "Ella tiene una playera roja" cuidando no cambiar el orden del adjetivo en inglés:',
      config: { 
        placeholder: 'e.g. She has a red shirt...',
        correctKeywords: ['red shirt'],
        errorMessage: "🤖 ¡Alerta! Recuerda colocar el adjetivo de color ('red') inmediatamente ANTES del sustantivo ('shirt')."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • RETRATO ESCRITO INTEGRAL',
      instruccion: 'Describe físicamente a tu deportista o celebridad favorita usando al menos cuatro adjetivos:',
      config: { placeholder: 'My favorite athlete is tall, fast, and has curly hair...' }
    }
  ],
  7: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • CONJUGACIÓN MATUTINA',
      instruccion: 'Escribe tus primeras acciones al despertar conjugadas en primera persona singular ("I"):',
      config: { labelA: 'I ___ up at 6 AM.', labelB: 'I ___ a shower.', placeholderA: 'wake', placeholderB: 'take' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • GLOSARIO DE ACCIONES MATUTINAS',
      instruccion: 'Ubica tres verbos de rutina diaria indispensables en la mañana:',
      config: { placeholder: 'Acción' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • DIÁLOGO DE AGENDA TEMPRANA',
      instruccion: 'Platica con la IA sobre tus planes de inicio de jornada:',
      config: {
        label1: '01. Tú (Saludo y hora de despertar):',
        label2: '02. Tutor IA (Preguntar si tomas café/té):',
        label3: '03. Tú (Especificar desayuno):',
        label4: '04. Tutor IA (Deseo de buen día):',
        promptIA1: 'Do you usually have coffee or tea with your morning breakfast?',
        promptIA2: 'Sounds like an energetic start! Let us tackle today\'s goals.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • PREPOSICIÓN DE TIEMPO EXACTA',
      instruccion: 'Escribe "Me despierto a las 7 AM" usando la preposición de tiempo precisa para horas exactas:',
      config: { 
        placeholder: 'I wake up at...',
        correctKeywords: ['at 7'],
        errorMessage: "🤖 Tip Académico: Para horas específicas del día, siempre debes emplear la preposición 'at'."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • MI MAÑANA IDEAL',
      instruccion: 'Redacta un texto fluido sobre cómo sería tu mañana perfecta de fin de semana para relajarte:',
      config: { placeholder: 'On Sunday mornings, I sleep in and make pancakes...' }
    }
  ],
  8: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • TERCERA PERSONA (-s/-es)',
      instruccion: 'Escribe el verbo correcto para la rutina de él o ella (He/She):',
      config: { labelA: 'He (work) ___ here.', labelB: 'She (watch) ___ reports.', placeholderA: 'works', placeholderB: 'watches' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • ADVERBIOS DE FRECUENCIA',
      instruccion: 'Anota tres adverbios de frecuencia típicos del ámbito laboral:',
      config: { placeholder: 'e.g. Always, Usually, Often' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • REPORTE DE ACTIVIDADES LABORALES',
      instruccion: 'Intercambia líneas sobre las tareas que realizas por la tarde:',
      config: {
        label1: '01. Tú (Indicar tarea habitual):',
        label2: '02. Tutor IA (Preguntar por frecuencia):',
        label3: '03. Tú (Responder con adverbio):',
        label4: '04. Tutor IA (Validación ejecutiva):',
        promptIA1: 'How often do you check and send corporate emails?',
        promptIA2: 'Excellent. Keep in mind that adverbs belong before the main verb.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • ORDEN DEL ADVERBIO DE FRECUENCIA',
      instruccion: 'Escribe "Yo siempre llego a tiempo" posicionando "always" correctamente antes del verbo principal:',
      config: { 
        placeholder: 'e.g. I always arrive on time...',
        correctKeywords: ['always arrive'],
        errorMessage: "🤖 Alerta TOEFL: Los adverbios de frecuencia siempre se colocan ANTES del verbo activo (excepto con el verbo Be)."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • LA JORNADA DE UN FAMILIAR',
      instruccion: 'Describe la rutina laboral de un amigo o familiar en un párrafo breve usando verbos en tercera persona:',
      config: { placeholder: 'My sister works in a bank. She starts at 9 AM and finishes...' }
    }
  ],
  9: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • PREGUNTAS CON AUXILIAR',
      instruccion: 'Completa las preguntas para comprobar hábitos de descanso nocturno con "Do" o "Does":',
      config: { labelA: '___ you study at night?', labelB: '___ she read before bed?', placeholderA: 'Do', placeholderB: 'Does' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • BIENESTAR Y DESCANSO',
      instruccion: 'Identifica tres verbos asociados a la relajación diaria del glosario:',
      config: { placeholder: 'Verbo de bienestar' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • DIÁLOGO DE CONTROL DE TRABAJO',
      instruccion: 'Conversa sobre el cierre de tus actividades diarias:',
      config: {
        label1: '01. Tú (Hora de dormir):',
        label2: '02. Tutor IA (Pregunta por pantallas):',
        label3: '03. Tú (Respuesta honesta):',
        label4: '04. Tutor IA (Recomendación):',
        promptIA1: 'Do you study on your screens right before sleeping?',
        promptIA2: 'Fascinating. Blue light is known to delay sleep cycle recovery.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • NEGACIÓN EN PRESENTE',
      instruccion: 'Escribe "Él no duerme tarde" usando el auxiliar de negación correcto "doesn\'t":',
      config: { 
        placeholder: 'He doesn\'t...',
        correctKeywords: ["doesn't", "does not"],
        errorMessage: "🤖 Atención: Para 'He, She, It' en enunciados negativos, usa el auxiliar 'doesn't' seguido del verbo base sin 's'."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • MI RITUAL DE DESCONEXIÓN',
      instruccion: 'Redacta cuáles son tus actividades básicas para relajarte después de un día estresante:',
      config: { placeholder: 'To relax at night, I listen to chill music...' }
    }
  ],
  10: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • EXISTENCIA (There is / There are)',
      instruccion: 'Coloca la estructura adecuada según sea objeto singular o sustantivo plural:',
      config: { labelA: '___ a couch in the living room.', labelB: '___ three chairs in the kitchen.', placeholderA: 'There is', placeholderB: 'There are' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • HABITACIONES DE LA VIVIENDA',
      instruccion: 'Enumera tres partes diferentes de una casa del glosario de soporte:',
      config: { placeholder: 'Cuarto de casa' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • TOUR VIRTUAL DE MI HOGAR',
      instruccion: 'Platica con el asesor simulando dar indicaciones de la distribución espacial:',
      config: {
        label1: '01. Tú (Presentación de casa):',
        label2: '02. Tutor IA (Preguntar por jardín o cochera):',
        label3: '03. Tú (Responder):',
        label4: '04. Tutor IA (Valoración formal):',
        promptIA1: 'Is there a garden or backyard on the premises?',
        promptIA2: 'Understood. A well-organized environment matches a clear learning space.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • PREPOSICIÓN DE UBICACIÓN',
      instruccion: 'Escribe "Las llaves están sobre la mesa" usando "on" para denotar superficie:',
      config: { 
        placeholder: 'e.g. The keys are on the table...',
        correctKeywords: ['on the table'],
        errorMessage: "🤖 Consejo de Gramática: Usa 'on' para cosas apoyadas sobre superficies, e 'in' para contenedores cerrados."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • DESCRIPCIÓN DE INTERIORISMO',
      instruccion: 'Describe a detalle el mobiliario del cuarto en el cual estudias habitualmente:',
      config: { placeholder: 'In my study room, there is a big desk and an ergonomic chair...' }
    }
  ],
  11: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • COLOCACIONES CON LOGÍSTICA URBANA',
      instruccion: 'Completa con los verbos correctos ("take" para metro/bus y "drive" para coche personal):',
      config: { 
        labelA: 'I usually ___ the subway to work.', 
        labelB: 'I occasionally ___ my car to school.',
        placeholderA: 'e.g. take',
        placeholderB: 'e.g. drive'
      }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • GLOSARIO DE MOVILIDAD URBANA',
      instruccion: 'Busca y anota tres palabras clave del glosario ligadas a medios de transporte público:',
      config: { placeholder: 'e.g. Subway, Bus, Taxi' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • SOLICITUD DE INDICACIONES VIALES',
      instruccion: 'Construye un mini-diálogo simulando pedir ayuda para llegar a TecLingo:',
      config: {
        label1: '01. Tú (Preguntar dirección):',
        label2: '02. Tutor IA (Explicar trayecto corto):',
        label3: '03. Tú (Preguntar por transporte):',
        label4: '04. Tutor IA (Sugerir metro o bus):',
        promptIA1: 'You should walk block-by-block and then go left at the corner.',
        promptIA2: 'Taking the subway is much faster and bypasses gridlock traffic.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • PREPOSICIÓN DE MOVIMIENTO',
      instruccion: 'Escribe "Winston camina a través del parque" usando de manera correcta la preposición de movimiento "through":',
      config: { 
        placeholder: 'Winston walks through...',
        correctKeywords: ['through the park'],
        errorMessage: "🤖 ¡Alerta! Recuerda que 'through' se utiliza cuando se cruza un espacio tridimensional o delimitado como parques o bosques."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • TRASLADOS COLECTIVOS',
      instruccion: 'Redacta brevemente cuál es tu método diario favorito de traslado y justifica las ventajas ecológicas o de tiempo:',
      config: { placeholder: 'I prefer riding my bicycle because it keeps me active and protects the clean air...' }
    }
  ],
  12: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • EXPRESIÓN DE FRECUENCIA TEMPORAL',
      instruccion: 'Completa con "Once" (una vez) o "Twice" (dos veces):',
      config: { labelA: 'I take English classes ___ a week (1x/week).', labelB: 'I practice listening ___ a day (2x/day).', placeholderA: 'once', placeholderB: 'twice' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • EXPRESIONES CRONOLÓGICAS',
      instruccion: 'Indica tres palabras correspondientes al tiempo o calendario en el glosario:',
      config: { placeholder: 'e.g. Week, Month, Calendar' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • DIÁLOGO DE HÁBITOS SALUDABLES',
      instruccion: 'Platica con el tutor IA sobre tus frecuencias de estudio extraescolar:',
      config: {
        label1: '01. Tú (Frecuencia de práctica):',
        label2: '02. Tutor IA (Sugerencia de constancia):',
        label3: '03. Tú (Compromiso semanal):',
        label4: '04. Tutor IA (Mensaje motivacional):',
        promptIA1: 'Consistency is essential in language acquisition. Do you review every day?',
        promptIA2: 'That sounds perfect. Small daily efforts yield major results!'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • ADVERBIO DE RAREZA',
      instruccion: 'Escribe "Yo casi nunca veo televisión" colocando "hardly ever" antes del verbo:',
      config: { 
        placeholder: 'e.g. I hardly ever watch TV...',
        correctKeywords: ['hardly ever watch'],
        errorMessage: "🤖 Ayuda Didáctica: Coloca 'hardly ever' (casi nunca) justo antes de la acción activa (watch)."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • AGENDA DE EQUILIBRIO DE VIDA',
      instruccion: 'Detalla cómo balanceas tu carga académica con pasatiempos recreativos cada semana:',
      config: { placeholder: 'Once a week, I organize my schedules to save hours for reading...' }
    }
  ],
  13: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • CONTABLES E INCONTABLES',
      instruccion: 'Elige si usar "Some" para afirmación o "Any" para interrogación/negación en la despensa:',
      config: { labelA: 'Do you have ___ milk?', labelB: 'I have ___ apples.', placeholderA: 'any', placeholderB: 'some' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • ALIMENTACIÓN CONTEXTUAL',
      instruccion: 'Rescata tres ingredientes o platillos nutritivos del glosario de soporte:',
      config: { placeholder: 'Alimento' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • SIMULACIÓN EN LA CAFETERÍA',
      instruccion: 'Ordena tu desayuno del día con el tutor IA en el comedor universitario:',
      config: {
        label1: '01. Tú (Ordenar café/té):',
        label2: '02. Tutor IA (Sugerir emparedado):',
        label3: '03. Tú (Aceptar y pedir la cuenta):',
        label4: '04. Tutor IA (Mencionar costo sim):',
        promptIA1: 'Would you like to add an organic chicken sandwich to your order?',
        promptIA2: 'Your order is processed. That will be five dollars, please.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • SUSTANTIVOS NO CONTABLES',
      instruccion: 'Escribe la pregunta "Do you have any sugar?" recordando que "sugar" no se pluraliza en inglés:',
      config: { 
        placeholder: 'e.g. Do you have any sugar?...',
        correctKeywords: ['any sugar'],
        errorKeywords: ['sugars'],
        errorMessage: "🤖 Tip TOEFL: Sustantivos volumétricos o líquidos como sugar, water y coffee no llevan plural con 's' en contextos generales."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • MI MENÚ IDEAL ESCOLAR',
      instruccion: 'Propón los alimentos correspondientes para tener una dieta balanceada en el aula de TecLingo:',
      config: { placeholder: 'For breakfast, I eat some fruit with cereal and drink orange juice...' }
    }
  ],
  14: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • PODER E INCAPACIDAD (Can / Can\'t)',
      instruccion: 'Completa sobre tus talentos técnicos ("can" para sí y "can\'t" para no):',
      config: { labelA: 'I ___ code in React (Talento).', labelB: 'I ___ fly a real airplane (Incapacidad).', placeholderA: 'can', placeholderB: "can't" }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • HABILIDADES MANUALES/COGNITIVAS',
      instruccion: 'Destaca tres verbos de talento o capacidades del glosario de apoyo:',
      config: { placeholder: 'Verbo de talento' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • RECLUTAMIENTO DE HABILIDADES',
      instruccion: 'Muestra tus mejores capacidades cognitivas al reclutador inteligente de TecLingo:',
      config: {
        label1: '01. Tú (Habilidad destacada):',
        label2: '02. Tutor IA (Preguntar si hablas idiomas):',
        label3: '03. Tú (Detallar niveles):',
        label4: '04. Tutor IA (Aprobación ejecutiva):',
        promptIA1: 'Impressive! Can you also speak or write French and German?',
        promptIA2: 'Excellent. Multi-skilled profiles are highly sought after'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • ADVERBIO DE MODO',
      instruccion: 'Escribe "Ella programa muy bien" traduciendo "bien" como el adverbio de modo "well":',
      config: { 
        placeholder: 'She programs very...',
        correctKeywords: ['very well'],
        errorKeywords: ['very good'],
        errorMessage: "🤖 ¡Cuidado! Recuerda modificar el verbo utilizando el adverbio de modo 'well', no uses el adjetivo 'good' para describir una acción."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • MISIÓN DE TALENTOS',
      instruccion: 'Describe a detalle tres de tus habilidades profesionales más fuertes en inglés:',
      config: { placeholder: 'I can develop web apps, I can design beautiful logos, and I can...' }
    }
  ],
  15: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • CLIMA ACTUAL (Present Continuous)',
      instruccion: 'Completa describiendo el clima activo usando el participio en "-ing":',
      config: { labelA: 'It is (rain) ___ outside.', labelB: 'It is (snow) ___ on the mountain.', placeholderA: 'raining', placeholderB: 'snowing' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • PRENDAS DE VESTIR TEMPORALES',
      instruccion: 'Mapea tres palabras de ropa ideales para climas helados del glosario:',
      config: { placeholder: 'e.g. Coat, Scarf, Gloves' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • PREPARACIONES PARA VIAJE DE NEGOCIO',
      instruccion: 'Detalla cómo empacar de acuerdo al clima reportado en el destino turísto:',
      config: {
        label1: '01. Tú (Preguntar por clima):',
        label2: '02. Tutor IA (Reportar clima frío):',
        label3: '03. Tú (Confirmar equipaje pesado):',
        label4: '04. Tutor IA (Deseo de excelente viaje):',
        promptIA1: 'It is currently freezing cold and snowing in Chicago.',
        promptIA2: 'Don\'t forget a thick coat and boots. Safe travels!'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • GERUNDIO CLIMÁTICO',
      instruccion: 'Escribe "Está lloviendo hoy" usando correctamente la gramática "It is raining today":',
      config: { 
        placeholder: 'e.g. It is raining today...',
        correctKeywords: ['It is raining', 'it is raining'],
        errorMessage: "🤖 Atención Sintáctica: En inglés el clima siempre requiere el sujeto impersonal 'It' seguido de 'is' + gerundio."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • MI CLIMA PREFERIDO',
      instruccion: 'Explica qué estación del año prefieres y describe cómo vistes habitualmente para salir:',
      config: { placeholder: 'I love Autumn because the days are cozy. I always wear sweaters...' }
    }
  ],
  16: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • CUANTIFICADORES (Much vs. Many)',
      instruccion: 'Completa de acuerdo al sustantivo contable o incontable en cuestión:',
      config: { labelA: 'How ___ does this cost? (Incontable)', labelB: 'How ___ books do you need? (Contable)', placeholderA: 'much', placeholderB: 'many' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • MONEDAS Y COMPRAS',
      instruccion: 'Describe tres términos transaccionales o de divisa que encuentres en tu libro:',
      config: { placeholder: 'e.g. Dollar, Price, Disount' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • NEGOCIACIÓN DE DESCUENTO ADUANERO',
      instruccion: 'Interactúa con el dependiente inteligente de la tienda para pedir rebajas:',
      config: {
        label1: '01. Tú (Preguntar costo):',
        label2: '02. Tutor IA (Mencionar costo fijo):',
        label3: '03. Tú (Proponer oferta menor):',
        label4: '04. Tutor IA (Cierre de trato de descuento):',
        promptIA1: 'This elegant laptop backpack is priced at eighty dollars.',
        promptIA2: 'I can offer a special ten-percent discount for student members.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • MONTO CRÍTICO EN NÚMERO',
      instruccion: 'Escribe el número "un millón" en inglés conservando la ortografía correcta "one million":',
      config: { 
        placeholder: 'e.g. One million...',
        correctKeywords: ['million', 'one million'],
        errorMessage: "🤖 Tip TOEFL: Asegúrate de deletrear 'million' sin 's' final en números fijos descriptivos."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • RESUMEN DE PRESUPUESTO ESCOLAR',
      instruccion: 'Elabora un texto sencillo explicando tus compras escolares habituales de insumos de papelería:',
      config: { placeholder: 'Every semester, I buy many notebooks and pencils. They cost around fifty dollars...' }
    }
  ],
  17: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • CORTESÍA INTERROGATIVA',
      instruccion: 'Completa las peticiones suaves usando los modales "Could" y "Can":',
      config: { labelA: '___ you please open the door?', labelB: '___ I ask you a quick question?', placeholderA: 'Could', placeholderB: 'Can' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • VERBOS DE PETICIÓN SUAVE',
      instruccion: 'Anota tres verbos comúnmente conjugados al pedir favores:',
      config: { placeholder: 'e.g. Please, Could, Would' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • INTERMEDIACIÓN DE ASISTENCIA',
      instruccion: 'Construye un mini-diálogo pidiendo auxilio de forma académica en oficinas:',
      config: {
        label1: '01. Tú (Saludo y solicitud formal):',
        label2: '02. Tutor IA (Preguntar por detalle de ayuda):',
        label3: '03. Tú (Especificar aclaración de tarea):',
        label4: '04. Tutor IA (Resolver con agrado):',
        promptIA1: 'Of course! What specific assignment or grammar page is confusing?',
        promptIA2: 'Perfect. Let me display the workbook schemas to clear all doubts.'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • IMPERATIVOS CORTESES',
      instruccion: 'Escribe la frase "Por favor, ayúdame" asegurando adjuntar la palabra clave "please" de cortesía:',
      config: { 
        placeholder: 'e.g. Please, help me...',
        correctKeywords: ['please', 'Please'],
        errorMessage: "🤖 Atención Escolar: En el estándar de cortesía internacional formal, 'Please' es obligatorio antes de emitir mandatos directos."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • BORRADOR DE CORREO SOLICITUD',
      instruccion: 'Redacta un mensaje formal dirigido a la secretaría pidiendo la expedición de tu constancia académica:',
      config: { placeholder: 'Dear coordinator, could you please send me my module 1 certification certificate?...' }
    }
  ],
  18: [
    {
      id: 'r1',
      tipo: 'inputs-dobles',
      titulo: 'REACTIVO 01 • DECLARACIÓN DE DESEOS VACACIONALES',
      instruccion: 'Completa usando la estructura de intención futura ("want to" + verbo):',
      config: { labelA: 'I ___ visit the sandy beaches.', labelB: 'I ___ explore European cities.', placeholderA: 'want to', placeholderB: 'want to' }
    },
    {
      id: 'r2',
      tipo: 'glosario',
      titulo: 'REACTIVO 02 • CALENDARIOS DE DESCANSO',
      instruccion: 'Selecciona tres verbos relativos a las vacaciones de verano del glosario:',
      config: { placeholder: 'e.g. Travel, Visit, Relax' }
    },
    {
      id: 'r3',
      tipo: 'dialogo',
      titulo: 'REACTIVO 03 • DIÁLOGO DE CLAUSURA DE CURSO',
      instruccion: 'Conversa en este hito evaluativo final sobre tu madurez y tus proyectos futuros:',
      config: {
        label1: '01. Tú (Compartir hito cumplido):',
        label2: '02. Tutor IA (Felicitación sincera):',
        label3: '03. Tú (Exponer metas de verano):',
        label4: '04. Tutor IA (Asignar acreditación final):',
        promptIA1: 'Congratulations on finishing the full Module 1 curriculum! How will you practice this summer?',
        promptIA2: 'Incredible initiative. Your level zero placement is officially certified active. Keep learning!'
      }
    },
    {
      id: 'r4',
      tipo: 'error-check',
      titulo: 'REACTIVO 04 • EXPRESIÓN DE FUTURO',
      instruccion: 'Escribe "Viajaré el próximo mes" usando la conjugación "next month":',
      config: { 
        placeholder: 'I will travel next...',
        correctKeywords: ['next month'],
        errorMessage: "🤖 Tip TOEFL: Emplea 'next month' o 'next year' para delimitar cronologías futuras sin preposiciones redundantes."
      }
    },
    {
      id: 'r5',
      tipo: 'textarea',
      titulo: 'REACTIVO 05 • DISCURSO DE ACCIÓN DE GRACIAS',
      instruccion: 'Sintetiza tu aprendizaje y agradece de manera descriptiva al docente por este módulo escolar:',
      config: { placeholder: 'Thank you teacher for this beautiful semester. I learned a lot because...' }
    }
  ]
};
