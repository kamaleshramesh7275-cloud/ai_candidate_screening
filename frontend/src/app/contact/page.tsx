'use client';

import { useRouter } from 'next/navigation';
import { Users, Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0f0f0', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; box-sizing: border-box; }
        .nav-link { color: #ccc; font-size: 0.875rem; display: flex; align-items: center; gap: 4px; cursor: pointer; transition: color 0.15s; }
        .nav-link:hover { color: #dc2626; }
        .btn-red { background: #dc2626; color: white; border: 1px solid #dc2626; padding: 0.65rem 1.75rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .btn-red:hover { background: #b91c1c; }
        .form-input {
          width: 100%; background: #111; border: 1px solid #2a2a2a; color: #f0f0f0;
          padding: 0.7rem 0.9rem; font-size: 0.875rem; border-radius: 3px;
          outline: none; transition: border-color 0.15s;
        }
        .form-input:focus { border-color: #dc2626; }
        .form-input::placeholder { color: #444; }
        label { font-size: 0.8rem; color: #888; display: block; margin-bottom: 0.4rem; font-weight: 500; }
        a { text-decoration: none; }
        .contact-card { background: #111; border: 1px solid #1e1e1e; border-radius: 6px; padding: 1.5rem; transition: all 0.2s; }
        .contact-card:hover { border-color: rgba(220,38,38,0.35); }
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
            <span className="nav-link" onClick={() => router.push('/about')}>About</span>
            <span className="nav-link" style={{ color: '#dc2626' }}>Contact</span>
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
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.9rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '2px', fontSize: '0.78rem', color: '#f87171', marginBottom: '1.5rem' }}>
            Get in touch
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700', color: '#f0f0f0', marginBottom: '1rem', lineHeight: '1.12', letterSpacing: '-0.025em' }}>
            We'd love to <span style={{ color: '#dc2626' }}>hear from you</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.75' }}>
            Whether you have a question about features, pricing, or just want to say hi — our team is ready to answer.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '4rem 1.5rem 6rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          
          {/* Left: Contact Info */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.5rem' }}>Contact Information</h2>
            <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '2rem', lineHeight: '1.65' }}>
              Reach out directly or send us a message using the form. We typically respond within 24 hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div className="contact-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={16} color="#dc2626" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</div>
                    <a href="mailto:kamaleshramesh7275@gmail.com" style={{ fontSize: '0.875rem', color: '#f87171' }}>kamaleshramesh7275@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="contact-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={16} color="#dc2626" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone</div>
                    <a href="tel:+916383525774" style={{ fontSize: '0.875rem', color: '#aaa' }}>+91 6383525774</a>
                  </div>
                </div>
              </div>

              <div className="contact-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={16} color="#dc2626" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Team</div>
                    <div style={{ fontSize: '0.875rem', color: '#aaa' }}>Nova Legion · Zingo</div>
                    <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '2px' }}>Lead: Kamalesh Kumar</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#555', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Quick Links</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: '→ View all features', route: '/features' },
                  { label: '→ See pricing plans', route: '/pricing' },
                  { label: '→ Meet the team', route: '/about' },
                  { label: '→ Apply as candidate', route: '/apply' },
                ].map((l) => (
                  <span key={l.label} style={{ fontSize: '0.83rem', color: '#555', cursor: 'pointer', transition: 'color 0.15s' }}
                    onClick={() => router.push(l.route)}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#dc2626'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = '#555'}>
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '2rem' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '0.5rem' }}>Message sent!</h3>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.25rem' }}>Send a message</h2>
                <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '1.75rem' }}>Fill out the form and we'll respond shortly.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label>Your Name</label>
                      <input className="form-input" type="text" placeholder="Kamalesh Kumar" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label>Email Address</label>
                      <input className="form-input" type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label>Subject</label>
                    <input className="form-input" type="text" placeholder="What's this about?" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div>
                    <label>Message</label>
                    <textarea className="form-input" rows={5} placeholder="Tell us more..." required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn-red" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem' }}>
                    <Send size={15} /> Send Message
                  </button>
                </form>
              </>
            )}
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
