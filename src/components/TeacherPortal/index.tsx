import React, { useState, useEffect } from 'react';
import { Student, AccessRequest, Notice } from '../../types';
import { X, ToggleLeft } from 'lucide-react';
import Dashboard from './Dashboard';
import StudentsTable from './StudentsTable';
import Grading from './Grading';
import Attendance from './Attendance';
import Notices from './Notices';
import Settings from './Settings';
import Navbar from './Navbar';

interface TeacherPortalProps {
  students: Student[];
  onUpdateStudent: (updated: Student) => void;
  requests: AccessRequest[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string, category: string, comment: string) => void;
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  currentGrade: string;
  currentDiv: string;
  onClassChange: (grade: string, div: string) => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export default function TeacherPortal({
  students,
  onUpdateStudent,
  requests,
  onApproveRequest,
  onRejectRequest,
  notices,
  onAddNotice,
  currentGrade,
  currentDiv,
  onClassChange,
  activeTab,
  onChangeTab
}: TeacherPortalProps) {
  
  // Page Local states
  const [loading, setLoading] = useState(false);
  const [classNoticeMsg, setClassNoticeMsg] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [reviewRequest, setReviewRequest] = useState<AccessRequest | null>(null);
  
  // Rejection modal states
  const [rejectCategory, setRejectCategory] = useState('Incomplete Documentation');
  const [rejectComment, setRejectComment] = useState('');

  // Simulate premium skeleton loader on active target tab change or class switches
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [activeTab, currentGrade, currentDiv]);

  const handleBroadcastClassNotice = (message: string) => {
    if (!message.trim()) return;

    const newNotice: Notice = {
      id: `NTC-${Date.now().toString().slice(-4)}`,
      title: `Notice for Grade ${currentGrade} - Div ${currentDiv}`,
      message: message,
      date: new Date().toISOString().split('T')[0],
      sentBy: "Teacher",
      senderRole: "Teacher",
      audienceType: "Class",
      targetGrade: currentGrade,
      targetDivision: currentDiv
    };

    onAddNotice(newNotice);
    alert(`Notice broadcasted successfully to GRADE ${currentGrade} - DIV ${currentDiv}!`);
  };

  const handleAttendanceToggle = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const existingIndex = student.attendanceHistory.findIndex(a => a.date === attendanceDate);
    let newHistory = [...student.attendanceHistory];
    
    if (existingIndex > -1) {
      newHistory[existingIndex] = { date: attendanceDate, status };
    } else {
      newHistory.push({ date: attendanceDate, status });
    }

    onUpdateStudent({
      ...student,
      attendanceHistory: newHistory
    });
  };

  const handleGradeCellChange = (studentId: string, subject: string, marksStr: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const parsed = parseInt(marksStr) || 0;
    const validatedMarks = Math.min(100, Math.max(0, parsed));
    
    let letterGrade = 'F';
    if (validatedMarks >= 90) letterGrade = 'A+';
    else if (validatedMarks >= 80) letterGrade = 'A';
    else if (validatedMarks >= 70) letterGrade = 'B+';
    else if (validatedMarks >= 60) letterGrade = 'B';
    else if (validatedMarks >= 50) letterGrade = 'C';
    else if (validatedMarks >= 35) letterGrade = 'D';

    const newGrades = student.grades.map(g => {
      if (g.subject.toLowerCase() === subject.toLowerCase()) {
        return { ...g, marksSecured: validatedMarks, grade: letterGrade };
      }
      return g;
    });

    onUpdateStudent({
      ...student,
      grades: newGrades
    });
  };

  const handleUpdateStudentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    
    if (selectedStudent && selectedStudent.id === editingStudent.id) {
      setSelectedStudent(editingStudent);
    }
    setEditingStudent(null);
    alert("Student general information saved successfully.");
  };

  const handleTransferClass = (student: Student, targetGrade: string, targetDiv: string) => {
    onUpdateStudent({
      ...student,
      grade: targetGrade,
      division: targetDiv
    });
    alert(`Transferred ${student.name} successfully to Grade ${targetGrade} - Division ${targetDiv}.`);
  };

  return (
    <div className="space-y-6">
      <Navbar
        currentGrade={currentGrade}
        currentDiv={currentDiv}
        onSendGlobalNotice={(msg) => alert("Global notice: " + msg)}
      />
      
      {/* Simulation loading loader */}
      {loading ? (
        <div className="space-y-6">
          <div className="w-full h-44 bg-slate-200 rounded-xl animate-skeleton"></div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7 h-64 bg-slate-200 rounded-xl animate-skeleton"></div>
            <div className="col-span-12 md:col-span-5 h-64 bg-slate-200 rounded-xl animate-skeleton"></div>
          </div>
        </div>
      ) : (
        <>
          {activeTab.toLowerCase() === 'dashboard' && (
            <Dashboard
              requests={requests}
              onApproveRequest={onApproveRequest}
              onReviewRequest={setReviewRequest}
              currentGrade={currentGrade}
              currentDiv={currentDiv}
              onClassChange={onClassChange}
              onBroadcastNotice={handleBroadcastClassNotice}
              onChangeTab={onChangeTab}
            />
          )}
          {activeTab.toLowerCase() === 'students' && (
            <StudentsTable
              students={students}
              currentGrade={currentGrade}
              currentDiv={currentDiv}
              onViewStudent={setSelectedStudent}
              onEditStudent={setEditingStudent}
            />
          )}
          {activeTab.toLowerCase() === 'grading' && (
            <Grading
              students={students}
              currentGrade={currentGrade}
              currentDiv={currentDiv}
              onGradeCellChange={handleGradeCellChange}
            />
          )}
          {activeTab.toLowerCase() === 'attendance' && (
            <Attendance
              students={students}
              currentGrade={currentGrade}
              currentDiv={currentDiv}
              attendanceDate={attendanceDate}
              onDateChange={setAttendanceDate}
              onAttendanceToggle={handleAttendanceToggle}
            />
          )}
          {activeTab.toLowerCase() === 'notices' && (
            <Notices
              notices={notices}
              currentGrade={currentGrade}
              currentDiv={currentDiv}
            />
          )}
          {activeTab.toLowerCase() === 'settings' && (
            <Settings onSave={() => alert("Profile details updated successfully inside the prototype cache.")} />
          )}
        </>
      )}

      {/* DETAILED STUDENT MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center bg-gradient-to-r from-slate-900 to-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  {selectedStudent.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">ID: {selectedStudent.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-black tracking-wider">Guardian Name</span>
                  <span className="font-bold text-slate-800 mt-1 block">{selectedStudent.guardianName}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-black tracking-wider">Guardian Contact</span>
                  <span className="font-bold text-slate-800 mt-1 block">{selectedStudent.guardianContact}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500 col-span-2">
                  <span className="block text-[11px] text-slate-400 uppercase font-black tracking-wider">Registration Address On Record</span>
                  <p className="mt-1 font-medium">Navi Mumbai, Sector 20, Tower {selectedStudent.id.slice(-3)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl border">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Class Registry Bounds</span>
                  <strong className="text-xl text-slate-900 mt-2 block">Grade {selectedStudent.grade} - Division {selectedStudent.division}</strong>
                </div>

                <div className="p-4 rounded-xl border">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Compliant Financial State</span>
                  <strong className={`text-lg mt-2 block ${
                    selectedStudent.feeStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-500'
                  }`}>
                    {selectedStudent.feeStatus === 'Paid' ? 'Fully Settled' : `Outstanding Balance: ₹${selectedStudent.outstandingBalance.toLocaleString('en-IN')}`}
                  </strong>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Academic Performance Indicators</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {selectedStudent.grades.map(grade => (
                    <div key={grade.subject} className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-lg border-slate-100">
                      <span className="text-slate-600 font-semibold">{grade.subject}</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{grade.marksSecured}%</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">{grade.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                <h4 className="text-xs font-extrabold uppercase text-slate-700 mb-3 tracking-widest flex items-center gap-1.5 select-none">
                  <ToggleLeft className="w-4 h-4 text-slate-500" />
                  <span>Administrative Transfer Option</span>
                </h4>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-500 font-semibold">Change allocation target:</label>
                  <div className="flex gap-2">
                    {[
                      { g: '10', d: 'A' },
                      { g: '10', d: 'B' },
                      { g: '11', d: 'A' },
                      { g: '12', d: 'A' }
                    ].map(t => {
                      const isCurrent = selectedStudent.grade === t.g && selectedStudent.division === t.d;
                      if (isCurrent) return null;
                      return (
                        <button
                          key={`${t.g}-${t.d}`}
                          onClick={() => {
                            handleTransferClass(selectedStudent, t.g, t.d);
                            setSelectedStudent(null);
                          }}
                          className="bg-white border text-[11px] font-bold text-slate-700 px-2 py-1 rounded shadow-sm hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                        >
                          Grade {t.g} - {t.d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MINI MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">Edit {editingStudent.name}</h3>
              <button 
                onClick={() => setEditingStudent(null)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStudentDetails} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Full Name</label>
                <input 
                  type="text" 
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full text-slate-800 border rounded text-sm p-2 outline-none focus:outline-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Guardian Name</label>
                <input 
                  type="text" 
                  value={editingStudent.guardianName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, guardianName: e.target.value })}
                  className="w-full text-slate-800 border rounded text-sm p-2 outline-none focus:outline-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Guardian Contact Phone</label>
                <input 
                  type="text" 
                  value={editingStudent.guardianContact}
                  onChange={(e) => setEditingStudent({ ...editingStudent, guardianContact: e.target.value })}
                  className="w-full text-slate-800 border rounded text-sm p-2 outline-none focus:outline-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fee Status Override</label>
                <select
                  value={editingStudent.feeStatus}
                  onChange={(e) => setEditingStudent({ ...editingStudent, feeStatus: e.target.value as any, outstandingBalance: e.target.value === 'Paid' ? 0 : editingStudent.outstandingBalance })}
                  className="w-full text-slate-800 border rounded text-sm p-2 focus:outline-slate-900"
                >
                  <option value="Paid">Paid (Balance ₹0)</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t font-semibold">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="w-1/2 py-2 border text-slate-650 rounded text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded text-xs cursor-pointer text-center"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW CONTEXT REJECTION MODAL */}
      {reviewRequest && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-3xl overflow-hidden border border-slate-200 animate-in">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">Review Linking Proposal</h3>
              <button 
                onClick={() => setReviewRequest(null)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 leading-relaxed font-semibold">
                This verification check confirms whether the requesting parent {reviewRequest.name} matches the registered guardian phone record of {reviewRequest.linkedStudentName} inside NCT system archives.
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Proposal Details:</p>
                <div className="p-3 bg-slate-50 border rounded text-xs space-y-1.5">
                  <p><span className="text-slate-400 font-medium">Linked Student:</span> <strong>{reviewRequest.linkedStudentName}</strong></p>
                  <p><span className="text-slate-400 font-medium">Proposed Parent Role:</span> <strong>{reviewRequest.name}</strong></p>
                  <p><span className="text-slate-400 font-medium">Class:</span> <strong>Grade {reviewRequest.gradeRequested} - Div {reviewRequest.divisionRequested}</strong></p>
                </div>
              </div>

              <div className="pt-2 border-t space-y-3">
                <span className="text-xs font-extrabold uppercase text-slate-800 block">Denial Reason (For audit logging):</span>
                <select
                  value={rejectCategory}
                  onChange={(e) => setRejectCategory(e.target.value)}
                  className="w-full text-slate-800 bg-slate-50 border rounded text-xs p-2 outline-none"
                >
                  <option>Incomplete Documentation</option>
                  <option>Unrecognized ID Number</option>
                  <option>Incorrect Division Applied</option>
                  <option>Security Policy Dispute</option>
                </select>

                <textarea
                  rows={2}
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Enter detailed reason (optional)..."
                  className="w-full text-slate-800 text-xs border rounded p-2 resize-none outline-none focus:outline-slate-900 bg-slate-50 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-4 border-t font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    onRejectRequest(reviewRequest.id, rejectCategory, rejectComment);
                    alert('Rejection processed and logged in system archive.');
                    setReviewRequest(null);
                  }}
                  className="flex-grow py-2 bg-rose-600 text-white rounded text-xs hover:bg-rose-700 cursor-pointer"
                >
                  Deny Proposal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApproveRequest(reviewRequest.id);
                    alert(`Account approved for ${reviewRequest.name}`);
                    setReviewRequest(null);
                  }}
                  className="flex-grow py-2 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700 cursor-pointer"
                >
                  Verify & Approve Link
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
