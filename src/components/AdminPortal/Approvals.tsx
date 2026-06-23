import React from 'react';
import { UserCheck } from 'lucide-react';
import { AccessRequest } from '../../types';

interface ApprovalsProps {
  requests: AccessRequest[];
  approvalsTab: 'Teacher' | 'Parent';
  onApprovalsTabChange: (tab: 'Teacher' | 'Parent') => void;
  onApproveRequest: (req: AccessRequest) => void;
  onReviewRequest: (req: AccessRequest) => void;
}

export default function Approvals({ requests, approvalsTab, onApprovalsTabChange, onApproveRequest, onReviewRequest }: ApprovalsProps) {
  const filteredRequests = requests.filter(r => {
    if (approvalsTab === 'Teacher') return r.role === 'Teacher';
    return r.role === 'Parent' || r.role === 'Student';
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
      
      {/* Inner sub header */}
      <div className="p-6 border-b border-rose-100 bg-rose-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">System Registrant Control Board</h3>
          <p className="text-xs text-slate-500 mt-1">Reviewing pending enrollment applications for verified teachers, parents, and security linkages.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border text-xs font-bold">
          {(['Teacher', 'Parent'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => onApprovalsTabChange(tab)}
              className={`px-4 py-1.5 rounded-md cursor-pointer transition-colors ${
                approvalsTab === tab ? 'bg-slate-900 text-white' : 'text-slate-650 hover:bg-slate-200/50'
              }`}
            >
              {tab === 'Teacher' ? 'Faculty Signups' : 'Parent Linkings'}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="py-24 text-center">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-semibold">No pending {approvalsTab} requests found.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-150 font-medium text-xs">
          {filteredRequests.map(req => (
            <div key={req.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span className="bg-slate-900 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-slate-800">
                    {req.id}
                  </span>
                  <h4 className="font-bold text-slate-850 text-sm">{req.name}</h4>
                </div>
                <p className="text-slate-600 leading-normal text-xs font-semibold">
                  Email Proposed: <span className="font-mono text-slate-900 font-bold">{req.email}</span> • Assigned Target Details: <span className="text-slate-800 font-extrabold">{req.linkedStudentName} ({req.gradeRequested}-{req.divisionRequested})</span>
                </p>
                <p className="text-[10px] text-slate-400">Requesting Permissions Path Level: <span className="font-bold">{req.role}</span></p>
              </div>

              <div className="flex items-center gap-2 font-bold select-none shrink-0">
                {req.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => onApproveRequest(req)}
                      className="bg-[#0B1220] text-white hover:bg-slate-850 px-4 py-2 rounded text-xs cursor-pointer duration-150"
                    >
                      Verify & Approve
                    </button>
                    
                    <button
                      onClick={() => onReviewRequest(req)}
                      className="bg-white border text-slate-600 hover:bg-slate-50 px-4 py-2 rounded text-xs cursor-pointer duration-150"
                    >
                      Decline...
                    </button>
                  </>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs ${
                    req.status === 'Approved' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-rose-50 border-rose-250 text-rose-600'
                  }`}>
                    {req.status} Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
