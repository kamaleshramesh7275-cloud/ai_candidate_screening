'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Github, FileText, 
  BrainCircuit, Users, CheckCircle, ChevronDown, MonitorPlay
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#090a0f', color: '#ffffff', fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

        .bg-gradient-main {
          background: radial-gradient(circle at 15% 50%, rgba(103, 31, 163, 0.4), transparent 50%),
                      radial-gradient(circle at 85% 30%, rgba(31, 75, 163, 0.3), transparent 50%),
                      radial-gradient(circle at 50% 80%, rgba(255, 42, 117, 0.15), transparent 50%),
                      #090a0f;
        }

        .nav-link {
          color: #a0a5b5;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #ffffff; }

        .btn-pink {
          background: #ff2a75;
          color: white;
          border: none;
          padding: 0.75rem 1.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-block;
          white-space: nowrap;
          border-radius: 4px;
          box-shadow: 0 4px 14px 0 rgba(255, 42, 117, 0.39);
        }
        .btn-pink:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255, 42, 117, 0.5); }

        .btn-blue {
          background: #2a5bff;
          color: white;
          border: none;
          padding: 0.75rem 1.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-block;
          white-space: nowrap;
          border-radius: 4px;
          box-shadow: 0 4px 14px 0 rgba(42, 91, 255, 0.39);
        }
        .btn-blue:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(42, 91, 255, 0.5); }
        
        .btn-outline {
          background: transparent;
          color: #ffffff;
          border: 1px solid #4a4d65;
          padding: 0.75rem 1.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-block;
          white-space: nowrap;
          border-radius: 4px;
        }
        .btn-outline:hover { border-color: #a0a5b5; background: rgba(255,255,255,0.05); }

        .feature-card {
          padding: 2rem;
          border: 1px solid #1c1e2e;
          background: rgba(21, 23, 37, 0.6);
          backdrop-filter: blur(10px);
          transition: all 0.3s;
          border-radius: 8px;
        }
        .feature-card:hover {
          background: rgba(21, 23, 37, 0.9);
          border-color: #2a5bff;
          transform: translateY(-4px);
        }

        .step-num {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #2a5bff, #ff2a75);
          color: white;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(255, 42, 117, 0.3);
        }

        .stat-value {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 0.2rem;
          letter-spacing: -0.02em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .delay-1   { animation-delay: 0.15s; }
        .delay-2   { animation-delay: 0.3s; }

        a { text-decoration: none; }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(9, 10, 15, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', height: '64px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, marginRight: '1rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(45deg, #2a5bff, #ff2a75)' }}></div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #a0a5b5', marginLeft: '-8px' }}></div>
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#ffffff', letterSpacing: '0.5px' }}>
              ZINGO<span style={{ fontWeight: '300' }}>RECRUIT</span>
            </span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <span className="nav-link" onClick={() => router.push('/apply')}>Candidates</span>
            <span className="nav-link" onClick={() => router.push('/recruiter')}>Recruiters</span>
            <span className="nav-link" onClick={() => router.push('/features')}>Features</span>
            <span className="nav-link" onClick={() => router.push('/pricing')}>Pricing</span>
            <span className="nav-link" onClick={() => router.push('/about')}>About</span>
            <span className="nav-link" onClick={() => router.push('/contact')}>Contact</span>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
            <span className="nav-link" onClick={() => router.push('/login')}>Sign in</span>
            <button className="btn-pink" onClick={() => router.push('/apply')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', boxShadow: 'none' }}>
              GET STARTED
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="bg-gradient-main" style={{ padding: '6rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem', position: 'relative', zIndex: 1 }}>
          {/* Left: Text */}
          <div style={{ flex: '1', minWidth: 0 }} className="fade-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(255, 42, 117, 0.1)', border: '1px solid rgba(255, 42, 117, 0.2)', borderRadius: '20px', fontSize: '0.75rem', color: '#ff2a75', marginBottom: '1.5rem', fontWeight: '600', letterSpacing: '0.5px' }}>
              <ShieldCheck size={14} />
              ALGORITHMIC SCREENING · ZERO LLM BIAS
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', lineHeight: '1.1', color: '#ffffff', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              SCREEN CANDIDATES<br />SMARTER WITH<br /><span style={{ background: 'linear-gradient(90deg, #ffffff, #a0a5b5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI-POWERED DATA.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#a0a5b5', lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '480px', fontWeight: '400' }}>
              Join us in revolutionizing hiring. Automate technical screening using verifiable data. Cross-reference resume claims against real GitHub activity and enforce strict anti-cheat testing.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-blue" onClick={() => router.push('/apply')}>
                APPLY AS CANDIDATE
              </button>
              <button className="btn-outline" onClick={() => router.push('/recruiter')}>
                RECRUITER DASHBOARD
              </button>
            </div>
          </div>

          {/* Right: Abstract UI / Video representation */}
          <div style={{ flex: '1.15', minWidth: 0, display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }} className="fade-up delay-1">
            <div style={{ width: '100%', maxWidth: '600px', height: '340px', background: 'rgba(15, 17, 26, 0.8)', border: '1px solid #2a2d45', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '15px', left: '20px', display: 'flex', gap: '6px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4a4d65' }}></div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4a4d65' }}></div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4a4d65' }}></div>
              </div>
              <MonitorPlay size={64} color="#2a5bff" opacity={0.5} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: '40%', height: '100%', background: '#ff2a75', borderRadius: '2px' }}></div>
              </div>
            </div>
            
            {/* Stats blocks below video */}
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '600px', justifyContent: 'center' }}>
               {[
                 { v: '79', l: 'DAYS' },
                 { v: '02', l: 'HOURS' },
                 { v: '34', l: 'MIN' },
                 { v: '57', l: 'SEC' }
               ].map((t, i) => (
                 <div key={i} style={{ background: 'rgba(26, 32, 60, 0.6)', border: '1px solid rgba(42, 91, 255, 0.2)', padding: '1rem 1.5rem', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
                   <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff' }}>{t.v}</div>
                   <div style={{ fontSize: '0.65rem', color: '#a0a5b5', letterSpacing: '1px', marginTop: '4px' }}>{t.l}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION (Stats Style) ────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', background: '#090a0f', position: 'relative' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Abstract Images placeholder */}
            <div style={{ flex: 1, minWidth: '300px', position: 'relative', height: '400px' }}>
               <div style={{ position: 'absolute', top: '10%', left: '10%', width: '200px', height: '200px', background: '#ff2a75', borderRadius: '8px', opacity: 0.8 }}></div>
               <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '200px', height: '200px', background: '#2a5bff', borderRadius: '8px', opacity: 0.8 }}></div>
               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '220px', height: '250px', background: '#1c1e2e', border: '2px solid #2a2d45', borderRadius: '8px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Users size={64} color="#a0a5b5" />
               </div>
            </div>

            {/* Text & Stats */}
            <div style={{ flex: 1, minWidth: '300px' }}>
               <div style={{ fontSize: '0.75rem', color: '#2a5bff', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>DATE: 04-17-2026</div>
               <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', color: '#ffffff', marginBottom: '1.5rem' }}>ABOUT AI RECRUITER PLATFORM</h2>
               <p style={{ color: '#a0a5b5', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                 Design plays an integral role in creating a memorable and successful hiring event. As a recruiter, it's important to consider the candidate's skills, goals, and target audience when crafting the screening process. From choosing the right tests to deciding on the perfect scores.
               </p>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  <div>
                     <div className="stat-value" style={{ color: '#ff2a75' }}>40+</div>
                     <div style={{ fontSize: '0.75rem', color: '#a0a5b5', letterSpacing: '0.5px' }}>Domains</div>
                  </div>
                  <div>
                     <div className="stat-value" style={{ color: '#2ecc71' }}>2.5K+</div>
                     <div style={{ fontSize: '0.75rem', color: '#a0a5b5', letterSpacing: '0.5px' }}>Candidates</div>
                  </div>
                  <div>
                     <div className="stat-value" style={{ color: '#9b59b6' }}>36+</div>
                     <div style={{ fontSize: '0.75rem', color: '#a0a5b5', letterSpacing: '0.5px' }}>Companies</div>
                  </div>
                  <div>
                     <div className="stat-value" style={{ color: '#e67e22' }}>30+</div>
                     <div style={{ fontSize: '0.75rem', color: '#a0a5b5', letterSpacing: '0.5px' }}>Sponsors</div>
                  </div>
               </div>

               <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                 <button className="btn-blue">JOIN THE PLATFORM</button>
                 <button className="btn-outline">LEARN MORE</button>
               </div>
            </div>
         </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', background: '#0d0e15', borderTop: '1px solid #1c1e2e' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>WHY CHOOSE US?</h2>
            <p style={{ fontSize: '1rem', color: '#a0a5b5', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>Traditional recruiting is broken. Resumes are inflated, and manual screening takes too long. Our platform solves this.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Activity size={24} color="#ff2a75" />, title: 'Data-Driven Verification', desc: 'We pull live GitHub data to verify claimed languages, repo impact, and commit frequency. No more resume guesswork.' },
              { icon: <ShieldCheck size={24} color="#2a5bff" />, title: 'Strict Anti-Cheat', desc: 'Our testing engine monitors tab switches, devtools, and copy/paste actions to ensure absolute integrity during assessments.' },
              { icon: <Zap size={24} color="#2ecc71" />, title: 'Instant Scoring', desc: 'Rule-based scoring aggregates resume keywords, GitHub metrics, and test results into one final, actionable score.' },
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

      {/* ── FOOTER ─────────────────────────────────────────────── */}
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
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
            {['Privacy', 'Terms', 'Contact', 'Status', 'Security'].map(link => (
              <a key={link} href="#" style={{ color: '#a0a5b5', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#ff2a75'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#a0a5b5'}>{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
