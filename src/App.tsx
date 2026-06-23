import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Role, Student, AccessRequest, Notice, Transaction, FeeStructureItem, ActivityLog, SchoolConfig } from './types';
import { 
  INITIAL_SCHOOL, 
  INITIAL_STUDENTS, 
  INITIAL_REQUESTS, 
  INITIAL_NOTICES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_FEES, 
  INITIAL_LOGS 
} from './mockData';

import LoginScreen from './components/LoginScreen';
import PortalShell from './components/PortalShell';
import TeacherPortal from './components/TeacherPortal';
import AccountsPortal from './components/AccountsPortal';
import AdminPortal from './components/AdminPortal';
import ParentMobileApp from './components/ParentMobile/App';

function AppContent() {
  const navigate = useNavigate();
  
  // Session Access States
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  
  // Navigation active tabs
  const [activeTab, setActiveTab] = useState('Dashboard');

  // School Global Config
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>({
    ...INITIAL_SCHOOL,
    currentTerm: 'Term 2 (2026)',
    systemWideAlert: 'Notice: heavy monsoons warning in Mumbai central. Check standard guidelines if commuting.'
  });

  // Current focal grade bounds for Class Switcher carousel
  const [currentGrade, setCurrentGrade] = useState('10');
  const [currentDiv, setCurrentDiv] = useState('A');

  // Durable cache state overrides for active lists
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [requests, setRequests] = useState<AccessRequest[]>(INITIAL_REQUESTS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>(INITIAL_FEES);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  // Helper helper to append terminal audit log histories
  const handleAddNewActivityLog = (action: string, target: string) => {
    const formattedTime = new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + String(Date.now() % 1000).padStart(3, '0');
    
    let actorName = 'Superintendent Admin';
    let actorRole: Role = 'Admin';
    if (role === 'Teacher') {
      actorName = 'Dr. Sarah Jenkins';
      actorRole = 'Teacher';
    } else if (role === 'Accounts') {
      actorName = 'A. Shankaran (Bursar)';
      actorRole = 'Accounts';
    }

    const newLog: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      role: actorRole,
      action: action,
      target: target,
      // For local terminal compliance display:
      time: formattedTime,
      ip: `192.168.12.${Math.floor(Math.random() * 80) + 10}`,
      user: actorName.split(' ')[0]
    };

    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = (selectedRole: Role, userEmail: string) => {
    setRole(selectedRole);
    setEmail(userEmail);
    setActiveTab('Dashboard');
    
    // Navigate to the portal's main page (already on the correct route)
    // Push positive audit trace
    const formattedTime = new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + String(Date.now() % 1000).padStart(3, '0');
    const loginLog: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: selectedRole === 'Admin' ? 'Admin Sarah' : selectedRole === 'Accounts' ? 'A. Shankaran' : 'Dr. Sarah Jenkins',
      role: selectedRole,
      action: "Access Session Synchronized",
      target: "Academic Portal Link Active",
      time: formattedTime,
      ip: `192.168.12.${Math.floor(Math.random() * 80) + 10}`,
      user: selectedRole
    };
    setActivityLogs(prev => [loginLog, ...prev]);
  };

  const handleLogout = () => {
    setRole(null);
    setEmail('');
    setActiveTab('Dashboard');
    navigate('/');
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleApproveRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    
    // Find the original request details
    const original = requests.find(r => r.id === id);
    if (original && original.linkedStudentId) {
      // Find the student linked to check balance status check
      const studentMatch = students.find(s => s.id === original.linkedStudentId);
      if (studentMatch) {
         // Mark billing state verified or pending link approval
         handleUpdateStudent({
           ...studentMatch,
           feeStatus: studentMatch.outstandingBalance > 0 ? 'Pending' : 'Paid'
         });
      }
    }
  };

  const handleRejectRequest = (id: string, category: string, comment: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected', rejectionCategory: category, rejectionReason: comment } : r));
  };

  const handleClassChange = (grade: string, div: string) => {
    setCurrentGrade(grade);
    setCurrentDiv(div);
  };

  const handleAddNotice = (notice: Notice) => {
    setNotices(prev => [notice, ...prev]);
    handleAddNewActivityLog("Published Notice Bulletin", notice.title);
  };

  const handleAddTransaction = (txn: Transaction) => {
    setTransactions(prev => [txn, ...prev]);
  };

  const handleUpdateFeeStructure = (fees: FeeStructureItem[]) => {
    setFeeStructures(fees);
  };

  const handleSendGlobalNotice = (msg: string) => {
    const newGlobalNotice: Notice = {
      id: `NTC-GB-${Date.now().toString().slice(-3)}`,
      title: "GLOBAL SYSTEM ANNOUNCEMENT",
      message: msg,
      date: new Date().toISOString().split('T')[0],
      sentBy: role === 'Admin' ? 'Superintendent Office' : 'Dr. Sarah Jenkins',
      senderRole: role || 'Admin',
      audienceType: 'All'
    };
    setNotices(prev => [newGlobalNotice, ...prev]);
    handleAddNewActivityLog("Dispatched Global Warning Alert", msg.slice(0, 30) + "...");
  };

  return (
    <Routes>
      <Route path="/parent" element={<ParentMobileApp />} />
      
      <Route path="/teacher/login" element={
        role === null ? (
          <LoginScreen 
            onLogin={handleLogin}
            onAddAccessRequest={(req) => {
              setRequests(prev => [req, ...prev]);
              handleAddNewActivityLog("Created Signup Application", req.name);
            }}
            autoSelectRole="Teacher"
          />
        ) : <Navigate to="/teacher" replace />
      } />
      
      <Route path="/accounts/login" element={
        role === null ? (
          <LoginScreen 
            onLogin={handleLogin}
            onAddAccessRequest={(req) => {
              setRequests(prev => [req, ...prev]);
              handleAddNewActivityLog("Created Signup Application", req.name);
            }}
            autoSelectRole="Accounts"
          />
        ) : <Navigate to="/accounts" replace />
      } />
      
      <Route path="/admin/login" element={
        role === null ? (
          <LoginScreen 
            onLogin={handleLogin}
            onAddAccessRequest={(req) => {
              setRequests(prev => [req, ...prev]);
              handleAddNewActivityLog("Created Signup Application", req.name);
            }}
            autoSelectRole="Admin"
          />
        ) : <Navigate to="/admin" replace />
      } />
      
      <Route path="/teacher" element={
        role === 'Teacher' ? (
          <PortalShell
            role={role}
            onLogout={handleLogout}
            activeTab={activeTab}
            onChangeTab={(t) => setActiveTab(t)}
            selectedClass={`Grade ${currentGrade} - Div ${currentDiv}`}
            onClassChange={(newClass) => {
              const matches = newClass.match(/Grade\s+(\d+)\s+-\s+Div\s+(\w+)/i);
              if (matches) {
                handleClassChange(matches[1], matches[2]);
              }
            }}
            onSendGlobalNotice={handleSendGlobalNotice}
          >
            <TeacherPortal
              students={students}
              onUpdateStudent={handleUpdateStudent}
              requests={requests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              notices={notices}
              onAddNotice={handleAddNotice}
              currentGrade={currentGrade}
              currentDiv={currentDiv}
              onClassChange={handleClassChange}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
            />
          </PortalShell>
        ) : <Navigate to="/teacher/login" replace />
      } />
      
      <Route path="/accounts" element={
        role === 'Accounts' ? (
          <PortalShell
            role={role}
            onLogout={handleLogout}
            activeTab={activeTab}
            onChangeTab={(t) => setActiveTab(t)}
            selectedClass={`Grade ${currentGrade} - Div ${currentDiv}`}
            onClassChange={(newClass) => {
              const matches = newClass.match(/Grade\s+(\d+)\s+-\s+Div\s+(\w+)/i);
              if (matches) {
                handleClassChange(matches[1], matches[2]);
              }
            }}
            onSendGlobalNotice={handleSendGlobalNotice}
          >
            <AccountsPortal
              students={students}
              onUpdateStudent={handleUpdateStudent}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              feeStructures={feeStructures}
              onUpdateFeeStructure={handleUpdateFeeStructure}
              activeTab={activeTab}
              onAddLog={handleAddNewActivityLog}
            />
          </PortalShell>
        ) : <Navigate to="/accounts/login" replace />
      } />
      
      <Route path="/admin" element={
        role === 'Admin' ? (
          <PortalShell
            role={role}
            onLogout={handleLogout}
            activeTab={activeTab}
            onChangeTab={(t) => setActiveTab(t)}
            selectedClass={`Grade ${currentGrade} - Div ${currentDiv}`}
            onClassChange={(newClass) => {
              const matches = newClass.match(/Grade\s+(\d+)\s+-\s+Div\s+(\w+)/i);
              if (matches) {
                handleClassChange(matches[1], matches[2]);
              }
            }}
            onSendGlobalNotice={handleSendGlobalNotice}
          >
            <AdminPortal
              students={students}
              onUpdateStudent={handleUpdateStudent}
              requests={requests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              notices={notices}
              onAddNotice={handleAddNotice}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              feeStructures={feeStructures}
              onUpdateFeeStructure={handleUpdateFeeStructure}
              activityLogs={activityLogs}
              onAddLog={handleAddNewActivityLog}
              schoolConfig={schoolConfig}
              onUpdateSchoolConfig={setSchoolConfig}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
            />
          </PortalShell>
        ) : <Navigate to="/admin/login" replace />
      } />
      
      <Route path="/" element={<Navigate to="/parent" replace />} />
      <Route path="*" element={<Navigate to="/parent" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
