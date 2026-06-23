import React from 'react';
import { X } from 'lucide-react';
import { Student } from '../../types';

interface StudentEditModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onUpdateStudent: (student: Student) => void;
  onStudentChange: (student: Student) => void;
}

export default function StudentEditModal({ isOpen, student, onClose, onUpdateStudent, onStudentChange }: StudentEditModalProps) {
  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent(student);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-3xl overflow-hidden border border-slate-200 animate-in">
        <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
          <h3 className="font-bold text-base">Modify Ledger: {student.name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded cursor-pointer text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-bold text-xs uppercase text-slate-700">
          <div>
            <label className="block mb-1.5">Student Full Name</label>
            <input 
              type="text" 
              value={student.name}
              onChange={(e) => onStudentChange({ ...student, name: e.target.value })}
              className="w-full border rounded text-xs p-2 outline-none focus:outline-slate-900 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-sans">Current Grade</label>
              <select 
                value={student.grade}
                onChange={(e) => onStudentChange({ ...student, grade: e.target.value })}
                className="w-full border rounded text-xs p-2 bg-slate-50"
              >
                {['9', '10', '11', '12'].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Division</label>
              <select 
                value={student.division}
                onChange={(e) => onStudentChange({ ...student, division: e.target.value })}
                className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-slate-900 bg-slate-50"
              >
                {['A', 'B', 'C', 'D'].map(d => (
                  <option key={d} value={d}>Division {d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Guardian Name</label>
            <input 
              type="text" 
              value={student.guardianName}
              onChange={(e) => onStudentChange({ ...student, guardianName: e.target.value })}
              className="w-full border border-slate-200 rounded p-2 text-xs text-slate-800 bg-slate-50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Outstanding Balance</label>
              <input 
                type="number" 
                value={student.outstandingBalance}
                onChange={(e) => onStudentChange({ ...student, outstandingBalance: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-200 rounded p-2 text-xs text-slate-800 font-bold bg-slate-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Fee Status</label>
              <select
                value={student.feeStatus}
                onChange={(e) => onStudentChange({ ...student, feeStatus: e.target.value as any })}
                className="w-full border border-slate-300 rounded text-xs p-2 bg-slate-50"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option className="text-rose-500 font-bold" value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t font-semibold">
            <button 
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 border rounded text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-1/2 py-2.5 bg-slate-900 text-white rounded text-xs hover:bg-slate-800 cursor-pointer shadow-md duration-200"
            >
              Save Student Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
