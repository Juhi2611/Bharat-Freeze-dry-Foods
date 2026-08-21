import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import Tilt from "react-parallax-tilt";
import { FrostParticles } from "./FrostParticles";

// Files live in the `public` folder, so these are just plain URL strings —
// no bundler import, so a missing file never crashes the dev server/build.
const HERO_VIDEO_SRC = "/bff-hero.mp4";
const HERO_POSTER_SRC = "/bff-hero-poster.jpg";

function TypedText({
  text,
  className = "",
  startDelay = 0,
  speed = 55,
}: {
  text: string;
  className?: string;
  startDelay?: number;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, startDelay, speed]);

  return (
    <span className={className}>
      {displayed}
      <span
        className={`ml-1 inline-block w-[3px] translate-y-[3px] bg-ice-blue ${
          done ? "animate-pulse" : ""
        }`}
        style={{ height: "0.85em" }}
        aria-hidden
      />
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-deep-navy">
      {/* Video background */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src={HERO_VIDEO_SRC}
        poster={HERO_POSTER_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={(e) => {
          console.error("Hero video failed to load:", HERO_VIDEO_SRC, e);
        }}
        onCanPlay={() => {
          console.log("Hero video loaded fine and can play:", HERO_VIDEO_SRC);
        }}
      />
      <img
        src={HERO_POSTER_SRC}
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
        aria-hidden
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-deep-navy/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy/60 via-deep-navy/30 to-deep-navy" />

      <FrostParticles count={30} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 md:px-6 pt-16 md:pt-24 text-center">
        <div className="max-w-3xl lg:max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-eyebrow mb-4 md:mb-6 text-xs md:text-sm"
        >
          Frozen at the peak · Preserved for life
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="text-display text-4xl text-frost-white sm:text-5xl md:text-7xl leading-tight"
        >
          The Finest Quality, <br />
          <TypedText
            text="Sourced For You."
            className="text-gradient-ice italic font-medium mt-2 block md:inline md:mt-0"
            startDelay={900}
            speed={55}
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-6 md:mt-8 max-w-2xl mx-auto text-sm leading-relaxed text-steel-silver sm:text-lg px-2 md:px-0"
        >
          Real fruits, vegetables, gravies & more — freeze-dried the moment they're
          ripest, with nothing added and nothing lost.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mx-auto mt-8 md:mt-10 flex w-full md:w-fit flex-col items-center justify-center gap-3 sm:flex-row px-4 md:px-0"
        >
          <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.2} glareColor="#ffffff" className="w-full sm:w-auto">
            <Link
              to="/products"
              search={{ category: undefined }}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-primary-cta px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-semibold uppercase tracking-widest text-white shadow-frost transition-transform hover:scale-[1.02]"
            >
              Explore Products
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Tilt>
          <Link
            to="/contact"
            className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-semibold uppercase tracking-widest text-frost-white backdrop-blur-md transition-all hover:border-ice-blue hover:bg-white/10 sm:w-auto"
          >
            Get in Touch
          </Link>
        </motion.div>

        {/* Tagline below hero video area */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mx-auto mt-12 md:mt-16 w-full max-w-md text-center text-sm md:text-lg italic tracking-wide text-frost-white/70 sm:text-xl"
        >
          From Bharat, fresh to the world.
        </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2, duration: 1 }, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-frost-white/60"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
