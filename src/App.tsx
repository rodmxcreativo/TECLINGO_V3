/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserSettings } from './components/UserSettings';
import { DocenteMainboard } from './components/DocenteMainboard';
import { AlumnoMainboard } from './components/AlumnoMainboard';
import { DirectivoMainboard } from './components/DirectivoMainboard';
import { SuperAdminMainboard } from './components/SuperAdminMainboard';
import { CommitmentModal } from './components/CommitmentModal';
import { AuthPortal } from './components/AuthPortal';
import { UserRole } from './components/MasterSwitcher';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import { ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

export default function App() {
  const { maintenanceMode, currentRole, setCurrentRole, currentUser } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check local storage for last session
    const lastSession = localStorage.getItem('tecnolingo_session');
    if (lastSession) {
      setIsAuthenticated(true);
    }

    // Define global logout function
    (window as any).tecnolingoLogout = () => {
      localStorage.removeItem('tecnolingo_session');
      setIsAuthenticated(false);
    };
  }, []);

  const handleLogin = (role: UserRole) => {
    localStorage.setItem('tecnolingo_session', role);
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthPortal onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-[#061a1a] text-white font-sans selection:bg-[#DEFF9A] selection:text-black overflow-hidden relative">
      <AnimatePresence>
        {!currentUser?.hasAcceptedTerms && isAuthenticated && currentUser?.role && currentUser.role !== 'SUPERADMIN' && (
          <CommitmentModal />
        )}
        {maintenanceMode && currentRole === 'ALUMNO' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-[#061a1a]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
          >
             <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                <AlertTriangle size={48} />
             </div>
             <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">
                SISTEMA EN <span className="text-red-500">MANTENIMIENTO</span>
             </h1>
             <p className="max-w-md text-white/40 text-sm font-medium leading-relaxed">
                El Director ha iniciado una actualización crítica de infraestructura. El acceso para alumnos está temporalmente restringido para garantizar la integridad de tus datos de ADN.
             </p>
             <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#DEFF9A]/40">
                <Zap size={14} fill="currentColor" />
                <span>Protocolo Tecnolingo AI Hub v2.4</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentRole === 'SUPERADMIN' ? (
          <motion.div 
            key="superadmin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuperAdminMainboard />
          </motion.div>
        ) : currentRole === 'DOCENTE' ? (
          <motion.div 
            key="docente"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DocenteMainboard currentRole={currentRole} onRoleChange={setCurrentRole} />
          </motion.div>
        ) : currentRole === 'ALUMNO' ? (
          <motion.div 
            key="alumno"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlumnoMainboard currentRole={currentRole} onRoleChange={setCurrentRole} />
          </motion.div>
        ) : (
          <motion.div 
            key="director"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DirectivoMainboard currentRole={currentRole} onRoleChange={setCurrentRole} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


