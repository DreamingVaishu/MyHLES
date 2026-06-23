import React from 'react';
import { UserCheck, Terminal, Users, Activity, Megaphone } from 'lucide-react';
import { Student, Transaction, Notice, AccessRequest } from '../../types';

interface DashboardProps {
  students: Student[];
  transactions: Transaction[];
  notices: Notice[];
  requests: AccessRequest[];
  onChangeTab: (tab: string) => void;
}

export default function Dashboard({ students, transactions, notices, requests, onChangeTab }: DashboardProps) {
  const totalCollected = transactions
    .filter(t => t.status === 'Recorded')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPending = students.reduce((sum, s) => sum + s.outstandingBalance, 0);
  const activeFaculty = 18;
  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-in">
      
      {/* Horizontal Navigation Triggers for Admin (Sub-views) */}
      <section className="bg-white border rounded-2xl p-4 flex gap-2 items-center overflow-x-auto shadow-sm select-none">
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-black shrink-0 px-2">Top Admin Tabs:</span>
        
        <button 
          onClick={() => onChangeTab('Approvals')}
          className="px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-lg inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer border"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Approvals Queue ({pendingRequestsCount})</span>
        </button>

        <button 
          onClick={() => onChangeTab('Audit Logs')}
          className="px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-lg inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer border"
        >
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>Secure Audit Logs</span>
        </button>

        <button 
          onClick={() => onChangeTab('User Management')}
          className="px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-lg inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer border"
        >
          <Users className="w-3.5 h-3.5 text-blue-500" />
          <span>Faculty Roster</span>
        </button>
      </section>

      {/* Admin KPI stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">High-integrity Roster</p>
          <h4 className="text-3xl font-black text-slate-800">{students.length} Pupils</h4>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold border-t pt-3">
            <span>Grade 9-12 Coverage</span>
            <span className="text-emerald-500">100% Secure</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Staff</p>
          <h4 className="text-3xl font-black text-slate-800">{activeFaculty} Faculty</h4>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold border-t pt-3">
            <span>HODs Registered</span>
            <span className="text-[#0B1220]">Active</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Fee Collections</p>
          <h4 className="text-3xl font-black text-emerald-600">₹{totalCollected.toLocaleString('en-IN')}</h4>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold border-t pt-3">
            <span>Outstanding: ₹{totalPending.toLocaleString('en-IN')}</span>
            <span className="text-rose-500 font-bold">Pending</span>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[#9ad3b7] text-[10px] font-mono font-bold tracking-widest uppercase">System Security</p>
            <h4 className="text-base font-extrabold leading-tight mt-1">SLA Standard Compliance</h4>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mt-4 font-mono">
            FIPS-140 Hash Clear • UTC Connection Lock • Encrypted Safe Backlinks
          </p>
        </div>
      </div>

      {/* Visual Analytics Canvas Placeholder and Fee editing */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Outstanding metrics layout progress bar */}
        <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
            <span>Compliant Budget Allocations Report</span>
          </h3>

          {/* Simulated barcharts or percentage ranges */}
          <div className="space-y-5 select-none font-semibold text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-600">Grade 10 Tuition Collection Ratio</span>
                <span className="font-bold text-slate-900">₹{Math.round(totalCollected * 0.4).toLocaleString('en-IN')} / ₹12,00,000 (84%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-600">Grade 12 Advanced Lab Subsidies</span>
                <span className="font-bold text-slate-900">₹{Math.round(totalCollected * 0.35).toLocaleString('en-IN')} / ₹60,000 (100%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border">
                <div className="h-full bg-[#0B1220] rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-600">Total School outstanding liability</span>
                <span className="font-bold text-slate-900">₹{totalPending.toLocaleString('en-IN')} pending registration</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border">
                <div className="h-full bg-rose-450 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-4 text-center ">
            <p className="text-[11px] text-slate-400 font-mono inline-flex items-center gap-1.5 justify-center">
              <span className="inline-block w-2.5 h-1.5 bg-emerald-500"></span>
              <span>DATA INTEGRITY VERIFIED LIVE SECURE BY NCT ADVISOR CHANNELS</span>
            </p>
          </div>
        </div>

        {/* Quick Notice feed history block */}
        <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 border-b pb-3 mb-4">Official Broadcast Stack</h4>
            <div className="space-y-4">
              {notices.slice(0, 3).map(n => (
                <div key={n.id} className="p-3 bg-slate-50 border rounded-lg hover:border-slate-300">
                  <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold text-slate-400 uppercase font-mono">
                    <span>Ref: {n.id}</span>
                    <span>By: {n.sentBy}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-normal line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => alert("Please use the global broadcast mailer block on the header frame to dispatch announcements.")}
            className="w-full mt-4 bg-slate-950 text-white font-bold text-xs uppercase py-2 hover:bg-slate-800 rounded cursor-pointer text-center duration-150"
          >
            Add New Global Alert
          </button>
        </div>

      </div>

    </div>
  );
}
