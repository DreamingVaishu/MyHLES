import React from 'react';
import { ClipboardList, X } from 'lucide-react';
import { Student } from '../../types';

interface StudentDetailModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
}

export default function StudentDetailModal({ isOpen, student, onClose }: StudentDetailModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg">Student Profile: {student.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[480px] overflow-y-auto">
          
          {/* Profile Block */}
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-lg border border-emerald-200 shadow-inner select-none pointer-events-none">
              {student.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-lg">{student.name}</h4>
              <p className="text-xs text-slate-500 font-mono">Admission No: {student.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
            <div>
              <span className="block text-slate-400 uppercase tracking-wider text-[10px]">Guardian Details</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{student.guardianName}</p>
              <p className="text-[11px] text-slate-500">{student.guardianEmail}</p>
              <p className="text-[11px] text-slate-500">{student.guardianContact}</p>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Class Assignment</span>
              <div className="flex gap-2">
                <span className="bg-slate-100 border text-slate-700 px-3 py-1 rounded font-bold text-xs">
                  Grade {student.grade} - Div {student.division}
                </span>
              </div>
            </div>
          </div>

          {/* Outstanding Balance block */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center shadow-md">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fee Account Status</span>
              <h4 className={`text-xl font-black mt-0.5 ${student.outstandingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                ₹{student.outstandingBalance.toLocaleString('en-IN')} OUTSTANDING
              </h4>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400">Total Fees (Annual)</span>
              <p className="font-mono text-white text-xs font-bold">₹{student.totalAnnualFee.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Grade indexes */}
          <div className="space-y-2">
            <span className="block text-[10px] text-slate-450 uppercase font-black tracking-wider">Academic Report Indicators</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {student.grades.map(g => (
                <div key={g.subject} className="flex justify-between items-center p-2 bg-slate-50 border rounded-lg border-slate-100 font-bold text-slate-650">
                  <span>{g.subject}</span>
                  <div className="flex items-center gap-1.5">
                    <span>{g.marksSecured}%</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 border border-emerald-100 rounded uppercase">{g.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
