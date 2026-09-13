import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AuthPageProps {
  mode: 'LOGIN' | 'REGISTER' | 'FORGOT';
  navigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, navigate }) => {
  const { login, quickSwitchRole } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [targetExams, setTargetExams] = useState('MPSC, Police Bharti');
  const [stateName, setStateName] = useState('Maharashtra');
  const [city, setCity] = useState('Pune');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    if (mode === 'LOGIN') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid credentials');

        login(data.token, data.user);
        navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setSubmitting(false);
      }
    } else if (mode === 'REGISTER') {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
            mobile_number: mobile,
            target_exams: targetExams.split(',').map(x => x.trim()),
            state: stateName,
            city
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        login(data.token, data.user);
        navigate('/dashboard');
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setSubmitting(false);
      }
    } else if (mode === 'FORGOT') {
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        setSuccessMsg(data.message || 'If an account exists, a reset code was delivered.');
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl relative">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {mode === 'LOGIN' ? 'Welcome Back to TechClass' : mode === 'REGISTER' ? 'Join TechClass Free' : 'Recover Account Password'}
          </h1>
          <p className="text-xs text-slate-400">
            {mode === 'LOGIN' ? 'Log in with your Student ID or Registered Email.' : mode === 'REGISTER' ? 'Get your unique Student ID and 3 free mock tests instantly.' : 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'REGISTER' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {mode === 'LOGIN' ? 'Email or Student ID' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'LOGIN' ? 'e.g. free@student.in or TC100001' : 'e.g. name@gmail.com'}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {mode !== 'FORGOT' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                {mode === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {mode === 'REGISTER' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Please wait...' : mode === 'LOGIN' ? 'Sign In to Classroom' : mode === 'REGISTER' ? 'Create Free Account' : 'Send Recovery Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Box */}
        {mode === 'LOGIN' && (
          <div className="pt-2 border-t border-slate-800 space-y-2 text-center">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Instant Demo Access
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickSwitchRole('FREE_STUDENT')}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
              >
                Free Student
              </button>
              <button
                type="button"
                onClick={() => quickSwitchRole('PAID_STUDENT')}
                className="py-1.5 px-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-medium"
              >
                Paid Student
              </button>
              <button
                type="button"
                onClick={() => quickSwitchRole('SUPER_ADMIN')}
                className="py-1.5 px-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 text-[11px] font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Switch mode links */}
        <div className="text-center text-xs text-slate-400">
          {mode === 'LOGIN' ? (
            <p>
              New candidate?{' '}
              <button onClick={() => navigate('/register')} className="text-cyan-400 hover:underline font-semibold">
                Register Free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-cyan-400 hover:underline font-semibold">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
