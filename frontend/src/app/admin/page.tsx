'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Building2, Briefcase, FileText, Activity, LogOut, 
  Search, ShieldCheck, ChevronDown, CheckCircle2, XCircle, 
  TrendingUp, Clock, AlertTriangle, ExternalLink, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin`;

export default function AdminDashboard() {
  const router = useRouter();
  const [secret, setSecret] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'companies' | 'applications'>('overview');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [expandedRecruiter, setExpandedRecruiter] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const storedSecret = sessionStorage.getItem('admin_secret');
    if (!storedSecret) {
      router.push('/admin/login');
      return;
    }
    setSecret(storedSecret);
    fetchAllData(storedSecret);
  }, [router]);

  const fetchAllData = async (token: string) => {
    setLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [statsRes, candRes, recRes, appRes] = await Promise.all([
        fetch(`${API_BASE}/stats`, { headers }),
        fetch(`${API_BASE}/candidates`, { headers }),
        fetch(`${API_BASE}/recruiters`, { headers }),
        fetch(`${API_BASE}/applications`, { headers }),
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        sessionStorage.removeItem('admin_secret');
        router.push('/admin/login');
        return;
      }

      setStats(await statsRes.json());
      setCandidates((await candRes.json()).candidates);
      setRecruiters((await recRes.json()).recruiters);
      setApplications((await appRes.json()).applications);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_secret');
    router.push('/admin/login');
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p>Loading platform matrix...</p>
      </div>
    );
  }

  // ---- RENDERERS ----

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-zinc-400">Total Candidates</p>
              <Users className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-50">{stats.totalCandidates}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-zinc-400">Total Recruiters</p>
              <Building2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-50">{stats.totalRecruiters}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-zinc-400">Active Jobs</p>
              <Briefcase className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-50">{stats.totalJobs}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-zinc-400">Total Applications</p>
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-50">{stats.totalApplications}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="col-span-2 bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Candidates</CardTitle>
            <CardDescription className="text-zinc-400">Highest overall scores across all applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Candidate</TableHead>
                  <TableHead className="text-zinc-400">Job</TableHead>
                  <TableHead className="text-zinc-400 text-right">Overall Match</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topCandidates.map((c: any, i: number) => (
                  <TableRow key={i} className="border-zinc-800/50 hover:bg-zinc-800/50">
                    <TableCell>
                      <div className="font-medium text-zinc-200">{c.candidateName}</div>
                      <div className="text-xs text-zinc-500">{c.candidateEmail}</div>
                    </TableCell>
                    <TableCell className="text-zinc-300">{c.jobTitle}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-sm border border-emerald-500/20">
                        {c.overallScore.toFixed(1)}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {stats.topCandidates.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-zinc-500 py-6">No graded applications yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Breakdown */}
        <Card className="col-span-1 bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Domain Breakdown</CardTitle>
            <CardDescription className="text-zinc-400">Jobs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.domainBreakdown.map((d: any, i: number) => {
                const max = Math.max(...stats.domainBreakdown.map((x: any) => x.count));
                const pct = Math.round((d.count / max) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300">{d.domain}</span>
                      <span className="text-zinc-500">{d.count} jobs</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCandidates = () => {
    const filtered = candidates.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search candidates by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400 text-center">Applied To</TableHead>
                <TableHead className="text-zinc-400 text-center">Tests Taken</TableHead>
                <TableHead className="text-zinc-400 text-right">Avg Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <React.Fragment key={c.id}>
                  <TableRow 
                    className="border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer"
                    onClick={() => setExpandedCandidate(expandedCandidate === c.id ? null : c.id)}
                  >
                    <TableCell>
                      <div className="font-medium text-zinc-200">{c.name}</div>
                      <div className="text-xs text-zinc-500">{c.email}</div>
                    </TableCell>
                    <TableCell className="text-center text-zinc-300">{c.totalApplications}</TableCell>
                    <TableCell className="text-center text-zinc-300">{c.completedTests}</TableCell>
                    <TableCell className="text-right">
                      {c.avgOverallScore ? (
                         <span className="text-indigo-400 font-semibold">{c.avgOverallScore.toFixed(1)}%</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedCandidate === c.id && (
                    <TableRow className="border-zinc-800/50 bg-zinc-950/50">
                      <TableCell colSpan={4} className="p-0">
                        <div className="p-4 border-l-2 border-indigo-500 ml-4 my-2">
                          <h4 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Application History</h4>
                          {c.applications.length > 0 ? (
                            <div className="space-y-2">
                              {c.applications.map((app: any) => (
                                <div key={app.id} className="flex items-center justify-between bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                  <div>
                                    <div className="font-medium text-zinc-200">{app.jobTitle} <span className="text-zinc-500 font-normal">at {app.companyName}</span></div>
                                    <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                                      <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">{app.status}</span>
                                      {app.cheatStrikes > 0 && <span className="text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {app.cheatStrikes} strikes</span>}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    {app.overallScore !== null ? (
                                      <div className="text-sm font-semibold text-emerald-400">{app.overallScore}% overall</div>
                                    ) : (
                                      <div className="text-sm text-zinc-500">Not evaluated</div>
                                    )}
                                    {app.testCompleted && <div className="text-xs text-indigo-400 mt-1">Test: {app.testScore}%</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-zinc-500">No applications yet.</div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  };

  const renderCompanies = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {recruiters.map(r => (
          <Card key={r.id} className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-3 border-b border-zinc-800/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-zinc-500" />
                    {r.company || 'Independent'}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 mt-1">{r.name} ({r.email})</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-zinc-100">{r.totalApplicationsReceived}</div>
                  <div className="text-xs text-zinc-500 uppercase">Total Apps</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium text-zinc-300 mb-3 flex justify-between">
                <span>Posted Jobs ({r.totalJobs})</span>
              </h4>
              <div className="space-y-2">
                {r.jobs.map((j: any) => (
                  <div key={j.id} className="flex justify-between items-center p-2 rounded bg-zinc-800/30 border border-zinc-800/50">
                    <div>
                      <div className="font-medium text-zinc-300 text-sm flex items-center gap-2">
                        {j.title}
                        {!j.isOpen && <span className="px-1.5 py-0.5 text-[10px] bg-red-500/10 text-red-400 rounded">CLOSED</span>}
                      </div>
                      <div className="text-xs text-zinc-500">{j.domain} • {j.salary}</div>
                    </div>
                    <div className="text-center px-3">
                      <div className="text-sm font-semibold text-indigo-400">{j.applicationCount}</div>
                      <div className="text-[10px] text-zinc-500">APPS</div>
                    </div>
                  </div>
                ))}
                {r.jobs.length === 0 && <div className="text-sm text-zinc-500 py-2">No jobs posted.</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderApplications = () => {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400">Candidate</TableHead>
                <TableHead className="text-zinc-400">Job & Company</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400 text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.slice(0, 100).map(a => (
                <TableRow key={a.id} className="border-zinc-800/50 hover:bg-zinc-800/50">
                  <TableCell className="text-xs text-zinc-500">
                    {new Date(a.appliedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-200">{a.candidateName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-300">{a.jobTitle}</div>
                    <div className="text-xs text-zinc-500">{a.companyName}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400 border border-zinc-700">
                      {a.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {a.overallScore !== null ? (
                      <span className="font-semibold text-emerald-400">{a.overallScore}%</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {applications.length > 100 && (
            <div className="text-center p-4 text-xs text-zinc-500 border-t border-zinc-800">
              Showing top 100 most recent applications (out of {applications.length})
            </div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Superadmin
          </span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <LogOut className="w-4 h-4 mr-2" />
          Lock Terminal
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-16 bottom-0 bg-zinc-900/30 border-r border-zinc-800 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'overview' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'}`}
          >
            <Activity className="w-4 h-4" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('candidates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'candidates' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'}`}
          >
            <Users className="w-4 h-4" /> Candidates
          </button>
          <button 
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'companies' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'}`}
          >
            <Building2 className="w-4 h-4" /> Companies & Jobs
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'applications' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'}`}
          >
            <FileText className="w-4 h-4" /> All Applications
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              {activeTab === 'overview' && 'Platform Overview'}
              {activeTab === 'candidates' && 'Candidate Database'}
              {activeTab === 'companies' && 'Companies & Active Jobs'}
              {activeTab === 'applications' && 'Global Application Log'}
            </h1>
            <p className="text-zinc-400 mt-1">
              Live god's-eye view of the AI Recruiter ecosystem.
            </p>
          </div>

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'candidates' && renderCandidates()}
          {activeTab === 'companies' && renderCompanies()}
          {activeTab === 'applications' && renderApplications()}
        </main>
      </div>
    </div>
  );
}
