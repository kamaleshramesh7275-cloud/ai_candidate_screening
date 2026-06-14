'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowRight, ShieldCheck, Zap, Activity,
  Loader2, UploadCloud, Github, Linkedin, User,
  AlertTriangle, Clock, ShieldAlert, CheckCircle2,
  Download, Users, XCircle, Search, StickyNote, BarChart3, TrendingUp
} from 'lucide-react';

// ==========================================
// DOMAIN KEYWORD MAPS
// ==========================================
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  Frontend: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Tailwind', 'Redux', 'Vue', 'Angular', 'Webpack', 'GraphQL', 'REST', 'npm', 'Vite'],
  Backend: ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'API', 'Redis', 'Microservices', 'JWT', 'REST'],
  DevOps: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Bash', 'GCP', 'Azure', 'Ansible', 'Prometheus', 'Nginx', 'Git', 'Helm'],
  ML: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'NLP', 'Jupyter', 'Keras', 'OpenCV', 'SQL', 'Hugging Face', 'CUDA'],
  'General CS': ['Data Structures', 'Algorithms', 'Git', 'Agile', 'OOP', 'C++', 'Java', 'Python', 'SQL', 'Testing', 'Linux', 'REST', 'System Design', 'Databases', 'Recursion'],
};

// ==========================================
// 1. HOME VIEW
// ==========================================
interface HomeViewProps {
  setView: (view: 'home' | 'apply' | 'test' | 'success' | 'recruiter') => void;
}

function HomeView({ setView }: HomeViewProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
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
            onClick={() => setView('apply')}
            size="lg" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-14 text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105"
          >
            Apply as Candidate <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            onClick={() => setView('recruiter')}
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto rounded-full px-8 h-14 text-lg border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 backdrop-blur-md"
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

// ==========================================
// 2. APPLY VIEW
// ==========================================
interface ApplyViewProps {
  setView: (view: 'home' | 'apply' | 'test' | 'success' | 'recruiter') => void;
  setCandidateData: (data: { id: string; domain: string }) => void;
}

function ApplyView({ setView, setCandidateData }: ApplyViewProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedInUrl: '',
    githubUrl: '',
    domain: '',
  });
  const [resume, setResume] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('linkedInUrl', formData.linkedInUrl);
    data.append('githubUrl', formData.githubUrl);
    data.append('domain', formData.domain);
    if (resume) {
      data.append('resume', resume);
    }

    try {
      const res = await fetch('http://localhost:3001/api/candidates/intake', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      const result = await res.json();
      setCandidateData({ id: result.candidateId, domain: formData.domain });
      setView('test');
    } catch (error) {
      console.error(error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Info Panel */}
      <div className="md:w-1/3 bg-slate-900 text-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0"></div>
        <div className="z-10">
          <button 
            onClick={() => setView('home')} 
            className="text-blue-400 font-semibold mb-12 inline-block hover:text-blue-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            &larr; Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-4">Join the Team</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Submit your details below. Our algorithmic engine will analyze your resume and verify your public GitHub contributions before routing you to our proctored technical assessment.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><UploadCloud className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-slate-200">Automated Parsing</h4>
                <p className="text-sm text-slate-500">We extract your skills via regex.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Github className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-slate-200">GitHub Verification</h4>
                <p className="text-sm text-slate-500">We cross-reference claimed languages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="md:w-2/3 p-8 md:p-16 flex items-center justify-center">
        <Card className="w-full max-w-xl border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-slate-800">Candidate Intake</CardTitle>
            <CardDescription className="text-slate-500">All fields are required for an accurate score.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      id="name" 
                      required 
                      className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain" className="text-slate-700 font-medium">Target Role / Domain</Label>
                <Select required onValueChange={(value) => setFormData({...formData, domain: value})}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select your expertise area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend Developer</SelectItem>
                    <SelectItem value="Backend">Backend Developer</SelectItem>
                    <SelectItem value="DevOps">DevOps Engineer</SelectItem>
                    <SelectItem value="ML">Machine Learning Engineer</SelectItem>
                    <SelectItem value="General CS">General Software Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-slate-700 font-medium">LinkedIn URL</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      id="linkedin" 
                      type="url" 
                      className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedInUrl}
                      onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="text-slate-700 font-medium">GitHub URL</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      id="github" 
                      type="url" 
                      className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                      placeholder="https://github.com/..."
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="resume" className="text-slate-700 font-medium">Upload Resume (PDF only)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
                  <Input 
                    id="resume" 
                    type="file" 
                    accept=".pdf"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-700">
                    {resume ? resume.name : "Click or drag file to upload"}
                  </p>
                  {!resume && <p className="text-xs text-slate-500 mt-1">Maximum file size 5MB</p>}
                </div>
              </div>

            </CardContent>
            <CardFooter className="bg-slate-50/50 pt-4 px-6 pb-6 mt-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 h-12 text-lg rounded-xl transition-all" disabled={loading || !formData.domain}>
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Data...</>
                ) : (
                  'Submit & Start Assessment'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// 3. TEST VIEW
// ==========================================
interface TestViewProps {
  setView: (view: 'home' | 'apply' | 'test' | 'success' | 'recruiter') => void;
  candidateData: { id: string; domain: string } | null;
}

function TestView({ setView, candidateData }: TestViewProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Anti-Cheat State
  const [strikes, setStrikes] = useState(0);
  const [cheatLog, setCheatLog] = useState<{type: string, timestamp: string}[]>([]);

  const domain = candidateData?.domain || 'General CS';
  const candidateId = candidateData?.id;

  useEffect(() => {
    fetch(`http://localhost:3001/api/test/generate/${domain}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [domain]);

  const handleSubmitTest = useCallback(async (finalStrikes: number) => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(()=>{});
    }

    try {
      const res = await fetch('http://localhost:3001/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          answers,
          cheatStrikes: finalStrikes,
          cheatLog
        })
      });

      if (res.ok) {
        setView('success');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting test.');
    }
  }, [candidateId, answers, cheatLog, setView]);

  const addStrike = useCallback((type: string) => {
    setStrikes(prev => {
      const newStrikes = prev + 1;
      setCheatLog(log => [...log, { type, timestamp: new Date().toISOString() }]);
      if (newStrikes >= 3) {
        alert('You have reached 3 strikes. Your test is being auto-submitted.');
        handleSubmitTest(newStrikes);
      }
      return newStrikes;
    });
  }, [handleSubmitTest]);

  useEffect(() => {
    if (!started) return;

    const handleVisibilityChange = () => {
      if (document.hidden) addStrike('Tab Switched (visibilitychange)');
    };
    const handleBlur = () => addStrike('Window Blurred');
    const handleContextMenu = (e: Event) => { e.preventDefault(); addStrike('Context Menu Blocked'); };
    const handleCopyPaste = (e: Event) => { e.preventDefault(); addStrike('Copy/Paste Blocked'); };
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) addStrike('Mouse left window (Top)');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) addStrike('Exited Fullscreen');
    };

    const checkDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        addStrike('DevTools Detected');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const devToolsInterval = setInterval(checkDevTools, 2000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(devToolsInterval);
    };
  }, [started, addStrike]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(60);
    } else {
      handleSubmitTest(strikes);
    }
  }, [currentQuestionIndex, questions.length, strikes, handleSubmitTest]);

  useEffect(() => {
    if (!started || timeLeft <= 0) {
      if (timeLeft === 0) handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, started, handleNext]);

  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.warn("Fullscreen request denied", err);
    }
    setStarted(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-pulse text-white flex flex-col items-center">
        <ShieldAlert className="w-12 h-12 text-slate-500 mb-4" />
        <p>Loading Assessment Environment...</p>
      </div>
    </div>
  );

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-2xl">
          <CardHeader className="text-center pb-8 border-b border-slate-800">
            <div className="mx-auto bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-3xl text-white">Proctored Assessment</CardTitle>
            <CardDescription className="text-red-400 font-medium text-lg mt-2">
              Strict Anti-Cheat Environment Active
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm">Do not switch tabs or minimize the browser window.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm">Copying and pasting text is strictly prohibited.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm">Do not open developer tools or exit fullscreen.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold">3 strikes will result in automatic test failure.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-950/50 pt-6 rounded-b-xl border-t border-slate-800">
            <Button onClick={startTest} size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-lg py-6 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
              I Understand &mdash; Enter Fullscreen
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>No questions generated for domain: {domain}. Please contact recruitment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 p-4">
      {/* Top HUD */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Progress</div>
          <div className="bg-slate-100 h-2 w-32 md:w-48 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-slate-600 font-medium">{currentQuestionIndex + 1} / {questions.length}</div>
        </div>
        
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-slate-700'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${strikes > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
            <ShieldAlert className="w-4 h-4" />
            Strikes: {strikes} / 3
          </div>
        </div>
      </div>
      
      {/* Question Card */}
      <div className="w-full max-w-4xl">
        <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
          <CardHeader className="bg-white p-8 md:p-12 pb-6 border-b border-slate-100">
            <CardTitle className="text-2xl md:text-3xl font-medium text-slate-800 leading-tight">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-slate-50/50 p-8 md:p-12 space-y-4">
            {currentQ.options.map((option: string) => (
              <div 
                key={option}
                onClick={() => setAnswers({...answers, [currentQ.id]: option})}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                  answers[currentQ.id] === option 
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <span className={`text-lg ${answers[currentQ.id] === option ? 'font-semibold' : 'text-slate-700'}`}>
                  {option}
                </span>
                {answers[currentQ.id] === option && (
                  <CheckCircle2 className="w-6 h-6 text-blue-600 animate-in zoom-in duration-200" />
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="bg-white p-8 border-t border-slate-100 flex justify-end">
            <Button 
              onClick={handleNext} 
              size="lg" 
              className="px-10 h-14 text-lg bg-slate-900 hover:bg-slate-800 rounded-xl"
              disabled={!answers[currentQ.id]}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// 4. SUCCESS VIEW
// ==========================================
interface SuccessViewProps {
  setView: (view: 'home' | 'apply' | 'test' | 'success' | 'recruiter') => void;
}

function SuccessView({ setView }: SuccessViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-green-600">Test Submitted Successfully!</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Thank you for completing the technical assessment. Our automated system is now evaluating your results. We will be in touch soon.
      </p>
      <Button onClick={() => setView('home')}>Return Home</Button>
    </div>
  );
}

// Helper function to highlight keywords in the resume text
const highlightKeywords = (text: string | null | undefined, keywords: string[]) => {
  if (!text) return <span className="text-slate-400 font-sans italic">No resume text available</span>;
  
  // Escape special regex characters
  const escapedKeywords = keywords
    .map(kw => kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .filter(Boolean);

  if (escapedKeywords.length === 0) return <span>{text}</span>;

  // Split on matches using word boundaries, case-insensitive
  const regex = new RegExp(`(\\b${escapedKeywords.join('\\b|\\b')}\\b)`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isMatch = keywords.some(kw => kw.toLowerCase() === part.toLowerCase());
    return isMatch ? (
      <mark key={i} className="bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-semibold border border-amber-300">
        {part}
      </mark>
    ) : (
      part
    );
  });
};

// ==========================================
// 5. RECRUITER VIEW
// ==========================================
interface RecruiterViewProps {
  setView: (view: 'home' | 'apply' | 'test' | 'success' | 'recruiter') => void;
}

function RecruiterView({ setView }: RecruiterViewProps) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({});

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/recruiter/candidates');
      const data = await res.json();
      const fetchedCandidates = data.candidates || [];
      setCandidates(fetchedCandidates);
      
      // Initialize notes state from candidate database notes
      const initialNotes: Record<string, string> = {};
      fetchedCandidates.forEach((c: any) => {
        if (c.recruiterNotes) {
          initialNotes[c.id] = c.recruiterNotes;
        }
      });
      setNotes(prev => ({ ...initialNotes, ...prev }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:3001/api/recruiter/candidates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchCandidates();
    } catch (error) {
      console.error(error);
    }
  };

  const saveCandidateNotes = async (id: string) => {
    setSavingNotes(prev => ({ ...prev, [id]: true }));
    try {
      await fetch(`http://localhost:3001/api/recruiter/candidates/${id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notes[id] ?? '' })
      });
      fetchCandidates();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingNotes(prev => ({ ...prev, [id]: false }));
    }
  };

  const exportCSV = () => {
    if (!candidates.length) return;
    
    const headers = ['Name', 'Email', 'Domain', 'Overall Score', 'Status', 'Notes'];
    const rows = candidates.map(c => [
      c.name, c.email, c.domain, c.overallScore || 'N/A', c.status, c.recruiterNotes || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'ai_recruiter_candidates.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.domain && c.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            onClick={() => setView('home')}
            className="flex items-center gap-2 font-bold text-xl text-slate-800 cursor-pointer"
          >
            <div className="bg-blue-600 p-1.5 rounded text-white"><Users className="w-5 h-5" /></div>
            AI Recruiter
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-9 bg-slate-100 border-none w-64 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={exportCSV} variant="outline" className="rounded-full shadow-sm">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Button onClick={() => setView('home')} variant="ghost" className="rounded-full">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">Total Applicants</div>
            <div className="text-3xl font-bold text-slate-900">{candidates.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">Shortlisted</div>
            <div className="text-3xl font-bold text-emerald-600">
              {candidates.filter(c => c.status === 'Shortlisted').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">Avg Score</div>
            <div className="text-3xl font-bold text-blue-600">
              {candidates.length ? (candidates.reduce((a,c) => a + (c.overallScore || 0), 0) / candidates.length).toFixed(1) : '0.0'}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Status Distribution
              </h3>
              {candidates.length > 0 ? (() => {
                const statusCounts = candidates.reduce((acc, c) => {
                  const s = c.status || 'Applied';
                  acc[s] = (acc[s] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const statusData = [
                  { label: 'Applied', count: statusCounts['Applied'] || 0, stroke: '#94a3b8', colorClass: 'bg-slate-400' },
                  { label: 'Tested', count: statusCounts['Tested'] || 0, stroke: '#60a5fa', colorClass: 'bg-blue-400' },
                  { label: 'Shortlisted', count: statusCounts['Shortlisted'] || 0, stroke: '#10b981', colorClass: 'bg-emerald-500' },
                  { label: 'Rejected', count: statusCounts['Rejected'] || 0, stroke: '#ef4444', colorClass: 'bg-red-500' },
                ].filter(d => d.count > 0);

                const total = statusData.reduce((sum, d) => sum + d.count, 0);
                const radius = 35;
                const circumference = 2 * Math.PI * radius;
                let accumLength = 0;

                return (
                  <div className="flex items-center gap-6 py-2">
                    {/* Donut SVG */}
                    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                      <svg width="112" height="112" viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                        {statusData.map((d) => {
                          const percentage = (d.count / total) * 100;
                          const strokeLength = (percentage / 100) * circumference;
                          const strokeDasharray = `${strokeLength} ${circumference}`;
                          const strokeDashoffset = circumference - accumLength;
                          accumLength += strokeLength;

                          return (
                            <circle
                              key={d.label}
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="transparent"
                              stroke={d.stroke}
                              strokeWidth="10"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className="transition-all duration-500"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xl font-extrabold text-slate-800">{total}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Total</span>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="flex-1 space-y-2">
                      {statusData.map((d) => (
                        <div key={d.label} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${d.colorClass}`} />
                            <span className="font-medium text-slate-600">{d.label}</span>
                          </div>
                          <span className="font-bold text-slate-800">{d.count} ({Math.round((d.count / total) * 100)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })() : (
                <div className="text-slate-400 text-sm py-8 text-center italic">No candidate status records available.</div>
              )}
            </div>
          </div>

          {/* Domains Applied */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Domains Applied
              </h3>
              {candidates.length > 0 ? (() => {
                const domainCounts = candidates.reduce((acc, c) => {
                  const d = c.domain || 'Unspecified';
                  acc[d] = (acc[d] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const maxCount = Math.max(...Object.values(domainCounts), 1);
                
                return (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {Object.entries(domainCounts).map(([domain, count]) => {
                      const pct = (count / maxCount) * 100;
                      return (
                        <div key={domain} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600">{domain}</span>
                            <span className="text-slate-800">{count}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })() : (
                <div className="text-slate-400 text-sm py-8 text-center italic">No domain candidate records available.</div>
              )}
            </div>
          </div>

          {/* Pass Rate Tracking */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Assessment Pass Rate
              </h3>
              {candidates.length > 0 ? (() => {
                const testTakers = candidates.filter(c => c.testCompleted);
                const passedTakers = testTakers.filter(c => (c.testScore || 0) >= 70);
                const passRate = testTakers.length ? (passedTakers.length / testTakers.length) * 100 : 0;
                
                const avgTestScore = testTakers.length 
                  ? (testTakers.reduce((sum, c) => sum + (c.testScore || 0), 0) / testTakers.length).toFixed(1) 
                  : '—';

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="text-3xl font-black text-slate-800">{passRate.toFixed(1)}%</div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pass Rate (Score ≥ 70)</div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl flex flex-col items-center">
                        <span className="text-xs font-bold">{passedTakers.length} / {testTakers.length}</span>
                        <span className="text-[9px] font-medium opacity-80">Passed Tests</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                        <div className="text-lg font-bold text-slate-800">{avgTestScore}</div>
                        <div className="text-[10px] text-slate-500">Avg Test Score</div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                        <div className="text-lg font-bold text-red-600">
                          {candidates.reduce((sum, c) => sum + (c.cheatStrikes || 0), 0)}
                        </div>
                        <div className="text-[10px] text-slate-500">Total Proct. Alerts</div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="text-slate-400 text-sm py-8 text-center italic">No assessment test activity recorded yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="py-4 font-semibold text-slate-700">Candidate Info</TableHead>
                <TableHead className="font-semibold text-slate-700">Target Role</TableHead>
                <TableHead className="font-semibold text-slate-700">Algorithmic Score</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-sm text-slate-500">{c.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {c.domain || 'Unspecified'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-lg text-slate-700">
                        {c.overallScore ? c.overallScore.toFixed(1) : '—'}
                      </div>
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${c.overallScore >= 70 ? 'bg-emerald-500' : c.overallScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                          style={{ width: `${Math.min(c.overallScore || 0, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`px-2 py-1 rounded-md ${c.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : c.status === 'Rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" className="border-emerald-200 hover:bg-emerald-50 text-emerald-700" onClick={() => updateStatus(c.id, 'Shortlisted')}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Shortlist
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50 text-red-700" onClick={() => updateStatus(c.id, 'Rejected')}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCandidates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-300 mb-2" />
                      No candidates found matching your criteria.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Detailed Breakdown Accordions */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Detailed Breakdowns</h2>
          {filteredCandidates.map((c) => (
            <div key={`details-${c.id}`} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 data-[state=open]:bg-slate-50 text-left">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-slate-800">{c.name}</div>
                      <Badge variant="outline" className="font-normal text-slate-500 bg-white">Full Analysis</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-sm font-medium text-slate-500 mb-1">Resume Score</div>
                        <div className="text-2xl font-bold text-slate-800">{c.resumeScore?.toFixed(1) || '—'}</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-sm font-medium text-slate-500 mb-1">GitHub Score</div>
                        <div className="text-2xl font-bold text-slate-800">{c.githubScore?.toFixed(1) || '—'}</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-sm font-medium text-slate-500 mb-1">Test Score</div>
                        <div className="text-2xl font-bold text-slate-800">{c.testScore?.toFixed(1) || '—'}</div>
                      </div>
                      <div className={`p-4 rounded-xl border ${c.cheatStrikes > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className={`text-sm font-medium mb-1 ${c.cheatStrikes > 0 ? 'text-red-500' : 'text-slate-500'}`}>Cheat Strikes</div>
                        <div className={`text-2xl font-bold ${c.cheatStrikes > 0 ? 'text-red-700' : 'text-slate-800'}`}>{c.cheatStrikes || 0}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Security Log */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-400" />
                          Security Log
                        </h4>
                        <div className="bg-slate-900 rounded-xl p-4 h-56 overflow-auto font-mono text-xs">
                          {c.cheatLog && JSON.parse(c.cheatLog).length > 0 ? (
                            <ul className="space-y-2">
                              {JSON.parse(c.cheatLog).map((log: any, i: number) => (
                                <li key={i} className="text-red-400 border-b border-slate-800 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                                  <span className="text-slate-500 block mb-1">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                  ⚠️ {log.type}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-emerald-400 flex items-center h-full justify-center">No security incidents recorded. Clean run.</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Skill Verification Matrix */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-slate-400" />
                          Skill Verification Matrix
                        </h4>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 h-56 overflow-auto">
                           {c.skillsMatchLog ? (
                             <div className="space-y-4">
                               <div>
                                 <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Verified (GitHub &amp; Resume)</div>
                                 <div className="flex flex-wrap gap-2">
                                   {JSON.parse(c.skillsMatchLog).matched?.map((skill: string) => (
                                     <Badge key={skill} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">{skill}</Badge>
                                   )) || <span className="text-xs text-slate-400">None</span>}
                                 </div>
                               </div>
                               <div>
                                 <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Missing from Resume</div>
                                 <div className="flex flex-wrap gap-2">
                                   {JSON.parse(c.skillsMatchLog).missing?.map((skill: string) => (
                                     <Badge key={skill} variant="outline" className="text-slate-500 border-slate-300 bg-white">{skill}</Badge>
                                   )) || <span className="text-xs text-slate-400">None</span>}
                                 </div>
                               </div>
                             </div>
                           ) : (
                             <div className="text-slate-400 text-sm h-full flex items-center justify-center italic">No verification data available.</div>
                           )}
                        </div>
                      </div>

                      {/* GitHub Profile & Heatmap */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <Github className="w-4 h-4 text-slate-400" />
                          GitHub Profile &amp; Commit Activity
                        </h4>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-56 overflow-auto space-y-4">
                          {c.githubRawData ? (() => {
                            const gh = JSON.parse(c.githubRawData);
                            const languages = gh.languages || {};
                            const langEntries = Object.entries(languages) as [string, number][];
                            const activity = gh.monthlyActivity || {};
                            return (
                              <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="bg-white rounded-lg p-2 border border-slate-200 text-center">
                                    <div className="text-lg font-black text-slate-800">{gh.public_repos ?? '—'}</div>
                                    <div className="text-[10px] text-slate-500 font-medium">Public Repos</div>
                                  </div>
                                  <div className="bg-white rounded-lg p-2 border border-slate-200 text-center">
                                    <div className="text-lg font-black text-amber-600">{gh.stars ?? '—'}</div>
                                    <div className="text-[10px] text-slate-500 font-medium">⭐ Stars</div>
                                  </div>
                                  <div className="bg-white rounded-lg p-2 border border-slate-200 text-center">
                                    <div className="text-lg font-black text-emerald-600">{gh.recentCommitsScore ?? '—'}</div>
                                    <div className="text-[10px] text-slate-500 font-medium">Recent Commits</div>
                                  </div>
                                </div>
                                
                                {langEntries.length > 0 && (
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Languages Used</div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {langEntries
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 10)
                                        .map(([lang, count]) => (
                                          <span key={lang} className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-semibold">
                                            {lang} <span className="opacity-60 font-normal">×{count}</span>
                                          </span>
                                        ))}
                                    </div>
                                  </div>
                                )}

                                {/* Commit activity heatmap */}
                                {activity && Object.keys(activity).length > 0 && (
                                  <div className="pt-2 border-t border-slate-200">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                      Commit Activity (Last 12 Months)
                                    </div>
                                    <div className="flex gap-1.5 items-end justify-between bg-white p-2.5 rounded-lg border border-slate-100">
                                      {Object.entries(activity).map(([month, count]: any) => {
                                        const countNum = Number(count) || 0;
                                        let color = 'bg-slate-100 hover:bg-slate-200';
                                        if (countNum > 0 && countNum <= 2) color = 'bg-emerald-100 hover:bg-emerald-200';
                                        else if (countNum > 2 && countNum <= 5) color = 'bg-emerald-300 hover:bg-emerald-400';
                                        else if (countNum > 5 && countNum <= 10) color = 'bg-emerald-500 hover:bg-emerald-600';
                                        else if (countNum > 10) color = 'bg-emerald-700 hover:bg-emerald-800';

                                        const date = new Date(month + '-02');
                                        const label = date.toLocaleDateString('default', { month: 'short' });
                                        return (
                                          <div key={month} className="flex-1 flex flex-col items-center gap-1 group relative">
                                            <div className={`w-full aspect-square rounded-sm ${color} transition-colors duration-200 cursor-pointer`} />
                                            <span className="text-[9px] text-slate-400 font-mono scale-90 origin-center">{label}</span>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
                                              {countNum} repo push{countNum === 1 ? '' : 'es'} in {label} {date.getFullYear()}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })() : (
                            <div className="text-slate-400 text-sm h-full flex items-center justify-center italic">No GitHub data available.</div>
                          )}
                        </div>
                      </div>

                      {/* LinkedIn Scraped Details */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-slate-400" />
                          LinkedIn Profile Data
                        </h4>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 h-56 overflow-auto">
                          {c.linkedInRawData ? (() => {
                            const li = JSON.parse(c.linkedInRawData);
                            const data = li.data || li;
                            return (
                              <div className="space-y-3">
                                {data.headline && (
                                  <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Headline</div>
                                    <div className="text-sm font-semibold text-slate-800 bg-white rounded-lg p-2.5 border border-slate-200">{data.headline}</div>
                                  </div>
                                )}
                                {data.summary && (
                                  <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Summary</div>
                                    <div className="text-sm text-slate-700 bg-white rounded-lg p-2.5 border border-slate-200 leading-relaxed">{data.summary}</div>
                                  </div>
                                )}
                                {!data.headline && !data.summary && (
                                  <div className="text-slate-400 text-sm flex items-center h-full justify-center italic">No LinkedIn details extracted.</div>
                                )}
                                {c.linkedInUrl && (
                                  <a href={c.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1 font-semibold">
                                    <Linkedin className="w-3 h-3" /> View Profile
                                  </a>
                                )}
                              </div>
                            );
                          })() : (
                            <div className="text-slate-400 text-sm h-full flex items-center justify-center italic">No LinkedIn data available.</div>
                          )}
                        </div>
                      </div>

                      {/* Resume Keyword Heatmap - Full Width */}
                      <div className="md:col-span-2 mt-2">
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <StickyNote className="w-4 h-4 text-slate-400" />
                          Resume Keyword Match Heatmap ({c.domain || 'General'} Role)
                        </h4>
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                          {c.resumeText ? (() => {
                            const domain = c.domain || 'General CS';
                            const keywords = DOMAIN_KEYWORDS[domain] || DOMAIN_KEYWORDS['General CS'];
                            const resumeLower = c.resumeText.toLowerCase();
                            
                            const matchedKeywords = keywords.filter(kw => 
                              resumeLower.includes(kw.toLowerCase())
                            );

                            return (
                              <div className="space-y-4">
                                <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-200">
                                  {keywords.map(kw => {
                                    const isMatched = matchedKeywords.includes(kw);
                                    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                                    const regex = new RegExp(`\\b${escapedKw}\\b`, 'gi');
                                    const occurrences = (c.resumeText.match(regex) || []).length;

                                    return (
                                      <div
                                        key={kw}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                          isMatched 
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm' 
                                            : 'bg-white text-slate-400 border-slate-200'
                                        }`}
                                      >
                                        <span>{kw}</span>
                                        {isMatched && (
                                          <span className="bg-emerald-250 text-emerald-900 px-1.5 py-0.25 rounded-full text-[10px] font-bold">
                                            {occurrences}×
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="space-y-2">
                                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume Text Highlight Viewer</div>
                                  <div className="bg-white rounded-lg p-4 border border-slate-200 max-h-60 overflow-auto text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed">
                                    {highlightKeywords(c.resumeText, keywords)}
                                  </div>
                                </div>
                              </div>
                            );
                          })() : (
                            <div className="text-slate-400 text-sm h-24 flex items-center justify-center italic">No resume text available for analysis.</div>
                          )}
                        </div>
                      </div>

                      {/* Recruiter Notes - Full Width */}
                      <div className="md:col-span-2 border-t border-slate-200 pt-4 mt-2">
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <StickyNote className="w-4 h-4 text-indigo-500 animate-pulse" />
                          Recruiter Evaluation Notes
                        </h4>
                        <div className="flex gap-3 items-start">
                          <textarea
                            rows={3}
                            className="flex-1 min-h-[80px] text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white transition-all resize-none shadow-inner text-slate-800"
                            placeholder="Add evaluation summary, interview notes, or screening feedback..."
                            value={notes[c.id] ?? ''}
                            onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                          />
                          <Button 
                            className="px-4 py-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow"
                            disabled={savingNotes[c.id]}
                            onClick={() => saveCandidateNotes(c.id)}
                          >
                            {savingNotes[c.id] ? 'Saving...' : 'Save Notes'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function SinglePageApp() {
  const [currentView, setCurrentView] = useState<'home' | 'apply' | 'test' | 'success' | 'recruiter'>('home');
  const [candidateData, setCandidateData] = useState<{ id: string; domain: string } | null>(null);

  switch (currentView) {
    case 'home':
      return <HomeView setView={setCurrentView} />;
    case 'apply':
      return <ApplyView setView={setCurrentView} setCandidateData={setCandidateData} />;
    case 'test':
      return <TestView setView={setCurrentView} candidateData={candidateData} />;
    case 'success':
      return <SuccessView setView={setCurrentView} />;
    case 'recruiter':
      return <RecruiterView setView={setCurrentView} />;
    default:
      return <HomeView setView={setCurrentView} />;
  }
}
