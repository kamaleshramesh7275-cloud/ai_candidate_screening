'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, X, Users, Zap, ShieldCheck } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'Forever free',
    desc: 'Perfect for small teams testing the platform.',
    color: '#333',
    cta: 'Get started free',
    ctaRoute: '/apply',
    highlight: false,
    features: [
      'Up to 10 candidates/month',
      'Resume parsing',
      'GitHub audit',
      'Basic MCQ test (20 questions)',
      'Recruiter dashboard',
      'Email support',
      null,
      null,
    ],
  },
  {
    name: 'Pro',
    price: '₹2,499',
    sub: 'per month',
    desc: 'For growing engineering teams with active hiring needs.',
    color: '#dc2626',
    cta: 'Start free trial',
    ctaRoute: '/recruiter',
    highlight: true,
    features: [
      'Unlimited candidates',
      'Resume parsing',
      'GitHub audit',
      'Full MCQ test (50 questions)',
      'Recruiter dashboard',
      'Priority email support',
      'Anti-cheat cheat logs export',
      'CSV export of all candidates',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    sub: 'Contact us for pricing',
    desc: 'For large organisations with custom requirements.',
    color: '#888',
    cta: 'Contact sales',
    ctaRoute: '/contact',
    highlight: false,
    features: [
      'Unlimited candidates',
      'Resume parsing',
      'GitHub audit',
      'Custom question banks',
      'Recruiter dashboard',
      'Dedicated support',
      'Custom domain & branding',
      'SLA & onboarding included',
    ],
  },
];

export default function PricingPage() {
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
        .plan-card { border: 1px solid #1e1e1e; background: #111; padding: 2rem; border-radius: 4px; display: flex; flex-direction: column; transition: all 0.2s; }
        .plan-card:hover { border-color: #333; }
        .plan-highlight { border-color: #dc2626 !important; background: #130505 !important; position: relative; }
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
            <span className="nav-link" style={{ color: '#dc2626' }}>Pricing</span>
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
      <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center', background: 'linear-gradient(180deg, #0d0505 0%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(220,38,38,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.9rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '2px', fontSize: '0.78rem', color: '#f87171', marginBottom: '1.5rem' }}>
            Simple, transparent pricing
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700', color: '#f0f0f0', marginBottom: '1rem', lineHeight: '1.12', letterSpacing: '-0.025em' }}>
            Plans for every <span style={{ color: '#dc2626' }}>team size</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.75' }}>
            Start free, scale as you grow. No credit card required to get started.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '3rem 1.5rem 5rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <div key={i} className={`plan-card${plan.highlight ? ' plan-highlight' : ''}`}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: '#dc2626', color: 'white', fontSize: '0.7rem', fontWeight: '600', padding: '2px 12px', borderRadius: '0 0 4px 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most popular</div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.25rem' }}>{plan.name}</h2>
                <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '1rem' }}>{plan.desc}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: '800', color: plan.highlight ? '#dc2626' : '#f0f0f0', letterSpacing: '-0.03em' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.8rem', color: '#555' }}>{plan.sub}</span>
                </div>
              </div>

              <button
                style={{ width: '100%', background: plan.highlight ? '#dc2626' : 'transparent', color: plan.highlight ? 'white' : '#f0f0f0', border: `1px solid ${plan.highlight ? '#dc2626' : '#333'}`, padding: '0.7rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', borderRadius: '3px', marginBottom: '1.5rem', transition: 'all 0.15s' }}
                onClick={() => router.push(plan.ctaRoute)}
              >
                {plan.cta}
              </button>

              <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {plan.features.map((feat, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.83rem', color: feat ? '#aaa' : '#333' }}>
                    {feat
                      ? <CheckCircle size={14} color="#22c55e" style={{ flexShrink: 0 }} />
                      : <X size={14} color="#333" style={{ flexShrink: 0 }} />
                    }
                    {feat || <span style={{ textDecoration: 'line-through' }}>—</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '5rem 1.5rem', background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#f0f0f0', marginBottom: '0.5rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: '0.9rem', color: '#555', textAlign: 'center', marginBottom: '2.5rem' }}>Have more questions? Reach out at <a href="mailto:kamaleshramesh7275@gmail.com" style={{ color: '#dc2626' }}>kamaleshramesh7275@gmail.com</a></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { q: 'Is the Starter plan really free?', a: 'Yes! The Starter plan is completely free, forever. No credit card is required to sign up. You can screen up to 10 candidates per month at no cost.' },
              { q: 'Can I upgrade or downgrade at any time?', a: 'Absolutely. You can switch between plans at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.' },
              { q: 'Does the platform use any LLMs or AI models?', a: 'No. AI Recruiter is entirely rule-based. All scoring is done using weighted algorithms — there is zero risk of hallucination or unexplainable AI decisions.' },
              { q: 'Is my candidate data secure?', a: 'Yes. All candidate data is stored in a private PostgreSQL database. Passwords are bcrypt-hashed, and all API routes use JWT authentication. We never share candidate data with third parties.' },
              { q: 'What domains does the MCQ test cover?', a: 'The platform currently supports: Frontend, Backend, DevOps, ML/AI, Mobile, and General Computer Science. Enterprise customers can request custom question banks.' },
            ].map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid #1a1a1a', padding: '1.25rem 0' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '0.5rem' }}>{faq.q}</h3>
                <p style={{ fontSize: '0.83rem', color: '#666', lineHeight: '1.65' }}>{faq.a}</p>
              </div>
            ))}
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
