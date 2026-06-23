import React from 'react';
import { Edit2 } from 'lucide-react';
import { Student } from '../../types';

interface StudentRecordsProps {
  students: Student[];
  onEditStudent: (student: Student) => void;
}

export default function StudentRecords({ students, onEditStudent }: StudentRecordsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">System-Wide Offline Student Records</h3>
          <p className="text-xs text-slate-500 mt-0.5">Overview of registered students, billing state and classroom bounds.</p>
        </div>
        
        <div className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-3.5 py-1.5 rounded-full font-bold text-xs select-none">
          {students.length} Accounts Synchronized
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-650">
          <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase select-none">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Full Name</th>
              <th className="px-6 py-3.5">Allocation Bounds</th>
              <th className="px-6 py-3.5">Guardian Contact Name</th>
              <th className="px-6 py-3.5">Ledger Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono text-slate-400 text-xs font-bold">{s.id}</td>
                <td className="px-6 py-4 font-extrabold text-slate-800">{s.name}</td>
                <td className="px-6 py-4">
                  <span className="font-bold bg-slate-100 border text-slate-600 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                    Grade {s.grade} - {s.division}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-500">{s.guardianName} ({s.guardianContact})</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    s.feeStatus === 'Paid' 
                      ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                      : s.feeStatus === 'Pending' 
                        ? 'bg-amber-50 border-amber-250 text-amber-600'
                        : 'bg-rose-50 border-rose-250 text-rose-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      s.feeStatus === 'Paid' ? 'bg-emerald-500' : s.feeStatus === 'Pending' ? 'bg-amber-400' : 'bg-rose-550'
                    }`}></span>
                    <span>{s.feeStatus}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onEditStudent(s)}
                    className="text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded font-bold cursor-pointer inline-flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Inline Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
