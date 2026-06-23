import React from 'react';
import { UserCheck, Megaphone, ChevronRight } from 'lucide-react';
import { AccessRequest } from '../../types';

interface DashboardProps {
  requests: AccessRequest[];
  onApproveRequest: (id: string) => void;
  onReviewRequest: (request: AccessRequest) => void;
  currentGrade: string;
  currentDiv: string;
  onClassChange: (grade: string, div: string) => void;
  onBroadcastNotice: (message: string) => void;
  onChangeTab: (tab: string) => void;
}

export default function Dashboard({ 
  requests, 
  onApproveRequest, 
  onReviewRequest, 
  currentGrade, 
  currentDiv, 
  onClassChange,
  onBroadcastNotice,
  onChangeTab 
}: DashboardProps) {
  const [classNoticeMsg, setClassNoticeMsg] = React.useState('');
  const classNoticeLength = classNoticeMsg.length;

  const handleBroadcastClassNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNoticeMsg.trim()) return;
    onBroadcastNotice(classNoticeMsg);
    setClassNoticeMsg('');
  };

  return (
    <div className="space-y-6 animate-in">
      
      {/* Quick switch horizontal scroll section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-emerald-400 text-xs font-mono tracking-widest uppercase font-semibold">Quick Switch Classroom</p>
              <h3 className="text-2xl font-black mt-1">Current Active: Grade {currentGrade} — Division {currentDiv}</h3>
            </div>
            <span className="bg-emerald-500/15 text-emerald-400 font-mono text-[11px] px-3.5 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-widest font-semibold inline-block shrink-0">
              ACTIVE FOCUS
            </span>
          </div>

          {/* Horizontal Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-2 scrollbar-none">
            {['9', '10', '11', '12'].map(grade => {
              const isActiveGrade = currentGrade === grade;
              return (
                <div 
                  key={grade}
                  className={`p-4 rounded-xl transition-all duration-200 border ${
                    isActiveGrade 
                      ? 'bg-slate-800 border-emerald-500 text-white shadow-lg shadow-emerald-500/5' 
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-350'
                  }`}
                >
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Class Standard</p>
                  <h4 className="text-lg font-extrabold mt-1 text-white">Grade {grade}</h4>
                  <div className="mt-4 grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                    {['A', 'B', 'C', 'D'].map(div => {
                      const isSelectedClass = currentGrade === grade && currentDiv === div;
                      return (
                        <button
                          key={div}
                          onClick={() => onClassChange(grade, div)}
                          className={`py-1 rounded text-center cursor-pointer transition-colors ${
                            isSelectedClass 
                              ? 'bg-emerald-500 text-white font-black' 
                              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                          }`}
                        >
                          DIV {div}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Action Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Access Requests Card */}
        <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-800 text-lg">Parent Requests</h3>
              </div>
              <span className="bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs px-2.5 py-0.5 rounded-full">
                {requests.filter(r => r.status === 'Pending' && r.gradeRequested === currentGrade && r.divisionRequested === currentDiv).length} Pending Linkings
              </span>
            </div>

            {/* Stacked list of requests */}
            <div className="space-y-3.5">
              {requests.filter(r => r.status === 'Pending' && r.gradeRequested === currentGrade && r.divisionRequested === currentDiv).slice(0, 3).map(req => (
                <div key={req.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100 text-sm hover:border-slate-350 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800">{req.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      linked parent of <span className="font-semibold text-slate-700">{req.linkedStudentName}</span> ({req.gradeRequested}-{req.divisionRequested})
                    </p>
                  </div>
                  <div className="flex gap-2 font-semibold">
                    <button 
                      onClick={() => { onApproveRequest(req.id); }}
                      className="bg-slate-900 text-white hover:bg-slate-850 text-xs px-3 py-1.5 rounded cursor-pointer duration-150"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => onReviewRequest(req)}
                      className="bg-white border border-slate-250 text-slate-600 hover:bg-slate-50 hover:text-slate-850 text-xs px-3 py-1.5 rounded cursor-pointer duration-150"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}

              {requests.filter(r => r.status === 'Pending' && r.gradeRequested === currentGrade && r.divisionRequested === currentDiv).length === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm italic">
                  All parent links are verified and approved.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 mt-6 pt-4 text-center">
            <button 
              onClick={() => onChangeTab('Notices')}
              className="text-xs font-bold text-slate-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Admin Feed</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Notice Card */}
        <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-3 justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-800 text-lg">Send Class Notice</h3>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-500 border rounded font-mono px-2 py-0.5">
              GRADE {currentGrade} - DIV {currentDiv} Only
            </span>
          </div>

          <form onSubmit={handleBroadcastClassNotice} className="space-y-4">
            <div>
              <textarea
                rows={4}
                value={classNoticeMsg}
                onChange={(e) => setClassNoticeMsg(e.target.value)}
                placeholder="Type important classroom announcement (e.g. Bring science geometry box tomorrow)..."
                className="w-full text-slate-800 text-sm border border-slate-200 rounded p-3 focus:outline-slate-900 resize-none bg-slate-50 focus:bg-white transition-colors"
                maxLength={500}
              ></textarea>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>Audience: Students and Guardians of {currentGrade}-{currentDiv}</span>
                <span>{classNoticeLength}/500 chars</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-2 py-2.5 bg-slate-900 text-white rounded text-xs font-bold tracking-wider uppercase hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer duration-150"
            >
              <Megaphone className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Class Notice</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
