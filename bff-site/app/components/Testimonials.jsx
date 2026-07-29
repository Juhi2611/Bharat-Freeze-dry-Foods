'use client';
import { useRef, useEffect, useState } from 'react';
import { User, UtensilsCrossed, Building2, Globe2, Heart, Award } from 'lucide-react';

const testimonials = [
  {
    name: 'Chef Rajiv Sharma',
    role: 'Executive Chef, The Leela Palace',
    content: 'BFF freeze-dried ingredients have revolutionized our kitchen consistency. The color and flavor retention is exceptional — our guests can\'t tell the difference from fresh.',
    rating: 5,
    Icon: UtensilsCrossed,
    accent: '#1565C0',
  },
  {
    name: 'Priya Nair',
    role: 'Co-founder, NatureNest Organics',
    content: 'We launched our private label superfood range with BFF. The quality, packaging, and support were world-class. Our sales tripled in 6 months.',
    rating: 5,
    Icon: Building2,
    accent: '#2D7A3A',
  },
  {
    name: 'Arjun Mehta',
    role: 'CEO, GlobalFresh Exports',
    content: 'Exporting freeze-dried products to 12 countries, all from one supplier. BFF\'s export packaging and documentation support is flawless. True professionals.',
    rating: 5,
    Icon: Globe2,
    accent: '#4A148C',
  },
  {
    name: 'Dr. Ananya Krishnan',
    role: 'Nutritionist & Health Coach',
    content: 'I recommend BFF superfoods to all my clients. The nutrient analysis reports show consistently high retention — this is science-backed, not marketing.',
    rating: 5,
    Icon: Heart,
    accent: '#00838F',
  },
  {
    name: 'Vikram Patel',
    role: 'Director, CloudBite Kitchens',
    content: 'Our cloud kitchen chain reduced food waste by 40% since switching to BFF freeze-dried ingredients. Consistent quality, zero spoilage. Game changer.',
    rating: 5,
    Icon: Award,
    accent: '#E65100',
  },
];

const faqs = [
  {
    q: 'What is freeze-drying (Lyophilization)?',
    a: 'Freeze-drying, or lyophilization, is a process that removes moisture from food by freezing it to −50°C, then placing it in a vacuum chamber where ice sublimates directly into vapor — bypassing the liquid stage. This preserves color, flavor, nutrition, and cellular structure far better than any other preservation method.',
  },
  {
    q: 'How long is the shelf life of freeze-dried products?',
    a: 'Our freeze-dried products have a shelf life of 2–5 years when stored at room temperature in sealed packaging. No refrigeration is required. Once opened, consume within 6–12 months for best quality.',
  },
  {
    q: 'Do freeze-dried products retain their nutrition?',
    a: 'Yes — freeze-drying retains up to 97% of the original nutritional content including vitamins, minerals, enzymes, and antioxidants. It significantly outperforms conventional freezing, canning, and dehydration methods.',
  },
  {
    q: 'Do you offer private label manufacturing?',
    a: 'Absolutely. We offer full private label and white-label manufacturing services including custom formulations, packaging design, branding, and low MOQ options. We handle everything from concept to shelf-ready product.',
  },
  {
    q: 'What certifications does BFF hold?',
    a: 'We are FSSAI certified, ISO 22000 compliant, APEDA registered for exports, and follow Good Manufacturing Practices (GMP). Our facility meets the standards required for EU, USA, and Gulf market exports.',
  },
  {
    q: 'Can I order custom blends or formulations?',
    a: 'Yes. We specialize in custom blends, proprietary formulations, and OEM manufacturing. Your recipes remain strictly confidential under NDA. Contact us to discuss your specific requirements.',
  },
  {
    q: 'What is the minimum order quantity?',
    a: 'We offer flexible MOQ starting from as low as 50kg for select products, making it accessible for startups and growing brands. Larger volumes attract better pricing. Reach out for a customized quote.',
  },
  {
    q: 'Do you export to international markets?',
    a: 'Yes, we actively export to 30+ countries across the Middle East, Europe, Southeast Asia, North America, and Australia. Our export packaging meets international food safety and labeling requirements.',
  },
];

function TestimonialCard({ t, index }) {
  const [hovered, setHovered] = useState(false);
  const Icon = t.Icon || User;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '0 0 380px',
        padding: '40px 36px',
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        border: `1px solid ${hovered ? t.accent + '30' : 'var(--border-light)'}`,
        position: 'relative',
        cursor: 'default',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? `0 24px 60px ${t.accent}15` : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Decorative quote */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '28px',
        fontFamily: 'Georgia, serif',
        fontSize: '100px',
        color: `${t.accent}12`,
        lineHeight: 1,
        userSelect: 'none',
        fontWeight: 700,
      }}>
        &ldquo;
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
        {[...Array(t.rating)].map((_, i) => (
          <span key={i} style={{ color: '#FFD54F', fontSize: '16px' }}>★</span>
        ))}
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        lineHeight: 1.75,
        color: 'var(--text-body)',
        marginBottom: '32px',
        fontStyle: 'italic',
        position: 'relative',
        zIndex: 1,
      }}>
        &ldquo;{t.content}&rdquo;
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: 48, height: 48,
          borderRadius: '50%',
          background: `${t.accent}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.accent,
          border: `2px solid ${t.accent}25`,
        }}>
          <Icon size={20} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '15px',
            color: 'var(--text-dark)',
          }}>
            {t.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '2px',
          }}>
            {t.role}
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '32px', right: '32px',
        height: '2px',
        background: hovered ? `linear-gradient(90deg, ${t.accent}, ${t.accent}44)` : 'transparent',
        borderRadius: '2px',
        transition: 'background 0.3s ease',
      }} />
    </div>
  );
}

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: `1px solid ${open ? 'rgba(45,122,58,0.2)' : 'var(--border-light)'}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: open ? 'rgba(45,122,58,0.02)' : 'white',
      transition: 'all 0.25s ease',
      marginBottom: '12px',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '16px',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '15px',
          color: open ? 'var(--green)' : 'var(--text-dark)',
          transition: 'color 0.25s ease',
          lineHeight: 1.4,
        }}>
          {faq.q}
        </span>
        <div style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: open ? 'var(--green)' : 'var(--light-grey)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontSize: '18px',
          color: open ? 'white' : 'var(--text-muted)',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
          transition: 'all 0.3s ease',
          fontWeight: 300,
        }}>
          +
        </div>
      </button>
      <div className={`accordion-body ${open ? 'open' : ''}`}>
        <div style={{
          padding: '0 24px 24px',
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--text-body)',
          lineHeight: 1.75,
        }}>
          {faq.a}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);
  const [tVisible, setTVisible] = useState(false);
  const [fVisible, setFVisible] = useState(false);

  useEffect(() => {
    const obs1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTVisible(true); }, { threshold: 0.1 });
    const obs2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFVisible(true); }, { threshold: 0.1 });
    if (testimonialsRef.current) obs1.observe(testimonialsRef.current);
    if (faqRef.current) obs2.observe(faqRef.current);
    return () => { obs1.disconnect(); obs2.disconnect(); };
  }, []);

  return (
    <>
      {/* ─── Testimonials ────────────────────────────────────── */}
      <section ref={testimonialsRef} className="section" style={{ background: 'var(--cream)', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-label">What Clients Say</div>
            <h2 className="display-md" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>
              Trusted by{' '}
              <span className="gradient-text-green">Industry Leaders.</span>
            </h2>
          </div>
        </div>

        {/* Scroll carousel */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px',
            background: 'linear-gradient(to right, var(--cream), transparent)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px',
            background: 'linear-gradient(to left, var(--cream), transparent)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <div
            style={{
              display: 'flex',
              gap: '24px',
              padding: '16px clamp(24px, 8vw, 120px) 40px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory',
            }}
          >
            {testimonials.map((t, i) => (
              <div key={i} style={{ scrollSnapAlign: 'start' }}>
                <TestimonialCard t={t} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" ref={faqRef} className="section" style={{ background: 'white' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label">FAQ</div>
            <h2 className="display-md" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>
              Got Questions?
            </h2>
            <p className="body-md" style={{ color: 'var(--text-body)' }}>
              Everything you need to know about BFF and freeze-drying.
            </p>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  opacity: fVisible ? 1 : 0,
                  transform: fVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s`,
                }}
              >
                <FAQItem faq={faq} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
