import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import exportGlobeVideo from "@/assets/export_b2b_globe.mp4";

export function B2BStrip() {
  return (
    <section className="relative overflow-hidden bg-deep-navy py-12 sm:py-20 md:py-28">
      {/* Background subtle glow effect matching design system */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-ice-blue/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link
            to="/b2b"
            className="group relative block w-full cursor-pointer focus:outline-none"
          >
            {/* Full-screen Height Adjusted Video Showcase */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[72vh] min-h-[400px] sm:min-h-[500px] md:min-h-[620px] overflow-hidden rounded-3xl bg-deep-navy/80 shadow-2xl transition-all duration-500 hover:scale-[1.015] select-none">
              <video
                src={exportGlobeVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                tabIndex={-1}
                aria-hidden="true"
                disablePictureInPicture
                disableRemotePlayback
                onContextMenu={(e) => e.preventDefault()}
                className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
              />

              {/* Subtle top and bottom dark edge gradients for smooth blending */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
            </div>

            {/* Titles and CTA Button Positioned Below the Video */}
            <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center text-center max-w-4xl mx-auto px-2">
              <h2 className="text-display text-3xl sm:text-4xl md:text-6xl font-bold text-frost-white leading-tight">
                Exporting From Bharat To The World
              </h2>

              <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-steel-silver font-medium max-w-2xl leading-relaxed">
                Connecting global businesses with premium freeze-dried foods from India.
              </p>

              {/* Glassmorphism Action Pill Button */}
              <div className="mt-6 sm:mt-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-widest text-frost-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/20">
                <span>Explore B2B Export</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
