import React from 'react';
import { X } from 'lucide-react';
import { AccessRequest } from '../../types';

interface RejectionModalProps {
  isOpen: boolean;
  request: AccessRequest | null;
  onClose: () => void;
  rejectCategory: string;
  onRejectCategoryChange: (category: string) => void;
  rejectComment: string;
  onRejectCommentChange: (comment: string) => void;
  onRejectRequest: (e: React.FormEvent) => void;
}

export default function RejectionModal({
  isOpen,
  request,
  onClose,
  rejectCategory,
  onRejectCategoryChange,
  rejectComment,
  onRejectCommentChange,
  onRejectRequest
}: RejectionModalProps) {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-3xl overflow-hidden border border-slate-200 animate-in">
        <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
          <h3 className="font-bold text-base">Decline Portal Sign up Request</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded cursor-pointer text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={onRejectRequest} className="p-6 space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800 text-xs font-semibold leading-relaxed">
            <p className="font-bold mb-2">Request Details:</p>
            <p><span className="font-medium">Name:</span> {request.name}</p>
            <p><span className="font-medium">Email:</span> {request.email}</p>
            <p><span className="font-medium">Linked Student:</span> {request.linkedStudentName}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Rejection Category</label>
            <select
              value={rejectCategory}
              onChange={(e) => onRejectCategoryChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded text-xs p-2.5 outline-none focus:bg-white"
            >
              <option value="Impersonation Check">Impersonation Check</option>
              <option value="Incomplete Documentation">Incomplete Documentation</option>
              <option value="Invalid Student Link">Invalid Student Link</option>
              <option value="Security Policy Violation">Security Policy Violation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Additional Comments (Required)</label>
            <textarea
              rows={3}
              value={rejectComment}
              onChange={(e) => onRejectCommentChange(e.target.value)}
              placeholder="Provide detailed reasoning for rejection..."
              className="w-full text-slate-800 text-xs border rounded p-3 resize-none bg-slate-50 focus:bg-white"
              required
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4 border-t font-semibold">
            <button 
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 border rounded text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-1/2 py-2.5 bg-rose-600 text-white rounded text-xs hover:bg-rose-700 cursor-pointer shadow-md duration-200"
            >
              Confirm Rejection
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
