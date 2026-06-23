import React from 'react';
import { Bell, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onSendGlobalNotice?: (msg: string) => void;
}

export default function Navbar({ onSendGlobalNotice }: NavbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <span className="font-serif font-black text-slate-900 tracking-wide text-lg">MyHLES</span>
        <span className="text-slate-350 text-xl">/</span>
        <div className="min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block leading-none">Unified Administration Workspace</span>
          <span className="text-sm font-extrabold text-slate-700">
            System Administration Console
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 font-semibold text-slate-700">
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-500 text-[11px] rounded-full px-3 py-1 font-mono text-xs select-none">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>ST. XAVIER'S CAMPUS</span>
        </div>

        <button 
          onClick={() => alert("No new notifications inside your current security zone.")}
          className="p-1 px-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors relative cursor-pointer"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-2 inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        </button>

        <button 
          onClick={() => alert("Admin Handbook and portal support is accessible on standard campus desks. For assistance, raise an internal admin memo.")}
          className="p-1 px-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4.5 h-4.5" />
        </button>

        <div className="w-px h-6 bg-slate-250 hidden md:block"></div>

        <div className="items-center gap-2 hidden md:flex">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnBBPu43qVgHVWCwgyQeFWB4DPivltD1GWou5HMkiWS5KCXBNihnGJHaKGiEfiDtJ8qTYOHdDTyO30vhL6unFDcJRYRXBt_3FPdgFZWQvGhq9lRA3wsnN-66d-kefGuTsZJ2qQJxISUFvBNx2vmRbmuwjeaSSaQuUhoEjd5r8FVnrkm1a2NYKoEpEZXrOrlD9B1T1plA73f7Xrn-7-HoqyFp93dzkIDqkkpIgQE9_kN71ajy97GxqjpybCrKHVJ0Awn2z0gOZu3nSz" 
            alt="Admin Sarah"
            className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
          />
        </div>
      </div>
    </header>
  );
}
