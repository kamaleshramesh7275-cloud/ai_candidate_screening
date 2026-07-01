'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShieldCheck, Loader2, Users, Search, 
  BarChart3, TrendingUp, Sun, Moon, LogOut, Briefcase, ChevronDown, ChevronUp, Github, Linkedin, CheckCircle2, XCircle
} from 'lucide-react';
import { API_BASE } from '@/lib/api';
import { getSession, clearSession, Session } from '@/lib/session';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [newJob, setNewJob] = useState({ title: '', domain: 'Frontend', salary: '', description: '' });
  const [creatingJob, setCreatingJob] = useState(false);
  
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<Record<string, any[]>>({});

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
      if (!sess || sess.role !== 'recruiter') {
        router.push('/login?role=recruiter');
        return;
      }
      setSession(sess);
      await fetchJobs(sess.id);
      setLoading(false);
    }
    init();
  }, [router]);

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

  const fetchJobs = async (recruiterId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/recruiter/${recruiterId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplicationsForJob = async (jobId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/applications/job/${jobId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setJobApplications(prev => ({ ...prev, [jobId]: data.applications }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleJobExpanded = (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      if (!jobApplications[jobId]) {
        fetchApplicationsForJob(jobId);
      }
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setCreatingJob(true);
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newJob, recruiterId: session.id }),
        credentials: 'include'
      });
      if (res.ok) {
        setNewJob({ title: '', domain: 'Frontend', salary: '', description: '' });
        await fetchJobs(session.id);
      } else {
        alert('Failed to create job');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingJob(false);
    }
  };

  const updateAppStatus = async (appId: string, status: string, jobId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      if (res.ok) {
        fetchApplicationsForJob(jobId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-slate-900 dark:text-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-1.5 rounded-lg text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            Recruiter Portal
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Create Job Form */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>Create a new position to start accepting applications.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateJob}>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div className="space-y-2">
                <Label>Domain</Label>
                <select required value={newJob.domain} onChange={e => setNewJob({...newJob, domain: e.target.value})} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900">
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="ML">Machine Learning</option>
                  <option value="General CS">General CS</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Salary Range</Label>
                <Input required value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} placeholder="$120k - $150k" />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label>Description</Label>
                <Input required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} placeholder="Brief job description..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={creatingJob} className="bg-pink-600 hover:bg-pink-500 text-white w-32">
                {creatingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Job'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Active Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-slate-500">You haven't posted any jobs yet.</p>
          ) : (
            jobs.map(job => (
              <Card key={job.id} className="border-slate-200 dark:border-slate-800">
                <div 
                  className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex justify-between items-center"
                  onClick={() => toggleJobExpanded(job.id)}
                >
                  <div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <div className="flex gap-2 text-xs font-bold text-slate-500 mt-2">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{job.domain}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{job.salary}</span>
                    </div>
                  </div>
                  {expandedJobId === job.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>

                {/* Applications for this job */}
                {expandedJobId === job.id && (
                  <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 p-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-500" /> Candidates
                    </h4>
                    
                    {!jobApplications[job.id] ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                    ) : jobApplications[job.id].length === 0 ? (
                      <p className="text-sm text-slate-500">No applicants yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {jobApplications[job.id].map(app => (
                          <Card key={app.id} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <h5 className="font-bold text-lg">{app.candidate.name}</h5>
                              <p className="text-sm text-slate-500">{app.candidate.email}</p>
                              
                              <div className="flex gap-3 mt-3">
                                {app.candidate.githubUrl && (
                                  <a href={app.candidate.githubUrl} target="_blank" className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-500">
                                    <Github className="w-3 h-3" /> GitHub
                                  </a>
                                )}
                                {app.candidate.linkedInUrl && (
                                  <a href={app.candidate.linkedInUrl} target="_blank" className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-500">
                                    <Linkedin className="w-3 h-3" /> LinkedIn
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                              {/* Scores */}
                              <div className="flex gap-4 text-center">
                                <div>
                                  <div className="text-sm font-bold text-slate-500">Resume</div>
                                  <div className="text-lg font-black text-blue-500">{app.resumeScore?.toFixed(0) || '-'}%</div>
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-slate-500">Proctored Test</div>
                                  <div className="text-lg font-black text-emerald-500">{app.testScore?.toFixed(0) || '-'}%</div>
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-slate-500">Total</div>
                                  <div className="text-lg font-black text-indigo-500">{app.overallScore?.toFixed(0) || '-'}%</div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2 min-w-[140px]">
                                <span className={`text-center text-xs font-bold py-1 rounded-full ${
                                  app.status === 'Applied' ? 'bg-slate-100 text-slate-600' :
                                  app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                                  app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-indigo-100 text-indigo-700'
                                }`}>
                                  {app.status}
                                </span>
                                
                                {app.status !== 'Shortlisted' && app.status !== 'Rejected' && (
                                  <div className="flex gap-2">
                                    <Button onClick={() => updateAppStatus(app.id, 'Shortlisted', job.id)} size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8">
                                      <CheckCircle2 className="w-3 h-3 mr-1" /> Hire
                                    </Button>
                                    <Button onClick={() => updateAppStatus(app.id, 'Rejected', job.id)} size="sm" variant="outline" className="flex-1 text-red-500 border-red-200 hover:bg-red-50 h-8 text-xs">
                                      <XCircle className="w-3 h-3 mr-1" /> Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
        
      </main>
    </div>
  );
}
