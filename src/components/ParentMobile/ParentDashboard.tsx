import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Percent, 
  BookOpen, 
  AlertCircle, 
  Plus, 
  Flame, 
  ChevronRight, 
  GraduationCap, 
  User, 
  Beaker, 
  Languages, 
  Calculator, 
  Globe, 
  Palette,
  CheckCircle
} from 'lucide-react';
import { Student, Notice } from './types';

interface ParentDashboardProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onTriggerAddNewChild: () => void;
  notices: Notice[];
  activeTab: 'home' | 'fees' | 'results' | 'profile';
  setActiveTab: (tab: 'home' | 'fees' | 'results' | 'profile') => void;
  onPayTabRedirect: () => void;
}

export default function ParentDashboard({
  students,
  selectedStudentId,
  onSelectStudent,
  onTriggerAddNewChild,
  notices,
  activeTab,
  setActiveTab,
  onPayTabRedirect
}: ParentDashboardProps) {

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Return helper icon for subjects
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'beaker': return <Beaker className="w-5 h-5 text-emerald-600" />;
      case 'book-open': return <BookOpen className="w-5 h-5 text-indigo-600" />;
      case 'plus-minus': return <Calculator className="w-5 h-5 text-sky-600" />;
      case 'languages': return <Languages className="w-5 h-5 text-amber-600" />;
      case 'globe': return <Globe className="w-5 h-5 text-rose-600" />;
      case 'palette': return <Palette className="w-5 h-5 text-violet-600" />;
      default: return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  // Helper colors for Grades
  const getGradeColorClass = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (grade.startsWith('B')) return 'text-indigo-600 bg-indigo-50 border-indigo-150';
    if (grade.startsWith('C')) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="w-full flex-grow flex flex-col pb-16 bg-[#f8f9ff]">
      
      {/* 1. Student Profiles Scrollbar */}
      <section className="bg-white border-b border-[#c5c6cd] py-2.5 px-4 sticky top-16 z-30 shadow-xs">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
          {students.map((student) => {
            const isSelected = student.id === selectedStudentId;
            const isApproved = student.status === 'approved';
            
            return (
              <button
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all shrink-0 cursor-pointer text-left"
                style={{
                  borderColor: isSelected ? '#091426' : '#cbd5e1',
                  backgroundColor: isSelected ? '#eff4ff' : 'white',
                  boxShadow: isSelected ? '0 0 0 2px #d8e3fb' : 'none'
                }}
              >
                {/* Avatar / Initials */}
                <div className="w-9 h-9 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-xs">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-xs text-[#091426] truncate max-w-[100px]">
                    {student.name}
                  </span>
                  <span className="text-[10px] text-[#75777d] uppercase tracking-wider font-semibold">
                    {isApproved ? student.studentId : 'Pending Setup'}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Add Another Kid Button */}
          <button
            onClick={onTriggerAddNewChild}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-[#c5c6cd] hover:border-[#091426] text-[#45474c] hover:text-[#091426] bg-white transition-colors shrink-0 cursor-pointer text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Child</span>
          </button>
        </div>
      </section>

      {/* 2. Main Selected Student Detail Container */}
      {!selectedStudent ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-2xl border border-[#cbd5e1]">
          <AlertCircle className="w-12 h-12 text-[#ba1a1a] mb-2" />
          <h2 className="text-lg font-bold text-[#091426]">No children registered yet</h2>
          <p className="text-xs text-[#45474c] max-w-xs mt-1 mb-4">
            Register your children in St. Xavier's system to see academic notices, attendances, and check grades.
          </p>
          <button
            onClick={onTriggerAddNewChild}
            className="px-5 py-2.5 bg-[#091426] text-white rounded-xl text-xs font-extrabold cursor-pointer"
          >
            Setup Child Details Now
          </button>
        </div>
      ) : selectedStudent.status !== 'approved' ? (
        /* PENDING APPROVAL SCREEN */
        <div className="flex-grow flex flex-col p-5 max-w-lg mx-auto w-full">
          <div className="bg-white border border-[#c5c6cd] rounded-2xl p-6 shadow-sm text-center space-y-4 my-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 rounded-full">
                Class Supervisor Verification Needed
              </span>
              <h2 className="text-xl font-extrabold text-[#091426] mt-2">
                {selectedStudent.name} ({selectedStudent.grade})
               </h2>
              <p className="text-xs text-[#75777d]">
                 Applied under section <strong className="text-[#091426]">{selectedStudent.section}</strong>.
              </p>
            </div>

            <div className="bg-[#f8f9ff] text-left p-4 rounded-xl border border-[#c5c6cd]/50 text-xs text-[#45474c] space-y-2">
              <p className="font-bold text-[#091426]">What happens next?</p>
              <p>1. Your request with student details is forwarded to the Class Teacher's list.</p>
              <p>2. Once verified, the teacher activates their unique ID (e.g. STD-2026-X).</p>
              <p>3. Once approved, report cards, fees trackers, and daily attendance load instantly here.</p>
            </div>

            <div className="pt-2">
              <div className="text-xs text-indigo-700 font-semibold bg-indigo-50 border border-indigo-100 rounded-lg p-2 flex items-center justify-center gap-1">
                <span>💡 Developer tip: Switch to "Teacher Mode" above to instantly approve this kid!</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* APPROVED STUDENT VIEW */
        <div className="px-4 py-5 space-y-6">
          
          {/* Greeting bar */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#75777d] uppercase tracking-wider font-bold">Authenticated Parent account</p>
              <h2 className="text-xl font-extrabold text-[#091426] tracking-tight">
                Hello, {selectedStudent.guardianName.split(' ')[0]}!
              </h2>
              <p className="text-xs text-[#45474c] mt-0.5">
                Here is {selectedStudent.name.split(' ')[0]}'s report for today.
              </p>
            </div>
          </div>

          {/* HOME TAB CONTENT */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Event Notification banner */}
              <div className="bg-[#091426] text-white rounded-2xl p-4 shadow-md leading-tight relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-[#b3ecd0]/10 font-bold text-8xl pointer-events-none">
                  ★
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Flame className="w-4.5 h-4.5 text-[#b3ecd0]" />
                  <span className="text-[10px] font-bold text-[#b3ecd0] uppercase tracking-widest">Ongoing Term 1 Highlight</span>
                </div>
                <p className="font-bold text-sm leading-snug">
                  St. Xavier's Academic Term results has been compiled. Class Supervisor reports are now open below.
                </p>
              </div>

              {/* Attendance quick widget */}
              <div className="bg-white border border-[#c5c6cd] rounded-2xl p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#75777d] uppercase tracking-wider">Attendance Percentage</h4>
                    <span className="text-lg font-extrabold text-[#091426]">
                      {selectedStudent.attendance.percentage}%
                    </span>
                    <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                      ({selectedStudent.attendance.present} of {selectedStudent.attendance.total} lectures present)
                    </p>
                  </div>
                </div>
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#326852] clip-to-percentage" style={{ transform: `rotate(${selectedStudent.attendance.percentage * 3.6}deg)` }}></div>
                  <span className="text-[10px] font-bold text-[#326852]">Excellent</span>
                </div>
              </div>

              {/* Notice Board */}
              <div className="bg-white border border-[#c5c6cd] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sans font-bold text-[#091426] text-sm md:text-base">
                    📌 Notice Board
                  </h3>
                  <span className="text-[10px] font-bold bg-[#eff4ff] text-[#091426] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {notices.length} Updates
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-3 bg-[#f8f9ff] rounded-xl border border-[#cbd5e1]/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#091426]">{notice.title}</span>
                        <span className="text-[10px] text-[#75777d] font-semibold">{notice.date}</span>
                      </div>
                      <p className="text-xs text-[#45474c] leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Status Check Widget */}
              <div className="bg-white border border-[#cbd5e1] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#75777d] uppercase tracking-wider">Main School Fees</h4>
                    <p className="text-sm text-[#45474c] mt-0.5">Payment Tracking & Receipts</p>
                  </div>
                  {selectedStudent.feeItems.some(f => f.status === 'Overdue') ? (
                    <span className="px-2.5 py-1 bg-red-100 text-[#ba1a1a] rounded-lg text-[10px] font-extrabold uppercase">
                      Actions Required
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-[#b3ecd0] text-[#002115] rounded-lg text-[10px] font-extrabold uppercase">
                      Paid / Settled
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline py-2 border-b border-slate-100">
                    <span className="text-xs text-[#45474c]">Outstanding Balance</span>
                    <span className="text-xl font-extrabold text-[#091426]">
                      ₹{selectedStudent.feeItems.filter(f => f.status !== 'Paid').reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={onPayTabRedirect}
                    className="w-full py-3 bg-[#091426] text-white font-bold text-xs rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Manage & Pay Fees</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Upcoming Exams widget */}
              <div className="bg-white border border-[#c5c6cd] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sans font-bold text-[#091426] text-sm md:text-base">
                    📅 Upcoming Exams
                  </h3>
                  <Calendar className="w-5 h-5 text-[#75777d]" />
                </div>

                <div className="space-y-3">
                  {selectedStudent.upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex gap-3 items-center p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c6cd]/40"
                    >
                      <div className="flex flex-col items-center bg-[#091426] text-white p-2 rounded-lg min-w-[50px] shrink-0 text-center">
                        <span className="text-[8px] font-bold tracking-wider leading-none">{exam.month}</span>
                        <span className="font-extrabold text-base leading-none mt-1">{exam.date}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#091426] truncate">{exam.subject}</p>
                        <p className="text-[11px] text-[#45474c] truncate">{exam.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RESULTS TAB CONTENT */}
          {activeTab === 'results' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-lg text-[#091426]">
                    🎓 Academic Progress Report
                  </h3>
                  <p className="text-xs text-[#45474c]">Official school evaluation card</p>
                </div>
                <div className="px-3 py-1.5 bg-[#b3ecd0]/40 text-[#002115] rounded-xl text-xs font-bold border border-[#9ad3b7]">
                  Term GPA: 3.8 / 4.0
                </div>
              </div>

              {/* Performance Indicator Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#c5c6cd] text-center space-y-1 shadow-xs">
                  <p className="text-[10px] text-[#75777d] font-bold uppercase tracking-wider">Average Score</p>
                  <p className="text-2xl font-extrabold text-[#091426]">91.2%</p>
                  <span className="inline-block text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Top 5% of Class
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#c5c6cd] text-center space-y-1 shadow-xs">
                  <p className="text-[10px] text-[#75777d] font-bold uppercase tracking-wider">Rank in Section</p>
                  <p className="text-2xl font-extrabold text-[#091426]">3rd</p>
                  <span className="inline-block text-[9px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                    A+ Category
                  </span>
                </div>
              </div>

              {/* Performance detailed list */}
              <div className="bg-white border border-[#c5c6cd] rounded-2xl overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-50 border-b border-[#c5c6cd]/50 flex justify-between items-center">
                  <span className="text-xs font-extrabold text-[#091426] uppercase">Subject Analysis</span>
                  <span className="text-[10px] text-[#75777d] font-bold uppercase">Weighted Mark</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {selectedStudent.academicGrades.map((grade, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#f8f9ff] flex items-center justify-center border border-slate-100">
                          {getSubjectIcon(grade.icon)}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#091426]">{grade.subject}</p>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                            <div className="bg-[#091426] h-1.5 rounded-full" style={{ width: `${grade.marks}%` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-[#45474c]">{grade.marks}%</span>
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${getGradeColorClass(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct signature status */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-bold">Result Confirmed & Signed</p>
                  <p className="mt-0.5 leading-relaxed text-emerald-700">
                    This computer generated report has been certified by the registrar of St. Xavier's Academy for Academic Term 2026.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB CONTENT */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-[#c5c6cd] rounded-2xl p-6 text-center space-y-4 shadow-xs">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-[#091426] text-white flex items-center justify-center text-2xl font-bold rounded-full mx-auto">
                    {selectedStudent.guardianName.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#326852] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white" title="Verified Parent">
                    ✓
                  </span>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-lg text-[#091426]">{selectedStudent.guardianName}</h3>
                  <p className="text-xs text-[#75777d]">Parent & Primary Guardian Account</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-[#75777d] font-bold uppercase">Mobile Number</p>
                    <p className="text-xs font-bold text-[#091426] mt-0.5">{selectedStudent.guardianPhone}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-[#75777d] font-bold uppercase">Linked Email</p>
                    <p className="text-xs font-bold text-[#091426] mt-0.5 truncate">mahimamourya2005@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Kids summaries card */}
              <div className="bg-white border border-[#c5c6cd] rounded-2xl p-4 shadow-sm space-y-3">
                <h4 className="font-bold text-xs text-[#091426] uppercase tracking-wider">Registered Children status</h4>
                <div className="space-y-2">
                  {students.map((child, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-xs text-[#091426]">{child.name}</p>
                        <p className="text-[10px] text-[#75777d]">{child.grade} • Sec {child.section}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        child.status === 'approved' 
                          ? 'bg-[#b3ecd0] text-[#002115]' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {child.status === 'approved' ? `Active (${child.studentId})` : 'Pending Teacher Appr.'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
