'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

function AssessmentEngine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');
  const domain = searchParams.get('domain') || 'General CS';

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Anti-Cheat State
  const [strikes, setStrikes] = useState(0);
  const [cheatLog, setCheatLog] = useState<{type: string, timestamp: string}[]>([]);

  useEffect(() => {
    if (!candidateId) {
      alert('Missing Candidate ID. Redirecting to Apply.');
      router.push('/apply');
      return;
    }

    fetch(`http://localhost:3001/api/test/generate/${domain}?candidateId=${candidateId}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [domain, candidateId, router]);

  const handleSubmitTest = useCallback(async (finalStrikes: number) => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
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
        router.push('/success');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting test.');
    }
  }, [candidateId, answers, cheatLog, router]);

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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="animate-pulse text-white flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-zinc-500 mb-4 animate-spin" />
        <p>Loading Assessment Environment...</p>
      </div>
    </div>
  );

  if (!started) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 pt-20">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader className="text-center pb-8 border-b border-zinc-800">
            <div className="mx-auto bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-3xl text-white">Proctored Assessment</CardTitle>
            <CardDescription className="text-red-400 font-medium text-lg mt-2">
              Strict Anti-Cheat Environment Active
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
              <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm">Do not switch tabs or minimize the browser window.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm">Copying and pasting text is strictly prohibited.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm">Do not open developer tools or exit fullscreen.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold">3 strikes will result in automatic test failure.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-950/50 pt-6 rounded-b-xl border-t border-zinc-800">
            <Button onClick={startTest} size="lg" className="w-full bg-red-600 hover:bg-red-500 text-lg py-6 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
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
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">
        <p>No questions generated for domain: {domain}. Please contact recruitment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center pt-20 p-4 transition-colors duration-200">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Top HUD */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Progress</div>
          <div className="bg-zinc-100 dark:bg-zinc-800 h-2 w-32 md:w-48 rounded-full overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 font-medium">{currentQuestionIndex + 1} / {questions.length}</div>
        </div>
        
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`} />
            <span className={`text-xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-600 dark:text-red-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${strikes > 0 ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'}`}>
            <ShieldAlert className="w-4 h-4" />
            Strikes: {strikes} / 3
          </div>
        </div>
      </div>
      
      {/* Question Card */}
      <div className="w-full max-w-4xl">
        <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="bg-white dark:bg-zinc-900 p-8 md:p-12 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-2xl md:text-3xl font-medium text-zinc-800 dark:text-zinc-100 leading-tight">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-zinc-50/50 dark:bg-zinc-800/50 p-8 md:p-12 space-y-4">
            {currentQ.options.map((option: string) => (
              <div 
                key={option}
                onClick={() => setAnswers({...answers, [currentQ.id]: option})}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                  answers[currentQ.id] === option 
                    ? 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100 shadow-sm' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-red-400 hover:shadow-md dark:hover:border-red-800'
                }`}
              >
                <span className={`text-lg ${answers[currentQ.id] === option ? 'font-semibold' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  {option}
                </span>
                {answers[currentQ.id] === option && (
                  <CheckCircle2 className="w-6 h-6 text-red-600 dark:text-red-400 animate-in zoom-in duration-200" />
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="bg-white dark:bg-zinc-900 p-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <Button 
              onClick={handleNext} 
              size="lg" 
              className="px-10 h-14 text-lg bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 hover:bg-zinc-800 rounded-xl"
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

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-zinc-500 animate-spin" />
      </div>
    }>
      <AssessmentEngine />
    </Suspense>
  );
}
