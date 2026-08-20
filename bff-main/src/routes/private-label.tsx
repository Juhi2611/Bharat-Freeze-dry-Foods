import { createFileRoute } from "@tanstack/react-router";
import { PrivateLabelDark } from "@/components/PrivateLabelDark";

export const Route = createFileRoute("/private-label")({
  head: () => ({
    meta: [
      { title: "Private Label — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Launch your own freeze-dried food brand with BFF. Custom formulations, branded packaging, MOQ from 500kg. FSSAI & ISO 22000 certified manufacturing.",
      },
    ],
  }),
  component: PrivateLabelPage,
});

function PrivateLabelPage() {
  return <PrivateLabelDark />;
}
