import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Leaf, Phone, Mail, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const footerLinks: Record<string, { label: string; to: string }[]> = {
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Our Process", to: "/about" },
    { label: "Quality & Science", to: "/about" },
    { label: "Certifications", to: "/b2b" },
    { label: "Contact Us", to: "/contact" },
  ],
  Products: [
    { label: "Freeze Dried Fruits", to: "/products" },
    { label: "Vegetables", to: "/products" },
    { label: "Pre-Cooked Meals", to: "/products" },
    { label: "Spices & Herbs", to: "/products" },
    { label: "Superfood Powders", to: "/products" },
    { label: "Pet Nutrition", to: "/pet-foods" },
  ],
  "Services & B2B": [
    { label: "Private Label OEM", to: "/private-label" },
    { label: "Global B2B / Export", to: "/b2b" },
    { label: "Custom Recipe Blends", to: "/contact" },
    { label: "Bulk Sourcing", to: "/b2b" },
    { label: "Request Samples", to: "/contact" },
  ],
};

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/919993377038",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const bffTaglines = [
  "Fruit's BFF",
  "Chef's BFF",
  "Exporter's BFF",
  "Retailer's BFF",
  "Traveler's BFF",
];

export function UnifiedFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const colors = isDark
    ? {
        bg: "#060b12",
        border: "rgba(255, 255, 255, 0.08)",
        textHeading: "#f0f4ff",
        textBody: "rgba(255, 255, 255, 0.65)",
        textMuted: "rgba(255, 255, 255, 0.4)",
        accent: "#76caff",
        accentGradient: "linear-gradient(135deg, #1565C0, #4FA8D8)",
        tagBg: "rgba(118, 202, 255, 0.10)",
        tagBorder: "rgba(118, 202, 255, 0.25)",
        tagColor: "#76caff",
        inputBg: "rgba(255, 255, 255, 0.06)",
        inputBorder: "rgba(255, 255, 255, 0.14)",
        socialHoverBg: "#1565C0",
      }
    : {
        bg: "#050F08",
        border: "rgba(255, 255, 255, 0.08)",
        textHeading: "#ffffff",
        textBody: "rgba(255, 255, 255, 0.60)",
        textMuted: "rgba(255, 255, 255, 0.35)",
        accent: "#8BC34A",
        accentGradient: "linear-gradient(135deg, #2D7A3A, #8BC34A)",
        tagBg: "rgba(45, 122, 58, 0.15)",
        tagBorder: "rgba(45, 122, 58, 0.28)",
        tagColor: "#8BC34A",
        inputBg: "rgba(255, 255, 255, 0.06)",
        inputBorder: "rgba(255, 255, 255, 0.15)",
        socialHoverBg: "#2D7A3A",
      };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <footer
      style={{
        background: colors.bg,
        color: "#ffffff",
        paddingTop: "80px",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(118, 202, 255, 0.06) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(45, 122, 58, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top Grid */}
        <div
          className="footer-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
            gap: "clamp(32px, 4vw, 56px)",
            paddingBottom: "56px",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          {/* Brand & Info Column */}
          <div>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: colors.accentGradient,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isDark
                    ? "0 4px 16px rgba(118, 202, 255, 0.25)"
                    : "0 4px 16px rgba(45, 122, 58, 0.35)",
                }}
              >
                <Leaf size={22} color="white" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "20px",
                    color: colors.textHeading,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  BFF
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: colors.accent,
                    textTransform: "uppercase",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Bharat Freeze Dry Foods
                </div>
              </div>
            </Link>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13.5px",
                color: colors.textBody,
                lineHeight: 1.7,
                maxWidth: "320px",
                marginBottom: "20px",
              }}
            >
              India&apos;s premier export-grade lyophilization company. Preserving nature&apos;s best with zero cold chain required.
            </p>

            {/* Direct Contact Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              <a
                href="tel:+919993377038"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: colors.textHeading,
                  fontFamily: "var(--font-display)",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = colors.accent)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = colors.textHeading)}
              >
                <Phone size={14} color={colors.accent} /> +91 99933 77038
              </a>
              <a
                href="mailto:exports@bharatfreezedried.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: colors.textBody,
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = colors.accent)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = colors.textBody)}
              >
                <Mail size={14} color={colors.accent} /> exports@bharatfreezedried.com
              </a>
            </div>

            {/* Tagline Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "28px" }}>
              {bffTaglines.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 10px",
                    background: colors.tagBg,
                    border: `1px solid ${colors.tagBorder}`,
                    borderRadius: "9999px",
                    fontFamily: "var(--font-display)",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: colors.tagColor,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.textBody,
                    transition: "all 0.25s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = colors.socialHoverBg;
                    el.style.color = "#ffffff";
                    el.style.borderColor = colors.socialHoverBg;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255, 255, 255, 0.06)";
                    el.style.color = colors.textBody;
                    el.style.borderColor = colors.border;
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "12px",
                  color: colors.textHeading,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                {section}
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "11px", padding: 0, margin: 0, listStyle: "none" }}>
                {links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.to}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13.5px",
                        color: colors.textBody,
                        transition: "color 0.2s ease",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = colors.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = colors.textBody;
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            padding: "36px 0",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "17px",
                color: colors.textHeading,
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Stay Fresh. Stay Updated. <Leaf size={16} color={colors.accent} />
            </h4>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: colors.textMuted, margin: 0 }}>
              New product launches, harvest cycles, and global export intelligence.
            </p>
          </div>

          {newsletterSubscribed ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: colors.accent,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              <CheckCircle2 size={18} /> Subscribed to BFF updates!
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="your@company.com"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "9999px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: "#ffffff",
                  fontFamily: "var(--font-body)",
                  fontSize: "13.5px",
                  outline: "none",
                  minWidth: "240px",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: "12px 24px",
                  fontSize: "13px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Bottom Copyright Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 0 32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12.5px",
              color: colors.textMuted,
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Bharat Freeze Dry Foods Pvt. Ltd. All rights reserved. Made in Bharat, for the world.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Use", "Export Compliance", "Sitemap"].map((item, i) => (
              <button
                key={i}
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: colors.textMuted,
                  transition: "color 0.2s ease",
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = colors.textHeading;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = colors.textMuted;
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 36px !important;
          }
        }
        @media (max-width: 600px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default UnifiedFooter;
