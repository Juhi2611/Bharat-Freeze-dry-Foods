import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import { FrostParticles } from "./FrostParticles";
import { PHONE_DISPLAY, PHONE_TEL, buildWhatsAppLink } from "@/lib/whatsapp";
import { UnifiedFooter } from "./UnifiedFooter";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/pet-foods", label: "Pet Foods" },
  { to: "/b2b", label: "B2B / Export" },
  { to: "/private-label", label: "Private Label" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function TopUtilityBar() {
  return (
    <div className="relative z-40 border-b border-white/5 bg-deep-navy/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6">
        <a
          href={`tel:${PHONE_TEL}`}
          className="flex items-center gap-1.5 font-medium text-frost-white transition-colors hover:text-ice-blue"
        >
          <Phone className="h-3.5 w-3.5" />
          <span className="tracking-wide">{PHONE_DISPLAY}</span>
        </a>
        <div className="hidden items-center gap-4 sm:flex">
          <span className="text-eyebrow !text-[0.6rem] !tracking-[0.24em] text-steel-silver">
            Export-grade cold chain
          </span>
          <SocialIcons size={14} />
        </div>
      </div>
    </div>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-nav-glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2">
          <span className="text-display text-2xl text-frost-white transition-transform group-hover:scale-105">
            BFF
          </span>
          <span
            className={`hidden text-[0.6rem] font-medium uppercase tracking-[0.24em] text-steel-silver transition-opacity md:block ${
              scrolled ? "opacity-0" : "opacity-100"
            }`}
          >
            Bharat Freeze Dry Foods
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex pr-36">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="group relative text-sm font-medium text-frost-white/80 transition-colors hover:text-ice-blue"
              activeProps={{ className: "!text-ice-blue" }}
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-ice-blue transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="relative rounded-full p-2 text-frost-white transition-all md:hidden"
          aria-label="Menu"
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
            className={`transition-all ${open ? "drop-shadow-[0_0_8px_rgba(118,202,255,0.8)] text-ice-blue" : "text-frost-white hover:text-ice-blue"}`}
          >
            <Menu className="h-6 w-6" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden md:hidden"
            initial={{ 
              clipPath: "circle(0% at calc(100% - 32px) 32px)", 
              opacity: 0, 
              backgroundColor: "rgba(7, 17, 29, 0)" 
            }}
            animate={{ 
              clipPath: "circle(150% at calc(100% - 32px) 32px)", 
              opacity: 1, 
              backgroundColor: "rgba(7, 17, 29, 0.75)" 
            }}
            exit={{ 
              clipPath: "circle(0% at calc(100% - 32px) 32px)", 
              opacity: 0, 
              backgroundColor: "rgba(7, 17, 29, 0)",
              transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] }
            }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            style={{ backdropFilter: "blur(24px) saturate(1.2)" }}
          >
            {/* Ambient particles for icy atmosphere */}
            <div className="absolute inset-0 z-0">
              <FrostParticles count={15} />
            </div>

            {/* Subtle icy vignette overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(7,17,29,0.3)_100%)]" />
            
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                <span className="text-display text-2xl text-frost-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">BFF</span>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-frost-white/60 transition-colors hover:text-white"
                  aria-label="Close Menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex flex-1 flex-col items-start justify-center gap-8 pl-8 pr-6 pb-20">
                {NAV.map((n, i) => (
                  <motion.div
                    key={n.to}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4, delay: (NAV.length - 1 - i) * 0.05 } }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  >
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className="group relative flex text-[28px] font-medium tracking-wide text-white transition-all hover:text-ice-blue hover:drop-shadow-[0_0_12px_rgba(118,202,255,0.6)]"
                      activeProps={{ className: "!text-ice-blue !drop-shadow-[0_0_8px_rgba(118,202,255,0.4)]" }}
                    >
                      {n.label}
                      <span className="absolute -left-4 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-ice-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function WhatsAppFloat({ productName }: { productName?: string }) {
  return (
    <a
      href={buildWhatsAppLink(productName)}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.406-.545-.489-1.09-1.229-1.502-1.836-.234-.346-.05-.554.155-.775.194-.207.395-.427.575-.665.056-.083.109-.184.115-.264.006-.081-.033-.259-.086-.361-.207-.415-.727-1.484-.899-1.898-.126-.323-.276-.409-.526-.409h-.446c-.096.001-.243.02-.32.028-.373.106-.789.545-.987.86-.322.517-.599 1.181-.599 1.802 0 .186.024.362.055.535.06.373.15.735.312 1.056.371.746.87 1.398 1.474 1.933 1.155 1.026 2.596 1.703 4.023 1.976.184.036.383.058.582.06.371.005 1.087-.164 1.371-.4.294-.242.532-.618.66-.98.088-.246.196-.634.161-.849-.041-.257-.286-.4-.583-.552l-.32-.145z" />
        <path d="M16 3a13 13 0 0 0-10.99 19.94L4 29l6.24-1.02A13 13 0 1 0 16 3zm0 23.7c-1.9 0-3.72-.54-5.29-1.5l-.38-.22-3.7.6.62-3.6-.25-.4A10.6 10.6 0 1 1 16 26.7z" />
      </svg>
    </a>
  );
}

export function SiteFooter() {
  return <UnifiedFooter />;
}
