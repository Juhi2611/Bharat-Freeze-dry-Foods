import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString() + suffix);
  useEffect(() => {
    if (inView) animate(mv, to, { duration: 1.8, ease: "easeOut" });
  }, [inView, mv, to]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const STATS = [
  { value: 24, suffix: "mo", label: "Shelf life" },
  { value: 98, suffix: "%", label: "Nutrient retention" },
  { value: 0, suffix: "", label: "Additives · ever" },
  { value: 32, suffix: "+", label: "Export markets" },
];

export function TrustStats() {
  return (
    <section className="border-y border-white/5 bg-background py-10 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:gap-8 px-4 md:px-6 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-display text-4xl text-gradient-ice sm:text-5xl md:text-6xl">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-steel-silver">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
