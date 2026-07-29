import b2bHeroVideo from "@/assets/b2b_hero.mp4";
import { motion } from "framer-motion";
import { ArrowDown, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { FrostParticles } from "./FrostParticles";

export function B2BHero() {
  const scrollToForm = () => {
    const el = document.getElementById("enquiry-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[80vh] md:h-[85vh] lg:h-[88vh] min-h-[500px] overflow-hidden bg-deep-navy">
      <video
        className="absolute inset-0 h-full w-full object-cover select-none"
        src={b2bHeroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-deep-navy/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy/70 via-transparent to-deep-navy" />
      <FrostParticles count={20} />

      {/* Content overlay */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md"
        >
          <Globe2 className="h-4 w-4 text-ice-blue animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-frost-white">
            Global Bulk & Export Solutions
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="mt-6 text-display text-4xl text-frost-white sm:text-6xl lg:text-7xl max-w-4xl leading-tight"
        >
          Export-Grade Freeze-Dried Foods, <br />
          <span className="text-gradient-ice italic font-medium">Delivered Worldwide.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-steel-silver"
        >
          Partner with Bharat Freeze Dry Foods for premium, shelf-stable ingredients, private labeling, and full container-load export solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={scrollToForm}
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-primary-cta px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-widest text-white shadow-frost transition-transform hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            Start Export Enquiry
          </button>
          <a
            href="#industries"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-widest text-frost-white backdrop-blur-md transition-all hover:border-ice-blue hover:bg-white/10"
          >
            Industries We Serve
          </a>
        </motion.div>

        {/* Badges preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-steel-silver"
        >
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-ice-blue" /> ISO 22000 & HACCP</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-ice-blue" /> 25+ Export Nations</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-ice-blue" /> Custom Private Label</span>
        </motion.div>

        <button
          onClick={scrollToForm}
          aria-label="Scroll to enquiry form"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-frost-white/60 hover:text-white transition-colors"
        >
          <ArrowDown className="h-6 w-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
}

