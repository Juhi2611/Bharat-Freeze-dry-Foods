import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme-context";
import PrivateLabelLight from "@/components/light/PrivateLabel.jsx";
import { Wind, Sparkles } from "lucide-react";
import { FrostParticles } from "@/components/FrostParticles";

export const Route = createFileRoute("/private-label")({
  head: () => ({
    meta: [
      { title: "Private Label — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Launch your own freeze-dried food brand with BFF. Custom formulations, branded packaging, MOQ from 500kg. FSSAI & ISO 22000 certified manufacturing.",
      },
    ],
  }),
  component: PrivateLabelPage,
});

function PrivateLabelPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (isLight) {
    return (
      <main>
        <section style={{ position: 'relative', padding: '140px 0 100px', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, #081A0C 0%, #0D2314 50%, #0A1A0A 100%)' }}>
          <video autoPlay muted loop playsInline preload="metadata" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '85% center', opacity: 0.70 }}>
            <source src="/videos/private_label_bg.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(5,15,8,0.12)', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 10, paddingLeft: 'max(20px, 4vw)', maxWidth: '840px' }}>
            <div className="hero-label-anim" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(139,195,74,0.15)', border: '1px solid rgba(139,195,74,0.3)', borderRadius: '9999px', marginBottom: '36px' }}>
              <Wind size={13} color="#8BC34A" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C5E1A5' }}>OEM &amp; White Label Solutions</span>
            </div>
            <h1 className="hero-h1-anim" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 7vw, 108px)', lineHeight: 1.02, letterSpacing: '-0.04em', color: 'white', marginBottom: '28px' }}>
              Your Brand&apos;s{' '}
              <span style={{ background: 'linear-gradient(135deg, #8BC34A 0%, #C5E1A5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>BFF.</span>
            </h1>
            <p className="hero-p-anim" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.8vw, 21px)', fontWeight: 300, lineHeight: 1.72, color: 'rgba(255,255,255,0.70)', maxWidth: '600px', marginBottom: '44px' }}>
              Built by us. Branded by you. Turnkey manufacturing infrastructure at your command.
            </p>
            <div className="hero-btns-anim" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <a href="#journey" className="btn btn-primary">Start Your Brand</a>
            </div>
          </div>
        </section>
        <PrivateLabelLight />
      </main>
    );
  }

  // Dark theme — identical layout, content, positioning, logic & packaging configurator
  return (
    <main>
      <section className="relative overflow-hidden bg-deep-navy pt-32 pb-20">
        <FrostParticles count={18} />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ice-blue/30 bg-ice-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ice-blue">
            <Sparkles className="h-3.5 w-3.5" /> OEM &amp; White Label Solutions
          </div>
          <h1 className="text-display text-5xl font-black text-frost-white sm:text-6xl md:text-7xl">
            Your Brand&apos;s{" "}
            <span className="text-gradient-ice italic font-medium">BFF.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-steel-silver sm:text-lg">
            Built by us. Branded by you. Turnkey manufacturing infrastructure at your command.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#journey"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '15px',
                background: 'linear-gradient(135deg, #1565C0 0%, #4FA8D8 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(79, 168, 216, 0.35)',
                transition: 'all 0.3s ease',
              }}
            >
              Start Your Brand
            </a>
          </div>
        </div>
      </section>

      {/* Identical Private Label configurator, journey, categories, FAQs, and RFQ form */}
      <PrivateLabelLight />
    </main>
  );
}
