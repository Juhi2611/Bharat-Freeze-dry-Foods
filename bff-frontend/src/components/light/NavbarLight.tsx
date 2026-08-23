import { useState, useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X, Leaf, ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { buildWhatsAppLink } from '@/lib/whatsapp';

const navLinks = [
  { label: 'Home',          to: '/' },
  { label: 'About',         to: '/about' },
  { label: 'Products',      to: '/products' },
  { label: 'Pet Foods',     to: '/pet-foods' },
  { label: 'B2B / Export',  to: '/b2b' },
  { label: 'Private Label', to: '/private-label' },
  { label: 'Contact Us',    to: '/contact' },
];

export default function NavbarLight() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { totalItems, setIsCartOpen, setIsAuthOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
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
        <div className="desktop-nav-light" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {navLinks.map(link => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
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
                  (e.currentTarget as HTMLElement).style.color = glassed ? 'var(--green)' : 'white';
                  (e.currentTarget as HTMLElement).style.background = glassed ? 'rgba(45,122,58,0.08)' : 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = glassed
                    ? (active ? 'var(--green)' : 'var(--text-body)')
                    : (active ? 'white' : 'rgba(255,255,255,0.75)');
                  (e.currentTarget as HTMLElement).style.background = active
                    ? (glassed ? 'rgba(45,122,58,0.08)' : 'rgba(255,255,255,0.12)')
                    : 'transparent';
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Shared action controls: theme changes colors, not behavior */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                aria-label="Open account menu"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 11px',
                  borderRadius: '9999px', background: glassed ? 'rgba(45,122,58,0.10)' : 'rgba(0,0,0,0.18)',
                  border: glassed ? '1px solid rgba(45,122,58,0.25)' : '1px solid rgba(255,255,255,0.35)',
                  color: glassed ? 'var(--green-deep)' : 'white', fontSize: '12px', fontWeight: 700,
                }}
              >
                <User size={15} />
                <span style={{ maxWidth: 84, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.full_name?.split(' ')[0] || user.email}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                aria-label="Open B2B portal login"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 11px',
                  borderRadius: '9999px', background: glassed ? 'rgba(45,122,58,0.10)' : 'rgba(0,0,0,0.18)',
                  border: glassed ? '1px solid rgba(45,122,58,0.25)' : '1px solid rgba(255,255,255,0.35)',
                  color: glassed ? 'var(--green-deep)' : 'white', fontSize: '12px', fontWeight: 700,
                }}
              >
                <User size={15} />
                <span className="portal-login-label">Login</span>
              </button>
            )}

            {showUserDropdown && user && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 220, padding: 8, borderRadius: 12, background: 'var(--white)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)', zIndex: 1003, overflow: 'hidden' }}>
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-light)' }}>
                  <p style={{ margin: 0, color: 'var(--text-dark)', fontSize: 12, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name}</p>
                  <p style={{ margin: '3px 0 0', color: 'var(--text-muted)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                </div>
                {user.role !== 'customer' && (
                  <Link to="/admin" onClick={() => setShowUserDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 10px', color: 'var(--green-deep)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                )}
                {user.role === 'customer' && (
                  <>
                    <Link to="/account" onClick={() => setShowUserDropdown(false)} style={{ display: 'block', width: '100%', padding: '9px 10px', color: 'var(--text-dark)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      My Profile
                    </Link>
                    <Link to="/account/orders" onClick={() => setShowUserDropdown(false)} style={{ display: 'block', width: '100%', padding: '9px 10px', color: 'var(--text-dark)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      My Orders
                    </Link>
                  </>
                )}
                <button type="button" onClick={() => { logout(); setShowUserDropdown(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 10px', color: 'var(--red)', fontSize: 12, fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label="View sample cart and request quote"
            title="View Sample Cart & Request Quote"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '9999px', background: glassed ? 'var(--light-grey)' : 'rgba(0,0,0,0.18)', border: glassed ? '1px solid var(--border-light)' : '1px solid rgba(255,255,255,0.35)', color: glassed ? 'var(--green-deep)' : 'white' }}
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && <span style={{ position: 'absolute', top: -4, right: -4, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: 'var(--green)', color: 'white', fontSize: 10, fontWeight: 800 }}>{totalItems}</span>}
          </button>

          <button
            className="mobile-menu-btn-light"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ width: 38, height: 38, display: 'none', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: glassed ? 'var(--light-grey)' : 'rgba(0,0,0,0.18)', color: glassed ? 'var(--text-dark)' : 'white', border: glassed ? '1px solid var(--border-light)' : '1px solid rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', zIndex: 1002 }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
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
            key={link.to}
            to={link.to}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '16px 0',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px',
              color: pathname === link.to ? 'var(--green)' : 'var(--text-dark)',
              textDecoration: 'none',
              borderBottom: i < navLinks.length - 1 ? '1px solid var(--border-light)' : 'none',
              transition: 'color 0.2s ease',
            }}
          >
            {link.label}
          </Link>
        ))}
        <a
          href={buildWhatsAppLink()}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-whatsapp"
          style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '14px' }}
        >
          WhatsApp Inquiry
        </a>
      </div>

      <style>{`
        @media (max-width: 1199px) { .desktop-nav-light { display: none !important; } .mobile-menu-btn-light { display: flex !important; } }
        @media (max-width: 420px) { .portal-login-label { display: none; } }
      `}</style>
    </nav>
  );
}
