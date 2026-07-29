import { motion } from "framer-motion";
import { Snowflake, Wind, Droplets, Package } from "lucide-react";

const STEPS = [
  {
    n: "01",
    Icon: Snowflake,
    title: "Flash Freeze",
    body: "Fresh produce is flash-frozen at −5°C inside a sealed vacuum chamber, locking in structure, colour and nutrients at peak freshness.",
  },
  {
    n: "02",
    Icon: Wind,
    title: "Vacuum & Gentle Warmth",
    body: "Air is drawn out; a warm-water jacket supplies just enough heat to trigger sublimation — ice becomes vapour without ever melting.",
  },
  {
    n: "03",
    Icon: Droplets,
    title: "Dehydration",
    body: "Vapour is drawn away, leaving the product fully dehydrated but structurally intact — same shape, same colour, same nutrients.",
  },
  {
    n: "04",
    Icon: Package,
    title: "Seal & Ship",
    body: "Sealed in food-grade packaging. No melting, no bruising, no cold storage — a long shelf life, anywhere in the world.",
  },
];

export function ProcessStrip() {
  return (
    <section className="relative overflow-hidden bg-deep-navy py-16 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-ice-blue/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-eyebrow mb-4">Lyophilization, simply explained</p>
          <h2 className="text-display text-3xl text-frost-white sm:text-4xl md:text-6xl">
            How we <span className="text-gradient-ice">freeze-dry</span>
          </h2>
          <p className="mt-6 text-base text-steel-silver">
            A four-step ritual that pulls water out — and locks freshness in.
          </p>
        </div>

        <div className="mt-12 md:mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-frost p-6"
            >
              <span className="font-mono text-xs font-bold text-ice-blue">{s.n}</span>
              <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-ice-blue/10 text-ice-blue transition-all duration-500 group-hover:bg-ice-blue group-hover:text-deep-navy">
                <s.Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-frost-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-silver">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
