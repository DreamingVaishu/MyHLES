import React from 'react';
import { Megaphone, Clock } from 'lucide-react';
import { Notice } from '../../types';

interface NoticesProps {
  notices: Notice[];
  currentGrade: string;
  currentDiv: string;
}

export default function Notices({ notices, currentGrade, currentDiv }: NoticesProps) {
  const classNotices = notices.filter(n => n.audienceType === 'All' || (n.targetGrade === currentGrade && n.targetDivision === currentDiv));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
      <div className="p-6 border-b border-slate-150 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Official Notice Feed Logs</h3>
          <p className="text-xs text-slate-500 mt-1">Reviewing active notices sent to Grade standards and globally.</p>
        </div>
        <span className="text-xs bg-slate-200 text-slate-650 font-bold px-3 py-1 rounded">
          {classNotices.length} Active Notices
        </span>
      </div>

      {classNotices.length === 0 ? (
        <div className="py-24 text-center">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">No notifications allocated or sent yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-150">
          {classNotices.map(notice => (
            <div key={notice.id} className="p-6 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="bg-slate-900 text-emerald-400 font-mono text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest border border-slate-800">
                    {notice.id}
                  </span>
                  <h4 className="font-bold text-slate-850 text-base">{notice.title}</h4>
                </div>
                <div className="flex gap-2 text-xs font-semibold">
                  <span className="bg-slate-100 border text-slate-500 px-2 py-0.5 rounded">
                    Alloc: {notice.audienceType === 'All' ? 'All Portals' : `Class ${notice.targetGrade}-${notice.targetDivision}`}
                  </span>
                  <span className="text-slate-400 font-medium inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-350" />
                    <span>{notice.date}</span>
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl ml-1">{notice.message}</p>
              <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1 ml-1 select-none">
                <span className="font-bold text-slate-500">{notice.sentBy}</span>
                <span>— {notice.senderRole} Authority</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
