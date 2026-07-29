'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sprout, FlaskConical, Globe, Tag,
  Factory, ArrowRight,
} from 'lucide-react';

const features = [
  {
    href: '/products',
    label: 'Products',
    headline: '200+ Freeze-Dried Products',
    desc: 'Fruits, vegetables, precooked meals, superfoods, spices and more.',
    Icon: Sprout,
    image: '/images/fruits_hero.png',
    color: '#2D7A3A',
  },
  {
    href: '/about',
    label: 'Our Process',
    headline: 'Advanced Lyophilization',
    desc: 'See our 8-step freeze-drying process from farm to shelf.',
    Icon: FlaskConical,
    image: '/images/quality_facility.png',
    color: '#1565C0',
  },
  {
    href: '/export',
    label: 'Export',
    headline: '30+ Countries Served',
    desc: 'Export-ready, no cold chain, certified for global markets.',
    Icon: Globe,
    image: '/images/export_global.png',
    color: '#558B2F',
  },
  {
    href: '/private-label',
    label: 'Private Label',
    headline: 'Your Brand\'s BFF',
    desc: 'Custom manufacturing, packaging and branding solutions.',
    Icon: Tag,
    image: '/images/private_label.png',
    color: '#4A148C',
  },
  {
    href: '/industries',
    label: 'Industries',
    headline: '11+ Industries Served',
    desc: 'Hotels, restaurants, airlines, defense, retail and more.',
    Icon: Factory,
    image: '/images/industry_hotel.png',
    color: '#37474F',
  },
];

export default function HomeFeatureStrip() {
  return (
    <section className="section" style={{ background: 'var(--light-grey)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-label">Bharat Freeze-Dried Foods</div>
          <h2 className="display-md" style={{ marginBottom: '16px' }}>
            Preserving India&apos;s Harvest{' '}
            <span className="gradient-text-green">for the World.</span>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-body)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Premium onion, garlic, fruits, vegetables, herbs and ready-to-eat meals processed for long shelf life, low moisture, and global supply chains. Indian origin, global standards.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {features.map((f, i) => {
            const { Icon } = f;
            return (
              <Link
                key={f.href}
                href={f.href}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const overlay = e.currentTarget.querySelector('.card-overlay');
                  const arrow   = e.currentTarget.querySelector('.card-arrow');
                  const img     = e.currentTarget.querySelector('img');
                  if (overlay) overlay.style.background = `linear-gradient(to top, ${f.color}EE 0%, ${f.color}66 40%, rgba(0,0,0,0.3) 100%)`;
                  if (arrow)   { arrow.style.transform = 'translateX(4px)'; arrow.style.opacity = '1'; }
                  if (img)     img.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={e => {
                  const overlay = e.currentTarget.querySelector('.card-overlay');
                  const arrow   = e.currentTarget.querySelector('.card-arrow');
                  const img     = e.currentTarget.querySelector('img');
                  if (overlay) overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)';
                  if (arrow)   { arrow.style.transform = 'translateX(0)'; arrow.style.opacity = '0.7'; }
                  if (img)     img.style.transform = 'scale(1)';
                }}
              >
                <Image
                  src={f.image}
                  alt={f.label}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
                <div
                  className="card-overlay"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                    transition: 'background 0.4s ease',
                  }}
                />

                {/* Top label */}
                <div style={{
                  position: 'absolute', top: '20px', left: '20px',
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '5px 13px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  <Icon size={13} color="white" />
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: '11px', color: 'white', letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>
                    {f.label}
                  </span>
                </div>

                {/* Bottom content */}
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: 'clamp(17px, 2vw, 22px)', color: 'white',
                    letterSpacing: '-0.02em', marginBottom: '6px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}>{f.headline}</h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '13px',
                    color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: '12px',
                  }}>{f.desc}</p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: '12px', color: 'white',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>
                    Explore
                    <ArrowRight
                      size={14}
                      className="card-arrow"
                      style={{ transition: 'all 0.25s ease', opacity: 0.7 }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
