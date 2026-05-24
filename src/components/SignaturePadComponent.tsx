import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadComponentProps {
  onSave: (signatureData: string) => void;
  onCancel: () => void;
}

export function SignaturePadComponent({ onSave, onCancel }: SignaturePadComponentProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const data = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (data) {
      onSave(data);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4">
      <div className="relative aspect-[2/1] w-full bg-black/40 rounded-3xl border-2 border-dashed border-[#F59E0B]/30 overflow-hidden touch-none">
        <SignatureCanvas 
          ref={sigCanvas}
          penColor="#F59E0B"
          canvasProps={{
            className: "w-full h-full cursor-crosshair"
          }}
        />
        <div className="absolute inset-x-8 bottom-8 h-[2px] bg-[#F59E0B]/20 pointer-events-none" />
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
           <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
           <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-widest opacity-50">Área de Firma Táctil</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={clear}
          className="flex-1 py-4 border border-white/10 rounded-2xl text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
        >
          <Eraser size={14} /> Limpiar Trazo
        </button>
        <button 
          onClick={save}
          className="flex-[2] py-4 bg-[#F59E0B] text-[#061a1a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_#F59E0B60] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Check size={14} /> Confirmar Firma Legal
        </button>
      </div>

      <button 
        onClick={onCancel}
        className="w-full py-2 text-white/20 hover:text-white/40 text-[8px] font-black uppercase tracking-[0.4em] transition-all"
      >
        Cancelar Operación
      </button>
    </div>
  );
}
