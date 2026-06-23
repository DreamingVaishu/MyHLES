import React from 'react';
import { Lock } from 'lucide-react';

interface SecuritySettingsProps {
  onUpdateSecuritySettings: (e: React.FormEvent) => void;
}

export default function SecuritySettings({ onUpdateSecuritySettings }: SecuritySettingsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-xl mx-auto space-y-6 animate-in">
      <div>
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1.5">
          <Lock className="w-5 h-5 text-emerald-500" />
          <span>Root Cybersecurity Compliance Console</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1 block">Root credentials configures SSL triggers and supervisor override clearances.</p>
      </div>

      <form onSubmit={onUpdateSecuritySettings} className="space-y-4 font-bold text-xs uppercase text-slate-700">
        <div>
          <label className="block mb-1.5">Superintendent Login</label>
          <input 
            type="text" 
            defaultValue="myhles-admin"
            className="w-full text-slate-850 border rounded text-xs p-2.5 outline-none bg-slate-50 focus:bg-white" 
            required
          />
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 leading-normal font-sans font-semibold mb-4">
          Warning: Altering session lifecycle parameters requires authorized security token checkbacks.
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5">Session Lifespan limit</label>
            <select className="w-full text-slate-800 border rounded text-xs p-2.5 bg-slate-50">
              <option>15 Minutes Only (Strict)</option>
              <option>1 Hour (Normal)</option>
              <option>24 Hours (Low security)</option>
            </select>
          </div>
          <div>
            <label className="block mb-1.5">Allowed login retries</label>
            <select className="w-full text-slate-800 border rounded text-xs p-2.5 bg-slate-50">
              <option>3 attempts block (Authorized)</option>
              <option>5 attempts check</option>
              <option>Unlimited (Not recommended)</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800 text-xs py-2.5 rounded cursor-pointer duration-150"
        >
          Update Security Protocol Sync
        </button>
      </form>
    </div>
  );
}
