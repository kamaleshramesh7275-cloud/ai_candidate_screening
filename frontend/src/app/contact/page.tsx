'use client';

import { useRouter } from 'next/navigation';
import { Users, Mail, Phone, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

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
        .contact-card { padding: 2rem; border: 1px solid #1c1e2e; background: rgba(21, 23, 37, 0.6); backdrop-filter: blur(10px); transition: all 0.3s; border-radius: 8px; }
        .contact-card:hover { border-color: #ff2a75; transform: translateY(-2px); }
        .form-input {
          width: 100%; background: rgba(21, 23, 37, 0.8); border: 1px solid #2a2d45; color: #ffffff;
          padding: 0.85rem 1rem; font-size: 0.9rem; border-radius: 4px;
          outline: none; transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #2a5bff; }
        .form-input::placeholder { color: #4a4d65; }
        label { font-size: 0.75rem; color: #a0a5b5; display: block; margin-bottom: 0.5rem; font-weight: 600; text-transform: uppercase; letterSpacing: 0.5px; }
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
            <span className="nav-link" onClick={() => router.push('/features')}>Features</span>
            <span className="nav-link" onClick={() => router.push('/pricing')}>Pricing</span>
            <span className="nav-link" onClick={() => router.push('/about')}>About</span>
            <span className="nav-link" style={{ color: '#ffffff' }}>Contact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
            <span className="nav-link" onClick={() => router.push('/login')}>Sign in</span>
            <button className="btn-pink" onClick={() => router.push('/apply')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>GET STARTED</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-main" style={{ padding: '6rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.8rem', color: '#ff2a75', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            GET IN TOUCH
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', color: '#ffffff', marginBottom: '1.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
            WE'D LOVE TO <br/><span style={{ color: '#2a5bff' }}>HEAR FROM YOU</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a0a5b5', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto', fontWeight: '400' }}>
            Whether you have a question about features, pricing, or just want to say hi — our team is ready to answer.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '4rem 1.5rem 6rem', background: 'transparent' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left: Contact Info */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>CONTACT INFORMATION</h2>
            <p style={{ fontSize: '0.95rem', color: '#a0a5b5', marginBottom: '2.5rem', lineHeight: '1.7' }}>
              Reach out directly or send us a message using the form. We typically respond within 24 hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
              <div className="contact-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', background: 'rgba(255, 42, 117, 0.1)', border: '1px solid rgba(255, 42, 117, 0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} color="#ff2a75" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6a6d82', marginBottom: '0.35rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</div>
                    <a href="mailto:kamaleshramesh7275@gmail.com" style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: '500' }}>kamaleshramesh7275@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="contact-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', background: 'rgba(42, 91, 255, 0.1)', border: '1px solid rgba(42, 91, 255, 0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} color="#2a5bff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6a6d82', marginBottom: '0.35rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone</div>
                    <a href="tel:+916383525774" style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: '500' }}>+91 6383525774</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div style={{ background: 'rgba(21, 23, 37, 0.6)', border: '1px solid #1c1e2e', borderRadius: '8px', padding: '3rem 2.5rem', backdropFilter: 'blur(10px)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle size={64} color="#2ecc71" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>MESSAGE SENT!</h3>
                <p style={{ fontSize: '0.95rem', color: '#a0a5b5', lineHeight: '1.7' }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '2rem', letterSpacing: '-0.02em' }}>SEND A MESSAGE</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
                    <textarea className="form-input" rows={6} placeholder="Tell us more..." required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn-blue" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '1rem', marginTop: '1rem' }}>
                    <Send size={18} /> SEND MESSAGE
                  </button>
                </form>
              </>
            )}
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
