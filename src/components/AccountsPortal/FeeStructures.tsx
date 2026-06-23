import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FeeStructureItem } from '../../types';

interface FeeStructuresProps {
  feeStructures: FeeStructureItem[];
  onRemoveFeeItem: (id: string) => void;
  newFeeGrade: string;
  onNewFeeGradeChange: (grade: string) => void;
  newFeeName: string;
  onNewFeeNameChange: (name: string) => void;
  newFeeAmount: string;
  onNewFeeAmountChange: (amount: string) => void;
  newFeeDueDate: string;
  onNewFeeDueDateChange: (date: string) => void;
  onAddFeeItem: (e: React.FormEvent) => void;
}

export default function FeeStructures({
  feeStructures,
  onRemoveFeeItem,
  newFeeGrade,
  onNewFeeGradeChange,
  newFeeName,
  onNewFeeNameChange,
  newFeeAmount,
  onNewFeeAmountChange,
  newFeeDueDate,
  onNewFeeDueDateChange,
  onAddFeeItem
}: FeeStructuresProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in">
      
      {/* Table list of structures */}
      <section className="col-span-12 md:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Define Assessment & Fee Items</h3>
            <span className="text-xs bg-slate-250 text-slate-650 px-2.5 py-1 rounded font-bold">
              {feeStructures.length} Active Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-650">
              <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase select-none">
                <tr>
                  <th className="px-6 py-3">Alloc Scope</th>
                  <th className="px-6 py-3">Fee Line Item Name</th>
                  <th className="px-6 py-3">Billing Target</th>
                  <th className="px-6 py-3">Compliance Due</th>
                  <th className="px-6 py-3 text-right">Draft Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-xs">
                {feeStructures.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/20">
                    <td className="px-6 py-4">
                      <span className="bg-slate-900 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                        {f.grade === 'All' ? 'All Grades' : `Grade ${f.grade}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{f.feeName}</td>
                    <td className="px-6 py-4 font-black text-slate-700 text-sm">₹{f.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-slate-400">{f.dueDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onRemoveFeeItem(f.id)}
                        className="p-1 px-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors duration-150"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t text-center text-xs text-slate-400 select-none">
          Fee lines are pulled by the student app "Select Fees" widget dynamically.
        </div>
      </section>

      {/* Add structures form */}
      <section className="col-span-12 md:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-3">
          <PlusCircle className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-800 text-base leading-none">Declare Billing Roster</h3>
        </div>

        <form onSubmit={onAddFeeItem} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Allocation Target</label>
            <select
              value={newFeeGrade}
              onChange={(e) => onNewFeeGradeChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded text-xs p-2.5 outline-none focus:bg-white"
            >
              <option value="All">All Grades (School-wide)</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Fee Line Item Name</label>
            <input
              type="text"
              placeholder="e.g. Tuition Term 2"
              value={newFeeName}
              onChange={(e) => onNewFeeNameChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded text-xs p-2.5 outline-none focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 font-sans">Billing Amount (₹)</label>
            <input
              type="number"
              placeholder="₹3,200"
              value={newFeeAmount}
              onChange={(e) => onNewFeeAmountChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded text-xs p-2.5 outline-none focus:bg-white animate-pulse-once"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Compliant Due Date</label>
            <input
              type="date"
              value={newFeeDueDate}
              onChange={(e) => onNewFeeDueDateChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded text-xs p-2.5 outline-none focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white rounded py-2.5 text-xs uppercase font-extrabold shadow hover:bg-slate-800 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Append Fee Item
          </button>
        </form>
      </section>

    </div>
  );
}
