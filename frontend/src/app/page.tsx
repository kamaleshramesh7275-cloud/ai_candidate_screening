'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Github, FileText, CheckCircle, BrainCircuit, Users
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center relative overflow-hidden transition-colors duration-200 font-sans">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-20 px-4">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-red-600/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-rose-600/20 blur-[120px] pointer-events-none"></div>
        
        <div className="z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Algorithmic screening. Zero LLM bias.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 animate-fade-in-up animation-delay-100">
            Hire the Best.<br />With Pure Logic.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-200">
            AI Recruiter automates technical screening using verifiable data. We cross-reference resume claims against real GitHub activity and enforce strict anti-cheat testing—all driven by rule-based algorithms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up animation-delay-300">
            <Button 
              onClick={() => router.push('/apply')}
              size="lg" 
              className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white rounded-full px-8 h-14 text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 cursor-pointer"
            >
              Apply as Candidate <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => router.push('/recruiter')}
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto rounded-full px-8 h-14 text-lg border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200 backdrop-blur-md cursor-pointer transition-all hover:scale-105"
            >
              Recruiter Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full z-10 py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why AI Recruiter?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Traditional recruiting is broken. Resumes are inflated, and manual screening takes too long. Our platform solves this.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-md hover:bg-white/5 transition-colors group">
              <div className="h-14 w-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="text-red-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data-Driven Verification</h3>
              <p className="text-zinc-400 leading-relaxed">We don't just read resumes. We pull live GitHub data to verify claimed languages, repo impact, and commit frequency.</p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-md hover:bg-white/5 transition-colors group">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-emerald-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Strict Anti-Cheat</h3>
              <p className="text-zinc-400 leading-relaxed">Our testing engine monitors tab switches, devtools, and copy/paste actions to ensure absolute integrity during assessments.</p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-md hover:bg-white/5 transition-colors group">
              <div className="h-14 w-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-orange-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Scoring</h3>
              <p className="text-zinc-400 leading-relaxed">Rule-based scoring aggregates resume keywords, GitHub metrics, and test results into one final, actionable metric.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full z-10 py-24 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">A seamless experience from application to final shortlist.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-red-600/0 via-red-600/50 to-red-600/0 -tranzinc-y-1/2 z-0"></div>
          
          <div className="flex-1 flex flex-col items-center text-center relative z-10">
            <div className="h-20 w-20 rounded-full bg-zinc-900 border-4 border-zinc-950 shadow-[0_0_0_2px_rgba(37,99,235,0.5)] flex items-center justify-center mb-6">
              <FileText className="text-red-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Resume Parsing</h3>
            <p className="text-zinc-400">Candidates upload their PDF resume. Our system extracts skills, experience, and GitHub links automatically.</p>
          </div>

          <div className="flex-1 flex flex-col items-center text-center relative z-10">
            <div className="h-20 w-20 rounded-full bg-zinc-900 border-4 border-zinc-950 shadow-[0_0_0_2px_rgba(16,185,129,0.5)] flex items-center justify-center mb-6">
              <Github className="text-emerald-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. GitHub Audit</h3>
            <p className="text-zinc-400">We query the GitHub API to fact-check the candidate's technical claims and evaluate their public code activity.</p>
          </div>

          <div className="flex-1 flex flex-col items-center text-center relative z-10">
            <div className="h-20 w-20 rounded-full bg-zinc-900 border-4 border-zinc-950 shadow-[0_0_0_2px_rgba(168,85,247,0.5)] flex items-center justify-center mb-6">
              <BrainCircuit className="text-orange-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Proctored Test</h3>
            <p className="text-zinc-400">Candidates take a secure, domain-specific multiple-choice test with strict anti-cheat monitoring in place.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full z-10 py-16 bg-gradient-to-r from-red-900/20 via-rose-900/20 to-orange-900/20 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white mb-2">10x</div>
            <div className="text-zinc-400 text-sm uppercase tracking-wider">Faster Screening</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white mb-2">0%</div>
            <div className="text-zinc-400 text-sm uppercase tracking-wider">LLM Hallucination</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white mb-2">100%</div>
            <div className="text-zinc-400 text-sm uppercase tracking-wider">Rule-Based Integrity</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white mb-2">24/7</div>
            <div className="text-zinc-400 text-sm uppercase tracking-wider">Automated Processing</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full z-10 py-24 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to streamline your hiring?</h2>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">Join forward-thinking engineering teams who use AI Recruiter to find top talent based on verifiable data, not just keyword-stuffed resumes.</p>
        <Button 
          onClick={() => router.push('/recruiter')}
          size="lg" 
          className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-10 h-14 text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 cursor-pointer font-semibold"
        >
          Go to Dashboard
        </Button>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-8 px-4 text-center text-zinc-500 z-10 mt-auto bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-400" />
            <span className="font-semibold text-zinc-300">AI Recruiter</span>
          </div>
          <p>© {new Date().getFullYear()} AI Recruiter Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
