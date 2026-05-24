/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Zap, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Key, 
  Plus, 
  Search, 
  ArrowRight,
  TrendingUp,
  Activity,
  LogOut,
  LayoutGrid,
  Building2
} from 'lucide-react';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../context/AppContext';

export function SuperAdminMainboard() {
  const [stats, setStats] = useState({
    institutions: 0,
    activeLicenses: 0,
    totalRevenue: '45,200',
    uptime: '99.9%'
  });

  const [licenses, setLicenses] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);

  useEffect(() => {
    const unsubLicenses = onSnapshot(collection(db, 'activationCodes'), (snap) => {
      setLicenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubInst = onSnapshot(collection(db, 'institutions'), (snap) => {
      setInstitutions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => {
      unsubLicenses();
      unsubInst();
    };
  }, []);

  const generateLicense = async () => {
    const code = `TECL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    await addDoc(collection(db, 'activationCodes'), {
      code,
      status: 'AVAILABLE',
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    });
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('tecnolingo_session');
    window.location.reload();
  };

  return (
    <div className="h-screen bg-[#051111] text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 h-full border-r border-[#DEFF9A]/10 bg-[#061a1a]/50 p-8 flex flex-col">
         <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A] flex items-center justify-center text-[#061a1a] shadow-[0_0_20px_rgba(222,255,154,0.4)]">
               <Globe size={24} />
            </div>
            <div>
               <h1 className="text-xl font-black italic tracking-tighter">MASTER<span className="text-[#DEFF9A]">PLATE</span></h1>
               <p className="text-[#DEFF9A] text-[8px] font-black uppercase tracking-[0.4em]">Founders Core Access</p>
            </div>
         </div>

         <nav className="space-y-2 flex-1">
            {[
              { icon: LayoutGrid, label: 'Dashboard', active: true },
              { icon: Building2, label: 'Instituciones', active: false },
              { icon: Key, label: 'Licencias / Codes', active: false },
              { icon: CreditCard, label: 'Control Pagos', active: false },
              { icon: Activity, label: 'System Logs', active: false }
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${item.active ? 'bg-[#DEFF9A] text-[#061a1a] shadow-lg shadow-[#DEFF9A]/10' : 'text-white/40 hover:bg-white/5'}`}
              >
                 <item.icon size={16} />
                 {item.label}
              </button>
            ))}
         </nav>

         <button 
           onClick={handleLogout}
           className="mt-auto flex items-center gap-4 p-4 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
         >
            <LogOut size={16} />
            Cerrar Protocolo
         </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(222,255,154,0.05),transparent)] p-12">
         {/* Stats Grid */}
         <div className="grid grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Instituciones', value: institutions.length, icon: Building2, trend: '+2 this week' },
              { label: 'Licencias Activas', value: licenses.filter(l => l.status === 'AVAILABLE').length, icon: Key, trend: '8 pending' },
              { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: TrendingUp, trend: '+15.4%' },
              { label: 'System Uptime', value: stats.uptime, icon: ShieldCheck, trend: 'Verified' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-[#DEFF9A]/20 transition-all">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <stat.icon size={64} />
                 </div>
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                 <h2 className="text-3xl font-black mb-4">{stat.value}</h2>
                 <p className="text-[#DEFF9A] text-[9px] font-bold uppercase tracking-wider">{stat.trend}</p>
              </div>
            ))}
         </div>

         <div className="grid grid-cols-2 gap-12">
            {/* Key Generator Section */}
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase italic tracking-tight">Gestión de <span className="text-[#DEFF9A]">Licencias Maestras</span></h3>
                  <button 
                    onClick={generateLicense}
                    className="flex items-center gap-2 bg-[#DEFF9A] text-[#061a1a] px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                     <Plus size={14} /> Nueva Licencia
                  </button>
               </div>

               <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                  <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                     <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                          placeholder="BUSCAR CÓDIGO MAESTRO..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-6 text-xs text-white uppercase tracking-widest font-black placeholder:text-white/10"
                        />
                     </div>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                     {licenses.map((lic) => (
                       <div key={lic.id} className="p-6 border-b border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#DEFF9A]">
                                <Key size={18} />
                             </div>
                             <div>
                                <p className="text-white text-xs font-black tracking-widest">{lic.code}</p>
                                <p className="text-white/20 text-[9px] font-bold uppercase">Expira: {new Date(lic.expiresAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${lic.status === 'AVAILABLE' ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'bg-red-500/10 text-red-500'}`}>
                             {lic.status}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Institutions Section */}
            <div className="space-y-8">
               <h3 className="text-xl font-black uppercase italic tracking-tight">Hub <span className="text-cyan-400">Institucional</span></h3>
               
               <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden h-[548px]">
                  <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                     <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Institución & Status Pagos</p>
                     <Users size={16} className="text-cyan-400" />
                  </div>
                  <div className="p-4 space-y-4">
                     {institutions.map((inst) => (
                       <div key={inst.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-cyan-400/30 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                                <Building2 size={20} />
                             </div>
                             <div>
                                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">{inst.name}</h4>
                                <p className="text-white/20 text-[8px] font-bold uppercase tracking-wider">ID: {inst.id}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-12">
                             <div className="text-right">
                                <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Pagos</p>
                                <p className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">AL DÍA</p>
                             </div>
                             <ArrowRight size={16} className="text-white/10 group-hover:text-cyan-400 transition-colors" />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
