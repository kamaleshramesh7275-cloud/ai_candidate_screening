'use client';

import { useRouter } from 'next/navigation';
import { 
  Activity, ShieldCheck, Zap, Github, FileText, BrainCircuit, 
  Users, CheckCircle, BarChart2, Lock, Globe, ChevronDown, ArrowRight
} from 'lucide-react';

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0f0f0', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; box-sizing: border-box; }
        .nav-link { color: #ccc; font-size: 0.875rem; display: flex; align-items: center; gap: 4px; cursor: pointer; transition: color 0.15s; white-space: nowrap; }
        .nav-link:hover { color: #dc2626; }
        .btn-red { background: #dc2626; color: white; border: 1px solid #dc2626; padding: 0.65rem 1.75rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .btn-red:hover { background: #b91c1c; }
        .btn-outline { background: transparent; color: #f0f0f0; border: 1px solid #444; padding: 0.65rem 1.75rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .btn-outline:hover { border-color: #dc2626; color: #f87171; }
        .feature-card { padding: 2rem; border: 1px solid #1e1e1e; background: #111; transition: all 0.2s; border-radius: 4px; }
        .feature-card:hover { border-color: rgba(220,38,38,0.4); background: #161616; transform: translateY(-2px); }
        a { text-decoration: none; }
      `}</style>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #1e1e1e', background: '#111', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', height: '52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, marginRight: '0.5rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{ width: 28, height: 28, background: '#dc2626', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={16} color="white" /></div>
            <span style={{ borderLeft: '1px solid #333', paddingLeft: '0.75rem', fontWeight: '600', fontSize: '1rem', color: '#f0f0f0' }}>AI Recruiter</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <span className="nav-link" onClick={() => router.push('/apply')}>Candidates</span>
            <span className="nav-link" onClick={() => router.push('/recruiter')}>Recruiters</span>
            <span className="nav-link" style={{ color: '#dc2626' }}>Features</span>
            <span className="nav-link" onClick={() => router.push('/pricing')}>Pricing</span>
            <span className="nav-link" onClick={() => router.push('/about')}>About</span>
            <span className="nav-link" onClick={() => router.push('/contact')}>Contact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            <span className="nav-link" onClick={() => router.push('/login')}>Sign in</span>
            <button className="btn-red" onClick={() => router.push('/apply')} style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>Get started free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center', borderBottom: '1px solid #1a1a1a', background: 'linear-gradient(180deg, #0d0505 0%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(220,38,38,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.9rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '2px', fontSize: '0.78rem', color: '#f87171', marginBottom: '1.5rem' }}>
            Platform Features
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700', color: '#f0f0f0', marginBottom: '1.25rem', lineHeight: '1.12', letterSpacing: '-0.025em' }}>
            Everything you need to <span style={{ color: '#dc2626' }}>hire smarter</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: '1.75', maxWidth: '560px', margin: '0 auto 2rem' }}>
            AI Recruiter is packed with powerful, rule-based tools that eliminate bias and automate the most time-consuming parts of technical hiring.
          </p>
        </div>
      </section>

      {/* Core Feature Grid */}
      <section style={{ padding: '5rem 1.5rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.5rem' }}>Core Capabilities</h2>
          <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '2.5rem' }}>A complete recruiting engine — from resume intake to final shortlist.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {[
              { icon: <FileText size={22} color="#dc2626" />, title: 'Smart Resume Parsing', desc: 'Upload any PDF resume. Our system instantly extracts candidate name, email, skills, experience, and GitHub/LinkedIn links — no manual data entry required.' },
              { icon: <Github size={22} color="#dc2626" />, title: 'Live GitHub Audit', desc: 'We query the GitHub API in real time to verify claimed programming languages, repository quality, commit frequency, and open-source contributions.' },
              { icon: <ShieldCheck size={22} color="#dc2626" />, title: 'Anti-Cheat Proctoring', desc: 'Fullscreen enforcement, tab-switch detection, copy/paste blocking, and DevTools monitoring ensure assessments reflect the candidate\'s true skill level.' },
              { icon: <BrainCircuit size={22} color="#dc2626" />, title: 'Domain-Specific MCQ Tests', desc: 'Candidates are automatically assigned tests in their declared domain: Frontend, Backend, DevOps, ML/AI, Mobile, or General CS — with randomised questions each time.' },
              { icon: <Zap size={22} color="#dc2626" />, title: 'Algorithmic Scoring Engine', desc: 'A transparent, weighted formula combines resume keyword scores (30%), GitHub metrics (30%), and test performance (40%) into one final hiring score.' },
              { icon: <BarChart2 size={22} color="#dc2626" />, title: 'Recruiter Dashboard', desc: 'A real-time dashboard lets recruiters view all candidates, filter by domain or status, read score breakdowns, add notes, and update hiring decisions.' },
              { icon: <Lock size={22} color="#dc2626" />, title: 'Secure Auth & JWT', desc: 'Candidate and recruiter sessions are protected with bcrypt-hashed passwords and short-lived JSON Web Tokens — no third-party auth dependencies.' },
              { icon: <Activity size={22} color="#dc2626" />, title: 'Cheat Strike Logging', desc: 'Every anti-cheat violation is timestamped and stored per candidate. Recruiters can review the full cheat log alongside each candidate\'s test score.' },
              { icon: <Globe size={22} color="#dc2626" />, title: 'Cloud-Ready Deployment', desc: 'Built as a single unified service deployable to Render, Railway, or any Node.js-compatible cloud platform with PostgreSQL support. Zero Docker required.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: '42px', height: '42px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.83rem', color: '#666', lineHeight: '1.65' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: '5rem 1.5rem', background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.5rem', textAlign: 'center' }}>AI Recruiter vs. Traditional Hiring</h2>
          <p style={{ fontSize: '0.9rem', color: '#555', textAlign: 'center', marginBottom: '2.5rem' }}>See exactly what you gain by switching from manual screening.</p>
          <div style={{ border: '1px solid #1e1e1e', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#161616', borderBottom: '1px solid #1e1e1e' }}>
              <div style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem', fontWeight: '600', color: '#777', textTransform: 'uppercase' }}>Feature</div>
              <div style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem', fontWeight: '600', color: '#dc2626', textTransform: 'uppercase', textAlign: 'center' }}>AI Recruiter</div>
              <div style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem', fontWeight: '600', color: '#555', textTransform: 'uppercase', textAlign: 'center' }}>Manual Hiring</div>
            </div>
            {[
              ['Resume Verification', '✓ Automated via GitHub', '✗ Trust-based only'],
              ['Anti-Cheat Testing', '✓ Real-time proctoring', '✗ No monitoring'],
              ['Scoring Transparency', '✓ Rule-based, auditable', '✗ Subjective opinion'],
              ['Time to Shortlist', '✓ Under 10 minutes', '✗ Days to weeks'],
              ['LLM Hallucination Risk', '✓ Zero — no LLMs used', '✗ High if using AI tools'],
              ['Cost per Candidate', '✓ Near zero (automated)', '✗ Hours of recruiter time'],
            ].map(([feature, ai, manual], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < 5 ? '1px solid #1a1a1a' : 'none', background: i % 2 === 0 ? '#0f0f0f' : '#0a0a0a' }}>
                <div style={{ padding: '0.85rem 1.25rem', fontSize: '0.83rem', color: '#aaa' }}>{feature}</div>
                <div style={{ padding: '0.85rem 1.25rem', fontSize: '0.83rem', color: '#4ade80', textAlign: 'center' }}>{ai}</div>
                <div style={{ padding: '0.85rem 1.25rem', fontSize: '0.83rem', color: '#555', textAlign: 'center' }}>{manual}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', background: '#dc2626', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>Ready to experience these features?</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '2rem', fontSize: '0.95rem' }}>Sign up free and run your first candidate screening in minutes.</p>
        <button style={{ background: 'white', color: '#dc2626', border: 'none', padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.15s' }} onClick={() => router.push('/apply')}>
          Get started free →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: '#080808', borderTop: '1px solid #1a1a1a', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', color: '#444' }}>© {new Date().getFullYear()} Zingo. All rights reserved.</p>
      </footer>
    </div>
  );
}
