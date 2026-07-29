import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Sparkles, Truck } from "lucide-react";
import facility from "@/assets/facility.jpg";
import indiaMap from "@/assets/india-map.png";
import { FrostParticles } from "@/components/FrostParticles";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Our story: quality sourcing, cold-chain integrity and export standards from India to the world. Founded on one belief — source the best, preserve it forever.",
      },
      { property: "og:title", content: "About BFF — Bharat Freeze Dry Foods" },
      {
        property: "og:description",
        content: "Sourcing the best quality — from Bharat's farms to kitchens across the world.",
      },
    ],
  }),
  component: AboutPage,
});

const HIGHLIGHTS = [
  { Icon: Sparkles, title: "Peak-season sourcing", body: "We buy only when the crop is at its very best. Off-peak? We wait." },
  { Icon: ShieldCheck, title: "Lab-grade QC", body: "Every batch tested for moisture, microbes and nutrient retention." },
  { Icon: Truck, title: "Export-ready", body: "Full documentation, HACCP-aligned facility, container-load capable." },
];

function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-deep-navy pt-24 md:pt-32 pb-16 md:pb-24">
        <FrostParticles count={16} />
        <div className="relative mx-auto max-w-5xl px-4 md:px-6 text-center">
          <p className="text-eyebrow mb-4">Our story</p>
          <h1 className="text-display text-4xl text-frost-white sm:text-5xl md:text-7xl">
            Sourcing the best quality, <br />
            <span className="text-gradient-ice italic font-medium">for you.</span>
          </h1>
          <p className="mx-auto mt-6 md:mt-8 max-w-3xl text-base md:text-lg leading-relaxed text-steel-silver font-medium text-white/90">
            We are preserving India's harvest for the world through advanced freeze-drying technology.
          </p>
          <p className="mx-auto mt-4 md:mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-steel-silver">
            Bharat Freeze Dry Foods brings modern innovation to agriculture. By freezing produce the moment it arrives and drawing every drop of water out under vacuum, we lock in the true colour and nutrients of peak-season crops—creating a lighter, longer-lasting product with zero additives.
          </p>
          <p className="mx-auto mt-4 md:mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-steel-silver">
            Our process is also fundamentally sustainable. By removing water weight and extending shelf life by years, we significantly reduce food waste and completely eliminate the need for energy-intensive cold-chain storage. We make it effortless and eco-friendly to transport India's rich agricultural heritage to international markets.
          </p>
        </div>
      </section>

      {/* Facility */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:gap-12 px-4 md:px-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-2xl border border-white/10"
          >
            <img src={facility} alt="Our freeze-drying facility" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent" />
          </motion.div>
          <div>
            <p className="text-eyebrow mb-4 mt-8 lg:mt-0">Inside the facility</p>
            <h2 className="text-display text-3xl text-frost-white sm:text-4xl md:text-5xl">
              A cold chain that never breaks.
            </h2>
            <p className="mt-6 leading-relaxed text-steel-silver">
              Stainless-steel vacuum chambers. Warm-water jackets calibrated to the tenth of a
              degree. QC labs testing every batch. Cleanroom protocols from start to seal. This
              is what export-grade actually looks like.
            </p>
            <div className="mt-8 space-y-4">
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ice-blue/10 text-ice-blue">
                    <h.Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-frost-white">{h.title}</h3>
                    <p className="mt-1 text-sm text-steel-silver">{h.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="border-y border-white/5 bg-deep-navy py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary-cta shadow-frost"
          >
            <MapPin className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-display mt-6 text-3xl text-frost-white sm:text-4xl">
            Made in Bharat, shipped worldwide.
          </h2>
          <p className="mt-4 text-steel-silver">
            Facility located in India · export-ready, container-load capable.
          </p>
          <div className="mt-12 flex justify-center w-full">
            <div className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-ice-blue/5 p-4 md:p-8 backdrop-blur-md transition-all duration-700 hover:border-ice-blue/30 hover:bg-ice-blue/10">
              <div className="absolute inset-0 bg-gradient-to-t from-ice-blue/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <img
                src={indiaMap}
                alt="Bharat Freeze Dry Foods processing centers across India"
                className="relative z-10 mx-auto max-h-[600px] w-auto object-contain drop-shadow-[0_0_30px_rgba(118,202,255,0.3)] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
