import { Sun, Snowflake } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";

/**
 * ThemeToggle — unified (runs in bff-main)
 *
 * Shows a floating pill toggle.
 * Clicking "Light" / "Dark" switches the in-app theme via ThemeContext.
 * No cross-server redirects needed — both themes live in this single app.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  /* Detect screen width for positioning */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1000);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const isDark = theme === "dark";

  return (
    <>
      <div
        id="bff-theme-toggle"
        aria-label="Switch between Light and Dark theme"
        style={{
          position: "fixed",
          /* Keep clear of top-right account menu / cart so the pill never overlaps the user dropdown */
          top: isMobile ? "auto" : "88px",
          bottom: isMobile ? "92px" : "auto",
          left: isMobile ? "auto" : "20px",
          right: isMobile ? "20px" : "auto",
          zIndex: 900,
          display: "flex",
          alignItems: "center",
          background: isDark
            ? "rgba(6,11,18,0.82)"
            : "rgba(255,255,255,0.90)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: isDark
            ? "1.5px solid rgba(79,168,216,0.30)"
            : "1.5px solid rgba(45,122,58,0.22)",
          borderRadius: "9999px",
          padding: "4px",
          boxShadow: isDark
            ? "0 4px 24px rgba(79,168,216,0.20), 0 0 0 1px rgba(79,168,216,0.06), 0 1px 6px rgba(0,0,0,0.50)"
            : "0 4px 20px rgba(45,122,58,0.14), 0 1px 6px rgba(0,0,0,0.08)",
          gap: "2px",
          userSelect: "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* LIGHT button */}
        {theme === "dark" ? (
          // Light is inactive — clickable
          <button
            onClick={() => setTheme("light")}
            title="Switch to Light theme"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: isMobile ? "7px 10px" : "7px 14px 7px 10px",
              borderRadius: "9999px",
              background: "transparent",
              color: "#B8C4CC",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              cursor: "pointer",
              border: "none",
              outline: "none",
              transition: "all 0.22s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(79,168,216,0.14)";
              (e.currentTarget as HTMLElement).style.color = "#EAF6FB";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#B8C4CC";
            }}
          >
            <Sun size={13} strokeWidth={2} />
            {!isMobile && "Light"}
          </button>
        ) : (
          // Light is active
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: isMobile ? "7px 10px" : "7px 15px 7px 12px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #1A5C2A 0%, #4CAF50 60%, #8BC34A 100%)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              boxShadow: "0 0 14px rgba(76,175,80,0.45), 0 2px 8px rgba(45,122,58,0.35)",
              cursor: "default",
              whiteSpace: "nowrap",
            }}
          >
            <Sun size={13} strokeWidth={2.5} color="#fff" />
            {!isMobile && "Light"}
          </div>
        )}

        {/* DARK button */}
        {theme === "light" ? (
          // Dark is inactive — clickable
          <button
            onClick={() => setTheme("dark")}
            title="Switch to Dark theme"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: isMobile ? "7px 10px" : "7px 14px 7px 10px",
              borderRadius: "9999px",
              background: "transparent",
              color: "#8A8A8A",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              cursor: "pointer",
              border: "none",
              outline: "none",
              transition: "all 0.22s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(10,20,32,0.08)";
              (e.currentTarget as HTMLElement).style.color = "#1A5C2A";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#8A8A8A";
            }}
          >
            <Snowflake size={13} strokeWidth={2} />
            {!isMobile && "Dark"}
          </button>
        ) : (
          // Dark is active
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: isMobile ? "7px 10px" : "7px 15px 7px 12px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #2a7faf 0%, #4FA8D8 55%, #7fc5eb 100%)",
              color: "#060B12",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              boxShadow: "0 0 18px rgba(79,168,216,0.55), 0 2px 8px rgba(79,168,216,0.30)",
              cursor: "default",
              whiteSpace: "nowrap",
            }}
          >
            <Snowflake size={13} strokeWidth={2.5} color="#060B12" />
            {!isMobile && "Dark"}
          </div>
        )}
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
