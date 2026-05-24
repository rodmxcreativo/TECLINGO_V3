/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Chrome, 
  Terminal, 
  Sparkles,
  Zap,
  Globe,
  LogIn,
  UserPlus,
  Key,
  Hash,
  CheckCircle2,
  Clock,
  IdCard,
  Building2,
  AlertOctagon,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, useAppContext } from '../context/AppContext';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

interface AuthPortalProps {
  onLogin: (role: 'DIRECTOR' | 'DOCENTE' | 'ALUMNO' | 'TUTOR' | 'SUPERADMIN') => void;
}

type OnboardingStep = 'AUTH' | 'ROLE_SELECT' | 'INSTITUTION' | 'REGISTRATION_DETAILS' | 'WELCOME';

const ITSP_CAREERS = [
  "Ingeniería Industrial",
  "Ingeniería en Sistemas Computacionales",
  "Ingeniería en Gestión Empresarial",
  "Ingeniería Petrolera",
  "Ingeniería Electrónica",
  "Ingeniería en Informática",
  "Licenciatura en Contaduría Pública",
  "Maestría en Ingeniería Administrativa"
];

export function AuthPortal({ onLogin }: AuthPortalProps) {
  const { validateInstitutionId, validateCourseLicense, currentUser, saveUserProfile, logActivity } = useAppContext();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<OnboardingStep>('AUTH');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institutionCode, setInstitutionCode] = useState('');
  const [licenseCode, setLicenseCode] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [selectedRole, setSelectedRole] = useState<'DIRECTOR' | 'DOCENTE' | 'ALUMNO'>('ALUMNO');

  // Registration Details
  const [regDetails, setRegDetails] = useState({
    name: '',
    phone: '',
    curp: '',
    controlNumber: '',
    career: ITSP_CAREERS[0],
    module: 1,
    semester: '1ro',
    group: 'A'
  });

  // Hidden SuperAdmin Detection (Alt+Shift+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'S') {
        onLogin('SUPERADMIN');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLogin]);

  // Handle successful auth
  useEffect(() => {
    if (currentUser && step === 'AUTH') {
      if (!currentUser.institutionId && !currentUser.isSuperAdmin) {
        setStep('ROLE_SELECT');
      } else if (currentUser.isSuperAdmin) {
        onLogin('SUPERADMIN');
      } else {
        setStep('WELCOME');
      }
    }
  }, [currentUser, step, onLogin]);

  useEffect(() => {
    if (step === 'WELCOME' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'WELCOME' && countdown === 0) {
      if (currentUser) onLogin(currentUser.role || 'ALUMNO');
    }
  }, [step, countdown, currentUser, onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        setAuthError("VENTANA EMERGENTE BLOQUEADA. Por favor, permite los popups en tu navegador e intenta de nuevo.");
      } else {
        setAuthError(error.message);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDemoMode = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleInstitutionLink = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      if (selectedRole === 'DIRECTOR') {
        const isValid = await validateCourseLicense(licenseCode);
        if (!isValid) {
          setAuthError("LLAVE MAESTRA NO VÁLIDA O YA UTILIZADA");
          return;
        }
        
        const instId = `INST-${Math.random().toString(36).substring(7).toUpperCase()}`;
        if (currentUser) {
          await saveUserProfile({
            ...currentUser,
            institutionId: instId,
            role: 'DIRECTOR'
          });
          await logActivity('INSTITUTION_ACTIVATION', { institutionId: instId, directorId: currentUser.id });
          setStep('WELCOME');
        }
      } else {
        const inst = await validateInstitutionId(institutionCode);
        if (inst && currentUser) {
          if (selectedRole === 'ALUMNO') {
             const isValid = await validateCourseLicense(licenseCode);
             if (!isValid) {
                setAuthError("CÓDIGO DE CURSO NO VÁLIDO O YA UTILIZADO");
                return;
             }
          }
          setStep('REGISTRATION_DETAILS');
        } else {
          setAuthError("ID INSTITUCIONAL NO VÁLIDO O EXPIRADO");
        }
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleFinalRegistration = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      if (currentUser) {
        await saveUserProfile({
          ...currentUser,
          ...regDetails,
          role: selectedRole,
          institutionId: institutionCode,
          registeredAt: new Date().toISOString(),
          hasAcceptedTerms: false
        });
        setStep('WELCOME');
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#061a1a] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(222,255,154,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(222,255,154,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DEFF9A]/05 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
         <div className="flex flex-col justify-center space-y-8 order-2 md:order-1">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-[#DEFF9A]/10 border-2 border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] shadow-[0_0_30px_rgba(222,255,154,0.2)]">
                     <Globe size={32} />
                  </div>
                  <div>
                     <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">TECLINGO<span className="text-[#DEFF9A]"> PRO 1.1</span></h1>
                     <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Identity & Access Terminal</p>
                  </div>
               </div>
               <h2 className="text-white text-3xl font-black uppercase tracking-tight leading-tight">EL INICIO DE TU <br /><span className="text-white/20">MISIÓN LINGÜÍSTICA.</span></h2>
            </motion.div>
         </div>

         <AnimatePresence mode="wait">
            {step === 'AUTH' && (
              <motion.div key="auth" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="order-1 md:order-2">
                 <div className="neo-glass border-[#DEFF9A]/20 rounded-[3rem] p-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                    <div className="flex bg-white/5 p-1.5 rounded-3xl mb-12 relative overflow-hidden">
                       <motion.div animate={{ x: mode === 'login' ? 0 : '100.5%' }} className="absolute inset-y-1.5 left-1.5 w-[48%] bg-[#DEFF9A] rounded-2xl shadow-[0_0_20px_rgba(222,255,154,0.4)]" />
                       <button onClick={() => setMode('login')} className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest ${mode === 'login' ? 'text-[#061a1a]' : 'text-white/40'}`}>LOGIN</button>
                       <button onClick={() => setMode('register')} className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest ${mode === 'register' ? 'text-[#061a1a]' : 'text-white/40'}`}>REGISTRO</button>
                    </div>
                    <button 
                      onClick={handleGoogleLogin} 
                      className="haptic-button w-full py-4 rounded-3xl bg-white text-black text-[11px] font-black uppercase tracking-widest mb-8 flex items-center justify-center gap-4 transition-all"
                    >
                      <Chrome size={20} /> 
                      Google Login
                    </button>
                    <form onSubmit={handleSubmit} className="space-y-6">
                       <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="haptic-input w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white" />
                       <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="haptic-input w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white" />
                       <button className="haptic-button-primary w-full py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em]">{mode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}</button>
                    </form>
                    {authError && <p className="mt-4 text-red-500 text-[10px] uppercase font-black">{authError}</p>}
                 </div>
              </motion.div>
            )}

            {step === 'ROLE_SELECT' && (
              <motion.div key="role" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="order-1 md:order-2">
                 <div className="neo-glass border-cyan-400/20 rounded-[3rem] p-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                    <h3 className="text-[#DEFF9A] text-[11px] font-black tracking-widest uppercase mb-8">Paso 01: Identidad Digital</h3>
                    <div className="space-y-4">
                       {[
                         { id: 'DIRECTOR', icon: Key, label: 'Líder Institucional' },
                         { id: 'DOCENTE', icon: Terminal, label: 'Educador Pro' },
                         { id: 'ALUMNO', icon: Sparkles, label: 'Alumno Nivel 1' }
                       ].map((role) => (
                         <button key={role.id} onClick={() => { setSelectedRole(role.id as any); setStep('INSTITUTION'); }} className="haptic-press w-full flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-[#DEFF9A]/10 transition-all text-left">
                            <role.icon size={20} className="text-[#DEFF9A]" />
                            <span className="text-white text-[11px] font-black uppercase">{role.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}

            {step === 'INSTITUTION' && (
              <motion.div key="inst" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="order-1 md:order-2">
                 <div className="neo-glass border-orange-400/20 rounded-[3rem] p-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                    <h3 className="text-orange-400 text-[11px] font-black tracking-widest uppercase mb-8">Paso 02: Validación</h3>
                    <div className="space-y-6">
                       <input value={institutionCode} onChange={(e) => setInstitutionCode(e.target.value)} placeholder="ID INSTITUCIÓN" className="haptic-input w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white uppercase text-xs font-black" />
                       <input value={licenseCode} onChange={(e) => setLicenseCode(e.target.value)} placeholder="ACTIVATION CODE" className="haptic-input w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white uppercase text-xs font-black" />
                       {authError && <p className="text-red-500 text-[10px] uppercase font-black">{authError}</p>}
                       <button onClick={handleInstitutionLink} className="haptic-button w-full py-6 rounded-3xl bg-white text-black text-[11px] font-black tracking-[0.2em]">VALIDAR & CONTINUAR</button>
                    </div>
                 </div>
              </motion.div>
            )}

            {step === 'REGISTRATION_DETAILS' && (
              <motion.div key="details" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="order-1 md:order-2 col-span-1 md:col-span-2">
                 <div className="neo-glass border-cyan-400/20 rounded-[3rem] p-12 max-w-4xl mx-auto">
                    <h3 className="text-cyan-400 text-[11px] font-black uppercase mb-8">Paso 03: Perfil ITSP</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <input value={regDetails.name} onChange={(e) => setRegDetails({...regDetails, name: e.target.value})} placeholder="Nombre Completo" className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white" />
                           <input value={regDetails.phone} onChange={(e) => setRegDetails({...regDetails, phone: e.target.value})} placeholder="Teléfono" className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white" />
                           <input value={regDetails.curp} onChange={(e) => setRegDetails({...regDetails, curp: e.target.value.toUpperCase()})} placeholder="CURP" className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white uppercase" />
                           <input value={regDetails.controlNumber} onChange={(e) => setRegDetails({...regDetails, controlNumber: e.target.value})} placeholder="Num de Control" className="haptic-input w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white" />
                        </div>
                        <div className="space-y-4">
                           <select value={regDetails.career} onChange={(e) => setRegDetails({...regDetails, career: e.target.value})} className="haptic-input w-full bg-[#0c2525] border border-white/10 rounded-xl py-4 px-6 text-white outline-none">
                              {ITSP_CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                           <div className="flex gap-4">
                              <select value={regDetails.module} onChange={(e) => setRegDetails({...regDetails, module: parseInt(e.target.value)})} className="haptic-input flex-1 bg-[#0c2525] border border-white/10 rounded-xl py-4 px-4 text-white outline-none">
                                 {[1,2,3,4,5,6].map(m => <option key={m} value={m}>Mod {m}</option>)}
                              </select>
                              <select value={regDetails.semester} onChange={(e) => setRegDetails({...regDetails, semester: e.target.value})} className="haptic-input flex-1 bg-[#0c2525] border border-white/10 rounded-xl py-4 px-4 text-white outline-none">
                                 {['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <select value={regDetails.group} onChange={(e) => setRegDetails({...regDetails, group: e.target.value})} className="haptic-input flex-1 bg-[#0c2525] border border-white/10 rounded-xl py-4 px-4 text-white outline-none">
                                 {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(g => <option key={g} value={g}>Grup {g}</option>)}
                              </select>
                           </div>
                           <button onClick={handleFinalRegistration} className="haptic-button-primary w-full py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em]">ACTIVAR MI PROTOCOLO</button>
                        </div>
                     </div>
                 </div>
              </motion.div>
            )}

            {step === 'WELCOME' && (
              <motion.div key="welcome" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="order-1 md:order-2 col-span-1 md:col-span-2 flex flex-col items-center justify-center">
                 <div className="w-[300px] h-[400px] bg-[#0c2525] border border-[#DEFF9A]/20 rounded-[2rem] p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full border-2 border-[#DEFF9A] mb-4 overflow-hidden"><img src={currentUser?.avatar} className="w-full h-full object-cover" /></div>
                    <h4 className="text-[#DEFF9A] text-xl font-black uppercase mb-1">{currentUser?.name}</h4>
                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-8">{currentUser?.role}</p>
                    <div className="w-full mt-auto space-y-2">
                       <p className="text-white/20 text-[8px] font-black uppercase">Protocol AI en:</p>
                       <div className="text-4xl font-black text-white">{countdown}</div>
                    </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </motion.div>
  );
}
