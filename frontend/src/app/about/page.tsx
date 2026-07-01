'use client';

import { useRouter } from 'next/navigation';
import { Users, ShieldCheck, Zap, Github, Mail, Phone, MapPin } from 'lucide-react';

const team = [
  {
    name: 'Kamalesh Kumar',
    role: 'Team Lead',
    desc: 'Architect and lead developer of AI Recruiter. Passionate about building fair, transparent hiring systems powered by verifiable data.',
    initials: 'KK',
    badge: 'Lead',
    color: '#dc2626',
  },
  {
    name: 'Haritha',
    role: 'Frontend Developer',
    desc: 'Responsible for the candidate and recruiter UI experiences. Focused on accessibility, smooth animations, and clean design systems.',
    initials: 'H',
    badge: 'Member',
    color: '#7c3aed',
  },
  {
    name: 'Jayaruba',
    role: 'Backend Developer',
    desc: 'Handles API architecture, Prisma ORM integration, and PostgreSQL database design. Ensures the backend is scalable and secure.',
    initials: 'J',
    badge: 'Member',
    color: '#0891b2',
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0f0f0', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; box-sizing: border-box; }
        .nav-link { color: #ccc; font-size: 0.875rem; display: flex; align-items: center; gap: 4px; cursor: pointer; transition: color 0.15s; }
        .nav-link:hover { color: #dc2626; }
        .btn-red { background: #dc2626; color: white; border: 1px solid #dc2626; padding: 0.65rem 1.75rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .btn-red:hover { background: #b91c1c; }
        .team-card { background: #111; border: 1px solid #1e1e1e; border-radius: 6px; padding: 2rem; transition: all 0.2s; }
        .team-card:hover { border-color: rgba(220,38,38,0.35); transform: translateY(-3px); }
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
            <span className="nav-link" onClick={() => router.push('/features')}>Features</span>
            <span className="nav-link" onClick={() => router.push('/pricing')}>Pricing</span>
            <span className="nav-link" style={{ color: '#dc2626' }}>About</span>
            <span className="nav-link" onClick={() => router.push('/contact')}>Contact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            <span className="nav-link" onClick={() => router.push('/login')}>Sign in</span>
            <button className="btn-red" onClick={() => router.push('/apply')} style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>Get started free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center', background: 'linear-gradient(180deg, #0d0505 0%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(220,38,38,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.9rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '2px', fontSize: '0.78rem', color: '#f87171', marginBottom: '1.5rem' }}>
            Team Nova Legion · Built by Zingo
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700', color: '#f0f0f0', marginBottom: '1.25rem', lineHeight: '1.12', letterSpacing: '-0.025em' }}>
            We're on a mission to make <span style={{ color: '#dc2626' }}>hiring fair</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: '1.75' }}>
            AI Recruiter was built by Team Nova Legion — a small team of developers who believe that technical hiring should be based on verifiable data, not gut feelings or keyword-stuffed resumes.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '5rem 1.5rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Our Story</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.8', marginBottom: '1rem' }}>
              AI Recruiter started as a hackathon project built by Team Nova Legion under the Zingo banner. We were frustrated by how easy it was to inflate a resume and how hard it was for genuinely skilled candidates to stand out in a sea of keyword-stuffed PDFs.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.8', marginBottom: '1rem' }}>
              We built a rule-based screening system that verifies what candidates claim — by pulling real GitHub data and putting them through proctored, domain-specific assessments. No LLMs. No black boxes. Just transparent, auditable logic.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.8' }}>
              Today, AI Recruiter helps engineering teams screen candidates 10x faster while maintaining full integrity of the process.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { icon: <ShieldCheck size={22} color="#dc2626" />, title: 'Zero Bias', desc: 'Rule-based scoring leaves no room for unconscious bias.' },
              { icon: <Zap size={22} color="#dc2626" />, title: '10x Faster', desc: 'Automate what used to take days in under 10 minutes.' },
              { icon: <Github size={22} color="#dc2626" />, title: 'Verifiable Data', desc: 'Every resume claim is cross-checked with real GitHub activity.' },
              { icon: <Users size={22} color="#dc2626" />, title: 'Built for Teams', desc: 'Designed to work for both solo recruiters and large HR teams.' },
            ].map((v, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '1.25rem' }}>
                <div style={{ marginBottom: '0.6rem' }}>{v.icon}</div>
                <h3 style={{ fontSize: '0.88rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '0.3rem' }}>{v.title}</h3>
                <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: '1.5' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '5rem 1.5rem', background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.9rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '2px', fontSize: '0.75rem', color: '#f87171', marginBottom: '1rem' }}>Team Nova Legion</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>The people behind it</h2>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>A tight-knit team of developers who love clean code and fair hiring.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {team.map((member, i) => (
              <div key={i} className="team-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: member.color + '22', border: `2px solid ${member.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '700', color: member.color, flexShrink: 0 }}>
                    {member.initials}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#f0f0f0' }}>{member.name}</h3>
                      <span style={{ fontSize: '0.65rem', fontWeight: '600', color: member.color, background: member.color + '18', border: `1px solid ${member.color}33`, padding: '1px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>{member.badge}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '2px' }}>{member.role}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#666', lineHeight: '1.65' }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Snippet */}
      <section style={{ padding: '4rem 1.5rem', background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.5rem' }}>Get in touch</h2>
          <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '2rem' }}>Have questions about the platform or want to partner with us?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <a href="mailto:kamaleshramesh7275@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#f87171' }}>
              <Mail size={16} color="#dc2626" /> kamaleshramesh7275@gmail.com
            </a>
            <a href="tel:+916383525774" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#aaa' }}>
              <Phone size={16} color="#dc2626" /> +91 6383525774
            </a>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <button className="btn-red" onClick={() => router.push('/contact')}>
              Contact us →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#080808', borderTop: '1px solid #1a1a1a', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', color: '#444' }}>© {new Date().getFullYear()} Zingo. All rights reserved.</p>
      </footer>
    </div>
  );
}
