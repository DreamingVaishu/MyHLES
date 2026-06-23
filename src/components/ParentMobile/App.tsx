import React, { useState, useEffect } from 'react';
import { 
  School, 
  Home, 
  CreditCard, 
  Award, 
  User, 
  LogOut, 
  ShieldAlert,
  Sliders
} from 'lucide-react';

import { Student, Notice, SubjectGrade } from './types';
import { INITIAL_NOTICES, INITIAL_STUDENTS, calculateGrade, MOCK_SUBJECTS_POOL } from './mockData';
import ParentLogin from './ParentLogin';
import ParentOnboarding from './ParentOnboarding';
import ParentDashboard from './ParentDashboard';
import ParentFees from './ParentFees';

export default function App() {
  // Unified State for students and notice updates to sync real-time
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students_pool');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('school_notices_board');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  // Login session states
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('school_parent_logged') === 'true';
  });
  
  const [guardianInfo, setGuardianInfo] = useState(() => {
    const info = localStorage.getItem('school_parent_guardian');
    return info ? JSON.parse(info) : { name: 'Michael Thompson', phoneOrEmail: '+91 9999999999' };
  });

  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(() => {
    return localStorage.getItem('school_parent_onboarded') === 'true';
  });

  // Active student pointer in parent dashboard
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    const saved = localStorage.getItem('school_parent_current_kid');
    return saved || 's1';
  });

  // Parent Tab Selector: 'home' | 'fees' | 'results' | 'profile'
  const [parentTab, setParentTab] = useState<'home' | 'fees' | 'results' | 'profile'>('home');

  // Synchronise state changes with client cache for seamless reloads
  useEffect(() => {
    localStorage.setItem('school_students_pool', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_notices_board', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('school_parent_logged', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('school_parent_guardian', JSON.stringify(guardianInfo));
  }, [guardianInfo]);

  useEffect(() => {
    localStorage.setItem('school_parent_onboarded', String(isOnboardingCompleted));
  }, [isOnboardingCompleted]);

  useEffect(() => {
    localStorage.setItem('school_parent_current_kid', selectedStudentId);
  }, [selectedStudentId]);

  // Handle successful Parent login screen
  const handleParentLoginSuccess = (phoneOrEmail: string, method: 'google' | 'phone') => {
    const defaultName = method === 'google' ? 'Michael Thompson' : 'Michael Thompson';
    setGuardianInfo({ name: defaultName, phoneOrEmail });
    setIsLoggedIn(true);

    // If we already have approved or pending kids, skip onboarding
    const hasKids = students.some(s => s.guardianPhone === phoneOrEmail || s.guardianName === defaultName);
    if (hasKids) {
      setIsOnboardingCompleted(true);
      // Auto-set the selected kid to the parent's first child
      const parentKid = students.find(s => s.guardianPhone === phoneOrEmail || s.guardianName === defaultName);
      if (parentKid) {
        setSelectedStudentId(parentKid.id);
      }
    } else {
      setIsOnboardingCompleted(false);
    }
  };

  // Complete parent onboarding to forward children requests
  const handleOnboardingComplete = (newChildren: { name: string; grade: string; section: string }[]) => {
    const generated: Student[] = newChildren.map((child, idx) => {
      const childId = `s-temp-${Date.now()}-${idx}`;
      
      // Pre-fill scholastic templates for activation
      const templateGrades = MOCK_SUBJECTS_POOL.map(sub => {
        const score = Math.floor(sub.baseMark + Math.random() * 10);
        return {
          subject: sub.subject,
          grade: calculateGrade(score),
          marks: score,
          icon: sub.icon
        };
      });

      return {
        id: childId,
        name: child.name,
        grade: child.grade,
        section: child.section,
        guardianName: guardianInfo.name,
        guardianPhone: guardianInfo.phoneOrEmail,
        studentId: '', // Blank - activated by teacher
        status: 'pending',
        academicGrades: templateGrades,
        attendance: {
          present: 38,
          total: 40,
          percentage: 95.0
        },
        upcomingExams: [
          { id: `e-temp1-${idx}`, date: '12', month: 'OCT', subject: 'Mathematics', details: 'Term 2 Finals • 09:00 AM' },
          { id: `e-temp2-${idx}`, date: '15', month: 'OCT', subject: 'English Class Work', details: 'Weekly test' }
        ],
        outstandingBalance: 1250,
        annualTotal: 3650,
        feeItems: [
          { id: `f-temp1-${idx}`, name: 'Tuition (Term 2)', amount: 3200, dueDate: '15 Sep 2026', status: 'Pending', category: 'tuition' },
          { id: `f-temp2-${idx}`, name: 'Transport (Oct)', amount: 150, dueDate: '10 Oct 2026', status: 'Pending', category: 'transport' },
          { id: `f-temp3-${idx}`, name: 'Lab Fees', amount: 300, dueDate: '15 Oct 2026', status: 'Pending', category: 'lab' }
        ],
        transactions: []
      };
    });

    setStudents(prev => [...prev, ...generated]);
    setIsOnboardingCompleted(true);
    setSelectedStudentId(generated[0].id);
    setParentTab('home');
  };

  // Sign out developer option
  const handleResetSession = () => {
    localStorage.removeItem('school_students_pool');
    localStorage.removeItem('school_notices_board');
    localStorage.removeItem('school_parent_logged');
    localStorage.removeItem('school_parent_guardian');
    localStorage.removeItem('school_parent_onboarded');
    localStorage.removeItem('school_parent_current_kid');
    setStudents(INITIAL_STUDENTS);
    setNotices(INITIAL_NOTICES);
    setIsLoggedIn(false);
    setIsOnboardingCompleted(false);
    setSelectedStudentId('s1');
    setParentTab('home');
  };

  // PARENT CALLBACKS: Process direct or selection payments
  const handleProcessPayment = (studentId: string, amountPaid: number, itemIdsToMarkPaid?: string[]) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        // Mark checked item list paid
        const updatedFeeItems = s.feeItems.map(item => {
          if (itemIdsToMarkPaid && itemIdsToMarkPaid.includes(item.id)) {
            return { ...item, status: 'Paid' as const };
          }
          return item;
        });

        // Deduce amount from outstanding balance or settle customized sum
        const currentUnpaidAmount = updatedFeeItems
          .filter(f => f.status !== 'Paid')
          .reduce((sum, f) => sum + f.amount, 0);

        // Append new completed receipt record
        const newTxn = {
          id: `t-${Date.now()}`,
          date: new Date().getDate().toString().padStart(2, '0'),
          month: new Date().toLocaleDateString('en-US', { month: 'short' }),
          day: new Date().getDate().toString(),
          description: itemIdsToMarkPaid && itemIdsToMarkPaid.length > 0 
            ? s.feeItems.filter(f => itemIdsToMarkPaid.includes(f.id)).map(f => f.name).join(', ')
            : 'Custom Direct School Settle',
          amount: amountPaid,
          status: 'Paid' as const
        };

        return {
          ...s,
          feeItems: updatedFeeItems,
          outstandingBalance: currentUnpaidAmount,
          transactions: [newTxn, ...s.transactions]
        };
      }
      return s;
    }));
  };

  const currentSelectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start text-sans select-none antialiased md:py-6">
      
      {/* 🚀 DIAGNOSTIC TOOLBAR FOR CONVENIENCE */}
      <div className="w-full max-w-lg bg-slate-950 text-white rounded-t-2xl py-3 px-4 flex justify-between items-center text-xs font-bold border-b border-indigo-900 shadow-md">
        <div className="flex items-center gap-1.5 text-indigo-300">
          <Sliders className="w-4 h-4 shrink-0 text-indigo-400" />
          <span>Parent Mobile Portal</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleResetSession}
            className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all tracking-wider shrink-0 cursor-pointer bg-slate-900 text-slate-400 hover:text-white"
          >
            Reset Session
          </button>
        </div>
      </div>

      {/* CORE MOBILE CONTAINER (Mocking a high-end visual smartphone frame) */}
      <div className="w-full max-w-lg bg-white md:rounded-b-2xl shadow-2xl relative flex flex-col min-h-[820px] overflow-hidden">
        
        {/* TOP STATUS BAR APPLET HEADER */}
        <header className="fixed top-0 max-w-lg w-full z-40 bg-[#091426] text-white flex items-center justify-between px-4 h-16 shadow-md">
          <div className="flex items-center gap-2">
            <School className="w-6 h-6 text-[#b3ecd0]" />
            <h1 className="font-sans font-extrabold text-sm md:text-base tracking-tight text-white">
              MyHLES Parent Portal
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSession}
              className="p-2 bg-slate-900 text-slate-400 hover:text-[#ba1a1a] rounded-lg transition-colors cursor-pointer"
              title="Reset Simulated Database"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* CONTAINER CONTENT ROUTING */}
        <div className="flex-grow flex flex-col pt-16 bg-[#f8f9ff]">
          
          {!isLoggedIn ? (
            /* PARENT ROLE: 1. LOGIN SCREEN */
            <ParentLogin 
              onLoginSuccess={handleParentLoginSuccess}
              onSwitchToTeacher={() => {}}
            />
          ) : !isOnboardingCompleted ? (
            /* PARENT ROLE: 2. ONBOARDING SCREEN */
            <ParentOnboarding 
              guardianName={guardianInfo.name}
              onOnboardingComplete={handleOnboardingComplete}
            />
          ) : (
            /* PARENT ROLE: 3. MAIN DASHBOARDS AND SUB MODULES */
            <>
              {parentTab === 'home' || parentTab === 'results' || parentTab === 'profile' ? (
                <ParentDashboard
                  students={students}
                  selectedStudentId={selectedStudentId}
                  onSelectStudent={(id) => setSelectedStudentId(id)}
                  onTriggerAddNewChild={() => setIsOnboardingCompleted(false)}
                  notices={notices}
                  activeTab={parentTab}
                  setActiveTab={setParentTab}
                  onPayTabRedirect={() => setParentTab('fees')}
                />
              ) : (
                /* REGULAR FEES TAB CONTROL */
                currentSelectedStudent ? (
                  currentSelectedStudent.status === 'approved' ? (
                    <ParentFees
                      student={currentSelectedStudent}
                      onProcessPayment={handleProcessPayment}
                    />
                  ) : (
                    /* Inactive fee detail protection */
                    <div className="flex-grow flex flex-col p-6 items-center justify-center text-center space-y-3 bg-white">
                      <ShieldAlert className="w-12 h-12 text-amber-500" />
                      <h3 className="font-sans font-bold text-base text-[#091426]">Onboarding incomplete</h3>
                      <p className="text-xs text-[#75777d] max-w-xs">
                        Fees schedules will activate as soon as the class teacher authorizes {currentSelectedStudent.name}'s roll code in the instructor console.
                      </p>
                      <button
                        onClick={() => setParentTab('home')}
                        className="px-4 py-2 bg-[#091426] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Return to overview
                      </button>
                    </div>
                  )
                ) : null
              )}

              {/* PARENT SMARTPHONE BOTTOM BAR NAVIGATION SHELL */}
              <nav className="fixed bottom-0 max-w-lg w-full z-45 bg-white border-t border-gray-300 flex justify-around items-center h-16 py-2 shadow-lg">
                <button
                  onClick={() => setParentTab('home')}
                  className={`flex flex-col items-center justify-center py-1 transition-all flex-1 cursor-pointer ${
                    parentTab === 'home' ? 'text-indigo-600 scale-105 font-bold' : 'text-[#75777d]'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] tracking-wide mt-0.5">Home</span>
                </button>
                <button
                  onClick={() => setParentTab('fees')}
                  className={`flex flex-col items-center justify-center py-1 transition-all flex-1 cursor-pointer ${
                    parentTab === 'fees' ? 'text-indigo-600 scale-105 font-bold' : 'text-[#75777d]'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px] tracking-wide mt-0.5">Pay Fees</span>
                </button>
                <button
                  onClick={() => setParentTab('results')}
                  className={`flex flex-col items-center justify-center py-1 transition-all flex-1 cursor-pointer ${
                    parentTab === 'results' ? 'text-indigo-600 scale-105 font-bold' : 'text-[#75777d]'
                  }`}
                >
                  <Award className="w-5 h-5" />
                  <span className="text-[10px] tracking-wide mt-0.5">Results</span>
                </button>
                <button
                  onClick={() => setParentTab('profile')}
                  className={`flex flex-col items-center justify-center py-1 transition-all flex-1 cursor-pointer ${
                    parentTab === 'profile' ? 'text-indigo-600 scale-105 font-bold' : 'text-[#75777d]'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px] tracking-wide mt-0.5">Profile</span>
                </button>
              </nav>
            </>
          )}

        </div>

      </div>

      {/* FOOTER LABEL */}
      <div className="text-center mt-3 text-slate-500 text-[11px] font-sans">
        Powered by Antigravity OS and Google DeepMind Build engine. Styled via Tailwind CSS v4.
      </div>
    </div>
  );
}
