import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { FrostParticles } from "@/components/FrostParticles";
import { SocialIcons } from "@/components/SocialIcons";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Call, email or visit BFF — Bharat Freeze Dry Foods. Export-grade freeze-dried foods, made in Bharat for the world.",
      },
      { property: "og:title", content: "Contact BFF" },
      { property: "og:description", content: "Get in touch — phone, email, address, socials." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-deep-navy pt-32 pb-16">
        <FrostParticles count={16} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-eyebrow mb-4">Say hi</p>
          <h1 className="text-display text-5xl text-frost-white sm:text-6xl">
            Let's <span className="text-gradient-ice italic font-medium">talk.</span>
          </h1>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
          <a
            href={`tel:${PHONE_TEL}`}
            className="group rounded-2xl border border-white/10 bg-frost p-8 transition-all hover:border-ice-blue/40"
          >
            <Phone className="h-8 w-8 text-ice-blue" />
            <p className="text-eyebrow mt-6">Call us</p>
            <p className="text-display mt-2 text-2xl text-frost-white group-hover:text-ice-blue">
              {PHONE_DISPLAY}
            </p>
            <p className="mt-2 text-sm text-steel-silver">Mon – Sat · 9:30 to 18:30 IST</p>
          </a>
          <a
            href="mailto:hello@bharatfreezedry.com"
            className="group rounded-2xl border border-white/10 bg-frost p-8 transition-all hover:border-ice-blue/40"
          >
            <Mail className="h-8 w-8 text-ice-blue" />
            <p className="text-eyebrow mt-6">Email</p>
            <p className="text-display mt-2 text-xl text-frost-white group-hover:text-ice-blue">
              hello@bharatfreezedry.com
            </p>
            <p className="mt-2 text-sm text-steel-silver">Replies within one business day</p>
          </a>
          <div className="rounded-2xl border border-white/10 bg-frost p-8">
            <MapPin className="h-8 w-8 text-ice-blue" />
            <p className="text-eyebrow mt-6">Facility</p>
            <p className="text-display mt-2 text-xl text-frost-white">
              Bharat Freeze Dry Foods
            </p>
            <p className="mt-2 text-sm text-steel-silver">
              Industrial Area, India · Export-ready
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl px-6">
          <div className="rounded-2xl border border-white/10 bg-frost p-8">
            <p className="text-eyebrow mb-4">Follow along</p>
            <SocialIcons size={22} />
          </div>
        </div>

        {/* Contact form */}
        <div className="mx-auto mt-12 max-w-3xl px-6">
          <form
            className="rounded-2xl border border-white/10 bg-frost p-8"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We'll be in touch soon.");
            }}
          >
            <h2 className="text-display text-3xl text-frost-white">Send a quick message</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Your name"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-frost-white placeholder:text-steel-silver focus:border-ice-blue focus:outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-frost-white placeholder:text-steel-silver focus:border-ice-blue focus:outline-none"
              />
            </div>
            <input
              placeholder="Subject"
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-frost-white placeholder:text-steel-silver focus:border-ice-blue focus:outline-none"
            />
            <textarea
              required
              rows={5}
              placeholder="Tell us more…"
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-frost-white placeholder:text-steel-silver focus:border-ice-blue focus:outline-none"
            />
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-gradient-primary-cta py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-frost transition-transform hover:scale-[1.01]"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
