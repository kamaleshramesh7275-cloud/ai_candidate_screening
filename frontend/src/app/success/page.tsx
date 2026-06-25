'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-center p-8 pt-20 transition-colors duration-200">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="bg-emerald-100 dark:bg-emerald-950 p-4 rounded-full text-emerald-600 dark:text-emerald-400 mb-6 animate-bounce">
        <ShieldCheck className="w-16 h-16" />
      </div>

      <h1 className="text-4xl font-extrabold mb-4 text-zinc-800 dark:text-zinc-100">Test Submitted Successfully!</h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 max-w-xl leading-relaxed">
        Thank you for completing the technical assessment. Our automated system is now evaluating your results. We will be in touch soon.
      </p>
      <Button 
        onClick={() => router.push('/')} 
        size="lg" 
        className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-200 dark:shadow-none px-8"
      >
        Return Home
      </Button>
    </div>
  );
}
