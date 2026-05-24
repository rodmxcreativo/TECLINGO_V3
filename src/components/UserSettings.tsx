/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Zap,
  Globe,
  Camera,
  Signature,
  Award,
  FileText,
  Calendar,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Save,
  AlertTriangle,
  Fingerprint,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  QrCode,
  Database,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext, UserProfile, db, auth, handleFirestoreError, OperationType } from '../context/AppContext';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';

interface UserSettingsProps {
  role?: 'DIRECTOR' | 'DOCENTE' | 'ALUMNO';
}

export function UserSettings({ role = 'DIRECTOR' }: UserSettingsProps) {
  const { 
    institutionName, 
    setInstitutionName, 
    institutionLogo, 
    setInstitutionLogo,
    institutionLogoSEP,
    setInstitutionLogoSEP,
    institutionLogoTecNM,
    setInstitutionLogoTecNM,
    institutionSignature,
    setInstitutionSignature,
    institutionStamp,
    setInstitutionStamp,
    institutionSlogan,
    setInstitutionSlogan,
    institutionAddress,
    setInstitutionAddress,
    institutionPhone,
    setInstitutionPhone,
    maintenanceMode,
    setMaintenanceMode,
    currentUser,
    setCurrentUser,
    saveUserProfile
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'PERSONAL' | 'PROFESSIONAL' | 'SECURITY' | 'CREDENTIAL' | 'TUTOR_DB'>(role === 'DOCENTE' ? 'PERSONAL' : 'IDENTITY');
  const [isDirty, setIsDirty] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // --- AI Tutor Knowledge Base State & Handlers ---
  interface TutorRule {
    id: string;
    topic: string;
    keywords: string[];
    content: string;
    example: string;
    updatedAt?: string;
  }
  const [tutorRules, setTutorRules] = useState<TutorRule[]>([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [editingRule, setEditingRule] = useState<TutorRule | null>(null);
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);
  // Rule Form Fields
  const [ruleTopic, setRuleTopic] = useState('');
  const [ruleKeywords, setRuleKeywords] = useState('');
  const [ruleContent, setRuleContent] = useState('');
  const [ruleExample, setRuleExample] = useState('');

  useEffect(() => {
    if (activeTab === 'TUTOR_DB' && role === 'DIRECTOR') {
      fetchTutorRules();
    }
  }, [activeTab]);

  const fetchTutorRules = async () => {
    if (!auth.currentUser) {
      setTutorRules([]);
      return;
    }
    setLoadingRules(true);
    try {
      const q = collection(db, 'tutor_knowledge');
      const snap = await getDocs(q);
      const list: TutorRule[] = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as TutorRule);
      });
      setTutorRules(list);
    } catch (e: any) {
      console.error('Error fetching tutor rules:', e);
      handleFirestoreError(e, OperationType.LIST, 'tutor_knowledge');
    } finally {
      setLoadingRules(false);
    }
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTopic.trim() || !ruleContent.trim()) return;

    const id = editingRule?.id || `rule_${Date.now()}`;
    const cleanKeywords = ruleKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    const newRule: TutorRule = {
      id,
      topic: ruleTopic,
      keywords: cleanKeywords,
      content: ruleContent,
      example: ruleExample,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'tutor_knowledge', id), newRule);
      await fetchTutorRules();
      // Reset form
      setRuleTopic('');
      setRuleKeywords('');
      setRuleContent('');
      setRuleExample('');
      setEditingRule(null);
      setIsRuleFormOpen(false);
    } catch (e) {
      console.error('Error saving rule:', e);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta directriz de conocimiento para el bot?')) return;
    try {
      await deleteDoc(doc(db, 'tutor_knowledge', id));
      await fetchTutorRules();
    } catch (e) {
      console.error('Error deleting rule:', e);
    }
  };

  const loadDemoRules = async () => {
    const demoData: TutorRule[] = [
      {
        id: 'rule_second_person',
        topic: 'Segunda Persona (Grammar Rules)',
        keywords: ['segunda persona', 'second person', 'you', 'tú', 'usted', 'ustedes'],
        content: 'La segunda persona en inglés es el pronombre "You" que traduce tanto para el singular (tú, usted) como el plural (ustedes, vosotros). En el tiempo Past Perfect, se conjuga con "had" + el verbo en participio pasado.',
        example: 'You had studied English before moving to Texas. (Habías estudiado inglés antes de mudarte a Texas).'
      },
      {
        id: 'rule_past_perfect_formula',
        topic: 'Past Perfect Structure',
        keywords: ['past perfect', 'had', 'estructura', 'fórmula', 'regla'],
        content: 'La estructura y fórmula del pasado perfecto es: [Sujeto] + had (auxiliar) + [Verbo en participio pasado]. Para negación usamos "had not" o "hadn\'t". Sirve para hablar de algo que pasó antes de otra acción en el pasado.',
        example: 'Alex had finished his homework before the online class started.'
      },
      {
        id: 'rule_dallas_interview',
        topic: 'Urgente: Dallas Job Interview',
        keywords: ['dallas', 'entrevista', 'interview', 'job', 'trabajo'],
        content: 'Proporciona al alumno tips exclusivos de Realidad Aumentada y biculturales para su entrevista en Dallas, como por ejemplo vestir formal y practicar modismos tejanos ("howdy", "y\'ll"). Explícales que la Realidad Aumentada les permitirá sumergirse en escenarios simulados hiperrealistas para afinar su fluidez y lenguaje corporal.',
        example: 'Prepare your pitch in English! In Texas, confidence and clear phrasing are key.'
      }
    ];

    try {
      for (const item of demoData) {
        await setDoc(doc(db, 'tutor_knowledge', item.id), item);
      }
      await fetchTutorRules();
    } catch (e) {
      console.error('Error loading demo rules:', e);
    }
  };
  
  // Local state for editing - will be synced with AppContext on save
  const [localUser, setLocalUser] = useState<UserProfile>(currentUser || {
    id: '',
    name: '',
    email: '',
    curp: '',
    employeeId: '',
    phone: '',
    birthDate: '',
    avatar: '',
    bio: '',
    specialty: '',
    experience: '',
    certifications: []
  });

  useEffect(() => {
    if (currentUser) {
      setLocalUser(currentUser);
    }
  }, [currentUser]);

  const [dirData, setDirData] = useState({
    name: 'Carlos Rodríguez',
    curp: 'RODC780512HDFRR05',
    phone: '+52 833 123 4567',
    birthDate: '1978-05-12',
    bio: 'Apasionado por la tecnología y la educación disruptiva.'
  });

  const [instData, setInstData] = useState({
    name: institutionName,
    slogan: institutionSlogan,
    phone: institutionPhone,
    address: institutionAddress,
    logoSEP: institutionLogoSEP,
    logoTecNM: institutionLogoTecNM,
    logoITSP: institutionLogo,
    signature: institutionSignature,
    stamp: institutionStamp,
    email: 'contacto@teclingo.ai',
    facebook: 'facebook.com/teclingo',
    instagram: 'instagram.com/teclingoaiedu',
    linkedin: 'linkedin.com/company/teclingo'
  });

  const handleSave = async () => {
    if (role === 'DOCENTE' && localUser) {
      await saveUserProfile(localUser);
    } else {
      setInstitutionName(instData.name);
      setInstitutionSlogan(instData.slogan);
      setInstitutionAddress(instData.address);
      setInstitutionPhone(instData.phone);
      setInstitutionLogo(instData.logoITSP);
      setInstitutionLogoSEP(instData.logoSEP);
      setInstitutionLogoTecNM(instData.logoTecNM);
      setInstitutionSignature(instData.signature);
      setInstitutionStamp(instData.stamp);
      // Update director data if needed
    }
    setIsDirty(false);
    // In a real app, this would sync with Firebase here
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalUser({ ...localUser, avatar: reader.result as string });
          setIsDirty(true);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
        activeTab === id ? 'bg-[#38BDF8] text-white shadow-[0_0_20px_#38BDF840]' : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  const DigitalCard = () => (
    <div className="relative group perspective-1000">
       <div className="w-full max-w-[320px] mx-auto aspect-[1/1.6] bg-gradient-to-br from-[#061a1a] to-[#0d2d2d] rounded-[2.5rem] border border-[#DEFF9A]/20 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden relative p-8 flex flex-col items-center text-center transition-transform duration-500 hover:rotate-y-12">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DEFF9A] to-transparent opacity-40" />
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#DEFF9A]/5 blur-3xl rounded-full" />
          
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
             {institutionLogo ? (
               <img src={institutionLogo} className="w-10 h-10 mb-2 drop-shadow-[0_0_10px_rgba(222,255,154,0.4)]" alt="Logo" />
             ) : (
               <Zap className="text-[#DEFF9A] w-10 h-10 mb-2" />
             )}
             <p className="text-[#DEFF9A] text-[8px] font-black tracking-[0.4em] uppercase">{institutionName}</p>
          </div>

          {/* User Photo */}
          <div className="relative mb-6">
             <div className="w-28 h-28 rounded-[2rem] border-2 border-[#DEFF9A]/40 p-1 bg-[#061a1a] overflow-hidden">
                <img src={localUser.avatar || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded-[1.8rem]" alt={localUser.name} />
             </div>
             <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#4ADE80] border-4 border-[#061a1a] flex items-center justify-center">
                <Zap size={12} className="text-black" fill="currentColor" />
             </div>
          </div>

          {/* Name & Role */}
          <div className="mb-8">
             <h3 className="text-white text-xl font-black uppercase tracking-tight leading-none mb-1">{localUser.name || 'Docente Name'}</h3>
             <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">{role === 'DOCENTE' ? 'Docente Oficial' : 'Director Central'}</p>
          </div>

          {/* QR Area */}
          <div className="mt-auto bg-white p-3 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
             <QRCodeSVG 
                value={`VERIFY:${localUser.id}:${localUser.curp}`} 
                size={80} 
                level="H" 
                includeMargin={false}
             />
             <p className="mt-2 text-[6px] font-black text-black/40 uppercase tracking-widest">Validación Institucional</p>
          </div>

          {/* Footer ID */}
          <div className="mt-6 flex flex-col items-center">
             <p className="text-white/20 text-[8px] font-black tracking-[0.2em] font-mono">{localUser.employeeId || 'ID-000-000'}</p>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
       </div>

       <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
             <Download size={14} /> Descargar PDF
          </button>
          <button className="px-6 py-3 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#38BDF8]/20 transition-all">
             <ExternalLink size={14} /> Compartir
          </button>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-12 pb-32">
       {/* Sidebar de Navegación Settings */}
       <div className="col-span-12 lg:col-span-3 space-y-4">
          <header className="mb-8">
             <h2 className="text-[#38BDF8] text-[10px] font-black uppercase tracking-[0.4em] mb-2">{role === 'DOCENTE' ? 'Teacher Identity' : 'Master Settings'}</h2>
             <h1 className="text-3xl font-black text-white uppercase tracking-tight">Centro de Mando</h1>
          </header>
          
          <div className="flex flex-col gap-2">
             {role === 'DIRECTOR' ? (
               <>
                 <TabButton id="IDENTITY" label="Identidad Institucional" icon={Globe} />
                 <TabButton id="PERSONAL" label="Perfil del Director" icon={User} />
                 <TabButton id="PROFESSIONAL" label="Perfil Profesional" icon={Award} />
                 <TabButton id="TUTOR_DB" label="Base de Datos AI" icon={Database} />
               </>
             ) : (
               <>
                 <TabButton id="PERSONAL" label="Identidad & Avatar" icon={User} />
                 <TabButton id="PROFESSIONAL" label="Expediente PRO" icon={Award} />
                 <TabButton id="CREDENTIAL" label="Digital Card" icon={QrCode} />
               </>
             )}
             <TabButton id="SECURITY" label="Seguridad & Acceso" icon={Lock} />
          </div>

          {role === 'DIRECTOR' && (
            <div className="mt-12 p-6 rounded-3xl bg-red-500/5 border border-red-500/20">
               <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-red-500" size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Zona de Riesgo</span>
               </div>
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-bold text-white/40">MODO MANTENIMIENTO</span>
                  <button 
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`w-10 h-5 rounded-full relative transition-all ${maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-all ${maintenanceMode ? 'translate-x-5' : ''}`} />
                  </button>
               </div>
               <p className="text-[8px] text-white/30 font-medium leading-relaxed">Activa este modo para bloquear el acceso a alumnos durante actualizaciones masivas.</p>
            </div>
          )}
       </div>

       {/* Área de Edición */}
       <div className="col-span-12 lg:col-span-9 space-y-8">
          <AnimatePresence mode="wait">
             {role === 'DIRECTOR' && activeTab === 'IDENTITY' && (
                <motion.div 
                  key="identity"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <GlassCard title="Centro de Identidad Institucional" icon={Globe} accent="cyan">
                      <div className="space-y-12">
                         {/* Logos Section */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { label: 'Logo Federal (SEP)', key: 'logoSEP', current: instData.logoSEP },
                              { label: 'Logo Nacional (TecNM)', key: 'logoTecNM', current: instData.logoTecNM },
                              { label: 'Logo Local (ITSP)', key: 'logoITSP', current: instData.logoITSP }
                            ].map((logo, idx) => (
                              <div key={logo.key} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center relative mb-4 overflow-hidden shadow-inner">
                                   <img src={logo.current} className="w-12 h-12 object-contain" alt={logo.label} />
                                   <label className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                      <Camera size={20} className="text-[#38BDF8]" />
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              setInstData({ ...instData, [logo.key]: reader.result as string });
                                              setIsDirty(true);
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                      />
                                   </label>
                                </div>
                                <h4 className="text-[9px] font-black text-white/60 uppercase tracking-widest">{logo.label}</h4>
                              </div>
                            ))}
                         </div>

                         {/* Text Variables */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Nombre de la Institución</label>
                                  <input 
                                    type="text"
                                    value={instData.name}
                                    onChange={(e) => { setInstData({...instData, name: e.target.value}); setIsDirty(true); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all font-bold"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Slogan Institucional (Branding)</label>
                                  <input 
                                    type="text"
                                    value={instData.slogan}
                                    onChange={(e) => { setInstData({...instData, slogan: e.target.value}); setIsDirty(true); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all italic"
                                  />
                               </div>
                            </div>

                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Dirección del Campus (Footer)</label>
                                  <input 
                                    type="text"
                                    value={instData.address}
                                    onChange={(e) => { setInstData({...instData, address: e.target.value}); setIsDirty(true); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Teléfonos de Gestión</label>
                                  <input 
                                    type="text"
                                    value={instData.phone}
                                    onChange={(e) => { setInstData({...instData, phone: e.target.value}); setIsDirty(true); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold font-mono outline-none focus:border-[#38BDF8]/40 transition-all"
                                  />
                               </div>
                            </div>
                         </div>

                         {/* Validation Assets */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                            <div className="space-y-4">
                               <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Firma Autógrafa PNG</h4>
                                  <Signature size={14} className="text-[#38BDF8]" />
                               </div>
                               <div className="w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-4 relative group cursor-pointer overflow-hidden">
                                  {instData.signature ? (
                                    <img src={instData.signature} className="h-24 object-contain" alt="Firma" />
                                  ) : (
                                    <div className="text-center opacity-20 group-hover:opacity-40 transition-all">
                                       <Plus size={32} className="mx-auto mb-2" />
                                       <p className="text-[9px] font-black uppercase tracking-widest">Cargar Firma Transparente</p>
                                    </div>
                                  )}
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setInstData({ ...instData, signature: reader.result as string });
                                          setIsDirty(true);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                               </div>
                            </div>

                            <div className="space-y-4">
                               <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Sello de Dirección PNG</h4>
                                  <Fingerprint size={14} className="text-[#38BDF8]" />
                               </div>
                               <div className="w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-4 relative group cursor-pointer overflow-hidden">
                                  {instData.stamp ? (
                                    <img src={instData.stamp} className="h-24 object-contain" alt="Sello" />
                                  ) : (
                                    <div className="text-center opacity-20 group-hover:opacity-40 transition-all">
                                       <Plus size={32} className="mx-auto mb-2" />
                                       <p className="text-[9px] font-black uppercase tracking-widest">Cargar Sello Transparente</p>
                                    </div>
                                  )}
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setInstData({ ...instData, stamp: reader.result as string });
                                          setIsDirty(true);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   </GlassCard>
                </motion.div>
             )}

             {activeTab === 'PERSONAL' && (
               <motion.div 
                 key="personal"
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title={role === 'DOCENTE' ? 'Identidad & Perfil' : 'ADN del Director Master'} icon={User} accent={role === 'DOCENTE' ? 'green' : 'cyan'}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Avatar Section for Docente */}
                        {role === 'DOCENTE' && (
                           <div className="md:col-span-2 flex items-center gap-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                              <div className="w-32 h-32 rounded-[2rem] bg-black/40 border border-[#DEFF9A]/20 flex items-center justify-center relative group overflow-hidden shrink-0 shadow-[0_0_20px_rgba(222,255,154,0.1)]">
                                 {isUploading ? (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                                       <Zap className="text-[#DEFF9A] animate-pulse" size={24} />
                                       <span className="text-[8px] font-black text-[#DEFF9A] uppercase tracking-widest">Inyectando...</span>
                                    </div>
                                 ) : (
                                    <>
                                       {localUser.avatar ? (
                                         <img src={localUser.avatar} className="w-full h-full object-cover" alt="Avatar" />
                                       ) : (
                                         <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                           <User size={48} className="text-white/10" />
                                         </div>
                                       )}
                                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                          <Camera size={24} className="text-[#DEFF9A]" />
                                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                       </label>
                                    </>
                                 )}
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-1">Avatar Profesional</h4>
                                 <p className="text-[10px] text-white/30 font-bold mb-4 uppercase tracking-widest leading-relaxed italic">
                                    Esta imagen se sincronizará con tu Credencial Digital, la Red de Apoyo y el sistema de mensajería.
                                 </p>
                                 <label className="px-6 py-3 bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#DEFF9A] hover:bg-[#DEFF9A]/20 transition-all cursor-pointer inline-block">
                                    Cargar Identidad Visual
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                 </label>
                              </div>
                           </div>
                        )}

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Nombre Completo</label>
                           <input 
                            type="text" 
                            value={role === 'DOCENTE' ? localUser.name : dirData.name} 
                            onChange={(e) => { 
                               if (role === 'DOCENTE') setLocalUser({...localUser, name: e.target.value});
                               else setDirData({...dirData, name: e.target.value});
                               setIsDirty(true); 
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all font-bold"
                           />
                        </div>
                        
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                              CURP (ID Invariable) <Lock size={10} />
                           </label>
                           <input 
                            type="text" 
                            value={role === 'DOCENTE' ? `XXXX-XXXX-${localUser.curp.slice(-4)}` : dirData.curp} 
                            readOnly
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/30 text-xs font-bold outline-none cursor-not-allowed"
                           />
                        </div>

                        {role === 'DOCENTE' && (
                           <>
                              <div className="space-y-2">
                                 <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                                    Email Institucional <Lock size={10} />
                                 </label>
                                 <input type="text" value={localUser.email} readOnly className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/30 text-xs font-bold outline-none cursor-not-allowed" />
                              </div>
                              <div className="space-y-2">
                                 <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                                    Número de Empleado <Lock size={10} />
                                 </label>
                                 <input type="text" value={localUser.employeeId} readOnly className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/30 text-xs font-bold outline-none cursor-not-allowed" />
                              </div>
                           </>
                        )}

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Teléfono {role === 'DOCENTE' ? 'Personal' : 'Privado'}</label>
                           <input 
                            type="text" 
                            value={role === 'DOCENTE' ? localUser.phone : dirData.phone} 
                            onChange={(e) => { 
                               if (role === 'DOCENTE') setLocalUser({...localUser, phone: e.target.value});
                               else setDirData({...dirData, phone: e.target.value});
                               setIsDirty(true); 
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                           <input 
                            type="date" 
                            value={role === 'DOCENTE' ? localUser.birthDate : dirData.birthDate} 
                            onChange={(e) => { 
                               if (role === 'DOCENTE') setLocalUser({...localUser, birthDate: e.target.value});
                               else setDirData({...dirData, birthDate: e.target.value});
                               setIsDirty(true); 
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all"
                           />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Biografía Profesional</label>
                           <textarea 
                            value={role === 'DOCENTE' ? localUser.bio : dirData.bio} 
                            onChange={(e) => { 
                               if (role === 'DOCENTE') setLocalUser({...localUser, bio: e.target.value});
                               else setDirData({...dirData, bio: e.target.value});
                               setIsDirty(true); 
                            }}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-medium outline-none focus:border-[#38BDF8]/40 transition-all resize-none italic"
                           />
                        </div>
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'PROFESSIONAL' && (
               <motion.div 
                 key="professional"
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title={role === 'DOCENTE' ? 'Expediente & Certificaciones' : 'Experiencia & Autoridad'} icon={Award} accent={role === 'DOCENTE' ? 'cyan' : 'cyan'}>
                     <div className="space-y-8">
                        {role === 'DOCENTE' && (
                           <>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Especialidad Principal</label>
                                 <input 
                                    type="text" 
                                    value={localUser.specialty} 
                                    onChange={(e) => { setLocalUser({...localUser, specialty: e.target.value}); setIsDirty(true); }}
                                    className="w-full bg-white/5 border border-[#38BDF8]/20 rounded-2xl py-4 px-6 text-[#38BDF8] text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all"
                                 />
                              </div>

                              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-1">Certificaciones Oficiales</h4>
                                       <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Títulos, TOEFL, Cambridge, etc. (PDF/JPG)</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-xl bg-[#DEFF9A] text-black text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                                       <Plus size={14} /> Añadir Documento
                                    </button>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {localUser.certifications?.map((cert) => (
                                       <div key={cert.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8]">
                                                {cert.type.includes('pdf') ? <FileText size={18} /> : <Camera size={18} />}
                                             </div>
                                             <div>
                                                <p className="text-[11px] font-black text-white uppercase tracking-tight">{cert.name}</p>
                                                <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Verificado Institucionalmente</p>
                                             </div>
                                          </div>
                                          <button className="p-2 text-white/20 hover:text-red-400 transition-all">
                                             <Trash2 size={16} />
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </>
                        )}
                        
                        {role === 'DIRECTOR' && (
                           <>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Grado Académico / Título</label>
                                 <input 
                                 type="text" 
                                 placeholder="Ej. School Administrator / Software Expert"
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[#DEFF9A] text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all font-bold"
                                 />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                    <div>
                                       <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Resumen Profesional</h4>
                                       <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-loose">Aparecerá en tu Red de Apoyo para docentes y alumnos.</p>
                                    </div>
                                    <textarea 
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/10 rounded-3xl py-6 px-8 text-white/80 text-xs leading-relaxed outline-none focus:border-[#38BDF8]/40 transition-all font-medium italic"
                                    />
                                 </div>

                                 <div className="space-y-4">
                                    <div>
                                       <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Firma Digital Oficial</h4>
                                       <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-loose">Para reportes y diplomas automáticos.</p>
                                    </div>
                                    <div className="w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-[#DEFF9A]/20 transition-all">
                                       <Signature size={32} className="text-white/10 group-hover:text-[#DEFF9A]/40 transition-all" />
                                       <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Cargar Firma Digital</span>
                                    </div>
                                 </div>
                              </div>
                           </>
                        )}

                        <div className={`p-6 border rounded-3xl ${role === 'DOCENTE' ? 'bg-[#38BDF8]/5 border-[#38BDF8]/20' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${role === 'DOCENTE' ? 'bg-[#38BDF8]/10 text-[#38BDF8]' : 'bg-cyan-500/10 text-cyan-400'}`}>
                                 <Award size={32} />
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-[12px] font-black text-white uppercase tracking-tight">Estatus: {role === 'DOCENTE' ? 'Docente Certificado' : 'Director Verificado'} (V-VIP)</h4>
                                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Nivel de autoridad {role === 'DOCENTE' ? 'Operativo' : 'Máximo'} en Tecnolingo AI Hub</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'CREDENTIAL' && role === 'DOCENTE' && (
                <motion.div 
                  key="credential"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col lg:flex-row gap-12 items-start"
                >
                   <div className="flex-1 space-y-8">
                      <header>
                         <h3 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Credencial Institucional</h3>
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">Identidad Digital Verificada</h2>
                         <p className="text-white/40 text-[11px] font-medium leading-relaxed max-w-md mt-4 italic">
                            Tu Digital Card es tu herramienta de presentación oficial ante la comunidad. Protégela y mantenla actualizada. Cualquier cambio en tu perfil se reflejará instantáneamente aquí.
                         </p>
                      </header>

                      <div className="space-y-6">
                         <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                               <QrCode size={24} />
                            </div>
                            <div>
                               <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Validación por QR</h4>
                               <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Permite que alumnos y padres verifiquen tu estatus oficial escaneando el código.</p>
                            </div>
                         </div>
                         <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8]">
                               <Zap size={24} />
                            </div>
                            <div>
                               <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Sincronización AI</h4>
                               <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Tu bio y experiencia son analizadas para asignarte proyectos exclusivos.</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <DigitalCard />
                </motion.div>
             )}

             {activeTab === 'SECURITY' && (
               <motion.div 
                 key="security"
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title="Seguridad & Acceso" icon={Lock} accent="orange">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Contraseña Actual</label>
                           <input type="password" value="********" readOnly className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/40 text-xs font-bold outline-none" />
                        </div>
                        <div className="flex items-end">
                           <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Cambiar Contraseña</button>
                        </div>
                        
                        <div className="md:col-span-2 p-8 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                                 <ShieldCheck size={28} />
                              </div>
                              <div>
                                 <h4 className="text-[13px] font-black text-white uppercase tracking-tight">Autenticación de Dos Factores (2FA)</h4>
                                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Añade una capa extra de seguridad a tu cuenta operativa.</p>
                              </div>
                           </div>
                           <button className="px-8 py-3 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_#F9731680] transition-all">Configurar</button>
                        </div>
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'TUTOR_DB' && role === 'DIRECTOR' && (
                <motion.div 
                  key="tutor_db"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <GlassCard title="Base de Datos AI Tutor - Configuración" icon={Database} accent="cyan">
                      <div className="space-y-6">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                            <div>
                               <h3 className="text-white text-lg font-black uppercase tracking-tight">Reglas y Directrices de Conocimiento</h3>
                               <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                                  Alimenta la base de conocimiento de TECLINGO para respuestas 100% coherentes y alineadas académicamente.
                               </p>
                            </div>
                            <div className="flex gap-3">
                               <button 
                                 type="button"
                                 onClick={loadDemoRules}
                                 className="px-5 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center gap-2"
                               >
                                  <Zap size={12} /> Cargar Reglas Demo
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => {
                                    setEditingRule(null);
                                    setRuleTopic('');
                                    setRuleKeywords('');
                                    setRuleContent('');
                                    setRuleExample('');
                                    setIsRuleFormOpen(true);
                                 }}
                                 className="px-5 py-3 rounded-xl bg-[#DEFF9A] text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                               >
                                  <Plus size={12} /> Agregar Regla
                               </button>
                            </div>
                         </div>

                         {isRuleFormOpen && (
                            <motion.form 
                              onSubmit={handleSaveRule}
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                              className="p-6 rounded-3xl bg-white/5 border border-[#38BDF8]/20 space-y-4"
                            >
                               <h4 className="text-[#38BDF8] text-[10px] font-black uppercase tracking-widest">
                                  {editingRule ? 'Editar Directriz de Conocimiento' : 'Nueva Directriz de Conocimiento'}
                               </h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Tema / Título Académico</label>
                                     <input 
                                       type="text"
                                       value={ruleTopic}
                                       onChange={(e) => setRuleTopic(e.target.value)}
                                       required
                                       placeholder="Ej. Week 4: Past Perfect"
                                       className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40"
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Palabras Clave (Separadas por comas)</label>
                                     <input 
                                       type="text"
                                       value={ruleKeywords}
                                       onChange={(e) => setRuleKeywords(e.target.value)}
                                       placeholder="ej. past perfect, had, formula"
                                       className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-bold font-mono outline-none focus:border-[#38BDF8]/40"
                                     />
                                  </div>
                                  <div className="md:col-span-2 space-y-2">
                                     <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Teoría / Respuesta Coherente Oficial</label>
                                     <textarea 
                                       value={ruleContent}
                                       onChange={(e) => setRuleContent(e.target.value)}
                                       required
                                       rows={3}
                                       placeholder="Suministra la regla gramatical exacta o respuesta preestablecida que el tutor deba usar..."
                                       className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-xs leading-relaxed outline-none focus:border-[#38BDF8]/40 resize-none"
                                     />
                                  </div>
                                  <div className="md:col-span-2 space-y-2">
                                     <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Ejemplo Ilustrativo</label>
                                     <textarea 
                                       value={ruleExample}
                                       onChange={(e) => setRuleExample(e.target.value)}
                                       rows={2}
                                       placeholder="Escribe un ejemplo de uso claro..."
                                       className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-[#DEFF9A] text-xs leading-relaxed outline-none focus:border-[#38BDF8]/40 resize-none italic"
                                     />
                                  </div>
                               </div>

                               <div className="flex justify-end gap-3 pt-2">
                                  <button 
                                    type="button"
                                    onClick={() => setIsRuleFormOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-[9px] font-black uppercase tracking-widest hover:bg-white/10"
                                  >
                                     Cancelar
                                  </button>
                                  <button 
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-[#38BDF8] text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90"
                                  >
                                     Guardar Directriz
                                  </button>
                               </div>
                            </motion.form>
                         )}

                         {loadingRules ? (
                            <div className="p-12 text-center text-white/40 uppercase text-[9px] font-black tracking-widest animate-pulse">
                               Conectando con Firestore y cargando reglas del Tutor...
                            </div>
                         ) : tutorRules.length === 0 ? (
                            <div className="p-12 rounded-3xl border border-dashed border-white/5 text-center flex flex-col items-center justify-center gap-4">
                               <Database size={32} className="text-white/20" />
                               <div>
                                  <h4 className="text-white/60 text-xs font-black uppercase">Base de Conocimiento Vacía</h4>
                                  <p className="text-white/30 text-[9px] font-bold uppercase tracking-wide mt-1">
                                     Haz clic en "Cargar Reglas Demo" para inicializar automáticamente la base de datos con reglas para Weeks 4 e inglés cotidiano.
                                  </p>
                               </div>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 gap-4">
                               {tutorRules.map((rule) => (
                                  <div 
                                    key={rule.id} 
                                    className="p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col md:flex-row justify-between gap-4 hover:border-white/10 transition-all group"
                                  >
                                     <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                           <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                           <h4 className="text-white font-black text-sm uppercase tracking-tight">{rule.topic}</h4>
                                           <span className="px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[7px] font-black uppercase tracking-widest">
                                              Pedagogía Oficial
                                           </span>
                                        </div>
                                        <p className="text-white/80 text-xs leading-relaxed font-semibold">
                                           {rule.content}
                                        </p>
                                        {rule.example && (
                                           <div className="p-3 rounded-xl bg-white/5 border-l-2 border-[#DEFF9A]">
                                              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Ejemplo Práctico:</p>
                                              <p className="text-xs text-[#DEFF9A] font-bold italic">{rule.example}</p>
                                           </div>
                                        )}
                                        {rule.keywords && rule.keywords.length > 0 && (
                                           <div className="flex flex-wrap gap-1.5">
                                              {rule.keywords.map((key, i) => (
                                                 <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-white/30 text-[8px] font-mono font-bold lowercase">
                                                    #{key}
                                                 </span>
                                              ))}
                                           </div>
                                        )}
                                     </div>

                                     <div className="flex md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                                        <button 
                                          type="button"
                                          onClick={() => {
                                             setEditingRule(rule);
                                             setRuleTopic(rule.topic);
                                             setRuleKeywords(rule.keywords ? rule.keywords.join(', ') : '');
                                             setRuleContent(rule.content);
                                             setRuleExample(rule.example || '');
                                             setIsRuleFormOpen(true);
                                          }}
                                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white flex items-center justify-center"
                                        >
                                           <Edit3 size={12} />
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => handleDeleteRule(rule.id)}
                                          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-red-400 flex items-center justify-center"
                                        >
                                           <Trash2 size={12} />
                                        </button>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}
                      </div>
                   </GlassCard>
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {/* Floating Save Bar */}
       <AnimatePresence>
          {isDirty && (
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-8"
            >
               <div className="bg-[#38BDF8] rounded-[2rem] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(56,189,248,0.3)]">
                  <div className="flex items-center gap-4 px-4 text-white">
                     <Save size={20} />
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Cambios detectados</p>
                        <p className="text-[8px] font-bold opacity-80">Guarda para aplicar en tu credencial digital</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => {
                          setLocalUser(currentUser!);
                          setIsDirty(false);
                       }}
                       className="px-6 py-3 rounded-2xl bg-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all font-bold"
                     >
                        Descartar
                     </button>
                     <button 
                       onClick={handleSave}
                       className="px-8 py-3 rounded-2xl bg-white text-[#38BDF8] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl font-bold"
                     >
                        Guardar Perfil
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
