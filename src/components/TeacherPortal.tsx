import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  UserCheck, 
  Search, 
  ShieldCheck, 
  Plus, 
  AlertCircle, 
  Edit, 
  BookOpen, 
  TrendingUp, 
  Award, 
  CalendarMinus,
  MessageSquareCode,
  BellRing
} from 'lucide-react';
import { Student, SubjectGrade, Notice } from '../types';

interface TeacherPortalProps {
  students: Student[];
  onApproveStudent: (id: string, assignedId: string) => void;
  onUpdateGrades: (id: string, grades: SubjectGrade[]) => void;
  onUpdateAttendance: (id: string, present: number, total: number) => void;
  onAddNotice: (title: string, content: string, category: 'Urgent' | 'General' | 'Event') => void;
}

export default function TeacherPortal({
  students,
  onApproveStudent,
  onUpdateGrades,
  onUpdateAttendance,
  onAddNotice
}: TeacherPortalProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<'approvals' | 'students' | 'notices'>('approvals');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Notice form states
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Urgent' | 'General' | 'Event'>('General');
  const [noticeFeedback, setNoticeFeedback] = useState('');

  // Editing grades/attendance states
  const [selectedEditStudent, setSelectedEditStudent] = useState<Student | null>(null);
  const [editedGrades, setEditedGrades] = useState<SubjectGrade[]>([]);
  const [editedPresent, setEditedPresent] = useState(0);
  const [editedTotal, setEditedTotal] = useState(0);
  const [editFeedback, setEditFeedback] = useState('');

  const pendingStudents = students.filter((s) => s.status === 'pending');
  const approvedStudents = students.filter((s) => s.status === 'approved');

  // Generate mock assigned student ID for approval input
  const [tempIds, setTempIds] = useState<{ [key: string]: string }>({});

  const handleApproveClick = (studentId: string) => {
    const defaultId = tempIds[studentId] || `STD-2026-${Math.floor(100 + Math.random() * 900)}`;
    onApproveStudent(studentId, defaultId);
  };

  const handleEditInit = (student: Student) => {
    setSelectedEditStudent(student);
    setEditedGrades([...student.academicGrades]);
    setEditedPresent(student.attendance.present);
    setEditedTotal(student.attendance.total);
    setEditFeedback('');
  };

  const handleGradeChange = (index: number, marksStr: string) => {
    const marks = parseInt(marksStr) || 0;
    const clampedMarks = Math.max(0, Math.min(100, marks));
    
    // Auto calculate letter grade
    let letter = 'D';
    if (clampedMarks >= 95) letter = 'A+';
    else if (clampedMarks >= 90) letter = 'A';
    else if (clampedMarks >= 85) letter = 'A-';
    else if (clampedMarks >= 80) letter = 'B+';
    else if (clampedMarks >= 75) letter = 'B';
    else if (clampedMarks >= 70) letter = 'B-';
    else if (clampedMarks >= 60) letter = 'C';

    const updated = [...editedGrades];
    updated[index] = { ...updated[index], marks: clampedMarks, grade: letter };
    setEditedGrades(updated);
  };

  const handleSaveStudentData = () => {
    if (!selectedEditStudent) return;
    
    // Validate attendance
    if (editedPresent > editedTotal) {
      setEditFeedback('Present days cannot exceed total lectures.');
      return;
    }

    onUpdateGrades(selectedEditStudent.id, editedGrades);
    onUpdateAttendance(selectedEditStudent.id, editedPresent, editedTotal);
    
    setEditFeedback('Success! Records published.');
    setTimeout(() => {
      setSelectedEditStudent(null);
    }, 1200);
  };

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      setNoticeFeedback('Please provide notice fields.');
      return;
    }

    onAddNotice(newNoticeTitle, newNoticeContent, newNoticeCategory);
    setNoticeFeedback('Notice published on Parent notices feed!');
    setNewNoticeTitle('');
    setNewNoticeContent('');
    
    setTimeout(() => {
      setNoticeFeedback('');
    }, 2000);
  };

  const filteredApproved = approvedStudents.filter((s) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex-grow p-4 md:p-6 space-y-6 bg-slate-50 animate-fade-in pb-12">
      
      {/* Admin header */}
      <div className="bg-[#091426] text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-[#b6efd3] bg-emerald-950/50 rounded-full border border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated Registrar Supervisor Desk</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            St. Xavier's Administration Console
          </h2>
          <p className="text-xs text-slate-350">
            Approve onboarding parent forms, publish grades report sheets, and configure announcements.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex gap-2 shrink-0">
          <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Awaiting Approval</p>
            <p className="text-lg font-extrabold text-amber-500">{pendingStudents.length} Students</p>
          </div>
          <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-[9px] font-bold text-slate-400 uppercase font-sans">Active Classes</p>
            <p className="text-lg font-extrabold text-[#b6efd3]">{approvedStudents.length} Assigned</p>
          </div>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => { setActiveSubTab('approvals'); setSelectedEditStudent(null); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'approvals' 
              ? 'border-[#091426] text-[#091426]' 
              : 'border-transparent text-[#75777d] hover:text-[#091426]'
          }`}
        >
          🔑 Verification Box ({pendingStudents.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('students'); setSelectedEditStudent(null); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'students' 
              ? 'border-[#091426] text-[#091426]' 
              : 'border-transparent text-[#75777d] hover:text-[#091426]'
          }`}
        >
          📖 Manage Marks & Lectures ({approvedStudents.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('notices'); setSelectedEditStudent(null); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'notices' 
              ? 'border-[#091426] text-[#091426]' 
              : 'border-transparent text-[#75777d] hover:text-[#091426]'
          }`}
        >
          📢 Publish Notice Board
        </button>
      </div>

      {/* SUBTAB CONTENT: PENDING VERIFICATION BOX */}
      {activeSubTab === 'approvals' && (
        <section className="space-y-4 animate-fade-in text-slate-900">
          <div className="flex justify-between items-center bg-white p-3 border border-gray-250 rounded-xl text-xs text-[#091426]">
            <span className="font-bold">Pending Student Onboarding Logs</span>
            <span className="text-[#cbd5e1] font-mono">Total queue count: {pendingStudents.length}</span>
          </div>

          {pendingStudents.length === 0 ? (
            <div className="p-12 text-center bg-white border border-gray-250 rounded-2xl">
              <UserCheck className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-sm text-[#091426]">Onboarding Queue Cleared!</p>
              <p className="text-xs text-[#75777d] mt-1 max-w-xs mx-auto">
                No parents are currently submitting kid details for approval. All profiles have activated student IDs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden"
                >
                  <div className="flex gap-3 justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                        Pending Supervisor approval
                      </span>
                      <h4 className="font-sans font-bold text-base text-[#091426] mt-1.5">{student.name}</h4>
                      <p className="text-xs text-[#45474c]">{student.grade} • Section {student.section}</p>
                    </div>

                    <div className="flex flex-col items-end text-right text-[10px] text-[#75777d] font-semibold space-y-0.5">
                      <span>Parent: {student.guardianName}</span>
                      <span>{student.guardianPhone}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Enter Assigned Student Roll / ID Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. STD-2026-105"
                        value={tempIds[student.id] || ''}
                        onChange={(e) => setTempIds({ ...tempIds, [student.id]: e.target.value })}
                        className="flex-grow px-3 py-1.5 border border-[#c5c6cd] bg-white rounded-lg text-xs font-semibold focus:outline-none"
                      />
                      <button
                        onClick={() => handleApproveClick(student.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve & Activate ID</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SUBTAB CONTENT: MANAGE MARKS & LECTURES */}
      {activeSubTab === 'students' && (
        <section className="space-y-4 animate-fade-in text-slate-900">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search filter */}
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search registered active students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c5c6cd] rounded-xl text-xs font-semibold"
              />
            </div>
            <span className="text-xs text-[#75777d] font-semibold">
              Showing {filteredApproved.length} approved scholastic records
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredApproved.length === 0 ? (
              <p className="text-center py-8 text-xs text-[#75777d] bg-white border border-gray-250 rounded-2xl leading-relaxed">
                No active students matched search criteria.<br />Verify student registry or switch tabs.
              </p>
            ) : (
              filteredApproved.map((student) => (
                <div
                  key={student.id}
                  className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-indigo-150 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-indigo-50 border border-indigo-150 text-indigo-700 font-extrabold text-xs flex items-center justify-center rounded-full">
                        {student.name[0]}
                      </span>
                      <h4 className="font-sans font-extrabold text-sm text-[#091426]">{student.name}</h4>
                    </div>
                    <p className="text-xs text-[#45474c]">
                      {student.grade} • Section {student.section} • Supervisor: {student.guardianName}
                    </p>
                    <span className="inline-block px-2.5 py-0.5 bg-[#b3ecd0] text-[#002115] text-[10px] font-bold rounded-md">
                      ID: {student.studentId}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    {/* Compact GPA summary stats */}
                    <div className="text-left text-xs bg-slate-50 border border-slate-100 p-2 rounded-lg space-y-0.5">
                      <p className="text-[9px] uppercase text-slate-400 font-bold">Grades List</p>
                      <div className="flex gap-2">
                        {student.academicGrades.map((g, i) => (
                          <span key={i} className="font-extrabold text-xs text-[#091426]">
                            {g.subject.slice(0,3)}: <span className="text-indigo-600">{g.grade}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick action edit btn */}
                    <button
                      onClick={() => handleEditInit(student)}
                      className="px-4 py-2.5 bg-[#091426] hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Update Grades / Attendance</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* EDIT STUDENT DATA OVERLAY PANEL */}
          {selectedEditStudent && (
            <div className="fixed inset-0 bg-[#091426]/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-indigo-100 my-8">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-sans font-extrabold text-base text-[#091426]">
                      Update Academic Records
                    </h3>
                    <p className="text-xs text-[#75777d]">
                      Editing: {selectedEditStudent.name} ({selectedEditStudent.studentId})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEditStudent(null)}
                    className="p-1 px-2.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Attendance modifier */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Lectures Attendance Sheet
                    </h5>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="block text-[11px] text-[#45474c]">Days present</label>
                        <input
                          type="number"
                          value={editedPresent}
                          onChange={(e) => setEditedPresent(parseInt(e.target.value) || 0)}
                          className="w-full bg-white px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] text-[#45474c]">Total lectures</label>
                        <input
                          type="number"
                          value={editedTotal}
                          onChange={(e) => setEditedTotal(parseInt(e.target.value) || 0)}
                          className="w-full bg-white px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grades modifier list */}
                  <div className="space-y-2.5">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                      Subject Marks (Raw Percentage scale 1-100)
                    </h5>
                    
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {editedGrades.map((g, i) => (
                        <div key={i} className="flex justify-between items-center text-xs bg-[#f8f9ff] p-2.5 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700">{g.subject}</span>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={g.marks}
                              onChange={(e) => handleGradeChange(i, e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-bold"
                            />
                            <span className="w-8 h-8 font-bold text-xs bg-indigo-50 border border-indigo-150 text-indigo-700 rounded-md flex items-center justify-center shrink-0">
                              {g.grade}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {editFeedback && (
                    <p className={`text-xs font-semibold px-1 text-center ${editFeedback.startsWith('Success') ? 'text-emerald-700' : 'text-[#ba1a1a]'}`}>
                      {editFeedback}
                    </p>
                  )}

                  <button
                    onClick={handleSaveStudentData}
                    className="w-full py-3 bg-[#091426] text-white hover:bg-slate-800 rounded-xl text-xs font-extrabold cursor-pointer transition-all"
                  >
                    Publish Report Card Updates
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SUBTAB CONTENT: PUBLISH NOTICE BOARD */}
      {activeSubTab === 'notices' && (
        <section className="space-y-4 max-w-md mx-auto animate-fade-in text-slate-900">
          <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BellRing className="w-5 h-5 text-indigo-600" />
              <h3 className="font-sans font-extrabold text-[#091426] text-sm md:text-base">
                Publish School Update
              </h3>
            </div>

            <form onSubmit={handleAddNoticeSubmit} className="space-y-4">
              <div className="flex flex-col gap-1 text-xs">
                <label className="block font-bold text-slate-550">Alert Title / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Winter Term Exam Retake"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <label className="block font-bold text-slate-550 font-sans">Category Tag</label>
                <select
                  value={newNoticeCategory}
                  onChange={(e) => setNewNoticeCategory(e.target.value as 'Urgent' | 'General' | 'Event')}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                >
                  <option value="Urgent">🚨 Urgent Warning</option>
                  <option value="General">📢 General Notification</option>
                  <option value="Event">📅 Upcoming Event Banner</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <label className="block font-bold text-slate-550">Announcement text description</label>
                <textarea
                  placeholder="Insert the official text here for the parent dashboard notice board..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl resize-none text-xs leading-relaxed"
                />
              </div>

              {noticeFeedback && (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-xl text-center border border-emerald-100">
                  {noticeFeedback}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#091426] hover:bg-slate-805 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
              >
                Publish Notice to Parents feed
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
