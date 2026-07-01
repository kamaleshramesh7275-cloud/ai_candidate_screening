'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Loader2, UploadCloud, 
  Github, Linkedin, User, AlertTriangle, Clock, ShieldAlert, 
  CheckCircle2, Download, Users, XCircle, Search, StickyNote, 
  BarChart3, TrendingUp, Sun, Moon, LogOut 
} from 'lucide-react';

// Domain Keyword Map for highlighting
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  Frontend: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Tailwind', 'Redux', 'Vue', 'Angular', 'Webpack', 'GraphQL', 'REST', 'npm', 'Vite'],
  Backend: ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'API', 'Redis', 'Microservices', 'JWT', 'REST'],
  DevOps: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Bash', 'GCP', 'Azure', 'Ansible', 'Prometheus', 'Nginx', 'Git', 'Helm'],
  ML: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'NLP', 'Jupyter', 'Keras', 'OpenCV', 'SQL', 'Hugging Face', 'CUDA'],
  'General CS': ['Data Structures', 'Algorithms', 'Git', 'Agile', 'OOP', 'C++', 'Java', 'Python', 'SQL', 'Testing', 'Linux', 'REST', 'System Design', 'Databases', 'Recursion'],
};

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

export default function RecruiterDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [session, setSession] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({});
  
  // Jobs and Interviews State
  const [jobs, setJobs] = useState<any[]>([]);
  const [newJob, setNewJob] = useState({ title: '', companyName: '', salary: '', description: '' });
  const [creatingJob, setCreatingJob] = useState(false);
  const [scheduleData, setScheduleData] = useState<Record<string, { jobId: string, scheduledTime: string }>>({});

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

    // 2. Sync Session
    const activeSession = localStorage.getItem('user_session');
    if (!activeSession) {
      router.push('/login');
      return;
    }
    
    const parsed = JSON.parse(activeSession);
    if (parsed.role !== 'recruiter') {
      router.push('/login');
      return;
    }
    
    setSession(parsed);
    fetchCandidates(parsed);
    fetchJobs(parsed.id, parsed.token);
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    router.push('/login');
  };

  const fetchCandidates = useCallback(async (sessionData?: any) => {
    try {
      const activeSession = sessionData || session;
      if (!activeSession) return;
      const res = await fetch(`${API_BASE}/api/recruiter/candidates`, {
        headers: { 'Authorization': `Bearer ${activeSession.token}` }
      });
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
  }, [session]);

  const fetchJobs = async (recruiterId: string, token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/recruiter/${recruiterId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setCreatingJob(true);
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ ...newJob, recruiterId: session.id })
      });
      if (res.ok) {
        setNewJob({ title: '', companyName: '', salary: '', description: '' });
        fetchJobs(session.id, session.token);
        alert('Job created successfully');
      } else {
        alert('Failed to create job');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingJob(false);
    }
  };

  const handleScheduleInterview = async (candidateId: string) => {
    const data = scheduleData[candidateId];
    if (!data || !data.jobId || !data.scheduledTime) {
      alert('Please select a job and a time');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/interviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ candidateId, jobId: data.jobId, scheduledTime: data.scheduledTime })
      });
      if (res.ok) {
        alert('Interview scheduled successfully!');
      } else {
        alert('Failed to schedule interview');
      }
    } catch(err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!session) return;
    try {
      await fetch(`${API_BASE}/api/recruiter/candidates/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ status })
      });
      fetchCandidates();
    } catch (error) {
      console.error(error);
    }
  };

  const saveCandidateNotes = async (id: string) => {
    if (!session) return;
    setSavingNotes(prev => ({ ...prev, [id]: true }));
    try {
      await fetch(`${API_BASE}/api/recruiter/candidates/${id}/notes`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
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
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center text-slate-900 dark:text-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <p className="mt-4 text-muted-foreground font-semibold">Loading Recruiter Panel...</p>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300 blob-placed">
      <div className="absolute top-1/4 -left-20 w-[40vw] h-[40vw] rounded-full bg-ai-violet/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[30vw] h-[30vw] rounded-full bg-ai-cyan/10 blur-[100px] animate-pulse duration-7000 pointer-events-none" />
      
      {/* Top Navbar */}
      <header className="bg-background/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-15 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-white cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-blue-600 p-1.5 rounded text-white"><Users className="w-5 h-5" /></div>
            AI Recruiter
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-9 bg-slate-100 hover:bg-slate-200/50 dark:bg-slate-950 border-none w-64 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button onClick={exportCSV} variant="outline" className="rounded-xl shadow-sm border-white/10">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-105 dark:hover:bg-slate-800 text-muted-foreground transition-all cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <Button onClick={handleLogout} variant="outline" size="sm" className="border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 rounded-xl">
              <LogOut className="w-4 h-4 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* Profile indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Recruiter Workspace</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Logged in as: <strong className="text-indigo-650 dark:text-indigo-400">{session?.name}</strong> ({session?.email})
            </p>
          </div>
          {/* Mobile search bar */}
          <div className="relative block sm:hidden">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <Input 
              placeholder="Search candidates..." 
              className="pl-9 bg-slate-100 dark:bg-slate-950 border-none w-full focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Job Management (Request Hire) */}
        <Card className="glass-card-glow transition-all duration-300 border-none bg-white/5 dark:bg-slate-900/50">
          <Accordion className="w-full">
            <AccordionItem value="request-hire" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline text-xl font-bold text-white">
                Request to Hire (Create Job)
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-300">Job Role</Label>
                    <Input 
                      required 
                      value={newJob.title}
                      onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                      className="bg-slate-50 dark:bg-slate-950 border-white/10" 
                      placeholder="e.g. Senior Frontend Engineer" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-300">Company Name</Label>
                    <Input 
                      required 
                      value={newJob.companyName}
                      onChange={(e) => setNewJob({...newJob, companyName: e.target.value})}
                      className="bg-slate-50 dark:bg-slate-950 border-white/10" 
                      placeholder="e.g. Acme Corp" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-300">Salary Range</Label>
                    <Input 
                      required 
                      value={newJob.salary}
                      onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                      className="bg-slate-50 dark:bg-slate-950 border-white/10" 
                      placeholder="e.g. $120k - $150k" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-300">Job Description</Label>
                    <Input 
                      required 
                      value={newJob.description}
                      onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                      className="bg-slate-50 dark:bg-slate-950 border-white/10" 
                      placeholder="Brief description..." 
                    />
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <Button type="submit" disabled={creatingJob} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 rounded-xl">
                      {creatingJob ? 'Creating...' : 'Submit Hire Request'}
                    </Button>
                  </div>
                </form>

                {jobs.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">Active Jobs</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobs.map(j => (
                        <Badge key={j.id} variant="outline" className="border-indigo-500 text-indigo-400 bg-indigo-950/30">
                          {j.title} at {j.companyName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card-glow transition-all duration-300">
            <div className="text-sm font-semibold text-muted-foreground mb-1">Total Applicants</div>
            <div className="text-3xl font-black text-white">{candidates.length}</div>
          </div>
          <div className="glass-card-glow transition-all duration-300">
            <div className="text-sm font-semibold text-muted-foreground mb-1">Shortlisted</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {candidates.filter(c => c.status === 'Shortlisted').length}
            </div>
          </div>
          <div className="glass-card-glow transition-all duration-300">
            <div className="text-sm font-semibold text-muted-foreground mb-1">Avg Score</div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {candidates.length ? (candidates.reduce((a,c) => a + (c.overallScore || 0), 0) / candidates.length).toFixed(1) : '0.0'}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Status Distribution */}
          <div className="glass-card-glow flex flex-col justify-between transition-colors duration-300">
            <div>
              <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
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
                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="10" />
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
                        <span className="text-xl font-extrabold text-white">{total}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Total</span>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="flex-1 space-y-2">
                      {statusData.map((d) => (
                        <div key={d.label} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${d.colorClass}`} />
                            <span className="font-semibold text-slate-650 dark:text-slate-350">{d.label}</span>
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{d.count} ({Math.round((d.count / total) * 100)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })() : (
                <div className="text-slate-405 text-sm py-8 text-center italic">No candidate status records available.</div>
              )}
            </div>
          </div>

          {/* Domains Applied */}
          <div className="glass-card-glow flex flex-col justify-between transition-colors duration-300">
            <div>
              <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Domains Applied
              </h3>
              {candidates.length > 0 ? (() => {
                const domainCounts = candidates.reduce((acc, c) => {
                  const d = c.domain || 'Unspecified';
                  acc[d] = (acc[d] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const maxCount = Math.max(...(Object.values(domainCounts) as number[]), 1);
                
                return (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {(Object.entries(domainCounts) as [string, number][]).map(([domain, count]) => {
                      const pct = (count / maxCount) * 100;
                      return (
                        <div key={domain} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600 dark:text-slate-400">{domain}</span>
                            <span className="text-slate-800 dark:text-slate-200">{count}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
          <div className="glass-card-glow flex flex-col justify-between transition-colors duration-300">
            <div>
              <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
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
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <div className="text-3xl font-black text-slate-850 dark:text-white">{passRate.toFixed(1)}%</div>
                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider">Pass Rate (Score ≥ 70)</div>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl flex flex-col items-center">
                        <span className="text-xs font-bold">{passedTakers.length} / {testTakers.length}</span>
                        <span className="text-[9px] font-medium opacity-80">Passed Tests</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center">
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{avgTestScore}</div>
                        <div className="text-[10px] text-muted-foreground">Avg Test Score</div>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center">
                        <div className="text-lg font-bold text-red-500">
                          {candidates.reduce((sum, c) => sum + (c.cheatStrikes || 0), 0)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Total Proct. Alerts</div>
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
        <div className="glass-card-glow overflow-hidden transition-colors duration-300">
          <Table>
            <TableHeader className="bg-white/5 border-b border-white/10">
              <TableRow>
                <TableHead className="py-4 font-semibold text-slate-300">Candidate Info</TableHead>
                <TableHead className="font-semibold text-slate-300">Target Role</TableHead>
                <TableHead className="font-semibold text-slate-300">Algorithmic Score</TableHead>
                <TableHead className="font-semibold text-slate-300">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-white/10">
                  <TableCell>
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-400">
                      {c.domain || 'Unspecified'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-lg text-slate-300">
                        {c.overallScore ? c.overallScore.toFixed(1) : '—'}
                      </div>
                      <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${c.overallScore >= 70 ? 'bg-emerald-500' : c.overallScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                          style={{ width: `${Math.min(c.overallScore || 0, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      c.status === 'Shortlisted' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-950/60' 
                        : c.status === 'Rejected' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-950/60' 
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                    }`}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl" 
                      onClick={() => updateStatus(c.id, 'Shortlisted')}
                    >
                      <CheckCircle2 className="w-4.5 h-4.5 mr-1" /> Shortlist
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-750 dark:text-red-400 rounded-xl" 
                      onClick={() => updateStatus(c.id, 'Rejected')}
                    >
                      <XCircle className="w-4.5 h-4.5 mr-1" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCandidates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
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
          <h2 className="text-xl font-bold text-white mb-4">Detailed Breakdowns</h2>
          {filteredCandidates.map((c) => (
            <div key={`details-${c.id}`} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-white/10 overflow-hidden transition-all duration-300">
              <Accordion className="w-full">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-950/40 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-950/30 text-left border-none">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-slate-850 dark:text-white">{c.name}</div>
                      <Badge variant="outline" className="font-semibold text-xs text-slate-500 border-slate-305 dark:border-slate-750 bg-white dark:bg-slate-950/40">Full Analysis</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2 border-t border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-4">
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-white/10">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Resume Score</div>
                        <div className="text-2xl font-black text-white">{c.resumeScore?.toFixed(1) || '—'}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-white/10">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">GitHub Score</div>
                        <div className="text-2xl font-black text-white">{c.githubScore?.toFixed(1) || '—'}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-white/10">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Test Score</div>
                        <div className="text-2xl font-black text-white">{c.testScore?.toFixed(1) || '—'}</div>
                      </div>
                      <div className={`p-4 rounded-xl border ${c.cheatStrikes > 0 ? 'bg-red-50/50 border-red-100 dark:bg-red-950/15 dark:border-red-900/40' : 'bg-slate-50 dark:bg-slate-950 border-white/10'}`}>
                        <div className={`text-xs font-semibold mb-1 ${c.cheatStrikes > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>Cheat Strikes</div>
                        <div className={`text-2xl font-black ${c.cheatStrikes > 0 ? 'text-red-600 dark:text-red-400' : 'text-white'}`}>{c.cheatStrikes || 0}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Security Log */}
                      <div>
                        <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-400" />
                          Security Log
                        </h4>
                        <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 h-56 overflow-auto font-mono text-xs text-white">
                          {c.cheatLog && JSON.parse(c.cheatLog).length > 0 ? (
                            <ul className="space-y-2">
                              {JSON.parse(c.cheatLog).map((log: any, i: number) => (
                                <li key={i} className="text-red-400 border-b border-slate-800 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                                  <span className="text-slate-500 block mb-0.5">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
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
                        <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-slate-400" />
                          Skill Verification Matrix
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-white/10 h-56 overflow-auto">
                           {c.skillsMatchLog ? (
                             <div className="space-y-4">
                               <div>
                                 <div className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Verified (GitHub &amp; Resume)</div>
                                 <div className="flex flex-wrap gap-1.5">
                                   {JSON.parse(c.skillsMatchLog).matched?.map((skill: string) => (
                                     <Badge key={skill} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">{skill}</Badge>
                                   )) || <span className="text-xs text-slate-400">None</span>}
                                 </div>
                               </div>
                               <div>
                                 <div className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Missing from Resume</div>
                                 <div className="flex flex-wrap gap-1.5">
                                   {JSON.parse(c.skillsMatchLog).missing?.map((skill: string) => (
                                     <Badge key={skill} variant="outline" className="text-slate-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">{skill}</Badge>
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
                        <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                          <Github className="w-4 h-4 text-slate-400" />
                          GitHub Profile &amp; Commit Activity
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-white/10 min-h-56 overflow-auto space-y-4">
                           {c.githubRawData ? (() => {
                             const gh = JSON.parse(c.githubRawData);
                             const languages = gh.languages || {};
                             const langEntries = Object.entries(languages) as [string, number][];
                             const activity = gh.monthlyActivity || {};
                             return (
                               <div className="space-y-4">
                                 <div className="grid grid-cols-3 gap-2">
                                   <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-white/10 text-center shadow-sm">
                                     <div className="text-lg font-black text-white">{gh.public_repos ?? '—'}</div>
                                     <div className="text-[10px] text-muted-foreground font-semibold uppercase">Repos</div>
                                   </div>
                                   <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-white/10 text-center shadow-sm">
                                     <div className="text-lg font-black text-amber-600 dark:text-amber-405">{gh.stars ?? '—'}</div>
                                     <div className="text-[10px] text-muted-foreground font-semibold uppercase">⭐ Stars</div>
                                   </div>
                                   <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-white/10 text-center shadow-sm">
                                     <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{gh.recentCommitsScore ?? '—'}</div>
                                     <div className="text-[10px] text-muted-foreground font-semibold uppercase">Commits</div>
                                   </div>
                                 </div>
                                 
                                 {langEntries.length > 0 && (
                                   <div>
                                     <div className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1.5">Languages</div>
                                     <div className="flex flex-wrap gap-1">
                                       {langEntries
                                         .sort((a, b) => b[1] - a[1])
                                         .slice(0, 8)
                                         .map(([lang, count]) => (
                                           <span key={lang} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 text-xs font-bold border border-indigo-100/40 dark:border-indigo-900/40">
                                             {lang} <span className="opacity-60 font-semibold text-[10px]">×{count}</span>
                                           </span>
                                         ))}
                                     </div>
                                   </div>
                                 )}

                                 {/* Heatmap */}
                                 {activity && Object.keys(activity).length > 0 && (
                                   <div className="pt-2 border-t border-white/10">
                                     <div className="text-[10px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-2 flex items-center gap-1">
                                       <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                       Commit Activity
                                     </div>
                                     <div className="flex gap-1 items-end justify-between bg-white dark:bg-slate-900 p-2 rounded-lg border border-white/10">
                                       {Object.entries(activity).map(([month, count]: any) => {
                                         const countNum = Number(count) || 0;
                                         let color = 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700';
                                         if (countNum > 0 && countNum <= 2) color = 'bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200';
                                         else if (countNum > 2 && countNum <= 5) color = 'bg-emerald-350 dark:bg-emerald-800 hover:bg-emerald-400';
                                         else if (countNum > 5 && countNum <= 10) color = 'bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600';
                                         else if (countNum > 10) color = 'bg-emerald-700 dark:bg-emerald-400 hover:bg-emerald-800';

                                         const date = new Date(month + '-02');
                                         const label = date.toLocaleDateString('default', { month: 'short' });
                                         return (
                                           <div key={month} className="flex-1 flex flex-col items-center gap-1 group relative">
                                             <div className={`w-full aspect-square rounded-sm ${color} transition-colors duration-200 cursor-pointer`} />
                                             <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono scale-90">{label}</span>
                                             <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
                                               {countNum} push{countNum === 1 ? '' : 'es'} in {label} {date.getFullYear()}
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
                        <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-slate-400" />
                          LinkedIn Profile Data
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-white/10 h-56 overflow-auto">
                          {c.linkedInRawData ? (() => {
                            const li = JSON.parse(c.linkedInRawData);
                            const data = li.data || li;
                            return (
                              <div className="space-y-3">
                                {data.headline && (
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1">Headline</div>
                                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded-lg p-2 border border-white/10">{data.headline}</div>
                                  </div>
                                )}
                                {data.summary && (
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1">Summary</div>
                                    <div className="text-xs text-slate-300 bg-white dark:bg-slate-900 rounded-lg p-2 border border-white/10 leading-relaxed">{data.summary}</div>
                                  </div>
                                )}
                                {!data.headline && !data.summary && (
                                  <div className="text-slate-400 text-xs flex items-center h-full justify-center italic">No LinkedIn details extracted.</div>
                                )}
                                {c.linkedInUrl && (
                                  <a href={c.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-bold">
                                    <Linkedin className="w-3 h-3" /> View LinkedIn Profile
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
                        <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                          <StickyNote className="w-4 h-4 text-slate-400" />
                          Resume Keyword Match Heatmap ({c.domain || 'General'} Role)
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-white/10 space-y-4">
                          {c.resumeText ? (() => {
                            const domain = c.domain || 'General CS';
                            const keywords = DOMAIN_KEYWORDS[domain] || DOMAIN_KEYWORDS['General CS'];
                            const resumeLower = c.resumeText.toLowerCase();
                            
                            const matchedKeywords = keywords.filter(kw => 
                              resumeLower.includes(kw.toLowerCase())
                            );

                            return (
                              <div className="space-y-4">
                                <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-205 dark:border-slate-800">
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
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-450 border-emerald-250 dark:border-emerald-900/60 shadow-sm' 
                                            : 'bg-white dark:bg-slate-900 text-slate-400 border-white/10'
                                        }`}
                                      >
                                        <span>{kw}</span>
                                        {isMatched && (
                                          <span className="bg-emerald-200/50 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 px-1.5 py-0.25 rounded-full text-[10px] font-bold">
                                            {occurrences}×
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="space-y-2">
                                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resume Text Highlight Viewer</div>
                                  <div className="bg-white dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-850 max-h-60 overflow-auto text-xs text-slate-650 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
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
                      <div className="md:col-span-2 border-t border-white/10 pt-4 mt-2">
                        <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                          <StickyNote className="w-4 h-4 text-indigo-500 animate-pulse" />
                          Recruiter Evaluation Notes
                        </h4>
                        <div className="flex gap-3 items-start">
                          <textarea
                            rows={3}
                            className="flex-1 min-h-[80px] text-sm p-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-550 focus:outline-none bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 transition-all resize-none shadow-inner text-slate-800 dark:text-slate-250"
                            placeholder="Add evaluation summary, interview notes, or screening feedback..."
                            value={notes[c.id] ?? ''}
                            onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                          />
                          <Button 
                            className="px-4 py-6 rounded-xl font-bold bg-blue-605 hover:bg-blue-700 text-white shadow dark:bg-blue-700 dark:hover:bg-blue-600"
                            disabled={savingNotes[c.id]}
                            onClick={() => saveCandidateNotes(c.id)}
                          >
                            {savingNotes[c.id] ? 'Saving...' : 'Save Notes'}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Schedule Interview */}
                      <div className="md:col-span-2 border-t border-white/10 pt-4 mt-2">
                        <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          Schedule Interview
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-white/10">
                          <div className="w-full space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Job</Label>
                            <select 
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              value={scheduleData[c.id]?.jobId || ''}
                              onChange={(e) => setScheduleData(prev => ({ ...prev, [c.id]: { ...prev[c.id], jobId: e.target.value } }))}
                            >
                              <option value="">-- Choose Job --</option>
                              {jobs.map(j => (
                                <option key={j.id} value={j.id}>{j.title} at {j.companyName}</option>
                              ))}
                            </select>
                          </div>
                          <div className="w-full space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</Label>
                            <Input 
                              type="datetime-local" 
                              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                              value={scheduleData[c.id]?.scheduledTime || ''}
                              onChange={(e) => setScheduleData(prev => ({ ...prev, [c.id]: { ...prev[c.id], scheduledTime: e.target.value } }))}
                            />
                          </div>
                          <Button 
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 w-full sm:w-auto px-6 whitespace-nowrap"
                            onClick={() => handleScheduleInterview(c.id)}
                            disabled={!scheduleData[c.id]?.jobId || !scheduleData[c.id]?.scheduledTime}
                          >
                            Schedule
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
