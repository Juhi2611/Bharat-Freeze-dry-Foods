'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, PawPrint, ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Freeze-Dried Fruits',
    key: 'Fruits',
    image: '/images/fruits_hero.png',
    accent: '#2D7A3A',
    href: '/products',
  },
  {
    name: 'Freeze-Dried Vegetables',
    key: 'Vegetables',
    image: '/images/vegetables_hero.png',
    accent: '#3A9148',
    organic: true,
    href: '/products',
  },
  {
    name: 'Freeze-Dried Gravies',
    key: 'Gravies',
    image: '/images/gravies_sauces.png',
    accent: '#E53935',
    href: '/products',
  },
  {
    name: 'Freeze-Dried Spices',
    key: 'Spices',
    image: '/images/spices_hero.png',
    accent: '#FF7043',
    href: '/products',
  },
  {
    name: 'Pre-Cooked Meals',
    key: 'Meals',
    image: '/images/precooked_hero.png',
    accent: '#D19A2E',
    href: '/products',
  },
  {
    name: 'Superfoods',
    key: 'Superfoods',
    image: '/images/superfoods_hero.png',
    accent: '#8BC34A',
    superfood: true,
    href: '/products',
  },
  {
    name: "Your Dog's BFF",
    key: 'Pet',
    image: '/images/pet_treats.png',
    accent: '#FF7043',
    pet: true,
    href: '/products',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="section" style={{ background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '48px',
        }}>
          <div>
            <div className="section-label">The Category Showcase</div>
            <h2 className="display-md" style={{ color: 'var(--text-dark)' }}>
              Every category, <br />
              <span className="gradient-text-green">frozen at the peak.</span>
            </h2>
          </div>
          <Link
            href="/products"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--green-deep)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(45,122,58,0.08)',
              border: '1px solid rgba(45,122,58,0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--green-deep)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(45,122,58,0.08)';
              e.currentTarget.style.color = 'var(--green-deep)';
            }}
          >
            View All Products <ArrowRight size={15} />
          </Link>
        </div>

        {/* Category Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {categories.map((c, i) => {
            const isWide = c.key === 'Fruits' || c.key === 'Superfoods';
            return (
              <Link
                key={c.name}
                href={c.href}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  position: 'relative',
                  height: '320px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-light)',
                  gridColumn: isWide ? 'span 1' : 'span 1',
                  cursor: 'pointer',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {/* Background Image */}
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* Dark Gradient Overlay for legible white text */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)',
                }} />

                {/* Content */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  zIndex: 2,
                }}>
                  {/* Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {c.organic && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(45,122,58,0.90)',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                      }}>
                        <Leaf size={11} /> Organic Line
                      </span>
                    )}
                    {c.superfood && (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(8px)',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                      }}>
                        Sub-Brand
                      </span>
                    )}
                    {c.pet && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255,112,67,0.90)',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                      }}>
                        <PawPrint size={11} /> For Pets
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '24px',
                    color: '#ffffff',
                    lineHeight: 1.2,
                    marginBottom: '10px',
                  }}>
                    {c.name}
                  </h3>

                  {/* Link action */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: c.accent || 'var(--lime)',
                    fontFamily: 'var(--font-display)',
                  }}>
                    Browse Category <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
