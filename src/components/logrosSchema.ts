/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Logro {
  id: string;
  idAlumno: string;
  nombreAlumno?: string;
  titulo: string;
  subtitulo: string;
  metrica: string;
  categoria: 'Academico' | 'Constancia' | 'Ecologico';
  icon: string;
  color: string;
  puntos: number;
  fechaAsignado: string;
  evidenciaDocente?: string;
  mentor?: string;
}

// Catálogo maestro de medallas disponibles para el docente
export const CATALOGO_LOGROS = [
  { 
    titulo: "The Bridge: Elite Pronunciation", 
    metrica: "Nivel 10", 
    icon: "🎙️", 
    color: "from-amber-500 to-orange-600", 
    puntos: 12, 
    sub: "98% precisión vocal", 
    categoria: 'Academico' as const 
  },
  { 
    titulo: "Streak: Burning Flame", 
    metrica: "Legendario", 
    icon: "🔥", 
    color: "from-red-500 to-pink-600", 
    puntos: 12, 
    sub: "Interacción consecutiva IA", 
    categoria: 'Constancia' as const 
  },
  { 
    titulo: "Zero Paper Master", 
    metrica: "-92% Papel", 
    icon: "🌱", 
    color: "from-emerald-500 to-teal-600", 
    puntos: 12, 
    sub: "Reducción de huella de carbono", 
    categoria: 'Ecologico' as const 
  },
  { 
    titulo: "Grammar Fixer Expert", 
    metrica: "Silver Med", 
    icon: "✍️", 
    color: "from-blue-500 to-indigo-600", 
    puntos: 12, 
    sub: "100 correcciones aplicadas", 
    categoria: 'Academico' as const 
  }
];
