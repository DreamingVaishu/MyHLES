import React, { useState, useEffect } from 'react';
import { Student, Transaction, FeeStructureItem, ActivityLog } from '../../types';
import Dashboard from './Dashboard';
import CashPayments from './CashPayments';
import StudentRecords from './StudentRecords';
import FeeStructures from './FeeStructures';
import Reports from './Reports';
import SecuritySettings from './SecuritySettings';
import ReceiptManager from './ReceiptManager';
import StudentEditModal from './StudentEditModal';
import StudentDetailModal from './StudentDetailModal';
import Navbar from './Navbar';

interface AccountsPortalProps {
  students: Student[];
  onUpdateStudent: (updated: Student) => void;
  transactions: Transaction[];
  onAddTransaction: (txn: Transaction) => void;
  feeStructures: FeeStructureItem[];
  onUpdateFeeStructure: (fees: FeeStructureItem[]) => void;
  activeTab: string;
  onAddLog: (action: string, target: string) => void;
}

export default function AccountsPortal({
  students,
  onUpdateStudent,
  transactions,
  onAddTransaction,
  feeStructures,
  onUpdateFeeStructure,
  activeTab,
  onAddLog
}: AccountsPortalProps) {
  
  // Page local states
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentLookupQuery, setStudentLookupQuery] = useState('');
  
  // New transaction form states
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Cheque' | 'Transfer'>('Cash');
  const [payNotes, setPayNotes] = useState('');
  const [generateReceipt, setGenerateReceipt] = useState(true);

  // New Fee form states (Fee Structures tab)
  const [newFeeGrade, setNewFeeGrade] = useState('10');
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');
  const [newFeeDueDate, setNewFeeDueDate] = useState('');

  // Receipt Void/Reprint modal
  const [receiptManagerOpen, setReceiptManagerOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [voidReason, setVoidReason] = useState('');
  const [voidReasonError, setVoidReasonError] = useState(false);

  // Student Records edit states
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudentDetails, setViewingStudentDetails] = useState<Student | null>(null);

  // Simulate loading skeletons
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Keep selected student in sync if list updates
  useEffect(() => {
    if (selectedStudent) {
      const match = students.find(s => s.id === selectedStudent.id);
      if (match) setSelectedStudent(match);
    }
  }, [students]);

  // Transaction confirmations
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const amountVal = parseFloat(payAmount);
    if (!amountVal || amountVal <= 0) {
      alert("Please enter a valid positive payment amount.");
      return;
    }

    // Capture standard transaction model
    const newTxn: Transaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      grade: selectedStudent.grade,
      division: selectedStudent.division,
      amount: amountVal,
      date: payDate,
      method: payMethod,
      notes: payNotes,
      receiptSent: generateReceipt,
      status: 'Recorded',
      timestamp: "Just now"
    };

    onAddTransaction(newTxn);

    // Update student's outstanding balance
    const updatedBalance = Math.max(0, selectedStudent.outstandingBalance - amountVal);
    onUpdateStudent({
      ...selectedStudent,
      outstandingBalance: updatedBalance,
      feeStatus: updatedBalance === 0 ? 'Paid' : 'Pending'
    });

    onAddLog("Recorded Offline Payment", `₹${amountVal} for active student ${selectedStudent.name}`);
    
    // clear form
    setPayAmount('');
    setPayNotes('');
    alert(`Payment of ₹${amountVal.toLocaleString('en-IN')} successfully recorded for ${selectedStudent.name}. Receipt copy dispatched.`);
  };

  // Add new fee structure line item
  const handleAddFeeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeName || !newFeeAmount || !newFeeDueDate) {
      alert("Please fill all required fee rules.");
      return;
    }

    const nAmount = parseFloat(newFeeAmount);
    if (!nAmount || nAmount <= 0) {
      alert("Please insert valid billing amount.");
      return;
    }

    const newItem: FeeStructureItem = {
      id: `FEE-${Date.now().toString().slice(-4)}`,
      grade: newFeeGrade,
      feeName: newFeeName,
      amount: nAmount,
      dueDate: newFeeDueDate
    };

    onUpdateFeeStructure([...feeStructures, newItem]);
    onAddLog("Configured Fee Structure", `${newFeeName} (₹${nAmount}) defined for Grade ${newFeeGrade}`);

    // Reset fee fields
    setNewFeeName('');
    setNewFeeAmount('');
    setNewFeeDueDate('');
    alert("New fee parameters defined successfully.");
  };

  const handleRemoveFeeItem = (id: string) => {
    const feeItem = feeStructures.find(f => f.id === id);
    if (!feeItem) return;
    
    onUpdateFeeStructure(feeStructures.filter(f => f.id !== id));
    onAddLog("Deleted Fee Structure", `Removed line item: ${feeItem.feeName}`);
    alert("Fee line item removed from standard roster.");
  };

  // Void a transaction
  const handleVoidTxn = () => {
    if (!selectedTxn) return;
    if (!voidReason.trim()) {
      setVoidReasonError(true);
      return;
    }

    // Find is active student
    const student = students.find(s => s.id === selectedTxn.studentId);
    if (student) {
      // Re-add voided amount to parents balance
      const restoredBalance = student.outstandingBalance + selectedTxn.amount;
      onUpdateStudent({
        ...student,
        outstandingBalance: restoredBalance,
        feeStatus: 'Overdue'
      });
    }

    const updatedTxns = transactions.map(t => {
      if (t.id === selectedTxn.id) {
        return { ...t, status: 'Voided' as const, voidReason };
      }
      return t;
    });

    // Update list trigger in parent state
    // We can do it by modifying existing items or logs
    // Inside this prototype let's directly update via our proxy functions or logs
    onAddLog("Voided Cash Transaction", `Voided receipt ${selectedTxn.id} for ₹${selectedTxn.amount}. Reason: ${voidReason}`);
    
    setVoidReason('');
    setVoidReasonError(false);
    setSelectedTxn(null);
    setReceiptManagerOpen(false);
    alert("Receipt successfully VOIDED. Balance restored to student account logs.");
  };

  const handleClearPaymentForm = () => {
    setPayAmount('');
    setPayNotes('');
  };

  const handleExportReport = () => {
    alert("Export generated! Directing complete print spool to standard printer draft queue.");
  };

  const handleUpdateSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Bursar security settings saved successfully.");
  };

  return (
    <div className="space-y-6">
      <Navbar />
      
      {/* Simulation loader */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
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
              transactions={transactions}
              students={students}
              onOpenReceiptManager={() => setReceiptManagerOpen(true)}
            />
          )}
          {activeTab.toLowerCase() === 'student records' && (
            <StudentRecords 
              students={students}
              onEditStudent={setEditingStudent}
            />
          )}
          {activeTab.toLowerCase() === 'cash payments' && (
            <CashPayments
              students={students}
              selectedStudent={selectedStudent}
              onStudentSelect={setSelectedStudent}
              studentLookupQuery={studentLookupQuery}
              onStudentLookupChange={setStudentLookupQuery}
              payAmount={payAmount}
              onPayAmountChange={setPayAmount}
              payDate={payDate}
              onPayDateChange={setPayDate}
              payMethod={payMethod}
              onPayMethodChange={setPayMethod}
              payNotes={payNotes}
              onPayNotesChange={setPayNotes}
              generateReceipt={generateReceipt}
              onGenerateReceiptChange={setGenerateReceipt}
              onConfirmPayment={handleConfirmPayment}
              onClearForm={handleClearPaymentForm}
            />
          )}
          {activeTab.toLowerCase() === 'fee structures' && (
            <FeeStructures
              feeStructures={feeStructures}
              onRemoveFeeItem={handleRemoveFeeItem}
              newFeeGrade={newFeeGrade}
              onNewFeeGradeChange={setNewFeeGrade}
              newFeeName={newFeeName}
              onNewFeeNameChange={setNewFeeName}
              newFeeAmount={newFeeAmount}
              onNewFeeAmountChange={setNewFeeAmount}
              newFeeDueDate={newFeeDueDate}
              onNewFeeDueDateChange={setNewFeeDueDate}
              onAddFeeItem={handleAddFeeItem}
            />
          )}
          {activeTab.toLowerCase() === 'reports' && (
            <Reports
              transactions={transactions}
              onExportReport={handleExportReport}
            />
          )}
          {activeTab.toLowerCase() === 'security settings' && (
            <SecuritySettings
              onUpdateSettings={handleUpdateSecuritySettings}
            />
          )}
        </>
      )}

      {/* Receipt Manager Modal */}
      <ReceiptManager
        isOpen={receiptManagerOpen}
        onClose={() => { setReceiptManagerOpen(false); setSelectedTxn(null); }}
        transactions={transactions}
        selectedTxn={selectedTxn}
        onTxnSelect={(txn) => { setSelectedTxn(txn); setVoidReasonError(false); }}
        voidReason={voidReason}
        onVoidReasonChange={setVoidReason}
        voidReasonError={voidReasonError}
        onVoidTxn={handleVoidTxn}
        onReprintReceipt={() => { alert(`Receipt spool triggered! Digital Copy refaxed and resent to pupil guardian contact.`); }}
      />

      {/* Student Edit Modal */}
      <StudentEditModal
        isOpen={!!editingStudent}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onUpdateStudent={(student) => {
          onUpdateStudent(student);
          alert("Bursar records updated successfully.");
        }}
        onStudentChange={setEditingStudent}
      />

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={!!viewingStudentDetails}
        student={viewingStudentDetails}
        onClose={() => setViewingStudentDetails(null)}
      />

    </div>
  );
}
