import React, { useState } from 'react';
import { CreditCard, IndianRupee, HelpCircle, Receipt, History, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { Student, FeeItem } from './types';

interface ParentFeesProps {
  student: Student;
  onProcessPayment: (studentId: string, amount: number, itemIds?: string[]) => void;
}

export default function ParentFees({ student, onProcessPayment }: ParentFeesProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customAmount, setCustomAmount] = useState('');
  const [customAmountError, setCustomAmountError] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPaidAmount, setLastPaidAmount] = useState<number>(0);

  const unpaidItems = student.feeItems.filter((item) => item.status !== 'Paid');
  const outstandingTotal = unpaidItems.reduce((sum, item) => sum + item.amount, 0);

  const toggleSelectFee = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getSelectedAmountTotal = () => {
    return unpaidItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setCustomAmount('');
    setCustomAmountError('');
  };

  // 1) Pay Checked/Selected Items
  const handlePaySelected = () => {
    const totalToPay = getSelectedAmountTotal();
    if (totalToPay <= 0) return;

    setIsPaying(true);
    setTimeout(() => {
      onProcessPayment(student.id, totalToPay, selectedItems);
      setLastPaidAmount(totalToPay);
      setIsPaying(false);
      setShowSuccessModal(true);
      setSelectedItems([]);
    }, 1200);
  };

  // 2) Pay typed custom specific amount
  const handlePayCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customAmount);
    if (isNaN(parsed) || parsed <= 0) {
      setCustomAmountError('Please enter a valid payment sum.');
      return;
    }
    if (parsed > outstandingTotal) {
      setCustomAmountError(`Amount exceeds total outstanding fees (Max ₹${outstandingTotal}).`);
      return;
    }

    setCustomAmountError('');
    setIsPaying(true);
    setTimeout(() => {
      // Find what unpaid items we can clear with this amount
      let remaining = parsed;
      const sortedUnpaid = [...unpaidItems].sort((a,b) => a.amount - b.amount); // pay smaller first
      const itemIdsToMarkPaid: string[] = [];
      
      for (const item of sortedUnpaid) {
        if (remaining >= item.amount) {
          itemIdsToMarkPaid.push(item.id);
          remaining -= item.amount;
        }
      }

      onProcessPayment(student.id, parsed, itemIdsToMarkPaid);
      setLastPaidAmount(parsed);
      setIsPaying(false);
      setShowSuccessModal(true);
      setCustomAmount('');
    }, 1200);
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in pb-12">
      
      {/* Fees Title header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-sans font-bold text-lg text-[#091426]">
            💳 School Fees Payment Desk
          </h3>
          <p className="text-xs text-[#45474c]">Student: {student.name}</p>
        </div>
      </div>

      {/* Balance Summary Header card, matches mockup 3 */}
      <section className="bg-[#1e293b] text-white rounded-2xl p-5 shadow-sm border border-slate-700 relative overflow-hidden">
        {/* Abstract design shape */}
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-28 h-28 bg-white/5 rounded-full"></div>
        
        <div className="relative z-10 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                Outstanding Balance
              </span>
              <p className="text-2xl md:text-3xl font-extrabold text-[#b6efd3]">
                ₹{outstandingTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="space-y-0.5 pl-4 border-l border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                Total Annual Fees
              </span>
              <p className="text-lg font-bold">
                ₹{student.annualTotal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Enter Custom Specific Amount option */}
          <form onSubmit={handlePayCustom} className="space-y-2 pt-2 border-t border-slate-850">
            <label htmlFor="manual-amount" className="text-xs font-bold text-slate-200">
              Direct Payments: Or enter specific amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-sm text-[#091426] select-none">
                ₹
              </span>
              <input
                id="manual-amount"
                type="number"
                placeholder="Enter specific amount to settle"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setCustomAmountError('');
                }}
                disabled={isPaying}
                className="w-full bg-white text-[#091426] border border-transparent focus:ring-2 focus:ring-[#b3ecd0] rounded-xl py-3 pl-8 pr-4 font-bold text-sm focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            {customAmountError && (
              <p className="text-[11px] text-red-300 font-semibold px-1">{customAmountError}</p>
            )}

            {customAmount && !customAmountError && (
              <button
                type="submit"
                disabled={isPaying}
                className="w-full py-2.5 bg-[#326852] text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                {isPaying ? 'Confirming secure token...' : `Pay Specified ₹${parseFloat(customAmount).toLocaleString('en-IN')} Directly`}
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Select Specific Fees Checklist */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-[#091426] uppercase tracking-wider">
            Outstanding Fee Schedule
          </h4>
          <span className="text-[10px] text-[#75777d] font-semibold">Checks to combine items</span>
        </div>

        {unpaidItems.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-[#c5c6cd] bg-white rounded-2xl">
            <Check className="w-12 h-12 text-[#326852] mx-auto mb-2" />
            <p className="font-bold text-sm text-[#091426]">Everything Settle & Paid!</p>
            <p className="text-xs text-[#75777d] mt-1">Excellent work. Total annual fee statement has zero unbilled dues.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {unpaidItems.map((item) => {
              const isChecked = selectedItems.includes(item.id);
              const isOverdue = item.status === 'Overdue';
              
              return (
                <label
                  key={item.id}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#cbd5e1] shadow-xs active:bg-slate-50 transition-colors cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isPaying}
                    onChange={() => toggleSelectFee(item.id)}
                    className="w-5 h-5 rounded border-[#cbd5e1] text-[#326852] focus:ring-[#326852] cursor-pointer"
                  />
                  
                  {/* Category Circle and Item desc */}
                  <div className="flex-1 flex gap-3 items-center min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isOverdue ? 'bg-red-50 text-[#ba1a1a]' : 'bg-[#eff4ff] text-[#091426]'
                    }`}>
                      <Receipt className="w-4.5 h-4.5" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex justify-between items-baseline min-w-0">
                        <span className="font-bold text-xs text-[#091426] truncate">{item.name}</span>
                        {isOverdue && (
                          <span className="text-[9px] font-bold text-[#ba1a1a] bg-red-100 px-1.5 py-0.5 rounded-lg shrink-0">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#75777d] mt-0.5">Due date: {item.dueDate}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <span className="font-extrabold text-sm text-[#091426] shrink-0">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </span>
                </label>
              );
            })}

            {/* Pay Selected Button */}
            {selectedItems.length > 0 && (
              <button
                onClick={handlePaySelected}
                disabled={isPaying}
                className="w-full bg-[#326852] hover:bg-[#18503b] text-white py-3.5 rounded-xl text-xs font-bold shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {isPaying ? 'Processing Settle...' : `Secure Pay Selected: ₹${getSelectedAmountTotal().toLocaleString('en-IN')}`}
                </span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Transaction Records history */}
      <section className="space-y-3">
        <h4 className="font-bold text-xs text-[#091426] uppercase tracking-wider">
          Recent Payments Ledger
        </h4>

        <div className="space-y-2">
          {student.transactions.length === 0 ? (
            <p className="text-xs text-[#75777d] text-center py-2 bg-[#f8f9ff]">No transaction history recorded yet.</p>
          ) : (
            student.transactions.map((t) => (
              <div
                key={t.id}
                className="bg-white p-3 border border-[#cbd5e1]/40 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col text-center min-w-[42px] p-1.5 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                    <span className="text-[8px] font-bold uppercase text-[#75777d] leading-none">{t.month}</span>
                    <span className="font-extrabold text-sm text-[#091426] leading-none mt-1">{t.date}</span>
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#091426]">{t.description}</p>
                    <span className="inline-block text-[9px] font-semibold text-emerald-700 bg-[#b3ecd0]/40 px-1.5 py-0.5 rounded-full mt-0.5">
                      Completed Transaction
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-xs text-[#091426]">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-center gap-0.5 justify-end mt-1 text-[#0099d9] text-[9px] hover:underline cursor-pointer">
                    <Receipt className="w-3 h-3" />
                    <span>Receipt No. #{t.id}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Payment Success Dialog / Receipt */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[#091426]/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-5 text-center shadow-2xl border border-emerald-100 animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#326852] flex items-center justify-center mx-auto border-2 border-[#b3ecd0]">
              <Check className="w-8 h-8 font-extrabold" />
            </div>

            <div className="space-y-1">
              <h4 className="font-sans font-extrabold text-lg text-[#091426]">
                Secure Transaction Completed!
              </h4>
              <p className="text-xs text-[#75777d]">
                Funds credited to St. Xavier's Academic Trust Acc on behalf of {student.name}.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-left text-xs font-semibold space-y-1.5 font-mono">
              <div className="flex justify-between text-[#75777d]">
                <span>Transaction Ref:</span>
                <span className="text-[#091426]">TXN-REC-{Date.now().toString().slice(-4)}</span>
              </div>
              <div className="flex justify-between text-[#75777d]">
                <span>Payer name:</span>
                <span className="text-[#091426]">{student.guardianName}</span>
              </div>
              <div className="flex justify-between text-[#75777d]">
                <span>Grade Level:</span>
                <span className="text-[#091426]">{student.grade} ({student.section})</span>
              </div>
              <div className="border-t border-dashed border-slate-200 my-2 pt-2 flex justify-between text-base font-bold">
                <span className="text-[#091426]">Total Settle:</span>
                <span className="text-[#326852]">₹{lastPaidAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-[#091426] text-white rounded-xl text-xs font-extrabold cursor-pointer hover:bg-slate-800"
            >
              Done, Return to Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
