import React, { useState } from 'react';
import { Megaphone, Bell, HelpCircle, X } from 'lucide-react';

interface NavbarProps {
  currentGrade: string;
  currentDiv: string;
  onSendGlobalNotice: (msg: string) => void;
}

export default function Navbar({ currentGrade, currentDiv, onSendGlobalNotice }: NavbarProps) {
  const [globalNoticeOpen, setGlobalNoticeOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');

  const handleGlobalNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeMessage.trim()) return;
    onSendGlobalNotice(noticeMessage);
    setNoticeMessage('');
    setGlobalNoticeOpen(false);
    alert("Global Notice broadcasted successfully to all roles and students!");
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-serif font-black text-slate-900 tracking-wide text-lg">MyHLES</span>
          <span className="text-slate-350 text-xl">/</span>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block leading-none">Faculty Classroom Manager</span>
            <span className="text-sm font-extrabold text-slate-700">
              Grade {currentGrade} - Division {currentDiv}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 font-semibold text-slate-700">
          <button 
            onClick={() => setGlobalNoticeOpen(true)}
            className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors uppercase tracking-wider cursor-pointer border border-transparent"
          >
            <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Send Notice to All</span>
          </button>

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
            onClick={() => alert("Faculty Handbook and portal support is accessible on standard campus desks. For assistance, raise an internal admin memo.")}
            className="p-1 px-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>

          <div className="w-px h-6 bg-slate-250 hidden md:block"></div>

          <div className="items-center gap-2 hidden md:flex">
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-900 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
              TE
            </div>
          </div>
        </div>
      </header>

      {globalNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Broadcast School-Wide Notice</h3>
              </div>
              <button 
                onClick={() => setGlobalNoticeOpen(false)}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleGlobalNoticeSubmit} className="p-6 space-y-4">
              <p className="text-slate-500 text-xs leading-relaxed">
                This broadcast goes global, instantly pushing to all parent mobile widgets, student notice histories, administrative dashboards, and logged notice tables across every department.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Notice Message Body</label>
                <textarea
                  rows={4}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Type global announcement, emergency notification, or holiday declarations here..."
                  className="w-full text-slate-800 text-sm border border-slate-200 rounded p-3 focus:outline-slate-900 resize-none"
                  maxLength={500}
                  required
                ></textarea>
                <span className="text-[10px] text-slate-400 text-right block mt-1">
                  {noticeMessage.length}/500 chars (compliantly limited)
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0B1220] text-emerald-450 hover:opacity-90 font-bold text-sm tracking-wide text-white py-3 rounded hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer duration-200"
              >
                <Megaphone className="w-4 h-4 text-emerald-400" />
                <span>Broadcast System-Wide Notice</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
