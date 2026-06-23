import React from 'react';
import { PlusCircle } from 'lucide-react';

interface UserDirectoryProps {
  newFacultyName: string;
  onNewFacultyNameChange: (name: string) => void;
  newFacultySubject: string;
  onNewFacultySubjectChange: (subject: string) => void;
  newFacultyRole: 'Teacher' | 'Accounts' | 'Admin';
  onNewFacultyRoleChange: (role: 'Teacher' | 'Accounts' | 'Admin') => void;
  onCreateFaculty: (e: React.FormEvent) => void;
  onRevokeUser: (userName: string, userRole: string) => void;
  onAddLog: (action: string, target: string) => void;
}

export default function UserDirectory({
  newFacultyName,
  onNewFacultyNameChange,
  newFacultySubject,
  onNewFacultySubjectChange,
  newFacultyRole,
  onNewFacultyRoleChange,
  onCreateFaculty,
  onRevokeUser,
  onAddLog
}: UserDirectoryProps) {
  const users: { name: string; dept: string; role: 'Teacher' | 'Accounts' | 'Admin'; id: string }[] = [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in">
      
      {/* User directory table */}
      <section className="col-span-12 md:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-base">Active Credentials Register</h3>
            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold">{users.length} Active Authorities</span>
          </div>

          <div className="overflow-x-auto text-xs font-semibold">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b text-slate-500 select-none">
                <tr>
                  <th className="px-6 py-4 font-bold">Full Name</th>
                  <th className="px-6 py-4 font-bold">Assigned Subject</th>
                  <th className="px-6 py-4 font-bold">Access Permissions Role</th>
                  <th className="px-6 py-4 font-bold text-right">Draft Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/20">
                    <td className="px-6 py-4 font-extrabold text-slate-850">{user.name}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono">{user.dept}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                        user.role === 'Admin' ? 'bg-[#0B1220] border-slate-800 text-white' : user.role === 'Accounts' ? 'bg-indigo-50 border-indigo-250 text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role} Authority
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (user.role === 'Admin') {
                            alert("Safety Override: Superintendent registration logs cannot be disabled manually.");
                            return;
                          }
                          alert(`${user.name}'s active authority credentials suspended.`);
                          onAddLog("Suspended User Credentials", `Disabled logins of ${user.name}`);
                        }}
                        className="px-2 py-1 bg-slate-105 border hover:bg-slate-200 text-slate-650 rounded text-[10px] cursor-pointer"
                      >
                        Revoke Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t text-center text-xs text-slate-400">
          Provisioned users must utilize verified smart authentication tokens to gain server access.
        </div>
      </section>

      {/* Add user form */}
      <section className="col-span-12 md:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-3">
          <PlusCircle className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-800 text-base leading-none">Assemble Faculty credentials</h3>
        </div>

        <form onSubmit={onCreateFaculty} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Staff full Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. Ramesh Kumar"
              value={newFacultyName}
              onChange={(e) => onNewFacultyNameChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded text-xs p-2.5 outline-none focus:bg-white focus:outline-[#0B1220]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Academic Department</label>
            <input
              type="text"
              placeholder="Mathematics / Chemistry etc"
              value={newFacultySubject}
              onChange={(e) => onNewFacultySubjectChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded text-xs p-2.5 outline-none focus:bg-white focus:outline-[#0B1220]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Authority role clearance</label>
            <select
              value={newFacultyRole}
              onChange={(e) => onNewFacultyRoleChange(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded text-xs p-2.5 bg-white border outline-none"
            >
              <option value="Teacher">Teacher (Classroom Scope)</option>
              <option value="Accounts">Accounts (Bursar Scope)</option>
              <option value="Admin">Admin (Superintendent Scope)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B1220] hover:bg-slate-800 text-white rounded py-2.5 text-xs font-extrabold uppercase shadow cursor-pointer transition-colors duration-150"
          >
            Provision System Account
          </button>
        </form>
      </section>

    </div>
  );
}
