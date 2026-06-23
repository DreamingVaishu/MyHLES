import React, { useState } from 'react';
import { 
  Role 
} from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  CheckSquare, 
  Bell, 
  LogOut, 
  Settings, 
  Coins, 
  FileText, 
  FileSpreadsheet, 
  Lock, 
  Search, 
  Menu, 
  X, 
  HelpCircle, 
  Sparkles,
  Megaphone,
  UserCheck,
  Building,
  RotateCcw
} from 'lucide-react';

interface PortalShellProps {
  role: Role;
  onLogout: () => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  selectedClass: string;
  onClassChange?: (newClass: string) => void;
  children: React.ReactNode;
  onSendGlobalNotice?: (msg: string) => void;
}

export default function PortalShell({
  role,
  onLogout,
  activeTab,
  onChangeTab,
  selectedClass,
  onClassChange,
  children,
  onSendGlobalNotice
}: PortalShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define sidebar menu items per role
  const menuItems = {
    Teacher: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'Students', label: 'Students', icon: Users },
      { id: 'Grading', label: 'Grading', icon: Award },
      { id: 'Attendance', label: 'Attendance', icon: CheckSquare },
      { id: 'Notices', label: 'Notices & Announcements', icon: Megaphone },
      { id: 'Settings', label: 'Settings', icon: Settings }
    ],
    Accounts: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'Student Records', label: 'Student Records', icon: Users },
      { id: 'Cash Payments', label: 'Cash Payments', icon: Coins },
      { id: 'Fee Structures', label: 'Fee Structures', icon: FileSpreadsheet },
      { id: 'Reports', label: 'Reports', icon: FileText },
      { id: 'Security Settings', label: 'Security Settings', icon: Lock }
    ],
    Admin: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'Student Records', label: 'Student Records', icon: Users },
      { id: 'Cash Payments', label: 'Cash Payments', icon: Coins },
      { id: 'Fee Structures', label: 'Fee Structures', icon: FileSpreadsheet },
      { id: 'Reports', label: 'Reports', icon: FileText },
      { id: 'Approvals', label: 'Access Approvals', icon: UserCheck },
      { id: 'Audit Logs', label: 'Monospace Audit Logs', icon: FileText },
      { id: 'User Management', label: 'User Directory', icon: RotateCcw },
      { id: 'School Setup', label: 'Multi-School Hub', icon: Building },
      { id: 'Security Settings', label: 'Security Controls', icon: Lock }
    ]
  };

  const currentMenu = menuItems[role] || menuItems.Teacher;

  // Render teacher specific bar or generic titles
  const userProfile = {
    Teacher: {
      name: "Teacher Portal",
      title: "Approved Faculty Account",
      avatar: ""
    },
    Accounts: {
      name: "Accounts Portal",
      title: "Approved Accounts Account",
      avatar: ""
    },
    Admin: {
      name: "Admin Portal",
      title: "System Administrator",
      avatar: ""
    }
  };

  const currUser = userProfile[role] || userProfile.Teacher;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 w-72 bg-[#0B1220] border-r border-[#1E293B] text-slate-300 hidden lg:flex flex-col justify-between">
        <div className="flex flex-col">
          {/* Sidebar Header */}
          <div className="px-6 py-5 border-b border-[#1E293B] flex items-center gap-3">
            <div>
              <h1 className="font-serif font-black text-xl text-white tracking-wide">MyHLES</h1>
              <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-semibold">
                {role === 'Admin' ? 'Admin Controller' : role === 'Accounts' ? 'Accounts Registry' : 'Faculty Portal'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {currentMenu.map(item => {
              const Icon = item.icon;
              const isSelected = activeTab.toLowerCase() === item.id.toLowerCase();
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded text-sm font-semibold transition-all relative cursor-pointer ${
                    isSelected 
                      ? 'bg-[#1E293B] text-white border-l-4 border-emerald-500' 
                      : 'text-slate-400 hover:bg-[#1E293B]/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 duration-200 ${isSelected ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1E293B] space-y-1 bg-[#070D18]">
          <div className="px-4 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-slate-700/60 bg-slate-800 text-emerald-300 flex items-center justify-center text-xs font-bold">
              {role.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-white truncate">{currUser.name}</h5>
              <p className="text-[10px] text-slate-400 truncate">{currUser.title}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-[#1E293B]/20 rounded text-sm font-semibold transition-all mt-4 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 transition-all text-slate-500 group-hover:text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Content Wrapper */}
        <main className="flex-1 p-4 md:p-8 bg-[#F8FAFC] overflow-y-auto">
          {children}
        </main>

        {/* Compliant Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MyHLES Management System. Academic Precision. Institutional Control.</p>
          <div className="flex gap-4 font-semibold text-slate-400 hover:text-slate-650 transition-colors">
            <a href="#" className="hover:underline">Compliant SLA</a>
            <a href="#" className="hover:underline">Secure VPN Sync</a>
            <a href="#" className="hover:underline">Privacy Guidelines</a>
            <a href="#" className="hover:underline">Administration Ledger</a>
          </div>
        </footer>

      </div>

      {/* Mobile Sidebar - Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#0B1220]/60 backdrop-blur-sm"
          ></div>
          
          <div className="relative flex flex-col w-full max-w-xs bg-[#0B1220] border-r border-[#1E293B] text-slate-300 py-5">
            <div className="absolute right-4 top-5">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-40s hover:bg-[#1E293B] text-white rounded cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 pb-6 border-b border-[#1E293B] flex items-center gap-3">
              <div>
                <h1 className="font-serif font-black text-xl text-white tracking-wide">MyHLES</h1>
                <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-semibold">
                  Mobile Menu
                </p>
              </div>
            </div>

            <nav className="p-4 space-y-1 overflow-y-auto flex-1">
              {currentMenu.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab.toLowerCase() === item.id.toLowerCase();
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onChangeTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded text-sm font-semibold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#1E293B] text-white border-l-4 border-emerald-500' 
                        : 'text-slate-400 hover:bg-[#1E293B]/70 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#1E293B] bg-[#070D18] space-y-1">
              <div className="px-4 py-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-slate-700/60 bg-slate-800 text-emerald-300 flex items-center justify-center text-xs font-bold">
                  {role.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white truncate">{currUser.name}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{currUser.title}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-[#1E293B]/20 rounded text-sm font-semibold transition-all mt-4 cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0 text-slate-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
