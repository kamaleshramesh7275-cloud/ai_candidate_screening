'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Search, Download, CheckCircle2, XCircle, Loader2, KeyRound,
  BarChart3, Activity, TrendingUp
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CandidateDialog } from '@/components/CandidateDialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function RecruiterPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('recruiter_token');
    if (token) {
      setIsAuthenticated(true);
      fetchCandidates(token);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('http://localhost:3001/api/recruiter/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('recruiter_token', data.token);
        setIsAuthenticated(true);
        fetchCandidates(data.token);
      } else {
        setLoginError(data.message || 'Login failed. Please check password.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Error connecting to authentication service.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('recruiter_token');
    setIsAuthenticated(false);
    setCandidates([]);
  };

  const fetchCandidates = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/recruiter/candidates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('recruiter_token');
      const res = await fetch(`http://localhost:3001/api/recruiter/candidates/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok && token) {
        fetchCandidates(token);
      }
    } catch (error) {
      console.error(error);
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

  // Status distribution data calculation
  const getStatusChartData = () => {
    const statusCounts = candidates.reduce((acc, c) => {
      const s = c.status || 'Applied';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Applied', value: statusCounts['Applied'] || 0, color: '#94a3b8' },
      { name: 'Tested', value: statusCounts['Tested'] || 0, color: '#60a5fa' },
      { name: 'Shortlisted', value: statusCounts['Shortlisted'] || 0, color: '#10b981' },
      { name: 'Rejected', value: statusCounts['Rejected'] || 0, color: '#ef4444' },
    ].filter(d => d.value > 0);
  };

  // Domain applications data calculation
  const getDomainChartData = () => {
    const domainCounts = candidates.reduce((acc, c) => {
      const d = c.domain || 'Unspecified';
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(domainCounts).map(([name, count]) => ({
      name,
      count
    }));
  };

  const getPassRateData = () => {
    const testTakers = candidates.filter(c => c.testCompleted);
    const passedTakers = testTakers.filter(c => (c.testScore || 0) >= 70);
    const passRate = testTakers.length ? (passedTakers.length / testTakers.length) * 100 : 0;
    return {
      passRate,
      passedCount: passedTakers.length,
      totalCount: testTakers.length
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px]"></div>
        
        <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 z-10">
          <div className="h-2 w-full bg-blue-600"></div>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-blue-500/10 dark:bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <KeyRound className="w-6 h-6 text-blue-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Recruiter Access</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">Enter security password to access dashboard.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  required
                  placeholder="Security Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
              {loginError && (
                <p className="text-sm font-semibold text-red-500 dark:text-red-400">{loginError}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11" disabled={loginLoading}>
                {loginLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : 'Log In'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.push('/')}>
                Back to Home
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="mt-4 text-slate-500 font-medium">Loading Dashboard...</p>
    </div>
  );

  const statusData = getStatusChartData();
  const domainData = getDomainChartData();
  const passRateInfo = getPassRateData();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Top Navbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <div className="bg-blue-600 p-1.5 rounded text-white"><Users className="w-5 h-5" /></div>
            AI Recruiter
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-9 bg-slate-100 dark:bg-slate-800 border-none w-64 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full text-slate-900 dark:text-slate-55"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={exportCSV} variant="outline" className="rounded-full shadow-sm">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <ThemeToggle />
            <Button onClick={handleLogout} variant="ghost" className="rounded-full">
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-slate-500">Total Applicants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{candidates.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-slate-500">Shortlisted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {candidates.filter(c => c.status === 'Shortlisted').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-slate-500">Avg Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {candidates.length ? (candidates.reduce((a,c) => a + (c.overallScore || 0), 0) / candidates.length).toFixed(1) : '0.0'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recharts Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold text-slate-800 dark:text-slate-150 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" /> Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center">
              {statusData.length > 0 ? (
                <div className="w-full h-full flex flex-col md:flex-row items-center gap-4">
                  <div className="w-1/2 h-full min-h-[180px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-2">
                    {statusData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="font-medium text-slate-650 dark:text-slate-400">{d.name}</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-sm w-full text-center italic">No records available.</div>
              )}
            </CardContent>
          </Card>

          {/* Domains Applied */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold text-slate-800 dark:text-slate-150 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" /> Domains Applied
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              {domainData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-400 text-sm h-full flex items-center justify-center italic">No records available.</div>
              )}
            </CardContent>
          </Card>

          {/* Pass Rate Tracking */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold text-slate-800 dark:text-slate-150 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Assessment Pass Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex flex-col justify-center">
              {candidates.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-4xl font-black text-slate-800 dark:text-slate-100">{passRateInfo.passRate.toFixed(1)}%</div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pass Rate (Score ≥ 70)</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl flex flex-col items-center">
                      <span className="text-xs font-bold">{passRateInfo.passedCount} / {passRateInfo.totalCount}</span>
                      <span className="text-[9px] font-medium opacity-80">Passed Tests</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                      <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {candidates.filter(c => c.testCompleted).length ? (candidates.filter(c => c.testCompleted).reduce((sum, c) => sum + (c.testScore || 0), 0) / candidates.filter(c => c.testCompleted).length).toFixed(1) : '—'}
                      </div>
                      <div className="text-[10px] text-slate-500">Avg Test Score</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {candidates.reduce((sum, c) => sum + (c.cheatStrikes || 0), 0)}
                      </div>
                      <div className="text-[10px] text-slate-500">Total Proct. Alerts</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-sm text-center italic">No assessment test activity recorded yet.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-850">
              <TableRow>
                <TableHead className="py-4 font-semibold text-slate-700 dark:text-slate-300">Candidate Info</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Target Role</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Algorithmic Score</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors cursor-pointer" onClick={() => {
                  setSelectedCandidate(c);
                  setIsDialogOpen(true);
                }}>
                  <TableCell>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-450">{c.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-400">
                      {c.domain || 'Unspecified'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-lg text-slate-750 dark:text-slate-300">
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
                    <Badge className={`px-2 py-1 rounded-md ${c.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-200' : c.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 hover:bg-red-200' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'}`}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" className="border-emerald-250 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" onClick={() => updateStatus(c.id, 'Shortlisted')}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Shortlist
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-250 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-700 dark:text-red-450" onClick={() => updateStatus(c.id, 'Rejected')}>
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
        </Card>
      </div>

      <CandidateDialog 
        candidate={selectedCandidate}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCandidate(null);
        }}
        onNotesSaved={() => {
          const token = localStorage.getItem('recruiter_token');
          if (token) fetchCandidates(token);
        }}
      />
    </div>
  );
}
