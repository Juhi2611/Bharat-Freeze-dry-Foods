'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  PlaneTakeoff, Dumbbell, Baby, Briefcase,
  Mountain, ShieldAlert, Star,
} from 'lucide-react';
import { FlaskConical, Factory, Package, Globe, Leaf, ShieldCheck } from 'lucide-react';

const useCases = [
  { Icon: PlaneTakeoff, title: 'Travel & Adventures',  desc: 'Lightweight nutrition for long journeys. No refrigeration, no compromise.', color: '#1565C0', bg: '#E3F2FD' },
  { Icon: Dumbbell,     title: 'Fitness & Sports',     desc: 'Clean protein, superfoods, and energy for peak performance.',             color: '#2D7A3A', bg: '#E8F5E9' },
  { Icon: Baby,         title: 'Kids & Family',        desc: 'Nutrient-dense, preservative-free snacks children actually love.',         color: '#E65100', bg: '#FBE9E7' },
  { Icon: Briefcase,    title: 'Office Snacking',      desc: 'Healthy, crunchy snacks that fuel focus and productivity.',                 color: '#5D4037', bg: '#EFEBE9' },
  { Icon: Mountain,     title: 'Trekking & Camping',   desc: 'Emergency nutrition with 5-year shelf life. Pack light, eat right.',       color: '#33691E', bg: '#F1F8E9' },
  { Icon: ShieldAlert,  title: 'Emergency Food',       desc: 'Disaster-ready nutrition that requires only water to rehydrate.',           color: '#C62828', bg: '#FFEBEE' },
];

const qualityBadges = [
  { Icon: Factory,     label: 'Food Grade Facility', desc: 'GMP-certified clean-room production',     color: '#37474F' },
  { Icon: Leaf,        label: 'Premium Ingredients',  desc: 'Farm-sourced, 100% natural inputs',        color: '#2D7A3A' },
  { Icon: FlaskConical,label: 'Strict QC',            desc: 'Multi-point laboratory testing',           color: '#6A1B9A' },
  { Icon: Package,     label: 'Vacuum Packed',        desc: 'Hermetic sealing for maximum freshness',   color: '#4E342E' },
  { Icon: ShieldCheck, label: 'No Preservatives',     desc: 'Zero artificial additives, ever',          color: '#C62828' },
  { Icon: Globe,       label: 'Export Standards',     desc: 'Meets EU, US, and international norms',    color: '#1565C0' },
];

export default function HumanNutrition() {
  const sectionRef  = useRef(null);
  const qualityRef  = useRef(null);
  const [isVisible,    setIsVisible]    = useState(false);
  const [qualityVisible, setQualityVisible] = useState(false);

  useEffect(() => {
    const obs1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); },     { threshold: 0.1 });
    const obs2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setQualityVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current)  obs1.observe(sectionRef.current);
    if (qualityRef.current)  obs2.observe(qualityRef.current);
    return () => { obs1.disconnect(); obs2.disconnect(); };
  }, []);

  return (
    <>
      {/* ─── Human Nutrition ─── */}
      <section ref={sectionRef} className="section" style={{ background: 'var(--light-grey)', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-label">Human Nutrition</div>
            <h2 className="display-md" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>
              Your Everyday{' '}
              <span className="gradient-text-green">BFF.</span>
            </h2>
            <p className="body-lg" style={{ color: 'var(--text-body)', maxWidth: '500px', margin: '0 auto' }}>
              The Traveler&apos;s BFF. The Fitness BFF. The Family&apos;s BFF.
              Wherever life takes you — we&apos;ve got your nutrition covered.
            </p>
          </div>

          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {useCases.map(({ Icon, title, desc, color, bg }, i) => (
              <div
                key={i}
                style={{
                  padding: '36px 32px', background: bg,
                  borderRadius: 'var(--radius-xl)',
                  border: `1px solid ${color}18`,
                  cursor: 'default', position: 'relative', overflow: 'hidden',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 20px 50px ${color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Large background number */}
                <div style={{
                  position: 'absolute', bottom: '-8px', right: '16px',
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: '80px', color: `${color}07`, lineHeight: 1, userSelect: 'none',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 64, height: 64,
                  background: `${color}12`, borderRadius: '18px',
                  marginBottom: '20px',
                }}>
                  <Icon size={28} color={color} strokeWidth={2} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '18px', color, marginBottom: '8px',
                }}>{title}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '14px',
                  color: 'var(--text-body)', lineHeight: 1.7,
                }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Retailer banner */}
          <div style={{
            marginTop: '48px', padding: 'clamp(32px, 4vw, 60px)',
            background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))',
            borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px',
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'clamp(22px, 3vw, 38px)', color: 'white',
                letterSpacing: '-0.03em', marginBottom: '8px',
              }}>Retailer&apos;s BFF.</h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '15px',
                color: 'rgba(255,255,255,0.7)', maxWidth: '380px',
              }}>
                Stock premium freeze-dried products that your customers will love.
                High margins, long shelf life, zero refrigeration costs.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="/contact" className="btn"
                style={{ background: 'white', color: 'var(--green-deep)', padding: '14px 28px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px' }}>
                Get Retail Catalog
              </a>
              <a href="https://wa.me/919993377038" target="_blank" rel="noopener noreferrer"
                className="btn btn-whatsapp" style={{ padding: '14px 24px' }}>
                WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quality Section ─── */}
      <section id="quality" ref={qualityRef} className="section" style={{ background: 'white', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-label">Quality Assurance</div>
            <h2 className="display-md" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>
              Quality is Our{' '}
              <span className="gradient-text-green">Standard.</span>
            </h2>
            <p className="body-lg" style={{ color: 'var(--text-body)', maxWidth: '480px', margin: '0 auto' }}>
              Every batch. Every product. Every time.
            </p>
          </div>

          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: '20px' }}>
            {qualityBadges.map(({ Icon, label, desc, color }, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center', padding: '40px 24px',
                  borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
                  background: 'var(--light-grey)', cursor: 'default',
                  opacity: qualityVisible ? 1 : 0,
                  transform: qualityVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.boxShadow = `0 20px 50px ${color}12`;
                  e.currentTarget.style.borderColor = `${color}25`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'var(--light-grey)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `${color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Icon size={28} color={color} strokeWidth={2} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '15px', color: 'var(--text-dark)', marginBottom: '6px',
                }}>{label}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Facility image */}
          <div style={{
            marginTop: '48px', position: 'relative',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '320px',
          }}>
            <Image src="/images/quality_facility.png" alt="BFF Quality Facility" fill style={{ objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, rgba(5,15,8,0.85) 0%, rgba(5,15,8,0.3) 50%, rgba(5,15,8,0.7) 100%)',
              display: 'flex', alignItems: 'center', padding: '0 60px',
            }}>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 'clamp(22px, 3vw, 38px)', color: 'white',
                  letterSpacing: '-0.03em', marginBottom: '12px',
                }}>State-of-the-Art Facility</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '15px',
                  color: 'rgba(255,255,255,0.7)', maxWidth: '380px', marginBottom: '24px',
                }}>
                  GMP-certified, food-grade manufacturing with precision temperature and humidity control at every stage.
                </p>
                <a href="/contact" className="btn btn-primary">Request Facility Tour</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
