import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { B2BStrip } from "@/components/B2BStrip";
import { WhyBFFDark } from "@/components/WhyBFFDark";
import { useTheme } from "@/lib/theme-context";

// Light theme components
import HeroLight from "@/components/light/Hero.jsx";
import HomeFeatureStripLight from "@/components/light/HomeFeatureStrip.jsx";
import CategoryShowcaseLight from "@/components/light/CategoryShowcase.jsx";
import ExportBharatStripLight from "@/components/light/ExportBharatStrip.jsx";
import WhyBFFLight from "@/components/light/WhyBFF.jsx";

export const Route = createFileRoute("/")(  {
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
  const { theme } = useTheme();

  if (theme === "light") {
    return (
      <main>
        <HeroLight />
        <HomeFeatureStripLight />
        <CategoryShowcaseLight />
        <ExportBharatStripLight />
        <WhyBFFLight />
      </main>
    );
  }

  // Dark theme
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
