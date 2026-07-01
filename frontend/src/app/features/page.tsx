'use client';

import { useRouter } from 'next/navigation';
import { 
  Activity, ShieldCheck, Zap, Github, FileText, BrainCircuit, 
  Users, CheckCircle, BarChart2, Lock, Globe, MonitorPlay
} from 'lucide-react';

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#090a0f', color: '#ffffff', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; box-sizing: border-box; }
        .bg-gradient-main {
          background: radial-gradient(circle at 15% 50%, rgba(103, 31, 163, 0.4), transparent 50%),
                      radial-gradient(circle at 85% 30%, rgba(31, 75, 163, 0.3), transparent 50%),
                      radial-gradient(circle at 50% 80%, rgba(255, 42, 117, 0.15), transparent 50%),
                      #090a0f;
        }
        .nav-link { color: #a0a5b5; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 4px; cursor: pointer; transition: color 0.2s; white-space: nowrap; }
        .nav-link:hover { color: #ffffff; }
        .btn-pink { background: #ff2a75; color: white; border: none; padding: 0.75rem 1.75rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border-radius: 4px; box-shadow: 0 4px 14px 0 rgba(255, 42, 117, 0.39); }
        .btn-pink:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255, 42, 117, 0.5); }
        .feature-card { padding: 2.5rem 2rem; border: 1px solid #1c1e2e; background: rgba(21, 23, 37, 0.6); backdrop-filter: blur(10px); transition: all 0.3s; border-radius: 8px; }
        .feature-card:hover { background: rgba(21, 23, 37, 0.9); border-color: #2a5bff; transform: translateY(-4px); }
        a { text-decoration: none; }
      `}</style>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(9, 10, 15, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, marginRight: '1rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(45deg, #2a5bff, #ff2a75)' }}></div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #a0a5b5', marginLeft: '-8px' }}></div>
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#ffffff', letterSpacing: '0.5px' }}>
              ZINGO<span style={{ fontWeight: '300' }}>RECRUIT</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <span className="nav-link" onClick={() => router.push('/apply')}>Candidates</span>
            <span className="nav-link" onClick={() => router.push('/recruiter')}>Recruiters</span>
            <span className="nav-link" style={{ color: '#ffffff' }}>Features</span>
            <span className="nav-link" onClick={() => router.push('/pricing')}>Pricing</span>
            <span className="nav-link" onClick={() => router.push('/about')}>About</span>
            <span className="nav-link" onClick={() => router.push('/contact')}>Contact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
            <span className="nav-link" onClick={() => router.push('/login')}>Sign in</span>
            <button className="btn-pink" onClick={() => router.push('/apply')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>GET STARTED</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-main" style={{ padding: '6rem 1.5rem 4rem', textAlign: 'center', borderBottom: '1px solid #1c1e2e', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.8rem', color: '#ff2a75', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            CORE CAPABILITIES
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', color: '#ffffff', marginBottom: '1.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
            EVERYTHING YOU NEED<br />TO <span style={{ color: '#2a5bff' }}>HIRE SMARTER</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a0a5b5', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 2rem', fontWeight: '400' }}>
            AI Recruiter is packed with powerful, rule-based tools that eliminate bias and automate the most time-consuming parts of technical hiring.
          </p>
        </div>
      </section>

      {/* Core Feature Grid */}
      <section style={{ padding: '6rem 1.5rem', background: '#090a0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <FileText size={24} color="#ff2a75" />, title: 'Smart Resume Parsing', desc: 'Upload any PDF resume. Our system instantly extracts candidate name, email, skills, experience, and GitHub/LinkedIn links — no manual data entry required.' },
              { icon: <Github size={24} color="#2a5bff" />, title: 'Live GitHub Audit', desc: 'We query the GitHub API in real time to verify claimed programming languages, repository quality, commit frequency, and open-source contributions.' },
              { icon: <ShieldCheck size={24} color="#2ecc71" />, title: 'Anti-Cheat Proctoring', desc: 'Fullscreen enforcement, tab-switch detection, copy/paste blocking, and DevTools monitoring ensure assessments reflect the candidate\'s true skill level.' },
              { icon: <BrainCircuit size={24} color="#9b59b6" />, title: 'Domain-Specific Tests', desc: 'Candidates are automatically assigned tests in their declared domain: Frontend, Backend, DevOps, ML/AI, Mobile, or General CS — with randomised questions each time.' },
              { icon: <Zap size={24} color="#e67e22" />, title: 'Algorithmic Scoring Engine', desc: 'A transparent, weighted formula combines resume keyword scores (30%), GitHub metrics (30%), and test performance (40%) into one final hiring score.' },
              { icon: <BarChart2 size={24} color="#ff2a75" />, title: 'Recruiter Dashboard', desc: 'A real-time dashboard lets recruiters view all candidates, filter by domain or status, read score breakdowns, add notes, and update hiring decisions.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#a0a5b5', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#050608', borderTop: '1px solid #1c1e2e', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(45deg, #2a5bff, #ff2a75)' }}></div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #a0a5b5', marginLeft: '-6px' }}></div>
            </div>
            <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem', letterSpacing: '0.5px' }}>ZINGORECRUIT</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6a6d82' }}>© {new Date().getFullYear()} Zingo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
