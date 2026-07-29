'use client';
import Link from 'next/link';
import { ArrowRight, Globe, ShieldCheck, ThermometerSnowflake, PackageCheck } from 'lucide-react';

export default function ExportBharatStrip() {
  return (
    <section className="section" style={{
      background: 'linear-gradient(180deg, var(--white) 0%, var(--light-grey) 50%, var(--white) 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '80px 0',
    }}>
      {/* Soft Ambient Background Glows */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(45, 122, 58, 0.07) 0%, rgba(139, 195, 74, 0.05) 50%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Link
          href="/export"
          style={{ textDecoration: 'none', display: 'block', outline: 'none' }}
        >
          <div
            className="export-card-light"
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(45, 122, 58, 0.15)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.07), 0 4px 16px rgba(45, 122, 58, 0.08)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(45, 122, 58, 0.12)';
              const video = e.currentTarget.querySelector('video');
              if (video) video.style.transform = 'scale(1.03)';
              const cta = e.currentTarget.querySelector('.cta-btn');
              if (cta) cta.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.07), 0 4px 16px rgba(45, 122, 58, 0.08)';
              const video = e.currentTarget.querySelector('video');
              if (video) video.style.transform = 'scale(1)';
              const cta = e.currentTarget.querySelector('.cta-btn');
              if (cta) cta.style.transform = 'translateX(0)';
            }}
          >
            {/* Integrated Canvas Video Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '52vh',
              minHeight: '420px',
              overflow: 'hidden',
              background: '#09150B',
            }}>
              {/* Lightmode Video */}
              <video
                src="/videos/export_lightmode.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: 'none',
                }}
              />

              {/* Light Mode Vignette & Soft Gradient Masks for Seamless Website Integration */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(10,25,12,0.35) 0%, transparent 40%, rgba(10,25,12,0.45) 100%)',
                pointerEvents: 'none',
              }} />

              {/* Floating Frosted Badges Over Video (Interactive Atmosphere) */}
              <div style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                right: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                zIndex: 2,
                pointerEvents: 'none',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  color: 'var(--green-deep)',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.04em',
                }}>
                  <Globe size={14} color="var(--green)" />
                  <span>30+ Countries Served</span>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  color: 'var(--text-dark)',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.04em',
                }}>
                  <ThermometerSnowflake size={14} color="#1565C0" />
                  <span>Zero Cold Chain Needed</span>
                </div>
              </div>
            </div>

            {/* Seamless Content & Stats Card */}
            <div style={{
              background: '#ffffff',
              padding: '48px 32px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 3,
            }}>
              <div className="section-label" style={{ marginBottom: '14px', display: 'inline-block' }}>
                Global B2B & Export Solutions
              </div>

              <h2 className="display-md" style={{
                color: 'var(--text-dark)',
                maxWidth: '800px',
                margin: '0 auto 16px',
                lineHeight: 1.15,
                fontSize: 'clamp(28px, 4vw, 44px)',
              }}>
                Exporting From Bharat <span className="gradient-text-green">To The World</span>
              </h2>

              <p className="body-lg" style={{
                color: 'var(--text-body)',
                maxWidth: '620px',
                margin: '0 auto 36px',
                lineHeight: 1.65,
                fontSize: '16px',
              }}>
                Connecting global food brands, distributors, and industries with premium, export-certified freeze-dried foods from India. Sourced at peak freshness, ready for global shipping.
              </p>

              {/* Integrated Metric Badges Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '24px',
                maxWidth: '700px',
                margin: '0 auto 36px',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--light-grey)',
                border: '1px solid var(--border-light)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', fontFamily: 'var(--font-display)' }}>
                  <ShieldCheck size={16} color="var(--green)" /> ISO & FSSAI Certified
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', fontFamily: 'var(--font-display)' }}>
                  <PackageCheck size={16} color="var(--green)" /> Custom Bulk Packaging
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', fontFamily: 'var(--font-display)' }}>
                  <Globe size={16} color="var(--green)" /> 24+ Month Shelf Life
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 36px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #1A5C2A 0%, #2D7A3A 60%, #4CAF50 100%)',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 6px 24px rgba(45,122,58,0.35)',
                transition: 'all 0.3s ease',
              }}>
                <span>Explore B2B Export</span>
                <ArrowRight size={16} className="cta-btn" style={{ transition: 'transform 0.3s ease' }} />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
