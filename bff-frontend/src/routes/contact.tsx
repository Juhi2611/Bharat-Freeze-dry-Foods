import { createFileRoute } from "@tanstack/react-router";
import { Wind } from "lucide-react";
import { FrostParticles } from "@/components/FrostParticles";
import { useTheme } from "@/lib/theme-context";
import ContactLight from "@/components/light/Contact.jsx";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Call, email or visit BFF — Bharat Freeze Dry Foods. Export-grade freeze-dried foods, made in Bharat for the world.",
      },
      { property: "og:title", content: "Contact BFF" },
      { property: "og:description", content: "Get in touch — phone, email, address, socials." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { theme } = useTheme();

  if (theme === "light") {
    return (
      <main>
        {/* Light hero */}
        <section style={{ position: 'relative', padding: '140px 0 100px', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, #081A0C 0%, #0D2314 50%, #0A1A0A 100%)' }}>
          <video autoPlay muted loop playsInline preload="metadata" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '85% center', opacity: 0.70 }}>
            <source src="/videos/contact_bg.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(5,15,8,0.12)', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 10, paddingLeft: 'max(20px, 4vw)', maxWidth: '840px' }}>
            <div className="hero-label-anim" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(139,195,74,0.15)', border: '1px solid rgba(139,195,74,0.3)', borderRadius: '9999px', marginBottom: '36px' }}>
              <Wind size={13} color="#8BC34A" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C5E1A5' }}>Get in Touch</span>
            </div>
            <h1 className="hero-h1-anim" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 7vw, 108px)', lineHeight: 1.02, letterSpacing: '-0.04em', color: 'white', marginBottom: '28px' }}>
              Let&apos;s Work{' '}
              <span style={{ background: 'linear-gradient(135deg, #8BC34A 0%, #C5E1A5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Together.</span>
            </h1>
            <p className="hero-p-anim" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.8vw, 21px)', fontWeight: 300, lineHeight: 1.72, color: 'rgba(255,255,255,0.70)', maxWidth: '600px' }}>
              Ready to bring premium freeze-dried food to your brand? Our team is here to help.
            </p>
          </div>
        </section>
        {/* Unified contact form + info (same for both themes) */}
        <ContactLight hideHeader={true} />
      </main>
    );
  }

  // Dark theme — same structure, dark hero
  return (
    <div>
      <section className="relative overflow-hidden bg-deep-navy pt-32 pb-16">
        <FrostParticles count={16} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-eyebrow mb-4">Get in Touch</p>
          <h1 className="text-display text-5xl text-frost-white sm:text-6xl">
            Let&apos;s Work{" "}
            <span className="text-gradient-ice italic font-medium">Together.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-steel-silver text-base md:text-lg">
            Ready to bring premium freeze-dried food to your brand? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Shared contact content */}
      <ContactLight hideHeader={true} />
    </div>
  );
}
