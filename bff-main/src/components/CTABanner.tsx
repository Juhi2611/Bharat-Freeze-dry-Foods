import { Link } from "@tanstack/react-router";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { FrostParticles } from "./FrostParticles";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy to-[#0e2137] py-16 sm:py-24">
      <FrostParticles count={20} />
      <div className="relative mx-auto max-w-4xl px-4 md:px-6 text-center">
        <p className="text-eyebrow mb-4">Let's talk</p>
        <h2 className="text-display text-3xl text-frost-white sm:text-4xl md:text-6xl flex flex-col sm:block">
          Ready to bring your idea to <span className="text-gradient-ice">cold-chain life?</span>
        </h2>
        <p className="mt-6 text-lg text-steel-silver">
          Whether it's a single pack or a container load — sourcing, quality control and export
          paperwork are our thing.
        </p>
        <div className="mt-8 md:mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/inquiry"
            className="flex w-full items-center justify-center rounded-full bg-gradient-primary-cta px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-semibold uppercase tracking-widest text-white shadow-frost sm:w-auto"
          >
            Send an inquiry
          </Link>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-semibold uppercase tracking-widest text-frost-white backdrop-blur-md transition-all hover:border-[#25D366] hover:text-[#25D366] sm:w-auto"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
