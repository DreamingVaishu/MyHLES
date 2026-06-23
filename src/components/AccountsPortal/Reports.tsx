import React from 'react';
import { Printer } from 'lucide-react';
import { Transaction } from '../../types';

interface ReportsProps {
  transactions: Transaction[];
  onExportReport: () => void;
}

export default function Reports({ transactions, onExportReport }: ReportsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Bursar Collections Report</h3>
          <p className="text-xs text-slate-500 mt-0.5">Compliant accounting log for school board financial exports.</p>
        </div>
        
        <button 
          onClick={onExportReport}
          className="px-4 py-2 border rounded text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Generate compliant CSV Export</span>
        </button>
      </div>

      <div className="p-6">
        <div className="border border-slate-200 rounded-lg bg-slate-50/50 p-4 mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
          <div>
            <span className="text-slate-400 block font-bold">Safe Deposit Box Code:</span>
            <span className="text-slate-950 mt-1 block">NCT-MUM-SAFE/2026</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold">Outstanding Liability Index:</span>
            <span className="text-slate-900 mt-1 block font-black">98.4% Secure</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold">Compliance Officer:</span>
            <span className="text-slate-900 mt-1 block">A. Shankaran</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold">Ledger Status Check:</span>
            <span className="text-emerald-700 font-bold bg-[#e8fdf5] border border-[#bbf7df] px-2 py-0.5 rounded inline-block mt-1">Audit Clear</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b text-slate-500 select-none">
              <tr>
                <th className="px-6 py-3 font-bold uppercase">Transaction ID</th>
                <th className="px-6 py-3 font-bold uppercase">Account Name</th>
                <th className="px-6 py-3 font-bold uppercase">Standard Bounds</th>
                <th className="px-6 py-3 font-bold uppercase">Settled Draft Amount</th>
                <th className="px-6 py-3 font-bold uppercase col-span-2">Instrument Code / notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/20">
                  <td className="px-6 py-3 font-mono text-slate-400 font-bold">{t.id}</td>
                  <td className="px-6 py-3 text-slate-800 font-bold">{t.studentName}</td>
                  <td className="px-6 py-3 font-bold text-slate-650">Grade {t.grade} - {t.division}</td>
                  <td className="px-6 py-3 text-slate-900 font-black text-sm">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3 text-slate-500 font-semibold">{t.notes || "Draft Cleared"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
