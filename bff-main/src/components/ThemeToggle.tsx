import { useRouterState } from "@tanstack/react-router";
import { Sun, Snowflake } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * ThemeToggle — bff-main (Dark mode)
 *
 * Shows a floating pill toggle. "Dark" is the active state (this site).
 * Clicking "Light" redirects the user to the same path on bff-site.
 *
 * URL config:
 *   VITE_LIGHT_SITE_URL — set in .env
 *   Default: http://localhost:3000 (Next.js dev server)
 *   Production: update to your deployed bff-site URL
 */
const LIGHT_URL =
  (import.meta.env.VITE_LIGHT_SITE_URL as string) || "http://localhost:3000";

export function ThemeToggle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMobile, setIsMobile] = useState(false);
  const [hoverLight, setHoverLight] = useState(false);
  const [pressed, setPressed] = useState(false);

  /* Detect screen width for positioning */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1000);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const goToLight = () => {
    setPressed(true);
    window.location.href = LIGHT_URL + pathname;
  };

  return (
    <>
      <div
        id="bff-theme-toggle"
        aria-label="Switch between Light and Dark site"
        style={{
          position: "fixed",
          /* Desktop: top-right | Mobile: bottom-right above WhatsApp */
          top: isMobile ? "auto" : "14px",
          bottom: isMobile ? "92px" : "auto",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          background: "rgba(6,11,18,0.82)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1.5px solid rgba(79,168,216,0.30)",
          borderRadius: "9999px",
          padding: "4px",
          boxShadow:
            "0 4px 24px rgba(79,168,216,0.20), 0 0 0 1px rgba(79,168,216,0.06), 0 1px 6px rgba(0,0,0,0.50)",
          gap: "2px",
          userSelect: "none",
        }}
      >
        {/* LIGHT — inactive, clickable → go to bff-site */}
        <button
          onClick={goToLight}
          onMouseEnter={() => setHoverLight(true)}
          onMouseLeave={() => setHoverLight(false)}
          disabled={pressed}
          title="Switch to Light experience"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: isMobile ? "7px 10px" : "7px 14px 7px 10px",
            borderRadius: "9999px",
            background: hoverLight ? "rgba(79,168,216,0.14)" : "transparent",
            color: hoverLight ? "#EAF6FB" : "#B8C4CC",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            cursor: pressed ? "wait" : "pointer",
            border: "none",
            outline: "none",
            transition: "all 0.22s ease",
            whiteSpace: "nowrap",
          }}
        >
          <Sun size={13} strokeWidth={2} />
          {!isMobile && "Light"}
        </button>

        {/* DARK — active (this site) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: isMobile ? "7px 10px" : "7px 15px 7px 12px",
            borderRadius: "9999px",
            background:
              "linear-gradient(135deg, #2a7faf 0%, #4FA8D8 55%, #7fc5eb 100%)",
            color: "#060B12",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            boxShadow:
              "0 0 18px rgba(79,168,216,0.55), 0 2px 8px rgba(79,168,216,0.30)",
            cursor: "default",
            whiteSpace: "nowrap",
          }}
        >
          <Snowflake size={13} strokeWidth={2.5} color="#060B12" />
          {!isMobile && "Dark"}
        </div>
      </div>

      <style>{`
        #bff-theme-toggle {
          animation: bff-toggle-in-dark 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
          animation-delay: 0.3s;
          opacity: 0;
        }
        @keyframes bff-toggle-in-dark {
          from { opacity: 0; transform: scale(0.80) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </>
  );
}
