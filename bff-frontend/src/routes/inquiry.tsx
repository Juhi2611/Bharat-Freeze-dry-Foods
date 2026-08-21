import { createFileRoute } from "@tanstack/react-router";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { FrostParticles } from "@/components/FrostParticles";

export const Route = createFileRoute("/inquiry")({
  head: () => ({
    meta: [
      { title: "Inquiry — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Send a bulk, retail or white-label inquiry. Fill the form, or chat instantly on WhatsApp.",
      },
      { property: "og:title", content: "Inquiry — BFF" },
      { property: "og:description", content: "Bulk, retail, white-label — start a conversation." },
    ],
  }),
  component: InquiryPage,
});

function InquiryPage() {
  // Placeholder Google Form URL — swap once real form exists.
  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSf_placeholderplaceholderplaceholderplaceholder/viewform?embedded=true";

  return (
    <div>
      <section className="relative overflow-hidden bg-deep-navy pt-24 md:pt-32 pb-12 md:pb-16">
        <FrostParticles count={16} />
        <div className="relative mx-auto max-w-4xl px-4 md:px-6 text-center">
          <p className="text-eyebrow mb-4">Get in touch</p>
          <h1 className="text-display text-4xl text-frost-white sm:text-5xl md:text-6xl">
            Send an <span className="text-gradient-ice">inquiry.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-steel-silver">
            Tell us what you need — retail, bulk, HoReCa, export or white-label. We'll respond
            within one business day. Prefer chat? WhatsApp is always faster.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:gap-8 px-4 md:px-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-frost p-4">
              <iframe
                src={FORM_URL}
                width="100%"
                height="900"
                title="BFF Inquiry Form"
                className="rounded-xl bg-white"
                style={{ minHeight: 700 }}
              >
                Loading form…
              </iframe>
              <p className="mt-3 px-2 text-center text-xs text-steel-silver">
                Form powered by Google Forms · replace embed URL with your live form.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer noopener"
              className="block rounded-2xl bg-[#25D366] p-6 text-white transition-transform hover:scale-[1.02]"
            >
              <p className="text-eyebrow !text-white/80">Fastest reply</p>
              <h3 className="text-display mt-2 text-2xl">WhatsApp us</h3>
              <p className="mt-2 text-sm text-white/90">
                Live chat with a real human. Pre-filled inquiry template opens instantly.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest">Open chat →</p>
            </a>
            <div className="rounded-2xl border border-white/10 bg-frost p-6">
              <p className="text-eyebrow mb-3">You can ask about</p>
              <ul className="space-y-2 text-sm text-steel-silver">
                <li>· Retail pricing & wholesale rates</li>
                <li>· Sample packs</li>
                <li>· HoReCa & bulk contracts</li>
                <li>· White-label MOQs</li>
                <li>· Export documentation</li>
                <li>· Custom SKUs & flavours</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
