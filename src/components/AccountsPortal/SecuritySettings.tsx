import React from 'react';

interface SecuritySettingsProps {
  onUpdateSettings: (e: React.FormEvent) => void;
}

export default function SecuritySettings({ onUpdateSettings }: SecuritySettingsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-xl mx-auto space-y-6 animate-in">
      <div>
        <h3 className="font-bold text-slate-800 text-lg">Accounts Credentials and MFA Registry</h3>
        <p className="text-xs text-slate-500 mt-1 block bg-[#eff4ff] p-3 border rounded text-[#1e3a8a] font-semibold">
          Your bursar registry possesses permissions to approve invoices. Exercise maximum credential care.
        </p>
      </div>

      <form onSubmit={onUpdateSettings} className="space-y-4 font-bold text-xs uppercase text-slate-700">
        <div>
          <label className="block mb-1.5">Registered Bursar Name</label>
          <input 
            type="text" 
            defaultValue="Accounts Staff"
            className="w-full text-slate-800 border rounded text-xs p-2.5 outline-none focus:outline-slate-900 bg-slate-50 focus:bg-white" 
            required
          />
        </div>

        <div>
          <label className="block mb-1.5">MFA Phone Linking Token</label>
          <input 
            type="text" 
            defaultValue="+91 91234 XXX00"
            className="w-full text-slate-400 border rounded text-xs p-2.5 outline-none bg-slate-100 cursor-not-allowed" 
            disabled
          />
        </div>

        <div className="pt-4 border-t space-y-4">
          <h4 className="text-rose-500 tracking-wider">Change Registry Password</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5">Token Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full text-slate-800 border rounded text-xs p-2.5 outline-none focus:outline-slate-900 bg-slate-50" 
              />
            </div>
            <div>
              <label className="block mb-1.5">MFA Verification</label>
              <input 
                type="password" 
                placeholder="Enter MFA Check"
                className="w-full text-slate-800 border rounded text-xs p-2.5 outline-none focus:outline-slate-900 bg-slate-50" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800 text-xs py-2.5 rounded cursor-pointer transition-colors"
        >
          Update Ledger Credentials
        </button>
      </form>
    </div>
  );
}
