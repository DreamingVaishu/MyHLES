import React, { useState } from 'react';
import { School, UserPlus, Trash2, ArrowRight, CheckCircle, GraduationCap } from 'lucide-react';
import { Student } from '../types';

interface ParentOnboardingProps {
  onOnboardingComplete: (newStudents: Omit<Student, 'id' | 'studentId' | 'status' | 'academicGrades' | 'attendance' | 'upcomingExams' | 'outstandingBalance' | 'annualTotal' | 'feeItems' | 'transactions'>[]) => void;
  guardianName: string;
}

interface NewChildInput {
  name: string;
  grade: string;
  section: string;
}

export default function ParentOnboarding({ onOnboardingComplete, guardianName }: ParentOnboardingProps) {
  const [children, setChildren] = useState<NewChildInput[]>([
    { name: '', grade: 'Grade 5', section: 'A' }
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  const addChildField = () => {
    setChildren([...children, { name: '', grade: 'Grade 6', section: 'A' }]);
    setErrors([]);
  };

  const removeChildField = (index: number) => {
    if (children.length === 1) return;
    const updated = children.filter((_, i) => i !== index);
    setChildren(updated);
  };

  const handleFieldChange = (index: number, field: keyof NewChildInput, value: string) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    
    children.forEach((child, idx) => {
      if (!child.name.trim()) {
        newErrors.push(`Child ${idx + 1} requires a full name.`);
      }
      if (!child.section.trim()) {
        newErrors.push(`Child ${idx + 1} requires a section.`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsDone(true);
    setTimeout(() => {
      onOnboardingComplete(children);
    }, 1000);
  };

  return (
    <div className="w-full flex-grow py-6 px-4 md:px-8 bg-gradient-to-tr from-[#f8f9ff] to-[#eff4ff]">
      <div className="max-w-3xl mx-auto">
        
        {/* Step Header */}
        <section className="mb-8 text-center space-y-2 mt-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#e5eeff] text-[#091426] mb-2">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="font-sans text-2xl md:text-3xl font-extrabold text-[#091426]">
            Welcome to St. Xavier's Academy
          </h1>
          <p className="font-sans text-sm text-[#45474c] max-w-md mx-auto">
            Please register your child's academic details. Once submitted, our teachers will review and activate their interactive student ID profile.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loop over Child Cards */}
          <div className="space-y-6" id="child-cards-container">
            {children.map((child, index) => (
              <div
                key={index}
                className="bg-white border border-[#c5c6cd] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden animate-fade-in"
              >
                {/* Header within Child Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#091426] font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-lg text-[#091426]">
                        Child {index + 1} details
                      </h3>
                      <p className="text-xs text-[#75777d]">Academic Term 2026-27</p>
                    </div>
                  </div>

                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChildField(index)}
                      className="p-2 rounded-lg hover:bg-red-50 text-[#ba1a1a] transition-colors cursor-pointer"
                      title="Remove child"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Full Name input */}
                  <div className="md:col-span-6 flex flex-col gap-1">
                    <label className="block text-xs font-bold text-[#45474c]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter student's full name"
                      value={child.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#c5c6cd] bg-[#f8f9ff] focus:border-[#091426] focus:ring-1 focus:ring-[#091426] transition-all text-sm h-11"
                    />
                  </div>

                  {/* Grade pick */}
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label className="block text-xs font-bold text-[#45474c]">
                      Grade
                    </label>
                    <select
                      value={child.grade}
                      onChange={(e) => handleFieldChange(index, 'grade', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#c5c6cd] bg-[#f8f9ff] focus:border-[#091426] focus:ring-1 focus:ring-[#091426] transition-all text-sm h-11 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <option key={g} value={`Grade ${g}`}>{`Grade ${g}`}</option>
                      ))}
                    </select>
                  </div>

                  {/* Section input */}
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label className="block text-xs font-bold text-[#45474c]">
                      Section
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. A"
                      maxLength={3}
                      value={child.section}
                      onChange={(e) => handleFieldChange(index, 'section', e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#c5c6cd] bg-[#f8f9ff] focus:border-[#091426] focus:ring-1 focus:ring-[#091426] transition-all text-sm h-11"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[#326852] bg-[#b3ecd0]/20 px-3 py-2 rounded-xl text-xs font-medium w-fit">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Submits to class approval desk</span>
                </div>
              </div>
            ))}
          </div>

          {/* Validation errors lists */}
          {errors.length > 0 && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-[#ba1a1a] space-y-1 font-semibold">
              {errors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#c5c6cd] pt-6">
            <button
              type="button"
              onClick={addChildField}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-[#326852] border border-[#326852] hover:bg-[#b3ecd0]/20 transition-all cursor-pointer bg-white"
            >
              <UserPlus className="w-4 h-4" />
              Add Another Child
            </button>
            <button
              type="submit"
              disabled={isDone}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-[#091426] text-white hover:bg-[#1e293b] shadow-lg shadow-[#091426]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDone ? 'Submitting Application...' : 'Submit to Teacher For Approval'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Success Feedback Overlay */}
      {isDone && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#b3ecd0] text-[#002115] px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg border border-[#9ad3b7] font-semibold text-sm">
            <CheckCircle className="w-5 h-5 text-[#326852]" />
            <span>Registration sent to Teacher Approval system!</span>
          </div>
        </div>
      )}
    </div>
  );
}
