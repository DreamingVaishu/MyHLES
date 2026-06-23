import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Student } from '../../types';

interface AttendanceProps {
  students: Student[];
  currentGrade: string;
  currentDiv: string;
  attendanceDate: string;
  onDateChange: (date: string) => void;
  onAttendanceToggle: (studentId: string, status: 'Present' | 'Absent' | 'Late') => void;
}

export default function Attendance({ students, currentGrade, currentDiv, attendanceDate, onDateChange, onAttendanceToggle }: AttendanceProps) {
  const filteredStudents = students.filter(s => s.grade === currentGrade && s.division === currentDiv);

  return (
    <div className="bg-white rounded-xl border border-[#C5C6CD] shadow-sm overflow-hidden animate-in">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            <span>Direct Daily Roll Call Register</span>
          </h3>
          <p className="text-xs text-slate-500">Pick date to update roll history. Changes reflect globally.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest leading-none">Record Date</label>
          <input 
            type="date" 
            value={attendanceDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-800 text-sm focus:outline-[#0B1220]"
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="py-24 text-center">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Roster is empty.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase select-none">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4 col-span-2">Student Name</th>
                <th className="px-6 py-4 text-center">Roll Call Status Check</th>
                <th className="px-6 py-4 text-right">Attendance Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const checkHist = student.attendanceHistory.find(a => a.date === attendanceDate);
                const isPresent = checkHist?.status === 'Present';
                const isAbsent = checkHist?.status === 'Absent';
                const isLate = checkHist?.status === 'Late';

                // Calculate aggregate attendance
                const presents = student.attendanceHistory.filter(h => h.status === 'Present').length;
                const totalDays = student.attendanceHistory.length;
                const rate = totalDays > 0 ? Math.round((presents / totalDays) * 100) : 100;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">{student.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 font-bold p-1">
                        <button
                          onClick={() => onAttendanceToggle(student.id, 'Present')}
                          className={`px-4 py-1.5 rounded text-xs border transition-all cursor-pointer ${
                            isPresent 
                              ? 'bg-emerald-500 border-emerald-500 text-white font-black shadow-sm' 
                              : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Mark Present
                        </button>
                        
                        <button
                          onClick={() => onAttendanceToggle(student.id, 'Absent')}
                          className={`px-4 py-1.5 rounded text-xs border transition-all cursor-pointer ${
                            isAbsent 
                              ? 'bg-rose-500 border-rose-500 text-white font-black shadow-sm' 
                              : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Mark Absent
                        </button>

                        <button
                          onClick={() => onAttendanceToggle(student.id, 'Late')}
                          className={`px-4 py-1.5 rounded text-xs border transition-all cursor-pointer ${
                            isLate 
                              ? 'bg-amber-500 border-amber-500 text-white font-black shadow-sm' 
                              : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Mark Late
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        rate >= 80 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                      }`}>
                        {rate}% Present Ratio
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
