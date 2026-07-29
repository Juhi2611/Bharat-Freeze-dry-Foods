import { createFileRoute } from "@tanstack/react-router";
import { B2BHero } from "@/components/B2BHero";
import { B2BEnquiryForm } from "@/components/B2BEnquiryForm";
import { B2BIndustries } from "@/components/B2BIndustries";

export const Route = createFileRoute("/b2b")({
  head: () => ({
    meta: [
      { title: "B2B & Export — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Global bulk supply, HoReCa, export-grade and private-label freeze-dried foods. Container-load capable, full export documentation, cold-chain-free logistics.",
      },
      { property: "og:title", content: "B2B & Export — BFF" },
      {
        property: "og:description",
        content: "Bulk, HoReCa, export & white-label. Container-load capable.",
      },
    ],
  }),
  component: B2BPage,
});

function B2BPage() {
  return (
    <div className="relative min-h-screen bg-background text-frost-white">
      {/* 1. Hero Section (Keep Existing Video) */}
      <B2BHero />

      {/* 2. Premium B2B Enquiry Form */}
      <B2BEnquiryForm />

      {/* 3. The Industries We Serve */}
      <B2BIndustries />
    </div>
  );
}
