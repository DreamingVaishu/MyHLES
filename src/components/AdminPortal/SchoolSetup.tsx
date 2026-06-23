import React from 'react';
import { Building } from 'lucide-react';
import { SchoolConfig } from '../../types';

interface SchoolSetupProps {
  schoolConfig: SchoolConfig;
  termName: string;
  onTermNameChange: (name: string) => void;
  systemAlertMessage: string;
  onSystemAlertMessageChange: (message: string) => void;
  onUpdateSchoolSetup: (e: React.FormEvent) => void;
}

export default function SchoolSetup({
  schoolConfig,
  termName,
  onTermNameChange,
  systemAlertMessage,
  onSystemAlertMessageChange,
  onUpdateSchoolSetup
}: SchoolSetupProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto space-y-6 animate-in">
      <div>
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1.5 leading-none">
          <Building className="w-5 h-5 text-emerald-500" />
          <span>Multi-School Hub Specifications</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">Configure systemic variables across the administrative precinct.</p>
      </div>

      <form onSubmit={onUpdateSchoolSetup} className="space-y-4 text-xs font-bold uppercase text-slate-700 shadow-none">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5">Institution Code Name</label>
            <input 
              type="text" 
              defaultValue="St. Xavier's Academic Trust"
              className="w-full text-slate-400 bg-slate-100 border rounded text-xs p-2.5 outline-none cursor-not-allowed" 
              disabled
            />
          </div>
          <div>
            <label className="block mb-1.5">System Term Reference</label>
            <input 
              type="text" 
              value={termName}
              onChange={(e) => onTermNameChange(e.target.value)}
              className="w-full text-slate-800 bg-slate-50 border rounded text-xs p-2.5 outline-none focus:outline-slate-900 focus:bg-white" 
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5">Emergency System-Wide Alert Banner (Shows on Student apps)</label>
          <textarea
            rows={3}
            value={systemAlertMessage}
            onChange={(e) => onSystemAlertMessageChange(e.target.value)}
            placeholder="E.g. Notice: School closed on 10th Aug due to heavy rainfall warning. Online classes active."
            className="w-full text-slate-800 bg-slate-50 border rounded text-xs p-3 focus:bg-white outline-none focus:outline-slate-900 resize-none"
          ></textarea>
          <span className="text-[10px] text-slate-400 font-medium font-sans mt-1 block lowercase">
            Leave empty to remove existing alert banners from parent widgets immediately.
          </span>
        </div>

        <button 
          type="submit"
          className="mt-6 bg-slate-900 hover:bg-slate-800 text-white text-xs py-2.5 px-4 rounded cursor-pointer duration-150"
        >
          Save Hub Configurations
        </button>
      </form>
    </div>
  );
}
