'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Cpu, Users, 
  Sun, Moon, Laptop, BarChart3, Lock, Github 
} from 'lucide-react';

export default function LandingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [session, setSession] = useState<any>(null);

  // Sync theme and session on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const activeSession = localStorage.getItem('user_session');
    if (activeSession) {
      setSession(JSON.parse(activeSession));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 dark:bg-blue-600/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 dark:bg-purple-600/10 blur-[130px] pointer-events-none"></div>
      
      {/* Navbar */}
      <header className="z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-650 p-1.5 rounded-lg text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <span>AI Recruiter</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-505 dark:text-slate-400 transition-all cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {session ? (
              <Link href={session.role === 'candidate' ? '/candidate-dashboard' : '/recruiter-dashboard'}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow font-semibold">
                  Dashboard <ArrowRight className="ml-1.5 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-semibold">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-16 md:py-24">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/60 dark:bg-white/5 border border-blue-200 dark:border-white/10 text-xs font-bold tracking-wide text-blue-600 dark:text-blue-350 mb-8 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Algorithmic Technical Screening. Zero Bias.</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
          Hire the Best.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-650 via-indigo-500 to-purple-500 dark:from-blue-400 dark:to-purple-300">
            Powered by Pure Logic.
          </span>
        </h1>
        
        <p className="text-md md:text-lg text-slate-500 dark:text-slate-405 mb-12 max-w-2xl leading-relaxed">
          AI Recruiter automates technical candidate evaluations. We parse resume skills, verify experience by crawling public GitHub repositories, and proctor secure coding environments using browser telemetry.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {session && session.role === 'candidate' ? (
            <Link href="/candidate-dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 h-12 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] transition-all hover:scale-102 font-bold">
                Go to Candidate Dashboard <ArrowRight className="ml-2 w-4.5 h-4.5" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 h-12 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] transition-all hover:scale-102 font-bold">
                Candidate Portal <ArrowRight className="ml-2 w-4.5 h-4.5" />
              </Button>
            </Link>
          )}

          {session && session.role === 'recruiter' ? (
            <Link href="/recruiter-dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 h-12 border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 backdrop-blur-md font-bold">
                Go to Recruiter Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 h-12 border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 backdrop-blur-md font-bold">
                Recruiter Portal
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="z-10 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200/50 dark:border-slate-800/50 py-16 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all">
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <Activity className="text-blue-500 w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Automated Credentials Scoring</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
              We extract skills and index profiles via regular expressions and cross-reference resume declarations with public data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all">
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Github className="text-purple-500 w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-bold mb-2">GitHub Verification</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
              We compile code statistics from candidates' GitHub activity, including commit volumes, repository stars, and language match charts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all">
            <div className="h-11 w-11 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <Lock className="text-red-500 w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Strict Proctored Assessment</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
              Security telemetry tracks blur actions, tab focus toggles, developer tools detection, and mouse context events to verify sandbox integrity.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="z-10 py-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-400 dark:text-slate-500">
        © 2026 AI Recruiter Inc. All rights reserved.
      </footer>

    </div>
  );
}
