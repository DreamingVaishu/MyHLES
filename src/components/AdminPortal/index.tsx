import React, { useState, useEffect } from 'react';
import { Student, AccessRequest, Notice, Transaction, FeeStructureItem, ActivityLog, SchoolConfig } from '../../types';
import Dashboard from './Dashboard';
import Approvals from './Approvals';
import AuditLogs from './AuditLogs';
import UserDirectory from './UserDirectory';
import SchoolSetup from './SchoolSetup';
import SecuritySettings from './SecuritySettings';
import RejectionModal from './RejectionModal';
import Navbar from './Navbar';

interface AdminPortalProps {
  students: Student[];
  onUpdateStudent: (updated: Student) => void;
  requests: AccessRequest[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string, category: string, comment: string) => void;
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  transactions: Transaction[];
  onAddTransaction: (txn: Transaction) => void;
  feeStructures: FeeStructureItem[];
  onUpdateFeeStructure: (fees: FeeStructureItem[]) => void;
  activityLogs: ActivityLog[];
  onAddLog: (action: string, target: string) => void;
  schoolConfig: SchoolConfig;
  onUpdateSchoolConfig: (conf: SchoolConfig) => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export default function AdminPortal({
  students,
  onUpdateStudent,
  requests,
  onApproveRequest,
  onRejectRequest,
  notices,
  onAddNotice,
  transactions,
  onAddTransaction,
  feeStructures,
  onUpdateFeeStructure,
  activityLogs,
  onAddLog,
  schoolConfig,
  onUpdateSchoolConfig,
  activeTab,
  onChangeTab
}: AdminPortalProps) {
  
  // Page Local states
  const [loading, setLoading] = useState(false);
  const [adminLookupQuery, setAdminLookupQuery] = useState('');
  
  // Tab states for approvals sub-view
  const [approvalsTab, setApprovalsTab] = useState<'Teacher' | 'Parent'>('Teacher');
  
  // New user directory form states
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultySubject, setNewFacultySubject] = useState('Mathematics');
  const [newFacultyRole, setNewFacultyRole] = useState<'Teacher' | 'Accounts' | 'Admin'>('Teacher');

  // School config editor states
  const [termName, setTermName] = useState(schoolConfig.currentTerm);
  const [systemAlertMessage, setSystemAlertMessage] = useState(schoolConfig.systemWideAlert || '');

  // Review Reject modal
  const [reviewRequest, setReviewRequest] = useState<AccessRequest | null>(null);
  const [rejectCategory, setRejectCategory] = useState('Impersonation Check');
  const [rejectComment, setRejectComment] = useState('');

  // Simulate premium skeleton loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyName.trim()) return;

    onAddLog("Provisioned Local User ID", `${newFacultyRole} credentials assigned to: ${newFacultyName}`);
    
    setNewFacultyName('');
    alert(`Provisioned ${newFacultyName} as ${newFacultyRole} successfully! Internal credentials delivered.`);
  };

  const handleUpdateSchoolSetup = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolConfig({
      ...schoolConfig,
      currentTerm: termName,
      systemWideAlert: systemAlertMessage || undefined
    });
    onAddLog("Modified Multi-School Hub", `Term updated: ${termName}. Emergency banners adjusted.`);
    alert("System specifications saved globally.");
  };

  const handleApproveRequestWithLog = (req: AccessRequest) => {
    onApproveRequest(req.id);
    onAddLog("Approved Parent Account Verification", `Linked parent ${req.name} to student ${req.linkedStudentName}`);
    alert(`Verified and Approved parent link for ${req.linkedStudentName}. Notification dispatched.`);
  };

  const handleRejectRequestWithLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewRequest) return;
    
    onRejectRequest(reviewRequest.id, rejectCategory, rejectComment);
    onAddLog("Rejected Portal Request Link", `Rejected parent credentials for ${reviewRequest.name} due to ${rejectCategory}`);
    
    setReviewRequest(null);
    setRejectComment('');
    alert(`Rejected parental enrollment checklist. Reasons catalogued in security records.`);
  };

  const handleDownloadLogs = () => {
    alert("Spool download generated for audit logs. Dispatching secure PDF file to regional network.");
  };

  const handleUpdateSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Supervisor override controls saved successfully.");
  };

  return (
    <div className="space-y-6">
      <Navbar />
      
      {/* Simulation loader */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-xl w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      ) : (
        <>
          {activeTab.toLowerCase() === 'dashboard' && (
            <Dashboard
              students={students}
              transactions={transactions}
              notices={notices}
              requests={requests}
              onChangeTab={onChangeTab}
            />
          )}
          {activeTab.toLowerCase() === 'approvals' && (
            <Approvals
              requests={requests}
              approvalsTab={approvalsTab}
              onApprovalsTabChange={setApprovalsTab}
              onApproveRequest={handleApproveRequestWithLog}
              onReviewRequest={setReviewRequest}
            />
          )}
          {activeTab.toLowerCase() === 'audit logs' && (
            <AuditLogs
              activityLogs={activityLogs}
              onDownloadLogs={handleDownloadLogs}
            />
          )}
          {activeTab.toLowerCase() === 'user management' && (
            <UserDirectory
              newFacultyName={newFacultyName}
              onNewFacultyNameChange={setNewFacultyName}
              newFacultySubject={newFacultySubject}
              onNewFacultySubjectChange={setNewFacultySubject}
              newFacultyRole={newFacultyRole}
              onNewFacultyRoleChange={setNewFacultyRole}
              onCreateFaculty={handleCreateFaculty}
              onRevokeUser={(userName, userRole) => {
                alert(`${userName}'s active authority credentials suspended.`);
                onAddLog("Suspended User Credentials", `Disabled logins of ${userName}`);
              }}
              onAddLog={onAddLog}
            />
          )}
          {activeTab.toLowerCase() === 'school setup' && (
            <SchoolSetup
              schoolConfig={schoolConfig}
              termName={termName}
              onTermNameChange={setTermName}
              systemAlertMessage={systemAlertMessage}
              onSystemAlertMessageChange={setSystemAlertMessage}
              onUpdateSchoolSetup={handleUpdateSchoolSetup}
            />
          )}
          {activeTab.toLowerCase() === 'security settings' && (
            <SecuritySettings
              onUpdateSecuritySettings={handleUpdateSecuritySettings}
            />
          )}
        </>
      )}

      {/* PARENT REJECTION REVIEW DIALOG BOX */}
      <RejectionModal
        isOpen={!!reviewRequest}
        request={reviewRequest}
        onClose={() => setReviewRequest(null)}
        rejectCategory={rejectCategory}
        onRejectCategoryChange={setRejectCategory}
        rejectComment={rejectComment}
        onRejectCommentChange={setRejectComment}
        onRejectRequest={handleRejectRequestWithLog}
      />

    </div>
  );
}
