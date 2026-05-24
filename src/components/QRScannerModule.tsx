/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Camera,
  Activity,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5Qrcode } from 'html5-qrcode';
import { GlassCard } from './GlassCard';

interface LastRecord {
  name: string;
  photo: string;
  time: string;
  status: 'SUCCESS' | 'DUPLICATE' | 'ERROR';
}

interface QRScannerModuleProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

export function QRScannerModule({ onScanSuccess, onClose }: QRScannerModuleProps) {
  const [scannerStatus, setScannerStatus] = useState<'IDLE' | 'SCANNING' | 'DETECTED' | 'ERROR'>('IDLE');
  const [lastRecord, setLastRecord] = useState<LastRecord | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [scannedData, setScannedData] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader-container";

  // Audio Feedback
  const playBeep = (type: 'success' | 'warning' | 'error') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'success') {
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
      } else {
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn("Audio feedback not supported or blocked", e);
    }
  };

  const startScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
    }

    const html5QrCode = new Html5Qrcode(containerId);
    scannerRef.current = html5QrCode;
    setScannerStatus('SCANNING');

    try {
      await html5QrCode.start(
        { facingMode: cameraFacing },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanResult(decodedText);
        },
        () => {
          // Failure callback - silent to avoid noise
        }
      );
    } catch (err) {
      console.error("Scanner start error", err);
      setScannerStatus('ERROR');
    }
  };

  const handleScanResult = (data: string) => {
    if (scannedData === data) return; // Prevent double trigger in short time

    setScannedData(data);
    setScannerStatus('DETECTED');
    playBeep('success');

    // Simulate database check
    const isDuplicate = Math.random() > 0.8;
    
    setTimeout(() => {
      if (isDuplicate) {
        setLastRecord({
          name: "IDENTIDAD DETECTADA",
          photo: "https://i.pravatar.cc/150?u=err",
          time: new Date().toLocaleTimeString(),
          status: 'DUPLICATE'
        });
        playBeep('warning');
      } else {
        setLastRecord({
          name: "JUAN PÉREZ (ROD-102)",
          photo: "https://i.pravatar.cc/150?u=1",
          time: new Date().toLocaleTimeString(),
          status: 'SUCCESS'
        });
        onScanSuccess(data);
      }
      
      // Reset for next scan after a pause
      setTimeout(() => {
        setScannerStatus('SCANNING');
        setScannedData(null);
      }, 2000);
    }, 500);
  };

  const toggleCamera = () => {
    setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleFlash = async () => {
    if (scannerRef.current) {
      try {
        const track = scannerRef.current.getRunningTrack();
        if (track && track.getCapabilities().torch) {
          await track.applyConstraints({
            advanced: [{ torch: !isFlashOn } as any]
          });
          setIsFlashOn(!isFlashOn);
        }
      } catch (e) {
        console.warn("Flash control not supported", e);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [cameraFacing]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#061a1a]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Background Tech Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #DEFF9A 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Header Controls */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A] flex items-center justify-center text-[#061a1a] shadow-[0_0_20px_#DEFF9A]">
              <Camera size={24} />
           </div>
           <div>
              <h2 className="text-white text-xl font-black uppercase tracking-tighter">QR SCAN MODE</h2>
              <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em]">Sesión de Registro Activa</p>
           </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all"
        >
           <X size={24} />
        </button>
      </div>

      {/* Main Scanner Container */}
      <div className="relative w-full max-w-4xl flex items-center justify-center gap-12">
         
         {/* LEFT HUD: STATUS */}
         <div className="hidden lg:flex flex-col gap-6 w-64">
            <GlassCard title="SYSTEM STATUS" icon={Activity} accent="cyan" className="!p-6">
               <div className="space-y-4">
                  <div>
                     <p className="text-white/20 text-[8px] font-black uppercase mb-1">Cámara Inmersiva</p>
                     <p className={`text-[10px] font-black uppercase tracking-widest ${scannerStatus === 'SCANNING' ? 'text-[#DEFF9A]' : 'text-white/40'}`}>
                        {scannerStatus === 'SCANNING' ? ' BUSCANDO QR...' : scannerStatus === 'DETECTED' ? '¡DETECTADO!' : 'INICIALIZANDO...'}
                     </p>
                  </div>
                  <div>
                     <p className="text-white/20 text-[8px] font-black uppercase mb-1">Precisión Lente</p>
                     <p className="text-white text-[10px] font-black uppercase tracking-widest">100% ROD-OPTIMIZED</p>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                     <p className="text-white/20 text-[8px] font-black uppercase mb-1">Luz Ambiente</p>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ['40%', '60%', '45%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-full bg-cyan-400"
                        />
                     </div>
                  </div>
               </div>
            </GlassCard>
         </div>

         {/* SCANNER VIEWPORT */}
         <div className="relative">
            {/* The actual camera layer */}
            <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] rounded-[3.5rem] border-4 border-white/10 overflow-hidden bg-black shadow-[0_0_100px_rgba(0,0,0,0.5)]">
               <div id={containerId} className="w-full h-full object-cover grayscale-[0.3] brightness-[0.8]" />
               
               {/* Vision Nocturna Effect */}
               <div className="absolute inset-0 pointer-events-none bg-[#4ADE80]/5 mix-blend-overlay" />
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/40" />

               {/* Focus Target */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`relative w-64 h-64 border-2 border-dashed transition-all duration-500 ${
                    scannerStatus === 'DETECTED' ? 'border-[#DEFF9A] scale-105 shadow-[0_0_50px_#DEFF9A]' : 'border-white/20'
                  }`}>
                     {/* Animated Corners */}
                     <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#DEFF9A]" />
                     <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#DEFF9A]" />
                     <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#DEFF9A]" />
                     <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#DEFF9A]" />

                     {/* Scanning Line */}
                     <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-1 bg-[#DEFF9A] shadow-[0_0_20px_#DEFF9A] opacity-50 z-20"
                     />
                  </div>
               </div>
            </div>

            {/* Float Feedback Card */}
            <AnimatePresence>
               {scannerStatus === 'DETECTED' && lastRecord && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20, scale: 0.8 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: -20, scale: 0.8 }}
                   className={`absolute -top-20 left-1/2 -translate-x-1/2 px-8 py-4 rounded-3xl border flex items-center gap-4 backdrop-blur-2xl whitespace-nowrap z-50 ${
                     lastRecord.status === 'SUCCESS' ? 'bg-[#4ADE80] text-[#061a1a] border-[#4ADE80]' : 'bg-[#FBBF24] text-[#061a1a] border-[#FBBF24]'
                   }`}
                 >
                    {lastRecord.status === 'SUCCESS' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                    <span className="text-sm font-black uppercase tracking-tight">
                       {lastRecord.status === 'SUCCESS' ? `¡ASISTENCIA REGISTRADA: ${lastRecord.name}!` : `REGISTRO PREVIO DETECTADO`}
                    </span>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Bottom Controls */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6">
               <button 
                onClick={toggleFlash}
                className={`w-14 h-14 rounded-3xl border flex items-center justify-center transition-all ${
                  isFlashOn ? 'bg-[#DEFF9A] text-[#061a1a] border-[#DEFF9A] shadow-[0_0_20px_#DEFF9A]' : 'bg-white/5 text-white/30 border-white/10'
                }`}
               >
                  <Zap size={24} fill={isFlashOn ? "currentColor" : "none"} />
               </button>
               <button 
                onClick={toggleCamera}
                className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all"
               >
                  <RefreshCw size={24} />
               </button>
            </div>
         </div>

         {/* RIGHT HUD: LAST LOG */}
         <div className="hidden lg:flex flex-col gap-6 w-64">
            <GlassCard title="ÚLTIMO REGISTRO" icon={UserCheck} accent="green" className="!p-6">
               {lastRecord ? (
                 <motion.div 
                   key={lastRecord.time}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="space-y-4"
                 >
                    <div className="flex items-center gap-4">
                       <img src={lastRecord.photo} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                       <div className="min-w-0">
                          <p className="text-white text-[10px] font-black uppercase truncate">{lastRecord.name}</p>
                          <p className="text-[#DEFF9A] text-[8px] font-bold mt-1 uppercase tracking-widest">{lastRecord.time}</p>
                       </div>
                    </div>
                    <div className={`p-3 rounded-xl border text-[8px] font-black uppercase tracking-widest text-center ${
                      lastRecord.status === 'SUCCESS' ? 'bg-[#4ADE80]/10 border-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#FBBF24]/10 border-[#FBBF24]/20 text-[#FBBF24]'
                    }`}>
                       {lastRecord.status === 'SUCCESS' ? 'VALIDADO EXITOSO' : 'CONFLICTO: RE-SCANNED'}
                    </div>
                 </motion.div>
               ) : (
                 <div className="flex flex-col items-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4 text-white/10">
                       <Activity size={20} />
                    </div>
                    <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                       Esperando primer reconocimiento...
                    </p>
                 </div>
               )}
            </GlassCard>
         </div>
      </div>
    </motion.div>
  );
}
