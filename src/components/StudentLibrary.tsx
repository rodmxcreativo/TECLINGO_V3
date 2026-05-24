/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../context/AppContext';
import { collection, getDocs } from 'firebase/firestore';
import { 
  BookOpen, 
  Search, 
  Award, 
  ChevronRight, 
  Download, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  X, 
  Lock, 
  ShieldCheck, 
  Binary, 
  ArrowLeft,
  Sparkles,
  Zap,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { LibroVirtualAlumnoCompleto } from './LibroVirtualAlumnoCompleto';

interface Chapter {
  id: string;
  unit: string;
  title: string;
  grammarTopic: string;
  grammarExplanation: string;
  technicalVocab: { term: string; definition: string; icon: any }[];
  challengeId: string;
  challengeTitle: string;
  challengeTask: string;
  challengeCode: string;
}

const LEVEL_BOOKS: Record<number, { title: string; subtitle: string; description: string; chapters: Chapter[] }> = {
  1: {
    title: "Módulo 1: Identificación de Datos Clave (A1.1)",
    subtitle: "Focus TOEFL iBT: Data & Metric Extraction",
    description: "Construir las bases sintácticas iniciales y vocabulario de TI para entornos operativos simples de soporte interactivo.",
    chapters: [
      {
        id: 'u1_mod1_a',
        unit: 'MÓDULO 1 • PARTE A',
        title: 'Present Simple & Simple Tech Contexts',
        grammarTopic: 'Present Simple, Use of "Be", and Auxiliaries (Do/Does) in ITSM',
        grammarExplanation: 'Use the Present Simple to express stable states, technical specifications, and system rules ("The local proxy server runs on port 3000"). Use the auxiliaries "do" and "does" for querying state configurations or troubleshooting interfaces ("Does the pipeline trigger the unit test?"). For reading comprehension, always identify direct parameters from README files or configuration blocks.',
        technicalVocab: [
          { term: 'Alphanumeric Key', definition: 'A combination of alphabetical and numerical characters used to uniquely represent tickets or active tokens (e.g., TKT-9842).', icon: Binary },
          { term: 'Local Host', definition: 'The standard hostname pointing back to the local device (127.0.0.1), frequently bound to frontend preview ports.', icon: Cpu },
          { term: 'Terminal Command', definition: 'A text-based command executed within a console interface (e.g., "npm run dev") to deploy dynamic web environments.', icon: FileText },
        ],
        challengeId: 'CHALLENGE_TOEFL_M1_A',
        challengeTitle: 'Diagnostic Readme Parsing & State Report',
        challengeTask: 'Draft a brief status report of exactly 30 words in English (using "and" / "but") explaining that: (1) The local proxy server sits on port 3000, and (2) The backend server is inactive but does start with manual config overrides.',
        challengeCode: 'TOEFL://M1_A1.1_WRITING_SAMPLE'
      },
      {
        id: 'u1_mod1_b',
        unit: 'MÓDULO 1 • PARTE B',
        title: 'Listening TOEFL & Voice Activation Practice',
        grammarTopic: 'Information Extraction & Phonemic Control with the AI Tutor',
        grammarExplanation: 'Under standard TOEFL iBT Listening guidelines, speakers may mask target metric parameters or port numbers. Focus on isolating technical keys. In speaking drills, focus on producing clear, direct phonemes with the AI without hesitation lag (e.g., "Reset server", "Stop instance").',
        technicalVocab: [
          { term: 'Support Ticket', definition: 'A recorded incident tracker in helpdesk services used to triage, prioritize, and record system exceptions.', icon: FileText },
          { term: 'Port Ingress', definition: 'The entry channel for API traffic (default port 3000 inside sandboxed network environments).', icon: Binary },
          { term: 'Console Warning', definition: 'A low-priority indicator alerting developers to potential structural deprecations in the codebase.', icon: Cpu },
        ],
        challengeId: 'CHALLENGE_TOEFL_M1_B',
        challengeTitle: 'Helpdesk Port Isolation & Voice Drill',
        challengeTask: 'Listen to a mock client: "Hey, are you listening? The interface has been trying to bind port 3000, but is currently stuck on port 3001". What is the principal intention of the speaker and on which port is the app currently stuck?',
        challengeCode: 'TOEFL://M1_A1.1_LISTENING_COMPREHENSION'
      }
    ]
  },
  2: {
    title: "Módulo 2: Comprensión Secuencial e Imperativos (A1.2)",
    subtitle: "Focus TOEFL iBT: Sequential Logic & Processes",
    description: "Automatizar la comunicación de rutinas tecnológicas, reportes de despliegue en tiempo real y secuenciación de procesos de integración.",
    chapters: [
      {
        id: 'u2_mod2_a',
        unit: 'MÓDULO 2 • PARTE A',
        title: 'Workflows & Imperatives for Scripts',
        grammarTopic: 'Consolidating Present Continuous vs Present Simple & Imperative Sequences',
        grammarExplanation: 'Use the imperative form for sequential deployment steps (e.g., "Build the project", "Restart the server"). Contrast Present Simple (for stable rules: "Nginx routes traffic to port 3000") with Present Continuous (for ongoing pipeline compiles: "Vite is bundling the client assets right now"). For Reading, inspect terminal logs to isolate consecutive timestamps.',
        technicalVocab: [
          { term: 'Deployment Pipeline', definition: 'An automated mechanism that compiles, tests, and deploys software components into production.', icon: Binary },
          { term: 'Console Log', definition: 'A text record representing execution flow, used to track variables or connection handshakes.', icon: FileText },
          { term: 'Nginx Proxy', definition: 'An HTTP server serving static files or reverse-proxying requests directly to a target service.', icon: Cpu },
        ],
        challengeId: 'CHALLENGE_TOEFL_M2_A',
        challengeTitle: 'CI/CD Log Diagnosis & Sequential Imperatives',
        challengeTask: 'Interpret this sequence: (1) Run npm build. (2) Deploy to production container. Identify which action is currently compiling and describe what command must compile first.',
        challengeCode: 'TOEFL://M2_A1.2_SEQUENCING_WORKFLOWS'
      },
      {
        id: 'u2_mod2_b',
        unit: 'MÓDULO 2 • PARTE B',
        title: 'Listening TOEFL: Capture Workflows & Support Talk',
        grammarTopic: 'Sequence Markers & Scrum Standing Meetings',
        grammarExplanation: 'TOEFL iBT conversations regularly feature speakers listing sequences using "firstly", "subsequently", or "initially". To excel, write down bullet-point maps of the deployment workflows or logic sequences. Speak fluidly using transition verbs when analyzing software errors.',
        technicalVocab: [
          { term: 'Webpack bundle', definition: 'A compiled asset combining CSS, JavaScript, and HTML fragments into high-utility, optimized chunks.', icon: Binary },
          { term: 'Build Artifact', definition: 'A resulting compiled file exported from a pipeline build step, prepared for publication.', icon: FileText },
          { term: 'Hot Update', definition: 'A live update mechanism reflecting changes in client browser views without needing full page resets.', icon: Sparkles },
        ],
        challengeId: 'CHALLENGE_TOEFL_M2_B',
        challengeTitle: 'TOEFL iBT Sequence Capture Scenarios',
        challengeTask: 'Describe how a container fails back when the deploy steps are aborted halfway: write out a workflow list utilizing "First", "Second", and "Finally" to outline how the system falls back.',
        challengeCode: 'TOEFL://M2_A1.2_LISTENING_WORKFLOWS'
      }
    ]
  },
  3: {
    title: "Módulo 3: Eventos Pasados y Causa-Efecto (A2.1)",
    subtitle: "Focus TOEFL iBT: Root Cause Identification",
    description: "Narrar incidentes históricos, documentar errores de servidor y métricas pasadas de rendimiento de forma estructurada y con marcas temporales claras.",
    chapters: [
      {
        id: 'u3_mod3_a',
        unit: 'MÓDULO 3 • PARTE A',
        title: 'Past Incidents & Metric Tracking',
        grammarTopic: 'Past Simple, Regular/Irregular Verbs & Metric Quantifiers',
        grammarExplanation: 'Use the Past Simple to summarize yesterday\'s incidents or completed rollouts ("The database node crashed because of out-of-memory errors", "We restored the data table at block 21"). For metrics, employ quantifiers like "fewer exceptions", "less latency", and "much faster throughput". In reading, synthesize Jira ticket timelines to identify cause and effect.',
        technicalVocab: [
          { term: 'Root Cause', definition: 'The fundamental trigger or system glitch responsible for a cascade of downstream software errors.', icon: ShieldCheck },
          { term: 'Downtime Period', definition: 'The measured timeframe where a platform or API remains offline and inaccessible to clients.', icon: Cpu },
          { term: 'Jira Bug Tracker', definition: 'A prominent tracking panel used to coordinate incident resolution and map workflow status.', icon: FileText },
        ],
        challengeId: 'CHALLENGE_TOEFL_M3_A',
        challengeTitle: 'Incident Report - Root Cause Capture',
        challengeTask: 'Create an incident description in the past tense outlining: (1) When the system latency spiked, (2) Who resolved the outage, and (3) What metrics decreased post-fix.',
        challengeCode: 'TOEFL://M3_A2.1_INCIDENT_NARRATION'
      },
      {
        id: 'u3_mod3_b',
        unit: 'MÓDULO 3 • PARTE B',
        title: 'Listening TOEFL: Incident Dialogue Analytics',
        grammarTopic: 'Recognizing Attitude & Hidden Causes in Spoken Debates',
        grammarExplanation: 'TOEFL audios often feature dual speakers arguing about complex bugs. Isolate technical explanations from emotional remarks. Note whether the lead architect agrees or disagrees with the suggested fixes. Structure your speaking feedback to present clear causal relationships.',
        technicalVocab: [
          { term: 'Buffer Overflow', definition: 'An anomaly where a process stores data beyond the buffer limit, causing severe system leaks.', icon: Binary },
          { term: 'Database Migration', definition: 'The precise execution of updating database schemas or transferring table structures.', icon: FileText },
          { term: 'Query Latency', definition: 'The total round-trip time consumed by a database execution to return a record.', icon: Cpu },
        ],
        challengeId: 'CHALLENGE_TOEFL_M3_B',
        challengeTitle: 'Causal Inference Speaking Assessment',
        challengeTask: 'Formulate a cohesive response explaining how an outdated database query caused a 400ms delay in the client checkout pipeline.',
        challengeCode: 'TOEFL://M3_A2.1_SPEAKING_CAUSALITY'
      }
    ]
  },
  4: {
    title: "Módulo 4: Proyecciones e Hipótesis (A2.2)",
    subtitle: "Focus TOEFL iBT: Scenarios, Scaling & Risks",
    description: "Planificación de escalabilidad, proyecciones de SLA, asunciones de carga informática y análisis condicional de riesgos en entornos cloud.",
    chapters: [
      {
        id: 'u4_mod4_a',
        unit: 'MÓDULO 4 • PARTE A',
        title: 'Roadmaps & First Conditional Risks',
        grammarTopic: 'First Conditional, Future Actions (Will / Going to) & Ability Modals',
        grammarExplanation: 'Use the First Conditional to model risk and technical forecasting ("If we configure a load balancer, instances will scale up automatically"). Use "will" to declare immediate computational results, and "going to" for planned roadmap steps. Reading focus relies on parsing Functional Requirements (FRs) and Request for Proposals (RFPs) to spot logical dependencies.',
        technicalVocab: [
          { term: 'Cloud Scalability', definition: 'The capability of runtime server nodes to adjust dynamic resources to match demand peaks.', icon: Cpu },
          { term: 'Functional Requirement', definition: 'A clear definition of what software capabilities and user flows must do to meet user expectations.', icon: FileText },
          { term: 'Scrum Sprint', definition: 'A structured, recurring sprint cycle of two weeks focused on compiling test-reviewed code.', icon: Binary },
        ],
        challengeId: 'CHALLENGE_TOEFL_M4_A',
        challengeTitle: 'Cloud Risk Prediction Formula',
        challengeTask: 'Draft a conditional specification containing a clear risk projection: "If our client traffic increases by 300%, we will have to scale..." Use ability modals (can, should, must) to enforce limits.',
        challengeCode: 'TOEFL://M4_A2.2_RISK_PROJECTION'
      },
      {
        id: 'u4_mod4_b',
        unit: 'MÓDULO 4 • PARTE B',
        title: 'Listening TOEFL: Academic IT Lectures',
        grammarTopic: 'Structure Summarization & Trend Note-Taking',
        grammarExplanation: 'TOEFL Academic Listening blocks require you to capture predictions and research trends. Track the transition from current technological baselines to future hypotheses. In speaking, practice presenting structured functional software demos within rigid 1-minute limits.',
        technicalVocab: [
          { term: 'Serverless Compute', definition: 'An on-demand execution model where cloud providers run code fragments without server management.', icon: Cpu },
          { term: 'Tech RFP Proposal', definition: 'A request for proposal compiling full technical constraints, budgets, and milestones.', icon: FileText },
          { term: 'User Acceptance Test', definition: 'The final quality assurance phase confirming whether software matches business objectives.', icon: ShieldCheck },
        ],
        challengeId: 'CHALLENGE_TOEFL_M4_B',
        challengeTitle: 'TOEFL Synthesis Speaking & Future Intent',
        challengeTask: 'Propose a cloud transition project. Present 3 structured future steps using "be going to" and show how the SLA will improve.',
        challengeCode: 'TOEFL://M4_A2.2_FUTURE_ROADMAP'
      }
    ]
  },
  5: {
    title: "Módulo 5: Tareas Integradas y Discurso Indirecto (B1.1)",
    subtitle: "Focus TOEFL iBT: Synthesizing Complex Events & Audits",
    description: "Manejar la ambigüedad, reportar incidencias complejas y delegación de tareas bajo directrices oficiales de auditoría de red.",
    chapters: [
      {
        id: 'u5_mod5_a',
        unit: 'MÓDULO 5 • PARTE A',
        title: 'Audit Reporting & Reported Speech',
        grammarTopic: 'Reported Speech, Past Perfect & Causative Verbs (Have/Get)',
        grammarExplanation: 'Use Reported Speech to securely pass along security alerts, vendor compliance updates, or engineering statements ("The chief security officer stated that the network had been compromised"). Use causative structures for delegation ("The developer had the system patch the packages"). Reading focuses on relational databases, IT security audits, and network schemas.',
        technicalVocab: [
          { term: 'Post-Mortem Analysis', definition: 'A highly descriptive review and analysis written immediately following critical software outages.', icon: FileText },
          { term: 'Network Audit Log', definition: 'An official record of compliance, authentication patterns, or security violations.', icon: ShieldCheck },
          { term: 'Docker Compose Config', definition: 'A configuration script detailing how multi-container applications hook up and network together.', icon: Binary },
        ],
        challengeId: 'CHALLENGE_TOEFL_M5_A',
        challengeTitle: 'Post-Mortem Audit & Speech Transmittal',
        challengeTask: 'Rewrite these direct statements into Reported Speech: "The administrator says: \'I have completed the docker sync\'. The lead says: \'The security key was changed\'". Ensure correct usage of Past Perfect.',
        challengeCode: 'TOEFL://M5_B1.1_POSTMORTEM_REPORTING'
      },
      {
        id: 'u5_mod5_b',
        unit: 'MÓDULO 5 • PARTE B',
        title: 'Listening TOEFL: Integrated Lectures on IT Policy',
        grammarTopic: 'Sarcasm Detection & Subtleties in Multi-User Panels',
        grammarExplanation: 'TOEFL iBT integrated tasks present a lecture and a companion reading. Focus on contrasting perspectives on cloud governance policies. Use precise transitional reported verbs (e.g. "asserted", "claimed", "conceded") in your written and spoken evaluations.',
        technicalVocab: [
          { term: 'Relational Schema', definition: 'A visual diagram specifying database structures, table links, and operational constraints.', icon: FileText },
          { term: 'IAM Access Rule', definition: 'Identity and Access Management rules that control user authorizations on cloud instances.', icon: ShieldCheck },
          { term: 'Kubernetes Pod', definition: 'The smallest deployable unit of computing that can be created and managed in Kubernetes clusters.', icon: Cpu },
        ],
        challengeId: 'CHALLENGE_TOEFL_M5_B',
        challengeTitle: 'TOEFL Integrated Task Preparation',
        challengeTask: 'Summarize a lecture arguing for mandatory serverless migration, contrasting it with a paper claiming serverless increases latency.',
        challengeCode: 'TOEFL://M5_B1.1_INTEGRATION_COMPREHENSION'
      }
    ]
  },
  6: {
    title: "Módulo 6: Retórica Avanzada y Estándar Académico (B1.2)",
    subtitle: "Focus TOEFL iBT: Advanced Scholarly Arguments",
    description: "Consolidar la fluidez académica y retórica avanzada bajo estándares internacionales de la rúbrica oficial TOEFL iBT.",
    chapters: [
      {
        id: 'u6_mod6_a',
        unit: 'MÓDULO 6 • PARTE A',
        title: 'TOEFL iBT High Rhetoric & SLA Negotiations',
        grammarTopic: 'Third Conditional, formal Subjunctive Mood, & Negative Inversions',
        grammarExplanation: 'Use the Third Conditional to discuss alternative scenarios during post-mortems ("Had the engineering team deployed the CDN, the DDoS attack would not have overwhelmed the memory"). Elevate tone with subjunctive requests ("The CEO recommended that the security policy be updated") and inversions ("Seldom does a framework require the deprecated libraries").',
        technicalVocab: [
          { term: 'SLA Agreement', definition: 'A Service Level Agreement defining target uptimes (e.g., 99.99%) and response times for incidents.', icon: ShieldCheck },
          { term: 'Tech Whitepaper', definition: 'An advanced scholarly publication explaining state-of-the-art technological breakthroughs or models.', icon: FileText },
          { term: 'DDoS Assault', definition: 'Distributed Denial of Service attack intended to saturate port 3000 networks and block traffic.', icon: Binary },
        ],
        challengeId: 'CHALLENGE_TOEFL_M6_A',
        challengeTitle: 'SLA Incident Subjunctive Formula',
        challengeTask: 'Draft a critical post-mortem resolution using a negative inversion (start with: "Seldom") and a Third Conditional regarding a virtual host breach.',
        challengeCode: 'TOEFL://M6_B1.2_ADVANCED_RETORIC'
      },
      {
        id: 'u6_mod6_b',
        unit: 'MÓDULO 6 • PARTE B',
        title: 'Listening TOEFL: Academic Research Defenses',
        grammarTopic: 'Note-Taking under extreme speeds & Academic Lecture Mapping',
        grammarExplanation: 'TOEFL Listening at B1.2 scales to native university lecture speed. Map the argument\'s structure using tree nodes: Hypothesis -> Evidence -> Nuance. Practice speaking argumentatively for exactly 60 seconds with steady rhythm, no fillers, and strict technical terms.',
        technicalVocab: [
          { term: 'Neural Endpoint', definition: 'The target network route for routing processed model outputs or model endpoints.', icon: Cpu },
          { term: 'Symmetric Cryptography', definition: 'An encryption method utilizing a shared cryptographic key to secure database fields.', icon: ShieldCheck },
          { term: 'Logical Schema Link', definition: 'The connector layout uniting distinct data paradigms inside modern microservices architectures.', icon: Binary },
        ],
        challengeId: 'CHALLENGE_TOEFL_M6_B',
        challengeTitle: 'TOEFL iBT Speaking Pitch (60 Seconds)',
        challengeTask: 'Defend public cloud hosting versus hybrid architectures. Deliver 3 technical points and a conclusion within 60 seconds under academic constraints.',
        challengeCode: 'TOEFL://M6_B1.2_PITCH_EVALUATION'
      }
    ]
  }
};

export function StudentLibrary() {
  const { currentUser, userProgress, language } = useAppContext();
  
  // Tab switcher to toggle between interactive challenges and reference book
  const [activeLibraryTab, setActiveLibraryTab] = useState<'challenges' | 'libro_referencia'>('challenges');
  
  // Try to read level from profile or default to 3
  const userModule = currentUser?.module || 3;
  // State to support dynamic switching of all 6 modules of the TOEFL Tech Syllabus
  const [selectedModule, setSelectedModule] = useState<number>(userModule);
  
  const bookData = LEVEL_BOOKS[selectedModule] || LEVEL_BOOKS[3];
  
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(bookData.chapters[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [ttsActive, setTtsActive] = useState<string | null>(null);
  const [challengeInput, setChallengeInput] = useState('');
  const [challengePassed, setChallengePassed] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const [adminDocs, setAdminDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  React.useEffect(() => {
    const fetchAdminDocs = async () => {
      if (!auth.currentUser) {
        setAdminDocs([]);
        return;
      }
      setLoadingDocs(true);
      try {
        const snap = await getDocs(collection(db, 'library_documents'));
        const list: any[] = [];
        snap.forEach(d => {
          list.push({ id: d.id, ...d.data() });
        });
        setAdminDocs(list);
      } catch (e: any) {
        console.error("Error fetching library documents:", e);
        handleFirestoreError(e, OperationType.LIST, 'library_documents');
      } finally {
        setLoadingDocs(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchAdminDocs();
      } else {
        setAdminDocs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // If selected module changes
  React.useEffect(() => {
    if (bookData && bookData.chapters && bookData.chapters[0]) {
      setSelectedChapter(bookData.chapters[0]);
    }
    setChallengeInput('');
    setChallengePassed(null);
    setFeedback(null);
  }, [selectedModule, bookData]);

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (ttsActive) {
        window.speechSynthesis.cancel();
        setTtsActive(null);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.95;
        utterance.onend = () => setTtsActive(null);
        setTtsActive(text);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert('Tu navegador no soporta síntesis de voz directo.');
    }
  };

  const handleVerifyChallenge = (challengeId: string) => {
    if (!challengeInput.trim()) {
      setFeedback('POR FAVOR INGRESA UNA RESPUESTA O REPORTE TÉCNICO.');
      return;
    }

    // Dynamic checks based on Level/Challenges (TOEFL Tech Syllabus)
    const input = challengeInput.toLowerCase();
    let isCorrect = false;

    if (challengeId === 'CHALLENGE_TOEFL_M1_A') {
      isCorrect = input.includes('port 3000') || input.includes('proxy') || input.includes('inactive') || input.includes('server');
    } else if (challengeId === 'CHALLENGE_TOEFL_M1_B') {
      isCorrect = input.includes('3000') || input.includes('3001') || input.includes('stuck');
    } else if (challengeId === 'CHALLENGE_TOEFL_M2_A' || challengeId === 'CHALLENGE_TOEFL_M2_B') {
      isCorrect = input.includes('build') || input.includes('deploy') || input.includes('first') || input.includes('npm');
    } else if (challengeId === 'CHALLENGE_TOEFL_M3_A' || challengeId === 'CHALLENGE_TOEFL_M3_B') {
      isCorrect = input.includes('latency') || input.includes('cause') || input.includes('resolved') || input.includes('restore') || input.includes('delay');
    } else if (challengeId === 'CHALLENGE_TOEFL_M4_A' || challengeId === 'CHALLENGE_TOEFL_M4_B') {
      isCorrect = input.includes('if') || input.includes('will') || input.includes('scale') || input.includes('scrum') || input.includes('sprint');
    } else if (challengeId === 'CHALLENGE_TOEFL_M5_A' || challengeId === 'CHALLENGE_TOEFL_M5_B') {
      isCorrect = input.includes('stated') || input.includes('had') || input.includes('reported') || input.includes('conceded') || input.includes('said');
    } else if (challengeId === 'CHALLENGE_TOEFL_M6_A' || challengeId === 'CHALLENGE_TOEFL_M6_B') {
      isCorrect = input.includes('had') || input.includes('seldom') || input.includes('rarely') || input.includes('would') || input.includes('subjunctive');
    } else {
      isCorrect = challengeInput.length > 10;
    }

    if (isCorrect) {
      setChallengePassed(challengeId);
      setFeedback('¡DESAFÍO EXCELENTE! Tu ADN académico se actualiza en tiempo real con este reto TOEFL (+30 EXP).');
    } else {
      setFeedback('ERROR DE COMPILACIÓN EN TU SINTAXIS o faltan requerimientos específicos. Compara con los temas de la lección.');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* 📚 Library Hero Panel */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-400 text-[#061a1a] text-[9px] font-black uppercase tracking-wider">
              TOEFL LEVEL {userModule}
            </span>
            <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-[0.3em]">
              TOEFL Tech Specialist & 5-Skills Syllabus
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white bevel-text uppercase tracking-tighter">
            Ecosistema de Consulta Kurricular
          </h1>
          <p className="text-white/40 text-xs md:text-sm font-medium mt-1 leading-relaxed max-w-2xl">
            Material académico premium alineado a los estándares internacionales TOEFL iBT y el vocabulario de vanguardia tecnológica para ingenieros.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <button 
            onClick={() => setShowPdfModal(true)}
            className="haptic-button-primary px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download size={16} />
            {language === 'es' ? 'Abrir Manual PDF' : 'Open PDF Manual'}
          </button>
        </div>
      </header>

      {/* SUB-TAB NAV SELECTOR (Challenges vs Virtual Book) */}
      <div className="flex flex-col sm:flex-row bg-black/45 border border-white/5 p-1 rounded-2xl max-w-md gap-1.5 self-start shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={() => setActiveLibraryTab('challenges')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeLibraryTab === 'challenges'
              ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20 shadow-[0_0_15px_rgba(222,255,154,0.12)]'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          <span>🎯</span> Desafíos TOEFL iBT
        </button>
        <button
          type="button"
          onClick={() => setActiveLibraryTab('libro_referencia')}
          className={`flex-1 py-3 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            activeLibraryTab === 'libro_referencia'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
              : 'text-white/45 hover:text-white/70 hover:bg-white/5 font-bold'
          }`}
        >
          📖 Libro Digital Base (18 Sem)
        </button>
      </div>

      {activeLibraryTab === 'challenges' ? (
        <>
          {/* 🔮 TOEFL Tech Specialist 5-Skills Modules Switcher */}
          <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black font-mono text-[#DEFF9A] uppercase tracking-widest leading-none">
            ⚡ RUTA DE CERTIFICACIÓN INTEGRADORA (6 MÓDULOS) • NAVEGACIÓN DIRECTA
          </span>
          <span className="text-[9px] text-white/30 uppercase font-bold">
            Haz clic para explorar el material didáctico de cada módulo
          </span>
         </div>
         <div className="p-1 rounded-[1.5rem] bg-white/[0.02] border border-white/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => {
               const isUserLevel = userModule === num;
               const isSelected = selectedModule === num;
               return (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedModule(num);
                    }}
                    className={`py-3.5 px-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative ${
                       isSelected 
                         ? 'bg-[#DEFF9A]/15 border border-[#DEFF9A]/40 text-white shadow-[0_0_20px_rgba(222,255,154,0.08)]' 
                         : 'bg-black/40 hover:bg-white/5 border border-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                     <span className="text-[8px] font-mono font-black tracking-widest uppercase">
                        MÓDULO 0{num}
                     </span>
                     <span className="text-[10px] font-black uppercase tracking-tight">
                        {num === 1 ? 'A1.1 PRINCIPIANTE' : num === 2 ? 'A1.2 ELEMENTAL' : num === 3 ? 'A2.1 PRE-INTERMEDIO' : num === 4 ? 'A2.2 INTERMEDIO BAJO' : num === 5 ? 'B1.1 INTERMEDIO' : 'B1.2 INTERMEDIO ALTO'}
                     </span>
                     {isUserLevel && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400" title="Tu Nivel Asignado por ADN" />
                     )}
                  </button>
               );
            })}
         </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Ebook Selector and Navigation (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[30px] rounded-full" />
            
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-4">
              Tu Material de Desafíos Activo
            </span>
            
            {/* Ebook Graphic representation */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 mb-6">
              <div className="w-16 h-22 bg-gradient-to-br from-[#123030] to-black border-2 border-[#DEFF9A]/20 rounded-xl flex flex-col justify-between p-2 shadow-2xl shrink-0">
                <span className="text-[7px] text-[#DEFF9A]/40 font-bold tracking-widest uppercase">TOEFL</span>
                <BookOpen className="text-[#DEFF9A]" size={20} />
                <span className="text-[8px] font-bold text-white text-center">MOD {selectedModule}</span>
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">
                  {bookData.title}
                </h4>
                <p className="text-[10px] font-bold text-[#DEFF9A] uppercase tracking-wider mt-1">
                  Manual Módulo {selectedModule}
                </p>
                <p className="text-[9px] text-white/30 truncate mt-1">
                  {bookData.subtitle}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed font-medium mb-6">
              {bookData.description}
            </p>

            {/* Chapters Navigation List */}
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2 leading-none">
                Capítulos & Unidades
              </span>
              {bookData.chapters.map((chap) => {
                const isActive = selectedChapter.id === chap.id;
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setSelectedChapter(chap);
                      setChallengeInput('');
                      setChallengePassed(null);
                      setFeedback(null);
                    }}
                    className={`haptic-press w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/30 text-white' 
                        : 'bg-white/5 border-white/5 hover:border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-black text-[#DEFF9A] tracking-widest block uppercase mb-1">
                        {chap.unit}
                      </span>
                      <h5 className="text-[11px] font-black uppercase tracking-tight">
                        {chap.title}
                      </h5>
                    </div>
                    <ChevronRight size={14} className={isActive ? 'text-[#DEFF9A]' : 'opacity-30'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Administrative curriculum and documents list */}
          <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <ShieldCheck size={14} className="text-[#DEFF9A]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#DEFF9A]">
                Recursos del Director
              </span>
            </div>
            
            {loadingDocs ? (
              <p className="text-[9px] text-white/30 uppercase font-bold text-center py-2 animate-pulse">Cargando material oficial...</p>
            ) : adminDocs.length === 0 ? (
              <p className="text-[9px] text-white/20 uppercase font-bold leading-relaxed text-center py-2">No se han publicado planes curriculares externos aún.</p>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                {adminDocs.map((doc) => (
                  <div key={doc.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between gap-2 hover:border-white/10 transition-all text-left">
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-white uppercase truncate" title={doc.name}>{doc.name}</p>
                      <p className="text-[8px] text-white/40 font-mono mt-0.5">{doc.size} • {doc.type.toUpperCase()}</p>
                    </div>
                    {doc.type === 'pdf' ? (
                      <button 
                        onClick={() => alert(`Visualizando documento oficial: ${doc.name}`)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-[9px] font-black uppercase"
                        title="Ver PDF"
                      >
                        <FileText size={12} />
                      </button>
                    ) : (
                      <div className="px-2 py-0.5 rounded bg-[#DEFF9A]/10 text-[#DEFF9A] text-[7.5px] font-black uppercase leading-none">
                        PLAN
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Ebook Reader (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Ebook Viewer Glass Panel */}
          <div className="p-8 md:p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 relative overflow-hidden space-y-8">
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-[#DEFF9A]/40 to-transparent" />
            
            {/* Header of Ebook page */}
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
              <div>
                <span className="text-[9px] font-black text-[#DEFF9A] tracking-[0.2em] uppercase">
                  {selectedChapter.unit} • LECCIÓN VIRTUAL
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mt-1">
                  {selectedChapter.title}
                </h2>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-mono font-bold text-white/40">
                PAGE 1/2
              </div>
            </div>

            {/* Content Section 1: Grammar Focus */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                  <Sparkles size={14} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white/80">
                  Enfoque Gramatical Profesional (Grammar Focus)
                </h3>
              </div>
              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4 leading-relaxed">
                <p className="text-[11px] font-bold text-[#DEFF9A] uppercase tracking-wide">
                  TEMA: {selectedChapter.grammarTopic}
                </p>
                <p className="text-xs text-white/70">
                  {selectedChapter.grammarExplanation}
                </p>
                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => handleSpeakText(selectedChapter.grammarExplanation)}
                    className="haptic-button py-2.5 px-4 rounded-xl text-[9px] font-black tracking-widest flex items-center gap-2 bg-white/5 hover:bg-white/10"
                  >
                    <Volume2 size={12} className={ttsActive ? 'text-cyan-400 animate-bounce' : 'text-white/40'} />
                    {ttsActive ? 'DETENER REPRODUCCIÓN AUDIO' : 'ESCUCHAR PRONUNCIACIÓN (TTS)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section 2: Technical Glossary */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                  <Cpu size={14} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white/80">
                  Glosario de Hardware y Redes (Technical Glossary)
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedChapter.technicalVocab.map((vocab, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative group hover:bg-[#DEFF9A]/5 hover:border-[#DEFF9A]/30 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-white/40 group-hover:text-[#DEFF9A] mb-3 transition-colors">
                      <vocab.icon size={14} />
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight group-hover:text-[#DEFF9A]">
                      {vocab.term}
                    </h4>
                    <p className="text-[10px] text-white/40 leading-normal mt-2">
                      {vocab.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Section 3: Interactive Challenge */}
            <div className="pt-6 border-t border-white/5 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                    <Zap size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/80">
                      Smart Challenge Unitario (Desafío)
                    </h3>
                    <p className="text-[9px] text-[#DEFF9A] font-bold uppercase tracking-widest leading-none mt-1">
                      {selectedChapter.challengeTitle}
                    </p>
                  </div>
                </div>
                {challengePassed === selectedChapter.challengeId && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 self-start md:self-auto">
                    <CheckCircle2 size={10} /> COMPLETADO EN ADN
                  </span>
                )}
              </div>

              <div className="p-6 rounded-3xl bg-[#092020]/40 border border-[#DEFF9A]/10 space-y-4">
                <p className="text-xs text-white/80 leading-relaxed font-bold">
                  {selectedChapter.challengeTask}
                </p>

                <div className="bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-[10px] space-y-1.5 relative">
                  <p className="text-[#DEFF9A]/40 font-bold">// Código de Escaneo de Desafío Inteligente:</p>
                  <p className="text-cyan-400 font-bold tracking-tight">
                    🚀 {selectedChapter.challengeCode}
                  </p>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 block">
                    Ingresa tu respuesta o reporte técnico en inglés:
                  </label>
                  <div className="flex gap-4">
                    <input 
                      type="text"
                      disabled={challengePassed === selectedChapter.challengeId}
                      value={challengeInput}
                      onChange={(e) => setChallengeInput(e.target.value)}
                      placeholder={selectedChapter.challengeId.includes('LVL3') ? "Type AWS configuration or Present Perfect sentence..." : "Escribe tu reporte o secuencia..."}
                      className="haptic-input flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/20 font-medium"
                    />
                    <button
                      onClick={() => handleVerifyChallenge(selectedChapter.challengeId)}
                      disabled={challengePassed === selectedChapter.challengeId}
                      className="haptic-button-primary px-6 rounded-2xl text-[9px] font-black tracking-widest shrink-0 disabled:opacity-40"
                    >
                      COMPILAR & GUARDAR
                    </button>
                  </div>
                </div>

                {feedback && (
                  <p className={`text-[10px] uppercase font-black tracking-tight pt-2 border-t border-white/5 ${feedback.includes('LOGRADO') ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {feedback}
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
        </>
      ) : (
        <LibroVirtualAlumnoCompleto />
      )}

      {/* PDF PRINT / DEMO MODAL SCREEN */}
      <AnimatePresence>
        {showPdfModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPdfModal(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-3xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full neo-glass border-white/20 rounded-[3rem] p-8 md:p-12 overflow-hidden relative shadow-[0_0_100px_rgba(222,255,154,0.1)] flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DEFF9A]/20 to-black border border-[#DEFF9A]/30 flex items-center justify-center text-[#DEFF9A]">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      Visor Responsivo Oficial: PDF Manual
                    </h3>
                    <p className="text-[9px] text-[#DEFF9A] font-black uppercase tracking-widest mt-0.5">
                      Visualizador de evidencia impresa TecLingo AI
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPdfModal(false)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 overflow-y-auto py-8 pr-2 space-y-6 custom-scrollbar text-white/80">
                
                {/* Header sheet simulation */}
                <div className="p-8 bg-white text-black rounded-3xl space-y-8 font-sans border border-black/10">
                  <div className="flex justify-between items-start border-b-2 border-black/10 pb-6">
                    <div>
                      <h4 className="font-extrabold text-sm uppercase tracking-wide text-neutral-800">
                        TECNOLINGO AI GLOBAL EDUCATIONAL PROTOCOL
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase mt-1">
                        CENTRAL CURRICULUM LEVEL {userModule} WORKBOOK • CLE MÓDULO {selectedModule}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-black bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
                        OFFICIAL_PDF_MODULE_{selectedModule}A
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-neutral-700">
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1">ALUMNO / CANDIDATE</p>
                      <p className="font-black text-xs uppercase text-neutral-900">{currentUser?.name || "Alumno Inmersivo"}</p>
                      <p className="text-[10px] mt-1 text-neutral-500">ID: {currentUser?.id || "USR-001"}</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1">Ruta Semestral</p>
                      <p className="font-black text-xs uppercase text-neutral-900">Malla Curricular {currentUser?.career || "Ing. En Sistemas Computacionales"}</p>
                      <p className="text-[10px] mt-1 text-[#10B981] font-bold">DNA Calibración Completa</p>
                    </div>
                  </div>

                  {/* Dynamic sections inside the PDF simulation sheets based on active level */}
                  <div className="space-y-6 text-xs text-neutral-700 leading-relaxed">
                    <div className="space-y-3">
                      <h5 className="font-extrabold text-xs uppercase text-neutral-900 border-l-4 border-[#10B981] pl-3 leading-none">
                        Unidad General de Desempeño
                      </h5>
                      <p className="text-justify">
                        Este documento oficial comprende las secciones de evaluación interactiva aplicables para la acreditación CLE del período lectivo vigente. Cada sección requiere validación de comandos técnicos y redacción de incidentes de soporte bilingüe certificados por nuestra inteligencia artificial central.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-[10px] text-neutral-600 block">
                      <strong>CÓDIGO DE DESAFÍO ACTIVO: </strong> [SCAN_QR_OR_CLICK]: {selectedChapter.challengeId}
                      <p className="mt-1 text-[9px] text-neutral-400">// La veracidad de esta evidencia se registra de manera inmutable en el repositorio de la institución.</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-black/10">
                      <h5 className="font-extrabold text-xs uppercase text-neutral-900">
                        Vocabulario Técnico para Evaluación del Campus
                      </h5>
                      <ul className="list-disc pl-6 space-y-2">
                        {selectedChapter.technicalVocab.map((vocab, index) => (
                          <li key={index}>
                            <strong>{vocab.term}: </strong> {vocab.definition}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Stamp simulation footer */}
                  <div className="flex justify-between items-center pt-8 border-t border-black/10 text-[9px] text-neutral-400 font-bold uppercase">
                    <span>© 2026 TECNOLINGO AI • Derechos Reservados.</span>
                    <span className="text-neutral-500">AUTENTICADO POR LA PLATAFORMA</span>
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end gap-4 shrink-0">
                <button 
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Print Document - TecLingo AI</title>
                            <style>
                              body { font-family: system-ui, sans-serif; padding: 40px; background: #fff; color: #000; }
                              .print-container { max-width: 800px; margin: 0 auto; border: 2px solid #ccc; padding: 30px; border-radius: 10px; }
                              h1, h2, h3, h4 { text-transform: uppercase; }
                              hr { border: 0; border-top: 1px solid #ccc; margin: 20px 0; }
                            </style>
                          </head>
                          <body>
                            <div class="print-container">
                              <h2>TECNOLINGO AI GLOBAL EDUCATIONAL PROTOCOL</h2>
                              <h3>Central Curriculum Level ${userModule} - Acreditación</h3>
                              <hr />
                              <p><strong>Alumno:</strong> ${currentUser?.name || 'Alumno Inmersivo'}</p>
                              <p><strong>Clase/Ruta:</strong> ${currentUser?.career || 'Sistemas Computacionales'}</p>
                              <hr />
                              <h4>Unidad Sincronizada: ${selectedChapter.title}</h4>
                              <p><strong>Grammar Topic:</strong> ${selectedChapter.grammarTopic}</p>
                              <p><strong>Explicación:</strong> ${selectedChapter.grammarExplanation}</p>
                              <hr />
                              <h4>Certificado Vocabulario Técnico:</h4>
                              <ul>
                                ${selectedChapter.technicalVocab.map(v => `<li><strong>${v.term}:</strong> ${v.definition}</li>`).join('')}
                              </ul>
                              <hr />
                              <p style="font-size: 10px; color: gray;">Documento electrónico impreso el ${new Date().toLocaleDateString()}</p>
                            </div>
                            <script>window.print();</script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    } else {
                      window.print();
                    }
                  }}
                  className="haptic-button py-3.5 px-6 rounded-2xl text-[9px] font-black uppercase tracking-wider bg-[#DEFF9A] text-[#061a1a]"
                >
                  Confirmar Impresión Evidence
                </button>
                <button 
                  onClick={() => setShowPdfModal(false)}
                  className="haptic-button py-3.5 px-6 rounded-2xl text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white"
                >
                  Cerrar Visualizador
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
