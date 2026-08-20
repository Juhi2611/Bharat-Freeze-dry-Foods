import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { B2BStrip } from "@/components/B2BStrip";
import { WhyBFFDark } from "@/components/WhyBFFDark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BFF — Bharat Freeze Dried Foods | Export-Grade Freeze Dried Products" },
      {
        name: "description",
        content:
          "Bharat Freeze Dried Foods: 200+ freeze-dried products including fruits, vegetables, gravies, spices, superfoods, and pet food. Preserved with zero cold chain.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <div>
      {/* 1. Restored Previous Dark Hero */}
      <Hero />

      {/* 2. Restored Previous Dark Categories ("Every category, frozen at the peak.") */}
      <Categories />

      {/* 3. Restored Previous Dark B2BStrip ("Exporting From Bharat To The World") */}
      <B2BStrip />

      {/* 4. Nature's BFF (Synchronized 1:1 with Light Theme content & interactive structure) */}
      <WhyBFFDark />
    </div>
  );
}
