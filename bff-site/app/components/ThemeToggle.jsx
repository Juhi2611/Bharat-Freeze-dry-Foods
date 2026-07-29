'use client';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * ThemeToggle — bff-site (Light mode)
 *
 * Shows a floating pill toggle. "Light" is the active state (this site).
 * Clicking "Dark" redirects the user to the same path on bff-main.
 *
 * URL config:
 *   NEXT_PUBLIC_DARK_SITE_URL  — set in .env.local
 *   Default: http://localhost:5173 (Vite dev server)
 *   Production: update to your deployed bff-main URL
 */
const DARK_URL =
  process.env.NEXT_PUBLIC_DARK_SITE_URL || 'http://localhost:8080';

export default function ThemeToggle() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [hoverDark, setHoverDark] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1000);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const goToDark = () => {
    setPressed(true);
    window.location.href = DARK_URL + pathname;
  };

  return (
    <>
      <div
        id="bff-theme-toggle"
        aria-label="Switch between Light and Dark site"
        style={{
          position: 'fixed',
          top: isMobile ? 'auto' : '14px',
          bottom: isMobile ? '92px' : 'auto',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1.5px solid rgba(45,122,58,0.22)',
          borderRadius: '9999px',
          padding: '4px',
          boxShadow: '0 4px 20px rgba(45,122,58,0.14), 0 1px 6px rgba(0,0,0,0.08)',
          gap: '2px',
          userSelect: 'none',
        }}
      >
        {/* LIGHT — active (this site) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: isMobile ? '7px 10px' : '7px 15px 7px 12px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #1A5C2A 0%, #4CAF50 60%, #8BC34A 100%)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            boxShadow: '0 0 14px rgba(76,175,80,0.45), 0 2px 8px rgba(45,122,58,0.35)',
            cursor: 'default',
            whiteSpace: 'nowrap',
          }}
        >
          <Sun size={13} strokeWidth={2.5} color="#fff" />
          {!isMobile && 'Light'}
        </div>

        {/* DARK — inactive, clickable → go to bff-main */}
        <button
          onClick={goToDark}
          onMouseEnter={() => setHoverDark(true)}
          onMouseLeave={() => setHoverDark(false)}
          disabled={pressed}
          title="Switch to Dark experience"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: isMobile ? '7px 10px' : '7px 14px 7px 10px',
            borderRadius: '9999px',
            background: hoverDark ? 'rgba(10,20,32,0.08)' : 'transparent',
            color: hoverDark ? '#1A5C2A' : '#8A8A8A',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            cursor: pressed ? 'wait' : 'pointer',
            border: 'none',
            outline: 'none',
            transition: 'all 0.22s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Moon size={13} strokeWidth={2} />
          {!isMobile && 'Dark'}
        </button>
      </div>

      <style>{`
        #bff-theme-toggle {
          animation: bff-toggle-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
          animation-delay: 0.3s;
          opacity: 0;
        }
        @keyframes bff-toggle-in {
          from { opacity: 0; transform: scale(0.80) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </>
  );
}
