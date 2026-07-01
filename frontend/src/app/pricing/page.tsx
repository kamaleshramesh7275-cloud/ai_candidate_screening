'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, X, MonitorPlay } from 'lucide-react';

const plans = [
  {
    name: 'EARLYBIRD',
    price: '$199',
    sub: 'Available tickets for this price: 120',
    desc: 'it\'s a good idea to purchase your ticket as early as possible to avoid missing out on the event or facing higher prices.',
    color: '#151725',
    cta: 'BUY TICKET',
    ctaColor: '#ff2a75',
    ctaRoute: '/apply',
    highlight: false,
    features: [
      'Lottery Ticket',
      'Priority Seating',
      'T-Shirt',
      'Free lunch & coffee',
      'Certificate',
      'Easy access',
    ],
    missing: []
  },
  {
    name: 'REGULAR',
    price: '$299',
    sub: 'Available tickets for this price: 450',
    desc: 'Standard entry pass to all main stages and general networking areas during the event days.',
    color: '#151725',
    cta: 'BUY TICKET',
    ctaColor: '#2a5bff',
    ctaRoute: '/recruiter',
    highlight: true,
    features: [
      'Lottery Ticket',
      'Standard Seating',
      'T-Shirt',
      'Free lunch',
      'Easy access',
    ],
    missing: ['Certificate']
  },
  {
    name: 'VIP PASS',
    price: '$499',
    sub: 'Available tickets for this price: 50',
    desc: 'Exclusive access to backstage, private networking, and all premium workshops.',
    color: '#151725',
    cta: 'BUY TICKET',
    ctaColor: '#ff2a75',
    ctaRoute: '/contact',
    highlight: false,
    features: [
      'Lottery Ticket',
      'VIP Seating',
      'Premium Merch Pack',
      'Free meals & drinks',
      'Certificate of Excellence',
      'VIP lounge access',
      'Meet & Greet',
    ],
    missing: []
  },
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#090a0f', color: '#ffffff', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; box-sizing: border-box; }
        .bg-gradient-main {
          background: radial-gradient(circle at 50% 0%, rgba(31, 75, 163, 0.2), transparent 60%),
                      radial-gradient(circle at 100% 50%, rgba(103, 31, 163, 0.15), transparent 50%),
                      #090a0f;
        }
        .nav-link { color: #a0a5b5; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 4px; cursor: pointer; transition: color 0.2s; }
        .nav-link:hover { color: #ffffff; }
        .btn-pink { background: #ff2a75; color: white; border: none; padding: 0.75rem 1.75rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border-radius: 4px; box-shadow: 0 4px 14px 0 rgba(255, 42, 117, 0.39); }
        .btn-pink:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255, 42, 117, 0.5); }
        .plan-card { border: 1px solid #1c1e2e; background: #0d0e15; padding: 3rem 2.5rem; border-radius: 8px; display: flex; flex-direction: column; transition: all 0.3s; }
        .plan-card:hover { border-color: #2a5bff; transform: translateY(-4px); }
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
            <span className="nav-link" style={{ color: '#ffffff' }}>Pricing</span>
            <span className="nav-link" onClick={() => router.push('/about')}>About</span>
            <span className="nav-link" onClick={() => router.push('/contact')}>Contact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
            <span className="nav-link" onClick={() => router.push('/login')}>Sign in</span>
            <button className="btn-pink" onClick={() => router.push('/apply')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>GET STARTED</button>
          </div>
        </div>
      </nav>

      {/* Hero / Header */}
      <section className="bg-gradient-main" style={{ padding: '6rem 1.5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.8rem', color: '#2a5bff', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem' }}>
            PRICING PLANS
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#ffffff', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            GET YOUR TICKET
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#a0a5b5', lineHeight: '1.7', fontWeight: '400' }}>
            It's a good idea to purchase your ticket as early as possible to avoid missing out on the event or facing higher prices as the event date approaches.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '3rem 1.5rem 6rem', background: 'transparent' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <div key={i} className="plan-card">
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#a0a5b5', marginBottom: '1rem', letterSpacing: '1px' }}>{plan.name}</h2>
                <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: '1' }}>{plan.price}</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {plan.features.map((feat, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: '#ffffff', fontWeight: '500' }}>
                      <CheckCircle size={18} color="#2a5bff" />
                      {feat}
                    </div>
                  ))}
                  {plan.missing.map((feat, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: '#4a4d65', fontWeight: '500' }}>
                      <CheckCircle size={18} color="#2a2d45" />
                      <span style={{ textDecoration: 'line-through' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, height: '6px', background: '#1c1e2e', borderRadius: '3px', overflow: 'hidden' }}>
                       <div style={{ width: '40%', height: '100%', background: '#ff2a75' }}></div>
                    </div>
                 </div>
                 <div style={{ fontSize: '0.75rem', color: '#6a6d82', marginBottom: '1.5rem' }}>
                    <span style={{ color: '#ff2a75' }}>120</span> {plan.sub.replace('120', '')}
                 </div>

                <button
                  style={{ width: '100%', background: plan.ctaColor, color: 'white', border: 'none', padding: '1rem', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s', boxShadow: `0 4px 14px 0 ${plan.ctaColor}40` }}
                  onClick={() => router.push(plan.ctaRoute)}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
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
