import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, CheckCircle2, ArrowRight, ClipboardSignature, Sparkles } from 'lucide-react';
import { Role, AccessRequest } from '../../types';

interface LoginScreenProps {
  onLogin: (role: Role, email: string) => void;
  onAddAccessRequest: (request: AccessRequest) => void;
  accessRequests?: AccessRequest[];
  autoSelectRole?: Role;
}

const ADMIN_USER_ID = 'myhles-admin';
const ADMIN_PASSWORD = 'Admin@12345';

export default function LoginScreen({ onLogin, onAddAccessRequest, accessRequests = [], autoSelectRole = 'Teacher' }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  // Sign up request states
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    let role: Role = autoSelectRole;

    if (autoSelectRole === 'Admin') {
      if (email !== ADMIN_USER_ID || password !== ADMIN_PASSWORD) {
        alert('Invalid admin user ID or password.');
        return;
      }
      onLogin('Admin', email);
      return;
    }

    const approvedRequest = accessRequests.find(req => {
      const sameEmail = req.email.toLowerCase() === email.toLowerCase();
      return sameEmail && req.role === role && req.status === 'Approved';
    });

    if (!approvedRequest) {
      alert(`${role} access is waiting for admin approval or the credentials do not match an approved account.`);
      return;
    }
    
    onLogin(role, email);
  };

  const handlePrefill = (role: Role) => {
    if (role === 'Teacher') {
      setEmail('');
      setPassword('');
    } else if (role === 'Accounts') {
      setEmail('');
      setPassword('');
    } else {
      setEmail(ADMIN_USER_ID);
      setPassword(ADMIN_PASSWORD);
    }
  };

  const handleGradeToggle = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter(g => g !== grade));
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  const handleDivisionToggle = (div: string) => {
    if (selectedDivisions.includes(div)) {
      setSelectedDivisions(selectedDivisions.filter(d => d !== div));
    } else {
      setSelectedDivisions([...selectedDivisions, div]);
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !employeeId || !requestEmail || !password) {
      alert("Please fill all personal details.");
      return;
    }
    if (autoSelectRole === 'Teacher' && (selectedGrades.length === 0 || selectedDivisions.length === 0)) {
      alert("Please select at least one Standard and Division.");
      return;
    }

    const newReq: AccessRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      name: fullName,
      email: requestEmail,
      role: autoSelectRole === 'Accounts' ? 'Accounts' : 'Teacher',
      employeeId,
      requestedPassword: password,
      specializationDept: autoSelectRole === 'Accounts' ? `Accounts Office Request (ID: ${employeeId})` : `Faculty Level Request (ID: ${employeeId})`,
      gradesRequested: autoSelectRole === 'Teacher' ? selectedGrades : [],
      divisionsRequested: autoSelectRole === 'Teacher' ? selectedDivisions : [],
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    onAddAccessRequest(newReq);
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setIsRequesting(false);
      // reset form
      setFullName('');
      setEmployeeId('');
      setRequestEmail('');
      setSelectedGrades([]);
      setSelectedDivisions([]);
    }, 3000);
  };

  if (isRequesting) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-[#1E293B] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col md:flex-row">
          
          {/* Left panel */}
          <div className="w-full md:w-5/12 bg-gradient-to-br from-[#0B1220] to-[#1E293B] p-8 md:p-12 text-slate-100 flex flex-col justify-between border-r border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="font-serif text-3xl font-extrabold tracking-tight text-emerald-400">MyHLES</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-mono tracking-widest font-semibold">Faculty</span>
              </div>
              
              <div className="mt-8 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
                  Empowering <br />
                  <span className="text-emerald-400">Educators.</span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                  Request secure credentials to access secondary gradebooks, classroom attendance tracking, and parent messaging boards. All applications undergo verification within 24 business hours.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Access restricted to certified institution staff</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Audited connection (AES-256 SSL)</span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-xs text-slate-500 border-t border-slate-800 pt-6">
              Empowering global classrooms with precision tools. MyHLES v4.2.0.
            </div>
          </div>

          {/* Right form panel */}
          <div className="w-full md:w-7/12 bg-white p-8 md:p-12">
            {requestSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-2xl font-bold text-slate-900 mb-2">Request Submitted</h3>
                <p className="text-slate-500 max-w-md text-sm leading-relaxed">
                  Your access requested is logged under pending status in Admin control for <strong className="text-slate-800">{requestEmail}</strong>. You'll be redirected shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Request Portal Access</h3>
                  <p className="text-slate-500 text-xs mt-1">Please provide verified personal details and classroom bounds.</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase text-slate-400 tracking-wider font-bold border-b pb-2">Personal Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={autoSelectRole === 'Accounts' ? 'Accounts Staff Name' : 'Teacher Name'}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-[#0B1220]" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID</label>
                      <input 
                        type="text" 
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="EMP-2026-MATH"
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-[#0B1220]" 
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                    <input 
                      type="email" 
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      placeholder="s.jenkins@myhles.edu.in"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-[#0B1220]" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password for this portal"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-[#0B1220]" 
                      required
                    />
                  </div>
                </div>

                {autoSelectRole === 'Teacher' && <div className="space-y-4 pt-2">
                  <h4 className="text-xs uppercase text-slate-400 tracking-wider font-bold border-b pb-2">Access Scope</h4>
                  
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">Standards (Select Multiple)</span>
                    <div className="flex flex-wrap gap-2">
                      {['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => {
                        const standard = g.replace('Grade ', '');
                        const isSelected = selectedGrades.includes(standard);
                        return (
                          <button
                            type="button"
                            key={g}
                            onClick={() => handleGradeToggle(standard)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                              isSelected 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">Divisions (Select Multiple)</span>
                    <div className="flex flex-wrap gap-2">
                      {['Div A', 'Div B', 'Div C', 'Div D', 'Div E'].map(d => {
                        const division = d.replace('Div ', '');
                        const isSelected = selectedDivisions.includes(division);
                        return (
                          <button
                            type="button"
                            key={d}
                            onClick={() => handleDivisionToggle(division)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                              isSelected 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>}

                <div className="flex gap-4 pt-6 border-t font-semibold">
                  <button 
                    type="button"
                    onClick={() => setIsRequesting(false)}
                    className="w-1/2 py-2.5 border border-slate-350 text-slate-700 rounded text-sm hover:bg-slate-50 cursor-pointer"
                  >
                    Back to Login
                  </button>
                  <button 
                    type="submit"
                    className="w-1/2 py-2.5 bg-slate-900 text-white rounded text-sm hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer shadow-md duration-200"
                  >
                    <span>Submit Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left branding panel */}
          <div className="w-full md:w-1/2 bg-[#0B1220] text-white p-xl md:p-3xl flex flex-col justify-between relative">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
            <div>
              <div className="flex items-center gap-sm mb-2xl">
                <span className="material-symbols-outlined text-[32px] text-[#22c55e]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                <span className="font-serif font-semibold text-2xl tracking-wide text-white">MyHLES</span>
              </div>
              <div className="space-y-sm">
                <p className="text-secondary-fixed text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span> Institutional Platform
                </p>
                <div className="h-2 w-16 bg-emerald-500 mb-lg"></div>
                <h1 className="text-3xl lg:text-4xl font-black font-headline text-white leading-tight">
                  Academic Precision.<br />Institutional Control.
                </h1>
                <p className="font-body-sm text-slate-300 max-w-sm mt-md leading-relaxed">
                  Access the primary operations command with state-level compliance and real-time ledger accounting.
                </p>
              </div>
            </div>

            <div className="space-y-lg pt-12 lg:pt-0">
              <div className="flex gap-lg border-t border-slate-800 pt-lg">
                <div>
                  <h4 className="font-bold text-white text-base">256-bit</h4>
                  <p className="text-xs text-slate-400">Military Encryption</p>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div>
                  <h4 className="font-bold text-white">ISO 27001</h4>
                  <p className="text-xs text-on-primary-container">Certified Institution</p>
                </div>
              </div>
              
              <div className="flex items-center gap-sm text-[11px] text-slate-400">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>Protected by Institutional Firewalls</span>
              </div>
            </div>
          </div>

          {/* Right White card with login form */}
          <div className="w-full lg:w-1/2 p-xl lg:p-2xl flex flex-col justify-center">
            <div className="max-w-sm w-full mx-auto">
              <div className="mb-lg">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign In to Dashboard</h2>
                <p className="text-body-sm text-slate-500 mt-1">Enter your assigned academic email address.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Institutional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@institution.edu"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-800 focus:bg-white focus:outline-[#0B1220] transition-colors" 
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert("Please contact your School Administration IT Head to reset credentials."); }} className="text-xs text-slate-500 hover:text-slate-800 hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-800 focus:bg-white focus:outline-[#0B1220] transition-colors"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-650 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pointer-events-none opacity-80 py-1">
                  <div className="flex items-center gap-2">
                    <input 
                      id="remember-me" 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4 pointer-events-auto"
                    />
                    <label htmlFor="remember-me" className="text-xs text-slate-600 cursor-pointer pointer-events-auto">Remember this device</label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#0B1220] text-white py-3 rounded font-bold text-sm tracking-wide hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer mt-4"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <span className="text-xs text-slate-500">New Faculty? </span>
                <button 
                  onClick={() => setIsRequesting(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <ClipboardSignature className="w-3.5 h-3.5" />
                  <span>Request Access</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* App footer */}
      <footer className="w-full text-center py-4 bg-slate-100 border-t border-slate-200 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} MyHLES School Management Systems. Approved and state-compliant for schools under NCT. Live Indian Standard Time: {new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}.
      </footer>
    </div>
  );
}

