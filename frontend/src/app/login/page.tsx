"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight, EyeOff, Eye, Cpu, Users, Briefcase } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") || "recruiter") as "candidate" | "recruiter";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCandidate = role === "candidate";
  const accentColor = isCandidate ? "#2a5bff" : "#ff2a75";
  const accentGlow = isCandidate ? "rgba(42,91,255,0.3)" : "rgba(255,42,117,0.3)";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isCandidate) {
        // Candidate login
        const res = await fetch(`${API_BASE}/api/candidate/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        router.push("/candidate-dashboard");
      } else {
        // Recruiter login
        const res = await fetch(`${API_BASE}/api/recruiter/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        router.push("/recruiter-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[120px] animate-pulse pointer-events-none"
        style={{ background: isCandidate ? "rgba(42,91,255,0.2)" : "rgba(139,92,246,0.2)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[100px] animate-pulse pointer-events-none"
        style={{ background: isCandidate ? "rgba(46,204,113,0.1)" : "rgba(6,182,212,0.1)" }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl p-[1px] mb-4"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #8b5cf6)`, boxShadow: `0 0 30px ${accentGlow}` }}
          >
            <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
              {isCandidate ? <Users className="w-8 h-8" style={{ color: accentColor }} /> : <Briefcase className="w-8 h-8" style={{ color: accentColor }} />}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in as a <span className="font-semibold" style={{ color: accentColor }}>{isCandidate ? "Candidate" : "Recruiter"}</span>
          </p>
        </div>

        {/* Role switcher tabs */}
        <div className="flex mb-6 bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => router.push("/login?role=candidate")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={isCandidate ? { background: accentColor, color: "#fff" } : { color: "#a0a5b5" }}
          >
            👤 Candidate
          </button>
          <button
            onClick={() => router.push("/login?role=recruiter")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={!isCandidate ? { background: accentColor, color: "#fff" } : { color: "#a0a5b5" }}
          >
            💼 Recruiter
          </button>
        </div>

        {/* Login Card */}
        <div className="glass-card-glow p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 text-white transition-all placeholder:text-muted-foreground/50"
                  style={{ borderColor: email ? accentColor : undefined }}
                  placeholder={isCandidate ? "you@example.com" : "recruiter@company.com"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: accentColor }}>
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 text-white transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center font-semibold rounded-xl mt-4 transition-all hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #8b5cf6)`, color: "#fff", boxShadow: `0 4px 20px ${accentGlow}` }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In as {isCandidate ? "Candidate" : "Recruiter"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href={`/signup?role=${role}`}
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: accentColor }}
              >
                Sign Up as {isCandidate ? "Candidate" : "Recruiter"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
