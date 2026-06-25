'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Github, Linkedin, User, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedInUrl: '',
    githubUrl: '',
    domain: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  
  // Preview state after intake succeeds
  const [intakeResult, setIntakeResult] = useState<{
    candidateId: string;
    scores: { resume: number; github: number; linkedin: number };
  } | null>(null);

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
      setIntakeResult({
        candidateId: result.candidateId,
        scores: result.scores,
      });
    } catch (error) {
      console.error(error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    if (intakeResult) {
      router.push(`/assessment?id=${intakeResult.candidateId}&domain=${formData.domain}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-200">
      {/* Top absolute header for theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Info Panel */}
      <div className="md:w-1/3 bg-zinc-900 text-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/20 to-orange-600/20 z-0"></div>
        <div className="z-10">
          <button 
            onClick={() => router.push('/')} 
            className="text-red-400 font-semibold mb-12 inline-block hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            &larr; Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-4">Join the Team</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Submit your details below. Our algorithmic engine will analyze your resume and verify your public GitHub contributions before routing you to our proctored technical assessment.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><UploadCloud className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-zinc-200">Automated Parsing</h4>
                <p className="text-sm text-zinc-500">We extract your skills via regex.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400"><Github className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-zinc-200">GitHub Verification</h4>
                <p className="text-sm text-zinc-500">We cross-reference claimed languages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form/Preview Panel */}
      <div className="md:w-2/3 p-8 pt-20 md:p-16 flex items-center justify-center">
        {!intakeResult ? (
          <Card className="w-full max-w-xl border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
            <div className="h-2 w-full bg-gradient-to-r from-red-600 to-rose-600"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Candidate Intake</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">All fields are required for an accurate score.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-400 font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <Input 
                        id="name" 
                        required 
                        className="pl-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus-visible:ring-red-500 text-zinc-900 dark:text-zinc-50"
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-400 font-medium">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus-visible:ring-red-500 text-zinc-900 dark:text-zinc-50"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-zinc-700 dark:text-zinc-400 font-medium">Target Role / Domain</Label>
                  <Select required onValueChange={(value: string | null) => setFormData({...formData, domain: value || ''})}>
                    <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-red-500 text-zinc-900 dark:text-zinc-50">
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
                    <Label htmlFor="linkedin" className="text-zinc-700 dark:text-zinc-400 font-medium">LinkedIn URL</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <Input 
                        id="linkedin" 
                        type="url" 
                        className="pl-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus-visible:ring-red-500 text-zinc-900 dark:text-zinc-50"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedInUrl}
                        onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-zinc-700 dark:text-zinc-400 font-medium">GitHub URL</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <Input 
                        id="github" 
                        type="url" 
                        className="pl-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus-visible:ring-red-500 text-zinc-900 dark:text-zinc-50"
                        placeholder="https://github.com/..."
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="resume" className="text-zinc-700 dark:text-zinc-400 font-medium">Upload Resume (PDF only)</Label>
                  <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative cursor-pointer">
                    <Input 
                      id="resume" 
                      type="file" 
                      accept=".pdf"
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                    />
                    <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {resume ? resume.name : "Click or drag file to upload"}
                    </p>
                    {!resume && <p className="text-xs text-zinc-500 mt-1">Maximum file size 5MB</p>}
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-zinc-50/50 dark:bg-zinc-800/50 pt-4 px-6 pb-6 mt-4">
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-none h-12 text-lg rounded-xl transition-all" disabled={loading || !formData.domain}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Profile...</>
                  ) : (
                    'Submit Profile'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          /* Verification Preview Panel */
          <Card className="w-full max-w-xl border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 p-8 flex flex-col items-center">
            <div className="bg-emerald-100 dark:bg-emerald-950 p-4 rounded-full text-emerald-600 dark:text-emerald-400 mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 text-center">Profile Verified!</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-center mb-8">
              We parsed your resume and cross-referenced it with GitHub. Here is your initial screening dashboard:
            </p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Resume Score</div>
                <div className="text-3xl font-black text-red-600 dark:text-red-400">{intakeResult.scores.resume.toFixed(0)}%</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">GitHub Activity</div>
                <div className="text-3xl font-black text-orange-600 dark:text-orange-400">{intakeResult.scores.github.toFixed(0)}%</div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/55 rounded-xl p-4 text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                <strong>Next Step:</strong> You will now enter our proctored assessment for the <strong>{formData.domain}</strong> role. Please make sure you are in a quiet room, have stable internet, and do not navigate away from the page during the test.
              </div>
              
              <Button onClick={handleStartTest} className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg rounded-xl flex items-center justify-center gap-2">
                Start Proctored Assessment <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
