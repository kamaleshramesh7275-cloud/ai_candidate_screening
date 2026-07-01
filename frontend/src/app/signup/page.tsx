"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Loader2, ArrowRight, EyeOff, Eye, Cpu, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth(); // For this mock, signup directly logs in
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Recruiter");
  const [terms, setTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!terms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      // Mock signup -> automatically login
      await login(email, password);
      router.push("/recruiter-dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-ai-cyan/20 blur-[120px] animate-pulse duration-10000 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] rounded-full bg-ai-pink/10 blur-[100px] animate-pulse duration-7000 pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500 my-8">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ai-violet to-ai-cyan p-[1px] shadow-[0_0_30px_rgba(139,92,246,0.3)] mb-4">
            <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
              <Cpu className="w-8 h-8 text-ai-violet" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-muted-foreground mt-2 text-sm">Join the AI Recruiting platform</p>
        </div>

        {/* Signup Card */}
        <div className="glass-card-glow p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-ai-red/10 border border-ai-red/20 text-ai-red text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-10 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-ai-violet focus:ring-1 focus:ring-ai-violet/50 text-white transition-all placeholder:text-muted-foreground/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-ai-violet focus:ring-1 focus:ring-ai-violet/50 text-white transition-all placeholder:text-muted-foreground/50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-ai-violet focus:ring-1 focus:ring-ai-violet/50 text-white transition-all placeholder:text-muted-foreground/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-ai-violet focus:ring-1 focus:ring-ai-violet/50 text-white transition-all placeholder:text-muted-foreground/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-ai-violet focus:ring-1 focus:ring-ai-violet/50 text-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Recruiter" className="bg-background text-white">Recruiter</option>
                  <option value="HR" className="bg-background text-white">HR</option>
                  <option value="Company" className="bg-background text-white">Company</option>
                  <option value="Student" className="bg-background text-white">Student</option>
                  <option value="Admin" className="bg-background text-white">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-ai-violet focus:ring-ai-violet focus:ring-offset-background"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug">
                I agree to the <a href="#" className="text-ai-cyan hover:underline">Terms of Service</a> and <a href="#" className="text-ai-cyan hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 btn-gradient flex items-center justify-center font-medium mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-ai-cyan hover:text-ai-violet transition-colors font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
