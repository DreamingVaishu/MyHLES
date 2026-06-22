import React, { useState } from 'react';
import { School, ArrowRight, Shield, BellRing, Trophy, Smartphone } from 'lucide-react';

interface ParentLoginProps {
  onLoginSuccess: (phoneOrEmail: string, method: 'google' | 'phone') => void;
  onSwitchToTeacher: () => void;
}

export default function ParentLogin({ onLoginSuccess, onSwitchToTeacher }: ParentLoginProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter your mobile number');
      return;
    }
    if (phoneNumber.length < 8) {
      setError('Please enter a valid mobile number');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(`${countryCode} ${phoneNumber}`, 'phone');
    }, 800);
  };

  const handleGoogleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess('mahimamourya2005@gmail.com', 'google');
    }, 800);
  };

  return (
    <div id="parent-login-container" className="w-full flex-grow flex flex-col justify-between py-6 px-4 md:px-8 mt-12 bg-[#f8f9ff]">
      
      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] -left-[10%] w-[50%] h-[50%] bg-[#bcc7de] opacity-[0.25] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] -right-[15%] w-[40%] h-[40%] bg-[#b3ecd0] opacity-[0.25] blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md mx-auto z-10 flex-grow flex flex-col justify-center">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#091426] mb-4 shadow-lg shadow-[#091426]/10">
            <School className="text-white text-3xl w-8 h-8" />
          </div>
          <h1 id="welcome-title" className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-[#0b1c30] mb-2 leading-tight">
            Welcome back, Parent
          </h1>
          <p className="font-sans text-sm md:text-base text-[#45474c] max-w-xs mx-auto">
            Access your child's academic progress and school updates securely.
          </p>
        </div>

        {/* Login Container (Level 1 Elevation) */}
        <div className="bg-white border border-[#c5c6cd] rounded-2xl p-6 shadow-sm transition-all">
          <div className="flex flex-col gap-5">
            {/* Primary Action: Google Login */}
            <button
              id="google-login-btn"
              onClick={handleGoogleSubmit}
              disabled={isSubmitting}
              className="w-full h-14 flex items-center justify-center gap-3 border border-[#c5c6cd] bg-white text-[#45474c] font-semibold text-sm md:text-base rounded-xl hover:bg-[#eff4ff] transition-all duration-200 active:scale-95 group cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-[1px] flex-grow bg-[#c5c6cd]"></div>
              <span className="text-xs font-semibold text-[#75777d]">OR</span>
              <div className="h-[1px] flex-grow bg-[#c5c6cd]"></div>
            </div>

            {/* Phone Login Form */}
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs md:text-sm text-[#45474c] ml-1">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative w-24">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full h-14 bg-[#eff4ff] border border-[#c5c6cd] rounded-xl px-3 font-semibold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#091426]/20 text-sm md:text-base cursor-pointer"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+971">+971</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    className="flex-grow h-14 bg-white border border-[#c5c6cd] rounded-xl px-4 font-sans text-sm md:text-base text-[#0b1c30] placeholder:text-[#cbd5e1] focus:outline-none focus:border-[#091426] focus:ring-2 focus:ring-[#091426]/10 transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs font-semibold text-[#ba1a1a] px-1">
                  {error}
                </p>
              )}

              <button
                id="phone-continue-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 mt-2 flex items-center justify-center gap-2 bg-[#091426] text-white font-semibold text-sm md:text-base rounded-xl hover:opacity-95 transition-all duration-200 active:scale-95 cursor-pointer shadow-md shadow-[#091426]/10"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Info badges for realistic feel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 option-cards">
          <div className="bg-white p-3 rounded-xl border border-[#c5c6cd] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#b3ecd0] flex items-center justify-center text-[#326852] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs md:text-sm text-[#0b1c30] truncate">Secure Access</span>
              <span className="text-[11px] text-[#45474c] truncate">Verifiable security systems</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#c5c6cd] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#091426] shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs md:text-sm text-[#0b1c30] truncate">Real-time alerts</span>
              <span className="text-[11px] text-[#45474c] truncate">Instant school notifications</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#c5c6cd] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c9e6ff]/50 flex items-center justify-center text-[#002c42] shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs md:text-sm text-[#0b1c30] truncate">Performance</span>
              <span className="text-[11px] text-[#45474c] truncate">In-depth feedback & grades</span>
            </div>
          </div>
        </div>

        {/* Option to switch to teacher mode to see approvals */}
        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToTeacher}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#091426] border border-[#091426] hover:bg-[#091426] hover:text-white transition-all cursor-pointer"
          >
            Switch to Teacher Mode (Admin Panel)
          </button>
        </div>
      </div>

      <footer className="w-full mt-8 py-4 border-t border-[#c5c6cd] flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#45474c]">
          <a href="#support" className="hover:text-[#091426] transition-colors">Support</a>
          <a href="#privacy" className="hover:text-[#091426] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#091426] transition-colors">Terms of Service</a>
        </div>
        <p className="text-[11px] text-[#75777d]">© 2026 EduFlow Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}
