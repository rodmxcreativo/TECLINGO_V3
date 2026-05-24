/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Key, 
  Calendar, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Users,
  Building2,
  AlertTriangle,
  Lock,
  Unlock,
  Check,
  Trash,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../context/AppContext';
import { Institution } from '../context/AppContext';

export function RegistryControl() {
  const { currentInstitution, currentUser, logActivity } = useAppContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showQueue, setShowQueue] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [isSystemFrozen, setIsSystemFrozen] = useState(false);

  // Initialize a robust local institution state to always display content in both Demo and Cloud modes
  const [localInst, setLocalInst] = useState<Institution>(() => {
    if (currentInstitution) {
      return currentInstitution;
    }
    // Retrieve cached or fall back to a beautifully seeded default
    const saved = localStorage.getItem('tecnolingo_local_institution');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    const defaultInst: Institution = {
      id: 'IT-CELAYA-2026',
      name: 'Instituto Tecnológico de Celaya',
      directorId: currentUser?.id || 'MOCK-USER-123',
      registrationCode: 'INST-ITCEL-9034',
      codeExpirationDate: '2026-06-15T00:00:00.000Z',
      isRegistrationActive: true,
      createdAt: new Date().toISOString(),
      licenseStatus: 'ACTIVE',
    };
    localStorage.setItem('tecnolingo_local_institution', JSON.stringify(defaultInst));
    return defaultInst;
  });

  // Admission Queue simulation state
  const [queueItems, setQueueItems] = useState([
    { id: 'req-1', name: 'Mtro. Alejandro Ramos', role: 'DOCENTE', department: 'Sistemas y Electromecánica', date: 'Hace 5 min' },
    { id: 'req-2', name: 'Dra. Elvia Sánchez', role: 'DOCENTE', department: 'Ciencias Básicas', date: 'Hace 12 min' },
    { id: 'req-3', name: 'Ing. Carlos Mendoza', role: 'DOCENTE', department: 'Ingeniería Química', date: 'Ayer' },
    { id: 'req-4', name: 'Lic. Fabiola Reyes', role: 'DOCENTE', department: 'Económico-Administrativo', date: 'Hace 2 días' },
  ]);

  // Sync state if context loads custom cloud institution
  useEffect(() => {
    if (currentInstitution) {
      setLocalInst(currentInstitution);
      localStorage.setItem('tecnolingo_local_institution', JSON.stringify(currentInstitution));
    }
  }, [currentInstitution]);

  // Setup toast auto-dismiss
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Universal updater that keeps both UI, localStorage, and Firestore in sync
  const updateInstitutionData = async (updatedFields: Partial<Institution>) => {
    setIsUpdating(true);
    const updated = { ...localInst, ...updatedFields };
    setLocalInst(updated);
    localStorage.setItem('tecnolingo_local_institution', JSON.stringify(updated));

    const instId = currentUser?.institutionId || currentInstitution?.id || localInst.id;

    if (instId && db) {
      try {
        await updateDoc(doc(db, 'institutions', instId), updatedFields);
        console.log("Firestore sync success for: ", updatedFields);
      } catch (error) {
        console.warn("Firestore update skipped (operating in local/demo mode):", error);
      }
    }
    
    // Log the security action in audit logs
    if (logActivity) {
      await logActivity('REGISTRY_ACCESS_SECURITY', updatedFields);
    }
    
    setIsUpdating(false);
  };

  const handleToggleActive = async () => {
    const nextState = !localInst.isRegistrationActive;
    await updateInstitutionData({ isRegistrationActive: nextState });
    setSuccessMsg(nextState ? '¡Inscripciones habilitadas para nuevos docentes!' : '¡Registro congelado! Nadie podrá ingresar con el ID temporal.');
  };

  const handleRotateCode = async () => {
    const randomSegment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomSegment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `INST-CE${randomSegment1}-${randomSegment2}`;
    await updateInstitutionData({ registrationCode: newCode });
    setSuccessMsg(`Código de vinculación rotado con éxito: ${newCode}`);
  };

  const handleCopy = () => {
    const targetId = currentUser?.institutionId || localInst.id;
    navigator.clipboard.writeText(targetId);
    setCopied(true);
    setSuccessMsg('¡ID único copiado al portapapeles!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateDeadline = (newDate: string) => {
    updateInstitutionData({ codeExpirationDate: newDate });
    setShowDeadlinePicker(false);
    const formattedDate = new Date(newDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    setSuccessMsg(`Plazo de vigencia académico actualizado al: ${formattedDate}`);
  };

  const handleApproveQueue = (id: string, name: string) => {
    setQueueItems(prev => prev.filter(item => item.id !== id));
    setSuccessMsg(`Petición aprobada: ${name} ya puede acceder al sistema.`);
    if (logActivity) {
      logActivity('REGISTRY_QUEUE_APPROVE', { id, name });
    }
  };

  const handleRejectQueue = (id: string, name: string) => {
    setQueueItems(prev => prev.filter(item => item.id !== id));
    setSuccessMsg(`Petición rechazada y revocada para: ${name}`);
    if (logActivity) {
      logActivity('REGISTRY_QUEUE_REJECT', { id, name });
    }
  };

  const handleEmergencyFreezeState = () => {
    if (isSystemFrozen) {
      setIsSystemFrozen(false);
      updateInstitutionData({ licenseStatus: 'ACTIVE' });
      setSuccessMsg('¡Protocolo de emergencia levantado! El sistema vuelve a operar.');
    } else {
      setIsSystemFrozen(true);
      updateInstitutionData({ licenseStatus: 'SUSPENDED' });
      setSuccessMsg('⚠️ ¡SISTEMA CONGELADO! Se han desactivado todas las vinculaciones temporales de inmediato.');
    }
  };

  const getStatusColor = () => {
    if (isSystemFrozen || localInst.licenseStatus === 'SUSPENDED') {
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    }
    if (!localInst.isRegistrationActive) {
      return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    }
    return 'text-[#DEFF9A] bg-[#DEFF9A]/10 border-[#DEFF9A]/20';
  };

  const formattedExpiration = localInst.codeExpirationDate
    ? new Date(localInst.codeExpirationDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'No asignada';

  return (
    <div className="space-y-12">
      {/* Dynamic Alert Banner for Freeze mode */}
      <AnimatePresence>
        {isSystemFrozen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-500/15 border-2 border-red-500/30 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-center justify-between"
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="p-3 rounded-xl bg-red-500/20 text-red-500 animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="text-red-400 font-black text-xs uppercase tracking-wider">MODO CONGELACIÓN ACTIVO</h4>
                <p className="text-white/60 text-[10px] mt-1 leading-relaxed">Las vinculaciones escolares, registros y solicitudes entrantes han sido congeladas para proteger los datos institucionales.</p>
              </div>
            </div>
            <button 
              onClick={handleEmergencyFreezeState}
              className="px-5 py-3 rounded-xl bg-red-500 text-white font-black text-[9px] tracking-widest uppercase hover:bg-red-600 transition-colors shrink-0"
            >
              Desactivar Alerta
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Protocolos de Acceso</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            REGISTRY <span className="text-[#DEFF9A]">CONTROL</span>
          </h1>
          <p className="text-white/40 text-[10px] uppercase font-bold mt-2 flex items-center gap-2">
            <Building2 size={12} className="text-[#DEFF9A]" /> {localInst.name}
          </p>
        </div>

        {/* Success toast notification */}
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="bg-[#061a1a] border border-[#DEFF9A]/20 shadow-[0_4px_30px_rgba(222,255,154,0.15)] text-white p-4 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-3 max-w-sm"
            >
              <div className="w-2 h-2 rounded-full bg-[#DEFF9A] animate-ping" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Control Card */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <GlassCard className="!p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <ShieldAlert size={120} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
               <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-4 ${getStatusColor()}`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${isSystemFrozen ? 'bg-red-500 animate-none' : localInst.isRegistrationActive ? 'bg-[#DEFF9A] animate-pulse' : 'bg-orange-400'}`} />
                     {isSystemFrozen ? 'SISTEMA BLOQUEADO' : localInst.isRegistrationActive ? 'Inscripciones Abiertas' : 'Registro Temporal Congelado'}
                  </div>
                  <h3 className="text-white text-3xl font-black uppercase tracking-tight">CÓDIGO DE <br/><span className="text-white/20">VINCULACIÓN</span></h3>
               </div>
               
               <button 
                 onClick={handleToggleActive}
                 disabled={isUpdating || isSystemFrozen}
                 className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   isSystemFrozen ? 'bg-white/5 text-white/25 border border-white/10 cursor-not-allowed' :
                   localInst.isRegistrationActive 
                     ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500 hover:text-black' 
                     : 'bg-[#DEFF9A] text-[#061a1a] shadow-[0_0_30px_rgba(222,255,154,0.3)] hover:scale-105'
                 }`}
               >
                  {isSystemFrozen ? 'Cerrado por Emergencia' : localInst.isRegistrationActive ? 'Cerrar Inscripciones' : 'Abrir Registro'}
               </button>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#DEFF9A]/10 border-2 border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] shadow-inner shrink-0">
                     <Key size={32} />
                  </div>
                  <div className="min-w-0">
                     <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">ID Único de Institución</p>
                     <p className="text-white text-base md:text-2xl font-black tracking-[0.1em] uppercase truncate">{currentUser?.institutionId || localInst.id}</p>
                     <p className="text-white/20 text-[9px] uppercase font-bold mt-1">Código de Acceso Docente: <span className="text-[#DEFF9A] tracking-wider">{localInst.registrationCode}</span></p>
                  </div>
               </div>

               <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
                  <button 
                    onClick={handleCopy}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                     {copied ? <CheckCircle2 size={16} className="text-[#DEFF9A]" /> : <Copy size={16} />}
                     {copied ? 'Copiado' : 'Copiar ID'}
                  </button>
                  <button 
                    onClick={handleRotateCode}
                    disabled={isUpdating || isSystemFrozen}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] hover:bg-[#DEFF9A] hover:text-[#061a1a] transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <RefreshCw size={16} className={isUpdating ? 'animate-spin' : ''} />
                     Rotar Código
                  </button>
               </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-6">
               <ShieldAlert className="text-orange-400 shrink-0" size={24} />
               <p className="text-orange-200/60 text-[10px] font-bold leading-relaxed">
                  <span className="text-orange-400 font-black">ADVERTENCIA DE SEGURIDAD:</span> Al cambiar el código de vinculación docente o congelar las inscripciones, cualquier aspirante que intente adjuntar este id a su perfil escolar quedará retenido. Los docentes ya validados no perderán su acceso de forma retroactiva.
               </p>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <GlassCard className="!p-8">
                <div className="flex items-center gap-4 mb-6 text-white/40">
                   <Key size={16} className="text-[#DEFF9A]" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Master License Status</p>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-white/20 text-[10px] font-bold uppercase">Estado:</span>
                      <span className={`text-xs font-black uppercase ${isSystemFrozen ? 'text-red-500' : 'text-[#DEFF9A]'}`}>{isSystemFrozen ? 'SUSPENDIDA' : localInst.licenseStatus}</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-white/20 text-[10px] font-bold uppercase">Proveedor:</span>
                      <span className="text-white text-xs font-black uppercase">TecnoLingo Core S.A.</span>
                   </div>
                   <p className="text-[8px] text-white/20 uppercase font-bold italic leading-relaxed">La licencia autoriza hasta 150 docentes conectados en tiempo real.</p>
                </div>
             </GlassCard>

             <GlassCard className="!p-8">
                <div className="flex items-center gap-4 mb-6 text-white/40">
                   <Clock size={16} className="text-[#DEFF9A]" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Cronología de Vigencia</p>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-white/20 text-[10px] font-bold uppercase">Ciclo Escolar:</span>
                      <span className="text-white text-xs font-black uppercase">Semestre 2026-A</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-white/20 text-[10px] font-bold uppercase">Expiración:</span>
                      <span className="text-[#DEFF9A] text-xs font-black uppercase">{formattedExpiration}</span>
                   </div>

                   {showDeadlinePicker ? (
                     <div className="pt-2 flex flex-col gap-2">
                       <p className="text-white/50 text-[8px] font-black uppercase tracking-wider">Ajustar Plazo:</p>
                       <div className="grid grid-cols-3 gap-2">
                         {['2026-06-15T00:00:00.000Z', '2026-07-31T00:00:00.000Z', '2026-08-31T00:00:00.000Z'].map((d) => {
                           const label = new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
                           return (
                             <button
                               key={d}
                               type="button"
                               onClick={() => handleUpdateDeadline(d)}
                               className="py-2 bg-white/5 hover:bg-[#DEFF9A]/10 text-white hover:text-[#DEFF9A] text-[9px] font-bold uppercase rounded-lg border border-white/10"
                             >
                               {label}
                             </button>
                           );
                         })}
                       </div>
                       <button 
                         type="button" 
                         onClick={() => setShowDeadlinePicker(false)}
                         className="text-[8px] uppercase underline text-white/40 text-left mt-1"
                       >
                         Cancelar
                       </button>
                     </div>
                   ) : (
                     <button 
                       onClick={() => setShowDeadlinePicker(true)}
                       className="w-full py-4 mt-2 text-[8px] font-black uppercase tracking-[0.3em] text-[#DEFF9A] border border-[#DEFF9A]/20 rounded-xl hover:bg-[#DEFF9A]/10 transition-colors"
                     >
                        Modificar Plazo Académico
                     </button>
                   )}
                </div>
             </GlassCard>

             <GlassCard className="!p-8 hover:border-cyan-400/20 transition-all group col-span-1 md:col-span-2">
                <div className="flex items-center justify-between gap-4 mb-4 text-white/40">
                   <div className="flex items-center gap-4">
                      <Users size={16} className="text-cyan-400" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Aspirantes por Validar</p>
                   </div>
                   <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-full text-[9px] font-black uppercase tracking-wider">
                     {queueItems.length} Solicitudes
                   </span>
                </div>
                <div className="space-y-4">
                   <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider leading-relaxed">Peticiones de acceso filtradas por algoritmos de proximidad institucional.</p>
                   
                   <button 
                     onClick={() => setShowQueue(!showQueue)}
                     className="flex items-center gap-2 text-cyan-400 text-[10px] font-black hover:underline underline-offset-4 decoration-2 decoration-cyan-400/20 uppercase"
                   >
                      {showQueue ? 'Ocultar cola de admisión' : 'Ver cola de admisión'} 
                      {showQueue ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                   </button>

                   <AnimatePresence>
                     {showQueue && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                       >
                         {queueItems.length === 0 ? (
                           <p className="text-white/30 text-[9px] uppercase font-black italic">No hay solicitudes pendientes en este momento.</p>
                         ) : (
                           <div className="divide-y divide-white/5 max-h-[250px] overflow-y-auto pr-3 space-y-3">
                             {queueItems.map((item) => (
                               <div key={item.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                 <div>
                                   <div className="flex items-center gap-2">
                                     <p className="text-white font-black text-xs">{item.name}</p>
                                     <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] text-white/50 uppercase font-black tracking-widest">{item.role}</span>
                                   </div>
                                   <p className="text-white/30 text-[9.5px] font-semibold mt-0.5">{item.department} • <span className="text-white/20 italic">{item.date}</span></p>
                                 </div>
                                 <div className="flex items-center gap-2 self-end sm:self-center">
                                   <button 
                                     onClick={() => handleRejectQueue(item.id, item.name)}
                                     className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500 hover:bg-red-500/5 rounded-xl transition"
                                     title="Rechazar"
                                   >
                                     <XCircle size={14} />
                                   </button>
                                   <button 
                                     onClick={() => handleApproveQueue(item.id, item.name)}
                                     className="px-4 py-2 bg-[#DEFF9A] text-[#061a1a] text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.03] transition-transform flex items-center gap-1.5"
                                   >
                                     <Check size={12} /> Validar Acceso
                                   </button>
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
             </GlassCard>
          </div>
        </div>

        {/* Sidebar Help */}
        <div className="xl:col-span-4 space-y-8">
           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 relative overflow-hidden">
               <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#DEFF9A]/10 blur-[50px] rounded-full" />
               <h4 className="text-white text-lg font-black uppercase italic mb-6">Guía de <span className="text-[#DEFF9A]">Seguridad</span></h4>
               
               <ul className="space-y-6 flex flex-col justify-between">
                  {[
                    { title: 'Diferencia ID vs Código', text: 'El ID es permanente e inviolable para tu base de datos institucional. El código de vinculación es temporal y expira para salvaguardar el registro.' },
                    { title: 'Rotación Periódica', text: 'Se recomienda alternar el código de vinculación docente al inicio de cada ciclo escolar o trimestralmente.' },
                    { title: 'Inscripciones Congeladas', text: 'Al cerrar el registro, previenes que accesos externos o personas no autorizadas sigan vinculándose a tu portal académico.' }
                  ].map((tip, i) => (
                    <li key={i} className="space-y-2">
                       <p className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DEFF9A]" />
                          {tip.title}
                       </p>
                       <p className="text-white/40 text-[10px] leading-relaxed font-bold">
                          {tip.text}
                       </p>
                    </li>
                  ))}
               </ul>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20">
              <h4 className="text-orange-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-center">Protocolo de Emergencia</h4>
              <button 
                onClick={handleEmergencyFreezeState}
                className={`w-full py-5 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all ${
                  isSystemFrozen 
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10 hover:scale-105' 
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 hover:scale-105'
                }`}
              >
                 {isSystemFrozen ? 'RESTAURAR ACCESOS ⚡' : 'CONGELAR TODO EL SISTEMA ❄️'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
