import React from 'react';
import { Users, FileText, Edit2 } from 'lucide-react';
import { Student } from '../../types';

interface StudentsTableProps {
  students: Student[];
  currentGrade: string;
  currentDiv: string;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
}

export default function StudentsTable({ students, currentGrade, currentDiv, onViewStudent, onEditStudent }: StudentsTableProps) {
  const filteredStudents = students.filter(s => s.grade === currentGrade && s.division === currentDiv);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
      
      {/* Table header operations */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Classroom Student Roster</h3>
          <p className="text-xs text-slate-500 mt-0.5">Active Class: Grade {currentGrade} - Division {currentDiv} • {filteredStudents.length} Students Allocated</p>
        </div>
        
        <div className="flex gap-2">
          <span className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded border text-slate-650 flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>COMPLIANT REGISTER</span>
          </span>
        </div>
      </div>

      {/* Empty state protection */}
      {filteredStudents.length === 0 ? (
        <div className="py-24 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-semibold">No students in Grade {currentGrade} - Div {currentDiv} yet.</p>
          <p className="text-slate-400 text-xs mt-1">Please select other Standard cards above or allocate students dynamically.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
              <tr>
                <th className="px-6 py-3.5">Admission ID</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Guardian Contact</th>
                <th className="px-6 py-3.5">Current Grade</th>
                <th className="px-6 py-3.5">Fee Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono font-bold text-slate-500">{student.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                  <td className="px-6 py-4 font-semibold text-slate-650">{student.guardianName} ({student.guardianContact})</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 border text-slate-650 font-bold px-2 py-0.5 rounded text-xs">
                      Grade {student.grade} - {student.division}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      student.feeStatus === 'Paid' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : student.feeStatus === 'Pending' 
                          ? 'bg-amber-50 border-amber-200 text-amber-600' 
                          : 'bg-rose-50 border-rose-200 text-rose-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        student.feeStatus === 'Paid' ? 'bg-emerald-500' : student.feeStatus === 'Pending' ? 'bg-amber-400' : 'bg-rose-500'
                      }`}></span>
                      <span>{student.feeStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end items-center font-bold">
                      <button 
                        onClick={() => onViewStudent(student)}
                        className="text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded cursor-pointer transition-colors inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Detail Profile</span>
                      </button>
                      <button 
                        onClick={() => onEditStudent(student)}
                        className="p-1 px-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
