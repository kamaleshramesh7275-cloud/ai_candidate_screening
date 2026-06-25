'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, Lock, User, Eye, EyeOff, Sun, Moon, 
  Loader2, ArrowRight, ShieldCheck, Sparkles, Cpu, CheckCircle2 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'candidate' | 'recruiter'>('candidate');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Errors & Feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  // Synchronize theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Real-time validations
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password Validation
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    // Sign Up specific validation
    if (isRegister) {
      if (!name.trim()) {
        newErrors.name = 'Full Name is required.';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Google Login Mock handler
  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const mockUser = {
        id: `google-${Math.random().toString(36).substr(2, 9)}`,
        name: activeTab === 'candidate' ? 'John Google Candidate' : 'Google Recruiter Corp',
        email: activeTab === 'candidate' ? 'john.candidate@gmail.com' : 'recruiting@googlecorp.com',
        role: activeTab
      };
      
      // Store session securely
      localStorage.setItem('user_session', JSON.stringify(mockUser));
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }

      setSuccessMsg('Logged in with Google successfully!');
      setTimeout(() => {
        router.push(activeTab === 'candidate' ? '/candidate-dashboard' : '/recruiter-dashboard');
      }, 800);
    }, 1500);
  };

  // Form Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    if (!validateForm()) return;

    setLoading(true);
    const endpoint = isRegister
      ? `http://localhost:3001/api/auth/${activeTab}/register`
      : `http://localhost:3001/api/auth/${activeTab}/login`;

    const bodyData = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSuccessMsg(isRegister ? 'Registration successful! Logging in...' : 'Login successful!');
      
      // Store session
      localStorage.setItem('user_session', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }));
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remember_me');
      }

      setTimeout(() => {
        router.push(activeTab === 'candidate' ? '/candidate-dashboard' : '/recruiter-dashboard');
      }, 1000);

    } catch (error: any) {
      setErrors({ api: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert(`A password reset link has been mock-sent to ${email || 'your email address'}. Please check your inbox.`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      
      {/* 1. LEFT HERO PANEL */}
      <div className="relative md:w-1/2 min-h-[300px] md:min-h-screen flex flex-col justify-between p-8 md:p-12 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950 dark:from-slate-950 dark:via-purple-950/40 dark:to-indigo-950/40 border-b md:border-b-0 md:border-r border-white/10">
        
        {/* Animated Background Gradients & Mesh blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] animate-pulse duration-7000"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/20 dark:bg-purple-600/10 blur-[120px] animate-pulse duration-5000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        {/* Top Header Row */}
        <div className="z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider text-white">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg text-white shadow-md shadow-indigo-500/20">
              <Cpu className="w-5 h-5 animate-spin duration-10000" />
            </div>
            AI Recruiter
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all backdrop-blur-sm cursor-pointer shadow-inner"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        {/* Hero Copy */}
        <div className="z-10 my-auto py-12 md:py-0 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold tracking-wide text-blue-200 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
            <span>Next-Gen Technical Screening Platform</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6">
            AI Recruiter
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300">
              Smart Hiring Powered by Artificial Intelligence
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-8">
            Our autonomous evaluation engine screens candidates using public GitHub contributions, AI resume analysis, and real-time proctored coding assessments. Zero bias. Maximum logic.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4" />
                Anti-Cheat Engine
              </div>
              <p className="text-xs text-slate-400 leading-normal">Active browser tab, developer tools, and copy-paste monitors.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-blue-400 font-bold mb-1 flex items-center gap-1.5 text-sm">
                <Cpu className="w-4 h-4" />
                GitHub Verified
              </div>
              <p className="text-xs text-slate-400 leading-normal">Direct analysis of public code repositories and language match matrices.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-6 mt-6 md:mt-0">
          <span>© 2026 AI Recruiter Inc.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            All systems logical
          </span>
        </div>
      </div>

      {/* 2. RIGHT FORM PANEL */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        <Card className="w-full max-w-md border-slate-200/80 dark:border-slate-800 shadow-2xl dark:shadow-purple-950/10 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300">
          {/* Accent strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {isRegister 
                ? 'Sign up to start screening or evaluating talent.' 
                : 'Sign in to access your dashboard and active workflows.'}
            </CardDescription>
          </CardHeader>

          {/* Form Tabs */}
          <div className="px-6 flex gap-2 mb-4">
            <button
              onClick={() => { setActiveTab('candidate'); setErrors({}); }}
              disabled={loading}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'candidate'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-855 text-slate-600 dark:text-slate-400 border border-transparent'
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => { setActiveTab('recruiter'); setErrors({}); }}
              disabled={loading}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'recruiter'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-855 text-slate-600 dark:text-slate-400 border border-transparent'
              }`}
            >
              Recruiter
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
            
            {/* API Errors */}
            {errors.api && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold leading-normal animate-shake">
                ⚠️ {errors.api}
              </div>
            )}

            {/* Success Feedback */}
            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold leading-normal">
                ✓ {successMsg}
              </div>
            )}

            {/* Name field (Registration Only) */}
            {isRegister && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11 bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-950/80 border-slate-250 dark:border-slate-800 focus-visible:ring-indigo-500 focus-visible:ring-2 rounded-xl transition-all"
                  />
                </div>
                {errors.name && <p className="text-[11px] text-red-500 dark:text-red-400 mt-0.5">{errors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                {activeTab === 'recruiter' ? 'Company Email Address' : 'Email Address'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder={activeTab === 'recruiter' ? 'jane@company.com' : 'jane@example.com'}
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-950/80 border-slate-250 dark:border-slate-800 focus-visible:ring-indigo-500 focus-visible:ring-2 rounded-xl transition-all"
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 dark:text-red-400 mt-0.5">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Password
                </Label>
                {!isRegister && (
                  <a
                    href="#"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-950/80 border-slate-250 dark:border-slate-800 focus-visible:ring-indigo-500 focus-visible:ring-2 rounded-xl transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 dark:text-red-400 mt-0.5">{errors.password}</p>}
            </div>

            {/* Confirm Password (Registration Only) */}
            {isRegister && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-950/80 border-slate-250 dark:border-slate-800 focus-visible:ring-indigo-500 focus-visible:ring-2 rounded-xl transition-all"
                  />
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-500 dark:text-red-400 mt-0.5">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Remember Me checkbox */}
            {!isRegister && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="rounded border-slate-350 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer accent-indigo-650"
                />
                <Label htmlFor="remember" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                  Remember Me
                </Label>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-950/40 rounded-xl transition-all mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </div>
              )}
            </Button>
          </form>

          {/* Social login option */}
          <div className="px-6 pb-4">
            <div className="relative flex py-2.5 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold h-11 rounded-xl shadow-sm transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              )}
              Login with Google
            </Button>
          </div>

          <CardFooter className="flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/30 py-4 px-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRegister ? 'Already have an account?' : 'New to AI Recruiter?'}
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setErrors({}); }}
                disabled={loading}
                className="ml-1.5 font-bold text-indigo-650 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors hover:underline bg-transparent border-none cursor-pointer"
              >
                {isRegister ? 'Sign In instead' : 'Sign Up now'}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}
