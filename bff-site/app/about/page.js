import Navbar from '../components/Navbar';
import About from '../components/About';
import HumanNutrition from '../components/HumanNutrition';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { Wind } from 'lucide-react';

export const metadata = {
  title: 'About — Bharat Freeze Dried Foods | Our Freeze-Drying Process',
  description: 'Learn about our advanced Lyophilization process — from farm-fresh sourcing to vacuum packaging. See how BFF preserves 97% nutrition with zero preservatives.',
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Compact Video Hero — original size with entrance animations */}
      <section
        style={{
          position: 'relative',
          padding: '140px 0 100px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #081A0C 0%, #0D2314 50%, #0A1A0A 100%)',
        }}
      >
        <video
          autoPlay muted loop playsInline preload="metadata"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: '85% center',
            opacity: 0.70,
          }}
        >
          <source src="/videos/farm_to_freeze_bg.mp4" type="video/mp4" />
        </video>

        <div className="video-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(5,15,8,0.12)', zIndex: 1 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 60%, rgba(45,122,58,0.08) 0%, transparent 65%), radial-gradient(ellipse at 80% 40%, rgba(139,195,74,0.02) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        <div style={{ position: 'relative', zIndex: 10, paddingLeft: 'max(20px, 4vw)', maxWidth: '840px' }}>

          <div className="hero-label-anim" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'rgba(139,195,74,0.15)',
            border: '1px solid rgba(139,195,74,0.3)',
            borderRadius: '9999px', marginBottom: '36px',
          }}>
            <Wind size={13} color="#8BC34A" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C5E1A5' }}>
              Our Story &amp; Science
            </span>
          </div>

          <h1 className="hero-h1-anim" style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(44px, 7vw, 108px)',
            lineHeight: 1.02, letterSpacing: '-0.04em',
            color: 'white', marginBottom: '28px',
          }}>
            From Farm to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #8BC34A 0%, #C5E1A5 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Freeze.</span>
          </h1>

          <p className="hero-p-anim" style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.8vw, 21px)',
            fontWeight: 300, lineHeight: 1.72,
            color: 'rgba(255,255,255,0.70)', maxWidth: '600px', marginBottom: '44px',
          }}>
            The science behind Bharat Freeze Dried Foods — and why lyophilization is the future of food preservation.
          </p>
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px',
          background: 'linear-gradient(to bottom, transparent, rgba(5,15,8,0.55))',
          pointerEvents: 'none', zIndex: 1,
        }} />
      </section>

      <About />
      <HumanNutrition />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
