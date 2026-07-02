'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Force dark mode on admin pages for that premium feel
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Small test ping to see if the secret is valid
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${secret}` }
      });
      
      if (res.ok) {
        sessionStorage.setItem('admin_secret', secret);
        router.push('/admin');
      } else {
        setError('Invalid admin secret.');
      }
    } catch (err) {
      setError('Connection to server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans text-zinc-50 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl">
            <Lock className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        
        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Superadmin Login</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter the master secret to access the platform overview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret" className="text-zinc-300">Admin Secret</Label>
                <Input 
                  id="secret" 
                  type="password" 
                  placeholder="••••••••••••"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500 h-12"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                disabled={loading || !secret}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <span className="flex items-center gap-2">
                    Access Dashboard <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-zinc-800/50 pt-6">
            <p className="text-xs text-zinc-500">
              AI Recruiter Platform • Admin Gateway
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
