import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ProcessStrip } from "@/components/ProcessStrip";
import { Categories } from "@/components/Categories";
import { B2BStrip } from "@/components/B2BStrip";
import { TrustStats } from "@/components/TrustStats";
import { CTABanner } from "@/components/CTABanner";
import { FrozenEdgeIndicator } from "@/components/FrozenEdgeIndicator";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <FrozenEdgeIndicator />
      <Hero />
      <ProcessStrip />
      <Categories />
      <B2BStrip />
      <TrustStats />
      <CTABanner />
    </>
  );
}
