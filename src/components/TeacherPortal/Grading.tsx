import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { Student } from '../../types';

interface GradingProps {
  students: Student[];
  currentGrade: string;
  currentDiv: string;
  onGradeCellChange: (studentId: string, subject: string, marksStr: string) => void;
}

export default function Grading({ students, currentGrade, currentDiv, onGradeCellChange }: GradingProps) {
  const filteredStudents = students.filter(s => s.grade === currentGrade && s.division === currentDiv);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
      <div className="p-6 border-b border-slate-100 bg-emerald-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <span>Unified Gradebook Workspace</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Directly key in assessment percentages. Letter grades adjust on change compliantly.</p>
        </div>
        <span className="text-xs font-mono bg-white border px-3 py-1 rounded text-red-500 flex items-center gap-1 font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EXAM MODE DIRECT KEYING</span>
        </span>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="py-24 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-semibold">No students in Grade {currentGrade} - Div {currentDiv} to Grade.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-650">
            <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
              <tr>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Name</th>
                {filteredStudents[0].grades.map(g => (
                  <th key={g.subject} className="px-6 py-4 text-center">{g.subject} Marks</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/40">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400">{student.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                  
                  {student.grades.map(g => (
                    <td key={g.subject} className="px-6 py-4 select-none">
                      <div className="flex items-center justify-center gap-2">
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          value={g.marksSecured}
                          onChange={(e) => onGradeCellChange(student.id, g.subject, e.target.value)}
                          className="w-16 px-1.5 py-1 text-center font-semibold text-slate-800 border border-slate-350 focus:outline-[#0B1220] rounded bg-slate-50/50 focus:bg-white"
                        />
                        <span className="text-[10px] text-slate-400 font-semibold font-mono">/100</span>
                        <span className="w-8 font-black text-xs text-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1 tracking-wider uppercase border border-emerald-100">
                          {g.grade}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
