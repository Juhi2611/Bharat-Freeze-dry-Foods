'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Leaf } from 'lucide-react';

const navLinks = [
  { label: 'Home',          href: '/' },
  { label: 'About',         href: '/about' },
  { label: 'Products',      href: '/products' },
  { label: 'Industries',    href: '/industries' },
  { label: 'Private Label', href: '/private-label' },
  { label: 'Export',        href: '/export' },
  { label: 'Contact',       href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  /* On non-home pages, always show the white nav */
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const glassed = !isHome || scrolled;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: glassed ? '12px 0' : '22px 0',
      background: glassed ? 'rgba(255,255,255,0.90)' : 'transparent',
      backdropFilter: glassed ? 'blur(24px)' : 'none',
      WebkitBackdropFilter: glassed ? 'blur(24px)' : 'none',
      borderBottom: glassed ? '1px solid rgba(0,0,0,0.06)' : 'none',
      boxShadow: glassed ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #2D7A3A, #8BC34A)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(45,122,58,0.35)',
          }}>
            <Leaf size={20} color="white" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900, fontSize: '16px',
              lineHeight: 1.1, letterSpacing: '-0.02em',
              color: glassed ? 'var(--text-dark)' : 'white',
              transition: 'color 0.3s ease',
            }}>BFF</div>
            <div style={{
              fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.06em',
              color: glassed ? 'var(--green)' : 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
              fontFamily: 'var(--font-display)',
            }}>Bharat Freeze Dried</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {navLinks.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '8px 13px',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600, fontSize: '13px',
                  color: glassed
                    ? (active ? 'var(--green)' : 'var(--text-body)')
                    : (active ? 'white' : 'rgba(255,255,255,0.75)'),
                  background: active
                    ? (glassed ? 'rgba(45,122,58,0.08)' : 'rgba(255,255,255,0.12)')
                    : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = glassed ? 'var(--green)' : 'white';
                  e.currentTarget.style.background = glassed ? 'rgba(45,122,58,0.08)' : 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = glassed
                    ? (active ? 'var(--green)' : 'var(--text-body)')
                    : (active ? 'white' : 'rgba(255,255,255,0.75)');
                  e.currentTarget.style.background = active
                    ? (glassed ? 'rgba(45,122,58,0.08)' : 'rgba(255,255,255,0.12)')
                    : 'transparent';
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="https://wa.me/919993377038?text=Hi%20Bharat%20Freeze%20Fried%20Foods%2C%20I%27m%20interested%20in%20your%20products."
            target="_blank" rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ marginLeft: '8px', padding: '10px 18px', fontSize: '13px', gap: '7px' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            width: 44, height: 44, display: 'none',
            alignItems: 'center', justifyContent: 'center',
            borderRadius: 12,
            background: glassed ? 'var(--light-grey)' : 'rgba(255,255,255,0.15)',
            color: glassed ? 'var(--text-dark)' : 'white',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1002,
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={{
        position: 'absolute', top: '100%', left: 0, right: 0,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        padding: menuOpen ? '24px' : '0 24px',
        maxHeight: menuOpen ? '600px' : '0',
        opacity: menuOpen ? 1 : 0,
        visibility: menuOpen ? 'visible' : 'hidden',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        borderBottom: menuOpen ? '1px solid var(--border-light)' : 'none',
        boxShadow: menuOpen ? '0 20px 40px rgba(0,0,0,0.1)' : 'none',
        zIndex: 999,
      }}>
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '16px 0',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px',
              color: pathname === link.href ? 'var(--green)' : 'var(--text-dark)',
              textDecoration: 'none',
              borderBottom: i < navLinks.length - 1 ? '1px solid var(--border-light)' : 'none',
              transition: 'color 0.2s ease',
            }}
          >
            {link.label}
          </Link>
        ))}
        <a
          href="https://wa.me/919993377038?text=Hi%20BFF!"
          target="_blank" rel="noopener noreferrer"
          className="btn btn-whatsapp"
          style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '14px' }}
        >
          WhatsApp Inquiry
        </a>
      </div>


      <style>{`
        @media (max-width: 1000px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } }
      `}</style>
    </nav>
  );
}
