import React from 'react';

interface SettingsProps {
  onSave: () => void;
}

export default function Settings({ onSave }: SettingsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto space-y-6 animate-in">
      <div>
        <h3 className="font-bold text-slate-800 text-lg">Teacher Profile Settings</h3>
        <p className="text-xs text-slate-500 mt-1">Configure your personal and security credentials.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input 
              type="text" 
              defaultValue="Teacher"
              className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded text-sm p-2.5 outline-none focus:bg-white focus:outline-[#0B1220]" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Academic Department</label>
            <input 
              type="text" 
              defaultValue="Mathematics Department"
              className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded text-sm p-2.5 outline-none focus:bg-white focus:outline-[#0B1220]" 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Institutional Email</label>
          <input 
            type="email" 
            defaultValue=""
            className="w-full text-slate-400 bg-slate-100 border border-slate-150 rounded text-sm p-2.5 outline-none cursor-not-allowed" 
            disabled 
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Your email was verified during onboarding and cannot be altered directly.</span>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold uppercase text-rose-500 mb-3 tracking-widest">Update Security Password</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded text-sm p-2.5 outline-none focus:bg-white focus:outline-[#0B1220]" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
              <input 
                type="password" 
                placeholder="Enter new pass"
                className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded text-sm p-2.5 outline-none focus:bg-white focus:outline-[#0B1220]" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="mt-6 bg-[#0B1220] hover:bg-slate-800 text-white font-bold text-xs uppercase px-4 py-2.5 rounded cursor-pointer duration-200"
        >
          Save Password & Info
        </button>
      </form>
    </div>
  );
}
