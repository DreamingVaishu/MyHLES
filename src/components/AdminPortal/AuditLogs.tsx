import React from 'react';
import { ActivityLog } from '../../types';

interface AuditLogsProps {
  activityLogs: ActivityLog[];
  onDownloadLogs: () => void;
}

export default function AuditLogs({ activityLogs, onDownloadLogs }: AuditLogsProps) {
  return (
    <div className="bg-[#070D18] border border-[#1E293B] rounded-xl shadow-2xl p-6 font-mono text-xs text-slate-350 select-none animate-in">
      <div className="border-b border-[#1E293B] pb-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <h3 className="font-bold text-white text-sm">NCT System Activity Console</h3>
            <p className="text-[10px] text-slate-500">Live system-wide events and administrative override transactions.</p>
          </div>
        </div>
        
        <button
          onClick={onDownloadLogs}
          className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-[10px] px-3.5 py-1.5 rounded border border-[#334155] cursor-pointer"
        >
          Download RAW Syslog
        </button>
      </div>

      {/* Console logs */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
        {activityLogs.map((log) => {
          const displayTime = log.time || (log.timestamp && log.timestamp.length > 19 ? log.timestamp.slice(11, 19) : '09:30:15');
          const displayIp = log.ip || '192.168.1.100';
          const displayUser = log.user || (log.actor ? log.actor.split(' ')[0] : 'System');

          return (
            <div key={log.id} className="leading-relaxed hover:bg-[#0c1424] p-1.5 rounded transition-colors">
              <span className="text-slate-650 font-bold">[{displayTime}]</span>{' '}
              <span className="text-emerald-400 font-bold">{displayIp}</span>{' '}
              <span className="text-white font-black">({displayUser})</span>{' '}
              <span className="text-purple-400">override: </span>
              <span className="text-slate-300 font-semibold">{log.action}</span>{' '}
              <span className="text-slate-500">{log.target ? `-> [${log.target}]` : ''}</span>
            </div>
          );
        })}

        {activityLogs.length === 0 && (
          <div className="text-slate-580 italic text-center py-12">No operations catalogued inside active ledger buffer.</div>
        )}
      </div>
    </div>
  );
}
