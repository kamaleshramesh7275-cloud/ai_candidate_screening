'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, ShieldCheck, Zap, Activity,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-200">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px]"></div>
      
      <div className="z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Algorithmic screening. Zero LLM bias.</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Hire the Best.<br />With Pure Logic.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          AI Recruiter automates technical screening using verifiable data. We cross-reference resume claims against real GitHub activity and enforce strict anti-cheat testing—all driven by rule-based algorithms.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            onClick={() => router.push('/apply')}
            size="lg" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-14 text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 cursor-pointer"
          >
            Apply as Candidate <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            onClick={() => router.push('/recruiter')}
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto rounded-full px-8 h-14 text-lg border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 backdrop-blur-md cursor-pointer"
          >
            Recruiter Dashboard
          </Button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 px-4 max-w-5xl mx-auto">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
            <Activity className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Data-Driven Verification</h3>
          <p className="text-sm text-slate-400">We don't just read resumes. We pull live GitHub data to verify claimed languages and commit frequency.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
            <ShieldCheck className="text-emerald-400 w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Strict Anti-Cheat</h3>
          <p className="text-sm text-slate-400">Our testing engine monitors tab switches, devtools, and copy/paste actions to ensure absolute integrity.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
            <Zap className="text-purple-400 w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Instant Scoring</h3>
          <p className="text-sm text-slate-400">Rule-based scoring aggregates resume keywords, repo impact, and test results into one final metric.</p>
        </div>
      </div>
    </div>
  );
}
