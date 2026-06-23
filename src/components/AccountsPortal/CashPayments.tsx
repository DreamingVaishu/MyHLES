import React from 'react';
import { Coins, Search, CheckSquare, Receipt, CheckCircle2 } from 'lucide-react';
import { Student } from '../../types';

interface CashPaymentsProps {
  students: Student[];
  selectedStudent: Student | null;
  onStudentSelect: (student: Student) => void;
  studentLookupQuery: string;
  onStudentLookupChange: (query: string) => void;
  payAmount: string;
  onPayAmountChange: (amount: string) => void;
  payDate: string;
  onPayDateChange: (date: string) => void;
  payMethod: 'Cash' | 'Cheque' | 'Transfer';
  onPayMethodChange: (method: 'Cash' | 'Cheque' | 'Transfer') => void;
  payNotes: string;
  onPayNotesChange: (notes: string) => void;
  generateReceipt: boolean;
  onGenerateReceiptChange: (generate: boolean) => void;
  onConfirmPayment: (e: React.FormEvent) => void;
  onClearForm: () => void;
}

export default function CashPayments({
  students,
  selectedStudent,
  onStudentSelect,
  studentLookupQuery,
  onStudentLookupChange,
  payAmount,
  onPayAmountChange,
  payDate,
  onPayDateChange,
  payMethod,
  onPayMethodChange,
  payNotes,
  onPayNotesChange,
  generateReceipt,
  onGenerateReceiptChange,
  onConfirmPayment,
  onClearForm
}: CashPaymentsProps) {
  
  const searchedStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentLookupQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(studentLookupQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-12 gap-6 animate-in">
      
      {/* Left Column Student search */}
      <section className="col-span-12 md:col-span-4 bg-white rounded-xl border border-slate-200 flex flex-col h-[550px] shadow-sm">
        <div className="p-4 border-b border-slate-150">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Student Directory lookup</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, Payer or class Name..."
              value={studentLookupQuery}
              onChange={(e) => onStudentLookupChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:bg-white focus:outline-[#0B1220]"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {searchedStudents.map(student => {
            const isSelected = selectedStudent?.id === student.id;
            return (
              <div
                key={student.id}
                onClick={() => onStudentSelect(student)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-slate-900 border-[#C5C6CD] text-white shadow-md' 
                    : 'bg-white border-slate-150 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs ${
                    isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-650'
                  }`}>
                    {student.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">{student.name}</h4>
                    <p className={`text-[10px] font-mono tracking-wider mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>ID: {student.id}</p>
                    <span className={`inline-block text-[10px] font-bold mt-1 px-2 py-0.5 rounded ${
                      isSelected 
                        ? 'bg-slate-800 text-emerald-400' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Grade {student.grade}-{student.division} Roster
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {searchedStudents.length === 0 && (
            <div className="py-24 text-center text-xs text-slate-400 italic">No matching students loaded in school memory.</div>
          )}
        </div>
      </section>

      {/* Center: Selected student transaction card */}
      <section className="col-span-12 md:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        {selectedStudent ? (
          <div className="space-y-6">
            
            {/* Outstanding balance Hero box */}
            <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 relative overflow-hidden border border-slate-800 shadow-md">
              <div className="relative z-10">
                <span className="text-[10px] text-emerald-400 uppercase font-black tracking-widest block">Outstand Ledger Balance</span>
                <h2 className="text-3xl font-black text-white mt-1">₹{selectedStudent.outstandingBalance.toLocaleString('en-IN')}.00</h2>
                <p className="text-xs text-slate-400 mt-1">Total Fee Liability Schedule: ₹{selectedStudent.totalAnnualFee.toLocaleString('en-IN')}</p>
              </div>
              <div className="relative z-10 text-right md:border-l md:border-slate-800 md:pl-6 bg-slate-900/60 p-2 rounded">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Linked Guardian</span>
                <h4 className="font-bold text-sm text-white mt-1">{selectedStudent.guardianName}</h4>
                <p className="text-[10px] text-emerald-400 font-mono tracking-widest mt-1">{selectedStudent.guardianContact}</p>
              </div>
            </div>

            {/* Record manual transaction form */}
            <form onSubmit={onConfirmPayment} className="space-y-4">
              <h4 className="text-sm font-extrabold uppercase text-slate-800 border-b pb-2 tracking-wider flex items-center gap-1.5 leading-none">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Record Offline Payment Received</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Collection Amount (₹)</label>
                  <input 
                    type="number"
                    max={selectedStudent.outstandingBalance}
                    className="w-full bg-slate-50 border border-slate-200 rounded text-sm px-3 py-2 text-slate-800 focus:outline-[#0B1220]"
                    value={payAmount}
                    onChange={(e) => onPayAmountChange(e.target.value)}
                    placeholder={`Max permissible: ₹${selectedStudent.outstandingBalance}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Payment Date Received</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded text-sm px-3 py-2 text-slate-800 focus:outline-[#0B1220]"
                    value={payDate}
                    onChange={(e) => onPayDateChange(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Method pills */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase mb-2">Payer Instrument Source</span>
                <div className="grid grid-cols-3 gap-3">
                  {(['Cash', 'Cheque', 'Transfer'] as const).map(method => {
                    const isSel = payMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => onPayMethodChange(method)}
                        className={`w-full py-2.5 rounded border text-xs font-extrabold cursor-pointer transition-all ${
                          isSel 
                            ? 'bg-slate-900 border-[#C5C6CD] text-white shadow-sm' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                      >
                        {method === 'Transfer' ? 'Bank Transfer' : method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Internal Memo / Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={payNotes}
                  onChange={(e) => onPayNotesChange(e.target.value)}
                  placeholder="E.g. Bank Draft ID, Check UTR Numbers, or immediate notes..."
                  className="w-full text-slate-800 text-xs border rounded p-3 resize-none bg-slate-50 focus:bg-white"
                ></textarea>
              </div>

              {/* Digital receipt toggle */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded flex justify-between items-center text-xs">
                <div className="flex gap-2.5 items-center select-none font-semibold">
                  <Receipt className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-700">Dispatch Digital Receipt Notification</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Send a copy to payer's registered email automatically.</p>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={generateReceipt}
                  onChange={() => onGenerateReceiptChange(!generateReceipt)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
              </div>

              <div className="pt-4 flex gap-4 font-semibold">
                <button
                  type="button"
                  onClick={onClearForm}
                  className="w-1/3 py-2.5 border rounded text-xs text-slate-650 hover:bg-slate-100 cursor-pointer"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-slate-900 text-emerald-450 hover:opacity-90 leading-none transition-opacity text-white rounded text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 border border-transparent"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Confirm Offline Payment Handover</span>
                </button>
              </div>

            </form>

          </div>
        ) : (
          <div className="py-24 text-center">
            <Coins className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold font-sans">No student currently chosen.</p>
            <p className="text-slate-400 text-xs mt-1">Please pick any active class-student on the left sidebar to proceed with billing reception.</p>
          </div>
        )}
      </section>

    </div>
  );
}
