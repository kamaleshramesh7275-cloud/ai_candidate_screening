'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Loader2, UploadCloud, 
  Github, Linkedin, User, AlertTriangle, Clock, ShieldAlert, 
  CheckCircle2, XCircle, Sun, Moon, LogOut, FileText 
} from 'lucide-react';
import { API_BASE } from '@/lib/api';

export default function CandidateDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  
  // Sub-view: 'intake' | 'review' | 'test' | 'success'
  const [viewState, setViewState] = useState<'intake' | 'review' | 'test' | 'success'>('intake');
  
  // Post-test active tab
  const [activeTab, setActiveTab] = useState<'scores' | 'interviews' | 'profile' | 'activity'>('scores');

  // Intake Form fields
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [formData, setFormData] = useState({
    linkedInUrl: '',
    githubUrl: '',
    domain: '',
  });
  const [resume, setResume] = useState<File | null>(null);

  // Sync Theme and Session on load
  useEffect(() => {
    // 1. Sync theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // 2. Sync Session - try new key first, fall back to old
    const activeSession = localStorage.getItem('candidate_session') || localStorage.getItem('user_session');
    if (!activeSession) {
      router.push('/login?role=candidate');
      return;
    }
    
    const parsed = JSON.parse(activeSession);
    if (parsed.role !== 'candidate') {
      router.push('/login?role=candidate');
      return;
    }
    
    setSession(parsed);
    fetchCandidateProfile(parsed.id);
    fetchInterviews(parsed.id);
  }, [router]);

  const fetchInterviews = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/interviews/candidate/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInterviews(data.interviews || []);
      }
    } catch (err) {
      console.error('Failed to fetch interviews', err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const fetchCandidateProfile = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/candidate/profile/${id}`);
      if (!res.ok) {
        throw new Error('Profile not found.');
      }
      const data = await res.json();
      const profile = data.candidate;
      setCandidate(profile);

      // Determine viewState based on profile fields
      if (!profile.domain || !profile.resumeScore) {
        setViewState('intake');
      } else if (profile.testCompleted) {
        setViewState('success');
      } else {
        setViewState('review');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    router.push('/login');
  };

  // Submitting Intake Profile
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain || !session) return;
    setIntakeLoading(true);

    const data = new FormData();
    data.append('name', session.name);
    data.append('email', session.email);
    data.append('linkedInUrl', formData.linkedInUrl);
    data.append('githubUrl', formData.githubUrl);
    data.append('domain', formData.domain);
    if (resume) {
      data.append('resume', resume);
    }

    try {
      const res = await fetch(`${API_BASE}/api/candidates/intake`, {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Profile intake failed.');
      }

      // Refresh candidate profile
      await fetchCandidateProfile(session.id);
    } catch (error) {
      console.error(error);
      alert('Error updating application. Please check input parameters and try again.');
    } finally {
      setIntakeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center text-slate-900 dark:text-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-650" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading Candidate Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* HUD Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-850 dark:text-white">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            AI Recruiter
          </div>
          
          <div className="flex items-center gap-4">
            {candidate && viewState !== 'test' && (
              <div className="hidden md:flex items-center gap-2 mr-4 text-xs font-semibold">
                <span className={`px-2 py-1 rounded-full ${
                  viewState === 'intake' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-500'
                }`}>1. Intake</span>
                <ArrowRight className="w-3 h-3 text-slate-300" />
                <span className={`px-2 py-1 rounded-full ${
                  viewState === 'review' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-500'
                }`}>2. Review</span>
                <ArrowRight className="w-3 h-3 text-slate-300" />
                <span className={`px-2 py-1 rounded-full ${
                  viewState === 'success' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-500'
                }`}>3. Results</span>
              </div>
            )}

            {candidate && candidate.status && viewState === 'success' && (
              <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                candidate.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' :
                candidate.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' :
                'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
              }`}>
                {candidate.status}
              </span>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                {session?.name ? session.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">
                {session?.name}
              </span>
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition-all cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm"
              className="border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col justify-center items-center">
        
        {/* VIEW 1: APPLICATION INTAKE FORM */}
        {viewState === 'intake' && (
          <Card className="w-full border-slate-250 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            {/* Welcome Banner */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 px-6 py-4 border-b border-indigo-100 dark:border-indigo-900/30 flex items-start gap-4">
               <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                  <span className="text-2xl">👋</span>
               </div>
               <div>
                 <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Welcome, {session?.name}!</h3>
                 <p className="text-sm text-indigo-700/80 dark:text-indigo-400/80 mt-0.5">Let's build your AI-verified credential profile. This should only take a minute.</p>
               </div>
            </div>

            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-2xl font-extrabold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-650" />
                Talent Application Intake
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Please upload your resume and connect your profiles. Our logic scoring engine uses these to build a skills matrix before technical assessment.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleIntakeSubmit}>
              <CardContent className="space-y-5">
                
                <div className="space-y-1.5">
                  <Label htmlFor="domain" className="text-xs font-bold text-slate-300 uppercase tracking-wide">Target Role / Domain</Label>
                  <Select required onValueChange={(value: string | null) => setFormData({...formData, domain: value || ''})}>
                    <SelectTrigger className="bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 border-slate-250 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 h-11 text-slate-800 dark:text-slate-200">
                      <SelectValue placeholder="Select your expertise area" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 dark:border-slate-800">
                      <SelectItem value="Frontend">Frontend Developer</SelectItem>
                      <SelectItem value="Backend">Backend Developer</SelectItem>
                      <SelectItem value="DevOps">DevOps Engineer</SelectItem>
                      <SelectItem value="ML">Machine Learning Engineer</SelectItem>
                      <SelectItem value="General CS">General Software Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="linkedin" className="text-xs font-bold text-slate-300 uppercase tracking-wide">LinkedIn URL</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <Input 
                        id="linkedin" 
                        type="url" 
                        className="pl-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-250 dark:border-slate-800 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedInUrl}
                        onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="github" className="text-xs font-bold text-slate-300 uppercase tracking-wide">GitHub URL</Label>
                    <div className="relative">
                      <Github className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <Input 
                        id="github" 
                        type="url" 
                        className="pl-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-250 dark:border-slate-800 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500"
                        placeholder="https://github.com/username"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <Label htmlFor="resume" className="text-xs font-bold text-slate-300 uppercase tracking-wide">Upload Resume (PDF only)</Label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-750 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-white/5 hover:bg-slate-100/50 dark:hover:bg-slate-950/70 transition-colors relative cursor-pointer">
                    <Input 
                      id="resume" 
                      type="file" 
                      accept=".pdf"
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                    />
                    <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                    <p className="text-sm font-semibold text-slate-300">
                      {resume ? resume.name : "Click or drag resume file to upload"}
                    </p>
                    {!resume && <p className="text-xs text-muted-foreground mt-1">Maximum file size 5MB</p>}
                  </div>
                </div>

              </CardContent>

              {/* Tips Panel */}
              <div className="px-6 py-4 mx-6 mt-2 mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  What happens next?
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Your resume will be parsed for skills matching the selected domain.</li>
                  <li>GitHub and LinkedIn profiles will be verified and scored.</li>
                  <li>If eligible, you'll be invited to a short proctored assessment.</li>
                </ul>
              </div>

              <CardFooter className="bg-slate-50/50 dark:bg-slate-950/20 pt-4 px-6 pb-6 mt-4 border-t border-slate-100 dark:border-slate-800/50">
                <Button 
                  type="submit" 
                  disabled={intakeLoading || !formData.domain}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 h-12 rounded-xl transition-all" 
                >
                  {intakeLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Resume & Verification...</>
                  ) : (
                    'Submit & Build Credentials Profile'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* VIEW 2: INITIAL SCORE REVIEWS & TEST INVITATION */}
        {viewState === 'review' && candidate && (
          <div className="w-full space-y-6">
            
            {/* Header info */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Application Verified
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your intake profile has been processed by our algorithmic indexing engine. Below are your initial domain match scores.
              </p>
            </div>

            {/* Score Grid - Animated Rings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Resume Score Ring */}
              <Card className="border-white/10 bg-white dark:bg-slate-900 shadow-md flex flex-col items-center p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="w-28 h-28 relative mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-slate-800" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-blue-500 transition-all duration-1000 ease-out" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (candidate.resumeScore || 0)) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black text-slate-800 dark:text-white">{candidate.resumeScore?.toFixed(0) || '0'}%</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wide text-sm">
                  <FileText className="w-4 h-4 text-blue-500" /> Resume Score
                </h3>
                <p className="text-xs text-center text-slate-500 mt-2 leading-relaxed">Domain keywords and structural analysis verified.</p>
              </Card>

              {/* GitHub Score Ring */}
              <Card className="border-white/10 bg-white dark:bg-slate-900 shadow-md flex flex-col items-center p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="w-28 h-28 relative mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-slate-800" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-purple-500 transition-all duration-1000 ease-out" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (candidate.githubScore || 0)) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black text-slate-800 dark:text-white">{candidate.githubScore?.toFixed(0) || '0'}%</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wide text-sm">
                  <Github className="w-4 h-4 text-purple-500" /> GitHub Score
                </h3>
                <p className="text-xs text-center text-slate-500 mt-2 leading-relaxed">Based on repository activity and contribution graph.</p>
              </Card>

              {/* LinkedIn Score Ring */}
              <Card className="border-white/10 bg-white dark:bg-slate-900 shadow-md flex flex-col items-center p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="w-28 h-28 relative mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-slate-800" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-indigo-500 transition-all duration-1000 ease-out" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (candidate.linkedInScore || 0)) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black text-slate-800 dark:text-white">{candidate.linkedInScore?.toFixed(0) || '0'}%</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wide text-sm">
                  <Linkedin className="w-4 h-4 text-indigo-500" /> LinkedIn Score
                </h3>
                <p className="text-xs text-center text-slate-500 mt-2 leading-relaxed">Professional history and connections indexed.</p>
              </Card>
            </div>

            {/* Skills Matrix and Data Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
              
              {/* Skills Matrix */}
              <Card className="border-white/10 bg-white dark:bg-slate-900 shadow-md">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
                  <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" /> Skills Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skillsMatchLog ? (
                      (() => {
                        try {
                          const skills = JSON.parse(candidate.skillsMatchLog);
                          return Object.entries(skills).map(([skill, found]: any) => (
                            <div key={skill} className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                              found 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                                : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                            }`}>
                              {found ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 opacity-50" />}
                              {skill}
                            </div>
                          ));
                        } catch(e) {
                          return <p className="text-sm text-slate-500">Skills data unavailable.</p>;
                        }
                      })()
                    ) : (
                      <p className="text-sm text-slate-500">Processing skills matrix...</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* GitHub Breakdown */}
              <Card className="border-white/10 bg-white dark:bg-slate-900 shadow-md">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
                  <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" /> GitHub Activity Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                   {candidate.githubRawData ? (
                      (() => {
                        try {
                          const data = JSON.parse(candidate.githubRawData);
                          return (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                                <div className="text-2xl font-black text-slate-800 dark:text-white">{data.public_repos || 0}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Public Repos</div>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                                <div className="text-2xl font-black text-slate-800 dark:text-white">{data.followers || 0}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Followers</div>
                              </div>
                              {data.topLanguages && (
                                <div className="col-span-2 mt-2">
                                  <div className="text-xs font-bold text-slate-500 mb-2">Detected Languages:</div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {data.topLanguages.map((lang: string) => (
                                      <span key={lang} className="px-2 py-0.5 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs border border-purple-100 dark:border-purple-800">
                                        {lang}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        } catch(e) {
                          return <p className="text-sm text-slate-500">GitHub data unavailable.</p>;
                        }
                      })()
                    ) : (
                      <p className="text-sm text-slate-500">GitHub data not fully synced.</p>
                    )}
                </CardContent>
              </Card>

            </div>

            {/* Test Invite Proctored Panel */}
            <Card className="border-white/10 bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden mt-6">
              <div className="h-1.5 w-full bg-red-500"></div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5.5 h-5.5 text-red-500 animate-pulse" />
                  Coding Assessment Invitation
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  You are required to take a short proctored assessment for {candidate.domain} to finalize your scores.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-3.5 text-slate-650 dark:text-slate-350">
                <div className="flex gap-3 items-start p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    This test runs in a <strong>strict proctored sandbox</strong>. Opening Developer Tools, exiting fullscreen mode, blurring the browser window, or copy/pasting will record security violations. 3 violations automatically terminate the test.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 dark:bg-slate-950/25 border-t border-slate-100 dark:border-slate-850/50 pt-4 px-6 pb-6">
                <Button 
                  onClick={() => setViewState('test')}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold h-12 shadow-lg shadow-red-550/20 rounded-xl transition-all"
                >
                  Start Assessment Environment
                </Button>
              </CardFooter>
            </Card>

          </div>
        )}

        {/* VIEW 3: ACTIVE TEST PROCTORING ENVIRONMENT */}
        {viewState === 'test' && candidate && (
          <AssessmentFlow 
            candidate={candidate} 
            onSuccess={() => fetchCandidateProfile(session.id)} 
          />
        )}

        {/* VIEW 4: ASSESSMENT COMPLETED SUCCESS VIEW (Tabbed Interface) */}
        {viewState === 'success' && candidate && (
          <div className="w-full space-y-6 max-w-3xl mx-auto">
            
            {/* Success Hero Banner */}
            <Card className="w-full border-white/10 shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300">
              <div className={`h-2 w-full ${
                candidate.status === 'Shortlisted' ? 'bg-emerald-500' :
                candidate.status === 'Rejected' ? 'bg-red-500' :
                'bg-indigo-500'
              }`}></div>
              <CardHeader className="text-center pb-6 pt-8">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  candidate.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20' :
                  candidate.status === 'Rejected' ? 'bg-red-50 text-red-500 dark:bg-red-950/20' :
                  'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/20'
                }`}>
                  {candidate.status === 'Shortlisted' ? <CheckCircle2 className="w-10 h-10" /> :
                   candidate.status === 'Rejected' ? <XCircle className="w-10 h-10" /> :
                   <Activity className="w-10 h-10" />}
                </div>
                <CardTitle className="text-4xl font-black text-slate-800 dark:text-white">
                  {candidate.status === 'Shortlisted' ? 'You made the shortlist!' :
                   candidate.status === 'Rejected' ? 'Application Closed' :
                   'Assessment Under Review'}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 mt-3 text-base max-w-lg mx-auto leading-relaxed">
                  {candidate.status === 'Shortlisted' ? 'Congratulations! Your combined profile and test scores exceed our technical bar. A recruiter will be in touch shortly.' :
                   candidate.status === 'Rejected' ? 'Thank you for your time. Unfortunately, your technical profile did not meet the required threshold for this role.' :
                   'Your test has been automatically graded and your profile is locked. Recruiters are currently reviewing your full technical packet.'}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Tabbed Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 w-full overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('scores')}
                className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'scores' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                📊 Score Breakdown
              </button>
              <button 
                onClick={() => setActiveTab('interviews')}
                className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'interviews' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                📅 Interviews {interviews.length > 0 && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 py-0.5 px-2 rounded-full text-[10px]">{interviews.length}</span>}
              </button>
              <button 
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                📝 Application Journey
              </button>
            </div>

            {/* Tab Contents */}
            
            {activeTab === 'scores' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="border-white/10 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
                  <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/50">
                    <CardTitle className="text-lg text-slate-800 dark:text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-indigo-500" /> Detailed Score Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-700 dark:text-slate-300">Resume Match</span>
                        <span className="text-blue-500">{candidate.resumeScore?.toFixed(1) || '0'}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${candidate.resumeScore || 0}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-700 dark:text-slate-300">GitHub Activity</span>
                        <span className="text-purple-500">{candidate.githubScore?.toFixed(1) || '0'}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all duration-1000 delay-100" style={{ width: `${candidate.githubScore || 0}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-700 dark:text-slate-300">LinkedIn Profile</span>
                        <span className="text-indigo-500">{candidate.linkedInScore?.toFixed(1) || '0'}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 delay-200" style={{ width: `${candidate.linkedInScore || 0}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 relative">
                      <div className="flex justify-between text-base font-black">
                        <span className="text-slate-800 dark:text-white flex items-center gap-2">
                          Proctored Test Score
                        </span>
                        <span className="text-emerald-500">{candidate.testScore?.toFixed(1) || '0'}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 delay-300" style={{ width: `${candidate.testScore || 0}%` }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'interviews' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {interviews.length === 0 ? (
                  <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-transparent shadow-none text-center p-12">
                    <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No interviews scheduled yet.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">If shortlisted, recruiters will schedule interviews here.</p>
                  </Card>
                ) : (
                  interviews.map(interview => {
                    const isUpcoming = interview.status === 'Upcoming';
                    return (
                      <Card key={interview.id} className="border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row">
                          <div className={`sm:w-32 flex flex-col justify-center items-center p-4 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 ${
                            isUpcoming ? 'bg-indigo-50/80 dark:bg-indigo-950/30' : 'bg-slate-50 dark:bg-slate-900/50'
                          }`}>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              {new Date(interview.scheduledTime).toLocaleString('default', { month: 'short' })}
                            </span>
                            <span className={`text-4xl font-black ${isUpcoming ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {new Date(interview.scheduledTime).getDate()}
                            </span>
                            <span className="text-xs font-bold text-slate-500 mt-1">
                              {new Date(interview.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-center bg-white dark:bg-slate-900">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-lg font-extrabold text-slate-800 dark:text-white leading-snug">{interview.job.title}</h4>
                                <p className="text-sm font-medium text-slate-500">{interview.job.companyName}</p>
                              </div>
                              <span className={`px-2.5 py-1 text-xs rounded-full font-bold tracking-wide ${
                                interview.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' :
                                interview.status === 'Attended' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}>
                                {interview.status}
                              </span>
                            </div>
                            {isUpcoming && (
                              <div className="mt-3 bg-indigo-50 dark:bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                                  Please join the meeting link 5 minutes before scheduled time.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="border-white/10 bg-white dark:bg-slate-900 shadow-md p-8">
                  <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-10 pb-4">
                    
                    <div className="relative pl-8">
                      <div className="absolute -left-[11px] top-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center"></div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Profile Created & Initial Intake</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Uploaded resume and connected GitHub & LinkedIn.</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{new Date(candidate.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute -left-[11px] top-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center"></div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Automated Profile Verification</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">System evaluated skills matrix and generated baseline scores.</p>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute -left-[11px] top-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center"></div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Proctored Assessment Completed</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Test submitted successfully with {candidate.cheatStrikes} security flags.</p>
                      {candidate.testStartTime && (
                         <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{new Date(candidate.testStartTime).toLocaleDateString()}</p>
                      )}
                    </div>

                    <div className="relative pl-8">
                      <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${
                        candidate.status === 'Shortlisted' ? 'bg-emerald-500' :
                        candidate.status === 'Rejected' ? 'bg-red-500' :
                        'bg-indigo-500'
                      }`}></div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Status Decision: {candidate.status}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Final result generated by the AI matching engine.</p>
                    </div>

                  </div>
                </Card>
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
  candidate: any;
  onSuccess: () => void;
}

function AssessmentFlow({ candidate, onSuccess }: AssessmentProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Anti-Cheat State
  const [strikes, setStrikes] = useState(0);
  const [cheatLog, setCheatLog] = useState<{type: string, timestamp: string}[]>([]);

  const domain = candidate.domain || 'General CS';
  const candidateId = candidate.id;

  // Fetch Questions
  useEffect(() => {
    fetch(`${API_BASE}/api/test/generate/${domain}`)
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
      const res = await fetch(`${API_BASE}/api/test/submit`, {
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
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting test.');
    }
  }, [candidateId, answers, cheatLog, onSuccess]);

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
    <div className="w-full flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-white/10 rounded-2xl shadow">
      <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      <p className="mt-4 text-sm font-semibold text-slate-500">Loading Assessment Environment...</p>
    </div>
  );

  if (!started) {
    return (
      <Card className="w-full bg-white dark:bg-slate-900 border-white/10 shadow-2xl">
        <CardHeader className="text-center pb-6 border-b border-white/10/80">
          <div className="mx-auto bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <CardTitle className="text-2xl text-white">Proctored Assessment Setup</CardTitle>
          <CardDescription className="text-red-500 font-bold mt-2">
            Active Proctoring Sandboxing Environment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-350">
            <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-xl border border-slate-150 dark:border-slate-800/80">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs">Do not switch tabs, minimize window or navigate away.</p>
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-xl border border-slate-150 dark:border-slate-800/80">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs">Copying, pasting, or right-clicking is disabled.</p>
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-xl border border-slate-150 dark:border-slate-800/80">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs">Developer Tools activation monitors are active.</p>
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/50">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-700 dark:text-red-400">3 strikes result in automatic test failure & submission.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 dark:bg-slate-950/20 pt-6 rounded-b-xl border-t border-slate-100 dark:border-slate-850/50">
          <Button onClick={startTest} size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-indigo-500/20">
            Accept &amp; Enter Fullscreen Environment
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  if (!currentQ) {
    return (
      <div className="w-full p-8 text-center text-red-550">
        <p>No questions generated for domain: {domain}. Please contact recruitment.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* HUD Timer and Strikes stats */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-white/10">
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
      
      {/* Question Card */}
      <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-slate-900 border border-white/10">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-950/20 p-6 border-b border-slate-100 dark:border-slate-850/50">
          <CardTitle className="text-xl font-bold text-slate-850 dark:text-white leading-normal">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-3.5">
          {currentQ.options.map((option: string) => (
            <div 
              key={option}
              onClick={() => setAnswers({...answers, [currentQ.id]: option})}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                answers[currentQ.id] === option 
                  ? 'border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                  : 'border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:border-indigo-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              <span className="text-sm font-semibold leading-relaxed">
                {option}
              </span>
              {answers[currentQ.id] === option && (
                <CheckCircle2 className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
              )}
            </div>
          ))}
        </CardContent>
        
        <CardFooter className="bg-slate-50/30 dark:bg-slate-950/10 p-6 border-t border-slate-100 dark:border-slate-850/50 flex justify-end">
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
  );
}
