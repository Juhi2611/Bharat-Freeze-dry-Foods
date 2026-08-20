import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin, ShieldCheck, Sparkles, Truck, Sprout, Snowflake,
  Droplets, CalendarCheck, RefreshCw, BarChart2,
  CheckCircle2, XCircle, Leaf, Wind, PlaneTakeoff, Dumbbell,
  Baby, Briefcase, Mountain, ShieldAlert, FlaskConical, Package, Globe, Factory,
} from "lucide-react";
import facility from "@/assets/facility.jpg";
import indiaMap from "@/assets/india-map.png";
import { FrostParticles } from "@/components/FrostParticles";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Our story: quality sourcing, cold-chain integrity and export standards from India to the world. Founded on one belief — source the best, preserve it forever.",
      },
    ],
  }),
  component: AboutPage,
});

/* ─── Data ──────────────────────────────────────────────── */
const HIGHLIGHTS = [
  { Icon: Sparkles, title: "Peak-season sourcing", body: "We buy only when the crop is at its very best. Off-peak? We wait." },
  { Icon: ShieldCheck, title: "Lab-grade QC", body: "Every batch tested for moisture, microbes and nutrient retention." },
  { Icon: Truck, title: "Export-ready", body: "Full documentation, HACCP-aligned facility, container-load capable." },
];

const scrollSteps = [
  { video: "/videos/farm2freeze_1.mp4", tag: "Sourcing Strength", title: "Premium Raw Materials", desc: "Sourced from the fertile agricultural belts of Madhya Pradesh. We procure fresh onion, garlic, tomato, potato, fruits, and herbs directly from farm gates at peak harvest." },
  { video: "/videos/farm2freeze_2.mp4", tag: "−50°C Flash", title: "Rapid Freezing at −50°C", desc: "Flash-freezing locks the cell structure, preserving organic properties, colour, and taste without structural cell wall damage." },
  { video: "/videos/farm2freeze_3.mp4", tag: "Vacuum Sublimation", title: "Vacuum Lyophilization", desc: "Frozen products enter the vacuum chamber. Low pressure allows water to sublimate directly from ice to vapour without a liquid phase." },
  { video: "/videos/farm2freeze_4.mp4", tag: "Core Phase", title: "Sublimation Extraction", desc: "Gentle heat is applied under strict vacuum to remove moisture while maintaining structural integrity and shape." },
  { video: "/videos/farm2freeze_5.mp4", tag: "Moisture < 4%", title: "Moisture Control Check", desc: "Moisture is reduced below the critical 4% threshold, ensuring complete microbiological stability and ambient storage suitability." },
  { video: "/videos/farm2freeze_6.mp4", tag: "Industrial Sealing", title: "Protective Barrier Packaging", desc: "Hermetically sealed in multi-layer barrier foil with nitrogen flushing to isolate the product from oxygen and moisture." },
  { video: "/videos/farm2freeze_7.mp4", tag: "No Cold Chain", title: "24-Month Ambient Shelf Life", desc: "Achieves extended stability without chemical preservatives, cold chain infrastructure, or temperature-controlled warehousing." },
  { video: "/videos/farm2freeze_8.mp4", tag: "Global Delivery", title: "Ready for Global Supply Chains", desc: "Lightweight format drastically reduces freight costs while enabling efficient international shipping and institutional integration." },
];

const techPillars = [
  { Icon: Droplets, title: "Low Moisture", desc: "Moisture is reduced below 4% to stop microbiological activity while keeping cells intact." },
  { Icon: CalendarCheck, title: "Long Shelf Life", desc: "18 to 24 months stability in standard conditions, protecting inventory from seasonal price spikes." },
  { Icon: BarChart2, title: "Lightweight Payload", desc: "Water weight is removed, lowering dry freight costs and improving logistics efficiency." },
  { Icon: RefreshCw, title: "Quick Rehydration", desc: "Reconstitutes to original state within minutes when exposed to warm water or cooking bases." },
  { Icon: ShieldCheck, title: "Clean Label Purity", desc: "Pure single-ingredient options with absolutely no added salt, chemical preservatives, or carriers." },
  { Icon: Snowflake, title: "No Refrigeration", desc: "Enables global shipping and ambient distribution without dependence on cold chain networks." },
];

const compareLeft = [
  "Requires continuous cold chain logistics",
  "High risk of temperature abuse and spoilage",
  "Cellular damage and water leakage upon thawing",
  "Shortened shelf life, typically 6-12 months max",
  "High transport costs due to shipping raw water weight",
  "Demands expensive cold-storage warehousing",
];

const compareRight = [
  "Zero cold chain requirement at any point",
  "Ambient stability removes storage spoilage risk",
  "Retains original shape, colour, and 97% nutrition",
  "Guaranteed 18-24 months ambient shelf life",
  "Up to 90% lighter, reducing shipping emissions",
  "Standard dry warehouse storage is sufficient",
];

const useCases = [
  { Icon: PlaneTakeoff, title: 'Travel & Adventures', desc: 'Lightweight nutrition for long journeys. No refrigeration, no compromise.', color: '#76caff' },
  { Icon: Dumbbell, title: 'Fitness & Sports', desc: 'Clean protein, superfoods, and energy for peak performance.', color: '#4ade80' },
  { Icon: Baby, title: 'Kids & Family', desc: 'Nutrient-dense, preservative-free snacks children actually love.', color: '#fb923c' },
  { Icon: Briefcase, title: 'Office Snacking', desc: 'Healthy, crunchy snacks that fuel focus and productivity.', color: '#c084fc' },
  { Icon: Mountain, title: 'Trekking & Camping', desc: 'Emergency nutrition with 5-year shelf life. Pack light, eat right.', color: '#a3e635' },
  { Icon: ShieldAlert, title: 'Emergency Food', desc: 'Disaster-ready nutrition that requires only water to rehydrate.', color: '#f87171' },
];

const qualityBadges = [
  { Icon: Factory, label: 'Food Grade Facility', desc: 'GMP-certified clean-room production', color: '#76caff' },
  { Icon: Leaf, label: 'Premium Ingredients', desc: 'Farm-sourced, 100% natural inputs', color: '#4ade80' },
  { Icon: FlaskConical, label: 'Strict QC', desc: 'Multi-point laboratory testing', color: '#c084fc' },
  { Icon: Package, label: 'Vacuum Packed', desc: 'Hermetic sealing for maximum freshness', color: '#fb923c' },
  { Icon: ShieldCheck, label: 'No Preservatives', desc: 'Zero artificial additives, ever', color: '#f87171' },
  { Icon: Globe, label: 'Export Standards', desc: 'Meets EU, US, and international norms', color: '#22d3ee' },
];

/* ─── Farm-to-Freeze Step Card ─────────────────────────── */
function StepCard({ step, index }: { step: typeof scrollSteps[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={`group relative grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl border transition-all duration-700 ${
        inView ? "border-ice-blue/30 shadow-frost" : "border-white/8"
      }`}
      style={{ background: "rgba(6,10,15,0.85)", backdropFilter: "blur(24px)" }}
    >
      {/* Video side */}
      <div className={`relative overflow-hidden ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`} style={{ minHeight: "360px" }}>
        <video
          ref={videoRef}
          src={step.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#060a0f]/30" />
        <div className="absolute top-6 left-6 text-7xl font-black text-ice-blue/20 select-none">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Text side */}
      <div className={`flex flex-col justify-center p-8 md:p-12 ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
        <div
          className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
          style={{ background: "rgba(118,202,255,0.12)", color: "#76caff", border: "1px solid rgba(118,202,255,0.25)" }}
        >
          Step {String(index + 1).padStart(2, "0")} — {step.tag}
        </div>
        <h3 className="text-display text-2xl text-frost-white sm:text-3xl mb-4">{step.title}</h3>
        <p className="text-steel-silver leading-relaxed text-sm md:text-base">{step.desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Farm-to-Freeze Section ────────────────────────────── */
function FarmToFreeze() {
  return (
    <section style={{ background: "#060a0f", padding: "80px 0" }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <p className="text-eyebrow mb-4">Our Process</p>
          <h2 className="text-display text-3xl text-frost-white sm:text-5xl">
            From Farm to{" "}
            <span className="text-gradient-ice italic font-medium">Freeze.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-steel-silver text-base md:text-lg">
            Eight precisely controlled steps that transform fresh produce into nature&apos;s most perfectly preserved food.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {scrollSteps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Human Nutrition & Quality Section ─────────────────── */
function HumanNutritionSection() {
  return (
    <>
      {/* Human Nutrition Use Cases */}
      <section className="bg-background py-20 md:py-28" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="text-eyebrow mb-4">Human Nutrition</p>
            <h2 className="text-display text-3xl text-frost-white sm:text-5xl">
              Your Everyday <span className="text-gradient-ice italic font-medium">BFF.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-steel-silver text-base md:text-lg">
              The Traveler&apos;s BFF. The Fitness BFF. The Family&apos;s BFF. Wherever life takes you — we&apos;ve got your nutrition covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map(({ Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-card/60 p-7 backdrop-blur-xl transition-all duration-500 hover:border-ice-blue/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-frost-white mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-steel-silver leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Retailer's Banner */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-deep-navy via-card to-deep-navy p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-display text-2xl sm:text-4xl text-frost-white mb-2">Retailer&apos;s BFF.</h3>
              <p className="text-steel-silver text-sm md:text-base max-w-md">
                Stock premium freeze-dried products that your customers will love. High margins, long shelf life, zero refrigeration costs.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="rounded-full bg-gradient-primary-cta px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost">
                Get Retail Catalog
              </Link>
              <a href="https://wa.me/919993377038" target="_blank" rel="noopener noreferrer" className="rounded-full border border-green-500/40 bg-green-950/40 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-green-400">
                WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="bg-deep-navy py-20 md:py-28" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="text-eyebrow mb-4">Quality Assurance</p>
            <h2 className="text-display text-3xl text-frost-white sm:text-5xl">
              Quality is Our <span className="text-gradient-ice italic font-medium">Standard.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-steel-silver text-base">Every batch. Every product. Every time.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {qualityBadges.map(({ Icon, label, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center text-center rounded-2xl border border-white/8 bg-card/50 p-6 backdrop-blur-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border" style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-frost-white text-sm mb-1">{label}</h3>
                <p className="text-xs text-steel-silver leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Facility Tour Banner */}
          <div className="mt-12 relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 h-80 flex items-center p-8 md:p-12">
            <img src="/images/quality_facility.png" alt="BFF Quality Facility" className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="relative z-10 max-w-md">
              <h3 className="text-display text-2xl md:text-4xl text-frost-white mb-3">State-of-the-Art Facility</h3>
              <p className="text-steel-silver text-sm mb-6 leading-relaxed">
                GMP-certified, food-grade manufacturing with precision temperature and humidity control at every stage.
              </p>
              <Link to="/contact" className="inline-block rounded-full bg-gradient-primary-cta px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-frost">
                Request Facility Tour
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Main About Page ───────────────────────────────────── */
function AboutPage() {
  return (
    <div>
      {/* Video Hero */}
      <section className="relative overflow-hidden bg-deep-navy pt-24 md:pt-32 pb-16 md:pb-24">
        <video autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-60">
          <source src="/videos/farm_to_freeze_bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <FrostParticles count={16} />
        
        <div className="relative mx-auto max-w-5xl px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ice-blue/30 bg-ice-blue/15 px-4 py-1.5 backdrop-blur-md mb-8">
            <Wind className="h-3.5 w-3.5 text-ice-blue" />
            <span className="text-xs font-bold uppercase tracking-widest text-frost-white">Our Story &amp; Science</span>
          </div>

          <h1 className="text-display text-4xl text-frost-white sm:text-5xl md:text-7xl font-black mb-6">
            From Farm to{" "}
            <span className="text-gradient-ice italic font-medium">Freeze.</span>
          </h1>
          <p className="mx-auto max-w-3xl text-base md:text-xl text-steel-silver font-light leading-relaxed">
            The science behind Bharat Freeze Dried Foods — and why lyophilization is the future of food preservation.
          </p>
        </div>
      </section>

      {/* Story / Corporate Sourcing */}
      <section className="bg-background py-16 md:py-24" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-eyebrow mb-4">Agri-Processing Platform</p>
            <h2 className="text-display text-3xl text-frost-white sm:text-5xl">
              Corporate Sourcing &amp;{" "}
              <span className="text-gradient-ice italic font-medium">Processing Power.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-steel-silver leading-relaxed mb-5 text-sm sm:text-base">
                Bharat Freeze-Dried Foods is building a modern food-processing venture strategically located in Madhya Pradesh, India. This central hub places our facility close to the core agricultural belts of central India, ensuring quick transit from harvesting fields to freeze-drying chambers.
              </p>
              <p className="text-steel-silver leading-relaxed text-sm sm:text-base">
                Our location guarantees direct access to premium onion, garlic, potato, tomato, regional fruits, and herbs. Sourcing directly at harvest allows us to maintain strict raw material standards and deliver high-retention food technology for modern global supply chains.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-card/60 p-8 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-frost-white mb-5">Agri-Sourcing Highlights</h3>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Local Raw Material Sourcing:", text: "Direct links with grower networks across Malwa and central agri-zones." },
                  { label: "Industrial Competence:", text: "Designed as a heavy commercial partner for global food brands, seasoning companies, and institutional buyers." },
                  { label: "Location Advantage:", text: "Lower logistics transit time helps retain natural colour, aroma, and structural integrity." },
                ].map(({ label, text }, i) => (
                  <li key={i} className="text-xs sm:text-sm text-steel-silver leading-relaxed">
                    <strong className="text-frost-white">{label}</strong> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Farm-to-Freeze Stepper */}
      <FarmToFreeze />

      {/* Tech Pillars */}
      <section className="bg-background py-20 md:py-28" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="text-eyebrow mb-4">Technology &amp; Credibility</p>
            <h2 className="text-display text-3xl text-frost-white sm:text-5xl">
              Advanced Lyophilization{" "}
              <span className="text-gradient-ice italic font-medium">Capabilities.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-steel-silver text-base md:text-lg">
              Freeze-drying removes moisture under low temperature and vacuum, retaining natural colour, flavour, aroma, nutrition, and cell structure.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techPillars.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-card/60 p-7 backdrop-blur-xl transition-all duration-500 hover:border-ice-blue/40"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-ice-blue/10 text-ice-blue border border-ice-blue/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-frost-white mb-2">{title}</h3>
                <p className="text-sm text-steel-silver leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-deep-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="text-eyebrow mb-4">Science Meets Food</p>
            <h2 className="text-display text-3xl text-frost-white sm:text-5xl">
              Why Freeze Drying{" "}
              <span className="text-gradient-ice italic font-medium">Wins.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Traditional Frozen */}
            <div className="rounded-2xl border border-white/8 bg-card/50 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <Snowflake className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-300">Traditional Frozen</h3>
              </div>
              {compareLeft.map((text, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-steel-silver leading-relaxed">{text}</span>
                </div>
              ))}
            </div>

            {/* Freeze Dried */}
            <div className="relative rounded-2xl border-2 border-ice-blue/30 bg-card/60 p-8 backdrop-blur-xl shadow-frost">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary-cta px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost whitespace-nowrap">
                Superior Choice
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ice-blue/10 border border-ice-blue/20">
                  <Leaf className="h-6 w-6 text-ice-blue" />
                </div>
                <h3 className="text-xl font-bold text-ice-blue">Freeze Dried — BFF</h3>
              </div>
              {compareRight.map((text, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 p-3 rounded-xl bg-ice-blue/5 border border-ice-blue/10">
                  <CheckCircle2 className="h-4 w-4 text-ice-blue mt-0.5 shrink-0" />
                  <span className="text-sm text-frost-white leading-relaxed font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Human Nutrition & Quality */}
      <HumanNutritionSection />
    </div>
  );
}
