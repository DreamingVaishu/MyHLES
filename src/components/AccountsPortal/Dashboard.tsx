import React from 'react';
import { Printer, AlertCircle } from 'lucide-react';
import { Transaction, Student } from '../../types';

interface DashboardProps {
  transactions: Transaction[];
  students: Student[];
  onOpenReceiptManager: () => void;
}

export default function Dashboard({ transactions, students, onOpenReceiptManager }: DashboardProps) {
  const totalCollected = transactions
    .filter(t => t.status === 'Recorded')
    .reduce((sum, t) => sum + t.amount, 0);

  const schoolBalance = students.reduce((sum, s) => sum + s.outstandingBalance, 0);
  const overdueCount = students.filter(s => s.feeStatus === 'Overdue').length;

  return (
    <div className="space-y-6 animate-in">
      
      {/* Stat KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Collections Logged</p>
          <h4 className="text-3xl font-black text-slate-800">₹{totalCollected.toLocaleString('en-IN')}</h4>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase border border-emerald-100 inline-block mt-2">
            Verified Offline
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Outstanding Fee Roster</p>
          <h4 className="text-3xl font-black text-slate-800">₹{schoolBalance.toLocaleString('en-IN')}</h4>
          <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-100 inline-block mt-2">
            Pending Ledger
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Overdue Roster Accounts</p>
          <h4 className="text-3xl font-black text-slate-800">{overdueCount} Class-Students</h4>
          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-100 inline-block mt-2">
            Bursar Attention
          </span>
        </div>

        <div className="bg-[#0B1220] p-6 rounded-xl border border-slate-800 shadow-sm text-white flex flex-col justify-between">
          <div>
            <p className="text-[#9ad3b7] text-[10px] font-bold uppercase tracking-widest mb-1">Standard Safe Sync</p>
            <h4 className="text-md font-extrabold leading-tight">Terminal Ledger</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-4">
            All manually received drafts are audited hourly under NCT State compliance rules.
          </p>
        </div>
      </div>

      {/* Dashboard visuals snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Recent Transaction flow */}
        <div className="col-span-12 md:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Live Collection Ledger</h3>
            <button 
              onClick={onOpenReceiptManager}
              className="text-xs font-bold text-slate-800 bg-white border rounded px-3 py-1.5 hover:bg-slate-100 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Reprint / Void Terminal</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-slate-650">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase select-none border-b">
                <tr>
                  <th className="px-6 py-3">Receipt ID</th>
                  <th className="px-6 py-3">Student Allocated</th>
                  <th className="px-6 py-3">Amount Charged</th>
                  <th className="px-6 py-3">Method Code</th>
                  <th className="px-6 py-3">Billing State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.slice(0, 5).map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/20">
                    <td className="px-6 py-3 font-mono text-slate-400 text-xs font-bold">{t.id}</td>
                    <td className="px-6 py-3 font-bold text-slate-800">
                      {t.studentName} <span className="text-slate-400 text-xs font-normal">({t.grade}-{t.division})</span>
                    </td>
                    <td className="px-6 py-3 font-bold text-slate-800">₹{t.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3">
                      <span className="bg-slate-100 px-2 py-0.5 border text-xs font-bold font-mono text-slate-650 rounded">
                        {t.method}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border inline-block ${
                        t.status === 'Recorded' 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-rose-50 border-rose-200 text-rose-600 line-through'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">No cash entries recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick instructions sidebar info */}
        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h4 className="font-bold text-slate-800 border-b pb-3 mb-4">Cash Handover Policy</h4>
          <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
            <p>1. Always verify currency drafts or check identity boundaries of the payer before confirming reception.</p>
            <p>2. Ensure the "Generate Digital Receipt" check is toggled so the parent immediately receives an auditory/visual push.</p>
            <p>3. If any entry requires retraction, go to the "Reprint/Void screen" to void it with an audited note justification.</p>
          </div>
          
          <div className="bg-[#eff4ff] p-4 rounded-lg border border-slate-200 mt-6 flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              NCT School Board mandates maintaining a strict paper trail of manual cash payouts.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
