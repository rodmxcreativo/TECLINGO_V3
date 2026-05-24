/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Send, 
  Download, 
  User as UserIcon, 
  Calendar as CalendarIcon, 
  Tag, 
  Type,
  CheckCircle2,
  Lock,
  Stamp,
  Users as UsersIcon,
  Search,
  Layout,
  Plus,
  Trash2,
  Move
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Draggable from 'react-draggable';
import { GlassCard } from './GlassCard';
import { useAppContext, db, auth, handleFirestoreError, OperationType } from '../context/AppContext';
import { collection, query, where, getDocs } from 'firebase/firestore';

type DocumentType = 'OFICIO' | 'MINUTA' | 'CIRCULAR' | 'CITATORIO' | 'ACTA';

interface Agreement {
  id: string;
  description: string;
  responsible: string;
  deadline: string;
}

interface FolioData {
  id: string;
  type: DocumentType;
  recipientIds: string[];
  recipientName: string;
  recipientRole: string;
  date: string;
  title: string;
  subject: string;
  body: string;
  agreements: Agreement[];
}

export function FolioConstructor() {
  const { 
    addFolio, 
    currentUser, 
    logActivity, 
    institutionName, 
    institutionSlogan, 
    institutionAddress, 
    institutionPhone,
    institutionLogo,
    institutionLogoSEP,
    institutionLogoTecNM,
    institutionSignature,
    institutionStamp
  } = useAppContext();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchTeacher, setSearchTeacher] = useState('');
  const [showTeacherSelect, setShowTeacherSelect] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  
  const [signaturePos, setSignaturePos] = useState({ x: 0, y: 0 });
  const [stampPos, setStampPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!currentUser?.institutionId) return;
    const fetchTeachers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('institutionId', '==', currentUser.institutionId),
          where('role', '==', 'DOCENTE')
        );
        const snap = await getDocs(q);
        setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e: any) {
        console.error("Error fetching teachers:", e);
        handleFirestoreError(e, OperationType.LIST, 'users');
      }
    };
    fetchTeachers();
  }, [currentUser?.institutionId]);

  const [data, setData] = useState<FolioData>({
    id: `ITSP-${new Date().getFullYear()}-001`,
    type: 'OFICIO',
    recipientIds: [],
    recipientName: '',
    recipientRole: '',
    date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
    title: 'CIRCULAR INSTITUCIONAL',
    subject: '',
    body: '',
    agreements: []
  });

  // Auto-generate Folio logic
  useEffect(() => {
    const generateFolio = async () => {
       const year = new Date().getFullYear();
       setData(prev => ({
         ...prev,
         id: `ITSP-${year}-${Math.floor(100 + Math.random() * 900)}`
       }));
    };
    generateFolio();
  }, []);

  const [isProcessing, setIsProcessing] = useState<'NONE' | 'PDF' | 'SEND'>('NONE');

  const addAgreement = () => {
    setData(prev => ({
      ...prev,
      agreements: [
        ...prev.agreements,
        { id: Math.random().toString(36).substr(2, 9), description: '', responsible: '', deadline: '' }
      ]
    }));
  };

  const removeAgreement = (id: string) => {
    setData(prev => ({
      ...prev,
      agreements: prev.agreements.filter(a => a.id !== id)
    }));
  };

  const updateAgreement = (id: string, field: keyof Agreement, value: string) => {
    setData(prev => ({
      ...prev,
      agreements: prev.agreements.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleAction = async (type: 'PDF' | 'SEND') => {
    if (type === 'SEND' && data.recipientIds.length === 0) {
      alert("Debes seleccionar un destinatario.");
      return;
    }

    setIsProcessing(type);
    
    if (type === 'SEND') {
      const newFolio = {
        id: data.id,
        title: data.title,
        subject: data.subject,
        content: data.body,
        date: data.date,
        senderName: currentUser?.name || 'Dirección General',
        assignedToIds: data.recipientIds,
        signatures: [],
        evidence: [],
        status: 'PENDING' as const,
        metadata: {
          type: data.type,
          agreements: data.agreements,
          signaturePos,
          stampPos
        }
      };
      
      try {
        await addFolio(newFolio);
        await logActivity('FOLIO_EMISSION', { 
          folioId: data.id, 
          recipients: data.recipientIds,
          title: data.title,
          type: data.type
        });
        
        setIsProcessing('NONE');
        setData({
          id: `ITSP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
          type: 'OFICIO',
          recipientIds: [],
          recipientName: '',
          recipientRole: '',
          date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
          title: 'CIRCULAR INSTITUCIONAL',
          subject: '',
          body: '',
          agreements: []
        });
        setSignaturePos({ x: 0, y: 0 });
        setStampPos({ x: 0, y: 0 });
      } catch (err) {
        console.error(err);
        setIsProcessing('NONE');
      }
    } else {
      setTimeout(() => setIsProcessing('NONE'), 1500);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTeacher.toLowerCase()) || 
    t.controlNumber?.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-12 gap-8 pb-24"
    >
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <header className="mb-6">
          <h2 className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Constructor de Documentos</h2>
          <h1 className="text-3xl font-bold tracking-tight text-white bevel-text uppercase underline decoration-[#DEFF9A]/20">Emisión Institucional</h1>
        </header>

        <div className="space-y-4">
          <GlassCard title="Estructura Documental" icon={Layout} accent="cyan">
            <div className="grid grid-cols-3 gap-2">
              {(['OFICIO', 'MINUTA', 'CIRCULAR', 'CITATORIO', 'ACTA'] as DocumentType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setData({ ...data, type, title: type === 'OFICIO' ? 'OFICIO INSTITUCIONAL' : (type === 'MINUTA' ? 'MINUTA DE TRABAJO' : type) })}
                  className={`haptic-press py-3 px-1 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all border ${
                    data.type === type 
                    ? 'bg-[#DEFF9A] text-[#061a1a] border-[#DEFF9A]' 
                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Control de Datos Variables" icon={Type} accent="green" className="!overflow-visible">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Folio Único</label>
                  <div className="relative">
                    <Lock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input 
                      disabled
                      value={data.id}
                      className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#DEFF9A] font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Fecha Emisión</label>
                  <div className="relative">
                    <CalendarIcon size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DEFF9A]" />
                    <input 
                      type="text"
                      value={data.date}
                      onChange={(e) => setData({...data, date: e.target.value})}
                      className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Receptor (Docente)</label>
                <div className="relative">
                  <UserIcon size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DEFF9A]" />
                  <input 
                    type="text"
                    value={data.recipientName}
                    onClick={() => setShowTeacherSelect(true)}
                    readOnly
                    placeholder="Seleccione un docente..."
                    className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/40 transition-colors cursor-pointer"
                  />
                  <AnimatePresence>
                    {showTeacherSelect && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 z-50 mt-2 bg-[#0c2525] border border-white/10 rounded-2xl p-4 shadow-2xl max-h-60 overflow-y-auto custom-scrollbar"
                      >
                        <div className="relative mb-4">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                          <input 
                            autoFocus
                            value={searchTeacher}
                            onChange={(e) => setSearchTeacher(e.target.value)}
                            placeholder="Buscar docente..."
                            className="haptic-input w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          {filteredTeachers.map(t => (
                            <button 
                              key={t.id}
                              onClick={() => {
                                setData({...data, recipientIds: [t.id], recipientName: t.name, recipientRole: t.role});
                                setShowTeacherSelect(false);
                              }}
                              className="haptic-press w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#DEFF9A]/10 text-left transition-colors group"
                            >
                               <div>
                                  <p className="text-white text-[10px] font-bold group-hover:text-[#DEFF9A]">{t.name}</p>
                                  <p className="text-white/40 text-[8px] uppercase">{t.controlNumber || 'Sin No. Control'}</p>
                               </div>
                               <UsersIcon size={12} className="text-white/20 group-hover:text-[#DEFF9A]" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Asunto / Título</label>
                <div className="relative">
                  <Tag size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DEFF9A]" />
                  <input 
                    type="text"
                    value={data.subject}
                    onChange={(e) => setData({...data, subject: e.target.value})}
                    placeholder="Referencia corta"
                    className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/40 transition-colors font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Contenido Principal</label>
                <textarea 
                  value={data.body}
                  onChange={(e) => setData({...data, body: e.target.value})}
                  rows={6}
                  placeholder="Redacte el mensaje oficial..."
                  className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/80 focus:outline-none focus:border-[#DEFF9A]/40 transition-colors leading-relaxed resize-none"
                />
              </div>

              {data.type === 'MINUTA' && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                   <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest ml-1">Acuerdos y Compromisos</label>
                      <button 
                        onClick={addAgreement}
                        className="p-1.5 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-all"
                      >
                        <Plus size={14} />
                      </button>
                   </div>
                   <div className="space-y-2">
                      {data.agreements.map((ag) => (
                        <div key={ag.id} className="bg-white/5 rounded-xl p-3 space-y-2 relative group">
                           <button 
                             onClick={() => removeAgreement(ag.id)}
                             className="absolute top-2 right-2 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                           >
                              <Trash2 size={12} />
                           </button>
                           <input 
                              placeholder="Acuerdo..."
                              value={ag.description}
                              onChange={(e) => updateAgreement(ag.id, 'description', e.target.value)}
                              className="w-full bg-transparent text-[10px] text-white focus:outline-none border-b border-white/5"
                           />
                           <div className="grid grid-cols-2 gap-2">
                              <input 
                                placeholder="Resp..."
                                value={ag.responsible}
                                onChange={(e) => updateAgreement(ag.id, 'responsible', e.target.value)}
                                className="w-full bg-transparent text-[8px] text-white/40 focus:outline-none"
                              />
                              <input 
                                placeholder="Plazo..."
                                value={ag.deadline}
                                onChange={(e) => updateAgreement(ag.id, 'deadline', e.target.value)}
                                className="w-full bg-transparent text-[8px] text-white/40 focus:outline-none text-right"
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </GlassCard>

          <div className="flex gap-4">
             <button 
              onClick={() => handleAction('PDF')}
              className="haptic-button flex-1 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-2xl py-4 flex items-center justify-center gap-3 transition-all relative overflow-hidden group"
             >
                <Download size={18} className="text-white/40 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Vista de Impresión</span>
                {isProcessing === 'PDF' && (
                  <motion.div 
                    layoutId="processing" 
                    className="absolute inset-0 bg-[#DEFF9A] flex items-center justify-center text-[#061a1a]"
                  >
                    <CheckCircle2 size={20} className="animate-pulse" />
                  </motion.div>
                )}
             </button>
             <button 
              disabled={isProcessing !== 'NONE'}
              onClick={() => handleAction('SEND')}
              className="haptic-button-primary flex-1 rounded-2xl py-4 flex items-center justify-center gap-3 transition-all relative overflow-hidden group disabled:opacity-50"
             >
                <Send size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Emitir con Trazabilidad</span>
                {isProcessing === 'SEND' && (
                  <motion.div 
                    layoutId="processing" 
                    className="absolute inset-0 bg-white flex items-center justify-center text-[#061a1a]"
                  >
                    <CheckCircle2 size={20} className="animate-bounce" />
                  </motion.div>
                )}
             </button>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <div className="sticky top-12">
          <div className="flex items-center justify-between mb-4 px-4">
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">Panel de Firmas Interactivo (A4)</span>
            <div className="flex items-center gap-4">
               <span className="text-[8px] font-bold text-white/40 uppercase">Ajuste manual activo</span>
               <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#DEFF9A]" />
                 <div className="w-2 h-2 rounded-full bg-white/10" />
               </div>
            </div>
          </div>

          <div 
            ref={previewRef}
            className="aspect-[1/1.414] w-full bg-white neo-glass !bg-white !border-none rounded-none shadow-2xl overflow-hidden p-12 text-black relative select-none"
          >
            {/* Draggable Stamps and Signatures */}
            <Draggable 
              nodeRef={stampRef}
              bounds="parent" 
              defaultPosition={{x: 400, y: 600}}
              onStop={(e, data) => setStampPos({ x: data.x, y: data.y })}
            >
              <div ref={stampRef} className="absolute z-50 cursor-move group">
                 <div className="relative">
                    {institutionStamp ? (
                      <img src={institutionStamp} className="w-24 h-24 object-contain opacity-80" alt="Sello" />
                    ) : (
                      <>
                        <Stamp size={80} strokeWidth={1} className="text-black/30 group-active:text-blue-500 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center border-2 border-black/10 border-dashed rounded-full group-hover:border-blue-500/30">
                           <span className="text-[10px] font-black rotate-[-15deg] opacity-40">VALIDADO</span>
                        </div>
                      </>
                    )}
                    <Move size={12} className="absolute -top-2 -right-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              </div>
            </Draggable>

            <Draggable 
              nodeRef={signatureRef}
              bounds="parent"
              defaultPosition={{x: 200, y: 700}}
              onStop={(e, data) => setSignaturePos({ x: data.x, y: data.y })}
            >
              <div ref={signatureRef} className="absolute z-50 cursor-move group">
                 <div className="relative">
                    {institutionSignature ? (
                      <img src={institutionSignature} className="w-32 h-16 object-contain" alt="Firma" />
                    ) : (
                      <svg width="180" height="80" viewBox="0 0 200 80" className="text-blue-700/80 group-active:text-blue-900 transition-colors">
                         <path d="M 30 50 Q 50 10 90 40 T 160 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                         <path d="M 40 60 Q 70 30 110 55 T 180 35" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                      </svg>
                    )}
                    <Move size={12} className="absolute -top-2 -right-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              </div>
            </Draggable>

            {/* Institutional Headers */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8">
              <div className="w-24 h-16 rounded-sm flex items-center justify-center overflow-hidden">
                <img src={institutionLogoSEP} className="h-full object-contain" alt="SEP" />
              </div>
              <div className="text-center">
                 <h4 className="text-[10px] font-black tracking-tighter text-black/80 mb-1">GOBIERNO DEL ESTADO DE VERACRUZ</h4>
                 <h3 className="text-[14px] font-black tracking-tight leading-tight uppercase w-80 mx-auto text-black">{institutionName || 'Instituto Tecnológico Superior de Pánuco'}</h3>
                 <p className="text-[8px] font-bold mt-2 text-black/60 italic tracking-widest uppercase">"{institutionSlogan}"</p>
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded-sm flex items-center justify-center overflow-hidden">
                  <img src={institutionLogoTecNM} className="h-full object-contain" alt="TecNM" />
                </div>
                <div className="w-16 h-16 border border-black/10 rounded-sm flex items-center justify-center overflow-hidden">
                  <img src={institutionLogo} className="h-full object-contain" alt="ITSP" />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8 font-serif px-8">
              <div className="text-right space-y-1">
                <p className="text-[10px] font-bold">Oficio No. <span className="font-mono text-black font-black text-xs">{data.id}</span></p>
                <p className="text-[10px] uppercase font-bold text-black/60 italic">Pánuco, Ver., a {data.date}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-0.5">
                   <p className="text-[12px] font-black uppercase text-black">{data.recipientName || '(DESTINATARIO NO ASIGNADO)'}</p>
                   <p className="text-[10px] font-bold italic text-black/80">P R E S E N T E  -</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-[10px] font-black uppercase shrink-0">ASUNTO:</span>
                  <span className="text-[11px] font-bold underline underline-offset-4">{data.subject.toUpperCase() || '(SIN TÍTULO DEFINIDO)'}</span>
                </div>
              </div>

              <div className="py-2">
                <p className="text-[12px] leading-[1.8] text-justify whitespace-pre-wrap font-medium text-black/90">
                  {data.body || 'Escriba el cuerpo del documento oficial...'}
                </p>
              </div>

              {data.type === 'MINUTA' && data.agreements.length > 0 && (
                <div className="mt-8">
                   <h5 className="text-[10px] font-black uppercase tracking-widest mb-4 border-b border-black/10 pb-2">Acuerdos de Sesión:</h5>
                   <table className="w-full text-[9px] border-collapse">
                      <thead>
                         <tr className="bg-black/5">
                            <th className="border border-black/20 p-2 text-left">Acuerdo</th>
                            <th className="border border-black/20 p-2 text-center w-24">Responsable</th>
                            <th className="border border-black/20 p-2 text-center w-20">Plazo</th>
                         </tr>
                      </thead>
                      <tbody>
                         {data.agreements.map(ag => (
                           <tr key={ag.id}>
                              <td className="border border-black/20 p-2">{ag.description || '-'}</td>
                              <td className="border border-black/20 p-2 text-center">{ag.responsible || '-'}</td>
                              <td className="border border-black/20 p-2 text-center">{ag.deadline || '-'}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              )}

              <div className="pt-20 text-center space-y-24">
                <div className="flex flex-col items-center">
                   <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-20 px-8 py-2 border-y border-black/5 inline-block">A T E N T A M E N T E</p>
                   
                   <div className="relative flex flex-col items-center justify-center w-80">
                      <div className="w-full border-t-2 border-black mb-3" />
                      <p className="text-[12px] font-black uppercase tracking-tight">{currentUser?.name?.toUpperCase() || 'DIRECCIÓN GENERAL'}</p>
                      <p className="text-[9px] font-bold text-black/60 uppercase tracking-widest">{currentUser?.role === 'DIRECTOR' ? 'Director General' : 'Autoridad Académica'}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Institutional Footer */}
            <div className="absolute bottom-12 left-12 right-12">
               <div className="w-full h-px bg-black/10 mb-4" />
               <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1 text-[8px] font-bold uppercase text-black/50 list-none">
                     <li>• C.c.p. Expediente Académico</li>
                     <li>• C.c.p. Archivo de Gestión Digital</li>
                     <li>• C.cp. Dirección General ITSP</li>
                  </div>
                  <div className="text-right text-[7px] font-bold text-black/40">
                     <p>{institutionAddress}</p>
                     <p>TEL. {institutionPhone} | WWW.ITSPANUCO.EDU.MX</p>
                     <p className="mt-2 text-[#64748b] font-sans text-[9pt]">Página 1 de 1</p>
                  </div>
               </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] rotate-[-30deg]">
              <span className="text-[140px] font-black tracking-[0.2em] font-mono select-none">ITSP OFFICIAL</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

