'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Loader2, UploadCloud, 
  Github, Linkedin, User, AlertTriangle, Clock, ShieldAlert, 
  CheckCircle2, XCircle, Sun, Moon, LogOut, FileText, Briefcase
} from 'lucide-react';
import { API_BASE } from '@/lib/api';
import { getSession, clearSession, Session } from '@/lib/session';

export default function CandidateDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [activeAssessmentApp, setActiveAssessmentApp] = useState<any | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    async function init() {
      const sess = await getSession();
      if (!sess || sess.role !== 'candidate') {
        router.push('/login?role=candidate');
        return;
      }
      setSession(sess);
      await Promise.all([
        fetchJobs(),
        fetchApplications(sess.id)
      ]);
      setLoading(false);
    }
    init();
  }, [router]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const fetchApplications = async (candidateId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/applications/candidate/${candidateId}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = async () => {
    await clearSession();
    router.push('/login');
  };

  const handleApply = async (jobId: string) => {
    if (!session) return;
    setApplyingJobId(jobId);
    try {
      // 1. Create JobApplication
      const applyRes = await fetch(`${API_BASE}/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: session.id }),
        credentials: 'include'
      });
      if (!applyRes.ok) throw new Error('Failed to apply');

      // 2. Trigger Intake/Evaluation for this job
      const intakeRes = await fetch(`${API_BASE}/api/candidates/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: session.id, jobId }),
        credentials: 'include'
      });
      if (!intakeRes.ok) throw new Error('Failed to evaluate profile');

      await fetchApplications(session.id);
      setActiveTab('applications');
    } catch (err) {
      console.error(err);
      alert('Error applying for job.');
    } finally {
      setApplyingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-900 dark:text-slate-50 bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading Workspace...</p>
      </div>
    );
  }

  // Active Assessment View
  if (activeAssessmentApp) {
    return (
      <div className="min-h-screen relative bg-background text-slate-900 dark:text-slate-100 flex flex-col pt-8">
        <AssessmentFlow 
          application={activeAssessmentApp} 
          onSuccess={async () => {
            setActiveAssessmentApp(null);
            if (session) await fetchApplications(session.id);
          }}
          onCancel={() => setActiveAssessmentApp(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-850 dark:text-white">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            AI Candidate Portal
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                {session?.name ? session.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">
                {session?.name}
              </span>
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition-all cursor-pointer">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-xl">
              <LogOut className="w-4 h-4 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        
        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'jobs' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Briefcase className="w-4 h-4 inline-block mr-2" /> Job Board
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'applications' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <FileText className="w-4 h-4 inline-block" /> My Applications
            {applications.length > 0 && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 py-0.5 px-2 rounded-full text-[10px]">{applications.length}</span>}
          </button>
        </div>

        {/* Job Board Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Open Positions
            </h2>
            {jobs.length === 0 ? (
              <p className="text-slate-500">No open jobs at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map(job => {
                  const hasApplied = applications.some(app => app.jobId === job.id);
                  return (
                    <Card key={job.id} className="border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                        <CardDescription className="font-semibold text-indigo-500">{job.companyName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">{job.description}</p>
                        <div className="flex gap-2 text-xs font-bold text-slate-500">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{job.salary}</span>
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{job.domain}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {hasApplied ? (
                          <Button disabled variant="outline" className="w-full rounded-xl border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Applied
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleApply(job.id)} 
                            disabled={applyingJobId === job.id}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
                          >
                            {applyingJobId === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Now'}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* My Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">My Applications</h2>
            {applications.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-transparent shadow-none text-center p-12">
                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">You haven't applied to any jobs yet.</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {applications.map(app => (
                  <Card key={app.id} className="border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex flex-col md:flex-row border-b border-slate-100 dark:border-slate-800">
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold">{app.job.title}</h3>
                            <p className="text-slate-500 font-medium">{app.job.companyName}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            app.status === 'Applied' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                            app.status === 'Evaluated' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            app.status === 'Tested' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                            app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      
                      {/* Actions/Scores Column */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 md:w-64 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center gap-3">
                        {!app.testCompleted ? (
                          <>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Action Required</p>
                            <Button 
                              onClick={() => setActiveAssessmentApp(app)}
                              className="w-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20"
                            >
                              <ShieldAlert className="w-4 h-4 mr-2" /> Start Test
                            </Button>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Final Score</p>
                            <div className="text-3xl font-black text-emerald-500">{app.overallScore?.toFixed(0)}%</div>
                            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => {/* Could expand to show details */}}>
                              View Details
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// ASSESSMENT FLOW CHILD COMPONENT (PROCTORED SUB-VIEW)
// ==========================================
interface AssessmentProps {
  application: any;
  onSuccess: () => void;
  onCancel: () => void;
}

function AssessmentFlow({ application, onSuccess, onCancel }: AssessmentProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); 
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Anti-Cheat State
  const [strikes, setStrikes] = useState(0);
  const [cheatLog, setCheatLog] = useState<{type: string, timestamp: string}[]>([]);

  // Replay & Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const codeReplayRef = useRef<{ time: number; code: string; questionId: string }[]>([]);
  const testStartTimeRef = useRef<number>(0);

  const domain = application.job.domain || 'General CS';
  const applicationId = application.id;

  // Fetch Questions
  useEffect(() => {
    fetch(`${API_BASE}/api/test/generate/${applicationId}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [applicationId]);

  const handleSubmitTest = useCallback(async (finalStrikes: number) => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(()=>{});
    }

    // Stop recording and process video
    let videoBase64 = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      // Wait briefly for ondataavailable to trigger
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (videoChunksRef.current.length > 0) {
      const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      videoBase64 = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }

    try {
      const res = await fetch(`${API_BASE}/api/test/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          answers,
          cheatStrikes: finalStrikes,
          cheatLog,
          codeReplayData: codeReplayRef.current,
          videoRecording: videoBase64
        })
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert('Error submitting test.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting test.');
    }
  }, [applicationId, answers, cheatLog, onSuccess]);

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

  // Anti-Cheat Proctor Monitors
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

  // Question Timer
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(120);
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
      // 1. Request Camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      
      // 2. Setup Recording
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.start(1000); // chunk every second
      mediaRecorderRef.current = mediaRecorder;

      // 3. Setup Video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 4. Request Fullscreen
      await document.documentElement.requestFullscreen();
      
      testStartTimeRef.current = Date.now();
      setStarted(true);
    } catch (err) {
      console.warn("Test setup failed", err);
      alert("Camera permissions are required to start the test. Please allow camera access and try again.");
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = e.target.value;
    const currentQ = questions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [currentQ.id]: code }));
    
    // Log keystroke snapshot
    codeReplayRef.current.push({
      time: Date.now() - testStartTimeRef.current,
      code,
      questionId: currentQ.id
    });
  };

  if (loading) return (
    <div className="w-full flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-white/10 rounded-2xl shadow">
      <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      <p className="mt-4 text-sm font-semibold text-slate-500">Loading Assessment Environment...</p>
    </div>
  );

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto w-full px-4">
        <Button variant="ghost" className="mb-4" onClick={onCancel}>← Back to Dashboard</Button>
        <Card className="w-full bg-white dark:bg-slate-900 border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-6 border-b border-white/10/80">
            <div className="mx-auto bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">Proctored Assessment Setup</CardTitle>
            <CardDescription className="text-red-500 font-bold mt-2">
              Active Proctoring Sandboxing Environment for {domain}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-350">
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-150 dark:border-slate-800/80">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs">Camera access is compulsory. Ensure your face is visible.</p>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-150 dark:border-slate-800/80">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs">Copying, pasting, or right-clicking is disabled.</p>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-150 dark:border-slate-800/80">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs">Developer Tools activation monitors are active.</p>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/50">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-700 dark:text-red-400">3 strikes result in automatic test failure.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 dark:bg-slate-950/20 pt-6 rounded-b-xl border-t border-slate-100 dark:border-slate-850/50 flex flex-col gap-4">
            <Button onClick={startTest} size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-indigo-500/20">
              Allow Camera &amp; Enter Fullscreen Environment
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  if (!currentQ) {
    return (
      <div className="w-full p-8 text-center text-red-550">
        <p>No questions generated for domain: {domain}. Please contact recruitment.</p>
        <Button onClick={onCancel} className="mt-4">Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 space-y-4">
      {/* HUD Timer and Strikes stats */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Progress</div>
          <div className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-800 h-2 w-full sm:w-32 md:w-48 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-650 h-full transition-all duration-500" 
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-slate-650 dark:text-slate-400 font-bold text-xs">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
        
        <div className="flex gap-4 items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Clock className={`w-4.5 h-4.5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-lg font-mono font-black ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            strikes > 0 
              ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' 
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            Strikes: {strikes} / 3
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-12">
        {/* Main Question & Editor Area */}
        <div className="md:col-span-3">
          <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 h-full flex flex-col">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-950/20 p-5 border-b border-slate-200 dark:border-slate-850/50">
              <CardTitle className="text-lg font-bold text-slate-850 dark:text-white leading-normal">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 relative min-h-[300px]">
              <textarea 
                className="w-full h-full min-h-[400px] p-6 bg-slate-950 text-emerald-400 font-mono text-sm focus:outline-none resize-none"
                placeholder="// Write your code solution here..."
                value={answers[currentQ.id] || ''}
                onChange={handleCodeChange}
                spellCheck={false}
              />
            </CardContent>
            
            <CardFooter className="bg-slate-50/30 dark:bg-slate-950/10 p-5 border-t border-slate-200 dark:border-slate-850/50 flex justify-end">
              <Button 
                onClick={handleNext} 
                disabled={!answers[currentQ.id]}
                className="px-8 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold h-11 rounded-xl shadow-md transition-all"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Proctor Sidebar */}
        <div className="md:col-span-1">
          <Card className="border-0 shadow-lg overflow-hidden bg-black border border-white/10 sticky top-4">
            <div className="relative aspect-video bg-slate-900">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-red-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                REC
              </div>
            </div>
            <div className="p-4 bg-slate-900 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400 font-bold">Proctoring Active</p>
              <p className="text-[10px] text-slate-500 mt-1">Live recording and keystroke analysis enabled.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
