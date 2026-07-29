'use client';
import { useEffect, useState } from 'react';
import { ChevronDown, Wind, Leaf, Snowflake, Award } from 'lucide-react';
import Link from 'next/link';

const heroVideo = '/videos/hero_bg.mp4';





export default function Hero() {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '750px',
        display: 'flex',
        alignItems: 'center',          /* vertically centred */
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #081A0C 0%, #0D2314 50%, #0A1A0A 100%)',
      }}
    >
      {/* Video */}
      <video
        autoPlay muted loop playsInline preload="metadata"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: '85% center',
          opacity: 0.70,
        }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="video-overlay" style={{ background: 'rgba(5,15,8,0.12)' }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 20% 60%, rgba(45,122,58,0.08) 0%, transparent 65%), radial-gradient(ellipse at 80% 40%, rgba(139,195,74,0.02) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="hero-content-container" style={{ position: 'relative', zIndex: 10, paddingTop: '180px', paddingLeft: 'max(20px, 4vw)', paddingRight: 'max(20px, 4vw)', maxWidth: '840px' }}>
        <div>

          {/* Label pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'rgba(139,195,74,0.15)',
            border: '1px solid rgba(139,195,74,0.3)',
            borderRadius: '9999px',
            marginBottom: '36px',
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
            <Wind size={13} color="#8BC34A" />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '11px',
              fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#C5E1A5',
            }}>Advanced Lyophilization Technology</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(32px, 7vw, 108px)',
            lineHeight: 1.02, letterSpacing: '-0.04em',
            color: 'white', marginBottom: '28px',
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(44px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            Freeze the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #8BC34A 0%, #C5E1A5 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Freshness.</span>
            <br />
            Preserve the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FFD54F 0%, #FFAB91 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Goodness.</span>
          </h1>

          {/* Sub */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.8vw, 21px)',
            fontWeight: 300, lineHeight: 1.72,
            color: 'rgba(255,255,255,0.70)',
            maxWidth: '600px', marginBottom: '44px',
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.4s',
          }}>
            Premium Freeze Dried Foods crafted using advanced Lyophilization technology
            to lock in nutrition, flavor, color and shelf life.
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '14px',
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.6s',
          }}>
            <Link href="/products" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '15px', gap: '8px' }}>
              <Leaf size={16} /> Explore Products
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{ padding: '16px 36px', fontSize: '15px' }}>
              Get a Quote
            </Link>
            <a
              href="https://wa.me/919993377038?text=Hi%20BFF%2C%20I%27m%20interested%20in%20your%20products."
              target="_blank" rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ padding: '16px 28px', fontSize: '15px', gap: '8px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="bounce"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        style={{
          position: 'absolute', bottom: '36px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '5px', cursor: 'pointer', opacity: 0.55,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.18em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
        }}>Scroll</span>
        <ChevronDown size={18} color="rgba(255,255,255,0.7)" />
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px',
        background: 'linear-gradient(to bottom, transparent, rgba(5,15,8,0.55))',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
