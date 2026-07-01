'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Github, FileText, 
  BrainCircuit, Users, CheckCircle, ChevronDown
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a', color: '#f0f0f0', fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

        .nav-link {
          color: #ccc;
          font-size: 0.875rem;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #ff4444; }

        .btn-red {
          background: #dc2626;
          color: white;
          border: 1px solid #dc2626;
          padding: 0.65rem 1.75rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          display: inline-block;
          white-space: nowrap;
        }
        .btn-red:hover { background: #b91c1c; border-color: #b91c1c; }

        .btn-outline {
          background: transparent;
          color: #f0f0f0;
          border: 1px solid #444;
          padding: 0.65rem 1.75rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          display: inline-block;
          white-space: nowrap;
        }
        .btn-outline:hover { border-color: #dc2626; color: #ff4444; background: rgba(220,38,38,0.07); }

        .feature-card {
          padding: 2rem;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: #2a2a2a;
        }

        .step-num {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: #dc2626;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.6s ease both; }
        .delay-1   { animation-delay: 0.15s; }
        .delay-2   { animation-delay: 0.3s; }

        a { text-decoration: none; }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid #1e1e1e', background: '#111', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', height: '52px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, marginRight: '0.5rem' }}>
            <div style={{ width: 28, height: 28, background: '#dc2626', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} color="white" />
            </div>
            <span style={{ borderLeft: '1px solid #333', paddingLeft: '0.75rem', fontWeight: '600', fontSize: '1rem', color: '#f0f0f0', letterSpacing: '-0.01em' }}>
              AI Recruiter
            </span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <span className="nav-link" onClick={() => router.push('/apply')}>Candidates <ChevronDown size={12} /></span>
            <span className="nav-link" onClick={() => router.push('/recruiter')}>Recruiters <ChevronDown size={12} /></span>
            <span className="nav-link" onClick={() => router.push('/features')}>Features</span>
            <span className="nav-link" onClick={() => router.push('/pricing')}>Pricing</span>
            <span className="nav-link" onClick={() => router.push('/about')}>About</span>
            <span className="nav-link" onClick={() => router.push('/contact')}>Contact</span>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            <span className="nav-link" onClick={() => router.push('/login')}>Sign in</span>
            <button className="btn-red" onClick={() => router.push('/apply')} style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #130a0a 50%, #0d0a0a 100%)', padding: '5rem 1.5rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background glow */}
        <div style={{ position: 'absolute', top: '-10%', left: '5%', width: '40%', height: '70%', background: 'radial-gradient(ellipse, rgba(220,38,38,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: '30%', height: '60%', background: 'radial-gradient(ellipse, rgba(220,38,38,0.07) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem', position: 'relative', zIndex: 1 }}>
          {/* Left: Text */}
          <div style={{ flex: '1', minWidth: 0 }} className="fade-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.9rem', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '2px', fontSize: '0.78rem', color: '#f87171', marginBottom: '1.5rem', fontWeight: '500' }}>
              <ShieldCheck size={13} />
              Algorithmic screening · Zero LLM bias
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.9rem)', fontWeight: '700', lineHeight: '1.12', color: '#f0f0f0', marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
              Screen candidates<br />smarter with<br /><span style={{ color: '#dc2626' }}>AI-powered recruiting</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#888', lineHeight: '1.75', marginBottom: '2.25rem', maxWidth: '460px' }}>
              Automate technical screening using verifiable data. Cross-reference resume claims against real GitHub activity and enforce strict anti-cheat testing.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-red" onClick={() => router.push('/apply')}>
                Apply as candidate →
              </button>
              <button className="btn-outline" onClick={() => router.push('/recruiter')}>
                Recruiter dashboard
              </button>
            </div>
          </div>

          {/* Right: Inline Dashboard Mockup */}
          <div style={{ flex: '1.15', minWidth: 0, display: 'flex', justifyContent: 'flex-end' }} className="fade-up delay-2">
            <div style={{ width: '100%', maxWidth: '580px', background: '#161616', borderRadius: '6px', boxShadow: '0 20px 80px rgba(0,0,0,0.6), 0 0 0 1px #222', overflow: 'hidden' }}>
              {/* Browser chrome */}
              <div style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a', padding: '0.55rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#444' }}></div>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#444' }}></div>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#444' }}></div>
                </div>
                <div style={{ flex: 1, background: '#0f0f0f', borderRadius: '3px', padding: '2px 10px', fontSize: '0.65rem', color: '#555', border: '1px solid #2a2a2a' }}>ai-recruiter.onrender.com/recruiter-dashboard</div>
              </div>
              {/* Dashboard UI */}
              <div style={{ padding: '1.1rem', display: 'flex', gap: '0.75rem' }}>
                {/* Sidebar */}
                <div style={{ width: '100px', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: '600', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</div>
                  {['Dashboard', 'Candidates', 'Reports', 'Settings'].map((item, i) => (
                    <div key={i} style={{ padding: '0.3rem 0.5rem', borderRadius: '3px', fontSize: '0.68rem', color: i === 0 ? 'white' : '#666', background: i === 0 ? '#dc2626' : 'transparent', marginBottom: '2px', cursor: 'default' }}>{item}</div>
                  ))}
                </div>
                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#ddd' }}>Candidate Pipeline</div>
                    <div style={{ fontSize: '0.6rem', color: '#555', background: '#1e1e1e', padding: '2px 8px', borderRadius: '3px' }}>4 active</div>
                  </div>
                  {[
                    { name: 'Priya Sharma', domain: 'Frontend', score: 92, status: 'Shortlisted', sc: '#22c55e' },
                    { name: 'Alex Johnson', domain: 'Backend', score: 78, status: 'In Review', sc: '#3b82f6' },
                    { name: 'Rahul Verma',  domain: 'DevOps',  score: 65, status: 'Applied',    sc: '#888' },
                    { name: 'Mei Chen',     domain: 'ML/AI',   score: 88, status: 'Shortlisted', sc: '#22c55e' },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.38rem 0.5rem', borderRadius: '3px', marginBottom: '3px', background: i % 2 === 0 ? '#1a1a1a' : '#161616', fontSize: '0.66rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#2a0a0a', border: '1px solid #3a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: '700', color: '#dc2626', flexShrink: 0 }}>{c.name[0]}</div>
                      <span style={{ flex: 1, color: '#ccc', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ color: '#555', fontSize: '0.58rem', flexShrink: 0 }}>{c.domain}</span>
                      <div style={{ width: '44px', height: '3px', background: '#222', borderRadius: '2px', flexShrink: 0 }}>
                        <div style={{ width: `${c.score}%`, height: '100%', background: '#dc2626', borderRadius: '2px' }}></div>
                      </div>
                      <span style={{ color: '#aaa', minWidth: '20px', textAlign: 'right', flexShrink: 0 }}>{c.score}</span>
                      <span style={{ color: c.sc, background: c.sc + '18', padding: '1px 5px', borderRadius: '2px', flexShrink: 0, whiteSpace: 'nowrap', border: `1px solid ${c.sc}33` }}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ──────────────────────────────────────────── */}
      <section style={{ background: '#111', borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: '#555', flexShrink: 0 }}>Built for modern hiring teams:</span>
          {['Zero LLM bias', '100% rule-based', 'Anti-cheat proctoring', 'GitHub verification', 'Instant scoring'].map((tag) => (
            <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#888' }}>
              <CheckCircle size={12} color="#dc2626" />
              {tag}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Why AI Recruiter?</h2>
            <p style={{ fontSize: '0.95rem', color: '#666', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>Traditional recruiting is broken. Resumes are inflated, and manual screening takes too long. Our platform solves this.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0' }}>
            {[
              { icon: <Activity size={22} color="#dc2626" />, title: 'Data-Driven Verification', desc: 'We pull live GitHub data to verify claimed languages, repo impact, and commit frequency. No more resume guesswork.' },
              { icon: <ShieldCheck size={22} color="#dc2626" />, title: 'Strict Anti-Cheat', desc: 'Our testing engine monitors tab switches, devtools, and copy/paste actions to ensure absolute integrity during assessments.' },
              { icon: <Zap size={22} color="#dc2626" />, title: 'Instant Scoring', desc: 'Rule-based scoring aggregates resume keywords, GitHub metrics, and test results into one final, actionable score.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: '44px', height: '44px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.65' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>How It Works</h2>
            <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.7' }}>A seamless experience from application to final shortlist.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { icon: <FileText size={18} />, title: 'Resume Parsing', desc: 'Candidates upload their PDF resume. Our system extracts skills, experience, and GitHub links automatically.' },
              { icon: <Github size={18} />, title: 'GitHub Audit', desc: 'We query the GitHub API to fact-check technical claims and evaluate public code activity — no self-reporting bias.' },
              { icon: <BrainCircuit size={18} />, title: 'Proctored Test', desc: 'Candidates take a secure, domain-specific multiple-choice test with strict anti-cheat monitoring in place.' },
              { icon: <CheckCircle size={18} />, title: 'Recruiter Review', desc: 'Shortlisted candidates appear in the dashboard with full score breakdowns, ready for a final human interview.' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '1.5rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px' }}>
                <div className="step-num">{i + 1}</div>
                <div style={{ flex: 1, paddingTop: '0.3rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '0.4rem' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.86rem', color: '#666', lineHeight: '1.65' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', background: '#dc2626' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { num: '10x', label: 'Faster Screening' },
            { num: '0%', label: 'LLM Hallucination' },
            { num: '100%', label: 'Rule-Based Integrity' },
            { num: '24/7', label: 'Automated Processing' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '0.4rem', letterSpacing: '-0.03em' }}>{s.num}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: '#0a0a0a', textAlign: 'center', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: '700', color: '#f0f0f0', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Ready to streamline your hiring?</h2>
          <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.75', marginBottom: '2rem' }}>Join forward-thinking engineering teams using AI Recruiter to find top talent based on verifiable data, not keyword-stuffed resumes.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-red" onClick={() => router.push('/apply')}>Apply as candidate</button>
            <button className="btn-outline" onClick={() => router.push('/recruiter')}>Go to dashboard</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: '#080808', borderTop: '1px solid #1a1a1a', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 24, height: 24, background: '#dc2626', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={13} color="white" />
            </div>
            <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.95rem' }}>AI Recruiter</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#444' }}>© {new Date().getFullYear()} Zingo. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem' }}>
            {['Privacy', 'Terms', 'Contact', 'Status', 'Security'].map(link => (
              <a key={link} href="#" style={{ color: '#444', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#dc2626'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#444'}>{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
