import React from 'react';
import { Receipt, X, Printer, Trash2 } from 'lucide-react';
import { Transaction } from '../../types';

interface ReceiptManagerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  selectedTxn: Transaction | null;
  onTxnSelect: (txn: Transaction) => void;
  voidReason: string;
  onVoidReasonChange: (reason: string) => void;
  voidReasonError: boolean;
  onVoidTxn: () => void;
  onReprintReceipt: () => void;
}

export default function ReceiptManager({
  isOpen,
  onClose,
  transactions,
  selectedTxn,
  onTxnSelect,
  voidReason,
  onVoidReasonChange,
  voidReasonError,
  onVoidTxn,
  onReprintReceipt
}: ReceiptManagerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center bg-gradient-to-r from-slate-900 to-[#1E293B]">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg">Past Cash Transaction Auditing Console</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Transactions list column */}
          <div className="col-span-12 md:col-span-6 border-r pr-4 space-y-2 h-[350px] overflow-y-auto scrollbar-none">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-2">Live Cash Payments</span>
            {transactions.map(t => (
              <div 
                key={t.id}
                onClick={() => { onTxnSelect(t); onVoidReasonChange(''); }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedTxn?.id === t.id 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-slate-50 text-slate-650 hover:bg-slate-100 border-slate-150'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-bold text-xs font-mono tracking-wider">{t.id}</p>
                  <p className={`font-black text-xs ${selectedTxn?.id === t.id ? 'text-emerald-400' : 'text-slate-800'}`}>₹{t.amount.toLocaleString('en-IN')}</p>
                </div>
                <p className="font-semibold text-xs mt-1 truncate">{t.studentName}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-bold uppercase font-mono">
                  <span>Method: {t.method}</span>
                  <span className={t.status === 'Recorded' ? 'text-emerald-400' : 'text-rose-400 line-through'}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right column Selected Txn Audit Action */}
          <div className="col-span-12 md:col-span-6 select-none flex flex-col justify-between">
            {selectedTxn ? (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-slate-50 border rounded-xl text-xs space-y-1.5 font-semibold text-slate-650">
                    <p><span className="text-slate-400 font-medium">Draft ID:</span> <strong className="font-mono text-slate-700">{selectedTxn.id}</strong></p>
                    <p><span className="text-slate-400 font-medium">Received From:</span> <strong>{selectedTxn.studentName}</strong></p>
                    <p><span className="text-slate-400 font-medium">Instrument:</span> <span className="bg-slate-200 font-mono px-1 rounded uppercase">{selectedTxn.method}</span></p>
                    <p><span className="text-slate-400 font-medium">Amount Received:</span> <strong className="text-slate-900 text-sm">₹{selectedTxn.amount.toLocaleString('en-IN')}</strong></p>
                    {selectedTxn.voidReason && <p className="text-rose-500 font-bold"><span className="text-slate-400 font-medium">Void Reason:</span> {selectedTxn.voidReason}</p>}
                  </div>

                  {selectedTxn.status === 'Recorded' && (
                    <div className="mt-4 space-y-2">
                      <label className="block text-[11px] text-slate-500 uppercase font-black tracking-wider leading-none">Audited Reason for VOID Option</label>
                      <input 
                        type="text" 
                        placeholder="Enter rollback explanation (Required)..."
                        value={voidReason}
                        onChange={(e) => onVoidReasonChange(e.target.value)}
                        className={`w-full text-xs font-semibold text-slate-800 bg-slate-50 border rounded p-2.5 outline-none focus:outline-slate-900 ${
                          voidReasonError ? 'border-rose-500 placeholder-rose-350' : 'border-slate-250'
                        }`}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t font-semibold">
                  <button
                    type="button"
                    onClick={onReprintReceipt}
                    className="flex-grow py-2.5 border rounded text-xs text-slate-650 hover:bg-slate-100 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Resend / Reprint</span>
                  </button>
                  
                  {selectedTxn.status === 'Recorded' && (
                    <button
                      type="button"
                      onClick={onVoidTxn}
                      className="flex-grow py-2.5 bg-rose-600 text-white text-xs hover:bg-rose-700 cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Void Payout Log</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed rounded-xl h-full flex flex-col items-center justify-center text-slate-400">
                <Receipt className="w-10 h-10 mb-2" />
                <p className="text-xs font-semibold">Choose draft on the left</p>
                <p className="text-[10px] mt-0.5 max-w-[200px] leading-relaxed mx-auto text-slate-400">Select any billing draft to trigger reprint spools or rollback voids.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
