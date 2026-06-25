'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Github, Linkedin, StickyNote, CheckCircle2, TrendingUp } from 'lucide-react';

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  Frontend: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Tailwind', 'Redux', 'Vue', 'Angular', 'Webpack', 'GraphQL', 'REST', 'npm', 'Vite'],
  Backend: ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'API', 'Redis', 'Microservices', 'JWT', 'REST'],
  DevOps: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Bash', 'GCP', 'Azure', 'Ansible', 'Prometheus', 'Nginx', 'Git', 'Helm'],
  ML: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'NLP', 'Jupyter', 'Keras', 'OpenCV', 'SQL', 'Hugging Face', 'CUDA'],
  'General CS': ['Data Structures', 'Algorithms', 'Git', 'Agile', 'OOP', 'C++', 'Java', 'Python', 'SQL', 'Testing', 'Linux', 'REST', 'System Design', 'Databases', 'Recursion'],
};

const highlightKeywords = (text: string | null | undefined, keywords: string[]) => {
  if (!text) return <span className="text-zinc-400 font-sans italic">No resume text available</span>;
  
  const escapedKeywords = keywords
    .map(kw => kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .filter(Boolean);

  if (escapedKeywords.length === 0) return <span>{text}</span>;

  const regex = new RegExp(`(\\b${escapedKeywords.join('\\b|\\b')}\\b)`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isMatch = keywords.some(kw => kw.toLowerCase() === part.toLowerCase());
    return isMatch ? (
      <mark key={i} className="bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-semibold border border-amber-305 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
        {part}
      </mark>
    ) : (
      part
    );
  });
};

interface CandidateDialogProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
  onNotesSaved: () => void;
}

export function CandidateDialog({ candidate, isOpen, onClose, onNotesSaved }: CandidateDialogProps) {
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (candidate) {
      setNotes(candidate.recruiterNotes || '');
    }
  }, [candidate]);

  if (!candidate) return null;

  const saveCandidateNotes = async () => {
    setSavingNotes(true);
    try {
      const token = localStorage.getItem('recruiter_token');
      await fetch(`http://localhost:3001/api/recruiter/candidates/${candidate.id}/notes`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });
      onNotesSaved();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingNotes(false);
    }
  };

  const domain = candidate.domain || 'General CS';
  const keywords = DOMAIN_KEYWORDS[domain] || DOMAIN_KEYWORDS['General CS'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <span>{candidate.name}</span>
            <Badge variant="outline" className="font-normal text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800">
              {candidate.domain || 'Unspecified'}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">{candidate.email}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-4">
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Resume Score</div>
            <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{candidate.resumeScore?.toFixed(1) || '—'}</div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">GitHub Score</div>
            <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{candidate.githubScore?.toFixed(1) || '—'}</div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Test Score</div>
            <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{candidate.testScore?.toFixed(1) || '—'}</div>
          </div>
          <div className={`p-4 rounded-xl border ${candidate.cheatStrikes > 0 ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-100 dark:border-zinc-800'} text-center`}>
            <div className={`text-sm font-medium mb-1 ${candidate.cheatStrikes > 0 ? 'text-red-500 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400'}`}>Cheat Strikes</div>
            <div className={`text-2xl font-bold ${candidate.cheatStrikes > 0 ? 'text-red-700 dark:text-red-300' : 'text-zinc-800 dark:text-zinc-100'}`}>{candidate.cheatStrikes || 0}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Log */}
          <div>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" />
              Security Log
            </h4>
            <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 h-56 overflow-auto font-mono text-xs">
              {candidate.cheatLog && JSON.parse(candidate.cheatLog).length > 0 ? (
                <ul className="space-y-2">
                  {JSON.parse(candidate.cheatLog).map((log: any, i: number) => (
                    <li key={i} className="text-red-400 border-b border-zinc-800 dark:border-zinc-900 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                      <span className="text-zinc-500 block mb-1">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      ⚠️ {log.type} {log.details ? `(${log.details})` : ''}
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
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zinc-400" />
              Skill Verification Matrix
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl h-56 overflow-auto">
               {candidate.skillsMatchLog ? (() => {
                 const parsedLog = JSON.parse(candidate.skillsMatchLog);
                 return (
                   <div className="space-y-4">
                     <div>
                       <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Verified (GitHub &amp; Resume)</div>
                       <div className="flex flex-wrap gap-2">
                         {parsedLog.matched?.map((skill: string) => (
                           <Badge key={skill} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-200">{skill}</Badge>
                         )) || <span className="text-xs text-zinc-400">None</span>}
                       </div>
                     </div>
                     <div>
                       <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Missing from Resume</div>
                       <div className="flex flex-wrap gap-2">
                         {parsedLog.missing?.map((skill: string) => (
                           <Badge key={skill} variant="outline" className="text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">{skill}</Badge>
                         )) || <span className="text-xs text-zinc-400">None</span>}
                       </div>
                     </div>
                   </div>
                 );
               })() : (
                 <div className="text-zinc-400 text-sm h-full flex items-center justify-center italic">No verification data available.</div>
               )}
            </div>
          </div>

          {/* GitHub Profile & Heatmap */}
          <div>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <Github className="w-4 h-4 text-zinc-400" />
              GitHub Profile &amp; Commit Activity
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl min-h-56 overflow-auto space-y-4">
              {candidate.githubRawData ? (() => {
                const gh = JSON.parse(candidate.githubRawData);
                const languages = gh.languages || {};
                const langEntries = Object.entries(languages) as [string, number][];
                const activity = gh.monthlyActivity || {};
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800 text-center">
                        <div className="text-lg font-black text-zinc-800 dark:text-zinc-100">{gh.public_repos ?? '—'}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">Public Repos</div>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800 text-center">
                        <div className="text-lg font-black text-amber-600 dark:text-amber-400">{gh.stars ?? '—'}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">⭐ Stars</div>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800 text-center">
                        <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{gh.recentCommitsScore ?? '—'}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">Recent Commits</div>
                      </div>
                    </div>
                    
                    {langEntries.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Languages Used</div>
                        <div className="flex flex-wrap gap-1.5">
                          {langEntries
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 10)
                            .map(([lang, count]) => (
                              <span key={lang} className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                                {lang} <span className="opacity-60 font-normal">×{count}</span>
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Commit activity heatmap */}
                    {activity && Object.keys(activity).length > 0 && (
                      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          Commit Activity (Last 12 Months)
                        </div>
                        <div className="flex gap-1.5 items-end justify-between bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                          {Object.entries(activity).map(([month, count]: any) => {
                            const countNum = Number(count) || 0;
                            let color = 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200';
                            if (countNum > 0 && countNum <= 2) color = 'bg-emerald-100 dark:bg-emerald-950/40 hover:bg-emerald-200';
                            else if (countNum > 2 && countNum <= 5) color = 'bg-emerald-300 dark:bg-emerald-900/60 hover:bg-emerald-400';
                            else if (countNum > 5 && countNum <= 10) color = 'bg-emerald-500 dark:bg-emerald-800 hover:bg-emerald-600';
                            else if (countNum > 10) color = 'bg-emerald-700 dark:bg-emerald-700 hover:bg-emerald-800';

                            const date = new Date(month + '-02');
                            const label = date.toLocaleDateString('default', { month: 'short' });
                            return (
                              <div key={month} className="flex-1 flex flex-col items-center gap-1 group relative">
                                <div className={`w-full aspect-square rounded-sm ${color} transition-colors duration-200 cursor-pointer`} />
                                <span className="text-[9px] text-zinc-400 font-mono scale-90 origin-center">{label}</span>
                                <div className="absolute bottom-full mb-1.5 left-1/2 -tranzinc-x-1/2 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
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
                <div className="text-zinc-400 text-sm h-full flex items-center justify-center italic">No GitHub data available.</div>
              )}
            </div>
          </div>

          {/* LinkedIn Scraped Details */}
          <div>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-zinc-400" />
              LinkedIn Profile Data
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl h-56 overflow-auto">
              {candidate.linkedInRawData ? (() => {
                const li = JSON.parse(candidate.linkedInRawData);
                const data = li.data || li;
                return (
                  <div className="space-y-3">
                    {data.headline && (
                      <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Headline</div>
                        <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 rounded-lg p-2.5 border border-zinc-200 dark:border-zinc-800">{data.headline}</div>
                      </div>
                    )}
                    {data.summary && (
                      <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Summary</div>
                        <div className="text-sm text-zinc-700 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-lg p-2.5 border border-zinc-200 dark:border-zinc-800 leading-relaxed">{data.summary}</div>
                      </div>
                    )}
                    {!data.headline && !data.summary && (
                      <div className="text-zinc-400 text-sm flex items-center h-full justify-center italic">No LinkedIn details extracted.</div>
                    )}
                    {candidate.linkedInUrl && (
                      <a href={candidate.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline mt-1 font-semibold">
                        <Linkedin className="w-3 h-3" /> View Profile
                      </a>
                    )}
                  </div>
                );
              })() : (
                <div className="text-zinc-400 text-sm h-full flex items-center justify-center italic">No LinkedIn data available.</div>
              )}
            </div>
          </div>

          {/* Resume Keyword Heatmap - Full Width */}
          <div className="md:col-span-2 mt-2">
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-zinc-400" />
              Resume Keyword Match Heatmap ({domain} Role)
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
              {candidate.resumeText ? (() => {
                const resumeLower = candidate.resumeText.toLowerCase();
                const matchedKeywords = keywords.filter(kw => 
                  resumeLower.includes(kw.toLowerCase())
                );

                return (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                      {keywords.map(kw => {
                        const isMatched = matchedKeywords.includes(kw);
                        const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                        const regex = new RegExp(`\\b${escapedKw}\\b`, 'gi');
                        const occurrences = (candidate.resumeText.match(regex) || []).length;

                        return (
                          <div
                            key={kw}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              isMatched 
                                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 shadow-sm' 
                                : 'bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800'
                            }`}
                          >
                            <span>{kw}</span>
                            {isMatched && (
                              <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.25 rounded-full text-[10px] font-bold">
                                {occurrences}×
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Resume Text Highlight Viewer</div>
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 max-h-60 overflow-auto text-xs text-zinc-600 dark:text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed">
                        {highlightKeywords(candidate.resumeText, keywords)}
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="text-zinc-400 text-sm h-24 flex items-center justify-center italic">No resume text available for analysis.</div>
              )}
            </div>
          </div>

          {/* Recruiter Notes - Full Width */}
          <div className="md:col-span-2 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-2">
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-rose-500 animate-pulse" />
              Recruiter Evaluation Notes
            </h4>
            <div className="flex gap-3 items-start">
              <textarea
                rows={3}
                className="flex-1 min-h-[85px] text-sm p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none bg-zinc-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-all resize-none shadow-inner text-zinc-800 dark:text-zinc-100"
                placeholder="Add evaluation summary, interview notes, or screening feedback..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button 
                className="px-4 py-6 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow"
                disabled={savingNotes}
                onClick={saveCandidateNotes}
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
